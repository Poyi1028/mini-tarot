import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'mini tarot',
    short_name: 'mini tarot',
    description: '沉浸式塔羅占卜',
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
