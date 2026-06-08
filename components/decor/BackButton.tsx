'use client';

import { motion } from 'framer-motion';
import { TAP, SPRING_TAP } from '@/lib/motion';

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="返回"
      whileTap={TAP}
      transition={SPRING_TAP}
      className="absolute left-3.5 top-[52px] z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gold/15 bg-ink/20 text-gold-soft shadow-[0_4px_18px_rgba(0,0,0,0.22)] backdrop-blur-[6px] transition-[border-color,background,color] duration-200"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M15 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
