/* ===== M. Adventure – engine/extras.js =====
   Statisten ohne Spielfunktion: Tauben, eine Katze, Passanten. Nicht anklickbar, blockieren nichts.
   – Tauben picken, trippeln und fliegen auf, wenn M. näher als ~22 px kommt; später landen sie wieder
   – die Katze schläft (Schwanzspitze zuckt), steht auf, streckt sich, schleicht zu einem anderen Platz, flieht vor M.
   – Passanten (eigene Figuren im Rig) gehen auf einer Spur durchs Bild, bleiben manchmal kurz stehen
   Gezeichnet wird mit Tiefensortierung (MA.extrasProps wird von renderScene eingesammelt). */
(function(MA){
'use strict';
var E = MA.E, P = M.P;
function rnd(a, b){ return a+Math.random()*(b-a); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// ---------------------------------------------------------------- Belegung je Ort
MA.EXTRAS = {
  hof:    { pigeons: [{ zone: [200, 330, 120, 138], n: 2 }] },
  markt:  { pigeons: [{ zone: [130, 220, 122, 140], n: 3 }], cat: { spots: [[156, 128, 'R'], [206, 122, 'L'], [334, 128, 'L']] },
            walkers: { lanes: [108, 112], chars: ['passFrau', 'passMann', 'passOpa'], every: [9000, 20000], stopAt: [70, 260] } },
  most:   { pigeons: [{ zone: [150, 250, 60, 62], n: 2, perch: true }], walkers: { lanes: [92], chars: ['passMann', 'passFrau'], every: [16000, 32000], bridge: true } },
  sperre: { pigeons: [{ zone: [120, 200, 124, 140], n: 2 }] },
  parade: { pigeons: [{ zone: [260, 380, 126, 140], n: 2 }], crowd: { y: 97, x0: 4, x1: 396, gap: [12, 19], scale: 0.62, chars: ['passFrau', 'passMann', 'passOpa', 'passKind', 'passMann', 'passFrau', 'passKind'] } }
};
var X = { pigeons: [], cat: null, walkers: [], crowd: [], nextWalker: 0, cfg: null };

MA.extrasReset = function(){ var r = E.room, c = r && MA.EXTRAS[r.id]; X = { pigeons: [], cat: null, walkers: [], crowd: [], nextWalker: E.gt+rnd(2500, 6000), cfg: c || null }; if (!c) return;
  if (c.crowd){ var cr = c.crowd, rs = 7; for (var x = cr.x0; x < cr.x1; x += Math.round(rnd(cr.gap[0], cr.gap[1]))){ rs = (rs*16807) % 2147483647; X.crowd.push({ x: x, y: cr.y+(rs % 3)-1, ch: cr.chars[rs % cr.chars.length], flag: (rs % 5) < 2, lut: (rs >> 3) % 8, an: null, fi: 0, ft: 0, next: E.gt+rnd(500, 6000) }); } }
  (c.pigeons || []).forEach(function(z){ for (var i = 0; i < z.n; i++) X.pigeons.push(newPigeon(z, true)); });
  if (c.cat){ var s = pick(c.cat.spots); X.cat = { x: s[0], y: s[1], f: s[2], st: 'lie', t: 0, next: E.gt+rnd(6000, 14000), tx: 0, ty: 0 }; } };

// ---------------------------------------------------------------- Tauben
function newPigeon(z, ground){ return { z: z, x: rnd(z.zone[0], z.zone[1]), y: Math.round(rnd(z.zone[2], z.zone[3])), f: Math.random() < 0.5 ? 1 : -1, st: ground ? 'peck' : 'in', t: rnd(0, 800), alt: ground ? 0 : 40, vx: 0, next: E.gt+rnd(600, 2500), away: 0 }; }
function perchY(p){ var K = MA.ART.most && MA.ART.most.K; return K ? Math.round(K.deck(p.x))-K.parH : p.y; }
function tickPigeon(p, dt){ var me = MA.ACT.m; p.t += dt; if (p.z.perch && p.st !== 'fly' && p.st !== 'gone') p.y = perchY(p);
  if (p.st === 'fly'){ p.x += p.vx*dt/16; p.alt += dt/16*1.6; if (p.alt > 90){ p.st = 'gone'; p.away = E.gt+rnd(9000, 20000); } return; }
  if (p.st === 'gone'){ if (E.gt > p.away){ var n = newPigeon(p.z, false); for (var k in n) p[k] = n[k]; p.alt = 60; p.st = 'in'; } return; }
  if (p.st === 'in'){ p.alt -= dt/16*1.2; if (p.alt <= 0){ p.alt = 0; p.st = 'peck'; } return; }
  if (me && Math.abs(me.x-p.x) < 22 && (p.z.perch || Math.abs(me.y-p.y) < 14) && me.mode === 'walk'){ p.st = 'fly'; p.vx = (p.x < me.x ? -1 : 1)*rnd(1.2, 2); p.f = p.vx < 0 ? -1 : 1; return; }
  if (E.gt > p.next){ if (Math.random() < 0.45){ p.st = 'walk'; p.tx = Math.max(p.z.zone[0], Math.min(p.z.zone[1], p.x+rnd(-14, 14))); p.f = p.tx < p.x ? -1 : 1; } else { p.st = 'peck'; } p.next = E.gt+rnd(1200, 3200); }
  if (p.st === 'walk'){ var d = p.tx-p.x; if (Math.abs(d) < 0.6) p.st = 'peck'; else p.x += Math.sign(d)*dt/16*0.35; } }
function drawPigeon(fb, p, cam){ if (p.st === 'gone') return; var x = Math.round(p.x-cam), y = Math.round(p.y-p.alt), f = p.f, W = fb.w, H = fb.h;
  function px(xx, yy, c){ if (xx >= 0 && yy >= 0 && xx < W && yy < H) fb.d[yy*W+xx] = c; }
  if (p.alt === 0) { px(x-1, p.y+1-0, M.DN[fb.d[Math.min(H-1, p.y+1)*W+Math.max(0, Math.min(W-1, x))]] || P.k1); }
  var flying = p.st === 'fly' || p.st === 'in', peck = p.st === 'peck' && Math.floor(p.t/260) % 3 === 0, hop = p.st === 'walk' && Math.floor(p.t/120) % 2;
  y -= hop ? 1 : 0;
  // Körper
  px(x, y-2, P.m3); px(x-f, y-2, P.m3); px(x+f, y-2, P.m3); px(x, y-3, P.m4); px(x-f, y-3, P.m3); px(x-2*f, y-2, P.m2); px(x-2*f, y-3, P.m1);
  px(x, y-1, P.m2); px(x-f, y-1, P.m2);
  // Kopf (beim Picken unten)
  if (peck){ px(x+2*f, y-1, P.m2); px(x+3*f, y-1, P.s4); px(x+f, y-1, P.g4); }
  else { px(x+f, y-4, P.m2); px(x+2*f, y-4, P.m2); px(x+2*f, y-5, P.m2); px(x+3*f, y-4, P.s4); px(x+f, y-3, P.g4); px(x+2*f, y-4, P.k1); }
  if (!flying){ px(x, y, P.r3); px(x-f, y, P.r3); }
  else { var up = Math.floor(p.t/90) % 2; if (up){ px(x-f, y-5, P.m3); px(x-f, y-6, P.m4); px(x, y-5, P.m3); } else { px(x-f, y, P.m3); px(x-f, y+1, P.m4); px(x, y, P.m3); } } }

// ---------------------------------------------------------------- Katze
function tickCat(c, dt){ var me = MA.ACT.m, cfg = X.cfg.cat; c.t += dt;
  var near = me && Math.abs(me.x-c.x) < 18 && Math.abs(me.y-c.y) < 12;
  if (near && c.st !== 'walk'){ var far = cfg.spots.filter(function(s){ return Math.abs(s[0]-me.x) > 50; }); var s = far.length ? pick(far) : pick(cfg.spots); c.st = 'walk'; c.tx = s[0]; c.ty = s[1]; c.sf = s[2]; c.f = c.tx < c.x ? 'L' : 'R'; c.fast = true; return; }
  if (c.st === 'walk'){ var dx = c.tx-c.x, dy = c.ty-c.y, d = Math.hypot(dx, dy), sp = (c.fast ? 0.9 : 0.4)*dt/16; if (d < sp+0.2){ c.x = c.tx; c.y = c.ty; c.f = c.sf || c.f; c.st = 'sit'; c.fast = false; c.next = E.gt+rnd(2500, 5000); } else { c.x += dx/d*sp; c.y += dy/d*sp; } return; }
  if (E.gt < c.next) return;
  if (c.st === 'lie'){ c.st = 'stretch'; c.t = 0; c.next = E.gt+900; return; }
  if (c.st === 'stretch'){ c.st = 'sit'; c.next = E.gt+rnd(2000, 4000); return; }
  if (c.st === 'sit'){ if (Math.random() < 0.5){ var s2 = pick(cfg.spots); c.st = 'walk'; c.tx = s2[0]; c.ty = s2[1]; c.sf = s2[2]; c.f = c.tx < c.x ? 'L' : 'R'; } else { c.st = 'lie'; c.next = E.gt+rnd(8000, 16000); } return; } }
function drawCat(fb, c, cam){ var x = Math.round(c.x-cam), y = Math.round(c.y), f = c.f === 'L' ? -1 : 1, W = fb.w, H = fb.h, O = P.t3, D = P.t2, L = P.t4, Wh = P.s5;
  function px(xx, yy, col){ if (xx >= 0 && yy >= 0 && xx < W && yy < H) fb.d[yy*W+xx] = col; }
  for (var s = -4; s <= 4; s++) px(x+s, y+1, M.DN[fb.d[Math.min(H-1, y+1)*W+Math.max(0, Math.min(W-1, x+s))]] || P.k1);
  if (c.st === 'lie'){ // eingerollt, Schwanzspitze zuckt
    for (var i = -3; i <= 3; i++){ px(x+i, y, i % 2 ? O : D); px(x+i, y-1, i === -3 || i === 3 ? P.k1 : (i % 2 ? L : O)); px(x+i, y-2, Math.abs(i) < 2 ? L : P.k1); }
    px(x+3*f, y-2, O); px(x+4*f, y-1, O); px(x+4*f, y-3, D); px(x+3*f, y-3, D); px(x+4*f, y, P.k1);
    var tw = Math.floor(c.t/400) % 4 === 0; px(x-4*f, y, O); px(x-4*f, y-1, tw ? L : O); px(x-3*f, y+0, D); return; }
  var walk = c.st === 'walk', step = walk ? Math.floor(c.t/(c.fast ? 90 : 160)) % 2 : 0, sit = c.st === 'sit', str = c.st === 'stretch';
  var by = sit ? y-3 : y-3; // Körper
  for (var j = -3; j <= 2; j++){ px(x+j*f, by, j % 2 ? O : D); px(x+j*f, by-1, j % 2 ? L : O); }
  if (sit){ px(x-3*f, by+1, O); px(x-2*f, by+1, O); px(x+f, by+1, Wh); px(x+f, by+2, Wh); px(x+2*f, by+2, O); px(x-2*f, by+2, O); }
  else { px(x-2*f, by+1, D); px(x-2*f, by+2, step ? D : P.k1); px(x+2*f, by+1, D); px(x+2*f, by+2, step ? P.k1 : D); px(x-1*f, by+2, step ? D : 0 || D); px(x+1*f, by+2, D); }
  // Kopf mit Ohren
  var hx = x+(str ? 4 : 3)*f, hy = by-(str ? 0 : 2);
  px(hx, hy, O); px(hx+f, hy, O); px(hx, hy+1, L); px(hx+f, hy+1, Wh); px(hx, hy-1, D); px(hx+f, hy-1, D); px(hx+2*f, hy, P.s4); px(hx+f, hy, P.k1);
  // Schwanz
  var tx = x-4*f; if (sit){ px(tx, by+1, O); px(tx-f, by+2, O); px(tx-2*f, by+2, D); }
  else { var wag = Math.floor(c.t/300) % 2; px(tx, by-1, O); px(tx-f, by-2-wag, O); px(tx-f, by-3-wag, D); } }

// ---------------------------------------------------------------- Passanten
function newWalker(){ var c = X.cfg.walkers, r = E.room, dir = Math.random() < 0.5 ? 1 : -1, y = pick(c.lanes);
  var ch = pick(c.chars); if (!M.CHARS[ch]) return null;
  var w = { ch: ch, x: dir > 0 ? -18 : r.width+18, y: y, dir: dir, fi: 0, ft: 0, speed: rnd(95, 130), step: 3.2, stop: 0, stopped: false };
  if (c.stopAt && Math.random() < 0.5) w.stopX = pick(c.stopAt)+rnd(-10, 10);
  return w; }
function tickWalker(w, dt){ if (w.stop > 0){ w.stop -= dt; if (w.stop <= 0) w.stopped = true; return; }
  if (w.stopX !== undefined && !w.stopped && Math.abs(w.x-w.stopX) < 2){ w.stop = rnd(1500, 3500); return; }
  w.ft += dt; while (w.ft >= w.speed){ w.ft -= w.speed; w.x += w.dir*w.step; w.fi = (w.fi+1) % 8; } }
function walkerY(w){ if (X.cfg.walkers.bridge && MA.ART.most && MA.ART.most.K && MA.ART.most.K.deck) return Math.round(MA.ART.most.K.deck(w.x))-1; return w.y; }
function drawWalker(fb, w, cam){ var ch = M.CHARS[w.ch]; if (!ch) return; var an = (ch.anims && ch.anims.walkS) || M.ANIMS.walkS, idl = (ch.anims && ch.anims.idleS) || M.ANIMS.idleS;
  var pose = w.stop > 0 ? (w.stop % 1400 < 900 ? idl[0][0] : idl[1][0]) : an[w.fi % 8], y = walkerY(w);
  if (ch.dx && ch.dx.item) pose = Object.assign({}, pose, { it: ch.dx.item });
  var sx = Math.round(w.x-cam); for (var s = -5; s <= 5; s++){ var xx = sx+s, yy = y+1; if (xx >= 0 && xx < fb.w && yy < fb.h) fb.d[yy*fb.w+xx] = M.DN[fb.d[yy*fb.w+xx]]; }
  M.drawPose(fb, w.x-cam, y, pose, w.dir < 0 ? 'L' : 'R', w.ch, { t: E.gt, h: fb.h }); }

// ---------------------------------------------------------------- Hintergrund in Bewegung: wehende Fahnen, schwingende Wimpelketten, Laubschimmer
MA.drawBgAnim = function(fb, view){ var list = E.bgAnim; if (!list || !list.length) return; var cam = view.cam, t = view.gt, W = fb.w, H = fb.h;
  function px(x, y, c){ x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < W && y < H) fb.d[y*W+x] = c; }
  list.forEach(function(o){
    if (o.k === 'flag'){ var x0 = o.x-cam; if (x0 > W+4 || x0+o.w < -4) return; var th = Math.round(o.h/3);
      for (var i = 0; i < o.w; i++){ var amp = 0.2+i/o.w*0.95, dy = Math.round(Math.sin(i*0.55-t*0.005+o.ph)*amp), shade = Math.sin(i*0.55-t*0.005+o.ph+1.2) > 0.8;
        for (var j = 0; j < o.h; j++){ var c = j < th ? P.b2 : (j < o.h-th ? P.s6 : P.r3); if (shade) c = M.DN[c]; px(x0+i, o.y+j+dy, c); } }
      var cx = Math.floor(o.w/2), cdy = Math.round(Math.sin(cx*0.55-t*0.005+o.ph)*(0.2+cx/o.w*0.95)), cy = o.y+Math.floor(o.h/2)+cdy;
      px(x0+cx, cy-1, P.r3); px(x0+cx-1, cy, P.r3); px(x0+cx, cy, P.r3); px(x0+cx+1, cy, P.r3); if (o.w > 9) px(x0+cx, cy-2, P.y3); return; }
    if (o.k === 'garland'){ var n = Math.abs(o.x1-o.x0), cols = [P.b2, P.s6, P.r3], sway = Math.sin(t*0.0017+o.ph)*1.3;
      for (var k = 0; k <= n; k++){ var u = k/n, x = o.x0+(o.x1-o.x0)*u-cam; if (x < -3 || x > W+3) continue; var y = o.y0+(o.y1-o.y0)*u+Math.sin(Math.PI*u)*(o.sag+sway); px(x, y, P.k2);
        if (k % 6 === 2){ var c2 = cols[Math.floor(k/6) % 3], sw = Math.round(Math.sin(t*0.004+k*0.9+o.ph)*0.8); px(x, y+1, c2); px(x+1, y+1, c2); px(x+2, y+1, c2); px(x+1+sw, y+2, c2); px(x+1+sw, y+3, M.DN[c2]); } } return; }
    if (o.k === 'laundry'){ var n2 = o.x1-o.x0; for (var k2 = 0; k2 <= n2; k2++){ var lx = o.x0+k2-cam; if (lx < 0 || lx >= W) continue; px(lx, o.y0+(o.y1-o.y0)*k2/n2+Math.sin(Math.PI*k2/n2)*2, P.k2); }
      o.items.forEach(function(it, i){ var ix = it[0]-cam, iy = Math.round(o.y0+(o.y1-o.y0)*(it[0]-o.x0)/n2+Math.sin(Math.PI*(it[0]-o.x0)/n2)*2)+1;
        for (var yy = 0; yy < it[3]; yy++){ var sw2 = Math.round(Math.sin(t*0.004+i*1.7+yy*0.5)*(yy/it[3])*1.6); for (var xx = 0; xx < it[2]; xx++){ var c4 = (xx === 0 || yy === it[3]-1) ? M.DN[it[1]] : it[1]; px(ix+xx+sw2, iy+yy, c4); } }
        px(ix, iy-1, P.w3); px(ix+it[2]-1, iy-1, P.w3); }); return; }
    if (o.k === 'tree'){ var bx = o.cx-cam; if (bx+o.rx < 0 || bx-o.rx > W) return; var slot = Math.floor(t/260), seed = slot*977+o.cx*31;
      for (var q = 0; q < 26; q++){ seed = (seed*1103515245+12345) & 0x7fffffff; var rx = (seed % 1000)/1000*2-1; seed = (seed*1103515245+12345) & 0x7fffffff; var ry = (seed % 1000)/1000*2-1;
        if (rx*rx+ry*ry > 0.8) continue; var xx = Math.round(bx+rx*o.rx), yy = Math.round(o.cy+ry*o.ry); if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        var c3 = fb.d[yy*W+xx], li = o.lf.indexOf(c3); if (li < 0) continue; var to = o.lf[Math.max(0, Math.min(o.lf.length-1, li+(q % 2 ? 1 : -1)))]; fb.d[yy*W+xx] = to; } } });
};

// ---------------------------------------------------------------- Zuschauer an der Paradestraße: vordere Reihe mit eigenem Takt
var CROWD_FID = ['fidNodF', 'fidLaughF', 'chatF', 'waveF', 'fidRockF'], CROWD_FLAG = ['flagWaveF', 'flagWaveF', 'npflagWaveF'];
// Farbwechsel für die Kleidung der Zuschauer (Paletten-Umsetzung beim Zeichnen): grau/dunkel → weiß, hellblau, beige, rot, grün, navy
var LUTS = null;
function makeLuts(){ var base = [P.m0, P.m1, P.m2, P.m3, P.k2, P.b1, P.b2, P.b3], targets = [['s3', 's4', 's5', 's6', 's3', 's4', 's5', 's6'], ['b1', 'b2', 'b3', 'b4', 'b1', 'b2', 'b3', 'b4'], ['w3', 'w4', 'w5', 'w6', 'w3', 'w4', 'w5', 'w6'], ['r1', 'r2', 'r3', 'r4', 'r1', 'r2', 'r3', 'r4'], ['g2', 'g3', 'g4', 'g5', 'g2', 'g3', 'g4', 'g5'], ['n1', 'n2', 'n3', 'n4', 'n1', 'n2', 'n3', 'n4'], ['e2', 'e3', 'e4', 'e5', 'e2', 'e3', 'e4', 'e5']];
  LUTS = targets.map(function(t){ var lut = new Uint8Array(256); for (var i = 0; i < 256; i++) lut[i] = i; base.forEach(function(c, k){ lut[c] = P[t[k]]; }); return lut; }); LUTS.unshift(null); }
function animOfCh(ch, n){ var c = M.CHARS[ch]; return (c && c.anims && c.anims[n]) || M.ANIMS[n]; }
function tickCrowd(p, dt){ p.ft += dt;
  if (p.an){ var fr = p.an[p.fi]; while (fr && p.ft >= fr[1]){ p.ft -= fr[1]; p.fi++; fr = p.an[p.fi]; if (!fr){ if (p.loop > 0){ p.loop--; p.fi = 0; fr = p.an[0]; } else { p.an = null; p.fi = 0; break; } } } }
  if (!p.an && E.gt > p.next){ var cheer = !!E.cheer, list = (p.flag && (cheer || Math.random() < 0.5)) ? CROWD_FLAG : CROWD_FID, n = cheer ? (p.flag ? 'flagWaveF' : 'waveF') : list[Math.floor(Math.random()*list.length)];
    p.an = animOfCh(p.ch, n) || null; p.fi = 0; p.ft = 0; p.loop = (n.indexOf('Wave') > 0) ? 2 : 0; p.next = E.gt+(cheer ? rnd(200, 900) : rnd(3000, 9000)); } }
function drawCrowd(fb, cam){ var cr = X.cfg.crowd, sc = cr.scale;
  X.crowd.forEach(function(p){ var x = p.x-cam; if (x < -12 || x > fb.w+12) return; var idle = animOfCh(p.ch, 'idleF'), pose = p.an && p.an[p.fi] ? p.an[p.fi][0] : idle[Math.floor((E.gt/700+p.x) % idle.length)][0];
    if (p.flag && !pose.it) pose = Object.assign({}, pose, { it: 'flag', rh: pose.rh || [7, -24] });
    if (!LUTS) makeLuts(); M.drawPose(fb, x, p.y, pose, 'F', p.ch, { t: E.gt, h: fb.h, scale: sc, lut: LUTS[p.lut % LUTS.length] }); });
  // Absperrseil und Pfosten vor den Zuschauern
  for (var x2 = 0; x2 < fb.w; x2 += 2){ var wx = x2+cam, sy = 97+Math.round(Math.sin(wx*0.05)*1); fb.d[sy*fb.w+x2] = P.s6; if (sy+1 < fb.h && x2 % 4 === 0) fb.d[(sy+1)*fb.w+x2] = P.s4; }
  [0, 80, 160, 240, 320].forEach(function(px0){ var x3 = px0-cam; for (var yy = 92; yy < 100; yy++) for (var xx = x3; xx < x3+2; xx++) if (xx >= 0 && xx < fb.w) fb.d[yy*fb.w+xx] = xx === x3 ? P.w2 : P.w1; }); }

// ---------------------------------------------------------------- Takt und Zeichnen
MA.extrasTick = function(dt){ if (E.screen !== 'game' || !E.room || !X.cfg) return;
  X.crowd.forEach(function(p){ tickCrowd(p, dt); });
  X.pigeons.forEach(function(p){ tickPigeon(p, dt); });
  if (X.cat) tickCat(X.cat, dt);
  if (X.cfg.walkers){ X.walkers.forEach(function(w){ tickWalker(w, dt); }); X.walkers = X.walkers.filter(function(w){ return w.x > -30 && w.x < E.room.width+30; });
    if (E.gt > X.nextWalker && X.walkers.length < 2 && !E.cutscene){ var w = newWalker(); if (w) X.walkers.push(w); X.nextWalker = E.gt+rnd(X.cfg.walkers.every[0], X.cfg.walkers.every[1]); } } };
MA.extrasProps = function(view){ var out = [], cam = view.cam;
  if (X.crowd.length) out.push({ base: 70, draw: function(fb){ drawCrowd(fb, cam); } });
  X.pigeons.forEach(function(p){ if (p.st !== 'gone') out.push({ base: (p.alt > 0 || p.z.perch) ? 1000 : p.y, draw: function(fb){ drawPigeon(fb, p, cam); } }); });
  if (X.cat) out.push({ base: X.cat.y, draw: function(fb){ drawCat(fb, X.cat, cam); } });
  X.walkers.forEach(function(w){ out.push({ base: walkerY(w), draw: function(fb){ drawWalker(fb, w, cam); } }); });
  return out; };
})(MA);
