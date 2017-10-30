var cacheName = 'PokeTac';

var filesToCache = [
  '/',
  '/index.html',
  '/js/vendor/jquery-3.1.1.min.js',
  '/js/plugins.js',
  '/js/main.js',
  '/css/normalize.css',
  '/css/animate.min.css',
  '/css/main.css',
  '/img/dimension-poke-grey.png',
  '/img/dimension-poke.png',
  '/img/gym.png',
  '/img/johto-kanto-map-3000x1062.jpg',
  '/img/spritesheet.png',
  '/sounds/music/main-theme.mp3',
  '/css/fonts/Quicksand.ttf'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {

  e.respondWith(
    caches.match(e.request).then(function(response) {
      console.log('[ServiceWorker] Fetch', e.request.url);
      return response || fetch(e.request);
    })
  );

});
