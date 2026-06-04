'use client';

import { motion } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, LILAC, MUTED, NAVY_BG, PARCHMENT } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import type { Card } from '@/lib/tarot-cards';
import Starfield from './Starfield';
import OrnDivider from './decor/OrnDivider';

// 丙 · 沉浸精修（紫霧）— full-bleed art `screen`-blended over a deep-indigo
// cosmos so a violet-gold aura floats out of the dark, with frosted name/meaning
// strips top and bottom. Tap anywhere to close. Reused by Spread and Deck.
export default function CardDetailImmersive({
  card,
  reversed = false,
  pos,
  onClose,
}: {
  card: Card;
  reversed?: boolean;
  pos?: { cn: string; en: string };
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
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      maskImage: `linear-gradient(${edge === 'top' ? 180 : 0}deg, #000 60%, transparent)`,
      WebkitMaskImage: `linear-gradient(${edge === 'top' ? 180 : 0}deg, #000 60%, transparent)`,
    }) as const;

  return (
    <motion.div
      className="absolute inset-0 z-[100] overflow-hidden"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.base, ease: EASE.out }}
      style={{
        cursor: 'pointer',
        isolation: 'isolate',
        background: NAVY_BG,
      }}
    >
      <Starfield density={22} seed={card.roman.length + 3} bg="transparent" />

      {/* lilac halo — violet mist signature */}
      <div
        className="animate-pulse-soft pointer-events-none absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 300,
          height: 300,
          background:
            'radial-gradient(circle, rgba(188,182,220,0.28), rgba(100,86,180,0.08) 52%, transparent 72%)',
        }}
      />

      {/* roman watermark in lilac */}
      <div
        className="pointer-events-none absolute left-1/2 top-[60px] -translate-x-1/2 whitespace-nowrap font-display"
        style={{ fontSize: 132, lineHeight: 1, color: LILAC, opacity: 0.07 }}
      >
        {card.roman}
      </div>

      {/* full-bleed art — screen blend over indigo makes a violet-gold aura */}
      <img
        src={card.img}
        alt={`${card.cn} ${card.en}`}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{
          mixBlendMode: 'screen',
          opacity: 0.7,
          transform: `scale(1.12) translateY(3%)${reversed ? ' rotate(180deg)' : ''}`,
          maskImage:
            'radial-gradient(ellipse 70% 76% at 50% 51%, #000 34%, rgba(0,0,0,0.5) 64%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 76% at 50% 51%, #000 34%, rgba(0,0,0,0.5) 64%, transparent 90%)',
        }}
      />

      {/* indigo vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 88% 82% at 50% 48%, transparent 42%, rgba(14,12,30,0.78) 100%)',
        }}
      />
      {/* legibility scrims — indigo tinted */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(14,12,30,0.88) 0%, rgba(14,12,30,0) 26%, rgba(14,12,30,0) 52%, rgba(14,12,30,0.96) 100%)',
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
          <div className="font-display" style={{ fontSize: 10, letterSpacing: 5, color: LILAC, textShadow: ts }}>
            {pos.cn}　{pos.en}
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
          {reversed ? '逆 位 · REVERSED' : '正 位 · UPRIGHT'}
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

      {/* inner frame — lilac tinted */}
      <div
        className="pointer-events-none absolute z-[4]"
        style={{ inset: 11, border: '1px solid rgba(188,182,220,0.15)', borderRadius: 32 }}
      />
    </motion.div>
  );
}
