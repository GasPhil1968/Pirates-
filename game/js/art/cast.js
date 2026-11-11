/* ===== M. Adventure – art/cast.js =====
   Spielfiguren für Mostar 1955 mit dem MALA-Figuren-Rig (Kopfstempel + erzeugte Torsi + Glieder).
   Legende der Kopfstempel wie in MALA: k Umriss · H h j Haar dunkel/mittel/hell · S s t Haut hell/mittel/Schatten · e Auge · m Mund
   b Bart · c C Mütze/Tuch dunkel/hell · g Brille · w Weiß · r Akzent (Stern, Fez-Quaste).
   Kinder (M., Jasna, Nedim, Dragan, Klasse) sind kleiner: eigene Knochenlängen und eine auf 0,82 gestauchte Posen-Bibliothek. */
(function(M){
'use strict';
var P = M.P, A = M.ANIMS, HS = M.headSet;
function L(o){ var l = { k: P.k1, e: P.k0, w: P.s6 }; for (var k in o) l[k] = o[k]; if (l.E === undefined) l.E = l.H !== undefined ? l.H : P.h1; if (l.u === undefined && l.S !== undefined) l.u = M.UP[l.S] !== undefined ? M.UP[l.S] : l.S; if (l.o === undefined) l.o = P.k0; return l; }

// ---------------------------------------------------------------- Kinderposen: alle Posen der Bibliothek auf Kindermaß stauchen
var KID = 0.82;
function scalePose(p, k){ var q = {}; Object.keys(p).forEach(function(key){ var v = p[key];
  if (Array.isArray(v) && typeof v[0] === 'number'){ var n = v.slice(); if (key === 'ho') q[key] = n; else { n[0] = Math.round(v[0]*k); n[1] = Math.round(v[1]*k); q[key] = n; } }
  else q[key] = v; }); return q; }
function scaleAnim(an, k){ if (!Array.isArray(an)) return an; if (Array.isArray(an[0]) && an[0].length === 2 && typeof an[0][1] === 'number') return an.map(function(fr){ return [scalePose(fr[0], k), fr[1]]; }); return an.map(function(p){ return scalePose(p, k); }); }
var KIDANIM = {}; Object.keys(A).forEach(function(n){ KIDANIM[n] = scaleAnim(A[n], KID); });
M.KIDANIM = KIDANIM;

// ---------------------------------------------------------------- Zusätzliche Posen (für alle Figuren): Winken, Tragen, Fähnchen, Bücken, Lehnen
var S = M.poseS, F = M.poseF;
A.wave = [[S({}), 80], [S({ nh: [5, -36] }), 160], [S({ nh: [7, -42] }), 220], [S({ nh: [4, -42] }), 220], [S({ nh: [7, -42] }), 220], [S({ nh: [4, -42] }), 220], [S({ nh: [5, -36] }), 140], [S({}), 80]];
A.waveF = [[F({}), 80], [F({ rh: [8, -36] }), 160], [F({ rh: [10, -44] }), 220], [F({ rh: [6, -44] }), 220], [F({ rh: [10, -44] }), 220], [F({ rh: [6, -44] }), 220], [F({ rh: [8, -36] }), 120], [F({}), 80]];
A.flagF = [[F({ rh: [7, -26], it: 'flag' }), 1400], [F({ rh: [7, -27], it: 'flag', hd: 'b' }), 120], [F({ rh: [7, -26], it: 'flag', ho: [0, -1] }), 900]];
A.flagWaveF = [[F({ rh: [8, -34], it: 'flag' }), 200], [F({ rh: [10, -38], it: 'flag' }), 200], [F({ rh: [6, -38], it: 'flag' }), 200], [F({ rh: [10, -38], it: 'flag' }), 200]];
A.npflagF = [[F({ rh: [7, -28], it: 'npflag' }), 1400], [F({ rh: [7, -28], it: 'npflag', hd: 'b' }), 120]];
A.npflagWaveF = [[F({ rh: [8, -36], it: 'npflag' }), 220], [F({ rh: [10, -40], it: 'npflag' }), 220], [F({ rh: [6, -40], it: 'npflag' }), 220], [F({ rh: [10, -40], it: 'npflag' }), 220]];
A.clipF = [[F({ lh: [-3, -24], rh: [4, -24], it: 'clip' }), 1500], [F({ lh: [-3, -24], rh: [4, -24], it: 'clip', hd: 'b' }), 120], [F({ lh: [-3, -25], rh: [4, -25], it: 'clip', ho: [0, 1] }), 1100]];
A.clipS = [[S({ nh: [6, -26], fh: [4, -25], it: 'clipS' }), 1500], [S({ nh: [6, -26], fh: [4, -25], it: 'clipS', hd: 'b' }), 120], [S({ nh: [6, -27], fh: [4, -26], it: 'clipS', ho: [1, 1] }), 1300]];
A.stamp = [[S({ nh: [6, -26], it: 'stampS' }), 160], [S({ nh: [8, -34], it: 'stampS' }), 200], [S({ nh: [8, -22], it: 'stampS', ln: 2 }), 140], [S({ nh: [8, -34], it: 'stampS' }), 180], [S({}), 100]];
A.coatHold = [[S({ nh: [3, -31], fh: [1, -28] }), 1500], [S({ nh: [3, -31], fh: [1, -28], hd: 'b' }), 120], [S({ nh: [3, -31], fh: [1, -28], ho: [0, -1] }), 1200]];
A.coatHoldF = [[F({ lh: [-1, -30], rh: [5, -22] }), 1500], [F({ lh: [-1, -30], rh: [5, -22], hd: 'b' }), 120]];
A.coatTalk = [[S({ nh: [3, -31], fh: [1, -28], hd: 'o' }), 130], [S({ nh: [3, -31], fh: [1, -28] }), 120], [S({ nh: [3, -31], fh: [6, -30], hd: 'o' }), 140], [S({ nh: [3, -31], fh: [7, -31] }), 120]];
A.holdUp = [[S({ nh: [3, -38], fh: [1, -36], it: 'poster' }), 1600], [S({ nh: [3, -38], fh: [1, -36], it: 'poster', hd: 'b' }), 120]];
A.brush = [[S({ nh: [8, -34], it: 'brush' }), 300], [S({ nh: [9, -38], it: 'brush' }), 300], [S({ nh: [8, -30], it: 'brush' }), 300], [S({ nh: [9, -36], it: 'brush', hd: 'b' }), 300], [S({}), 900]];
A.sell = [[S({ nh: [6, -27], it: 'pipe' }), 1200], [S({ nh: [6, -27], it: 'pipe', hd: 'b' }), 120], [S({ nh: [7, -29], it: 'pipe', ho: [1, 0] }), 1600], [S({ nh: [4, -24] }), 1300]];
A.armsCross = [[F({ lh: [3, -27], rh: [-3, -27] }), 1600], [F({ lh: [3, -27], rh: [-3, -27], hd: 'b' }), 120], [F({ lh: [3, -27], rh: [-3, -26], ho: [0, -1] }), 1200]];
A.armsCrossS = [[S({ nh: [4, -27], fh: [3, -26] }), 1600], [S({ nh: [4, -27], fh: [3, -26], hd: 'b' }), 120], [S({ nh: [4, -27], fh: [3, -26], ho: [1, 0] }), 1300]];
A.lean = [[S({ ln: 3, h: [1, -23], nh: [7, -22], fh: [5, -22], ho: [1, 1] }), 1800], [S({ ln: 3, h: [1, -23], nh: [7, -22], fh: [5, -22], ho: [1, 1], hd: 'b' }), 120], [S({ ln: 4, h: [1, -23], nh: [8, -21], fh: [6, -21], ho: [2, 1] }), 1400]];
A.ballS = [[S({ nh: [5, -20], it: 'ball' }), 1200], [S({ nh: [5, -21], it: 'ball', hd: 'b' }), 120], [S({ nh: [5, -20], it: 'ball', ho: [0, -1] }), 1000]];
A.bounce = [[S({ nh: [6, -18], it: 'ball' }), 200], [S({ nh: [6, -12] }), 160], [S({ nh: [6, -18], it: 'ball' }), 200], [S({ nh: [6, -12] }), 160]];
A.crouch = [[S({ h: [2, -14], ln: 3, nf: [8, 0, 'f'], ff: [-3, 0, 't'], nh: [10, -9], fh: [6, -11] }), 999999]];
A.hold = [[S({ nh: [3, -38], fh: [1, -30] }), 999999]];
A.pullLine = [[S({ h: [-3, -22], ln: -3, nf: [5, 0, 'h'], ff: [-5, 0, 'f'], nh: [8, -30], fh: [7, -29] }), 999999]];
A.listen = [[S({ ho: [1, 0] }), 1500], [S({ ho: [1, 0], hd: 'b' }), 110], [S({ ho: [1, 1] }), 1200]];
A.shout = [[F({ hd: 'o', lh: [-6, -30], rh: [6, -30] }), 380], [F({ hd: 'o', lh: [-6, -31], rh: [6, -31] }), 380]];
A.shoutFlag = [[F({ hd: 'o', rh: [9, -38], it: 'flag' }), 300], [F({ hd: 'o', rh: [7, -40], it: 'flag' }), 300]];
A.sitBench = [[S({ h: [0, -13], nf: [9, 0, 'f'], ff: [7, 0, 'f'], nh: [6, -14], fh: [4, -14], sit: 1 }), 1400], [S({ h: [0, -13], nf: [9, 0, 'f'], ff: [7, 0, 'f'], nh: [6, -14], fh: [4, -14], sit: 1, hd: 'b' }), 110], [S({ h: [0, -13], nf: [8, 0, 'f'], ff: [7, 0, 'f'], nh: [6, -15], fh: [4, -14], sit: 1, ho: [0, 1] }), 1100]];
['wave', 'waveF', 'flagF', 'flagWaveF', 'npflagF', 'npflagWaveF', 'clipF', 'clipS', 'stamp', 'coatHold', 'coatHoldF', 'coatTalk', 'holdUp', 'brush', 'sell', 'armsCross', 'armsCrossS', 'lean', 'ballS', 'bounce', 'crouch', 'hold', 'pullLine', 'listen', 'shout', 'shoutFlag', 'sitBench'].forEach(function(n){ KIDANIM[n] = scaleAnim(A[n], KID); });
M.CONTACT.stamp = 2; M.CONTACT.wave = 2;
// Gewohnheiten mit gehaltenem Klemmbrett (Branko, vorn) und zugehaltenem Mantel (Lehrer)
var CLF = { lh: [-3, -24], rh: [4, -24], it: 'clip' }, COH = { nh: [3, -31], fh: [1, -28] };
function w(o, x){ var r = {}; for (var k in o) r[k] = o[k]; for (var k2 in x) r[k2] = x[k2]; return r; }
A.clipWriteF = [[F(w(CLF, { ho: [0, 1] })), 300], [F(w(CLF, { ho: [0, 1], rh: [3, -23] })), 180], [F(w(CLF, { ho: [0, 1], rh: [5, -24] })), 180], [F(w(CLF, { ho: [0, 1], rh: [3, -23] })), 180], [F(w(CLF, { ho: [0, 1], rh: [5, -25], hd: 'b' })), 220], [F(CLF), 300]];
A.clipLookF = [[F(w(CLF, { ho: [-1, 0] })), 700], [F(w(CLF, { ho: [-1, 0], hd: 'b' })), 100], [F(CLF), 300], [F(w(CLF, { ho: [1, 0] })), 700], [F(CLF), 300]];
A.clipNodF = [[F(w(CLF, { ho: [0, 1] })), 200], [F(CLF), 180], [F(w(CLF, { ho: [0, 1] })), 200], [F(CLF), 300]];
A.coatLookS = [[S(w(COH, { ho: [1, 0] })), 700], [S(w(COH, { ho: [1, -1] })), 600], [S(w(COH, { ho: [1, -1], hd: 'b' })), 100], [S(COH), 300], [S(w(COH, { ho: [-1, 0] })), 600], [S(COH), 200]];
A.coatNodS = [[S(w(COH, { ho: [0, 1] })), 200], [S(COH), 180], [S(w(COH, { ho: [0, 1] })), 200], [S(COH), 300]];
A.coatSighS = [[S(w(COH, { br: 1, ho: [0, -1] })), 500], [S(w(COH, { ho: [1, 1], hd: 'b' })), 700], [S(COH), 300]];

// ---------------------------------------------------------------- Gehaltene Dinge (Seitenansicht über M.HELD; Vorderansicht über post)
var H = M.HELD;
function flagAt(b, x, y, np){ b.vl(x, y-9, y+3, P.w2); if (np){ b.rect(x+1, y-9, 6, 5, P.s5); b.hl(x+2, x+5, y-8, P.s2); b.hl(x+2, x+4, y-6, P.s3); b.px(x+5, y-6, P.b2); b.vl(x+6, y-9, y-5, P.s3); }
  else { b.hl(x+1, x+6, y-9, P.b2); b.hl(x+1, x+6, y-8, P.s6); b.hl(x+1, x+6, y-7, P.r3); b.px(x+3, y-8, P.r3); } }
H.flag = function(b, x, y){ flagAt(b, x+1, y, false); };
H.npflag = function(b, x, y){ flagAt(b, x+1, y, true); };
H.clipS = function(b, x, y){ b.rect(x, y-6, 5, 7, P.w3); b.rect(x+1, y-5, 3, 5, P.s6); b.hl(x+1, x+3, y-3, P.s3); b.px(x+2, y-6, P.m3); };
H.stampS = function(b, x, y){ b.rect(x, y-1, 4, 2, P.w2); b.vl(x+1, y-4, y-2, P.w3); b.px(x+1, y-5, P.w4); };
H.brush = function(b, x, y){ b.line(x, y, x+5, y-6, P.w3); b.rect(x+4, y-9, 3, 3, P.e2); b.px(x+5, y-10, P.s5); };
H.poster = function(b, x, y){ };
H.pipe = function(b, x, y){ b.hl(x+1, x+4, y-1, P.m3); b.px(x+4, y-2, P.m4); b.px(x+1, y-1, P.m2); };
H.ball = function(b, x, y){ b.ellipse(x+3, y+1, 2.6, 2.6, function(xx, yy){ var dx = xx-(x+3), dy = yy-(y+1); return (dx+dy < -1.5) ? P.s6 : ((dx*dx+dy*dy < 1.6) ? P.k1 : P.s4); }); };
H.crate = function(b, x, y){ b.rect(x-2, y-5, 13, 8, P.w2); b.hl(x-2, x+10, y-5, P.w4); b.hl(x-2, x+10, y-2, P.w1); b.vl(x-2, y-5, y+2, P.w1); b.vl(x+10, y-5, y+2, P.w1); for (var i = 0; i < 4; i++){ b.px(x+i*3-1, y-6, P.g3); b.px(x+i*3-1, y-7, P.g2); } };
H.crateEmpty = function(b, x, y){ b.rect(x-2, y-5, 13, 8, P.w2); b.hl(x-2, x+10, y-5, P.w4); b.hl(x-2, x+10, y-2, P.w1); b.vl(x-2, y-5, y+2, P.w1); b.vl(x+10, y-5, y+2, P.w1); };
H.line = function(b, x, y){ b.line(x+1, y, x+2, y+12, P.e3); };
function stdPost(b, p, OX, OY, hx, hy){ if (p.v === 'S') return; var r = p.rh || [7, -21];
  if (p.it === 'flag') flagAt(b, OX+r[0], OY+r[1], false);
  else if (p.it === 'npflag') flagAt(b, OX+r[0], OY+r[1], true);
  else if (p.it === 'clip' && p.v === 'F'){ var cx = OX+hx-4, cy = OY+hy-14; b.rect(cx, cy, 9, 11, P.w3); b.rect(cx+1, cy+2, 7, 8, P.s6); for (var i = 0; i < 3; i++) b.hl(cx+2, cx+6, cy+4+i*2, P.s3); b.rect(cx+3, cy, 3, 2, P.m3); }
  else if (p.it === 'crate' && p.v === 'F'){ var x0 = OX+hx-7, y0 = OY+hy-11; b.rect(x0, y0, 15, 9, P.w2); b.hl(x0, x0+14, y0, P.w4); b.hl(x0, x0+14, y0+4, P.w1); for (var j = 0; j < 4; j++){ b.px(x0+2+j*3, y0-1, P.g3); b.px(x0+2+j*3, y0-2, P.g2); } }
  else if (p.it === 'ball' && p.v === 'F'){ b.ellipse(OX+r[0]+1, OY+r[1]+1, 2.6, 2.6, P.s4); } }

// ---------------------------------------------------------------- Kopf-Bausteine
// Kind, Seitenansicht (nach rechts), 11 breit; Vorderansicht 10 breit; Rücken. Haarformen werden als ganze Stempel geschrieben.
function kidHeads(o){ return { S: HS(o.S), F: HS(o.F), B: { n: o.B } }; }
// Neue, detailliertere Köpfe aus art/heads.js haben Vorrang (M.HEADS[id] = {S, F, B, neck}); Lidschlag ersetzt auch das Augenweiß
var HD = M.HEADS || {};
function heads2(id, fallback){ var h = HD[id]; if (!h) return fallback; return { S: M.headSet2(h.S), F: M.headSet2(h.F), B: { n: h.B } }; }
function neck2(id, fallback){ var h = HD[id]; return (h && h.neck) || fallback; }

// ---------------- M. (13): dunkles, kurz geschnittenes Haar, hageres Gesicht, sauberes weißes Hemd, kurze Hose, Sandalen; ohne Halstuch und Mütze
var mS = [
"...kkkkk...",
"..kHHHHHkk.",
".kHHHhHHHHk",
".kHHHHHHHHk",
"kHHHHHHSSHk",
"kHHHSSSSSSk",
"kHHtSSSSeSk",
"kHtSSSSSSSSk",
".ktSSSSSSSk",
"..ktSSSSmk.",
"...kttSSk..",
"....ktsk...",
"....ktsk..."];
var mF = [
"..kkkkkk..",
".kHHhHHHHk",
"kHHHHHHHHk",
"kHHHHHhHHk",
"kHSSSSSSHk",
"kSeSSSSeSk",
"ktSSSStSSk",
".kSSSSSSk.",
".ktSSmSSk.",
"..ktSSSk..",
"...ktsk...",
"...ktsk..."];
var mB = [
"..kkkkkk..",
".kHHhHHHHk",
"kHHHHHHHHk",
"kHHHHhHHHk",
"kHHHHHHHHk",
"kHHHHHHHHk",
"kSHHHHHHSk",
".kHHHHHHk.",
".kHHHHHHk.",
"..ktttSk..",
"...ktsk...",
"...ktsk..."];
M.defineChar('m', { kid: true,
  legend: L({ H: P.h1, h: P.h2, j: P.h3, S: P.p4, s: P.p3, t: P.p2, m: P.p1, e: P.k0 }),
  heads: heads2('m', kidHeads({ S: mS, F: mF, B: mB })), neck: neck2('m', { S: [5, 12], F: [5, 11], B: [5, 11] }),
  torso: { w: 10, len: 11, col: [P.s5, P.s6, P.s3], collar: [P.s6, P.s4], buttons: P.s3, belt: P.w2, buckle: P.y3, pocket: true, side: 7 },
  dx: { sleeve: 'rolled', shorts: { col: [P.c1, P.c2, P.c0], len: 0.55 }, feet: 'sandal', strap: P.w1 },
  cols: { trou: [P.p3, P.p4, P.p2], trouF: [P.p2, P.p3, P.p1], sleeve: [P.s5, P.s6, P.s3], sleeveF: [P.s4, P.s5, P.s3], hand: [P.p4, P.p3], handF: [P.p3, P.p2], shoe: P.w2, shoeTop: P.w3 },
  bones: [9, 8, 7, 6], hipY: 23, shoulder: 4, legR: [1.4, 1.1], armR: [1.1, 0.9], tHipS: 3, anims: KIDANIM, post: stdPost });

// ---------------- Jasna (13): zwei dunkle Zöpfe, Pioniermütze, weiße Bluse, rotes Halstuch, dunkler Rock
var jS = [
"...ccccc...",
"..cCCrCCcc.",
".kcccccccck",
".kHHHHHHHHk",
"kHHHHHHSSHk",
"kHHHSSSSSSk",
"kHHtSSSSeSk",
"kHtSSSSSSSSk",
"kHktSSSSSSk",
"kHk.ktSSmk.",
"kjk..ktSk..",
".kk.ktsk...",
"....ktsk..."];
var jF = [
"..cccccc..",
".cCCrCCCc.",
"kcccccccck",
"kHHHHHHHHk",
"kHSSSSSSHk",
"kSeSSSSeSk",
"kHSSStSSHk",
"kHkSSSSkHk",
"kHktSmSkHk",
"kjk.tSk.jk",
".k.ktsk.k.",
"...ktsk..."];
var jB = [
"..cccccc..",
".ccccrcccc",
"kcccccccck",
"kHHHHHHHHk",
"kHHHhHHHHk",
"kHHHHHHHHk",
"kHHHHHHHHk",
"kHkHHHHkHk",
"kHkkttkkHk",
"kjk.ts.kjk",
".k.ktsk.k.",
"...ktsk..."];
var pionCap = { c: P.n1, C: P.n2, r: P.r3 };
M.defineChar('jasna', { kid: true,
  legend: L(Object.assign({ H: P.h1, h: P.h2, j: P.r3, S: P.p5, s: P.p4, t: P.p3, m: P.p2, e: P.k0 }, pionCap)),
  heads: heads2('jasna', kidHeads({ S: jS, F: jF, B: jB })), neck: neck2('jasna', { S: [5, 12], F: [5, 11], B: [5, 11] }),
  torso: { w: 10, len: 11, col: [P.s5, P.s6, P.s3], scarf: [P.r3, P.r4, P.r2], side: 7 },
  dx: { sleeve: 'short', socks: { col: [P.s5, P.s6, P.s3], h: 3 }, feet: 'shoe', braids: { y: 7, len: 6, col: [P.h1, P.h2], ribbon: P.r3 } },
  skirt: { c: [P.n1, P.n2, P.n0], hem: 9, flare: 2 },
  cols: { trou: [P.p4, P.p5, P.p3], trouF: [P.p3, P.p4, P.p2], sleeve: [P.s5, P.s6, P.s3], sleeveF: [P.s4, P.s5, P.s3], hand: [P.p5, P.p4], handF: [P.p4, P.p3], shoe: P.k2 },
  bones: [9, 8, 7, 6], hipY: 23, shoulder: 4, legR: [1.3, 1.1], armR: [1.0, 0.9], tHipS: 3, anims: KIDANIM, post: stdPost });

// ---------------- Nedim (12): kleiner, Pioniermütze, abstehende Ohren, rotes Halstuch, kurze Hose
var nS = [
"...ccccc...",
"..cCCrCCcc.",
".kcccccccck",
".kHHHHHHHk.",
"kHHHHHSSSk.",
"ksHHSSSSSSk",
"kHHtSSSSeSk",
"kHtSSSSSSSSk",
".ktSSSSSSSk",
"..ktSSSmSk.",
"...kttSSk..",
"....ktsk...",
"....ktsk..."];
var nF = [
"..cccccc..",
".cCCrCCCc.",
"kcccccccck",
"kHHHHHHHHk",
"ksSSSSSSsk",
"kSeSSSSeSk",
"ktSSStSStk",
".kSSSSSSk.",
".ktSmmSSk.",
"..ktSSSk..",
"...ktsk...",
"...ktsk..."];
var nB = [
"..cccccc..",
".ccccrcccc",
"kcccccccck",
"kHHHHHHHHk",
"ksHHHHHHsk",
"kHHHHHHHHk",
"kHHHHhHHHk",
".kHHHHHHk.",
".kHHHHHHk.",
"..ktttSk..",
"...ktsk...",
"...ktsk..."];
M.defineChar('nedim', { kid: true,
  legend: L(Object.assign({ H: P.w1, h: P.w2, j: P.w3, S: P.p4, s: P.p3, t: P.p2, m: P.p1, e: P.k0 }, pionCap)),
  heads: heads2('nedim', kidHeads({ S: nS, F: nF, B: nB })), neck: neck2('nedim', { S: [5, 12], F: [5, 11], B: [5, 11] }),
  torso: { w: 10, len: 10, col: [P.s5, P.s6, P.s3], scarf: [P.r3, P.r4, P.r2], belt: P.e0, side: 7 },
  dx: { sleeve: 'long', shorts: { col: [P.e1, P.e2, P.e0], len: 0.62 }, socks: { col: [P.s4, P.s5, P.s3], h: 2 }, feet: 'shoe' },
  cols: { trou: [P.p3, P.p4, P.p2], trouF: [P.p2, P.p3, P.p1], sleeve: [P.s5, P.s6, P.s3], sleeveF: [P.s4, P.s5, P.s3], hand: [P.p4, P.p3], handF: [P.p3, P.p2], shoe: P.w1 },
  bones: [8, 8, 7, 6], hipY: 23, shoulder: 4, legR: [1.3, 1.1], armR: [1.0, 0.9], tHipS: 3, anims: KIDANIM, post: stdPost });

// ---------------- Dragan (13): wirres, helles Haar, Hemd halb aus der Hose, aufgeschürfte Knie, kein Halstuch (in der Tasche)
var dS = [
"..k.kkkk...",
".kHkHHHHkk.",
"kHHHjHHHHHk",
".kHHHHjHHHk",
"kHHHHHHSSHk",
"kHHHSSSSSSk",
"kHHtSSSSeSk",
"kHtSSSSSSSSk",
".ktSSSSSSSk",
"..ktSSSSmk.",
"...kttSSk..",
"....ktsk...",
"....ktsk..."];
var dF = [
".k.kkkk.k.",
"kHkHHHHkHk",
"kHHjHHHHHk",
"kHHHHjHHHk",
"kHSSSSSHHk",
"kSeSSSSeSk",
"ktSSStSStk",
".kSSSSSSk.",
".ktSSmSSk.",
"..ktSSSk..",
"...ktsk...",
"...ktsk..."];
var dB = [
".k.kkkk.k.",
"kHkHHHHkHk",
"kHHjHHHHHk",
"kHHHHjHHHk",
"kHHHHHHHHk",
"kHHjHHHHHk",
"kSHHHHHHSk",
".kHHHHHHk.",
".kHHHHHHk.",
"..ktttSk..",
"...ktsk...",
"...ktsk..."];
M.defineChar('dragan', { kid: true,
  legend: L({ H: P.w3, h: P.w4, j: P.w5, S: P.p4, s: P.p3, t: P.p2, m: P.p1, e: P.k0 }),
  heads: heads2('dragan', kidHeads({ S: dS, F: dF, B: dB })), neck: neck2('dragan', { S: [5, 12], F: [5, 11], B: [5, 11] }),
  torso: { w: 10, len: 11, col: [P.s4, P.s5, P.s3], collar: [P.s5, P.s3], side: 7, taper: true },
  dx: { sleeve: 'rolled', shorts: { col: [P.e1, P.e2, P.e0], len: 0.5 }, feet: 'shoe' },
  cols: { trou: [P.p3, P.p4, P.p2], trouF: [P.p2, P.p3, P.p1], sleeve: [P.s4, P.s5, P.s3], sleeveF: [P.s3, P.s4, P.s2], hand: [P.p4, P.p3], handF: [P.p3, P.p2], shoe: P.w1 },
  bones: [9, 8, 7, 6], hipY: 23, shoulder: 4, legR: [1.4, 1.1], armR: [1.1, 0.9], tHipS: 3, anims: KIDANIM, post: stdPost });

// ---------------- weitere Kinder der Klasse (Aufstellung, Schulhof): vier Varianten aus denselben Bausteinen
function kidVariant(id, hair, skin, shirt, bottom, opt){ opt = opt || {};
  var legend = L(Object.assign({ H: hair[0], h: hair[1], j: hair[2], S: skin[0], s: skin[1], t: skin[2], m: skin[3], e: P.k0 }, pionCap));
  var hid = opt.girl ? 'kidGirl' : 'kidBoy', heads = heads2(hid, opt.girl ? kidHeads({ S: jS, F: jF, B: jB }) : kidHeads({ S: nS, F: nF, B: nB }));
  M.defineChar(id, { kid: true, legend: legend, heads: heads, neck: neck2(hid, { S: [5, 12], F: [5, 11], B: [5, 11] }),
    torso: { w: 10, len: opt.short ? 10 : 11, col: shirt, scarf: [P.r3, P.r4, P.r2], belt: opt.girl ? undefined : bottom[2], side: 7 },
    skirt: opt.girl ? { c: bottom, hem: 9, flare: 2 } : undefined,
    dx: opt.girl ? { sleeve: 'short', socks: { col: [P.s5, P.s6, P.s3], h: 3 }, feet: 'shoe', braids: { y: 7, len: 5, col: [hair[0], hair[1]], ribbon: P.r3 } }
                 : { sleeve: opt.short ? 'rolled' : 'long', shorts: { col: bottom, len: 0.55 }, socks: opt.short ? null : { col: [P.s4, P.s5, P.s3], h: 2 }, feet: 'shoe' },
    cols: { trou: [skin[1], skin[0], skin[2]], trouF: [skin[2], skin[1], skin[3]], sleeve: shirt, sleeveF: [shirt[2], shirt[0], shirt[2]], hand: [skin[0], skin[1]], handF: [skin[1], skin[2]], shoe: opt.girl ? P.k2 : P.w1 },
    bones: [9, 8, 7, 6], hipY: 23, shoulder: 4, legR: [1.3, 1.1], armR: [1.0, 0.9], tHipS: 3, anims: KIDANIM, post: stdPost }); }
var SK1 = [P.p4, P.p3, P.p2, P.p1], SK2 = [P.p5, P.p4, P.p3, P.p2], SK3 = [P.q4, P.q3, P.q2, P.q1];
var WH = [P.s5, P.s6, P.s3];
kidVariant('kidA', [P.h1, P.h2, P.h3], SK1, WH, [P.c1, P.c2, P.c0]);
kidVariant('kidB', [P.w2, P.w3, P.w4], SK2, WH, [P.n1, P.n2, P.n0], { girl: true });
kidVariant('kidC', [P.h2, P.h3, P.w2], SK3, WH, [P.e1, P.e2, P.e0], { short: true });
kidVariant('kidD', [P.w1, P.w2, P.w3], SK2, WH, [P.r1, P.r2, P.r0], { girl: true });

// ---------------------------------------------------------------- Erwachsene
// ---------------- Der Lehrer (um 45): schütteres Haar, Brille, Schnurrbart, graubrauner Mantel, dem oben ein Knopf fehlt
var leS = [
"....kkkk....",
"...ksshhkk..",
"..kHhSSSSSk.",
"..kHSSSSSSSk",
".kHHSSSSSSSk",
".kHHtSgggSSk",
".kHtSSgSegSk",
".kHtSSSggSSSk",
"..ktSSSSSSSk",
"..ktSSbbbSk.",
"..kttSSmSk..",
"...kttSSk...",
"....kttk....",
"....ktsk...."];
var leF = [
"...kkkkk...",
"..ksSSSSk..",
".kHSSSSSHk.",
"kHHSSSSSHHk",
"kHSSSSSSSHk",
"kSgggSgggSk",
"kSgeSSSegSk",
"ktSgSStSgtk",
".kSSSSSSSk.",
".kSbbbbbSk.",
".kSSSmSSSk.",
"..kSSSSSk..",
"...ktttk...",
"...kssk...."];
var leB = [
"...kkkkk...",
"..kSSSSSk..",
".kHSSSSSHk.",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".kSHHHHHSk.",
"..kSSSSSk..",
"...kSSSk...",
"...ktttk...",
"...kssk...."];
M.defineChar('lehrer', {
  legend: L({ H: P.m2, h: P.m3, j: P.m4, E: P.m2, S: P.q3, s: P.q2, t: P.q1, m: P.q0, b: P.m2, g: P.m1, u: P.q4, e: P.k0 }),
  heads: heads2('lehrer', { S: HS(leS), F: HS(leF), B: { n: leB } }), neck: neck2('lehrer', { S: [6, 13], F: [5, 13], B: [5, 13] }),
  torso: { w: 12, len: 13, col: [P.e2, P.e3, P.e1], collar: [P.s5, P.s4], lapel: P.e3, buttons: P.e0, tie: P.r1, pocket: true, side: 8 },
  dx: { sleeve: 'long', feet: 'shoe' },
  coat: { c: [P.e2, P.e3, P.e1], hem: 10, w: 6 },
  cols: { trou: [P.m1, P.m2, P.m0], trouF: [P.m0, P.m1, P.k2], sleeve: [P.e2, P.e3, P.e1], sleeveF: [P.e1, P.e2, P.e0], hand: [P.q3, P.q2], handF: [P.q2, P.q1], shoe: P.w0 },
  post: function(b, p, OX, OY, hx, hy){ stdPost(b, p, OX, OY, hx, hy); if (p.v === 'F'){ b.px(OX+hx+2, OY+hy-9, P.e1); } } });

// ---------------- Branko (um 28): pomadisiertes Haar mit Scheitel, weißes Hemd, dunkle Hose, rote Armbinde, Klemmbrett
var brS = [
"....kkkk....",
"...kHHHHkk..",
"..kHHHhHHHk.",
"..kHhhhhhHHk",
".kHHHHHHSSHk",
".kHHHHSSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktSSSSSSSk",
"..ktSSSSSmk.",
"..kttSSSSk..",
"...kkttkk...",
"....kttk....",
"....ktsk...."];
var brF = [
"...kkkkk...",
"..kHHhHHk..",
".kHHHHhHHk.",
"kHHhhhhhHHk",
"kHHSSSSSHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
".kSSSSSSSk.",
".kSSSmSSSk.",
".kSSSSSSSk.",
"..kSSSSSk..",
"...ktttk...",
"...kssk...."];
var brB = [
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"kHHHHHhHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".kSHHHHHSk.",
"..kSSSSSk..",
"...kSSSk...",
"...ktttk...",
"...kssk...."];
M.defineChar('branko', {
  legend: L({ H: P.h0, h: P.h2, j: P.h3, S: P.p4, s: P.p3, t: P.p2, m: P.p1, e: P.k0 }),
  heads: heads2('branko', { S: HS(brS), F: HS(brF), B: { n: brB } }), neck: neck2('branko', { S: [6, 13], F: [5, 13], B: [5, 13] }),
  torso: { w: 12, len: 13, col: [P.s5, P.s6, P.s3], collar: [P.s6, P.s4], buttons: P.s3, belt: P.k2, buckle: P.m3, pocket: true, side: 8 },
  dx: { sleeve: 'rolled', armband: { col: [P.r3, P.r4, P.r2] }, feet: 'shoe' },
  cols: { trou: [P.k2, P.c0, P.k1], trouF: [P.k1, P.k2, P.k0], sleeve: [P.s5, P.s6, P.s3], sleeveF: [P.s4, P.s5, P.s3], hand: [P.p4, P.p3], handF: [P.p3, P.p2], shoe: P.k2 },
  post: stdPost });

// ---------------- Mara (um 40): Kopftuch, kräftige Arme, hochgekrempelte Ärmel, blaue Schürze über dunklem Rock
var maS = [
"....cccc....",
"...cCCCCcc..",
"..cCCCCCCCc.",
"..cCCCCCCCCk",
".cCCCCCCSSCk",
".cCCCCSSSSSk",
".cCCtSSSSeSk",
".cCtSSSSSSSSk",
"..ccSSSSSSSk",
"..kcttSSSmk.",
"...ktSSSSk..",
"....kttkk...",
"....kttk....",
"....ktsk...."];
var maF = [
"...ccccc...",
"..cCCCCCc..",
".cCCCCCCCc.",
"cCCCCCCCCCc",
"cCCSSSSSCCc",
"cCSSSSSSSCc",
"cCSeSSSeSCc",
"cCSSSStSSCc",
".ccSSSSSSk.",
".kcSSmSSck.",
"..kSSSSSk..",
"..kcSSSck..",
"...ktttk...",
"...kssk...."];
var maB = [
"...ccccc...",
"..cCCCCCc..",
".cCCCCCCCc.",
"cCCCCCCCCCc",
"cCCCCCCCCCc",
"cCCCCcCCCCc",
"cCCCCCCCCCc",
"cCCCCCCCCCc",
".cCCCCCCCc.",
"..cCCcCCc..",
"...cCcCc...",
"....cCc....",
"...ktttk...",
"...kssk...."];
M.defineChar('mara', {
  legend: L({ c: P.r2, C: P.r3, r: P.r1, S: P.q3, s: P.q2, t: P.q1, m: P.r2, e: P.k0, H: P.h1, h: P.h2, E: P.h1, y: P.y3 }),
  heads: heads2('mara', { S: HS(maS), F: HS(maF), B: { n: maB } }), neck: neck2('mara', { S: [6, 13], F: [5, 13], B: [5, 13] }),
  torso: { w: 12, len: 12, col: [P.w3, P.w4, P.w2], apron: [P.b1, P.b2], side: 8, belly: true },
  dx: { sleeve: 'rolled', feet: 'shoe', cuff: [P.w4, P.w5, P.w3] },
  skirt: { c: [P.k2, P.m0, P.k1], hem: 15, flare: 2 },
  cols: { trou: [P.q2, P.q3, P.q1], trouF: [P.q1, P.q2, P.q0], sleeve: [P.w3, P.w4, P.w2], sleeveF: [P.w2, P.w3, P.w1], arm: [P.q3, P.q4, P.q2], armF: [P.q2, P.q3, P.q1], hand: [P.q3, P.q2], handF: [P.q2, P.q1], shoe: P.k2 },
  bones: [11, 10, 8, 7], armR: [1.5, 1.3], post: stdPost });

// ---------------- Dedo Muratović (um 70): roter Fes mit schwarzer Quaste, grauer Schnurrbart, dunkle Weste über weißem Hemd, Pumphose
var deS = [
"....kkkk....",
"...krrrrk...",
"...krrrrrk..",
"..kkrrrrrrk.",
"..kssSSSSSk.",
".kssSSSSSSSk",
".kssSSSSSeSk",
".kstSSSSSSSSk",
"..ktSSSSSSSk",
"..ktSSbbbbk.",
"..kttSSmSk..",
"...kttSSk...",
"....kttk....",
"....ktsk...."];
var deF = [
"...kkkkk...",
"..krrrrrk..",
"..krrrrrk..",
".kkrrrrrkk.",
".kSSSSSSSk.",
"kSSSSSSSSSk",
"kSeSSSSSeSk",
"ksSSSStSSsk",
".kSSSSSSSk.",
".kbbbbbbbk.",
".kSSSmSSSk.",
"..kSSSSSk..",
"...ktttk...",
"...kssk...."];
var deB = [
"...kkkkk...",
"..krrrrrk..",
"..krrHrrk..",
".kkrrrrrkk.",
".kHHHHHHHk.",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kSHHHHHHHSk",
".kSSSSSSSk.",
".kSSSSSSSk.",
"..kSSSSSk..",
"...kSSSk...",
"...ktttk...",
"...kssk...."];
M.defineChar('dedo', {
  legend: L({ r: P.r3, R: P.r4, o: P.k0, H: P.m3, h: P.m4, E: P.m4, S: P.q3, s: P.q2, t: P.q1, m: P.q0, b: P.s5, e: P.k0 }),
  heads: heads2('dedo', { S: HS(deS), F: HS(deF), B: { n: deB } }), neck: neck2('dedo', { S: [6, 13], F: [5, 13], B: [5, 13] }),
  torso: { w: 12, len: 13, col: [P.k2, P.m0, P.k1], open: P.s5, buttons: P.y2, belt: P.r2, wideBelt: true, side: 8, belly: true },
  dx: { sleeve: 'long', feet: 'shoe' },
  cols: { trou: [P.e1, P.e2, P.e0], trouF: [P.e0, P.e1, P.k2], sleeve: [P.s5, P.s6, P.s3], sleeveF: [P.s4, P.s5, P.s3], hand: [P.q3, P.q2], handF: [P.q2, P.q1], shoe: P.k2 },
  bones: [10, 10, 8, 7],
  post: function(b, p, OX, OY, hx, hy){ stdPost(b, p, OX, OY, hx, hy); if (p.v === 'S'){ var x = OX+hx+3, y = OY+hy-13-12; b.px(x-6, y, P.k1); b.px(x-7, y+1, P.k1); b.px(x-7, y+2, P.k0); } } });

// ---------------- Jovan (um 35): Redar an der Absperrung: Schirmmütze, graublaue Jacke, weiße Armbinde, Pfeife an der Schnur
var joS = [
"...kkkkkk...",
"..kccccccck.",
"..kcCCCCCCck",
".kkcccccccccc",
".kHHHHHHSSHk",
".kHHHHSSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktSSSSSSSk",
"..ktSSSSSmk.",
"..kttSSSSk..",
"...kkttkk...",
"....kttk....",
"....ktsk...."];
var joF = [
"..kkkkkkk..",
".kcccccccck",
".kcCCrCCcck",
"kcccccccccck",
"kHHSSSSSHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
".kSSSSSSSk.",
".kSSSmSSSk.",
".kSSSSSSSk.",
"..kSSSSSk..",
"...ktttk...",
"...kssk...."];
var joB = [
"..kkkkkkk..",
".kcccccccck",
".kcCCCCCcck",
".kcccccccck",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".kSHHHHHSk.",
"..kSSSSSk..",
"...kSSSk...",
"...ktttk...",
"...kssk...."];
M.defineChar('jovan', {
  legend: L({ c: P.c1, C: P.c2, r: P.r3, H: P.h1, h: P.h2, b: P.h2, S: P.p3, s: P.p2, t: P.p1, m: P.p0, e: P.k0 }),
  heads: heads2('jovan', { S: HS(joS), F: HS(joF), B: { n: joB } }), neck: neck2('jovan', { S: [6, 13], F: [5, 13], B: [5, 13] }),
  torso: { w: 12, len: 13, col: [P.c2, P.c3, P.c1], collar: [P.c3, P.c1], buttons: P.y3, belt: P.w1, buckle: P.y3, pocket: true, side: 8 },
  dx: { sleeve: 'long', armband: { col: [P.s5, P.s6, P.s3] }, feet: 'boot' },
  cols: { trou: [P.c1, P.c2, P.c0], trouF: [P.c0, P.c1, P.k2], sleeve: [P.c2, P.c3, P.c1], sleeveF: [P.c1, P.c2, P.c0], hand: [P.p3, P.p2], handF: [P.p2, P.p1], shoe: P.k1 },
  post: function(b, p, OX, OY, hx, hy){ stdPost(b, p, OX, OY, hx, hy); var L2 = 13;
    if (p.v === 'S'){ var ax = OX+hx+2+Math.round((p.ln || 0)*(L2-2)/(L2-1)), ay = OY+hy-L2+4; b.px(ax+2, ay, P.m3); b.px(ax+2, ay+1, P.m3); b.px(ax+2, ay+2, P.m4); }
    else if (p.v === 'F'){ b.vl(OX+hx+2, OY+hy-L2+2, OY+hy-L2+5, P.m3); b.px(OX+hx+2, OY+hy-L2+6, P.m4); } } });

// ---------------- Der Plakatkleber (um 40): Schiebermütze, Arbeitsjacke voller Kleisterflecken, Pinsel
var klS = [
"....kkkkk...",
"...kcccccck.",
"..kcCCCCCcckk",
"..kccccccck..",
".kHHHHHHSSHk",
".kHHHHSSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktbbSSSSSk",
"..kbbtSSSmk.",
"..kbbbbSSk..",
"...kbbbbk...",
"....kttk....",
"....ktsk...."];
var klF = [
"...kkkkk...",
"..kcccccck.",
".kcCCCCCcck",
".kcccccccck",
"kHHSSSSSHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
".kbSSSSSbk.",
".kbbSmSbbk.",
".kbbbbbbbk.",
"..kbbbbbk..",
"...ktttk...",
"...kssk...."];
var klB = [
"...kkkkk...",
"..kcccccck.",
".kcCCCCCcck",
".kcccccccck",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".kSHHHHHSk.",
"..kSSSSSk..",
"...kSSSk...",
"...ktttk...",
"...kssk...."];
M.defineChar('kleber', {
  legend: L({ c: P.e1, C: P.e2, H: P.h1, h: P.h2, S: P.q3, s: P.q2, t: P.q1, m: P.q0, b: P.q2, e: P.k0, x: P.s5 }),
  heads: heads2('kleber', { S: HS(klS), F: HS(klF), B: { n: klB } }), neck: neck2('kleber', { S: [6, 13], F: [5, 13], B: [5, 13] }),
  torso: { w: 12, len: 13, col: [P.b0, P.b1, P.n2], buttons: P.k2, pocket: true, side: 8, stripe: undefined },
  dx: { sleeve: 'rolled', feet: 'shoe', cuff: [P.b1, P.b2, P.b0] },
  cols: { trou: [P.b0, P.b1, P.n2], trouF: [P.n2, P.b0, P.n1], sleeve: [P.b0, P.b1, P.n2], sleeveF: [P.n2, P.b0, P.n1], hand: [P.q3, P.q2], handF: [P.q2, P.q1], shoe: P.w0 },
  post: function(b, p, OX, OY, hx, hy){ stdPost(b, p, OX, OY, hx, hy); if (p.v === 'S'){ b.px(OX+hx+2, OY+hy-6, P.s5); b.px(OX+hx-1, OY+hy-10, P.s5); } else if (p.v === 'F'){ b.px(OX+hx-3, OY+hy-5, P.s5); b.px(OX+hx+2, OY+hy-9, P.s5); } } });

// ---------------- Der Veranstaltungshelfer (um 20): hochgekrempelte Hemdsärmel, Armbinde, Bleistift hinter dem Ohr
var heS = [
"....kkkk....",
"...kHHHHkk..",
"..kHHHHHHHk.",
"..kHHHhHHHHk",
".kHHHHHHSSHk",
".kHHHHSSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..kyySSSSSSk",
"..ktSSSSSmk.",
"..kttSSSSk..",
"...kkttkk...",
"....kttk....",
"....ktsk...."];
var heF = [
"...kkkkk...",
"..kHHhHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kHHSSSSSHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
"ykSSSSSSSk.",
".kSSSmSSSk.",
".kSSSSSSSk.",
"..kSSSSSk..",
"...ktttk...",
"...kssk...."];
M.defineChar('helfer', {
  legend: L({ H: P.w1, h: P.w2, j: P.w3, S: P.p4, s: P.p3, t: P.p2, m: P.p1, e: P.k0, y: P.y3 }),
  heads: heads2('helfer', { S: HS(heS), F: HS(heF), B: { n: brB } }), neck: neck2('helfer', { S: [6, 13], F: [5, 13], B: [5, 13] }),
  torso: { w: 12, len: 13, col: [P.b4, P.b5, P.b3], collar: [P.b5, P.b3], belt: P.w1, buckle: P.m3, side: 8 },
  dx: { sleeve: 'rolled', armband: { col: [P.r3, P.r4, P.r2] }, feet: 'shoe' },
  cols: { trou: [P.e1, P.e2, P.e0], trouF: [P.e0, P.e1, P.k2], sleeve: [P.b4, P.b5, P.b3], sleeveF: [P.b3, P.b4, P.b2], arm: [P.p4, P.p5, P.p3], armF: [P.p3, P.p4, P.p2], hand: [P.p4, P.p3], handF: [P.p3, P.p2], shoe: P.w0 },
  post: stdPost });

// ---------------- Tiko: heller Uniformrock, Schirmmütze, ein kurzer Auftritt
var tiS = [
"...kkkkkk...",
"..kwwwwwwwk.",
"..kwyywwwwwk",
".kkwwwwwwwwkk",
".kHHHHHHSSHk",
".kHHHHSSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktSSSSSSSk",
"..ktSSSSSmk.",
"..kttSSSSk..",
"...kkttkk...",
"....kttk....",
"....ktsk...."];
var tiF = [
"..kkkkkkk..",
".kwwwwwwwwk",
".kwwyyywwwk",
"kwwwwwwwwwwk",
"kHHSSSSSHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
".kSSSSSSSk.",
".kSSSmSSSk.",
".kSSSSSSSk.",
"..kSSSSSk..",
"...ktttk...",
"...kssk...."];
M.defineChar('tiko', {
  legend: L({ W: P.s6, y: P.y3, c: P.s6, C: P.s5, r: P.r3, H: P.m3, h: P.m4, E: P.m2, S: P.q3, s: P.q2, t: P.q1, m: P.q0, e: P.k0 }),
  heads: heads2('tiko', { S: HS(tiS), F: HS(tiF), B: { n: joB } }), neck: neck2('tiko', { S: [6, 13], F: [5, 13], B: [5, 13] }),
  torso: { w: 12, len: 13, col: [P.s5, P.s6, P.s4], buttons: P.y3, belt: P.y2, buckle: P.y4, collar: [P.s6, P.s4], pocket: true, side: 8 },
  dx: { sleeve: 'long', feet: 'boot' },
  cols: { trou: [P.s5, P.s6, P.s4], trouF: [P.s4, P.s5, P.s3], sleeve: [P.s5, P.s6, P.s4], sleeveF: [P.s4, P.s5, P.s3], hand: [P.q3, P.q2], handF: [P.q2, P.q1], shoe: P.k1 },
  post: function(b, p, OX, OY, hx, hy){ if (p.v === 'S'){ b.px(OX+hx+3, OY+hy-9, P.r3); b.px(OX+hx+3, OY+hy-8, P.y3); } } });

// ---------------------------------------------------------------- Passanten (Statisten, nicht anklickbar): Köpfe aus vorhandenen Vorlagen in eigenen Farben
H.basket = function(b, x, y){ b.line(x, y, x-1, y+3, P.w2); b.line(x+1, y, x+4, y+3, P.w2); b.rect(x-2, y+3, 8, 4, P.w3); b.hl(x-2, x+5, y+3, P.w4); b.hl(x-1, x+4, y+5, P.w2); b.px(x, y+2, P.g4); b.px(x+1, y+2, P.g5); b.px(x+3, y+2, P.r3); };
H.cane = function(b, x, y){ b.line(x+1, y+1, x+3, y+22, P.w1); b.px(x+1, y, P.w2); };
function passHeads(id, tpl){ var h = HD[tpl]; return h ? { S: M.headSet2(h.S), F: M.headSet2(h.F), B: { n: h.B } } : null; }
if (HD.mara) M.defineChar('passFrau', {
  legend: L({ c: P.m0, C: P.m1, r: P.m0, S: P.q3, s: P.q2, t: P.q1, m: P.q1, e: P.k0, H: P.m2, h: P.m3, E: P.m2, y: P.q2 }),
  heads: passHeads('passFrau', 'mara'), neck: HD.mara.neck,
  torso: { w: 12, len: 12, col: [P.m1, P.m2, P.m0], buttons: P.m0, side: 8, belly: true },
  skirt: { c: [P.k2, P.m0, P.k1], hem: 15, flare: 2 },
  dx: { sleeve: 'long', feet: 'shoe', item: 'basket' },
  cols: { trou: [P.q2, P.q3, P.q1], trouF: [P.q1, P.q2, P.q0], sleeve: [P.m1, P.m2, P.m0], sleeveF: [P.m0, P.m1, P.k2], hand: [P.q3, P.q2], handF: [P.q2, P.q1], shoe: P.k2 },
  bones: [11, 10, 8, 7], post: stdPost });
if (HD.kleber) M.defineChar('passMann', {
  legend: L({ c: P.m1, C: P.m2, H: P.w1, h: P.w2, S: P.p3, s: P.p2, t: P.p1, m: P.p0, b: P.p3, e: P.k0, x: P.p3 }),
  heads: passHeads('passMann', 'kleber'), neck: HD.kleber.neck,
  torso: { w: 12, len: 13, col: [P.m2, P.m3, P.m1], collar: [P.s5, P.s4], lapel: P.m3, buttons: P.m0, pocket: true, side: 8 },
  dx: { sleeve: 'long', feet: 'shoe' },
  cols: { trou: [P.c1, P.c2, P.c0], trouF: [P.c0, P.c1, P.k2], sleeve: [P.m2, P.m3, P.m1], sleeveF: [P.m1, P.m2, P.m0], hand: [P.p3, P.p2], handF: [P.p2, P.p1], shoe: P.w0 },
  post: stdPost });
if (HD.kidBoy) M.defineChar('passKind', { kid: true,
  legend: L({ c: P.w1, C: P.w2, r: P.w1, H: P.w1, h: P.w2, j: P.w3, S: P.p4, s: P.p3, t: P.p2, m: P.p1, e: P.k0 }),
  heads: passHeads('passKind', 'kidBoy'), neck: HD.kidBoy.neck,
  torso: { w: 10, len: 11, col: [P.b2, P.b3, P.b1], collar: [P.b3, P.b1], side: 7 },
  dx: { sleeve: 'short', shorts: { col: [P.e1, P.e2, P.e0], len: 0.55 }, feet: 'sandal', strap: P.w1 },
  cols: { trou: [P.p3, P.p4, P.p2], trouF: [P.p2, P.p3, P.p1], sleeve: [P.b2, P.b3, P.b1], sleeveF: [P.b1, P.b2, P.b0], hand: [P.p4, P.p3], handF: [P.p3, P.p2], shoe: P.w2 },
  bones: [9, 8, 7, 6], hipY: 23, shoulder: 4, legR: [1.4, 1.1], armR: [1.1, 0.9], tHipS: 3, anims: KIDANIM, post: stdPost });
if (HD.lehrer) M.defineChar('passOpa', {
  legend: L({ H: P.s4, h: P.s5, j: P.s6, E: P.s5, S: P.q3, s: P.q2, t: P.q1, m: P.q0, b: P.s5, g: P.q2, u: P.q4, e: P.k0 }),
  heads: passHeads('passOpa', 'lehrer'), neck: HD.lehrer.neck,
  torso: { w: 12, len: 13, col: [P.e1, P.e2, P.e0], collar: [P.s4, P.s3], buttons: P.e0, side: 8, hunch: true },
  dx: { sleeve: 'long', feet: 'shoe', item: 'cane' },
  cols: { trou: [P.m1, P.m2, P.m0], trouF: [P.m0, P.m1, P.k2], sleeve: [P.e1, P.e2, P.e0], sleeveF: [P.e0, P.e1, P.k2], hand: [P.q3, P.q2], handF: [P.q2, P.q1], shoe: P.k2 },
  post: stdPost });
})(M);
