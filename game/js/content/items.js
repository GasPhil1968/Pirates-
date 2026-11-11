/* ===== M. Adventure – content/items.js =====
   Gegenstände des Kapitels Mostar 1955 (Beschreibungen in M.s Stimme), Kombinationen untereinander und mit M. selbst.
   Handlungen an Orten und Personen stehen bei den Räumen (hotspot.on[itemId]). */
(function(MA){
'use strict';
function stamped(G){ return !!G.flags['flag.stamped']; }
// Zeitungsfahne bauen: Zeitung + Stecken + Kleister im Löffel (zwei davon kombinieren, der dritte muss dabei sein)
async function makeFlag(A){ var missing = [];
  if (!A.has('zeitung')) missing.push('zeitung'); if (!A.has('stecken')) missing.push('stecken'); if (!A.has('loeffel_k')) missing.push('kleister');
  if (missing.indexOf('kleister') >= 0 && missing.length === 1){ await A.say('Ohne Kleister rutscht das Papier am Stecken herunter.'); return; }
  if (missing.indexOf('stecken') >= 0 && missing.length === 1){ await A.say('Kleister hätte ich. Ein Stock fehlt.'); return; }
  if (missing.indexOf('zeitung') >= 0 && missing.length === 1){ await A.say('Kleister und Stock hätte ich. Fehlt nur noch etwas, das weht.'); return; }
  if (missing.length){ await A.say('Daraus wird noch nichts.'); return; }
  await A.anim('reachL');
  A.take('zeitung'); A.take('stecken'); A.swap('loeffel_k', 'loeffel'); A.give('fahne'); A.set('flag.made');
  await A.say('Kleister auf den Rand, Zeitung um den Stecken, festdrücken.');
  await A.say(stamped(A.G) ? 'Der Stempel ist vorne. Gut.' : 'Eine Fahne. Fast.');
  if (!stamped(A.G)) A.note('n_fahne');
}
MA.makeFlag = makeFlag;

MA.defineItems({
  heft: { name: 'Heft', look: 'Mein Heft. Vorne Rechnen, hinten Platz.', open: 'Rechenaufgaben. Die letzte ist noch falsch. Heute nicht mein Problem.' },
  bleistift: { name: 'Bleistift', look: 'Ein Bleistift, kurz wie mein Taschengeld. Schreibt trotzdem.' },
  auftrag: { name: 'Abholauftrag', look: 'Mit Unterschrift des Lehrers: „Dem Überbringer bitte das Schulmaterial aushändigen.“ Der Überbringer bin ich.', read: '„Dem Überbringer bitte das Schulmaterial aushändigen.“ Darunter die Unterschrift. Der Überbringer bin ich.' },
  beutel: { name: 'Schulmaterialbeutel', look: 'Ein Leinenbeutel, adressiert an den Lehrer. Kreide klappert darin. Nicht für Dedo, nicht für Dragan.', open: 'Der Beutel gehört dem Lehrer. Mara hat es zweimal gesagt.' },
  karton: { name: 'Packkarton', look: 'Ein großes, flaches Stück Karton. Wenn ich wüsste, wo die zwölf Löcher hinmüssen …' },
  raster: { name: 'Karton mit Raster', look: 'Das Raster von Brankos Plan: drei Reihen, vier Plätze. Bei III/4 steht nichts. Zum Schneiden bräuchte ich eine gute Schere.' },
  einsatz: { name: 'Flascheneinsatz', look: 'Ein Kartoneinsatz mit zwölf Löchern. Jede Flasche hat ihren Platz. Mehr als ich.' },
  lohn: { name: 'Packlohn', look: 'Zwanzig Dinar Packlohn. Gezählt, geprüft, verdient.' },
  klammern: { name: 'Klammern', look: 'Drei Holzklammern von Mara. Sie halten fest, ohne zu fragen.' },
  reste: { name: 'Kartonreste', look: 'Die kleinen Stücke vom Packkarton. Mara sagt: gerade die.' },
  lieferschein: { name: 'Lieferschein', look: 'Zwölf Flaschen an die Helfer der Paradestraße. Unterschrift: fehlt noch.', read: '„Zwölf (12) Flaschen. Empfänger: Helfer, Paradestraße. Unterschrift: ______“' },
  schein_ok: { name: 'Lieferschein (unterschrieben)', look: 'Der Lieferschein, unterschrieben. Auf der Linie.', read: '„Zwölf (12) Flaschen.“ Darunter eine Unterschrift, genau auf der Linie.' },
  kiste: { name: 'Kiste mit zwölf Flaschen', look: 'Maras Kiste, zwölf Flaschen im Einsatz. Beim Anheben bleibt alles stehen.' },
  kiste_leer: { name: 'leere Kiste', look: 'Maras leere Kiste. Sie ist leichter, seit sie nichts mehr zu tragen hat.' },
  sandale: { name: 'gerissene Sandale', look: 'Meine linke Sandale. Der Riemen ist ab. Ich bräuchte etwas zum Festbinden.', self: 'Ohne Riemen hält sie nicht am Fuß. Eher hält der Fuß sie.' },
  senkel: { name: 'Schnürsenkel', look: 'Der Senkel aus dem Schuh, den jetzt Dedos Tisch trägt. Ein Tisch braucht keinen Senkel.',
    self: async function(A){ if (A.has('sandale')) return MA.COMBOS['senkel+sandale'](A); await A.say('Meine Sandalen haben keine Senkel. Bis jetzt brauchten sie keine.'); } },
  schuh: { name: 'rechter Schuh', look: 'Ein rechter Schuh. Solider Absatz – ungefähr so hoch wie der Spalt unter Dedos Tischbein.', self: 'Er ist mir zu groß, und er ist ein rechter. Ich bräuchte zwei Wunder.' },
  stecken: { name: 'Stecken', look: 'Ein gerader Stecken, an einem Ende noch Draht und ein Nagel. Bis eben hat er einen Tisch gehalten.' },
  abrieb: { name: 'Abrieb', look: 'Mein Abrieb von der Rückseite des Löffels: ein kleiner Stern und „1954“.', read: 'Ein kleiner Stern. Daneben, ganz deutlich jetzt: 1954.' },
  loeffel: { name: 'Löffel', look: 'Der „persönliche Frühstückslöffel des Schulgründers“. Hergestellt 1954. Er hat ein schönes Leben vor sich.' },
  loeffel_k: { name: 'Löffel mit Kleister', look: 'Der Löffel, gefüllt mit Kleister. Der Hals ist frei.' },
  murmel: { name: 'blaue Murmel', look: 'Dragans blaue Murmel. Nedim hat sie nicht verloren. Sie war nur unerreichbar.', self: 'Ich halte sie gegen das Licht. Blau. Dragan wird sie wiedererkennen.' },
  zeitung: { name: function(G){ return stamped(G) ? 'Zeitung (geprüft)' : 'Zeitung'; }, look: function(A){ return A.say(stamped(A.G) ? 'Dragans Zeitung, mit Brankos Stempel: GEPRÜFT. Hinten die Ergebnisse.' : 'Dragans Zeitung. Vorne der Besuch, hinten die Ergebnisse.'); },
    read: async function(A){ A.set('sport.read'); await A.doc({ title: 'Die Zeitung', text: ['Vorne: ein großes Bild von Tiko und viele Wörter, die mit „Freude“ anfangen.', 'Hinten, unter „Sport“: VELEŽ – 2:1.'] }); await A.say('Velež hat 2:1 gewonnen. Das wird nicht jeden freuen.'); } },
  fahne: { name: function(G){ return stamped(G) ? 'Zeitungsfahne (geprüft)' : 'Zeitungsfahne'; }, iconKey: function(G){ return stamped(G) ? 's' : ''; },
    iconAfter: function(b, G){ if (stamped(G)){ b.rect(16, 7, 6, 4, M.P.b1); b.hl(17, 20, 8, M.P.b3); } },
    look: function(A){ return A.say(stamped(A.G) ? 'Eine Zeitung am Stock. Vorne ein blauer Stempel: GEPRÜFT. Hinten noch die Ergebnisse. Die Fahne hat nichts vergessen.' : 'Eine Zeitung am Stock. Wenn ich winke, bewegt sie sich wie eine Fahne.'); },
    read: 'Hinten stehen noch die Ergebnisse. Velež 2:1. Die Fahne hat nichts vergessen.',
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
  vorlage: { name: 'gedruckte Vorlage', look: 'Die gedruckte Vorlage für den Ruf: „Živio drug Tiko!“ im Rahmen. Darunter, klein: „laut und deutlich, auf ein Zeichen“.',
    read: function(A){ return A.doc({ title: 'Gedruckte Vorlage', text: ['┌────────────────┐', '│ ŽIVIO DRUG TIKO! │', '└────────────────┘', '(laut und deutlich, auf ein Zeichen)'], mono: true }); } }
});

MA.defineCombos({
  'heft+bleistift': 'Ich könnte etwas aufschreiben. Mir fällt nur nichts ein, das hilft.',
  'karton+bleistift': 'Freihändig wird das schief. Ich bräuchte etwas zum Abzeichnen.',
  'karton+heft': 'Mein Heft hat Kästchen. Aber nicht in Flaschengröße.',
  'raster+bleistift': 'Das Raster ist fertig. Jetzt fehlt eine Schere, keine Linie.',
  'netz+leine': async function(A){ A.take('netz'); A.take('leine'); A.give('netzleine'); await A.say('Ich knote das Netz an die Leine. Doppelt. Mara hat mir nichts geschenkt, ich will nichts verlieren.'); },
  'netzleine+netz': 'Das Netz hängt schon dran.',
  'senkel+sandale': async function(A){ A.take('senkel'); A.take('sandale'); A.set('sandal', 'fixed'); A.note('n_sandale', 'done'); await A.anim('pickup'); await A.say('Ich fädle den Senkel durch die Sohle und knote den Riemen fest. Sitzt.'); },
  'reste+kreide': async function(A){ if (!A.flag('coat.known') && !A.flag('dedo.deal')){ await A.say('Ich könnte etwas draufschreiben. Aber was? „Hier könnte Ihre Werbung stehen“?'); return; }
    A.take('reste'); A.give('tafel'); await A.say('Ich lege zwei Reste übereinander und schreibe groß: MANTELKNÖPFE.'); await A.say('Wer einen braucht, liest das. Wer keinen braucht, liest es auch. Das ist Werbung.'); },
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
