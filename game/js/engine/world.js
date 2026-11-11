/* ===== M. Adventure – engine/world.js =====
   Figuren (Actor), Wegfindung (2-px-Raster, A*, Sichtlinien-Glättung), Räume betreten, Kamera, Szenenbild.
   Gezeichnet wird wie in MALA in einen indizierten Puffer (M.Buf, Palettenindizes); erst am Ende wird er in RGBA umgesetzt. */
(function(MA){
'use strict';
var W = MA.W, SH = MA.SH, T = M.T, P = M.P;
var E = MA.E = MA.E || {};
E.room = null; E.S = null; E.camX = 0; E.gt = 0; E.busy = false; E.screen = 'title'; E.selected = null;
MA.ACT = {};

// ---------------------------------------------------------------- Figuren
function Actor(o){
  this.id = o.id; this.ch = o.ch || o.id; this.x = o.x === undefined ? 160 : o.x; this.y = o.y === undefined ? 120 : o.y; this.f = o.f || 'R';
  this.mode = 'idle'; this.anim = null; this.fi = 0; this.ft = 0; this.path = []; this.res = null; this.hold = false; this.frozen = null;
  this.visible = o.visible !== false; this.idle = o.idle || null; this.talk = o.talk || null;
  this.speed = o.speed || 85; this.step = o.step || 4; this.player = !!o.player; this.hgt = o.hgt || 48; this.noShadow = !!o.noShadow;
  this.item = o.item || null;   // gehaltenes Ding (Pose 'it')
}
MA.Actor = Actor;
function charOf(a){ return M.CHARS[a.ch]; }
function animLib(a){ var ch = charOf(a); return (ch && ch.anims) || {}; }
function animOf(a, name){ var lib = animLib(a); return lib[name] || M.ANIMS[name] || null; }
MA.animOf = animOf;
function idleSet(a){ if (a.idle){ var an = animOf(a, a.idle); if (an) return an; } return animOf(a, a.f === 'F' ? 'idleF' : (a.f === 'B' ? 'idleB' : 'idleS')); }
function setIdle(a){ a.mode = 'idle'; a.anim = idleSet(a); a.fi = 0; a.ft = 0; }
function cancelRes(a){ if (a.res){ var r = a.res; a.res = null; r(false); } }
function arrive(a){ a.path = []; setIdle(a); var r = a.res; a.res = null; if (r) r(true); }

// ---------------------------------------------------------------- Wegfindung
var NW = 160, NH = 72, nav = null;
MA.navDirty = true;
function inPoly(x, y, pts){ var c = false; for (var i = 0, j = pts.length-1; i < pts.length; j = i++){ var a = pts[i], b = pts[j]; if (((a[1] > y) !== (b[1] > y)) && (x < (b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])) c = !c; } return c; }
MA.inPoly = inPoly;
function walkable(x, y){ var r = E.room; if (!r || x < 0 || y < 0 || x >= r.width || y >= SH) return false;
  var ok = false;
  if (typeof r.walk === 'function') ok = !!r.walk(x, y, E.S, MA.GS);
  else if (r.walk){ for (var i = 0; i < r.walk.length; i++) if (inPoly(x, y, r.walk[i])){ ok = true; break; } }
  if (!ok) return false;
  var hs = typeof r.holes === 'function' ? r.holes(E.S, MA.GS) : (r.holes || []);
  for (var k = 0; k < hs.length; k++){ var h = hs[k]; if (typeof h[0] === 'number'){ if (x >= h[0] && x < h[0]+h[2] && y >= h[1] && y < h[1]+h[3]) return false; } else if (inPoly(x, y, h)) return false; }
  return true; }
MA.walkable = walkable;
function buildNav(){ NW = Math.ceil(E.room.width/2); nav = new Uint8Array(NW*NH); for (var j = 0; j < NH; j++) for (var i = 0; i < NW; i++) nav[j*NW+i] = walkable(i*2+1, j*2+1) ? 1 : 0; MA.navDirty = false; }
function cellOk(i, j){ return i >= 0 && j >= 0 && i < NW && j < NH && nav[j*NW+i] === 1; }
function nearestCell(x, y){ var ci = Math.floor(x/2), cj = Math.floor(y/2); if (cellOk(ci, cj)) return [ci, cj];
  for (var r = 1; r < 200; r++) for (var dj = -r; dj <= r; dj++) for (var di = -r; di <= r; di++){ if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue; if (cellOk(ci+di, cj+dj)) return [ci+di, cj+dj]; }
  return [ci, cj]; }
function nearestPoint(x, y){ if (MA.navDirty || !nav) buildNav(); if (walkable(x, y)) return [x, y]; var c = nearestCell(x, y); return [c[0]*2+1, c[1]*2+1]; }
MA.nearestPoint = nearestPoint;
function los(ax, ay, bx, by){ var d = Math.max(Math.abs(bx-ax), Math.abs(by-ay)); for (var k = 0; k <= d; k++){ var t = d ? k/d : 0, x = ax+(bx-ax)*t, y = ay+(by-ay)*t; if (!cellOk(Math.floor(x/2), Math.floor(y/2))) return false; } return true; }
function findPath(sx, sy, tx, ty){ if (MA.navDirty || !nav) buildNav();
  var s = nearestCell(sx, sy), t = nearestCell(tx, ty), tgt = walkable(tx, ty) ? [tx, ty] : [t[0]*2+1, t[1]*2+1];
  if (los(sx, sy, tgt[0], tgt[1])) return [tgt];
  var N = NW*NH, g = new Float32Array(N).fill(1e9), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N), open = [], si = s[1]*NW+s[0], ti = t[1]*NW+t[0];
  function push(p, v){ open.push([p, v]); var i = open.length-1; while (i > 0){ var j = (i-1) >> 1; if (open[j][0] <= open[i][0]) break; var q = open[i]; open[i] = open[j]; open[j] = q; i = j; } }
  function pop(){ var top = open[0], last = open.pop(); if (open.length){ open[0] = last; var i = 0; for (;;){ var l = i*2+1, r = l+1, m = i; if (l < open.length && open[l][0] < open[m][0]) m = l; if (r < open.length && open[r][0] < open[m][0]) m = r; if (m === i) break; var q = open[i]; open[i] = open[m]; open[m] = q; i = m; } } return top; }
  g[si] = 0; push(0, si);
  while (open.length){ var cur = pop()[1]; if (cur === ti) break; if (closed[cur]) continue; closed[cur] = 1; var ci = cur % NW, cj = (cur/NW) | 0;
    for (var dj = -1; dj <= 1; dj++) for (var di = -1; di <= 1; di++){ if (!di && !dj) continue; var ni = ci+di, nj = cj+dj; if (!cellOk(ni, nj)) continue; if (di && dj && (!cellOk(ci+di, cj) || !cellOk(ci, cj+dj))) continue;
      var k = nj*NW+ni, ng = g[cur]+(di && dj ? 1.414 : 1); if (ng < g[k]){ g[k] = ng; came[k] = cur; push(ng+Math.hypot(ni-t[0], nj-t[1]), k); } } }
  if (came[ti] < 0 && ti !== si) return [tgt];
  var cells = []; for (var c = ti; c !== si && c >= 0; c = came[c]) cells.push(c); cells.reverse();
  var pts = cells.map(function(c){ return [(c % NW)*2+1, ((c/NW) | 0)*2+1]; }); if (pts.length) pts[pts.length-1] = tgt; else pts = [tgt];
  var out = [], cx = sx, cy = sy, i = 0; while (i < pts.length){ var far = i; for (var q = pts.length-1; q > i; q--){ if (los(cx, cy, pts[q][0], pts[q][1])){ far = q; break; } } out.push(pts[far]); cx = pts[far][0]; cy = pts[far][1]; i = far+1; }
  return out; }

// ---------------------------------------------------------------- Bewegung und Animation
function walkActor(a, x, y, opt){ cancelRes(a); var p = (opt && opt.free) ? [x, y] : nearestPoint(x, y);
  if (Math.abs(p[0]-a.x) < 2 && Math.abs(p[1]-a.y) < 2){ a.x = p[0]; a.y = p[1]; if (a.mode === 'walk') setIdle(a); return Promise.resolve(true); }
  a.path = (opt && opt.free) ? [p] : findPath(a.x, a.y, p[0], p[1]); a.frozen = null; if (a.mode !== 'walk'){ a.mode = 'walk'; a.fi = 0; a.ft = 0; }
  return new Promise(function(r){ a.res = r; }); }
function playAnim(a, name, hook, hold){ var an = animOf(a, name); if (!an){ if (hook) hook(); return Promise.resolve(); } cancelRes(a);
  a.mode = 'anim'; a.anim = an; a.fi = 0; a.ft = 0; a.hold = !!hold; a.frozen = null; a.hook = { i: (M.CONTACT[name] === undefined ? -1 : M.CONTACT[name]), fn: hook, done: false };
  var v = an[0][0].v; if (v === 'S' && (a.f === 'F' || a.f === 'B')) a.f = 'R'; if (v === 'B') a.f = 'B'; if (v === 'F') a.f = 'F';
  return new Promise(function(r){ a.res = r; }); }
function faceActor(a, f){ if (!a) return; a.f = f; if (a.mode === 'idle') setIdle(a); }
MA.walkActor = walkActor; MA.playAnim = playAnim; MA.faceActor = faceActor; MA.setIdle = setIdle;
function updateActor(a, dt){
  if (a.frozen) return;
  if (a.mode === 'walk'){ a.ft += dt;
    while (a.ft >= a.speed && a.mode === 'walk'){ a.ft -= a.speed; var tg = a.path[0]; if (!tg){ arrive(a); break; }
      var dx = tg[0]-a.x, dy = tg[1]-a.y, side = Math.abs(dx) >= Math.abs(dy)*0.8, step = side ? a.step : a.step*0.6, d2 = Math.hypot(dx, dy);
      a.f = side ? (dx < 0 ? 'L' : 'R') : (dy < 0 ? 'B' : 'F');
      if (d2 <= step){ a.x = tg[0]; a.y = tg[1]; a.path.shift(); if (!a.path.length){ arrive(a); break; } }
      else { a.x += dx*step/d2; a.y += dy*step/d2; }
      a.fi = (a.fi+1) % 8; } }
  else if (a.mode === 'anim'){ a.ft += dt; var an = a.anim;
    while (a.mode === 'anim' && a.ft >= an[a.fi][1]){ a.ft -= an[a.fi][1]; a.fi++;
      if (a.hook && !a.hook.done && a.fi === a.hook.i){ a.hook.done = true; if (a.hook.fn) a.hook.fn(); }
      if (a.fi >= an.length){ if (a.hook && !a.hook.done && a.hook.fn){ a.hook.done = true; a.hook.fn(); } var last = an[an.length-1][0]; setIdle(a); if (a.hold){ a.frozen = last; a.hold = false; } var r = a.res; a.res = null; if (r) r(true); break; } } }
  else { var talking = E.speech && E.speech.who === a.id, set;
    if (talking){ var tn = a.talk ? animOf(a, a.talk) : null; set = tn || (a.f === 'B' ? idleSet(a) : animOf(a, a.f === 'F' ? 'talkF' : 'talkS')); }
    else set = idleSet(a);
    if (a.anim !== set){ a.anim = set; a.fi = 0; a.ft = 0; }
    a.ft += dt; var guard = 0; while (a.anim && a.ft >= a.anim[a.fi][1] && guard++ < 40){ a.ft -= a.anim[a.fi][1]; a.fi = (a.fi+1) % a.anim.length; } } }
function poseOf(a){ if (a.frozen) return a.frozen;
  if (a.mode === 'walk'){ var nm = a.f === 'F' ? 'walkF' : (a.f === 'B' ? 'walkB' : 'walkS'); var w = animOf(a, nm); return w[a.fi % 8]; }
  var fr = a.anim && a.anim[a.fi]; return fr ? fr[0] : animOf(a, 'idleS')[0][0]; }
MA.poseOf = poseOf;

// ---------------------------------------------------------------- Räume
E.player = function(){ return MA.ACT.m; };
E.syncPos = function(){ var p = MA.ACT.m; if (p && E.room){ MA.GS.pos = { x: Math.round(p.x), y: Math.round(p.y), f: p.f }; MA.GS.room = E.room.id; } };
function placeActors(){
  Object.keys(MA.ACT).forEach(function(k){ cancelRes(MA.ACT[k]); delete MA.ACT[k]; });
  var r = E.room, list = r.actors ? r.actors(E.S, MA.GS) : [];
  list.forEach(function(o){ if (!o || o.vis === false) return; var a = new Actor(o); MA.ACT[o.id] = a; setIdle(a); });
  if (!r.noActor){ var pos = MA.GS.pos, pc = MA.CAST.m || {}; var me = new Actor({ id: 'm', ch: 'm', x: pos.x, y: pos.y, f: pos.f, player: true, speed: 80, step: 3.6, hgt: 42 }); MA.ACT.m = me; setIdle(me); }
}
// Raum laden, ohne Übergang (Laden eines Spielstands, Neustart)
function loadRoom(id){ var r = MA.ROOMS[id]; if (!r) throw new Error('kein Raum '+id);
  E.room = r; E.S = MA.RS(id); MA.GS.room = id; MA.dirty = true; MA.navDirty = true; E.selectedHs = null; E.hoverHs = null;
  placeActors(); snapCamera(); if (r.load) r.load(MA.A); }
MA.loadRoom = loadRoom;
// Raumwechsel mit Abblende; from = Herkunft für die Eingänge
MA.gotoRoom = async function(id, o){ o = o || {}; var from = o.from || (E.room ? E.room.id : null); E.syncPos();
  if (E.room && E.room.leave) await E.room.leave(MA.A, id);
  if (o.fade !== false && E.screen === 'game') await MA.UI.fade(1, o.fadeMs || 280);
  MA.UI.clearSpeech(); E.selected = null;
  var tgt = MA.ROOMS[id]; if (!tgt) throw new Error('kein Raum '+id);
  var ent = o.x !== undefined ? [o.x, o.y, o.f || 'R'] : ((tgt.entries && tgt.entries[from]) || tgt.start || [160, 120, 'R']);
  MA.GS.pos = { x: ent[0], y: ent[1], f: ent[2] || 'R' };
  loadRoom(id);
  if (MA.onRoomChange) try { MA.onRoomChange(id, from); } catch(e){ console.error(e); }
  E.screen = 'game';
  if (o.fade !== false) await MA.UI.fade(0, o.fadeMs || 280);
  if (!o.noEnter && tgt.enter){ var wb = E.busy; MA.E.setBusy(true); try { await tgt.enter(MA.A, from); } catch(e){ console.error(e); } finally { MA.E.setBusy(wb); } }
  if (!o.noSave) MA.autosave();
};
MA.autosave = function(){ if (E.busy){ E.pendingSave = true; return; } MA.saveTo('auto'); };

// ---------------------------------------------------------------- Kamera
function snapCamera(){ var r = E.room, p = MA.ACT.m; if (!r) return; if (r.camX !== undefined){ E.camX = r.camX; return; } var tgt = Math.round((p ? p.x : r.width/2)-W/2); E.camX = Math.max(0, Math.min(r.width-W, tgt)); }
MA.snapCamera = snapCamera;
function updateCamera(dt){ var r = E.room; if (!r || r.width <= W){ E.camX = 0; return; } if (E.camLock !== undefined && E.camLock !== null){ var d0 = E.camLock-E.camX; E.camX += d0*Math.min(1, dt/240); if (Math.abs(d0) < 0.5) E.camX = E.camLock; return; }
  var p = MA.ACT.m; if (!p) return; var tgt = p.x-W/2; if (Math.abs(tgt-E.camX) > 30){ var d = tgt-E.camX; E.camX += (d-(d > 0 ? 30 : -30))*Math.min(1, dt/160); }
  E.camX = Math.max(0, Math.min(r.width-W, E.camX)); }

// ---------------------------------------------------------------- Takt
E.update = function(dt){ if (E.screen !== 'game' || E.paused) return; E.gt += dt; if (!E.busy || E.countBusy) MA.GS.playMs += dt;
  Object.keys(MA.ACT).forEach(function(k){ updateActor(MA.ACT[k], dt); });
  updateCamera(dt); if (MA.tickTimers) MA.tickTimers(); };

// ---------------------------------------------------------------- Szenenbild
var fb = new M.Buf(W, SH, P.k0); MA.fb = fb;
var bg = null, layers = [];
function rebuild(){ var r = E.room; bg = r.paint(E.S, MA.GS); layers = r.layers ? (r.layers(E.S, MA.GS) || []) : []; MA.dirty = false; }
MA.rebuild = function(){ MA.dirty = true; };
function shadow(x, y, w){ w = w || 6; for (var dy = -1; dy <= 1; dy++) for (var dx = -w; dx <= w; dx++){ var q = (dx/w)*(dx/w)+(dy/1.6)*(dy/1.6); if (q > 1) continue; var xx = Math.round(x+dx), yy = Math.round(y+dy); if (xx < 0 || yy < 0 || xx >= W || yy >= SH) continue; if (q > 0.6 && M.bayer(xx, yy) > 0.5) continue; var k = yy*W+xx; fb.d[k] = M.DN[fb.d[k]]; } }
function blitLayer(L, cam){ var ox = Math.round(L.ox-cam), oy = L.oy; for (var j = 0; j < L.h; j++){ var y = oy+j; if (y < 0 || y >= SH) continue; for (var i = 0; i < L.w; i++){ var x = ox+i; if (x < 0 || x >= W) continue; var c = L.d[j*L.w+i]; if (c !== T) fb.d[y*W+x] = c; } } }
MA.renderScene = function(){ var r = E.room; if (!r) return fb; if (MA.dirty || !bg) rebuild();
  var cam = Math.round(E.camX), view = { cam: cam, gt: E.gt, S: E.S, GS: MA.GS };
  for (var y = 0; y < SH; y++){ var row = y*bg.w; for (var x = 0; x < W; x++){ var sx = x+cam; fb.d[y*W+x] = (sx >= 0 && sx < bg.w) ? bg.d[row+sx] : P.k0; } }
  if (r.dynamic) r.dynamic(fb, view);
  var items = [];
  Object.keys(MA.ACT).forEach(function(k){ var a = MA.ACT[k]; if (a.visible) items.push({ a: a, base: a.y }); });
  layers.forEach(function(L){ if (!L.hide) items.push({ L: L, base: L.base }); });
  if (r.props) (r.props(view) || []).forEach(function(p){ items.push({ p: p, base: p.base }); });   // bewegliche Dinge (Ball, Plakatecke …)
  items.sort(function(a, b){ return a.base-b.base; });
  items.forEach(function(it){
    if (it.L) blitLayer(it.L, cam);
    else if (it.p) it.p.draw(fb, view);
    else { var a = it.a, ch = M.CHARS[a.ch]; if (!ch) return; if (!a.noShadow) shadow(a.x-cam, a.y, ch.kid ? 5 : 6);
      var pose = poseOf(a), item = (a.id === 'm' && MA.playerItem) ? (MA.playerItem() || a.item) : a.item;
      if (item === 'crate' || item === 'crateEmpty'){ var kk = ch.kid ? 0.82 : 1; pose = Object.assign({}, pose, pose.v === 'S' ? { nh: [Math.round(7*kk), Math.round(-16*kk)], fh: [Math.round(5*kk), Math.round(-16*kk)], it: item } : (pose.v === 'F' ? { lh: [-5, Math.round(-15*kk)], rh: [5, Math.round(-15*kk)], it: 'crate' } : pose)); }
      else if (item && !pose.it){ pose = Object.assign({}, pose, { it: item }); }
      M.drawPose(fb, a.x-cam, a.y, pose, a.f === 'L' ? 'L' : 'R', a.ch, { t: E.gt, h: SH }); } });
  if (r.front) r.front(fb, view);
  if (MA.UI && MA.UI.drawSceneMarks) MA.UI.drawSceneMarks(fb, view);
  return fb; };
// Vorschaubild für Spielstände: 80 × 36, aus dem aktuellen Szenenbild
MA.makeThumb = function(){ if (!E.room) return null; var c = document.createElement('canvas'); c.width = 80; c.height = 36; var g = c.getContext('2d'), img = g.createImageData(80, 36);
  for (var y = 0; y < 36; y++) for (var x = 0; x < 80; x++){ var q = M.RGB[fb.d[(y*4)*W+x*4]] || [0, 0, 0], k = (y*80+x)*4; img.data[k] = q[0]; img.data[k+1] = q[1]; img.data[k+2] = q[2]; img.data[k+3] = 255; }
  g.putImageData(img, 0, 0); return c.toDataURL('image/png'); };

// ---------------------------------------------------------------- Hotspots
E.hsRect = function(h){ if (h.npc){ var a = MA.ACT[h.npc]; if (!a || !a.visible) return null; if (h.r) return typeof h.r === 'function' ? h.r(E.S, MA.GS, a) : h.r; var hh = h.hgt || a.hgt || 46; return [Math.round(a.x)-8, Math.round(a.y)-hh, 16, hh]; }
  return typeof h.r === 'function' ? h.r(E.S, MA.GS) : h.r; };
E.hsVisible = function(h){ if (h.vis && !h.vis(E.S, MA.GS)) return false; return !!E.hsRect(h); };
E.hotspots = function(){ var r = E.room; if (!r) return []; return r.hotspots.filter(function(h){ return E.hsVisible(h); }); };
E.hotspotAt = function(x, y){ var best = null, ba = 1e9; E.hotspots().forEach(function(h){ var R = E.hsRect(h); if (x >= R[0] && x < R[0]+R[2] && y >= R[1] && y < R[1]+R[3]){ var a = R[2]*R[3]*(h.pri || 1); if (a < ba){ ba = a; best = h; } } }); return best; };
// Fangradius für Fingertipps: nächstgelegene Stellen im Umkreis r (Spielpixel)
E.hotspotsNear = function(x, y, r){ var out = []; E.hotspots().forEach(function(h){ var R = E.hsRect(h), dx = Math.max(R[0]-x, 0, x-(R[0]+R[2]-1)), dy = Math.max(R[1]-y, 0, y-(R[1]+R[3]-1)), d = Math.sqrt(dx*dx+dy*dy); if (d <= r) out.push({ hs: h, d: d }); }); out.sort(function(a, b){ return a.d-b.d; }); return out; };
E.hsName = function(h){ if (!h) return ''; var n = h.name; if (h.npc && !n){ var c = MA.CAST[h.npc]; n = c ? c.name : h.npc; } return typeof n === 'function' ? n(E.S, MA.GS) : n; };
E.hsStand = function(h){ var st = typeof h.st === 'function' ? h.st(E.S, MA.GS) : h.st; if (st) return st; if (st === null || E.room.noActor) return null;
  if (h.npc){ var a = MA.ACT[h.npc], p = MA.ACT.m; if (!a || !p) return null; var side = p.x < a.x ? -1 : 1; return [a.x+side*(h.talkDist || 20), a.y, side < 0 ? 'R' : 'L']; }
  var R = E.hsRect(h); if (!R) return null; var cx = R[0]+R[2]/2, p2 = nearestPoint(cx, Math.min(SH-3, R[1]+R[3]+4)), dx = cx-p2[0]; return [p2[0], p2[1], Math.abs(dx) < 10 ? 'B' : (dx < 0 ? 'L' : 'R')]; };
})(MA);
