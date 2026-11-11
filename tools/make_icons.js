// Erzeugt die App-Icons (icon-512.png, icon-192.png, icon-180.png) aus tools/icons.html in game/.
// Aufruf (Testserver auf Port 8822 muss laufen): node tools/make_icons.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8822/tools/icons.html'); await p.waitForTimeout(300);
  for (const [name, size, crop, scale] of [['icon-512.png', 512, 0, 8], ['icon-192.png', 192, 0, 3], ['icon-180.png', 180, 2, 3]]) {
    const url = await p.evaluate(([s, c, k]) => window.iconPNG(s, c, k), [size, crop, scale]);
    fs.writeFileSync(path.join(__dirname, '..', 'game', name), Buffer.from(url.split(',')[1], 'base64')); console.log(name, size);
  }
  await p.screenshot({ path: process.argv[2] || '/tmp/madv_icons.png' }); await b.close();
})();
