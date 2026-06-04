'use client';

import { useMemo } from 'react';
import { GOLD, LILAC } from '@/lib/constants';
import { mulberry } from '@/lib/utils';

// Twinkling starfield over the deep-indigo Violet Mist backdrop. Pass
// bg="transparent" to layer it over a backdrop the caller already painted
// (e.g. the immersive card detail's own indigo cosmos).
const DEFAULT_BG = `
  radial-gradient(ellipse 80% 60% at 50% 0%, rgba(216, 189, 143, 0.05), transparent 70%),
  radial-gradient(ellipse 92% 58% at 50% 22%, #25224a 0%, #1a1736 52%, transparent 78%),
  radial-gradient(ellipse 100% 70% at 50% 110%, rgba(8, 6, 20, 0.7), transparent 60%),
  linear-gradient(180deg, #16132e 0%, #15132c 50%, #141228 100%)
`;

export default function Starfield({
  density = 60,
  seed = 1,
  bg = DEFAULT_BG,
}: {
  density?: number;
  seed?: number;
  bg?: string;
}) {
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
        background: bg,
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
            background: i % 7 === 0 ? GOLD : i % 5 === 0 ? LILAC : '#ece6d8',
            opacity: s.o,
            boxShadow: i % 11 === 0 ? `0 0 ${s.r * 4}px ${GOLD}` : 'none',
            animation: `twinkle ${s.d}s ease-in-out ${s.t}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
