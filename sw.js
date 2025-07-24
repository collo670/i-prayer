const CACHE_NAME = 'ipray-v1';
const ASSETS_TO_CACHE = [
  '/i-prayer/',                      // Homepage
  '/i-prayer/index.html',            // HTML file
  '/i-prayer/dist/output.css',       // CSS
  '/i-prayer/assets/images/bikira maria.jpg',
  '/i-prayer/manifest.json',
  // Add other critical assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});