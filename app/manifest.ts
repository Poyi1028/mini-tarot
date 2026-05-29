import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mini-Tarot',
    short_name: 'Mini-Tarot',
    description: '沉浸式塔羅占卜 — 暗紫×墨黑×香檳金',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#070709',
    theme_color: '#070709',
    lang: 'zh-Hant',
    icons: [
      {
        src: '/icon-192.png',
        type: 'image/png',
        sizes: '192x192',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable',
      },
    ],
  };
}
