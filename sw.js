// Service Worker for JNV Gauriganj Alumni App
const CACHE_NAME = 'jnvg-alumni-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './assets/css/styles.css',
  './assets/js/app.js',
  './manifest.json',
  './assets/images/nvs-logo.png',
  './assets/images/alumni-meet-poster.png',
  './assets/images/campus-main-building.png',
  './assets/images/campus-admin-block.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Caching notice:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Try network first, fall back to cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
