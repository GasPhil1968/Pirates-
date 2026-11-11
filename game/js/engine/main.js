/* ===== M. Adventure – engine/main.js =====
   Eingabe (Zeiger, Touch-Fangradius, Doppeltipp auf Ausgänge, Rechtsklick, Tastatur), Spielschleife, Start, Laden, Reisen. */
(function(MA){
'use strict';
var E = MA.E, UI = MA.UI;
function $(id){ return document.getElementById(id); }

// ---------------------------------------------------------------- Neues Spiel, Laden, Reisen
MA.newGame = function(){ MA.GS = MA.fresh(); MA.clearTimers(); E.speech = null; E.dlg = null; E.busy = false; E.safeGS = null; E.selected = null; E.camLock = null; E.gt = 0;
  UI.hideChoices(); UI.hideSpeech(); UI.closeVerbs(); if (MA.startChapter) MA.startChapter(MA.A); UI.refreshBar(); };
MA.loadEnv = function(env){ var G = MA.validate(env.GS || {}); if (!G) return false; var prev = MA.GS;
  try { MA.GS = G; MA.clearTimers(); E.speech = null; E.dlg = null; E.busy = false; E.safeGS = null; E.selected = null; E.camLock = null; E.transit = false;
    UI.hideChoices(); UI.hideSpeech(); UI.closeVerbs(); MA.loadRoom(G.room); E.screen = 'game'; $('fade').style.opacity = '0';
    if (MA.onLoaded) MA.onLoaded(G); UI.refreshBar(); return true; }
  catch(e){ console.error(e); MA.GS = prev; return false; } };
MA.travel = async function(loc){ if (E.busy || E.transit) return; E.transit = true; try { await MA.gotoRoom(loc.room, { from: 'map', x: loc.entry ? loc.entry[0] : undefined, y: loc.entry ? loc.entry[1] : undefined, f: loc.entry ? loc.entry[2] : undefined }); } finally { E.transit = false; } };

// ---------------------------------------------------------------- Eingabe in der Szene
var lastTap = { t: 0, id: null }, downAt = null;
function onUIElement(t){ return !!(t && t.closest && t.closest('#bar button, #bar .slot, #choices, #verbpop .pop, #overlay, #rotate, #speech .more')); }
function sceneTap(cx, cy, touch){
  if (UI.modal()) return;
  if (E.speech){ E.endSpeech(); return; }
  if (E.busy || E.dlg || E.transit || E.screen !== 'game') return;
  if (UI.verbsOpen() && !E.selected){ UI.closeVerbs(); return; }
  if (UI.verbsOpen()) UI.closeVerbs();
  var p = UI.toScene(cx, cy); if (!UI.inScene(p)) return; var wx = p[0]+E.camX, wy = p[1];
  var h = E.hotspotAt(wx, wy);
  if (!h && touch){ var near = E.hotspotsNear(wx, wy, 7); if (near.length) h = near[0].hs; }
  if (E.selected){ if (h){ var id = E.selected; MA.useItem(id, { hs: h }); } else { E.selected = null; UI.refreshBar(); } return; }
  if (h){ if (h.exit){ var now = Date.now(); if (lastTap.id === h.id && now-lastTap.t < 450 && MA.skipExitWalk(h.id)){ lastTap.t = 0; return; } lastTap = { t: now, id: h.id }; MA.takeExit(h); return; }
    UI.openVerbs(h, p[0], p[1]); return; }
  MA.cancelAction(); var me = MA.ACT.m; if (me && !E.room.noActor) MA.walkActor(me, wx, wy);
}
function sceneHover(cx, cy){ if (UI.touch || UI.modal() || E.screen !== 'game') return; var p = UI.toScene(cx, cy); if (!UI.inScene(p)){ UI.setHover(''); return; } var h = E.busy ? null : E.hotspotAt(p[0]+E.camX, p[1]); UI.setHover(h ? E.hsName(h) : ''); E.hoverHs = h; var sc = $('scene'); sc.style.cursor = h ? (h.exit ? 'e-resize' : 'pointer') : 'default'; }
function bindInput(){ var stage = $('stage');
  // Mobile Browser verschieben einen Fingertipp zum nächsten „anklickbaren“ Element (Touch Adjustment). Ohne eigenen Klick-Hörer zählt
  // die Szene nicht dazu, und ein Tipp knapp über der Leiste landet auf „Notizen“ oder einem Inventarfeld. Der leere Hörer verhindert das.
  $('scene').addEventListener('click', function(){});
  stage.addEventListener('pointerdown', function(){ if (MA.lifeInput) MA.lifeInput(); }, true);
  document.addEventListener('keydown', function(){ if (MA.lifeInput) MA.lifeInput(); }, true);
  stage.addEventListener('pointerdown', function(ev){ if (onUIElement(ev.target)) return; if (ev.button > 0) return; UI.setTouch(ev.pointerType !== 'mouse'); downAt = { x: ev.clientX, y: ev.clientY, t: Date.now() }; });
  stage.addEventListener('pointerup', function(ev){ if (onUIElement(ev.target) || !downAt) return; if (ev.button > 0) return; var d = downAt; downAt = null; if (Math.hypot(ev.clientX-d.x, ev.clientY-d.y) > 24) return; sceneTap(ev.clientX, ev.clientY, ev.pointerType !== 'mouse'); });
  stage.addEventListener('pointermove', function(ev){ if (ev.pointerType === 'mouse') sceneHover(ev.clientX, ev.clientY); });
  stage.addEventListener('contextmenu', function(ev){ ev.preventDefault(); if (UI.modal() || E.screen !== 'game') return; if (E.speech){ E.endSpeech(); return; } if (E.busy || E.dlg) return; if (E.selected){ E.selected = null; UI.refreshBar(); return; } var p = UI.toScene(ev.clientX, ev.clientY); if (!UI.inScene(p)) return; var h = E.hotspotAt(p[0]+E.camX, p[1]); if (h && !h.exit){ UI.closeVerbs(); MA.doVerb('look', h); } });
  document.addEventListener('keydown', function(ev){ var k = ev.key;
    if ($('rotate').classList.contains('on')) return;
    if (ev.target && ev.target.closest && ev.target.closest('input,textarea')) return;
    if (k === 'Escape'){ ev.preventDefault(); if (E.selected){ E.selected = null; UI.refreshBar(); return; } if (UI.verbsOpen()){ UI.closeVerbs(); return; } if (UI.modal()){ UI.closeTop(); return; } if (E.screen === 'game' && !E.dlg) UI.openPause(); return; }
    var top = UI.topModal();
    if (top && top.kind === 'card' && (k === ' ' || k === 'Enter')){ ev.preventDefault(); UI.popModal(top); return; }
    if (UI.modal()) return;
    if (E.dlg){ if (UI.choiceKey(k)) ev.preventDefault(); return; }
    if (k === ' ' || k === 'Enter'){ ev.preventDefault(); if (E.speech) E.endSpeech(); return; }
    if (E.busy) return;
    if (k === 'n' || k === 'N') UI.openJournal(); else if (k === 'k' || k === 'K') UI.openMap(); else if (k === 'z' || k === 'Z') UI.showAll();
    else if (k === 'i' || k === 'I'){ var nx = $('inv-next'), pv = $('inv-prev'); if (nx && !nx.disabled) nx.click(); else if (pv) while (!pv.disabled) pv.click(); } });
}

// ---------------------------------------------------------------- Schleife
var ctx, img, last = 0;
function frame(now){ var dt = Math.min(100, now-(last || now)); last = now;
  try { E.update(dt); E.speechTick(); UI.tickSpeech();
    if (E.screen === 'game'){ var fb = MA.renderScene(), d = fb.d, px = img.data; for (var i = 0, k = 0; i < d.length; i++, k += 4){ var q = M.RGB[d[i]] || M.RGB[0]; px[k] = q[0]; px[k+1] = q[1]; px[k+2] = q[2]; px[k+3] = 255; } ctx.putImageData(img, 0, 0); if (Date.now() < (UI.marksUntil || 0)) UI.renderMarks(); }
  } catch(e){ console.error(e); }
  requestAnimationFrame(frame); }

// ---------------------------------------------------------------- Start
MA.boot = function(){
  var sc = $('scene'); ctx = sc.getContext('2d', { alpha: false }); img = ctx.createImageData(320, 144); ctx.imageSmoothingEnabled = false;
  document.body.classList.toggle('touch', UI.touch);
  UI.buildBar(); UI.layout(); bindInput();
  window.addEventListener('resize', function(){ UI.layout(); }); window.addEventListener('orientationchange', function(){ setTimeout(UI.layout, 250); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', function(){ UI.layout(); });
  $('rot-ok').onclick = function(){ UI.rotOk = true; try { localStorage.setItem(MA.KEY+'rotOk', '1'); } catch(e){} UI.layout(); };
  document.addEventListener('visibilitychange', function(){ if (document.hidden && E.screen === 'game') MA.saveTo('auto'); });
  window.addEventListener('pagehide', function(){ if (E.screen === 'game') MA.saveTo('auto'); });
  // Als Artefakt auf claude.ai: Aktualisierungen der Seite übernehmen ein laufendes Spiel (window.claude.hot), sonst Titelbild
  var hot = window.claude && window.claude.hot;
  if (hot && typeof hot.snapshot === 'function') hot.snapshot(function(){ if (E.screen !== 'game' || !MA.GS || !MA.GS.room || MA.GS.ended) return {}; if (E.syncPos && !E.busy) E.syncPos(); return { env: { v: 1, GS: (E.busy && E.safeGS) ? E.safeGS : MA.GS } }; });
  var start = function(data){ if (data && data.env && data.env.GS && MA.loadEnv(data.env)){ UI.toast('Weitergespielt nach der Aktualisierung.'); return; } UI.openTitle(); };
  if (hot && typeof hot.ready === 'function') hot.ready(start); else start((hot && hot.data) || {});
  requestAnimationFrame(frame);
  if (!window.MADV_ARTIFACT) registerOffline();
};
// Offline-Fassung (wie in MALA): Service Worker nur über http(s) und nicht auf dem Entwicklungsrechner. Meldet „Offline bereit“,
// sobald alle Dateien im Cache liegen; eine neue Fassung wird auf dem Titelbild neu geladen (Spielstände bleiben, sie liegen in localStorage).
function registerOffline(){
  if (!('serviceWorker' in navigator) || !/^https?:/.test(location.protocol) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  var sw = navigator.serviceWorker, hadCtrl = !!sw.controller;
  sw.addEventListener('message', function(e){ if (e.data === 'offline-ready'){ MA.offlineReady = true; if (UI.refreshTitleFoot) UI.refreshTitleFoot(); } });
  sw.addEventListener('controllerchange', function(){ if (!hadCtrl){ hadCtrl = true; return; } MA.updatePending = true; var t = UI.topModal(); if (E.screen === 'title' && t && t.kind === 'title') location.reload(); });
  sw.register('sw.js').then(function(){ if (sw.controller) sw.controller.postMessage('check'); }).catch(function(){});
}
// Testzugang (nur lesend): Bildschirmlage von Stellen, Figuren und Gegenständen – damit automatische Durchläufe echt klicken können
window.MADV = {
  sceneRect: function(){ var r = $('scene').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; },
  hsScreen: function(id){ var h = E.room && E.room.byId[id]; if (!h || !E.hsVisible(h)) return null; var R = E.hsRect(h), r = $('scene').getBoundingClientRect(), s = r.width/320; var cx = R[0]+R[2]/2-E.camX, cy = R[1]+R[3]/2; if (h.tp){ cx = h.tp[0]-E.camX; cy = h.tp[1]; } return { x: r.left+cx*s, y: r.top+cy*s, inView: cx >= 0 && cx < 320 }; },
  floorScreen: function(wx, wy){ var r = $('scene').getBoundingClientRect(), s = r.width/320; return { x: r.left+(wx-E.camX)*s, y: r.top+wy*s }; },
  state: function(){ return { screen: E.screen, room: E.room && E.room.id, busy: E.busy || !!E.transit, speech: E.speech && E.speech.text, who: E.speech && E.speech.who, dlg: E.dlg && E.dlg.opts.map(function(o){ return o.t; }), inv: MA.GS.inv.slice(), sel: E.selected, modal: UI.topModal() && UI.topModal().kind, camX: E.camX, me: MA.ACT.m ? [Math.round(MA.ACT.m.x), Math.round(MA.ACT.m.y)] : null, walking: !!(MA.ACT.m && MA.ACT.m.mode === 'walk'), verbs: UI.verbsOpen(), ended: MA.GS.ended }; },
  flags: function(){ return JSON.parse(JSON.stringify(MA.GS.flags)); },
  notes: function(){ return JSON.parse(JSON.stringify(MA.GS.notes)); },
  log: function(on){ if (on) MA.__log = []; return MA.__log ? MA.__log.slice() : []; }
};
})(MA);
