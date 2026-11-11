# C2. Styleguide (abgeleitet aus der MALA-Fassung)

Verbindlich für alle Grafiken von M. Adventure. Grundlage sind die untersuchten Quellen `00_core.js`, `01_art.js`, `02_rig.js`, `07_portraits.js`, `06_ui.js`, `99_main.js` der MALA-Referenz.

## Bildformat, Auflösung, Skalierung
- Logisch **320 × 200**: Szene **320 × 144**, Leiste **320 × 56**. Breitere Räume (bis 420 px) scrollen mit Totzone der Kamera.
- Skalierung in ganzen Gerätepixeln (`floor(Fläche × dpr) / dpr`), `image-rendering: pixelated`.
- Telefon quer (Touch, wenig Höhe): Szene größer, Knöpfe in Seitenleisten (≥ 44 CSS-px), Inventar und Verben in einer Reihe darunter.
- Bedienoberfläche als HTML-Schicht in der Pixelschrift auf dem Raster (`font-size = 10 × u`), damit sie bei jeder Skalierung scharf bleibt.

## Pixelästhetik
- Alles sind **Palettenindizes** der MALA-Palette (115 Farben in Rampen dunkel→hell). Keine freien RGB-Werte in der Szene.
- Übergänge nur mit **geordnetem Bayer-Dithering** und nur an Flächenübergängen; keine weichen Verläufe.
- Licht kommt **von links oben** (Nachmittag, warm). Schatten rechts und unten eine bis zwei Rampenstufen dunkler.
- Figuren und Porträts haben eine **dunkle Kontur** (`k1`, `M.outline`).

## Figurenmaßstab und Perspektive
- Erwachsene ≈ **50 px**, Kinder ≈ **42 px** (Knochen 9/8/7/6, gestauchte Posen 0,82). Gleiche Größe überall im Raum (wie MALA, keine Tiefenskalierung).
- Räume frontal mit Fluchtpunkt; Lauffläche als Band im unteren Drittel (y ≈ 100–140).
- Vordergrundobjekte (Tische, Stände, Bank, Schlagbaum, Brüstung) als Ebenen mit Grundlinie → richtiges Verdecken.

## Palette für Mostar 1955
| Motiv | Rampen |
|---|---|
| Kalkstein der Altstadt, Brücke | `s1–s6` (warm-hell), Fugen `s1/s0` |
| Steinplattendächer | `m1–m3` mit `s2` Kanten |
| Neretva (smaragd) | `a2–a6`, Glanz `a6/l1` |
| Holz (Läden, Stände, Bänke) | `w1–w5` |
| Laub, Feigen, Granatäpfel | `g2–g5`, `r3/r4` |
| Fahnen | `b1/b2` blau, `s6` weiß, `r3` rot, Stern `r3` mit `y3`-Rand |
| Plakate, Papier | `s4–s6`, Druck `k2/m1` |
| Himmel | Tagesrampe `b1–b5` mit Wolken `s5/s6` |

## Detailgrad
- Hintergründe dicht (Texturen, Fugen, Läden, Schilder in Mikroschrift 3×5), aber **interaktive Dinge** heben sich durch Kontrast oder einen hellen Rand ab; Hotspots großzügig (mindestens 8×8 Spielpixel), Fangradius 7 px bei Touch, „Zeigen“-Knopf.
- Schrift in der Szene nur als Mikroschrift (Schilder, Ablagen, Plakat); lesbarer Text erscheint im Dokument-Fenster.

## Darstellung von Dialogen, Inventar, Menüs, Karte
- **Sprechen:** Kasten oben in der Szene, Rahmen `s6`, Text in der Sprecherfarbe; Porträt 56 × 64 neben dem Kasten auf der Seite des Sprechers (M. rechts; andere Figuren links, oder rechts, wenn sie in der Szene rechts von M. stehen; rechts stehende Porträts gespiegelt wie in MALA), Mund offen beim Sprechen, Lidschlag in Pausen. Erzähltext ohne Kasten, zentriert, hell mit dunklem Rand.
- **Antworten:** Liste über der Leiste, Ziffern, bereits Gefragtes grau, „Tschüss“-Zeilen ocker; passt die Liste nicht ganz, zeigt „▼ weitere Antworten“ an, dass gescrollt werden kann.
- **Inventar:** sechs Felder je Seite, Symbole 32 × 24 aus der Palette, gewählter Gegenstand mit Ockerrahmen, neue Gegenstände blinken kurz. Erster Tipp wählt („Benutze … mit …“, die Szene bleibt frei), zweiter Tipp oder „Ansehen“ öffnet das kleine Menü (Schau an/Lies/Öffne/Benutze); Rechtsklick zeigt den Gegenstand direkt.
- **Fenster:** ✕ oben rechts bleibt beim Scrollen sichtbar; Tippen neben ein Fenster schließt es (nicht bei Vollbild-Ebenen wie Rätseln).
- **Menüs:** Kästen `k1` mit Ockerrahmen `y2`, Text `s5`, Auswahl `y4/y5`.
- **Karte:** handgezeichneter Stadtplan in Papiertönen; nur bekannte Orte; hier = gelb, gesperrt = grau mit Grund.

## Erforderliche Animationszustände
| Figur | Zustände |
|---|---|
| alle | stehen (Seite/vorn/hinten, Lidschlag), gehen (8 Bilder je Richtung), sprechen |
| M. | greifen (mittel/tief/hoch), aufheben, geben, schieben, ziehen, hocken, Kiste tragen, Fahne halten/winken |
| Kinder | Fähnchen halten/winken, rufen |
| Lehrer | Mantel zuhalten (stehen/sprechen) |
| Branko | Klemmbrett halten, stempeln |
| Dedo | Pfeife anbieten |
| Plakatkleber | Plakat hochhalten, pinseln |
| Dragan | Ball halten/prellen, Leine halten |
| Jovan, Helfer, Mara, Tiko | stehen, sprechen, gehen, winken |
