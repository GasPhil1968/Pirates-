/* Podaca, die Terrasse im Spätsommer. Dieselbe Palette und Rastergröße wie die Erinnerung. */
(function(MA){
'use strict';
MA.paintPodaca = function(){
  var b=new M.Buf(320,112,M.P.s5),P=M.P,R=M.R,SC=MA.SC;
  var sky=R('b3 b4 s5 e4'), sea=R('a2 a3 a4 b4');
  for(var y=0;y<69;y++)for(var x=0;x<320;x++){
    var level=y<43?y/53:.32+(y-43)*.012+.13*Math.sin(y*2+x*.06);
    b.px(x,y,M.rampAt(y<43?sky:sea,level,x,y));
  }
  b.poly([[0,43],[0,23],[32,29],[52,35],[86,39],[119,41],[148,42]],P.b2);
  b.poly([[155,42],[191,39],[211,35],[238,34],[251,36],[280,36],[319,30],[319,43]],P.b3);
  for(var i=0;i<60;i++){var px=(i*47)%320,py=46+(i*7)%22;b.hl(px,px+1+i%5,py,P.b5);}
  b.poly([[187,51],[192,51],[191,53],[187,53]],P.w2);b.line(189,50,189,41,P.w4);b.poly([[188,42],[188,50],[184,50]],P.s6);
  SC.stoneWall(b,0,66,320,18,{sw:19,sh:6,cap:true});SC.kaldrma(b,0,84,320,28);
  SC.tree(b,5,93,{h:103,w:60,leaf:R('g0 g1 g2 g3')});
  // Vom alten Mann sind am Bildrand nur Ärmel, Hand und Zeitung zu sehen.
  b.poly([[0,102],[24,90],[39,92],[52,108],[54,111],[0,111]],P.b1);
  b.poly([[27,92],[40,85],[46,88],[48,99],[37,104]],P.p3);
  b.poly([[35,83],[68,70],[95,74],[109,69],[132,90],[101,99],[76,96],[54,107]],P.s5);
  b.line(94,75,104,96,P.s3); b.line(44,84,66,77,P.k2);
  for(var row=0;row<4;row++)b.line(51+row*2,89+row*2,76+row*2,81+row*2,P.m3);
  // Ein Löffel im Glas, ein altes Radio und die Katze auf der warmen Mauer.
  b.poly([[154,81],[262,81],[280,94],[143,94]],P.w3);b.rect(143,94,138,4,P.w1);
  b.rect(150,98,5,14,P.w1);b.rect(269,98,5,14,P.w1);
  b.rect(205,63,39,22,P.w0); b.rect(207,65,35,17,P.w3);
  b.rect(209,67,21,5,P.e4); for(var r=0;r<4;r++)b.hl(209,229,74+r*2,P.w1);
  b.ellipse(236,75,3,3,P.m1); b.line(238,63,251,42,P.m3);
  b.rect(169,78,10,10,P.a3);b.hl(169,178,78,P.s6);b.hl(170,177,87,P.a1);b.line(175,83,179,69,P.m4);
  MA.drawTerraceCat(b);
  return b;
};
})(MA);
