/* M. Adventure – technisch übernommen aus der MALA-Referenz ("Die Stillen", index.html, Modul 02_rig.js): Figuren-Rig (Kopfstempel, Torsi, IK-Glieder, Posen-Bibliothek).
   Unverändert bis auf ausdrücklich markierte Stellen (// M.ADV:). Die MALA-Fassung selbst bleibt unberührt. */
/* ---- 02_rig.js ---- */
/* ===== 02_rig.js — das Figuren-Rig: Kopf-Stempel + erzeugte Torsi + Glieder fester Länge (IK), Posen-Bibliothek =====
   Maße (Seitenansicht, px über dem Boden): Schuh 0–2, Knöchel 2, Knie 12, Hüfte 23, Schulter 35, Kinn 37, Scheitel ~50.
   Oberschenkel 11, Schienbein 10, Oberarm 9, Unterarm 8 (je Figur änderbar). */
(function(M){
'use strict';
var P=M.P, T=M.T, Buf=M.Buf, bayer=M.bayer;
var SW=64, SHH=86, OX=32, OY=80;
M.SPR={W:SW,H:SHH,OX:OX,OY:OY};
var CH={}; M.CHARS=CH;

// ---------------------------------------------------------------- Torso-Generator
// spec: {w (Schulterbreite vorne, gerade Zahl), len (Zeilen), col:[mid,lit,shade], collar:[c1,c2]|null, vneck:skin, buttons:col,
//        scarf:[mid,lit,shade], apron:[mid,lit], lapel:col, belt:col, open:col (offene Jacke: Hemdfarbe), stripe:col, side:w (Seitenbreite)}
function torsoF(s,back){ var w=s.w||12, L=s.len||14, b=new Buf(w,L,T), C=s.col;
  for (var y=0;y<L;y++){ var inset=y<1?2:(y<2?1:(y>L-4?1:0)); if (s.taper && y>L*0.55) inset=Math.max(inset,1);
    for (var x=inset;x<w-inset;x++){ var u=(x-inset)/Math.max(1,(w-2*inset-1)); var c=C[0]; if (u<0.22) c=C[1]; else if (u>0.78) c=C[2];
      if (!back){
        if (s.open && Math.abs(x-(w-1)/2)<1.6 && y>0) c=(Math.abs(x-(w-1)/2)<0.6)?M.DN[s.open]:s.open;
        if (s.stripe!==undefined && y%3===1 && y>0) c=s.stripe;
        if (s.apron && y>=Math.floor(L*0.3) && x>=2 && x<w-2) c=(x<4?s.apron[1]:s.apron[0]);
        if (s.buttons!==undefined && Math.abs(x-(w-1)/2)<0.6 && y>2 && y%3===0) c=s.buttons;
        if (s.lapel!==undefined && y<5 && (Math.abs(x-(w-1)/2)>=1 && Math.abs(x-(w-1)/2)<2.6-y*0.3)) c=s.lapel;
      } else if (s.stripe!==undefined && y%3===1 && y>0) c=s.stripe;
      if (s.belt!==undefined && y===L-3) c=s.belt;
      b.px(x,y,c); } }
  if (!back && s.collar){ var mx=(w-1)/2; b.px(Math.floor(mx),0,s.collar[0]); b.px(Math.ceil(mx),0,s.collar[0]); b.px(Math.floor(mx)-1,0,s.collar[1]); b.px(Math.ceil(mx)+1,0,s.collar[1]); }
  if (!back && s.vneck!==undefined){ var m2=(w-1)/2; for (var yy=0;yy<3;yy++){ for (var xx=Math.ceil(m2-1.5+yy*0.5);xx<=Math.floor(m2+1.5-yy*0.5);xx++) b.px(xx,yy,s.vneck); } }
  if (s.scarf){ var S=s.scarf; for (var x2=1;x2<w-1;x2++){ b.px(x2,0,S[x2<3?1:0]); b.px(x2,1,S[x2>w-4?2:0]); }
    if (!back){ for (var y2=2;y2<Math.min(L-2,9);y2++){ b.px(3,y2,S[1]); b.px(4,y2,S[0]); } } else { for (var y3=2;y3<5;y3++) b.px(w-4,y3,S[2]); } }
  return b; }
function torsoS(s){ var w=s.side||8, L=s.len||14, b=new Buf(w,L,T), C=s.col;
  for (var y=0;y<L;y++){ var x0=(y<1)?1:0, x1=w-(y<1?2:(y<2?1:0)); if (y>L-5 && !s.belly) x1=Math.max(x0+2,x1-1); if (s.belly && y>L*0.4 && y<L-2) x1=w;
    if (s.hunch && y<4) { x0=Math.max(0,x0-1); }
    for (var x=x0;x<x1;x++){ var u=(x-x0)/Math.max(1,(x1-x0-1)); var c=C[0]; if (u>0.7) c=C[1]; else if (u<0.25) c=C[2];
      if (s.apron && y>=Math.floor(L*0.3) && x>=x1-2) c=s.apron[0];
      if (s.buttons!==undefined && x===x1-1 && y>2 && y%3===0) c=s.buttons;
      if (s.belt!==undefined && y===L-3) c=s.belt;
      if (s.stripe!==undefined && y%3===1 && y>0) c=s.stripe;
      b.px(x,y,c); } }
  if (s.collar){ b.px(w-3,0,s.collar[0]); b.px(w-2,1,s.collar[1]); }
  if (s.vneck!==undefined){ b.px(w-2,0,s.vneck); b.px(w-3,0,s.vneck); b.px(w-2,1,s.vneck); }
  if (s.scarf){ var S=s.scarf; for (var x2=0;x2<w;x2++){ b.px(x2,0,S[0]); b.px(x2,1,S[x2>w-3?1:2]); } b.px(w-1,2,S[1]); b.px(w-1,3,S[0]); b.px(w-2,3,S[0]); b.px(w-1,4,S[2]); }
  if (s.hood){ b.px(0,0,s.hood); b.px(0,1,s.hood); b.px(1,0,s.hood); }
  return b; }
// Torso in Seitenansicht scheren (Vorbeugen +, Zurücklehnen -)
function shearS(src,lean){ if (!lean) return {b:src,pad:0}; var w=src.w+Math.abs(lean)+1, b=new Buf(w,src.h,T), pad=lean<0?Math.abs(lean):0;
  for (var y=0;y<src.h;y++){ var sh=Math.round(lean*(src.h-1-y)/(src.h-1)); for (var x=0;x<src.w;x++){ var c=src.d[y*src.w+x]; if (c!==T) b.px(x+sh+pad,y,c); } } return {b:b,pad:pad}; }

// ---------------------------------------------------------------- Glieder
function ik(ax,ay,tx,ty,l1,l2,bend){ var dx=tx-ax, dy=ty-ay, d=Math.sqrt(dx*dx+dy*dy), md=l1+l2-0.01; if (d>md){ dx*=md/d; dy*=md/d; d=md; } if (d<0.01) d=0.01;
  var a=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d)))), base=Math.atan2(dy,dx), ang=base+bend*a; return [ax+Math.cos(ang)*l1, ay+Math.sin(ang)*l1]; }
