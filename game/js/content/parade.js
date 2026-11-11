/* ===== M. Adventure – content/parade.js =====
   Paradestraße: Helfer (S26 Entladen in drei Vierergruppen, Unterschrift) und das Finale (S33 Aufruf, S34 Parade, S35 Entlassung, Abschlusstext). */
(function(MA){
'use strict';
var K = MA.ART.parade.K;
function F(k){ return MA.flag(k); }

// ---------------------------------------------------------------- S26: Lieferung
async function helferTalk(A){ var H = A.npc('helfer');
  if (F('finale')) return;
  if (F('delivered')){ await H.say(A.cycle('h.after', ['Zwölf. Vollständig. Danke noch mal.', 'Die nächste Lieferung kommt schon. Hoffentlich mit so einem wie dir.'])); return; }
  if (!A.has('kiste') && !A.has('kiste_leer')){ await H.say('Hast du etwas für uns?'); return; }
  if (A.first('helfer.s26')){ await H.say('Für uns?'); await A.say('Für die Schulgruppe.'); await H.say('Dann für uns. Stell sie hier ab.'); A.set('crate.down'); return; }
  await A.menu(function(){ return [
    { t: 'Ich lade die nächste Reihe ab.', if: (F('unload') || 0) < 3 && A.has('kiste'), go: unload },
    { t: 'Hier unterschreiben.', go: sign },
    { t: 'Moment.', bye: true } ]; }); }
async function unload(A){ var H = A.npc('helfer'), n = (F('unload') || 0);
  if (!A.has('kiste')){ await A.say('Die Kiste ist leer.'); return; }
  if (!F('crate.down')){ await H.say('Für uns?'); await A.say('Für die Schulgruppe.'); await H.say('Dann für uns. Stell sie hier ab.'); A.set('crate.down'); }
  if (n >= 3){ await A.say('Alle zwölf stehen auf dem Tisch.'); return; }
  await A.anim('reachL'); n++; A.set('unload', n); MA.touch();
  if (n === 1){ await H.say('Vier.'); await A.say('Noch acht.'); await H.say('Gut, dass einer aufpasst.'); }
  else if (n === 2){ await H.say('Acht.'); await A.say('Noch vier.'); await H.say('Jetzt weiß ich, wie das weitergeht.'); }
  else { await A.say('Zwölf.'); await H.say('Vollständig.'); A.swap('kiste', 'kiste_leer'); await sign(A); return 'bye'; } }
async function sign(A){ var H = A.npc('helfer');
  if ((F('unload') || 0) < 3){ await H.say('Ich unterschreibe die Lieferung, nicht die Absicht.'); await A.say('Den Satz könnte Mara gesagt haben.'); await H.say('Dann bring ihr einen unterschriebenen Schein zurück.'); return; }
  if (!A.has('lieferschein')){ await H.say('Unterschrieben habe ich schon.'); return; }
  await A.say('Hier unterschreiben.'); await H.say('Auf der Linie?'); await A.say('Ja.'); await H.say('Du klingst schon wie der Mann an der Schranke.'); await A.say('Ich bin nur auf der Durchreise.');
  A.swap('lieferschein', 'schein_ok'); A.set('delivered'); A.save(); await A.say('Jetzt zurück zu Mara. Mit leerer Kiste und vollem Schein.'); return 'bye'; }

// ---------------------------------------------------------------- Finale
var FORM = [ ['k1', 'kidA', 0, 0], ['k2', 'kidC', 0, 1], ['k3', 'kidB', 0, 2], ['k4', 'kidD', 0, 3], ['jasna', 'jasna', 1, 0], ['k5', 'kidA', 1, 1], ['k6', 'kidD', 1, 2], ['k7', 'kidC', 1, 3], ['k8', 'kidB', 2, 0], ['k9', 'kidC', 2, 1], ['nedim', 'nedim', 2, 2] ];
MA.finale = async function(A){ var E = MA.E;
  await A.fade(1, 500); await A.goto('parade', { fade: false, noEnter: true, x: K.cols[3], y: K.rows[2], f: 'F', noSave: true });
  var me = MA.ACT.m; if (me){ me.idle = 'npflagF'; me.f = 'F'; MA.setIdle(me); }
  A.cam(120); await A.fade(0, 500);
  var B = A.npc('branko'), L = A.npc('lehrer'), J = A.npc('jasna'), N = A.npc('nedim');
  // S33
  await B.say('Fähnchen nach vorne. Nicht die Zeitung.'); await A.say('Das ist dieselbe Fahne.'); await B.say('Dann halte dieselbe Fahne andersherum.');
  await A.wait(500); await B.say('Platz III/4?'); await A.say('Ja.'); await B.say('Wir beginnen.');
  await B.say('Dritte Reihe. Ramić?'); await A.line('kind', 'Hier.'); await B.say('Tomić?'); await A.line('kind', 'Hier.'); await B.say('Nedim?'); await N.say('Hier. Fertig.'); await B.say('Fertig sage ich.');
  for (var guard = 0; guard < 6; guard++){ await B.say('Dragan?');
    var op = await A.choose(['„Hier.“', '„Ich heiße M.“']);
    if (op.id === 0){ await A.say('Hier.'); await B.say('Anwesend.'); break; }
    await A.say('Ich heiße M.'); await B.say('Dann stehst du am falschen Platz.'); await A.say('Auf dem Ausweis steht III/4.'); await B.say('Entscheide dich, wen ich zählen soll.'); }
  await L.say('Und M.? Der Nachtrag.'); await B.say('Fehlt.'); await A.say('Aber ich stehe doch hier.'); await B.say('Dann bist du Dragan. Den habe ich gezählt.'); await A.say('Und mich?'); await B.say('Dich habe ich nicht gezählt.'); await A.say('Kann ich dann gehen?'); await B.say('Natürlich nicht. Dragan muss bleiben.');
  await A.wait(1600);
  // S34
  await J.say('Auf den Einsatz achten.'); await N.say('Diesmal reden wir nicht dazwischen.'); await A.say('Jetzt.');
  kidsIdle('shoutFlag'); await A.kids('Živio drug Tiko!'); kidsIdle('flagWaveF'); await A.wait(700); await L.say('Gut.'); await A.wait(900); await L.say('Sehr gut.'); kidsIdle('flagF');
  await B.say('Wer hat dieses Papier zugelassen?'); await A.say('Der Stempel ist vorne.'); await A.wait(700); await B.say('Dann halte vorne nach vorne.');
  await A.line('dragan', 'Ball!'); E.ballRun = { t0: E.gt }; var Jo = A.spawn({ id: 'jovan', ch: 'jovan', x: 330, y: 104, f: 'L', hgt: 50 }); await Jo.say('Der gehört nicht auf die Route!'); await A.line('dragan', 'Er kann nicht lesen!'); await A.wait(1200); E.ballRun = null;
  var T = A.spawn({ id: 'tiko', ch: 'tiko', x: 420, y: 104, f: 'L', hgt: 50 }); kidsIdle('flagWaveF'); if (me){ me.idle = 'npflagWaveF'; MA.setIdle(me); }
  await T.walk(K.cols[3]+6, 104, { free: true }); T.face('F');
  await T.say('Braver Junge.'); await A.say('Welcher?');
  await T.walk(60, 104, { free: true }); A.despawn('tiko'); kidsIdle('flagF'); if (me){ me.idle = 'npflagF'; MA.setIdle(me); }
  await A.wait(800);
  // S35
  await A.fade(1, 600); A.despawn('jovan'); FORM.forEach(function(f){ if (f[0] !== 'jasna' && f[0] !== 'nedim') A.despawn(f[0]); });
  J.place(150, 132, 'R'); N.place(166, 136, 'R'); if (me){ me.idle = null; MA.setIdle(me); } A.place(206, 128, 'L'); L.place(176, 120, 'R'); B.place(250, 122, 'L'); await A.fade(0, 600);
  await B.say('Vollzählig. Bis auf M.'); await L.say('Ich kümmere mich um ihn.'); await B.say('Vermerken Sie das.'); await A.wait(1200);
  await L.face('R'); await L.say('M.!'); await A.say('Hier.'); await L.say('Ich weiß. Bis morgen.');
  await A.wait(800); await A.fade(1, 900); A.cam(null);
  await A.card({ text: ['Auf Brankos Blatt war ich an diesem Nachmittag nicht da.', 'Mara hatte mich bezahlt. Dedo würde sich an mich erinnern. Dragan hatte seinen Ball.', 'Und der Lehrer musste meinen Namen nicht mehr nachsehen.'] });
  await MA.finishChapter(A); };
function kidsIdle(an){ FORM.forEach(function(f){ var a = MA.ACT[f[0]]; if (a){ a.f = 'F'; a.idle = an; MA.setIdle(a); } }); }

MA.defineRoom({ id: 'parade', name: 'Paradestraße', width: K.W,
  paint: MA.ART.parade.paint, layers: MA.ART.parade.layers,
  walk: [[[4, 102], [396, 102], [396, 142], [4, 142]]], holes: [[18, 98, 74, 14]],
  start: [110, 124, 'L'], entries: { sperre: [110, 124, 'L'], map: [110, 124, 'L'] },
  props: function(view){ var E = MA.E; if (!E.ballRun) return []; return [{ base: 103, draw: function(fb, v){ var t = (v.gt-E.ballRun.t0)/1000, x = 120+t*150-v.cam, y = 101-Math.abs(Math.sin(t*6))*6; if (x < -4 || x > 324) return; fb.ellipse(x, y, 3, 3, function(xx, yy){ return (xx-x)+(yy-y) < -2 ? M.P.s6 : M.P.s4; }); } }]; },
  actors: function(S, G){ var a = [{ id: 'helfer', ch: 'helfer', x: 98, y: 112, f: 'L', hgt: 50 }];
    if (G.flags['finale']){ FORM.forEach(function(f){ a.push({ id: f[0], ch: f[1], x: K.cols[f[3]], y: K.rows[f[2]], f: 'F', idle: 'flagF', hgt: 42 }); });
      a.push({ id: 'branko', ch: 'branko', x: 276, y: 124, f: 'L', idle: 'clipS', hgt: 50 }); a.push({ id: 'lehrer', ch: 'lehrer', x: 150, y: 120, f: 'R', hgt: 50 }); }
    return a; },
  enter: async function(A, from){ if (F('finale')) return; if (A.has('kiste') && A.first('parade.first')) await A.say('Die Paradestraße. Hinter den Seilen warten die Leute. Vor ihnen wartet nichts.'); },
  hotspots: [
    { id: 'zurueck', name: 'Zurück zur Sperre', r: [0, 60, 14, 84], st: [8, 124, 'L'], exit: { to: 'sperre', can: async function(A){ if (A.has('kiste') && !F('delivered')){ await A.say('Erst die Lieferung. Mit der Kiste lässt Jovan mich nicht zweimal durch.'); return false; } return true; } } },
    { id: 'helfer', npc: 'helfer', hgt: 50, talk: helferTalk, look: 'Der Helfer. Bleistift hinter dem Ohr, Gedanken schon bei der nächsten Lieferung.',
      on: { kiste: unload, lieferschein: sign, '*': async function(A){ await A.npc('helfer').say('Das nehme ich nicht an. Ich nehme Flaschen an.'); } } },
    { id: 'tisch', name: 'Getränketisch', r: K.table, st: [56, 124, 'B'], look: function(A){ var n = (F('unload') || 0)*4; return A.say(n ? 'Auf dem Tisch stehen '+n+' von Maras Flaschen.' : 'Ein leerer Tisch für die Getränke.'); },
      use: unload, on: { kiste: unload, '*': 'Das gehört nicht auf den Getränketisch.' } },
    { id: 'markierung', name: 'Kreidemarkierungen', r: K.marks, look: 'Mit Kreide aufs Pflaster gemalt: drei Reihen, vier Plätze, I bis III. Unsere Aufstellung, ohne uns.' },
    { id: 'tribuene', name: 'Tribüne', r: K.tribune, look: 'Die Tribüne. Dort stehen später die Wichtigen und winken zurück.' },
    { id: 'leute', name: 'Zuschauer', r: [0, 80, 400, 18], pri: 9, look: 'Die Zuschauer hinter dem Seil. Sie warten so ordentlich, als stünden sie auf einer Liste.' }
  ]
});
})(MA);
