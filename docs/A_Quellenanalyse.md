# A. Quellenanalyse

Geprüfte Anhänge (beide vollständig lesbar):

| Datei | Inhalt | Rolle in diesem Auftrag |
|---|---|---|
| `Spielkonzept_M_Adventure_.pdf` (32 Seiten) | Gesamtkonzept (Abschnitte 1–7) und Abschnitt 8 „Mostar 1955 – Der Genosse kommt!“ mit Figurenfassung, Drehbuch S01–S35, Wiederkehr- und Fehlversuchstexten | inhaltliche Grundlage |
| `Die_Stillen_netlify.zip` (MALA, 8 Dateien) | `index.html` (7,9 MB, ein gebündelter Build aus ca. 355 Quellmodulen), `sw.js`, `manifest.webmanifest`, drei Icons, `LIESMICH.txt`, `AENDERUNGEN.txt` | Referenz für Grafik, Bedienung und Technik |

Kennzeichnung im Folgenden: **[PDF]** verbindliche Angabe aus dem Konzept · **[MALA]** tatsächlich im Projekt vorgefunden (mit Datei/Funktion) · **[Eigen]** eigene Ergänzung oder Entscheidung.

---

## A1. Das Spielkonzept (PDF)

### Zentrale Spielidee
**[PDF]** Ein 2D-Point-and-Click-Adventure über die Lebensgeschichte von M., einem kroatischen Jungen aus einem armen Dorf in Bosnien-Herzegowina, geboren 1942. Stationen: hungerndes Kind → Marinesoldat in Jugoslawien → Gastarbeiter in Deutschland → Rückkehr nach Jahrzehnten. Zwei Zeitebenen: Gegenwart (Podaca 2018, Terrasse, Katze, Radio) und Vergangenheit in Kapiteln, ausgelöst durch unbewusste Trigger (Musik, Geräusche, Gerüche), Übergänge „immer natürlich“, nie durch Menüs.

### Hauptfigur
**[PDF]** M.: bodenständig, trockener Humor, verdrängte Traumata. Im Mostar-Kapitel „ein Junge, der endlich wieder zur eigenen Klasse gehören möchte“: Er will mit den anderen den Nachmittag überstehen und zurückgehen; anfangs glaubt er, Erwachsene könnten solche Dinge regeln, und merkt, dass sie vor allem ihre Zuständigkeiten verteidigen. Seine schärfsten Antworten entstehen, weil er Behauptungen ernst nimmt und zu Ende denkt. Entwicklung: vom übersehenen Schüler zum verlässlichen Helfer und Mitverschwörer; am Ende keine richtige behördliche Identität, aber persönliche Anerkennung.
**Was auf dem Spiel steht (Kapitel):** dazuzugehören – auf Brankos Liste, in der Aufstellung, vor dem Lehrer.

### Ton
**[PDF]** Leiser, echter Witz und Wärme; bosnischer Humor: trocken, selbstironisch, leise melancholisch, „lacht nicht, um zu vergessen, sondern um mit dem Schmerz zu leben“. Nie klamaukig oder respektlos. Tiefgang ohne Pathos. Kein großes Happy-End.

### Festgelegte Figuren, Beziehungen, Schauplätze, Ereignisse
- **[PDF] Gesamtspiel:** M.; L. (Ehefrau, praktisch, liebevoll, stark); M.s Eltern (arm, stolz, beide in Rosko Polje begraben); drei Söhne; Enkel; Baba Roga (Kindheitsängste); Katze (Ruhe). Historische Begegnungen als verfremdete Namen: Ivo Andrin, Josip Broz Tiko, Admiral Pivopija (fiktiv), Safet Sušović, Rudi Dutschić, Franjo Tudžmanić, Ivan Meštrović (Anspielung).
- **[PDF] Kapitelübersicht:** Prolog Podaca 2018 · K1 Rosko Polje 1953 · **K2 Mostar 1955** · K3 Marinezeit Serbien · K4 Sarajevo 1970er · K5 Deutschland 1970–80 · K6 Deutschland 1990er · K7 Podaca 2004–2018 · Finale Podaca 2018.
- **[PDF] Mostar:** Figuren M., Lehrer, Mara, Dedo Muratović, Branko, Dragan, Jasna, Nedim, Jovan, Plakatkleber, Veranstaltungshelfer, Tiko. Orte: Schulhof, Klassenzimmer (mit Klassenfenster, Büste und Plakette des Schulgründers), Markt (Mara, Dedo), Stari Most, Straßensperre (Jovan, Plakatkleber, Vorschrift), Kiosk, Lieferbereich der Paraderoute, Hinterhof/Tor. Ereignis: Parade beim Besuch von „Tiko“.
- **Abgrenzung zu MALA (geprüft):** MALA enthält ebenfalls ein Mostar-Kapitel (2011, Seilfähre, Geisterfälle) und eine Figur „Jasna“ (Markos Mutter, München). Beides wurde nicht verwendet: Jasna in M. Adventure ist die Mitschülerin aus dem PDF (Figurenliste und Skript), die Mostar-Orte stammen aus dem PDF. Gleich ist nur der Vorname.
- **[PDF] Pointe (verbindlich):** „M. wird als Dragan gezählt und unter seinem eigenen Namen für abwesend erklärt.“ Komischer Endpunkt: Brankos falsche Zählung; menschlicher Endpunkt: „dass die anderen M. inzwischen längst erkannt haben.“
- **[PDF] Spielmechanik:** Dialogoptionen (trocken oder tief), kleine Rätsel, Gegenstände kombinieren; keine Inventarüberfrachtung; Rätsel natürlich in die Geschichte eingebettet.

