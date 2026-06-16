/* ════════════════════════════════════════════════════════════════
   SERVICE WORKER · Fátima Pro Hub (PWA)
   - Permite instalar la app en móvil y ordenador.
   - Estrategia: network-first para navegación (siempre lo último),
     con caché de respaldo cuando no hay internet.
   - NUNCA cachea Firebase / Storage / APIs (deben ir siempre a la red).
   ════════════════════════════════════════════════════════════════ */
const CACHE = 'fatima-pro-v1';

/* App shell mínimo: lo esencial para arrancar offline. */
const SHELL = [
  'fatima_hub.html',
  'fatima_modules.js',
  'hub_core_parche.js',
  'hub_credito_bridge.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL).catch(()=>{}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  /* Solo gestionamos GET del mismo origen. Todo lo externo
     (Firebase, gstatic, Google Drive, unpkg, fuentes…) pasa directo a la red. */
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  /* Network-first: intenta la red, guarda copia, si falla usa caché. */
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() =>
      caches.match(req).then(hit => hit || caches.match('fatima_hub.html'))
    )
  );
});