function limb(b,a,c,r,col){ var minx=Math.floor(Math.min(a[0],c[0])-r-1), maxx=Math.ceil(Math.max(a[0],c[0])+r+1), miny=Math.floor(Math.min(a[1],c[1])-r-1), maxy=Math.ceil(Math.max(a[1],c[1])+r+1);
  var vx=c[0]-a[0], vy=c[1]-a[1], L2=vx*vx+vy*vy||1, len=Math.sqrt(L2), nx=-vy/len, ny=vx/len; if (nx<0||(nx===0&&ny>0)){ nx=-nx; ny=-ny; }
  for (var y=miny;y<=maxy;y++) for (var x=minx;x<=maxx;x++){ var px=x+0.5-a[0], py=y+0.5-a[1], t=Math.max(0,Math.min(1,(px*vx+py*vy)/L2)), qx=px-t*vx, qy=py-t*vy, d=Math.sqrt(qx*qx+qy*qy);
    if (d<=r){ var s=qx*nx+qy*ny; b.px(x,y, s>r*0.4?col[1]:(s<-r*0.4?col[2]:col[0])); } } }
function hand(b,x,y,c){ x=Math.round(x); y=Math.round(y); b.px(x,y,c[0]); b.px(x+1,y,c[0]); b.px(x,y+1,c[1]); b.px(x+1,y+1,c[1]); }
function outlinePass(b,col){ var add=[]; for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ if (b.get(x,y)!==T) continue; var n=[b.get(x-1,y),b.get(x+1,y),b.get(x,y-1),b.get(x,y+1)];
  for (var i=0;i<4;i++) if (n[i]!==T && n[i]!==col){ add.push(x,y); break; } } for (var k=0;k<add.length;k+=2) b.px(add[k],add[k+1],col); }
var SHOES={ f:['.kk..','kssk.','kkkkk'], h:['.kk.k','kssss','kkkk.'], t:['kk...','.ksk.','..kss','...kk'], F:['kssk','kkkk'], B:['kssk','kkkk'] };

// gehaltene Dinge (an der nahen Hand, Seitenansicht)
var HELD={
  cup:function(b,x,y){ b.rect(x+1,y-3,3,3,P.s5); b.px(x+4,y-2,P.s4); b.hl(x+1,x+3,y-3,P.w1); },
  cig:function(b,x,y,t){ b.hl(x+1,x+3,y,P.s6); b.px(x+4,y,(Math.floor((t||0)/300)%2)?P.y4:P.r4); },
  paper:function(b,x,y){ b.rect(x+1,y-5,4,6,P.s6); b.hl(x+2,x+3,y-3,P.s3); b.hl(x+2,x+3,y-1,P.s3); },
  key:function(b,x,y){ b.px(x+2,y,P.y3); b.px(x+3,y,P.y2); },
  broom:function(b,x,y){ b.line(x-6,y-8,x+7,y+20,P.w3); b.poly([[x+5,y+18],[x+11,y+18],[x+13,y+24],[x+3,y+24]],P.e3); },
  guitar:function(b,x,y){ b.ellipse(x+3,y+3,4.5,5.5,P.w3); b.ellipse(x+3,y+3,2.6,3.3,P.w4); b.ellipse(x+3,y+3,1,1.2,P.k1); b.line(x+5,y-1,x+15,y-11,P.w1); b.line(x+6,y-1,x+16,y-11,P.w0); b.rect(x+15,y-13,2,3,P.w1); },
  needle:function(b,x,y){ b.line(x,y,x+4,y-3,P.m4); },
  rag:function(b,x,y){ b.rect(x,y-1,4,3,P.s5); b.px(x+1,y+2,P.s4); },
  glass:function(b,x,y){ b.rect(x+1,y-4,3,4,P.b4); b.px(x+1,y-4,P.s6); },
  pencil:function(b,x,y){ b.line(x,y,x+4,y-4,P.y3); b.px(x+4,y-4,P.k1); },
  candle:function(b,x,y,t){ b.rect(x+1,y-4,2,5,P.s6); b.px(x+1,y-5,(Math.floor((t||0)/120)%2)?P.y5:P.y4); },
  phone:function(b,x,y){ b.rect(x+1,y-4,2,5,P.k2); b.px(x+1,y-4,P.n4); },
  frameS:function(b,x,y){ b.rect(x,y-6,6,7,P.y2); b.rect(x+1,y-5,4,5,P.s5); }
};
M.HELD=HELD;

