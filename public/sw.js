const CACHE_NAME = 'adminpro-v13';
const BASE = '/adminpro/';

// Archivos esenciales para cachear (offline shell)
const PRECACHE_URLS = [
  BASE,
  BASE + 'icon-512.png'
];

// INSTALL: Cachear archivos esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE: Limpiar caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// FETCH: Network-first strategy (siempre intenta red, si falla usa cache)
self.addEventListener('fetch', (event) => {
  // Solo manejar requests GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clonar y guardar en cache para offline
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Sin red, intentar servir desde cache
        return caches.match(event.request).then(cached => {
          return cached || new Response('Offline', { status: 503 });
        });
      })
  );
});
