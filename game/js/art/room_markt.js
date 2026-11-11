/* ===== M. Adventure – art/room_markt.js =====
   Markt in der Altstadt (420 × 144): Steinhäuser mit Klappläden (ćepenci) und Steinplattendächern, Kupferläden mit Kesseln,
   ein Minarett über den Dächern, Wimpelgirlanden für die Parade, Kopfsteinpflaster aus Flusskieseln.
   Links Maras Stand (Flaschenkästen, Packkarton, die Holzkiste auf dem Bock), Mitte-rechts Dedos Tisch (kurzes Bein mit Stecken,
   ein rechter Schuh, Löffel auf Samt, Pfeife, Knopfkiste, Garantie-Schild). Ausgänge: Schule (links), Hauptstraße (Gasse hinten), Brücke (rechts). */
(function(MA){
'use strict';
var P = M.P, T = M.T, R = M.R, SC = MA.SC, bayer = M.bayer, hash = M.hash;
var K = { W: 420, mara: [40, 92, 96, 22], crate: [92, 96, 26, 12], bottles: [44, 94, 40, 14], karton: [118, 92, 18, 22], dedo: [226, 94, 82, 18], leg: [228, 104, 8, 10],
  shoe: [240, 89, 12, 7], spoon: [258, 90, 12, 5], pipe: [276, 89, 10, 5], buttons: [290, 88, 14, 7], sign: [300, 66, 22, 18], alley: [178, 48, 30, 54], copper: [346, 40, 60, 52], minaret: [190, 0, 12, 48] };
function paint(S, G){ var W = K.W, b = new M.Buf(W, 144, P.k0);
  SC.sky(b, 0, 0, W, 50, 23); SC.hills(b, 0, W, 40, 16, 6, false);
  SC.minaret(b, 196, 52, 52);
  // Häuserzeile hinten
  SC.house(b, 0, 98, 60, 62, { upper: 'wood' }); SC.house(b, 60, 98, 56, 58, {}); SC.house(b, 116, 98, 62, 64, { upper: 'wood' });
  // Gasse zur Hauptstraße (hinten Mitte)
  var al = K.alley; b.rect(al[0], al[1], al[2], al[3], P.s2); for (var y = al[1]; y < al[1]+al[3]; y++) for (var x = al[0]; x < al[0]+al[2]; x++){ var t = (y-al[1])/al[3]; if (y > al[1]+al[3]-14) b.px(x, y, M.tex.cobble(x, y, R('s1 s2 s3'), 4)); else b.px(x, y, M.rampAt(R('s1 s2 s3 s4'), 0.3+t*0.5, x, y)); }
  SC.house(b, al[0]+4, al[1]+30, al[2]-8, 26, {}); b.rect(al[0], al[1], 3, al[3], P.s1); b.rect(al[0]+al[2]-3, al[1], 3, al[3], P.s1);
  b.rect(al[0]+6, al[1]+6, 18, 7, P.s6); M.microText(b, 'GLAVNA', al[0]+7, al[1]+7, P.k2); b.px(al[0]+23, al[1]+12, P.k2);
  SC.house(b, 208, 98, 60, 60, { upper: 'wood' }); SC.house(b, 268, 98, 70, 64, {}); SC.house(b, 338, 98, 82, 60, { upper: 'wood' });
  // Ladenfronten (Erdgeschoss) mit Klappläden
  SC.shop(b, 4, 98, 52, 30, {}); SC.shop(b, 62, 98, 50, 28, {}); SC.shop(b, 214, 98, 52, 30, {});
  SC.shop(b, 344, 98, 70, 34, { goods: function(bb, ix, iy, iw, ih){ for (var i = 0; i < 6; i++){ var cx = ix+6+i*11, cy = iy+6+(i % 2)*6; bb.ellipse(cx, cy, 4, 3, P.t3); bb.ellipse(cx-1, cy-1, 2, 1.5, P.t5); bb.px(cx, cy-4, P.t2); } } });
  M.microText(b, 'KAZANDZIJA', 350, 62, P.s6);
  // hängende Kupferkessel vor dem Laden
  [352, 366, 380, 396].forEach(function(cx, i){ b.vl(cx, 66, 72+i % 2*2, P.k2); b.ellipse(cx, 76+i % 2*2, 5, 4, P.t3); b.ellipse(cx-1, 75+i % 2*2, 3, 2, P.t4); b.px(cx-2, 74+i % 2*2, P.t5); });
  // Wimpelgirlanden
  SC.garland(b, 0, 30, 180, 26, 8); SC.garland(b, 206, 28, W, 34, 9); SC.garland(b, 0, 46, W, 44, 6);
  // Pflaster
  SC.kaldrma(b, 0, 98, W, 46, { rib: 9, shade: function(x, y){ return y < 104 ? -0.35 : 0; } });
  // Schatten der Häuser auf dem Pflaster
  SC.dither(b, 0, 98, W, 5, 0.55);
  return b; }
function layers(S, G){ var out = [];
  // ---- Maras Stand
  var L1 = M.layer(30, 70, 120, 50, 116), w = M.lw(L1);
  w.rect(36, 72, 104, 3, P.r2); for (var x = 36; x < 140; x += 8){ w.rect(x, 75, 4, 5, P.r3); w.rect(x+4, 75, 4, 5, P.s6); } w.hl(36, 139, 80, P.r1);   // Markise
  w.vl(38, 72, 114, P.w1); w.vl(137, 72, 114, P.w1);
  w.rect(40, 102, 52, 3, P.w3); w.hl(40, 91, 102, P.w5); w.rect(42, 105, 2, 9, P.w1); w.rect(88, 105, 2, 9, P.w1);   // Tisch
  for (var i = 0; i < 9; i++) SC.bottle(w.buf ? { px: w.px, rect: w.rect, vl: w.vl } : w, 44+i*5, 102, i % 3 === 0 ? P.a3 : P.g3);
  // Holzkiste auf dem Bock (leer, gepackt oder fort)
  var cr = K.crate, packed = !!G.flags['packed'], away = !!G.flags['crate.carry'] || (packed && G.flags['delivery.job'] && !G.flags['crate.back']);
  w.rect(cr[0]+2, cr[1]+12, 2, 6, P.w1); w.rect(cr[0]+cr[2]-4, cr[1]+12, 2, 6, P.w1); w.rect(cr[0], cr[1]+10, cr[2], 2, P.w2);
  if (!away || G.flags['crate.back']){ w.rect(cr[0], cr[1], cr[2], 10, P.w2); w.hl(cr[0], cr[0]+cr[2]-1, cr[1], P.w4); w.hl(cr[0], cr[0]+cr[2]-1, cr[1]+5, P.w1);
    if (packed && !G.flags['crate.back']){ for (var j = 0; j < 4; j++){ w.rect(cr[0]+3+j*6, cr[1]-6, 3, 6, P.g3); w.px(cr[0]+4+j*6, cr[1]-7, P.g2); } }
    else { w.drect(cr[0]+2, cr[1]+1, cr[2]-4, 3, P.w0, P.w1, 0.3); } }
  // Packkarton an den Stand gelehnt
  if (!G.flags['karton.given']){ var kc = K.karton; w.poly([[kc[0], kc[1]+kc[3]], [kc[0]+4, kc[1]], [kc[0]+kc[2], kc[1]+2], [kc[0]+kc[2]-2, kc[1]+kc[3]]], P.w3); w.line(kc[0]+4, kc[1], kc[0]+kc[2], kc[1]+2, P.w5); }
  else { w.poly([[120, 114], [122, 104], [134, 105], [133, 114]], P.w3); }
  out.push(L1);
  // ---- Dedos Tisch
  var d = K.dedo, L2 = M.layer(d[0]-6, 60, d[2]+30, 60, 114), v = M.lw(L2);
  v.rect(d[0], d[1], d[2], 3, P.w3); v.hl(d[0], d[0]+d[2]-1, d[1], P.w5); v.rect(d[0], d[1]+3, d[2], 2, P.w1);
  v.rect(d[0]+d[2]-5, d[1]+5, 3, 13, P.w1);   // rechtes Bein
  if (G.flags['table.fixed']){ v.rect(d[0]+3, d[1]+5, 3, 9, P.w1); v.poly([[d[0]+1, 112], [d[0]+1, 108], [d[0]+8, 108], [d[0]+11, 110], [d[0]+11, 112]], P.w1); v.hl(d[0]+1, d[0]+11, 112, P.k2); v.hl(d[0]+2, d[0]+7, 108, P.w2); }
  else { v.rect(d[0]+3, d[1]+5, 3, 8, P.w1); v.vl(d[0]+4, d[1]+13, 112, P.w3); v.vl(d[0]+5, d[1]+13, 112, P.w4); v.px(d[0]+3, d[1]+12, P.m3); v.px(d[0]+6, d[1]+13, P.m4); }
  // Samtdecke, Waren
  v.rect(d[0]+12, d[1]-2, 64, 2, P.r1); v.hl(d[0]+12, d[0]+75, d[1]-2, P.r2);
  if (!G.flags['shoe.bought']){ var sh = K.shoe; v.poly([[sh[0], sh[1]], [sh[0]+5, sh[1]], [sh[0]+7, sh[1]+3], [sh[0]+12, sh[1]+4], [sh[0]+12, sh[1]+7], [sh[0], sh[1]+7]], P.w1); v.rect(sh[0], sh[1]+6, 4, 1, P.k2); v.px(sh[0]+7, sh[1]+4, P.s5); }
  if (!G.flags['spoon.won']){ var sp = K.spoon; v.rect(sp[0]-1, sp[1]+1, 14, 4, P.r2); v.line(sp[0], sp[1]+3, sp[0]+7, sp[1]+2, P.m4); v.ellipse(sp[0]+10, sp[1]+2, 2.5, 1.6, P.m4); if (G.flags['spoon.turned']) v.px(sp[0]+10, sp[1]+2, P.m2); }
  if (!G.flags['ad.done']){ var pp = K.pipe; v.rect(pp[0], pp[1]+2, 7, 3, P.m3); v.hl(pp[0], pp[0]+6, pp[1]+2, P.m4); v.ellipse(pp[0]+8, pp[1]+3, 2, 2, P.m3); }
  var bt = K.buttons; v.rect(bt[0], bt[1]+1, bt[2], 6, P.w2); v.hl(bt[0], bt[0]+bt[2]-1, bt[1]+1, P.w4); [[2, 3], [5, 4], [8, 3], [11, 4]].forEach(function(o, i){ v.px(bt[0]+o[0], bt[1]+o[1], [P.h1, P.e4, P.y3, P.k2][i]); });
  // Garantie-Schild
  var sg = K.sign; v.vl(sg[0]+3, sg[1]+sg[3], d[1]-1, P.w1); v.rect(sg[0], sg[1], sg[2], sg[3], P.s5); v.hl(sg[0], sg[0]+sg[2]-1, sg[1], P.s6); v.micro('GARAN', sg[0]+2, sg[1]+3, P.r2); v.micro('TIJA', sg[0]+4, sg[1]+10, P.r2);
  // Werbetafel (nach dem Werbehandel)
  if (G.flags['ad.done'] || G.flags['tafel.placed']){ v.rect(d[0]+d[2]+2, d[1]-18, 26, 14, P.w2); v.hl(d[0]+d[2]+2, d[0]+d[2]+27, d[1]-18, P.w4); v.micro('KNOPF', d[0]+d[2]+5, d[1]-14, P.s6); v.vl(d[0]+d[2]+8, d[1]-4, d[1]+18, P.w1); }
  out.push(L2);
  return out; }
MA.ART = MA.ART || {};
MA.ART.markt = { K: K, paint: paint, layers: layers };
})(MA);
