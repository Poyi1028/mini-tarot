'use client';

import { motion } from 'framer-motion';
import { TAP, SPRING_TAP } from '@/lib/motion';

interface TextActionProps {
  eyebrow?: string;
  label: string;
  sublabel?: string;
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
}

export default function TextAction({
  eyebrow,
  label,
  sublabel,
  onClick,
  ariaLabel,
  className = '',
}: TextActionProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      whileTap={TAP}
      transition={SPRING_TAP}
      className={`group inline-flex min-h-11 flex-col items-center justify-center gap-2 px-5 py-2 text-center ${className}`}
    >
      {eyebrow && <span className="text-[8px] leading-none text-gold-soft/55">{eyebrow}</span>}
      <span className="font-display text-[10px] tracking-[4px] text-gold">{label}</span>
      {sublabel && (
        <span className="font-serif text-[12px] tracking-[3px] text-gold-soft/75">{sublabel}</span>
      )}
      <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold-soft/50 to-transparent transition-[width,opacity] duration-200 group-active:w-12 group-active:opacity-70" />
    </motion.button>
  );
}
