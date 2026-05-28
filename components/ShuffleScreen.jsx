'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GOLD_SOFT } from '@/lib/constants';
import Starfield from './Starfield';
import CardBack from './CardBack';

const N_DECK = 78;
const SHUFFLE_TARGET = 1800;

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
      <span>左 右 滑 動</span>
    </div>
  );
}

export default function ShuffleScreen({ onComplete }) {
  const [cards, setCards] = useState(() =>
    Array.from({ length: N_DECK }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 4,
      r: (Math.random() - 0.5) * 4,
      zi: i,
      pile: 0,
    }))
  );
  const [phase, setPhase] = useState('shuffle'); // shuffle | settling | piles | merging
  const [progress, setProgress] = useState(0);
  const [hoverPile, setHoverPile] = useState(null);
  const dragRef = useRef({ on: false, lx: 0, ly: 0, dist: 0, last: 0 });
  const surfaceRef = useRef(null);

  useEffect(() => {
    if (phase !== 'shuffle' || progress < 1) return;
    setPhase('settling');
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

  function reshuffle() {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        x: (Math.random() - 0.5) * 130,
        y: (Math.random() - 0.5) * 70,
        r: (Math.random() - 0.5) * 70,
        zi: Math.floor(Math.random() * N_DECK),
      }))
    );
  }

  function handlePointerDown(e) {
    if (phase !== 'shuffle') return;
    e.preventDefault();
    dragRef.current.on = true;
    dragRef.current.lx = e.clientX;
    dragRef.current.ly = e.clientY;
    surfaceRef.current?.setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!dragRef.current.on || phase !== 'shuffle') return;
    const dx = e.clientX - dragRef.current.lx;
    const dy = e.clientY - dragRef.current.ly;
    const d = Math.hypot(dx, dy);
    if (d < 1) return;
    dragRef.current.lx = e.clientX;
    dragRef.current.ly = e.clientY;
    dragRef.current.dist += d;
    const now = performance.now();
    setProgress(Math.min(1, dragRef.current.dist / SHUFFLE_TARGET));
    if (now - dragRef.current.last > 70) {
      dragRef.current.last = now;
      reshuffle();
    }
  }

  function handlePointerUp() {
    dragRef.current.on = false;
  }

  function selectPile(p) {
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
          {phase === 'shuffle' && '以指尖左右滑動或畫圈\n讓牌與你的氣息共振'}
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
          className="h-full bg-gold"
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
              transition={{
                duration: fast ? 0.28 : 0.9,
                ease: fast ? [0.3, 0.7, 0.4, 1] : [0.6, 0.05, 0.2, 1],
              }}
            >
              <CardBack w={84} h={148} />
            </motion.div>
          ))}

          {/* Pile tap zones */}
          {phase === 'piles' && (
            <div className="absolute inset-0">
              {[0, 1, 2].map((p) => (
                <button
                  key={p}
                  onClick={() => selectPile(p)}
                  className="absolute left-1/2 top-1/2 h-[168px] w-[100px] cursor-pointer border-none bg-transparent p-0"
                  style={{ transform: `translate(${(p - 1) * 88 - 50}px, -84px)` }}
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
