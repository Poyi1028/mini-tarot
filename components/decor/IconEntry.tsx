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
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={TAP}
      transition={SPRING_TAP}
      className="flex min-h-[58px] min-w-[54px] flex-col items-center justify-center gap-1.5 rounded-full px-1 py-1 text-lilac/85 transition-[opacity,transform] duration-200 active:opacity-80"
    >
      <span className="flex h-[34px] w-[40px] items-center justify-center">
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
