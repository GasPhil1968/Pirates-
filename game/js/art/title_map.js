/* ===== M. Adventure – art/title_map.js =====
   Titelbild (320 × 200): Mostar in der Abenddämmerung, der Bogen der Stari Most über der Neretva, Minarette, Karstberge.
   Stadtplan (320 × 144): Papierkarte „Mostar 1955“ mit Neretva, Brücke, Gassen, Häuserblöcken und Bergen (nur bekannte Orte bekommen Knöpfe). */
(function(MA){
'use strict';
var P = M.P, T = M.T, R = M.R, SC = MA.SC, bayer = M.bayer, hash = M.hash;
MA.paintTitle = function(){ var b = new M.Buf(320, 200, P.k0);
  M.sky(b, 0, 0, 320, 120, 'dusk', 7);
  SC.hills(b, 0, 320, 92, 30, 21, false); for (var y = 60; y < 96; y++) for (var x = 0; x < 320; x++){ var c = b.get(x, y); if (c !== T && y > 70) b.px(x, y, M.DN[c]); }
  // Häuser an beiden Ufern, Silhouetten mit warmen Fenstern
  [[0, 96, 40, 30], [34, 100, 32, 26], [62, 94, 36, 34], [222, 98, 34, 28], [252, 92, 38, 34], [286, 98, 34, 28]].forEach(function(h){ for (var yy = h[1]; yy < h[1]+h[3]+40; yy++) for (var xx = h[0]; xx < h[0]+h[2]; xx++) b.px(xx, yy, (xx+yy) % 7 === 0 ? P.d0 : P.k1);
    for (var wx = h[0]+4; wx < h[0]+h[2]-4; wx += 7) if (hash(wx, h[1]) < 0.6) b.rect(wx, h[1]+8, 2, 3, P.y3); b.poly([[h[0]-3, h[1]], [h[0]+h[2]+3, h[1]], [h[0]+h[2]/2, h[1]-8]], P.k1); });
  [[78, 96, 46], [262, 92, 52]].forEach(function(m){ var x = m[0], top = m[1]-m[2]; b.rect(x-2, top+10, 5, m[2]-10, P.k1); b.rect(x-4, top+18, 9, 2, P.k1); b.poly([[x-2, top+10], [x+2, top+10], [x, top]], P.k1); b.px(x, top-1, P.y3); });
  // Neretva mit Spiegelung
  for (var y2 = 150; y2 < 200; y2++) for (var x2 = 0; x2 < 320; x2++){ var v = 0.3+Math.sin(x2*0.08+y2*0.7)*0.15+(y2-150)/50*0.3; var c2 = M.rampAt(R('k1 a0 a1 d1 d2'), v, x2, y2); if (Math.abs(x2-160) < 40 && Math.sin(x2*0.6+y2*2.1) > 0.6) c2 = P.d4; b.px(x2, y2, c2); }
  // Brückenbogen
  for (var x3 = 60; x3 < 260; x3++){ var t = (x3-160)/100, deck = Math.round(104+t*t*16), intra = Math.round(122+t*t*46);
    for (var y3 = deck-8; y3 <= Math.min(199, intra); y3++){ var c3 = y3 < deck ? P.d3 : (y3 < deck+2 ? P.d5 : M.tex.ashlar(x3, y3, R('d1 d2 d3 d4'), 10, 5)); b.px(x3, y3, c3); } }
  for (var x4 = 60; x4 < 260; x4++){ var t2 = (x4-160)/100, intra2 = Math.round(122+t2*t2*46); for (var y4 = intra2+1; y4 < 200; y4++){ if (y4 > 150){ var k = y4*320+x4; } } }
  // Türme
  [[44, 30], [246, 30]].forEach(function(tw){ for (var y5 = 86; y5 < 200; y5++) for (var x5 = tw[0]; x5 < tw[0]+tw[1]; x5++) b.px(x5, y5, M.tex.ashlar(x5, y5, R('k2 d0 d1 d2'), 10, 5)); b.poly([[tw[0]-3, 86], [tw[0]+tw[1]+3, 86], [tw[0]+tw[1]/2, 72]], P.k1); });
  // Sterne und Mondsichel
  var rg = M.rng(9); for (var i = 0; i < 40; i++){ var sx = Math.floor(rg()*320), sy = Math.floor(rg()*40); b.px(sx, sy, rg() < 0.3 ? P.d6 : P.d5); }
  b.ellipse(282, 18, 6, 6, P.d6); b.ellipse(285, 16, 5, 5, P.d2);
  return b; };

MA.paintMap = function(G){ var b = new M.Buf(320, 144, P.s5);
  for (var y = 0; y < 144; y++) for (var x = 0; x < 320; x++){ var h = hash(Math.floor(x/2), Math.floor(y/2)); var c = h < 0.08 ? P.s4 : (h > 0.96 ? P.s6 : P.s5); if (x < 4 || y < 4 || x > 315 || y > 139) c = P.e3; b.px(x, y, c); }
  // Berge (Schraffur) am Rand
  for (var y2 = 6; y2 < 140; y2++) for (var x2 = 6; x2 < 314; x2++){ var edge = (x2 < 40 || x2 > 286 || y2 < 18); if (edge && ((x2+y2*2) % 7 === 0) && hash(x2, y2) < 0.6) b.px(x2, y2, P.g4); }
  M.microText(b, 'HUM', 292, 26, P.g3); M.microText(b, 'VELEZ', 10, 22, P.g3);
  // Neretva
  for (var y3 = 4; y3 < 140; y3++){ var cx = 224+Math.round(Math.sin(y3*0.045)*14+(y3-70)*0.1); for (var k = -3; k <= 3; k++){ var cc = Math.abs(k) === 3 ? P.a3 : P.a4; b.px(cx+k, y3, cc); } }
  M.microText(b, 'NERETVA', 246, 124, P.a2);
  // Häuserblöcke
  var rg = M.rng(4); for (var i = 0; i < 70; i++){ var bx = 46+Math.floor(rg()*240), by = 24+Math.floor(rg()*108); var cx2 = 224+Math.round(Math.sin(by*0.045)*14+(by-70)*0.1); if (Math.abs(bx-cx2) < 9) continue; var w = 5+Math.floor(rg()*7), hgt = 3+Math.floor(rg()*4); b.rect(bx, by, w, hgt, P.w4); b.hl(bx, bx+w-1, by, P.w5); }
  // Wege
  function road(pts){ for (var j = 0; j+1 < pts.length; j++){ b.line(pts[j][0], pts[j][1], pts[j+1][0], pts[j+1][1], P.s6); b.line(pts[j][0], pts[j][1]+1, pts[j+1][0], pts[j+1][1]+1, P.s6); b.line(pts[j][0], pts[j][1]+2, pts[j+1][0], pts[j+1][1]+2, P.s3); } }
  road([[92, 54], [130, 62], [176, 76]]); road([[176, 76], [210, 90], [236, 100]]); road([[176, 76], [150, 92], [120, 106]]); road([[120, 106], [90, 114], [60, 122], [20, 126]]);
  // Brücke
  b.rect(228, 96, 18, 5, P.s6); b.hl(228, 245, 96, P.k2); b.hl(228, 245, 100, P.k2);
  // Kartusche, Windrose
  b.rect(10, 104, 64, 26, P.s6); b.rect(11, 105, 62, 24, P.s5); b.hl(10, 73, 104, P.e3); M.microText(b, 'MOSTAR', 26, 109, P.k2); M.microText(b, '1955', 34, 119, P.r2);
  b.vl(290, 100, 124, P.k2); b.hl(278, 302, 112, P.k2); M.microText(b, 'N', 288, 93, P.k2);
  return b; };
})(MA);
