'use client';

import { motion } from 'framer-motion';
import { GOLD, MUTED, PARCHMENT, gold } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import NightSky from './decor/NightSky';
import CrystalBall from './CrystalBall';

// 首頁專屬底色：純黑金、無紫色調，只在頂端留一抹極淡暖光。
const HOME_BG = `
  radial-gradient(ellipse 80% 55% at 50% 0%, ${gold(0.025)}, transparent 70%),
  linear-gradient(180deg, #0c0b11 0%, #0a0910 55%, #08070d 100%)
`;

export default function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="進入占卜"
      onClick={onStart}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onStart();
        }
      }}
      className="absolute inset-0 flex cursor-pointer flex-col items-center px-8 pb-[12vh] pt-[14vh] outline-none"
      style={{ background: HOME_BG }}
    >
      <NightSky />

      {/* crystal ball — occupies the upper space */}
      <motion.div
        className="relative z-[2] flex flex-1 items-center justify-center"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DUR.slow, ease: EASE.out }}
      >
        <CrystalBall size={150} />
      </motion.div>

      {/* title — anchored toward the bottom */}
      <motion.div
        className="relative z-[2] text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.slow, delay: 0.3, ease: EASE.out }}
      >
        <div
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.28,
            letterSpacing: 7,
            paddingLeft: 7,
            textTransform: 'uppercase',
            color: PARCHMENT,
          }}
        >
          Mini
          <br />
          Tarot
        </div>

        {/* plain hairline rule — minimal, in the reference's spirit */}
        <span
          className="mx-auto mt-6 block h-px w-14"
          style={{
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
            opacity: 0.55,
          }}
        />

        <div className="mt-5 text-[10px] tracking-[4px]" style={{ color: MUTED }}>
          點一下開始
        </div>
      </motion.div>
    </div>
  );
}