// ---------------------------------------------------------------- Figuren definieren
/* def: {legend:{zeichen:farbe}, heads:{S:{n,o,b},F:{n,o,b},B:{n}}, neck:{S:[x,y],F:[x,y],B:[x,y]}, torso:{...spec}, torsoS:{...}, torsoB:{...}
         cols:{trou:[m,l,s], trouF:[...], sleeve:[...], sleeveF:[...], hand:[c,c2], shoe:col, shoeTop:col}, skirt:{c:[m,l,s],hem,flare}, coat:{c:[m,l,s],hem},
         bones:[thigh,shin,upper,fore], hipY:23, shoulder:5, legR:[1.7,1.3], armR:[1.3,1.0], anims:{}, post(b,p) } */
M.defineChar=function(id,def){ var d=Object.assign({},def); d.id=id; d.legend=def.legend||{}; d.stamps={};
  d.neck=Object.assign({S:[6,12],F:[5,12],B:[5,12]},def.neck||{});
  d.cols=Object.assign({ trou:[P.c1,P.c2,P.c0], trouF:[P.c0,P.c1,P.k1], sleeve:[P.m2,P.m3,P.m1], sleeveF:[P.m1,P.m2,P.m0], hand:[P.q3,P.q2], handF:[P.q2,P.q1], shoe:P.w1, shoeTop:P.w2 },def.cols||{});
  d.bones=def.bones||[11,10,8,7]; d.hipY=def.hipY||23; d.shoulder=def.shoulder||5;
  var ts=Object.assign({w:12,len:13,col:[P.m2,P.m3,P.m1]},def.torso||{});
  d.tF=torsoF(ts,false); d.tB=torsoF(Object.assign({},ts,def.torsoB||{}),true); d.tS=torsoS(Object.assign({},ts,def.torsoS||{})); d.tLen=ts.len; d.tHipF=Math.floor(ts.w/2); d.tHipS=def.tHipS||4;
  var shoeLeg={k:P.k1,s:d.cols.shoe}; d.shoes={}; Object.keys(SHOES).forEach(function(k){ d.shoes[k]=M.stamp(SHOES[k],shoeLeg); });
  d.anims=def.anims||{}; d.cache={}; d.shear={};
  CH[id]=d; return d; };
function headStamp(ch,v,k){ var key=v+k; if (!ch.stamps[key]){ var set=ch.heads[v]||ch.heads.S; ch.stamps[key]=M.stamp(set[k]||set.n,ch.legend); } return ch.stamps[key]; }
// Kopfvarianten automatisch: 'b' (Lidschlag: e -> Haut), 'o' (Mund offen: m -> k, und ein Pixel tiefer)
M.headSet=function(rows,skin){ skin=skin||'t'; function rep(rs,from,to){ return rs.map(function(r){ return r.split(from).join(to); }); }
  var o=rows.map(function(r){ return r; }), idx=-1; for (var i=0;i<rows.length;i++) if (rows[i].indexOf('m')>=0){ idx=i; break; }
  if (idx>=0){ o=rows.slice(); o[idx]=o[idx].split('m').join('k'); if (idx+1<o.length){ var r=o[idx+1].split(''); var mi=rows[idx].indexOf('m'); if (r[mi] && r[mi]!=='.' && r[mi]!=='k') r[mi]='m'; o[idx+1]=r.join(''); } }
  // 'w' erschrocken: Augen doppelt so hoch, Mund offen; 's' traurig: schwere Lider (Schatten über den Augen)
  var wv=o.slice(), sv=rows.slice();
  for (var r=1;r<rows.length;r++){ for (var c=0;c<rows[r].length;c++){ if (rows[r][c]!=='e') continue;
    var u1=wv[r-1].split(''); if ('Sst'.indexOf(u1[c])>=0){ u1[c]='e'; wv[r-1]=u1.join(''); }
    var u2=sv[r-1].split(''); if ('Ss'.indexOf(u2[c])>=0){ u2[c]='t'; sv[r-1]=u2.join(''); } } }
  return { n:rows, o:o, b:rep(rows,'e',skin), w:wv, s:sv }; };

