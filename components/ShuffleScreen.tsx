'use client';

import { useState, useRef, useEffect } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import { GOLD_SOFT } from '@/lib/constants';
import { EASE, SPRING_SHUFFLE } from '@/lib/motion';
import Starfield from './Starfield';
import CardBack from './CardBack';

const N_DECK = 78;
const SHUFFLE_TARGET = 1800;
// Half-extent of the "table" the cards are washed across.
const TABLE_X = 148;
const TABLE_Y = 76;

interface DeckCard {
  id: number;
  x: number;
  y: number;
  r: number;
  zi: number;
  pile: number;
}

type Phase = 'shuffle' | 'settling' | 'piles' | 'merging';

// Depth by vertical position — cards nearer the bottom sit on top, like a real
// face-down spread on a table (avoids z-index flicker while smearing).
function depthFor(y: number) {
  const t = (y + TABLE_Y) / (2 * TABLE_Y);
  return Math.round(Math.max(0, Math.min(1, t)) * (N_DECK - 1));
}

function HandSwipeHint() {
  return (
    <div className="flex items-center gap-2.5 text-[11px] tracking-[3px] text-muted">
      <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
        <path
          d="M2 7 H22 M2 7 L6 3 M2 7 L6 11 M22 7 L18 3 M22 7 L18 11"
          stroke={GOLD_SOFT}
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.7"
        >
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
      <span>左 右 塗 抹</span>
    </div>
  );
}

