'use client';

import { motion } from 'framer-motion';
import { gold } from '@/lib/constants';
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
      className="flex min-h-[76px] min-w-[72px] flex-col items-center justify-center gap-2 bg-transparent px-2 py-2 text-lilac/90 transition-[opacity,transform] duration-200 active:opacity-75"
    >
      <span className="flex h-[38px] w-[46px] items-center justify-center">
        <img
          src={icon}
          alt=""
          draggable={false}
          className="h-full w-full object-contain opacity-90"
          style={{ filter: `drop-shadow(0 0 4px ${gold(0.22)})` }}
        />
      </span>
      <span className="whitespace-nowrap text-[12px] tracking-[2px]">{label}</span>
    </motion.button>
  );
}
