# F1. Prüfbericht – Kapitel Mostar 1955

Stand 11.11.2026, Fassung siehe Titelbild bzw. `MA.BUILD` in `game/js/engine/core.js`. Geprüft in der Arbeitsumgebung (Linux-Container) mit dem vorinstallierten Chromium über Playwright. **Echte Geräte, Safari/WebKit und Firefox wurden nicht geprüft**, und es gab keine Spieltests mit Menschen.

## 1. Methode

Der Testfahrer `tools/driver.js` bedient das Spiel nur über die Oberfläche:
- Stellen, Figuren, Boden und Ausgänge per echtem Maus- bzw. Fingerereignis an Bildschirmkoordinaten,
- Antworten, Inventar, Rätselknöpfe und Menüs über die sichtbaren Knöpfe, im Touch-Profil getippt.

Der Lesezugang `window.MADV` liefert nur Positionen und Zustände zum Prüfen; er setzt keine Fortschrittswerte. Jeder Schritt prüft danach Gegenstände, Zustände oder erwartete Spielsätze.

| Lauf | Ansicht | Inhalt | Ergebnis |
| --- | --- | --- | --- |
| Durchlauf A `tools/playthrough.js` | Desktop 1280×800, Maus | kompletter Weg Titel → Abschlussbild → Hauptmenü; dazu Fehlversuche (Kohlepapier ohne Verschieben, zu frühe Unterschrift, falscher Knopf, falsches Signal, „Ich heiße M.“) und Speichern auf Platz 1 vor dem Finale | **bestanden**, 42/42 Schritte, keine Browserfehler |
| Durchlauf A | „iPhone 13 landscape“ (Touch-Emulation, 750×342, Seitenleisten-Layout) | derselbe Weg mit Fingertipps (auch Inventar, Antworten und Menüs getippt) | **bestanden**, 42/42 Schritte, keine Browserfehler |
| Durchlauf A | „iPad (gen 7) landscape“ (Touch-Emulation, 1080×810, Standardlayout) | derselbe Weg mit Fingertipps | **bestanden**, 42/42 Schritte, keine Browserfehler |
| Durchlauf B `tools/playthrough_b.js` | Desktop 1280×800 | andere Reihenfolge, rund 30 Fehlversuche, richtiges Signal zu früh (wird verweigert), Ball mit der Fahne statt dem Stecken, Speichern auf Platz 2 → Seite neu laden → Platz 2 laden (Raum, Inventar, Zustand verglichen), „Fortsetzen“ über das Titelbild mit Rückblick „Zuletzt“ | **bestanden**, 29/29 Schritte, 751 Dialogzeilen, keine Browserfehler |
| Layoutprüfung `tools/layout_check.js` | 8 Profile: Desktop 1280×800 und 1024×640, iPad (7. Gen.) quer, Galaxy S24 quer, iPhone 16 Pro Max quer, iPhone 13 quer, iPhone SE quer, iPhone 13 hoch | Titel, Verben, Gespräch, Gegenstandswahl, Notizen, Karte, Menü, Einstellungen, Rätsel. Per DOM geprüft: Knöpfe innerhalb der Bühne, abgeschnittene Beschriftungen, Tippflächen unter 24 px, sichtbarer Schließen-Knopf | erster Lauf: viele Befunde auf Telefonen und Tablet (Abschnitt 3); nach den Korrekturen **ohne Befund** auf allen 8 Profilen, keine Browserfehler |
| Karte `tools/map_check.js` | Desktop | nur bekannte Orte sichtbar; „Stari Most“ nach Nedims Hinweis bekannt, aber ohne Auftrag gesperrt mit Grund; aus Innenräumen keine Reise; mit Auftrag Markt und Brücke offen, Sperre/Paradestraße weiter unbekannt; Reise über die Karte | **bestanden**, 10/10 Prüfungen |
| Offline | Chromium, Ursprung 127.0.0.2 | Service Worker installiert, „Offline bereit ✓“, Neuladen ohne Netz (Titel, Schrift, neues Spiel), neue Fassung wird auf dem Titelbild übernommen, alter Cache gelöscht | **bestanden** |
| Start über `file://` | Chromium | Titelbild, Pixelschrift geladen, neues Spiel startet | **bestanden** |
| Ausgeliefertes ZIP | entpackt, eigener Server | Fassung im Titel, alle 43 Einträge des Service Workers abrufbar (HTTP 200), keine fehlerhaften Antworten, neues Spiel startet | **bestanden** |

