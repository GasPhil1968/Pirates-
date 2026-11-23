/* Mostar 1955 – Handgriffe in Nahansicht. Jede Ansicht lässt sich ohne Materialverlust verlassen. */
(function (MA) {
'use strict';
var P = M.P;
function button(id, t) { return {id: id, t: t}; }
var back = {id: 'back', t: 'Zurück', cls: 'back'};
function grain(b, x, y, w, h, colors) {
  var ramp = M.R(colors);
  for (var yy = y; yy < y + h; yy++) {
    for (var xx = x; xx < x + w; xx++) b.px(xx, yy, M.tex.boards(xx, yy, ramp, 13));
  }
}
function bench(b) { grain(b, 0, 0, 320, 144, 'w0 w1 w2'); }
function label(b, t, x, y) { M.text(b, t, x+1, y+1, P.k0); M.text(b, t, x, y, P.s6); }
function step(api, message) { api.redraw(); api.say(message); }
function net(b, cx, y) {
  for (var dx = -22; dx <= 22; dx += 4) {
    b.line(cx+dx, y, cx+Math.round(dx*.55), y+18, P.e4);
  }
  for (var dy = 0; dy <= 18; dy += 3) {
    var w = Math.round(22-dy*.55); b.hl(cx-w, cx+w, y+dy, P.e3);
  }
}
function sphere(b, x, y, r, glass) {
  b.ellipse(x,y,r,r,glass?P.b0:P.w0); b.ellipse(x-1,y-1,r-1,r-1,glass?P.b3:P.s4);
  if (glass) b.line(x-r+2,y+1,x+r-3,y-3,P.b5);
  else { b.poly([[x-2,y-3],[x+2,y-4],[x+4,y],[x+1,y+3],[x-3,y+2]],P.w1); b.line(x+2,y-4,x+3,y-r+1,P.w2); }
  b.hl(x-r+2,x-r+4,y-3,P.s6);
}

// Nur die inneren Linien werden geschnitten. Die Kistenwände ersetzen die Außenkanten.
MA.definePuzzle('zuschnitt', {
  title:'Jasnas Plan auf Packkarton',
  init:function(s,d,api){s.long=0;s.short=0;api.say('Die vier Außenkanten stellt die Kiste. Wie viele Trennwände brauche ich innen?');},
  draw:function(b,s){
    bench(b); b.rect(26,16,180,116,P.w0); b.rect(23,13,180,116,P.w4);b.hl(23,202,13,P.w5);
    M.microText(b,'AUFSTELLUNG',36,22,P.w0);
    for(var i=0;i<5;i++){var xx=39+i*36;b.vl(xx,40,106,P.w2);}
    for(var j=0;j<4;j++){var yy=40+j*22;b.hl(39,183,yy,P.w2);}
    for(var r=0;r<3;r++)for(var col=0;col<4;col++) M.microText(b,['I','II','III'][r]+'/'+(col+1),43+36*col,48+r*22,P.w0);
    for(var l=0;l<Math.min(2,s.long);l++)b.hl(40,182,62+l*22,P.r2);
    for(var k=0;k<Math.min(3,s.short);k++)b.vl(75+k*36,41,105,P.r2);
    b.rect(216,21,89,74,P.s5);M.microText(b,'ZUSCHNITT',229,30,P.k2);
    M.text(b,'Lange: '+s.long,223,48,P.k2);M.text(b,'Kurze: '+s.short,223,67,P.k2);
    b.ellipse(231,114,5,6,P.r1);b.ellipse(231,114,3,4,P.w1);
    b.ellipse(235,125,5,6,P.r1);b.ellipse(235,125,3,4,P.w1);
    b.line(235,113,273,106,P.m4);b.line(239,124,272,99,P.m3);
  },
  buttons:function(s){return [button('long','Lange Stege: '+s.long),button('short','Kurze Stege: '+s.short),button('cut','Zuschneiden'),back];},
  press:function(s,id,api){
    if(id==='back')return api.done(null);
    if(id==='cut'){
      if(s.long===2 && s.short===3)return api.done('ok');
      return api.say(s.long>2||s.short>3?'Ich zähle die Außenwand mit. Die ist aus Holz und schon bezahlt.':'Zwischen zwei Plätzen fehlt noch eine Trennwand. Ich zähle die inneren Linien noch einmal.');
    }
    s[id]=(s[id]+1)%5; step(api,'Der Vermerk auf dem Zettel ändert sich. Nach vier fange ich wieder bei null an.');
  },
  tap:function(s,x,y,api){if(x>=215&&x<=305&&y<89)this.press(s,y<60?'long':'short',api);}
});

// Die Vorlage gibt die Fächer vor. Zu lange Stege lassen sich drehen und erneut ansetzen.
MA.definePuzzle('packplatz', {
  title:'Maras Packplatz',
  init:function(s,d,api){ s.long=0; s.short=0; s.axis='quer'; s.rows=0;
    api.say('Die Kerben sitzen paarweise gegenüber. Auf Jasnas Plan stehen drei Reihen zu vier.'); },
  draw:function(b,s){
    bench(b); grain(b,14,18,194,110,'w2 w3 w4'); grain(b,21,25,180,96,'w0 w1 w2');
    b.drect(21,25,180,6,P.w0,P.w1,.55); b.rect(21,25,4,96,P.w0);
    [[17,21],[204,21],[17,124],[204,124]].forEach(function(pt){b.ellipse(pt[0],pt[1],1,1,P.m2);b.px(pt[0],pt[1]-1,P.m4);});
    for(var rr=0;rr<3;rr++)for(var cc=0;cc<4;cc++){var cx=43+cc*45,cy=41+rr*32;
      for(var theta=0;theta<6.2;theta+=.35) b.px(cx+Math.round(8*Math.cos(theta)),cy+Math.round(6*Math.sin(theta)),P.w3);
    }
    for (var i=0;i<2;i++) {
      var y=57+i*32; b.rect(16,y-2,5,4,P.k1); b.rect(201,y-2,5,4,P.k1);
      if (i<s.long) { b.rect(21,y-2,180,4,P.w3); b.hl(21,200,y-2,P.w5); }
    }
    for (var j=0;j<3;j++){
      var x=66+j*45; b.rect(x-2,20,4,5,P.k1); b.rect(x-2,121,4,5,P.k1);
      if(j<s.short){ b.rect(x-2,25,4,96,P.w3); b.vl(x-2,25,120,P.w5); }
    }
    for(var r=0;r<s.rows;r++) for(var c=0;c<4;c++){
      var bx=43+c*45, by=40+r*32; b.ellipse(bx+1,by+2,9,10,P.k1); b.ellipse(bx,by,8,9,P.g2);
      b.ellipse(bx-1,by-2,6,7,P.g3); b.ellipse(bx-2,by-3,3,3,P.e3); b.px(bx-4,by-5,P.s6);
    }
    b.rect(222,19,88,57,P.w0);b.rect(220,16,87,58,P.s5);b.hl(221,305,16,P.s6);
    b.poly([[296,16],[306,16],[306,25]],P.s3); M.microText(b,'AUFSTELLUNG',230,22,P.m1);
    for(var k=0;k<5;k++) b.vl(232+k*15,36,63,P.b2);
    for(var l=0;l<4;l++) b.hl(232,292,36+l*9,P.b2);
    label(b, s.axis === 'quer'?'Quer':'Längs',225,85);
    if(s.axis==='quer') grain(b,223,102,70,5,'w2 w3 w5'); else grain(b,255,99,5,32,'w2 w3 w5');
    M.microText(b,'FLASCHEN '+(4*s.rows)+'/12',34,132,P.s5);
  },
  buttons:function(s){ return [button('rotate','Richtung drehen'),button('long','Langen Steg setzen'),button('short','Kurzen Steg setzen'),button('load','Vier Flaschen einsetzen'),back]; },
  press:function(s,id,api){
    if(id==='back') return api.done(null);
    if(id==='rotate'){ s.axis=s.axis==='quer'?'längs':'quer'; return step(api,s.axis==='quer'?'Von linker zu rechter Wand.':'Von der hinteren zur vorderen Wand.'); }
    if(id==='load'){
      if(s.long<2||s.short<3) return api.say('Zwei Flaschen würden sich berühren. Zwischen ihnen fehlt noch eine Wand.');
      if(++s.rows===3) return api.done('ok');
      return step(api,s.rows*4+' Flaschen stehen einzeln. Keine klirrt.');
    }
    var isLong=id==='long';
    if((isLong && s.axis!=='quer') || (!isLong && s.axis==='quer')) return api.say(isLong?'Der lange Steg steht über den Rand. So geht der Deckel nicht zu.':'Der kurze Steg erreicht die gegenüberliegende Kerbe nicht.');
    if(s[id]>=(isLong?2:3)) return api.say('In dieser Richtung sind alle Kerben besetzt.');
    s[id]++; step(api,isLong?'Der lange Steg sitzt zwischen den Seitenwänden.':'Der kurze Steg greift in die Schlitze.');
  },
  tap:function(s,x,y,api){ if(x>215&&y>78) this.press(s,'rotate',api); else if(x>=14&&x<=208&&y>=18&&y<=128) this.press(s,s.long===2&&s.short===3?'load':(s.axis==='quer'?'long':'short'),api); }
});

MA.definePuzzle('tischfuss', {
  title:'Unter Dedos Ladentisch',
  init:function(s,d,api){ s.lace=false; s.shoe=false; s.nail=false; s.wire=false; s.spoon=d.spoon; api.say('Der Draht verschwindet unter einem breiten Nagelkopf. Das ganze Gewicht liegt auf dem Stecken.'); },
  draw:function(b,s){
    bench(b); for(var yy=0;yy<115;yy++)for(var xx=0;xx<320;xx++) b.px(xx,yy,MA.SC.plaster(xx,yy,M.R('s2 s3 s4'),46));
    b.poly([[0,27],[105,27],[51,115],[0,115]],P.s2);
    b.rect(0,115,320,29,P.s3); for(var i=0;i<10;i++) b.line(i*39,115,i*43-17,143,P.s2);
    grain(b,15,13,290,18,'w1 w2 w4'); b.hl(15,304,13,P.w5);
    b.poly([[31,12],[84,12],[79,43],[35,40]],P.r1); for(var cy=16;cy<38;cy+=5)b.line(34,cy,79,cy+2,P.r2);
    b.ellipse(60,10,14,3,P.w0); b.ellipse(58,8,12,4,P.y3); b.ellipse(58,7,9,2,P.y1);
    b.rect(249,9,35,4,P.w2); b.hl(247,284,8,P.w4); grain(b,129,30,26,66,'w2 w3 w4');
    b.rect(129,96,26,3,P.w0); b.line(112,119,164,64,P.w2); b.line(114,119,166,64,P.w4);
    if(!s.wire){for(var k=0;k<3;k++) b.line(125,73+k*4,161,82+k*4,P.m3);}
    if(!s.nail){b.vl(151,70,80,P.m1); b.rect(147,68,10,4,P.m4);}
    var x=s.shoe?119:35,y=s.shoe?97:95;
    b.poly([[x,y],[x+17,y],[x+26,y+8],[x+41,y+10],[x+44,y+18],[x,y+18]],P.w1);
    b.line(x+2,y+2,x+13,y+2,P.w4); b.line(x+15,y+2,x+28,y+9,P.w3);
    b.hl(x+28,x+40,y+10,P.w3); b.hl(x+3,x+40,y+17,P.w4); b.rect(x,y+18,43,3,P.k1); b.rect(x,y+1,14,4,P.w3);
    if(!s.lace){for(var h=0;h<3;h++) b.line(x+13+h*3,y+4+h,x+21+h*3,y+8+h,P.e4);}
    if(s.spoon){b.line(222,103,264,73,P.m3); b.line(223,104,265,74,P.m4); b.ellipse(272,68,11,7,P.m3); b.ellipse(271,66,8,4,P.s5);}
    
  },
  buttons:function(){return [button('lace','Senkel herausziehen'),button('shoe','Schuh unterlegen'),button('nail','Nagel anhebeln'),button('wire','Draht abwickeln'),back];},
  press:function(s,id,api){
    if(id==='back') return api.done(null);
    if(id==='lace'){ if(s.lace)return api.say('Der Senkel ist schon draußen.'); s.lace=true;return step(api,'Der Senkel ist frei. Der Lederschuh behält seine Form.'); }
    if(id==='shoe'){if(!s.lace)return api.say('Der Senkel hängt unter dem Absatz. Wenn das Gewicht darauf liegt, bleibt er hier.'); s.shoe=true;return step(api,'Der Absatz füllt den Spalt. Oben hört das Geschirr auf zu wackeln.');}
    if(id==='nail'){if(!s.shoe)return api.say('Die Stütze trägt noch den Tisch. Schon beim Anheben klirren die Knöpfe.');if(!s.spoon)return api.say('Meine Nägel sind zu weich. Unter den Kopf passt ein flacher Metallhals.');s.nail=true;return step(api,'Der Löffelhals hebt den Nagel. Jetzt hat der Draht Spiel.');}
    if(!s.nail)return api.say('Die letzte Windung steckt unter dem Nagelkopf fest.');
    api.done('ok');
  },
  tap:function(s,x,y,api){if(y>92&&x<170)this.press(s,s.lace?'shoe':'lace',api);else if(x>=120&&x<170&&y>=60&&y<94)this.press(s,s.nail?'wire':'nail',api);}
});

MA.definePuzzle('rinne', {
  title:'Die Rinne unter der Schulbank',
  init:function(s,d,api){s.left=false; api.say('Die Murmel steckt vor einem Holzsplitter. Das Heft liegt rechts am Auslauf. Nedim hält die Bank.');},
  draw:function(b,s){
    for(var yy=0;yy<144;yy++)for(var xx=0;xx<320;xx++)b.px(xx,yy,M.tex.cobble(xx,yy,M.R('s1 s2 s3 s4'),9));
    grain(b,24,12,10,81,'w1 w2 w3'); grain(b,280,22,9,88,'w1 w2 w3');
    grain(b,6,16,305,29,'w2 w3 w5'); b.hl(6,310,16,P.w5); b.rect(7,43,300,4,P.w1);
    [[22,33],[286,31]].forEach(function(pt){b.ellipse(pt[0],pt[1],2,2,P.m2); b.px(pt[0],pt[1]-1,P.m4);});
    b.poly([[8,52],[302,72],[302,99],[8,79]],P.w3); b.line(8,65,288,86,P.k1); b.line(8,66,288,87,P.w5);
    b.poly([[163,73],[169,56],[172,75]],P.w5);
    b.poly([[228,99],[280,91],[309,103],[252,117]],P.b2); b.poly([[230,96],[257,91],[267,103],[244,109]],P.s5); b.poly([[257,91],[282,89],[299,98],[267,103]],P.s6);
    sphere(b,151,67,8,true);
    for(var j=0;j<3;j++)b.line(237+j*3,99+j,254+j*3,96+j,P.b3);
    b.line(257,92,266,103,P.s3);
    var x=s.left?140:161; b.line(x,72,x+(s.left?-53:51),110,P.m4); b.line(x,73,x+(s.left?-53:51),111,P.m3); b.ellipse(x+(s.left?-58:56),114,9,6,P.m3);
    label(b,'Auslauf',245,118);
  },
  buttons:function(){return [button('turn','Löffel umsetzen'),button('roll','Murmel über den Splitter heben'),back];},
  press:function(s,id,api){if(id==='back')return api.done(null);if(id==='turn'){s.left=!s.left;return step(api,s.left?'Der Löffelhals liegt links hinter der Murmel.':'Der Löffelhals liegt rechts vor der Murmel.');}if(!s.left)return api.say('So rollt sie nach links, vom Heft weg. Nedim hält sie mit dem Daumen auf.');api.done('ok');},
  tap:function(s,x,y,api){if(y>47&&x>75&&x<221)this.press(s,'turn',api);else if(x>222&&y>82)this.press(s,'roll',api);}
});

MA.definePuzzle('bergung', {
  title:'Über der Neretva',
  init:function(s,d,api){s.lane=1;s.caught=false;api.say('Dragan hält das Seil. Die Steinlippe fällt nach rechts ab. Am Ende ist ein Stück ausgebrochen.');},
  draw:function(b,s){
    var river=M.R('a1 a2 a3 a4 a5');
    for(var y=0;y<144;y++) for(var x=0;x<320;x++){
      var glint=Math.sin(x*.14+Math.sin(y*.15)*2+y*.9);
      b.px(x,y,M.rampAt(river,.37+.12*Math.sin(y*.42+x*.024)+.08*glint+(y/144)*.13,x,y));
    }
    for(var i=0;i<78;i++){var rx=(i*67)%323,ry=64+(i*37)%76;b.hl(rx,rx+2+i%4,ry,i%4?P.a4:P.a5);}
    var stone=M.R('s2 s3 s4 s5');
    for(var xx=0;xx<320;xx++){
      var edge=xx<194?45+Math.floor(xx*.1):xx<209?60-Math.floor((xx-194)*1.7):37+Math.floor((xx-209)*.04);
      for(var yy=0;yy<=edge;yy++) b.px(xx,yy,M.tex.ashlar(xx+9,yy+2,stone,46,18));
      b.px(xx,edge,P.s6); b.vl(xx,edge+1,edge+6,P.s2);b.px(xx,edge+7,P.s1);
    }
    var nx=108+s.lane*46; b.line(65,1,nx-22,90,P.e4); b.line(73,1,nx+22,90,P.e4); net(b,nx,90);
    sphere(b,s.caught?nx:150,s.caught?94:51,9,false);
    if(!s.caught){b.line(81,2,141,49,P.w1);b.line(81,0,141,47,P.w4);}
    M.microText(b,'NERETVA',246,128,P.a5);
  },
  buttons:function(s){return s.caught?[button('lift','Netz hochziehen'),back]:[button('left','Netz nach links'),button('right','Netz nach rechts'),button('nudge','Ball anrollen'),back];},
  press:function(s,id,api){
    if(id==='back')return api.done(null);
    if(id==='lift'&&s.caught)return api.done('ok');
    if(id==='left'||id==='right'){s.lane=Math.max(0,Math.min(3,s.lane+(id==='left'?-1:1)));return step(api,'Dragan hält die Leine wieder straff.');}
    if(s.lane!==2)return api.say('Ich halte den Ball mit dem Stock zurück. Er würde durch die Scharte rechts rollen. Dort hängt kein Netz.');
    s.caught=true;step(api,'Der Ball rollt über die Kante. Das Netz wird schwer. „Hab ihn!“, ruft Dragan.');
  },
  tap:function(s,x,y,api){if(s.caught)return this.press(s,'lift',api);if(y<70)return this.press(s,'nudge',api);this.press(s,x<108+s.lane*46?'left':'right',api);}
});
})(MA);
