'use client';

import { memo } from 'react';
import { GOLD, GOLD_SOFT, GOLD_DIM } from '@/lib/constants';

function CardBack({ w = 84, h = 148, glow = false }: { w?: number; h?: number; glow?: boolean }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.08,
        background:
          'radial-gradient(ellipse at 50% 50%, #1a1233 0%, #0d0a16 60%, #070709 100%)',
        boxShadow: glow
          ? `0 0 ${w * 0.4}px rgba(231, 215, 166, 0.6), 0 0 ${w * 0.18}px rgba(231, 215, 166, 0.4), inset 0 0 0 1px ${GOLD}`
          : `0 2px 8px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5), inset 0 0 0 1px ${GOLD_DIM}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* inner gold frame */}
      <div
        style={{
          position: 'absolute',
          inset: w * 0.045,
          border: `0.6px solid ${GOLD_SOFT}`,
          borderRadius: w * 0.05,
          opacity: 0.85,
        }}
      />
      {/* center ornament */}
      <svg
        viewBox="0 0 84 148"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id={`g-${w}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.7" />
            <stop offset="60%" stopColor={GOLD} stopOpacity="0.15" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="42" cy="74" r="22" fill={`url(#g-${w})`} />
        <g
          transform="translate(42 74)"
          stroke={GOLD}
          strokeWidth="0.6"
          fill="none"
          opacity="0.85"
        >
          <path
            d="M 0 -18 L 2.5 -2.5 L 18 0 L 2.5 2.5 L 0 18 L -2.5 2.5 L -18 0 L -2.5 -2.5 Z"
            fill={GOLD}
            fillOpacity="0.5"
          />
          <path d="M 0 -26 L 4 -4 L 26 0 L 4 4 L 0 26 L -4 4 L -26 0 L -4 -4 Z" />
          <circle r="3" fill={GOLD} fillOpacity="0.9" />
          <circle r="10" />
        </g>
        {[
          [12, 16],
          [72, 16],
          [12, 132],
          [72, 132],
        ].map(([cx, cy], i) => (
          <g
            key={i}
            transform={`translate(${cx} ${cy})`}
            stroke={GOLD_SOFT}
            strokeWidth="0.5"
            fill="none"
            opacity="0.7"
          >
            <path d="M -4 0 L 4 0 M 0 -4 L 0 4" />
            <circle r="1.5" fill={GOLD} />
          </g>
        ))}
      </svg>
    </div>
  );
}

// Props are primitive and constant per card, so memo lets the 78 SVG card backs
// skip reconciliation when the shuffle re-targets card positions every frame.
export default memo(CardBack);
