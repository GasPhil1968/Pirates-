/* ===== M. Adventure – content/items.js =====
   Gegenstände des Kapitels Mostar 1955 (Beschreibungen in M.s Stimme), Kombinationen untereinander und mit M. selbst.
   Handlungen an Orten und Personen stehen bei den Räumen (hotspot.on[itemId]). */
(function(MA){
'use strict';
function stamped(G){ return !!G.flags['flag.stamped']; }
// Ein fehlender dritter Bestandteil darf später hinzukommen. Papier und Stock lassen sich wieder trennen.
async function makeFlag(A){
  if (A.has('zeitung') && A.has('stecken') && !A.has('loeffel_k')){
    A.take('stecken'); A.swap('zeitung','rohling');
    return A.say('Ich falte die Zeitung um den Stock. Noch lässt sie sich herunterschieben. Die Sportseite liegt außen.');
  }
  if (A.has('zeitung') && A.has('loeffel_k') && !A.has('stecken')){
    A.swap('loeffel_k','loeffel'); A.swap('zeitung','klebrand');
    return A.say('Kleister auf den Rand. Ich schlage ihn nach außen um, bis ich einen Stock habe.');
  }
  if (A.has('stecken') && A.has('loeffel_k') && !A.has('zeitung')){
    A.swap('loeffel_k','loeffel'); A.swap('stecken','klebstab');
    return A.say('Ein Streifen Kleister um den Stock. Den Griff lasse ich trocken.');
  }
  await A.anim('reachL');
  ['zeitung','stecken','rohling','klebrand','klebstab'].forEach(function(id){ A.take(id); });
  if (A.has('loeffel_k')) A.swap('loeffel_k','loeffel');
  A.give('fahne'); A.set('flag.made');
  await A.say('Ich drücke die Naht fest. Die Rückseite lässt sich noch lesen.');
  await A.say(stamped(A.G) ? 'Der Stempel ist vorne. Gut.' : 'Eine Fahne. Fast.');
  A.note('n_fahne', stamped(A.G) ? 'done' : 'open');
}
async function readSport(A){
  A.set('sport.read');
  await A.doc({title:'Sportteil · Fußball',text:['VELEŽ MOSTAR – SARAJEVO  2:1','Der Siegtreffer fiel kurz vor dem Abpfiff. Der Spielbericht endet genau dort, wo Dragan das Papier einmal gefaltet hat.']});
  await A.say('Zwei zu eins. Dragan hat das Ergebnis mit dem Bleistift umkringelt.');
}
MA.makeFlag = makeFlag;

MA.defineItems({
  heft: { name: 'Heft', look: 'Mein Heft. Vorne Rechnen, hinten Platz.', open: 'Rechenaufgaben. Die letzte ist noch falsch. Heute nicht mein Problem.' },
  bleistift: { name: 'Bleistift', look: 'Ein Bleistift, kurz wie mein Taschengeld. Schreibt trotzdem.' },
  auftrag: { name: 'Abholauftrag', look: 'Mit Unterschrift des Lehrers: „Dem Überbringer bitte das Schulmaterial aushändigen.“ Der Überbringer bin ich.', read: '„Dem Überbringer bitte das Schulmaterial aushändigen.“ Darunter die Unterschrift. Der Überbringer bin ich.' },
  beutel: { name: 'Schulmaterialbeutel', look: 'Ein Leinenbeutel, adressiert an den Lehrer. Kreide klappert darin. Nicht für Dedo, nicht für Dragan.', open: 'Der Beutel gehört dem Lehrer. Mara hat es zweimal gesagt.' },
  karton: { name: 'Packkarton', look: 'Ein großes, flaches Stück Karton. Wenn ich wüsste, wie man daraus zwölf Fächer macht …' },
  raster: { name: 'Karton mit Raster', look: 'Das Raster von Brankos Plan: drei Reihen, vier Plätze. Bei III/4 steht nichts. Zum Schneiden bräuchte ich eine gute Schere.' },
  einsatz: { name: 'Fünf Kartonstege', look: 'Zwei lange Streifen und drei kurze. Jeder ist bis zur Mitte geschlitzt. Jasnas Plan steckt dazwischen.' },
  lohn: { name: 'Packlohn', look: 'Zwanzig Dinar Packlohn. Gezählt, geprüft, verdient.' },
  klammern: { name: 'Klammern', look: 'Drei Holzklammern von Mara. Sie halten fest, ohne zu fragen.' },
  reste: { name: 'Kartonreste', look: 'Die kleinen Stücke vom Packkarton. Mara sagt: gerade die.' },
  lieferschein: { name: 'Lieferschein', look: 'Zwölf Flaschen an die Helfer der Paradestraße. Unterschrift: fehlt noch.', read: '„Zwölf (12) Flaschen. Empfänger: Helfer, Paradestraße. Unterschrift: ______“' },
  schein_ok: { name: 'Lieferschein (unterschrieben)', look: 'Der Lieferschein, unterschrieben. Auf der Linie.', read: '„Zwölf (12) Flaschen.“ Darunter eine Unterschrift, genau auf der Linie.' },
  kiste: { name: 'Kiste mit zwölf Flaschen', look: 'Maras Kiste, zwölf Flaschen im Einsatz. Beim Anheben bleibt alles stehen.' },
  kiste_leer: { name: 'leere Kiste', look: 'Maras leere Kiste. Sie ist leichter, seit sie nichts mehr zu tragen hat.' },
  sandale: { name: 'gerissene Sandale', look: 'Meine linke Sandale. Der Riemen ist ab. Ich bräuchte etwas zum Festbinden.', self: 'Ohne Riemen hält sie nicht am Fuß. Eher hält der Fuß sie.' },
  draht: { name:'Bindedraht', look:'Der dünne Draht von Dedos Tisch. Doppelt gelegt wird daraus eine Öse.' },
  nagel: { name:'Breitkopfnagel', look:'Ein stumpfer Nagel. Durchs Leder passt er immer noch.' },
  flickzeug: { name:'Flickzeug', look:'Ein Senkel mit einer kleinen Drahtschlaufe zum Durchfädeln.' },
  senkel: { name: 'Schnürsenkel', look: 'Der Senkel aus dem Schuh, den jetzt Dedos Tisch trägt. Ein Tisch braucht keinen Senkel.',
    self: async function(A){ if (A.has('sandale')) return MA.COMBOS['senkel+sandale'](A); await A.say('Meine Sandalen haben keine Senkel. Bis jetzt brauchten sie keine.'); } },
  schuh: { name: 'rechter Schuh', look: 'Ein rechter Schuh. Solider Absatz – ungefähr so hoch wie der Spalt unter Dedos Tischbein.', self: 'Er ist mir zu groß, und er ist ein rechter. Ich bräuchte zwei Wunder.' },
  stecken: { name: 'Stecken', look: 'Ein gerader Stecken mit einer hellen Kerbe vom Draht. Bis eben hat er einen Tisch gehalten.' },
  abrieb: { name: 'Abrieb', look: 'Mein Abrieb von der Rückseite des Löffels: ein kleiner Stern und „1954“.', read: 'Ein kleiner Stern. Daneben, ganz deutlich jetzt: 1954.' },
  loeffel: { name: 'Löffel', look: 'Der „persönliche Frühstückslöffel des Schulgründers“. Hergestellt 1954. Er hat ein schönes Leben vor sich.' },
  loeffel_k: { name: 'Löffel mit Kleister', look: 'Der Löffel, gefüllt mit Kleister. Der Hals ist frei.' },
  murmel: { name: 'blaue Murmel', look: 'Dragans blaue Murmel. Nedim hat sie nicht verloren. Sie war nur unerreichbar.', self: 'Ich halte sie gegen das Licht. Blau. Dragan wird sie wiedererkennen.' },
  zeitung: { name: function(G){ return stamped(G) ? 'Zeitung (geprüft)' : 'Zeitung'; }, look:readSport, read:readSport },
  rohling: {name:'Lockere Zeitungsfahne',icon:'fahne',look:'Der Falz hält nur, solange ich die Zeitung festhalte.',read:readSport,
    open:async function(A){A.swap('rohling','zeitung');A.give('stecken');await A.say('Das Papier gleitet vom Stock.');}},
  klebrand:{name:'Zeitung mit Klebrand',icon:'zeitung',look:'Der Rand ist bestrichen, die Sportseite bleibt lesbar.',read:readSport},
  klebstab:{name:'Stecken mit Kleister',icon:'stecken',look:'Am oberen Ende klebt der Stecken. Unten kann ich ihn immer noch anfassen.'},
  fahne: { name: function(G){ return stamped(G) ? 'Zeitungsfahne (geprüft)' : 'Zeitungsfahne'; }, iconKey: function(G){ return stamped(G) ? 's' : ''; },
    iconAfter: function(b, G){ if (stamped(G)){ b.rect(16, 7, 6, 4, M.P.r1); b.hl(17, 20, 8, M.P.r3); } },
    look: function(A){ return A.say(stamped(A.G) ? 'Eine Zeitung am Stock. Vorne ein blauer Stempel: GEPRÜFT. Hinten noch die Ergebnisse. Die Fahne hat nichts vergessen.' : 'Eine Zeitung am Stock. Wenn ich winke, bewegt sie sich wie eine Fahne.'); },
    read:readSport,
    self: 'Ich winke ein bisschen. Niemand winkt zurück. Noch nicht.' },
  netz: { name: 'Netz', look: 'Maras Einkaufsnetz. Löcher, die zusammenhalten.' },
  leine: { name: 'Zugleine', look: 'Maras Zugleine. Lang genug für ein Stockwerk oder eine Brücke.' },
  netzleine: { name: 'Netz an der Leine', look: 'Das Netz, an die Zugleine geknotet. Ein Ende zum Halten, ein Ende zum Fangen.' },
  kreide: { name: 'Kreide', look: 'Ein Stück Kreide aus dem Klassenzimmer. Weiß, wie die Hemden heute sein sollen.' },
  skizze: { name: 'Knopfskizze', look: 'Meine Skizze vom Mantelknopf des Lehrers: dunkel, vier Löcher, genau diese Größe.' },
  tafel: { name: 'Werbetafel', look: 'Ein Schild aus Kartonresten, in Kreide: MANTELKNÖPFE. Groß genug für jemanden, der einen braucht.' },
  pfeife: { name: 'Pfeife', look: 'Dedos Pfeife. Sie hat ihm Kundschaft gebracht. Mal sehen, was sie mir bringt.',
    use: async function(A){ if (MA.whistle) return MA.whistle(A); await A.say('Hier pfeife ich nicht. Hier hört mich niemand, der zählt.'); },
    self: async function(A){ if (MA.whistle) return MA.whistle(A); await A.say('Hier pfeife ich nicht. Hier hört mich niemand, der zählt.'); } },
  ball: { name: 'Dragans Ball', look: 'Dragans Ball. Trocken. Er weiß nicht, wie knapp das war.', self: 'Ich könnte ihn prellen. Aber er gehört Dragan.' },
  ausweis: { name: 'Ausweis III/4', look: 'Dragans Teilnehmerausweis: „Platz III/4“. Kein Foto. Nur ein Name, der nicht meiner ist.', read: '„Teilnehmerausweis. Schulgruppe. Platz: III/4.“ Darunter Dragans Name.' },
  streifen:{name:'Zwei Kartonstreifen',look:'Zwei schmale, helle Abschnitte aus Maras Packkarton. Man könnte sie aus der letzten Reihe sehen.'},
  karten:{name:'Ruf- und Pausenkarte',look:'Ein Streifen zeigt einen offenen Mund, der andere eine flache Hand. Auch die letzte Reihe kann das sehen.'},
  vorlage: { name: 'gedruckte Vorlage', look: 'Die gedruckte Vorlage für den Ruf: „Živio drug Tiko!“ im Rahmen. Darunter, klein: „laut und deutlich, auf ein Zeichen“.',
    read: function(A){ return A.doc({ title: 'Gedruckte Vorlage', text: ['┌────────────────┐', '│ ŽIVIO DRUG TIKO! │', '└────────────────┘', '(laut und deutlich, auf ein Zeichen)'], mono: true }); } }
});

async function kartenMalen(A){
  if (!A.has('vorlage')) return A.say('Zwei leere Schilder. Solange ich nichts zu sagen habe, bleiben sie so.');
  A.swap('streifen','karten'); await A.say('Auf einen Streifen zeichne ich einen offenen Mund, auf den anderen eine flache Hand. Von hinten sehen beide Zeichen verschieden aus.');
}
async function flicken(A){
  if (!A.has('nagel') || !(A.has('flickzeug') || (A.has('senkel') && A.has('draht')))){
    await A.say('Am Rand ist das Loch ausgerissen. Ich brauche etwas zum Vorstechen und eine Schlaufe, die den Senkel durchzieht.'); return;
  }
  await A.anim('pickup'); A.take('senkel'); A.take('draht'); A.take('flickzeug'); A.take('sandale');
  A.set('sandal','fixed'); A.note('n_sandale','done');
  await A.say('Mit dem Nagel steche ich neben dem Riss ein Loch. Die Drahtöse zieht den Senkel durch. Zwei Knoten. Den Nagel stecke ich ein.');
}
MA.defineCombos({
  'streifen+vorlage': kartenMalen, 'streifen+bleistift':kartenMalen,
  'heft+bleistift': 'Ich könnte etwas aufschreiben. Mir fällt nur nichts ein, das hilft.',
  'karton+bleistift': 'Freihändig wird das schief. Ich bräuchte etwas zum Abzeichnen.',
  'karton+heft': 'Mein Heft hat Kästchen. Aber nicht in Flaschengröße.',
  'raster+bleistift': 'Das Raster ist fertig. Jetzt fehlt eine Schere, keine Linie.',
  'netz+leine': async function(A){ A.take('netz'); A.take('leine'); A.give('netzleine'); await A.say('Ich knote das Netz an die Leine. Doppelt. Mara hat mir nichts geschenkt, ich will nichts verlieren.'); },
  'netzleine+netz': 'Das Netz hängt schon dran.',
  'senkel+draht': async function(A){ A.take('senkel'); A.swap('draht','flickzeug'); await A.say('Ich drehe eine kleine Drahtöse um den Senkel. Die fasert beim Durchfädeln wenigstens nicht aus.'); },
  'nagel+sandale': flicken, 'draht+sandale': flicken, 'senkel+sandale': flicken, 'flickzeug+sandale': flicken,
  'reste+kreide': async function(A){ if (!A.flag('coat.known') && !A.flag('dedo.deal')){ await A.say('Ich könnte etwas draufschreiben. Aber was? „Hier könnte Ihre Werbung stehen“?'); return; }
    A.take('reste'); A.give('tafel'); await A.say('Ich lege zwei breite Reste übereinander und schreibe groß: MANTELKNÖPFE.'); await A.say('Wer einen braucht, liest das. Wer keinen braucht, liest es auch. Das ist Werbung.'); },
  'rohling+loeffel_k':makeFlag, 'klebrand+stecken':makeFlag, 'klebstab+zeitung':makeFlag,
  'zeitung+stecken': makeFlag, 'loeffel_k+zeitung': makeFlag, 'loeffel_k+stecken': makeFlag,
  'loeffel+zeitung': 'Mit einem leeren Löffel klebt nichts.', 'loeffel+stecken': 'Löffel und Stecken. Damit könnte ich trommeln. Oder es lassen.',
  'abrieb+loeffel': 'Der Abrieb passt genau auf die Rückseite. Der Löffel lügt also nicht. Nur die Geschichte dazu.',
  'skizze+reste': 'Die Skizze brauche ich selbst, um den richtigen Knopf zu finden.', 'skizze+tafel': 'Die Skizze bleibt bei mir. Ich muss den Knopf erkennen, nicht der Kunde.',
  'einsatz+kiste': 'Der Einsatz kommt in Maras Kiste – bei Mara, wo die Flaschen stehen.',
  'ausweis+fahne': 'Ausweis und Fahne. Mehr verlangt die Vorschrift nicht. Mehr habe ich auch nicht.',
  'murmel+ball': 'Die Murmel ist Dragans, der Ball auch. Sammeln lohnt sich bei ihm.',
  'pfeife+fahne': 'Pfeifen und winken zugleich. So stelle ich mir Branko an einem freien Tag vor.'
});
})(MA);
