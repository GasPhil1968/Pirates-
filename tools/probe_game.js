// Probelauf: Titel, Neues Spiel, Einstieg durchklicken, Screenshots. Aufruf: node tools/probe_game.js <outdir> [w] [h] [touch]
const { chromium, devices } = require('playwright');
(async () => {
  const [out, w = '1280', h = '800', touch] = process.argv.slice(2);
  const browser = await chromium.launch();
  const ctxOpts = touch ? { ...devices['iPhone 13 landscape'] } : { viewport: { width: +w, height: +h } };
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  page.on('requestfailed', r => errs.push('REQFAIL ' + r.url()));
  await page.goto('http://localhost:8822/game/index.html');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: out + '/g01_title.png' });
  const tap = async (x, y) => { if (touch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y); };
  await page.locator('.tmenu .row', { hasText: 'Neues Spiel' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: out + '/g02_card.png' });
  // Karte schließen
  await page.locator('.card').click(); await page.waitForTimeout(900);
  await page.screenshot({ path: out + '/g03_narr.png' });
  for (let i = 0; i < 40; i++) {
    const s = await page.evaluate(() => MADV.state());
    if (s.dlg) break;
    const r = await page.evaluate(() => MADV.sceneRect());
    await tap(r.x + r.w * 0.5, r.y + r.h * 0.6);
    await page.waitForTimeout(260);
    if (i === 12) await page.screenshot({ path: out + '/g04_branko.png' });
  }
  await page.screenshot({ path: out + '/g05_choice.png' });
  await page.locator('#choices .co').nth(2).click();
  for (let i = 0; i < 30; i++) { const s = await page.evaluate(() => MADV.state()); if (!s.busy) break; const r = await page.evaluate(() => MADV.sceneRect()); await tap(r.x + 20, r.y + 20); await page.waitForTimeout(250); }
  await page.waitForTimeout(400);
  await page.screenshot({ path: out + '/g06_free.png' });
  // Zeigen
  await page.locator('#b-show').click(); await page.waitForTimeout(300);
  await page.screenshot({ path: out + '/g07_show.png' });
  await page.waitForTimeout(2800);
  // Branko anklicken -> Verben
  let p = await page.evaluate(() => MADV.hsScreen('plan'));
  await tap(p.x, p.y); await page.waitForTimeout(500);
  await page.screenshot({ path: out + '/g08_verbs.png' });
  console.log(JSON.stringify(await page.evaluate(() => MADV.state())));
  console.log(errs.join('\n') || 'keine Fehler');
  await browser.close();
})();
