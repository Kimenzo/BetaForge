// ============================================
// BetaForge Service Worker - Next-Gen PWA
// ============================================
// Version control for cache busting
const SW_VERSION = '1.0.0';
const CACHE_PREFIX = 'betaforge';

// Cache names with versioning
const CACHES = {
  static: `${CACHE_PREFIX}-static-v${SW_VERSION}`,
  dynamic: `${CACHE_PREFIX}-dynamic-v${SW_VERSION}`,
  api: `${CACHE_PREFIX}-api-v${SW_VERSION}`,
  images: `${CACHE_PREFIX}-images-v${SW_VERSION}`,
  fonts: `${CACHE_PREFIX}-fonts-v${SW_VERSION}`,
};

// ============================================
// PRECACHE - Critical App Shell Resources
// ============================================
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/dashboard',
  '/agents',
  '/manifest.json',
];

// ============================================
// CACHE STRATEGIES
// ============================================

// Cache-First: For static assets that rarely change
async function cacheFirst(request, cacheName, fallbackUrl = null) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Background refresh for stale-while-revalidate behavior
    fetchAndCache(request, cache);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    if (fallbackUrl) {
      return cache.match(fallbackUrl) || caches.match('/offline');
    }
    throw error;
  }
}

// Network-First: For dynamic content that needs freshness
async function networkFirst(request, cacheName, timeout = 3000) {
  const cache = await caches.open(cacheName);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const networkResponse = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale-While-Revalidate: Best of both worlds
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Background fetch and cache update
async function fetchAndCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

// ============================================
// INSTALL EVENT - Precache critical resources
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing BetaForge Service Worker v' + SW_VERSION);
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHES.static);
      
      // Precache critical resources
      await Promise.allSettled(
        PRECACHE_URLS.map(url => 
          cache.add(url).catch(err => 
            console.warn(`[SW] Failed to cache ${url}:`, err)
          )
        )
      );
      
      // Force activation without waiting
      await self.skipWaiting();
      console.log('[SW] Installed successfully');
    })()
  );
});

// ============================================
// ACTIVATE EVENT - Clean old caches
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating BetaForge Service Worker v' + SW_VERSION);
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const validCaches = Object.values(CACHES);
      
      await Promise.all(
        cacheNames
          .filter(name => name.startsWith(CACHE_PREFIX) && !validCaches.includes(name))
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
      
      // Take control of all clients immediately
      await self.clients.claim();
      
      // Notify all clients about the update
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_ACTIVATED',
          version: SW_VERSION
        });
      });
      
      console.log('[SW] Activated and controlling all clients');
    })()
  );
});

// ============================================
// FETCH EVENT - Intelligent request routing
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests (except for specific API caching)
  if (request.method !== 'GET') {
    // Handle POST for share target
    if (url.pathname === '/api/share-target') {
      event.respondWith(handleShareTarget(request));
      return;
    }
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Skip API routes that need real-time data
  if (url.pathname.includes('/stream') || url.pathname.includes('/webhook')) {
    return;
  }
  
  // Route to appropriate cache strategy
  event.respondWith(handleFetch(request, url));
});

async function handleFetch(request, url) {
  // API Routes - Network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    // Short cache for API data
    if (url.pathname.includes('/stats') || url.pathname.includes('/activity')) {
      return networkFirst(request, CACHES.api, 2000);
    }
    // Don't cache auth or session endpoints
    if (url.pathname.includes('/auth') || url.pathname.includes('/sessions')) {
      return fetch(request);
    }
    return staleWhileRevalidate(request, CACHES.api);
  }
  
  // Static assets - Cache first
  if (url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/)) {
    return cacheFirst(request, CACHES.static);
  }
  
  // Images - Cache first with long TTL
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/)) {
    return cacheFirst(request, CACHES.images);
  }
  
  // Google Fonts - Cache first
  if (url.hostname.includes('fonts.googleapis.com') || 
      url.hostname.includes('fonts.gstatic.com')) {
    return cacheFirst(request, CACHES.fonts);
  }
  
  // HTML pages - Network first for freshness
  if (request.headers.get('accept')?.includes('text/html')) {
    try {
      return await networkFirst(request, CACHES.dynamic, 3000);
    } catch (error) {
      // Return offline page if network fails
      const offlinePage = await caches.match('/offline');
      if (offlinePage) return offlinePage;
      
      return new Response('Offline', { 
        status: 503, 
        headers: { 'Content-Type': 'text/html' } 
      });
    }
  }
  
  // Default - Stale while revalidate
  return staleWhileRevalidate(request, CACHES.dynamic);
}

