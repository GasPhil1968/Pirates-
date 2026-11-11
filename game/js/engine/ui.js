/* ===== M. Adventure – engine/ui.js =====
   Bedienoberfläche als HTML-Schicht über dem Pixelbild: Layout (Standard 320×200 oder Telefon quer mit Seitenleisten),
   Leiste mit Notizen/Karte/Zeigen/Menü, Inventar (6 Felder je Seite), Verben (am Zeiger mit Maus, in der Leiste mit dem Finger),
   Sprechkasten mit Porträt, Antwortliste, Hinweise. Alle Maße in Spielpixeln × u (CSS-Pixel je Spielpixel). */
(function(MA){
'use strict';
var E = MA.E, W = MA.W, SH = MA.SH;
var UI = MA.UI = {};
function $(id){ return document.getElementById(id); }
function el(tag, cls, html){ var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
UI.el = el;
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
UI.esc = esc;

// ---------------------------------------------------------------- Eingabeart
UI.touch = false;
try { UI.touch = (navigator.maxTouchPoints || 0) > 0 && matchMedia('(pointer: coarse)').matches; } catch(e){}
UI.setTouch = function(v){ v = !!v; if (UI.touch === v) return; UI.touch = v; document.body.classList.toggle('touch', v); UI.layout(); };

// ---------------------------------------------------------------- Layout
var L = UI.L = { mode: 'std', u: 2, x: 0, y: 0, w: 640, h: 400, rot: false };
UI.rotOk = false; try { UI.rotOk = localStorage.getItem(MA.KEY+'rotOk') === '1'; } catch(e){}
function devScale(v){ var d = window.devicePixelRatio || 1; var s = Math.floor(v*d)/d; return s >= 0.5 ? s : v; }
UI.layout = function(){
  var stage = $('stage'); if (!stage) return;
  var vw = window.innerWidth, vh = window.innerHeight;
  if (window.visualViewport){ vw = Math.round(window.visualViewport.width); vh = Math.round(window.visualViewport.height); }
  var portrait = UI.touch && vh > vw*1.05;
  L.rot = portrait && UI.rotOk; $('rotate').classList.toggle('on', portrait && !UI.rotOk);
  var lw = L.rot ? vh : vw, lh = L.rot ? vw : vh;
  var sb = safeBox(); var padL = L.rot ? 0 : sb.l, padR = L.rot ? 0 : sb.r, padT = L.rot ? 0 : sb.t, padB = L.rot ? 0 : sb.b;
  var aw = lw-padL-padR, ah = lh-padT-padB;
  var uStd = devScale(Math.min(aw/320, ah/200));
  var mode = 'std', u = uStd, rowH = 0, railW = 0;
  if (UI.touch){ rowH = 50; railW = 66; var uR = devScale(Math.min((aw-2*railW)/320, (ah-rowH)/144));
    if (uR > uStd*1.12){ mode = 'rails'; u = uR; } }
  L.mode = mode; L.u = u;
  var W0, H0;
  if (mode === 'std'){ W0 = 320*u; H0 = 200*u; }
  else { var sceneW = 320*u; railW = Math.max(railW, Math.min(140, Math.floor((aw-sceneW)/2))); W0 = sceneW+2*railW; H0 = 144*u+rowH; L.railW = railW; L.rowH = rowH; }
  L.w = W0; L.h = H0; L.x = Math.round(padL+(aw-W0)/2); L.y = Math.round(padT+(ah-H0)/2);
  stage.style.width = W0+'px'; stage.style.height = H0+'px';
  if (L.rot){ stage.style.left = '50%'; stage.style.top = '50%'; stage.style.transform = 'translate(-50%,-50%) rotate(90deg)'; }
  else { stage.style.left = L.x+'px'; stage.style.top = L.y+'px'; stage.style.transform = ''; }
  stage.className = 'm-'+mode+(UI.touch ? ' t' : ' p')+(MA.settings.bigText ? ' big' : '')+(MA.settings.readable ? ' readable' : '');
  stage.style.setProperty('--u', u+'px');
  if (mode === 'rails'){ var sw = 320*u, slot = Math.max(40, Math.min(60, Math.floor((sw-240-96)/6)));
    stage.style.setProperty('--rw', railW+'px'); stage.style.setProperty('--rh', rowH+'px'); stage.style.setProperty('--sw', sw+'px'); stage.style.setProperty('--sh', (144*u)+'px'); stage.style.setProperty('--slot', slot+'px'); }
  var sx = mode === 'std' ? 0 : railW;
  L.sx = sx; L.sy = 0;
  var sc = $('scene'); sc.style.left = sx+'px'; sc.style.top = '0px'; sc.style.width = (320*u)+'px'; sc.style.height = (144*u)+'px';
  ['marks', 'speech', 'fade', 'verbpop'].forEach(function(id){ var e = $(id); e.style.left = sx+'px'; e.style.top = '0px'; e.style.width = (320*u)+'px'; e.style.height = (144*u)+'px'; });
  var bar = $('bar'); bar.className = 'bar-'+mode;
  if (mode === 'std'){ bar.style.left = '0px'; bar.style.top = (144*u)+'px'; bar.style.width = W0+'px'; bar.style.height = (56*u)+'px'; }
  else { bar.style.left = '0px'; bar.style.top = '0px'; bar.style.width = W0+'px'; bar.style.height = H0+'px'; }
  UI.refreshBar(); if (UI.onLayout) UI.onLayout();
};
function safeBox(){ var p = $('safeprobe'); if (!p) return { l: 0, r: 0, t: 0, b: 0 }; var cs = getComputedStyle(p); return { l: parseFloat(cs.paddingLeft) || 0, r: parseFloat(cs.paddingRight) || 0, t: parseFloat(cs.paddingTop) || 0, b: parseFloat(cs.paddingBottom) || 0 }; }
// Bildschirmkoordinaten -> Spielpixel der Szene (berücksichtigt die Drehung im Hochformat)
UI.toScene = function(cx, cy){ var r = $('scene').getBoundingClientRect(), x, y;
  if (L.rot){ x = (cy-r.top)/r.height*320; y = (r.right-cx)/r.width*144; }
  else { x = (cx-r.left)/r.width*320; y = (cy-r.top)/r.height*144; }
  return [x, y]; };
UI.inScene = function(p){ return p[0] >= 0 && p[0] < 320 && p[1] >= 0 && p[1] < 144; };

// ---------------------------------------------------------------- Leiste
var invPage = 0;
UI.buildBar = function(){ var bar = $('bar'); bar.innerHTML = '';
  var bN = el('button', 'btn b-notes', 'Notizen'); bN.id = 'b-notes'; bN.onclick = function(){ UI.openJournal(); }; bar.appendChild(bN);
  var bK = el('button', 'btn b-map', 'Karte'); bK.id = 'b-map'; bK.onclick = function(){ UI.openMap(); }; bar.appendChild(bK);
  var bZ = el('button', 'btn b-show', 'Zeigen'); bZ.id = 'b-show'; bZ.onclick = function(){ UI.showAll(); }; bar.appendChild(bZ);
  var bM = el('button', 'btn b-menu', 'Menü'); bM.id = 'b-menu'; bM.onclick = function(){ UI.openPause(); }; bar.appendChild(bM);
  var me = el('button', 'self'); me.id = 'b-self'; me.title = 'M.'; var pc = el('canvas'); pc.width = 56; pc.height = 64; me.appendChild(pc); me.appendChild(el('span', 'nm', 'M.'));
  me.onclick = function(){ if (E.selected){ var id = E.selected; MA.useItem(id, { self: true }); } else UI.toast('Das bin ich. M., dreizehn, aus Rosko Polje.'); };
  bar.appendChild(me);
  var lab = el('div', 'label'); lab.id = 'label'; bar.appendChild(lab);
  var inv = el('div', 'inv'); inv.id = 'inv';
  var pl = el('button', 'arrow al', '◀'); pl.id = 'inv-prev'; pl.onclick = function(){ if (invPage > 0){ invPage--; UI.refreshBar(); } };
  var pr = el('button', 'arrow ar', '▶'); pr.id = 'inv-next'; pr.onclick = function(){ var pages = Math.max(1, Math.ceil(MA.GS.inv.length/6)); if (invPage < pages-1){ invPage++; UI.refreshBar(); } };
  inv.appendChild(pl); for (var i = 0; i < 6; i++){ var s = el('div', 'slot'); s.dataset.i = i; var c = el('canvas'); c.width = 32; c.height = 24; s.appendChild(c); inv.appendChild(s); bindSlot(s, i); } inv.appendChild(pr);
  bar.appendChild(inv);
  drawSelf(pc);
};
function drawSelf(c){ var b = MA.portrait ? MA.portrait('m', 'n') : null; if (b) UI.paintBuf(c, b); }
// Indizierten Puffer in ein Canvas malen
UI.paintBuf = function(c, b, x0, y0){ var g = c.getContext('2d'); if (c.width !== b.w || c.height !== b.h){ c.width = b.w; c.height = b.h; } var img = g.createImageData(b.w, b.h);
  for (var i = 0; i < b.d.length; i++){ var v = b.d[i], k = i*4; if (v === M.T){ img.data[k+3] = 0; continue; } var q = M.RGB[v] || [0, 0, 0]; img.data[k] = q[0]; img.data[k+1] = q[1]; img.data[k+2] = q[2]; img.data[k+3] = 255; }
  g.putImageData(img, 0, 0); };
UI.refreshBar = function(){ var inv = MA.GS.inv, pages = Math.max(1, Math.ceil(inv.length/6)); if (invPage > pages-1) invPage = pages-1;
  var slots = document.querySelectorAll('#inv .slot');
  for (var i = 0; i < slots.length; i++){ var s = slots[i], id = inv[invPage*6+i], c = s.querySelector('canvas'); s.dataset.item = id || '';
    s.classList.toggle('sel', !!id && E.selected === id); s.classList.toggle('new', !!id && MA.invNew === id); s.title = id ? MA.itemName(id) : '';
    var key = id ? id+'|'+(MA.ITEMS[id].iconKey ? MA.ITEMS[id].iconKey(MA.GS) : '') : ''; if (c.dataset.k !== key){ c.dataset.k = key; var g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height); if (id && MA.icon) UI.paintBuf(c, MA.icon(id)); } }
  var pv = $('inv-prev'), nx = $('inv-next'); if (pv){ pv.disabled = invPage <= 0; nx.disabled = invPage >= pages-1; }
  var nb = $('b-notes'); if (nb) nb.classList.toggle('dot', Object.keys(MA.GS.noteNew || {}).length > 0);
  UI.refreshLabel(); };
UI.onInventory = function(id, added){ if (added){ var i = MA.GS.inv.indexOf(id); if (i >= 0) invPage = Math.floor(i/6); setTimeout(function(){ if (MA.invNew === id){ MA.invNew = null; UI.refreshBar(); } }, 2200); } UI.refreshBar(); };
UI.onNote = function(id, st){ UI.refreshBar(); if (st === 'open') UI.toast('Notiz: '+noteText(id), 2600); };
function noteText(id){ var n = MA.NOTES[id]; return n ? (typeof n.t === 'function' ? n.t(MA.GS) : n.t) : id; }
UI.noteText = noteText;

// Beschriftung der Leiste: Name unter dem Zeiger, gewählter Gegenstand, oder (mit dem Finger) Verbknöpfe
var hoverName = '';
UI.setHover = function(name){ if (hoverName === name) return; hoverName = name || ''; UI.refreshLabel(); };
UI.refreshLabel = function(){ var lab = $('label'); if (!lab) return; if (touchVerbs){ return; }
  var t = '';
  if (E.selected){ t = 'Benutze '+MA.itemName(E.selected)+' mit '+(hoverName ? hoverName : '…'); }
  else t = hoverName;
  lab.innerHTML = t ? '<span class="lt">'+esc(t)+'</span>' : '';
  if (E.selected){ var x = el('button', 'btn bx', '✕'); x.onclick = function(){ E.selected = null; UI.refreshBar(); }; lab.appendChild(x); } };

// ---------------------------------------------------------------- Verben
var touchVerbs = null;   // {hs, verbs} solange die Leiste Verbknöpfe zeigt
UI.closeVerbs = function(){ var vp = $('verbpop'); vp.innerHTML = ''; vp.classList.remove('on'); touchVerbs = null; E.selectedHs = null; var lab = $('label'); if (lab) lab.classList.remove('big-v'); UI.refreshLabel(); };
UI.verbsOpen = function(){ return !!touchVerbs || $('verbpop').classList.contains('on'); };
UI.openVerbs = function(h, sx, sy){ var verbs = MA.verbsOf(h); var name = E.hsName(h);
  if (verbs.length === 1 && verbs[0] === 'look'){ UI.closeVerbs(); MA.doVerb('look', h); return; }
  E.selectedHs = h;
  if (UI.touch){ touchVerbs = { hs: h, verbs: verbs }; var lab = $('label'); lab.innerHTML = ''; lab.classList.add('big-v');
    lab.appendChild(el('span', 'lt nm', esc(name)));
    verbs.forEach(function(v){ var b = el('button', 'btn vb', esc(MA.VLABEL[v])); b.onclick = function(ev){ ev.stopPropagation(); UI.closeVerbs(); MA.doVerb(v, h); }; lab.appendChild(b); });
    var x = el('button', 'btn bx', '✕'); x.onclick = function(ev){ ev.stopPropagation(); UI.closeVerbs(); }; lab.appendChild(x);
    return; }
  var vp = $('verbpop'); vp.innerHTML = ''; var box = el('div', 'pop'); box.appendChild(el('div', 'ph', esc(name)));
  verbs.forEach(function(v){ var b = el('button', 'pv', esc(MA.VLABEL[v])); b.onclick = function(ev){ ev.stopPropagation(); UI.closeVerbs(); MA.doVerb(v, h); }; box.appendChild(b); });
  vp.appendChild(box); vp.classList.add('on');
  var u = L.u, bw = 86*u, bh = (12+verbs.length*12)*u, px = sx*u+6, py = sy*u-bh/2;
  if (px+bw > 320*u) px = sx*u-bw-6; if (py < 2*u) py = 2*u; if (py+bh > 142*u) py = 142*u-bh;
  box.style.left = px+'px'; box.style.top = py+'px'; };
// Gegenstand angetippt: Auswahl (Benutze … mit …) und kleines Menü mit Schau an / Lies / Öffne
UI.itemMenu = function(id, slot){ var verbs = MA.itemVerbs(id), vp = $('verbpop'); vp.innerHTML = '';
  var box = el('div', 'pop'); box.appendChild(el('div', 'ph', esc(MA.itemName(id))));
  verbs.forEach(function(v){ var b = el('button', 'pv', esc(v === 'use' ? 'Benutze' : MA.VLABEL[v])); b.onclick = function(ev){ ev.stopPropagation(); UI.closeVerbs(); if (v === 'use' && !MA.ITEMS[id].use){ E.selected = id; UI.refreshBar(); return; } if (v === 'use'){ E.selected = null; UI.refreshBar(); MA.itemVerb(id, 'use'); return; } E.selected = null; UI.refreshBar(); MA.itemVerb(id, v); }; box.appendChild(b); });
  vp.appendChild(box); vp.classList.add('on');
  var sr = slot.getBoundingClientRect(), vr = vp.getBoundingClientRect(), u = L.u;
  var px = (sr.left-vr.left), bh = (12+verbs.length*12)*u; var py = (sr.top-vr.top)-bh-2*u;
  if (L.rot){ px = 8*u; py = 60*u; }
  px = Math.max(2*u, Math.min(px, 320*u-90*u)); if (py < 2*u) py = 2*u;
  box.style.left = px+'px'; box.style.top = py+'px'; };
function bindSlot(s, i){ var down = null;
  s.addEventListener('pointerdown', function(ev){ ev.preventDefault(); var id = s.dataset.item; if (!id || E.busy || UI.modal()) return; down = { x: ev.clientX, y: ev.clientY, id: id, drag: false }; try { s.setPointerCapture(ev.pointerId); } catch(e){} });
  s.addEventListener('pointermove', function(ev){ if (!down) return; var dx = ev.clientX-down.x, dy = ev.clientY-down.y; if (!down.drag && Math.hypot(dx, dy) > 12){ down.drag = true; UI.dragStart(down.id); } if (down.drag) UI.dragMove(ev.clientX, ev.clientY); });
  s.addEventListener('pointerup', function(ev){ if (!down) return; var d = down; down = null; if (d.drag){ UI.dragEnd(ev.clientX, ev.clientY); return; }
    UI.setTouch(ev.pointerType !== 'mouse');
    var id = d.id; if (E.selected && E.selected !== id){ var a = E.selected; MA.useItem(a, { item: id }); return; }
    if (E.selected === id){ E.selected = null; UI.closeVerbs(); UI.refreshBar(); return; }
    E.selected = id; UI.refreshBar(); UI.itemMenu(id, s); });
  s.addEventListener('pointercancel', function(){ if (down && down.drag) UI.dragCancel(); down = null; }); }
// Ziehen eines Gegenstands auf ein Ziel
var ghost = null, dragId = null;
UI.dragStart = function(id){ dragId = id; UI.closeVerbs(); ghost = el('canvas', 'ghost'); UI.paintBuf(ghost, MA.icon(id)); document.body.appendChild(ghost); };
UI.dragMove = function(cx, cy){ if (!ghost) return; ghost.style.left = (cx-24)+'px'; ghost.style.top = (cy-36)+'px'; var p = UI.toScene(cx, cy); var h = UI.inScene(p) ? E.hotspotAt(p[0]+E.camX, p[1]) : null; UI.setHover(h ? E.hsName(h) : ''); };
UI.dragEnd = function(cx, cy){ var id = dragId; UI.dragCancel(); if (!id) return; var tgt = document.elementFromPoint(cx, cy);
  var slot = tgt && tgt.closest ? tgt.closest('.slot') : null; if (slot && slot.dataset.item && slot.dataset.item !== id){ MA.useItem(id, { item: slot.dataset.item }); return; }
  if (tgt && tgt.closest && tgt.closest('#b-self')){ MA.useItem(id, { self: true }); return; }
  var p = UI.toScene(cx, cy); if (!UI.inScene(p)) return; var h = E.hotspotAt(p[0]+E.camX, p[1]); if (!h){ var near = E.hotspotsNear(p[0]+E.camX, p[1], 6); if (near.length) h = near[0].hs; }
  if (h) MA.useItem(id, { hs: h }); };
UI.dragCancel = function(){ if (ghost){ ghost.remove(); ghost = null; } dragId = null; UI.setHover(''); };

// ---------------------------------------------------------------- Sprechen
function castOf(who){ return MA.CAST[who] || { name: who, color: '#f5efe0' }; }
UI.showSpeech = function(sp){ var box = $('speech'); box.innerHTML = ''; box.className = 'on';
  var who = sp.who, c = castOf(who), u = L.u;
  if (who === '#'){ var n = el('div', 'narr', esc(sp.text)); box.appendChild(n); box.classList.add('nar'); return; }
  var right = false; var a = MA.ACT[who], me = MA.ACT.m;
  if (who === 'm') right = true; else if (a && me) right = a.x > me.x;
  var wrap = el('div', 'sp'+(right ? ' r' : ''));
  if (c.portrait !== false && MA.portrait){ var pc = el('canvas', 'pt'); pc.width = 56; pc.height = 64; wrap.appendChild(pc); sp.pc = pc; sp.flip = right; UI.paintPortrait(sp, 'o'); }
  var tb = el('div', 'tb'); tb.style.color = c.color || '#f5efe0'; if (c.name && who !== 'm') tb.appendChild(el('div', 'who', esc(c.name)));
  tb.appendChild(el('div', 'tx', esc(sp.text))); if (MA.settings.tapText) tb.appendChild(el('div', 'more', '▼')); wrap.appendChild(tb); box.appendChild(wrap); };
UI.paintPortrait = function(sp, variant){ if (!sp || !sp.pc) return; var c = castOf(sp.who), b = MA.portrait(c.portrait || sp.who, variant); if (!b) return; UI.paintBuf(sp.pc, b); sp.pc.style.transform = sp.flip ? 'scaleX(-1)' : ''; sp.variant = variant; };
UI.hideSpeech = function(){ var box = $('speech'); box.className = ''; box.innerHTML = ''; };
UI.clearSpeech = function(){ if (E.speech) E.endSpeech(true); UI.hideSpeech(); };
// Mund auf/zu, Lidschlag (im Takt der Schleife)
UI.tickSpeech = function(){ var sp = E.speech; if (!sp || !sp.pc) return; var talking = E.gt-sp.at < Math.min(5000, sp.text.length*55+300), v = talking ? ((Math.floor(E.gt/150) % 2) ? 'o' : 'n') : ((Math.floor(E.gt/2600) % 9 === 0 && (E.gt % 2600) < 140) ? 'b' : 'n'); if (v !== sp.variant) UI.paintPortrait(sp, v); };

// ---------------------------------------------------------------- Auswahl
var dlgFocus = -1;
UI.showChoices = function(d){ var box = $('choices'); box.innerHTML = ''; box.className = 'on'; dlgFocus = -1;
  if (d.title) box.appendChild(el('div', 'ct', esc(d.title)));
  var list = el('div', 'cl'); d.opts.forEach(function(o, i){ var asked = !o.bye && !o.noGray && MA.GS.seen['ask:'+o.t];
    var b = el('button', 'co'+(asked ? ' asked' : '')+(o.bye ? ' bye' : ''), '<span class="n">'+(i < 9 ? (i+1) : '·')+'</span><span class="t">'+esc(o.t)+'</span>'); b.onclick = function(){ E.chooseDone(i); }; list.appendChild(b); });
  box.appendChild(list); positionChoices(); };
function positionChoices(){ var box = $('choices'); if (!box.classList.contains('on')) return; var u = L.u;
  if (L.mode === 'std'){ box.style.left = '0px'; box.style.width = (320*u)+'px'; box.style.bottom = '0px'; box.style.top = ''; box.style.maxHeight = (100*u)+'px'; box.style.minHeight = (56*u)+'px'; }
  else { box.style.left = L.sx+'px'; box.style.width = (320*u)+'px'; box.style.bottom = '0px'; box.style.top = ''; box.style.maxHeight = Math.round(L.h*0.66)+'px'; box.style.minHeight = L.rowH+'px'; } }
UI.hideChoices = function(){ var box = $('choices'); box.className = ''; box.innerHTML = ''; };
UI.choiceKey = function(k){ var d = E.dlg; if (!d) return false; var n = parseInt(k, 10); if (n >= 1 && n <= 9 && n <= d.opts.length){ E.chooseDone(n-1); return true; }
  var bs = document.querySelectorAll('#choices .co');
  if (k === 'ArrowDown' || k === 'ArrowUp'){ dlgFocus = (dlgFocus+(k === 'ArrowDown' ? 1 : -1)+bs.length) % bs.length; bs[dlgFocus].focus(); return true; }
  if ((k === 'Enter' || k === ' ') && dlgFocus >= 0){ E.chooseDone(dlgFocus); return true; } return false; };

// ---------------------------------------------------------------- Hinweise, Abblende
var toastT = 0;
UI.toast = function(t, ms){ var e = $('toast'); e.textContent = t; e.className = 'on'; clearTimeout(toastT); toastT = setTimeout(function(){ e.className = ''; }, ms || 2400); };
UI.fade = function(v, ms){ var f = $('fade'); ms = MA.settings.reduceMotion ? 60 : (ms || 300); if (E.ff) ms = 40; f.style.transition = 'opacity '+ms+'ms linear'; f.style.opacity = v ? '1' : '0'; return new Promise(function(r){ setTimeout(r, ms+20); }); };
UI.onBusy = function(v){ document.body.classList.toggle('busy', v); if (v) UI.closeVerbs(); };

// ---------------------------------------------------------------- Zeigen: alle Stellen kurz markieren
var showUntil = 0;
UI.showAll = function(){ if (E.screen !== 'game' || UI.modal()) return; showUntil = Date.now()+2600; UI.renderMarks(); setTimeout(UI.renderMarks, 2700); };
UI.renderMarks = function(){ var m = $('marks'); m.innerHTML = ''; if (Date.now() > showUntil || !E.room) return; var u = L.u;
  E.hotspots().forEach(function(h){ var R = E.hsRect(h), cx = R[0]+R[2]/2-E.camX, cy = R[1]+R[3]/2; if (cx < -4 || cx > 324) return;
    var cls = h.exit ? 'mk ex' : (h.npc ? 'mk np' : 'mk ob'); var d = el('div', cls); d.style.left = (cx*u)+'px'; d.style.top = (cy*u)+'px';
    if (h.exit || h.npc) d.appendChild(el('span', '', esc(E.hsName(h)))); m.appendChild(d); }); };
UI.drawSceneMarks = function(fb, view){ var h = E.selectedHs; if (!h || !UI.touch || !touchVerbs) return; var R = E.hsRect(h); if (!R) return; var x0 = Math.round(R[0]-view.cam), y0 = R[1], x1 = x0+R[2]-1, y1 = Math.min(MA.SH-1, y0+R[3]-1), c = M.P.s6;
  fb.hl(Math.max(0, x0), Math.min(319, x1), y0, c); fb.hl(Math.max(0, x0), Math.min(319, x1), y1, c); if (x0 >= 0) fb.vl(x0, y0, y1, c); if (x1 < 320) fb.vl(x1, y0, y1, c); };

// ---------------------------------------------------------------- Modale Ebenen (Notizen, Karte, Menüs, Rätsel …)
var stack = [];
UI.modal = function(){ return stack.length > 0; };
UI.topModal = function(){ return stack[stack.length-1] || null; };
UI.pushModal = function(node, o){ o = o || {}; var ov = $('overlay'); var wrap = el('div', 'modal '+(o.cls || '')); wrap.appendChild(node); ov.appendChild(wrap); ov.classList.add('on'); var m = { node: wrap, onClose: o.onClose, esc: o.esc !== false, kind: o.kind || '' }; stack.push(m); E.paused = true; return m; };
UI.popModal = function(m, v){ m = m || UI.topModal(); if (!m) return; var i = stack.indexOf(m); if (i < 0) return; stack.splice(i, 1); m.node.remove(); if (!stack.length){ $('overlay').classList.remove('on'); E.paused = false; } if (m.onClose) m.onClose(v); };
UI.closeTop = function(){ var m = UI.topModal(); if (m && m.esc){ UI.popModal(m, null); return true; } return false; };
UI.closeAllModals = function(){ while (stack.length) UI.popModal(stack[stack.length-1], null); };
})(MA);
