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

### 5. Raster und Einsatz (B1)
14. Über die **Karte** zur **Schule**. **Jasna**: „Kann ich den Plan abzeichnen?“ → *Packkarton* auf den **Aufstellungsplan** → *Karton mit Raster* (III/4 bleibt frei).
15. **Klassenzimmer**, **Lehrer**: „Ich brauche Ihre Schere. Für einen Flascheneinsatz.“ → *Flascheneinsatz*. (Alternative: *Karton mit Raster* auf die **Schere**.)

### 6. Probe (B5, S16–S18)
16. **Lehrer**: „Hier ist Ihr Schulmaterial. Von Mara.“ → erste Probe im Hof scheitert: Die Klasse ruft „Živio drugi Tiko!“ und „Laut und deutlich!“. Antwort: „Die Kinder haben die falsche Vorlage richtig gelernt.“ → *gedruckte Vorlage*.
17. *Vorlage* auf die **Probetafel** → „Wort „drugi“ → „Das I wegwischen“; „Rahmen“ → „Rahmen nur um die Rufzeile“.
18. Rollen: **Jasna** „Du liest die Zeile im Rahmen vor.“, **Nedim** „Du achtest darauf, dass alle auf das Zeichen warten.“
19. **Lehrer**: „Die Tafel stimmt jetzt. Wir können es noch einmal versuchen.“ → Probe gelingt.
    - Ohne korrigierte Tafel oder ohne Rollen scheitert die Wiederholung mit eigener Rückmeldung.

### 7. Knopf und Kreide (B5, S19)
20. **Lehrer** ansehen und ansprechen: „Ihnen fehlt ein Knopf.“ → „Dedo hat Knöpfe.“ Der Lehrer hält den Mantel zu.
21. *Heft* auf den **Lehrer** → *Knopfskizze* (dunkel, vier Löcher, Größe).
22. **Kreide** nehmen (oder „Darf ich ein Stück Kreide nehmen?“).

### 8. Packen und Lieferauftrag (B1, S07)
23. **Markt**: *Flascheneinsatz* auf **Maras Kiste** → „Bin ich jetzt Facharbeiter?“ → „Ich trage sie.“ → *Packlohn*, *Klammern*, *Kartonreste*, *Kiste mit zwölf Flaschen*, *Lieferschein*.
24. *Kartonreste* + *Kreide* → *Werbetafel* („MANTELKNÖPFE“).

### 9. Schuh, Stecken, Werbung (B3, S12–S13, S20)
25. **Dedo**: „Ich nehme den rechten Schuh.“ → „Ich habe dafür gearbeitet.“ (Packlohn) → *rechter Schuh*.
26. *Schuh* auf **Dedos Tisch** (unter das kurze Bein) → **Stecken** nehmen → *Stecken*, *Schnürsenkel*.
27. **Dedo**: „Ich kann dir bessere Werbung machen.“ → „Du sollst hinterher nicht sagen, es war Zufall.“ → Abmachung: Werbung gegen Pfeife.

### 10. Lieferung (B4, S24–S27)
28. Mit der Kiste zur **Gasse** → die Sandale reißt (S24): „Ich kann sie auch so tragen.“ → *gerissene Sandale*; Mara nimmt die Kiste.
29. *Schnürsenkel* + *gerissene Sandale* → geflickt. **Mara**: „Gib mir die Kiste wieder. Die Sandale hält.“
30. **Straßensperre**: **Plakatkleber** „Brauchst du eine Hand?“ → *Klammern* aufs **Plakat** → *Löffel mit Kleister* (Klammern kommen zurück).
31. **Dienstvorschrift** lesen (Pfiffsignale; Fähnchen müssen geprüft sein).
32. **Schlagbaum** → Jovan prüft den Lieferschein (S25): „Soll ich wegsehen, solange du zählst?“ → **Paradestraße**.
33. **Helfer** zweimal ansprechen (Kiste abstellen), „Ich lade die nächste Reihe ab.“ zweimal, dann den **Getränketisch** benutzen (dritte Reihe) → Unterschrift → *Lieferschein (unterschrieben)*, *leere Kiste*.
    - Zu früh „Hier unterschreiben.“: „Ich unterschreibe die Lieferung, nicht die Absicht.“
