const CACHE = 'finance-saas-v1';
const ASSETS = ['/', '/pages/index.html', '/styles/main.css', '/scripts/app.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});
