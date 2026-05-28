export default function manifest() {
  return {
    name: '聖三角塔羅',
    short_name: '塔羅',
    description: '沉浸式塔羅占卜 — 深紫×墨黑×金邊',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#070707',
    theme_color: '#070707',
    lang: 'zh-Hant',
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        purpose: 'any maskable',
      },
    ],
  };
}
