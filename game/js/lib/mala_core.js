/* M. Adventure – technisch übernommen aus der MALA-Referenz ("Die Stillen", index.html, Modul 00_core.js): Palette, indizierter Framebuffer, Rasterprimitive, Dithering, Bitmap-Schrift.
   Unverändert bis auf ausdrücklich markierte Stellen (// M.ADV:). Die MALA-Fassung selbst bleibt unberührt. */
/* ---- 00_core.js ---- */
/* ===== 00_core.js — Palette, indizierter Framebuffer, Rasterprimitive, Dithering, Farbtabellen, Bitmap-Schrift =====
   Alles, was gezeichnet wird, sind Palettenindizes. Licht und Schatten sind Schritte auf Farbrampen,
   Übergänge entstehen durch geordnetes Bayer-Dithering. Keine Bilddateien. */
var M = (typeof M !== 'undefined') ? M : {};
(function(M){
'use strict';

// ---------------------------------------------------------------- Palette: Adria, Kalkstein, Terrakotta, Dämmerung, Geisterblau
var PAL_DEF = [
 ['k0','08070d'],['k1','13111c'],['k2','1e1b2a'],
 ['n0','141c36'],['n1','1f2c50'],['n2','2f4274'],['n3','4a6599'],['n4','7d97c4'],['n5','bccde6'],
 ['s0','37322d'],['s1','5a5248'],['s2','7d7364'],['s3','a39882'],['s4','c8bb9f'],['s5','e3d9c0'],['s6','f5efe0'],
 ['t0','361812'],['t1','5a2719'],['t2','853d26'],['t3','b05a34'],['t4','d4814d'],['t5','ebab76'],
 ['w0','271810'],['w1','412718'],['w2','5f3b22'],['w3','82542e'],['w4','a8743f'],['w5','cb9a5c'],
 ['g0','0e170e'],['g1','1a2a17'],['g2','2a4022'],['g3','3f5a2e'],['g4','5d773c'],['g5','8b9a55'],
 ['a0','05161f'],['a1','0a2835'],['a2','113f52'],['a3','1b5d6d'],['a4','2c808b'],['a5','57a9ab'],['a6','98d0c8'],
 ['b0','2a4a77'],['b1','3f6496'],['b2','5a82b4'],['b3','81a5cf'],['b4','afc8e4'],['b5','dce8f4'],
 ['d0','271634'],['d1','45214d'],['d2','6e2e5c'],['d3','9c4367'],['d4','c96769'],['d5','ea976f'],['d6','f6c688'],
 ['y0','3a2307'],['y1','6a400e'],['y2','a4681b'],['y3','d99a33'],['y4','f3c75c'],['y5','fff0a6'],
 ['r0','2b0b11'],['r1','4e141e'],['r2','79212e'],['r3','a53848'],['r4','cc5f68'],
 ['m0','1f232b'],['m1','363c48'],['m2','565d6b'],['m3','808796'],['m4','b0b6c1'],
 ['p0','3c2018'],['p1','6b3b2b'],['p2','995d44'],['p3','c58967'],['p4','e2b391'],['p5','f4d6bb'],
 ['q0','33201a'],['q1','593929'],['q2','83583f'],['q3','aa7b5a'],['q4','cca07f'],
 ['c0','19212f'],['c1','28374e'],['c2','3a4f6f'],['c3','577092'],['c4','7f96b2'],
 ['e0','28231a'],['e1','443a29'],['e2','63573c'],['e3','877854'],['e4','ad9e72'],
 ['h0','110c0a'],['h1','1f1511'],['h2','312119'],['h3','473024'],
 ['x0','0d202d'],['x1','1a3a4c'],['x2','2c6074'],['x3','4b8f9f'],['x4','82c1c9'],['x5','c3ecee'],['x6','eefbfb'],
 ['v0','1c152d'],['v1','33284f'],['v2','524577'],['v3','7a6fa3'],['v4','afa6d1'],['v5','e0daf2'],
 ['l0','fff2d4'],['l1','fffdf4'],
 // hellere Stufen für Sprecherfarben (Lesbarkeit im Sprechkasten, mindestens 4,5:1; angehängt, damit alle Indizes bleiben)
 ['r5','ec9199'],['g6','b4c07a'],['c5','a9bbd3'],['e5','c9b98a'],['w6','dfb378']
];
var P = {}, RGB = [];
PAL_DEF.forEach(function(e,i){ P[e[0]]=i; var h=e[1]; RGB.push([parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]); });
var T = 255;
M.P=P; M.RGB=RGB; M.T=T; M.NCOL=PAL_DEF.length; M.PNAME=PAL_DEF.map(function(e){ return e[0]; });

// Rampen (dunkel -> hell). Jede Farbe kennt ihren hellen und dunklen Nachbarn (UP/DN).
var RAMPS = [
 'k0 k1 k2 n0 n1 n2 n3 n4 n5 l1',
 'k0 s0 s1 s2 s3 s4 s5 s6 l1',
 'k0 t0 t1 t2 t3 t4 t5 l0',
 'k0 w0 w1 w2 w3 w4 w5 w6 d6',
 'k0 g0 g1 g2 g3 g4 g5 g6 s5',
 'k0 a0 a1 a2 a3 a4 a5 a6 l1',
 'n1 b0 b1 b2 b3 b4 b5 l1',
 'k1 d0 d1 d2 d3 d4 d5 d6 l0',
 'k0 y0 y1 y2 y3 y4 y5 l1',
 'k0 r0 r1 r2 r3 r4 r5 d5',
 'k0 m0 m1 m2 m3 m4 s6',
 'k0 p0 p1 p2 p3 p4 p5 l1',
 'k0 q0 q1 q2 q3 q4 p5',
 'k0 c0 c1 c2 c3 c4 c5 b4',
 'k0 e0 e1 e2 e3 e4 e5 s5',
 'k0 h0 h1 h2 h3 w2',
 'k0 x0 x1 x2 x3 x4 x5 x6 l1',
 'k0 v0 v1 v2 v3 v4 v5 l1',
 'y5 l0 l1'
];
var UP=new Uint8Array(256), DN=new Uint8Array(256), home={};
for (var i=0;i<256;i++){ UP[i]=i; DN[i]=i; }
RAMPS.forEach(function(r){ var a=r.split(' ').map(function(n){ return P[n]; });
  a.forEach(function(c,j){ if (home[c]) return; home[c]=1; UP[c]=a[Math.min(a.length-1,j+1)]; DN[c]=a[Math.max(0,j-1)]; }); });
UP[T]=T; DN[T]=T;
M.UP=UP; M.DN=DN;
M.step=function(c,n){ while(n>0){ c=UP[c]; n--; } while(n<0){ c=DN[c]; n++; } return c; };
function lum(c){ var q=RGB[c]; if (!q) return 0; return q[0]*0.3+q[1]*0.59+q[2]*0.11; }   // durchsichtig/unbekannt: dunkel
M.lum=lum;

// ---------------------------------------------------------------- Dithering, Zufall, Hash
var BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function bayer(x,y){ return (BAYER[(y&3)*4+(x&3)]+0.5)/16; }
M.bayer=bayer;
M.qd=function(v,x,y){ var f=Math.floor(v), t=(v-f-0.5)*3+0.5; if(t<0)t=0; if(t>1)t=1; return f+(t>bayer(x,y)?1:0); };
M.rng=function(seed){ var s=(seed>>>0)||1; return function(){ s^=s<<13; s>>>=0; s^=s>>>17; s^=s<<5; s>>>=0; return s/4294967296; }; };
M.hash=function(x,y){ var s=Math.sin(x*12.9898+y*78.233)*43758.5453; return s-Math.floor(s); };

// ---------------------------------------------------------------- Farbtabellen: "verwandle, dann nimm die nächste Palettenfarbe", mit Dither zwischen zwei Kandidaten
function nearest2(r,g,b){
  var best=0, bd=1e12, sec=0, sd=1e12;
  for (var i=0;i<RGB.length;i++){ var q=RGB[i], dr=q[0]-r, dg=q[1]-g, db=q[2]-b, d=dr*dr*0.3+dg*dg*0.59+db*db*0.11;
    if (d<bd){ sec=best; sd=bd; best=i; bd=d; } else if (d<sd){ sec=i; sd=d; } }
  var a=Math.sqrt(bd), s=Math.sqrt(sd), ratio=(a+s)>0? a/(a+s) : 0; // 0 = genau getroffen
  return [best,sec,ratio];
}
// fn(r,g,b) -> [r,g,b]; Ergebnis: {a,b,r} für M.tintApply
M.tintMake=function(fn){
  var A=new Uint8Array(256), B=new Uint8Array(256), R=new Float32Array(256);
  for (var i=0;i<256;i++){ if (i>=RGB.length){ A[i]=B[i]=i; R[i]=0; continue; }
    var q=RGB[i], o=fn(q[0],q[1],q[2]); var n=nearest2(Math.max(0,Math.min(255,o[0])),Math.max(0,Math.min(255,o[1])),Math.max(0,Math.min(255,o[2])));
    A[i]=n[0]; B[i]=n[1]; R[i]=Math.min(0.5,n[2]); }
  A[T]=T; B[T]=T; return {a:A,b:B,r:R};
};
// nächste Palettenfarbe (ohne Dither)
function nearest1(r,g,b){ var best=0, bd=1e12; for (var i=0;i<RGB.length;i++){ var q=RGB[i], dr=q[0]-r, dg=q[1]-g, db=q[2]-b, d=dr*dr*0.3+dg*dg*0.59+db*db*0.11; if (d<bd){ best=i; bd=d; } } return best; }
M.nearest=nearest1;
// echte Mischfarben im Palettenbild: M.mix(a,b,k8) = nächste Farbe zu a*(1-k)+b*k mit k=k8/8.
// Für Durchscheinen ohne Raster (Geister, Überblendungen). Tabellen je Stufe werden erst bei Bedarf gefüllt.
var MIXT=[];
M.mix=function(a,b,k8){ if (b===T||k8<=0) return a; if (a===T||k8>=8) return b; var t=MIXT[k8]; if (!t){ t=MIXT[k8]=new Uint8Array(65536); t.fill(255); }
  var key=(a<<8)|b, v=t[key]; if (v===255){ var p=RGB[a], q=RGB[b], f=k8/8; v=t[key]=nearest1(p[0]+(q[0]-p[0])*f, p[1]+(q[1]-p[1])*f, p[2]+(q[2]-p[2])*f); } return v; };
// Farbtabelle ohne Dither, deren Ziel nur aus einer Auswahl von Palettenfarben besteht (z. B. kühle, gedämpfte Geisterfarben)
M.tintIn=function(fn,names){ var A=new Uint8Array(256), allow=names.map(function(n){ return P[n]; }).filter(function(i){ return i!==undefined; });
  for (var i=0;i<256;i++){ if (i>=RGB.length){ A[i]=i; continue; } var q=RGB[i], o=fn(q[0],q[1],q[2],i), r=o[0], g=o[1], b=o[2], best=allow[0], bd=1e12;
    for (var j=0;j<allow.length;j++){ var c=RGB[allow[j]], dr=c[0]-r, dg=c[1]-g, db=c[2]-b, d=dr*dr*0.3+dg*dg*0.59+db*db*0.11; if (d<bd){ bd=d; best=allow[j]; } } A[i]=best; }
  A[T]=T; return A; };
M.tintPx=function(t,c,x,y){ if (c===T) return T; return (t.r[c]>0.02 && bayer(x,y)<t.r[c]) ? t.b[c] : t.a[c]; };
M.tintApply=function(buf,t,x0,y0,w,h,mask){ x0=x0||0; y0=y0||0; w=w===undefined?buf.w:w; h=h===undefined?buf.h:h;
  for (var y=Math.max(0,y0);y<Math.min(buf.h,y0+h);y++) for (var x=Math.max(0,x0);x<Math.min(buf.w,x0+w);x++){
    if (mask && !mask(x,y)) continue; var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; buf.d[k]=M.tintPx(t,c,x,y); } };
// einfache Index-Tabelle ohne Dither (für Figuren, schnell)
M.lutOf=function(t){ return t.a; };
var lumOf=function(r,g,b){ return r*0.3+g*0.59+b*0.11; };
M.TINT={
  // Nacht: dunkel, kalt, blau
  night: M.tintMake(function(r,g,b){ var L=lumOf(r,g,b); return [r*0.22+L*0.08, g*0.28+L*0.10, b*0.42+L*0.18+16]; }),
  // Dämmerung: wärmer, violett-orange, etwas dunkler
  dusk: M.tintMake(function(r,g,b){ return [r*0.80+18, g*0.58+4, b*0.66+22]; }),
  // Morgengrauen: kühl-rosa, gedämpft
  dawn: M.tintMake(function(r,g,b){ var L=lumOf(r,g,b); return [r*0.62+L*0.12+14, g*0.60+L*0.10+8, b*0.70+L*0.12+24]; }),
  // Geistersicht: entsättigt, kalt, cyan
  ghost: M.tintMake(function(r,g,b){ var L=lumOf(r,g,b); return [L*0.42+r*0.06, L*0.80+g*0.08+6, L*0.86+b*0.10+14]; }),
  // Erinnerung (Nachhall): Sepia, verblasst
  memory: M.tintMake(function(r,g,b){ var L=lumOf(r,g,b); return [L*0.95+30, L*0.80+18, L*0.58+6]; }),
  // gedimmt (Hintergrund hinter Menüs)
  dim: M.tintMake(function(r,g,b){ return [r*0.45, g*0.45, b*0.5]; }),
  // Mala als Schimmer im Titelbild
  mala: M.tintMake(function(r,g,b){ var L=lumOf(r,g,b); return [r*0.30+L*0.40+20, g*0.30+L*0.55+30, b*0.30+L*0.62+48]; }),
  // Malas Stimme, bevor Marko sie zulässt: nur ein einfarbig kaltes Flimmern (die Geister selbst: M.ghostLut in 03_cast.js)
  malaG: M.tintMake(function(r,g,b){ var L=lumOf(r,g,b); return [L*0.46+26, L*0.78+44, L*0.88+70]; })
};

// ---------------------------------------------------------------- indizierter Puffer
function Buf(w,h,fill){ this.w=w; this.h=h; this.d=new Uint8Array(w*h); if (fill!==undefined) this.d.fill(fill); }
var B=Buf.prototype;
B.px=function(x,y,c){ x|=0; y|=0; if(x<0||y<0||x>=this.w||y>=this.h||c===undefined||c===T) return; this.d[y*this.w+x]=c; };
B.get=function(x,y){ x|=0; y|=0; if(x<0||y<0||x>=this.w||y>=this.h) return T; return this.d[y*this.w+x]; };
B.rect=function(x,y,w,h,c){ for(var j=Math.max(0,y|0);j<Math.min(this.h,(y|0)+h);j++) for(var i=Math.max(0,x|0);i<Math.min(this.w,(x|0)+w);i++) this.d[j*this.w+i]=c; };
B.hl=function(x0,x1,y,c){ if(x0>x1){var t=x0;x0=x1;x1=t;} for(var i=x0;i<=x1;i++) this.px(i,y,c); };
B.vl=function(x,y0,y1,c){ if(y0>y1){var t=y0;y0=y1;y1=t;} for(var j=y0;j<=y1;j++) this.px(x,j,c); };
B.line=function(x0,y0,x1,y1,c){ x0|=0;y0|=0;x1|=0;y1|=0; var dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,e=dx+dy;
  for(;;){ this.px(x0,y0,typeof c==='function'?c(x0,y0):c); if(x0===x1&&y0===y1)break; var e2=2*e; if(e2>=dy){e+=dy;x0+=sx;} if(e2<=dx){e+=dx;y0+=sy;} } };
B.drect=function(x,y,w,h,c1,c2,level){ for(var j=y;j<y+h;j++) for(var i=x;i<x+w;i++) this.px(i,j,bayer(i,j)<level?c2:c1); };
B.fn=function(x,y,w,h,f){ for(var j=y;j<y+h;j++) for(var i=x;i<x+w;i++){ var c=f(i,j); if (c!==undefined) this.px(i,j,c); } };
B.poly=function(pts,c){
  var miny=1e9,maxy=-1e9,n=pts.length,i,j;
  for(i=0;i<n;i++){ miny=Math.min(miny,pts[i][1]); maxy=Math.max(maxy,pts[i][1]); }
  miny=Math.max(0,Math.floor(miny)); maxy=Math.min(this.h-1,Math.ceil(maxy));
  for (var y=miny;y<=maxy;y++){ var yc=y+0.5, xs=[];
    for(i=0,j=n-1;i<n;j=i++){ var a=pts[i],b=pts[j]; if((a[1]>yc)!==(b[1]>yc)) xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1])); }
    xs.sort(function(p,q){return p-q;});
    for (var k=0;k+1<xs.length;k+=2){ var xa=Math.ceil(xs[k]-0.5), xb=Math.floor(xs[k+1]-0.5);
      for (var x=xa;x<=xb;x++) this.px(x,y,typeof c==='function'?c(x,y):c); } } };
