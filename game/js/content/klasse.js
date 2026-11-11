/* ===== M. Adventure – content/klasse.js =====
   Klassenzimmer: Lehrer (S02, S03, S06, S10, S16, S19, S28 und Wiederkehrtexte aus IX), Listenmappe (Kohlepapier), Schere, Kreide,
   Plakette, Büste; Probe im Schulhof (S17, S18); Fenster zum Hinterhof (S28-Mechanik). */
(function(MA){
'use strict';
var K = MA.ART.klasse.K, KF = MA.ART.fenster.K;
function F(k){ return MA.flag(k); }

// ---------------------------------------------------------------- Der Lehrer
async function s02(A){ var L = A.npc('lehrer');
  await L.say('Branko hat dich geschickt?'); await A.say('Seine Liste hat mich nicht genommen.'); await L.say('Eine Liste nimmt niemanden.'); await A.say('Das habe ich auch gedacht.');
  await L.say('Im Klassenbuch stehst du. Hier.'); await A.say('Dann könnten wir ihm das Buch zeigen.'); await L.say('Er hat eine Abschrift.'); await A.say('Vielleicht mag er mich im Original lieber.'); await L.say('Wir sehen erst nach, was übertragen wurde.');
  var op = await A.choose(['„Haben Sie mich vergessen?“', '„Ich kann auch ohne Papier mitgehen.“', '„Ich schaue mir die Blätter genauer an.“']);
  if (op.id === 0){ await L.say('Nein. Dein Name steht hier im Nachtrag.'); await A.say('Dann hat das andere Blatt mich vergessen.'); await L.say('Papier vergisst nicht. Manchmal fehlt ihm nur etwas.'); }
  else if (op.id === 1){ await L.say('Ich weiß.'); await A.say('Können Sie das Branko sagen?'); await L.say('Das habe ich versucht.'); await A.say('Und?'); await L.say('Jetzt sehen wir uns das Papier an.'); }
  else { await L.say('Heb das Original vorsichtig an. Nicht auseinanderreißen.'); await A.say('Ich will mich finden, nicht vermehren.'); }
  A.set('teacher.met'); await A.say('Die Listenmappe liegt auf dem Pult.'); }
async function s03(A){ var L = A.npc('lehrer');
  await L.say('Du hast das Kohlepapier verschoben.'); await A.say('Es hat nicht bis zu meinem Namen gereicht.'); await L.say('Das sehe ich.'); await A.say('Vorher nicht?'); await L.say('Vorher war das andere Blatt darüber.'); await A.say('Ja. Das war das Problem.');
  await A.wait(700); await L.say('Ich habe es gestern eingelegt.'); await A.say('Ach.'); await L.say('Du darfst jetzt zufrieden aussehen.'); await A.say('Tue ich schon.'); await L.say('Nicht noch zufriedener.');
  var op = await A.choose(['„Sagen Sie Branko, dass ich nichts falsch gemacht habe?“', '„Kann ich jetzt zur Parade?“']);
  if (op.id === 0){ await L.say('Ich bestätige, dass der Nachtrag beim Kopieren fehlte.'); await A.say('Das klingt nicht ganz gleich.'); await L.say('Nein. Aber es ist richtig.'); }
  else { await L.say('Einen zusätzlichen Platz kann ich Branko damit nicht aus seiner Aufstellung schneiden.'); await A.say('Ausschneiden kann ich.'); await L.say('Diesmal ist das nicht die Lösung.'); }
  await L.say('Den Durchschlag bekommt Branko. Und den Abholauftrag kann ich dir bestätigen. Mara hält unser Schulmaterial bereit.'); await A.say('Das bringe ich her?'); await L.say('Zu mir. Und lass dir sagen, was sie dir mitgibt.');
  A.give('auftrag'); A.set('list.fixed'); A.note('n_auftrag'); MA.touch();
  await L.say('Sauber gearbeitet.'); await A.say('Mit Kohlepapier?'); await L.say('Mach das Lob nicht kaputt.'); A.save(); }
async function lehrerTalk(A){ var L = A.npc('lehrer');
  if (!F('teacher.met')){ await s02(A); return; }
  await A.menu(function(){ return [
    { t: 'Und im Klassenbuch stehe ich noch?', if: F('list.fixed'), once: 'l.book', go: async function(){ await L.say('Den Auftrag hast du.'); await A.say('Und im Klassenbuch stehe ich noch?'); await L.say('Ich habe dich nicht wieder herausgenommen.'); } },
    { t: 'Ich brauche Ihre Schere. Für einen Flascheneinsatz.', if: A.has('raster'), go: s06 },
    { t: 'Hier ist Ihr Schulmaterial. Von Mara.', if: A.has('beutel'), go: s16 },
    { t: 'Die Tafel stimmt jetzt. Wir können es noch einmal versuchen.', if: F('probe.failed1') && !F('probe.ok'), go: function(A){ return MA.rehearsal(A, 2); } },
    { t: 'Hat der Schulgründer hier auch gegessen?', if: F('spoon.asked') && !F('spoon.won'), go: s10 },
    { t: 'Ihnen fehlt ein Knopf.', if: F('coat.seen') && !F('coat.known'), go: s19 },
    { t: 'Darf ich ein Stück Kreide nehmen?', if: !F('kreide.taken'), go: async function(){ await L.say('Wofür?'); await A.say('Für etwas Geschriebenes. Kein Durchschlag.'); await L.say('Nimm. Aber schreib nichts, was ich vorlesen muss.'); takeChalk(A); } },
    { t: 'Was meinen Sie zu Dedos Garantie?', if: F('spoon.won') && !F('ad.done'), once: 'l.ix1', go: async function(){ await L.say('Dedo hat seine Garantie eingehalten?'); await A.say('Widerwillig.'); await L.say('Das ist auch eine Form von Zuverlässigkeit.'); } },
    { t: 'War der Knopf wirklich gewöhnlich?', if: F('ad.done'), once: 'l.ix2', go: async function(){ await A.say('Der Knopf war wirklich gewöhnlich?'); await L.say('Zum Glück.'); await A.say('Schade. Dedo hätte bestimmt noch etwas daraus gemacht.'); } },
    { t: 'Keine Verbesserung mehr an der Vorlage?', if: F('probe.ok'), once: 'l.ix3', go: async function(){ await L.say('Die Vorlage bleibt jetzt so.'); await A.say('Keine Verbesserung mehr?'); await L.say('Eine der wichtigsten Fähigkeiten ist, rechtzeitig aufzuhören.'); } },
    { t: 'Ich gehe wieder.', bye: true }
  ]; }); }
async function s06(A){ var L = A.npc('lehrer');
  await L.say('Das ist der Aufstellungsplan.'); await A.say('Ja.'); await L.say('Auf Packkarton.'); await A.say('Der Plan allein hält die Flaschen nicht auseinander.'); await L.say('Hast du die Stärke der Stege berücksichtigt?'); await A.say('Sonst passt die letzte Reihe nicht.');
  await A.wait(600); await L.say('Gut.'); await A.say('Darf ich es dann so machen?'); await L.say('Du hast es doch gerade begründet.'); await A.say('Das gilt sonst nicht immer.'); await L.say('Heute schon.');
  await A.anim('reachM'); A.swap('raster', 'einsatz'); A.set('einsatz.cut'); await A.say('Ich schneide zwölf Löcher. Bei III/4 genauso sorgfältig wie bei den anderen.');
  await L.say('Prüfe die Maße, bevor du weiter schneidest.'); await A.say('Das klingt, als hätten Sie Erfahrung damit.'); if (F('list.fixed')) await L.say('Jeder Lehrer hat Erfahrung mit zu kurzen Dingen.'); }
async function s16(A){ var L = A.npc('lehrer'); A.take('beutel'); A.note('n_beutel', 'done'); A.set('bag.delivered');
  await L.say('Kreide, Vorlagen, Schreibmaterial. Gut.'); await A.say('Mara hat gesagt, ausdrücklich für Sie.'); await L.say('Sie kennt ihre Kundschaft.'); await A.say('Sind Sie Kundschaft?'); await L.say('Heute bin ich für erstaunlich viele Dinge verantwortlich.'); await A.say('Auch für die Tafel?'); await L.say('Was ist mit der Tafel?');
  await A.say('Die Klasse ruft seit gestern, was auf der Probetafel steht.'); await L.say('Dann proben wir. Jetzt.'); return MA.rehearsal(A, 1); }
async function s10(A){ var L = A.npc('lehrer');
  await A.say('Hat der Schulgründer hier auch gegessen?'); await L.say('Vermutlich. Warum?'); await A.say('Dedo verkauft seinen Frühstückslöffel.'); await L.say('Natürlich tut er das.'); await A.say('Sie glauben ihm nicht?'); await L.say('Ich glaube, dass Dedo einen Löffel verkauft.');
  if (A.has('abrieb')){ await A.say('Der wurde 1954 hergestellt.'); await L.say('Der Schulgründer starb 1898.'); await A.say('Dann kam das Frühstück spät.'); await L.say('Sehr spät.'); await A.say('Können Sie mir das bestätigen?'); await L.say('Die Daten stehen dort. Du brauchst nicht für jede richtige Beobachtung meine Unterschrift.'); A.set('plakette.read'); }
  else { await L.say('Auf der Plakette stehen seine Lebensdaten. Was steht auf dem Löffel?'); await A.say('Etwas, das ich genauer ansehen muss.'); await L.say('Dann tu das, bevor du Dedo beschuldigst.'); } }
async function s19(A){ var L = A.npc('lehrer');
  await A.say('Ihnen fehlt ein Knopf.'); await L.say('Das weiß ich.'); await A.say('Sie halten den Mantel die ganze Zeit zu.'); await L.say('Deshalb weiß ich es.');
  var op = await A.choose(['„Dedo hat Knöpfe.“', '„Ist der alte bei der Probe abgesprungen?“']);
  if (op.id === 0){ await L.say('Dedo hat zu allem eine Geschichte.'); await A.say('Sie brauchen nur einen mit vier Löchern.'); await L.say('Dunkel. Und in dieser Größe.'); }
  else { await L.say('Nein.'); await A.say('Schade. Das hätte einiges erklärt.'); }
  await L.say('Zeichne lieber den anderen ab, falls du nach einem passenden suchst.'); A.set('coat.known'); A.note('n_knopf');
  if (F('spoon.won')){ await L.say('Und prüfe die Ware, nicht die Erzählung dazu.'); await A.say('Das habe ich bei Dedo inzwischen gelernt.'); await L.say('Ich weiß.'); } }
async function sketch(A){ if (!F('coat.known')){ await A.say('Ich zeichne doch nicht einfach den Lehrer ab.'); return; } if (A.has('skizze')){ await A.say('Die Skizze habe ich schon.'); return; }
  await A.anim('reachM'); A.give('skizze'); await A.say('Ich lege das Heft an den Knopf darunter und zeichne ihn ab. Dunkel, vier Löcher, genau diese Größe.'); await A.npc('lehrer').say('Gerade halten. Ich halte den Mantel.'); }
function takeChalk(A){ A.set('kreide.taken'); A.give('kreide'); MA.touch(); }

// ---------------------------------------------------------------- Probe (im Schulhof): attempt 1 = nach dem Beutel, 2 = Wiederholung
MA.rehearsal = async function(A, attempt){ MA.E.cutscene = true;
  await A.fade(1, 300); await A.goto('hof', { fade: false, noEnter: true, x: 92, y: 132, f: 'R', noSave: true });
  var L = A.spawn({ id: 'lehrer', ch: 'lehrer', x: 86, y: 124, f: 'L', idle: 'coatHold', talk: 'coatTalk', hgt: 50 });
  A.npc('jasna').place(30, 130, 'B'); A.npc('nedim').place(46, 133, 'B'); A.npc('kidA').place(16, 131, 'B'); A.npc('kidB').place(60, 130, 'B'); A.npc('kidC').place(74, 133, 'B');
  ['jasna', 'nedim', 'kidA', 'kidB', 'kidC'].forEach(function(k){ var a = MA.ACT[k]; if (a){ a.idle = 'idleB'; a.item = null; MA.setIdle(a); } });
  A.place(104, 134, 'L'); A.cam(0); await A.fade(0, 300);
  var J = A.npc('jasna'), N = A.npc('nedim');
  if (attempt === 1){
    await A.kids('Živio drugi Tiko!'); await L.say('Laut und deutlich!'); await A.kids('LAUT UND DEUTLICH!'); await L.say('Das sollt ihr nicht mitsprechen!'); await A.kids('DAS SOLLT IHR NICHT MITSPRECHEN!');
    await N.say('Das klang jetzt sehr deutlich.'); await J.say('Wir lesen, was dort steht.'); await L.say('Ihr sollt mitdenken.'); await J.say('Vorhin sollten wir genau lesen.'); await N.say('Ich habe extra nicht mitgedacht.');
    var op = await A.choose(['„Die Kinder haben die falsche Vorlage richtig gelernt.“', '„Vielleicht braucht die Tafel Nachhilfe.“']);
    if (op.id === 0){ await L.say('Das ist eine umständliche Beschreibung.'); await J.say('Aber sie stimmt.'); } else { await L.say('Tafeln brauchen keine Nachhilfe.'); await A.say('Dann zeigen wir ihr, was sie sagen soll.'); }
    await L.say('Zeig mir die gedruckte Vorlage.'); await A.wait(500); await L.say('Hier. Mach die Tafel so, wie es hier steht. Ich habe drinnen noch die Listen. Sag Bescheid, wenn ihr so weit seid.');
    A.give('vorlage'); A.set('probe.failed1'); A.note('n_probe');
  } else {
    var word = F('board.word') && F('board.frame'), roles = F('role.jasna') && F('role.nedim');
    if (!word){ await A.kids('Živio drugi Tiko! LAUT UND DEUTLICH!'); await J.say('Wir können es noch einmal genauso machen.'); await A.say('Das befürchte ich.'); await L.say('Die Tafel, M. Erst die Tafel.'); }
    else if (!roles){ await A.kids(F('role.jasna') ? 'Živio drug Tiko!' : 'Živio … drug … Tiko!'); if (!F('role.nedim')){ await N.say('Fertig?'); await A.kids('FERTIG?'); }
      await L.say(F('role.jasna') ? 'Wer achtet hier eigentlich auf die Pause?' : 'Wer liest vor? Alle gleichzeitig ist nicht vorlesen.'); await A.say('Jeder braucht seine Aufgabe.'); }
    else { await A.say('Auf mein Zeichen.'); await A.anim('wave'); await A.kids('Živio drug Tiko!'); await A.wait(900); await L.say('Genau so.');
      await N.say('Ich –'); await J.say('Pause.'); await L.say('Danke, Jasna.'); await N.say('Ich wollte „fertig“ sagen.'); await J.say('Das haben wir gehört, weil du nichts gesagt hast.');
      await L.say('M., das war brauchbar.'); await A.say('Nur brauchbar?'); await L.say('Sehr brauchbar. Treib es nicht zu weit.');
      A.set('probe.ok'); A.take('vorlage'); A.note('n_probe', 'done'); }
  }
  await A.fade(1, 300); A.despawn('lehrer'); A.cam(null); MA.loadRoom('hof'); A.place(104, 132, 'L'); await A.fade(0, 300); A.save(); };

// ---------------------------------------------------------------- Raum
MA.defineRoom({ id: 'klasse', name: 'Klassenzimmer', indoor: true, width: 320,
  paint: MA.ART.klasse.paint, layers: MA.ART.klasse.layers,
  walk: [[[64, 99], [256, 99], [272, 106], [298, 116], [318, 122], [318, 142], [4, 142], [4, 126], [44, 104]]],
  holes: function(S, G){ return [[20, 113, 78, 20], [178, 108, 122, 9], [182, 120, 138, 10], [188, 132, 132, 12], [252, 100, 30, 9]]; },
  start: [72, 104, 'R'], entries: { hof: [72, 104, 'R'], fenster: [246, 104, 'R'], map: [72, 104, 'R'] },
  actors: function(S, G){ return [{ id: 'lehrer', ch: 'lehrer', x: 124, y: 110, f: 'L', idle: 'coatHold', talk: 'coatTalk', hgt: 50 }]; },
  enter: async function(A, from){ if (F('bust.moved') && !F('s28.seen') && MA.ACT.lehrer){ A.set('s28.seen'); var L = A.npc('lehrer');
      await L.say('Warum steht er am Fenster?'); await A.say('Damit der Riegel oben bleibt.'); await L.say('Das ist nicht seine ursprüngliche Aufgabe.'); await A.say('Er hält auch sonst Papier fest.'); await A.wait(600); await L.say('Pass auf den Sockel auf.'); await A.say('Ich passe auf alles auf, was daran hängt.'); } },
  hotspots: [
    { id: 'tuer', name: 'Tür zum Hof', r: K.door, st: [66, 104, 'L'], exit: { to: 'hof' } },
    { id: 'fenster', name: 'Fenster zum Hinterhof', r: K.win, st: [248, 104, 'R'], exit: { to: 'fenster' } },
    { id: 'lehrer', npc: 'lehrer', hgt: 50, st: [146, 110, 'L'], talk: lehrerTalk,
      look: async function(A){ await A.say('Der Lehrer. Er hält seinen Mantel die ganze Zeit mit einer Hand zu. Oben fehlt ein Knopf.'); A.set('coat.seen'); },
      on: { raster: s06, beutel: s16, auftrag: async function(A){ await A.npc('lehrer').say('Den Auftrag hast du. Zu Mara damit.'); }, heft: sketch, bleistift: sketch, skizze: 'Die Skizze stimmt. Jetzt fehlt nur noch der Knopf.',
        abrieb: async function(A){ A.set('spoon.asked'); await s10(A); }, loeffel: async function(A){ await A.npc('lehrer').say('Der „Frühstückslöffel“? Den hat Dedo hergegeben?'); await A.say('Wegen seiner Garantie.'); await A.npc('lehrer').say('Dann hat er heute etwas gelernt. Und du auch.'); },
        fahne: async function(A){ await A.npc('lehrer').say('Eine Zeitung am Stock.'); await A.say('Branko hat einen Stempel.'); await A.npc('lehrer').say('Dann wird sie ihm gefallen.'); },
        '*': async function(A){ await A.npc('lehrer').say('Das brauche ich nicht. Ich brauche eine Klasse, die das Richtige ruft.'); } } },
    { id: 'mappe', name: 'Listenmappe', r: [34, 82, 28, 13], st: [104, 108, 'L'], tp: [49, 89],
      look: 'Die Listenmappe. Oben das Original mit allen Namen. Ganz unten, mit anderer Tinte: ich. Darunter ein Rest Kohlepapier und der Durchschlag.',
      open: async function(A){ if (!F('teacher.met')){ await s02(A); }
        if (F('list.fixed')){ await A.say('Der Durchschlag stimmt jetzt. Das Original auch. Beide wussten es vorher schon.'); return; }
        var r = await A.puzzle('carbon', {}); if (r === 'ok'){ A.note('n_liste', 'open'); await s03(A); } },
      use: async function(A){ return MA.ROOMS.klasse.byId.mappe.open(A); }, take: async function(A){ await A.npc('lehrer').say('Die Mappe bleibt auf dem Pult. Ansehen darfst du sie.'); } },
    { id: 'schere', name: 'Schere', r: [62, 84, 18, 10], st: [104, 108, 'L'], tp: [69, 90], look: 'Eine große Papierschere. Sie gehört dem Lehrer, wie alles auf diesem Pult.',
      take: async function(A){ if (A.has('raster')) return s06(A); await A.npc('lehrer').say('Wofür?'); await A.say('Noch für nichts.'); await A.npc('lehrer').say('Dann bleibt sie hier.'); },
      on: { raster: s06, karton: async function(A){ await A.say('Ohne Plan schneide ich nur kleinere Stücke Karton.'); }, '*': 'Die Schere ist für Papier. Und für den Lehrer.' } },
    { id: 'kreide', name: 'Kreide', r: [184, 66, 18, 10], st: [194, 102, 'B'], vis: function(S, G){ return !G.flags['kreide.taken']; }, look: 'Ein Stück Kreide auf der Ablage der Tafel.',
      take: async function(A){ await A.anim('reachM'); takeChalk(A); await A.npc('lehrer').say('Nimm. Aber schreib nichts, was ich vorlesen muss.'); } },
    { id: 'tafel', name: 'Tafel', r: K.board, look: '„Heute: Geschichte erleben.“ Darunter hat jemand klein „Abfrage?“ geschrieben. Das war Dragan.', read: '„Heute: Geschichte erleben.“ Und klein: „Abfrage?“' },
    { id: 'tiko', name: 'Bild von Tiko', r: K.tiko, look: 'Tiko, in Öl. Er lächelt, als wüsste er, wer heute fehlt.' },
    { id: 'karte', name: 'Landkarte', r: K.map, look: 'Die Landkarte von Jugoslawien. Mostar ist ein Punkt. Rosko Polje ist kein Punkt.' },
    { id: 'ofen', name: 'Kachelofen', r: K.stove, look: 'Der Kachelofen. Heute so nützlich wie ein Fähnchen ohne Platz.' },
    { id: 'baenke', name: 'Schulbänke', r: K.benches, pri: 5, look: 'Die Bänke. Meine ist die letzte. Nachträge sitzen hinten.' },
    { id: 'buste', name: 'Büste des Schulgründers', r: function(S, G){ return G.flags['bust.moved'] ? [268, 42, 26, 30] : [254, 46, 26, 30]; }, st: [246, 104, 'R'],
      look: 'Der Schulgründer in Bronze. Ernst, schwer, und er hält auch sonst Papier fest.', take: 'Er ist schwer. Ich bewege ihn nur, wenn ich einen guten Grund habe.', push: 'Er ist schwer. Ich bewege ihn nur, wenn ich einen guten Grund habe.' },
    { id: 'plakette', name: 'Plakette', r: [256, 78, 24, 14], st: [246, 104, 'R'], tp: [268, 86],
      look: async function(A){ return MA.ROOMS.klasse.byId.plakette.read(A); },
      read: async function(A){ await A.doc({ title: 'Plakette am Sockel', text: ['Dem Gründer dieser Schule', '* 1831   † 1898'], mono: true }); A.set('plakette.read');
        if (A.has('abrieb') || F('spoon.turned')) await A.say('Gestorben 1898. Der hat nie einen Löffel von 1954 in der Hand gehabt.'); else await A.say('1831 bis 1898. Für damals ein langes Leben.'); } }
  ]
});

// ---------------------------------------------------------------- Fenster zum Hinterhof (S28)
// Der Riegel bleibt nur oben, solange jemand die Leine hält; jede andere Handlung lässt ihn zurückfallen.
function releaseIfHeld(A){ if (!F('latch.held')) return false; A.set('latch.held', false); MA.touch(); A.give('leine'); return true; }
async function guardHeld(A, fn){ if (F('latch.held')){ releaseIfHeld(A); await A.say('Ich lasse los. Der Mechanismus funktioniert leider auch ohne mich.'); return; } await fn(); }
MA.defineRoom({ id: 'fenster', name: 'Fenster zum Hinterhof', indoor: true, noActor: true, width: 320,
  paint: MA.ART.fenster.paint, layers: MA.ART.fenster.layers, walk: function(){ return false; },
  leave: async function(A){ if (F('latch.held')){ releaseIfHeld(A); await A.say('Ich lasse die Leine los. Klack. Der Riegel ist wieder unten.'); } },
  enter: async function(A){ if (A.first('fenster.first')) await A.say(F('win.open') ? 'Unten der Hinterhof, das Tor, dahinter die Passage.' : 'Durch die Scheibe: der Hinterhof, das Tor zur Passage.'); },
  hotspots: [
    { id: 'zurueck', name: 'Zurück ins Klassenzimmer', r: [0, 120, 36, 24], exit: { to: 'klasse' } },
    { id: 'zurueck2', name: 'Zurück ins Klassenzimmer', r: [284, 0, 36, 40], exit: { to: 'klasse' } },
    { id: 'fluegel', name: 'Fensterflügel', r: [70, 6, 180, 30], pri: 4,
      look: function(A){ return guardHeld(A, function(){ return A.say(F('win.open') ? 'Beide Flügel stehen offen. Unten der Hinterhof.' : 'Das Fenster ist zu. Der Griff klemmt nicht.'); }); },
      open: function(A){ return guardHeld(A, async function(){ if (F('win.open')){ await A.say('Es ist schon offen.'); return; } A.set('win.open'); await A.say('Ich öffne beide Flügel.'); await A.say('Von hier sieht man, woran es draußen scheitert.'); }); },
      close: function(A){ return guardHeld(A, async function(){ if (!F('win.open')){ await A.say('Es ist zu.'); return; } if (F('line.atWindow')){ await A.say('Die Leine liegt noch drüber.'); return; } A.set('win.open', false); await A.say('Ich schließe das Fenster.'); }); } },
    { id: 'riegel', name: 'Riegel', r: [148, 64, 26, 34], pri: 1,
      look: function(A){ return guardHeld(A, function(){ return A.say(F('gate.offen') ? 'Der Riegel hängt lose. Das Tor braucht ihn gerade nicht.' : 'Ein eiserner Riegel mit einem Ring oben, innen am Tor. Von der Passage aus kommt niemand heran.'); }); },
      on: { leine: riegelLeine, netzleine: async function(A){ if (!F('win.open')){ await A.say('Durch die geschlossene Scheibe? Erst das Fenster.'); return; } A.take('netzleine'); A.give('netz'); A.give('leine'); await A.say('Ich knote das Netz kurz ab. Ein Netz am Riegel fängt nur Fragen.'); return riegelLeine(A); },
        '*': function(A){ return guardHeld(A, function(){ return A.say('Damit komme ich vom Fenster aus nicht an den Riegel.'); }); } } },
    { id: 'tor', name: 'Tor zur Passage', r: [120, 60, 80, 56], pri: 3,
      look: function(A){ return guardHeld(A, function(){ return A.say(F('gate.offen') ? 'Das Tor steht offen und hängt am Haken. Offenrast. Es hält jetzt selbst.' : 'Das Tor zur Passage. Von außen hat es keinen Griff. Der Riegel sitzt innen.'); }); } },
    { id: 'haken', name: 'Haken an der Mauer', r: [208, 76, 14, 12], look: function(A){ return guardHeld(A, function(){ return A.say('Ein Haken an der Mauer. Wenn das Tor ganz aufschwingt, schnappt es dort ein. Offenrast, sagt der Hausmeister.'); }); } },
    { id: 'passage', name: 'Passage', r: [194, 28, 44, 32], look: function(A){ return guardHeld(A, function(){ return A.say('Die Passage hinter dem Tor. Von dort kommt man zum Fluss – wenn man nicht gesehen wird.'); }); } },
    { id: 'buste', name: 'Büste des Schulgründers', r: function(S, G){ return G.flags['bust.moved'] ? [216, 90, 34, 34] : [262, 48, 40, 72]; },
      look: function(A){ return guardHeld(A, function(){ return A.say(F('bust.moved') ? 'Der Schulgründer steht auf der Fensterbank und beaufsichtigt den Hof.' : 'Der Schulgründer in Bronze. Er hält auch sonst Papier fest.'); }); },
      push: bustPush, use: bustPush, on: { leine: bustLine, '*': function(A){ return guardHeld(A, function(){ return A.say('Der Schulgründer braucht das nicht.'); }); } } },
    { id: 'leine_f', name: 'Zugleine', r: [150, 104, 70, 18], vis: function(S, G){ return !!G.flags['line.atWindow']; },
      take: async function(A){ if (!F('gate.offen')){ await A.say('Die Zugleine hält noch den Riegel. Ich muss das Tor sichern, bevor ich sie mitnehme.'); return; }
        A.set('line.atWindow', false); A.give('leine'); await A.say('Das Tor hält jetzt selbst. Die Leine kann wieder mit.'); }, look: 'Die Zugleine, eingeklemmt unter dem Schulgründer.' },
    { id: 'fensterbank', name: 'Fensterbank', r: [40, 116, 240, 28], pri: 6, look: function(A){ return guardHeld(A, function(){ return A.say('Eine breite Fensterbank aus Stein. Breit genug für einen Schulgründer.'); }); } }
  ]
});
async function riegelLeine(A){ if (F('latch.held')){ await A.say('Ich halte sie ja schon.'); return; }
  if (!F('win.open')){ await A.say('Durch die geschlossene Scheibe? Erst das Fenster.'); return; }
  if (F('gate.offen')){ await A.say('Das Tor steht schon offen.'); return; }
  A.take('leine'); A.set('latch.held'); MA.touch();
  await A.say('Ich lasse die Leine mit einer Schlinge hinunter, fange den Ring und ziehe. Der Riegel geht hoch.'); await A.say('Auf geht es. Aufbleiben ist das Problem.'); }
async function bustLine(A){ if (F('latch.held')) return bustPush(A); await A.say('Ich müsste die Leine erst irgendwo einhängen, damit es sich lohnt, sie festzuklemmen.'); }
async function bustPush(A){ if (F('line.atWindow')){ await A.say('Er hält die Leine. Er nimmt seine neue Aufgabe ernst.'); return; }
  if (F('bust.moved') && !F('latch.held')){ await A.say('Der Schulgründer steht schon am Fenster.'); return; }
  if (!F('latch.held')){ await A.say('Der Schulgründer steht gut, wo er steht. Ich brauche einen Grund, ihn zu bewegen.'); return; }
  A.set('latch.held', false); A.set('bust.moved'); A.set('line.atWindow'); MA.touch();
  await A.say('Ich schiebe den Schulgründer mit der Schulter auf das Leinenende. Er wiegt mehr als meine Geduld.'); await A.say('Jetzt beaufsichtigt der Schulgründer den Hof.');
  await A.wait(500); A.set('gate.offen'); MA.touch(); A.note('n_tor', 'done');
  await A.say('Unten schwingt das Tor auf, langsam, bis an die Mauer. Klack – es hängt am Haken.'); }
})(MA);
