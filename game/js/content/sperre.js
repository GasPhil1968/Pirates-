/* ===== M. Adventure – content/sperre.js =====
   Straßensperre: Jovan (S25 Lieferkontrolle, S30 Signale, S32 Einlass), Plakatkleber (S22, Kiosk, Kleister), Dienstvorschrift,
   Pfiffsignale, Dragan an der Passage (S31 Zustandssätze, Flucht, Ausweis), Wechselgespräche Jovan/Plakatkleber (IX). */
(function(MA){
'use strict';
var K = MA.ART.sperre.K;
function F(k){ return MA.flag(k); }
var HOLDUP = M.poseF({ lh: [-5, -40], rh: [5, -40], h: [0, -24] }, 'B');
function stamped(){ return F('flag.stamped') && MA.has('fahne'); }

// ---------------------------------------------------------------- Jovan
async function jovanTalk(A){ var J = A.npc('jovan');
  if (A.first('jovan.hi')){ await J.say('Hier ist gesperrt.'); await A.say('Für wen?'); await J.say('Für alle, die nicht durchdürfen.'); }
  await A.menu(function(){ return [
    { t: 'Wer darf denn durch?', go: async function(){ await J.say('Lieferungen mit Schein. Teilnehmer mit Ausweis und geprüftem Fähnchen. Steht alles in der Vorschrift.'); A.note('n_teilnahme'); } },
    { t: 'Was bedeuten zwei kurze Pfiffe?', if: F('rules.read'), go: s30 },
    { t: 'Was ist hinter dir?', once: 'j.behind', go: async function(){ await J.say('Die Paradestraße. Und vorne, am vorderen Schlagbaum, noch einmal einer wie ich.'); await A.say('Noch einer?'); await J.say('Wir sind viele. Wir stehen nur nicht nebeneinander.'); } },
    { t: 'Wohin führt die Passage?', go: async function(){ await J.say('Zum Hinterhof der Schule. Heute führt sie nirgendwohin. Ich schaue hin.'); A.note('n_jovan'); } },
    { t: 'Ich bringe eine Lieferung.', if: A.has('kiste') && !F('delivery.access'), go: s25 },
    { t: 'Ich bin Teilnehmer.', if: A.has('ausweis'), go: function(A){ return s32(A); } },
    { t: 'Schon gut.', bye: true }
  ]; }); }
async function s30(A){ var J = A.npc('jovan');
  await A.say('Was bedeuten zwei kurze Pfiffe?'); await J.say('Kontrolle am vorderen Schlagbaum.'); await A.say('Warum muss man das pfeifen?'); await J.say('Damit man es hört.'); await A.say('Dich höre ich auch.'); await J.say('Nicht alle stehen so nah wie du.');
  var op = await A.choose(['„Und wenn du selbst dort stehst?“', '„Kann man einen Pfiff zurücknehmen?“']);
  if (op.id === 0){ await J.say('Dann kontrolliere ich.'); await A.say('Was hast du vorher gemacht?'); await J.say('Meinen Dienst.'); }
  else { await J.say('Ein Dienstsignal wird nicht zurückgenommen.'); await A.say('Gut zu wissen.'); await J.say('Warum?'); await A.say('Weil du es gerade erklärt hast.'); }
  A.set('signals.known'); }
async function s25(A){ var J = A.npc('jovan');
  if (!A.has('lieferschein')){ await J.say('Eine Kiste ohne Schein ist keine Lieferung. Sie ist eine Kiste.'); return false; }
  await J.say('Was ist das?'); await A.say('Eine Kiste.'); await J.say('Das sehe ich.'); await A.say('Dann verstehe ich die Frage nicht.'); await J.say('Was ist in der Kiste?'); await A.say('Zwölf Flaschen für die Parade. Hier ist der Schein.');
  await A.wait(600); await J.say('Drei Reihen zu vier.'); await A.say('Genau.'); await J.say('Nicht vorsagen.');
  var op = await A.choose(['„Soll ich wegsehen, solange du zählst?“', '„Die Flaschen laufen nicht weg.“']);
  if (op.id === 0){ await J.say('Du bleibst bei der Lieferung.'); await A.say('Das hatte ich ohnehin vor.'); }
  else { await J.say('Darum mache ich mir auch keine Sorgen.'); await A.say('Um mich?'); await J.say('Um die Leute, die immer dazwischenreden.'); }
  await J.say('Die Lieferung ist angemeldet.'); await A.say('Ich trage sie hinein.'); await J.say('Als Lieferhelfer. Nicht als Schüler in der Aufstellung.'); await A.say('Jetzt stehe ich wenigstens auf irgendeinem Schein.');
  A.set('delivery.access'); return true; }
async function s32(A){ var J = A.npc('jovan');
  if (!A.has('ausweis')){ await J.say(F('delivered') ? 'Für die Kiste hattest du einen Schein. Für den Platz brauchst du deinen Ausweis.' : 'Ohne Schein und ohne Ausweis kein Durchgang.'); return false; }
  if (!stamped()){ await J.say('Ausweis, ja. Und das Fähnchen? So steht es hier: Ausweis und geprüftes Fähnchen.'); if (A.has('fahne')) await A.say('Branko muss erst stempeln.'); return false; }
  await J.say('Du schon wieder.'); await A.say('Diesmal als Teilnehmer.'); await J.say('Vorhin als Lieferhelfer.'); await A.say('Die Lieferung ist erledigt.'); await J.say('Und die Kiste?'); await A.say('Zurück bei Mara.'); await J.say('Dann zeig den Ausweis.');
  await A.wait(700); await J.say('Dragan?');
  var op = await A.choose(['„Steht es so da?“', '„III/4. Mit geprüftem Fähnchen.“']);
  if (op.id === 0){ await J.say('Ja.'); await A.say('Dann haben wir dasselbe gelesen.'); } else { await J.say('Du hast dich vorbereitet.'); await A.say('Es war ein langer Nachmittag.'); }
  await J.say('Zur Aufstellung. Nicht noch einmal zu den Getränken.'); await A.say('Die stehen schon besser als wir.');
  A.note('n_teilnahme', 'done'); A.set('finale'); await MA.finale(A); return 'finale'; }
// Schlagbaum: Lieferung, Einlass oder Absage
async function barrierCheck(A){ var J = A.npc('jovan');
  if (F('delivery.access') && !F('delivered')) return true;
  if (A.has('kiste') && !F('delivery.access')) return await s25(A);
  if (A.has('ausweis')){ var r = await s32(A); return false; }
  await J.say(F('delivered') ? 'Für die Kiste hattest du einen Schein. Für den Platz brauchst du deinen Ausweis.' : 'Ohne Schein und ohne Ausweis kein Durchgang.'); return false; }

// ---------------------------------------------------------------- Pfiffsignale (Pfeife benutzen)
MA.whistle = async function(A){ if (!MA.E.room || MA.E.room.id !== 'sperre'){ await A.say('Hier pfeife ich nicht. Hier hört mich niemand, der zählt.'); return; }
  var J = A.npc('jovan'); if (!MA.ACT.jovan){ await A.say('Jovan ist nicht da. Wem sollte ich pfeifen?'); return; }
  var op = await A.choose(['Ein langer Pfiff', 'Zwei kurze Pfiffe', 'Drei kurze Pfiffe', 'Lieber doch nicht pfeifen'], { title: 'Welches Signal?' });
  if (op.id === 3) return;
  if (op.id === 1){ var ready = F('deal.dragan') && F('ball.returned') && F('gate.offen') && F('dragan.atPassage') && !F('escape.done');
    if (F('escape.done')){ await A.say('Dragan ist längst draußen. Ein Dienstsignal wird nicht zurückgenommen – und auch nicht wiederholt.'); return; }
    if (!ready){ await A.say(!F('dragan.atPassage') ? 'Noch nicht. Wenn Jovan jetzt nach vorn geht, braucht den Weg noch niemand.' : (!F('gate.offen') ? 'Noch nicht. Das Hintertor ist zu. Dragan stünde in der Passage vor einem Riegel.' : 'Noch nicht.')); return; }
    await A.anim('reachM'); await A.say('Ich pfeife zweimal kurz. Hell, wie vom vorderen Schlagbaum.');
    await J.say('Vordere Kontrolle.'); await A.say('Du kennst dich aus.'); await J.say('Dafür stehe ich hier.');
    await J.walk(440, 118, { free: true }); A.npc('jovan').hide(); return escape(A); }
  await A.anim('reachM'); await A.say(op.id === 0 ? 'Ein langer Pfiff. Tüüüt.' : 'Drei kurze Pfiffe.');
  await J.say(op.id === 0 ? 'Durchfahrt? Hier fährt nichts durch. Das war nicht das Signal für die vordere Kontrolle.' : 'Ablösung? Mich löst heute keiner ab. Das war nicht das Signal für die vordere Kontrolle.');
  await A.say('Ich übe noch.'); await J.say('Übe leiser.'); };

// ---------------------------------------------------------------- Dragan an der Passage (S31)
async function draganPassage(A){ var D = A.npc('dragan');
  if (!F('gate.offen')){ await D.say('Ich möchte hinaus, nicht auf halbem Weg den Riegel festhalten.'); return; }
  if (!F('escape.done')){ await D.say('Der Mann sieht genau hierher. Das ist kein Versteck, nur ein anderer Platz zum Gesehenwerden.'); return; } }
async function escape(A){ var D = A.npc('dragan');
  await A.walk(222, 116); await A.face('R');
  await A.say('Das Tor ist offen. Jovan kontrolliert vorne.'); await D.say('Und hier schaut er gerade nicht hin?'); await A.say('Gerade nicht.'); await D.say('Dann war das ein guter Plan.'); await A.say('Du klingst überrascht.'); await D.say('Ich bin schon oft mit guten Plänen wieder in der Schule gelandet.');
  await D.say('III/4. Mein Platz.'); A.give('ausweis'); await A.say('Jetzt meiner.'); await D.say('Bis die Parade vorbei ist.'); await A.say('So lange reicht.');
  A.set('escape.done'); A.set('dragan.atPassage', false); A.note('n_abmachung', 'done'); A.note('n_jovan', 'done'); A.note('n_dragan', 'done'); MA.touch();
  await D.walk(226, 100, { free: true }); D.hide();
  await A.wait(800); await A.line('dragan', 'Hat er dich schon gezählt?', { far: true }); await A.say('Noch nicht.'); await A.line('dragan', 'Dann streng dich an. Ich möchte heute wenigstens ordentlich fehlen.');
  A.despawn('dragan');
  var J = A.npc('jovan'); J.show(); J.place(440, 118, 'L'); await J.walk(306, 116); J.face('L');
  await J.say('Vorne war nichts.'); await A.say('Dann war es eine gute Kontrolle.'); await J.say('Jede Kontrolle ist gut, die nichts findet.');
  if (!stamped()) await A.say('Ausweis habe ich. Jetzt fehlt nur noch ein geprüftes Fähnchen.'); A.save(); }

// ---------------------------------------------------------------- Plakatkleber (S22, Kiosk)
async function kleberTalk(A){ var Kl = A.npc('kleber');
  if (F('kleister.given')){ await Kl.say(A.cycle('kl.after', ['Es hängt. Gerade und fest.', 'Velež 2:1. Die Zeitung hatte recht. Sag es nicht weiter.', 'Kleister hält länger als Meinungen.'])); return; }
  if (F('kleister.owed')){ if (A.has('loeffel')) return kleisterGive(A); await Kl.say('Ein Löffel, dann kriegst du deinen Kleister. In die Hand gebe ich ihn dir nicht.'); return; }
  await A.menu(function(){ return [
    { t: 'Brauchst du eine Hand?', if: !F('kleber.deal'), go: async function(){ await A.say('Brauchst du eine Hand?'); await Kl.say('Eine, die ich danach behalten darf.');
        if (A.has('klammern')){ await A.say('Ich habe Klammern.'); await Kl.say('Das wäre weniger unheimlich. Wenn das Plakat hält, kriegst du einen Löffel Kleister. Mehr Lohn habe ich nicht dabei.'); A.set('kleber.deal'); }
        else { await A.say('Meine zwei Hände will ich auch behalten.'); await Kl.say('Dann such dir etwas, das festhält, ohne zu fragen.'); } A.note('n_plakat'); } },
    { t: 'Und Velež hat 2:1 gewonnen.', if: F('sport.read') && !F('kleber.velez'), go: velez },
    { t: 'Warum hältst du das Plakat?', if: !F('poster.fixed'), once: 'kl.why', go: async function(){ await Kl.say('Weil der Kleister unten noch nass ist und die Ecke oben nicht will. Lasse ich los, rollt sich Tiko ein.'); await A.say('Das wäre schlecht.'); await Kl.say('Für mich. Tiko merkt es nicht.'); } },
    { t: 'Bis gleich.', bye: true }
  ]; }); }
async function velez(A){ var Kl = A.npc('kleber'); await A.say('Und Velež hat 2:1 gewonnen.'); await Kl.say('Jetzt wird es wieder unheimlich.'); await A.say('Es steht hier.'); await Kl.say('Das überprüfe ich.'); await A.say('Sobald du das Plakat loslassen kannst.'); A.set('kleber.velez');
  if (F('poster.fixed')) await kioskTrip(A); }
async function fixPoster(A){ var Kl = A.npc('kleber');
  if (F('poster.fixed') || F('poster.pasted')){ await A.say('Das Plakat hält.'); return; }
  if (!F('kleber.deal')){ await Kl.say('Halt. Wer klammert hier an meinem Plakat? Frag erst.'); return; }
  await A.anim('reachH'); A.take('klammern'); A.set('poster.fixed'); MA.touch(); await A.say('Ich klemme die Ecken mit Maras Klammern an den Rahmen.');
  Kl.freeze(null); var a = MA.ACT.kleber; if (a){ a.f = 'R'; a.idle = null; MA.setIdle(a); }
  await Kl.say('Es hält. Ich kann loslassen.');
  if (F('kleber.velez')) await kioskTrip(A); else await reward(A); }
async function kioskTrip(A){ var Kl = A.npc('kleber'); await Kl.say('Moment.'); await Kl.walk(70, 108); await A.wait(900); await Kl.walk(150, 112);
  await Kl.say('Die Zeitung stimmt.'); await A.say('Also hatte ich recht.'); await Kl.say('Die Zeitung hatte recht.'); await A.say('Ich habe daraus vorgelesen.'); await Kl.say('Dann hast du gut vorgelesen.'); A.set('kleber.kiosk'); await reward(A); }
async function reward(A){ var Kl = A.npc('kleber'); await A.wait(400); await Kl.anim('brush'); A.set('poster.pasted'); MA.touch();
  await Kl.say('Gut geklammert hast du auch. Nimm deine Klammern zurück.'); A.give('klammern'); A.note('n_plakat', 'done');
  if (A.has('loeffel')) await kleisterGive(A); else { await Kl.say('Der vereinbarte Löffel Kleister gehört dir. Wo soll ich ihn hintun? In deine Hosentasche?'); await A.say('Ich bringe einen Löffel.'); A.set('kleister.owed'); A.note('n_kleister'); } }
async function kleisterGive(A){ var Kl = A.npc('kleber'); await Kl.say('Der vereinbarte Löffel Kleister gehört dir.'); A.swap('loeffel', 'loeffel_k'); A.set('kleister.given'); A.set('kleister.owed', false); A.note('n_kleister', 'done'); await A.say('Ein Löffel Kleister. Gestrichen voll.'); A.save(); }

// ---------------------------------------------------------------- Raum
MA.defineRoom({ id: 'sperre', name: 'Straßensperre', width: K.W,
  paint: MA.ART.sperre.paint, layers: MA.ART.sperre.layers,
  walk: [[[4, 106], [416, 106], [416, 142], [4, 142]]], holes: [[288, 106, 132, 8], [32, 104, 58, 4]],
  start: [30, 124, 'R'], entries: { markt: [24, 124, 'R'], parade: [280, 124, 'L'], map: [30, 124, 'R'] },
  actors: function(S, G){ var a = [{ id: 'jovan', ch: 'jovan', x: 306, y: 116, f: 'L', hgt: 50 }];
    if (G.flags['poster.fixed'] || G.flags['poster.pasted']) a.push({ id: 'kleber', ch: 'kleber', x: 150, y: 112, f: 'R', hgt: 50 });
    else a.push({ id: 'kleber', ch: 'kleber', x: 141, y: 114, f: 'B', hgt: 50 });
    if (G.flags['dragan.atPassage'] && !G.flags['escape.done']) a.push({ id: 'dragan', ch: 'dragan', x: 230, y: 112, f: 'L', hgt: 42, item: 'ball' });
    return a; },
  load: function(){ if (!MA.flag('poster.fixed') && !MA.flag('poster.pasted') && MA.ACT.kleber) MA.ACT.kleber.frozen = HOLDUP; },
  enter: async function(A, from){
    if (A.first('s22')){ var J = A.npc('jovan'), Kl = A.npc('kleber'); await J.say('Das Plakat hängt schief.'); await Kl.say('Der Rahmen steht schief.'); await J.say('Der Rahmen ist befestigt.'); await Kl.say('Dann steht er befestigt schief.'); await J.say('Von hier sieht es gerade aus.'); await Kl.say('Dann bleib dort.'); return; }
    if (F('poster.pasted') && A.first('ix.poster')){ var J2 = A.npc('jovan'), K2 = A.npc('kleber'); await J2.say('Jetzt hängt es gerade.'); await K2.say('Jetzt hängt es fest.'); await J2.say('Das habe ich gemeint.'); await K2.say('Dann haben wir beide etwas dazugelernt.'); return; }
    if (F('kleber.kiosk') && A.first('ix.velez')){ var J3 = A.npc('jovan'), K3 = A.npc('kleber'); await J3.say('Wer hat denn nun gewonnen?'); await K3.say('Die Zeitung.'); await J3.say('Welche Mannschaft ist das?'); await K3.say('Eine, gegen die man nicht diskutieren sollte.'); } },
  hotspots: [
    { id: 'west', name: 'Zurück zum Markt', r: [0, 60, 14, 84], st: [8, 124, 'L'], exit: { to: 'markt' } },
    { id: 'schlagbaum', name: 'Schlagbaum', r: [292, 84, 128, 30], st: [284, 124, 'R'], exit: { to: 'parade', can: barrierCheck } },
    { id: 'jovan', npc: 'jovan', hgt: 50, talk: jovanTalk, look: 'Jovan, der Redar. Schirmmütze, Armbinde, eine Pfeife an der Schnur und Augen wie eine Liste.',
      on: { lieferschein: s25, kiste: s25, ausweis: function(A){ return s32(A); }, fahne: async function(A){ await A.npc('jovan').say(stamped() ? 'Ein geprüftes Fähnchen. Und der Ausweis?' : 'Ein Fähnchen ohne Stempel ist Papier mit Ehrgeiz.'); }, pfeife: function(A){ return MA.whistle(A); },
        '*': async function(A){ await A.npc('jovan').say('Das steht nicht in der Vorschrift.'); } } },
    { id: 'vorschrift', name: 'Dienstvorschrift', r: K.rules, st: [272, 124, 'B'],
      read: async function(A){ await A.doc({ title: 'Dienstvorschrift – Absperrung Hauptstraße', text: ['DURCHLASS: Lieferungen nur mit Lieferschein. Teilnehmer nur mit Ausweis und geprüftem Fähnchen.', 'DIENSTSIGNALE (Pfeife):', '• ein langer Pfiff – Achtung, Durchfahrt', '• zwei kurze Pfiffe – Kontrolle am vorderen Schlagbaum', '• drei kurze Pfiffe – Ablösung', 'Ein Dienstsignal wird nicht zurückgenommen.'] }); A.set('rules.read'); A.note('n_teilnahme'); },
      look: async function(A){ return MA.ROOMS.sperre.byId.vorschrift.read(A); } },
    { id: 'kleber', npc: 'kleber', hgt: 50, talk: kleberTalk, look: function(A){ return A.say(F('poster.fixed') || F('poster.pasted') ? 'Der Plakatkleber. Arme frei, Mütze schief, Kleister bis zu den Ellbogen.' : 'Der Plakatkleber. Er hält das Plakat mit beiden Händen an den Rahmen und sieht aus, als täte er das schon lange.'); },
      on: { klammern: fixPoster, loeffel: async function(A){ if (F('kleister.owed') || (F('poster.pasted') && !F('kleister.given'))) return kleisterGive(A); await A.npc('kleber').say('Ein Löffel? Erst die Arbeit, dann der Kleister.'); }, zeitung: async function(A){ if (!F('kleber.velez')){ A.set('sport.read'); return velez(A); } await A.npc('kleber').say('Die Zeitung hat recht. Lass gut sein.'); }, fahne: 'Er schaut auf die Rückseite. Velež 2:1. Er seufzt.', '*': async function(A){ await A.npc('kleber').say('Das klebt nicht.'); } } },
    { id: 'plakat', name: 'Plakat', r: K.poster, st: [140, 122, 'B'], look: function(A){ return A.say(F('poster.pasted') ? 'Tiko, gerade und fest. Er lächelt die Straße an.' : (F('poster.fixed') ? 'Das Plakat hängt, mit Maras Klammern an den Ecken.' : 'Ein Plakat von Tiko. Die obere Ecke will sich einrollen, sobald der Plakatkleber loslässt.')); },
      on: { klammern: fixPoster, '*': 'Das hält kein Plakat.' } },
    { id: 'eimer', name: 'Kleistereimer', r: K.bucket, st: [170, 122, 'B'], look: 'Ein Eimer Kleister mit Pinsel. Er riecht nach Mehl und Arbeit.', take: async function(A){ await A.npc('kleber').say('Finger weg. Kleister gibt es bei mir löffelweise. Gegen Arbeit.'); }, on: { loeffel: async function(A){ await A.npc('kleber').say('Nicht selbst bedienen. Kleister ist Lohn, kein Brunnen.'); } } },
    { id: 'kiosk', name: 'Kiosk', r: K.kiosk, look: 'Der Kiosk. Heute haben alle Zeitungen dieselbe Titelseite. Nur hinten unterscheiden sie sich.' },
    { id: 'passage', name: 'Passage', r: K.passage, st: [224, 112, 'B'], look: function(A){ return A.say(F('escape.done') ? 'Die Passage. Dragan ist längst am Fluss.' : (F('gate.offen') ? 'Die Passage. Ganz hinten steht das Hintertor der Schule offen.' : 'Eine schmale Passage. Ganz hinten das Hintertor der Schule – zu. Von hier aus kein Griff, kein Riegel.')); },
      go: true, use: async function(A){ await A.npc('jovan').say('Die Passage ist heute kein Weg. Ich schaue hin.'); } },
    { id: 'dragan', npc: 'dragan', hgt: 42, talk: draganPassage, look: 'Dragan, den Ball unterm Arm. Er tut, als würde er die Wand anschauen.', on: { '*': async function(A){ await A.npc('dragan').say('Behalt das. Ich brauche nur einen freien Weg.'); } } },
    { id: 'transparent', name: 'Transparent', r: [120, 12, 120, 12], look: '„ŽIVIO DRUG TIKO“. Auch hier: drug, nicht drugi.' }
  ]
});
})(MA);
