'use client';

import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { GOLD_BRIGHT } from '@/lib/constants';
import { mulberry } from '@/lib/utils';

// Rising light-mote particle layer — the "maxed" ambient particles. Positions
// are seeded (mulberry) so they stay stable across re-renders.
export default function Motes({
  count = 14,
  seed = 5,
  color = GOLD_BRIGHT,
  area = { x: 50, y: 55, w: 60, h: 40 },
}: {
  count?: number;
  seed?: number;
  color?: string;
  area?: { x: number; y: number; w: number; h: number };
}) {
  const motes = useMemo(() => {
    const rng = mulberry(seed);
    return Array.from({ length: count }, () => ({
      x: area.x + (rng() - 0.5) * area.w,
      y: area.y + (rng() - 0.5) * area.h,
      s: 1.3 + rng() * 2.6,
      dx: (rng() - 0.5) * 26,
      dur: 3 + rng() * 3,
      delay: rng() * 4,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, seed, area.x, area.y, area.w, area.h]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {motes.map((m, i) => (
        <span
          key={i}
          style={
            {
              position: 'absolute',
              left: m.x + '%',
              top: m.y + '%',
              width: m.s,
              height: m.s,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 ${m.s * 2.4}px ${m.s}px ${color}`,
              transform: 'translate(-50%, -50%)',
              animation: `mote-rise ${m.dur}s cubic-bezier(.15,.6,.3,1) ${m.delay}s infinite`,
              '--dx': m.dx + 'px',
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
