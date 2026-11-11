/* ===== M. Adventure – art/room_klasse.js =====
   Klassenzimmer (Fluchtpunkt-Raum, 320 × 144): grüner Ölsockel, weiß gekalkte Wände, Dielen; an der Rückwand Tafel mit Kreide,
   darüber Tiko in Öl, links die Landkarte und der Kachelofen; links die Tür, rechts das große Fenster zum Hinterhof,
   davor die Büste des Schulgründers auf ihrem Sockel mit Plakette; vorn das Lehrerpult (Mappe, Schere) und drei Schulbänke.
   Dazu die Nahansicht „Fenster zum Hinterhof“ (Tor, Riegel, Offenrast-Haken, Passage, Fensterbank, Büste, Leine). */
(function(MA){
'use strict';
var P = M.P, T = M.T, R = M.R, SC = MA.SC, bayer = M.bayer, hash = M.hash;
var spec = { rect: [64, 14, 256, 96], vp: [160, 56] }, R3 = M.room3([160, 56], 40, 96);
var K = { door: [36, 34, 24, 74], win: [264, 20, 34, 52], board: [108, 32, 104, 40], chalk: [188, 70, 12, 5], tiko: [146, 15, 28, 20], map: [70, 24, 34, 28], stove: [66, 54, 16, 44],
  desk: [24, 86, 66, 46], mappe: [40, 86, 18, 7], schere: [64, 88, 12, 6], bust: [256, 50, 24, 26], ped: [258, 74, 20, 34], plaque: [261, 82, 14, 8], benches: [150, 104, 160, 40] };
function paint(S, G){ var b = new M.Buf(320, 144, P.k0);
  var WALL = R('s3 s4 s5 s6'), DADO = R('g1 g2 g3 g4');
  M.box(b, { rect: spec.rect, vp: spec.vp,
    back: function(u, v, x, y){ var H = 82; if (v > H*0.62){ var c = (v > H*0.62 && v < H*0.62+1) ? DADO[3] : SC.plaster(x, y, DADO, undefined); return c; } return SC.plaster(x, y, WALL, undefined); },
    side: function(u, v, x, y, sd){ var H = 82, c = v > H*0.62 ? SC.plaster(x, y, DADO) : SC.plaster(x, y, WALL); if (sd === 'L') c = M.DN[c]; if (Math.abs(v-H*0.62) < 0.7) c = DADO[3]; return c; },
    floor: function(xb, d, x, y){ return M.tex.planks(xb, y, 56, 96, R('w1 w2 w3 w4'), 10); },
    ceil: function(xc, d, x, y){ return y < 6 ? P.s3 : P.s4; } });
  // Licht vom Fenster (rechts) auf den Boden, Schatten links
  M.light(b, function(x, y){ if (y < 96) return x > 250 ? 0.15 : 0; var dx = (x-290)/110, dy = (y-120)/40; var a = 1-dx*dx-dy*dy; return (a > 0 ? a*0.8 : 0)-(x < 60 ? 0.35 : 0); }, 0, 0);
  // Tür (linke Wand)
  var dq = M.wallQuad(spec, 'L', 6, 26, 40, 96); b.poly(dq, P.w1); var dq2 = M.wallQuad(spec, 'L', 8, 24, 43, 96); b.poly(dq2, P.w2); var dm = M.wallQuad(spec, 'L', 15.5, 16.5, 44, 96); b.poly(dm, P.w0);
  var kn = M.wallPt(spec, 'L', 21, 70); b.px(Math.round(kn[0]), Math.round(kn[1]), P.y3);
  // Fenster (rechte Wand) mit Blick auf Hof und Mauer
  var wq = M.wallQuad(spec, 'R', 8, 34, 26, 70); b.poly(wq, P.s6);
  var wi = M.wallQuad(spec, 'R', 9.5, 32.5, 28, 68); b.poly(wi, function(x, y){ return y < 44 ? M.rampAt(R('b3 b4 b5'), (y-20)/26, x, y) : (y < 56 ? P.s3 : P.e3); });
  var wm = M.wallQuad(spec, 'R', 20.5, 21.5, 28, 68); b.poly(wm, P.s5); var wh = M.wallQuad(spec, 'R', 9.5, 32.5, 47, 48.5); b.poly(wh, P.s5);
  var sill = M.wallQuad(spec, 'R', 7, 35, 70, 73); b.poly(sill, P.s4);
  // Tafel, Kreide, Schrift
  var bd = K.board; b.rect(bd[0]-2, bd[1]-2, bd[2]+4, bd[3]+4, P.w2); b.rect(bd[0], bd[1], bd[2], bd[3], P.g1); b.drect(bd[0], bd[1], bd[2], bd[3], P.g1, P.k2, 0.2);
  b.rect(bd[0]-2, bd[1]+bd[3]+2, bd[2]+4, 2, P.w3); M.microText(b, 'HEUTE:', bd[0]+8, bd[1]+8, P.s5); M.microText(b, 'GESCHICHTE ERLEBEN', bd[0]+8, bd[1]+17, P.s5); M.microText(b, 'ABFRAGE?', bd[0]+66, bd[1]+30, P.s3);
  for (var w = 0; w < 30; w++){ var sx = bd[0]+4+((w*13) % (bd[2]-8)), sy = bd[1]+3+((w*7) % (bd[3]-6)); if (bayer(sx, sy) < 0.3) b.px(sx, sy, P.g2); }
  if (!G.flags['kreide.taken']){ b.rect(K.chalk[0]+2, K.chalk[1]+1, 5, 2, P.s6); } b.rect(K.chalk[0]-8, K.chalk[1]+1, 4, 2, P.y3);
  // Tiko in Öl
  var tk = K.tiko; b.rect(tk[0], tk[1], tk[2], tk[3], P.y2); b.rect(tk[0]+2, tk[1]+2, tk[2]-4, tk[3]-4, P.c1); b.ellipse(tk[0]+14, tk[1]+11, 5, 6, P.q3); b.rect(tk[0]+8, tk[1]+4, 12, 3, P.s6); b.hl(tk[0]+8, tk[0]+19, tk[1]+6, P.y3); b.rect(tk[0]+6, tk[1]+15, 16, 3, P.s5); b.hl(tk[0], tk[0]+tk[2]-1, tk[1], P.y4);
  // Landkarte Jugoslawiens
  var mp = K.map; b.rect(mp[0], mp[1], mp[2], mp[3], P.w3); b.rect(mp[0]+1, mp[1]+1, mp[2]-2, mp[3]-2, P.a5);
  b.poly([[mp[0]+6, mp[1]+5], [mp[0]+20, mp[1]+3], [mp[0]+31, mp[1]+8], [mp[0]+30, mp[1]+20], [mp[0]+24, mp[1]+26], [mp[0]+16, mp[1]+22], [mp[0]+8, mp[1]+14]], P.g4); b.line(mp[0]+8, mp[1]+12, mp[0]+16, mp[1]+22, P.g2); b.px(mp[0]+17, mp[1]+18, P.r3);
  // Kachelofen
  var st = K.stove; for (var y = st[1]; y < st[1]+st[3]; y++) for (var x = st[0]; x < st[0]+st[2]; x++){ var c = ((Math.floor((y-st[1])/5)+Math.floor((x-st[0])/5)) % 2) ? P.t2 : P.t3; if ((y-st[1]) % 5 === 0 || (x-st[0]) % 5 === 0) c = P.t1; b.px(x, y, c); } b.rect(st[0]-1, st[1]-2, st[2]+2, 3, P.t4);
  // Sockel der Büste mit Plakette (die Büste selbst ist eine Ebene)
  var pd = K.ped; b.rect(pd[0], pd[1], pd[2], pd[3], P.s3); b.rect(pd[0]+1, pd[1], pd[2]-2, 2, P.s5); b.vl(pd[0]+pd[2]-1, pd[1], pd[1]+pd[3]-1, P.s2); var pq = K.plaque; b.rect(pq[0], pq[1], pq[2], pq[3], P.y2); b.hl(pq[0]+2, pq[0]+pq[2]-3, pq[1]+3, P.y4); b.hl(pq[0]+3, pq[0]+pq[2]-4, pq[1]+5, P.y4);
  SC.dither(b, pd[0]-6, pd[1]+pd[3], pd[2]+8, 3, 0.6);
  return b; }
function bust(w, x, y){ var Bz = R('w0 w1 w2 w3'); w.rect(x+2, y+20, 18, 6, Bz[1]); w.rect(x+1, y+24, 20, 3, Bz[0]); w.ellipse(x+11, y+16, 9, 5, Bz[2]); w.ellipse(x+11, y+8, 5, 7, Bz[2]); w.ellipse(x+10, y+7, 3, 5, Bz[3]); w.px(x+13, y+7, Bz[0]); w.px(x+14, y+9, Bz[1]); w.hl(x+8, x+13, y+12, Bz[1]); }
function layers(S, G){ var out = [];
  // Büste (am Sockel oder, nach dem Verschieben, auf der Fensterbank)
  var L0 = M.layer(240, 30, 60, 50, 108), w0 = M.lw(L0); if (G.flags['bust.moved']) bust(w0, 270, 44); else bust(w0, 257, 48); out.push(L0);
  // Lehrerpult (3D), darauf Mappe, Klassenbuch, Schere
  var L1 = M.layer(0, 80, 110, 64, 128), w1 = M.lw(L1), top = R('w2 w3 w4');
  R3.box(w1, 70, 124, 76, 96, 20, 34, { top: function(x, y){ return M.rampAt(top, 0.7-(y-88)/12, x, y); }, front: P.w1, left: P.w0, right: P.w0 });
  var a = R3.p(70, 76, 34), c = R3.p(124, 76, 34); w1.hl(Math.round(a[0]), Math.round(c[0]), Math.round(a[1]), P.w4);
  var mp = K.mappe; w1.rect(mp[0], mp[1], mp[2], mp[3], P.e3); w1.rect(mp[0]+1, mp[1]-1, mp[2]-2, 2, P.s6); w1.hl(mp[0]+2, mp[0]+mp[2]-3, mp[1]+2, P.e2);
  w1.rect(mp[0]-14, mp[1]+1, 10, 6, P.r1); w1.hl(mp[0]-14, mp[0]-5, mp[1]+1, P.r2);
  var sc = K.schere; w1.line(sc[0], sc[1]+4, sc[0]+8, sc[1], P.m3); w1.line(sc[0]+1, sc[1], sc[0]+8, sc[1]+4, P.m3); w1.ellipse(sc[0]+1, sc[1]+1, 1.6, 1.6, P.k2); w1.ellipse(sc[0]+1, sc[1]+4, 1.6, 1.6, P.k2);
  out.push(L1);
  // Schulbänke (drei Reihen, rechts vorn)
  [[14, 20, 104], [26, 32, 116], [38, 44, 130]].forEach(function(r, i){ var L = M.layer(140, 70, 180, 74, r[2]), w = M.lw(L);
    R3.box(w, 176, 250, 82, 96, r[0], r[1], { top: P.w3, front: P.w1, left: P.w0, right: P.w0 }); var tl = R3.p(176, 82, r[1]), tr = R3.p(250, 82, r[1]); w.hl(Math.round(tl[0]), Math.round(tr[0]), Math.round(tl[1]), P.w4);
    R3.box(w, 176, 250, 88, 96, r[1]+2, r[1]+5, { top: P.w2, front: P.w0 }); out.push(L); });
  return out; }

// ---------------------------------------------------------------- Nahansicht: Fenster zum Hinterhof
var KF = { win: [70, 6, 180, 112], gate: [126, 62, 66, 52], latch: [154, 74, 14, 22], hook: [212, 80, 8, 8], passage: [196, 30, 40, 40], bust: [262, 48, 36, 70], bustSill: [218, 92, 30, 32], sill: [40, 116, 240, 28], line: [150, 92, 30, 30] };
function paintF(S, G){ var b = new M.Buf(320, 144, P.k1), open = !!G.flags['win.open'], gateOpen = !!G.flags['gate.offen'], held = !!G.flags['latch.held'];
  // Wand innen um das Fenster
  for (var y = 0; y < 144; y++) for (var x = 0; x < 320; x++) b.px(x, y, SC.plaster(x, y, R('s2 s3 s4'), undefined));
  var w = KF.win; b.rect(w[0]-6, w[1]-4, w[2]+12, w[3]+8, P.s5); b.rect(w[0]-3, w[1]-1, w[2]+6, w[3]+2, P.s6);
  // Blick hinaus: Hinterhof von oben, Mauer, Tor, Passage dahinter
  for (var y2 = w[1]; y2 < w[1]+w[3]; y2++) for (var x2 = w[0]; x2 < w[0]+w[2]; x2++){ var c;
    if (y2 < 30) c = SC.plaster(x2, y2, R('w3 w4 w5'), 10);   // Hauswand gegenüber
    else if (y2 < 62) c = M.tex.ashlar(x2, y2, R('s1 s2 s3 s4'), 14, 7);   // Hofmauer
    else c = M.tex.cobble(x2, y2, R('s1 s2 s3 s4'), 5);   // Hofboden
    b.px(x2, y2, c); }
  // Passage hinter der Mauer (dunkler Durchgang)
  var pg = KF.passage; b.rect(pg[0], pg[1], pg[2], pg[3], P.k2); b.drect(pg[0], pg[1], pg[2], 8, P.k2, P.m0, 0.3); M.microText(b, 'PROLAZ', pg[0]+8, pg[1]+3, P.m1);
  // Tor (offen in der Offenrast oder zu)
  var g = KF.gate; b.rect(g[0]-3, g[1]-4, g[2]+6, 4, P.s3);
  if (gateOpen){ b.rect(g[0], g[1], g[2], g[3], P.k2); M.tex && b.drect(g[0], g[1], g[2], g[3], P.k2, P.m0, 0.2);
    for (var yy = g[1]; yy < g[1]+g[3]; yy++){ for (var xx = g[0]+g[2]+2; xx < g[0]+g[2]+16; xx++) b.px(xx, yy+Math.round((xx-g[0]-g[2])*0.15), M.tex.boards(xx, yy, R('w1 w2 w3'), 5)); }
    b.px(KF.hook[0]+2, KF.hook[1]+3, P.m4); b.line(g[0]+g[2]+15, g[1]+20, KF.hook[0]+2, KF.hook[1]+3, P.m3);
    for (var yy2 = g[1]; yy2 < g[1]+g[3]; yy2++) for (var xx2 = g[0]-14; xx2 < g[0]-1; xx2++) b.px(xx2, yy2-Math.round((g[0]-xx2)*0.15), M.tex.boards(xx2, yy2, R('w1 w2 w3'), 5)); }
  else { for (var yy3 = g[1]; yy3 < g[1]+g[3]; yy3++) for (var xx3 = g[0]; xx3 < g[0]+g[2]; xx3++){ var c3 = M.tex.boards(xx3, yy3, R('w1 w2 w3 w4'), 6); if (Math.abs(xx3-(g[0]+g[2]/2)) < 1) c3 = P.w0; b.px(xx3, yy3, c3); }
    // Riegel mit Ring (innen): oben gehalten oder unten in der Krampe
    var lt = KF.latch, ly = held ? lt[1]-6 : lt[1]; b.rect(lt[0]+5, ly, 3, lt[3], P.m2); b.vl(lt[0]+5, ly, ly+lt[3]-1, P.m3); b.ellipse(lt[0]+6, ly-2, 3, 3, P.m3); b.ellipse(lt[0]+6, ly-2, 1.6, 1.6, P.k2);
    b.rect(lt[0]+2, lt[1]+lt[3]-2, 9, 3, P.m1); b.rect(g[0]+g[2]/2-6, g[1]+30, 12, 3, P.m1); }
  b.rect(KF.hook[0], KF.hook[1], 4, 4, P.m2); b.px(KF.hook[0]+3, KF.hook[1]+3, P.m4);
  // Fensterrahmen und Flügel
  b.rect(w[0], w[1], w[2], 3, P.s6); b.rect(w[0], w[1]+w[3]-3, w[2], 3, P.s6); b.rect(w[0], w[1], 3, w[3], P.s6); b.rect(w[0]+w[2]-3, w[1], 3, w[3], P.s6);
  if (!open){ var gl = function(x, y){ var c = b.get(x, y); var r = ((x+y) % 23 < 4) ? M.UP[M.UP[c]] : M.UP[c]; return r; };
    for (var y3 = w[1]+3; y3 < w[1]+w[3]-3; y3++) for (var x3 = w[0]+3; x3 < w[0]+w[2]-3; x3++){ if (bayer(x3, y3) < 0.35) b.px(x3, y3, gl(x3, y3)); }
    b.rect(w[0]+w[2]/2-2, w[1], 4, w[3], P.s5); b.rect(w[0], w[1]+w[3]/2-2, w[2], 4, P.s5); b.px(w[0]+w[2]/2+3, w[1]+w[3]/2+6, P.y3); }
  else { [[w[0]-30, -1], [w[0]+w[2]+4, 1]].forEach(function(f){ for (var y4 = w[1]+2; y4 < w[1]+w[3]-2; y4++) for (var x4 = f[0]; x4 < f[0]+26; x4++){ var e = (x4 === f[0] || x4 === f[0]+25 || y4 === w[1]+2 || y4 === w[1]+w[3]-3) ? P.s6 : ((x4+y4) % 19 < 3 ? P.b4 : P.b2); b.px(x4, y4, e); } }); }
  // Fensterbank (Stein)
  var sl = KF.sill; b.rect(sl[0], sl[1], sl[2], sl[3], P.s4); b.hl(sl[0], sl[0]+sl[2]-1, sl[1], P.s6); b.hl(sl[0], sl[0]+sl[2]-1, sl[1]+1, P.s5); b.rect(sl[0]+4, sl[1]+4, sl[2]-8, 1, P.s3);
  // Leine (am Riegel eingehängt bzw. unter der Büste)
  if (held || G.flags['line.atWindow']){ var ex = KF.latch[0]+6, ey = (held ? KF.latch[1]-8 : KF.latch[1]-2); if (!G.flags['gate.offen']) for (var t = 0; t <= 1; t += 0.02){ var lx = Math.round(ex+(160-ex)*t), lyy = Math.round(ey+(118-ey)*t); b.px(lx, lyy, P.e4); } b.line(160, 118, KF.bustSill[0]+6, 119, P.e4); }
  return b; }
function layersF(S, G){ var L = M.layer(200, 40, 120, 104, 200), w = M.lw(L), Bz = R('w0 w1 w2 w3');
  if (G.flags['bust.moved']){ var x = KF.bustSill[0], y = KF.bustSill[1]; w.rect(x+2, y+22, 26, 6, Bz[1]); w.ellipse(x+15, y+17, 12, 6, Bz[2]); w.ellipse(x+15, y+8, 7, 9, Bz[2]); w.ellipse(x+13, y+7, 4, 6, Bz[3]); w.px(x+19, y+8, Bz[0]); w.hl(x+11, x+18, y+14, Bz[1]); }
  else { var x2 = KF.bust[0]+4, y2 = KF.bust[1]; w.rect(x2-2, y2+34, 34, 36, P.s3); w.rect(x2+2, y2+22, 26, 12, Bz[1]); w.ellipse(x2+15, y2+17, 12, 6, Bz[2]); w.ellipse(x2+15, y2+8, 7, 9, Bz[2]); w.ellipse(x2+13, y2+7, 4, 6, Bz[3]); w.px(x2+19, y2+8, Bz[0]); w.hl(x2+11, x2+18, y2+14, Bz[1]); }
  return [L]; }
MA.ART = MA.ART || {};
MA.ART.klasse = { K: K, spec: spec, R3: R3, paint: paint, layers: layers };
MA.ART.fenster = { K: KF, paint: paintF, layers: layersF };
})(MA);
