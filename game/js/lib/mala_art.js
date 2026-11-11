/* M. Adventure – technisch übernommen aus der MALA-Referenz ("Die Stillen", index.html, Modul 01_art.js): Malkasten (Rampen, Licht, Himmel, Fluchtpunkt-Räume, Texturen, Requisiten).
   Unverändert bis auf ausdrücklich markierte Stellen (// M.ADV:). Die MALA-Fassung selbst bleibt unberührt. */
/* ---- 01_art.js ---- */
/* ===== 01_art.js — der Malkasten: Rampen, Licht, Himmel, Meer, Fluchtpunkt-Räume, Texturen, Requisiten, Tageszeit =====
   Alle Funktionen schreiben Palettenindizes. Eine Rampe ist ein Array von Indizes, dunkel -> hell: M.R('s1 s2 s3'). */
(function(M){
'use strict';
var P=M.P, T=M.T, Buf=M.Buf, hash=M.hash, bayer=M.bayer;
var SH=144;
M.SH=SH;
M.R=function(names){ return names.split(' ').map(function(n){ if (P[n]===undefined) throw new Error('keine Farbe '+n); return P[n]; }); };
M.rampAt=function(ramp,v,x,y){ var f=Math.max(0,Math.min(0.9999,v))*(ramp.length-1), i=Math.floor(f), fr=f-i; return ramp[Math.min(ramp.length-1,i+(fr>bayer(x,y)?1:0))]; };

// ---------------------------------------------------------------- Ebenen (Requisiten, die mit Figuren tiefensortiert werden)
// base = y, an dem das Ding auf dem Boden steht. Figuren mit Füßen unterhalb von base stehen davor.
M.layer=function(x,y,w,h,base){ var b=new Buf(w,h,T); b.ox=x; b.oy=y; b.base=base; return b; };
M.lw=function(b){ var o={buf:b};
  ['px','rect','hl','vl','line','drect','ellipse','poly','fn','get'].forEach(function(k){});
  o.px=function(x,y,c){ b.px(x-b.ox,y-b.oy,c); };
  o.get=function(x,y){ return b.get(x-b.ox,y-b.oy); };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) b.px(i-b.ox,j-b.oy,c); };
  o.hl=function(x0,x1,y,c){ b.hl(x0-b.ox,x1-b.ox,y-b.oy,c); };
  o.vl=function(x,y0,y1,c){ b.vl(x-b.ox,y0-b.oy,y1-b.oy,c); };
  o.line=function(x0,y0,x1,y1,c){ b.line(x0-b.ox,y0-b.oy,x1-b.ox,y1-b.oy,c); };
  o.drect=function(x,y,w,h,c1,c2,l){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) b.px(i-b.ox,j-b.oy,bayer(i,j)<l?c2:c1); };
  o.ellipse=function(cx,cy,rx,ry,c){ b.ellipse(cx-b.ox,cy-b.oy,rx,ry,typeof c==='function'?function(x,y){ return c(x+b.ox,y+b.oy); }:c); };
  o.poly=function(pts,c){ b.poly(pts.map(function(p){ return [p[0]-b.ox,p[1]-b.oy]; }),typeof c==='function'?function(x,y){ return c(x+b.ox,y+b.oy); }:c); };
  o.fn=function(x,y,w,h,f){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++){ var c=f(i,j); if (c!==undefined) b.px(i-b.ox,j-b.oy,c); } };
  o.text=function(s,x,y,c,oc){ M.text(b,s,x-b.ox,y-b.oy,c,oc); };
  o.micro=function(s,x,y,c){ M.microText(b,s,x-b.ox,y-b.oy,c); };
  o.blit=function(s,x,y,f){ b.blit(s,x-b.ox,y-b.oy,f); };
  return o; };

// ---------------------------------------------------------------- Licht
M.light=function(b,fn,ox,oy,mask){ ox=ox||0; oy=oy||0;
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; if (mask && !mask(x+ox,y+oy)) continue;
    var L=M.qd(fn(x+ox,y+oy),x+ox,y+oy); while (L>0){ c=M.UP[c]; L--; } while (L<0){ c=M.DN[c]; L++; } b.d[k]=c; } };
M.lf={
  pool:function(cx,cy,rx,ry,amt,pow){ return function(x,y){ var dx=(x-cx)/rx, dy=(y-cy)/ry, a=1-dx*dx-dy*dy; return a>0?amt*Math.pow(a,pow||0.8):0; }; },
  vignette:function(w,h,amt){ return function(x,y){ var cx=(x-w/2)/(w*0.6), cy=(y-h/2)/(h*0.75), v=cx*cx+cy*cy; return -Math.max(0,v-0.35)*amt; }; },
  band:function(y0,y1,a0,a1){ return function(x,y){ if (y<=y0) return a0; if (y>=y1) return a1; return a0+(a1-a0)*(y-y0)/(y1-y0); }; },
  xband:function(x0,x1,a0,a1){ return function(x){ if (x<=x0) return a0; if (x>=x1) return a1; return a0+(a1-a0)*(x-x0)/(x1-x0); }; },
  k:function(v){ return function(){ return v; }; },
  beam:function(x0,y0,x1,y1,w0,w1,amt){ return function(x,y){ var vx=x1-x0, vy=y1-y0, L2=vx*vx+vy*vy, t=((x-x0)*vx+(y-y0)*vy)/L2; if (t<0||t>1) return 0; var px=x0+vx*t, py=y0+vy*t, d=Math.hypot(x-px,y-py), w=w0+(w1-w0)*t; return d<w? amt*(1-d/w)*(1-t*0.6):0; }; },
  sum:function(){ var fs=[].slice.call(arguments); return function(x,y){ var s=0; for (var i=0;i<fs.length;i++) s+=fs[i](x,y); return s; }; }
};
M.darken=function(b,x0,y0,w,h,n){ for (var y=y0;y<y0+h;y++) for (var x=x0;x<x0+w;x++){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); } };

