import './globals.css';
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

export const metadata = {
  title: '聖三角塔羅',
  description: '沉浸式塔羅占卜 App — 深紫×墨黑×金邊',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant" className={`${cinzel.variable} ${notoSerifTC.variable}`}>
      <body>{children}</body>
    </html>
  );
}