### Rolle von Mostar im Konzept
**[PDF]** Kapitel 2 (chronologisch nach Rosko Polje 1953), das einzige vollständig ausgearbeitete Kapitel. Die Drehbuchfassung beschreibt Texte für eine frühere Rätselfassung „V168“ und sagt ausdrücklich: Der Auftrag zur Neuprogrammierung für den Browser sieht neue Rätsel und Dialoge vor; **die V168-Bedingungen sind keine verbindlichen Vorgaben**. Für die eigenständige Browserfassung gelten **kein Ton, kein Video und ein Abschluss mit Rückkehr zum Hauptmenü**; der Übergang zur Gegenwart gehört zur Gesamtspielfassung.

### Was die Drehbuchfassung offenlässt (und wie damit umgegangen wird)
| Offener Punkt | Umgang **[Eigen]** |
|---|---|
| Die V168-Rätsel selbst sind nur als „vorhandene“ Schritte erwähnt (Kohlepapier, Raster, Abrieb, Tischfuß, Bergung, Riegel, Signal …), nicht ausformuliert | Aus den Andeutungen eine vollständige, faire Rätselmechanik entworfen (siehe C); jede Ergänzung ist dort markiert |
| Warum M. nicht auf der Liste steht | Er ist neu in der Klasse und steht im Klassenbuch als „Nachtrag“ ganz unten (aus S02/S03 abgeleitet) |
| Wie M. von Rosko Polje nach Mostar kam | bewusst offen gelassen; der Einstieg sagt nur „In Mostar war ich noch neu“ |
| Datum/Jahreszeit der Parade | nicht festgelegt; warmer Nachmittag (Hemden, Sandalen) |
| Was die „Tafel“ für Dedo ist, woher Kleister, Zugleine, Netz kommen, wozu Senkel/Stecken dienen | in C festgelegt (Kartonreste + Kreide; Plakatkleber; Maras Lieferlohn; Sandale; Fahnenstock) |
| Grafikassets „auf Basis der vorhandenen Grafikassets“ (V168) | **liegen nicht bei**. Es wurden keine V168-Assets erfunden oder vorausgesetzt; Grafik neu im MALA-Stil erstellt |
| Godot-Engine im Gesamtkonzept | gilt für das Gesamtspiel; Abschnitt 8 und dieser Auftrag verlangen eine Browserfassung |

---

## A2. Die MALA-Referenz (ZIP)

Untersucht: Begleittexte, der gebündelte Quelltext der `index.html` (Modulgrenzen `/* ---- name.js ---- */`) und das laufende Spiel. **Geprüft im Browser** (Chromium/Playwright, Desktop 1280×800 und Telefon quer iPhone 13 / Pixel 7): Titelbild, neues Spiel, Kapitelkarte, Szene mit Leiste, Verbmenü mit Maus und mit Finger, Antwortliste, Sprechkasten mit Porträt, Erzählertext, Gegenstandsmenü, „Zeigen“, Pausenmenü, Stadtplan. Keine Langzeit- oder Gerätetests am echten iPhone/iPad.

### Projektaufbau und Startpunkt
- **[MALA]** Ein einziger Build `index.html` (≈ 74 600 Zeilen) ohne externe Abhängigkeiten; Module 00_core … 99_main; `M.boot()` und `requestAnimationFrame(frame)` am Ende von `99_main.js`. PWA: `manifest.webmanifest`, `sw.js` (Cache-Name aus Inhalts-Hash), Netlify-Drop als Installationsweg (`LIESMICH.txt`).