// ---------------------------------------------------------------- Himmel, Inseln, Meer
M.vgrad=function(b,x0,y0,w,h,ramp,rev){ for (var y=y0;y<y0+h;y++){ var v=(y-y0)/Math.max(1,h-1); if (rev) v=1-v; for (var x=x0;x<x0+w;x++) b.px(x,y,M.rampAt(ramp,v,x,y)); } };
var SKY={
  day:  {ramp:'b1 b2 b3 b4 b5', cloud:['s5','s6','b4']},
  dusk: {ramp:'d0 d1 d2 d3 d4 d5 d6', cloud:['d2','d3','d5']},
  night:{ramp:'k0 k1 k2 n0 n1', cloud:['k2','n0','n1']},
  dawn: {ramp:'n1 n2 d2 d3 d4 d5', cloud:['n2','d3','d5']}
};
M.sky=function(b,x0,y0,w,h,tod,seed){ var s=SKY[tod]||SKY.day, ramp=M.R(s.ramp);
  for (var y=y0;y<y0+h;y++){ var v=(y-y0)/Math.max(1,h-1); if (tod==='day') v=0.15+v*0.85; for (var x=x0;x<x0+w;x++) b.px(x,y,M.rampAt(ramp,v,x,y)); }
  var r=M.rng(seed||11), cl=M.R(s.cloud.join(' '));
  for (var i=0;i<Math.max(3,w/36);i++){ var cx=x0+r()*w, cy=y0+3+r()*h*0.7, rx=14+r()*34, ry=1.5+r()*2.5;
    for (var yy=Math.floor(cy-ry);yy<=cy+ry;yy++) for (var xx=Math.floor(cx-rx);xx<=cx+rx;xx++){ var dx=(xx-cx)/rx, dy=(yy-cy)/ry; if (dx*dx+dy*dy>1) continue; if (bayer(xx,yy)<dx*dx*0.9) continue; if (yy<y0||yy>=y0+h) continue;
      b.px(xx,yy, dy>0.25?cl[0]:(dy<-0.3?cl[2]:cl[1])); } }
  if (tod==='night'){ for (i=0;i<w*h/70;i++){ var sx=x0+Math.floor(r()*w), sy=y0+Math.floor(r()*h*0.85); b.px(sx,sy,r()<0.2?P.n5:(r()<0.5?P.n4:P.n3)); } }
  if (tod==='dusk'){ var gy=y0+h-2; for (x=x0;x<x0+w;x++){ if (bayer(x,gy)<0.6) b.px(x,gy,P.d6); } }
};
M.moon=function(b,cx,cy,r){ b.ellipse(cx,cy,r,r,function(x,y){ var dx=x-cx, dy=y-cy; return (dx*0.7+dy*0.5>r*0.3)?P.n4:P.n5; }); b.px(cx-1,cy-1,P.l1); };
// Inseln am Horizont (Brač, Šolta) und Berge (Mosor): weiche Silhouetten
M.islands=function(b,x0,x1,hz,tod,seed,opt){ opt=opt||{}; var r=M.rng(seed||3), far=tod==='night'?P.k2:(tod==='dusk'?P.d2:(tod==='dawn'?P.n2:P.b2)), near=tod==='night'?P.k1:(tod==='dusk'?P.d1:(tod==='dawn'?P.n1:P.b1));
  var ph=r()*10, amp=opt.amp||5;
  for (var x=x0;x<x1;x++){ var h=Math.round(amp*0.6+Math.sin(x*0.013+ph)*amp*0.5+Math.sin(x*0.051+ph*2)*1.6+(opt.bump?opt.bump(x):0)); h=Math.max(0,h);
    for (var y=hz-h;y<hz;y++){ var c=(y<hz-h+1)?far:(bayer(x,y)<0.35?far:near); b.px(x,y,c); } } };
// Meeresfläche (statisch, für paint) und animiert (für dynamic)
var SEA={ day:'a2 a3 a4 a5 a6', dusk:'d1 d2 a2 d3 d4', night:'k0 a0 a1 n0 n1', dawn:'n1 a2 n2 d3 a4' };
M.seaRamp=function(tod){ return M.R(SEA[tod]||SEA.day); };
M.sea=function(b,x0,y0,w,h,tod,t,camX){ var ramp=M.seaRamp(tod); camX=camX||0; t=t||0;
  for (var y=y0;y<y0+h;y++){ var d=(y-y0)/Math.max(1,h); for (var x=x0;x<x0+w;x++){ var wx=x+camX;
    var s=Math.sin(wx*0.11+y*0.9+t*1.4)+Math.sin(wx*0.037-t*0.7+y*0.33);
    var v=0.55-d*0.35+s*0.11; var c=M.rampAt(ramp,v,x,y); if (s>1.6 && (y&1)) c=ramp[ramp.length-1]; b.px(x,y,c); } } };
// Glitzerstreifen (Sonne, Mond, Laternen) über dem Wasser — in dynamic aufrufen
M.glints=function(b,cx,y0,y1,spread,t,col,camX){ camX=camX||0; for (var y=y0;y<y1;y++){ var k=(y-y0)/(y1-y0+1), half=2+spread*k; for (var x=Math.floor(cx-half);x<=cx+half;x++){ var sx=x-camX; var f=Math.sin(x*0.7+y*1.9+t*3)+Math.sin(x*0.23-t*2+y); if (f>1.25 && sx>=0 && sx<b.w) b.px(sx,y,col); } } };

