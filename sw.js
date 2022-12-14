importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js');
importScripts('js/sw-db.js');
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
            './',
            './index.html',
            './sw.js',
            './js/alimentos-recolectados.js',
            './js/app.js',
            './js/camera.js',
            './js/detalles-recoleccion.js',
            './js/fontawesome.min.js',
            './js/listado_recolecciones.js',
            './js/login.js',
            './js/pendiente-detalles.js',
            './js/sw-db.js',
            './pages/detalles-recoleccion.html',
            './pages/lista-alimentos-recolectados.html',
            './pages/listado-recolecciones.html',
            './pages/pendiente-detalles.html',
            './css/bootstrap.min.css',
            './css/fontawesome.min.css'
        ]);
    });
    const inmutableCacheRes = caches.open(INMUTABLE_CACHE_NAME).then((cache) => {
        return cache.addAll([
            'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
            'https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js'
        ]);
    });
    event.waitUntil(Promise.all([respCache, inmutableCacheRes]));
});

self.addEventListener('fetch', (event) => {
    /*if (event.request.clone().method == "PUT") {
        const RESP = fetch(event.request.clone()).then((respWeb) => {
            return respWeb;
        }).catch(() => {
            if (self.ServiceWorkerRegistration.sync) {
                return event.request.json().then((body) => {
                    const respOffline = saveRecolection(body);
                    return respOffline;
                });
            } else {
                return null;
            }
        });
        event.respondWith(RESP);
    } else {*/
    if (event.request.clone().method) != "PUT" || event.request.clone().method != "POST") {
    const RESP = fetch(event.request).then((respWeb) => {
            if (!respWeb) {
                return caches.match(event.request);
            }
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, respWeb);
                cleanCache(DYNAMIC_CACHE_NAME, 48);
            });
            return respWeb.clone();
        }).catch(() => {
            return caches.match(event.request);
        });
    } else {
        return null;
    }
        
        event.respondWith(RESP);
    //
});

self.addEventListener('sync', (event) => {
    console.log("SW: Sync");
    if (event.tag === 'nueva-recoleccion') {
        const resPromSync = sendPostRecolection();
        event.waitUntil(resPromSync);
    }
});
