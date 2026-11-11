/* ===== M. Adventure – engine/life.js =====
   Eigenleben der Figuren. Läuft nur, wo kein Skript die Figur gerade führt:
   – Gewohnheiten: jede Figur spielt in zufälligen Abständen eigene kurze Einlagen (art/anims.js: fid…)
   – Aufmerksamkeit: Figuren mit seitlicher Haltung drehen sich zu M., wenn er nahe kommt, und später zurück
   – kleine Wege: einige gehen ein paar Schritte um ihren Platz (Jovan geht an der Absperrung auf und ab)
   – Gespräche: Kinder wenden sich einander zu und reden lautlos, die anderen nicken oder lachen
   – M.: wer ihn stehen lässt, sieht ihn sich umsehen, am Kopf kratzen, wippen, gähnen …
   Skripte haben Vorrang: Figuren, die eine Szene bewegt (A.npc(...).walk/face/anim/place …), der Gesprächspartner
   und alle Figuren während Zwischensequenzen werden nicht gestört. */
(function(MA){
'use strict';
var E = MA.E;
function rnd(a, b){ return a+Math.random()*(b-a); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// ---------------------------------------------------------------- Gewohnheiten je Figur (Schlüssel: Figur-id der Szene, sonst Zeichen-id)
var KIDS_FRONT = ['fidHopF', 'fidNodF', 'fidLaughF', 'chatF', 'fidRockF'];
MA.LIFE = {
  m:      { fid: ['fidLookS', 'fidScratchS', 'fidBehindS', 'fidHipsF', 'fidStretchF', 'fidYawnS', 'fidKickS', 'fidTapS', 'fidShiftS', 'fidSighS', 'fidLookDownS', 'fidRockF'], wait: [5500, 9500] },
  branko: { fid: ['clipWriteF', 'clipWriteF', 'clipLookF', 'clipNodF', 'fidWriteS', 'fidWriteS', 'fidLookS', 'fidNodS'], wait: [3500, 7500], watch: true },
  jasna:  { fid: ['fidLookS', 'fidCapS', 'fidPointS', 'fidShiftS', 'fidHipsF', 'fidNodS'], wait: [4000, 8000], watch: true, social: ['nedim', 'kidA', 'kidB', 'kidC'] },
  nedim:  { fid: ['fidLookDownS', 'fidTapS', 'fidScratchS', 'fidShiftS', 'fidSighS', 'fidCapS'], wait: [3500, 7000], watch: true, wander: 8, social: ['jasna'] },
  dragan: { fid: function(G){ return G.flags['ball.returned'] ? ['bounce', 'bounce', 'fidLookS', 'fidTapS', 'fidKickS'] : ['fidLookDownS', 'fidLookDownS', 'fidShadeS', 'fidTapS', 'fidSighS', 'fidKickS']; }, wait: [3000, 6500], watch: true, wander: 6 },
  kidA:   { fid: KIDS_FRONT, wait: [4000, 9000], social: ['kidB', 'kidC'], wander: 3 },
  kidB:   { fid: KIDS_FRONT, wait: [4000, 9000], social: ['kidA', 'kidC'], wander: 3 },
  kidC:   { fid: KIDS_FRONT, wait: [4000, 9000], social: ['kidA', 'kidB'], wander: 3 },
  lehrer: { fid: ['coatLookS', 'coatNodS', 'coatSighS', 'coatLookS'], wait: [4500, 9000], watch: true },
  mara:   { fid: ['fidArrangeS', 'fidArrangeS', 'fidWipeS', 'fidShadeS', 'fidHipsF', 'fidLookS'], wait: [3500, 7000], watch: true },
  dedo:   { fid: ['fidPolishS', 'fidPolishS', 'fidLookS', 'fidPointS', 'fidNodS', 'fidShiftS'], wait: [3000, 6500], watch: true },
  jovan:  { fid: ['fidWatchS', 'fidLookS', 'fidBehindS', 'fidShiftS'], wait: [4000, 8000], watch: true, pace: 14 },
  kleber: { fid: ['brush', 'brush', 'fidLookS', 'fidWipeS', 'fidScratchS'], wait: [3000, 6000] },
  helfer: { fid: ['fidCountS', 'fidCountS', 'fidScratchS', 'fidLookS', 'fidWipeS'], wait: [3500, 7000], watch: true }
};

// ---------------------------------------------------------------- Zustand
var lastInput = 0;   // letzte Eingabe des Spielers (für M.s Ungeduld)
MA.lifeInput = function(){ lastInput = E.gt; var me = MA.ACT.m; if (me && me.life && me.life.anim){ stopAnim(me); } };
function cfgOf(a){ return MA.LIFE[a.id] || MA.LIFE[a.ch] || null; }
function init(a){ var c = cfgOf(a); a.life = { cfg: c, next: E.gt+rnd(1500, (c && c.wait) ? c.wait[1] : 6000), homeX: a.x, homeY: a.y, homeF: a.f, anim: false, watching: false, back: 0, walk: false };
  var an = MA.animOf(a, a.idle || 'idleS'); a.life.view = an && an[0] && an[0][0] ? an[0][0].v : 'S'; a.life.item = an && an[0] && an[0][0] ? an[0][0].it || null : null; }
function busyFor(a){ if (a.frozen || a.hold || !a.visible) return true; if (E.screen !== 'game' || E.paused || E.transit) return true;
  if (E.busy && (a.scripted || a.player || E.cutscene)) return true;
  if (E.partner === a.id) return true;
  if (E.speech && E.speech.who === a.id) return true;
  return false; }
function stopAnim(a){ var L = a.life; if (!L) return; L.anim = false; if (a.mode === 'anim') MA.setIdle(a); if (L.saveItem !== undefined){ a.item = L.saveItem; L.saveItem = undefined; } if (L.saveF) { a.f = L.saveF; L.saveF = null; MA.setIdle(a); } }
function play(a, name){ var L = a.life, an = MA.animOf(a, name); if (!an) return;
  L.cancel = false; L.anim = true; if (!L.saveF) L.saveF = a.f; L.saveItem = a.item; if (L.item && !a.item) a.item = L.item;
  MA.playAnim(a, name).then(function(ok){ if (!a.life) return; L.anim = false; if (L.saveItem !== undefined){ a.item = L.saveItem; L.saveItem = undefined; }
    if (!ok || L.cancel){ L.cancel = false; L.saveF = null; return; } if (L.saveF){ a.f = L.saveF; L.saveF = null; } if (a.mode === 'idle') MA.setIdle(a); }); }

// ---------------------------------------------------------------- NPC: eine Einlage, ein Weg, ein Gespräch
function habit(a){ var L = a.life, c = L.cfg; if (!c || !c.fid) return;
  var src = typeof c.fid === 'function' ? c.fid(MA.GS) : c.fid;
  var list = src.filter(function(n){ var an = MA.animOf(a, n); if (!an) return false; var v = an[0] && an[0][0] ? an[0][0].v : (an[0] && an[0].v); return L.view === 'F' ? v === 'F' : true; });
  if (!list.length) return; play(a, pick(list)); }
function stroll(a){ var L = a.life, c = L.cfg, r = c.pace || c.wander; if (!r) return false;
  var tx = c.pace ? (Math.abs(a.x-(L.homeX-r)) < 3 ? L.homeX+r : L.homeX-r) : L.homeX+rnd(-r, r), ty = c.pace ? L.homeY : L.homeY+rnd(-r/3, r/3);
  if (!c.pace && Math.random() < 0.45){ tx = L.homeX; ty = L.homeY; }
  tx = Math.round(tx); ty = Math.round(ty); if (!MA.walkable(tx, ty)) return false;
  var sp = a.speed; a.speed = c.pace ? 120 : 140; L.walk = true; L.cancel = false;
  MA.walkActor(a, tx, ty, { free: true }).then(function(ok){ a.speed = sp; if (!a.life) return; L.walk = false; if (!ok || L.cancel){ L.cancel = false; return; }
    if (c.pace) a.f = tx > L.homeX ? 'L' : 'R'; else if (Math.abs(a.x-L.homeX) < 2) a.f = L.homeF; MA.setIdle(a); });
  return true; }
function chat(a){ var L = a.life, c = L.cfg; if (!c.social) return false;
  var ps = c.social.map(function(id){ return MA.ACT[id]; }).filter(function(b){ return b && b.life && !busyFor(b) && b.mode === 'idle' && Math.abs(b.x-a.x) < 60; });
  if (!ps.length) return false; var b = pick(ps);
  var talkName = L.view === 'F' ? 'chatF' : 'chatS', listen = b.life.view === 'F' ? pick(['fidNodF', 'fidLaughF']) : pick(['fidNodS', 'fidLaughS']);
  if (L.view !== 'F'){ L.saveF = a.f; a.f = b.x < a.x ? 'L' : 'R'; }
  if (b.life.view !== 'F'){ b.life.saveF = b.f; b.f = a.x < b.x ? 'L' : 'R'; }
  play(a, talkName); setTimeoutGame(function(){ if (b.life && !busyFor(b) && b.mode === 'idle') play(b, listen); }, 700);
  b.life.next = E.gt+rnd(2500, 5000); return true; }
var later = [];
function setTimeoutGame(fn, ms){ later.push({ t: E.gt+ms, fn: fn }); }

// ---------------------------------------------------------------- M.: Ungeduld, wenn man ihn stehen lässt
function playerTick(a){ var L = a.life, c = L.cfg; if (!c) return;
  if (E.busy || E.dlg || E.speech || (MA.UI && MA.UI.modal && MA.UI.modal()) || a.mode !== 'idle' || (MA.playerItem && MA.playerItem())) { L.next = Math.max(L.next, E.gt+2500); return; }
  if (E.gt-lastInput < 4000 || E.gt < L.next) return;
  var list = c.fid.filter(function(n){ return !!MA.animOf(a, n); }); if (!list.length) return;
  var n = pick(list);
  if (n === 'fidLookS' && a.f !== 'F' && a.f !== 'B' && Math.random() < 0.5){ a.f = a.f === 'L' ? 'R' : 'L'; MA.setIdle(a); L.next = E.gt+rnd(1800, 3000); return; }
  play(a, n); L.next = E.gt+rnd(c.wait[0], c.wait[1]); }

// ---------------------------------------------------------------- Takt
MA.lifeTick = function(dt){ if (E.screen !== 'game' || !E.room) return;
  for (var i = later.length-1; i >= 0; i--){ if (E.gt >= later[i].t){ var f = later[i].fn; later.splice(i, 1); try { f(); } catch(e){ console.error(e); } } }
  var me = MA.ACT.m;
  Object.keys(MA.ACT).forEach(function(k){ var a = MA.ACT[k]; if (!a.life) init(a); var L = a.life;
    if (E.speech && E.speech.who === a.id && L.anim) stopAnim(a);
    if (a.player){ playerTick(a); return; }
    if (!L.cfg) return;
    if (busyFor(a)){ if (L.anim && (E.partner === a.id || a.scripted)) stopAnim(a); L.next = Math.max(L.next, E.gt+1500); return; }
    // Aufmerksamkeit: zu M. drehen, wenn er nahe ist; später zur gewohnten Seite zurück
    if (L.cfg.watch && L.view !== 'F' && me && a.mode === 'idle' && !L.anim){ var near = Math.abs(me.x-a.x) < 42 && Math.abs(me.y-a.y) < 26;
      if (near){ var f = me.x < a.x ? 'L' : 'R'; if (a.f !== f){ a.f = f; MA.setIdle(a); } L.watching = true; L.back = E.gt+rnd(2000, 3500); }
      else if (L.watching && E.gt > L.back){ L.watching = false; if (a.f !== L.homeF && !L.cfg.pace){ a.f = L.homeF; MA.setIdle(a); } } }
    if (E.gt < L.next || a.mode !== 'idle' || L.anim) return;
    var c = L.cfg, roll = Math.random();
    if (c.social && roll < 0.22 && !L.watching){ if (chat(a)){ L.next = E.gt+rnd(c.wait[0]+1500, c.wait[1]+2500); return; } }
    if ((c.wander || c.pace) && roll < (c.pace ? 0.6 : 0.4) && !L.watching && !E.busy){ if (stroll(a)){ L.next = E.gt+rnd(c.wait[0], c.wait[1]); return; } }
    habit(a); L.next = E.gt+rnd(c.wait[0], c.wait[1]); });
};
// Szenenende: alle Skript-Markierungen lösen
MA.lifeSceneEnd = function(){ Object.keys(MA.ACT).forEach(function(k){ MA.ACT[k].scripted = false; }); E.partner = null; };
// Raumwechsel: neuer Zustand für alle
MA.lifeReset = function(){ later = []; lastInput = E.gt; };
})(MA);
