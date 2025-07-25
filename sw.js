const CACHE_NAME = 'ipray-offline-v2';
const OFFLINE_URL = '/i-prayer/offline.html';
const ASSETS_TO_CACHE = [
  '/i-prayer/',
  '/i-prayer/index.html',
  '/i-prayer/majira.html',
  '/i-prayer/mwaka2.html',
  '/i-prayer/mwaka3.html',
  '/i-prayer/dist/output.css',
  '/i-prayer/manifest.json',
  '/i-prayer/assets/images/bikira-maria.jpg',
  '/i-prayer/assets/icons/icon-192x192.png',
  '/i-prayer/assets/icons/icon-512x512.png',
  // Add other HTML pages and critical assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching all assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        // For HTML pages, return offline page if fetch fails
        if (event.request.headers.get('accept').includes('text/html')) {
          return fetch(event.request)
            .then((response) => {
              // Cache the fetched response
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseClone));
              return response;
            })
            .catch(() => {
              return caches.match(OFFLINE_URL);
            });
        }

        // For other assets, try network first
        return fetch(event.request)
          .then((response) => {
            // Cache the fetched response
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
            return response;
          })
          .catch(() => {
            // Return cached version if available
            return caches.match(event.request);
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});