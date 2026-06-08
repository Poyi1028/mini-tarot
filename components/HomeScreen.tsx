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
      <Starfield density={24} seed={4} />
      <Motes count={5} seed={6} color={GOLD_BRIGHT} area={{ x: 52, y: 44, w: 40, h: 30 }} />

      {/* lilac back-glow pooled behind the crystal */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 240,
          height: 240,
          background: 'radial-gradient(circle, rgba(150,144,186,0.045), transparent 65%)',
        }}
      />

      {/* crystal ball — slow float */}
      <motion.div
        className="animate-floaty relative z-[2]"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DUR.slow, ease: EASE.out }}
      >
        <CrystalBall size={150} />
      </motion.div>

      {/* title */}
      <motion.div
        className="relative z-[2] mt-[26px] text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.slow, delay: 0.3, ease: EASE.out }}
      >
        <div
          className="italic"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: 2,
            color: PARCHMENT,
          }}
        >
          Mini Tarot
        </div>
        <OrnDivider w={36} color={GOLD} style={{ margin: '14px auto 0' }} />
        <div className="mx-auto mt-7 inline-flex h-11 items-center justify-center rounded-full border border-gold/20 bg-purple-deep/30 px-7 font-display text-[10px] tracking-[3px] text-gold-soft shadow-[0_10px_28px_rgba(0,0,0,0.24)] backdrop-blur-[6px]">
          START READING
        </div>
        <div className="mt-3 text-[10px] tracking-[3px]" style={{ color: MUTED }}>
          點一下開始
        </div>
      </motion.div>
    </div>
  );
}
