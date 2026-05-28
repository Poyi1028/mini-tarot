'use client';

import { GOLD_SOFT, GOLD_DIM } from '@/lib/constants';

export default function CardFront({ card, w = 84, h = 148 }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.08,
        background: '#0a0a09',
        boxShadow: `0 6px 18px rgba(0,0,0,0.6), inset 0 0 0 1px ${GOLD_SOFT}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* card artwork — fills the frame edge-to-edge (frame matches the 300×527 art ratio) */}
      <img
        src={card.img}
        alt={`${card.cn} ${card.en}`}
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: w * 0.08,
          display: 'block',
        }}
      />

      {/* inner gold frame */}
      <div
        style={{
          position: 'absolute',
          inset: w * 0.04,
          border: `0.5px solid ${GOLD_DIM}`,
          borderRadius: w * 0.05,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
