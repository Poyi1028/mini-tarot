'use client';

import { memo } from 'react';
import { gold } from '@/lib/constants';

// A shared, physical-deck-style card back. The source artwork is a simplified
// sun-and-moon redraw while the wrapper owns sizing and glow.
function CardBack({ w = 84, h = 148, glow = false }: { w?: number; h?: number; glow?: boolean }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.09,
        position: 'relative',
        overflow: 'hidden',
        background: '#0a1019',
        border: `1px solid ${gold(0.78)}`,
        boxShadow: glow
          ? `0 0 ${w * 0.4}px ${gold(0.6)}, 0 0 ${w * 0.18}px ${gold(0.4)}, inset 0 0 0 ${Math.max(2, w * 0.04)}px ${gold(0.2)}`
          : `0 2px 8px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.45)`,
      }}
    >
      <img
        src="/card-back-simple.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

// Props are primitive and constant per card, so memo lets the card backs skip
// reconciliation when the shuffle re-targets card positions every frame.
export default memo(CardBack);
