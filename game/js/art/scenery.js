/* ===== M. Adventure – art/scenery.js =====
   Malbausteine für Mostar 1955 (ergänzen den MALA-Malkasten): Himmel und Karstberge, Kalksteinmauern, Steinplattendächer,
   Häuser mit Holzläden, Ladenfronten mit Klappläden (ćepenci), Minarett, Kopfsteinpflaster (kaldrma), Fahnen, Girlanden,
   Transparente, Bäume, Flaschen, das Tiko-Plakat. Alle Funktionen schreiben Palettenindizes in einen M.Buf. */
(function(MA){
'use strict';
var P = M.P, T = M.T, hash = M.hash, bayer = M.bayer, R = M.R;
var SC = MA.SC = {};
function ramp(r, v, x, y){ return M.rampAt(r, v, x, y); }

// ---------------------------------------------------------------- Himmel, Berge
SC.sky = function(b, x0, y0, w, h, seed){ var r = R('b2 b3 b4 b5 s6'); for (var y = y0; y < y0+h; y++){ var v = 0.18+0.82*(y-y0)/Math.max(1, h-1); for (var x = x0; x < x0+w; x++) b.px(x, y, ramp(r, v, x, y)); }
  var rg = M.rng(seed || 5); for (var i = 0; i < w/50; i++){ var cx = x0+rg()*w, cy = y0+3+rg()*h*0.5, rx = 12+rg()*26, ry = 1.5+rg()*2;
    for (var yy = Math.floor(cy-ry); yy <= cy+ry; yy++) for (var xx = Math.floor(cx-rx); xx <= cx+rx; xx++){ var dx = (xx-cx)/rx, dy = (yy-cy)/ry; if (dx*dx+dy*dy > 1 || bayer(xx, yy) < dx*dx*0.9 || yy < y0 || yy >= y0+h) continue; b.px(xx, yy, dy > 0.3 ? P.s5 : P.s6); } } };
// Karstberge (Hum, Velež) im Dunst
SC.hills = function(b, x0, x1, baseY, amp, seed, near){ var rg = M.rng(seed || 9), ph = rg()*10, far = near ? R('g2 g3 e3 e4') : R('c3 c4 b3 b4');
  for (var x = x0; x < x1; x++){ var hgt = Math.round(amp*0.55+Math.sin(x*0.011+ph)*amp*0.35+Math.sin(x*0.043+ph*2)*amp*0.12+Math.sin(x*0.13)*1.2);
    for (var y = baseY-hgt; y < baseY; y++){ var v = 0.75-(y-(baseY-hgt))/Math.max(1, hgt)*0.5; if (near && hash(Math.floor(x/3), Math.floor(y/2)) > 0.86) v -= 0.25; b.px(x, y, ramp(far, v, x, y)); } } };

// ---------------------------------------------------------------- Mauern, Dächer, Häuser
SC.stoneWall = function(b, x0, y0, w, h, opt){ opt = opt || {}; var r = opt.ramp || R('s1 s2 s3 s4');
  for (var y = y0; y < y0+h; y++) for (var x = x0; x < x0+w; x++){ var c = M.tex.ashlar(x+(opt.ox || 0), y, r, opt.sw || 14, opt.sh || 7); if (opt.shade){ var v = opt.shade(x, y); if (v < 0 && bayer(x, y) < -v) c = M.DN[c]; if (v > 0 && bayer(x, y) < v) c = M.UP[c]; } b.px(x, y, c); }
  if (opt.cap){ b.hl(x0, x0+w-1, y0, r[3]); b.hl(x0, x0+w-1, y0+1, r[2]); } };
SC.plasterWall = function(b, x0, y0, w, h, r, stain){ for (var y = y0; y < y0+h; y++) for (var x = x0; x < x0+w; x++) b.px(x, y, SC.plaster(x, y, r, stain)); };
// glatter Kalkputz: ruhige Grundfarbe, wenige Sprenkel, großflächige Flecken und Regenspuren unter Gesimsen
SC.plaster = function(x, y, r, stain){ var n = Math.sin(x*0.045+y*0.02)+Math.sin(x*0.013-y*0.05+1.7)+Math.sin((x+y)*0.031), c = r[1];
  if (n > 1.35 && bayer(x, y) < (n-1.35)*0.9) c = r[2]; else if (n < -1.5 && bayer(x, y) < (-n-1.5)*0.8) c = r[0];
  var h = hash(x, y); if (h < 0.025) c = r[0]; else if (h > 0.985) c = r[Math.min(r.length-1, 2)];
  if (stain !== undefined && y > stain){ var s = Math.sin(x*0.21)+Math.sin(x*0.07+2); if (s > 1.2 && bayer(x, y) < Math.min(0.5, (y-stain)/50)) c = M.DN[c]; }
  return c; };
// Steinplattendach (Mostar): Reihen grauer Platten, unten überstehend
SC.roof = function(b, x0, y0, w, h, opt){ opt = opt || {}; var r = opt.ramp || R('m1 m2 m3 s2'), slope = opt.slope || 0.5, ridge = opt.ridge || 'flat';
  for (var y = y0; y < y0+h; y++){ var t = (y-y0)/Math.max(1, h-1), inset = Math.round((1-t)*h*slope*(ridge === 'tent' ? 1 : 0.4));
    var row = Math.floor((y-y0)/3), fy = (y-y0) % 3;
    for (var x = x0+inset; x < x0+w-inset; x++){ var slab = Math.floor((x+row*5)/6), c = r[1+(hash(slab, row) < 0.4 ? 1 : 0)]; if (fy === 2) c = r[0]; if ((x+row*5) % 6 === 0) c = r[0]; if (fy === 0 && hash(slab, row+3) > 0.6) c = r[3]; if (opt.light && x < x0+w*0.35 && fy !== 2 && bayer(x, y) < 0.3) c = M.UP[c]; b.px(x, y, c); } }
  b.hl(x0-1, x0+w, y0+h, P.k2); };
// Fenster mit Holzläden (Mostar: grün-braun), opt.open, opt.lit
SC.window = function(b, x, y, w, h, opt){ opt = opt || {}; var fr = opt.frame || R('s3 s4 s5 s6');
  b.rect(x-1, y-1, w+2, h+2, fr[1]); b.hl(x-1, x+w, y-1, fr[3]); b.hl(x-2, x+w+1, y+h+1, fr[2]); b.hl(x-2, x+w+1, y+h+2, fr[0]);
  if (opt.shut){ var S = opt.col || R('g1 g2 g3'); for (var yy = y; yy < y+h; yy++) for (var xx = x; xx < x+w; xx++){ var c = S[1]; if ((yy-y) % 2 === 0) c = S[0]; if (xx === x+Math.floor(w/2)) c = S[0]; b.px(xx, yy, c); } return; }
  for (var yy2 = y; yy2 < y+h; yy2++) for (var xx2 = x; xx2 < x+w; xx2++){ var c2 = (yy2-y) < h*0.45 ? P.n1 : P.k2; if ((xx2-x)+(yy2-y)*0.6 < w*0.5 && (yy2-y) < 3) c2 = P.n2; b.px(xx2, yy2, c2); }
  b.vl(x+Math.floor(w/2), y, y+h-1, fr[2]); if (h > 8) b.hl(x, x+w-1, y+Math.floor(h/2), fr[2]);
  if (opt.open){ var S2 = opt.col || R('g1 g2 g3'), lw = Math.max(2, Math.floor(w/2)); [x-lw-1, x+w+1].forEach(function(sx){ for (var yy3 = y; yy3 < y+h; yy3++) for (var xx3 = sx; xx3 < sx+lw; xx3++) b.px(xx3, yy3, (yy3-y) % 2 ? S2[1] : S2[0]); }); }
  if (opt.bars){ for (var bx = x+1; bx < x+w; bx += 2) b.vl(bx, y, y+h-1, P.k1); } };
// Steinhaus der Altstadt: Erdgeschoss Kalkstein, Obergeschoss weiß verputzt oder Holz, Steinplattendach
SC.house = function(b, x, gy, w, h, opt){ opt = opt || {}; var up = opt.upper || 'plaster', top = gy-h, ground = Math.round(h*0.45);
  SC.stoneWall(b, x, gy-ground, w, ground, { sw: 12, sh: 6, ox: x*7 });
  if (up === 'wood'){ for (var y = top+6; y < gy-ground; y++) for (var xx = x-2; xx < x+w+2; xx++) b.px(xx, y, M.tex.boards(xx, y, R('w1 w2 w3 w4'), 4)); b.hl(x-2, x+w+1, gy-ground-1, P.w1); }
  else SC.plasterWall(b, x, top+6, w, h-ground-6, opt.plaster || R('s4 s5 s6'), top+16);
  SC.roof(b, x-5, top-4, w+10, 10, { slope: 0.7, light: true });
  var n = Math.max(1, Math.floor(w/18)); for (var i = 0; i < n; i++){ var wx = x+Math.round((i+0.5)*w/n)-3; SC.window(b, wx, top+10, 6, 8, { open: hash(wx, 3) < 0.5, shut: hash(wx, 4) > 0.75 }); }
  if (opt.door){ var dx = x+Math.round(w*0.5)-4; b.rect(dx, gy-14, 8, 14, P.w1); b.rect(dx+1, gy-13, 6, 13, P.w2); b.vl(dx+4, gy-13, gy-1, P.w1); b.hl(dx-1, dx+8, gy-15, P.s5); } };
// Ladenfront mit Klappläden (ćepenak): oberer Laden als Vordach, unterer als Auslage
SC.shop = function(b, x, gy, w, h, opt){ opt = opt || {}; SC.stoneWall(b, x, gy-h, w, h, { sw: 10, sh: 5, ox: x });
  var ix = x+3, iw = w-6, iy = gy-h+6, ih = h-14; b.rect(ix, iy, iw, ih, P.k2); b.rect(ix+2, iy+ih-6, iw-4, 6, P.h1);
  for (var yy = iy-6; yy < iy; yy++){ var k = (iy-yy)/6; for (var xx = ix-Math.round(k*3); xx < ix+iw+Math.round(k*3); xx++) b.px(xx, yy, M.tex.boards(xx, yy, R('w1 w2 w3 w4'), 3)); }
  b.hl(ix-3, ix+iw+2, iy-6, P.w4); b.hl(ix-2, ix+iw+1, iy, P.w0);
  for (var yy2 = iy+ih; yy2 < iy+ih+4; yy2++) for (var xx2 = ix-1; xx2 < ix+iw+1; xx2++) b.px(xx2, yy2, M.tex.boards(xx2, yy2, R('w1 w2 w3 w4'), 2));
  if (opt.goods) opt.goods(b, ix, iy, iw, ih); };
// Minarett: schlanker weißer Schaft, Umgang (šerefe), bleigrauer Kegel, Spitze
SC.minaret = function(b, x, gy, h, opt){ opt = opt || {}; var w = opt.w || 6, top = gy-h, S = R('s3 s4 s5 s6');
  for (var y = top+14; y < gy; y++) for (var xx = x-Math.floor(w/2); xx < x+Math.ceil(w/2); xx++){ var u = (xx-(x-w/2))/w; b.px(xx, y, ramp(S, 0.9-u*0.7, xx, y)); }
  var by = top+Math.round(h*0.32); b.rect(x-w/2-2, by, w+4, 2, P.s6); b.hl(x-w/2-2, x+w/2+1, by+2, P.s2); for (var i = -w/2-1; i <= w/2; i += 2) b.px(Math.round(x+i), by-1, P.s5);
  for (var y2 = top+3; y2 < top+14; y2++){ var k = (y2-top-3)/11, hw = Math.max(0.5, k*(w/2)); for (var xx2 = Math.round(x-hw); xx2 <= Math.round(x+hw-1); xx2++) b.px(xx2, y2, xx2 < x ? P.m3 : P.m2); }
  b.vl(x, top, top+3, P.y3); b.px(x, top-1, P.y4); };
// Kopfsteinpflaster aus Flusskieseln (kaldrma) mit Querrippen
SC.kaldrma = function(b, x0, y0, w, h, opt){ opt = opt || {}; var r = opt.ramp || R('s1 s2 s3 s4'), rib = opt.rib || 0;
  for (var y = y0; y < y0+h; y++){ var t = (y-y0)/Math.max(1, h), s = 2+t*3, sy = Math.max(1.6, s*0.55), row = Math.floor((y-y0)/sy), fy = (y-y0)-row*sy;
    for (var x = x0; x < x0+w; x++){ var off = (row % 2)*s*0.5, col = Math.floor((x+off)/s), fx = (x+off)-col*s, dx = (fx-s/2)/(s/2), dy = (fy-sy/2)/(sy/2), d = dx*dx+dy*dy, c;
      if (d > 0.9) c = r[0]; else { c = hash(col, row) < 0.5 ? r[1] : r[2]; if (dy < -0.2 && dx < 0.3 && t > 0.3) c = M.UP[c]; }
      if (rib && ((x+Math.round(y*0.4)) % rib) < 1 && t > 0.15) c = r[3];
      if (opt.shade){ var v = opt.shade(x, y); if (v < 0 && bayer(x, y) < -v) c = M.DN[c]; }
      b.px(x, y, c); } } };
// Steinplatten (Hof, Brücke), große helle Platten
SC.slabs = function(b, x0, y0, w, h, r){ r = r || R('s2 s3 s4 s5'); for (var y = y0; y < y0+h; y++) for (var x = x0; x < x0+w; x++) b.px(x, y, M.tex.paving(x, y, r, 12+Math.round((y-y0)/h*8))); };

// ---------------------------------------------------------------- Fahnen, Girlanden, Transparente, Plakat
SC.flagYU = function(b, x, y, w, h){ if (SC.rec){ SC.rec.push({ k: 'flag', x: x, y: y, w: w, h: h, ph: x*0.37 }); return; } var t = Math.round(h/3); b.rect(x, y, w, t, P.b2); b.rect(x, y+t, w, h-2*t, P.s6); b.rect(x, y+h-t, w, t, P.r3); var cx = x+Math.floor(w/2), cy = y+Math.floor(h/2);
  b.px(cx, cy-1, P.r3); b.hl(cx-1, cx+1, cy, P.r3); b.px(cx-1, cy+1, P.r3); b.px(cx+1, cy+1, P.r3); if (w > 9){ b.px(cx, cy-2, P.y3); } };
SC.flagPole = function(b, x, gy, h, fw, fh, wave){ b.vl(x, gy-h, gy, P.w2); b.vl(x+1, gy-h, gy, P.w1); b.px(x, gy-h-1, P.y3); if (SC.rec){ SC.rec.push({ k: 'flag', x: x+2, y: gy-h, w: fw, h: fh, ph: wave || 0, pole: true }); return; }
  var t = Math.round(fh/3); for (var i = 0; i < fw; i++){ var dy = wave ? Math.round(Math.sin(i*0.6+wave)*1) : 0; for (var j = 0; j < fh; j++){ var c = j < t ? P.b2 : (j < fh-t ? P.s6 : P.r3); b.px(x+2+i, gy-h+j+dy, c); } }
  var cx = x+2+Math.floor(fw/2), cy = gy-h+Math.floor(fh/2); b.px(cx, cy, P.r3); b.px(cx-1, cy, P.r3); b.px(cx+1, cy, P.r3); b.px(cx, cy-1, P.r3); };
SC.garland = function(b, x0, y0, x1, y1, sag, seed){ if (SC.rec){ SC.rec.push({ k: 'garland', x0: x0, y0: y0, x1: x1, y1: y1, sag: sag || 6, ph: (x0+y0)*0.13 }); return; } var n = Math.abs(x1-x0), cols = [P.b2, P.s6, P.r3]; sag = sag || 6;
  for (var i = 0; i <= n; i++){ var t = i/n, x = Math.round(x0+(x1-x0)*t), y = Math.round(y0+(y1-y0)*t+Math.sin(Math.PI*t)*sag); b.px(x, y, P.k2);
    if (i % 6 === 2){ var c = cols[Math.floor(i/6) % 3]; b.px(x, y+1, c); b.px(x+1, y+1, c); b.px(x+2, y+1, c); b.px(x+1, y+2, c); b.px(x+1, y+3, c); } } };
SC.banner = function(b, x, y, w, h, text, col){ col = col || P.r3; b.rect(x, y, w, h, col); b.hl(x, x+w-1, y, M.UP[col]); b.hl(x, x+w-1, y+h-1, M.DN[col]); var tw = M.microWidth(text); M.microText(b, text, x+Math.floor((w-tw)/2), y+Math.floor((h-5)/2), P.s6);
  b.line(x, y, x-6, y-4, P.k2); b.line(x+w-1, y, x+w+5, y-4, P.k2); };
SC.posterTiko = function(b, x, y, w, h, opt){ opt = opt || {}; b.rect(x, y, w, h, P.s5); b.rect(x+1, y+1, w-2, h-2, P.s6);
  var cx = x+Math.floor(w/2), cy = y+Math.floor(h*0.42), r = Math.max(3, Math.floor(w*0.2));
  b.rect(x+2, y+2, w-4, Math.floor(h*0.7), P.r3); b.ellipse(cx, cy+1, r, r+1, P.q3); b.ellipse(cx-1, cy+1, r-1, r, P.q4); b.rect(cx-r-1, cy-r-2, 2*r+3, 3, P.s6); b.hl(cx-r-1, cx+r+1, cy-r, P.y3); b.hl(cx-r+1, cx+r+3, cy-r+1, P.k2);
  b.rect(cx-r-2, cy+r+1, 2*r+5, Math.floor(h*0.7)-r-cy+y-1, P.s5);
  M.microText(b, opt.text || 'TIKO', cx-Math.floor(M.microWidth(opt.text || 'TIKO')/2), y+h-8, P.r3);
  if (opt.peel){ b.poly([[x+w-1, y], [x+w-1, y+7], [x+w-8, y]], P.s4); b.line(x+w-8, y, x+w-1, y+7, P.s3); } };
SC.bottle = function(b, x, by, col){ col = col || P.g3; b.rect(x, by-7, 3, 7, col); b.rect(x+1, by-10, 1, 3, col); b.px(x+1, by-11, P.s5); b.vl(x, by-6, by-2, M.UP[col]); b.px(x+2, by-5, M.DN[col]); };
SC.tree = function(b, cx, gy, opt){ opt = opt || {}; var h = opt.h || 50, cw = opt.w || 34, tr = R('w0 w1 w2 w3'), lf = opt.leaf || R('g1 g2 g3 g4 g5'); if (SC.rec) SC.rec.push({ k: 'tree', cx: cx, cy: Math.round(gy-h*0.72), rx: Math.round(cw*0.62), ry: Math.round(h*0.3), lf: lf });
  for (var y = gy-Math.round(h*0.55); y < gy; y++){ var tw = 2+Math.round((y-(gy-h*0.55))/(h*0.55)*2); for (var x = cx-tw; x <= cx+tw; x++) b.px(x, y, x < cx-tw+1 ? tr[3] : (x > cx+tw-1 ? tr[0] : tr[1])); }
  b.line(cx, gy-Math.round(h*0.5), cx-10, gy-Math.round(h*0.75), tr[1]); b.line(cx, gy-Math.round(h*0.5), cx+9, gy-Math.round(h*0.78), tr[1]);
  var rg = M.rng(opt.seed || 21); for (var k = 0; k < 7; k++){ var bx = cx+(rg()-0.5)*cw, by = gy-h*0.72+(rg()-0.5)*h*0.35, rx = cw*0.3+rg()*cw*0.18, ry = rx*0.65;
    for (var yy = Math.floor(by-ry); yy <= by+ry; yy++) for (var xx = Math.floor(bx-rx); xx <= bx+rx; xx++){ var dx = (xx-bx)/rx, dy = (yy-by)/ry, dd = dx*dx+dy*dy; if (dd > 1) continue; if (dd > 0.75 && bayer(xx, yy) > 0.5) continue;
      var v = 0.62-dx*0.25-dy*0.35+(hash(Math.floor(xx/2), Math.floor(yy/2))-0.5)*0.35; b.px(xx, yy, ramp(lf, v, xx, yy)); } }
  if (opt.fruit){ for (var f = 0; f < 10; f++){ var fx = Math.round(cx+(rg()-0.5)*cw*0.8), fy = Math.round(gy-h*0.72+(rg()-0.5)*h*0.3); b.px(fx, fy, opt.fruit); b.px(fx+1, fy, M.DN[opt.fruit]); } } };
SC.dither = function(b, x0, y0, w, h, amt){ for (var y = y0; y < y0+h; y++) for (var x = x0; x < x0+w; x++){ if (bayer(x, y) < amt){ var c = b.get(x, y); if (c !== T) b.px(x, y, M.DN[c]); } } };
SC.lighten = function(b, x0, y0, w, h, amt){ for (var y = y0; y < y0+h; y++) for (var x = x0; x < x0+w; x++){ if (bayer(x, y) < amt){ var c = b.get(x, y); if (c !== T) b.px(x, y, M.UP[c]); } } };
// Schatten einer Figur oder eines Dings auf den Boden (abdunkeln, gedithert)
SC.shadowRect = function(b, x0, y0, w, h, amt){ SC.dither(b, x0, y0, w, h, amt || 0.6); };
})(MA);
