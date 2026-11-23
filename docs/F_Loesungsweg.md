# F2. Lösungsweg – Kapitel Mostar 1955 „Der Genosse kommt!“

**Entwicklerdokumentation, nicht Teil der Spieloberfläche.** Der Weg entspricht dem automatisierten Durchlauf `tools/playthrough.js`, der das Spiel ausschließlich über die Oberfläche bedient (Klicks/Fingertipps auf Bildschirmkoordinaten, Antwortknöpfe, Inventar, Rätselknöpfe). Ergebnisse siehe `F_Pruefbericht.md`.

Schreibweise: **Ort** · *Gegenstand* · „Antwort im Gespräch“ · S01–S35 = Szenennummern des PDF-Skripts. „X auf Y“ = Gegenstand X wählen, dann Y antippen.

## Überblick

Drei Ketten greifen ineinander (Details und Begründungen: `C_Kapitelentwurf_Mostar.md`, Abschnitt C4):

- **A – Papiere und Plätze:** auf die Liste kommen, einen Platz finden, ein geprüftes Fähnchen.
- **B – Arbeit und Lohn:** Mara (Schulmaterial, Flaschen, Lieferung) und Dedo (Löffel, Schuh, Stecken, Werbung, Pfeife).
- **C – Dragans Flucht:** Murmel, Tor, Ball, Signal – dafür überlässt Dragan M. Platz III/4 und seinen Ausweis.

Nach dem Abholauftrag (Schritt 4) sind fast immer mehrere Aufgaben gleichzeitig offen; die Reihenfolge unten ist eine von vielen. Durchlauf B (`tools/playthrough_b.js`) spielt eine deutlich andere Reihenfolge mit vielen Fehlversuchen.

## Kritischer Pfad

### 1. Einstieg (Schulhof)
1. Erzähltext lesen. Branko findet M. nicht auf der Liste (S01). Antwort: „Ich gehe zum Lehrer. Der kennt mich.“ → Notiz *Branko findet mich nicht auf seiner Liste*.
2. Das **Schultor** bleibt zu („Bleib bei deiner Gruppe.“). Durch die **Schulhaustür** ins **Klassenzimmer**.

### 2. Kohlepapier (Kette A1, S02–S03)
3. **Lehrer** ansprechen: „Ich schaue mir die Blätter genauer an.“
4. **Listenmappe** → *Öffne*. In der Nahansicht: Der Nachtrag „13. M.“ steht auf dem Original, aber das Kohlepapier liegt zu hoch.
   - Lösung: „Original anheben“ → „Kohlepapier tiefer“ → „Original zurücklegen“ → „Mit dem Bleistift nachfahren“.
   - Nachfahren ohne Verschieben: „Unten kommt nichts an. Das Kohlepapier liegt zu hoch.“ (beliebig oft wiederholbar).
5. Danach im Gespräch: „Sagen Sie Branko, dass ich nichts falsch gemacht habe?“ → *Abholauftrag*; das Schultor ist jetzt offen.
6. Nebenbei: **Plakette** an der Büste *Lies* („gest. 1898“) – wird für Dedos Löffel gebraucht.

### 3. Zuspitzung: Nachtrag ohne Platz (A2)
7. Zurück in den Hof, **Branko**: „Ich stehe jetzt im Durchschlag. Der Lehrer hat es korrigiert.“ → Zwölf Plätze, zwölf Namen, keiner für M. Dann „Bekomme ich ein Fähnchen?“ → nur für Namen mit Platz.
8. **Jasna**: „Wo ist Dragan denn?“ → Platz III/4 ist frei, Dragan ist an der Brücke.
9. **Nedim**: Dragans Murmel liegt in der Fuge unter der Bank. „Du hältst das Bankende. Ich hole sie heraus.“ (Absprache; ausgeführt wird später.)

### 4. Markt: Mara und Dedo (B1, B2)
10. Durch das Schultor zum **Markt**. **Mara**: „Zeig mir, worauf ich achten muss.“, dann „Gut. Ich packe sie.“ → *Schulmaterialbeutel*, *Packkarton*. (Zwölf Flaschen, drei Reihen zu vier, keine darf an die andere schlagen.)
11. **Dedo**: „Was ist an dem Löffel so besonders?“ → „Darf ich ihn umdrehen?“ Die Prägung ist zu flach zum Lesen.
12. *Heft* auf den **Löffel auf Samt** → Abrieb zeigt „1954“ → *Abrieb*. (Bleistift geht auch.)
13. **Dedo**: „Der Schulgründer starb 1898.“ → „Deine Herkunftsbeschreibung ist falsch.“ → Garantie: Die Ware gehört dem, der es beweist → *Löffel*.
    - Nur ein Beleg: „Eine Jahreszahl allein widerlegt keine Geschichte.“

