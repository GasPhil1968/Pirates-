/* ===== M. Adventure – art/rig_detail.js =====
   Detail-Zeichner für das MALA-Figuren-Rig (lib/mala_rig.js bleibt unverändert).
   Gleiche Posen, Maße und Kopfstempel wie in MALA, aber mit mehr Einzelheiten:
   – Glieder verjüngt und vierstufig schattiert, Ellbogen/Knie gerundet, Innenkontur zwischen Arm und Körper
   – Ärmel lang / kurz / hochgekrempelt, Armbinden am Oberarm, Hände mit Fingern bzw. Daumen
   – kurze Hosen als echte Hosenbeine (statt Rock), Socken, Schuhe mit Sohle und Glanzlicht, Sandalen mit Riemen, Stiefel
   – Oberkörper mit Licht/Schatten-Verlauf, Falten, Kragen, Knopfleiste, Brusttasche, Gürtel mit Schnalle, Hosenträgern,
     Halstuch mit Knoten und Zipfeln (die Zipfel schwingen), Schürze mit Tasche, offener Weste, Revers
   – Zöpfe als eigene Glieder, die beim Gehen schwingen
   Neue Posen-Schlüssel: sw (Schwung −1/0/1 für Zöpfe und Zipfel), br (Atmen: Oberkörper 1 px höher). */
