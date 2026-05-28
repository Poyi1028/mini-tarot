'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GOLD, GOLD_SOFT, MUTED } from '@/lib/constants';
import { TAROT_CARDS } from '@/lib/tarot-cards';
import Starfield from './Starfield';
import CardBack from './CardBack';
import CardFront from './CardFront';

const POSITIONS = [
  { key: 'past', cn: '過 去', en: 'PAST', desc: '根源與所來之路' },
  { key: 'present', cn: '現 在', en: 'PRESENT', desc: '此刻的能量' },
  { key: 'future', cn: '未 來', en: 'FUTURE', desc: '正在成形的趨向' },
];

const SLOTS = [
  { x: 0, y: -96 },
  { x: -104, y: 52 },
  { x: 104, y: 52 },
];

async function requestReading(question, drawn) {
  try {
    const res = await fetch('/api/reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, cards: drawn }),
    });
    const data = await res.json();
    return data.reading ?? null;
  } catch {
    return null;
  }
}

function SacredTriangleGuide({ visible }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="-160 -160 320 320"
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
      <circle cx="0" cy="-12" r="120" fill="url(#triGlow)" />
      <path
        d="M 0 -100 L -100 60 L 100 60 Z"
        fill="none"
        stroke={GOLD_SOFT}
        strokeWidth="0.4"
        strokeDasharray="2 4"
        opacity="0.7"
      />
      <circle cx="0" cy="-100" r="3" fill={GOLD} opacity="0.6" />
      <circle cx="-100" cy="60" r="3" fill={GOLD} opacity="0.6" />
      <circle cx="100" cy="60" r="3" fill={GOLD} opacity="0.6" />
    </svg>
  );
}