Zeitliche Einordnung: Die Durchläufe A (Desktop, iPhone) und B liefen auf dem Endstand bis auf zwei kleine, spät ergänzte Touch-Korrekturen (Szene als Klickziel, Mindestbreite des ✕). Der iPad-Durchlauf, die Layoutprüfung und der ZIP-Test liefen danach auf dem ausgelieferten Stand.

## 2. Abdeckung der geforderten Prüfungen

- **Vollständiger Weg:** Durchlauf A mit Maus und mit Fingertipps.
- **Alternative Reihenfolgen** (Durchlauf B):
  - Markt vor dem Plan,
  - Brücke vor allem anderen,
  - Schere über den Gegenstand statt über das Gespräch,
  - Lieferung zuerst abgelehnt, Sperre und Plakat (Velež-Variante) vor der Lieferung,
  - Fenster vor dem Ball, Ball vor der Abmachung,
  - Zeitung gestempelt, bevor die Fahne gebaut ist,
  - Probe erst spät,
  - Knopfgespräch mit der anderen Antwort.
- **Gespräche vor und nach Hinweisen:**
  - Dedo: Jahreszahl ohne Plakette, danach mit beiden Belegen.
  - Jasna: Werbung ohne Skizze wird abgelehnt.
  - Jovan: Signalfragen, bevor das Signal gebraucht wird.
  - Lehrer: Wiederholung ohne Korrektur.
  - Branko: Nachtrag vor und nach dem Kohlepapier.
- **Wiederholte Interaktionen und Szenenwechsel:** viele Ortswechsel hin und zurück, wiederholte Gespräche (Wechselsätze), Rätsel abgebrochen und erneut geöffnet, falsches Signal zweimal.
- **Falsche Gegenstandsanwendungen:** unter anderem
  - Heft auf Branko, Bleistift auf die Bank, Heft auf die Tafel, Heft auf den Löffel vor dem Umdrehen,
  - Löffel auf die Bank ohne Absprache, Karton auf den Plan ohne Erlaubnis,
  - Zeitung in die falschen Ablagen, Leine auf den Riegel bei geschlossenem Fenster, Büste ohne Leine,
  - Stecken auf den Ball ohne Netz.
  
  Jeder Fall wird mit dem erwarteten Satz geprüft.
- **Speichern und Laden an mehreren Stellen:**
  - Platz 1 vor dem Finale (A),
  - Platz 2 in der Paradestraße mit Neuladen der Seite (B),
  - automatischer Stand mit „Fortsetzen“ und „Zuletzt“ an der Sperre (B),
  - „Zum Titelbild“ speichert automatisch.
- **Erreichbarkeit der Hinweise:** Alle Hinweise des kritischen Pfads werden in A oder B tatsächlich angesehen oder erfragt (Plakette, Vorschrift, Plan, Schild, Mappe, Tafel, Gespräche).
- **Sackgassen:**
  - Pflichtgegenstände werden erst verbraucht, wenn ihr Zweck erfüllt ist; Werkzeuge kommen zurück.
  - Die Sperre lässt mit der Kiste nur einmal durch, zurück erst nach der Lieferung (geprüft).
  - Das richtige Signal wird vor der Zeit verweigert (geprüft).
  - Das Finale wird ohne Ausweis verweigert (geprüft).
- **Desktop und mobil:** Layoutprüfung auf acht Profilen und vollständiger Touch-Durchlauf.
- **Browserfehler, fehlende Dateien, blockierte Dialoge:** In allen Läufen wurden `pageerror`, `console.error` und fehlgeschlagene Anfragen mitgeschrieben. Blockierte Dialoge wurden gefunden und behoben (Abschnitt 3).

## 2a. Überarbeitung von Grafik und Bewegung (zweite Runde)

Auf Rückmeldung („zu wenig Details, Hauptfigur zu steif, Figuren ohne Eigenleben“) neu hinzugekommen:

**Figuren:**
- Neuer Detail-Zeichner für das MALA-Rig. Die MALA-Datei selbst bleibt unverändert.
- Neu gezeichnete Köpfe aller 16 Figuren.
- Ärmel, Hände, kurze Hosen, Socken, Schuhe und Sandalen, Gürtel, Halstuchknoten, Armbinden, Zöpfe.
- Porträts mit größeren Köpfen und zwei Pixel hohen Augen.

**Bewegung:**
- Gehzyklus mit Armschwung, Atmen und Gewichtsverlagerung im Stand.
- Wechselnde Sprechgesten, Drehung über die Vorderansicht.

**Eigenleben:**
- Gewohnheiten je Figur, Blick zu M., kleine Wege, Gespräche der Kinder, Ungeduld von M.

