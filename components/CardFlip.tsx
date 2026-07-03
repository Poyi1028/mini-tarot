'use client';

import { motion } from 'framer-motion';
import { EASE } from '@/lib/motion';
import type { Card } from '@/lib/tarot-cards';
import CardBack from './CardBack';
import CardFront from './CardFront';

// 共用的 3D 翻牌核心 —— preserve-3d 旋轉容器 + 牌背／牌面雙層。
// SpreadScreen 與 HomeScreen 的每日運勢共用這一份翻轉機構；
// perspective 容器、點擊範圍與氛圍層由呼叫端各自處理。
export default function CardFlip({
  card,
  reversed,
  flipped,
  w,
  h,
}: {
  card: Card;
  reversed: boolean;
  flipped: boolean;
  w: number;
  h: number;
}) {
  const radius = w * 0.08;
  const face = {
    backfaceVisibility: 'hidden',
    borderRadius: radius,
    overflow: 'hidden',
  } as const;
  return (
    <motion.div
      className="relative h-full w-full"
      style={{ transformStyle: 'preserve-3d', borderRadius: radius }}
      initial={false}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 1.2, ease: EASE.reveal }}
    >
      <div className="absolute inset-0" style={face}>
        <CardBack w={w} h={h} />
      </div>
      <div className="absolute inset-0" style={{ ...face, transform: 'rotateY(180deg)' }}>
        <CardFront card={card} w={w} h={h} reversed={reversed} />
      </div>
    </motion.div>
  );
}
