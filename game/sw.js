/* M. Adventure – Service Worker (Offline-Fassung). Von tools/build.py erzeugt, nicht von Hand ändern.
   Eigener Cache-Name „madv-mostar-…“: Caches anderer Projekte (z. B. MALA) werden nie angefasst. */
var VERSION = 'madv-mostar-0cbaef';
var FILES = ['./', './icon-180.png', './icon-192.png', './icon-512.png', './index.html', './manifest.webmanifest', './css/game.css', './fonts/atkinson-400-latin.woff2', './fonts/atkinson-400-latinext.woff2', './fonts/atkinson-700-latin.woff2', './fonts/atkinson-700-latinext.woff2', './fonts/pixel.otf', './js/art/cast.js', './js/art/icons.js', './js/art/portraits.js', './js/art/room_hof.js', './js/art/room_klasse.js', './js/art/room_markt.js', './js/art/room_most.js', './js/art/room_parade.js', './js/art/room_sperre.js', './js/art/scenery.js', './js/art/title_map.js', './js/content/cast.js', './js/content/chapter.js', './js/content/hof.js', './js/content/items.js', './js/content/klasse.js', './js/content/markt.js', './js/content/most.js', './js/content/notes.js', './js/content/parade.js', './js/content/puzzles.js', './js/content/sperre.js', './js/engine/core.js', './js/engine/main.js', './js/engine/script.js', './js/engine/ui.js', './js/engine/ui_panels.js', './js/engine/world.js', './js/lib/mala_art.js', './js/lib/mala_core.js', './js/lib/mala_rig.js'];
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