// ---------------------------------------------------------------- Pose -> Puffer
// pose: {v:'S'|'F'|'B', h:[x,y] Hüfte, ln:Vorbeugen, hd:Kopfvariante, ho:[dx,dy], nf/ff:[x,y,schuh], nh/fh:[x,y], lf/rf, lh/rh, it:Ding, sit:bool}
function render(p,ch,t){
  var b=new Buf(SW,SHH,T), o=function(q){ return [OX+q[0],OY+q[1]]; }, C=ch.cols, bn=ch.bones;
  var hx=p.h[0], hy=p.h[1]-(ch.hipY-23);
  var L=ch.tLen;
  if (p.v==='S'){
    var ln=p.ln||0, sh=shearS(ch.tS,ln), shx=Math.round(ln*(L-2)/(L-1));
    var shN=[hx+1+shx, hy-L+2], shF=[hx-1+shx, hy-L+2], hipN=[hx+1,hy-1], hipF=[hx-1,hy-1];
    // ferner Arm
    var fh=p.fh||[hx-2,hy+2], fe=ik(shF[0],shF[1],fh[0],fh[1],bn[2],bn[3],1);
    limb(b,o(shF),o(fe),ch.armR?ch.armR[0]:1.3,C.sleeveF); limb(b,o(fe),o(fh),ch.armR?ch.armR[1]:1.0,ch.cols.armF||C.sleeveF); hand(b,OX+fh[0]-0.5,OY+fh[1]-0.5,C.handF);
    // Beine (fern, nah)
    var knees=[];
    [['ff',hipF,C.trouF],['nf',hipN,C.trou]].forEach(function(Lg){ var f=p[Lg[0]]||[0,0,'f'], ank=[f[0],f[1]-2], kn=ik(Lg[1][0],Lg[1][1],ank[0],ank[1],bn[0],bn[1],-1); knees.push(kn);
      limb(b,o(Lg[1]),o(kn),ch.legR?ch.legR[0]:1.7,Lg[2]); limb(b,o(kn),o(ank),ch.legR?ch.legR[1]:1.3,Lg[2]);
      if (!ch.noShoes){ var s=ch.shoes[f[2]||'f']; b.blit(s,OX+f[0]-2,OY+f[1]-2-(f[2]==='t'?1:0)); } });
    skirt(b,ch,hx,hy,knees,p,'S');
    // Torso, dann Kopf
    b.blit(sh.b,OX+hx-ch.tHipS-sh.pad,OY+hy-L+1);
    var hs=headStamp(ch,'S',p.hd||'n'), nk=ch.neck.S, ho=p.ho||[0,0];
    b.blit(hs,OX+hx+shx-nk[0]+ho[0]+1,OY+hy-L-nk[1]+ho[1]+1);
    coatS(b,ch,hx,hy,knees,p);
    // naher Arm
    var nh=p.nh||[hx,hy+2], ne=ik(shN[0],shN[1],nh[0],nh[1],bn[2],bn[3],1);
    limb(b,o(shN),o(ne),ch.armR?ch.armR[0]:1.3,C.sleeve); limb(b,o(ne),o(nh),ch.armR?ch.armR[1]:1.0,ch.cols.arm||C.sleeve); hand(b,OX+nh[0]-0.5,OY+nh[1]-0.5,C.hand);
    if (p.it && HELD[p.it]) HELD[p.it](b,OX+nh[0],OY+nh[1],t);
  } else {
    var front=p.v==='F', tst=front?ch.tF:ch.tB, sw=ch.shoulder;
    var sL=[hx-sw,hy-L+2], sR=[hx+sw,hy-L+2];
    [['lf',[hx-2,hy-1],-1],['rf',[hx+2,hy-1],1]].forEach(function(Lg){ var f=p[Lg[0]]||[Lg[2]*3,0], ank=[f[0],f[1]-2], mid=[(Lg[1][0]+ank[0])/2+Lg[2]*0.4,(Lg[1][1]+ank[1])/2];
      if (p.sit) mid=[Lg[1][0]+Lg[2]*0.5, hy+1];
      limb(b,o(Lg[1]),o(mid),ch.legR?ch.legR[0]+0.1:1.8,C.trou); limb(b,o(mid),o(ank),ch.legR?ch.legR[1]+0.1:1.5,C.trou);
      if (!ch.noShoes) b.blit(front?ch.shoes.F:ch.shoes.B,OX+f[0]-1,OY+f[1]-1); });
    skirt(b,ch,hx,hy,null,p,p.v);
    b.blit(tst,OX+hx-ch.tHipF,OY+hy-L+1);
    coatF(b,ch,hx,hy,p);
    var hsF=headStamp(ch,p.v,p.hd||'n'), nkF=ch.neck[p.v]||[5,12], ho2=p.ho||[0,0];
    var drawArms=function(){ [['lh',sL,-1],['rh',sR,1]].forEach(function(A){ var h=p[A[0]]||[A[1][0]+A[2]*2,hy+2], e=ik(A[1][0],A[1][1],h[0],h[1],bn[2],bn[3],A[2]*(front?1:-1)*0.35);
      limb(b,o(A[1]),o(e),ch.armR?ch.armR[0]+0.1:1.4,C.sleeve); limb(b,o(e),o(h),ch.armR?ch.armR[1]+0.1:1.1,ch.cols.arm||C.sleeve); hand(b,OX+h[0]-0.5,OY+h[1]-0.5,C.hand); }); };
    if (!front){ b.blit(hsF,OX+hx-nkF[0]+ho2[0],OY+hy-L-nkF[1]+ho2[1]+1); drawArms(); }
    else { drawArms(); b.blit(hsF,OX+hx-nkF[0]+ho2[0],OY+hy-L-nkF[1]+ho2[1]+1); }
    if (front && p.it==='paper'){ b.rect(OX+hx-4,OY+hy-10,9,6,P.s6); b.hl(OX+hx-3,OX+hx+3,OY+hy-9,P.s3); b.hl(OX+hx-3,OX+hx+2,OY+hy-7,P.s3); hand(b,OX+hx-5,OY+hy-8,C.hand); hand(b,OX+hx+4,OY+hy-8,C.hand); }
    if (front && p.it==='tin'){ b.rect(OX+hx-2,OY+hy-9,5,5,P.m3); b.hl(OX+hx-2,OX+hx+2,OY+hy-9,P.m4); b.px(OX+hx+1,OY+hy-7,P.m1); hand(b,OX+hx-4,OY+hy-7,C.hand); hand(b,OX+hx+3,OY+hy-7,C.hand); }
  }
  if (ch.post) ch.post(b,p,OX,OY,hx,hy);
  outlinePass(b,P.k1);
  return b;
}
function skirt(b,ch,hx,hy,knees,p,v){ var sk=ch.skirt; if (!sk) return; var top=hy-2, hem=hy+(sk.hem||12), fl=sk.flare||2;
  if (v==='S'){ var xs=[hx-4,hx+4]; if (knees) knees.forEach(function(k){ xs.push(k[0]-2,k[0]+2); }); var lo=Math.min.apply(null,xs)-fl, hi=Math.max.apply(null,xs)+fl; if (p.sit){ lo=hx-4; hi=hx+11; hem=hy+3; }
    b.poly([[OX+hx-4,OY+top],[OX+hx+4,OY+top],[OX+hi,OY+hem],[OX+lo,OY+hem]],function(x,y){ var u=(x-(OX+lo))/Math.max(1,hi-lo), c=sk.c[0]; if (u>0.72) c=sk.c[1]; else if (u<0.2) c=sk.c[2]; if (y>=OY+hem-1) c=sk.c[2]; return c; }); }
  else { var hm=p.sit?hy+3:hem; b.poly([[OX+hx-5,OY+top],[OX+hx+5,OY+top],[OX+hx+6+fl,OY+hm],[OX+hx-6-fl,OY+hm]],function(x,y){ var u=(x-(OX+hx-6-fl))/(12+fl*2), c=sk.c[0]; if (u<0.25) c=sk.c[1]; else if (u>0.75) c=sk.c[2]; if ((x+40)%4===0 && y>OY+top+3) c=sk.c[2]; if (y>=OY+hm-1) c=sk.c[2]; return c; }); } }
