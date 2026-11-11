/* ===== M. Adventure – content/hof.js =====
   Schulhof: Branko (Liste, Ablagen, Stempel), Jasna (Plan, Rolle), Nedim (Murmel, Rolle), Probetafel, Bank, Klassenkameraden.
   PDF-Szenen: S01 (Wiederkehr), S05, S14, S18, S21 (Start), S23; eigene Zuspitzung „Nachtrag ohne Platz“. */
(function(MA){
'use strict';
var K = MA.ART.hof.K;
function F(k){ return MA.flag(k); }
var KIDLIFT = M.poseS({ h: [1, -17], ln: 3, nf: [5, 0, 'f'], ff: [-3, 0, 'f'], nh: [7, -8], fh: [5, -9] });

// ---------------------------------------------------------------- Branko
async function brankoTalk(A){ var B = A.npc('branko');
  if (A.first('branko.hello2')){ await B.say('Noch einmal: Name?'); await A.say('Immer noch M.'); }
  await A.menu(function(){ return [
    { t: 'Hast du mich inzwischen gefunden?', if: !F('list.fixed'), go: async function(){ await B.say('Hast du etwas Schriftliches?'); await A.say('Bisher nur meinen Namen.'); await B.say('Ein guter Anfang.'); } },
    { t: 'Ich stehe jetzt im Durchschlag. Der Lehrer hat es korrigiert.', if: F('list.fixed') && !F('branko.noPlace'), go: noPlace },
    { t: 'Gibt es wirklich keinen Platz?', if: F('branko.noPlace'), go: async function(){ await B.say('Zwölf Plätze, zwölf Namen. Ich zähle gern noch einmal. Das Ergebnis bleibt.'); await A.say('Und wenn einer fehlt?'); await B.say('Dann vermerke ich das. Ein Platz bleibt ein Platz, auch wenn niemand darauf steht.'); if (!F('deal.dragan')) await A.say('Wenn niemand darauf steht … Jasna sagt, Dragan steht nicht, wo er soll.'); } },
    { t: 'Bekomme ich ein Fähnchen?', once: 'b.flag', go: async function(){ await B.say('Fähnchen gibt es für Namen mit Platz.'); await A.say('Mein Name hat keinen Platz.'); await B.say('Dann hat er auch kein Fähnchen. Das ist folgerichtig.'); await A.say('Und wenn ich mir selbst eins mache?'); await B.say('Alles, was getragen wird, gehört in die Materialprüfung.'); A.note('n_fahne'); } },
    { t: 'Was kommt in deine Ablagen?', go: async function(){ await B.say('Listen in die Liste. Material in die Materialprüfung. Sonstiges in Sonstiges.'); await A.say('Und was wird geprüft?'); await B.say('Was in der richtigen Ablage liegt.'); } },
    { t: 'Kannst du meine Fahne prüfen?', if: A.has('fahne') && !F('flag.stamped'), go: async function(){ await showFlag(A, 'fahne'); } },
    { t: 'Ich gehe schon.', bye: true }
  ]; }); }
async function noPlace(A){ var B = A.npc('branko');
  await B.say('Ich habe ihn gesehen. Nachtrag. Mit anderer Tinte.'); await A.say('Dann bin ich jetzt auf der Liste.');
  await B.say('Auf der Liste, ja. In der Aufstellung nicht.'); await A.say('Wo ist der Unterschied?');
  await B.say('Die Aufstellung ist vollständig. Drei Reihen, vier Plätze, zwölf Namen.'); await A.say('Und ich?');
  await B.say('Ein Nachtrag hat keinen Platz. Er steht unten.'); await A.say('Unten auf dem Hof?'); await B.say('Unten auf dem Blatt.');
  A.set('branko.noPlace'); A.note('n_liste', 'done'); A.note('n_platz');
  await A.say('Ich stehe also richtig auf der Liste und nirgends im Hof. Das hätte mir auch vorher jemand sagen können.'); }
async function showFlag(A, id){ var B = A.npc('branko');
  if (F('flag.stamped')){ await B.say('Mein Stempel ist darauf.'); await A.say('Du erkennst ihn?'); await B.say('Ich hoffe, du willst nicht behaupten, ihn selbst angebracht zu haben.'); await A.say('Diesmal nicht.'); return; }
  if (id === 'fahne'){ await A.say('Meine Fahne.'); await B.say('Das ist eine Zeitung am Stock.'); await A.say('Wenn ich winke, bewegt sie sich wie eine Fahne.'); await B.say('Bewegung ist kein Prüfzeichen.'); await A.say('Das erklärt deine Liste.'); }
  else { await A.say('Meine Zeitung. Bald meine Fahne.'); await B.say('Bald ist kein Prüfzeichen.'); }
  await B.say('Das Material gehört in die Prüfung.'); }
// S23: in die richtige Ablage legen -> Stempel
async function trayMat(A, ctx){ var id = ctx.item, B = A.npc('branko');
  if (id !== 'fahne' && id !== 'zeitung'){ await B.say(id === 'lieferschein' || id === 'schein_ok' ? 'Lieferscheine prüft der Empfänger, nicht der Ordner.' : 'Das ist kein Material für die Parade.'); return; }
  if (F('flag.stamped')) return showFlag(A, id);
  await A.anim('reachL'); await A.say(id === 'fahne' ? 'Ich lege die Fahne flach in die Ablage. Die Zeitung nach oben.' : 'Ich lege die Zeitung flach in die Ablage.');
  await B.say('Zur Materialprüfung?'); await A.say('Liegt in der richtigen Ablage.'); await B.say('Immerhin.');
  await B.anim('stamp'); A.set('flag.stamped'); MA.UI.refreshBar(); await B.say('Geprüft.');
  var op = await A.choose(['„Jetzt ist es keine Zeitung mehr?“', '„Und wenn jemand die Rückseite sieht?“']);
  if (op.id === 0){ await B.say('Jetzt ist es geprüftes Material.'); await A.say('Das ging schneller als Lesen.'); await B.say('Dafür ist die Prüfung auch nicht da.'); }
  else { await B.say('Halte die geprüfte Seite nach vorne.'); await A.say('Eine sehr einseitige Lösung.'); }
  if (A.has('fahne')) A.note('n_fahne', 'done'); }
async function trayWrong(A, ctx, which){ var B = A.npc('branko');
  if (which === 'liste'){ await B.say(ctx.item === 'auftrag' || ctx.item === 'lieferschein' ? 'Das ist ein Auftrag. Keine Liste.' : 'Das ist keine Liste.'); }
  else { await B.say('Sonstiges wird nicht geprüft. Sonstiges ist sonstig.'); } }

// ---------------------------------------------------------------- Jasna
async function jasnaTalk(A){ var J = A.npc('jasna');
  if (A.first('jasna.s05')){ await J.say('Drei Reihen. Vier Plätze.'); await A.say('Du klingst schon wie Branko.'); await J.say('Ich möchte nur einmal fertig werden.'); await A.say('Warum klappt es nicht?');
    await J.say('Weil auf dem Papier niemand sagt, dass er lieber neben Dragan stehen möchte.'); await A.say('Und wo steht Dragan?'); await J.say('Nicht da, wo er soll.'); }
  await A.menu(function(){ return [
    { t: 'Kann ich den Plan abzeichnen?', if: !F('plan.ok') && (A.has('karton') || MA.noteOpen('n_kiste')), go: async function(){ await J.say('Ja. Lass III/4 frei.'); await A.say('Warum?'); await J.say('Der Platz ist belegt. Nur gerade nicht mit Dragan.'); A.set('plan.ok'); } },
    { t: 'Vielleicht müsste man die Kinder festbinden.', once: 'j.bind', go: async function(){ await J.say('Dann stimmen die Reihen. Aber der Lehrer bekommt sie nicht mehr ins Klassenzimmer.'); await A.say('Das wäre ein zweiter Vorteil.'); await J.say('Für dich vielleicht.'); } },
    { t: 'Wo ist Dragan denn?', go: async function(){ await J.say('An der Brücke, schätze ich. Er hat heute früh seinen Ball über die Brüstung gekickt. „Zur Probe“, sagt er.'); await A.say('Zur Probe wofür?'); await J.say('Fürs Wegsein.'); A.set('know.dragan'); A.note('n_dragan'); } },
    { t: 'Du liest die Zeile im Rahmen vor.', if: F('probe.failed1') && !F('role.jasna'), go: async function(){ await J.say('Nur die Zeile?'); await A.say('Nur die Zeile.'); await J.say('Und wenn der Lehrer dazwischenredet?'); await A.say('Dann warten wir, bis er fertig ist.'); await J.say('Gut. Das kann ich schon.'); A.set('role.jasna'); } },
    { t: 'Kommt ihr mit zu Dedo? Wir rufen etwas anderes.', if: F('probe.ok') && (F('dedo.deal') || A.has('tafel')) && !F('ad.done'), go: adStart },
    { t: 'Wofür brauchst du das Raster? – Schon gut.', if: false },
    { t: 'Bis gleich.', bye: true }
  ]; }); }
async function adStart(A){ var J = A.npc('jasna'), N = A.npc('nedim');
  if (!F('dedo.deal')){ await A.say('Erst muss Dedo einverstanden sein. Sonst ruft die Klasse für einen Stand, der nichts davon weiß.'); return; }
  if (!A.has('tafel')){ await J.say('Was sollen wir denn rufen? Es steht ja nirgends.'); await A.say('Ich schreibe es auf.'); await J.say('Wir lesen, was dort steht. Das haben wir gelernt.'); return; }
  if (!A.has('skizze')){ await A.say('Halt. Ich weiß noch nicht genau, welcher Knopf passt. Dann rufen wir umsonst.'); return; }
  if (!F('coat.known')){ await A.say('Und wer soll kaufen? Ich sollte erst wissen, wem ein Knopf fehlt.'); return; }
  await J.say('Für Mantelknöpfe?'); await N.say('Das ist die langweiligste Parole bisher.'); await A.say('Diesmal muss sie nur jemand hören, der einen braucht.'); await J.say('Das ist wenigstens ein verständliches Ziel.');
  return MA.adScene(A); }

// ---------------------------------------------------------------- Nedim und die Murmel
async function nedimTalk(A){ var N = A.npc('nedim');
  if (F('marble.out')){ await A.menu(function(){ return [
      { t: 'Du achtest darauf, dass alle auf das Zeichen warten.', if: F('probe.failed1') && !F('role.nedim'), go: nedimRole },
      { t: 'Danke für die Hilfe an der Bank.', once: 'n.thanks', go: async function(){ await N.say('Sag Dragan, dass ich wusste, wo sie war.'); await A.say('Das sage ich ihm.'); await N.say('Zuerst. Vor dem Rest.'); } },
      { t: 'Wie geht es dir?', go: async function(){ await N.say(A.cycle('nedim.how', ['Ich warte. Das kann ich.', 'Wenn Branko noch einmal zählt, zähle ich mit. Leise.', F('probe.ok') ? 'Ich habe die Pause eingehalten. Ganz allein.' : 'Ich sage diesmal nichts. Ich übe schon.'])); } },
      { t: 'Bis gleich.', bye: true } ]; }); return; }
  if (A.first('nedim.s14')){ await N.say('Ich habe sie nicht verloren.');
    if (F('dragan.met')) await A.say('Dragan sagt, du hast sie verloren.'); else { await A.say('Was hast du nicht verloren?'); await N.say('Dragans Murmel. Die blaue. Er sagt, ich hätte sie verloren.'); }
    await N.say('Sie liegt da unten. In der Fuge unter der Bank. Ich weiß genau, wo.'); await A.say('Dann ist sie nicht verloren, sondern unerreichbar.'); await N.say('Danke. Das klingt besser.');
    A.note('n_murmel'); if (!F('know.dragan')){ await N.say('Dragan ist an der Brücke. Er wartet auf seinen Ball. Und auf die Murmel.'); A.set('know.dragan'); A.note('n_dragan'); } }
  await A.menu(function(){ return [
    { t: 'Du hältst das Bankende. Ich hole sie heraus.', if: !F('nedim.agreed'), go: async function(){ await N.say('Und wenn sie weiter hineinrollt?'); await A.say('Darum bereite ich unten etwas zum Auffangen vor.'); await N.say('Gut. Dragan glaubt mir beim zweiten Mal gar nichts mehr.'); A.set('nedim.agreed');
        if (F('heft.placed')) await nedimLift(A); else await N.say('Sag Bescheid, wenn unten etwas liegt.'); } },
    { t: 'Unten liegt jetzt etwas. Heb an.', if: F('nedim.agreed') && !F('nedim.holds') && F('heft.placed'), go: nedimLift },
    { t: 'Ich sage Dragan, dass du geholfen hast.', once: 'n.tell', go: async function(){ await N.say('Auch, dass ich wusste, wo sie war?'); await A.say('Das scheint dir wichtig zu sein.'); await N.say('Das ist der einzige Teil, bei dem ich recht habe.'); } },
    { t: 'Du achtest darauf, dass alle auf das Zeichen warten.', if: F('probe.failed1') && !F('role.nedim'), go: nedimRole },
    { t: 'Bis gleich.', bye: true }
  ]; }); }
async function nedimRole(A){ var N = A.npc('nedim'); await A.say('Du achtest darauf, dass alle auf das Zeichen warten.'); await N.say('Auch du?'); await A.say('Ich gebe das Zeichen.'); await N.say('Dann kann ich diesmal nicht an allem schuld sein.'); await A.say('Darum geht es nicht.'); await N.say('Für mich ein bisschen.'); A.set('role.nedim'); }
async function nedimLift(A){ var N = A.npc('nedim'); await N.walk(K.bench[0]+K.bench[2]+6, K.bench[1]+9); N.face('L'); N.freeze(KIDLIFT); A.set('nedim.holds');
  await N.say('So hoch?'); await A.say('So halten.'); await N.say('Das ist schwerer.'); return 'bye'; }
async function benchUse(A, ctx){ var id = ctx.item, N = A.npc('nedim');
  if (F('marble.out')){ await A.say('Die Fuge ist leer. Die Bank ist wieder nur eine Bank.'); return; }
  if (id === 'heft'){ A.take('heft'); A.set('heft.placed'); await A.anim('pickup'); await A.say('Das Heft bleibt hier als Auffangfläche. Am Auslauf kann ich es wieder nehmen.');
    if (F('nedim.agreed') && !F('nedim.holds')) await nedimLift(A); return; }
  if (id === 'loeffel' || id === 'loeffel_k'){
    if (id === 'loeffel_k') await A.say('Der Hals ist frei. Der Kleister bleibt in der Mulde.');
    if (!F('heft.placed') || !F('nedim.holds')){ if (F('nedim.agreed') && !F('heft.placed')) await N.say('Und wohin soll die Murmel? Ich möchte sie nicht noch genauer verlieren.'); else await A.say('Wenn ich sie so anstoße, rollt sie unter die Bank. Das Ende müsste hoch, und unten müsste etwas liegen.'); return; }
    await A.anim('reachL'); await A.say('Nur noch einen Moment.'); await A.wait(400);
    A.set('marble.out'); A.set('heft.placed', false); A.set('nedim.holds', false); N.freeze(null); A.give('murmel'); A.give('heft'); A.note('n_murmel', 'done');
    await A.say('Sie rollt die Fuge entlang, über die Kante – ins Heft.');
    await N.say('Sag ihm, dass ich sie nicht noch einmal für ihn verstecke.'); await A.say('Ich dachte, du hast sie nicht versteckt.'); await N.say('Dann sag ihm das auch.'); return; }
  if (id === 'bleistift'){ await A.say('Der Bleistift bricht eher, als dass er hebelt.'); return; }
  if (id === 'stecken' || id === 'fahne'){ await A.say('Zu dick für die Fuge.'); return; }
  await A.say('Damit komme ich nicht in die Fuge.'); }
async function benchLook(A){ if (F('marble.out')){ await A.say('Eine Bank. Ohne Murmel ist sie ziemlich gewöhnlich.'); return; }
  await A.say('In der Fuge unter der Sitzfläche glänzt etwas Blaues. Zu weit drin für meine Finger.'); await A.say('Die Fuge läuft schräg zum rechten Ende der Bank aus.');
  if (F('heft.placed')) await A.say('Am Auslauf liegt mein Heft.'); }
async function benchTake(A){ if (F('heft.placed') && !F('marble.out')){ A.give('heft'); A.set('heft.placed', false); if (F('nedim.holds')){ A.set('nedim.holds', false); A.npc('nedim').freeze(null); await A.npc('nedim').say('Gibst du auf?'); await A.say('Ich brauche meine Sachen kurz woanders.'); await A.npc('nedim').say('Gut. Die Murmel läuft nicht weg.'); } else await A.say('Ich nehme mein Heft wieder.'); return; }
  if (!F('marble.out')) await A.say('Meine Finger sind zu dick für die Fuge. Ich bräuchte etwas Schmales mit einem Hals.'); else await A.say('Die Bank bleibt hier. Sie ist angeschraubt, glaube ich.'); }

// ---------------------------------------------------------------- Probetafel
async function boardLook(A){ if (F('board.word') && F('board.frame')) await A.say('„Živio drug Tiko!“ im Rahmen. „Laut und deutlich“ steht jetzt draußen, wo es hingehört.');
  else await A.say('Die Probetafel: „Živio drugi Tiko!“ und darunter „Laut und deutlich!“ – beides im Rahmen.');
  if (!F('probe.failed1')) await A.say('Die Klasse übt das schon seit gestern.'); }
async function boardUse(A, ctx){ if (ctx && ctx.item && ctx.item !== 'vorlage'){ await A.say(ctx.item === 'kreide' ? 'Ohne zu wissen, was richtig ist, schreibe ich nichts an die Tafel.' : 'Das hilft der Tafel nicht.'); return; }
  if (!A.has('vorlage')){ await A.say('Was falsch ist, sieht man erst, wenn man weiß, was richtig ist.'); return; }
  var r = await A.puzzle('tafel', {}); if (F('board.word') && F('board.frame')) await A.say('Jetzt steht auf der Tafel, was auf dem Papier steht. Fehlt nur noch, wer was tut.'); }

// ---------------------------------------------------------------- Raum
MA.defineRoom({ id: 'hof', name: 'Schulhof', width: K.W,
  paint: MA.ART.hof.paint, layers: MA.ART.hof.layers,
  walk: [[[4, 104], [84, 104], [86, 99], [106, 99], [108, 104], [396, 104], [396, 142], [4, 142]]],
  holes: [[136, 102, 52, 14], [262, 114, 60, 8], [12, 112, 56, 8], [188, 112, 36, 6]],
  start: [176, 132, 'L'],
  entries: { klasse: [95, 108, 'F'], markt: [360, 112, 'L'], map: [330, 120, 'L'] },
  actors: function(S, G){ var a = [];
    a.push({ id: 'branko', ch: 'branko', x: 162, y: 108, f: 'F', idle: 'clipF', hgt: 50 });
    a.push({ id: 'jasna', ch: 'jasna', x: 232, y: 117, f: 'L', hgt: 42 });
    if (G.flags['nedim.holds']) a.push({ id: 'nedim', ch: 'nedim', x: K.bench[0]+K.bench[2]+6, y: K.bench[1]+9, f: 'L', hgt: 40 });
    else a.push({ id: 'nedim', ch: 'nedim', x: 300, y: 119, f: 'L', hgt: 40 });
    a.push({ id: 'kidA', ch: 'kidA', x: 80, y: 121, f: 'F', idle: 'flagF', hgt: 42 });
    a.push({ id: 'kidB', ch: 'kidB', x: 104, y: 125, f: 'F', idle: 'flagF', hgt: 42 });
    a.push({ id: 'kidC', ch: 'kidC', x: 126, y: 119, f: 'F', idle: 'flagF', hgt: 40 });
    return a; },
  load: function(A){ if (MA.flag('nedim.holds')){ var n = MA.ACT.nedim; if (n) n.frozen = KIDLIFT; } },
  hotspots: [
    { id: 'tuer', name: 'Schulhaustür', r: [84, 66, 22, 38], st: [95, 106, 'B'], exit: { to: 'klasse' } },
    { id: 'tor', name: 'Schultor', r: [346, 62, 40, 42], st: [362, 110, 'R'], exit: { to: 'markt', can: async function(A){ return MA.gateCheck(A); } } },
    { id: 'branko', npc: 'branko', hgt: 50, talk: brankoTalk, look: 'Branko. Armbinde, Klemmbrett und keine Zweifel.',
      on: { fahne: function(A){ return showFlag(A, 'fahne'); }, zeitung: function(A){ return showFlag(A, 'zeitung'); }, auftrag: async function(A){ await A.npc('branko').say('Ein Auftrag. Unterschrieben. Damit darfst du gehen, nicht stehen.'); },
        ausweis: async function(A){ await A.npc('branko').say('Ein Ausweis gehört in die Aufstellung, nicht auf meinen Tisch.'); }, '*': async function(A){ await A.npc('branko').say('Das steht nicht auf meiner Liste.'); } } },
    { id: 'tisch', name: 'Brankos Tisch', r: [136, 100, 52, 14], pri: 2, look: 'Drei Ablagen – LISTE, MATERIALPRÜFUNG, SONSTIGES – und ein Stempel, der nur auf Papier wartet, das richtig liegt.' },
    { id: 'abl_liste', name: 'Ablage „Liste“', r: [138, 94, 14, 8], st: [146, 124, 'B'], look: 'Ablage LISTE. Darin liegt nichts. Die Liste hält Branko selbst.', on: { '*': function(A, c){ return trayWrong(A, c, 'liste'); } } },
    { id: 'abl_mat', name: 'Ablage „Materialprüfung“', r: [154, 94, 14, 8], st: [160, 124, 'B'], look: 'Ablage MATERIALPRÜFUNG. Was hier liegt, wird gestempelt.', on: { '*': trayMat } },
    { id: 'abl_sonst', name: 'Ablage „Sonstiges“', r: [170, 94, 14, 8], st: [176, 124, 'B'], look: 'Ablage SONSTIGES. Ein Radiergummi und ein Knopf ohne Mantel.', on: { '*': function(A, c){ return trayWrong(A, c, 'sonst'); } } },
    { id: 'stempel', name: 'Stempel', r: [180, 92, 8, 9], st: [180, 124, 'B'], look: 'Ein Stempel mit Kissen. Er sagt GEPRÜFT, wenn Branko es will.', take: async function(A){ await A.npc('branko').say('Der Stempel bleibt beim Ordner.'); } },
    { id: 'plan', name: 'Aufstellungsplan', r: [190, 70, 32, 26], st: [206, 120, 'B'],
      look: async function(A){ await A.say('Brankos Aufstellungsplan: drei Reihen, vier Plätze, in jedem Feld ein Name. Bei III/4 steht Dragan, rot unterstrichen.'); if (A.has('karton') && !A.has('raster')) await A.say('Drei Reihen, vier Plätze. Wie Maras Kiste.'); },
      on: { karton: async function(A){ if (!F('plan.ok')){ await A.npc('jasna').say('Finger weg vom Plan. Der ist gerade richtig.'); return; }
          await A.anim('reachM'); A.swap('karton', 'raster'); A.set('raster.done'); await A.say('Ich halte den Karton daneben und zeichne das Raster ab. Drei Reihen, vier Plätze. III/4 lasse ich frei.');
          var J = A.npc('jasna'); await J.say('Wofür brauchst du das Raster?'); await A.say('Für etwas, das an seinem Platz bleibt.'); await J.say('Sag mir hinterher, wie du es überredet hast.'); },
        raster: 'Das Raster habe ich schon.', '*': async function(A){ await A.npc('jasna').say('Finger weg vom Plan. Der ist gerade richtig.'); } } },
    { id: 'jasna', npc: 'jasna', hgt: 42, talk: jasnaTalk, look: 'Jasna. Zwei Zöpfe, eine Pioniermütze und den Plan im Kopf.' },
    { id: 'nedim', npc: 'nedim', hgt: 40, talk: nedimTalk, look: 'Nedim. Er sieht aus, als hätte er gleich etwas falsch gemacht. Er hat noch nichts gemacht.' },
    { id: 'bank', name: 'Bank', r: [262, 108, 60, 14], st: [292, 132, 'B'], tp: [290, 114], look: benchLook, take: benchTake, use: 'Ich setze mich nicht. Wer sitzt, wird noch leichter übersehen.', on: { '*': benchUse } },
    { id: 'tafel', name: 'Probetafel', r: [12, 64, 52, 32], st: [38, 124, 'B'], look: boardLook, read: boardLook, use: function(A){ return boardUse(A, null); }, on: { '*': boardUse } },
    { id: 'kinder', name: 'Klassenkameraden', r: [70, 80, 66, 46], pri: 3, look: 'Meine Klasse. Saubere Hände, ordentliche Hemden, Fähnchen. Sie wissen, wo sie stehen.',
      talk: async function(A){ await A.line('kind', A.cycle('kids', ['Hast du kein Fähnchen? Branko gibt dir keins, oder?', 'Mein Vater sagt, Tiko winkt nur zurück, wenn man richtig winkt.', 'Wenn das noch lange dauert, wird mein Hemd wieder dreckig.', 'Dragan ist schon weg. Branko hat es noch nicht gemerkt.', F('probe.ok') ? 'Diesmal haben wir nur das Richtige gerufen. Komisches Gefühl.' : 'Wir sollen rufen, was auf der Tafel steht. Das tun wir doch.'])); } },
    { id: 'banner', name: 'Transparent', r: [22, 46, 150, 10], look: '„ŽIVIO DRUG TIKO“ – weiße Buchstaben auf rotem Stoff. Jemand hat sehr gerade geschrieben.', read: '„ŽIVIO DRUG TIKO“. Drug, nicht drugi. Wer das Transparent gemalt hat, hatte die richtige Vorlage.' },
    { id: 'fahne_haus', name: 'Fahne', r: [100, 2, 18, 12], look: 'Die Fahne über der Tür: blau, weiß, rot, ein roter Stern. Sie bewegt sich nur, wenn Wind ist. Wie Branko.' },
    { id: 'feige', name: 'Feigenbaum', r: [234, 14, 50, 56], look: 'Ein Feigenbaum über der Hofmauer. Die Feigen sind noch grün. Wie ich, sagt der Lehrer, wenn er gute Laune hat.' },
    { id: 'minarett', name: 'Minarett', r: [328, 2, 12, 46], look: 'Das Minarett hinter den Dächern. Es steht da, als hätte es nie auf eine Liste gemusst.' },
    { id: 'schulhaus', name: 'Schulhaus', r: [0, 6, 84, 86], pri: 9, look: 'Das Schulhaus. Ocker, noch aus der Zeit, als hier andere Fahnen hingen. Oben ist mein Klassenzimmer.' }
  ]
});
// Schultor: ohne Auftrag hält Branko M. zurück
MA.gateCheck = async function(A){ var B = A.npc('branko');
  if (!F('list.fixed')){ await B.say('Bleib bei deiner Gruppe.'); await A.say('Welche ist das?'); await B.say('Genau das versuchen wir festzustellen.'); return false; }
  if (A.first('!gate.ok')){ await B.say('Wohin?'); await A.say('Zum Markt. Abholauftrag.'); await B.say('Schriftlich?'); await A.say('Mit Unterschrift.'); await B.say('Dann geh. Zurück vor der Aufstellung.'); }
  return true; };
})(MA);
