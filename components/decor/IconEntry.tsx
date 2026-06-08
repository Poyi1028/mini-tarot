'use client';

import { motion } from 'framer-motion';
import { TAP, SPRING_TAP } from '@/lib/motion';

interface IconEntryProps {
  icon: string;
  label: string;
  ariaLabel: string;
  onClick: () => void;
}

export default function IconEntry({ icon, label, ariaLabel, onClick }: IconEntryProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={TAP}
      transition={SPRING_TAP}
      className="flex min-h-[60px] min-w-[58px] flex-col items-center justify-center gap-1.5 rounded-[18px] border border-gold/15 bg-purple-deep/35 px-2 py-1 text-lilac/90 shadow-[0_8px_22px_rgba(0,0,0,0.22)] backdrop-blur-[6px] transition-[border-color,background,opacity,transform] duration-200 active:border-gold/25 active:bg-purple-deep/50 active:opacity-85"
    >
      <span className="flex h-[30px] w-[36px] items-center justify-center">
        <img
          src={icon}
          alt=""
          draggable={false}
          className="h-full w-full object-contain opacity-90"
          style={{ filter: 'drop-shadow(0 0 4px rgba(216,189,143,0.22))' }}
        />
      </span>
      <span className="whitespace-nowrap text-[10px] tracking-[2px]">{label}</span>
    </motion.button>
  );
}