B.ellipse=function(cx,cy,rx,ry,c){ for(var y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++) for(var x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){ var dx=(x+0.5-cx)/rx, dy=(y+0.5-cy)/ry; if(dx*dx+dy*dy<=1) this.px(x,y,typeof c==='function'?c(x,y):c); } };
B.map=function(x,y,w,h,lut,mask){ for(var j=Math.max(0,y);j<Math.min(this.h,y+h);j++) for(var i=Math.max(0,x);i<Math.min(this.w,x+w);i++){ if (mask && !mask(i,j)) continue; var k=j*this.w+i, c=this.d[k]; if(c!==T) this.d[k]=lut[c]; } };
B.blit=function(src,ox,oy,flip,lut){ ox|=0; oy|=0; for(var j=0;j<src.h;j++){ var y=oy+j; if (y<0||y>=this.h) continue; for(var i=0;i<src.w;i++){ var c=src.d[j*src.w+(flip?src.w-1-i:i)]; if(c===T) continue; var x=ox+i; if (x<0||x>=this.w) continue; this.d[y*this.w+x]=lut?lut[c]:c; } } };
B.clone=function(){ var b=new Buf(this.w,this.h); b.d.set(this.d); return b; };
B.copyFrom=function(src){ this.d.set(src.d); };
M.Buf=Buf;

