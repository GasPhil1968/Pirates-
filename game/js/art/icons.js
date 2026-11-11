/* ===== M. Adventure – art/icons.js =====
   Inventarsymbole 32 × 24 aus der MALA-Palette (dunkle Kontur wie die Figuren). */
(function(MA){
'use strict';
var P = M.P, T = M.T;
var IC = {}, CACHE = {};
function icon(fn){ return function(){ var b = new M.Buf(32, 24, T); fn(b); M.outline(b, P.k1); return b; }; }
function paper(b, x, y, w, h, c){ b.rect(x, y, w, h, c || P.s6); b.vl(x+w-1, y, y+h-1, P.s4); b.hl(x, x+w-1, y+h-1, P.s4); }
function lines(b, x, y, w, n, c){ for (var i = 0; i < n; i++) b.hl(x, x+w-1-((i*3) % 4), y+i*2, c || P.s3); }
IC.heft = icon(function(b){ b.rect(7, 4, 18, 16, P.b1); b.rect(8, 5, 16, 14, P.b2); b.hl(8, 23, 5, P.b3); b.rect(11, 9, 10, 4, P.s6); b.hl(12, 19, 10, P.s3); b.vl(7, 4, 19, P.b0); });
IC.bleistift = icon(function(b){ b.line(6, 18, 24, 6, P.y3); b.line(7, 18, 25, 6, P.y2); b.line(5, 19, 6, 18, P.w4); b.px(4, 20, P.k1); b.px(25, 5, P.r3); b.px(26, 5, P.r3); });
IC.auftrag = icon(function(b){ paper(b, 8, 3, 16, 19); lines(b, 10, 6, 11, 4); b.line(11, 17, 15, 15, P.n2); b.line(15, 15, 20, 18, P.n2); b.px(21, 16, P.n2); });
IC.beutel = icon(function(b){ b.poly([[8, 9], [24, 9], [26, 21], [6, 21]], P.e3); b.hl(7, 25, 21, P.e1); b.rect(9, 6, 14, 4, P.e2); b.line(12, 6, 14, 3, P.e1); b.line(20, 6, 18, 3, P.e1); b.rect(12, 13, 8, 5, P.s6); b.hl(13, 18, 15, P.s3); });
IC.karton = icon(function(b){ b.poly([[4, 8], [26, 5], [28, 17], [6, 20]], P.w3); b.line(4, 8, 26, 5, P.w5); b.line(6, 20, 28, 17, P.w1); });
IC.raster = icon(function(b){ b.poly([[4, 8], [26, 5], [28, 17], [6, 20]], P.w3); for (var i = 1; i < 4; i++) b.line(4+i*5.5, 8-i*0.8, 6+i*5.5, 20-i*0.8, P.k2); for (var j = 1; j < 3; j++) b.line(4+j*0.7, 8+j*4, 26+j*0.7, 5+j*4, P.k2); });
IC.einsatz = icon(function(b){ b.rect(5, 6, 22, 13, P.w3); b.hl(5, 26, 6, P.w5); for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) b.rect(7+c*5, 8+r*4, 3, 2, P.w0); });
IC.lohn = icon(function(b){ [[9, 13], [16, 10], [21, 15], [13, 17]].forEach(function(c){ b.ellipse(c[0], c[1], 4, 3, P.m3); b.ellipse(c[0], c[1]-0.5, 3, 2, P.m4); b.px(c[0], c[1]-1, P.s6); }); });
IC.klammern = icon(function(b){ [8, 15, 22].forEach(function(x){ b.rect(x, 5, 3, 14, P.w4); b.vl(x+1, 5, 18, P.w3); b.rect(x-1, 10, 5, 2, P.m3); }); });
IC.reste = icon(function(b){ b.poly([[5, 9], [14, 7], [15, 15], [6, 17]], P.w3); b.poly([[15, 11], [26, 9], [27, 19], [17, 20]], P.w2); b.line(15, 11, 26, 9, P.w4); });
IC.lieferschein = icon(function(b){ paper(b, 8, 3, 16, 19, P.s5); b.hl(10, 21, 6, P.r3); lines(b, 10, 9, 11, 5); });
IC.schein_ok = icon(function(b){ paper(b, 8, 3, 16, 19, P.s5); b.hl(10, 21, 6, P.r3); lines(b, 10, 9, 11, 3); b.line(11, 18, 14, 16, P.n2); b.line(14, 16, 17, 19, P.n2); b.line(17, 19, 21, 15, P.n2); });
IC.kiste = icon(function(b){ b.rect(4, 10, 24, 11, P.w2); b.hl(4, 27, 10, P.w4); b.hl(4, 27, 15, P.w1); for (var i = 0; i < 4; i++){ b.rect(7+i*5, 4, 3, 6, P.g3); b.px(8+i*5, 3, P.g2); b.px(7+i*5, 5, P.g5); } });
IC.kiste_leer = icon(function(b){ b.rect(4, 10, 24, 11, P.w2); b.hl(4, 27, 10, P.w4); b.hl(4, 27, 15, P.w1); b.rect(6, 11, 20, 3, P.w0); });
IC.sandale = icon(function(b){ b.poly([[6, 15], [24, 11], [27, 15], [8, 19]], P.w2); b.line(6, 15, 24, 11, P.w4); b.line(12, 13, 13, 8, P.w1); b.line(13, 8, 18, 9, P.w1); b.line(19, 12, 22, 7, P.w1); b.px(23, 6, P.w1); });
IC.senkel = icon(function(b){ for (var x = 5; x < 27; x++){ var y = 12+Math.round(Math.sin(x*0.5)*4); b.px(x, y, P.e4); b.px(x, y+1, P.e2); } b.rect(4, 15, 2, 2, P.m3); b.rect(26, 9, 2, 2, P.m3); });
IC.schuh = icon(function(b){ b.poly([[5, 9], [13, 9], [16, 13], [27, 15], [27, 19], [5, 19]], P.w1); b.hl(5, 27, 19, P.k2); b.rect(5, 17, 6, 3, P.k2); b.line(14, 11, 18, 13, P.s5); b.line(15, 13, 19, 11, P.s5); b.hl(6, 12, 10, P.w2); });
IC.stecken = icon(function(b){ b.line(4, 20, 27, 4, P.w3); b.line(5, 20, 28, 4, P.w2); b.line(19, 8, 23, 12, P.m3); b.line(20, 8, 24, 12, P.m4); b.px(13, 13, P.m2); b.px(12, 14, P.m4); });
IC.abrieb = icon(function(b){ paper(b, 6, 4, 20, 17); b.drect(9, 8, 14, 9, P.s6, P.m3, 0.45); b.hl(10, 21, 12, P.k2); b.px(12, 11, P.k2); b.px(15, 11, P.k2); b.px(18, 11, P.k2); b.px(21, 11, P.k2); });
IC.loeffel = icon(function(b){ b.line(5, 18, 18, 9, P.m3); b.line(6, 18, 19, 9, P.m4); b.ellipse(22, 7, 4.5, 3, P.m3); b.ellipse(22, 6.5, 3, 1.8, P.s5); });
IC.loeffel_k = icon(function(b){ b.line(5, 18, 18, 9, P.m3); b.line(6, 18, 19, 9, P.m4); b.ellipse(22, 7, 4.5, 3, P.m3); b.ellipse(22, 6.5, 3, 1.8, P.s6); b.px(21, 5, P.s4); b.px(23, 6, P.s4); });
IC.murmel = icon(function(b){ b.ellipse(16, 12, 6, 6, P.b2); b.ellipse(16, 12, 4, 4, P.b3); b.line(12, 13, 19, 9, P.b4); b.px(14, 9, P.s6); b.px(13, 10, P.s6); });
IC.zeitung = icon(function(b){ paper(b, 5, 4, 22, 17, P.s5); b.hl(7, 24, 6, P.k2); b.hl(7, 24, 7, P.k2); b.rect(7, 9, 8, 6, P.m2); lines(b, 17, 9, 8, 5, P.m2); lines(b, 7, 16, 8, 2, P.m2); });
IC.fahne = icon(function(b){ b.line(6, 22, 12, 2, P.w2); b.poly([[12, 2], [27, 4], [26, 13], [10, 12]], P.s5); b.hl(14, 24, 5, P.k2); b.hl(14, 22, 8, P.m2); });
IC.netz = icon(function(b){ for (var y = 6; y < 21; y += 3) b.hl(7, 25, y, P.e3); for (var x = 7; x < 26; x += 3) b.vl(x, 6, 20, P.e3); b.hl(6, 26, 5, P.e2); });
IC.leine = icon(function(b){ for (var a = 0; a < 6.2; a += 0.12){ var r = 5+a*0.9; b.px(Math.round(16+Math.cos(a*2)*r*0.9), Math.round(12+Math.sin(a*2)*r*0.55), P.e4); } b.line(22, 14, 28, 20, P.e3); });
IC.netzleine = icon(function(b){ for (var y = 9; y < 21; y += 3) b.hl(9, 23, y, P.e3); for (var x = 9; x < 24; x += 3) b.vl(x, 9, 20, P.e3); b.line(16, 9, 16, 2, P.e4); b.line(16, 2, 26, 2, P.e4); });
IC.kreide = icon(function(b){ b.rect(8, 10, 16, 5, P.s6); b.hl(8, 23, 14, P.s4); b.vl(23, 10, 14, P.s4); b.px(7, 12, P.s5); });
IC.skizze = icon(function(b){ paper(b, 7, 3, 18, 19); b.ellipse(16, 12, 5.5, 5.5, P.k2); b.ellipse(16, 12, 4.5, 4.5, P.s6); [[14, 10], [18, 10], [14, 14], [18, 14]].forEach(function(p){ b.px(p[0], p[1], P.k2); }); });
IC.tafel = icon(function(b){ b.rect(4, 5, 24, 15, P.w2); b.hl(4, 27, 5, P.w4); M.microText(b, 'KNOPF', 7, 9, P.s6); });
IC.pfeife = icon(function(b){ b.rect(7, 10, 13, 6, P.m3); b.hl(7, 19, 10, P.m4); b.ellipse(22, 13, 4, 4, P.m3); b.ellipse(22, 13, 2, 2, P.k1); b.line(7, 12, 3, 4, P.r3); });
IC.ball = icon(function(b){ b.ellipse(16, 12, 8, 8, P.s5); b.line(10, 9, 22, 15, P.w2); b.line(13, 5, 15, 19, P.w2); b.ellipse(16, 12, 2, 2, P.k2); b.px(12, 7, P.s6); });
IC.ausweis = icon(function(b){ b.rect(6, 5, 20, 14, P.s6); b.rect(8, 7, 6, 7, P.m2); b.ellipse(11, 9, 1.8, 2, P.p3); lines(b, 16, 8, 8, 3); M.microText(b, 'III/4', 13, 14, P.r3); });
IC.vorlage = icon(function(b){ paper(b, 7, 3, 18, 19); b.rect(9, 7, 14, 6, P.s6); b.hl(9, 22, 7, P.k2); b.hl(9, 22, 12, P.k2); b.vl(9, 7, 12, P.k2); b.vl(22, 7, 12, P.k2); b.hl(11, 20, 9, P.r3); lines(b, 10, 15, 12, 3); });
MA.icon = function(id){ var it = MA.ITEMS[id], key = id+'|'+(it && it.iconKey ? it.iconKey(MA.GS) : ''); if (CACHE[key]) return CACHE[key]; var fn = IC[(it && it.icon) || id] || IC.heft; var b = fn(); if (it && it.iconAfter) it.iconAfter(b, MA.GS); return (CACHE[key] = b); };
MA.ICONS = IC;
})(MA);
