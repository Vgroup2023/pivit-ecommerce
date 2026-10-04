const CACHE_NAME = 'pivit-fishing-v1';
const RUNTIME_CACHE = 'pivit-fishing-runtime';
const API_CACHE = 'pivit-fishing-api';

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching essential assets');
      return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
        console.warn('[Service Worker] Cache addAll failed:', error);
      });
    })
  );

  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== API_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const cache = caches.open(API_CACHE);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request).then((response) => {
            return response || new Response(
              JSON.stringify({ error: 'Offline - no cached data' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // Static assets - cache first, fallback to network
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((response) => {
          const cache = caches.open(RUNTIME_CACHE);
          if (response.ok) {
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML pages - network first, fallback to cache
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cache = caches.open(RUNTIME_CACHE);
          if (response.ok) {
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Default - network first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Background sync for offline orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncPendingOrders());
  }
});

async function syncPendingOrders() {
  try {
    const db = await openIndexedDB();
    const orders = await getPendingOrders(db);

    for (const order of orders) {
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });

        await deletePendingOrder(db, order.id);
      } catch (error) {
        console.error('Failed to sync order:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PIVIT_FISHING', 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('pending_orders')) {
        db.createObjectStore('pending_orders', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getPendingOrders(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending_orders'], 'readonly');
    const store = transaction.objectStore('pending_orders');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deletePendingOrder(db, orderId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending_orders'], 'readwrite');
    const store = transaction.objectStore('pending_orders');
    const request = store.delete(orderId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Push notifications support
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
