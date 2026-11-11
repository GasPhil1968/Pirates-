#!/usr/bin/env python3
"""Baut M. Adventure als Einzelseite für ein claude.ai-Artefakt.

Die Artefakt-Umgebung lädt Stylesheets, Schriften und Skripte nur eingebettet; Service Worker gibt es dort nicht.
Darum: CSS mit Schriften als data:-URIs inline, alle Skripte in Ladereihenfolge inline, ohne <!doctype>/<html>/<head>/<body>
(das Gerüst setzt die Artefakt-Veröffentlichung selbst), dazu window.MADV_ARTIFACT = true (kein Service Worker).

Aufruf: python3 -I tools/build_artifact.py <Zieldatei.html> [--preview <Vorschau.html>]
  --preview schreibt zusätzlich eine lokal öffenbare Fassung mit eigenem Gerüst (nur zum Prüfen).
"""
import base64
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME = os.path.join(ROOT, 'game')


def read(rel, mode='r'):
    with open(os.path.join(GAME, rel), mode, **({} if 'b' in mode else {'encoding': 'utf-8'})) as fh:
        return fh.read()


def main():
    args = sys.argv[1:]
    if not args:
        raise SystemExit(__doc__)
    out = args[0]
    preview = args[args.index('--preview')+1] if '--preview' in args else None

    html = read('index.html')
    body = html.split('<body>', 1)[1].split('</body>', 1)[0]
    scripts = re.findall(r'<script src="([^"]+)"></script>', body)
    markup = body.split('<script', 1)[0].strip()
    inline_tail = re.findall(r'<script>(.*?)</script>', body, re.S)
    title = re.search(r'<title>(.*?)</title>', html).group(1)

    css = read('css/game.css')
    def font(m):
        name = m.group(1)
        mime = 'font/woff2' if name.endswith('.woff2') else 'font/otf'
        data = base64.b64encode(read('fonts/'+name, 'rb')).decode('ascii')
        return 'url(data:%s;base64,%s)' % (mime, data)
    css = re.sub(r'url\(\.\./fonts/([^)]+)\)', font, css)
    css = ':root{ color-scheme:dark; }\n' + css

    parts = ['<title>M. Adventure</title>',
             '<meta name="description" content="%s">' % 'M. Adventure – Kapitel Mostar 1955: „Der Genosse kommt!“ Ein Point-and-Click-Adventure.',
             '<style>\n' + css + '\n</style>',
             markup,
             '<script>window.MADV_ARTIFACT = true;</script>']
    for src in scripts:
        code = read(src)
        if '</script' in code.lower():
            raise SystemExit('</script> in ' + src)
        parts.append('<script>/* %s */\n%s\n</script>' % (src, code))
    for code in inline_tail:
        parts.append('<script>%s</script>' % code)
    page = '\n'.join(parts) + '\n'
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as fh:
        fh.write(page)
    print('Artefakt-Seite', out, len(page.encode('utf-8')), 'Bytes,', len(scripts), 'Skripte, Titel bisher:', title)
    if preview:
        with open(preview, 'w', encoding='utf-8') as fh:
            fh.write('<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>\n' + page + '</body></html>\n')
        print('Vorschau', preview)


if __name__ == '__main__':
    main()
