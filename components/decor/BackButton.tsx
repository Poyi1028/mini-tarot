import { motion } from 'framer-motion';
import { GOLD_BRIGHT } from '@/lib/constants';
import { TAP, SPRING_TAP } from '@/lib/motion';

// The shared ‹ back affordance — a 30×30 gold chevron pinned top-left. Used by
// the deck grid and the deck-card detail view so the two stay identical.
export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="返回"
      whileTap={TAP}
      transition={SPRING_TAP}
      className="absolute left-3.5 top-[50px] z-20 flex h-[30px] w-[30px] items-center justify-center border-none bg-transparent"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={GOLD_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 3 L5 9 L11 15" />
      </svg>
    </motion.button>
  );
}
