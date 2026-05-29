const CACHE_NAME = 'mini-tarot-v1';

const STATIC_ASSETS = [
  '/',
  '/icon-192.png',
  '/icon-512.png',
  '/cards/00-TheFool.png',
  '/cards/01-TheMagician.png',
  '/cards/02-TheHighPriestess.png',
  '/cards/03-TheEmpress.png',
  '/cards/04-TheEmperor.png',
  '/cards/05-TheHierophant.png',
  '/cards/06-TheLovers.png',
  '/cards/07-TheChariot.png',
  '/cards/08-Strength.png',
  '/cards/09-TheHermit.png',
  '/cards/10-WheelOfFortune.png',
  '/cards/11-Justice.png',
  '/cards/12-TheHangedMan.png',
  '/cards/13-Death.png',
  '/cards/14-Temperance.png',
  '/cards/15-TheDevil.png',
  '/cards/16-TheTower.png',
  '/cards/17-TheStar.png',
  '/cards/18-TheMoon.png',
  '/cards/19-TheSun.png',
  '/cards/20-Judgement.png',
  '/cards/21-TheWorld.png',
  '/cards/Cups01.png',
  '/cards/Cups02.png',
  '/cards/Cups03.png',
  '/cards/Cups04.png',
  '/cards/Cups05.png',
  '/cards/Cups06.png',
  '/cards/Cups07.png',
  '/cards/Cups08.png',
  '/cards/Cups09.png',
  '/cards/Cups10.png',
  '/cards/Cups11.png',
  '/cards/Cups12.png',
  '/cards/Cups13.png',
  '/cards/Cups14.png',
  '/cards/Pentacles01.png',
  '/cards/Pentacles02.png',
  '/cards/Pentacles03.png',
  '/cards/Pentacles04.png',
  '/cards/Pentacles05.png',
  '/cards/Pentacles06.png',
  '/cards/Pentacles07.png',
  '/cards/Pentacles08.png',
  '/cards/Pentacles09.png',
  '/cards/Pentacles10.png',
  '/cards/Pentacles11.png',
  '/cards/Pentacles12.png',
  '/cards/Pentacles13.png',
  '/cards/Pentacles14.png',
  '/cards/Swords01.png',
  '/cards/Swords02.png',
  '/cards/Swords03.png',
  '/cards/Swords04.png',
  '/cards/Swords05.png',
  '/cards/Swords06.png',
  '/cards/Swords07.png',
  '/cards/Swords08.png',
  '/cards/Swords09.png',
  '/cards/Swords10.png',
  '/cards/Swords11.png',
  '/cards/Swords12.png',
  '/cards/Swords13.png',
  '/cards/Swords14.png',
  '/cards/Wands01.png',
  '/cards/Wands02.png',
  '/cards/Wands03.png',
  '/cards/Wands04.png',
  '/cards/Wands05.png',
  '/cards/Wands06.png',
  '/cards/Wands07.png',
  '/cards/Wands08.png',
  '/cards/Wands09.png',
  '/cards/Wands10.png',
  '/cards/Wands11.png',
  '/cards/Wands12.png',
  '/cards/Wands13.png',
  '/cards/Wands14.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
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
  const url = new URL(request.url);

  // API 呼叫永遠走網路，不快取
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 卡牌圖片：Cache-first（圖片不會變動）
  if (url.pathname.startsWith('/cards/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return res;
        });
      })
    );
    return;
  }

  // 其他資源：Stale-while-revalidate（回傳快取並背景更新）
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