// Stempel aus Textzeilen mit Legende ('.' und ' ' = transparent)
M.stamp=function(rows,legend){ var h=rows.length,w=0; rows.forEach(function(r){ w=Math.max(w,r.length); });
  var b=new Buf(w,h,T); for (var y=0;y<h;y++) for (var x=0;x<rows[y].length;x++){ var ch=rows[y][x]; if (ch==='.'||ch===' ') continue; var c=legend[ch]; if (c===undefined) throw new Error('Stempel-Legende ohne '+ch); b.d[y*w+x]=c; } return b; };
M.outline=function(b,col){ col=col===undefined?P.k1:col; var add=[];
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ if (b.get(x,y)!==T) continue;
    var n=[b.get(x-1,y),b.get(x+1,y),b.get(x,y-1),b.get(x,y+1)];
    for (var i=0;i<4;i++) if (n[i]!==T && n[i]!==col){ add.push(x,y); break; } }
  for (var k=0;k<add.length;k+=2) b.px(add[k],add[k+1],col); return b; };

// ---------------------------------------------------------------- Bitmap-Schrift (eigene Zeichnung)
// Großbuchstaben 7 px hoch, Kleinbuchstaben mit x-Höhe 5 (ab Zeile 2), Unterlängen bis Zeile 8.
// Eintrag: [Startzeile, 'zeilen|getrennt|durch|striche']
var F={
 'A':[0,'.##.|#..#|#..#|####|#..#|#..#|#..#'],'B':[0,'###.|#..#|#..#|###.|#..#|#..#|###.'],
 'C':[0,'.###|#...|#...|#...|#...|#...|.###'],'D':[0,'###.|#..#|#..#|#..#|#..#|#..#|###.'],
 'E':[0,'####|#...|#...|###.|#...|#...|####'],'F':[0,'####|#...|#...|###.|#...|#...|#...'],
 'G':[0,'.###|#...|#...|#.##|#..#|#..#|.###'],'H':[0,'#..#|#..#|#..#|####|#..#|#..#|#..#'],
 'I':[0,'###|.#.|.#.|.#.|.#.|.#.|###'],'J':[0,'..##|...#|...#|...#|...#|#..#|.##.'],
 'K':[0,'#..#|#..#|#.#.|##..|#.#.|#..#|#..#'],'L':[0,'#...|#...|#...|#...|#...|#...|####'],
 'M':[0,'#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#'],'N':[0,'#..#|##.#|##.#|#.##|#.##|#..#|#..#'],
 'O':[0,'.##.|#..#|#..#|#..#|#..#|#..#|.##.'],'P':[0,'###.|#..#|#..#|###.|#...|#...|#...'],
 'Q':[0,'.##.|#..#|#..#|#..#|#..#|#.##|.###'],'R':[0,'###.|#..#|#..#|###.|#.#.|#..#|#..#'],
 'S':[0,'.###|#...|#...|.##.|...#|...#|###.'],'T':[0,'#####|..#..|..#..|..#..|..#..|..#..|..#..'],
 'U':[0,'#..#|#..#|#..#|#..#|#..#|#..#|.##.'],'V':[0,'#...#|#...#|#...#|.#.#.|.#.#.|.#.#.|..#..'],
 'W':[0,'#...#|#...#|#...#|#.#.#|#.#.#|##.##|#...#'],'X':[0,'#...#|.#.#.|.#.#.|..#..|.#.#.|.#.#.|#...#'],
 'Y':[0,'#...#|#...#|.#.#.|..#..|..#..|..#..|..#..'],'Z':[0,'####|...#|..#.|.#..|#...|#...|####'],
 'a':[2,'.##.|...#|.###|#..#|.###'],'b':[0,'#...|#...|###.|#..#|#..#|#..#|###.'],
 'c':[2,'.##|#..|#..|#..|.##'],'d':[0,'...#|...#|.###|#..#|#..#|#..#|.###'],
 'e':[2,'.##.|#..#|####|#...|.###'],'f':[0,'.##|#..|###|#..|#..|#..|#..'],
 'g':[2,'.###|#..#|#..#|.###|...#|.##.'],'h':[0,'#...|#...|###.|#..#|#..#|#..#|#..#'],
 'i':[0,'#|.|#|#|#|#|#'],'j':[0,'.#|..|.#|.#|.#|.#|.#|#.'],
 'k':[0,'#...|#...|#..#|#.#.|##..|#.#.|#..#'],'l':[0,'#.|#.|#.|#.|#.|#.|.#'],
 'm':[2,'####.|#.#.#|#.#.#|#.#.#|#.#.#'],'n':[2,'###.|#..#|#..#|#..#|#..#'],
 'o':[2,'.##.|#..#|#..#|#..#|.##.'],'p':[2,'###.|#..#|#..#|###.|#...|#...'],
 'q':[2,'.###|#..#|#..#|.###|...#|...#'],'r':[2,'#.##|##..|#...|#...|#...'],
 's':[2,'.###|#...|.##.|...#|###.'],'t':[0,'.#.|.#.|###|.#.|.#.|.#.|..#'],
 'u':[2,'#..#|#..#|#..#|#..#|.###'],'v':[2,'#...#|#...#|.#.#.|.#.#.|..#..'],
 'w':[2,'#...#|#.#.#|#.#.#|#.#.#|.#.#.'],'x':[2,'#..#|#..#|.##.|#..#|#..#'],
 'y':[2,'#..#|#..#|#..#|.###|...#|.##.'],'z':[2,'####|..#.|.#..|#...|####'],
 '0':[0,'.##.|#..#|#.##|##.#|#..#|#..#|.##.'],'1':[0,'.#|##|.#|.#|.#|.#|.#'],
 '2':[0,'.##.|#..#|...#|..#.|.#..|#...|####'],'3':[0,'###.|...#|...#|.##.|...#|...#|###.'],
 '4':[0,'#..#|#..#|#..#|####|...#|...#|...#'],'5':[0,'####|#...|###.|...#|...#|#..#|.##.'],
 '6':[0,'.##.|#...|#...|###.|#..#|#..#|.##.'],'7':[0,'####|...#|..#.|..#.|.#..|.#..|.#..'],
 '8':[0,'.##.|#..#|#..#|.##.|#..#|#..#|.##.'],'9':[0,'.##.|#..#|#..#|.###|...#|...#|.##.'],
 '.':[6,'#'],',':[6,'#|#'],':':[2,'#|.|.|.|#'],';':[2,'.#|..|..|.#|#.'],'!':[0,'#|#|#|#|#|.|#'],'?':[0,'.##.|#..#|...#|..#.|.#..|....|.#..'],
 "'":[0,'#|#'],'"':[0,'#.#|#.#'],'-':[3,'###'],'–':[3,'####'],'—':[3,'#####'],'_':[7,'####'],
 '(':[0,'.#|#.|#.|#.|#.|#.|.#'],')':[0,'#.|.#|.#|.#|.#|.#|#.'],'/':[0,'...#|...#|..#.|..#.|.#..|.#..|#...'],
 '+':[2,'.#.|###|.#.'],'*':[1,'#.#|.#.|#.#'],'&':[0,'.#..|#.#.|#.#.|.#..|#.##|#..#|.##.'],'%':[0,'#..#|...#|..#.|..#.|.#..|#...|#..#'],
 '=':[2,'###|...|###'],'#':[1,'.#.#.|#####|.#.#.|#####|.#.#.'],'<':[1,'..#|.#.|#..|.#.|..#'],'>':[1,'#..|.#.|..#|.#.|#..'],
 '„':[6,'#.#|#.#'],'“':[0,'#.#|#.#'],'”':[0,'#.#|#.#'],'‚':[6,'#|#'],'‘':[0,'#|#'],'’':[0,'#|#'],'…':[6,'#.#.#'],'·':[3,'#'],
 '°':[0,'###|#.#|###'],'ß':[0,'.##.|#..#|#..#|###.|#..#|#..#|###.|#...'],'ſ':[0,'.##|#..|#..|#..|#..|#..|#..'],'€':[0,'.###|#...|###.|#...|###.|#...|.###'],
 '↔':[2,'.#...#.|#######|.#...#.'],'→':[2,'...#.|#####|...#.'],'↓':[0,'.#.|.#.|.#.|.#.|###|.#.'],'✝':[0,'.#.|###|.#.|.#.|.#.|.#.'],'⟨':[0,'.#|.#|#.|#.|#.|.#|.#'],'⟩':[0,'#.|#.|.#|.#|.#|#.|#.'],'☎':[1,'#...#|#####|.###.|.#.#.|.###.'],'[':[0,'##|#.|#.|#.|#.|#.|##'],']':[0,'##|.#|.#|.#|.#|.#|##'],'|':[0,'#|#|#|#|#|#|#'],'~':[2,'.#.#|#.#.'],'^':[0,'.#.|#.#'],'@':[0,'.##.|#..#|#.##|#.##|#.##|#...|.###'],'$':[0,'.###|#.#.|.###|..##|#.##|.###|..#.'],'{':[0,'.##|.#.|.#.|#..|.#.|.#.|.##'],'}':[0,'##.|.#.|.#.|..#|.#.|.#.|##.'],'▸':[1,'#..|##.|###|##.|#..'],'✓':[2,'....#|...#.|#.#..|.#...']
};
var FONT={};
Object.keys(F).forEach(function(ch){ var e=F[ch], top=e[0], rows=e[1].split('|'), w=0; rows.forEach(function(r){ w=Math.max(w,r.length); });
  var px=[]; rows.forEach(function(r,y){ for (var x=0;x<r.length;x++) if (r[x]==='#') px.push(x,y+top); }); FONT[ch]={w:w,px:px}; });
