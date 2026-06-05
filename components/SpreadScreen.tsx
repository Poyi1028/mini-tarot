'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOLD, GOLD_DIM, MUTED } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import { TAROT_CARDS } from '@/lib/tarot-cards';
import type { Card } from '@/lib/tarot-cards';
import CardBack from './CardBack';
import CardFront from './CardFront';
import SuitGlyph from './SuitGlyph';
import CardDetailImmersive from './CardDetailImmersive';
import Starfield from './Starfield';
import BackButton from './decor/BackButton';

interface Position {
  key: string;
  cn: string;
  en: string;
  desc: string;
}

// 一次抽牌的結果：牌本身 + 是否逆位
interface DrawnCard {
  card: Card;
  reversed: boolean;
}

// Hero-card geometry — single source of truth for the spread. Ratio matches
// the 300×527 artwork (≈0.5676). Everything below (slots, container height,
// triangle guide, centering offsets) is derived from these two numbers.
const CARD_W = 124;
const CARD_H = 218;

const POSITIONS: Position[] = [
  { key: 'past', cn: '過 去', en: 'PAST', desc: '根源與所來之路' },
  { key: 'present', cn: '現 在', en: 'PRESENT', desc: '此刻的能量' },
  { key: 'future', cn: '未 來', en: 'FUTURE', desc: '正在成形的趨向' },
];

// Card centers relative to the spread container's center. Spaced so the three
// 124-wide cards clear each other (bottom pair sits outside the top card's
// width, with a vertical gap above) — no overlap.
const SLOTS = [
  { x: 0, y: -100 },
  { x: -130, y: 82 },
  { x: 130, y: 82 },
];

function FlipCard({
  card,
  reversed,
  flipped,
  isNext,
  onFlip,
}: {
  card: Card;
  reversed: boolean;
  flipped: boolean;
  isNext: boolean;
  onFlip: () => void;
}) {
  return (
    <div className="relative">
      <div
        onClick={onFlip}
        className="relative"
        style={{
          width: CARD_W,
          height: CARD_H,
          perspective: 1200,
          cursor: 'pointer',
          borderRadius: CARD_W * 0.08,
          overflow: 'hidden',
        }}
      >
        {/* Base aura — every card emits a faint gold breath at all times, so the
            spread feels softly alive (not just the next/flipped card lit). Kept
            low so three cards together don't blow out; the pulse/hero layers
            stack on top. */}
        <div
          className="pointer-events-none absolute -inset-1 rounded-xl"
          style={{ boxShadow: '0 0 16px rgba(216,189,143,0.15)' }}
        />
        {/* Gentle pulse on ONLY the next card to flip — guides the eye one step
            at a time. Other unflipped cards rest dark; the central halo carries
            the overall draw. Breathes via opacity (softer, calmer than a
            box-shadow keyframe). */}
        <motion.div
          className="pointer-events-none absolute -inset-2 rounded-xl"
          style={{ boxShadow: '0 0 18px rgba(216,189,143,0.28), inset 0 0 0 1px rgba(216,189,143,0.3)' }}
          initial={false}
          animate={{ opacity: !flipped && isNext ? [0.35, 0.7, 0.35] : 0 }}
          transition={
            !flipped && isNext
              ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.7, ease: EASE.out }
          }
        />
        {/* Steady hero glow once revealed — slightly restrained so three lit
            cards don't blow out together. */}
        <div
          className="pointer-events-none absolute -inset-1.5 rounded-xl transition-opacity duration-1000"
          style={{
            opacity: flipped ? 1 : 0,
            boxShadow: `0 0 28px rgba(216,189,143,0.32), 0 0 52px rgba(216,189,143,0.16)`,
          }}
        />

        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d', background: 'transparent', borderRadius: CARD_W * 0.08 }}
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 1.2, ease: EASE.reveal }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', borderRadius: CARD_W * 0.08, overflow: 'hidden' }}>
            <CardBack w={CARD_W} h={CARD_H} />
          </div>
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: CARD_W * 0.08, overflow: 'hidden' }}
          >
            <CardFront card={card} w={CARD_W} h={CARD_H} reversed={reversed} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Closing rite — stripped to its essence: a gold thread leading down from the
