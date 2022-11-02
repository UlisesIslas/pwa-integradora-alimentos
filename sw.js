const STATIC_CACHE_NAME = 'static-cache-v1.1';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';

const cleanCache = (cacheName, itemsLimit) => {
    caches.open(cacheName).then((cache) => {
        return cache.keys().then((keys) => {
            if (keys.length > itemsLimit) {
                cache.delete(keys[0]).then(cleanCache(cacheName, itemsLimit));
            }
        });
    });
}

self.addEventListener('install', (event) => {
    console.log("SW: Instalado :D");
    const respCache = caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll([
            '/',
            '/index.html',
            '/js/app.js',
            '/sw.js',
            '/pages/listado-recolecciones.html',
            '/pages/detalles-recoleccion.html',
            '/pages/pendiente-detalles.html'
        ]);
    });
    const inmutableCacheRes = caches.open(INMUTABLE_CACHE_NAME).then((cache) => {
        return cache.addAll([
            'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js'
        ]);
    });
    event.waitUntil(Promise.all([respCache, inmutableCacheRes]));
});

self.addEventListener('active', (event) => {
    const proDelete = caches.keys().then((cachesItems) => {
        cachesItems.forEach(x => {
            if (x !== STATIC_CACHE_NAME && x.includes('static')) {
                return caches.delete(x);
            }
        });
    });
    event.waitUntil(proDelete);
});

self.addEventListener('fetch', (event) => {
    const resp = caches.match(event.request).then((respCache) => {
        if (respCache) {
            return respCache;
        }
        return fetch(event.request).then((respWeb) => {
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, respWeb);
                cleanCache(DYNAMIC_CACHE_NAME, 10);
            });
            return respWeb.clone();
        });
    }).catch((err) => {
        if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('pages/offline.html');
        }
    });
    event.respondWith(resp);
});