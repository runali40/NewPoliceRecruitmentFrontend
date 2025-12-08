// const CACHE_VERSION = 'v1';
// const CACHE_NAME = `my-site-cache-${CACHE_VERSION}`;

// // Resources to pre-cache
// const PRECACHE_URLS = [
//   '/',
//   '/index.html',
//   '/offline.html',
//   '/styles/main.css',
//   '/scripts/main.js',
//   '/https://policerecruitment.initialinfinity.com/'
//   // Add other important assets here
// ];

// // Install event
// self.addEventListener('install', event => {
//   console.log('[Service Worker] Install');
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => {
//         console.log('[Service Worker] Pre-caching offline page');
//         return cache.addAll(PRECACHE_URLS);
//       })
//       .catch(error => {
//         console.error('[Service Worker] Pre-cache error:', error);
//       })
//   );
// });

// // Activate event
// self.addEventListener('activate', event => {
//   console.log('[Service Worker] Activate');
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.map(cacheName => {
//           if (cacheName !== CACHE_NAME) {
//             console.log('[Service Worker] Removing old cache:', cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// // Fetch event
// self.addEventListener('fetch', event => {
//   console.log('[Service Worker] Fetch', event.request.url);
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => {
//         if (response) {
//           console.log('[Service Worker] Found in Cache:', event.request.url);
//           return response;
//         }
//         console.log('[Service Worker] Network request for:', event.request.url);
//         return fetch(event.request)
//           .then(response => {
//             // Check if we received a valid response
//             if (!response || response.status !== 200 || response.type !== 'basic') {
//               return response;
//             }

//             // IMPORTANT: Clone the response. A response is a stream
//             // and because we want the browser to consume the response
//             // as well as the cache consuming the response, we need
//             // to clone it so we have two streams.
//             var responseToCache = response.clone();

//             caches.open(CACHE_NAME)
//               .then(cache => {
//                 cache.put(event.request, responseToCache);
//               });

//             return response;
//           })
//           .catch(error => {
//             console.error('[Service Worker] Fetch failed; returning offline page instead.', error);
//             return caches.match('/offline.html');
//           });
//       })
//   );
// });

// // Error handling
// self.addEventListener('error', event => {
//   console.error('[Service Worker] Error:', event.filename, event.lineno, event.message);
// });

// // Unhandled promise rejection handling
// self.addEventListener('unhandledrejection', event => {
//   console.error('[Service Worker] Unhandled Rejection:', event.reason);
// });

// // Log when the service worker takes control
// self.addEventListener('controllerchange', () => {
//   console.log('[Service Worker] Controller Changed');
// });
// const CACHE_NAME = "version-1";
// const urlsToCache = ["index.html", "offline.html"];
// const self = this;

// // Installation
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Opened cache");
//       return Promise.all(
//         urlsToCache.map((url) => {
//           console.log(`Caching: ${url}`);
//           return cache.add(url).catch((error) => {
//             console.error(`Failed to cache: ${url}`, error);
//           });
//         })
//       );
//     })
//   );
// });

// // Listen for requests
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((res) => {
//       return res || fetch(event.request).catch(() => caches.match("offline.html"));
//     })
//   );
// });

// // Activate the service worker
// self.addEventListener("activate", (event) => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!cacheWhitelist.includes(cacheName)) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });