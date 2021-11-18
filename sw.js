importScripts('js/sw-aux.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/avatars/fiona.jpg',
    'img/avatars/burro.jpg',
    'img/avatars/pinocho.png',
    'img/avatars/jengi.jpg',
    'img/avatars/suegrita.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'css/animate.css',
    'js/libs/jquery.js',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300'

];

self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cancheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));
    e.waitUntil(Promise.all([cacheStatic, cancheInmutable]));
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => { //cache con respaldo en internet
        if (res)
            return res;
        else {
            console.log(e.request.url);
            return fetch(e.request).then(newRes => { //nos vamos a internet
                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newRes)
            });

        }

    });
    e.respondWith(respuesta);
});