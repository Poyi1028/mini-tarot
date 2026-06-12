'use client';

import { memo, useMemo } from 'react';
import { GOLD, LILAC, gold } from '@/lib/constants';
import { mulberry } from '@/lib/utils';

// Twinkling starfield over the deep, matte Violet Mist backdrop. The violet is
// kept dark and desaturated (low gloss) so it reads as a near-black night with
// only a faint purple cast. Pass bg="transparent" to layer it over a backdrop
// the caller already painted (e.g. the immersive card detail's own cosmos).
const DEFAULT_BG = `
  radial-gradient(ellipse 80% 60% at 50% 0%, ${gold(0.035)}, transparent 70%),
  radial-gradient(ellipse 92% 58% at 50% 22%, #181626 0%, #121019 52%, transparent 80%),
  radial-gradient(ellipse 100% 70% at 50% 110%, rgba(3, 2, 8, 0.82), transparent 60%),
  linear-gradient(180deg, #100e16 0%, #0d0c13 50%, #0b0a10 100%)
`;

// memo：星空是純裝飾層，props 不變時不需跟著畫面狀態（翻牌等）重渲染。
function Starfield({
  density = 60,
  seed = 1,
  bg = DEFAULT_BG,
  plain = false,
}: {
  density?: number;
  seed?: number;
  bg?: string;
  // plain：純黑金的極簡星點 — 無紫色星、無光暈、整體更淡。用於首頁。
  plain?: boolean;
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
            background: plain
              ? i % 9 === 0
                ? GOLD
                : '#ece6d8'
              : i % 7 === 0
                ? GOLD
                : i % 5 === 0
                  ? LILAC
                  : '#ece6d8',
            opacity: plain ? s.o * 0.55 : s.o,
            boxShadow: !plain && i % 11 === 0 ? `0 0 ${s.r * 4}px ${GOLD}` : 'none',
            animation: `twinkle ${s.d}s ease-in-out ${s.t}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default memo(Starfield);
