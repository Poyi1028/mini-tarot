'use client';

import type { Card } from '@/lib/tarot-cards';

export default function CardFront({ card, w = 84, h = 148 }: { card: Card; w?: number; h?: number }) {
  return (
    <img
      src={card.img}
      alt={`${card.cn} ${card.en}`}
      draggable={false}
      style={{
        width: w,
        height: h,
        objectFit: 'cover',
        borderRadius: w * 0.08,
        display: 'block',
        boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
      }}
    />
  );
}