### 5. Raster und Zuschnitt (B1)
14. Über die **Karte** zur **Schule**. **Jasna**: „Kann ich den Plan abzeichnen?“ → *Packkarton* auf den **Aufstellungsplan** → *Karton mit Raster* (III/4 bleibt frei).
15. **Klassenzimmer**, **Lehrer**: „Ich brauche Ihre Schere. Für einen Flascheneinsatz.“ → Nahansicht **Zuschnitt**: Die Kiste stellt die vier Außenwände, gebraucht werden nur die inneren Trennwände: **2 lange und 3 kurze Stege** → „Zuschneiden“ → *Fünf Kartonstege*. (Alternative: *Karton mit Raster* auf die **Schere**.)
    - Zu viele: „Ich zähle die Außenwand mit …“; zu wenige: „Zwischen zwei Plätzen fehlt noch eine Trennwand.“ Die Zähler laufen nach 4 wieder auf 0.

### 6. Erste Probe und Tafel (B5, S16–S18)
16. **Lehrer**: „Hier ist Ihr Schulmaterial. Von Mara.“ → erste Probe im Hof scheitert: Die Klasse ruft „Živio drugi Tiko!“ und „Laut und deutlich!“. Antwort: „Die Kinder haben die falsche Vorlage richtig gelernt.“ → *gedruckte Vorlage*.
17. *Vorlage* auf die **Probetafel** → „Wort „drugi“ → „Das I wegwischen“; „Rahmen“ → „Rahmen nur um die Rufzeile“.
18. Rollen: **Jasna** „Du liest die Zeile im Rahmen vor.“, **Nedim** „Du achtest darauf, dass alle auf das Zeichen warten.“
19. Eine Wiederholung (über den Lehrer oder die neue **Schulglocke** am Eingang) scheitert jetzt noch: Nedim sieht M.s Hand von hinten nicht. Jasna: Beim Packen bleiben helle Kartonstreifen übrig.

### 7. Packen, Lohn, Streifen (B1, S07)
20. **Markt**: *Fünf Kartonstege* auf **Maras Kiste** → Nahansicht **Packplatz**: Lange Stege nur in Richtung „Quer“, kurze nur „Längs“: „Langen Steg setzen“ ×2 → „Richtung drehen“ → „Kurzen Steg setzen“ ×3 → „Vier Flaschen einsetzen“ ×3.
    - Falsche Richtung: „Der kurze Steg erreicht die gegenüberliegende Kerbe nicht.“ / „Der lange Steg steht über den Rand.“ Flaschen vor allen Stegen: „Zwischen ihnen fehlt noch eine Wand.“
21. „Bin ich jetzt Facharbeiter?“ → „Ich trage sie.“ → *Packlohn*, *Klammern*, *Kartonreste*, *Zwei Kartonstreifen* (nur solange die Probe noch nicht gelungen ist), *Kiste mit zwölf Flaschen*, *Lieferschein*.

### 8. Schuh, Tischfuß, Stecken (B3, S12–S13)
22. **Dedo**: „Ich nehme den rechten Schuh.“ → „Ich habe dafür gearbeitet.“ (Packlohn) → *rechter Schuh*.
23. *Schuh* auf **Dedos Tisch** → Nahansicht **Unter Dedos Ladentisch**: „Senkel herausziehen“ → „Schuh unterlegen“ → „Nagel anhebeln“ (geht nur mit dem *Löffel* im Inventar, sein Hals hebelt) → „Draht abwickeln“.
    - Nagel zuerst: „Die Stütze trägt noch den Tisch.“; Schuh vor dem Senkel: „Der Senkel hängt unter dem Absatz.“
24. **Stecken** nehmen → *Stecken*, *Schnürsenkel*, *Bindedraht*, *Breitkopfnagel*.

