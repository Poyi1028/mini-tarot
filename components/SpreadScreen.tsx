'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOLD, GOLD_SOFT, MUTED } from '@/lib/constants';
import { EASE, DUR, fadeUp, stagger } from '@/lib/motion';
import { TAROT_CARDS } from '@/lib/tarot-cards';
import type { Card } from '@/lib/tarot-cards';
import Starfield from './Starfield';
import CardBack from './CardBack';
import CardFront from './CardFront';
import SuitGlyph from './SuitGlyph';

interface Position {
  key: string;
  cn: string;
  en: string;
  desc: string;
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

function SacredTriangleGuide({ visible }: { visible: boolean }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="-180 -180 360 360"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 transition-opacity duration-[1500ms] [transition-delay:600ms]"
      style={{ opacity: visible ? 0.5 : 0 }}
    >
      <defs>
        <radialGradient id="triGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="0" cy="-10" r="150" fill="url(#triGlow)" />
      <path
        d={`M 0 ${SLOTS[0].y} L ${SLOTS[1].x} ${SLOTS[1].y} L ${SLOTS[2].x} ${SLOTS[2].y} Z`}
        fill="none"
        stroke={GOLD_SOFT}
        strokeWidth="0.4"
        strokeDasharray="2 4"
        opacity="0.7"
      />
      {SLOTS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="3" fill={GOLD} opacity="0.6" />
      ))}
    </svg>
  );
}