**Umgebung:**
- Tauben, Katze, Passanten, eine belebte Zuschauermenge.
- Wehende Fahnen, schwingende Wimpel und Wäsche, Laubschimmer.
- Zusatzdetails am Schulhof, auf dem Markt und an der Paradestraße.

Danach liefen alle Prüfungen aus Abschnitt 1 erneut. Die Ergebnisse dort gelten für diesen Stand.

## 3. Gefundene und behobene Fehler

| Befund | Behebung |
| --- | --- |
| Gespräche blieben nach Handlungen offen (Nedim hebt die Bank, Löffel umdrehen, Ballbergung, Abmachung mit Dragan) – der nächste Schritt war blockiert | Die Handlung beendet das Gespräch |
| Kombination Senkel + Sandale hing endlos (Animation ohne Ende) | kurze Aufheb-Animation |
| Unterschrift des Helfers mit leerer Kiste nicht erreichbar | Bedingung korrigiert; nach der dritten Vierergruppe folgt die Unterschrift von selbst |
| Klick während eines Ortswechsels wurde verschluckt bzw. löste Doppelaktionen aus | Eingaben während des Übergangs gesperrt |
| Pfeife blieb nach direkter Benutzung ausgewählt | Auswahl wird aufgehoben |
| „Klassenkameraden“: Klick auf die Mitte traf die Schulhaustür | Klickpunkt auf die Kinder gelegt |
| Spielzeit zählte während Szenen nicht | zählt bis zum Kapitelende |
| Telefon quer: Seitenleisten-Layout ohne Maße (CSS-Variablen fehlten) | Maße werden gesetzt |
| Verbknöpfe mit dem Finger in der Leiste abgeschnitten | eigene Zeile über der Szene |
| iPad/Telefon: Einstellungen und Menü ohne sichtbares „Zurück“, Karte unten abgeschnitten, Titelmenü auf kleinen Telefonen abgeschnitten | ✕ oben rechts bleibt beim Scrollen sichtbar, Tippen neben ein Fenster schließt es, Karte in Szenengröße, Titelmenü zweispaltig |
| Kleine Tippflächen im Standardlayout auf Telefonen (21–23 px hoch) | Telefone nutzen die Seitenleisten (46 px hohe Knöpfe); breitere Inventarpfeile; Inventarfelder schrumpfen, damit die Reihe zwischen die Leisten passt |
| Menü eines gewählten Gegenstands verdeckte im Seitenleisten-Layout das Ziel (Löffel auf Dedos Tisch) | Erster Tipp wählt nur; Menü erst beim zweiten Tipp oder über „Ansehen“ |
| Layout sprang beim Wechsel zwischen Finger und Maus (z. B. iPad mit Trackpad) zwischen zwei Anordnungen | Layout hängt am Gerät, nicht an der letzten Eingabe |
| Touch: Das Gegenstandsmenü wurde mit zu geringer Höhe berechnet und überdeckte das Inventarfeld; der vom Browser nachgereichte Klick des zweiten Tipps löste „Benutze“ aus (die Pfeife pfiff ungewollt) | Menü nach seiner tatsächlichen Höhe über dem Feld platziert; frisch geöffnete Menüs nehmen nach einem Fingertipp 0,2 s keine Klicks an |
| Klassenzimmer: M. erschien beim Eintreten genau auf dem Lehrer | Eintrittspunkt an die Tür verlegt |
| Touch: Ein Tipp knapp über der Leiste (noch in der Szene) öffnete die Notizen – der Browser verschiebt Fingertipps zum nächsten anklickbaren Element, und die Szene galt nicht als anklickbar | Szene als Klickziel angemeldet; etwas mehr Abstand zur oberen Knopfreihe auf kleinen Telefonen |
| Grafik: schwarze Flecken in Texturen, Putz wie Ziegel, Plakatkleber hinter dem Plakat, Laufwege im Klassenzimmer | Rampen, Putz-Textur, Tiefensortierung und Laufpolygon korrigiert |
| Zweite Runde: Die kurzen Hosen der Jungen wurden als Rock gezeichnet | echte Hosenbeine im Detail-Zeichner |
| Zweite Runde: Armbinden saßen wie Schulterklappen auf beiden Armen | ein Band am Oberarm |
| Zweite Runde: Tikos weiße Mütze wurde beim Lidschlag braun; der Bleistift des Helfers lag auf der Wange | eigener Buchstabe für die Mütze; Bleistift hinter das Ohr |
| Zweite Runde: Die Fahne über der Schultür wirkte beim Wehen doppelt | ruhigere Welle |
| Zweite Runde: Die Zuschauer an der Paradestraße waren ein Farbrauschen | einzelne, belebte Figuren mit eigener Kleidung |
| Zweite Runde: Beim Benutzen der Listenmappe stand M. im Lehrer | Lehrer ans Pultende versetzt |

