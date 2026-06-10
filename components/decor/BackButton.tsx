'use client';

import { motion } from 'framer-motion';
import { TAP, SPRING_TAP } from '@/lib/motion';

export default function BackButton({ onClick, top = 52 }: { onClick: () => void; top?: number }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="返回"
      style={{ top }}
      whileTap={TAP}
      transition={SPRING_TAP}
      className="absolute left-3.5 top-[52px] z-20 flex h-11 w-11 items-center justify-center bg-transparent text-gold-soft transition-[color,opacity,transform] duration-200 active:opacity-75"
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