// ---------------------------------------------------------------- Fluchtpunkt-Innenraum
// spec.rect = Rückwand [x0,y0,x1,y1] (y1 = Bodenlinie hinten), spec.vp = Fluchtpunkt.
// Rückruffunktionen bekommen Flächenkoordinaten:
//   back(u,v,x,y)        u quer über die Rückwand, v von oben
//   side(u,v,x,y,'L'|'R') u = Tiefe zum Betrachter hin (0 an der Rückwand), v = Höhe auf Rückwandmaß
//   floor(xb,d,x,y)       xb = auf die hintere Bodenlinie projiziertes x, d = Tiefe in Zeilen
//   ceil(xb,d,x,y)
M.box=function(b,spec){ var vp=spec.vp, r=spec.rect, H0=spec.h||b.h, bx0=r[0], by0=r[1], bx1=r[2], by1=r[3];
  for (var y=0;y<H0;y++) for (var x=0;x<b.w;x++){ var c;
    if (x>=bx0&&x<bx1&&y>=by0&&y<by1){ if (spec.back) c=spec.back(x-bx0,y-by0,x,y); }
    else if (y>=by1 && spec.floor){ var t=(by1-vp[1])/(y-vp[1]), xb=vp[0]+(x-vp[0])*t; if (xb>=bx0-0.5&&xb<=bx1+0.5) c=spec.floor(xb,y-by1,x,y); else c=side(x,y); }
    else if (y<by0 && spec.ceil){ var t2=(vp[1]-by0)/(vp[1]-y), xc=vp[0]+(x-vp[0])*t2; if (xc>=bx0-0.5&&xc<=bx1+0.5) c=spec.ceil(xc,by0-y,x,y); else c=side(x,y); }
    else c=side(x,y);
    if (c!==undefined) b.px(x,y,c); }
  function side(x,y){ if (!spec.side) return undefined; var sd=x<bx0?'L':(x>=bx1?'R':null); if (!sd) return undefined;
    var ex=sd==='L'?bx0:bx1, t=(ex-vp[0])/(x-vp[0]); if (t<=0) return undefined; var v=vp[1]+(y-vp[1])*t;
    if (v<by0 && spec.ceil) return undefined; if (v>=by1) return undefined;
    var u=(1/t-1)*(sd==='L'?(vp[0]-bx0):(bx1-vp[0])); return spec.side(u,v-by0,x,y,sd); } };
// Punkt auf einer Seitenwand (für Türen/Fenster): u = Tiefe, vy = Höhe als y auf der Rückwandebene
M.wallPt=function(spec,sd,u,vy){ var vp=spec.vp, r=spec.rect, D=sd==='L'?(vp[0]-r[0]):(r[2]-vp[0]), ex=sd==='L'?r[0]:r[2], k=1+u/D; return [vp[0]+(ex-vp[0])*k, vp[1]+(vy-vp[1])*k]; };
M.wallQuad=function(spec,sd,u0,u1,vT,vB){ return [M.wallPt(spec,sd,u0,vT),M.wallPt(spec,sd,u1,vT),M.wallPt(spec,sd,u1,vB),M.wallPt(spec,sd,u0,vB)]; };
M.persp=function(vp,backY){ return { x:function(xb,y){ return vp[0]+(xb-vp[0])*(y-vp[1])/(backY-vp[1]); }, xb:function(x,y){ return vp[0]+(x-vp[0])*(backY-vp[1])/(y-vp[1]); } }; };