FONT[' ']={w:2,px:[]};
// diakritische Zeichen: Grundbuchstabe + Zeichen darüber
function marked(base,mark){ var g=FONT[base]; var px=g.px.slice(), w=g.w, up=(base===base.toUpperCase()&&base!==base.toLowerCase()); var y0=up?-2:0, cx=Math.floor((w-1)/2);
  if (mark==='uml'){ px.push(Math.max(0,cx-1),y0+ (up?0:0)); px.push(Math.min(w-1,cx+1+(w%2===0?0:0)),y0); }
  else if (mark==='caron'){ px.push(cx-1,y0, cx+1,y0, cx,y0+1); }
  else if (mark==='acute'){ px.push(cx+1,y0, cx,y0+1); }
  else if (mark==='grave'){ px.push(cx-1,y0, cx,y0+1); }
  else if (mark==='circ'){ px.push(cx,y0, cx-1,y0+1, cx+1,y0+1); }
  return {w:w,px:px}; }
[['ä','a','uml'],['ö','o','uml'],['ü','u','uml'],['Ä','A','uml'],['Ö','O','uml'],['Ü','U','uml'],
 ['č','c','caron'],['š','s','caron'],['ž','z','caron'],['Č','C','caron'],['Š','S','caron'],['Ž','Z','caron'],
 ['ć','c','acute'],['Ć','C','acute'],['é','e','acute'],['á','a','acute'],['í','i','acute'],['ó','o','acute'],['ú','u','acute'],
 ['è','e','grave'],['à','a','grave'],['ò','o','grave'],['ù','u','grave'],['ì','i','grave'],['â','a','circ'],['ê','e','circ'],['ô','o','circ']
].forEach(function(d){ FONT[d[0]]=marked(d[1],d[2]); });
FONT['ć'].px=FONT['c'].px.concat([2,0,1,1]); FONT['Ć'].px=FONT['C'].px.concat([3,-2,2,-1]);
FONT['ä'].px=FONT['a'].px.concat([0,0,3,0]); FONT['ö'].px=FONT['o'].px.concat([0,0,3,0]); FONT['ü'].px=FONT['u'].px.concat([0,0,3,0]);
FONT['Ä'].px=FONT['A'].px.concat([0,-2,3,-2]); FONT['Ö'].px=FONT['O'].px.concat([0,-2,3,-2]); FONT['Ü'].px=FONT['U'].px.concat([0,-2,3,-2]);
FONT['č'].px=FONT['c'].px.concat([0,0,2,0,1,1]); FONT['š'].px=FONT['s'].px.concat([0,0,2,0,1,1]); FONT['ž'].px=FONT['z'].px.concat([0,0,2,0,1,1]);
FONT['ì']={w:2,px:[1,2,1,3,1,4,1,5,1,6,0,0]}; FONT['í']={w:2,px:[0,2,0,3,0,4,0,5,0,6,1,0]};
FONT['đ']={w:5,px:FONT['d'].px.concat([2,1,4,1])}; FONT['Đ']={w:5,px:[1,0,2,0,3,0,1,1,4,1,1,2,4,2,0,3,1,3,2,3,4,3,1,4,4,4,1,5,4,5,1,6,2,6,3,6]};
M.FONT=FONT;
function glyph(ch){ return FONT[ch] || FONT[ch.toLowerCase()] || FONT['?']; }
M.textWidth=function(s){ var w=0; for (var i=0;i<s.length;i++) w+=glyph(s[i]).w+1; return Math.max(0,w-1); };
M.text=function(buf,s,x,y,c,oc){ var cx=x, i, g, k;
  if (oc!==undefined){ for (i=0;i<s.length;i++){ g=glyph(s[i]); for (k=0;k<g.px.length;k+=2){ for (var oy=-1;oy<=1;oy++) for (var ox=-1;ox<=1;ox++) if (ox||oy) buf.px(cx+g.px[k]+ox,y+g.px[k+1]+oy,oc); } cx+=g.w+1; } cx=x; }
  for (i=0;i<s.length;i++){ g=glyph(s[i]); for (k=0;k<g.px.length;k+=2) buf.px(cx+g.px[k],y+g.px[k+1],c); cx+=g.w+1; }
  return cx; };
