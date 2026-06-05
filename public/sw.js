const CACHE_NAME = 'mini-tarot-v3';

// App Shell：離線時導頁的回退頁面 + 圖示
const SHELL_ASSETS = [
  '/',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // 逐一快取，單一資源失敗不會讓整個 install reject
      Promise.allSettled(SHELL_ASSETS.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 只處理 GET；POST/API 等交給網路
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 跨網域資源不介入
  if (url.origin !== self.location.origin) return;

  // API 呼叫永遠走網路，不快取
  if (url.pathname.startsWith('/api/')) return;

  // 導頁（HTML 文件）：Network-first，避免部署後吐到指向舊 chunk 的舊 HTML。
  // 離線時回退到快取頁面（最後退到 App Shell '/'）。
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/'))
        )
    );
    return;
  }

  // Next.js 帶 hash 的靜態資源 + 卡牌圖片：Cache-first（內容不可變）
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/cards/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // 其他資源：Stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    )
  );
});
