/* ===== M. Adventure – art/details.js =====
   Zusätzliche Einzelheiten für die Hintergründe, über die Malfunktionen der Orte gelegt (die Ortsdateien bleiben übersichtlich):
   Schulhof – Fallrohr mit Rinne, Geranien unter den Fenstern, abgeplatzter Putz, Risse, Efeu, Fahrrad an der Hofmauer,
              Himmel-und-Hölle aus Kreide, Eimer und Besen an der Treppe
   Markt    – Gemüsekisten neben Maras Stand, Wäscheleine zwischen den Häusern (die Wäsche flattert, siehe engine/extras.js)
   Paradestraße – Plakate an den Fassaden, Wimpel an den Platanen */
(function(MA){
'use strict';
var P = M.P, R = M.R, SC = MA.SC, hash = M.hash, bayer = M.bayer;
function wrap(id, fn){ var A = MA.ART[id]; if (!A || A._detail) return; var orig = A.paint; A.paint = function(S, G){ var b = orig(S, G); fn(b, S, G); return b; }; A._detail = true; }

// ---------------------------------------------------------------- Schulhof
wrap('hof', function(b, S, G){
  // Regenrinne unter dem Traufgesims und Fallrohr an der Hausecke, mit Schellen
  b.hl(0, 194, 7, P.m2); b.hl(0, 194, 8, P.m1);
  for (var y = 8; y < 100; y++){ b.px(190, y, P.m3); b.px(191, y, P.m2); b.px(192, y, P.m1); if (y % 15 === 4){ b.px(189, y, P.m1); b.px(193, y, P.k2); b.px(190, y, P.m4); } }
  b.px(189, 100, P.m2); b.px(190, 100, P.m3); b.px(191, 100, P.m3); b.px(192, 100, P.m1); b.px(193, 100, P.m1);
  // Geranien in Holzkästen unter den oberen Fenstern
  [14, 44, 132, 162].forEach(function(wx, i){ b.rect(wx-1, 39, 18, 3, P.w2); b.hl(wx-1, wx+16, 39, P.w3); b.hl(wx-1, wx+16, 41, P.w1);
    for (var k = 0; k < 8; k++){ var fx = wx+k*2, fy = 37+((k+i) % 2); b.px(fx, fy+1, P.g3); b.px(fx+1, fy+1, P.g2); if ((k+i) % 3 !== 1){ b.px(fx, fy, (k % 2) ? P.r3 : P.r4); if (k % 4 === 0) b.px(fx+1, fy-1, P.r5); } } });
  // abgeplatzter Putz mit Ziegeln darunter, feine Risse
  [[58, 70, 9, 6], [172, 24, 7, 5], [6, 82, 8, 5]].forEach(function(q){ for (var yy = q[1]; yy < q[1]+q[3]; yy++) for (var xx = q[0]; xx < q[0]+q[2]; xx++){ var edge = yy === q[1] || xx === q[0] || yy === q[1]+q[3]-1 || xx === q[0]+q[2]-1; if (edge && hash(xx, yy) < 0.45) continue;
    var brick = ((yy-q[1]) % 3 === 2) || (((xx+((Math.floor((yy-q[1])/3) % 2)*2)) % 5) === 0); b.px(xx, yy, edge ? P.w2 : (brick ? P.s3 : (hash(xx*3, yy) < 0.5 ? P.r2 : P.r3))); } });
  [[120, 50, [[0, 0], [1, 1], [1, 2], [2, 3], [2, 4], [3, 5]]], [30, 26, [[0, 0], [-1, 1], [-1, 2], [0, 3], [-1, 4]]], [150, 66, [[0, 0], [1, 1], [2, 1], [3, 2], [3, 3]]]].forEach(function(c){ c[2].forEach(function(o){ b.px(c[0]+o[0], c[1]+o[1], P.w1); }); });
  // Efeu an der rechten Hauskante
  for (var e = 0; e < 70; e++){ var ex = 172+Math.round(hash(e, 3)*16), ey = 48+Math.round(hash(e, 7)*44)+Math.round((ex-172)*0.3); if (ey > 91) continue; b.px(ex, ey, hash(e, 9) < 0.5 ? P.g3 : P.g2); if (hash(e, 11) < 0.35) b.px(ex+1, ey, P.g4); }
  for (var v = 0; v < 40; v++){ b.px(186-Math.round(v*0.35), 92-v, P.g1); }
  // Fahrrad an der Hofmauer (hinter der Bank)
  var bx = 330, by = 101;
  function wheel(cx, cy){ for (var a = 0; a < 24; a++){ var an = a/24*Math.PI*2; b.px(Math.round(cx+Math.cos(an)*5), Math.round(cy+Math.sin(an)*5), P.k2); } b.line(cx-4, cy, cx+4, cy, P.m3); b.line(cx, cy-4, cx, cy+4, P.m3); b.px(cx, cy, P.m4); }
  wheel(bx, by-5); wheel(bx+15, by-5);
  b.line(bx, by-5, bx+6, by-11, P.r3); b.line(bx+6, by-11, bx+13, by-11, P.r3); b.line(bx+13, by-11, bx+15, by-5, P.r3); b.line(bx+6, by-11, bx+8, by-5, P.r2); b.line(bx, by-5, bx+8, by-5, P.r2);
  b.line(bx+5, by-12, bx+7, by-13, P.k2); b.hl(bx+4, bx+7, by-14, P.k1); b.line(bx+13, by-11, bx+12, by-15, P.m2); b.hl(bx+10, bx+14, by-16, P.m1);
  // Himmel-und-Hölle aus Kreide auf den Platten
  var hx = 30, hy = 126; [[0, 0], [0, -5], [-5, -10], [5, -10], [0, -15]].forEach(function(q, i){ var x0 = hx+q[0], y0 = hy+q[1]; b.hl(x0, x0+8, y0, P.s6); b.hl(x0, x0+8, y0+4, P.s6); b.vl(x0, y0, y0+4, P.s6); b.vl(x0+8, y0, y0+4, P.s6); M.microText(b, String(i+1), x0+3, y0, P.s5); });
  // Eimer und Besen neben der Treppe
  b.rect(112, 96, 5, 5, P.m3); b.hl(112, 116, 96, P.m4); b.px(116, 98, P.m1); b.line(111, 95, 114, 93, P.m2);
  b.line(76, 80, 79, 100, P.w3); b.poly([[76, 99], [82, 99], [83, 103], [75, 103]], P.e3);
});

// ---------------------------------------------------------------- Markt
wrap('markt', function(b, S, G){
  // Gemüsekisten neben Maras Stand: Tomaten, Paprika, Zwiebeln
  [[140, 108, P.r3, P.r4], [152, 110, P.g4, P.g5], [146, 101, P.w5, P.w6]].forEach(function(c){ b.rect(c[0], c[1], 11, 6, P.w2); b.hl(c[0], c[0]+10, c[1], P.w4); b.hl(c[0], c[0]+10, c[1]+3, P.w1);
    for (var i = 0; i < 5; i++){ b.px(c[0]+1+i*2, c[1]-1, c[2]); b.px(c[0]+2+i*2, c[1]-1, c[3]); b.px(c[0]+1+i*2, c[1]-2, i % 2 ? c[3] : c[2]); } });
  // Wäscheleine zwischen den Häusern oben links (die Wäsche selbst bewegt sich: SC.rec/laundry)
  if (SC.rec) SC.rec.push({ k: 'laundry', x0: 64, y0: 52, x1: 112, y1: 54, items: [[70, P.s6, 6, 7], [79, P.b3, 5, 6], [87, P.r4, 6, 5], [96, P.s5, 7, 8], [106, P.g5, 4, 5]] });
  else { b.line(64, 52, 112, 54, P.k2); }
});

// ---------------------------------------------------------------- Paradestraße
wrap('parade', function(b, S, G){
  // Plakate zum Besuch an den Fassaden
  [[16, 66], [196, 66], [348, 64]].forEach(function(q){ SC.posterTiko(b, q[0], q[1], 16, 20, { text: 'TIKO' }); });
});
})(MA);
