const CACHE_NAME = 'ipray-v1';
const ASSETS_TO_CACHE = [
  '/i-prayer/',
  '/i-prayer/index.html',
  '/i-prayer/dist/output.css',
  '/i-prayer/manifest.json',
  '/i-prayer/assets/icons/icon-192x192.png',
  '/i-prayer/assets/icons/icon-512x512.png',
  '/i-prayer/assets/images/bikira-maria.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});