// Layoutprüfung auf mehreren Geräten: Titel, Szene mit Verbknöpfen, Gespräch mit Antworten, Notizen, Karte, Menü, Rätsel.
// Prüft per DOM, ob sichtbare Knöpfe und Texte innerhalb der Bühne liegen und ob Beschriftungen abgeschnitten werden.
// Aufruf: node tools/layout_check.js [outdir] [Gerät …]
const { Driver } = require('./driver');
const fs = require('fs');
const DEVICES = ['Desktop 1280x800', 'Desktop 1024x640', 'iPad (gen 7) landscape', 'Galaxy S24 landscape', 'iPhone 16 Pro Max landscape', 'iPhone 13 landscape', 'iPhone SE landscape', 'iPhone 13'];
(async () => {
  const out = process.argv[2] || '/tmp/madv_layout'; fs.mkdirSync(out, { recursive: true });
  const list = process.argv.length > 3 ? process.argv.slice(3) : DEVICES;
  let problems = 0;
  for (const dev of list) {
    const m = /^Desktop (\d+)x(\d+)$/.exec(dev);
    const d = await Driver.launch(m ? { w: +m[1], h: +m[2] } : { device: dev });
    const tag = dev.replace(/[^A-Za-z0-9]+/g, '_');
    const shot = async (n) => d.page.screenshot({ path: `${out}/${tag}_${n}.png` });
    // Überläufe: Elemente außerhalb der Bühne oder mit abgeschnittenem Text
    const check = async (where) => { const r = await d.page.evaluate(() => { const st = document.getElementById('stage').getBoundingClientRect(), bad = [];
        const vis = (e) => { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
        document.querySelectorAll('#stage button, #stage .row, #stage .co, #stage .lt, #stage .tb, #stage .mloc, #stage .pb').forEach((e) => { if (!vis(e)) return; let p = e; while (p && p !== document.body) { if (!vis(p)) return; p = p.parentElement; }
          const b = e.getBoundingClientRect(), t = (e.textContent || '').trim().slice(0, 30);
          let sc = e.parentElement; while (sc && sc !== document.body) { const cs = getComputedStyle(sc); if (/(auto|scroll)/.test(cs.overflowY) && sc.scrollHeight > sc.clientHeight + 1) break; sc = sc.parentElement; } const inScroll = sc && sc !== document.body;
          if ((b.left < st.left - 1 || b.top < st.top - 1 || b.right > st.right + 1 || b.bottom > st.bottom + 1) && !inScroll) bad.push('außerhalb: ' + (e.id || e.className) + ' „' + t + '“');
          if (e.id !== 'b-self' && e.scrollWidth > e.clientWidth + 2 && !e.classList.contains('lt') && !e.classList.contains('dot')) bad.push('Text breiter als Feld: ' + (e.id || e.className) + ' „' + t + '“ ' + e.scrollWidth + '>' + e.clientWidth);
          if (e.tagName === 'BUTTON' && (b.height < 24 || b.width < 24) && document.getElementById('stage').classList.contains('t')) bad.push('Tippfläche klein: ' + (e.id || e.className) + ' „' + t + '“ ' + Math.round(b.width) + '×' + Math.round(b.height)); });
        document.querySelectorAll('#overlay .modal').forEach((mo) => { if (mo.classList.contains('full')) return; const cands = [...mo.querySelectorAll('.pxc, .row.back')].filter((c) => { const b = c.getBoundingClientRect(); return vis(c) && b.top >= st.top - 1 && b.bottom <= st.bottom + 1 && b.left >= st.left - 1 && b.right <= st.right + 1; });
          if (!cands.length) bad.push('kein sichtbarer Schließen-Knopf in ' + mo.className); });
        return { bad, mode: document.getElementById('stage').className, size: Math.round(st.width) + '×' + Math.round(st.height) }; });
      if (r.bad.length) { problems += r.bad.length; console.log(`  ${where}: ` + r.bad.join(' | ')); } return r; };
    const lay = await check('Titel'); console.log(`${dev}: Bühne ${lay.size}, ${lay.mode}`); await shot('1_titel');
    if (dev === 'iPhone 13') { const rot = await d.page.locator('#rotate.on').count(); console.log('  Hochformat-Hinweis sichtbar: ' + (rot ? 'ja' : 'NEIN')); if (!rot) problems++; await shot('2_hoch'); await d.page.locator('#rot-ok').click(); await d.page.waitForTimeout(400); await shot('3_hoch_gedreht'); await d.close(); continue; }
    await d.page.locator('.tmenu .row', { hasText: 'Neues Spiel' }).click(); await d.page.waitForTimeout(500); await d.idle();
    await shot('2_s01'); await check('S01-Antworten'); await d.choose('Ich gehe zum Lehrer');
    await d.clickHs('branko'); await d.page.waitForTimeout(250); await shot('3_verben_branko'); await check('Verben Branko');
    const sel = d.touch ? '#label .vb' : '#verbpop .pv'; await d.page.locator(sel, { hasText: 'Rede mit' }).first().click(); await d.page.waitForTimeout(200); await d.idle();
    await shot('4_gespraech'); await check('Gespräch'); await d.bye();
    await d.select('heft'); await shot('5_auswahl'); await check('Auswahl Heft'); await d.page.locator('#verbpop .pv', { hasText: 'Schau an' }).first().click().catch(() => {}); await d.page.waitForTimeout(200); await d.idle();
    await d.page.locator('#b-notes').click(); await d.page.waitForTimeout(300); await shot('6_notizen'); await check('Notizen'); await d.page.keyboard.press('Escape'); await d.page.waitForTimeout(200);
    if (await d.page.locator('.modal').count()) { await d.page.locator('.modal .row.back').first().click().catch(() => {}); await d.page.waitForTimeout(200); }
    await d.page.locator('#b-map').click(); await d.page.waitForTimeout(400); await shot('7_karte'); await check('Karte'); await d.page.keyboard.press('Escape'); await d.page.waitForTimeout(200);
    if (await d.page.locator('.modal').count()) { await d.page.locator('.modal .row.back').first().click().catch(() => {}); await d.page.waitForTimeout(200); }
    await d.page.locator('#b-menu').click(); await d.page.waitForTimeout(300); await shot('8_menue'); await check('Menü');
    await d.page.locator('.panel .row', { hasText: 'Einstellungen' }).click(); await d.page.waitForTimeout(300); await shot('9_einstellungen'); await check('Einstellungen');
    await d.page.keyboard.press('Escape'); await d.page.waitForTimeout(150); await d.page.keyboard.press('Escape'); await d.page.waitForTimeout(250);
    while (await d.page.locator('.modal').count()) { await d.page.locator('.modal .row.back').first().click().catch(() => {}); await d.page.waitForTimeout(200); if ((await d.st()).modal == null) break; }
    await d.exit('tuer', 'klasse'); await d.talk('lehrer'); await d.choose('Ich schaue mir die Blätter');
    await d.verb('mappe', 'Öffne'); await shot('10_raetsel'); await check('Rätsel Kohlepapier');
    console.log('  Fehler im Browser: ' + (d.errors.length ? d.errors.join(' | ') : 'keine')); problems += d.errors.length;
    await d.close();
  }
  console.log(problems ? `Auffälligkeiten: ${problems}` : 'keine Auffälligkeiten');
})();
