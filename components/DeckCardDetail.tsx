'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, GOLD_DIM, PARCHMENT, gold } from '@/lib/constants';
import { EASE, DUR, SPRING_TAP, TAP } from '@/lib/motion';
import type { DeckCard } from '@/lib/deck-groups';
import Starfield from './Starfield';
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
      {/* paddingLeft balances letter-spacing's trailing gap so the glyphs center true */}
      <span className="font-serif text-[16px] tracking-[7px]" style={{ color: accent, paddingLeft: 7 }}>
        {label}
      </span>
      <span className="h-px w-6" style={{ background: `linear-gradient(to left, transparent, ${accent})` }} />
    </div>
  );
}

// A meaning block: the bold heading dominates, then the keywords (a touch larger
// than the prose, in a warm tint), then the prose itself.
function MeaningBlock({
  keywords,
  meaning,
}: {
  keywords: string[];
  meaning: string;
}) {
  return (
    <div className="mt-4 w-full">
      <div
        className="text-center font-serif text-[14px] tracking-[3px]"
        style={{ color: GOLD_BRIGHT, paddingLeft: 3 }}
      >
        {keywords.join(' · ')}
      </div>
      <p
        className="mx-auto mt-1.5 max-w-[19rem] font-serif text-[13px] font-light leading-[1.95] tracking-[0.5px]"
        style={{
          color: 'rgba(236,230,216,0.9)',
          textAlign: 'justify',
          textAlignLast: 'left',
        }}
      >
        {meaning}
      </p>
    </div>
  );
}

export default function DeckCardDetail({
  card,
  onBack,
  onOpenImmersive,
}: {
  card: DeckCard;
  onBack: () => void;
  onOpenImmersive: (reversed: boolean) => void;
}) {
  const [reversed, setReversed] = useState(false);
  const positionLabel = reversed ? '逆 位' : '正 位';
  const keywords = reversed ? card.reversedKeywords : card.keywords;
  const meaning = reversed ? card.reversedMeaning : card.meaning;

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

      <motion.button
        type="button"
        aria-label={`切換為${reversed ? '正位' : '逆位'}`}
        aria-pressed={reversed}
        onClick={() => setReversed((value) => !value)}
        whileTap={TAP}
        transition={SPRING_TAP}
        className="absolute right-4 top-[54px] z-20 flex h-8 items-center rounded-full border border-gold/30 bg-ink/60 p-0.5 font-serif text-[9px] tracking-[1.5px] backdrop-blur-md"
        style={{ boxShadow: `0 4px 18px rgba(0,0,0,0.28), inset 0 0 0 1px ${gold(0.06)}` }}
      >
        <span
          className="flex h-7 min-w-[42px] items-center justify-center rounded-full transition-[color,background-color,box-shadow] duration-300"
          style={{
            color: reversed ? GOLD_DIM : PARCHMENT,
            background: reversed ? 'transparent' : gold(0.16),
            boxShadow: reversed ? 'none' : `inset 0 0 0 1px ${gold(0.22)}`,
          }}
        >
          正 位
        </span>
        <span
          className="flex h-7 min-w-[42px] items-center justify-center rounded-full transition-[color,background-color,box-shadow] duration-300"
          style={{
            color: reversed ? PARCHMENT : GOLD_DIM,
            background: reversed ? gold(0.16) : 'transparent',
            boxShadow: reversed ? `inset 0 0 0 1px ${gold(0.22)}` : 'none',
          }}
        >
          逆 位
        </span>
      </motion.button>

      <div className="relative z-[2] flex flex-col items-center px-7 pb-12 pt-[104px]">
        {/* Card portrait — upper middle and framed, not full-bleed. */}
        <motion.button
          type="button"
          aria-label={`開啟${card.cn}${reversed ? '逆位' : '正位'}沉浸式牌卡詳情`}
          onClick={() => onOpenImmersive(reversed)}
          className="relative"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: DUR.slow, ease: EASE.reveal }}
        >
          <motion.div
            animate={{ rotate: reversed ? 180 : 0 }}
            transition={{ duration: DUR.base, ease: EASE.inOut }}
          >
            <FramedCardImg
              src={card.img}
              alt={`${card.cn} ${card.en} ${reversed ? '逆位' : '正位'}`}
              width={216}
              radius={7}
              borderWidth={1}
              ringWidth={2}
              ringAlpha={0.36}
              boxShadow={`0 14px 34px rgba(0,0,0,0.58), 0 0 0 1px ${gold(0.2)}, 0 0 22px ${gold(0.14)}`}
              fadeMs={600}
            />
          </motion.div>
        </motion.button>

        {/* Name + mark + element */}
        <motion.div
          className="mt-4 flex w-full flex-col items-center text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, delay: 0.18, ease: EASE.out }}
        >
          {card.arcana === 'minor' && (
            <div className="mb-1.5 flex h-5 items-center justify-center" style={{ color: GOLD }}>
              <SuitGlyph suit={card.suit} size={18} />
            </div>
          )}
          <div
            className="font-serif text-[28px] font-light tracking-[8px]"
            style={{ color: PARCHMENT, paddingLeft: 8 }}
          >
            {card.cn}
          </div>
          <div
            className="mt-1 italic"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 17,
              letterSpacing: 2,
              color: GOLD_BRIGHT,
              paddingLeft: 2,
            }}
          >
            {card.en}
          </div>
          <div
            className="mt-3 h-px w-28"
            style={{
              background: `linear-gradient(to right, transparent, ${gold(0.65)}, transparent)`,
            }}
          />
        </motion.div>

        {/* Only the currently selected orientation is shown. */}
        <MeaningBlock keywords={keywords} meaning={meaning} />

        {/* Card story */}
        <div className="mt-6 w-full">
          <SectionHeading label="牌 面 故 事" accent={GOLD} />
          <p
            className="mx-auto mt-2 max-w-[19rem] font-serif text-[13px] font-light leading-[1.95] tracking-[0.5px]"
            style={{
              color: 'rgba(236,230,216,0.9)',
              textAlign: 'justify',
              textAlignLast: 'left',
            }}
          >
            {card.story}
          </p>
        </div>

        <button
          onClick={onBack}
          className="mt-7 font-serif text-[11px] tracking-[5px]"
          style={{ color: GOLD_DIM }}
        >
          ◦ 返 回 牌 庫 ◦
        </button>
      </div>
    </motion.div>
  );
}