// ---------------------------------------------------------------- Texturen
M.tex={
  planks:function(xb,y,vpY,backY,ramp,bw){ ramp=ramp||M.R('w1 w2 w3 w4'); bw=bw||8; var bi=Math.floor((xb+4000)/bw), fx=(xb+4000)/bw-bi, tone=hash(bi,3), base=tone<0.3?ramp[1]:(tone<0.85?ramp[2]:ramp[1]), c=base;
    var edge=0.5*(backY-vpY)/Math.max(1,(y-vpY)); if (fx<edge*0.9) c=ramp[0]; var jy=backY+3+Math.floor(hash(bi,9)*40); if (y===jy||y===jy+23) c=ramp[0];
    var g=hash(bi*7+Math.floor(fx*4),Math.floor(y/(2+(y-vpY)/28))); if (c===base&&g<0.1) c=M.DN[base]; if (c===base&&g>0.94) c=M.UP[base]; return c; },
  boards:function(u,v,ramp,bh){ ramp=ramp||M.R('w1 w2 w3 w4'); bh=bh||6; var bi=Math.floor(v/bh), fv=v-bi*bh, off=hash(bi,2)*40, L=30+hash(bi,4)*24, seam=Math.floor((u+off)/L), c=ramp[1+(hash(bi,seam)<0.5?1:0)];
    if (fv<1) c=ramp[0]; else if (fv===1&&hash(bi,seam+7)<0.6) c=M.UP[c]; if ((u+off)%L<1) c=ramp[0]; var g=hash(Math.floor(u/3)+bi*31,Math.floor(v)); if (g<0.07) c=M.DN[c]; if (g>0.96) c=M.UP[c]; return c; },
  // Kalksteinquader (Split!): helle, unregelmäßige Blöcke mit feinen Fugen
  ashlar:function(u,v,ramp,sw,sh){ ramp=ramp||M.R('s2 s3 s4 s5'); sw=sw||18; sh=sh||9; var row=Math.floor(v/sh), off=hash(row,1)*sw, col=Math.floor((u+off)/sw), fu=(u+off)-col*sw, fv=v-row*sh;
    if (fv<1||fu<1) return ramp[0]; var t=hash(col,row*3), c=t<0.3?ramp[1]:(t<0.85?ramp[2]:ramp[3]); if (fv<2&&fu<sw-2&&t>0.4) c=M.UP[c]; if (fu>=sw-1||fv>=sh-1) c=M.DN[c];
    var p=hash(u*3+col,v*7+row); if (p<0.06) c=M.DN[c]; else if (p>0.97) c=M.UP[c]; return c; },
  // poliertes Kalksteinpflaster (Riva, Peristil, Gassen): glatte Platten, glänzend
  paving:function(x,y,ramp,s){ ramp=ramp||M.R('s2 s3 s4 s5'); s=s||14; var sy=Math.max(3,s*0.42), row=Math.floor(y/sy), off=(row%2)*s*0.5+hash(row,5)*4, col=Math.floor((x+off)/s), fx=(x+off)-col*s, fy=y-row*sy;
    if (fy<1||fx<1) return ramp[0]; var t=hash(col,row), c=t<0.35?ramp[1]:(t<0.9?ramp[2]:ramp[3]); if (fy<1.5 && fx>2) c=M.UP[c]; if (hash(x,y)<0.04) c=M.DN[c]; return c; },
  cobble:function(x,y,ramp,s){ ramp=ramp||M.R('s1 s2 s3 s4'); s=s||6; var sy=Math.max(2,s*0.55), row=Math.floor(y/sy), off=(row%2)*s/2, col=Math.floor((x+off)/s), fx=(x+off)-col*s, fy=y-row*sy;
    var dx=(fx-s/2)/(s/2), dy=(fy-sy/2)/(sy/2), d=dx*dx+dy*dy; if (d>0.85) return ramp[0]; var c=hash(col,row)<0.5?ramp[1]:ramp[2]; if (dy<-0.3&&dx<0.3) c=M.UP[c]; if (dy>0.5) c=M.DN[c]; return c; },
  plaster:function(u,v,ramp,stain){ ramp=ramp||M.R('s3 s4 s5'); var h=hash(Math.floor(u/3),Math.floor(v/2)), c=ramp[1]; if (h<0.1) c=ramp[0]; else if (h>0.94) c=ramp[2];
    if (stain){ var s=Math.sin(u*0.07)+Math.sin(u*0.19+2)+Math.sin(v*0.05); if (v>stain && s>0.7 && bayer(u,v)<(v-stain)/40) c=M.DN[c]; } return c; },
  tiles:function(u,v,a,b,s){ s=s||8; var cu=Math.floor(u/s), cv=Math.floor(v/s), c=((cu+cv)%2)?a:b; if (u-cu*s<1||v-cv*s<1) c=M.DN[c]; return c; },
  terrazzo:function(x,y,ramp){ ramp=ramp||M.R('s2 s3 s4'); var h=hash(x,y), c=ramp[1]; if (h<0.12) c=ramp[0]; else if (h>0.9) c=ramp[2]; else if (h>0.86) c=P.t3; return c; },
  wallpaper:function(u,v,ramp){ ramp=ramp||M.R('g2 g3 g4'); var su=((u%10)+10)%10, mv=((v%12)+12)%12, c=ramp[1]; if (su<1) c=ramp[0]; var mu=((u-5)%10+10)%10, md=Math.abs(mu-0)+Math.abs(mv-6); if (md<1.5) c=ramp[2]; return c; },
  bricks:function(u,v,ramp,bw,bh){ ramp=ramp||M.R('t1 t2 t3 t4'); bw=bw||10; bh=bh||5; var row=Math.floor(v/bh), off=(row%2)*bw/2, col=Math.floor((u+off)/bw), fu=(u+off)-col*bw, fv=v-row*bh;
    if (fv<1||fu<1) return ramp[0]; var t=hash(col,row), c=t<0.25?ramp[1]:(t<0.85?ramp[2]:ramp[3]); if (fv===1&&fu>1) c=M.UP[c]; if (hash(u,v)<0.06) c=M.DN[c]; return c; },
  metal:function(u,v,ramp,pw,ph){ ramp=ramp||M.R('m1 m2 m3'); pw=pw||22; ph=ph||14; var fu=((u%pw)+pw)%pw, fv=((v%ph)+ph)%ph; if (fu<1||fv<1) return ramp[0]; var c=ramp[1]; if (fv<2) c=ramp[2]; if (hash(Math.floor(u/2),Math.floor(v/3))<0.08) c=P.t2; return c; },
  rust:function(u,v,ramp){ ramp=ramp||M.R('t0 t1 t2 m1 m2'); var h=hash(Math.floor(u/2),Math.floor(v/2)), s=Math.sin(u*0.3)+Math.sin(v*0.4+u*0.1); return ramp[Math.max(0,Math.min(ramp.length-1,Math.floor((h*0.6+(s+2)/4*0.6)*ramp.length*0.8)))]; },
  carpet:function(u,v,ramp){ ramp=ramp||M.R('r1 r2 r3'); var c=ramp[1]; var m=((Math.floor(u/6)+Math.floor(v/4))%2); if (m) c=ramp[0]; if (hash(u,v)<0.08) c=ramp[2]; return c; },
  foliage:function(x,y,ramp){ ramp=ramp||M.R('g1 g2 g3 g4'); var h=hash(Math.floor(x/3),Math.floor(y/2)), h2=hash(x,y), i=Math.floor(h*3.2); if (h2>0.9) i++; if (h2<0.1) i--; return ramp[Math.max(0,Math.min(ramp.length-1,i))]; }
};

