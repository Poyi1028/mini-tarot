'use client';

import { memo } from 'react';
import { GOLD, GOLD_BRIGHT, gold } from '@/lib/constants';
import Sunburst from './decor/Sunburst';
import Crescent from './decor/Crescent';
import Sparkle from './decor/Sparkle';

// Violet Mist card back — deep-indigo geometric back: a static gold sunburst +
// crescent at the heart, sparkles in two corners, framed in gold. No rotation
// (per the chosen design). Sizes derive from w/h so it scales across the app.
function CardBack({ w = 84, h = 148, glow = false }: { w?: number; h?: number; glow?: boolean }) {
  const pad = Math.round(w * 0.11);
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.09,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #221f44, #15132c)',
        border: `1px solid ${GOLD}`,
        boxShadow: glow
          ? `0 0 ${w * 0.4}px ${gold(0.6)}, 0 0 ${w * 0.18}px ${gold(0.4)}, inset 0 0 0 ${Math.max(2, w * 0.04)}px ${gold(0.2)}`
          : `0 2px 8px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.45), inset 0 0 0 ${Math.max(2, w * 0.04)}px ${gold(0.14)}`,
      }}
    >
      <Sunburst
        size={w * 0.6}
        color={GOLD}
        sw={0.8}
        rays={18}
        style={{ position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%, -50%)' }}
      />
      <Crescent
        size={w * 0.28}
        color={GOLD_BRIGHT}
        style={{ position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%, -50%)' }}
      />
      <Sparkle size={w * 0.09} color={GOLD} style={{ position: 'absolute', top: pad, left: pad }} />
      <Sparkle
        size={w * 0.09}
        color={GOLD}
        style={{ position: 'absolute', bottom: pad, right: pad }}
      />
    </div>
  );
}

// Props are primitive and constant per card, so memo lets the card backs skip
// reconciliation when the shuffle re-targets card positions every frame.
export default memo(CardBack);
