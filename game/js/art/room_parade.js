/* ===== M. Adventure – art/room_parade.js =====
   Paradestraße (400 × 144): breiter Boulevard mit Platanen, Fassaden, Tribüne mit Fahnen, Zuschauerreihen hinter Seilen,
   links der Lieferbereich (Getränketisch, Kisten), in der Mitte die Kreidemarkierungen der Schulgruppe (I–III × 1–4), rechts die Strecke. */
(function(MA){
'use strict';
var P = M.P, T = M.T, R = M.R, SC = MA.SC, bayer = M.bayer, hash = M.hash;
var K = { W: 400, table: [22, 98, 64, 12], marks: [170, 106, 84, 36], tribune: [292, 34, 100, 56], rows: [112, 123, 134], cols: [178, 198, 218, 238] };
function paint(S, G){ var W = K.W, b = new M.Buf(W, 144, P.k0);
  SC.sky(b, 0, 0, W, 40, 61);
  // Fassaden hinten
  var ramps = [R('w4 w5 d6'), R('s3 s4 s5'), R('p3 p4 p5'), R('c3 c4 c5'), R('w4 w5 d6')];
  for (var i = 0; i < 5; i++){ var x0 = i*84; SC.plasterWall(b, x0, 6, 84, 80, ramps[i], 30); b.rect(x0, 6, 84, 3, M.UP[ramps[i][1]]); for (var wx = x0+8; wx < x0+76; wx += 17){ SC.window(b, wx, 18, 9, 14, {}); SC.window(b, wx, 48, 9, 14, { open: hash(wx, 2) < 0.3 }); } }
  SC.banner(b, 110, 28, 150, 9, 'ŽIVIO DRUG TIKO');
  // Platanen
  [60, 150, 250, 350].forEach(function(tx, i){ SC.tree(b, tx, 96, { h: 64, w: 46, seed: 70+i, leaf: R('g1 g2 g3 g4 g5') }); });
  // Zuschauer hinter dem Seil
  // hintere Reihen als Silhouetten im Schatten der Platanen (die vordere Reihe lebt: engine/extras.js)
  var dark = [P.m1, P.e1, P.c1, P.w1, P.r1, P.n1, P.m0, P.g2], skinD = [P.q1, P.p2, P.q2, P.h1];
  for (var hx = -3; hx < W+6; hx += 6){ var hj = Math.floor(hash(hx, 5)*3), hy0 = 78+hj, col = dark[Math.floor(hash(hx, 7)*dark.length)], sk = skinD[Math.floor(hash(hx, 11)*skinD.length)];
    for (var y = hy0+4; y < 97; y++) for (var x = hx-3; x <= hx+3; x++){ if (x < 0 || x >= W) continue; var c = col; if (x === hx-3 || (y === hy0+4 && (x === hx-3 || x === hx+3))) c = M.DN[col]; if (bayer(x, y) < 0.18) c = M.DN[c]; b.px(x, y, c); }
    var hat = hash(hx, 13) < 0.35; for (var yy0 = hy0; yy0 < hy0+4; yy0++) for (var xx0 = hx-1; xx0 <= hx+1; xx0++){ if (xx0 < 0 || xx0 >= W) continue; b.px(xx0, yy0, (yy0 === hy0 && hat) ? P.k2 : (yy0 === hy0 ? P.h1 : sk)); }
    if (hat){ b.px(hx-2, hy0+1, P.k2); b.px(hx+2, hy0+1, P.k2); } }
  for (var x2 = 0; x2 < W; x2 += 2){ var sy = 97+Math.round(Math.sin(x2*0.05)*1); b.px(x2, sy, P.s6); } [0, 80, 160, 240, 320].forEach(function(px){ b.rect(px, 92, 2, 8, P.w1); });
  // Fahrbahn und Platz
  for (var y2 = 98; y2 < 144; y2++) for (var x3 = 0; x3 < W; x3++) b.px(x3, y2, M.tex.paving(x3, y2, R('s2 s3 s4 s5'), 13));
  SC.dither(b, 0, 98, W, 4, 0.5);
  // Kreidemarkierungen: drei Reihen zu vier, römische Zahlen
  K.rows.forEach(function(ry, r){ K.cols.forEach(function(cx){ b.hl(cx-7, cx+7, ry+2, P.s6); b.vl(cx-7, ry-1, ry+2, P.s6); b.vl(cx+7, ry-1, ry+2, P.s6); }); M.microText(b, ['I', 'II', 'III'][r], K.cols[0]-18, ry-3, P.s6); });
  // Tribüne mit Fahnen
  var t = K.tribune; b.rect(t[0], t[1]+30, t[2], t[3]-30, P.w2); for (var yy = t[1]+30; yy < t[1]+t[3]; yy += 4) b.hl(t[0], t[0]+t[2]-1, yy, P.w1); b.rect(t[0], t[1]+26, t[2], 4, P.r3); b.hl(t[0], t[0]+t[2]-1, t[1]+26, P.r4);
  for (var fx = t[0]+6; fx < t[0]+t[2]; fx += 22) SC.flagPole(b, fx, t[1]+26, 26, 12, 9, fx*0.3);
  return b; }
function layers(S, G){ var out = [], t = K.table, L = M.layer(t[0]-4, t[1]-14, t[2]+8, 30, t[1]+12), w = M.lw(L);
  w.rect(t[0], t[1], t[2], 3, P.s5); w.hl(t[0], t[0]+t[2]-1, t[1], P.s6); w.rect(t[0], t[1]+3, t[2], 2, P.s3); w.rect(t[0]+2, t[1]+5, 2, 7, P.w1); w.rect(t[0]+t[2]-4, t[1]+5, 2, 7, P.w1);
  var n = Math.min(12, (G.flags['unload'] || 0)*4); for (var i = 0; i < n; i++) SC.bottle(w, t[0]+4+i*5, t[1], P.g3);
  for (var j = 0; j < 3; j++){ w.rect(t[0]+t[2]+2-j*2, t[1]-4-j*5, 14, 5, P.w2); w.hl(t[0]+t[2]+2-j*2, t[0]+t[2]+15-j*2, t[1]-4-j*5, P.w4); }
  out.push(L); return out; }
MA.ART = MA.ART || {};
MA.ART.parade = { K: K, paint: paint, layers: layers };
})(MA);
