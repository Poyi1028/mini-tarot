'use client';

import { motion } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, GOLD_DIM, PARCHMENT, gold } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import type { DeckCard } from '@/lib/deck-groups';
import Starfield from './Starfield';
import OrnDivider from './decor/OrnDivider';
import BackButton from './decor/BackButton';
import FramedCardImg from './decor/FramedCardImg';
import SuitGlyph from './SuitGlyph';

// Deck-library reading view — distinct from the spread's full-bleed
// CardDetailImmersive. The card sits in the upper-middle as a framed portrait,
// and the page scrolls down through its upright / reversed meanings and the
// historical story. Quiet, study-like, not immersive.

// A prominent, flanked section heading — the structural anchor of each block.
function SectionHeading({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-6" style={{ background: `linear-gradient(to right, transparent, ${accent})` }} />
      <span className="font-serif text-[16px] tracking-[7px]" style={{ color: accent }}>
        {label}
      </span>
      <span className="h-px w-6" style={{ background: `linear-gradient(to left, transparent, ${accent})` }} />
    </div>
  );
}

// A meaning block: the bold heading dominates, then the keywords (a touch larger
// than the prose, in a warm tint), then the prose itself.
function MeaningBlock({
  label,
  accent,
  keywords,
  meaning,
}: {
  label: string;
  accent: string;
  keywords: string[];
  meaning: string;
}) {
  return (
    <div className="mt-10 w-full text-center">
      <SectionHeading label={label} accent={accent} />
      <div className="mt-4 font-serif text-[14px] tracking-[3px]" style={{ color: GOLD_BRIGHT }}>
        {keywords.join(' · ')}
      </div>
      <p
        className="mx-auto mt-3 max-w-[19rem] font-serif text-[13px] font-light leading-[1.95] tracking-[0.5px]"
        style={{ color: 'rgba(236,230,216,0.9)' }}
      >
        {meaning}
      </p>
    </div>
  );
}

export default function DeckCardDetail({ card, onBack }: { card: DeckCard; onBack: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-[100] overflow-y-auto overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.base, ease: EASE.out }}
      style={{
        background:
          'radial-gradient(ellipse 96% 56% at 50% 0%, #18161f 0%, #0e0d15 52%, #09080d 100%)',
      }}
    >
      <Starfield density={20} seed={card.num + 5} bg="transparent" />

      {/* back — same affordance as the deck grid */}
      <BackButton onClick={onBack} />

      <div className="relative z-[2] flex flex-col items-center px-7 pb-16 pt-[88px]">
        {/* Card portrait — upper middle, framed (not full-bleed), wrapped in a
            soft breathing gold aura. */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: DUR.slow, ease: EASE.reveal }}
        >
          {/* Surrounding glow — a single round cloud of gold light behind the
              card (a circular radial blob, not a ring), breathing gently. */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: 400,
              height: 400,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle at center, rgba(238,212,160,0.95) 0%, rgba(228,198,150,0.6) 30%, ${gold(0.28)} 52%, ${gold(0.08)} 70%, transparent 82%)`,
              filter: 'blur(26px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
          <FramedCardImg
            src={card.img}
            alt={`${card.cn} ${card.en}`}
            width={170}
            radius={8}
            borderWidth={1.5}
            ringWidth={3}
            boxShadow={`0 12px 32px rgba(0,0,0,0.55), 0 0 30px ${gold(0.3)}`}
            fadeMs={600}
          />
        </motion.div>

        {/* Name + mark + element */}
        <motion.div
          className="mt-6 flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, delay: 0.18, ease: EASE.out }}
        >
          <div className="mb-2 flex h-5 items-center justify-center" style={{ color: GOLD }}>
            {card.arcana === 'minor' ? (
              <SuitGlyph suit={card.suit} size={18} />
            ) : (
              <span className="font-display text-[15px] leading-none tracking-[1px]">{card.roman}</span>
            )}
          </div>
          <div className="font-serif text-[24px] font-light tracking-[8px]" style={{ color: PARCHMENT }}>
            {card.cn}
          </div>
          <div
            className="mt-1.5 italic"
            style={{ fontFamily: 'var(--font-cormorant)', fontSize: 15, letterSpacing: 2, color: GOLD_BRIGHT }}
          >
            {card.en}
          </div>
        </motion.div>

        <OrnDivider w={44} color={GOLD} style={{ marginTop: 26 }} />

        {/* Upright / reversed meanings */}
        <MeaningBlock label="正 位" accent={GOLD} keywords={card.keywords} meaning={card.meaning} />
        <MeaningBlock label="逆 位" accent={GOLD_DIM} keywords={card.reversedKeywords} meaning={card.reversedMeaning} />

        {/* Card story */}
        <div className="mt-12 w-full text-center">
          <SectionHeading label="牌 面 故 事" accent={GOLD} />
          <p
            className="mx-auto mt-5 max-w-[19rem] text-left font-serif text-[13px] font-light leading-[1.95] tracking-[0.5px]"
            style={{ color: 'rgba(236,230,216,0.9)' }}
          >
            {card.story}
          </p>
        </div>

        <button
          onClick={onBack}
          className="mt-12 font-serif text-[11px] tracking-[5px]"
          style={{ color: GOLD_DIM }}
        >
          ◦ 返 回 牌 庫 ◦
        </button>
      </div>
    </motion.div>
  );
}
