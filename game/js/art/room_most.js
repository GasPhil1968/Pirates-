/* ===== M. Adventure – art/room_most.js =====
   Stari Most (400 × 144) in der Ansicht von flussaufwärts: der Bogen aus Kalkstein mit Gesims und Brüstung, auf dem Scheitel gehen die
   Figuren hinter der Brüstung (bis zur Hüfte verdeckt), darunter die Neretva, an den Enden die Brückentürme, dahinter die Ufer.
   Dragans Ball liegt auf dem Gesims vor der Brüstung; Netz und Leine hängen bei der Bergung darunter. */
(function(MA){
'use strict';
var P = M.P, T = M.T, R = M.R, SC = MA.SC, bayer = M.bayer, hash = M.hash;
var W = 400, CX = 200, HALF = 176;
function deck(x){ var t = (x-CX)/HALF; return 74+t*t*24; }          // Oberkante des Gesimses (Gehweg dahinter)
function intra(x){ var t = (x-CX)/HALF; return 100+t*t*60; }         // Bogenlaibung
var K = { W: W, ball: [264, 0], deck: deck, intra: intra, parH: 13 };
K.ball[1] = Math.round(deck(264))-3;
function paint(S, G){ var b = new M.Buf(W, 144, P.k0);
  SC.sky(b, 0, 0, W, 78, 41);
  SC.hills(b, 0, W, 54, 22, 12, false); SC.hills(b, 0, W, 66, 14, 15, true);
  // Ufer mit Häusern und Minarett (flussabwärts, hinter der Brücke)
  [[24, 58, 36], [58, 62, 30], [88, 66, 26], [300, 64, 30], [330, 58, 34], [362, 60, 38]].forEach(function(h, i){ SC.house(b, h[0], h[1]+28, h[2], 26, { upper: i % 2 ? 'wood' : 'plaster' }); });
  SC.minaret(b, 318, 64, 50);
  for (var y = 86; y < 144; y++) for (var x = 0; x < W; x++){ var bank = (x < 110 || x > 290) ? 1 : 0; var ry = y; if (bank && y < 118){ b.px(x, y, M.tex.foliage(x, y, R('g1 g2 g3 g4'))); continue; }
    // Neretva: smaragd, mit hellen Streifen
    var v = 0.35+0.4*Math.sin(x*0.07+y*0.9)*0.5+(y-86)/58*0.25; var c = M.rampAt(R('a1 a2 a3 a4 a5'), v, x, y); if (Math.sin(x*0.21+y*1.7) > 0.93) c = P.a6; b.px(x, y, c); }
  // Felsen am Ufer
  for (var y2 = 104; y2 < 144; y2++) for (var x2 = 0; x2 < W; x2++){ var edge = (x2 < 120 && y2 > 104+(x2/120)*20) || (x2 > 280 && y2 > 104+((W-x2)/120)*20); if (edge) b.px(x2, y2, M.tex.ashlar(x2, y2, R('s1 s2 s3 s4'), 9, 5)); }
  // Brückenkörper: Zwickel zwischen Gesims und Laibung
  for (var x3 = 10; x3 < W-10; x3++){ var top = Math.round(deck(x3))+3, bot = Math.min(143, Math.round(intra(x3)));
    for (var y3 = top; y3 <= bot; y3++){ var c3 = M.tex.ashlar(x3+3, y3, R('s2 s3 s4 s5'), 10, 5); if (y3 > bot-3) c3 = M.DN[c3]; if (x3 > CX+40 && bayer(x3, y3) < (x3-CX-40)/300) c3 = M.DN[c3]; b.px(x3, y3, c3); }
    // Laibung (Bogenunterkante) mit Keilsteinen
    for (var k = 0; k < 4; k++){ var yy = Math.round(intra(x3))-k; if (yy < 144 && yy >= top) b.px(x3, yy, ((Math.floor(x3/6)) % 2) ? P.s4 : P.s3); }
    // Gesims (vorspringende Kante)
    var gy = Math.round(deck(x3)); b.px(x3, gy, P.s6); b.px(x3, gy+1, P.s5); b.px(x3, gy+2, P.s2); }
  // Brückentürme an den Enden
  [[0, 34], [W-34, 34]].forEach(function(t){ for (var y4 = 30; y4 < 144; y4++) for (var x4 = t[0]; x4 < t[0]+t[1]; x4++) b.px(x4, y4, M.tex.ashlar(x4, y4, R('s1 s2 s3 s4'), 12, 6)); SC.roof(b, t[0]-3, 18, t[1]+6, 12, { slope: 1, ridge: 'tent', light: true }); SC.window(b, t[0]+12, 46, 8, 10, { bars: true }); });
  return b; }
// Vordergrund: die Brüstung (verdeckt die Figuren bis zur Hüfte), Ball, Netz und Leine
function layers(S, G){ var L = M.layer(10, 40, W-20, 64, 999), w = M.lw(L);
  for (var x = 30; x < W-30; x++){ var gy = Math.round(deck(x)), top = gy-K.parH;
    for (var y = top; y < gy; y++){ var c = M.tex.ashlar(x, y, R('s3 s4 s5 s6'), 16, 7); if (y === top) c = P.s6; else if (y === top+1) c = P.s5; b0(w, x, y, c); } }
  // Netz unter dem Gesims, Leine über die Brüstung
  var bx = K.ball[0];
  if (G.flags['net.hung'] && !G.flags['ball.out']){ var ny = Math.round(deck(bx))+5; for (var yy = ny; yy < ny+9; yy++) for (var xx = bx-6; xx <= bx+6; xx++){ var u = (xx-bx)/6, inside = yy-ny > Math.abs(u)*3; if (!inside) continue; if ((xx+yy) % 2 === 0 || yy === ny+8) b0(w, xx, yy, P.e3); }
    var py = Math.round(deck(bx))-K.parH; w.line(bx, ny, bx-2, py, P.e4); w.line(bx-2, py, bx-14, py-6, P.e4); }
  return [L]; }
function b0(w, x, y, c){ w.px(x, y, c); }
// Ball auf dem Gesims (vor der Brüstung, in einer eigenen Lage)
function props(view){ var G = view.GS, out = []; if (!G.flags['ball.out']){ out.push({ base: 1000, draw: function(fb, v){ var x = K.ball[0]-v.cam, y = K.ball[1]; fb.ellipse(x+0.5, y+0.5, 3.6, 3.6, function(xx, yy){ var dx = xx-x, dy = yy-y; return (dx+dy < -2.5) ? P.l1 : ((dx*dx+dy*dy < 1.6 || (Math.abs(dx-2) < 0.8 && Math.abs(dy+1) < 0.8)) ? P.k1 : P.s5); }); for (var i = -3; i <= 3; i++){ var px = Math.round(x+i), py = y+3; if (px >= 0 && px < 320) fb.d[py*320+px] = M.DN[fb.d[py*320+px]]; } } }); } return out; }
// Wasser bewegt sich
function dynamic(fb, view){ var t = view.gt/1000; for (var y = 118; y < 144; y++) for (var x = 0; x < 320; x++){ var wx = x+view.cam; if (wx < 120 || wx > 280) continue; var k = y*320+x; if (Math.sin(wx*0.21+y*1.7-t*2.2) > 0.95) fb.d[k] = P.a6; } }
MA.ART = MA.ART || {};
MA.ART.most = { K: K, paint: paint, layers: layers, props: props, dynamic: dynamic };
})(MA);
