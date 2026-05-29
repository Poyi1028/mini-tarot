import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Cinzel, Noto_Serif_TC } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cinzel',
  display: 'swap',
});

const notoSerifTC = Noto_Serif_TC({
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: '塔羅',
  description: '沉浸式塔羅占卜 App',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '塔羅',
  },
  icons: {
    icon: '/cards.svg',
    apple: '/cards.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#070707',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${cinzel.variable} ${notoSerifTC.variable}`}>
      <body>{children}</body>
    </html>
  );
}
