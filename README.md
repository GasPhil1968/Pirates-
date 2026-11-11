# M. Adventure – Kapitel Mostar 1955 „Der Genosse kommt!“

Point-and-Click-Adventure im Browser, deutsch. Erste spielbare Umsetzung aus dem Spielkonzept „M. Adventure“: das Kapitel **Mostar 1955** als abgeschlossener Abschnitt mit Einstieg, drei verbundenen Rätselketten, Finale und Abschlussbild. Grafik, Bedienung und Technik folgen der untersuchten MALA-Fassung („Die Stillen“); Inhalte, Figuren und Orte stammen aus dem PDF bzw. sind als eigene Ergänzungen gekennzeichnet.

## Starten
- `game/index.html` im Browser öffnen, oder `python3 -m http.server` im Ordner `game/` und `http://localhost:8000` aufrufen.
- Auslieferung: `dist/M_Adventure_Mostar_netlify.zip` (nur das Spiel + `LIESMICH.txt`). Für Netlify Drop entpacken und den Ordner auf app.netlify.com/drop ziehen. Nicht veröffentlicht.
- Vollständiges Projekt zum Weiterarbeiten: `dist/M_Adventure_Mostar_Projekt.zip` (Spiel, Dokumentation, Testwerkzeuge).

## Aufbau
| Pfad | Inhalt |
| --- | --- |
| `game/js/lib/` | Grafik- und Figurentechnik aus MALA (indizierte Palette, Malkasten, Figuren-Rig), unverändert übernommen bis auf den Spieltitel |
| `game/js/engine/` | Engine von M. Adventure: Zustand und Spielstände (`core.js`), Räume/Wege/Darstellung (`world.js`), Skript-API und Interaktion (`script.js`), Eigenleben der Figuren (`life.js`), Statisten und Bewegung im Hintergrund (`extras.js`), Oberfläche (`ui.js`, `ui_panels.js`), Start und Eingabe (`main.js`) |
| `game/js/art/` | Detail-Zeichner für das MALA-Rig (`rig_detail.js`), Köpfe (`heads.js`), Bewegungen (`anims.js`), Figuren (`cast.js`), Porträts, Gegenstandssymbole, Hintergründe der Orte mit Zusatzdetails (`details.js`), Titelbild und Stadtplan |
| `game/js/content/` | Inhalte: Gegenstände und Kombinationen, Notizen, Rätsel-Nahansichten, Orte mit Hotspots und Dialogen, Kapitelablauf |
| `docs/` | A Quellenanalyse · B Gesamtstruktur · C Kapitelentwurf Mostar · C2 Styleguide · F Prüfbericht · F Lösungsweg · LIESMICH (Startanleitung für das ZIP) |
| `tools/` | Testfahrer und Durchläufe (Playwright), Layoutprüfung, Prüfblätter für Räume und Figuren, Icon-Erzeugung, Build |

## Prüfen und bauen
```
python3 -m http.server 8822 --directory .        # Testserver im Projektordner
node tools/playthrough.js /tmp/pt                 # Durchlauf A, Desktop
node tools/playthrough.js /tmp/pt "iPhone 13 landscape"   # Durchlauf A, Touch
node tools/playthrough_b.js /tmp/ptb              # Durchlauf B: andere Reihenfolge, Fehlversuche, Speichern/Laden
node tools/layout_check.js /tmp/lay               # Layout auf acht Geräteprofilen
node tools/map_check.js                           # Karte: Freigaben und Sperren
node tools/render_chars.js /tmp/figuren.png 6     # Prüfblatt aller Figuren ohne Browser
python3 tools/build.py                            # Fassung setzen, sw.js erzeugen, ZIP bauen
python3 tools/build_artifact.py /tmp/m-adventure.html   # Einzelseite für ein claude.ai-Artefakt (alles inline, ohne Service Worker)
```
Die Durchläufe bedienen das Spiel nur über die Oberfläche; `window.MADV` liefert ihnen ausschließlich Positionen und Zustände zum Prüfen.

Spielstände liegen im Browser unter `madv.v1.*` und sind von MALA getrennt.