(function(M){
'use strict';
var P = M.P, T = M.T, Buf = M.Buf, DN = M.DN, UP = M.UP, CH = M.CHARS;
var SW = M.SPR.W, SHH = M.SPR.H, OX = M.SPR.OX, OY = M.SPR.OY;
function dn(c){ var d = DN[c]; return d === undefined ? c : d; }
function up(c){ var u = UP[c]; return u === undefined ? c : u; }
function lerp(a, b, t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t]; }
function c4(c){ return [c[0], c[1], c[2], c[3] !== undefined ? c[3] : dn(c[2])]; }
var K4 = [P.k1, P.k1, P.k1, P.k1];

// ---------------------------------------------------------------- Kopfvarianten (wie M.headSet, zusätzlich Augenweiß 'w' beim Lidschlag)
M.headSet2 = function(rows, skin){ var hs = M.headSet(rows, skin || 't'), sk = skin || 't';
  hs.b = hs.b.map(function(r){ return r.split('w').join(sk); });
  hs.s = hs.s.map(function(r){ return r; });
  return hs; };

// ---------------------------------------------------------------- Grundformen
function ik(ax, ay, tx, ty, l1, l2, bend){ var dx = tx-ax, dy = ty-ay, d = Math.sqrt(dx*dx+dy*dy), md = l1+l2-0.01; if (d > md){ dx *= md/d; dy *= md/d; d = md; } if (d < 0.01) d = 0.01;
  var a = Math.acos(Math.max(-1, Math.min(1, (l1*l1+d*d-l2*l2)/(2*l1*d)))), base = Math.atan2(dy, dx), ang = base+bend*a; return [ax+Math.cos(ang)*l1, ay+Math.sin(ang)*l1]; }
// verjüngtes Glied mit vier Tönen [Mitte, Licht, Schatten, Kante]; Licht auf der Seite der Normale (wie in MALA nach rechts/vorn)
function limb(b, a, c, r0, r1, col){ var rm = Math.max(r0, r1), minx = Math.floor(Math.min(a[0], c[0])-rm-1), maxx = Math.ceil(Math.max(a[0], c[0])+rm+1), miny = Math.floor(Math.min(a[1], c[1])-rm-1), maxy = Math.ceil(Math.max(a[1], c[1])+rm+1);
  var vx = c[0]-a[0], vy = c[1]-a[1], L2 = vx*vx+vy*vy || 1, len = Math.sqrt(L2), nx = -vy/len, ny = vx/len; if (nx < 0 || (nx === 0 && ny > 0)){ nx = -nx; ny = -ny; }
  for (var y = miny; y <= maxy; y++) for (var x = minx; x <= maxx; x++){ var px = x+0.5-a[0], py = y+0.5-a[1], t = Math.max(0, Math.min(1, (px*vx+py*vy)/L2)), qx = px-t*vx, qy = py-t*vy, d = Math.sqrt(qx*qx+qy*qy), r = r0+(r1-r0)*t;
    if (d <= r){ var s = qx*nx+qy*ny, cc = col[0]; if (s > r*0.38) cc = col[1]; else if (s < -r*0.72 && r >= 1.25) cc = col[3]; else if (s < -r*0.3) cc = col[2]; b.px(x, y, cc); } } }
function dot(b, x, y, r, col){ limb(b, [x, y], [x+0.01, y], r, r, col); }
// Hand: 2×2 wie in MALA, dazu Finger in Zeigerichtung (hängend, erhoben, nach vorn)
function hand(b, h, e, col){ var x = Math.round(h[0]-0.5), y = Math.round(h[1]-0.5), dx = h[0]-e[0], dy = h[1]-e[1];
  b.px(x, y, col[0]); b.px(x+1, y, col[0]); b.px(x, y+1, col[1]); b.px(x+1, y+1, col[1]);
  if (dy > Math.abs(dx)*0.9) b.px(x+(dx >= 0 ? 1 : 0), y+2, col[1]);
  else if (-dy > Math.abs(dx)*0.9) b.px(x+(dx >= 0 ? 1 : 0), y-1, col[0]);
  else if (dx > 0) b.px(x+2, y, col[0]); else b.px(x-1, y, col[0]); }
function shear(src, lean){ if (!lean) return { b: src, pad: 0 }; var w = src.w+Math.abs(lean)+1, b = new Buf(w, src.h, T), pad = lean < 0 ? Math.abs(lean) : 0;
  for (var y = 0; y < src.h; y++){ var sh = Math.round(lean*(src.h-1-y)/(src.h-1)); for (var x = 0; x < src.w; x++){ var c = src.d[y*src.w+x]; if (c !== T) b.px(x+sh+pad, y, c); } } return { b: b, pad: pad }; }
function outline(b, col){ var add = []; for (var y = 0; y < b.h; y++) for (var x = 0; x < b.w; x++){ if (b.get(x, y) !== T) continue; var n = [b.get(x-1, y), b.get(x+1, y), b.get(x, y-1), b.get(x, y+1)];
  for (var i = 0; i < 4; i++) if (n[i] !== T && n[i] !== col){ add.push(x, y); break; } } for (var k = 0; k < add.length; k += 2) b.px(add[k], add[k+1], col); }

// ---------------------------------------------------------------- Schuhe (Fuß bei x,y = Boden; Seitenansicht nach rechts)
function shoe(b, x, y, kind, ch, far, view){ var D = ch.dx || {}, ft = D.feet || 'shoe';
  var base = ch.cols.shoe, mid = far ? dn(base) : base, lit = far ? base : up(base), sole = dn(dn(base)), skin = far ? ch.cols.handF[1] : ch.cols.hand[1], strap = D.strap || P.w1;
  if (ft === 'sandal'){ mid = skin; lit = far ? ch.cols.handF[0] : ch.cols.hand[0]; sole = P.w3; }
  if (ft === 'bare'){ mid = skin; lit = far ? ch.cols.handF[0] : ch.cols.hand[0]; sole = skin; }
  function row(y0, x0, x1, c){ for (var xx = x0; xx <= x1; xx++) b.px(xx, y0, c); }
  if (view === 'F' || view === 'B'){ row(y-1, x-1, x+1, mid); b.px(view === 'F' ? x : x+1, y-1, lit); row(y, x-1, x+2, sole); if (ft === 'boot'){ row(y-2, x-1, x+1, mid); row(y-3, x-1, x+1, mid); }
    if (ft === 'sandal') b.px(x, y-1, strap); return; }
  if (kind === 'h'){ row(y-3, x+2, x+3, mid); row(y-2, x-1, x+2, mid); b.px(x+2, y-2, lit); row(y-1, x-2, x+1, mid); row(y, x-2, x, sole); if (ft === 'boot') row(y-4, x-1, x+1, mid); if (ft === 'sandal'){ b.px(x, y-2, strap); b.px(x+2, y-3, strap); } return; }
  if (kind === 't'){ row(y-4, x-3, x-2, mid); row(y-3, x-2, x, mid); row(y-2, x-1, x+1, mid); b.px(x+1, y-2, lit); row(y-1, x, x+2, mid); row(y, x+1, x+3, sole); if (ft === 'boot') row(y-5, x-3, x-1, mid); if (ft === 'sandal'){ b.px(x-1, y-3, strap); b.px(x+1, y-1, strap); } return; }
  row(y-2, x-1, x, mid); row(y-1, x-2, x+2, mid); b.px(x+1, y-1, lit); b.px(x+2, y-1, lit); row(y, x-2, x+3, sole);
  if (ft === 'boot'){ row(y-3, x-1, x+1, mid); row(y-4, x-1, x+1, mid); b.px(x, y-3, lit); }
  if (ft === 'sandal'){ b.px(x-1, y-1, strap); b.px(x+1, y-1, strap); b.px(x, y-2, strap); } }

// ---------------------------------------------------------------- Oberkörper (vorn / Rücken / Seite)
// spec wie in MALA ({w, len, col, collar, buttons, scarf, apron, lapel, belt, open, stripe, side, taper, belly}) und zusätzlich:
// {pocket, buckle, suspenders, folds:false, placket, vest:[m,l,s], tie}
function torsoF(s, back){ var w = s.w || 12, L = s.len || 14, b = new Buf(w, L, T), C = s.col, mx = (w-1)/2, edge = dn(C[2]);
  for (var y = 0; y < L; y++){ var inset = y < 1 ? 2 : (y < 2 ? 1 : (y > L-3 ? 1 : 0)); if (s.taper && y > L*0.55) inset = Math.max(inset, 1);
    for (var x = inset; x < w-inset; x++){ var u = (x-inset)/Math.max(1, (w-2*inset-1)), c = C[0];
      if (u < 0.2) c = C[1]; else if (u > 0.8) c = C[2]; if (u > 0.94 && y > 1) c = edge;
      if (y <= 1 && u > 0.18 && u < 0.62) c = C[1];
      if (s.folds !== false && y >= Math.floor(L*0.45) && y < L-3){ if ((x === inset+1 && y % 3 === 0) || (x === w-inset-2 && y % 3 === 1) || (!back && x === Math.round(mx)+2 && y % 4 === 2)) c = C[2]; }
      if (y === L-4 && s.belt === undefined) c = (u < 0.5) ? C[0] : C[2];
      if (!back){
        if (s.vest){ var vo = Math.abs(x-mx) < 1.6 && y > 1; if (!vo){ c = s.vest[0]; if (u < 0.2) c = s.vest[1]; else if (u > 0.8) c = s.vest[2]; } else c = (Math.abs(x-mx) < 0.6) ? C[2] : C[0]; }
        if (s.open && Math.abs(x-mx) < 1.6 && y > 0) c = (Math.abs(x-mx) < 0.6) ? dn(s.open) : s.open;
        if (s.stripe !== undefined && y % 3 === 1 && y > 0) c = s.stripe;
        if (s.apron && y >= Math.floor(L*0.3) && x >= 2 && x < w-2){ c = (x < 4 ? s.apron[1] : s.apron[0]); if (x === w-3) c = dn(s.apron[0]); }
        if (s.placket && Math.abs(x-mx) < 0.6 && y > 1 && y < L-3) c = s.placket;
        if (s.buttons !== undefined && Math.abs(x-mx) < 0.6 && y > 2 && y % 3 === 0 && y < L-3) c = s.buttons;
        if (s.lapel !== undefined && y < 6 && (Math.abs(x-mx) >= 1 && Math.abs(x-mx) < 3.2-y*0.45)) c = (x < mx) ? up(s.lapel) : s.lapel;
        if (s.suspenders !== undefined && (Math.abs(x-(mx-2.5)) < 0.6 || Math.abs(x-(mx+2.5)) < 0.6) && y > 0 && y < L-2) c = s.suspenders;
        if (s.tie !== undefined && Math.abs(x-mx) < 0.6+(y > 2 ? 0.5 : 0) && y > 0 && y < L-5) c = (y === 1) ? dn(s.tie) : s.tie;
      } else { if (s.stripe !== undefined && y % 3 === 1 && y > 0) c = s.stripe; if (s.suspenders !== undefined && Math.abs(Math.abs(x-mx)-(1.2+y*0.18)) < 0.6 && y > 0 && y < L-2) c = s.suspenders; if (Math.abs(x-mx) < 0.6 && y > 2 && y < L-3 && s.folds !== false) c = C[2]; }
      if (s.belt !== undefined && (y === L-3 || (s.wideBelt && y === L-2))) c = s.belt;
      b.px(x, y, c); } }
  if (!back && s.belt !== undefined && s.buckle !== undefined){ b.px(Math.floor(mx), L-3, s.buckle); b.px(Math.ceil(mx), L-3, s.buckle); }
  if (!back && s.pocket){ var px0 = Math.round(mx)+2; if (px0+1 < w-1){ b.px(px0, 3, dn(C[0])); b.px(px0+1, 3, dn(C[0])); b.px(px0, 4, C[2]); b.px(px0+1, 4, C[2]); } }
  if (!back && s.collar){ var a = Math.floor(mx), z = Math.ceil(mx); b.px(a, 0, s.collar[0]); b.px(z, 0, s.collar[0]); b.px(a-1, 0, s.collar[1]); b.px(z+1, 0, s.collar[1]); b.px(a-1, 1, s.collar[0]); b.px(z+1, 1, s.collar[0]); b.px(a, 1, dn(C[0])); b.px(z, 1, dn(C[0])); }
  if (!back && s.vneck !== undefined){ for (var yy = 0; yy < 3; yy++){ for (var xx = Math.ceil(mx-1.5+yy*0.5); xx <= Math.floor(mx+1.5-yy*0.5); xx++) b.px(xx, yy, s.vneck); } }
  if (s.scarf){ var S = s.scarf; for (var x2 = 1; x2 < w-1; x2++){ b.px(x2, 0, S[x2 < 3 ? 1 : 0]); b.px(x2, 1, S[x2 > w-4 ? 2 : 0]); }
    if (!back){ var k0 = Math.floor(mx); b.px(k0, 2, dn(S[0])); b.px(k0+1, 2, S[2]); b.px(k0, 3, S[0]); b.px(k0+1, 3, S[2]);
      for (var y2 = 4; y2 < Math.min(L-2, 8); y2++){ var off = Math.round((y2-4)*0.5); b.px(k0-off, y2, S[1]); b.px(k0+1+off, y2, S[2]); } }
    else { for (var y3 = 2; y3 < 6; y3++){ var hw = Math.max(0, 3-(y3-2)); for (var x3 = Math.round(mx-hw); x3 <= Math.round(mx+hw); x3++) b.px(x3, y3, S[x3 < mx ? 0 : 2]); } } }
  return b; }
function torsoS(s){ var w = s.side || 8, L = s.len || 14, b = new Buf(w, L, T), C = s.col, edge = dn(C[2]);
  for (var y = 0; y < L; y++){ var x0 = (y < 1) ? 1 : 0, x1 = w-(y < 1 ? 2 : (y < 2 ? 1 : 0)); if (y > L-5 && !s.belly) x1 = Math.max(x0+2, x1-1); if (s.belly && y > L*0.4 && y < L-2) x1 = w;
    if (s.hunch && y < 4) x0 = Math.max(0, x0-1);
    for (var x = x0; x < x1; x++){ var u = (x-x0)/Math.max(1, (x1-x0-1)), c = C[0];
      if (u > 0.68) c = C[1]; else if (u < 0.25) c = C[2]; if (u < 0.08 && y > 1) c = edge;
      if (s.folds !== false && y >= Math.floor(L*0.5) && y < L-3 && x === x0+2 && y % 3 === 0) c = C[2];
      if (s.vest && x < x1-1) { c = s.vest[0]; if (u > 0.68) c = s.vest[1]; else if (u < 0.25) c = s.vest[2]; }
      if (s.apron && y >= Math.floor(L*0.3) && x >= x1-2) c = s.apron[0];
      if (s.buttons !== undefined && x === x1-1 && y > 2 && y % 3 === 0 && y < L-3) c = s.buttons;
      if (s.suspenders !== undefined && x === Math.round((x0+x1)/2) && y > 0 && y < L-2) c = s.suspenders;
      if (s.tie !== undefined && x === x1-1 && y > 0 && y < L-5) c = s.tie;
      if (s.belt !== undefined && (y === L-3 || (s.wideBelt && y === L-2))) c = s.belt;
      if (s.stripe !== undefined && y % 3 === 1 && y > 0) c = s.stripe;
      b.px(x, y, c); } }
  if (s.belt !== undefined && s.buckle !== undefined) b.px(w-2, L-3, s.buckle);
  if (s.pocket){ b.px(w-3, 3, dn(C[1])); b.px(w-2, 3, dn(C[1])); b.px(w-3, 4, C[0]); }
  if (s.collar){ b.px(w-3, 0, s.collar[0]); b.px(w-2, 1, s.collar[1]); b.px(w-2, 0, s.collar[0]); }
  if (s.vneck !== undefined){ b.px(w-2, 0, s.vneck); b.px(w-3, 0, s.vneck); b.px(w-2, 1, s.vneck); }
  if (s.lapel !== undefined){ b.px(w-2, 1, up(s.lapel)); b.px(w-2, 2, s.lapel); b.px(w-3, 2, s.lapel); b.px(w-2, 3, s.lapel); }
  if (s.scarf){ var S = s.scarf; for (var x2 = 0; x2 < w; x2++){ b.px(x2, 0, S[0]); b.px(x2, 1, S[x2 > w-3 ? 1 : 2]); } b.px(w-1, 2, S[1]); b.px(w-2, 2, dn(S[0])); b.px(w-1, 3, S[0]); }
  if (s.hood){ b.px(0, 0, s.hood); b.px(0, 1, s.hood); b.px(1, 0, s.hood); }
  return b; }
function torsoOf(ch, v, lean){ var key = v+(lean || 0); ch.t2 = ch.t2 || {}; if (ch.t2[key]) return ch.t2[key];
  var ts = Object.assign({ w: 12, len: 13, col: [P.m2, P.m3, P.m1] }, ch.torso || {}), r;
  if (v === 'S') r = shear(torsoS(Object.assign({}, ts, ch.torsoS || {})), lean || 0);
  else r = { b: torsoF(v === 'B' ? Object.assign({}, ts, ch.torsoB || {}) : ts, v === 'B'), pad: 0 };
  ch.t2[key] = r; return r; }
function headOf(ch, v, k){ var key = v+k; if (!ch.stamps[key]){ var set = ch.heads[v] || ch.heads.S; ch.stamps[key] = M.stamp(set[k] || set.n, ch.legend); } return ch.stamps[key]; }

// ---------------------------------------------------------------- Unterkörper: Hosenbeine, Rock, Mantelschöße
function shortsS(b, ch, hx, hy, hips, knees){ var D = ch.dx, sc = D.shorts, len = sc.len || 0.55, r = (ch.legR || [1.7])[0]+0.75;
  var col = c4(sc.col), colF = c4(sc.colF || [dn(sc.col[0]), sc.col[0], dn(sc.col[2])]);
  limb(b, [OX+hips[0][0], OY+hips[0][1]], lerp([OX+hips[0][0], OY+hips[0][1]], [OX+knees[0][0], OY+knees[0][1]], len), r, r-0.1, colF);
  var a = [OX+hips[1][0], OY+hips[1][1]], e = lerp(a, [OX+knees[1][0], OY+knees[1][1]], len);
  limb(b, a, e, r+0.15, r, col);
  for (var y = OY+hy-3; y <= OY+hy; y++) for (var x = OX+hx-3; x <= OX+hx+3; x++){ var u = (x-(OX+hx-3))/6, c = col[0]; if (u > 0.7) c = col[1]; else if (u < 0.25) c = col[2]; b.px(x, y, c); }
  b.px(Math.round(e[0]), Math.round(e[1])+1, col[2]); }
function shortsF(b, ch, hx, hy, ends, front){ var D = ch.dx, sc = D.shorts, len = sc.len || 0.55, r = (ch.legR || [1.7])[0]+0.95, col = c4(sc.col);
  [[-2, ends[0]], [2, ends[1]]].forEach(function(q){ var a = [OX+hx+q[0], OY+hy-1], e = lerp(a, [OX+q[1][0], OY+q[1][1]], len); limb(b, a, e, r, r-0.1, q[0] < 0 ? col : [col[0], col[0], col[2], col[3]]); });
  for (var y = OY+hy-3; y <= OY+hy; y++) for (var x = OX+hx-4; x <= OX+hx+4; x++){ var u = (x-(OX+hx-4))/8, c = col[0]; if (u < 0.22) c = col[1]; else if (u > 0.8) c = col[2]; b.px(x, y, c); }
  b.px(OX+hx, OY+hy+2, col[3]); b.px(OX+hx, OY+hy+1, col[2]); if (front) b.px(OX+hx, OY+hy-1, col[2]); }
function skirt(b, ch, hx, hy, knees, p, v){ var sk = ch.skirt; if (!sk) return; var top = hy-2, hem = hy+(sk.hem || 12), fl = sk.flare || 2;
  if (v === 'S'){ var xs = [hx-4, hx+4]; if (knees) knees.forEach(function(k){ xs.push(k[0]-2, k[0]+2); }); var lo = Math.min.apply(null, xs)-fl, hi = Math.max.apply(null, xs)+fl; if (p.sit){ lo = hx-4; hi = hx+11; hem = hy+3; }
    b.poly([[OX+hx-4, OY+top], [OX+hx+4, OY+top], [OX+hi, OY+hem], [OX+lo, OY+hem]], function(x, y){ var u = (x-(OX+lo))/Math.max(1, hi-lo), c = sk.c[0]; if (u > 0.72) c = sk.c[1]; else if (u < 0.2) c = sk.c[2]; if ((x+40) % 3 === 0 && y > OY+top+2 && u > 0.2 && u < 0.85) c = sk.c[2]; if (y >= OY+hem-1) c = dn(sk.c[2]); if (y === OY+top) c = dn(sk.c[0]); return c; }); }
  else { var hm = p.sit ? hy+3 : hem; b.poly([[OX+hx-5, OY+top], [OX+hx+5, OY+top], [OX+hx+6+fl, OY+hm], [OX+hx-6-fl, OY+hm]], function(x, y){ var u = (x-(OX+hx-6-fl))/(12+fl*2), c = sk.c[0]; if (u < 0.25) c = sk.c[1]; else if (u > 0.75) c = sk.c[2]; if ((x+40) % 3 === 0 && y > OY+top+2) c = (u < 0.25) ? sk.c[0] : sk.c[2]; if (y >= OY+hm-1) c = dn(sk.c[2]); if (y === OY+top) c = dn(sk.c[0]); return c; }); } }
function coatS(b, ch, hx, hy, knees, p){ var co = ch.coat; if (!co) return; var top = hy-3, hem = hy+(p.sit ? 3 : (co.hem || 8)); var xs = [hx-4, hx+4];
  knees.forEach(function(k){ var kx = Math.round(hx+(k[0]-hx)*((co.hem || 8)/11)); xs.push(kx-1, kx+1); });
  var lo = Math.min.apply(null, xs)-1, hi = Math.max.apply(null, xs)+1; if (p.sit){ lo = hx-4; hi = hx+9; }
  b.poly([[OX+hx-4, OY+top], [OX+hx+4, OY+top], [OX+hi, OY+hem], [OX+lo, OY+hem]], function(x, y){ var u = (x-(OX+lo))/Math.max(1, hi-lo), c = co.c[0]; if (u > 0.75) c = co.c[1]; else if (u < 0.22) c = co.c[2]; if (y >= OY+hem-1) c = dn(co.c[2]); if (x === OX+hi-1 && y < OY+hem-1) c = co.c[1]; return c; });
  if (!p.sit){ b.px(OX+hx+1, OY+top+2, dn(co.c[0])); b.px(OX+hx+2, OY+top+2, dn(co.c[0])); } }
function coatF(b, ch, hx, hy, p){ var co = ch.coat; if (!co) return; var top = hy-3, hem = hy+(p.sit ? 3 : (co.hem || 8)), w = co.w || 6;
  b.poly([[OX+hx-w, OY+top], [OX+hx+w, OY+top], [OX+hx+w+1, OY+hem], [OX+hx-w-1, OY+hem]], function(x, y){ var u = (x-(OX+hx-w-1))/(2*w+2), c = co.c[0]; if (u < 0.2) c = co.c[1]; else if (u > 0.8) c = co.c[2];
    if (p.v === 'F' && Math.abs(x-OX-hx-0.5) < 0.6) c = dn(co.c[2]); if (y >= OY+hem-1) c = dn(co.c[2]); return c; });
  if (p.v === 'F' && !p.sit){ b.hl(OX+hx-w+1, OX+hx-w+3, OY+top+3, dn(co.c[0])); b.hl(OX+hx+w-3, OX+hx+w-1, OY+top+3, dn(co.c[0])); } }

// ---------------------------------------------------------------- Arme
function armCols(ch, far){ var C = ch.cols, D = ch.dx, sl = c4(far ? C.sleeveF : C.sleeve), sk = far ? (C.armF || [C.handF[0], C.hand[0], C.handF[1]]) : (C.arm || [C.hand[0], up(C.hand[0]), C.hand[1]]);
  return { sl: sl, sk: c4(sk), cuff: c4(D.cuff || [up(sl[0]), up(sl[1]), sl[0]]), hand: far ? C.handF : C.hand }; }
function arm(b, ch, sh, h, far, bend, contour, band){ var bn = ch.bones, D = ch.dx, e = ik(sh[0], sh[1], h[0], h[1], bn[2], bn[3], bend), ar = ch.armR || [1.3, 1.0], col = armCols(ch, far);
  var S = [OX+sh[0], OY+sh[1]], E = [OX+e[0], OY+e[1]], H = [OX+h[0], OY+h[1]], type = D.sleeve || 'long';
  if (contour){ limb(b, S, E, ar[0]+0.85, ar[0]+0.7, K4); limb(b, E, H, ar[1]+0.8, ar[1]+0.6, K4); }
  if (type === 'short'){ limb(b, S, E, ar[0]-0.05, ar[0]*0.9, col.sk); limb(b, E, H, ar[1], ar[1]*0.85, col.sk); limb(b, S, lerp(S, E, 0.55), ar[0]+0.4, ar[0]+0.35, col.sl); }
  else if (type === 'rolled'){ limb(b, S, E, ar[0], ar[0]*0.92, col.sl); limb(b, E, H, ar[1], ar[1]*0.85, col.sk); limb(b, E, lerp(E, H, 0.28), ar[1]+0.45, ar[1]+0.4, col.cuff); }
  else { limb(b, S, E, ar[0], ar[0]*0.92, col.sl); limb(b, E, H, ar[1]+0.1, ar[1], col.sl); limb(b, lerp(E, H, 0.8), H, ar[1]+0.25, ar[1]+0.2, c4([col.sl[2], col.sl[0], dn(col.sl[2])])); }
  dot(b, E[0], E[1], (type === 'long' ? ar[0]*0.9 : ar[1])+0.05, type === 'short' ? col.sk : col.sl);
  if (D.armband && band) limb(b, lerp(S, E, 0.42), lerp(S, E, 0.62), ar[0]+0.2, ar[0]+0.15, c4(D.armband.col));
  hand(b, H, E, col.hand); return e; }

// ---------------------------------------------------------------- Zöpfe und Zipfel
function braid(b, x, y, len, sw, col, ribbon){ for (var k = 0; k < len; k++){ var xx = Math.round(x+sw*k/Math.max(1, len-1)*1.2); b.px(xx, y+k, (k % 2) ? col[0] : col[1]); if (k > 0 && k < len-1) b.px(xx+(sw > 0 ? -1 : 1)*0, y+k, (k % 2) ? col[0] : col[1]); }
  var ex = Math.round(x+sw*1.2); if (ribbon !== undefined){ b.px(ex, y+len, ribbon); b.px(ex+1, y+len, dn(ribbon)); } }
function scarfTail(b, x, y, sw, S){ b.px(x, y, S[0]); b.px(x, y+1, S[0]); b.px(x+(sw > 0 ? 1 : 0), y+2, S[2]); b.px(x+(sw > 0 ? 1 : (sw < 0 ? -1 : 0)), y+3, S[2]); }

// ---------------------------------------------------------------- Pose → Puffer
function render(p, ch, t){
  var b = new Buf(SW, SHH, T), C = ch.cols, bn = ch.bones, D = ch.dx || (ch.dx = {}), legR = ch.legR || [1.7, 1.3];
  var hx = p.h[0], hy = p.h[1]-(ch.hipY-23), L = ch.tLen, sw = p.sw || 0, br = p.br ? 1 : 0;
  var trou = c4(C.trou), trouF = c4(C.trouF), sock = D.socks ? c4(D.socks.col) : null;
  function legS(hip, f, far){ var ank = [f[0], f[1]-2], kn = ik(hip[0], hip[1], ank[0], ank[1], bn[0], bn[1], -1), col = far ? trouF : trou;
    var A = [OX+hip[0], OY+hip[1]], K = [OX+kn[0], OY+kn[1]], N = [OX+ank[0], OY+ank[1]];
    if (!far) { limb(b, A, K, legR[0]+0.75, legR[0]*0.85+0.6, K4); limb(b, K, N, legR[1]+0.6, legR[1]*0.8+0.5, K4); }
    limb(b, A, K, legR[0], legR[0]*0.85, col); limb(b, K, N, legR[1], legR[1]*0.8, col); dot(b, K[0], K[1], legR[1]*0.95, col);
    if (sock && !p.sit) limb(b, lerp(N, K, Math.min(0.9, D.socks.h/bn[1])), N, legR[1]*0.85+0.25, legR[1]*0.8+0.2, far ? c4([dn(sock[0]), sock[0], dn(sock[2])]) : sock);
    if (!ch.noShoes) shoe(b, OX+f[0], OY+f[1], f[2] || 'f', ch, far, 'S'); return kn; }
  if (p.v === 'S'){
    var ln = p.ln || 0, tb = torsoOf(ch, 'S', ln), shx = Math.round(ln*(L-2)/(L-1));
    var shN = [hx+1+shx, hy-L+2-br], shF = [hx-1+shx, hy-L+2-br], hipN = [hx+1, hy-1], hipF = [hx-1, hy-1];
    arm(b, ch, shF, p.fh || [hx-2, hy+2], true, 1, false, false);
    var knF = legS(hipF, p.ff || [0, 0, 'f'], true), knN = legS(hipN, p.nf || [0, 0, 'f'], false), knees = [knF, knN];
    if (D.shorts) shortsS(b, ch, hx, hy, [hipF, hipN], knees);
    skirt(b, ch, hx, hy, knees, p, 'S');
    b.blit(tb.b, OX+hx-(ch.tHipS || 4)-tb.pad, OY+hy-L+1-br);
    if (ch.torso && ch.torso.scarf) scarfTail(b, OX+hx+shx+(ch.torso.side || 8)-(ch.tHipS || 4)-1, OY+hy-L+5-br, sw, ch.torso.scarf);
    var hs = headOf(ch, 'S', p.hd || 'n'), nk = ch.neck.S, ho = p.ho || [0, 0];
    var hX = OX+hx+shx-nk[0]+ho[0]+1, hY = OY+hy-L-nk[1]+ho[1]+1-br;
    if (D.braids) braid(b, hX+2, hY+D.braids.y, D.braids.len, -sw, D.braids.col, D.braids.ribbon);
    b.blit(hs, hX, hY);
    coatS(b, ch, hx, hy, knees, p);
    arm(b, ch, shN, p.nh || [hx, hy+2], false, 1, true, true);
    if (p.it && M.HELD[p.it]){ var nh = p.nh || [hx, hy+2]; M.HELD[p.it](b, OX+nh[0], OY+nh[1], t); }
  } else {
    var front = p.v === 'F', tst = torsoOf(ch, p.v, 0).b, sw2 = ch.shoulder, ends = [];
    var sL = [hx-sw2, hy-L+2-br], sR = [hx+sw2, hy-L+2-br];
    [['lf', [hx-2, hy-1], -1], ['rf', [hx+2, hy-1], 1]].forEach(function(Lg){ var f = p[Lg[0]] || [Lg[2]*3, 0], ank = [f[0], f[1]-2], mid = [(Lg[1][0]+ank[0])/2+Lg[2]*0.4, (Lg[1][1]+ank[1])/2];
      if (p.sit) mid = [Lg[1][0]+Lg[2]*0.5, hy+1]; ends.push(mid);
      var A = [OX+Lg[1][0], OY+Lg[1][1]], K = [OX+mid[0], OY+mid[1]], N = [OX+ank[0], OY+ank[1]], col = Lg[2] < 0 ? trou : [trou[0], trou[0], trou[2], trou[3]];
      limb(b, A, K, legR[0]+0.1, legR[0]*0.9, col); limb(b, K, N, legR[1]+0.1, legR[1]*0.85, col);
      if (sock && !p.sit) limb(b, lerp(N, K, Math.min(0.9, D.socks.h/bn[1])), N, legR[1]*0.9+0.25, legR[1]*0.85+0.2, sock);
      if (!ch.noShoes) shoe(b, OX+f[0], OY+f[1], 'f', ch, false, p.v); });
    if (D.shorts) shortsF(b, ch, hx, hy, ends, front);
    skirt(b, ch, hx, hy, null, p, p.v);
    var drawArms = function(){ [['lh', sL, -1], ['rh', sR, 1]].forEach(function(A2){ var h = p[A2[0]] || [A2[1][0]+A2[2]*2, hy+2]; arm(b, ch, A2[1], h, false, A2[2]*(front ? 1 : -1)*0.35, true, front ? A2[2] > 0 : A2[2] < 0); }); };
    var hsF = headOf(ch, p.v, p.hd || 'n'), nkF = ch.neck[p.v] || [5, 12], ho2 = p.ho || [0, 0], hX2 = OX+hx-nkF[0]+ho2[0], hY2 = OY+hy-L-nkF[1]+ho2[1]+1-br, hw = hsF.w;
    if (!front){ b.blit(tst, OX+hx-ch.tHipF, OY+hy-L+1-br); coatF(b, ch, hx, hy, p);
      if (D.braids){ braid(b, hX2+2, hY2+D.braids.y, D.braids.len, sw, D.braids.col, D.braids.ribbon); braid(b, hX2+hw-3, hY2+D.braids.y, D.braids.len, -sw, D.braids.col, D.braids.ribbon); }
      b.blit(hsF, hX2, hY2); drawArms(); }
    else { b.blit(tst, OX+hx-ch.tHipF, OY+hy-L+1-br); coatF(b, ch, hx, hy, p); drawArms(); b.blit(hsF, hX2, hY2);
      if (D.braids){ braid(b, hX2, hY2+D.braids.y, D.braids.len, -Math.abs(sw), D.braids.col, D.braids.ribbon); braid(b, hX2+hw-1, hY2+D.braids.y, D.braids.len, Math.abs(sw), D.braids.col, D.braids.ribbon); } }
    if (front && p.it === 'paper'){ b.rect(OX+hx-4, OY+hy-10, 9, 6, P.s6); b.hl(OX+hx-3, OX+hx+3, OY+hy-9, P.s3); b.hl(OX+hx-3, OX+hx+2, OY+hy-7, P.s3); }
    if (front && p.it === 'tin'){ b.rect(OX+hx-2, OY+hy-9, 5, 5, P.m3); b.hl(OX+hx-2, OX+hx+2, OY+hy-9, P.m4); b.px(OX+hx+1, OY+hy-7, P.m1); }
  }
  if (ch.post) ch.post(b, p, OX, OY, hx, hy-br);
  outline(b, P.k1);
  return b; }

// Nur Figuren mit Detailangaben (def.dx) laufen über den neuen Zeichner; alle anderen weiter über MALA.
var mala = M.poseBuf;
M.poseBuf = function(p, chId, t){ var ch = CH[chId]; if (!ch) throw new Error('keine Figur '+chId); if (!ch.dx) return mala(p, chId, t);
  var k = 'D'+JSON.stringify(p)+(p.it === 'cig' || p.it === 'candle' ? Math.floor((t || 0)/300) % 2 : '');
  return ch.cache[k] || (ch.cache[k] = render(p, ch, t)); };
M.RIG2 = { limb: limb, c4: c4 };
})(M);