M.wrap=function(s,maxw){ var out=[]; String(s).split('\n').forEach(function(par){ var words=par.split(' '), cur='';
  words.forEach(function(w){ var t=cur?cur+' '+w:w; if (M.textWidth(t)>maxw && cur){ out.push(cur); cur=w; } else cur=t; }); out.push(cur); }); return out; };

// Mikroschrift 3x5 für Schilder in der Szene
var MF={
 'A':'.#.|#.#|###|#.#|#.#','B':'##.|#.#|##.|#.#|##.','C':'.##|#..|#..|#..|.##','D':'##.|#.#|#.#|#.#|##.','E':'###|#..|##.|#..|###','F':'###|#..|##.|#..|#..',
 'G':'.##|#..|#.#|#.#|.##','H':'#.#|#.#|###|#.#|#.#','I':'###|.#.|.#.|.#.|###','J':'..#|..#|..#|#.#|.#.','K':'#.#|#.#|##.|#.#|#.#','L':'#..|#..|#..|#..|###',
 'M':'#.#|###|###|#.#|#.#','N':'#..#|##.#|#.##|#..#|#..#','O':'.#.|#.#|#.#|#.#|.#.','P':'##.|#.#|##.|#..|#..','Q':'.#.|#.#|#.#|.#.|..#','R':'##.|#.#|##.|#.#|#.#',
 'S':'.##|#..|.#.|..#|##.','T':'###|.#.|.#.|.#.|.#.','U':'#.#|#.#|#.#|#.#|###','V':'#.#|#.#|#.#|.#.|.#.','W':'#.#|#.#|###|###|#.#','X':'#.#|#.#|.#.|#.#|#.#',
 'Y':'#.#|#.#|.#.|.#.|.#.','Z':'###|..#|.#.|#..|###','Č':'#.#|.##|#..|#..|.##','Š':'#.#|.##|##.|..#|##.','Ž':'#.#|###|.#.|#..|###','Ć':'..#|.##|#..|#..|.##',
 '0':'###|#.#|#.#|#.#|###','1':'.#.|##.|.#.|.#.|###','2':'##.|..#|.#.|#..|###','3':'##.|..#|.#.|..#|##.','4':'#.#|#.#|###|..#|..#','5':'###|#..|##.|..#|##.',
 '6':'.##|#..|###|#.#|###','7':'###|..#|.#.|.#.|.#.','8':'###|#.#|###|#.#|###','9':'###|#.#|###|..#|##.','.':'...|...|...|...|.#.',',':'...|...|...|.#.|#..',
 '-':'...|...|###|...|...',':':'...|.#.|...|.#.|...','/':'..#|..#|.#.|#..|#..','!':'.#.|.#.|.#.|...|.#.','?':'##.|..#|.#.|...|.#.',' ':'...|...|...|...|...',
 "'":'.#.|.#.|...|...|...','&':'.#.|#.#|.#.|#.#|.##','+':'...|.#.|###|.#.|...','=':'...|###|...|###|...'
};
M.microText=function(buf,s,x,y,c){ var cx=x; s.toUpperCase().split('').forEach(function(ch){ var g=(MF[ch]||MF[' ']).split('|'), gw=g[0].length; for (var r=0;r<5;r++) for (var q=0;q<gw;q++) if (g[r][q]==='#') buf.px(cx+q,y+r,c); cx+=gw+1; }); };
M.microWidth=function(s){ var w=0; s.toUpperCase().split('').forEach(function(ch){ w+=(MF[ch]||MF[' ']).split('|')[0].length+1; }); return Math.max(0,w-1); };
// Spieltitel (Arbeitstitel war „MALA“; die Speicherschlüssel heißen weiter mala.*)
M.GAME_TITLE='M. Adventure'; M.GAME_TITLE_BIG='M. ADVENTURE';   // M.ADV: eigener Titel
// große Schrift (skaliert, mit Schatten)
M.big=function(buf,s,cx,y,c,scale,shadow){ scale=scale||2; var w=M.textWidth(s), tmp=new Buf(w+2,12,T); M.text(tmp,s,0,2,c); var x0=Math.round(cx-w*scale/2);
  if (shadow!==false) for (var yy=0;yy<tmp.h;yy++) for (var xx=0;xx<tmp.w;xx++) if (tmp.get(xx,yy)!==T) buf.rect(x0+xx*scale+1,y+(yy-2)*scale+1,scale,scale,shadow===undefined?P.k0:shadow);
  for (yy=0;yy<tmp.h;yy++) for (xx=0;xx<tmp.w;xx++) if (tmp.get(xx,yy)!==T) buf.rect(x0+xx*scale,y+(yy-2)*scale,scale,scale,c); };
})(M);