// ---------------------------------------------------------------- Requisiten (alle in Weltkoordinaten auf Buf oder lw-Schreiber)
M.prop={
  // Holztür mit Kassetten; opt: ramp, frame, open(0..1), dark, knob 'L'|'R', glass, sign
  door:function(b,x,y,w,h,opt){ opt=opt||{}; var R=opt.ramp||M.R('w0 w1 w2 w3 w4'), F=opt.frame||M.R('s1 s2 s3 s4');
    b.rect(x-2,y-2,w+4,h+2,F[1]); b.hl(x-2,x+w+1,y-2,F[3]); b.vl(x-2,y-2,y+h-1,F[2]); b.vl(x+w+1,y-2,y+h-1,F[0]);
    if (opt.open){ b.rect(x,y,w,h,opt.dark===undefined?P.k0:opt.dark); var ow=Math.max(2,Math.round(w*(1-opt.open)*0.3)); b.rect(x,y,ow,h,R[2]); b.vl(x+ow-1,y,y+h-1,R[3]); return; }
    b.rect(x,y,w,h,R[2]); b.vl(x,y,y+h-1,R[3]); b.vl(x+w-1,y,y+h-1,R[1]); b.hl(x,x+w-1,y,R[3]);
    var pw=Math.max(2,Math.floor((w-6)/2)), ph=Math.floor(h*0.38);
    if (opt.glass){ b.rect(x+3,y+3,w-6,ph,opt.glassCol||P.k2); b.hl(x+3,x+w-4,y+3,R[0]); }
    else { b.rect(x+3,y+3,pw,ph,R[1]); b.rect(x+w-3-pw,y+3,pw,ph,R[1]); b.hl(x+3,x+2+pw,y+3,R[0]); b.hl(x+w-3-pw,x+w-4,y+3,R[0]); }
    var ly=y+Math.floor(h*0.52); b.rect(x+3,ly,pw,Math.floor(h*0.42),R[1]); b.rect(x+w-3-pw,ly,pw,Math.floor(h*0.42),R[1]); b.hl(x+3,x+2+pw,ly,R[0]); b.hl(x+w-3-pw,x+w-4,ly,R[0]);
    var kx=opt.knob==='L'?x+2:x+w-4, ky=y+Math.floor(h*0.5); b.rect(kx,ky,2,2,P.y2); b.px(kx,ky,P.y4);
    if (opt.sign){ var sw=M.microWidth(opt.sign)+4; b.rect(x+Math.floor((w-sw)/2),y+5,sw,8,P.s5); M.microText(b.buf||b,opt.sign,x+Math.floor((w-sw)/2)+2-(b.buf?b.buf.ox:0),y+6-(b.buf?b.buf.oy:0),P.k1); } },
  // Fenster mit dalmatinischen Fensterläden (škure); opt: shut (geschlossen), open (Läden seitlich), lit, fill(x,y), col (Ladenrampe)
  window:function(b,x,y,w,h,opt){ opt=opt||{}; var S=opt.col||M.R('g1 g2 g3 g4'), F=opt.frame||M.R('s2 s3 s4 s5');
    b.rect(x-2,y-2,w+4,h+4,F[2]); b.hl(x-2,x+w+1,y-2,F[3]); b.hl(x-3,x+w+2,y+h+2,F[3]); b.hl(x-3,x+w+2,y+h+3,F[1]);
    if (opt.shut){ for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ var c=S[2]; if ((yy-y)%3===0) c=S[1]; if (xx===x||xx===x+w-1||xx===x+Math.floor(w/2)) c=S[0]; b.px(xx,yy,c); } return; }
    if (opt.fill) b.fn(x,y,w,h,opt.fill); else b.rect(x,y,w,h,opt.lit?P.y3:P.k2);
    if (opt.lit){ b.drect(x,y,w,h,P.y3,P.y4,0.4); b.hl(x,x+w-1,y+h-1,P.y2); }
    b.vl(x+Math.floor(w/2),y,y+h-1,F[1]); b.hl(x,x+w-1,y+Math.floor(h/2),F[1]);
    if (opt.open){ var lw=Math.floor(w/2)+1; for (var k=0;k<2;k++){ var sx=k?x+w+2:x-2-lw; for (yy=y;yy<y+h;yy++) for (xx=sx;xx<sx+lw;xx++){ var c2=S[2]; if ((yy-y)%3===0) c2=S[1]; if (xx===sx||xx===sx+lw-1) c2=S[0]; b.px(xx,yy,c2); } } } },
  // Laterne der Riva: schlanker Mast, Glaskopf
  lamp:function(b,x,by,h,lit){ var M1=M.R('k1 m0 m1 m2'); b.rect(x-2,by-3,5,3,M1[1]); b.rect(x-1,by-h,2,h,M1[1]); b.vl(x-1,by-h,by-1,M1[2]);
    b.poly([[x-4,by-h-2],[x+4,by-h-2],[x+3,by-h-9],[x-3,by-h-9]],lit?P.y4:P.m2); b.hl(x-5,x+4,by-h-10,M1[1]); b.hl(x-4,x+3,by-h-1,M1[1]); b.px(x,by-h-11,M1[1]); if (lit){ b.px(x-1,by-h-6,P.l1); b.px(x,by-h-6,P.l0); } },
  // Palme (Riva): gebogener Stamm + Wedel
  palm:function(b,x,by,h,opt){ opt=opt||{}; var tr=opt.trunk||M.R('w1 w2 w3'), lf=opt.leaf||M.R('g1 g2 g3 g4'), lean=opt.lean||4;
    for (var i=0;i<h;i++){ var t=i/h, cx=x+Math.round(Math.sin(t*1.4)*lean), y=by-i, w=t<0.1?3:2; for (var k=-w;k<=w-1;k++) b.px(cx+k,y,(k<0)?tr[2]:((i%3===0)?tr[0]:tr[1])); }
    var tx=x+Math.round(Math.sin(1.4)*lean), ty=by-h; var r=M.rng(opt.seed||7);
    for (var f=0;f<9;f++){ var a=-Math.PI+f/8*Math.PI+(r()-0.5)*0.3, L=12+r()*9, droop=0.35+r()*0.25;
      for (var s=0;s<L;s++){ var u=s/L, px=tx+Math.cos(a)*s, py=ty+Math.sin(a)*s*0.7+u*u*L*droop; var c=lf[Math.min(lf.length-1,1+Math.floor(r()*2))]; b.px(Math.round(px),Math.round(py),c);
        if (s>2 && s%2===0){ b.px(Math.round(px),Math.round(py)+1,lf[0]); b.px(Math.round(px),Math.round(py)+2,s<L*0.6?lf[0]:T); } } }
    b.ellipse(tx,ty+1,3,2,tr[0]); },
  bench:function(b,x,by,w,opt){ opt=opt||{}; var R=opt.ramp||M.R('w1 w2 w3 w4'), I=M.R('k1 m0 m1');
    b.rect(x,by-8,w,2,R[2]); b.hl(x,x+w-1,by-8,R[3]); b.rect(x,by-13,w,2,R[2]); b.hl(x,x+w-1,by-13,R[3]); b.rect(x+1,by-11,w-2,1,R[1]);
    [x+2,x+w-4].forEach(function(lx){ b.rect(lx,by-7,2,7,I[1]); b.vl(lx,by-14,by-8,I[1]); }); },
  bollard:function(b,cx,by,opt){ var I=M.R('k1 m0 m1 m2'); b.rect(cx-3,by-7,7,7,I[1]); b.vl(cx-3,by-7,by-1,I[2]); b.rect(cx-4,by-9,9,2,I[1]); b.hl(cx-4,cx+4,by-9,I[3]); b.rect(cx-2,by-11,5,2,I[1]); },
  // Fischerboot (pasara/gajeta), seitlich, zum Betrachter offen
  boat:function(b,x,wy,w,opt){ opt=opt||{}; var H=opt.hull||M.R('s3 s4 s5 s6'), K=opt.keel||M.R('a1 a2 a3'), Tr=opt.trim||M.R('b0 b1 b2'), h=opt.h||7;
    for (var i=0;i<w;i++){ var t=i/(w-1), top=wy-h+Math.round(Math.pow(Math.abs(t-0.5)*2,2)*-2), bot=wy-Math.round(Math.pow(Math.abs(t-0.5)*2,1.6)*3);
      for (var y=top;y<=bot;y++){ var c=H[1]; if (y===top) c=Tr[2]; else if (y===top+1) c=Tr[1]; else if (y>bot-2) c=K[1]; else if (t<0.15||t>0.85) c=H[0]; b.px(x+i,y,c); } }
    if (opt.name) M.microText(b.buf||b,opt.name,x+Math.floor(w*0.15)-(b.buf?b.buf.ox:0),wy-h+3-(b.buf?b.buf.oy:0),P.b0);
    if (opt.mast){ b.vl(x+Math.floor(w*0.4),wy-h-opt.mast,wy-h,P.w2); } },
  // große Fähre in der Ferne: weißer Rumpf, Fensterreihen, Schornstein; lit = nachts
  ferry:function(b,x,wy,w,lit,opt){ opt=opt||{}; var h=Math.round(w*0.22), hull=lit?P.n2:P.s5, dark=lit?P.n0:P.s3, band=opt.band||P.b1;
    b.poly([[x,wy-h*0.55],[x+w,wy-h*0.55],[x+w-4,wy],[x+5,wy]],hull); b.hl(x+3,x+w-3,wy-Math.round(h*0.25),band);
    b.rect(x+Math.round(w*0.18),wy-h,Math.round(w*0.62),Math.round(h*0.45),hull); b.rect(x+Math.round(w*0.3),wy-Math.round(h*1.35),Math.round(w*0.3),Math.round(h*0.36),hull);
    b.rect(x+Math.round(w*0.62),wy-Math.round(h*1.75),Math.max(3,Math.round(w*0.07)),Math.round(h*0.45),opt.funnel||P.r3);
    for (var i=x+Math.round(w*0.2);i<x+Math.round(w*0.78);i+=3){ b.px(i,wy-Math.round(h*0.8),lit?(hash(i,1)<0.7?P.y4:P.y2):dark); b.px(i,wy-Math.round(h*0.4),lit?(hash(i,2)<0.6?P.y3:P.n1):dark); }
    if (lit){ b.px(x+w-2,wy-h,P.r4); b.px(x+2,wy-h,P.g5); b.px(x+Math.round(w*0.45),wy-Math.round(h*1.6),P.l1); } },
  crate:function(b,x,y,w,h,opt){ opt=opt||{}; var R=opt.ramp||M.R('w1 w2 w3 w4'); for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ var c=R[2]; if ((yy-y)%4===0) c=R[1]; if (xx===x||xx===x+w-1||yy===y||yy===y+h-1) c=R[0]; if (hash(xx,yy)<0.05) c=R[1]; b.px(xx,yy,c); } b.hl(x,x+w-1,y,R[3]);
    if (opt.label) M.microText(b.buf||b,opt.label,x+2-(b.buf?b.buf.ox:0),y+Math.floor(h/2)-2-(b.buf?b.buf.oy:0),opt.labelCol||P.k2); },
  // Plastikkiste für Fisch (blau/rot)
  fishbox:function(b,x,y,w,h,col){ var R=col||M.R('b0 b1 b2'); b.rect(x,y,w,h,R[1]); b.hl(x,x+w-1,y,R[2]); for (var xx=x+2;xx<x+w-2;xx+=3) b.vl(xx,y+2,y+h-2,R[0]); b.hl(x,x+w-1,y+h-1,R[0]); },
  barrel:function(b,cx,by,r,h,opt){ opt=opt||{}; var R=opt.ramp||M.R('b0 b1 b2 b3'); for (var y=by-h;y<by;y++){ var rw=r*(1+0.1*Math.sin(Math.PI*(y-by+h)/h)); for (var x=Math.floor(cx-rw);x<=cx+rw;x++){ var u=(x-(cx-rw))/(2*rw); b.px(x,y,u<0.2?R[0]:(u<0.55?R[2]:(u<0.85?R[1]:R[0]))); } } b.hl(Math.floor(cx-r),Math.ceil(cx+r),by-h,R[3]); },
  shelf:function(b,x,y,w,opt){ opt=opt||{}; var R=opt.ramp||M.R('w1 w2 w3 w4'); b.hl(x,x+w-1,y,R[3]); b.hl(x,x+w-1,y+1,R[2]); b.hl(x+1,x+w-2,y+2,R[0]); },
  books:function(b,x,y,w,h,seed){ var r=M.rng(seed||3), cols=[P.r2,P.r3,P.g2,P.g3,P.c2,P.c3,P.w2,P.y2,P.s3,P.v2,P.a3,P.t2], xx=x; while (xx<x+w){ var bw=1+Math.floor(r()*3), bh=h-Math.floor(r()*4), c=cols[Math.floor(r()*cols.length)]; if (xx+bw>x+w) break; b.rect(xx,y+h-bh,bw,bh,c); if (bw>1) b.vl(xx,y+h-bh,y+h-1,M.UP[c]); xx+=bw; if (r()<0.08) xx++; } },
  bottle:function(b,x,by,col,h){ h=h||9; b.rect(x,by-h+3,3,h-3,col); b.rect(x+1,by-h,1,3,col); b.vl(x,by-h+4,by-2,M.UP[col]); b.px(x+1,by-h+5,P.s5); },
  pot:function(b,x,by,opt){ opt=opt||{}; var R=opt.ramp||M.R('g1 g2 g3 g4'); b.rect(x-3,by-5,7,5,opt.pot||P.t3); b.hl(x-4,x+4,by-6,M.UP[opt.pot||P.t3]); var r=M.rng(opt.seed||4);
    for (var i=0;i<(opt.n||9);i++){ var a=-Math.PI/2+(r()-0.5)*2.4, L=5+r()*(opt.h||9); b.line(x,by-6,Math.round(x+Math.cos(a)*L),Math.round(by-6+Math.sin(a)*L),R[1+Math.floor(r()*3)]); } },
  chair:function(b,x,by,opt){ opt=opt||{}; var R=opt.ramp||M.R('w0 w1 w2 w3'); b.rect(x,by-10,9,2,R[3]); b.vl(x,by-8,by-1,R[1]); b.vl(x+8,by-8,by-1,R[1]); var bx=opt.back==='R'?x+7:x; b.rect(bx,by-22,2,12,R[2]); b.hl(bx,bx+1,by-22,R[3]); },
  table:function(b,x,y,w,h,opt){ opt=opt||{}; var R=opt.ramp||M.R('w0 w1 w2 w3 w4'), d=opt.depth||5; b.poly([[x,y],[x+w,y],[x+w-d,y-d],[x+d,y-d]],R[3]); b.hl(x+d,x+w-d,y-d,R[4]); b.rect(x,y,w+1,2,R[2]); b.hl(x,x+w,y+2,R[0]); b.rect(x+2,y+2,2,h-2,R[1]); b.rect(x+w-3,y+2,2,h-2,R[1]); },
  frame:function(b,x,y,w,h,opt){ opt=opt||{}; var F=opt.frame||M.R('y1 y2 y3'); b.rect(x,y,w,h,F[1]); b.hl(x,x+w-1,y,F[2]); b.vl(x,y,y+h-1,F[2]); b.hl(x,x+w-1,y+h-1,F[0]); b.vl(x+w-1,y,y+h-1,F[0]); if (opt.fill) b.fn(x+2,y+2,w-4,h-4,opt.fill); else b.rect(x+2,y+2,w-4,h-4,opt.bg||P.s4); },
  clock:function(b,cx,cy,r,hh,mm){ b.ellipse(cx+0.5,cy+0.5,r+1.2,r+1.2,P.w2); b.ellipse(cx+0.5,cy+0.5,r,r,P.s5); for (var i=0;i<12;i++){ var a=i/12*Math.PI*2; b.px(Math.round(cx+Math.cos(a)*(r-1)),Math.round(cy+Math.sin(a)*(r-1)),P.s2); }
    var ha=((hh%12)+mm/60)/12*Math.PI*2-Math.PI/2, ma=mm/60*Math.PI*2-Math.PI/2; b.line(cx,cy,Math.round(cx+Math.cos(ma)*(r-1.5)),Math.round(cy+Math.sin(ma)*(r-1.5)),P.k1); b.line(cx,cy,Math.round(cx+Math.cos(ha)*(r*0.55)),Math.round(cy+Math.sin(ha)*(r*0.55)),P.k1); },
  // Wäscheleine quer über eine Gasse
  laundry:function(b,x0,y0,x1,y1,seed,cols){ var r=M.rng(seed||9); cols=cols||[P.s6,P.b3,P.r3,P.y4,P.s5,P.g4]; var n=Math.abs(x1-x0);
    for (var i=0;i<=n;i++){ var t=i/n, x=Math.round(x0+(x1-x0)*t), y=Math.round(y0+(y1-y0)*t+Math.sin(Math.PI*t)*4); b.px(x,y,P.s1); }
    for (var k=0;k<5;k++){ var t2=0.15+k*0.17+(r()-0.5)*0.05, xx=Math.round(x0+(x1-x0)*t2), yy=Math.round(y0+(y1-y0)*t2+Math.sin(Math.PI*t2)*4), w=3+Math.floor(r()*4), h=4+Math.floor(r()*6), c=cols[Math.floor(r()*cols.length)];
      b.rect(xx,yy+1,w,h,c); b.vl(xx,yy+1,yy+h,M.DN[c]); } },
  stairsUp:function(b,x,by,w,steps,stepH,stepD,ramp){ ramp=ramp||M.R('s2 s3 s4 s5'); for (var i=0;i<steps;i++){ var y=by-i*stepH, xx=x+i*stepD; b.rect(xx,y-stepH,w,stepH,ramp[1]); b.hl(xx,xx+w-1,y-stepH,ramp[3]); b.hl(xx,xx+w-1,y-1,ramp[0]); } }
};

