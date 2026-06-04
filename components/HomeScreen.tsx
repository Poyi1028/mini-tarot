'use client';

import { motion } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, LILAC, MUTED, PARCHMENT } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import Starfield from './Starfield';
import Motes from './decor/Motes';
import CrystalIcon from './decor/CrystalIcon';
import OrnDivider from './decor/OrnDivider';

export default function HomeScreen({
  onStart,
  onOpenDeck,
}: {
  onStart: () => void;
  onOpenDeck: () => void;
}) {
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

      {/* header */}
      <div className="absolute left-0 right-0 top-[34px] z-[5] flex items-center justify-between px-7">
        <span className="font-display text-[13px] tracking-[6px]" style={{ color: PARCHMENT }}>
          MINI · TAROT
        </span>
        <div className="flex flex-col gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-px w-[18px]" style={{ background: PARCHMENT, opacity: 0.85 }} />
          ))}
        </div>
      </div>

      {/* lilac back-glow pooled behind the crystal */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 240,
          height: 240,
          background: 'radial-gradient(circle, rgba(188,182,220,0.18), transparent 65%)',
        }}
      />

      {/* line crystal — slow float */}
      <motion.div
        className="animate-floaty relative z-[2]"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DUR.slow, ease: EASE.out }}
      >
        <CrystalIcon size={132} />
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
          Mini-Tarot
        </div>
        <OrnDivider w={50} color={GOLD} style={{ margin: '16px auto 0' }} />
        <div
          className="animate-breath-text mt-[18px] text-[11px] tracking-[6px]"
          style={{ color: MUTED }}
        >
          輕 觸 開 始
        </div>
      </motion.div>

      {/* 牌庫 entry */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onOpenDeck();
        }}
        onKeyDown={(e) => e.stopPropagation()}
        aria-label="開啟牌庫"
        className="absolute bottom-7 left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-1.5 px-4 py-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DUR.base, delay: 0.9, ease: EASE.out }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={GOLD} strokeWidth="1.2">
          {/* two stacked cards */}
          <rect x="6.5" y="4.5" width="9" height="13" rx="1.6" transform="rotate(-9 11 11)" />
          <rect x="6.5" y="4.5" width="9" height="13" rx="1.6" transform="rotate(9 11 11)" />
        </svg>
        <span className="text-[9px] tracking-[3px]" style={{ color: LILAC }}>
          牌 庫
        </span>
      </motion.button>
    </div>
  );
}
