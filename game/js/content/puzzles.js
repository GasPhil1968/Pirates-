/* ===== M. Adventure – content/puzzles.js =====
   Nahansichten mit eigener Handhabung: Durchschlag (Kohlepapier), Probetafel (Wortlaut und Rahmen), Knopfwahl.
   Jede Ebene zeichnet in einen Palettenpuffer und bietet große Knöpfe; Tippen ins Bild geht ebenfalls. */
(function(MA){
'use strict';
var P = M.P, T = M.T, R = M.R;
function wood(b, w, h){ for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) b.px(x, y, M.tex.boards(x, y, R('w0 w1 w2 w3'), 9)); }
function paper(b, x, y, w, h, c){ b.rect(x+2, y+2, w, h, P.k1); b.rect(x, y, w, h, c || P.s5); b.hl(x, x+w-1, y, P.s6); b.vl(x+w-1, y, y+h-1, P.s3); }
function txt(b, s, x, y, c){ M.text(b, s, x, y, c); }
var NAMES = ['Begić', 'Ćorić', 'Dedić', 'Hadžić', 'Jasna K.', 'Kovač', 'Marić', 'Pavlović', 'Ramić', 'Tomić', 'Nedim S.', 'Dragan T.'];

// ---------------------------------------------------------------- Durchschlag und Kohlepapier (S02/S03)
MA.definePuzzle('carbon', { title: 'Die Listenmappe', w: 320, h: 144,
  init: function(st){ st.lifted = false; st.pos = 2; st.done = false; },
  draw: function(b, st){ wood(b, 320, 144);
    // Durchschlag (unten), Kohlepapier (Mitte), Original (oben); 12 Namen + Nachtrag „13. M.“
    var cx = 92, cy = 6, w = 136, h = 134, lh = 8;
    paper(b, cx+6, cy+4, w, h, P.s4); M.microText(b, 'DURCHSCHLAG', cx+12, cy+7, P.m2);
    for (var i = 0; i < 12; i++) txt(b, (i+1)+'. '+NAMES[i], cx+12, cy+15+i*lh, P.v2);
    if (st.done) txt(b, '13. M.', cx+12, cy+15+12*lh, P.v2);
    var cover = (10+st.pos)*lh, ctop = cy+14; b.rect(cx+8, ctop, w-12, cover, P.k2); b.drect(cx+8, ctop, w-12, cover, P.k2, P.v0, 0.25); b.hl(cx+8, cx+w-5, ctop+cover, P.k1);
    if (!st.lifted){ paper(b, cx, cy, w, h, P.s6); M.microText(b, 'ORIGINAL', cx+6, cy+3, P.m2);
      for (var j = 0; j < 12; j++) txt(b, (j+1)+'. '+NAMES[j], cx+6, cy+11+j*lh, P.k2);
      txt(b, '13. M.', cx+6, cy+11+12*lh, P.b1); M.microText(b, 'NACHTRAG', cx+60, cy+13+12*lh, P.b2); }
    else { b.rect(cx+2, 0, w, 9, P.s6); b.hl(cx+2, cx+w+1, 8, P.s3); txt(b, 'Original (angehoben)', cx+10, 1, P.m2); }
    b.line(258, 120, 300, 98, P.y3); b.line(258, 121, 300, 99, P.y2); b.px(257, 121, P.k1);
  },
  buttons: function(st){ if (st.done) return [{ t: 'Fertig', id: 'close' }];
    return st.lifted ? [{ t: 'Kohlepapier höher', id: 'up', disabled: st.pos <= 0 }, { t: 'Kohlepapier tiefer', id: 'down' }, { t: 'Original zurücklegen', id: 'lower' }, { t: 'Zurück', id: 'close', cls: 'back' }]
                     : [{ t: 'Original anheben', id: 'lift' }, { t: 'Mit dem Bleistift nachfahren', id: 'trace' }, { t: 'Zurück', id: 'close', cls: 'back' }]; },
  press: function(st, id, api){
    if (id === 'close'){ api.done(st.done ? 'ok' : null); return; }
    if (id === 'lift'){ st.lifted = true; api.say(st.pos < 3 ? 'Unter dem Original: ein Rest Kohlepapier, darunter der Durchschlag. Das Kohlepapier endet über der letzten Zeile.' : 'Das Kohlepapier liegt jetzt bis ganz unten.'); }
    else if (id === 'lower'){ st.lifted = false; api.say(st.pos >= 3 ? 'Original zurück. Jetzt liegt der Rest Kohlepapier unter meinem Namen.' : 'Original zurück. Alles wie vorher.'); }
    else if (id === 'up'){ st.pos = Math.max(0, st.pos-1); api.say('Höher. Dann reicht es noch weniger weit nach unten.'); }
    else if (id === 'down'){ if (st.pos >= 3){ api.say('Weiter runter geht nicht. Dann liegt es unter nichts mehr.'); } else { st.pos++; api.say(st.pos >= 3 ? 'Jetzt liegt das Kohlepapier unter der Zeile mit meinem Namen.' : 'Ein Stück tiefer.'); } }
    else if (id === 'trace'){ if (st.pos >= 3){ st.done = true; api.say('Ich fahre meinen Namen nach. Unten, im Durchschlag, erscheint: „13. M.“'); api.redraw(); setTimeout(function(){ api.done('ok'); }, 1700); return; }
      api.say('Ich fahre meinen Namen nach. Unten kommt nichts an. Das Kohlepapier liegt zu hoch.'); }
    api.redraw(); },
  tap: function(st, x, y, api){ if (st.done) return; if (!st.lifted && x > 92 && x < 228 && y < 40) this.press(st, 'lift', api); }
});

// ---------------------------------------------------------------- Probetafel (S17): Wortlaut und Rahmen nach der gedruckten Vorlage
MA.definePuzzle('tafel', { title: 'Probetafel und gedruckte Vorlage', w: 320, h: 144,
  init: function(st){ st.sel = null; },
  draw: function(b, st){ var G = MA.GS.flags; b.rect(0, 0, 320, 144, P.k1);
    // Tafel
    b.rect(8, 10, 186, 112, P.w2); b.rect(11, 13, 180, 106, P.g1); b.drect(11, 13, 180, 106, P.g1, P.k2, 0.18); b.rect(8, 121, 186, 4, P.w3);
    var word = !!G['board.word'], frame = !!G['board.frame'];
    txt(b, 'ŽIVIO', 26, 34, P.s5); txt(b, word ? 'DRUG' : 'DRUGI', 62, 34, st.sel === 'word' ? P.y5 : P.s5); txt(b, 'TIKO!', 98, 34, P.s5);
    txt(b, 'LAUT UND DEUTLICH!', 26, 62, st.sel === 'line' ? P.y5 : (frame ? P.s3 : P.s5));
    var fc = st.sel === 'frame' ? P.y5 : P.s5, fy1 = frame ? 48 : 76; b.hl(18, 170, 26, fc); b.hl(18, 170, fy1, fc); b.vl(18, 26, fy1, fc); b.vl(170, 26, fy1, fc);
    if (word){ b.px(96, 33, P.s3); b.px(95, 37, P.s3); }
    txt(b, 'Probetafel', 14, 108, P.g4);
    // Vorlage
    paper(b, 206, 18, 104, 92, P.s6); txt(b, 'VORLAGE', 236, 22, P.m2);
    b.hl(214, 302, 38, P.k2); b.hl(214, 302, 56, P.k2); b.vl(214, 38, 56, P.k2); b.vl(302, 38, 56, P.k2); txt(b, 'ŽIVIO DRUG', 220, 41, P.k1); txt(b, 'TIKO!', 244, 49, P.k1);
    M.microText(b, '(LAUT UND DEUTLICH,', 216, 64, P.m2); M.microText(b, 'AUF EIN ZEICHEN)', 220, 71, P.m2);
    M.microText(b, 'SCHULGRUPPE', 232, 96, P.m3); },
  buttons: function(st){ var out = [{ t: 'Wort „drugi“', id: 'sel:word' }, { t: 'Zeile „Laut und deutlich“', id: 'sel:line' }, { t: 'Rahmen', id: 'sel:frame' }];
    if (st.sel === 'word') out = out.concat([{ t: 'Das I wegwischen', id: 'word:fix' }, { t: 'Lassen', id: 'clear', cls: 'back' }]);
    if (st.sel === 'line') out = out.concat([{ t: 'Ganz wegwischen', id: 'line:wipe' }, { t: 'Lassen', id: 'clear', cls: 'back' }]);
    if (st.sel === 'frame') out = out.concat([{ t: 'Rahmen nur um die Rufzeile', id: 'frame:one' }, { t: 'Rahmen um beide Zeilen', id: 'frame:two' }, { t: 'Lassen', id: 'clear', cls: 'back' }]);
    out.push({ t: 'Zurück', id: 'close', cls: 'back' }); return out; },
  press: function(st, id, api){ var G = MA.GS.flags;
    if (id === 'close'){ api.done(G['board.word'] && G['board.frame'] ? 'ok' : null); return; }
    if (id.indexOf('sel:') === 0){ st.sel = id.slice(4); api.say({ word: G['board.word'] ? '„DRUG“. Wie auf der Vorlage.' : '„DRUGI“. Auf der Vorlage steht „DRUG“. „Drugi“ heißt „der zweite“. Hoch lebe der zweite Tiko.', line: 'Auf der Vorlage steht das auch – klein, in Klammern, außerhalb des Rahmens.', frame: G['board.frame'] ? 'Der Rahmen umschließt nur die Rufzeile.' : 'Der Rahmen umschließt beide Zeilen. Auf der Vorlage nur die erste.' }[st.sel]); }
    else if (id === 'clear'){ st.sel = null; api.say(''); }
    else if (id === 'word:fix'){ if (!G['board.word']){ MA.set('board.word'); api.say('Ich wische das I weg. „Živio drug Tiko!“ – so steht es auch auf dem Transparent.'); } st.sel = null; }
    else if (id === 'line:wipe'){ api.say('Wegwischen wäre zu viel. Es soll ja laut und deutlich sein – nur nicht mitgerufen werden.'); }
    else if (id === 'frame:one'){ if (!G['board.frame']){ MA.set('board.frame'); api.say('Ich wische den Rahmen unten weg und ziehe ihn neu, direkt unter der Rufzeile.'); } st.sel = null; }
    else if (id === 'frame:two'){ api.say(G['board.frame'] ? 'Dann riefen sie wieder „Laut und deutlich“. Das hatten wir schon.' : 'So ist er schon. Und so rufen sie alles mit.'); st.sel = null; }
    if (G['board.word'] && G['board.frame']){ api.redraw(); api.say('Jetzt stimmt die Tafel mit der Vorlage überein.'); setTimeout(function(){ api.done('ok'); }, 1500); return; }
    api.redraw(); },
  tap: function(st, x, y, api){ if (x > 58 && x < 98 && y > 30 && y < 44) this.press(st, 'sel:word', api); else if (x > 22 && x < 160 && y > 58 && y < 72) this.press(st, 'sel:line', api); else if ((Math.abs(y-26) < 4 || Math.abs(y-48) < 4 || Math.abs(y-76) < 4) && x > 14 && x < 174) this.press(st, 'sel:frame', api); }
});

// ---------------------------------------------------------------- Knopfwahl (S21)
var BUTTONS = [
  { r: 6, holes: 4, col: R('h0 h1 h2'), msg: null },
  { r: 6, holes: 2, col: R('h0 h1 h2'), msg: 'Zwei Löcher. Der Mantel hat vier.' },
  { r: 6, holes: 4, col: R('e3 e4 e5'), msg: 'Vier Löcher, aber hell. Der Mantel ist dunkel, die Knöpfe auch.' },
  { r: 8, holes: 4, col: R('h0 h1 h2'), msg: 'Vier Löcher, dunkel – aber zu groß. Der passt durch kein Knopfloch.' },
  { r: 4, holes: 4, col: R('h0 h1 h2'), msg: 'Zu klein. Der fiele durchs Knopfloch wie ich durch Brankos Liste.' },
  { r: 6, holes: 0, col: R('y1 y2 y3'), msg: 'Ein Uniformknopf mit Anker. Der gehört zur Marine, nicht zum Lehrer.', anchor: true }
];
var ORDER = [3, 1, 5, 0, 4, 2];
function drawButton(b, cx, cy, d, sel){ var C = d.col; b.ellipse(cx, cy, d.r, d.r, C[0]); b.ellipse(cx-0.5, cy-0.5, d.r-1, d.r-1, C[1]); b.ellipse(cx-1, cy-1, d.r-2.5, d.r-2.5, C[2]); b.ellipse(cx, cy, d.r-2.5, d.r-2.5, C[1]);
  if (d.holes === 4){ [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function(o){ b.px(Math.round(cx+o[0]*1.5), Math.round(cy+o[1]*1.5), P.k0); }); }
  if (d.holes === 2){ b.px(Math.round(cx-1.5), Math.round(cy), P.k0); b.px(Math.round(cx+1.5), Math.round(cy), P.k0); }
  if (d.anchor){ b.vl(cx, cy-3, cy+2, P.y4); b.hl(cx-2, cx+2, cy+2, P.y4); b.hl(cx-1, cx+1, cy-2, P.y4); }
  if (sel){ b.hl(cx-d.r-3, cx+d.r+3, cy+d.r+4, P.y5); } }
MA.definePuzzle('knopf', { title: 'Dedos Knopfkiste', w: 320, h: 144, escClose: false,
  init: function(st){ st.sel = -1; },
  draw: function(b, st){ wood(b, 320, 144); b.rect(20, 20, 190, 104, P.w1); b.rect(24, 24, 182, 96, P.w0);
    ORDER.forEach(function(k, i){ var cx = 50+(i % 3)*60, cy = 50+Math.floor(i/3)*44; drawButton(b, cx, cy, BUTTONS[k], st.sel === i); M.microText(b, String(i+1), cx-1, cy+14, P.w3); });
    if (MA.has('skizze')){ paper(b, 226, 30, 80, 84, P.s6); M.text(b, 'Skizze', 248, 34, P.m2); b.ellipse(266, 74, 6, 6, P.k2); b.ellipse(266, 74, 5, 5, P.s6); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function(o){ b.px(Math.round(266+o[0]*1.5), Math.round(74+o[1]*1.5), P.k2); }); M.microText(b, 'DUNKEL', 248, 92, P.k2); M.microText(b, '4 LOECHER', 244, 100, P.k2); } },
  buttons: function(st){ var out = []; for (var i = 0; i < 6; i++) out.push({ t: 'Knopf '+(i+1), id: 'k'+i, cls: st.sel === i ? '' : 'back' }); out.push({ t: 'Der passt.', id: 'ok', disabled: st.sel < 0 }); return out; },
  press: function(st, id, api){ if (id === 'ok'){ var d = BUTTONS[ORDER[st.sel]]; if (!d.msg){ api.say('Dunkel, vier Löcher, genau die Größe der Skizze.'); setTimeout(function(){ api.done(true); }, 900); return; } api.say(d.msg); return; }
    st.sel = +id.slice(1); var d2 = BUTTONS[ORDER[st.sel]]; api.say('Knopf '+(st.sel+1)+': '+(d2.anchor ? 'Messing, mit Anker.' : (d2.col === BUTTONS[2].col ? 'hell' : 'dunkel')+', '+(d2.holes || 'keine')+' Löcher.')); api.redraw(); },
  tap: function(st, x, y, api){ for (var i = 0; i < 6; i++){ var cx = 50+(i % 3)*60, cy = 50+Math.floor(i/3)*44; if (Math.hypot(x-cx, y-cy) < 14){ this.press(st, 'k'+i, api); return; } } }
});
})(MA);
