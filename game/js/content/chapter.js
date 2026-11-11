/* ===== M. Adventure – content/chapter.js =====
   Kapitel Mostar 1955: Einstieg (Karte, Erzählzeilen S01, Brankos Auftaktdialog), Stadtplan-Orte, Reiselinie, Abschluss. */
(function(MA){
'use strict';
function F(k){ return MA.flag(k); }

// ---------------------------------------------------------------- Stadtplan: nur bekannte Orte; gesperrte mit Grund
MA.MAP.locs = [
  { id: 'schule', name: 'Schule', x: 92, y: 52, room: 'hof', rooms: ['hof', 'klasse', 'fenster'], entry: [330, 120, 'L'], known: function(){ return true; },
    open: function(G){ return true; } },
  { id: 'markt', name: 'Markt', x: 176, y: 74, room: 'markt', entry: [210, 124, 'F'], known: function(G){ return !!G.flags['list.fixed']; },
    open: function(G){ if (G.flags['crate.carry'] && G.flags['sandal'] !== 'fixed') return 'Mit der Kiste und dieser Sandale komme ich nicht weit.'; return true; } },
  { id: 'most', name: 'Stari Most', x: 236, y: 98, room: 'most', entry: [40, 92, 'R'], known: function(G){ return !!G.flags['know.dragan'] || !!G.flags['seen.most']; }, open: function(G){ return !!G.flags['list.fixed'] ? true : 'Ohne Auftrag darf ich nicht vom Schulhof.'; } },
  { id: 'sperre', name: 'Straßensperre', x: 120, y: 104, room: 'sperre', entry: [30, 124, 'R'], known: function(G){ return !!G.flags['seen.sperre'] || !!G.flags['list.fixed'] && !!G.flags['seen.markt']; }, open: function(G){ return true; } },
  { id: 'parade', name: 'Paradestraße', x: 66, y: 120, room: 'parade', known: function(G){ return !!G.flags['seen.sperre']; }, open: function(G){ return 'Nur durch Jovans Absperrung.'; } }
];
MA.onRoomChange = function(id){ MA.set('seen.'+id); if (id === 'markt') MA.set('seen.markt'); };

// Reiselinie der Lebensstationen (Abschlussbild): nur Mostar ist in dieser Fassung spielbar
MA.JOURNEY = [ { t: 'Podaca 2018' }, { t: 'Rosko Polje 1953' }, { t: 'Mostar 1955', done: true, now: true }, { t: 'Marine' }, { t: 'Sarajevo 1970er' }, { t: 'Deutschland' }, { t: 'Podaca' } ];

// ---------------------------------------------------------------- Einstieg
MA.startChapter = function(A){ var E = MA.E;
  MA.GS.pos = { x: 176, y: 132, f: 'L' }; MA.loadRoom('hof'); E.screen = 'game'; MA.UI.refreshBar();
  MA.GS.inv = ['heft', 'bleistift'];
  document.getElementById('fade').style.opacity = '1';
  MA.scene(async function(){
    await A.card({ kicker: 'M. Adventure', title: 'Mostar, 1955', text: ['Ich war dreizehn und in Mostar noch neu. Ich kam aus Rosko Polje, wo es mehr Steine gab als Schuhe.', 'Im Klassenbuch stand ich ganz unten, nachgetragen, mit anderer Tinte.'] });
    await A.fade(0, 700);
    var lines = ['Der Lehrer hatte gesagt, wir würden an diesem Tag Geschichte erleben.', 'Dragan wollte wissen, ob sie hinterher abgefragt würde.', 'Darauf gab es keine Antwort.',
      'Wir sollten uns vor der Schule einfinden. Saubere Hände, ordentliches Hemd. Begeisterung wurde vorausgesetzt. Fähnchen sollten ausgegeben werden.',
      'Auf dem Markt räumte Mara ihren Arbeitsplatz frei. Für die Parade brauchte man Getränke, Platz und jemanden, der hinterher wieder aufräumte.',
      'Dedo rückte seinen Stand ein Stück vor. Wenn die Leute schon stehen bleiben mussten, sollten sie wenigstens etwas zu sehen bekommen.',
      'Mein Plan war einfach: bei meiner Klasse bleiben, winken und anschließend mit den anderen zurückgehen.', 'Es scheiterte am Dastehen.'];
    for (var i = 0; i < lines.length; i++) await A.narrate(lines[i], { hold: true });
    await A.walk(166, 126); await A.face('B');
    var B = A.npc('branko');
    await B.say('Name?'); await A.say('M.'); await B.say('Steht nicht hier.'); await A.say('Ich stehe hier.'); await B.say('Ich rede mit der Liste.'); await A.say('Soll ich später wiederkommen?'); await B.say('Bleib stehen.');
    var op = await A.choose(['„Vielleicht stehe ich auf der Rückseite.“', '„Kannst du mich probeweise mitzählen?“', '„Ich gehe zum Lehrer. Der kennt mich.“']);
    if (op.id === 0){ await B.say('Auf der Rückseite steht nichts.'); await A.say('Dann ist da doch Platz.'); await B.say('Für nichts. Nicht für dich.'); }
    else if (op.id === 1){ await B.say('Und wenn es nachher einer zu viel ist?'); await A.say('Dann ziehst du mich wieder ab.'); await B.say('Menschen zieht man nicht einfach ab.'); await A.say('Mich hast du gar nicht erst dazugenommen.'); }
    else { await B.say('Dann soll er es bestätigen.'); await A.say('Dass er mich kennt?'); await B.say('Dass du hierhergehörst.'); }
    await A.say('Und bis dahin?'); await B.say('Bleib bei deiner Gruppe.'); await A.say('Welche ist das?'); await B.say('Genau das versuchen wir festzustellen.');
    if (op.id !== 2) await A.say('Der Lehrer kennt mich. Er ist oben im Klassenzimmer.');
    A.note('n_liste'); A.set('intro.done'); A.save();
  });
};

// ---------------------------------------------------------------- Abschluss
MA.finishChapter = async function(A){ var ms = MA.GS.playMs; MA.markDone(ms); MA.GS.ended = true; MA.deleteSave('auto');
  await MA.UI.showEnd({ playMs: ms }); MA.UI.openTitle(); };
})(MA);