### 9. Sandale (B4, S24)
25. Mit der Kiste zur **Gasse** (oder über die Karte) → die Sandale reißt: „Ich kann sie auch so tragen.“ → *gerissene Sandale*; Mara nimmt die Kiste.
26. *Schnürsenkel* + *Bindedraht* → *Flickzeug* (Drahtöse); *Flickzeug* + *gerissene Sandale* → mit dem Nagel vorgestochen, geflickt; der *Nagel* bleibt. (Senkel direkt auf die Sandale geht auch, sobald Nagel und Draht da sind.)
    - Ohne Nagel/Draht: „Am Rand ist das Loch ausgerissen …“
27. **Mara**: „Gib mir die Kiste wieder. Die Sandale hält.“
28. *Zwei Kartonstreifen* + *gedruckte Vorlage* (oder + *Bleistift*, wenn die Vorlage schon im Inventar ist) → *Ruf- und Pausenkarte*.

### 10. Lieferung (B4, S22, S25–S27)
29. **Straßensperre**: **Plakatkleber** „Brauchst du eine Hand?“ → *Klammern* aufs **Plakat**. Er kann loslassen, will aber erst zum Kiosk, wenn jemand den Sportteil hat (Kleister gibt es später).
30. **Dienstvorschrift** lesen (Pfiffsignale; Fähnchen müssen geprüft sein).
31. **Schlagbaum** → Jovan prüft Kiste, Sandale und Lieferschein (S25): „Soll ich wegsehen, solange du zählst?“ → **Paradestraße**.
32. **Helfer** zweimal ansprechen, „Ich lade die nächste Reihe ab.“ zweimal, dann den **Getränketisch** benutzen (dritte Reihe) → *leere Kiste*. **Helfer** erneut ansprechen → Unterschrift → *Lieferschein (unterschrieben)*.
    - Zu früh „Hier unterschreiben.“: „Ich unterschreibe die Lieferung, nicht die Absicht.“ Zurück zur Sperre geht es erst mit Unterschrift.
33. Zurück zum **Markt**, **Mara**: „Hier sind Kiste und Schein.“ → „Du musst nicht erst noch etwas kontrollieren?“ → *Netz*, *Zugleine*.

### 11. Zweite Probe, Knopf, Kreide (B5, S19)
34. **Klassenzimmer**, **Lehrer**: „Die Tafel stimmt jetzt …“ (oder die **Schulglocke**) → mit den Karten gelingt die Probe; Karten und Vorlage werden verbraucht.
35. **Lehrer** ansehen und ansprechen: „Ihnen fehlt ein Knopf.“ → „Dedo hat Knöpfe.“ → *Heft* auf den **Lehrer** → *Knopfskizze*. **Kreide** nehmen.
36. *Kartonreste* + *Kreide* → *Werbetafel* („MANTELKNÖPFE“).

### 12. Murmel und Tor (C1, C2)
37. **Schulhof**: *Heft* auf die **Bank**, *Löffel* (leer oder mit Kleister) auf die **Bank** → Nahansicht **Rinne**: „Löffel umsetzen“ (Hals links hinter die Murmel) → „Murmel über den Splitter heben“ → *blaue Murmel*, *Heft* zurück.
    - Löffel rechts: „So rollt sie nach links, vom Heft weg.“
38. **Klassenzimmer** → **Fenster zum Hinterhof**: **Fensterflügel** öffnen → *Zugleine* auf den **Riegel** (braucht etwas Langes im Inventar: Stecken oder Fahne) → **Büste** *Schiebe* → das Tor öffnet sich nur eine Handbreit.
39. Über die neue **Hoftreppe** (links, bei offenem Fenster) in den **Hinterhof** → **Torflügel** *Schiebe* (oder **Offenrast** *Benutze*) → das Tor hängt im Haken. Über die **Treppe** zurück zum Fenster, **Zugleine** nehmen.
    - Leine vorher nehmen: „Ich muss das Tor sichern, bevor ich sie mitnehme.“