function FlipCard({
  card,
  pos,
  flipped,
  onFlip,
}: {
  card: Card;
  pos: Position;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div className="relative">
      <div
        className="absolute left-1/2 top-[-24px] -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[5px] transition-colors duration-[600ms]"
        style={{ color: flipped ? GOLD : MUTED }}
      >
        {pos.cn}
      </div>

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
        {/* breathing glow before reveal */}
        <div
          className={`pointer-events-none absolute -inset-2 rounded-xl transition-opacity duration-700 ${
            flipped ? '' : 'animate-breath-glow'
          }`}
          style={{ opacity: flipped ? 0 : 1 }}
        />
        {/* steady hero glow once revealed */}
        <div
          className="pointer-events-none absolute -inset-1.5 rounded-xl transition-opacity duration-1000"
          style={{
            opacity: flipped ? 1 : 0,
            boxShadow: `0 0 34px rgba(201,169,78,0.4), 0 0 60px rgba(201,169,78,0.18)`,
          }}
        />

        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d', background: 'transparent', borderRadius: CARD_W * 0.08 }}
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: DUR.slow, ease: EASE.reveal }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', borderRadius: CARD_W * 0.08, overflow: 'hidden' }}>
            <CardBack w={CARD_W} h={CARD_H} />
          </div>
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: CARD_W * 0.08, overflow: 'hidden' }}
          >
            <CardFront card={card} w={CARD_W} h={CARD_H} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ReadingPanel({ drawn, onRestart }: { drawn: Card[]; onRestart: () => void }) {
  return (
    <div className="pt-3">
      <div className="mx-auto h-9 w-px bg-gradient-to-b from-transparent to-gold-soft" />
      <div className="mt-4 pl-1.5 text-center font-display text-[11px] tracking-[6px] text-gold">
        THE READING
      </div>

      {/* Per-card panels — released one after another via the parent stagger */}
      <motion.div
        className="mt-5 flex flex-col gap-4"
        variants={stagger(0.16, 0.1)}
        initial="hidden"
        animate="show"
      >
        {drawn.map((c, i) => (
          <motion.div
            key={c.num}
            variants={fadeUp}
            className="relative px-5 pb-[22px] pt-[18px]"
          >
            <div className="absolute -top-2 left-3.5 bg-ink px-2 text-[9px] tracking-[4px] text-gold">
              {POSITIONS[i].cn}　{POSITIONS[i].en}
            </div>
            <div className="flex items-center gap-3.5">
              <div className="flex w-9 justify-center text-gold opacity-85">
                {c.arcana === 'minor' ? (
                  <SuitGlyph suit={c.suit} />
                ) : (
                  <span className="font-display text-[22px] tracking-[1px]">{c.roman}</span>
                )}
              </div>
              <div>
                <div className="text-[15px] tracking-[2px] text-parchment">{c.cn}</div>
                <div className="mt-0.5 text-[9px] tracking-[2px] text-gold-soft opacity-75">
                  {c.en.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="mt-2.5 text-xs leading-[1.7] tracking-[1px] text-parchment opacity-70">
              {c.keywords.join('・')}
            </div>
            <div className="mt-2.5 text-[13px] leading-[1.9] tracking-[0.8px] text-parchment opacity-90">
              {c.meaning}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Oracle synthesis */}
      <div className="mt-7 px-1">
        <div className="px-2.5 py-1 text-center text-[13px] leading-[1.9] tracking-[1px] text-muted">
          三張牌已並列為你的聖三角。
          <br />
          讓它們在你心中停留片刻，
          <br />
          真正的訊息會在沉默裡浮現。
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mx-auto mb-2 mt-[38px] block rounded-sm border border-gold-soft bg-transparent py-3 pl-[34px] pr-7 font-serif text-xs tracking-[6px] text-gold"
      >
        再 問 一 次
      </button>
    </div>
  );
}

// Full-screen detail for a revealed card: the artwork fills the whole screen as
// a ghostly, full-bleed backdrop — blended into the starfield (mix-blend lighten
// drops its grey card-stock, leaving only the bright figure/robes/wands) and
// feathered softly on every edge so it dissolves into pure black. The name sits
// at top and the meaning below. Tap anywhere to dismiss.
function CardDetail({ card, pos, onClose }: { card: Card; pos: Position; onClose: () => void }) {
  const textShadow = '0 2px 10px rgba(0,0,0,0.8)';
  return (
    <motion.div
      className="absolute inset-0 z-[100] overflow-hidden bg-ink"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.base, ease: EASE.out }}
      style={{ isolation: 'isolate' }}
    >
      <Starfield density={26} seed={7} />

      {/* Full-bleed hero artwork. `mix-blend-mode: lighten` makes the grey card
          stock vanish into the dark starfield, leaving the luminous figure to
          float over the cosmos. Held at low opacity and scaled past full-bleed
          (~120%, nudged right) with a soft radial mask that feathers all four
          edges gently into the surrounding black. */}
      <motion.img
        src={card.img}
        alt={`${card.cn} ${card.en}`}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{
          mixBlendMode: 'lighten',
          maskImage:
            'radial-gradient(ellipse 72% 80% at 58% 56%, #000 38%, rgba(0,0,0,0.6) 64%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 72% 80% at 58% 56%, #000 38%, rgba(0,0,0,0.6) 64%, transparent 90%)',
        }}
        initial={{ scale: 1.32, opacity: 0, x: '6%', y: '7%' }}
        animate={{ scale: 1.15, opacity: 0.9, x: '6%', y: '7%' }}
        transition={{ duration: 1.1, ease: EASE.reveal }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,7,7,0.45) 0%, rgba(7,7,7,0) 30%, rgba(7,7,7,0) 55%, rgba(7,7,7,0.85) 100%)',
        }}
      />

      {/* Name */}
      <motion.div
        className="absolute inset-x-0 top-0 px-7 pb-7 pt-[60px] text-center"
        style={{
          backdropFilter: 'blur(7px)',
          WebkitBackdropFilter: 'blur(7px)',
          maskImage: 'linear-gradient(180deg, #000 70%, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, #000 70%, transparent)',
        }}
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DUR.base, delay: 0.12, ease: EASE.out }}
      >
        <div className="font-display text-[10px] tracking-[5px] text-gold opacity-85">
          {pos.cn}　{pos.en}
        </div>
        <div
          className="mt-2.5 font-serif text-[27px] font-light tracking-[11px] text-parchment"
          style={{ textShadow }}
        >
          {card.cn}
        </div>
        <div className="mt-1.5 font-display text-[11px] tracking-[3px] text-gold-soft opacity-80">
          {card.en.toUpperCase()}
        </div>
      </motion.div>

      {/* Meaning */}
      <motion.div
        className="absolute inset-x-0 bottom-0 px-8 pb-[46px] pt-9 text-center"
        style={{
          backdropFilter: 'blur(9px)',
          WebkitBackdropFilter: 'blur(9px)',
          maskImage: 'linear-gradient(0deg, #000 72%, transparent)',
          WebkitMaskImage: 'linear-gradient(0deg, #000 72%, transparent)',
        }}
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DUR.base, delay: 0.18, ease: EASE.out }}
      >
        <div className="mx-auto mb-3.5 h-px w-10 bg-gradient-to-r from-transparent via-gold-soft to-transparent" />
        <div className="text-xs tracking-[2px] text-gold-soft opacity-85" style={{ textShadow }}>
          {card.keywords.join('・')}
        </div>
        <div
          className="mt-3 text-[14px] leading-relaxed tracking-[0.8px] text-white/80"
          style={{ textShadow }}
        >
          {card.meaning}
        </div>
        <div className="mt-6 text-[10px] tracking-[4px] text-muted opacity-80">輕 觸 任 意 處 關 閉</div>
      </motion.div>
    </motion.div>
  );
}