// ---------------------------------------------------------------- Tageszeit-Abschluss: Umfärben + warme Lichtinseln
// opt.sky(x,y) -> true für Himmelspixel (werden nicht umgefärbt), opt.lights=[[x,y,r,stärke],...], opt.after(b) für Lichtquellen
var LAMP=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; });
M.TINT.lamp=LAMP;
M.finishTOD=function(b,tod,opt){ opt=opt||{};
  if (tod==='day' || !M.TINT[tod]){ if (opt.after) opt.after(b,tod); return b; }
  var base=b.clone(), t=M.TINT[tod], L=opt.lights||[];
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=base.d[k]; if (c===T) continue; if (opt.sky && opt.sky(x,y)) continue;
    var lit=0; for (var i=0;i<L.length;i++){ var l=L[i], dx=(x-l[0])/l[2], dy=(y-l[1])/(l[4]||l[2]); var d=dx*dx+dy*dy; if (d<1){ lit=Math.max(lit,(1-d)*l[3]); } }
    if (tod==='dusk') lit*=0.6;
    if (lit>0.05 && bayer(x,y)<lit){ b.d[k]=M.tintPx(LAMP,c,x,y); if (lit>0.75) b.d[k]=M.UP[b.d[k]]; }
    else b.d[k]=M.tintPx(t,c,x,y); }
  if (opt.after) opt.after(b,tod);
  return b; };
