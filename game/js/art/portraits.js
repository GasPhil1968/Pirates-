/* ===== M. Adventure – art/portraits.js =====
   Gemalte Brustbilder 56 × 64 im MALA-Format (Varianten: 'n' ruhig, 'o' spricht, 'b' blinzelt), nach rechts blickend (Dreiviertel).
   Anders als in MALA (handgepixelte Pixelkarten) entstehen die Porträts hier aus einem parametrischen Maler mit gemeinsamen Regeln:
   Licht von links oben, Hautrampen in fünf Stufen, geordnetes Dithering nur an Übergängen, dunkle Kontur mit M.outline.
   Jede Figur bekommt eigene Form-, Haar-, Kopfbedeckungs-, Kleidungs- und Altersparameter plus Einzelheiten (after). */
(function(MA){
'use strict';
var P = M.P, T = M.T, Buf = M.Buf, bayer = M.bayer;
var PW = 56, PH = 64;
var DEF = {}, CACHE = {};
function R(s){ return M.R(s); }
// Rampen (dunkel -> hell), je fünf Stufen
var SKIN = { light: R('p1 p2 p3 p4 p5'), warm: R('q1 q2 q3 q4 p5'), tan: R('q0 q1 q2 q3 q4'), kid: R('p2 p3 p4 p5 l0') };
var HAIR = { black: R('k1 h0 h1 h2 h3'), brown: R('h1 w1 w2 w3 w4'), blond: R('w2 w3 w4 w5 w6'), grey: R('m1 m2 m3 m4 s5'), white: R('m2 m3 m4 s5 s6'), darkbrown: R('h0 h1 h2 h3 w2') };
MA.PORTRAIT_RAMPS = { SKIN: SKIN, HAIR: HAIR };
function q(ramp, v, x, y){ v = Math.max(0, Math.min(0.999, v)); var f = v*(ramp.length-1), i = Math.floor(f), fr = f-i; if (fr > 0.57 || (fr > 0.43 && bayer(x, y) < (fr-0.43)/0.14)) i++; return ramp[Math.min(ramp.length-1, i)]; }

// ---------------------------------------------------------------- Maler
// Kopf groß im Bild (wie die MALA-Brustbilder): Mitte ~ (27,25), Kopfbreite ~ 26–28 px; Schultern mit Halsansatz und Armfalten.
function smooth(t){ t = Math.max(0, Math.min(1, t)); return t*t*(3-2*t); }
function paint(d, variant){ var b = new Buf(PW, PH, T), o = d;
  var kid = !!o.kid, age = o.age || 0;
  var cx = o.cx || 27, cy = o.cy || (kid ? 25 : 24), rx = o.rx || (kid ? 12.5 : 13), ry = o.ry || (kid ? 14.5 : 15.5), jaw = o.jaw === undefined ? 0.74 : o.jaw, turn = o.turn === undefined ? 2 : o.turn;
  // M.ADV Detail: Köpfe gut ein Zehntel größer, damit Augen, Brauen und Mund mehr Pixel bekommen
  var HS2 = o.hs || 1.1; rx *= HS2; ry *= HS2; cy += 1.5;
  var skin = o.skin || SKIN.warm, hair = o.hairCol || HAIR.brown;
  // ---- Körper: Halsansatz, Schulterschräge, Arme
  var nb = Math.round(cy+ry*0.82), sw = o.shoulder || (kid ? 21 : 25), neckH = kid ? 4.5 : 5.5, cloth = o.cloth || R('m0 m1 m2 m3 m4');
  for (var y = nb; y < PH; y++){ var t = (y-nb)/13, half = neckH+1+(sw-neckH-1)*smooth(t)*(0.92+0.08*smooth((y-nb-10)/10));
    for (var x = Math.floor(28-half); x <= Math.ceil(28+half); x++){ var u = (x-(28-half))/(2*half), v = 0.66-u*0.46-(y-nb)*0.006;
      var arm = Math.abs(Math.abs(x-28)-(sw-6)); if (y > nb+9 && arm < 1.2) v -= 0.18; if (u < 0.06 || u > 0.94) v -= 0.1;
      b.px(x, y, q(cloth, v, x, y)); } }
  // Hals mit Schatten unter dem Kinn
  for (var y2 = Math.round(cy+ry*0.5); y2 < nb+4; y2++) for (var x2 = Math.round(28-neckH); x2 <= Math.round(28+neckH-1); x2++){ var u2 = (x2-(28-neckH))/(2*neckH), sh = y2 < cy+ry+2 ? 0.22 : 0.08; b.px(x2, y2, q(skin, 0.5-u2*0.3-sh, x2, y2)); }
  if (o.body) o.body(b, { cx: cx, cy: cy, by: nb-5, nb: nb, sw: sw, cloth: cloth, skin: skin, q: q });
  // ---- Kopf
  var face = function(x, y){ var dy = (y+0.5-cy)/ry, dx = (x+0.5-cx)/rx; if (dy < -1 || dy > 1) return false; var hw;
    if (dy <= 0) hw = Math.sqrt(1-dy*dy*0.92); else hw = Math.sqrt(Math.max(0, 1-Math.pow(dy, 2.4)))*(1-(1-jaw)*Math.pow(dy, 1.3));
    return Math.abs(dx) <= hw; };
  var fcx = cx+turn, eyY = Math.round(cy+ry*0.1+(o.eyeY || 0));
  // Ohr (links, zwischen Augen- und Nasenhöhe)
  var ex0 = Math.round(cx-rx), ey0 = eyY+1;
  if (!o.noEar){ for (var ey = ey0-3; ey <= ey0+4; ey++) for (var exx = ex0-2; exx <= ex0+1; exx++){ var dd = Math.abs(ey-ey0-0.5)/4.2+Math.abs(exx-ex0+0.5)/2.4; if (dd < 1) b.px(exx, ey, q(skin, 0.5-(exx-ex0)*0.06, exx, ey)); } b.px(ex0-1, ey0, skin[1]); b.px(ex0-1, ey0+1, skin[1]); b.px(ex0, ey0+2, skin[2]); }
  for (var fy = Math.floor(cy-ry); fy <= Math.ceil(cy+ry); fy++) for (var fx = Math.floor(cx-rx-1); fx <= Math.ceil(cx+rx+1); fx++){ if (!face(fx, fy)) continue;
    var nx = (fx+0.5-(cx-rx*0.25))/rx, ny = (fy+0.5-(cy-ry*0.35))/ry, v = 0.74-nx*0.28-ny*0.2;
    if (fx > fcx+rx*0.62) v -= 0.16;   // Schattenseite
    if ((fy-cy)/ry > 0.62) v -= 0.12;  // Kinn/Kiefer
    if (!face(fx+1, fy) || !face(fx, fy+1)) v -= 0.1;   // Kante
    b.px(fx, fy, q(skin, v, fx, fy)); }
  // Augenhöhlen und Wangenknochen
  var eL = Math.round(fcx-rx*0.42), eR = Math.round(fcx+rx*0.36);
  [eL, eR].forEach(function(ex){ for (var xx = ex-2; xx <= ex+2; xx++){ var c = b.get(xx, eyY-1); if (c !== T) b.px(xx, eyY-1, M.DN[c]); } });
  for (var ck = 0; ck < 3; ck++){ var cc = b.get(Math.round(fcx+rx*0.55)+ck, eyY+3); if (cc !== T) b.px(Math.round(fcx+rx*0.55)+ck, eyY+3, M.DN[cc]); }
  // Nase: heller Rücken, Schattenkante, Nasenloch
  var nl = o.nose || Math.round(ry*0.32), nY = eyY+1;
  for (var k = 0; k < nl; k++){ if (k < 2 || k === nl-1) b.px(fcx, nY+k, skin[4]); var c2 = b.get(fcx+1, nY+k); if (c2 !== T) b.px(fcx+1, nY+k, skin[2]); }
  b.px(fcx+2, nY+nl-1, skin[1]); b.px(fcx+1, nY+nl, skin[1]); b.px(fcx, nY+nl, skin[2]); b.px(fcx-1, nY+nl, skin[2]); b.px(fcx-2, nY+nl-1, skin[3]); if (o.broadNose){ b.px(fcx+3, nY+nl-1, skin[2]); b.px(fcx-3, nY+nl-1, skin[2]); }
  if (o.cheeks){ b.px(eL-1, eyY+4, o.cheeks); b.px(eL, eyY+4, o.cheeks); b.px(eR+2, eyY+4, o.cheeks); }
  // Mund (offen beim Sprechen)
  var mY = nY+nl+(o.mouthGap || Math.max(2, Math.round(ry*0.16))), mw = o.mouthW || (kid ? 5 : 6), mx0 = Math.round(fcx-mw/2), lip = o.lipCol || skin[1];
  if (variant === 'o'){ b.hl(mx0, mx0+mw-1, mY, P.k1); b.hl(mx0+1, mx0+mw-2, mY+1, P.r1); b.px(mx0+1, mY+1, P.k1); b.px(mx0+mw-2, mY+1, P.k1); b.hl(mx0+1, mx0+mw-2, mY+2, lip); }
  else { var mood = o.mouth || 'neutral';
    b.hl(mx0, mx0+mw-1, mY, M.DN[lip]); b.hl(mx0+1, mx0+mw-2, mY+1, M.UP[lip] !== undefined ? lip : lip); if (mood === 'smile'){ b.px(mx0-1, mY-1, M.DN[lip]); b.px(mx0+mw, mY-1, M.DN[lip]); } if (mood === 'frown'){ b.px(mx0-1, mY+1, lip); b.px(mx0+mw, mY+1, lip); } if (mood === 'tight'){ b.px(mx0+mw, mY, skin[2]); }
    b.hl(mx0+1, mx0+mw-2, mY+2, skin[3]); }
  b.px(fcx, mY+3, skin[2]);   // Kinngrübchen/Schatten unter der Lippe
  // Alter
  if (age >= 1){ b.px(fcx-4, nY+nl+1, skin[2]); b.px(fcx+4, nY+nl+1, skin[2]); b.px(fcx-5, nY+nl+2, skin[2]); b.px(eR+3, eyY+1, skin[2]); }
  if (age >= 2){ b.hl(fcx-4, fcx+3, eyY-7, skin[2]); b.hl(fcx-3, fcx+2, eyY-9, skin[2]); b.px(eL-3, eyY+1, skin[2]); b.px(eL-3, eyY+2, skin[2]); b.px(fcx-6, mY, skin[2]); b.px(fcx+6, mY, skin[2]); }
  // ---- Augen: Lidstrich, Weiß, Iris mit Glanz, Pupille
  var iris = o.iris || P.h2, wh = o.eyeWhite || P.s5;
  // Augen zwei Pixel hoch: Oberlid, Weiß, Iris 2×2 mit Pupille und Glanzlicht, Unterlid-Schatten
  [[eL, 4], [eR, 4]].forEach(function(e, i){ var ex = e[0], w = e[1], x0 = ex-1;
    if (variant === 'b'){ b.hl(x0, x0+w-1, eyY-1, skin[2]); b.hl(x0-(i ? 0 : 1), x0+w-1+(i ? 1 : 0), eyY, P.k1); b.hl(x0, x0+w-1, eyY+1, skin[2]); return; }
    b.hl(x0-(i ? 0 : 1), x0+w-1+(i ? 1 : 0), eyY-1, P.k1);
    for (var j = 0; j < w; j++){ b.px(x0+j, eyY, wh); b.px(x0+j, eyY+1, (j === 0 || j === w-1) ? skin[2] : M.DN[wh]); }
    var ix = x0+(i ? 1 : 2); b.px(ix, eyY, P.k0); b.px(ix-1, eyY, iris); b.px(ix-1, eyY+1, iris); b.px(ix, eyY+1, M.DN[iris]); b.px(ix-1, eyY, M.UP[M.UP[iris]] || P.s6);
    b.hl(x0, x0+w-1, eyY+2, kid ? skin[3] : skin[2]);
    if (o.lashes){ b.px(x0-1, eyY-2, P.k1); b.px(x0+w, eyY-2, P.k1); b.px(x0+w-1, eyY-2, P.k1); } });
  // Brauen
  var br = o.brow || 'flat', bc = o.browCol || hair[1], byy = eyY-3+(o.browY || 0);
  [[eL-2, 5], [eR-1, 4]].forEach(function(e, i){ for (var j = 0; j < e[1]; j++){ var yy = byy; if (br === 'up' && j === (i ? e[1]-1 : 0)) yy--; if (br === 'worried'){ if (i === 0 && j >= e[1]-2) yy--; if (i === 1 && j <= 1) yy--; } if (br === 'down' && j === (i ? 0 : e[1]-1)) yy++; if (br === 'stern'){ if (i === 0 && j >= e[1]-2) yy++; if (i === 1 && j <= 1) yy++; } b.px(e[0]+j, yy, bc); } });
  // ---- Bart
  if (o.moustache){ var mc = o.moustache; b.hl(mx0-1, mx0+mw, mY-2, mc[0]); b.hl(mx0, mx0+mw-1, mY-1, mc[1] || mc[0]); b.px(mx0-1, mY-1, mc[0]); b.px(mx0+mw, mY-1, mc[0]); b.px(mx0-2, mY, mc[0]); b.px(mx0+mw+1, mY, mc[0]); }
  if (o.stubble){ for (var sy = mY-3; sy <= cy+ry; sy++) for (var sx = Math.floor(cx-rx+2); sx <= Math.ceil(cx+rx); sx++){ var c3 = b.get(sx, sy); if (c3 !== T && c3 !== P.k1 && c3 !== P.k0 && bayer(sx, sy) < 0.3 && face(sx, sy)) b.px(sx, sy, M.DN[c3]); } }
  // ---- Brille
  if (o.glasses){ var gc = o.glasses; [[eL, 5], [eR, 4]].forEach(function(e){ var x0 = e[0]-2, x1 = x0+e[1]+1; b.hl(x0, x1, eyY-2, gc); b.hl(x0, x1, eyY+2, gc); b.vl(x0, eyY-2, eyY+2, gc); b.vl(x1, eyY-2, eyY+2, gc); b.px(x0+1, eyY-1, P.s6); }); b.hl(eL+4, eR-3, eyY-1, gc); b.hl(Math.round(cx-rx+1), eL-2, eyY-1, gc); }
  // ---- Haar und Kopfbedeckung
  var g = { cx: cx, cy: cy, rx: rx, ry: ry, fcx: fcx, eyY: eyY, hair: hair, skin: skin, face: face, q: q, kid: kid };
  if (o.hair) o.hair(b, g);
  if (o.hat) o.hat(b, g);
  if (o.after) o.after(b, { cx: cx, cy: cy, rx: rx, ry: ry, fcx: fcx, eyY: eyY, mY: mY, by: nb-5, nb: nb, hair: hair, skin: skin, cloth: cloth, variant: variant, q: q, face: face });
  M.outline(b, P.k1);
  return b; }

MA.definePortrait = function(id, d){ DEF[id] = d; delete CACHE[id]; };
MA.portrait = function(id, v){ v = v || 'n'; var d = DEF[id]; if (!d) return null; var key = id+'|'+v; if (!CACHE[key]) CACHE[key] = paint(d, v); return CACHE[key]; };
MA.hasPortrait = function(id){ return !!DEF[id]; };

// ---------------------------------------------------------------- Bausteine: Haar
// Haarkappe: Ellipse etwas größer als der Kopf, vorn bis zum Haaransatz, hinten (links) bis unter das Ohr; Strähnen und Glanz.
function hairCap(b, g, o){ o = o || {}; var vol = o.vol === undefined ? 1.6 : o.vol, line = g.cy-g.ry*(o.line === undefined ? 0.45 : o.line), back = g.cy+g.ry*(o.back === undefined ? 0.2 : o.back);
  var hx = g.cx-0.8, hy = g.cy-1.5, hrx = g.rx+vol, hry = g.ry+vol*0.8;
  for (var y = Math.floor(hy-hry); y <= Math.ceil(back); y++) for (var x = Math.floor(hx-hrx-1); x <= Math.ceil(hx+hrx+1); x++){
    var dx = (x+0.5-hx)/hrx, dy = (y+0.5-hy)/hry; if (dx*dx+dy*dy > 1) continue;
    var inFace = g.face(x, y);
    var fringeY = line+(o.fringe ? Math.max(0, (x-g.fcx+4))*o.fringe*0.12 : 0)+(o.wave ? Math.sin(x*0.9)*0.8 : 0);
    var behindEar = x < g.cx-g.rx*0.62;
    if (inFace && y > fringeY && !behindEar) continue;
    if (behindEar && y > back) continue;
    if (!inFace && y > g.cy+g.ry*0.15 && x > g.cx-g.rx*0.5) continue;
    var v = 0.6-dx*0.32-dy*0.28; if (((x*3+y*7) % 11) === 0) v -= 0.18; if (((x*5+y*3) % 13) === 0 && dy < 0) v += 0.18;
    if (o.part !== undefined && Math.abs(x-o.part) < 0.6 && y < line) v = 0.12;
    b.px(x, y, g.q(g.hair, v, x, y)); }
  if (o.sideburn){ for (var y2 = g.eyY-3; y2 <= g.eyY+2; y2++){ b.px(Math.round(g.cx-g.rx+1), y2, g.hair[1]); b.px(Math.round(g.cx-g.rx+2), y2, g.hair[2]); } } }
function hairTufts(b, g, seed, n){ var r = M.rng(seed || 7); for (var i = 0; i < (n || 6); i++){ var x = Math.round(g.cx-g.rx*0.6+r()*g.rx*1.4), y = Math.round(g.cy-g.ry-1-g.ry*0.08-r()*1.5); b.px(x, y, g.hair[2]); b.px(x+1, y+1, g.hair[1]); b.px(x, y+1, g.hair[3]); } }
function braids(b, g){ [[g.cx-g.rx-1, 1], [g.cx+g.rx-2, -1]].forEach(function(s){ for (var y = Math.round(g.cy+2); y < g.cy+g.ry+13; y++){ var x = Math.round(s[0]+(((y >> 1) % 2) ? 0 : s[1])); b.px(x, y, g.hair[((y >> 1) % 2) ? 1 : 2]); b.px(x+1, y, g.hair[((y >> 1) % 2) ? 2 : 3]); } b.rect(Math.round(s[0]), Math.round(g.cy+g.ry+13), 3, 2, P.r3); }); }

// ---------------------------------------------------------------- Bausteine: Kopfbedeckungen
function pioneerCap(b, g){ var y0 = Math.round(g.cy-g.ry-3), x0 = Math.round(g.cx-g.rx-1), x1 = Math.round(g.cx+g.rx+1), C = R('n0 n1 n2 n3');
  for (var y = y0; y <= y0+6; y++) for (var x = x0; x <= x1; x++){ var u = (x-x0)/(x1-x0), top = y0+Math.round(3-u*3+Math.abs(u-0.45)*2); if (y < top) continue; b.px(x, y, q(C, 0.7-u*0.4-(y-y0)*0.05, x, y)); }
  b.hl(x0, x1, y0+6, P.n0); var sx = Math.round(g.cx+2), sy = y0+3; b.px(sx, sy, P.r4); b.px(sx-1, sy+1, P.r3); b.px(sx+1, sy+1, P.r3); b.px(sx, sy+1, P.y4); }
function fez(b, g){ var y0 = Math.round(g.cy-g.ry-6), x0 = Math.round(g.cx-g.rx+1), x1 = Math.round(g.cx+g.rx-1), C = R('r1 r2 r3 r4');
  for (var y = y0; y <= Math.round(g.cy-g.ry*0.45); y++){ var k = (y-y0)/(g.ry*0.55+6), a = x0+Math.round((1-k)*1.5), e = x1-Math.round((1-k)*1.5); for (var x = a; x <= e; x++){ var u = (x-a)/(e-a); b.px(x, y, q(C, 0.75-u*0.5, x, y)); } }
  b.hl(x0+2, x1-2, y0, P.r4); b.line(Math.round(g.cx), y0, Math.round(g.cx-5), y0+5, P.k1); b.px(Math.round(g.cx-5), y0+6, P.k1); b.px(Math.round(g.cx-6), y0+6, P.k1); }
function headscarf(b, g, col){ var C = col || R('r1 r2 r3 r4');
  for (var y = Math.floor(g.cy-g.ry-2); y <= Math.ceil(g.cy+g.ry+2); y++) for (var x = Math.floor(g.cx-g.rx-3); x <= Math.ceil(g.cx+g.rx+2); x++){
    var dx = (x+0.5-g.cx)/(g.rx+2.6), dy = (y+0.5-g.cy)/(g.ry+2.6); if (dx*dx+dy*dy > 1) continue;
    var inner = (x+0.5-(g.fcx-0.5))/(g.rx-1.2), innerY = (y+0.5-(g.cy+1.5))/(g.ry-1.6); if (inner*inner+innerY*innerY < 1 && y > g.cy-g.ry*0.55) continue;
    var v = 0.65-dx*0.35-dy*0.2; if ((x+y) % 5 === 0 && v > 0.3) v += 0.15; b.px(x, y, q(C, v, x, y)); }
  for (var k = 0; k < 6; k++){ b.px(Math.round(g.cx-g.rx-3-k*0.4), Math.round(g.cy+g.ry*0.5+k), C[1]); b.px(Math.round(g.cx-g.rx-2-k*0.4), Math.round(g.cy+g.ry*0.5+k), C[2]); } }
function peakCap(b, g, C, band, visorCol, badge){ var y0 = Math.round(g.cy-g.ry-3), x0 = Math.round(g.cx-g.rx-2), x1 = Math.round(g.cx+g.rx+2);
  for (var y = y0; y <= y0+5; y++) for (var x = x0+(y === y0 ? 2 : 0); x <= x1-(y === y0 ? 2 : 0); x++){ var u = (x-x0)/(x1-x0); b.px(x, y, q(C, 0.72-u*0.45, x, y)); }
  b.hl(x0+1, x1-1, y0+6, band); b.hl(x0+1, x1-1, y0+7, band);
  for (var i = 0; i < 9; i++) b.px(Math.round(g.fcx-1+i), y0+8+(i > 6 ? 1 : 0), visorCol); b.hl(Math.round(g.fcx), Math.round(g.fcx+7), y0+9, P.k1);
  if (badge) badge(b, Math.round(g.fcx+1), y0+3); }
function flatCap(b, g, C){ var y0 = Math.round(g.cy-g.ry-2), x0 = Math.round(g.cx-g.rx-2), x1 = Math.round(g.cx+g.rx+3);
  for (var y = y0; y <= y0+6; y++) for (var x = x0; x <= x1; x++){ var u = (x-x0)/(x1-x0), top = y0+Math.round(Math.abs(u-0.4)*4); if (y < top) continue; b.px(x, y, q(C, 0.7-u*0.4, x, y)); }
  b.hl(Math.round(g.fcx-2), Math.round(g.fcx+8), y0+7, C[0]); b.hl(Math.round(g.fcx-1), Math.round(g.fcx+7), y0+6, C[1]); }

// ---------------------------------------------------------------- Bausteine: Kleidung
function shirtCollar(b, d, col, open){ var x = 28, y = d.by+5; col = col || P.s6; b.px(x-4, y, col); b.px(x-3, y, col); b.px(x-3, y+1, col); b.px(x-2, y+2, col); b.px(x+2, y, col); b.px(x+3, y, col); b.px(x+3, y+1, col); b.px(x+2, y+2, col); if (!open){ b.vl(x, y+3, 63, M.DN[d.cloth[2]]); for (var by = y+5; by < 64; by += 4) b.px(x, by, P.s3); } }
function pioneerScarf(b, d){ var x = 28, y = d.by+5, C = R('r1 r2 r3 r4'); for (var i = -7; i <= 7; i++){ b.px(x+i, y, C[2]); b.px(x+i, y+1, C[i < 0 ? 3 : 1]); }
  for (var k = 0; k < 9; k++){ b.hl(x-2+Math.round(k*0.2), x+1-Math.round(k*0.25), y+2+k, k % 3 === 0 ? C[1] : C[2]); } b.rect(x-1, y+1, 3, 2, C[3]); }
function lapels(b, d, col){ var x = 28, y = d.by+4; for (var k = 0; k < 10; k++){ b.px(x-3-Math.round(k*0.5), y+k, col); b.px(x+3+Math.round(k*0.5), y+k, M.DN[col]); } }

// ---------------------------------------------------------------- Die Figuren
// M.: hager, dunkle Augen, kurz geschnittenes dunkles Haar, weißes Hemd mit zu weitem Kragen; ernst, aufmerksam
MA.definePortrait('m', { kid: true, skin: SKIN.kid, hairCol: HAIR.black, rx: 12, jaw: 0.7, iris: P.h1, brow: 'flat', mouthW: 5, cloth: R('s2 s3 s4 s5 s6'), shoulder: 20,
  hair: function(b, g){ hairCap(b, g, { vol: 1.4, line: 0.5, fringe: 2, back: 0.3 }); hairTufts(b, g, 3, 5); },
  body: function(b, d){ shirtCollar(b, d, P.s6, false); b.px(17, d.nb+9, P.s3); b.px(38, d.nb+11, P.s3); } });
// Jasna: zwei Zöpfe, Pioniermütze, rotes Halstuch, wache Brauen
MA.definePortrait('jasna', { kid: true, skin: R('p2 p3 p4 p5 l0'), hairCol: HAIR.darkbrown, rx: 12, jaw: 0.68, iris: P.w2, brow: 'up', mouthW: 4, lipCol: P.p2, lashes: true, cloth: R('s2 s3 s4 s5 s6'), shoulder: 19,
  hair: function(b, g){ hairCap(b, g, { vol: 1.3, line: 0.55, back: 0.45, part: Math.round(g.cx) }); braids(b, g); }, hat: pioneerCap,
  body: function(b, d){ pioneerScarf(b, d); } });
// Nedim: Pioniermütze, abstehende Ohren, besorgter Blick
MA.definePortrait('nedim', { kid: true, skin: SKIN.kid, hairCol: HAIR.brown, rx: 11.5, ry: 14, cy: 26, jaw: 0.72, iris: P.w2, brow: 'worried', mouthW: 4, mouth: 'tight', cloth: R('s2 s3 s4 s5 s6'), shoulder: 18,
  hair: function(b, g){ hairCap(b, g, { vol: 1.1, line: 0.55, back: 0.3 }); }, hat: pioneerCap,
  body: function(b, d){ pioneerScarf(b, d); },
  after: function(b, g){ var ex = Math.round(g.cx-g.rx-2), ey = g.eyY; b.rect(ex-1, ey-2, 2, 7, g.skin[2]); b.px(ex-1, ey-2, g.skin[3]); b.px(ex-1, ey+1, g.skin[1]); } });
// Dragan: wirres helles Haar, Sommersprossen, schiefes Grinsen, Hemd offen
MA.definePortrait('dragan', { kid: true, skin: SKIN.kid, hairCol: HAIR.blond, rx: 12.5, jaw: 0.74, iris: P.b1, brow: 'down', mouthW: 6, mouth: 'smile', cloth: R('s1 s2 s3 s4 s5'), shoulder: 21,
  hair: function(b, g){ hairCap(b, g, { vol: 2.4, line: 0.42, fringe: 3, back: 0.3, wave: true }); hairTufts(b, g, 11, 8); },
  body: function(b, d){ shirtCollar(b, d, P.s5, true); },
  after: function(b, g){ [[-5, 3], [-3, 4], [3, 3], [5, 4], [-4, 5]].forEach(function(f){ b.px(Math.round(g.fcx+f[0]), g.eyY+f[1], g.skin[2]); }); } });
// Der Lehrer: schütteres Haar, runde Brille, Schnurrbart, Mantel (oben fehlt ein Knopf), müde-genaue Augen
MA.definePortrait('lehrer', { skin: SKIN.warm, hairCol: HAIR.grey, jaw: 0.78, age: 1, iris: P.e1, brow: 'stern', mouthW: 6, mouth: 'tight', glasses: P.m0, moustache: [P.e1, P.e2], cloth: R('e0 e1 e2 e3 e4'), shoulder: 25,
  hair: function(b, g){ hairCap(b, g, { vol: 0.8, line: 0.75, back: 0.35 }); for (var x = Math.round(g.cx-g.rx+3); x < g.cx+g.rx-2; x++){ var y2 = Math.round(g.cy-g.ry+1+Math.abs(x-g.cx)*0.18); if (x % 3 === 0) b.px(x, y2, g.hair[3]); } },
  body: function(b, d){ var x = 28, y = d.nb; b.rect(x-3, y, 7, 4, P.s5); b.vl(x, y, y+3, P.s3); b.rect(x-1, y+2, 3, 8, P.r1); lapels(b, d, P.e3); b.px(x+6, y+13, P.e0); b.px(x+6, y+20, P.e0); b.rect(x+5, y+7, 3, 2, M.DN[P.e1]); } });
// Mara: Kopftuch, festes Kinn, Arbeitsschürze
MA.definePortrait('mara', { skin: SKIN.warm, jaw: 0.82, age: 1, iris: P.h1, brow: 'flat', mouthW: 6, mouth: 'tight', cloth: R('w1 w2 w3 w4 w5'), shoulder: 25, noEar: true,
  hat: function(b, g){ headscarf(b, g, R('r0 r1 r2 r3')); },
  body: function(b, d){ var x = 28, y = d.nb+2; b.rect(x-9, y+4, 18, 64-y-4, P.b1); b.hl(x-9, x+8, y+4, P.b2); b.vl(x-9, y+4, 63, P.b2); b.line(x-9, y+4, x-13, y-2, P.b1); b.line(x+8, y+4, x+12, y-2, P.b0); } });
// Dedo Muratović: roter Fes mit Quaste, buschiger grauer Schnurrbart, Lachfalten, dunkle Weste
MA.definePortrait('dedo', { skin: SKIN.warm, hairCol: HAIR.white, jaw: 0.8, age: 2, iris: P.h2, brow: 'up', browCol: P.m4, broadNose: true, mouthW: 7, mouth: 'smile', moustache: [P.m4, P.s5], cloth: R('k1 k2 m0 m1 m2'), shoulder: 25,
  hair: function(b, g){ for (var y = Math.round(g.cy-g.ry*0.4); y <= g.eyY+3; y++){ b.px(Math.round(g.cx-g.rx), y, g.hair[2]); b.px(Math.round(g.cx-g.rx+1), y, g.hair[3]); } }, hat: fez,
  body: function(b, d){ shirtCollar(b, d, P.s6, true); var x = 28, y = d.nb; b.rect(x-1, y+2, 3, 64-y-2, P.s5); b.vl(x+1, y+2, 63, P.s4); b.px(x+4, y+8, P.y3); b.px(x+4, y+13, P.y3); b.px(x+4, y+18, P.y3); b.line(x+5, y+10, x+11, y+12, P.y2); } });
// Branko: gescheitelte, pomadisierte Haare, glatt rasiert, eng geknöpftes weißes Hemd, rote Armbinde
MA.definePortrait('branko', { skin: SKIN.light, hairCol: HAIR.black, rx: 12.5, ry: 16, jaw: 0.8, iris: P.h1, brow: 'flat', mouthW: 5, mouth: 'tight', cloth: R('s2 s3 s4 s5 s6'), shoulder: 24,
  hair: function(b, g){ hairCap(b, g, { vol: 1, line: 0.48, back: 0.3, part: Math.round(g.cx-3) }); for (var x = Math.round(g.cx-1); x < g.cx+g.rx-1; x += 2) b.px(x, Math.round(g.cy-g.ry-0.5), g.hair[4]); },
  body: function(b, d){ shirtCollar(b, d, P.s6, false); var x = 28, y = d.nb; b.rect(x-1, y+1, 3, 2, P.k2); b.rect(5, y+12, 7, 6, P.r3); b.hl(5, 11, y+12, P.r4); } });
// Jovan: Schirmmütze, schmaler Mund, gerade Brauen, graublaue Dienstjacke, Pfeife an der Schnur
MA.definePortrait('jovan', { skin: SKIN.light, hairCol: HAIR.black, jaw: 0.84, iris: P.h1, brow: 'stern', mouthW: 6, mouth: 'tight', stubble: true, cloth: R('c0 c1 c2 c3 c4'), shoulder: 25,
  hair: function(b, g){ hairCap(b, g, { vol: 0.8, line: 0.32, back: 0.4, sideburn: true }); },
  hat: function(b, g){ peakCap(b, g, R('c0 c1 c2 c3'), P.k2, P.k1, function(bb, x, y){ bb.px(x, y, P.y4); bb.px(x+1, y, P.y3); }); },
  body: function(b, d){ var x = 28, y = d.nb; b.rect(x-3, y, 7, 3, P.c3); b.vl(x, y+3, 63, P.c0); [y+6, y+11, y+16].forEach(function(yy){ b.px(x+2, yy, P.y3); }); b.line(x-3, y+2, x-7, y+14, P.m3); b.rect(x-8, y+14, 2, 3, P.m4); b.rect(44, y+12, 7, 5, P.s6); } });
// Der Plakatkleber: Schiebermütze, Stoppelbart, Kleisterflecken, verschmitzt
MA.definePortrait('kleber', { skin: SKIN.warm, hairCol: HAIR.darkbrown, jaw: 0.84, age: 1, iris: P.h2, brow: 'up', mouthW: 6, mouth: 'smile', stubble: true, cloth: R('n1 n2 b0 b1 b2'), shoulder: 25,
  hair: function(b, g){ hairCap(b, g, { vol: 0.8, line: 0.3, back: 0.45, sideburn: true }); }, hat: function(b, g){ flatCap(b, g, R('e0 e1 e2 e3')); },
  body: function(b, d){ var x = 28, y = d.nb; b.rect(x-3, y, 7, 3, P.s4); b.vl(x+1, y+3, 63, P.n1); [[17, y+9], [34, y+14], [23, y+17], [41, y+8]].forEach(function(s){ b.px(s[0], s[1], P.s5); b.px(s[0]+1, s[1], P.s4); }); } });
// Der Helfer: jung, Bleistift hinterm Ohr, hellblaues Hemd mit aufgekrempelten Ärmeln, freundlich, in Gedanken woanders
MA.definePortrait('helfer', { skin: SKIN.light, hairCol: HAIR.brown, rx: 12.5, jaw: 0.78, iris: P.w2, brow: 'up', mouthW: 6, mouth: 'smile', cloth: R('b1 b2 b3 b4 b5'), shoulder: 23,
  hair: function(b, g){ hairCap(b, g, { vol: 1.8, line: 0.42, fringe: 1, back: 0.3 }); },
  body: function(b, d){ shirtCollar(b, d, P.b5, true); b.rect(6, d.nb+11, 7, 5, P.r3); },
  after: function(b, g){ var ex = Math.round(g.cx-g.rx-1), ey = g.eyY-1; b.line(ex-3, ey, ex+4, ey-3, P.y3); b.px(ex-3, ey, P.k1); } });
// Tiko: heller Uniformrock mit goldenen Knöpfen, Schirmmütze mit Goldband, ein höfliches Lächeln
MA.definePortrait('tiko', { skin: SKIN.warm, hairCol: HAIR.grey, jaw: 0.86, age: 2, iris: P.b1, brow: 'flat', mouthW: 6, mouth: 'smile', cloth: R('s3 s4 s5 s6 l1'), shoulder: 26,
  hair: function(b, g){ hairCap(b, g, { vol: 0.6, line: 0.3, back: 0.3, sideburn: true }); },
  hat: function(b, g){ peakCap(b, g, R('s4 s5 s6 l1'), P.y3, P.k1, function(bb, x, y){ bb.px(x, y, P.r3); bb.px(x+1, y, P.y4); }); },
  body: function(b, d){ var x = 28, y = d.nb; b.rect(x-3, y, 7, 3, P.s6); b.vl(x+1, y+3, 63, P.s3); [y+6, y+11, y+16].forEach(function(yy){ b.px(x+3, yy, P.y3); }); b.hl(8, 15, y+9, P.y3); b.hl(8, 15, y+10, P.r3); } });
})(MA);