34. Zurück zum **Markt**, **Mara**: „Hier sind Kiste und Schein.“ → „Du musst nicht erst noch etwas kontrollieren?“ → *Netz*, *Zugleine*.

### 11. Murmel und Tor (C1, C2)
35. **Schulhof**: *Heft* auf die **Bank** (Auffangfläche), *Löffel mit Kleister* auf die **Bank** (Nedim hebt an, wenn die Absprache steht) → *blaue Murmel*, *Heft* zurück.
36. **Klassenzimmer** → **Fenster zum Hinterhof**: **Fensterflügel** öffnen → *Zugleine* auf den **Riegel** → **Büste** auf die Leine *Schiebe* → das Tor zur Passage schwingt in die Offenrast → **Zugleine** wieder nehmen.
    - Leine einhängen und loslassen: „Der Mechanismus funktioniert leider auch ohne mich.“

### 12. Brücke (C1, C3, S15, S29)
37. **Markt** → **Stari Most**, **Dragan**: „Deine Murmel.“ → *Zeitung*; „Ich bringe dich mit dem Ball hinaus. Du überlässt mir deinen Platz.“ → Abmachung.
38. *Netz* + *Zugleine* → *Netz an der Leine* → auf die **Brüstung** (unter dem Gesims). **Dragan**: „Hältst du die Leine?“ → „Wir machen das langsam.“
39. *Stecken* auf **Dragans Ball** → Ball im Netz → **Dragan**: „Dein Ball.“ → Dragan geht zur Passage.

### 13. Fahne (A3, S23)
40. *Zeitung* + *Stecken* → *Zeitungsfahne* (mit dem Kleister aus dem Löffel; *Löffel* bleibt).
41. **Schulhof**: *Zeitungsfahne* in die **Ablage „Materialprüfung“** → „Jetzt ist es keine Zeitung mehr?“ → gestempelt GEPRÜFT.
    - Falsche Ablage: „Das ist keine Liste.“ / „Sonstiges ist sonstig.“

### 14. Werbung und Pfeife (B5, S21)
42. **Jasna**: „Kommt ihr mit zu Dedo? Wir rufen etwas anderes.“ (braucht Werbetafel, Knopfskizze, gelungene Probe). Die Klasse ruft, der Lehrer kommt.
43. Knopfkiste: den Knopf wählen, der zur Skizze passt (dunkel, vier Löcher, mittlere Größe – „Knopf 4“), „Der passt.“ → Lehrer zahlt → *Pfeife*.
    - Falsche Knöpfe haben eigene Sätze (zwei Löcher, hell, zu groß, zu klein, Marine-Anker).

### 15. Signal und Flucht (C4, S30–S31)
44. **Straßensperre**: *Pfeife* zweimal antippen → *Benutze* → „Zwei kurze Pfiffe“ → Jovan geht nach vorn, Dragan entkommt → *Ausweis III/4*.
    - Falsches Signal („Ein langer Pfiff“, „Drei kurze Pfiffe“): „Übe leiser.“ – ohne Folgen.

### 16. Finale (S32–S35)
45. **Schlagbaum**: „III/4. Mit geprüftem Fähnchen.“ → Aufstellung. Branko ruft „Dragan?“: „Ich heiße M.“ führt zur Wahl zurück, „Hier.“ schließt ab.
46. Parade, Entlassung, Abschlusstext, Abschlussbild „Kapitel Mostar 1955 abgeschlossen“ → „Zum Hauptmenü“ (Titelbild zeigt „Kapitel Mostar abgeschlossen ✓“).

## Was offen bleiben darf (keine Sackgassen)
- Pflichtgegenstände werden erst verbraucht, wenn ihr Zweck erfüllt ist (Einsatz in der Kiste, Zeitung/Stecken in der Fahne, Kleister beim Fahnenbau). *Heft*, *Bleistift*, *Löffel*, *Klammern* und *Zugleine* kommen nach dem Einsatz zurück.
- Mara gibt den Karton erneut, die Sandale reißt nur einmal, alle Rätsel-Nahansichten lassen sich abbrechen und wiederholen.
- Durch die Sperre geht es mit der Kiste nur einmal; zurück in die Paradestraße erst nach der Lieferung (Hinweis im Spiel).
