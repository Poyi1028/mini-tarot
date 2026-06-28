'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOLD, GOLD_DIM, gold } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import { getDailyDraw, dateDisplay } from '@/lib/daily';
import type { Card } from '@/lib/tarot-cards';
import CardFlip from './CardFlip';
import SuitGlyph from './SuitGlyph';
import CardDetailImmersive from './CardDetailImmersive';
import Starfield from './Starfield';
import BackButton from './decor/BackButton';

// 單張英雄牌尺寸，比例貼合 300×527 原圖（≈0.5676），不裁切不留邊。
const CARD_W = 150;
const CARD_H = 264;

// 法陣畫布尺寸（以卡牌中心為圓心）。
const SIGIL = 360;

// 外圈法陣 —— 同心圓 + 12 刻度 + 四方位點（靜態層），外加一圈緩慢旋轉的點狀環。
// 整體呼吸明滅；翻牌後（active）更亮、轉得略快，呼應卡牌揭示。
function DailySigil({ active }: { active: boolean }) {
  const ticks = Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180);
  const cardinals = [0, 90, 180, 270].map((d) => (d * Math.PI) / 180);
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ width: SIGIL, height: SIGIL, marginLeft: -SIGIL / 2, marginTop: -SIGIL / 2 }}
      initial={false}
      animate={{ opacity: active ? 0.55 : 0.28 }}
      transition={{ duration: 2, ease: EASE.out }}
    >
      {/* 恆定呼吸層 —— 與「翻牌增亮」分離，讓增亮平順、明滅持續。 */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
      <svg className="absolute inset-0" width={SIGIL} height={SIGIL} viewBox="-180 -180 360 360" style={{ overflow: 'visible' }}>
        <circle cx={0} cy={0} r={166} fill="none" stroke={GOLD} strokeWidth={0.7} opacity={0.26} />
        <circle cx={0} cy={0} r={154} fill="none" stroke={GOLD} strokeWidth={0.4} opacity={0.15} />
        <circle cx={0} cy={0} r={92} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.16} />
        {ticks.map((a, i) => (
          <line
            key={i}
            x1={Math.cos(a) * 140}
            y1={Math.sin(a) * 140}
            x2={Math.cos(a) * 148}
            y2={Math.sin(a) * 148}
            stroke={GOLD}
            strokeWidth={0.7}
            opacity={0.4}
          />
        ))}
        {cardinals.map((a, i) => (
          <circle key={i} cx={Math.cos(a) * 166} cy={Math.sin(a) * 166} r={3} fill="none" stroke={GOLD} strokeWidth={0.7} opacity={0.5} />
        ))}
      </svg>
      {/* 緩慢旋轉的點狀環 */}
      <motion.svg
        className="absolute inset-0"
        width={SIGIL}
        height={SIGIL}
        viewBox="-180 -180 360 360"
        style={{ overflow: 'visible' }}
        initial={false}
        animate={{ rotate: 360 }}
        transition={{ duration: active ? 60 : 90, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx={0}
          cy={0}
          r={160}
          fill="none"
          stroke={GOLD}
          strokeWidth={0.9}
          strokeDasharray="0.5 10"
          strokeLinecap="round"
          opacity={0.32}
        />
      </motion.svg>
      </motion.div>
    </motion.div>
  );
}

