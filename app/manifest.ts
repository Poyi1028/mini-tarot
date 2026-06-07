import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Mini-Tarot',
    short_name: 'Mini-Tarot',
    description: '沉浸式塔羅占卜 — 紫霧靛藍×丁香紫×香檳金',
    start_url: '/',
    scope: '/',
    categories: ['lifestyle', 'entertainment'],
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b0a12',
    theme_color: '#0b0a12',
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
