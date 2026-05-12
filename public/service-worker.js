/**
 * Service Worker for Offline Support
 * Handles offline detection, background sync, caching
 */

const CACHE_NAME = 'scms-offline-v1';
const API_CACHE = 'scms-api-cache-v1';
const RUNTIME_CACHE = 'scms-runtime-v1';

// Files to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

/**
 * Install event - cache essential files
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE && cacheName !== RUNTIME_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/**
 * Fetch event - network first, cache fallback for API calls
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and non-http(s)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // App shell - cache first, network fallback
  event.respondWith(cacheFirstStrategy(request));
});

/**
 * Network first strategy (for API calls)
 * Try network first, fallback to cache
 */
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[ServiceWorker] Network failed, using cache for:', request.url);

    // Try to get from cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Return offline page/response
    return new Response(
      JSON.stringify({
        error: 'Offline - No cached data available',
        offline: true,
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}

/**
 * Cache first strategy (for app shell)
 * Try cache first, fallback to network
 */
async function cacheFirstStrategy(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[ServiceWorker] Failed to fetch:', request.url);

    // Return offline fallback
    return new Response(
      'Offline - Page not available',
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain',
        }),
      }
    );
  }
}

/**
 * Message handler - for communication with main thread
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (type === 'CLEAR_CACHE') {
    caches.delete(API_CACHE).then(() => {
      console.log('[ServiceWorker] API cache cleared');
    });
  }

  if (type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ cacheSize: size });
    });
  }
});

/**
 * Calculate total cache size
 */
async function getCacheSize() {
  let size = 0;

  const cacheNames = await caches.keys();
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        size += await getResponseSize(response);
      }
    }
  }

  return size;
}

/**
 * Get response body size in bytes
 */
async function getResponseSize(response) {
  const blob = await response.blob();
  return blob.size;
}

// Background sync registration (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'BACKGROUND_SYNC',
            payload: { tag: event.tag },
          });
        });
      })
    );
  }
});
