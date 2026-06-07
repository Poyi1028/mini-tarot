import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Cinzel, Cormorant_Garamond, Noto_Serif_TC, Noto_Sans_TC } from 'next/font/google';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cinzel',
  display: 'swap',
});

// Elegant italic display face for the Violet Mist hero titles.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant-garamond',
  display: 'swap',
});

const notoSerifTC = Noto_Serif_TC({
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
  preload: false,
});

// Sans face for deck tabs / chips.
const notoSansTC = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Mini-Tarot',
  description: '沉浸式塔羅占卜 App',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mini-Tarot',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0a12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-Hant"
      className={`${cinzel.variable} ${cormorant.variable} ${notoSerifTC.variable} ${notoSansTC.variable}`}
    >
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