// ============================================
// SHARE TARGET HANDLER
// ============================================
async function handleShareTarget(request) {
  const formData = await request.formData();
  const title = formData.get('title') || '';
  const text = formData.get('text') || '';
  const url = formData.get('url') || '';
  
  // Store shared data for the app to pick up
  const clients = await self.clients.matchAll({ type: 'window' });
  
  if (clients.length > 0) {
    clients[0].postMessage({
      type: 'SHARE_TARGET',
      data: { title, text, url }
    });
    clients[0].focus();
  } else {
    // Open new window with shared data
    const shareUrl = `/dashboard/projects/new?shared=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    await self.clients.openWindow(shareUrl);
  }
  
  return Response.redirect('/dashboard/projects/new', 303);
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let data = {
    title: 'BetaForge',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'betaforge-notification',
    renotify: true,
    requireInteraction: false,
    actions: []
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  // Add default actions based on notification type
  if (data.type === 'test_complete') {
    data.actions = [
      { action: 'view', title: 'View Results', icon: '/icons/action-view.png' },
      { action: 'dismiss', title: 'Dismiss', icon: '/icons/action-dismiss.png' }
    ];
  } else if (data.type === 'bug_found') {
    data.actions = [
      { action: 'view', title: 'View Bug', icon: '/icons/action-bug.png' },
      { action: 'snooze', title: 'Snooze', icon: '/icons/action-snooze.png' }
    ];
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      renotify: data.renotify,
      requireInteraction: data.requireInteraction,
      actions: data.actions,
      data: data.payload || {},
      vibrate: [100, 50, 100],
      timestamp: Date.now()
    })
  );
});

// ============================================
// NOTIFICATION CLICK HANDLER
// ============================================
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  const payload = event.notification.data || {};
  let targetUrl = '/dashboard';
  
  switch (event.action) {
    case 'view':
      if (payload.reportId) {
        targetUrl = `/reports/${payload.reportId}`;
      } else if (payload.sessionId) {
        targetUrl = `/sessions/${payload.sessionId}`;
      }
      break;
    case 'snooze':
      // Handle snooze - reschedule notification
      return;
    case 'dismiss':
      return;
    default:
      // Default click on notification body
      if (payload.url) {
        targetUrl = payload.url;
      }
  }
  
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ 
        type: 'window',
        includeUncontrolled: true 
      });
      
      // Focus existing window if available
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          await client.focus();
          client.postMessage({
            type: 'NAVIGATE',
            url: targetUrl
          });
          return;
        }
      }
      
      // Open new window if no existing window
      await self.clients.openWindow(targetUrl);
    })()
  );
});

// ============================================
// BACKGROUND SYNC
// ============================================
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  switch (event.tag) {
    case 'sync-test-results':
      event.waitUntil(syncTestResults());
      break;
    case 'sync-bug-reports':
      event.waitUntil(syncBugReports());
      break;
    case 'sync-project-updates':
      event.waitUntil(syncProjectUpdates());
      break;
    default:
      console.log('[SW] Unknown sync tag:', event.tag);
  }
});

async function syncTestResults() {
  try {
    const cache = await caches.open(CACHES.api);
    // Sync any pending test results stored in IndexedDB
    const db = await openDB();
    const pendingResults = await db.getAll('pending-sync');
    
    for (const result of pendingResults) {
      try {
        const response = await fetch('/api/test-sessions/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result)
        });
        
        if (response.ok) {
          await db.delete('pending-sync', result.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync result:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

async function syncBugReports() {
  // Similar implementation for bug reports
  console.log('[SW] Syncing bug reports...');
}

async function syncProjectUpdates() {
  // Similar implementation for project updates
  console.log('[SW] Syncing project updates...');
}

// ============================================
// PERIODIC BACKGROUND SYNC (Next-Gen)
// ============================================
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag);
  
  switch (event.tag) {
    case 'check-test-status':
      event.waitUntil(checkTestStatus());
      break;
    case 'refresh-dashboard':
      event.waitUntil(refreshDashboardData());
      break;
  }
});

async function checkTestStatus() {
  try {
    const response = await fetch('/api/test-sessions?status=running');
    if (response.ok) {
      const data = await response.json();
      
      // Notify if tests completed
      if (data.completed?.length > 0) {
        await self.registration.showNotification('Tests Completed', {
          body: `${data.completed.length} test session(s) have finished`,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'test-complete',
          data: { type: 'test_complete', sessions: data.completed }
        });
      }
    }
  } catch (error) {
    console.error('[SW] Failed to check test status:', error);
  }
}

async function refreshDashboardData() {
  try {
    const cache = await caches.open(CACHES.api);
    
    // Prefetch common API endpoints
    const endpoints = ['/api/stats', '/api/activity', '/api/projects'];
    
    await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const response = await fetch(endpoint);
        if (response.ok) {
          await cache.put(endpoint, response);
        }
      })
    );
  } catch (error) {
    console.error('[SW] Failed to refresh dashboard:', error);
  }
}

// ============================================
// MESSAGE HANDLER
// ============================================
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  switch (event.data?.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0]?.postMessage({ version: SW_VERSION });
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        (async () => {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
          event.ports[0]?.postMessage({ success: true });
        })()
      );
      break;
      
    case 'CACHE_URLS':
      event.waitUntil(
        (async () => {
          const cache = await caches.open(CACHES.static);
          await cache.addAll(event.data.urls || []);
          event.ports[0]?.postMessage({ success: true });
        })()
      );
      break;
      
    case 'REGISTER_PERIODIC_SYNC':
      event.waitUntil(registerPeriodicSync(event.data.tag, event.data.minInterval));
      break;
  }
});

async function registerPeriodicSync(tag, minInterval) {
  try {
    const registration = await self.registration;
    if ('periodicSync' in registration) {
      await registration.periodicSync.register(tag, {
        minInterval: minInterval || 12 * 60 * 60 * 1000 // 12 hours default
      });
      console.log('[SW] Periodic sync registered:', tag);
    }
  } catch (error) {
    console.error('[SW] Failed to register periodic sync:', error);
  }
}

// ============================================
// INDEXEDDB HELPER
// ============================================
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('betaforge-sw', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pending-sync')) {
        db.createObjectStore('pending-sync', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

console.log('[SW] BetaForge Service Worker loaded - v' + SW_VERSION);
