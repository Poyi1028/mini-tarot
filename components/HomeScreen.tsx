'use client';

import { motion } from 'framer-motion';
import { PURPLE_ACCENT } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import Starfield from './Starfield';
import CrystalBall from './CrystalBall';

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
      <Starfield density={44} seed={3} />

      {/* Purple back-glow pooled behind the crystal */}
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 340,
          height: 340,
          background: `radial-gradient(circle, ${PURPLE_ACCENT} 0%, rgba(42,33,64,0.25) 38%, transparent 70%)`,
        }}
      />

      {/* Crystal — slow float + breathing glow */}
      <motion.div
        className="relative z-[2] mb-12"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DUR.slow, ease: EASE.out }}
      >
        <CrystalBall size={188} />
      </motion.div>

      {/* Title */}
      <motion.div
        className="relative z-[2] text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.base, delay: 0.45, ease: EASE.out }}
      >
        <div className="pl-3 font-display text-[34px] font-medium tracking-[10px] text-gold">
          Mini-Tarot
        </div>
        <div className="mx-auto my-6 h-px w-[60px] bg-gradient-to-r from-transparent via-gold to-transparent" />
      </motion.div>

      {/* Tap-to-start hint */}
      <motion.div
        className="relative z-[2] font-serif text-xs tracking-[6px] text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ opacity: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1 } }}
      >
        輕 觸 開 始
      </motion.div>
    </div>
  );
}
