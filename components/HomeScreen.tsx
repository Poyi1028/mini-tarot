'use client';

import { motion } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, MUTED, PARCHMENT } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import Starfield from './Starfield';
import Motes from './decor/Motes';
import CrystalBall from './CrystalBall';
import OrnDivider from './decor/OrnDivider';

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
      className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center px-8 outline-none"
    >
      <Starfield density={40} seed={4} />
      <Motes count={10} seed={6} color={GOLD_BRIGHT} area={{ x: 50, y: 44, w: 46, h: 36 }} />

      {/* lilac back-glow pooled behind the crystal */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 240,
          height: 240,
          background: 'radial-gradient(circle, rgba(150,144,186,0.08), transparent 65%)',
        }}
      />

      {/* crystal ball — slow float */}
      <motion.div
        className="animate-floaty relative z-[2]"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DUR.slow, ease: EASE.out }}
      >
        <CrystalBall size={170} />
      </motion.div>

      {/* title */}
      <motion.div
        className="relative z-[2] mt-[30px] text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.slow, delay: 0.3, ease: EASE.out }}
      >
        <div
          className="italic"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 40,
            fontWeight: 500,
            letterSpacing: 4,
            color: PARCHMENT,
          }}
        >
          Mini Tarot
        </div>
        <OrnDivider w={50} color={GOLD} style={{ margin: '16px auto 0' }} />
        <div
          className="animate-breath-text mt-[18px] text-[11px] tracking-[6px]"
          style={{ color: MUTED }}
        >
          輕 觸 開 始
        </div>
      </motion.div>
    </div>
  );
}