// weicher Lichthof auf dem Framebuffer (für flackernde Lampen in dynamic)
M.glow=function(fb,cx,cy,r,t,amt,H){ H=H||SH; var f=1+Math.sin(t*7)*0.05+Math.sin(t*19)*0.03; for (var y=Math.floor(cy-r);y<=cy+r;y++) for (var x=Math.floor(cx-r);x<=cx+r;x++){ if (x<0||y<0||x>=fb.w||y>=H) continue; var d=Math.hypot(x-cx,y-cy)/r*f; if (d>1) continue; if (bayer(x,y)<(1-d)*(amt||0.5)){ var k=y*fb.w+x; fb.d[k]=M.UP[fb.d[k]]; } } };
// Regen als Vordergrund-Overlay
M.rain=function(fb,t,opt){ opt=opt||{}; var n=opt.n||60, H=opt.h||SH, col=opt.col||P.n3, col2=opt.col2||P.n4, spd=opt.speed||240, slant=opt.slant===undefined?0.2:opt.slant;
  for (var i=0;i<n;i++){ var x0=Math.floor(hash(i,1)*380)-30, sp=spd*(0.8+hash(i,2)*0.5), y=Math.floor(((t*sp)+hash(i,3)*H)%(H+20))-10, x=x0-Math.floor(y*slant);
    for (var k=0;k<4;k++){ var yy=y-k, xx=x+Math.floor(k*slant); if (yy<0||yy>=H||xx<0||xx>=fb.w) continue; if (opt.mask && !opt.mask(xx,yy)) continue; fb.d[yy*fb.w+xx]=k===0?col2:col; } } };
