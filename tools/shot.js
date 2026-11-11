// Kleines Werkzeug: Seite laden und Screenshot(s) machen. Aufruf: node tools/shot.js <url> <out.png> [breite] [höhe] [wartezeit-ms] [selector]
const { chromium } = require('playwright');
(async () => {
  const [url, out, w = '1400', h = '900', waitMs = '800', sel] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  page.on('requestfailed', r => errs.push('REQFAIL ' + r.url()));
  await page.goto(url);
  await page.waitForTimeout(+waitMs);
  if (sel) { const el = await page.$(sel); await el.screenshot({ path: out }); } else await page.screenshot({ path: out, fullPage: true });
  console.log(errs.join('\n') || 'keine Fehler');
  await browser.close();
})();