export default function ShuffleScreen({ onComplete }: { onComplete: (pile: number) => void }) {
  const [cards, setCards] = useState<DeckCard[]>(() =>
    Array.from({ length: N_DECK }, (_, i) => {
      const y = (Math.random() - 0.5) * 2 * TABLE_Y * 0.85;
      return {
        id: i,
        // Start already spread face-down across the table.
        x: (Math.random() - 0.5) * 2 * TABLE_X * 0.85,
        y,
        r: (Math.random() - 0.5) * 46,
        zi: depthFor(y),
        pile: 0,
      };
    })
  );
  const [phase, setPhase] = useState<Phase>('shuffle');
  const [progress, setProgress] = useState(0);
  const [hoverPile, setHoverPile] = useState<number | null>(null);
  const dragRef = useRef({ on: false, lx: 0, ly: 0, dist: 0, last: 0, adx: 0, ady: 0 });
  const idleRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => clearTimeout(idleRef.current), []);

  useEffect(() => {
    if (phase !== 'shuffle' || progress < 1) return;
    setPhase('settling');
    clearTimeout(idleRef.current);
    setTimeout(() => {
      setCards((prev) =>
        prev.map((c, i) => ({
          ...c,
          pile: i % 3,
          x: ((i % 3) - 1) * 88 + (Math.random() - 0.5) * 4,
          y: Math.floor(i / 3) * 0.4 + (Math.random() - 0.5) * 3,
          r: (Math.random() - 0.5) * 4,
          zi: i,
        }))
      );
      setTimeout(() => setPhase('piles'), 900);
    }, 600);
  }, [progress, phase]);

  // Scatter: each card gets its own outward impulse (a random direction plus a
  // little of the fingertip's travel), so the deck bursts apart and fills the
  // whole table instead of drifting as one clump. Energy from the swipe speed
  // makes a fast wash fling them wider. Cards reaching an edge are reflected
  // back into the field so the spread stays full.
  function scatter(dx: number, dy: number, speed: number) {
    const push = 14 + Math.min(60, speed * 0.5);
    setCards((prev) =>
      prev.map((c, i) => {
        const ang = Math.random() * Math.PI * 2;
        const mag = push * (0.6 + (i % 5) * 0.12);
        let nx = c.x + Math.cos(ang) * mag + dx * 0.22;
        let ny = c.y + Math.sin(ang) * mag * 0.6 + dy * 0.14;
        if (nx > TABLE_X) nx = TABLE_X - Math.random() * 64;
        else if (nx < -TABLE_X) nx = -TABLE_X + Math.random() * 64;
        if (ny > TABLE_Y) ny = TABLE_Y - Math.random() * 40;
        else if (ny < -TABLE_Y) ny = -TABLE_Y + Math.random() * 40;
        const r = c.r + (Math.random() - 0.5) * 44;
        return {
          ...c,
          x: nx,
          y: ny,
          r: Math.max(-60, Math.min(60, r)),
          zi: depthFor(ny),
        };
      })
    );
  }

  // Gather: when the fingertip rests, ease every card back into a loose pile
  // near the center — the "聚攏" half of the scatter-then-gather rhythm.
  function gather() {
    if (phase !== 'shuffle') return;
    setCards((prev) =>
      prev.map((c, i) => ({
        ...c,
        x: (Math.random() - 0.5) * 46,
        y: (Math.random() - 0.5) * 30,
        r: (Math.random() - 0.5) * 22,
        zi: i,
      }))
    );
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (phase !== 'shuffle') return;
    e.preventDefault();
    dragRef.current.on = true;
    dragRef.current.lx = e.clientX;
    dragRef.current.ly = e.clientY;
    surfaceRef.current?.setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current.on || phase !== 'shuffle') return;
    const dx = e.clientX - dragRef.current.lx;
    const dy = e.clientY - dragRef.current.ly;
    const d = Math.hypot(dx, dy);
    if (d < 1) return;
    dragRef.current.lx = e.clientX;
    dragRef.current.ly = e.clientY;
    dragRef.current.dist += d;
    dragRef.current.adx += dx;
    dragRef.current.ady += dy;
    const now = performance.now();
    setProgress(Math.min(1, dragRef.current.dist / SHUFFLE_TARGET));
    if (now - dragRef.current.last > 30) {
      const adx = dragRef.current.adx;
      const ady = dragRef.current.ady;
      dragRef.current.last = now;
      scatter(adx, ady, Math.hypot(adx, ady));
      dragRef.current.adx = 0;
      dragRef.current.ady = 0;
      clearTimeout(idleRef.current);
      idleRef.current = setTimeout(gather, 150);
    }
  }

  function handlePointerUp() {
    dragRef.current.on = false;
    clearTimeout(idleRef.current);
    gather();
  }

  function selectPile(p: number) {
    if (phase !== 'piles') return;
    setHoverPile(p);
    setPhase('merging');
    setCards((prev) =>
      prev.map((c, i) => {
        if (c.pile === p) {
          return { ...c, x: 0, y: -6, r: (Math.random() - 0.5) * 3, zi: 100 + i };
        }
        return { ...c, x: (c.pile - 1) * 88, y: 240, r: (Math.random() - 0.5) * 20, zi: i };
      })
    );
    setTimeout(() => onComplete(p), 1100);
  }

  const fast = phase === 'shuffle';

  return (
    <div className="absolute inset-0 flex flex-col">
      <Starfield density={50} seed={11} />

      {/* Header */}
      <div
        className="relative z-[2] px-7 pt-[70px] text-center transition-opacity duration-[600ms]"
        style={{ opacity: phase === 'merging' ? 0.2 : 1 }}
      >
        <div className="mb-3 font-display text-[11px] tracking-[6px] text-gold opacity-85">
          {phase === 'shuffle' || phase === 'settling' ? 'SHUFFLE' : 'CUT THE DECK'}
        </div>
        <div className="whitespace-pre-line text-[17px] font-light leading-[1.8] tracking-[4px] text-parchment">
          {phase === 'shuffle' && '以指尖左右塗抹、推開\n讓牌在桌面流轉、與你共振'}
          {phase === 'settling' && '能量已注入'}
          {(phase === 'piles' || phase === 'merging') && '請憑直覺挑選一疊切牌'}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="relative z-[2] mx-auto mt-6 h-px w-[140px] bg-gold/15 transition-opacity duration-[600ms]"
        style={{ opacity: phase === 'shuffle' ? 1 : 0 }}
      >
        <motion.div
          className="absolute left-1/2 top-0 h-full -translate-x-1/2 bg-gold"
          style={{ boxShadow: '0 0 10px var(--color-gold)' }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </div>

      {/* Card area */}
      <div
        ref={surfaceRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative z-[2] flex flex-1 touch-none select-none items-center justify-center"
        style={{ cursor: phase === 'shuffle' ? 'grab' : 'default' }}
      >
        <div className="relative h-[200px] w-[280px]">
          {cards.map((c) => (
            <motion.div
              key={c.id}
              className="absolute left-1/2 top-1/2 -ml-[42px] -mt-[74px]"
              style={{ zIndex: c.zi }}
              initial={false}
              animate={{ x: c.x, y: c.y, rotate: c.r }}
              transition={fast ? SPRING_SHUFFLE : { duration: 0.9, ease: EASE.reveal }}
            >
              <CardBack w={84} h={148} />
            </motion.div>
          ))}

          {/* Pile tap zones */}
          {phase === 'piles' && (
            <div className="absolute inset-0 z-[200]">
              {[0, 1, 2].map((p) => (
                <button
                  key={p}
                  onClick={() => selectPile(p)}
                  className="absolute left-1/2 top-1/2 h-[156px] w-[92px] cursor-pointer border-none bg-transparent p-0"
                  style={{ transform: `translate(${(p - 1) * 88 - 46}px, -73px)` }}
                  onMouseEnter={() => setHoverPile(p)}
                  onMouseLeave={() => setHoverPile(null)}
                >
                  <div
                    className="h-full w-full rounded-lg transition-shadow duration-300"
                    style={{
                      boxShadow:
                        hoverPile === p
                          ? '0 0 28px rgba(212,175,55,0.45), inset 0 0 0 1px rgba(212,175,55,0.5)'
                          : 'inset 0 0 0 1px rgba(212,175,55,0)',
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hint */}
      <div className="relative z-[2] flex h-16 items-center justify-center">
        {phase === 'shuffle' && progress < 0.05 && <HandSwipeHint />}
        {phase === 'piles' && (
          <div className="flex gap-[88px]">
            {[0, 1, 2].map((p) => (
              <div
                key={p}
                className="w-[84px] text-center text-[10px] tracking-[4px] transition-colors duration-200"
                style={{ color: hoverPile === p ? 'var(--color-gold)' : 'var(--color-muted)' }}
              >
                {['左', '中', '右'][p]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
