/* Der kleine Wirtschaftshof liegt eine Treppe unter dem Klassenfenster. */
(function(MA){
'use strict';
var P=M.P, R=M.R, SC=MA.SC;
function paint(S,G){
  var b=new M.Buf(320,144,P.s4);
  SC.sky(b,0,0,320,65,47);
  SC.hills(b,0,320,48,18,12,true);
  SC.house(b,29,71,74,43,{upper:'plaster'}); SC.minaret(b,243,56,42);
  SC.stoneWall(b,0,61,320,45,{sw:18,sh:8,cap:true});
  SC.kaldrma(b,0,106,320,38);
  b.poly([[0,9],[78,31],[78,109],[0,133]],P.w4);
  SC.window(b,28,31,23,28,{frame:R('s2 s3 s5 s6')});
  b.rect(6,64,24,52,P.w0); b.rect(9,67,18,48,P.w2);
  for(var i=0;i<5;i++) {b.rect(2-i,113+i*4,36+i*6,4,P.s3); b.hl(2-i,36+i*6,113+i*4,P.s5);}
  var ajar=G.flags['line.atWindow']||G.flags['gate.offen'], open=G.flags['gate.offen'];
  b.rect(133,53,77,56,P.k2);
  if(ajar){SC.kaldrma(b,135,89,72,18);SC.stoneWall(b,136,62,69,23,{sw:8,sh:4});}
  var w=open?13:ajar?49:72;
  for(var y=54;y<108;y++)for(var x=134;x<134+w;x++)b.px(x,y,M.tex.boards(x,y,R('w1 w2 w3 w4'),7));
  b.rect(134,63,w,3,P.w1); b.rect(134,92,w,3,P.w1);
  b.line(135,94,132+w,65,P.w4);
  b.rect(128,50,6,60,P.s4); b.rect(208,50,6,60,P.s4);
  var lx=131+w,ly=ajar?73:83;
  b.rect(lx-3,ly,6,13,P.m2);b.ellipse(lx,ly-2,3,3,P.m4);b.px(lx,ly-2,P.k1);
  if(G.flags['line.atWindow']){b.line(49,54,lx,ly-2,P.e3);b.line(49,53,lx,ly-3,P.e4);}
  b.rect(111,91,12,3,P.m1);b.vl(111,86,93,P.m3);b.px(112,86,P.m4);
  SC.stoneWall(b,259,87,61,23,{sw:15,sh:6,cap:true});
  return b;
}
async function secure(A){
  if(A.flag('gate.offen'))return A.say('Der Haken trägt jetzt den Flügel. Die Leine kann wieder mit.');
  if(!A.flag('line.atWindow'))return A.say('Ich kann den Flügel kaum rühren. Der Eisenbolzen sitzt unten im Stein.');
  await A.anim('push'); A.set('gate.offen'); A.note('n_tor','done'); await A.say('Ich drücke den Flügel bis an die Mauer. Der Haken fällt hinter die Strebe. Oben am Fenster hängt die Leine durch.'); A.save();
}
MA.defineRoom({id:'hinterhof',name:'Hinterhof der Schule',indoor:true,width:320,paint:paint,
  walk:[[[2,118],[68,105],[316,105],[316,143],[2,143]]],
  start:[48,120,'R'],entries:{fenster:[50,120,'R']},
  hotspots:[
    {id:'treppe',name:'Treppe zum Klassenfenster',r:[0,65,42,69],st:[39,125,'L'],exit:{to:'fenster'}},
    {id:'torfluegel',name:'Hölzerner Torflügel',r:[130,53,84,57],st:[170,118,'B'],look:function(A){return A.say(A.flag('gate.offen')?'Das Tor liegt an der Mauer.':A.flag('line.atWindow')?'Der Bolzen hängt an der Leine. Der Flügel schleift über das Pflaster.':'Der Bolzen steckt tief in der Schwelle. Oben am Beschlag sitzt eine Öse.');},push:secure,use:secure},
    {id:'raste',name:'Offenrast',r:[103,83,24,15],st:[117,114,'B'],look:'Ein eiserner Haken. Am Ende ist er blank, genau auf Höhe der Querstrebe.',use:secure}
  ]
});
})(MA);