// Mantelschöße über den Oberschenkeln
function coatS(b,ch,hx,hy,knees,p){ var co=ch.coat; if (!co) return; var top=hy-3, hem=hy+(p.sit?3:(co.hem||8)); var xs=[hx-4,hx+4]; knees.forEach(function(k){ xs.push(Math.round(hx+(k[0]-hx)*((co.hem||8)/11))-1, Math.round(hx+(k[0]-hx)*((co.hem||8)/11))+1); });
  var lo=Math.min.apply(null,xs)-1, hi=Math.max.apply(null,xs)+1; if (p.sit){ lo=hx-4; hi=hx+9; }
  b.poly([[OX+hx-4,OY+top],[OX+hx+4,OY+top],[OX+hi,OY+hem],[OX+lo,OY+hem]],function(x,y){ var u=(x-(OX+lo))/Math.max(1,hi-lo), c=co.c[0]; if (u>0.75) c=co.c[1]; else if (u<0.22) c=co.c[2]; return c; }); }
function coatF(b,ch,hx,hy,p){ var co=ch.coat; if (!co) return; var top=hy-3, hem=hy+(p.sit?3:(co.hem||8)), w=co.w||6;
  b.poly([[OX+hx-w,OY+top],[OX+hx+w,OY+top],[OX+hx+w+1,OY+hem],[OX+hx-w-1,OY+hem]],function(x,y){ var u=(x-(OX+hx-w-1))/(2*w+2), c=co.c[0]; if (u<0.2) c=co.c[1]; else if (u>0.8) c=co.c[2]; if (p.v==='F' && Math.abs(x-OX-hx-0.5)<0.6) c=co.c[2]; return c; }); }

M.poseBuf=function(p,chId,t){ var ch=CH[chId]; if (!ch) throw new Error('keine Figur '+chId); var k=JSON.stringify(p)+(p.it==='cig'||p.it==='candle'?Math.floor((t||0)/300)%2:''); return ch.cache[k]||(ch.cache[k]=render(p,ch,t)); };
// zeichnen mit Füßen bei (x,y). opt: {lut, alpha 0..1 (gedithert), t (ms, für Schimmer), mask (Uint8Array, 320*144), mv (Maskenwert), scale}
M.drawPose=function(fb,x,y,pose,facing,chId,opt){ opt=opt||{}; var s=M.poseBuf(pose,chId,opt.t), fl=facing==='L', lut=opt.lut, al=opt.alpha===undefined?1:opt.alpha, t=opt.t||0, sc=opt.scale||1;
  var W=fb.w, H=opt.h||fb.h, mask=opt.mask, mv=opt.mv||0;
  var shimmer=(al<1)? Math.floor(t/90) : 0;
  var W2=Math.round(s.w*sc), H2=Math.round(s.h*sc), bx=Math.round(x)-Math.round(OX*sc)+(fl?1:0), by=Math.round(y)-Math.round(OY*sc);
  for (var j=0;j<H2;j++){ var yy=by+j; if (yy<0||yy>=H) continue; var sy=sc===1?j:Math.min(s.h-1,Math.floor(j/sc));
    var wob=(al<1 && opt.wobble)? Math.round(Math.sin(t/260+j*0.35)*0.6) : 0;
    for (var i=0;i<W2;i++){ var sx=sc===1?i:Math.min(s.w-1,Math.floor(i/sc)); var c=s.d[sy*s.w+(fl?s.w-1-sx:sx)]; if (c===T) continue; var xx=bx+i+wob; if (xx<0||xx>=W) continue;
      if (al<1 && bayer(xx+shimmer,yy+(shimmer>>1))>=al) continue;
      fb.d[yy*W+xx]=lut?lut[c]:c; if (mask) mask[yy*W+xx]=mv; } } };

