/* ===== M. Adventure – art/room_hof.js =====
   Schulhof (400 × 144): links das ockerfarbene Schulhaus aus der k.u.k.-Zeit mit Transparent und Fahne, Probetafel auf der Staffelei,
   Brankos Tisch mit drei Ablagen und Stempel, der Aufstellungsplan (3 Reihen × 4 Plätze), Feigenbaum, Bank mit Fuge,
   rechts die Hofmauer mit dem Tor zur Straße; dahinter Steinplattendächer, ein Minarett und die Karstberge. */
(function(MA){
'use strict';
var P = M.P, T = M.T, R = M.R, SC = MA.SC, bayer = M.bayer, hash = M.hash;
var K = { W: 400, door: [84, 66, 22, 38], gate: [346, 64, 40, 38], board: [12, 64, 52, 32], table: [136, 100, 52, 14], plan: [190, 70, 32, 26], bench: [262, 112, 60, 10], marble: [288, 112, 6, 4], tree: [236, 10, 48, 60] };
function paint(S, G){ var W = K.W, b = new M.Buf(W, 144, P.k0);
  SC.sky(b, 0, 0, W, 64, 17);
  SC.hills(b, 180, W, 52, 22, 4, false);
  SC.hills(b, 180, W, 60, 12, 8, true);
  // Häuser hinter der Hofmauer
  [[196, 50, 38, 26], [236, 54, 30, 22], [270, 48, 34, 30], [306, 52, 40, 26], [348, 46, 52, 32]].forEach(function(h, i){ SC.house(b, h[0], h[1]+h[3], h[2], h[3], { upper: i % 2 ? 'wood' : 'plaster' }); });
  SC.minaret(b, 334, 50, 46);
  // Schulhaus (Ocker), zwei Geschosse
  var OCH = R('w3 w4 w5 d6');
  for (var y = 6; y < 102; y++) for (var x = 0; x < 196; x++){ var c = SC.plaster(x, y, OCH, 48); if (x > 186) c = M.DN[c]; b.px(x, y, c); }
  b.rect(0, 2, 198, 5, P.s4); b.hl(0, 197, 2, P.s6); b.hl(0, 197, 6, P.s2);   // Traufgesims
  b.rect(0, 44, 196, 3, P.s5); b.hl(0, 195, 46, P.s3);   // Geschossgesims
  b.rect(0, 92, 196, 10, P.s3); for (var x2 = 0; x2 < 196; x2++){ if (x2 % 12 === 0) b.vl(x2, 92, 101, P.s2); } b.hl(0, 195, 92, P.s4);   // Sockel
  b.vl(196, 2, 101, P.s2); b.vl(197, 2, 101, P.s1);
  // Fenster
  [14, 44, 132, 162].forEach(function(wx){ SC.window(b, wx, 18, 16, 20, { frame: R('s3 s4 s5 s6') }); b.hl(wx-3, wx+18, 15, P.s5); b.hl(wx-2, wx+17, 16, P.s4); SC.window(b, wx, 60, 16, 20, { frame: R('s3 s4 s5 s6') }); b.hl(wx-3, wx+18, 57, P.s5); });
  SC.window(b, 88, 18, 16, 20, { frame: R('s3 s4 s5 s6') });
  // Eingang mit Treppe
  var d = K.door; b.rect(d[0]-4, d[1]-6, d[2]+8, 6, P.s5); b.hl(d[0]-4, d[0]+d[2]+3, d[1]-6, P.s6); M.microText(b, 'SKOLA', d[0]+2, d[1]-5, P.k2); b.px(d[0]+3, d[1]-7, P.k2); b.px(d[0]+5, d[1]-7, P.k2);
  b.rect(d[0]-2, d[1], d[2]+4, 28, P.s4); b.rect(d[0], d[1]+1, d[2], 27, P.w1); b.rect(d[0]+1, d[1]+2, d[2]/2-2, 25, P.w2); b.rect(d[0]+d[2]/2+1, d[1]+2, d[2]/2-2, 25, P.w2); b.vl(d[0]+d[2]/2, d[1]+1, d[1]+27, P.w0); b.px(d[0]+d[2]/2-2, d[1]+14, P.y3); b.px(d[0]+d[2]/2+2, d[1]+14, P.y3);
  for (var st = 0; st < 3; st++){ b.rect(d[0]-4-st*2, 94+st*3, d[2]+8+st*4, 3, P.s4); b.hl(d[0]-4-st*2, d[0]+d[2]+3+st*2, 94+st*3, P.s6); }
  // Fahne über dem Eingang, Transparent zwischen den Geschossen
  b.line(95, 12, 104, 4, P.w2); SC.flagYU(b, 104, 4, 12, 9);
  SC.banner(b, 22, 47, 150, 9, 'ŽIVIO DRUG TIKO');
  // Hofmauer und Tor
  SC.stoneWall(b, 198, 62, W-198, 40, { sw: 16, sh: 8, cap: true, ox: 3 });
  var g = K.gate; b.rect(g[0]-3, g[1]-3, g[2]+6, g[3]+3, P.s2); b.ellipse(g[0]+g[2]/2, g[1], g[2]/2+3, 6, P.s2);
  var open = !!G.flags['list.fixed'];
  b.rect(g[0], g[1], g[2], g[3], open ? P.s4 : P.k2); b.ellipse(g[0]+g[2]/2, g[1], g[2]/2, 4, open ? P.b4 : P.k2);
  if (open){ SC.kaldrma(b, g[0], g[1]+20, g[2], g[3]-20); SC.house(b, g[0]+2, g[1]+20, g[2]-4, 18, {}); b.rect(g[0], g[1], 6, g[3], P.k1); for (var gy = g[1]; gy < g[1]+g[3]; gy += 3) b.hl(g[0], g[0]+5, gy, P.m1); }
  else { for (var gx = g[0]+2; gx < g[0]+g[2]; gx += 4) b.vl(gx, g[1]-2, g[1]+g[3]-1, P.m1); b.hl(g[0], g[0]+g[2]-1, g[1]+10, P.m1); b.hl(g[0], g[0]+g[2]-1, g[1]+26, P.m1); b.vl(g[0]+g[2]/2, g[1]-3, g[1]+g[3]-1, P.m2); }
  // Hofboden: Platten am Haus, Kopfstein zur Mauer
  SC.slabs(b, 0, 102, 200, 42, R('s2 s3 s4 s5'));
  SC.kaldrma(b, 200, 102, W-200, 42, { rib: 0 });
  for (var yy = 102; yy < 144; yy++) for (var xx = 0; xx < W; xx++){ var v = (xx < 120 && yy < 112) ? 0.35 : 0; if (v && bayer(xx, yy) < v) b.px(xx, yy, M.DN[b.get(xx, yy)]); }
  // Schatten des Hauses und der Mauer auf dem Boden
  SC.dither(b, 198, 102, W-198, 4, 0.5); SC.dither(b, 0, 102, 196, 3, 0.5);
  // Feigenbaum über der Mauer (vor den Häusern, hinter dem Hof)
  SC.tree(b, 258, 100, { h: 70, w: 52, seed: 31, leaf: R('g1 g2 g3 g4 g5'), fruit: P.v2 });
  SC.dither(b, 236, 100, 46, 6, 0.4);
  return b; }

// Vordergrund: Probetafel, Brankos Tisch, Plan, Bank (Ebenen mit Grundlinie)
function layers(S, G){ var out = [];
  // Probetafel auf der Staffelei
  var bd = K.board, L1 = M.layer(bd[0]-4, bd[1]-2, bd[2]+8, 60, 120), w1 = M.lw(L1);
  w1.line(bd[0]+4, bd[1]+bd[3], bd[0]-2, 120, P.w1); w1.line(bd[0]+bd[2]-4, bd[1]+bd[3], bd[0]+bd[2]+2, 120, P.w1); w1.line(bd[0]+bd[2]/2, bd[1]+bd[3], bd[0]+bd[2]/2+1, 116, P.w0);
  w1.rect(bd[0]-1, bd[1]-1, bd[2]+2, bd[3]+2, P.w2); w1.rect(bd[0], bd[1], bd[2], bd[3], P.g1); w1.drect(bd[0], bd[1], bd[2], bd[3], P.g1, P.k2, 0.15); w1.hl(bd[0], bd[0]+bd[2]-1, bd[1]+bd[3], P.w3);
  var fixedW = !!G.flags['board.word'], fixedF = !!G.flags['board.frame'];
  var tx = bd[0]+3, ty = bd[1]+3, chalk = P.s5;
  w1.micro('ŽIVIO', tx, ty, chalk);
  w1.micro(fixedW ? 'DRUG' : 'DRUGI', tx+24, ty, chalk); w1.micro('TIKO!', tx+8, ty+7, chalk);
  w1.micro('LAUT UND', tx, ty+15, fixedF ? P.s3 : chalk); w1.micro('DEUTLICH!', tx+4, ty+22, fixedF ? P.s3 : chalk);
  var fh = fixedF ? 13 : 28; w1.hl(tx-2, tx+46, ty-2, chalk); w1.hl(tx-2, tx+46, ty-2+fh, chalk); w1.vl(tx-2, ty-2, ty-2+fh, chalk); w1.vl(tx+46, ty-2, ty-2+fh, chalk);
  if (G.flags['probe.ok']){ w1.px(bd[0]+bd[2]-4, bd[1]+3, P.y4); w1.px(bd[0]+bd[2]-5, bd[1]+4, P.y4); w1.px(bd[0]+bd[2]-6, bd[1]+3, P.y4); }
  out.push(L1);
  // Brankos Tisch mit drei Ablagen und Stempel
  var t = K.table, L2 = M.layer(t[0]-2, t[1]-8, t[2]+4, 24, t[1]+14), w2 = M.lw(L2);
  w2.rect(t[0], t[1], t[2], 3, P.w3); w2.hl(t[0], t[0]+t[2]-1, t[1], P.w5); w2.rect(t[0], t[1]+3, t[2], 2, P.w1);
  [t[0]+2, t[0]+t[2]-4].forEach(function(lx){ w2.rect(lx, t[1]+5, 2, 9, P.w1); });
  [['LISTE', 0], ['MAT', 1], ['SONST', 2]].forEach(function(a, i){ var x = t[0]+2+i*16, y = t[1]-4; w2.rect(x, y, 14, 4, P.w2); w2.hl(x, x+13, y, P.w4); w2.rect(x+1, y-1, 12, 1, P.s6); });
  w2.rect(t[0]+t[2]-8, t[1]-3, 5, 3, P.k2); w2.rect(t[0]+t[2]-7, t[1]-6, 3, 3, P.w3); w2.px(t[0]+t[2]-6, t[1]-7, P.w4);   // Stempel
  if (G.flags['flag.stamped'] && !MA.has('fahne') && !MA.has('zeitung')){}
  out.push(L2);
  // Aufstellungsplan auf Staffelei
  var p = K.plan, L3 = M.layer(p[0]-3, p[1]-2, p[2]+6, 52, 118), w3 = M.lw(L3);
  w3.line(p[0]+3, p[1]+p[3], p[0]-1, 118, P.w1); w3.line(p[0]+p[2]-3, p[1]+p[3], p[0]+p[2]+1, 118, P.w1);
  w3.rect(p[0], p[1], p[2], p[3], P.s6); w3.hl(p[0], p[0]+p[2]-1, p[1], P.s4);
  for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++){ var cx = p[0]+2+c*7, cy = p[1]+3+r*7; w3.rect(cx, cy, 6, 6, P.s4); w3.hl(cx+1, cx+4, cy+2, (r === 2 && c === 3) ? P.r3 : P.m2); w3.hl(cx+1, cx+3, cy+4, P.m3); }
  out.push(L3);
  // Bank mit Fuge (die Murmel glänzt darin, solange sie drin ist)
  var bn = K.bench, L4 = M.layer(bn[0]-2, bn[1]-4, bn[2]+4, 20, bn[1]+12), w4 = M.lw(L4);
  w4.rect(bn[0], bn[1], bn[2], 3, P.w3); w4.hl(bn[0], bn[0]+bn[2]-1, bn[1], P.w5); w4.hl(bn[0], bn[0]+bn[2]-1, bn[1]+3, P.w0); w4.rect(bn[0], bn[1]+4, bn[2], 2, P.w2); w4.hl(bn[0], bn[0]+bn[2]-1, bn[1]+6, P.w1);
  [bn[0]+3, bn[0]+bn[2]-5].forEach(function(lx){ w4.rect(lx, bn[1]+6, 2, 6, P.m1); });
  var tilt = !!G.flags['nedim.holds'];
  if (!G.flags['marble.out']){ w4.px(K.marble[0]+2, bn[1]+3, P.b3); w4.px(K.marble[0]+3, bn[1]+3, P.b4); }
  if (G.flags['heft.placed'] && !G.flags['marble.out']){ w4.rect(bn[0]+bn[2]-1, bn[1]+5, 5, 4, P.b2); w4.hl(bn[0]+bn[2]-1, bn[0]+bn[2]+3, bn[1]+5, P.b3); }
  out.push(L4);
  return out; }
MA.ART = MA.ART || {};
MA.ART.hof = { K: K, paint: paint, layers: layers };
})(MA);