### Darstellung
- **[MALA] `00_core.js`:** indizierter Framebuffer `M.Buf` (Uint8Array mit Palettenindizes), Palette von 115 benannten Farben in Rampen (`PAL_DEF`, `RAMPS`, `M.UP/M.DN`), geordnetes Bayer-Dithering, eigene Bitmap-Schrift (7 px Versalhöhe, Diakritika inkl. č ć š ž đ), Mikroschrift 3×5 für Schilder. Kommentar: „Keine Bilddateien.“
- **[MALA] `01_art.js` „Malkasten“:** Texturen (Kalksteinquader, Pflaster, Kopfstein, Putz, Bretter, Laub …), Fluchtpunkt-Innenräume (`M.box`, `M.room3`), Requisiten (Tür, Fenster mit Läden, Bank, Kiste, Fass, Flasche …), Tageszeit-Umfärbung (`M.finishTOD`), Ebenen mit Tiefensortierung (`M.layer`).
- **[MALA] `02_rig.js`:** Figuren aus handgezeichneten Kopfstempeln (Seite/vorn/hinten) + erzeugten Torsi + Gliedern fester Länge (IK), dunkle Kontur; Posenbibliothek (`M.ANIMS`: idle, walk 8 Bilder je Richtung, talk, reach, pickup, give, push, pull, sit …). Maße: Erwachsene ≈ 50 px hoch.
- **[MALA] Porträts:** `07_portraits.js` + `portraits/*.js` – 56 × 64 px, handgepixelte Zeichenkarten mit Varianten Mund offen/Lidschlag, nach rechts blickend, gespiegelt bei Sprechern rechts.
- **[MALA] Auflösung/Skalierung (`99_main.js` `fit()`):** 320 × 200 logisch (Szene 320 × 144, Leiste 56), ganzzahlige Geräte-Skalierung; auf Telefonen „Breitbild/Seitenleisten“-Layout (Szene größer, Knöpfe seitlich, Inventar darunter, Knöpfe ≥ 44 CSS-px).

### Szenen, Bewegung, Hotspots, Interaktion
- **[MALA] `05_engine.js`:** `M.defineRoom` (paint, layers, walk-Polygone, hotspots mit Verben, entries), Wegfindung auf 2-px-Raster mit A* und Sichtlinien-Glättung (`findPath`), Kamera folgt mit Totzone, Ausgänge mit Doppeltipp-Abkürzung (`E.skipExitWalk`).
- **[MALA] Interaktion:** Antippen = Ansehen; nur wenn mehr möglich ist, erscheinen genau die passenden Verben (Maus: Menü am Zeiger, Touch: große Knöpfe in der Leiste, Objekt gerahmt); Fangradius für Fingertipps; Rechtsklick = Schau an; Gegenstand wählen → „Benutze … mit …“; Ziehen eines Gegenstands auf ein Ziel. „Zeigen“ markiert alle Stellen kurz.

### Dialog und Zustand
- **[MALA]** Skript-API mit `async/await` (`A.say`, `A.choose`, `menuLoop` mit `once/if/bye`), Sprechkasten oben mit Porträt; Antwortliste im Leistenbereich, blätterbar, Ziffern 1–9; bereits gewählte Fragen grau. Zustand `GS` (flags, inv, notes, rooms, seen, cyc, playMs). Während Szenen (`E.busy`) wird für Spielstände der Stand vom Szenenbeginn verwendet (`safeGS`).
- **[MALA] Notizbuch mit Schlussfolgerungen** (`11_notes.js`), Hinweissystem mit vier Stufen (`15_hints*.js`) und die Geistermechanik (Mala) – inhaltlich an MALA gebunden.

### Inventar
- **[MALA]** Sechs Felder je Seite mit Pfeilen; Kombinationen über `M.COMBOS['a+b']`; Standardsätze bei unpassenden Versuchen (`DEF`).

### Speichern, Laden, Fortsetzen
- **[MALA]** `localStorage` mit Schlüsseln `mala.save.N`/`mala.mark.N.k`, Autospeichern bei Ortswechseln, drei Lesezeichen je Spiel, Vorschaubild, „Zuletzt“-Karte beim Fortsetzen, Export/Import, Prüfung beschädigter Stände.

### Menüs, Karte, Orientierung
- **[MALA]** Titel: Fortsetzen/Neues Spiel/Kapitel wählen/Spiel laden/Einstellungen/Über; Pause: Weiterspielen/Speichern/Laden/Einstellungen/Hinweise/Steuerung/Zum Titelbild. Stadtplan mit „hier / gerade nicht / noch nicht“, nur bekannte Orte, aus Innenräumen nur Standortanzeige.

