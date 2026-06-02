'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOLD, GOLD_DIM, MUTED } from '@/lib/constants';
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

// Quiet astrolabe behind the spread: a single soft central glow plus two
// near-imperceptibly rotating hairline rings (reusing the global sigil-spin
// keyframes). Replaces the old dashed triangle + corner dots, which read cheap
// against the black-and-gold theme. The rings pivot around the view-box center
// (viewBox is symmetric about 0,0), so transform-origin: center is exact.
function SacredTriangleGuide({ visible }: { visible: boolean }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="-180 -180 360 360"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 transition-opacity duration-[1500ms] [transition-delay:600ms]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <defs>
        <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.1" />
          <stop offset="50%" stopColor={GOLD} stopOpacity="0.04" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The spread's single light source */}
      <circle cx="0" cy="-10" r="170" fill="url(#haloGlow)" />

      {/* Outer ring — turns almost imperceptibly, with three faint star-chart
          ticks pointing toward the three card slots */}
      <g
        style={{
          transformBox: 'view-box',
          transformOrigin: 'center',
          animation: 'sigil-spin 60s linear infinite',
        }}
      >
        <circle cx="0" cy="0" r="150" fill="none" stroke={GOLD_DIM} strokeWidth="0.5" opacity="0.35" />
        {SLOTS.map((s, i) => {
          const d = Math.hypot(s.x, s.y) || 1;
          return (
            <circle key={i} cx={(s.x / d) * 150} cy={(s.y / d) * 150} r="1.2" fill={GOLD} opacity="0.5" />
          );
        })}
      </g>

      {/* Inner ring — counter-rotates, even slower */}
      <g
        style={{
          transformBox: 'view-box',
          transformOrigin: 'center',
          animation: 'sigil-spin-r 90s linear infinite',
        }}
      >
        <circle cx="0" cy="0" r="92" fill="none" stroke={GOLD_DIM} strokeWidth="0.4" opacity="0.18" />
      </g>
    </svg>
  );
}

