'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GOLD, MUTED, PARCHMENT, gold } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import { QUOTES, type Quote } from '@/lib/quotes';
import NightSky from './decor/NightSky';
import TextAction from './decor/TextAction';
import IconEntry from './decor/IconEntry';

// 首頁 = 門檻（threshold）：開場 splash 過後落腳的地方。以一句引言為主角，
// 給一個停留、定意念的拍子，並收攏三個入口（開始占卜 / 牌庫 / 每日運勢）。
// 把入口從 InputScreen 搬來這裡，input 就只剩「提問」一件事。
const HOME_BG = `
  radial-gradient(ellipse 80% 55% at 50% 0%, ${gold(0.025)}, transparent 70%),
  linear-gradient(180deg, #0c0b11 0%, #0a0910 55%, #08070d 100%)
`;

export default function HomeScreen({
  onStart,
  onOpenDeck,
  onOpenDaily,
}: {
  onStart: () => void;
  onOpenDeck: () => void;
  onOpenDaily: () => void;
}) {
  // 隨機挑一句引言 —— 只在 client 端 mount 後挑（Math.random 不能進 render，
  // 否則 SSR 與 client 首屏不一致會 hydration mismatch）。挑定後再淡入。
  const [quote, setQuote] = useState<Quote | null>(null);
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center px-8 pb-[9vh] pt-[15vh]"
      style={{ background: HOME_BG }}
    >
      <NightSky />

      {/* 引言 —— 主角，置中。挑定前不佔位，挑定後緩緩浮現。 */}
      <div className="relative z-[2] flex flex-1 flex-col items-center justify-center text-center">
        {quote && (
          <motion.blockquote
            className="max-w-[300px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.slow, ease: EASE.out }}
          >
            <p
              className="whitespace-pre-line font-serif text-[19px] font-light leading-[2.1] tracking-[1.5px]"
              style={{ color: PARCHMENT }}
            >
              {quote.text}
            </p>
            <footer
              className="mt-7 text-[11px] tracking-[3px]"
              style={{ color: MUTED }}
            >
              —— {quote.author}
              {quote.source ? `《${quote.source}》` : ''}
            </footer>
          </motion.blockquote>
        )}
      </div>

      {/* 入口 —— 主行動「開始占卜」在上，牌庫／每日運勢為次級並排在下。 */}
      <motion.div
        className="relative z-[2] flex flex-col items-center gap-7"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.slow, delay: 0.35, ease: EASE.out }}
      >
        <TextAction label="開始占卜" onClick={onStart} ariaLabel="開始占卜" />

        <div className="flex items-start gap-10">
          <IconEntry icon="/cards.svg" label="牌庫" ariaLabel="開啟牌庫" onClick={onOpenDeck} />
          <IconEntry icon="/book.svg" label="每日運勢" ariaLabel="開啟今日運勢" onClick={onOpenDaily} />
        </div>
      </motion.div>
    </div>
  );
}
