// Karte: zeigt nur bekannte Orte, gesperrte mit Grund, und reist nur zu freigegebenen Orten. Bedienung nur über die Oberfläche.
// Aufruf: node tools/map_check.js [Gerät]
const { Driver } = require('./driver');
(async () => {
  const d = await Driver.launch(process.argv[2] ? { device: process.argv[2] } : {});
  let fails = 0; const ok = (c, msg) => { console.log((c ? '✓ ' : '✗ ') + msg); if (!c) fails++; };
  const openMap = async () => { await d.idle(); await d.press(d.page.locator('#b-map')); await d.page.waitForTimeout(400); return d.page.locator('.mloc').evaluateAll((els) => els.map((e) => ({ name: e.textContent.trim(), locked: e.classList.contains('locked'), here: e.classList.contains('here') }))); };
  const closeMap = async () => { await d.press(d.page.locator('.mapfoot .row', { hasText: 'Schließen' })); await d.page.waitForTimeout(300); };
  const msg = async () => (await d.page.locator('.mapmsg').textContent()).trim();
  await d.page.locator('.tmenu .row', { hasText: 'Neues Spiel' }).click(); await d.page.waitForTimeout(500); await d.idle(); await d.choose('Ich gehe zum Lehrer');
  let locs = await openMap();
  ok(locs.length === 1 && locs[0].name === 'Schule' && locs[0].here, 'Start: nur „Schule“ (hier) – ' + JSON.stringify(locs));
  await closeMap();
  await d.talk('nedim'); await d.bye();
  locs = await openMap(); const most = locs.find((l) => l.name.startsWith('Stari Most'));
  ok(!!most && most.locked, 'nach Nedim: „Stari Most“ bekannt, aber gesperrt');
  ok(!locs.some((l) => /Markt|Sperre|Parade/.test(l.name)), 'Markt, Sperre, Paradestraße noch unbekannt');
  await d.press(d.page.locator('.mloc', { hasText: 'Stari Most' })); await d.page.waitForTimeout(250);
  ok((await msg()).includes('Ohne Auftrag'), 'Tipp auf gesperrten Ort nennt den Grund: „' + (await msg()) + '“');
  ok((await d.st()).room === 'hof', 'keine Reise zu gesperrtem Ort');
  await closeMap();
  await d.exit('tuer', 'klasse');
  locs = await openMap(); ok((await msg()).includes('drinnen'), 'drinnen: Plan zeigt nur den Standort – „' + (await msg()) + '“');
  await d.press(d.page.locator('.mloc', { hasText: 'Stari Most' })); await d.page.waitForTimeout(250); ok((await d.st()).room === 'klasse', 'von drinnen keine Reise'); await closeMap();
  await d.talk('lehrer'); await d.choose('Ich schaue mir die Blätter'); await d.verb('mappe', 'Öffne'); await d.puzzle('Original anheben', 'Kohlepapier tiefer', 'Original zurücklegen', 'Mit dem Bleistift nachfahren'); await d.choose('Sagen Sie Branko');
  await d.exit('tuer', 'hof');
  locs = await openMap(); const m2 = locs.find((l) => l.name.startsWith('Stari Most')), mk = locs.find((l) => l.name === 'Markt');
  ok(!!mk && !mk.locked && !!m2 && !m2.locked, 'mit Auftrag: Markt und Stari Most offen');
  ok(!locs.some((l) => /Sperre|Parade/.test(l.name)), 'Sperre und Paradestraße weiter unbekannt');
  await d.press(d.page.locator('.mloc', { hasText: 'Stari Most' })); await d.page.waitForTimeout(600); await d.idle();
  ok((await d.st()).room === 'most', 'Reise zur Brücke über die Karte');
  console.log(d.errors.length ? 'Browserfehler:\n' + d.errors.join('\n') : 'keine Browserfehler');
  console.log(fails ? `${fails} Prüfungen fehlgeschlagen` : 'Karte: alle Prüfungen bestanden');
  await d.close(); process.exit(fails ? 1 : 0);
})();
