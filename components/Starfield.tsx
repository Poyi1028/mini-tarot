'use client';

import { useMemo } from 'react';
import { GOLD } from '@/lib/constants';
import { mulberry } from '@/lib/utils';

export default function Starfield({ density = 60, seed = 1 }: { density?: number; seed?: number }) {
  const stars = useMemo(() => {
    const rng = mulberry(seed);
    return Array.from({ length: density }, () => ({
      x: rng() * 100,
      y: rng() * 100,
      r: rng() * 1.4 + 0.3,
      o: rng() * 0.6 + 0.2,
      d: rng() * 6 + 3,
      t: rng() * 6,
    }));
  }, [density, seed]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201, 169, 78, 0.06), transparent 70%),
          radial-gradient(ellipse 100% 70% at 50% 110%, rgba(0, 0, 0, 0.6), transparent 60%),
          linear-gradient(180deg, #050505 0%, #090908 50%, #070707 100%)
        `,
      }}
    >
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.x + '%',
            top: s.y + '%',
            width: s.r * 2,
            height: s.r * 2,
            borderRadius: '50%',
            background: i % 7 === 0 ? GOLD : '#ece4cf',
            opacity: s.o,
            boxShadow: i % 11 === 0 ? `0 0 ${s.r * 4}px ${GOLD}` : 'none',
            animation: `twinkle ${s.d}s ease-in-out ${s.t}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