Nach jeder Korrektur wurden die betroffenen Abläufe erneut durchlaufen. Die Ergebnisse in Abschnitt 1 beziehen sich auf die letzte Fassung.

## 4. Nicht geprüft und bekannte Einschränkungen

- **Geräte:** Keine Tests auf echten iPhones, iPads oder Android-Geräten; nur Chromium-Emulation (Viewport, Pixeldichte, Touch-Ereignisse). Nicht geprüft: Safari/WebKit (auch „Zum Home-Bildschirm“, Safe-Area auf Geräten mit Notch) und Firefox. Tastaturbedienung nur stichprobenartig (Esc, Ziffern).
- **Sehr kleine Telefone** (568×320 CSS-px, iPhone SE 1. Generation): Standardlayout mit etwa 27 px hohen Knöpfen statt der Seitenleisten.
- **Spieldauer:** 1½–2½ Stunden ist eine Schätzung. Die automatischen Läufe (11–16 Minuten bei schnellem Text, ohne Nachdenken) sagen darüber nichts aus.
- **Ton:** keiner, wie im Konzept für die Browserfassung vorgesehen.
- **Grafik:**
  - Hintergründe, Figuren und Symbole sind mit der MALA-Technik in der MALA-Palette gezeichnet: Code-Malerei mit festen Figuren-Sprites aus dem Rig, keine Platzhalter.
  - Die Köpfe der Figuren sind handgepixelt und detaillierter als in MALA.
  - Die Porträts entstehen weiter aus Parametern. Sie sind verbessert, erreichen aber nicht die Qualität handgepixelter Porträts.
  - Das Eigenleben läuft zufallsgesteuert. Es wurde in den Durchläufen beobachtet, aber nicht über längere Zeit mit Menschen bewertet.
  - Die im PDF erwähnten Grafikassets der Fassung „V168“ lagen nicht bei und wurden nicht verwendet.
- **Nicht umgesetzt:**
  - weitere Kapitel (nur als Überblick in B),
  - Kapitelwahl,
  - Export/Import von Spielständen (MALA hat das),
  - ein Hinweissystem: bewusst weggelassen, weil keine automatische Führung eingebaut werden sollte; die Notizen geben nur Orientierung.

## 5. Bewertung

Eigene Einschätzung, nicht durch Spieltests belegt.

- **Trägt die Geschichte?** Ja, für ein Kapitel. Der Einstieg hat ein klares Problem: M. steht auf keiner Liste. Die Zuspitzung ändert den Sinn der ersten Lösung: Der Nachtrag gilt, aber es gibt keinen Platz. Am Ende erfüllt sich die Pointe des PDFs: M. wird als Dragan gezählt und unter dem eigenen Namen als abwesend geführt. Die Schlusszeile des Lehrers („Ich weiß. Bis morgen.“) löst den lokalen Konflikt menschlich auf.
- **Sind die Figuren unterscheidbar?** Weitgehend:
  - Branko spricht in Vorschriften,
  - Mara rechnet,
  - Dedo verkauft noch im Nebensatz,
  - Dragan handelt,
  - Nedim rechtfertigt sich,
  - Jasna ordnet.
  
  Schwächer bleiben der Helfer und der Plakatkleber: Sie haben Funktion und Witz, aber wenig eigene Entwicklung.
- **Lassen sich die Rätsel aus ihren Hinweisen ableiten?** Die Ketten sind begründet, und jeder Schritt hat einen Hinweis im Spiel (siehe C4). Am ehesten haken könnte das Tor am Fenster: Leine, Riegel und Büste in der richtigen Reihenfolge. Die Rückmeldungen nennen dort jeweils das fehlende Glied. Ob Spieler das ohne Hilfe schaffen, ist ungeprüft.
- **Fühlt sich der Abschluss verdient an?** Das Finale braucht alle drei Ketten: Ausweis aus C, geprüfte Fahne aus A und B, Probe aus B. Der Spieler löst es selbst mit der Antwort „Hier.“. Die Wahl „Ich heiße M.“ führt bewusst zurück zur Frage, statt eine zweite Endung zu öffnen, weil das PDF genau diese Pointe vorgibt.
