/* ===== M. Adventure – engine/ui_panels.js =====
   Titelbild, Pause, Speichern/Laden, Einstellungen, Steuerung, Über das Spiel, Notizen, Stadtplan, Dokumente, Karten (Erzähltext),
   Rätsel-Ebene und Kapitelabschluss. Alles als modale Ebenen über der Bühne (UI.pushModal). */
(function(MA){
'use strict';
var UI = MA.UI, E = MA.E, el = UI.el, esc = UI.esc;
function $(id){ return document.getElementById(id); }
function btn(t, fn, cls){ var b = el('button', 'row'+(cls ? ' '+cls : ''), t); b.onclick = function(ev){ ev.stopPropagation(); fn(ev); }; return b; }
function panel(title, sub){ var p = el('div', 'panel'); if (title) p.appendChild(el('h2', '', esc(title))); if (sub) p.appendChild(el('div', 'sub', sub)); return p; }
UI.panel = panel; UI.btn = btn;
// Bestätigung
UI.confirm = function(text, yes, no){ return new Promise(function(res){ var p = panel(null); p.appendChild(el('p', 'q', esc(text))); var m;
  p.appendChild(btn(yes || 'Ja', function(){ UI.popModal(m, true); })); p.appendChild(btn(no || 'Nein', function(){ UI.popModal(m, false); }, 'back'));
  m = UI.pushModal(p, { cls: 'small', kind: 'confirm', onClose: function(v){ res(!!v); } }); }); };

// ---------------------------------------------------------------- Titelbild
UI.openTitle = function(){ UI.closeAllModals(); E.screen = 'title'; MA.clearTimers(); MA.UI.hideChoices(); MA.UI.hideSpeech();
  var wrap = el('div', 'title'); var bgc = el('canvas', 'tbg'); bgc.width = 320; bgc.height = 200; wrap.appendChild(bgc); if (MA.paintTitle) UI.paintBuf(bgc, MA.paintTitle());
  var head = el('div', 'thead'); head.appendChild(el('div', 'tt', 'M. Adventure')); head.appendChild(el('div', 'ts', 'Mostar 1955 · Der Genosse kommt!')); wrap.appendChild(head);
  var menu = el('div', 'tmenu');
  var last = MA.latestSave();
  if (last){ var b0 = btn('Fortsetzen', function(){ UI.continueFrom(last.slot); }, 'hi'); b0.appendChild(el('span', 'note', esc(last.meta.roomName+' · '+MA.fmtTime(last.meta.playMs)))); menu.appendChild(b0); }
  menu.appendChild(btn('Neues Spiel', async function(){ if (MA.readSave('auto') && !(await UI.confirm('Ein neues Spiel beginnen? Der automatische Stand wird beim nächsten Ortswechsel überschrieben. Gespeicherte Plätze bleiben erhalten.', 'Neu beginnen', 'Zurück'))) return; UI.closeAllModals(); MA.newGame(); }, last ? '' : 'hi'));
  menu.appendChild(btn('Spiel laden', function(){ UI.openSaves('load'); }));
  menu.appendChild(btn('Einstellungen', function(){ UI.openSettings(); }));
  menu.appendChild(btn('Steuerung', function(){ UI.openControls(); }));
  menu.appendChild(btn('Über das Spiel', function(){ UI.openAbout(); }));
  wrap.appendChild(menu);
  var done = MA.doneInfo(); var foot = el('div', 'tfoot', esc('Fassung '+MA.BUILD+(done ? ' · Kapitel Mostar abgeschlossen ✓' : ''))); wrap.appendChild(foot);
  UI.pushModal(wrap, { cls: 'full', esc: false, kind: 'title' });
};
UI.continueFrom = function(slot){ var r = MA.readSave(slot); if (!r || r.damaged){ UI.toast('Dieser Stand lässt sich nicht laden.'); return; }
  if (!MA.loadEnv(r.env)){ UI.toast('Dieser Stand lässt sich nicht laden.'); return; }
  UI.closeAllModals(); UI.showRecap(r.meta); };
// "Zuletzt": kurz zeigen, wo man war und was offen ist (keine Lösung)
UI.showRecap = function(meta){ var p = panel('Zuletzt'); p.appendChild(el('p', '', esc(meta.roomName+' · Spielzeit '+MA.fmtTime(meta.playMs))));
  if (meta.open && meta.open.length){ var ul = el('ul', 'recap'); meta.open.forEach(function(t){ ul.appendChild(el('li', '', esc(t))); }); p.appendChild(ul); }
  var m; p.appendChild(btn('Weiter', function(){ UI.popModal(m); }, 'hi')); m = UI.pushModal(p, { cls: 'small', kind: 'recap' }); setTimeout(function(){ if (UI.topModal() === m) UI.popModal(m); }, 9000); };

// ---------------------------------------------------------------- Pause
UI.openPause = function(){ if (E.screen !== 'game' || UI.modal()) return; UI.closeVerbs(); var p = panel('Pause', esc(MA.roomName(MA.GS.room)+' · Spielzeit '+MA.fmtTime(MA.GS.playMs))); var m;
  p.appendChild(btn('Weiterspielen', function(){ UI.popModal(m); }, 'hi'));
  p.appendChild(btn('Speichern', function(){ UI.openSaves('save'); }));
  p.appendChild(btn('Laden', function(){ UI.openSaves('load'); }));
  p.appendChild(btn('Notizen', function(){ UI.popModal(m); UI.openJournal(); }));
  p.appendChild(btn('Einstellungen', function(){ UI.openSettings(); }));
  p.appendChild(btn('Steuerung', function(){ UI.openControls(); }));
  var t = btn('Zum Titelbild', function(){ var ok = MA.saveTo('auto'); UI.toast(ok ? 'Automatisch gespeichert.' : 'Nicht gespeichert.'); UI.closeAllModals(); UI.openTitle(); }); t.appendChild(el('span', 'note', 'speichert automatisch')); p.appendChild(t);
  m = UI.pushModal(p, { kind: 'pause' }); };

// ---------------------------------------------------------------- Speichern / Laden
UI.openSaves = function(mode){ var p = panel(mode === 'save' ? 'Speichern' : 'Laden'); var m, list = el('div', 'saves');
  var busy = E.busy || E.dlg || E.speech;
  if (mode === 'save' && busy) p.appendChild(el('p', 'warn', 'Gespeichert wird der Stand vom Beginn der laufenden Szene.'));
  function render(){ list.innerHTML = ''; var slots = (mode === 'load' ? ['auto'] : []).concat([1, 2, 3, 4, 5].map(function(i){ return 'slot'+i; }));
    slots.forEach(function(s){ var r = MA.readSave(s), row = el('div', 'save'), lab = s === 'auto' ? 'Automatisch' : ('Platz '+s.slice(4));
      var th = el('div', 'th'); if (r && r.thumb){ var im = el('img'); im.src = r.thumb; im.alt = ''; th.appendChild(im); } row.appendChild(th);
      var info = el('div', 'si'); info.appendChild(el('div', 'sl', esc(lab)));
      if (!r) info.appendChild(el('div', 'sm', 'leer')); else if (r.damaged) info.appendChild(el('div', 'sm', 'beschädigt')); else { info.appendChild(el('div', 'sm', esc(r.meta.roomName))); info.appendChild(el('div', 'sm', esc(MA.fmtDate(r.at)+' · '+MA.fmtTime(r.meta.playMs)))); }
      row.appendChild(info); var acts = el('div', 'sa');
      if (mode === 'save' && s !== 'auto'){ acts.appendChild(btn('Speichern', async function(){ if (r && !r.damaged && !(await UI.confirm(lab+' überschreiben?', 'Überschreiben', 'Zurück'))) return; var ok = MA.saveTo(s); UI.toast(ok ? 'Gespeichert: '+lab : 'Speichern fehlgeschlagen'+(MA.saveReason === 'quota' ? ' (Speicher voll).' : '.')); render(); }, 'mini')); }
      if (mode === 'load' && r && !r.damaged){ acts.appendChild(btn('Laden', async function(){ if (E.screen === 'game' && !(await UI.confirm('Diesen Stand laden? Nicht gespeicherter Fortschritt geht verloren.', 'Laden', 'Zurück'))) return; if (MA.loadEnv(r.env)){ UI.closeAllModals(); UI.toast('Geladen: '+lab); } else UI.toast('Dieser Stand lässt sich nicht laden.'); }, 'mini')); }
      if (r && s !== 'auto'){ acts.appendChild(btn('Löschen', async function(){ if (await UI.confirm(lab+' löschen?', 'Löschen', 'Zurück')){ MA.deleteSave(s); render(); } }, 'mini del')); }
      row.appendChild(acts); list.appendChild(row); }); }
  render(); p.appendChild(list); p.appendChild(btn('Zurück', function(){ UI.popModal(m); }, 'back'));
  p.appendChild(el('p', 'fine', 'Spielstände liegen nur in diesem Browser auf diesem Gerät (Schlüssel „madv.v1.*“, getrennt von MALA).'));
  m = UI.pushModal(p, { cls: 'wide', kind: 'saves' }); };

// ---------------------------------------------------------------- Einstellungen
UI.openSettings = function(){ var p = panel('Einstellungen'), m, S = MA.settings;
  function opt(label, vals, get, set){ var row = el('div', 'opt'); row.appendChild(el('span', 'ol', esc(label))); var g = el('div', 'og');
    vals.forEach(function(v){ var b = el('button', 'ob'+(get() === v[0] ? ' on' : ''), esc(v[1])); b.onclick = function(){ set(v[0]); MA.saveSettings(); UI.layout(); [].forEach.call(g.children, function(c){ c.classList.remove('on'); }); b.classList.add('on'); }; g.appendChild(b); });
    row.appendChild(g); p.appendChild(row); }
  opt('Textgeschwindigkeit', [[0, 'langsam'], [1, 'normal'], [2, 'schnell']], function(){ return S.textSpeed; }, function(v){ S.textSpeed = v; });
  opt('Weiter erst nach Tippen', [[false, 'aus'], [true, 'an']], function(){ return S.tapText; }, function(v){ S.tapText = v; });
  opt('Große Schrift', [[false, 'aus'], [true, 'an']], function(){ return S.bigText; }, function(v){ S.bigText = v; });
  opt('Lesbare Schrift', [[false, 'Pixel'], [true, 'Lesbar']], function(){ return S.readable; }, function(v){ S.readable = v; });
  opt('Bewegung reduzieren', [[false, 'aus'], [true, 'an']], function(){ return S.reduceMotion; }, function(v){ S.reduceMotion = v; });
  p.appendChild(btn('Vollbild', function(){ var d = document.documentElement; try { var r = (d.requestFullscreen || d.webkitRequestFullscreen).call(d); if (r && r.then) r.then(function(){ try { screen.orientation.lock('landscape').catch(function(){}); } catch(e){} }).catch(function(){}); } catch(e){ UI.toast('Vollbild ist hier nicht möglich.'); } }));
  p.appendChild(el('p', 'fine', 'Dieses Kapitel hat bewusst keinen Ton (Vorgabe des Spielkonzepts für die Browserfassung).'));
  p.appendChild(btn('Zurück', function(){ UI.popModal(m); }, 'back'));
  m = UI.pushModal(p, { kind: 'settings' }); };

UI.openControls = function(){ var p = panel('Steuerung'), m;
  var t = ['<b>Ort antippen oder anklicken:</b> M. sieht es sich an. Kann man mehr damit tun, erscheinen genau diese Handlungen – mit der Maus als kleines Menü am Zeiger, mit dem Finger als große Knöpfe unten.',
    '<b>Boden:</b> hingehen. <b>Ausgang:</b> M. geht los; zweimal schnell antippen überspringt den Weg.',
    '<b>Gegenstand antippen:</b> „Benutze … mit …“, dann das Ziel antippen – eine Stelle, eine Person, einen anderen Gegenstand oder M.s Bild unten links. Gegenstände lassen sich auch auf ein Ziel ziehen. Erneut antippen oder ✕ hebt die Wahl auf.',
    '<b>Gespräche:</b> Antwort antippen; am Rechner auch Ziffern 1–9. Ein Tipp aufs Bild beendet einen Satz.',
    '<b>Notizen:</b> was M. gerade beschäftigt – keine Lösungen. <b>Karte:</b> bekannte Orte. <b>Zeigen:</b> markiert kurz alle Stellen.',
    '<b>Tastatur:</b> Esc Menü/Schließen · Leertaste/Enter Satz weiter · N Notizen · K Karte · Z Zeigen · I Inventar blättern.'];
  t.forEach(function(s){ p.appendChild(el('p', '', s)); }); p.appendChild(btn('Zurück', function(){ UI.popModal(m); }, 'back')); m = UI.pushModal(p, { cls: 'wide', kind: 'controls' }); };

UI.openAbout = function(){ var p = panel('Über das Spiel'), m;
  ['<b>M. Adventure</b> erzählt die Lebensgeschichte von M., geboren 1942 in einem armen Dorf in Bosnien-Herzegowina. Diese Fassung enthält das Kapitel <b>Mostar 1955 – „Der Genosse kommt!“</b> als eigenständig spielbaren Abschnitt.',
   'Grundlage: das Spielkonzept „M Adventure“ (Figuren, Drehbuch S01–S35). Bild- und Bedienungssprache nach der Referenz MALA („Die Stillen“); Palette, Malkasten und Figuren-Rig sind technisch übernommen.',
   'Ohne Ton und ohne Video, wie im Konzept für die Browserfassung vorgesehen. Nach dem Kapitel geht es zurück zum Hauptmenü.',
   'Fassung '+esc(MA.BUILD)+' · v'+esc(MA.VERSION)].forEach(function(s){ p.appendChild(el('p', '', s)); });
  p.appendChild(btn('Zurück', function(){ UI.popModal(m); }, 'back')); m = UI.pushModal(p, { cls: 'wide', kind: 'about' }); };

// ---------------------------------------------------------------- Notizen
UI.openJournal = function(){ if (UI.modal() && UI.topModal().kind !== 'pause') return; if (E.dlg) return; UI.closeVerbs(); var p = panel('Notizen', 'Was mich beschäftigt'), m, G = MA.GS;
  var open = G.noteOrder.filter(function(id){ return G.notes[id] === 'open'; }).reverse(), done = G.noteOrder.filter(function(id){ return G.notes[id] === 'done'; }).reverse();
  var tabs = el('div', 'tabs'), body = el('div', 'nb');
  function show(which){ body.innerHTML = ''; [].forEach.call(tabs.children, function(c){ c.classList.toggle('on', c.dataset.w === which); });
    var ids = which === 'open' ? open : done; if (!ids.length) body.appendChild(el('p', 'fine', which === 'open' ? 'Gerade nichts.' : 'Noch nichts erledigt.'));
    var ul = el('ul', 'notes'); ids.forEach(function(id){ var n = MA.NOTES[id], t = which === 'open' ? UI.noteText(id) : (n.done ? (typeof n.done === 'function' ? n.done(G) : n.done) : UI.noteText(id)); var li = el('li', (G.noteNew[id] ? 'new' : ''), esc(t)); ul.appendChild(li); }); body.appendChild(ul); }
  [['open', 'Offen ('+open.length+')'], ['done', 'Erledigt ('+done.length+')']].forEach(function(t){ var b = el('button', 'tab', esc(t[1])); b.dataset.w = t[0]; b.onclick = function(){ show(t[0]); }; tabs.appendChild(b); });
  p.appendChild(tabs); p.appendChild(body); show('open');
  p.appendChild(btn('Schließen', function(){ UI.popModal(m); }, 'back'));
  m = UI.pushModal(p, { cls: 'wide', kind: 'journal', onClose: function(){ G.noteNew = {}; UI.refreshBar(); } }); };

// ---------------------------------------------------------------- Stadtplan
// MA.MAP.locs: [{id, name, x, y, room, known(GS), open(GS) -> true | 'Grund'}]; nur bekannte Orte erscheinen
UI.openMap = function(){ if (E.screen !== 'game' || UI.modal() || E.busy) return; UI.closeVerbs(); var p = el('div', 'mappanel'), m, u = UI.L.u;
  var cv = el('canvas', 'mapc'); cv.width = 320; cv.height = 144; if (MA.paintMap) UI.paintBuf(cv, MA.paintMap(MA.GS)); p.appendChild(cv);
  var layer = el('div', 'maplocs'); p.appendChild(layer);
  var here = MA.GS.room, hereLoc = MA.MAP.locs.filter(function(l){ return l.room === here || (l.rooms && l.rooms.indexOf(here) >= 0); })[0];
  var indoor = E.room && E.room.indoor;
  var msg = el('div', 'mapmsg', indoor ? 'Von drinnen zeigt der Plan nur, wo ich bin.' : 'Wohin? Ein Ort genügt.');
  MA.MAP.locs.forEach(function(l){ if (!l.known(MA.GS)) return; var isHere = l === hereLoc, open = l.open ? l.open(MA.GS) : true;
    var b = el('button', 'mloc'+(isHere ? ' here' : '')+(open === true ? '' : ' locked'), '<i></i><span>'+esc(l.name)+'</span>'); b.style.left = (l.x/320*100)+'%'; b.style.top = (l.y/144*100)+'%';
    b.onclick = async function(){ if (isHere){ msg.textContent = 'Hier bin ich.'; return; } if (indoor){ msg.textContent = 'Erst muss ich nach draußen.'; return; } if (open !== true){ msg.textContent = open; return; }
      UI.popModal(m); await MA.travel(l); };
    layer.appendChild(b); });
  var foot = el('div', 'mapfoot'); foot.appendChild(msg); foot.appendChild(btn('Schließen', function(){ UI.popModal(m); }, 'back mini')); p.appendChild(foot);
  p.appendChild(el('div', 'legend', '◉ hier · ◌ bekannt · 🔒 noch nicht'));
  m = UI.pushModal(p, { cls: 'full map', kind: 'map' }); };

// ---------------------------------------------------------------- Dokument (Lesen, Ansehen)
UI.openDoc = function(d){ return new Promise(function(res){ var p = panel(d.title || null), m;
  if (d.paint){ var c = el('canvas', 'docimg'); var b = d.paint(); UI.paintBuf(c, b); c.style.width = (b.w*UI.L.u*(d.scale || 1))+'px'; p.appendChild(c); }
  if (d.text){ (Array.isArray(d.text) ? d.text : [d.text]).forEach(function(t){ p.appendChild(el('p', d.mono ? 'doc mono' : 'doc', esc(t))); }); }
  p.appendChild(btn('Zurück', function(){ UI.popModal(m); }, 'back')); p.onclick = function(){ UI.popModal(m); };
  m = UI.pushModal(p, { cls: 'doc '+(d.cls || ''), kind: 'doc', onClose: function(){ res(); } }); }); };

// ---------------------------------------------------------------- Erzählkarte (Kapitelbeginn, Abschluss)
UI.showCard = function(c){ return new Promise(function(res){ var p = el('div', 'card'), m; if (c.kicker) p.appendChild(el('div', 'ck', esc(c.kicker))); if (c.title) p.appendChild(el('div', 'ctt', esc(c.title))); if (c.text) (Array.isArray(c.text) ? c.text : [c.text]).forEach(function(t){ p.appendChild(el('p', 'cx', esc(t))); });
  p.appendChild(el('div', 'cmore', 'Weiter ▸')); var t0 = Date.now(); p.onclick = function(){ if (Date.now()-t0 > 350) UI.popModal(m); };
  m = UI.pushModal(p, { cls: 'full cardm', kind: 'card', onClose: function(){ res(); } }); }); };

// ---------------------------------------------------------------- Rätsel-Ebene
// def: {w,h, init(st,data), draw(buf,st), buttons(st)->[{t,id,disabled}], press(st,id,api), tap(st,x,y,api)}; api.done(result) schließt.
UI.openPuzzle = function(id, data){ var def = MA.PUZZLES[id]; if (!def) return Promise.resolve(null);
  return new Promise(function(res){ var st = {}, p = el('div', 'puzzle'), m, w = def.w || 320, h = def.h || 144;
    if (def.title) p.appendChild(el('div', 'ptitle', esc(def.title)));
    var cv = el('canvas', 'pc'); cv.width = w; cv.height = h; p.appendChild(cv);
    var say = el('div', 'psay'); p.appendChild(say); var bs = el('div', 'pbtns'); p.appendChild(bs); var result = null, closed = false;
    var api = { redraw: function(){ var b = new M.Buf(w, h, M.P.k0); def.draw(b, st); UI.paintBuf(cv, b); renderButtons(); },
      say: function(t){ say.textContent = t || ''; }, done: function(r){ if (closed) return; closed = true; result = r; UI.popModal(m, r); } };
    function renderButtons(){ bs.innerHTML = ''; (def.buttons ? def.buttons(st) : []).forEach(function(b){ var e = el('button', 'pb'+(b.cls ? ' '+b.cls : ''), esc(b.t)); e.disabled = !!b.disabled; e.onclick = function(ev){ ev.stopPropagation(); def.press(st, b.id, api); }; bs.appendChild(e); }); }
    cv.addEventListener('pointerup', function(ev){ var r = cv.getBoundingClientRect(), x, y; if (UI.L.rot){ x = (ev.clientY-r.top)/r.height*w; y = (r.right-ev.clientX)/r.width*h; } else { x = (ev.clientX-r.left)/r.width*w; y = (ev.clientY-r.top)/r.height*h; } if (def.tap) def.tap(st, x, y, api); });
    def.init(st, data || {}, api); api.redraw();
    m = UI.pushModal(p, { cls: 'full puzz', kind: 'puzzle', esc: def.escClose !== false, onClose: function(v){ res(closed ? result : (def.cancel ? def.cancel(st) : null)); } }); }); };

// ---------------------------------------------------------------- Kapitelabschluss
UI.showEnd = function(info){ return new Promise(function(res){ var p = el('div', 'endp'), m;
  p.appendChild(el('div', 'ek', 'M. Adventure')); p.appendChild(el('div', 'et', 'Kapitel Mostar 1955 abgeschlossen')); p.appendChild(el('div', 'es', esc('„Der Genosse kommt!“ · Spielzeit '+MA.fmtTime(info.playMs))));
  var line = el('div', 'journey'); (MA.JOURNEY || []).forEach(function(s){ var st = el('div', 'stn'+(s.done ? ' done' : '')+(s.now ? ' now' : '')); st.appendChild(el('i', '')); st.appendChild(el('span', '', esc(s.t))); line.appendChild(st); }); p.appendChild(line);
  p.appendChild(el('p', 'fine', 'Die übrigen Erinnerungen von M. sind in dieser Fassung noch nicht umgesetzt.'));
  p.appendChild(btn('Zum Hauptmenü', function(){ UI.popModal(m); }, 'hi'));
  m = UI.pushModal(p, { cls: 'full endm', esc: false, kind: 'end', onClose: function(){ res(); } }); }); };
})(MA);