// ---------------------------------------------------------------- Posen-Bibliothek
function S(o){ var p={v:'S',h:[0,-23],nf:[1,0,'f'],ff:[-2,0,'f'],nh:[1,-21],fh:[-2,-21]}; for (var k in o) p[k]=o[k]; return p; }
function F(o,v){ var p={v:v||'F',h:[0,-23],lf:[-3,0],rf:[3,0],lh:[-7,-21],rh:[7,-21]}; for (var k in o) p[k]=o[k]; return p; }
M.poseS=S; M.poseF=F;
var A={};
A.idleS=[[S({}),1100],[S({ho:[0,-1],nh:[1,-22],fh:[-2,-22]}),600],[S({}),900],[S({hd:'b'}),110],[S({}),1200],[S({h:[-1,-23],nh:[0,-21],fh:[-3,-21]}),900]];
A.idleF=[[F({}),1200],[F({ho:[0,-1],lh:[-7,-22],rh:[7,-22]}),600],[F({}),900],[F({hd:'b'}),110],[F({}),900]];
A.idleB=[[F({},'B'),1400],[F({ho:[0,-1]},'B'),700]];
A.walkS=[
 S({h:[0,-21],nf:[7,0,'h'],ff:[-7,0,'t'],nh:[-4,-20],fh:[4,-20]}),
 S({h:[0,-22],nf:[4,0,'f'],ff:[-4,-2,'f'],nh:[-2,-21],fh:[2,-21]}),
 S({h:[0,-23],nf:[0,0,'f'],ff:[0,-3,'f'],nh:[0,-21],fh:[0,-21],ho:[0,-1]}),
 S({h:[0,-22],nf:[-4,0,'f'],ff:[4,-2,'f'],nh:[2,-21],fh:[-2,-21]}),
 S({h:[0,-21],nf:[-7,0,'t'],ff:[7,0,'h'],nh:[4,-20],fh:[-4,-20]}),
 S({h:[0,-22],nf:[-4,-2,'f'],ff:[4,0,'f'],nh:[2,-21],fh:[-2,-21]}),
 S({h:[0,-23],nf:[0,-3,'f'],ff:[0,0,'f'],nh:[0,-21],fh:[0,-21],ho:[0,-1]}),
 S({h:[0,-22],nf:[4,-2,'f'],ff:[-4,0,'f'],nh:[-2,-21],fh:[2,-21]})];
function walkFB(v){ return [
 F({h:[0,-22],lf:[-3,1],rf:[3,-1],lh:[-7,-22],rh:[7,-20]},v), F({h:[0,-23],lf:[-3,0],rf:[3,-3],lh:[-7,-21],rh:[7,-21]},v),
 F({h:[0,-24],lf:[-3,-1],rf:[3,-3],lh:[-7,-21],rh:[7,-21]},v), F({h:[0,-23],lf:[-3,-1],rf:[3,0],lh:[-7,-20],rh:[7,-22]},v),
 F({h:[0,-22],lf:[-3,-1],rf:[3,1],lh:[-7,-20],rh:[7,-22]},v), F({h:[0,-23],lf:[-3,-3],rf:[3,0],lh:[-7,-21],rh:[7,-21]},v),
 F({h:[0,-24],lf:[-3,-3],rf:[3,-1],lh:[-7,-21],rh:[7,-21]},v), F({h:[0,-23],lf:[-3,0],rf:[3,-1],lh:[-7,-22],rh:[7,-20]},v)]; }
