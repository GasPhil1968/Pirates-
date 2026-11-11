/* ===== M. Adventure – engine/script.js =====
   Skript-API für Szenen (async/await), Gesprächsschleife, Verben, Gegenstände, Standardantworten.
   Während eine Szene läuft (E.busy), gilt für Spielstände der Stand von ihrem Beginn (E.safeGS) – so landet nie ein halber Ablauf im Speicher. */
(function(MA){
'use strict';
var E = MA.E;

// ---------------------------------------------------------------- Takt und Warten
var timers = [];
MA.tickTimers = function(){ for (var i = timers.length-1; i >= 0; i--){ if (E.gt >= timers[i].t){ var r = timers[i].r; timers.splice(i, 1); r(); } } };
function wait(ms){ if (E.ff) ms = ms/8; return new Promise(function(r){ timers.push({ t: E.gt+ms, r: r }); }); }
MA.clearTimers = function(){ timers.length = 0; };

// ---------------------------------------------------------------- Szene läuft
E.safeGS = null;
E.setBusy = function(v){ v = !!v; if (v && !E.busy && E.room){ try { E.syncPos(); E.safeGS = JSON.parse(JSON.stringify(MA.GS)); } catch(e){} }
  E.busy = v; if (!v){ E.safeGS = null; if (E.pendingSave){ E.pendingSave = false; MA.saveTo('auto'); } } if (MA.UI && MA.UI.onBusy) MA.UI.onBusy(v); };
async function scene(fn){ if (E.busy) return; E.setBusy(true); try { await fn(); } catch(e){ console.error(e); } finally { E.setBusy(false); } }
MA.scene = scene;

// ---------------------------------------------------------------- Sprechen
// who: 'm' (M.), Figuren-id, '#' (Erzähler), 'kinder' (Chor)
E.speech = null;
function say(text, who, opt){ if (E.speech){ var prev = E.speech.res; E.speech = null; prev(); }
  text = String(text); who = who || 'm';
  if (MA.__log) MA.__log.push([who, text]);
  return new Promise(function(res){ var sp = MA.settings.textSpeed, f = [1.45, 1, 0.7][sp] || 1, dur = Math.max(1500, 900+text.length*55)*f;
    E.speech = { text: text, who: who, at: E.gt, at0: Date.now(), until: E.gt+dur, res: res, opt: opt || {} };
    var a = MA.ACT[who]; if (a && a.mode === 'idle') MA.setIdle(a);
    if (MA.UI) MA.UI.showSpeech(E.speech); }); }
E.endSpeech = function(force){ var s = E.speech; if (!s) return; if (!force && Date.now()-s.at0 < 180) return; E.speech = null; if (MA.UI) MA.UI.hideSpeech(); s.res(); };
E.speechTick = function(){ var s = E.speech; if (!s || MA.settings.tapText || s.opt.hold) return; if (E.gt >= s.until || (E.ff && E.gt >= s.at+120)) E.endSpeech(true); };

// ---------------------------------------------------------------- Auswahl
E.dlg = null;
function choose(opts, o){ o = o || {}; opts = opts.map(function(x, i){ return typeof x === 'string' ? { t: x, id: i } : Object.assign({ id: i }, x); });
  return new Promise(function(res){ E.dlg = { opts: opts, res: res, at: Date.now(), title: o.title || null }; if (MA.UI) MA.UI.showChoices(E.dlg); })
    .then(function(op){ if (!op.bye && !op.noGray) MA.GS.seen['ask:'+op.t] = 1; return op; }); }
E.chooseDone = function(i){ var d = E.dlg; if (!d || !d.opts[i]) return; if (Date.now()-d.at < 220) return; E.dlg = null; if (MA.UI) MA.UI.hideChoices(); d.res(d.opts[i]); };
// Gesprächsschleife: getOpts() -> [{t, go: async fn(A), once:'key', if: bool, bye: true}]
async function menu(getOpts){ var r0 = E.room;
  for (var guard = 0; guard < 120; guard++){
    var opts = getOpts().filter(function(o){ return o && !(('if' in o) && !o.if) && !(o.once && MA.GS.seen['dlg:'+o.once]); });
    if (!opts.length) return;
    var pick = await choose(opts.map(function(o, k){ return { t: o.t, id: k, bye: !!o.bye, noGray: !!o.noGray }; }));
    var o = opts[pick.id]; if (o.once) MA.GS.seen['dlg:'+o.once] = 1;
    if (o.go){ var r = await o.go(MA.A); if (r === 'bye' || E.room !== r0 || E.screen !== 'game') return; }
    if (o.bye) return; } }

// ---------------------------------------------------------------- Kleine Helfer
function nsKey(k){ return (E.room ? E.room.id : '')+':'+k; }
function first(k){ var key = k[0] === '!' ? k.slice(1) : nsKey(k); if (MA.GS.seen[key]) return false; MA.GS.seen[key] = 1; return true; }
function cycle(k, arr){ var key = nsKey(k), i = MA.GS.cyc[key] || 0; MA.GS.cyc[key] = (i+1) % arr.length; return arr[i % arr.length]; }
function npc(id){ var a = function(){ return MA.ACT[id]; };
  return {
    get actor(){ return a(); }, get x(){ return a() ? a().x : 0; }, get y(){ return a() ? a().y : 0; },
    say: function(t, o){ return say(t, id, o); },
    walk: function(x, y, o){ return a() ? MA.walkActor(a(), x, y, o) : Promise.resolve(); },
    face: function(f){ if (a()) MA.faceActor(a(), f); return Promise.resolve(); },
    faceMe: function(){ var p = MA.ACT.m, b = a(); if (p && b) MA.faceActor(b, p.x < b.x ? 'L' : 'R'); return Promise.resolve(); },
    anim: function(n, h, hold){ return a() ? MA.playAnim(a(), n, h, hold) : Promise.resolve(); },
    show: function(){ if (a()) a().visible = true; }, hide: function(){ if (a()) a().visible = false; },
    place: function(x, y, f){ var b = a(); if (!b) return; b.x = x; b.y = y; if (f) b.f = f; b.path = []; MA.setIdle(b); },
    idle: function(n){ var b = a(); if (b){ b.idle = n || null; MA.setIdle(b); } },
    freeze: function(p){ var b = a(); if (b) b.frozen = p || null; },
    hold: function(it){ var b = a(); if (b) b.item = it || null; } }; }
function spawn(o){ var b = new MA.Actor(o); MA.ACT[o.id] = b; MA.setIdle(b); return npc(o.id); }

// ---------------------------------------------------------------- Die API für Szenen
var A = MA.A = {
  say: function(t, o){ return say(t, 'm', o); },
  line: function(who, t, o){ return say(t, who, o); },
  narrate: function(t, o){ return say(t, '#', o); },
  kids: function(t, o){ return say(t, 'kinder', o); },
  npc: npc, spawn: spawn, despawn: function(id){ delete MA.ACT[id]; },
  wait: wait, choose: choose, menu: menu,
  walk: function(x, y, o){ var p = MA.ACT.m; return p ? MA.walkActor(p, x, y, o) : Promise.resolve(); },
  face: function(f){ MA.faceActor(MA.ACT.m, f); return Promise.resolve(); },
  faceTo: function(id){ var p = MA.ACT.m, b = MA.ACT[id]; if (p && b) MA.faceActor(p, b.x < p.x ? 'L' : 'R'); return Promise.resolve(); },
  anim: function(n, h, hold){ var p = MA.ACT.m; return p ? MA.playAnim(p, n, h, hold) : Promise.resolve(); },
  place: function(x, y, f){ var p = MA.ACT.m; if (!p) return; p.x = x; p.y = y; if (f) p.f = f; p.path = []; MA.setIdle(p); E.syncPos(); },
  hold: function(it){ var p = MA.ACT.m; if (p) p.item = it || null; },
  goto: function(id, o){ return MA.gotoRoom(id, o); },
  has: MA.has, give: MA.give, take: MA.take, swap: MA.swap, flag: MA.flag, set: MA.set,
  note: function(id, st){ return MA.note(id, st); }, noteDone: MA.noteDone, noteOpen: MA.noteOpen,
  first: first, cycle: cycle, rebuild: function(){ MA.touch(); },
  puzzle: function(id, data){ return MA.UI.openPuzzle(id, data); },
  doc: function(d){ return MA.UI.openDoc(d); },
  card: function(c){ return MA.UI.showCard(typeof c === 'string' ? { text: c } : c); },
  fade: function(v, ms){ return MA.UI.fade(v, ms); },
  toast: function(t){ MA.UI.toast(t); },
  cam: function(x){ E.camLock = (x === null || x === undefined) ? null : Math.max(0, Math.min(E.room.width-MA.W, x)); },
  save: function(){ try { E.syncPos(); E.safeGS = JSON.parse(JSON.stringify(MA.GS)); } catch(e){} return MA.saveTo('auto'); },
  get S(){ return E.S; }, get G(){ return MA.GS; }, get room(){ return E.room; }, get me(){ return MA.ACT.m; }
};

// ---------------------------------------------------------------- Verben
MA.VLABEL = { look: 'Schau an', talk: 'Rede mit', take: 'Nimm', use: 'Benutze', open: 'Öffne', close: 'Schließe', push: 'Schiebe', pull: 'Ziehe', read: 'Lies', go: 'Geh hin' };
var VORDER = ['talk', 'take', 'use', 'open', 'close', 'push', 'pull', 'read', 'look'];
MA.verbsOf = function(h){ if (h.exit) return []; var v = VORDER.filter(function(k){ if (k === 'look') return true; var x = h[k]; return x !== undefined && x !== null && !(typeof x === 'function' && h[k+'If'] && !h[k+'If'](E.S, MA.GS)); }); return v; };
// Standardsätze in M.s Stimme
var DEF = {
  look: ['Nichts Besonderes.', 'Sieht aus wie vorhin. Nur dass ich jetzt hinschaue.', 'Da ist nichts, was mir hilft.'],
  take: ['Das bleibt, wo es ist.', 'Das brauche ich nicht. Glaube ich.', 'Das gehört mir nicht.'],
  use: ['Ich wüsste nicht, wie.', 'Damit fange ich nichts an.'],
  open: ['Das geht nicht auf.'], close: ['Da ist nichts zu schließen.'], push: ['Es bewegt sich nicht.', 'Ich schiebe. Es bleibt.'], pull: ['Es bewegt sich nicht.'],
  talk: ['Es antwortet nicht. Gut so.'], read: ['Da steht nichts.'],
  usewith: ['Das passt nicht zusammen.', 'So nicht.', 'Damit erreiche ich nichts.'],
  give: ['Das will hier niemand.', 'Dafür gibt mir niemand etwas.'],
  itemitem: ['Die beiden haben nichts miteinander zu tun.', 'Daraus wird nichts.'],
  self: ['Das brauche ich nicht an mir.', 'Ich bin schon vollständig. Fast.']
};
MA.DEF = DEF;
async function respond(val, ctx){ if (val === undefined || val === null) return false;
  if (typeof val === 'function'){ await val(A, ctx); return true; }
  if (Array.isArray(val)){ await say(cycle(ctx.key, val), 'm'); return true; }
  await say(String(val), 'm'); return true; }
MA.respond = respond;
async function approach(h){ var st = E.hsStand(h); if (!st) return true; var p = MA.ACT.m; if (!p) return true;
  var ok = await MA.walkActor(p, st[0], st[1]); if (!ok) return false;
  var f = st[2]; if (!f && h.npc){ var b = MA.ACT[h.npc]; if (b) f = b.x < p.x ? 'L' : 'R'; }
  if (h.npc){ var b2 = MA.ACT[h.npc]; if (b2) f = b2.x < p.x ? 'L' : 'R'; }
  MA.faceActor(p, f || p.f); return true; }
var tok = 0;
MA.cancelAction = function(){ tok++; };
// Verb auf eine Stelle anwenden (Laufen, dann Handlung)
MA.doVerb = async function(v, h){ if (E.busy || E.transit) return; var my = ++tok;
  if (h.exit){ return MA.takeExit(h); }
  if (v === 'go'){ var p = MA.ACT.m, st = E.hsStand(h); if (p && st) await MA.walkActor(p, st[0], st[1]); return; }
  var ok = await approach(h); if (!ok || my !== tok || E.busy) return;
  if (h.npc){ var b = MA.ACT[h.npc]; if (b && v === 'talk'){ var p2 = MA.ACT.m; if (p2) MA.faceActor(b, p2.x < b.x ? 'L' : 'R'); } }
  await scene(async function(){ var hv = h[v]; if (v === 'look' && hv === undefined) hv = h.desc;
    if (!(await respond(hv, { key: h.id+':'+v, hs: h }))) await say(cycle('def:'+v, DEF[v] || DEF.use), 'm'); });
};
// Ausgang nehmen: erst hingehen (Doppeltipp überspringt den Weg), dann ggf. Prüfung, dann Wechsel
MA.takeExit = async function(h, opt){ if (E.busy || E.transit) return; var ex = typeof h.exit === 'function' ? h.exit(E.S, MA.GS) : h.exit; if (!ex) return; var my = ++tok;
  var st = E.hsStand(h), p = MA.ACT.m;
  if (st && p && !(opt && opt.skip)){ E.exitWalk = { id: h.id, tok: my, st: st }; var ok = await MA.walkActor(p, st[0], st[1]); var sk = E.exitWalk && E.exitWalk.skipped; E.exitWalk = null; if ((!ok && !sk) || my !== tok) return; }
  if (ex.can){ var allowed = true; await scene(async function(){ allowed = await ex.can(A); }); if (!allowed) return; }
  if (my !== tok) return;
  E.transit = true; try { await MA.gotoRoom(ex.to, { from: ex.from || E.room.id, x: ex.x, y: ex.y, f: ex.f }); } finally { E.transit = false; } };
MA.skipExitWalk = function(id){ var w = E.exitWalk, p = MA.ACT.m; if (!w || w.id !== id || !p || p.mode !== 'walk') return false; w.skipped = true; p.path = []; p.x = w.st[0]; p.y = w.st[1]; if (w.st[2]) p.f = w.st[2]; var r = p.res; p.res = null; MA.setIdle(p); if (r) r(true); return true; };

// ---------------------------------------------------------------- Gegenstände
// target: {hs} Stelle/Person · {item} anderer Gegenstand · {self:true} M. selbst
MA.useItem = async function(id, target){ if (E.busy || E.transit) return; var it = MA.ITEMS[id]; if (!it) return; var my = ++tok; E.selected = null; if (MA.UI) MA.UI.refreshBar();
  if (target.hs){ var h = target.hs; if (h.exit){ await scene(async function(){ await say(cycle('def:usewith', DEF.usewith), 'm'); }); return; }
    var ok = await approach(h); if (!ok || my !== tok || E.busy) return;
    await scene(async function(){ var on = h.on || {}, hv = on[id]; if (hv === undefined && it.on) hv = it.on[h.id]; if (hv === undefined) hv = on['*'];
      if (typeof hv === 'function' && on[id] === undefined && it.on && it.on[h.id] === undefined && on['*'] !== undefined){ await hv(A, { item: id, hs: h }); return; }
      if (await respond(hv, { key: 'use:'+id+':'+h.id, hs: h, item: id })) return;
      if (h.npc){ var nm = E.hsName(h); await say(cycle('def:give', ['Ich glaube, '+nm+' will das nicht.', 'Das will '+nm+' nicht haben.', DEF.give[0]]), 'm'); return; }
      if (await respond(it.wrong, { key: 'wrong:'+id, item: id })) return;
      await say(cycle('def:usewith', DEF.usewith), 'm'); });
    return; }
  if (target.item){ var other = target.item; await scene(async function(){
      if (other === id){ await say('Das ist ein und dasselbe.', 'm'); return; }
      var hv = MA.COMBOS[id+'+'+other]; if (hv === undefined) hv = MA.COMBOS[other+'+'+id];
      if (!(await respond(hv, { key: 'combo:'+id+':'+other, item: id, other: other }))) await say(cycle('def:itemitem', DEF.itemitem), 'm'); });
    return; }
  if (target.self){ await scene(async function(){ if (!(await respond(it.self, { key: 'self:'+id, item: id }))) await say(cycle('def:self', DEF.self), 'm'); }); } };
// Verb direkt auf einen Gegenstand im Inventar (Schau an, Lies, Öffne, Benutze allein)
MA.itemVerb = async function(id, v){ if (E.busy) return; var it = MA.ITEMS[id]; if (!it) return;
  await scene(async function(){ var hv = it[v]; if (v === 'look' && hv === undefined) hv = 'Das ist '+MA.itemName(id)+'.'; if (!(await respond(hv, { key: 'inv:'+id+':'+v, item: id }))) await say(cycle('def:'+v, DEF[v] || DEF.use), 'm'); }); };
MA.itemVerbs = function(id){ var it = MA.ITEMS[id]; var v = ['look']; ['read', 'open', 'use'].forEach(function(k){ if (it[k] !== undefined) v.push(k); }); return v; };
})(MA);
