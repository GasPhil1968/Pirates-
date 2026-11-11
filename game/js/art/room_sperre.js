/* ===== M. Adventure – art/room_sperre.js =====
   Straßensperre an der Hauptstraße (420 × 144): Fassaden aus der k.u.k.-Zeit, Kiosk, Plakatwand mit dem Tiko-Plakat,
   die schmale Passage zum Hinterhof der Schule, Dienstvorschrift auf einem Ständer, der rot-weiße Schlagbaum, dahinter die Paradestraße. */
(function(MA){
'use strict';
var P = M.P, T = M.T, R = M.R, SC = MA.SC, bayer = M.bayer, hash = M.hash;
var K = { W: 420, kiosk: [36, 58, 50, 46], poster: [118, 52, 46, 44], bucket: [168, 104, 10, 8], passage: [210, 44, 30, 60], rules: [262, 78, 22, 18], barrier: [292, 94, 128, 8], post: [292, 84, 8, 26] };
function facade(b, x0, w, ramp, opt){ opt = opt || {}; var top = opt.top || 8; SC.plasterWall(b, x0, top, w, 104-top, ramp, top+30);
  b.rect(x0, top, w, 3, M.UP[ramp[1]]); b.hl(x0, x0+w-1, top+3, M.DN[ramp[0]]); b.rect(x0, 52, w, 2, M.UP[ramp[1]]);
  for (var wx = x0+6; wx < x0+w-12; wx += 18){ SC.window(b, wx, top+12, 10, 16, { frame: R('s3 s4 s5 s6'), open: hash(wx, 7) < 0.3 }); if (hash(wx, 9) < 0.5){ b.rect(wx-3, top+29, 16, 2, P.m1); for (var bx = wx-3; bx < wx+13; bx += 2) b.vl(bx, top+25, top+28, P.m1); } }
  if (opt.shop){ b.rect(x0+4, 66, w-8, 30, P.k2); b.rect(x0+4, 62, w-8, 4, opt.shop); M.microText(b, opt.sign || '', x0+8, 61, P.s6); for (var sx = x0+8; sx < x0+w-10; sx += 12) b.rect(sx, 70, 8, 22, P.n1); } }
function paint(S, G){ var W = K.W, b = new M.Buf(W, 144, P.k0);
  SC.sky(b, 0, 0, W, 30, 51);
  facade(b, 0, 110, R('w4 w5 d6'), { shop: P.g2, sign: 'KNJIZARA' });
  facade(b, 110, 98, R('p3 p4 p5'), {});
  // Passage (dunkler Durchgang zum Hinterhof)
  var pg = K.passage; for (var y = pg[1]; y < 104; y++) for (var x = pg[0]; x < pg[0]+pg[2]; x++){ var t = (y-pg[1])/(104-pg[1]), c = M.rampAt(R('k1 k2 m0 m1'), 0.15+t*0.3, x, y); if (y > 92) c = M.tex.cobble(x, y, R('k2 m0 m1'), 4); b.px(x, y, c); }
  b.rect(pg[0]+8, 66, 14, 24, P.w0); b.rect(pg[0]+9, 67, 12, 22, P.w1); b.vl(pg[0]+15, 67, 88, P.w0);   // das Hintertor ganz hinten
  if (G.flags['gate.offen']){ b.rect(pg[0]+9, 67, 12, 22, P.k2); b.drect(pg[0]+9, 67, 12, 22, P.k2, P.g1, 0.25); b.rect(pg[0]+20, 67, 3, 22, P.w1); }
  b.vl(pg[0]-1, pg[1], 103, P.s1); b.vl(pg[0]+pg[2], pg[1], 103, P.s1); M.microText(b, 'PROLAZ', pg[0]+3, pg[1]+3, P.s4);
  facade(b, 240, 70, R('c3 c4 c5'), {});
  facade(b, 310, 110, R('s3 s4 s5'), { shop: P.r2, sign: 'KAVANA' });
  // Transparent über der Straße, Girlanden
  SC.banner(b, 120, 14, 120, 9, 'ŽIVIO DRUG TIKO'); SC.garland(b, 0, 34, 420, 36, 8);
  [26, 300, 404].forEach(function(px){ SC.flagPole(b, px, 60, 30, 12, 9, px*0.1); });
  // Gehweg und Fahrbahn
  for (var y2 = 104; y2 < 144; y2++) for (var x2 = 0; x2 < W; x2++){ var c2; if (y2 < 110) c2 = M.tex.paving(x2, y2, R('s2 s3 s4 s5'), 10); else c2 = M.tex.cobble(x2, y2, R('s1 s2 s3'), 6); b.px(x2, y2, c2); }
  b.hl(0, W-1, 110, P.s4); b.hl(0, W-1, 111, P.s1);
  SC.dither(b, 0, 104, W, 4, 0.5);
  // hinter der Sperre: die Paradestraße mit Zuschauern in der Ferne
  for (var x3 = 316; x3 < W; x3++){ var ph = 90+Math.round(Math.sin(x3*0.9)*1.5); for (var y3 = ph; y3 < 100; y3++){ var col = [P.r3, P.b2, P.s5, P.e3, P.g3, P.w3][Math.floor(hash(Math.floor(x3/3), 1)*6)]; b.px(x3, y3, y3 < ph+2 ? P.q3 : col); } }
  return b; }
function layers(S, G){ var out = [];
  // Kiosk
  var k = K.kiosk, L1 = M.layer(k[0]-4, k[1]-10, k[2]+8, 60, 106), w = M.lw(L1);
  w.rect(k[0], k[1], k[2], k[3], P.g2); w.rect(k[0]+2, k[1]+8, k[2]-4, 18, P.k2); w.poly([[k[0]-4, k[1]], [k[0]+k[2]+3, k[1]], [k[0]+k[2]-6, k[1]-9], [k[0]+5, k[1]-9]], P.g1); w.hl(k[0]-4, k[0]+k[2]+3, k[1], P.g4);
  w.rect(k[0]+8, k[1]-7, 34, 6, P.s6); w.micro('KIOSK', k[0]+15, k[1]-6, P.r2);
  for (var i = 0; i < 4; i++){ var px = k[0]+4+i*11; w.rect(px, k[1]+10, 9, 13, P.s5); w.hl(px+1, px+7, k[1]+12, P.k2); w.rect(px+1, k[1]+14, 4, 4, P.m2); }
  w.rect(k[0], k[1]+28, k[2], 18, P.g3); w.hl(k[0], k[0]+k[2]-1, k[1]+28, P.g4); out.push(L1);
  // Plakatwand mit Tiko-Plakat
  var p = K.poster, L2 = M.layer(p[0]-4, p[1]-4, p[2]+20, 64, 108), v = M.lw(L2);
  v.rect(p[0]-3, p[1]-3, p[2]+6, p[3]+6, P.w1); v.vl(p[0]+4, p[1]+p[3]+3, 108, P.w0); v.vl(p[0]+p[2]-5, p[1]+p[3]+3, 108, P.w0);
  var fixed = !!G.flags['poster.fixed'], pasted = !!G.flags['poster.pasted'];
  SC.posterTiko(v.buf ? { rect: v.rect, ellipse: v.ellipse, hl: v.hl, px: v.px, poly: v.poly, line: v.line } : v, p[0], p[1], p[2], p[3], { text: 'TIKO', peel: !fixed && !pasted });
  if (fixed && !pasted){ [[p[0], p[1]], [p[0]+p[2]-3, p[1]], [p[0]+p[2]-3, p[1]+p[3]-4]].forEach(function(c){ v.rect(c[0], c[1]-2, 3, 5, P.w4); v.px(c[0]+1, c[1]-2, P.m3); }); }
  out.push(L2);
  // Kleistereimer mit Pinsel
  var bk = K.bucket, L3 = M.layer(bk[0]-2, bk[1]-8, bk[2]+4, 18, bk[1]+8), u = M.lw(L3); u.rect(bk[0], bk[1], bk[2], bk[3], P.m2); u.hl(bk[0], bk[0]+bk[2]-1, bk[1], P.s5); u.line(bk[0]+5, bk[1], bk[0]+8, bk[1]-7, P.w3); out.push(L3);
  // Dienstvorschrift auf dem Ständer
  var r = K.rules, L4 = M.layer(r[0]-2, r[1]-2, r[2]+4, 36, 112), q = M.lw(L4); q.vl(r[0]+r[2]/2, r[1]+r[3], 112, P.w1); q.rect(r[0], r[1], r[2], r[3], P.s6); q.hl(r[0], r[0]+r[2]-1, r[1], P.s4); for (var j = 0; j < 4; j++) q.hl(r[0]+3, r[0]+r[2]-4-(j % 2)*4, r[1]+4+j*3, P.m2); out.push(L4);
  // Schlagbaum (offen nur in Gedanken)
  var ba = K.barrier, L5 = M.layer(ba[0]-2, ba[1]-12, ba[2]+4, 40, 118), z = M.lw(L5);
  z.rect(K.post[0], K.post[1], K.post[2], K.post[3], P.s5); z.hl(K.post[0], K.post[0]+K.post[2]-1, K.post[1], P.s6); z.vl(K.post[0]+K.post[2]-1, K.post[1], K.post[1]+K.post[3]-1, P.s3);
  for (var x = ba[0]; x < ba[0]+ba[2]; x++){ var c = (Math.floor((x-ba[0])/8) % 2) ? P.s6 : P.r3; z.px(x, ba[1], c); z.px(x, ba[1]+1, c); z.px(x, ba[1]+2, M.DN[c]); }
  z.rect(ba[0]+ba[2]-6, ba[1]+3, 3, 12, P.m1); out.push(L5);
  return out; }
MA.ART = MA.ART || {};
MA.ART.sperre = { K: K, paint: paint, layers: layers };
})(MA);