A.walkF=walkFB('F'); A.walkB=walkFB('B');
// Geister schweben: kein Schritt, nur ein Atmen
A.floatS=[[S({nf:[1,-1,'f'],ff:[-2,-1,'f']}),700],[S({h:[0,-24],nf:[1,-2,'f'],ff:[-2,-2,'f'],ho:[0,-1]}),700]];
A.floatF=[[F({lf:[-3,-1],rf:[3,-1]}),700],[F({h:[0,-24],lf:[-3,-2],rf:[3,-2],ho:[0,-1]}),700]];
function reach(y,x){ var up=y<-36; return [[S({}),80],[S({nh:[4,-27]}),90],[S({nh:[x-2,y+2],ln:1,nf:up?[2,0,'t']:[1,0,'f']}),90],[S({nh:[x,y],ln:1,h:[1,-23],nf:up?[2,0,'t']:[2,0,'f'],hd:up?'u':'n'}),280],[S({nh:[x-2,y+2],ln:1}),90],[S({nh:[4,-27]}),80],[S({}),60]]; }
A.reachM=reach(-30,11); A.reachL=reach(-18,11); A.reachH=reach(-44,8);
A.kneelF=[[F({}),70],[F({h:[0,-18],lf:[-4,0],rf:[4,0],lh:[-6,-12],rh:[6,-12]}),110],[F({h:[0,-14],lf:[-5,0],rf:[5,0],lh:[-3,-4],rh:[3,-3],hd:'b'}),260],[F({h:[0,-14],lf:[-5,0],rf:[5,0],lh:[-2,-3],rh:[2,-2]}),200],[F({h:[0,-18],lf:[-4,0],rf:[4,0]}),110],[F({}),60]];
A.pickup=[[S({}),70],[S({h:[1,-21],ln:2,nf:[3,0,'f'],nh:[6,-17],fh:[1,-19]}),90],[S({h:[2,-17],ln:4,nf:[6,0,'f'],ff:[-4,0,'t'],nh:[12,-4],fh:[6,-10]}),110],[S({h:[2,-17],ln:4,nf:[6,0,'f'],ff:[-4,0,'t'],nh:[11,-3],fh:[6,-10],hd:'b'}),220],[S({h:[1,-21],ln:2,nf:[3,0,'f'],nh:[7,-18],fh:[1,-19]}),100],[S({nh:[3,-25]}),110],[S({}),60]];
A.reachB=[[F({},'B'),70],[F({rh:[5,-29]},'B'),100],[F({rh:[4,-33]},'B'),100],[F({rh:[4,-34],h:[0,-23]},'B'),280],[F({rh:[5,-29]},'B'),100],[F({},'B'),60]];
A.reachBH=[[F({},'B'),70],[F({lh:[-6,-31],rh:[6,-31]},'B'),100],[F({lh:[-5,-41],rh:[5,-41],h:[0,-24]},'B'),300],[F({lh:[-5,-41],rh:[5,-41],h:[0,-24]},'B'),200],[F({lh:[-6,-31],rh:[6,-31]},'B'),100],[F({},'B'),60]];
A.knock=[[F({},'B'),60],[F({rh:[4,-31]},'B'),90],[F({rh:[4,-33]},'B'),80],[F({rh:[4,-31]},'B'),80],[F({rh:[4,-33]},'B'),80],[F({rh:[4,-31]},'B'),80],[F({rh:[4,-33]},'B'),80],[F({},'B'),60]];
A.push=[[S({}),70],[S({ff:[-7,0,'t'],h:[0,-22],ln:2,nh:[8,-29],fh:[7,-28]}),100],[S({ff:[-9,0,'t'],h:[2,-22],ln:4,nh:[12,-29],fh:[11,-28],hd:'b'}),320],[S({ff:[-7,0,'t'],h:[0,-22],ln:2,nh:[8,-29],fh:[7,-28]}),100],[S({}),60]];
A.pull=[[S({}),70],[S({nh:[10,-28],fh:[9,-27],ln:1}),100],[S({h:[-3,-22],ln:-3,nf:[5,0,'h'],ff:[-5,0,'f'],nh:[7,-28],fh:[6,-27],hd:'b'}),320],[S({nh:[5,-26],fh:[4,-25]}),90],[S({}),60]];
A.think=[[S({}),80],[S({nh:[3,-30]}),100],[S({nh:[4,-37],fh:[2,-28]}),520],[S({nh:[4,-38],fh:[2,-28],hd:'b'}),120],[S({nh:[4,-37],fh:[2,-28]}),520],[S({nh:[3,-30]}),90],[S({}),60]];
A.look=[[S({}),60],[S({ln:1,h:[1,-23],ho:[1,0]}),140],[S({ln:1,h:[1,-23],ho:[1,0]}),700],[S({ln:1,h:[1,-23],ho:[1,0],hd:'b'}),100],[S({}),80]];
A.read=[[F({}),60],[F({lh:[-5,-27],rh:[4,-27]}),120],[F({it:'paper',lh:[-5,-28],rh:[4,-28],ho:[0,1]}),1400],[F({}),60]];
A.shrug=[[F({}),60],[F({lh:[-9,-25],rh:[9,-25],ho:[0,1]}),160],[F({lh:[-10,-27],rh:[10,-27],ho:[0,1],hd:'b'}),420],[F({}),80]];
A.talkS=[[S({hd:'o'}),130],[S({}),110],[S({hd:'o',nh:[5,-27]}),130],[S({nh:[6,-28]}),120],[S({hd:'o',nh:[6,-28]}),120],[S({nh:[5,-27]}),110],[S({hd:'o'}),120],[S({}),150]];
A.talkF=[[F({hd:'o'}),130],[F({}),110],[F({hd:'o',rh:[7,-26]}),130],[F({rh:[8,-27]}),120],[F({hd:'o'}),120],[F({}),150]];
A.talkB=[[F({},'B'),400]];
A.sit=[[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1}),1300],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1,hd:'b'}),110],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1,ho:[0,-1]}),900]];
A.sitTalk=[[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1,hd:'o'}),130],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-20],fh:[4,-14],sit:1}),130],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[8,-21],fh:[4,-14],sit:1,hd:'o'}),130],[S({h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],nh:[6,-14],fh:[4,-14],sit:1}),150]];
A.sitF=[[F({h:[0,-13],lf:[-3,0],rf:[3,0],lh:[-6,-12],rh:[6,-12],sit:1}),1300],[F({h:[0,-13],lf:[-3,0],rf:[3,0],lh:[-6,-12],rh:[6,-12],sit:1,hd:'b'}),110]];
A.smoke=[[S({}),80],[S({nh:[4,-27],it:'cig'}),140],[S({nh:[4,-36],it:'cig',hd:'b'}),700],[S({nh:[5,-30],it:'cig',ho:[0,-1]}),600],[S({nh:[3,-24],it:'cig'}),900],[S({nh:[4,-36],it:'cig',hd:'b'}),600],[S({nh:[3,-24],it:'cig'}),500],[S({}),80]];
// Telefonieren (Marko, alle Kapitel): dial – das Handy aus der Manteltasche nehmen, mit gesenktem Blick wählen (vier Tipps), ans Ohr; answer – nur herausnehmen und ans Ohr;
// phoneHold/phoneTalk – am Ohr halten bzw. dabei sprechen (als idle/talk, solange das Gespräch läuft; 05_engine.js phoneIntro/phoneEnd)
A.dial=[[S({}),80],[S({nh:[3,-18],hd:'b'}),160],[S({nh:[4,-17],it:'phone'}),140],[S({nh:[7,-26],it:'phone',ho:[1,1]}),240],[S({nh:[7,-27],it:'phone',ho:[1,1],fh:[0,-25]}),130],[S({nh:[7,-26],it:'phone',ho:[1,1],fh:[0,-26]}),130],
  [S({nh:[7,-27],it:'phone',ho:[1,1],fh:[0,-25]}),130],[S({nh:[7,-26],it:'phone',ho:[1,1],fh:[0,-26]}),130],[S({nh:[7,-27],it:'phone',ho:[1,1],fh:[0,-25]}),200],[S({nh:[5,-32],it:'phone'}),110],[S({nh:[2,-37],it:'phone'}),140]];