export default function SpreadScreen({ question, onRestart }: { question: string; onRestart: () => void }) {
  const drawn = useMemo(() => {
    const pool = [...TAROT_CARDS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 3);
  }, []);

  const [phase, setPhase] = useState<'merging' | 'spread'>('merging');
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);
  const [showReading, setShowReading] = useState(false);
  const [detail, setDetail] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase('spread'), 1100);
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

  useEffect(() => {
    if (!allFlipped) return;
    const t = setTimeout(() => setShowReading(true), 900);
    return () => clearTimeout(t);
  }, [allFlipped]);

  return (
    <div className="absolute inset-0">
      <div className={`absolute inset-0 ${showReading ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <Starfield density={24} seed={3} />

      <div className="relative z-[2] flex min-h-full flex-col px-6 pb-10 pt-[60px]">
        {/* Question */}
        <motion.div
          className="mt-3 text-center"
          animate={{ opacity: phase === 'merging' ? 0 : 1 }}
          transition={{ duration: DUR.slow, delay: 0.4, ease: EASE.out }}
        >
          <div className="mb-2.5 pl-1.5 font-display text-[10px] tracking-[6px] text-gold opacity-85">
            YOUR QUESTION
          </div>
          <div className="px-6 text-sm leading-[1.7] tracking-[1px] text-parchment opacity-90">
            「{question}」
          </div>
          <div className="mx-auto mt-[18px] h-px w-12 bg-gradient-to-r from-transparent via-gold-soft to-transparent" />
        </motion.div>

        {/* Triangle spread — sized to make the cards the focal point */}
        <div className="relative mt-7 h-[480px] w-full flex-shrink-0">
          <SacredTriangleGuide visible={phase === 'spread'} />

          {drawn.map((card, i) => {
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
                  duration: DUR.slow,
                  ease: EASE.reveal,
                  delay: isMerging ? 0 : i * 0.16,
                }}
              >
                <FlipCard
                  card={card}
                  pos={POSITIONS[i]}
                  flipped={flipped[i]}
                  onFlip={() => (flipped[i] ? setDetail(i) : flipCard(i))}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Flip hint */}
        <div
          className="mt-2 min-h-[48px] text-center text-xs leading-[2] tracking-[4px] text-muted transition-opacity duration-[600ms]"
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
          <ReadingPanel drawn={drawn} onRestart={onRestart} />
        </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {detail !== null && (
          <CardDetail
            card={drawn[detail]}
            pos={POSITIONS[detail]}
            onClose={() => setDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
