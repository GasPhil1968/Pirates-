// Testfahrer für M. Adventure: bedient das Spiel ausschließlich über die Oberfläche (echte Maus-/Fingerklicks auf Bildschirmkoordinaten,
// DOM-Knöpfe für Antworten, Inventar und Rätsel). Der Lesezugang window.MADV liefert nur Positionen und Zustände, er verändert nichts.
const { chromium, devices } = require('playwright');

class Driver {
  constructor(page, opt = {}) { this.page = page; this.touch = !!opt.touch; this.log = []; this.errors = []; this.shots = opt.shots || null; this.n = 0; }
  static async launch(opt = {}) {
    const browser = await chromium.launch();
    const ctxOpts = opt.device ? { ...devices[opt.device] } : { viewport: { width: opt.w || 1280, height: opt.h || 800 } };
    const ctx = await browser.newContext(ctxOpts);
    if (!opt.keepStorage) await ctx.addInitScript(() => { try { if (!sessionStorage.getItem('madv.test.init')) { localStorage.clear(); sessionStorage.setItem('madv.test.init', '1'); } localStorage.setItem('madv.v1.settings', JSON.stringify({ textSpeed: 2 })); } catch (e) {} });
    const page = await ctx.newPage();
    const d = new Driver(page, { touch: !!(opt.device && devices[opt.device].hasTouch), shots: opt.shots });
    d.browser = browser; d.ctx = ctx;
    page.on('pageerror', e => d.errors.push('PAGEERROR ' + e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
    page.on('console', m => { if (m.type() === 'error') d.errors.push('console.error ' + m.text()); });
    page.on('requestfailed', r => d.errors.push('REQFAIL ' + r.url()));
    await page.goto(opt.url || 'http://localhost:8822/game/index.html');
    await page.waitForTimeout(900);
    return d;
  }
  async close() { await this.browser.close(); }
  async st() { return this.page.evaluate(() => MADV.state()); }
  async flags() { return this.page.evaluate(() => MADV.flags()); }
  async tap(x, y) { if (this.touch) await this.page.touchscreen.tap(x, y); else await this.page.mouse.click(x, y); }
  async shot(name) { if (!this.shots) return; this.n++; await this.page.screenshot({ path: `${this.shots}/${String(this.n).padStart(3, '0')}_${name}.png` }); }
  // Szene weiterklicken, bis nichts mehr läuft (Antwortliste oder Rätsel beenden das Warten)
  async idle(opt = {}) { const t0 = Date.now(); let lastSpeech = null;
    for (;;) { const s = await this.st();
      if (Date.now() - t0 > (opt.timeout || 60000)) throw new Error('idle timeout ' + JSON.stringify(s));
      if (s.modal === 'card') { await this.page.locator('.card').click(); await this.page.waitForTimeout(450); continue; }
      if (s.modal && s.modal !== 'title') return s;
      if (s.dlg) return s;
      if (s.speech) { if (s.speech !== lastSpeech) { this.log.push(`[${s.who}] ${s.speech}`); lastSpeech = s.speech; } const r = await this.page.evaluate(() => MADV.sceneRect()); await this.tap(r.x + 8, r.y + r.h - 8); await this.page.waitForTimeout(230); continue; }
      if (s.busy || s.walking) { await this.page.waitForTimeout(90); continue; }
      await this.page.waitForTimeout(140); const s2 = await this.st(); if (!s2.busy && !s2.walking && !s2.speech && !s2.dlg && !(s2.modal && s2.modal !== 'title')) return s2; } }
  // Kamera zu einer Weltposition bringen (hingehen, bis die Stelle sichtbar ist)
  async ensureVisible(id) { for (let k = 0; k < 6; k++) { const p = await this.page.evaluate((i) => MADV.hsScreen(i), id); if (!p) throw new Error('Stelle nicht sichtbar/vorhanden: ' + id); if (p.inView) return p;
      const r = await this.page.evaluate(() => MADV.sceneRect()); const left = p.x < r.x; await this.tap(left ? r.x + 12 : r.x + r.w - 12, r.y + r.h - 10); await this.page.waitForTimeout(400); await this.idle(); }
    throw new Error('Kamera erreicht ' + id + ' nicht'); }
  async clickHs(id) { const p = await this.ensureVisible(id); await this.tap(p.x, p.y); await this.page.waitForTimeout(220); }
  // Verb an einer Stelle: Klick → Verbmenü (Maus) bzw. Verbknöpfe (Touch) → Verb wählen; nur "Schau an" läuft direkt
  async verb(id, label) { await this.idle(); await this.clickHs(id);
    const sel = this.touch ? '#label .vb' : '#verbpop .pv';
    const btn = this.page.locator(sel, { hasText: label });
    if (await btn.count()) { await btn.first().click(); }
    else if (label !== 'Schau an') { const have = await this.page.locator(sel).allTextContents(); throw new Error(`Verb "${label}" an ${id} fehlt (vorhanden: ${have.join(', ')})`); }
    await this.page.waitForTimeout(120); return this.idle(); }
  async look(id) { return this.verb(id, 'Schau an'); }
  async talk(id) { return this.verb(id, 'Rede mit'); }
  async choose(part) { await this.page.waitForTimeout(260); const b = this.page.locator('#choices .co', { hasText: part }); if (!(await b.count())) { const all = await this.page.locator('#choices .co').allTextContents(); throw new Error(`Antwort "${part}" fehlt: ${all.join(' / ')}`); }
    this.log.push(`  > ${part}`); await b.first().click(); await this.page.waitForTimeout(150); return this.idle(); }
  async chooseIdx(i) { await this.page.waitForTimeout(260); const b = this.page.locator('#choices .co').nth(i); this.log.push(`  > #${i} ${await b.textContent()}`); await b.click(); await this.page.waitForTimeout(150); return this.idle(); }
  async bye() { const s = await this.st(); if (!s.dlg) return s; const b = this.page.locator('#choices .co.bye'); if (await b.count()) { await this.page.waitForTimeout(260); await b.first().click(); await this.page.waitForTimeout(150); } return this.idle(); }
  // Gegenstand im Inventar finden (blättern) und anklicken
  async slot(item) { for (let k = 0; k < 8; k++) { const s = this.page.locator(`#inv .slot[data-item="${item}"]`); if (await s.count()) return s.first();
      const nx = this.page.locator('#inv-next'); if (await nx.isDisabled()) { const pv = this.page.locator('#inv-prev'); for (let j = 0; j < 8 && !(await pv.isDisabled()); j++) { await pv.click(); } if (k > 0) break; } else await nx.click(); await this.page.waitForTimeout(60); }
    const inv = (await this.st()).inv; throw new Error(`Gegenstand ${item} nicht im Inventar (${inv.join(', ')})`); }
  async select(item) { await this.idle(); const s = await this.slot(item); await s.click(); await this.page.waitForTimeout(150); }
  async useOn(item, id) { await this.idle(); await this.ensureVisible(id); await this.select(item); const p = await this.page.evaluate((i) => MADV.hsScreen(i), id); await this.tap(p.x, p.y); await this.page.waitForTimeout(200); return this.idle(); }
  async combine(a, b) { await this.select(a); const s = await this.slot(b); await s.click(); await this.page.waitForTimeout(200); return this.idle(); }
  async useSelf(a) { await this.select(a); await this.page.locator('#b-self').click(); await this.page.waitForTimeout(200); return this.idle(); }
  async itemVerb(item, label) { await this.select(item); await this.page.locator('#verbpop .pv', { hasText: label }).first().click(); await this.page.waitForTimeout(200); return this.idle(); }
  async exit(id, room) { await this.idle(); await this.clickHs(id); await this.page.waitForTimeout(300); const s = await this.idle(); if (room && s.room !== room) throw new Error(`Ausgang ${id}: erwartet ${room}, bin in ${s.room}`); return s; }
  async mapTo(name, room) { await this.idle(); await this.page.locator('#b-map').click(); await this.page.waitForTimeout(400); await this.page.locator('.mloc', { hasText: name }).first().click(); await this.page.waitForTimeout(500); const s = await this.idle(); if (room && s.room !== room) throw new Error(`Karte ${name}: erwartet ${room}, bin in ${s.room}`); return s; }
  async puzzle(...labels) { for (const l of labels) { const b = this.page.locator('.puzzle .pb', { hasText: l }); if (!(await b.count())) { const all = await this.page.locator('.puzzle .pb').allTextContents(); throw new Error(`Rätselknopf "${l}" fehlt: ${all.join(' / ')}`); } await b.first().click(); await this.page.waitForTimeout(260); } await this.page.waitForTimeout(1900); return this.idle(); }
  async closeDoc() { const s = await this.st(); if (s.modal === 'doc') { await this.page.locator('.modal.doc .row.back').click(); await this.page.waitForTimeout(250); } return this.idle(); }
  async expectFlag(k, v = true) { const f = await this.flags(); if ((v === true && !f[k]) || (v !== true && f[k] !== v)) throw new Error(`Flag ${k} erwartet ${v}, ist ${f[k]}`); }
  async expectItem(i, has = true) { const s = await this.st(); if (has !== s.inv.includes(i)) throw new Error(`Gegenstand ${i} ${has ? 'fehlt' : 'unerwartet vorhanden'} (${s.inv.join(', ')})`); }
}
module.exports = { Driver };
