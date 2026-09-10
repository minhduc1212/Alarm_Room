const CACHE_NAME = 'alarm-room-v1';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon.svg',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/tracks/digital-beep.wav',
    '/tracks/emergency-siren.wav',
    '/tracks/nuclear-klaxon.wav',
    '/tracks/cyber-alert.wav',
    '/tracks/gentle-chime.wav',
    '/alarm-track.mp3'
];

// Install: Cache core application shell & sound tracks
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate: Clean up old cache versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Network-first for dynamic API endpoints, Cache-first for static assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // API calls: Network-first
    const isApiRequest = url.pathname.startsWith('/status') ||
                         url.pathname.startsWith('/set') ||
                         url.pathname.startsWith('/cancel') ||
                         url.pathname.startsWith('/trigger') ||
                         url.pathname.startsWith('/clue') ||
                         url.pathname.startsWith('/unlock') ||
                         url.pathname.startsWith('/disarm') ||
                         url.pathname.startsWith('/tracks');

    if (isApiRequest) {
        event.respondWith(
            fetch(event.request).catch(() => {
                // If offline and request is /status, return dormant fallback
                if (url.pathname.startsWith('/status')) {
                    return new Response(JSON.stringify({
                        ringing: false,
                        alarmTime: null,
                        selectedTrack: { id: 'digital-beep', name: 'Digital Beep', file: 'tracks/digital-beep.wav' },
                        systemTime: new Date().toLocaleTimeString('en-US', { hour12: false })
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                return new Response(JSON.stringify({ error: 'Offline' }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // Static assets: Cache-first with network fallback
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Background update
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
                    }
                }).catch(() => {});
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
                }
                return networkResponse;
            });
        })
    );
});