// spread into the single return-home rite. All closing reading text has been
// removed for a quieter, more minimal screen.
function ReadingPanel({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="pt-1">
      {/* Gold thread falling from the spread into the close */}
      <div className="mx-auto h-7 w-px bg-gradient-to-b from-transparent via-gold-soft/30 to-gold-soft/60" />

      {/* Return home — an underline-link rite, not a form button */}
      <div className="mb-1 mt-5 flex justify-center">
        <button
          onClick={onRestart}
          className="group relative inline-flex flex-col items-center gap-2.5 px-6 py-2"
        >
          <span className="text-[8px] leading-none text-gold-soft/70">○</span>
          <span className="font-display text-[11px] tracking-[6px] text-gold">RETURN HOME</span>
          <span className="font-serif text-[12px] tracking-[5px] text-gold-soft">返 回 首 頁</span>
          <span className="mt-1 h-px w-20 bg-gradient-to-r from-transparent via-gold-soft/60 to-transparent" />
        </button>
      </div>
    </div>
  );
}

export default function SpreadScreen({ question, onRestart }: { question: string; onRestart: () => void }) {
  const drawn = useMemo<DrawnCard[]>(() => {
    const pool = [...TAROT_CARDS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    // 每張牌各有 50% 機率逆位
    return pool.slice(0, 3).map((card) => ({ card, reversed: Math.random() < 0.5 }));
  }, []);

  const [phase, setPhase] = useState<'merging' | 'spread'>('merging');
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);
  const [showReading, setShowReading] = useState(false);
  const [detail, setDetail] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase('spread'), 1400);
    return () => clearTimeout(t);
  }, []);

  function flipCard(i: number) {
    if (flipped[i]) return;
    setFlipped((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }

  const allFlipped = flipped.every(Boolean);
  // The one unflipped card the eye should go to next (-1 once all are flipped).
  const nextIndex = flipped.findIndex((f) => !f);

  useEffect(() => {
    if (!allFlipped) return;
    const t = setTimeout(() => setShowReading(true), 1200);
    return () => clearTimeout(t);
  }, [allFlipped]);

  return (
    <div className="absolute inset-0">
      <Starfield density={26} seed={13} />

      {/* 返回首頁 —— 左上角 ‹，與牌庫一致；隨時可離開牌陣。 */}
      <BackButton onClick={onRestart} />

      <div className={`absolute inset-0 ${showReading ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      <div className="relative z-[2] flex min-h-full flex-col px-6 pb-6 pt-[52px]">
        {/* The question, quietly restated above the spread — no "YOUR QUESTION"
            label, just the words themselves. */}
        <motion.div
          className="text-center"
          animate={{ opacity: phase === 'merging' ? 0.35 : 0.9 }}
          transition={{ duration: DUR.slow, delay: 0.4, ease: EASE.out }}
        >
          <div className="px-6 font-serif text-[14px] leading-[1.8] tracking-[1.5px] text-parchment">
            「{question}」
          </div>
        </motion.div>

        {/* Triangle spread — the cards are the focal point; closing reading text
            has been stripped for a quieter, more minimal screen. */}
        <div className="relative mt-4 h-[520px] w-full flex-shrink-0">
          {/* 背景三角法陣 — connects the three card centres into the 聖三角 sigil,
              with enclosing circles. Behind the cards (z-0); breathes gently. */}
          <motion.svg
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
            width={380}
            height={380}
            viewBox="-190 -190 380 380"
            style={{ overflow: 'visible' }}
            initial={false}
            animate={{ opacity: phase === 'spread' ? [0.5, 0.8, 0.5] : 0.22 }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx={0} cy={21} r={162} fill="none" stroke={GOLD} strokeWidth={0.6} opacity={0.22} />
            <circle cx={0} cy={21} r={150} fill="none" stroke={GOLD} strokeWidth={0.4} opacity={0.14} />
            <path
              d="M 0 -100 L -130 82 L 130 82 Z"
              fill={GOLD}
              fillOpacity={0.03}
              stroke={GOLD}
              strokeWidth={0.9}
              strokeOpacity={0.42}
              strokeLinejoin="round"
            />
            <circle cx={0} cy={-100} r={7} fill="none" stroke={GOLD} strokeWidth={0.6} opacity={0.5} />
            <circle cx={-130} cy={82} r={7} fill="none" stroke={GOLD} strokeWidth={0.6} opacity={0.5} />
            <circle cx={130} cy={82} r={7} fill="none" stroke={GOLD} strokeWidth={0.6} opacity={0.5} />
            <circle cx={0} cy={21} r={3} fill={GOLD} opacity={0.4} />
          </motion.svg>

          {/* Fixed position labels — pinned to each slot, NOT riding the cards. */}
          {POSITIONS.map((p, i) => {
            const slot = SLOTS[i];
            return (
              <div
                key={p.key}
                className="pointer-events-none absolute left-1/2 top-1/2 z-[6] whitespace-nowrap text-center transition-opacity duration-[800ms]"
                style={{
                  transform: `translate(calc(-50% + ${slot.x}px), calc(-50% + ${slot.y - CARD_H / 2 - 26}px))`,
                  opacity: phase === 'spread' ? 1 : 0,
                }}
              >
                <div
                  className="font-serif text-[11px] font-light tracking-[5px] transition-colors duration-[600ms]"
                  style={{ color: flipped[i] ? GOLD : MUTED }}
                >
                  {p.cn}
                </div>
              </div>
            );
          })}

          {drawn.map(({ card, reversed }, i) => {
            const slot = SLOTS[i];
            const isMerging = phase === 'merging';
            return (
              <motion.div
                key={card.num}
                className="absolute left-1/2 top-1/2"
                style={{ zIndex: 10 + i, marginLeft: -CARD_W / 2, marginTop: -CARD_H / 2 }}
                initial={false}
                animate={{
                  x: isMerging ? 0 : slot.x,
                  y: isMerging ? 70 : slot.y,
                  rotate: isMerging ? (i - 1) * 4 : 0,
                  scale: isMerging ? 0.82 : 1,
                }}
                transition={{
                  duration: 1.3,
                  ease: EASE.reveal,
                  delay: isMerging ? 0 : i * 0.22,
                }}
              >
                <FlipCard
                  card={card}
                  reversed={reversed}
                  flipped={flipped[i]}
                  isNext={phase === 'spread' && i === nextIndex}
                  onFlip={() => (flipped[i] ? setDetail(i) : flipCard(i))}
                />
              </motion.div>
            );
          })}

          {/* Card names — surface beneath each card once it's flipped, with its
              ritual mark and 正/逆位. Pinned to the slot, like the labels above. */}
          {drawn.map(({ card: c, reversed }, i) => {
            const slot = SLOTS[i];
            return (
              <div
                key={`name-${c.num}`}
                className="pointer-events-none absolute left-1/2 top-1/2 z-[6] flex flex-col items-center whitespace-nowrap text-center transition-all duration-[800ms]"
                style={{
                  transform: `translate(calc(-50% + ${slot.x}px), calc(-50% + ${
                    slot.y + CARD_H / 2 + (flipped[i] ? 36 : 46)
                  }px))`,
                  opacity: flipped[i] ? 1 : 0,
                }}
              >
                <div className="mb-1.5 flex h-5 items-center justify-center text-gold-soft">
                  {c.arcana === 'minor' ? (
                    <SuitGlyph suit={c.suit} size={16} />
                  ) : (
                    <span className="font-display text-[14px] leading-none tracking-[1px]">{c.roman}</span>
                  )}
                </div>
                <div className="font-serif text-[16px] font-light leading-none tracking-[4px] text-parchment">
                  {c.cn}
                </div>
                <div
                  className="mt-1.5 font-serif text-[9px] tracking-[3px]"
                  style={{ color: reversed ? GOLD_DIM : GOLD }}
                >
                  {reversed ? '逆 位' : '正 位'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Flip hint */}
        <div
          className="mt-1 min-h-[34px] text-center text-xs leading-[2] tracking-[4px] text-muted transition-opacity duration-[600ms]"
          style={{ opacity: phase === 'spread' && !allFlipped ? 1 : 0 }}
        >
          逐一輕觸卡牌
          <br />
          讓訊息向你揭示
        </div>

        {/* Reading */}
        <motion.div
          initial={false}
          animate={{
            opacity: showReading ? 1 : 0,
            y: showReading ? 0 : 20,
            marginTop: allFlipped ? 8 : 0,
          }}
          transition={{ duration: DUR.slow, ease: EASE.out }}
          style={{ pointerEvents: showReading ? 'auto' : 'none' }}
        >
          <ReadingPanel onRestart={onRestart} />
        </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {detail !== null && (
          <CardDetailImmersive
            card={drawn[detail].card}
            reversed={drawn[detail].reversed}
            pos={{ cn: POSITIONS[detail].cn, en: POSITIONS[detail].en }}
            onClose={() => setDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
