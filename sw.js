// SO PHIEN BAN: 20261016-130032  (sinh boi tools/dang_web.py). localStorage cua game KHONG bi dung toi.
const VER = '20261016-130032', CORE = 'core-' + VER, MEDIA = 'media-v1';
const LOI = ["./", "index.html", "manifest.webmanifest", "css/app.css?v=20261016-130032", "js/app.js?v=20261016-130032", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "art/font/baloo2-vi.woff2", "art/font/nunito-vi.woff2"];
self.addEventListener('install', e => e.waitUntil(caches.open(CORE).then(c => c.addAll(LOI))));   // KHONG skipWaiting: cho nguoi choi cham
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CORE && k !== MEDIA).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || r.headers.has('range') || u.pathname.includes('/art/video/')) return;
  const media = /\/(img|art\/audio|art\/font)\//.test(u.pathname);
  e.respondWith(caches.open(media ? MEDIA : CORE).then(c => c.match(r, {ignoreSearch: !media && false}).then(hit => hit || fetch(r).then(res => {
    if (res.ok && (media || r.mode === 'navigate' || LOI.includes(u.pathname.slice(u.pathname.lastIndexOf('/') + 1) + u.search))) c.put(r, res.clone());
    return res;
  }).catch(() => r.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
