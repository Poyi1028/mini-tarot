'use client';

import { GOLD } from '@/lib/constants';

export default function CardGlyph({ num, size }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: GOLD,
    strokeWidth: 0.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const G = {
    0: (
      <g>
        <circle cx="32" cy="32" r="18" />
        <path d="M22 38 L32 18 L42 38 Z" />
        <circle cx="32" cy="32" r="1.5" fill={GOLD} />
      </g>
    ),
    1: (
      <g>
        <path d="M32 14 V50" />
        <path d="M20 26 H44" />
        <circle cx="32" cy="32" r="10" />
      </g>
    ),
    2: (
      <g>
        <path d="M22 18 V46 A10 10 0 0 0 42 46 V18" />
        <path d="M22 22 H42" />
        <circle cx="32" cy="32" r="3" fill={GOLD} />
      </g>
    ),
    3: (
      <g>
        <circle cx="32" cy="26" r="8" />
        <path d="M18 50 Q32 36 46 50" />
        <path d="M28 22 L32 18 L36 22" />
      </g>
    ),
    4: (
      <g>
        <rect x="18" y="22" width="28" height="24" />
        <path d="M18 22 L24 14 H40 L46 22" />
        <path d="M28 46 V36 H36 V46" />
      </g>
    ),
    5: (
      <g>
        <path d="M32 14 L20 28 H44 Z" />
        <path d="M24 28 V50 H40 V28" />
        <path d="M32 28 V50" />
      </g>
    ),
    6: (
      <g>
        <circle cx="24" cy="32" r="8" />
        <circle cx="40" cy="32" r="8" />
        <path d="M16 46 Q32 54 48 46" />
      </g>
    ),
    7: (
      <g>
        <rect x="16" y="28" width="32" height="14" />
        <circle cx="22" cy="46" r="3" />
        <circle cx="42" cy="46" r="3" />
        <path d="M32 28 V18 M28 22 L32 18 L36 22" />
      </g>
    ),
    8: (
      <g>
        <path d="M16 40 Q16 24 32 24 Q48 24 48 40" />
        <path d="M22 40 Q26 46 32 46 Q38 46 42 40" />
        <path d="M22 32 L20 30 M42 32 L44 30" />
      </g>
    ),
    9: (
      <g>
        <circle cx="28" cy="30" r="3" fill={GOLD} />
        <path d="M22 38 Q28 50 38 48 L42 30" />
        <path d="M28 30 L20 22" />
      </g>
    ),
    10: (
      <g>
        <circle cx="32" cy="32" r="16" />
        <circle cx="32" cy="32" r="8" />
        <path d="M32 16 V48 M16 32 H48 M20 20 L44 44 M44 20 L20 44" />
      </g>
    ),
    11: (
      <g>
        <path d="M32 14 V40" />
        <path d="M22 24 H42" />
        <path d="M18 40 Q22 46 26 40" />
        <path d="M38 40 Q42 46 46 40" />
        <path d="M22 50 H42" />
      </g>
    ),
    12: (
      <g>
        <path d="M18 16 H46" />
        <path d="M32 16 V32" />
        <circle cx="32" cy="38" r="6" />
        <path d="M28 44 V52 M36 44 V52" />
      </g>
    ),
    13: (
      <g>
        <path d="M20 44 L26 30 L32 44 L38 30 L44 44" />
        <circle cx="32" cy="22" r="4" />
        <path d="M20 48 H44" />
      </g>
    ),
    14: (
      <g>
        <path d="M24 18 Q32 26 24 34 Q16 42 24 50" />
        <path d="M40 18 Q32 26 40 34 Q48 42 40 50" />
        <path d="M28 34 H36" />
      </g>
    ),
    15: (
      <g>
        <circle cx="32" cy="26" r="8" />
        <path d="M26 22 L24 16 M38 22 L40 16" />
        <path d="M24 38 Q32 50 40 38" />
        <path d="M22 46 V52 M42 46 V52" />
      </g>
    ),
    16: (
      <g>
        <path d="M22 50 V28 L32 14 L42 28 V50" />
        <path d="M22 50 H42" />
        <path d="M28 30 L36 22 M28 22 L36 30" />
      </g>
    ),
    17: (
      <g>
        <g transform="translate(32 26)">
          <path
            d="M 0 -10 L 2 -2 L 10 0 L 2 2 L 0 10 L -2 2 L -10 0 L -2 -2 Z"
            fill={GOLD}
            fillOpacity="0.4"
          />
        </g>
        <path d="M18 44 Q24 38 32 44 Q40 38 46 44" />
        <path d="M20 50 H44" />
      </g>
    ),
    18: (
      <g>
        <path
          d="M40 16 A14 14 0 1 0 40 48 A11 11 0 1 1 40 16 Z"
          fill={GOLD}
          fillOpacity="0.25"
        />
        <circle cx="22" cy="50" r="2" />
        <circle cx="32" cy="52" r="2" />
        <circle cx="42" cy="50" r="2" />
      </g>
    ),
    19: (
      <g>
        <circle cx="32" cy="32" r="8" fill={GOLD} fillOpacity="0.4" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x1 = 32 + Math.cos(a) * 12,
            y1 = 32 + Math.sin(a) * 12,
            x2 = 32 + Math.cos(a) * 18,
            y2 = 32 + Math.sin(a) * 18;
          return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} />;
        })}
      </g>
    ),
    20: (
      <g>
        <path d="M32 14 L24 26 H40 Z" />
        <path d="M20 28 H44 V46 H20 Z" />
        <path d="M26 28 V46 M32 28 V46 M38 28 V46" />
      </g>
    ),
    21: (
      <g>
        <ellipse cx="32" cy="32" rx="14" ry="20" />
        <circle cx="32" cy="32" r="4" fill={GOLD} />
        <path d="M18 32 H46" />
      </g>
    ),
  };

  return <svg {...props}>{G[num] ?? G[0]}</svg>;
}
