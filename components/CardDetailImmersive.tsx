'use client';

import { motion } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, MUTED, PARCHMENT } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import type { Card } from '@/lib/tarot-cards';
import Starfield from './Starfield';
import OrnDivider from './decor/OrnDivider';

// 丙 · 沉浸精修 — full-bleed art `screen`-blended over a deep, neutral-dark
// ground so a soft gold aura floats out of the black, with frosted name/meaning
// strips top and bottom. Tap anywhere to close. Reused by Spread and Deck.
export default function CardDetailImmersive({
  card,
  reversed = false,
  pos,
  onClose,
}: {
  card: Card;
  reversed?: boolean;
  pos?: { cn: string };
  onClose: () => void;
}) {
  const ts = '0 2px 14px rgba(10,8,28,0.95)';
  const keywords = reversed ? card.reversedKeywords : card.keywords;
  const meaning = reversed ? card.reversedMeaning : card.meaning;

  const frost = (edge: 'top' | 'bottom') =>
    ({
      position: 'absolute',
      left: 0,
      right: 0,
      [edge]: 0,
      zIndex: 3,
      textAlign: 'center',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      maskImage: `linear-gradient(${edge === 'top' ? 180 : 0}deg, #000 60%, transparent)`,
      WebkitMaskImage: `linear-gradient(${edge === 'top' ? 180 : 0}deg, #000 60%, transparent)`,
    }) as const;

  return (
    <motion.div
      className="absolute inset-0 z-[100] overflow-hidden"
      onClick={onClose}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: DUR.slow, ease: EASE.reveal }}
      style={{ cursor: 'pointer', isolation: 'isolate', background: '#0a0a0d' }}
    >
      {/* blurred, scaled copy of the card art — fills the gap left above the
          (down-nudged) card and the frame edges with the card's own colours
          instead of black. Dimmed hard so the `screen`-blended foreground
          below still reads rather than washing out. */}
      <img
        src={card.img}
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ transform: 'scale(1.4)', filter: 'blur(50px) brightness(0.5) saturate(1.1)' }}
      />

      <Starfield density={22} seed={card.roman.length + 3} bg="transparent" />

      {/* roman watermark */}
      <div
        className="pointer-events-none absolute left-1/2 top-[60px] -translate-x-1/2 whitespace-nowrap font-display"
        style={{ fontSize: 132, lineHeight: 1, color: GOLD, opacity: 0.05 }}
      >
        {card.roman}
      </div>

      {/* full-bleed art — screen blend over the dark ground makes a soft gold aura.
          Reversed cards are shown upright here for legibility. */}
      <img
        src={card.img}
        alt={`${card.cn} ${card.en}`}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: 1,
          filter: 'brightness(1.0)',
          // Nudged down so the subject (faces sit upper-middle on most cards)
          // settles toward centre. The Hanged Man — inverted — is the accepted
          // exception the user signed off on.
          transform: 'scale(1.12) translateY(8%)',
          maskImage:
            'radial-gradient(ellipse 70% 76% at 50% 51%, #000 46%, rgba(0,0,0,0.55) 70%, transparent 92%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 76% at 50% 51%, #000 46%, rgba(0,0,0,0.55) 70%, transparent 92%)',
        }}
      />

      {/* legibility scrims — lifted off pure black; the frost strips carry the
          glass feel, these only just darken enough to keep text readable. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(16,16,22,0.66) 0%, rgba(16,16,22,0) 26%, rgba(16,16,22,0) 52%, rgba(16,16,22,0.82) 100%)',
        }}
      />

      {/* top frost strip */}
      <motion.div
        style={{ ...frost('top'), padding: '54px 26px 30px' }}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DUR.base, delay: 0.12, ease: EASE.out }}
      >
        {pos && (
          <div className="font-display" style={{ fontSize: 10, letterSpacing: 5, color: GOLD, textShadow: ts }}>
            {pos.cn}
          </div>
        )}
        <div
          style={{
            marginTop: pos ? 11 : 0,
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 28,
            letterSpacing: 11,
            color: PARCHMENT,
            textShadow: ts,
          }}
        >
          {card.cn}
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontSize: 16,
            letterSpacing: 2,
            color: GOLD_BRIGHT,
            textShadow: ts,
          }}
        >
          {card.en}
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: 'var(--font-serif)',
            fontSize: 10,
            letterSpacing: 4,
            color: reversed ? MUTED : GOLD,
            textShadow: ts,
          }}
        >
          {reversed ? '逆 位' : '正 位'}
        </div>
      </motion.div>

      {/* bottom frost strip */}
      <motion.div
        style={{ ...frost('bottom'), padding: '36px 30px 34px' }}
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DUR.base, delay: 0.18, ease: EASE.out }}
      >
        <OrnDivider w={36} color={GOLD} style={{ marginInline: 'auto' }} />
        <div
          style={{
            marginTop: 13,
            fontFamily: 'var(--font-serif)',
            fontSize: 12.5,
            letterSpacing: 2,
            color: GOLD_BRIGHT,
            textShadow: ts,
          }}
        >
          {keywords.join(' · ')}
        </div>
        <p
          style={{
            margin: '13px auto 0',
            maxWidth: '20rem',
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 13.5,
            lineHeight: 1.95,
            letterSpacing: 0.5,
            color: 'rgba(236,230,216,0.92)',
            textShadow: ts,
          }}
        >
          {meaning}
        </p>
        <div
          style={{
            marginTop: 19,
            fontFamily: 'var(--font-serif)',
            fontSize: 10,
            letterSpacing: 4,
            color: MUTED,
            textShadow: ts,
          }}
        >
          輕 觸 任 意 處 關 閉
        </div>
      </motion.div>
    </motion.div>
  );
}
