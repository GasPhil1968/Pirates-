/* ===== M. Adventure – engine/core.js =====
   Namensraum MA, Definitionen (Räume, Gegenstände, Kombinationen, Notizen), Spielstand, Einstellungen, Speichern/Laden.
   Die Grafikbibliothek aus MALA liegt unter M (M.Buf, M.P, M.drawPose …); alles Spielspezifische unter MA.
   Speicherschlüssel: madv.v1.* – getrennt von MALA (mala.*), damit sich die Projekte nichts überschreiben. */
var MA = window.MA || {};
(function(MA){
'use strict';
MA.VERSION = '1.0.0';
MA.BUILD = '11.11.2026 · 4260d4';
MA.KEY = 'madv.v1.';
MA.W = 320; MA.SH = 144; MA.H = 200;

// ---------------------------------------------------------------- Definitionen
MA.ROOMS = {}; MA.ITEMS = {}; MA.COMBOS = {}; MA.NOTES = {}; MA.CAST = {}; MA.MAP = { locs: [] }; MA.PUZZLES = {};
MA.defineRoom = function(def){
  def.width = def.width || MA.W;
  def.hotspots = def.hotspots || [];
  def.byId = {};
  def.hotspots.forEach(function(h){ def.byId[h.id] = h; h.room = def.id; });
  MA.ROOMS[def.id] = def; return def; };
MA.defineItems = function(o){ Object.keys(o).forEach(function(k){ if (MA.ITEMS[k]) throw new Error('Gegenstand doppelt: '+k); o[k].id = k; MA.ITEMS[k] = o[k]; }); };
// Kombinationen zweier Gegenstände: Schlüssel 'a+b' (Reihenfolge egal)
MA.defineCombos = function(o){ Object.keys(o).forEach(function(k){ MA.COMBOS[k] = o[k]; }); };
// Notizen (Orientierung, keine Lösungen): {id:{t:'offen', done:'erledigt'}}
MA.defineNotes = function(o){ Object.keys(o).forEach(function(k){ var v = o[k]; v.id = k; MA.NOTES[k] = v; }); };
// Figuren für Gespräche: Name, Sprechfarbe, Porträt
MA.defineCast = function(o){ Object.keys(o).forEach(function(k){ o[k].id = k; MA.CAST[k] = o[k]; }); };
MA.definePuzzle = function(id, def){ def.id = id; MA.PUZZLES[id] = def; };

// ---------------------------------------------------------------- Spielstand
// room/pos: wo M. ist; flags: alles, was sich in der Welt verändert hat; inv: Gegenstände in Reihenfolge;
// notes: {id:'open'|'done'}, noteOrder: Reihenfolge des Erscheinens; seen: einmalige Ereignisse; cyc: Zähler für Wiederholungen;
// rs: Zustand je Raum (wird beim ersten Betreten aus room.state() erzeugt); playMs: Spielzeit.
MA.fresh = function(){ return { v: 1, room: null, pos: { x: 160, y: 120, f: 'R' }, flags: {}, inv: [], notes: {}, noteOrder: [], noteNew: {}, seen: {}, cyc: {}, rs: {}, playMs: 0, startedAt: Date.now(), ended: false }; };
MA.GS = MA.fresh();
MA.RS = function(id){ var r = MA.ROOMS[id]; if (!r) throw new Error('kein Raum '+id); if (!MA.GS.rs[id]) MA.GS.rs[id] = r.state ? r.state(MA.GS) : {}; return MA.GS.rs[id]; };

// Beobachter: die Welt wird neu gemalt, wenn sich ein Zustand ändert
MA.dirty = true;
MA.touch = function(){ MA.dirty = true; MA.navDirty = true; };
MA.flag = function(k){ return MA.GS.flags[k]; };
MA.set = function(k, v){ MA.GS.flags[k] = (v === undefined ? true : v); MA.touch(); };
MA.has = function(id){ return MA.GS.inv.indexOf(id) >= 0; };
MA.give = function(id){ if (!MA.ITEMS[id]) throw new Error('unbekannter Gegenstand '+id); if (!MA.has(id)){ MA.GS.inv.push(id); MA.invNew = id; if (MA.UI && MA.UI.onInventory) MA.UI.onInventory(id, true); } };
MA.take = function(id){ var i = MA.GS.inv.indexOf(id); if (i >= 0){ MA.GS.inv.splice(i, 1); if (MA.UI && MA.UI.onInventory) MA.UI.onInventory(id, false); } if (MA.E && MA.E.selected === id) MA.E.selected = null; };
// Gegenstand an derselben Stelle gegen einen anderen tauschen (z. B. Löffel -> Löffel mit Kleister)
MA.swap = function(from, to){ var i = MA.GS.inv.indexOf(from); if (i < 0){ MA.give(to); return; } if (MA.has(to)){ MA.take(from); return; } MA.GS.inv[i] = to; if (MA.E && MA.E.selected === from) MA.E.selected = null; MA.invNew = to; if (MA.UI && MA.UI.onInventory) MA.UI.onInventory(to, true); };
MA.note = function(id, state){ if (!MA.NOTES[id]) throw new Error('unbekannte Notiz '+id); var G = MA.GS, cur = G.notes[id]; state = state || 'open';
  if (cur === state || cur === 'done' && state === 'open') return false;
  G.notes[id] = state; if (G.noteOrder.indexOf(id) < 0) G.noteOrder.push(id); if (state === 'open') G.noteNew[id] = 1; else delete G.noteNew[id];
  if (MA.UI && MA.UI.onNote) MA.UI.onNote(id, state); return true; };
MA.noteOpen = function(id){ return MA.GS.notes[id] === 'open'; };
MA.noteDone = function(id){ return MA.GS.notes[id] === 'done'; };
MA.itemName = function(id){ var it = MA.ITEMS[id]; if (!it) return id; return typeof it.name === 'function' ? it.name(MA.GS) : it.name; };

// ---------------------------------------------------------------- Einstellungen (nur Komfort, getrennt vom Spielstand)
MA.settings = { textSpeed: 1, tapText: false, bigText: false, readable: false, reduceMotion: false };
try { var st = JSON.parse(localStorage.getItem(MA.KEY+'settings') || 'null'); if (st && typeof st === 'object') Object.keys(MA.settings).forEach(function(k){ if (st[k] !== undefined) MA.settings[k] = st[k]; }); } catch(e){}
MA.saveSettings = function(){ try { localStorage.setItem(MA.KEY+'settings', JSON.stringify(MA.settings)); } catch(e){} };

// ---------------------------------------------------------------- Speichern / Laden
// Stände: 'auto' (bei jedem Ortswechsel und an Meilensteinen) und fünf Plätze 'slot1'…'slot5'.
// Hülle: { v, at, meta:{room, roomName, playMs, open:[…drei offene Notizen]}, thumb, GS }.
MA.SLOTS = 5;
function LS(){ try { return window.localStorage; } catch(e){ return null; } }
MA.roomName = function(id){ var r = MA.ROOMS[id]; if (!r) return id || ''; return typeof r.name === 'function' ? r.name(MA.GS) : r.name; };
function metaOf(G){ var open = G.noteOrder.filter(function(id){ return G.notes[id] === 'open'; }).slice(-3).reverse().map(function(id){ var n = MA.NOTES[id]; return n ? (typeof n.t === 'function' ? n.t(G) : n.t) : id; });
  return { room: G.room, roomName: MA.roomName(G.room), playMs: Math.round(G.playMs || 0), open: open }; }
MA.saveReason = null;
MA.saveTo = function(slot, opt){ opt = opt || {}; MA.saveReason = null; var L = LS(); if (!L){ MA.saveReason = 'storage'; return false; }
  var G = opt.G || (MA.E && MA.E.safeGS && MA.E.busy ? MA.E.safeGS : MA.GS);
  if (!G.room){ MA.saveReason = 'noroom'; return false; }
  if (G.ended){ MA.saveReason = 'ended'; return false; }
  if (MA.E && MA.E.syncPos && G === MA.GS) MA.E.syncPos();
  var env = { v: 1, at: Date.now(), meta: metaOf(G), GS: G, name: opt.name || null };
  if (opt.thumb !== false && MA.makeThumb){ try { env.thumb = MA.makeThumb(); } catch(e){} }
  try { L.setItem(MA.KEY+slot, JSON.stringify(env)); return true; }
  catch(e){ MA.saveReason = /quota/i.test(String(e && e.name || e)) ? 'quota' : 'error'; return false; } };
MA.readSave = function(slot){ var L = LS(); if (!L) return null; var raw; try { raw = L.getItem(MA.KEY+slot); } catch(e){ return { slot: slot, damaged: true }; }
  if (!raw) return null; var d; try { d = JSON.parse(raw); } catch(e){ return { slot: slot, damaged: true }; }
  if (!d || !d.GS || !MA.ROOMS[d.GS.room]) return { slot: slot, damaged: true, at: d && d.at };
  return { slot: slot, at: d.at || 0, meta: d.meta || metaOf(d.GS), thumb: (typeof d.thumb === 'string' && /^data:image\/png;base64,/.test(d.thumb)) ? d.thumb : null, env: d }; };
MA.deleteSave = function(slot){ var L = LS(); if (L) try { L.removeItem(MA.KEY+slot); } catch(e){} };
MA.anySave = function(){ if (MA.readSave('auto')) return true; for (var i = 1; i <= MA.SLOTS; i++) if (MA.readSave('slot'+i)) return true; return false; };
MA.latestSave = function(){ var best = null; ['auto'].concat([1,2,3,4,5].map(function(i){ return 'slot'+i; })).forEach(function(s){ var r = MA.readSave(s); if (r && !r.damaged && (!best || r.at > best.at)) best = r; }); return best; };
// Stand prüfen und in einen sauberen Spielstand übernehmen: unbekannte Gegenstände/Notizen fallen heraus
MA.validate = function(G0){ var base = MA.fresh(); Object.keys(base).forEach(function(k){ if (G0[k] !== undefined) base[k] = G0[k]; });
  base.inv = (base.inv || []).filter(function(id, i, a){ return MA.ITEMS[id] && a.indexOf(id) === i; });
  Object.keys(base.notes || {}).forEach(function(id){ if (!MA.NOTES[id]) delete base.notes[id]; });
  base.noteOrder = (base.noteOrder || []).filter(function(id){ return MA.NOTES[id]; });
  if (!MA.ROOMS[base.room]) return null; return base; };
// Kapitelabschluss merken (für das Titelbild), unabhängig von den Spielständen
MA.markDone = function(ms){ var L = LS(); if (!L) return; try { L.setItem(MA.KEY+'done.mostar', JSON.stringify({ at: Date.now(), playMs: Math.round(ms || 0) })); } catch(e){} };
MA.doneInfo = function(){ var L = LS(); if (!L) return null; try { return JSON.parse(L.getItem(MA.KEY+'done.mostar') || 'null'); } catch(e){ return null; } };

MA.fmtTime = function(ms){ var m = Math.round((ms || 0) / 60000), h = Math.floor(m / 60); m = m % 60; return h ? (h+' Std. '+m+' Min.') : (m+' Min.'); };
MA.fmtDate = function(at){ if (!at) return ''; var d = new Date(at), p = function(n){ return (n < 10 ? '0' : '')+n; }; return p(d.getDate())+'.'+p(d.getMonth()+1)+'.'+d.getFullYear()+' · '+p(d.getHours())+':'+p(d.getMinutes()); };
})(MA);