A.answer=[[S({}),80],[S({nh:[3,-18],hd:'b'}),140],[S({nh:[4,-17],it:'phone'}),120],[S({nh:[5,-30],it:'phone'}),110],[S({nh:[2,-37],it:'phone'}),120]];
A.phoneHold=[[S({nh:[2,-37],it:'phone'}),1400],[S({nh:[2,-37],it:'phone',hd:'b'}),110],[S({nh:[2,-37],it:'phone',ho:[0,-1]}),900],[S({nh:[2,-36],it:'phone',ho:[1,0]}),1100]];
A.phoneTalk=[[S({nh:[2,-37],it:'phone',hd:'o'}),130],[S({nh:[2,-37],it:'phone'}),110],[S({nh:[2,-37],it:'phone',hd:'o',ho:[1,0]}),130],[S({nh:[2,-37],it:'phone',ho:[1,0]}),120],[S({nh:[2,-37],it:'phone',hd:'o'}),120],[S({nh:[2,-37],it:'phone'}),150]];
A.drink=[[S({}),60],[S({nh:[6,-28],it:'cup'}),160],[S({nh:[4,-36],it:'cup',ln:-1,hd:'b'}),700],[S({nh:[6,-28],it:'cup'}),300],[S({}),80]];
A.surprise=[[S({}),60],[S({h:[0,-21],hd:'b',nh:[1,-20],fh:[-1,-20]}),90],[S({h:[-1,-24],ln:-2,nh:[5,-33],fh:[-3,-31]}),220],[S({h:[-1,-23],ln:-1,nh:[3,-27],fh:[-2,-26]}),500],[S({}),80]];
A.headache=[[F({}),60],[F({lh:[-4,-36],rh:[5,-30],hd:'b',ho:[0,1]}),260],[F({lh:[-4,-37],rh:[5,-30],hd:'b',ho:[0,1]}),900],[F({lh:[-4,-36],rh:[5,-30]}),300],[F({}),80]];
A.crouchS=[[S({h:[2,-14],ln:3,nf:[8,0,'f'],ff:[-3,0,'t'],nh:[9,-8],fh:[5,-10]}),999999]];
A.give=[[S({}),60],[S({nh:[8,-27]}),120],[S({nh:[12,-28],ln:1}),420],[S({nh:[8,-27]}),100],[S({}),60]];
A.waitF=[[F({lh:[-2,-19],rh:[2,-19]}),1400],[F({lh:[-2,-19],rh:[2,-19],hd:'b'}),110],[F({lh:[-2,-19],rh:[2,-19],ho:[0,-1]}),900]];
A.waitS=[[S({nh:[3,-19],fh:[2,-19],ln:1}),1400],[S({nh:[3,-19],fh:[2,-19],ln:1,hd:'b'}),110],[S({nh:[3,-19],fh:[2,-19],ln:1,ho:[1,0]}),1200]];
A.hugSelf=[[F({lh:[3,-28],rh:[-3,-28]}),1500],[F({lh:[3,-28],rh:[-3,-28],hd:'b'}),110]];
A.tinF=[[F({it:'tin'}),1600],[F({it:'tin',hd:'b'}),110]];
A.bow=[[S({}),80],[S({ln:3,h:[1,-23],nh:[2,-22],fh:[-1,-22],ho:[1,1]}),300],[S({ln:5,h:[1,-22],nh:[3,-21],fh:[0,-21],ho:[2,2],hd:'b'}),800],[S({ln:3,h:[1,-23]}),200],[S({}),100]];
// Schwindel und Übelkeit (Marko, Kapitel 1): abstützen, die Hand an die Stirn, die Hand vor den Mund; im Sitzen eigene Fassungen
A.steady=[[S({}),80],[S({ln:2,nh:[10,-19],fh:[8,-20]}),240],[S({ln:3,nh:[11,-17],fh:[9,-18],hd:'b',ho:[1,1]}),1500],[S({ln:2,nh:[10,-19],fh:[8,-20],ho:[0,1]}),500],[S({}),120]];
A.dizzy=[[F({}),80],[F({h:[-1,0],rh:[4,-35],hd:'b'}),380],[F({h:[1,0],rh:[4,-35],hd:'b'}),380],[F({rh:[4,-34],ho:[0,1]}),700],[F({}),100]];
A.nausea=[[S({}),80],[S({ln:1,nh:[5,-22],hd:'b'}),500],[S({ln:2,nh:[4,-31],hd:'b',ho:[1,1]}),1000],[S({ln:1,nh:[5,-22]}),400],[S({}),100]];
var SIT={h:[0,-13],nf:[9,0,'f'],ff:[7,0,'f'],fh:[4,-14],sit:1};
function sitP(o){ var r={}; Object.keys(SIT).forEach(function(k){ r[k]=SIT[k]; }); Object.keys(o||{}).forEach(function(k){ r[k]=o[k]; }); if (!r.nh) r.nh=[6,-14]; return S(r); }
A.sitSick=[[sitP({}),200],[sitP({nh:[5,-24],hd:'b',ho:[1,1]}),1400],[sitP({ho:[0,1]}),700]];
A.sitDrink=[[sitP({}),120],[sitP({nh:[5,-24],it:'cup',hd:'b'}),900],[sitP({nh:[7,-16],it:'cup'}),500],[sitP({}),120]];
A.sitWrite=[[sitP({nh:[9,-15]}),300],[sitP({nh:[10,-15],hd:'b'}),300],[sitP({nh:[9,-16]}),300],[sitP({nh:[10,-15]}),300]];
M.ANIMS=A;
// Kontaktbild: bei welchem Bild die Aktion "passiert"
M.CONTACT={reachM:3,reachL:3,reachH:3,kneelF:2,pickup:3,reachB:3,reachBH:3,knock:2,push:2,pull:2,read:2,give:2,drink:2,smoke:2};
})(M);