### 13. Brücke (C1, C3, S15, S29)
40. **Markt** → **Stari Most**, **Dragan**: „Deine Murmel.“ → *Zeitung*; „Ich bringe dich mit dem Ball hinaus. Du überlässt mir deinen Platz.“ → Abmachung.
41. *Netz* + *Zugleine* → *Netz an der Leine* → auf die **Brüstung**. **Dragan**: „Hältst du die Leine?“ → „Wir machen das langsam.“
42. *Stecken* (oder Fahne) auf **Dragans Ball** → Nahansicht **Über der Neretva**: Der Ball rollt durch die Scharte rechts: „Netz nach rechts“ (einmal, von der Startposition) → „Ball anrollen“ → „Netz hochziehen“ → *Dragans Ball*. **Dragan**: „Dein Ball.“ → Dragan geht zur Passage.

### 14. Sportteil, Kleister, Fahne (A3, S22, S23)
43. *Zeitung* *Lies* → Sportteil „Velež Mostar – Sarajevo 2:1“.
44. *Zeitung* + *Stecken* → *Lockere Zeitungsfahne* (lässt sich mit *Öffne* wieder trennen).
45. **Straßensperre**: *Lockere Zeitungsfahne* (oder *Zeitung*) auf den **Plakatkleber** → „Velež hat 2:1 gewonnen“ → er prüft am Kiosk, klebt das Plakat, gibt die *Klammern* zurück. *Löffel* auf den **Kleistereimer** → *Löffel mit Kleister*.
46. *Lockere Zeitungsfahne* + *Löffel mit Kleister* → *Zeitungsfahne* (*Löffel* bleibt). Jede Zweierkombination aus Zeitung, Stecken und Kleister ergibt ein Zwischenstück, das dritte Teil kommt später dazu.
47. **Markt**, **Dedo**: „Ich kann dir bessere Werbung machen.“ → „Du sollst hinterher nicht sagen, es war Zufall.“ → Abmachung.
48. **Schulhof**: *Zeitungsfahne* in die **Ablage „Materialprüfung“** → „Jetzt ist es keine Zeitung mehr?“ → gestempelt GEPRÜFT.

### 15. Werbung und Pfeife (B5, S21)
49. **Jasna**: „Kommt ihr mit zu Dedo? Wir rufen etwas anderes.“ Die Klasse ruft, der Lehrer kommt. Knopfkiste: „Knopf 4“ (dunkel, vier Löcher) → „Der passt.“ → Lehrer zahlt Dedo.
50. **Dedo**: „Die Tafel gegen die Pfeife. Wie vereinbart.“ (oder *Werbetafel* auf **Dedo**) → *Pfeife*.

### 16. Signal und Flucht (C4, S30–S31)
51. **Straßensperre**: *Pfeife* *Benutze* → „Zwei kurze Pfiffe“ → Jovan geht nach vorn (braucht gelesene Vorschrift, Dragan an der Passage, offenes Tor).
52. **Dragan** ansprechen → Dragan entkommt → *Ausweis III/4*.
    - Falsches Signal: „Übe leiser.“; zu früh: „Noch nicht …“

### 17. Finale (S32–S35)
53. **Schlagbaum**: „III/4. Mit geprüftem Fähnchen.“ → **Paradestraße**. Den **Freien Platz III/4** benutzen → Aufstellung. Branko ruft „Dragan?“: „Ich heiße M.“ führt zur Wahl zurück, „Hier.“ schließt ab.
54. Parade, Entlassung, Erinnerungsbild **Podaca · 2018** (Terrasse, Zeitung, Sportteil), Abschlussbild → „Zum Hauptmenü“.

## Was offen bleiben darf (keine Sackgassen)
- Pflichtgegenstände werden erst verbraucht, wenn ihr Zweck erfüllt ist (Stege in der Kiste, Karten bei der gelungenen Probe, Zeitung/Stecken/Kleister in der Fahne). *Heft*, *Bleistift*, *Löffel*, *Klammern*, *Nagel* und *Zugleine* kommen nach dem Einsatz zurück.
- Alle neuen Nahansichten (Zuschnitt, Packplatz, Tischfuß, Rinne, Bergung) lassen sich mit „Zurück“ ohne Materialverlust verlassen.
- Alte Spielstände (1.0) werden beim Laden ergänzt: Wer schon gepackt hat, bekommt die Kartonstreifen; wer den Stecken schon hat, Draht und Nagel.
- Mara gibt den Karton erneut, die Sandale reißt nur einmal, alle Rätsel-Nahansichten lassen sich abbrechen und wiederholen.
- Durch die Sperre geht es mit der Kiste nur einmal; zurück in die Paradestraße erst nach der Lieferung (Hinweis im Spiel).