function FlipCard({
  card,
  reversed,
  pos,
  flipped,
  isNext,
  onFlip,
}: {
  card: Card;
  reversed: boolean;
  pos: Position;
  flipped: boolean;
  isNext: boolean;
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
        {/* Gentle pulse on ONLY the next card to flip — guides the eye one step
            at a time. Other unflipped cards rest dark; the central halo carries
            the overall draw. Breathes via opacity (softer, calmer than a
            box-shadow keyframe). */}
        <motion.div
          className="pointer-events-none absolute -inset-2 rounded-xl"
          style={{ boxShadow: '0 0 18px rgba(231,215,166,0.28), inset 0 0 0 1px rgba(231,215,166,0.3)' }}
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
            boxShadow: `0 0 28px rgba(231,215,166,0.32), 0 0 52px rgba(231,215,166,0.16)`,
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

// Pure-typography "stele" reading: each card is a centred inscription — ritual
// mark, position eyebrow, large card name (the hero), hairline with a diamond,
// keywords, then the meaning. No thumbnails: the spread above and the tap-to-open
// CardDetail already carry the imagery. Hierarchy comes from type scale + token
// colours, not stacked opacity.
function ReadingPanel({ drawn, onRestart }: { drawn: DrawnCard[]; onRestart: () => void }) {
  return (
    <div className="pt-3">
      {/* Gold thread falling from the spread into the reading */}
      <div className="mx-auto h-12 w-px bg-gradient-to-b from-transparent via-gold-soft/30 to-gold-soft/60" />
      <div className="mt-6 flex flex-col items-center">
        <div className="font-display text-[11px] tracking-[7px] text-gold">THE READING</div>
        <div className="mt-2.5 font-serif text-[11px] tracking-[6px] text-muted">聖 三 角 的 訊 息</div>
        <div className="mt-5 h-px w-14 bg-gradient-to-r from-transparent via-gold-soft to-transparent" />
      </div>

      {/* Inscriptions — released one after another via the parent stagger */}
      <motion.div
        className="mt-8 flex flex-col gap-12"
        variants={stagger(0.22, 0.15)}
        initial="hidden"
        animate="show"
      >
        {drawn.map(({ card: c, reversed }, i) => (
          <motion.article key={c.num} variants={fadeUp} className="flex flex-col items-center text-center">
            {/* Ritual mark — the major numeral or minor suit glyph, raised above
                the name instead of crammed into a list column */}
            <div className="mb-3 flex h-7 items-center justify-center text-gold-soft">
              {c.arcana === 'minor' ? (
                <SuitGlyph suit={c.suit} size={22} />
              ) : (
                <span className="font-display text-[19px] leading-none tracking-[2px]">{c.roman}</span>
              )}
            </div>
            <div className="font-display text-[10px] tracking-[5px] text-gold">
              {POSITIONS[i].cn}　{POSITIONS[i].en}
            </div>
            <h3 className="mt-3 font-serif text-[26px] font-light leading-none tracking-[8px] text-parchment">
              {c.cn}
            </h3>
            <div className="mt-2 font-display text-[10px] tracking-[3px] text-gold-dim">
              {c.en.toUpperCase()}
            </div>
            {/* 正逆位標記 */}
            <div
              className="mt-2.5 font-serif text-[10px] tracking-[4px]"
              style={{ color: reversed ? GOLD_DIM : GOLD }}
            >
              {reversed ? '逆 位 · REVERSED' : '正 位 · UPRIGHT'}
            </div>
            <div className="mt-5 flex w-full items-center justify-center gap-3">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-soft/40" />
              <span className="text-[7px] leading-none text-gold-soft/70">◆</span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-soft/40" />
            </div>
            <div className="mt-5 font-serif text-[12px] tracking-[3px] text-gold-soft">
              {(reversed ? c.reversedKeywords : c.keywords).join('  ·  ')}
            </div>
            <p className="mt-3.5 max-w-[19rem] text-left font-serif text-[13.5px] leading-[2] tracking-[0.5px] text-parchment/85">
              {reversed ? c.reversedMeaning : c.meaning}
            </p>
          </motion.article>
        ))}
      </motion.div>

      {/* Oracle synthesis — closing whisper, set off by its own hairline */}
      <div className="mt-14 flex flex-col items-center">
        <div className="h-px w-10 bg-gradient-to-r from-transparent via-gold-soft/50 to-transparent" />
        <p className="mt-7 max-w-[18rem] text-center font-serif text-[12.5px] leading-[2.1] tracking-[1.5px] text-muted">
          三張牌已並列為你的聖三角。
          <br />
          讓它們在你心中停留片刻，
          <br />
          真正的訊息會在沉默裡浮現。
        </p>
      </div>

      {/* Ask again — an underline-link rite, not a form button */}
      <div className="mb-2 mt-12 flex justify-center">
        <button
          onClick={onRestart}
          className="group relative inline-flex flex-col items-center gap-2.5 px-6 py-2"
        >
          <span className="text-[8px] leading-none text-gold-soft/70">○</span>
          <span className="font-display text-[11px] tracking-[6px] text-gold">ASK AGAIN</span>
          <span className="font-serif text-[12px] tracking-[5px] text-gold-soft">再 問 一 次</span>
          <span className="mt-1 h-px w-20 bg-gradient-to-r from-transparent via-gold-soft/60 to-transparent" />
        </button>
      </div>
    </div>
  );
}

// Full-screen detail for a revealed card: the artwork fills the whole screen as
// a ghostly, full-bleed backdrop — blended into the starfield (mix-blend lighten
// drops its grey card-stock, leaving only the bright figure/robes/wands) and
// feathered softly on every edge so it dissolves into pure black. The name sits
// at top and the meaning below. Tap anywhere to dismiss.
function CardDetail({
  card,
  reversed,
  pos,
  onClose,
}: {
  card: Card;
  reversed: boolean;
  pos: Position;
  onClose: () => void;
}) {
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
          (~120%, horizontally centred) with a soft radial mask that feathers all
          four edges gently into the surrounding black. */}
      <motion.img
        src={card.img}
        alt={`${card.cn} ${card.en}`}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{
          mixBlendMode: 'lighten',
          maskImage:
            'radial-gradient(ellipse 72% 80% at 50% 56%, #000 38%, rgba(0,0,0,0.6) 64%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 72% 80% at 50% 56%, #000 38%, rgba(0,0,0,0.6) 64%, transparent 90%)',
        }}
        initial={{ scale: 1.32, opacity: 0, x: '0%', y: '7%' }}
        animate={{ scale: 1.15, opacity: 0.9, x: '0%', y: '7%' }}
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
        <div
          className="mt-2 font-serif text-[10px] tracking-[4px]"
          style={{ color: reversed ? GOLD_DIM : GOLD, textShadow }}
        >
          {reversed ? '逆 位 · REVERSED' : '正 位 · UPRIGHT'}
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
          {(reversed ? card.reversedKeywords : card.keywords).join('・')}
        </div>
        <div
          className="mt-3 text-[14px] leading-relaxed tracking-[0.8px] text-white/80"
          style={{ textShadow }}
        >
          {reversed ? card.reversedMeaning : card.meaning}
        </div>
        <div className="mt-6 text-[10px] tracking-[4px] text-muted opacity-80">輕 觸 任 意 處 關 閉</div>
      </motion.div>
    </motion.div>
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
      <div className={`absolute inset-0 ${showReading ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <Starfield density={24} seed={3} />

      <div className="relative z-[2] flex min-h-full flex-col px-6 pb-10 pt-[60px]">
        {/* Question */}
        <motion.div
          className="mt-3 text-center"
          animate={{ opacity: phase === 'merging' ? 0.35 : 1 }}
          transition={{ duration: DUR.slow, delay: 0.4, ease: EASE.out }}
        >
          <div className="mb-3.5 pl-1.5 font-display text-[10px] tracking-[7px] text-gold-soft opacity-70">
            YOUR QUESTION
          </div>
          <div className="px-6 text-[15px] leading-[1.9] tracking-[1.5px] text-parchment opacity-90">
            「{question}」
          </div>
          <div className="mx-auto mt-[22px] h-px w-10 bg-gradient-to-r from-transparent via-gold-dim to-transparent" />
        </motion.div>

        {/* Triangle spread — sized to make the cards the focal point */}
        <div className="relative mt-7 h-[480px] w-full flex-shrink-0">
          {/* Soft altar light + vignette: lifts the centre, sinks the edges into
              black so the three cards read as lit on a dark altar */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-[1500ms]"
            style={{
              opacity: phase === 'spread' ? 1 : 0,
              background:
                'radial-gradient(ellipse 60% 45% at 50% 42%, rgba(231,215,166,0.05), transparent 70%), radial-gradient(ellipse 80% 70% at 50% 45%, transparent 55%, rgba(7,7,7,0.5) 100%)',
            }}
          />
          <SacredTriangleGuide visible={phase === 'spread'} />

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
                  pos={POSITIONS[i]}
                  flipped={flipped[i]}
                  isNext={phase === 'spread' && i === nextIndex}
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
            card={drawn[detail].card}
            reversed={drawn[detail].reversed}
            pos={POSITIONS[detail]}
            onClose={() => setDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
