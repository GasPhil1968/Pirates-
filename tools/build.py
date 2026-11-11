#!/usr/bin/env python3
"""Baut die auslieferbare Fassung von M. Adventure – Mostar 1955.

1. Fingerabdruck über alle Dateien in game/ (ohne sw.js; die Zeile MA.BUILD zählt nicht mit).
2. Setzt MA.BUILD in game/js/engine/core.js auf „TT.MM.JJJJ · abc123“ (Datum bleibt, solange sich nichts ändert).
3. Erzeugt game/sw.js mit Dateiliste und Cache-Namen „madv-mostar-<Fingerabdruck>“ (getrennt von MALA).
4. Packt dist/M_Adventure_Mostar_netlify.zip: Inhalt von game/ auf oberster Ebene + LIESMICH.txt (aus docs/LIESMICH.txt).
5. Packt dist/M_Adventure_Mostar_Projekt.zip: README, game/, docs/, tools/ (vollständiges Projekt zum Weiterarbeiten).

Aufruf: python3 -I tools/build.py
"""
import datetime
import hashlib
import os
import re
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME = os.path.join(ROOT, 'game')
DIST = os.path.join(ROOT, 'dist')
CORE = 'js/engine/core.js'
BUILD_RE = re.compile(r"MA\.BUILD = '([^']*)';")
ZIPNAME = 'M_Adventure_Mostar_netlify.zip'
PROJNAME = 'M_Adventure_Mostar_Projekt.zip'

SW = """/* M. Adventure – Service Worker (Offline-Fassung). Von tools/build.py erzeugt, nicht von Hand ändern.
   Eigener Cache-Name „madv-mostar-…“: Caches anderer Projekte (z. B. MALA) werden nie angefasst. */
var VERSION = 'madv-mostar-%(fp)s';
var FILES = %(files)s;
self.addEventListener('install', function (e) {
  // am HTTP-Cache vorbei, damit ein Update wirklich die neuen Dateien holt
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('madv-mostar-') === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }).then(notifyReady));
});
function notifyReady() {
  return caches.open(VERSION).then(function (c) { return c.keys(); }).then(function (keys) {
    if (keys.length < FILES.length) return;
    return self.clients.matchAll({ includeUncontrolled: true }).then(function (cl) { cl.forEach(function (x) { x.postMessage('offline-ready'); }); });
  });
}
self.addEventListener('message', function (e) { if (e.data === 'check') e.waitUntil(notifyReady()); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    if (hit) return hit;
    return fetch(e.request).catch(function () { if (e.request.mode === 'navigate') return caches.match('./index.html'); return Response.error(); });
  }));
});
"""


def game_files():
    out = []
    for d, dirs, fs in os.walk(GAME):
        dirs.sort()
        for f in sorted(fs):
            if f.startswith('.'):
                continue
            out.append(os.path.relpath(os.path.join(d, f), GAME).replace(os.sep, '/'))
    return out


def read(rel):
    with open(os.path.join(GAME, rel), 'rb') as fh:
        return fh.read()


def main():
    files = game_files()
    h = hashlib.sha256()
    for rel in files:
        if rel == 'sw.js':
            continue
        data = read(rel)
        if rel == CORE:
            data = BUILD_RE.sub("MA.BUILD = '';", data.decode('utf-8')).encode('utf-8')
        h.update(rel.encode('utf-8') + b'\0' + data + b'\0')
    fp = h.hexdigest()[:6]

    core = read(CORE).decode('utf-8')
    m = BUILD_RE.search(core)
    if not m:
        raise SystemExit('MA.BUILD nicht gefunden in ' + CORE)
    build = m.group(1)
    if not build.endswith(fp):
        build = datetime.date.today().strftime('%d.%m.%Y') + ' · ' + fp
        core = BUILD_RE.sub("MA.BUILD = '" + build + "';", core, count=1)
        with open(os.path.join(GAME, CORE), 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(core)

    listed = ['./'] + ['./' + f for f in files if f != 'sw.js']
    sw = SW % {'fp': fp, 'files': '[' + ', '.join("'" + u + "'" for u in listed) + ']'}
    with open(os.path.join(GAME, 'sw.js'), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(sw)

    with open(os.path.join(ROOT, 'docs', 'LIESMICH.txt'), encoding='utf-8') as fh:
        readme = fh.read().replace('{FASSUNG}', build)
    os.makedirs(DIST, exist_ok=True)
    target = os.path.join(DIST, ZIPNAME)
    if os.path.exists(target):
        os.remove(target)
    files = game_files()
    with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for rel in files:
            z.write(os.path.join(GAME, rel), rel)
        z.writestr('LIESMICH.txt', readme.replace('\n', '\r\n'))
    print('Fassung', build, '·', len(files), 'Dateien ·', target, os.path.getsize(target), 'Bytes')

    # Vollständiges Projekt (Quellen, Dokumentation, Werkzeuge) – zum Weiterarbeiten, nicht zum Hochladen
    proj = os.path.join(DIST, PROJNAME)
    if os.path.exists(proj):
        os.remove(proj)
    with zipfile.ZipFile(proj, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for top in ['README.md', '.gitignore']:
            if os.path.exists(os.path.join(ROOT, top)):
                z.write(os.path.join(ROOT, top), 'M_Adventure_Mostar/' + top)
        for sub in ['game', 'docs', 'tools']:
            for d, dirs, fs in os.walk(os.path.join(ROOT, sub)):
                dirs[:] = sorted(x for x in dirs if x not in ('node_modules', '__pycache__'))
                for f in sorted(fs):
                    if f.startswith('.') or f.endswith('.pyc'):
                        continue
                    full = os.path.join(d, f)
                    z.write(full, 'M_Adventure_Mostar/' + os.path.relpath(full, ROOT).replace(os.sep, '/'))
    print('Projektarchiv', proj, os.path.getsize(proj), 'Bytes')


if __name__ == '__main__':
    main()