// Staubkörner im Licht
M.dust=function(fb,t,x0,y0,w,h,n,col){ for (var i=0;i<(n||14);i++){ var x=Math.floor(x0+((hash(i,7)*w+Math.sin(t*0.3+i)*6)%w+w)%w), y=Math.floor(y0+((hash(i,8)*h+t*(2+hash(i,9)*3))%h)); if (Math.sin(t*1.5+i*2)>0.2) fb.px(x,y,col||P.s5); } };
})(M);
/* ---- 3D-Hilfen für Fluchtpunkt-Räume: Punkte und Quader in Raumkoordinaten ----
   X quer (in Rückwand-Pixeln), Y Höhe (Rückwand-Pixel, Boden = Bodenlinie), Z Tiefe zum Betrachter (0 = Rückwand). k = 1 + Z/F */
(function(M){
'use strict';
var P=M.P;
M.room3=function(vp,F,floorY){ var R={vp:vp,F:F,floorY:floorY};
  R.p=function(X,Y,Z){ var k=1+Z/F; return [vp[0]+(X-vp[0])*k, vp[1]+(Y-vp[1])*k]; };
  // Bildschirm -> Bodenpunkt (X,Z) auf Höhe Y=floorY
  R.floor=function(x,y){ var k=(y-vp[1])/(floorY-vp[1]); if (k<=0) return null; return {X:vp[0]+(x-vp[0])/k, Z:(k-1)*F, k:k}; };
  R.quad=function(b,pts,c){ b.poly(pts,c); };
  // Quader; fill: {top,front,left,right,bottom} je Farbe oder fn(x,y)
  R.box=function(b,X0,X1,Y0,Y1,Z0,Z1,fill){ var p=R.p;
    if (Y0>vp[1] && fill.top!==undefined) b.poly([p(X0,Y0,Z0),p(X1,Y0,Z0),p(X1,Y0,Z1),p(X0,Y0,Z1)],fill.top);
    if (Y1<vp[1] && fill.bottom!==undefined) b.poly([p(X0,Y1,Z0),p(X1,Y1,Z0),p(X1,Y1,Z1),p(X0,Y1,Z1)],fill.bottom);
    if (X1<vp[0] && fill.right!==undefined) b.poly([p(X1,Y0,Z0),p(X1,Y0,Z1),p(X1,Y1,Z1),p(X1,Y1,Z0)],fill.right);
    if (X0>vp[0] && fill.left!==undefined) b.poly([p(X0,Y0,Z0),p(X0,Y0,Z1),p(X0,Y1,Z1),p(X0,Y1,Z0)],fill.left);
    if (fill.front!==undefined) b.poly([p(X0,Y0,Z1),p(X1,Y0,Z1),p(X1,Y1,Z1),p(X0,Y1,Z1)],fill.front); };
  // Bildschirm-Rechteck (Umriss) eines Quaders, für Hotspots
  R.rect=function(X0,X1,Y0,Y1,Z0,Z1){ var xs=[],ys=[]; [X0,X1].forEach(function(X){ [Y0,Y1].forEach(function(Y){ [Z0,Z1].forEach(function(Z){ var q=R.p(X,Y,Z); xs.push(q[0]); ys.push(q[1]); }); }); });
    var x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; };
  R.st=function(X,Z,f){ var q=R.p(X,floorY,Z); return [Math.round(q[0]),Math.round(q[1]),f]; };
  return R; };
})(M);

