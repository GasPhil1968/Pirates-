/* ===== M. Adventure – content/most.js =====
   Stari Most: Dragan (S15 Tausch und Abmachung, S29 Ballbergung, Ballübergabe), Ball auf dem Gesims, Brüstung, Neretva. */
(function(MA){
'use strict';
var K = MA.ART.most.K, deck = K.deck;
function F(k){ return MA.flag(k); }
function walkBand(){ var top = [], bot = []; for (var x = 40; x <= 360; x += 10){ top.push([x, Math.round(deck(x))-6]); bot.unshift([x, Math.round(deck(x))-1]); } return [top.concat(bot)]; }
var HOLD = M.poseS({ h: [-2, -19], ln: -2, nf: [4, 0, 'h'], ff: [-4, 0, 'f'], nh: [7, -24], fh: [6, -23] });

async function draganTalk(A){ var D = A.npc('dragan');
  if (A.first('dragan.hi')){ await D.say('Wenn du mich zurückholen sollst: Ich bin krank.'); await A.say('Wovon?'); await D.say('Von Paraden.'); A.set('dragan.met'); A.set('know.dragan'); A.note('n_dragan'); }
  await A.menu(function(){ return [
    { t: 'Was machst du hier?', if: !F('ball.out'), go: async function(){ await D.say('Ich schaue meinem Ball beim Liegen zu. Da unten, auf dem Gesims. Eine Armlänge zu weit.'); await A.say('Und darunter?'); await D.say('Die Neretva. Die gibt nichts zurück.'); A.note('n_ball'); } },
    { t: 'Deine Murmel.', if: A.has('murmel'), go: s15 },
    { t: 'Nedim weiß, wo deine Murmel ist.', if: MA.noteOpen('n_murmel') && !A.has('murmel'), once: 'd.nedim', go: async function(){ await D.say('Nedim wusste angeblich die ganze Zeit, wo sie war. Wissen ist kein Haben.'); } },
    { t: 'Du willst wirklich nicht zur Parade?', once: 'd.place', go: async function(){ await D.say('Ich will Fußball spielen.'); await A.say('Dafür brauchst du einen Ball.'); await D.say('Du hast das Problem schnell erfasst.'); await A.say('Und einen Weg, auf dem dich niemand wieder einsammelt.'); await D.say('Zwei Probleme. Du wirst besser.'); A.note('n_ball'); } },
    { t: 'Ich bringe dich mit dem Ball hinaus. Du überlässt mir deinen Platz.', if: F('branko.noPlace') && !F('deal.dragan'), go: deal },
    { t: 'Hältst du die Leine?', if: F('net.hung') && !F('dragan.holds') && !F('ball.out'), go: s29 },
    { t: 'Dein Ball.', if: A.has('ball'), go: giveBall },
    { t: 'Gibst du mir den Ausweis schon?', if: F('deal.dragan') && !F('escape.done'), go: async function(){ await D.say('Wir haben einen Tausch vereinbart, keine Anzahlung.'); } },
    { t: 'Wie kommst du eigentlich hinaus?', if: F('deal.dragan'), go: route },
    { t: 'Bis gleich.', bye: true }
  ]; }); }
async function s15(A){ var D = A.npc('dragan');
  await A.say('Deine Murmel.'); await D.say('Die blaue!'); await A.say('Du klingst überrascht.'); await D.say('Nedim wusste angeblich die ganze Zeit, wo sie war.'); await A.say('Er hat geholfen.'); await D.say('Dann kann ich ihm einen halben Dank geben.');
  await D.say('Was willst du dafür? Ich habe nur die Zeitung. Für die Ergebnisse.'); await A.say('Gib mir erst die ganze Zeitung.');
  A.take('murmel'); A.give('zeitung'); A.set('marble.given'); MA.touch();
  await D.say('Die Ergebnisse stehen hinten.'); await A.say('Vorne ist auch etwas.'); await D.say('Ja. Der Rest.'); A.save(); }
async function route(A){ var D = A.npc('dragan'); await D.say('Durch die Passage neben Jovans Sperre, durch das Hintertor der Schule, dann am Fluss entlang zum Platz.');
  await A.say('Und?'); await D.say('Das Tor ist innen verriegelt. Und Jovan schaut genau auf die Passage. Er hat Augen wie eine Liste.'); A.note('n_tor'); A.note('n_jovan'); }
async function deal(A){ var D = A.npc('dragan');
  if (!F('marble.given')){ await D.say('Du willst ein Geschäft? Bring erst meine Murmel. Bei Nedim liegt sie ja angeblich.'); return; }
  await A.say('Ich bringe dich mit dem Ball hinaus. Du überlässt mir deinen Platz.'); await D.say('III/4.'); await A.say('Und den Ausweis.'); await D.say('Wenn ich mit dem Ball draußen bin.'); await A.say('Abgemacht.'); await D.say('Lass mich nicht ohne Ball fliehen. Dann müsste ich freiwillig wiederkommen.');
  A.set('deal.dragan'); A.note('n_abmachung'); A.note('n_platz', 'done'); await route(A);
  if (F('ball.returned')){ await toPassage(A); A.save(); return 'bye'; } A.save(); }
async function s29(A){ var D = A.npc('dragan');
  await D.say('Du lässt ihn nicht ins Wasser fallen?'); await A.say('Deshalb hängt das Netz darunter.'); await D.say('Nedim hatte auch einen Plan mit der Murmel.'); await A.say('Nedim hat am Ende geholfen.'); await D.say('Ja.'); await A.wait(600);
  await D.say('Wo soll ich halten?'); await A.say('Hier. Nicht nachgeben, bis ich es sage.');
  var op = await A.choose(['„Wir machen das langsam.“', '„Du hältst. Ich lenke.“']);
  if (op.id === 0){ await D.say('Gut.'); await A.say('Du bist sonst nicht für langsam.'); await D.say('Sonst liegt mein Ball nicht über einem Fluss.'); }
  else { await D.say('Wie beim Fußball. Nur andersherum.'); await A.say('Und ohne Treten.'); await D.say('Sehr andersherum.'); }
  await D.walk(K.ball[0]-14, Math.round(deck(K.ball[0]-14))-2); D.face('R'); D.freeze(HOLD); A.set('dragan.holds'); return 'bye'; }
async function nudge(A, ctx){ var D = A.npc('dragan');
  if (F('ball.out')){ await A.say('Der Ball ist oben. Das Gesims ist wieder nur ein Gesims.'); return; }
  if (!F('net.hung')){ await A.say('Bewegen könnte ich ihn. Wiederfinden wäre schwieriger.'); return; }
  if (!F('dragan.holds')){ await A.say('Das Netz hängt. Aber einer muss die Leine halten, sonst fängt es nur Luft.'); return; }
  await A.anim('reachL'); await A.say(ctx.item === 'fahne' ? 'Ich schubse den Ball mit dem Fahnenstock vom Gesims. Die Fahne hat ihren ersten Einsatz.' : 'Ich schubse den Ball mit dem Stecken vom Gesims.');
  await A.wait(300); A.set('ball.out'); A.set('net.hung', false); MA.touch(); await A.say('Er fällt – ins Netz.'); await A.say('Jetzt ziehen!');
  D.freeze(null); A.set('dragan.holds', false); await D.anim('pull');
  A.give('netz'); A.give('leine'); A.give('ball');
  await D.say('Du hast ihn!'); await A.say('Wir haben ihn.'); await D.say('Ja. Stimmt.'); A.save(); }
async function giveBall(A){ var D = A.npc('dragan');
  await A.say('Dein Ball.'); A.take('ball'); A.set('ball.returned'); A.note('n_ball', 'done'); MA.touch(); D.hold('ball');
  await D.say('Danke.'); await A.say('Gar nichts hinterher?'); await D.say('Was?'); await A.say('Ein Geschäft. Eine Forderung.'); await D.say('Ich kann ihn wieder verlieren.'); await A.say('Lass uns bei Danke bleiben.');
  if (F('deal.dragan')){ await toPassage(A); return 'bye'; } await D.say('Jetzt fehlt nur noch ein Weg, auf dem mich niemand wieder einsammelt.'); }
async function toPassage(A){ var D = A.npc('dragan'); await D.say('Ich warte an der Passage neben der Sperre. Sag Bescheid, wenn der Weg frei ist.'); A.set('dragan.atPassage'); MA.touch();
  if (MA.ACT.dragan){ await D.walk(40, Math.round(deck(40))-2); A.despawn('dragan'); } }

MA.defineRoom({ id: 'most', name: 'Stari Most', width: K.W,
  paint: MA.ART.most.paint, layers: MA.ART.most.layers, props: MA.ART.most.props, dynamic: MA.ART.most.dynamic,
  walk: walkBand(), start: [56, Math.round(deck(56))-3, 'R'], entries: { markt: [52, Math.round(deck(52))-3, 'R'], map: [52, Math.round(deck(52))-3, 'R'] },
  actors: function(S, G){ if (G.flags['dragan.atPassage'] || G.flags['escape.done']) return []; return [{ id: 'dragan', ch: 'dragan', x: G.flags['dragan.holds'] ? K.ball[0]-14 : 236, y: Math.round(deck(G.flags['dragan.holds'] ? K.ball[0]-14 : 236))-2, f: 'R', hgt: 42, idle: G.flags['ball.returned'] ? 'ballS' : null }]; },
  load: function(){ if (MA.flag('dragan.holds') && MA.ACT.dragan) MA.ACT.dragan.frozen = HOLD; if (MA.flag('ball.returned') && MA.ACT.dragan) MA.ACT.dragan.item = 'ball'; },
  leave: async function(A){ if (F('net.hung') && !F('ball.out')){ A.set('net.hung', false); A.set('dragan.holds', false); A.give('netzleine'); await A.say('Ich ziehe das Netz wieder hoch. Allein hängt es nur herum.'); } },
  enter: async function(A){ if (A.first('most.first')) await A.say('Die Stari Most. Von hier oben ist die Neretva grün wie eine Flasche, die keiner verpackt hat.'); },
  hotspots: [
    { id: 'west', name: 'Zurück zum Markt', r: [0, 30, 34, 70], st: [44, Math.round(deck(44))-3, 'L'], exit: { to: 'markt' } },
    { id: 'dragan', npc: 'dragan', hgt: 42, talk: draganTalk, look: 'Dragan. Hemd halb aus der Hose, Knie aufgeschürft, Blick auf den Ball.',
      on: { murmel: s15, ball: giveBall, netzleine: 'Erst muss das Netz hängen. Dann soll er halten.', zeitung: async function(A){ await A.npc('dragan').say('Behalt sie. Die Ergebnisse kenne ich auswendig.'); }, '*': async function(A){ await A.npc('dragan').say('Das kann man nicht kicken.'); } } },
    { id: 'ball', name: 'Dragans Ball', r: [K.ball[0]-5, K.ball[1]-5, 10, 10], st: [K.ball[0]+8, Math.round(deck(K.ball[0]+8))-3, 'L'], vis: function(S, G){ return !G.flags['ball.out']; },
      look: 'Dragans Ball, auf dem Gesims unter der Brüstung. Eine Armlänge zu weit. Darunter nichts als Luft und Neretva.',
      take: 'Meine Arme sind zu kurz. Und die Neretva ist zu lang.', on: { stecken: nudge, fahne: nudge, netzleine: 'Das Netz gehört unter den Ball, nicht auf ihn.', '*': 'Damit erreiche ich ihn nicht.' } },
    { id: 'bruestung', name: 'Brüstung', r: function(){ return [150, Math.round(deck(200))-14, 140, 14]; }, pri: 4, st: [K.ball[0]+4, Math.round(deck(K.ball[0]+4))-3, 'R'],
      look: function(A){ return A.say(F('net.hung') ? 'Über die Brüstung läuft die Leine, darunter hängt das Netz – genau unter dem Ball.' : 'Die Brüstung der Brücke, glatt gesessen von Jahrhunderten. Vor ihr das Gesims, darunter tief die Neretva.'); },
      on: { netzleine: async function(A){ if (F('ball.out')){ await A.say('Der Ball ist schon oben.'); return; } if (F('net.hung')){ await A.say('Das Netz hängt schon.'); return; } await A.anim('reachL'); A.take('netzleine'); A.set('net.hung'); MA.touch(); await A.say('Ich lasse das Netz an der Leine über die Brüstung, bis es genau unter dem Ball hängt.'); await A.say('Jetzt muss einer die Leine halten.'); },
        netz: 'Ohne Leine fällt das Netz hinterher.', leine: 'Eine Leine allein fängt keinen Ball.', '*': 'Das lasse ich nicht über die Brüstung.' } },
    { id: 'gesims', name: 'Gesims', r: function(){ return [60, Math.round(deck(130)), 280, 4]; }, pri: 5, look: 'Ein schmaler Steinvorsprung unter der Brüstung. Für Bälle breit genug. Für Jungen nicht.' },
    { id: 'neretva', name: 'Neretva', r: [120, 116, 160, 28], look: 'Die Neretva. Wer hineinfällt, kommt erst weiter unten wieder heraus – wenn überhaupt.' },
    { id: 'turm', name: 'Brückenturm', r: [366, 20, 34, 100], look: 'Ein Brückenturm. Er bewacht die Brücke seit Jahrhunderten und hat noch nie jemanden gezählt.' }
  ]
});
})(MA);