function FlipCard({ card, pos, flipped, onFlip }) {
  return (
    <div className="relative">
      <div
        className="absolute left-1/2 top-[-22px] -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[4px] transition-colors duration-[600ms]"
        style={{ color: flipped ? GOLD : MUTED }}
      >
        {pos.cn}
      </div>

      <div
        onClick={onFlip}
        className="relative h-[169px] w-[96px]"
        style={{ perspective: 1000, cursor: flipped ? 'default' : 'pointer' }}
      >
        {/* breathing glow */}
        <div
          className={`pointer-events-none absolute -inset-2 rounded-xl transition-opacity duration-700 ${
            flipped ? '' : 'animate-breath-glow'
          }`}
          style={{ opacity: flipped ? 0 : 1 }}
        />

        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 1.1, ease: [0.6, 0.05, 0.2, 1] }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
            <CardBack w={96} h={169} />
          </div>
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <CardFront card={card} w={96} h={169} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ReadingPanel({ drawn, reading, loading, onRestart }) {
  return (
    <div className="pt-3">
      <div className="mx-auto h-9 w-px bg-gradient-to-b from-transparent to-gold-soft" />
      <div className="mt-4 pl-1.5 text-center font-display text-[11px] tracking-[6px] text-gold">
        THE READING
      </div>

      {/* Per-card panels */}
      <div className="mt-5 flex flex-col gap-4">
        {drawn.map((c, i) => (
          <div
            key={c.num}
            className="relative border-[0.5px] border-gold-dim px-4 pb-[18px] pt-4"
            style={{
              background: 'linear-gradient(180deg, rgba(22,21,18,0.5), rgba(7,7,7,0.3))',
            }}
          >
            <div className="absolute -top-2 left-3.5 bg-ink px-2 text-[9px] tracking-[4px] text-gold">
              {POSITIONS[i].cn}　{POSITIONS[i].en}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 text-center font-display text-[22px] tracking-[1px] text-gold opacity-85">
                {c.roman}
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
            <div className="mt-1.5 text-[13px] leading-[1.8] tracking-[0.8px] text-parchment opacity-90">
              {c.meaning}
            </div>
          </div>
        ))}
      </div>

      {/* Oracle synthesis */}
      <div className="mt-7 px-1">
        <div className="mb-3 pl-[5px] text-center font-display text-[10px] tracking-[5px] text-gold">
          ✦  ORACLE  ✦
        </div>
        {loading && (
          <div className="py-5 text-center text-xs tracking-[3px] text-muted">
            星辰正在低語<span className="dotpulse" />
          </div>
        )}
        {!loading && reading && (
          <div className="animate-fade-up whitespace-pre-wrap px-2.5 py-1 text-sm leading-[2] tracking-[1px] text-parchment opacity-0">
            {reading}
          </div>
        )}
        {!loading && !reading && (
          <div className="px-2.5 py-1 text-center text-[13px] leading-[1.9] tracking-[1px] text-muted">
            三張牌已並列為你的聖三角。
            <br />
            讓它們在你心中停留片刻，
            <br />
            真正的訊息會在沉默裡浮現。
          </div>
        )}
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

export default function SpreadScreen({ question, onRestart }) {
  const drawn = useMemo(() => {
    const pool = [...TAROT_CARDS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 3);
  }, []);

  const [phase, setPhase] = useState('merging');
  const [flipped, setFlipped] = useState([false, false, false]);
  const [reading, setReading] = useState(null);
  const [readingLoading, setReadingLoading] = useState(false);
  const [showReading, setShowReading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase('spread'), 1100);
    return () => clearTimeout(t);
  }, []);

  function flipCard(i) {
    if (flipped[i]) return;
    setFlipped((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }

  const allFlipped = flipped.every(Boolean);

  useEffect(() => {
    if (!allFlipped || readingLoading || reading !== null) return;
    setReadingLoading(true);
    requestReading(question, drawn).then((text) => {
      setReading(text);
      setReadingLoading(false);
    });
    setTimeout(() => setShowReading(true), 900);
  }, [allFlipped]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`absolute inset-0 ${showReading ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      <Starfield density={45} seed={3} />

      <div className="relative z-[2] flex min-h-full flex-col px-6 pb-10 pt-[60px]">
        {/* Question */}
        <motion.div
          className="mt-3 text-center"
          animate={{ opacity: phase === 'merging' ? 0 : 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          <div className="mb-2.5 pl-1.5 font-display text-[10px] tracking-[6px] text-gold opacity-85">
            YOUR QUESTION
          </div>
          <div className="px-6 text-sm leading-[1.7] tracking-[1px] text-parchment opacity-90">
            「{question}」
          </div>
          <div className="mx-auto mt-[18px] h-px w-12 bg-gradient-to-r from-transparent via-gold-soft to-transparent" />
        </motion.div>

        {/* Triangle spread */}
        <div className="relative mt-8 h-[290px] w-full flex-shrink-0">
          <SacredTriangleGuide visible={phase === 'spread'} />

          {drawn.map((card, i) => {
            const slot = SLOTS[i];
            const isMerging = phase === 'merging';
            return (
              <motion.div
                key={card.num}
                className="absolute left-1/2 top-1/2 -ml-[48px] -mt-[84px]"
                style={{ zIndex: 10 + i }}
                initial={false}
                animate={{
                  x: isMerging ? 0 : slot.x,
                  y: isMerging ? 60 : slot.y,
                  rotate: isMerging ? (i - 1) * 4 : 0,
                  scale: isMerging ? 0.9 : 1,
                }}
                transition={{
                  duration: 1.1,
                  ease: [0.5, 0.05, 0.2, 1],
                  delay: isMerging ? 0 : i * 0.18,
                }}
              >
                <FlipCard
                  card={card}
                  pos={POSITIONS[i]}
                  flipped={flipped[i]}
                  onFlip={() => flipCard(i)}
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
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{ pointerEvents: showReading ? 'auto' : 'none' }}
        >
          <ReadingPanel
            drawn={drawn}
            reading={reading}
            loading={readingLoading}
            onRestart={onRestart}
          />
        </motion.div>
      </div>
    </div>
  );
}