function DailyCard({
  card,
  reversed,
  flipped,
  onClick,
}: {
  card: Card;
  reversed: boolean;
  flipped: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative" style={{ width: CARD_W, height: CARD_H }}>
      {/* 外圈法陣 */}
      <DailySigil active={flipped} />

      {/* 金色光雲 —— 沿用 DeckCardDetail 的發光：一團模糊的圓形金光，緩緩呼吸。
          翻牌前低調、翻開後增亮；增亮（外層）與呼吸（內層）分離，使變亮平順不跳變。 */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{ width: 330, height: 330, transform: 'translate(-50%, -50%)' }}
        initial={false}
        animate={{ opacity: flipped ? 1 : 0.4 }}
        transition={{ duration: 2, ease: EASE.out }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              `radial-gradient(circle at center, rgba(238,212,160,0.62) 0%, rgba(228,198,150,0.34) 30%, ${gold(0.16)} 52%, ${gold(0.05)} 70%, transparent 82%)`,
            filter: 'blur(24px)',
          }}
          initial={false}
          animate={{ opacity: [0.55, 0.78, 0.55] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div
        onClick={onClick}
        className="relative"
        style={{ width: CARD_W, height: CARD_H, perspective: 1400, cursor: 'pointer' }}
      >
        <CardFlip card={card} reversed={reversed} flipped={flipped} w={CARD_W} h={CARD_H} />
      </div>
    </div>
  );
}

export default function DailyScreen({ onBack }: { onBack: () => void }) {
  // 每天固定一張：第一次開啟當天抽出並寫入 localStorage，之後同一天皆相同。
  const [draw] = useState(getDailyDraw);
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [detail, setDetail] = useState(false);

  const { card, reversed, dateKey } = draw;

  // 翻牌動畫轉過半圈後，再讓牌名與牌義浮現。
  useEffect(() => {
    if (!flipped) return;
    const t = setTimeout(() => setRevealed(true), 700);
    return () => clearTimeout(t);
  }, [flipped]);

  return (
    <div className="absolute inset-0">
      <Starfield density={20} seed={21} />
      <BackButton onClick={onBack} />

      <div className="absolute inset-0 flex flex-col items-center px-6 pb-8 pt-[60px]">
        {/* 標題 */}
        <div className="text-center">
          <div className="font-serif text-[18px] font-light tracking-[8px] text-parchment">
            今 日 運 勢
          </div>
          <div className="mt-2.5 text-[10px] tracking-[3px] text-muted">{dateDisplay(dateKey)}</div>
        </div>

        {/* 卡牌置中於剩餘空間 */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <DailyCard
            card={card}
            reversed={reversed}
            flipped={flipped}
            onClick={() => (flipped ? setDetail(true) : setFlipped(true))}
          />

          {/* 牌名 / 牌義 —— 翻開後浮現。固定高度，避免提示↔牌義切換時撐高版面把牌頂上去。 */}
          <div className="mt-7 flex h-[150px] flex-col items-center text-center">
            {!revealed ? (
              <div
                className="text-xs leading-[2] tracking-[4px] text-muted transition-opacity duration-[600ms]"
                style={{ opacity: flipped ? 0 : 1 }}
              >
                輕 觸 卡 牌
                <br />
                揭 示 今 日 指 引
              </div>
            ) : (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.slow, ease: EASE.out }}
              >
                <div className="mb-1.5 flex h-5 items-center justify-center text-gold-soft">
                  {card.arcana === 'minor' ? (
                    <SuitGlyph suit={card.suit} size={17} />
                  ) : (
                    <span className="font-display text-[15px] leading-none tracking-[1px]">
                      {card.roman}
                    </span>
                  )}
                </div>
                <div className="font-serif text-[18px] font-light leading-none tracking-[5px] text-parchment">
                  {card.cn}
                </div>
                <div
                  className="mt-1.5 italic"
                  style={{ fontFamily: 'var(--font-cormorant)', fontSize: 12, letterSpacing: 1.4, color: GOLD_DIM }}
                >
                  {card.en}
                </div>
                <div className="mt-4 text-[10px] tracking-[3px] text-muted">
                  點擊卡片查看牌義
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* 頁尾：明日再臨 */}
        <div
          className="text-center text-[10px] tracking-[3px] text-muted transition-opacity duration-[800ms]"
          style={{ opacity: revealed ? 1 : 0 }}
        >
          明 日 將 有 新 的 指 引
        </div>
      </div>

      <AnimatePresence>
        {detail && (
          <CardDetailImmersive
            card={card}
            reversed={reversed}
            onClose={() => setDetail(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
