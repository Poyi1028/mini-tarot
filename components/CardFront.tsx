'use client';

import { GOLD, gold } from '@/lib/constants';
import type { Card } from '@/lib/tarot-cards';

export default function CardFront({
  card,
  w = 84,
  h = 148,
  reversed = false,
}: {
  card: Card;
  w?: number;
  h?: number;
  reversed?: boolean;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        position: 'relative',
        borderRadius: w * 0.08,
        overflow: 'hidden',
        border: `1.5px solid ${GOLD}`,
        boxShadow: `0 6px 20px rgba(0,0,0,0.5), 0 0 22px ${gold(0.28)}`,
      }}
    >
      <img
        src={card.img}
        alt={`${card.cn} ${card.en}`}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          // 逆位牌將圖面上下顛倒（外框不轉）
          transform: reversed ? 'rotate(180deg)' : undefined,
        }}
      />
      {/* inner gold hairline */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: w * 0.08,
          boxShadow: `inset 0 0 0 3px ${gold(0.25)}`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