### Audio und Abhängigkeiten
- **[MALA]** WebAudio, live erzeugte Geräuschkulissen und Musik (`04_audio.js`, `16_k*_audio.js`), keine Audiodateien. Keine Fremdbibliotheken; Schriften als Base64 eingebettet („MALA Pixel“, Atkinson Hyperlegible Next).

### Beobachtete Stärken und Schwächen
- Stärken: konsequente Bildsprache aus einem Guss, gute Touch-Bedienung, robuste Speicherlogik.
- Schwächen für dieses Projekt: der Ein-Datei-Build mischt alle Kapitel, Sprachen und Mechaniken; Inhalt und Technik sind eng verwoben (z. B. Mala-Sonderfälle in Engine und UI). Für ein neues Spiel ist ein vollständiger Fork unverhältnismäßig.

---

## A3. Entscheidungstabelle

| Element der Referenz | übernehmen / anpassen / ersetzen | Begründung für M. Adventure |
|---|---|---|
| Palette, indizierter Framebuffer, Bayer-Dithering, Bitmap-Schrift (`00_core.js`) | **übernehmen** (Code unverändert, `js/lib/mala_core.js`) | identische Bildsprache, stabil, eigenständig lauffähig (geprüft) |
| Malkasten: Texturen, Fluchtpunkt-Räume, Requisiten (`01_art.js`) | **übernehmen** + um Mostar-Motive erweitern | Kalkstein, Kopfstein, Steinplattendächer, Brücke, Minarett, Marktstände fehlen in MALA |
| Figuren-Rig und Posen (`02_rig.js`) | **übernehmen**, **anpassen** (Kinderproportionen, neue Posen) | M. ist 13; Klasse, Fähnchen, Winken, Tragen gibt es in MALA nicht |
| Porträts 56 × 64 mit Mund-/Lidvarianten | **anpassen**: gleiches Format, aber parametrischer Maler statt Handpixelkarten | zwölf handgepixelte Porträts sind im Rahmen nicht leistbar; als Grenze dokumentiert |
| Raum-/Hotspot-/Verbmodell, Wegfindung, Kamera | **anpassen** (eigene, schlankere Engine nach demselben Muster) | ohne Mala-Sonderfälle; Szenen-, Gegenstands- und Rätseldaten getrennt |
| Verbmenü am Zeiger / Verbknöpfe für Touch, Fangradius, Doppeltipp-Ausgang, Rechtsklick | **übernehmen** (Konzept), Leiste als HTML-Schicht | große Touch-Ziele, scharfe Schrift bei jeder Skalierung |
| Gesprächsschleife, Porträt-Sprechkasten, Antwortliste | **übernehmen** (Konzept) | bewährt; PDF verlangt Multiple Choice mit trockenen/tiefen Antworten |
| Notizbuch mit Schlussfolgerungen, „Nach etwas aus dem Notizbuch fragen“ | **ersetzen** durch schlichte „Notizen“ (offen/erledigt) und Gesprächsthemen, die nach Funden erscheinen | keine Detektiv-/Geistermechanik im PDF; PDF erwähnt ein Journal zur Orientierung |
| Mala/Geistermechanik, Figurenwechsel | **weglassen** | im PDF nicht vorgesehen, ausdrücklich ausgeschlossen |
| Vierstufiges Hinweissystem | **weglassen** | Auftrag: keine automatische Schritt-für-Schritt-Führung; Lösungsweg separat |
| „Zeigen“ (alle Stellen markieren) | **übernehmen** | verhindert Pixeljagd, verrät keine Lösung |
| Stadtplan (nur bekannte Orte, Sperren mit Grund) | **übernehmen**, für Mostar 1955 neu gezeichnet | Orientierung ohne Freigabe unbekannter Orte |
| Speichern (Auto + Plätze, Vorschaubild, „Zuletzt“) | **anpassen**: Schlüssel `madv.v1.*`, ein Autostand + fünf Plätze | keine Kollision mit MALA (`mala.*`); ein Kapitel braucht keine 24 Spiele |
| Kapitelwahl, Export/Import, Sprachumschaltung | **weglassen** | ein Kapitel, deutschsprachig; Export/Import als möglicher Ausbau notiert |
| Ton (WebAudio) | **ersetzen**: kein Ton | PDF Abschnitt 8: Browserfassung ohne Ton und Video |
| PWA (Manifest, Service Worker), Netlify-Drop | **übernehmen**, eigener Cache-Name | Offline-Start auf iPad wie bei MALA |
| Hochformat-Hinweis, „Gedreht weiterspielen“ | **übernehmen** | Smartphone/Tablet quer verlangt |
| Schriften „MALA Pixel“, Atkinson Hyperlegible Next | **übernehmen** (als Dateien) | gleiche Typografie; Atkinson als lesbare Alternative |
