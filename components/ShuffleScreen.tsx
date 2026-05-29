'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import Starfield from './Starfield';
import CardBack from './CardBack';

// ── Tunables ────────────────────────────────────────────────────────────────
const N_DECK = 12; // divisible by 3 → even left/mid/right piles (fewer = smoother on phones)
const SHUFFLE_MS = 3000; // active rubbing time before the deck gathers itself
const SCATTER_MS = 140; // re-randomise the spread at most this often while dragging
const SPREAD_X = 144; // how far cards smear left/right while shuffling
const SPREAD_Y = 46;
const PILE_GAP = 88; // distance between the three cut piles

// The one spring the user asked for — weighty, slightly settled.
const SPRING = { type: 'spring', stiffness: 100, damping: 20 } as const;

type Phase = 'shuffle' | 'gather' | 'cut' | 'merge';

interface Card {
  id: number;
  x: number;
  y: number;
  rot: number;
  z: number;
  pile: number;
}

const rand = (n: number) => (Math.random() - 0.5) * 2 * n;

// A neat face-down stack at center, with tiny per-card offsets so it reads as a
// real pile rather than one flat card.
function stack(): Card[] {
  return Array.from({ length: N_DECK }, (_, i) => ({
    id: i,
    x: rand(4),
    y: rand(4) - i * 0.3,
    rot: rand(3),
    z: i,
    pile: 0,
  }));
}

export default function ShuffleScreen({ onComplete }: { onComplete: (pile: number) => void }) {
  const [cards, setCards] = useState<Card[]>(stack);
  const [phase, setPhase] = useState<Phase>('shuffle');
  const [moved, setMoved] = useState(false);
  const [hoverPile, setHoverPile] = useState<number | null>(null);

  const phaseRef = useRef<Phase>('shuffle');
  const draggingRef = useRef(false);
  const doneRef = useRef(false);
  const elapsedRef = useRef(0);
  const lastMoveRef = useRef(0);
  const lastScatterRef = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function setPhaseBoth(next: Phase) {
    phaseRef.current = next;
    setPhase(next);
  }

  // Smear: fling every card to a fresh random spot, rotated within ±15°.
  function scatter() {
    setCards((prev) =>
      prev.map((c, i) => ({
        ...c,
        x: rand(SPREAD_X),
        y: rand(SPREAD_Y),
        rot: rand(15),
        z: i,
      }))
    );
  }

  // Count only *active* rubbing toward the 3s; stop the clock if the finger
  // rests. Once full, gather to one pile, then auto-split into three.
  useAnimationFrame((_, delta) => {
    if (phaseRef.current !== 'shuffle' || doneRef.current) return;
    if (!draggingRef.current) return;
    if (performance.now() - lastMoveRef.current > 160) return; // finger paused
    elapsedRef.current += delta;
    const p = Math.min(1, elapsedRef.current / SHUFFLE_MS);
    if (barRef.current) barRef.current.style.width = `${p * 100}%`;
    if (p >= 1) finishShuffle();
  });

  function finishShuffle() {
    if (doneRef.current) return;
    doneRef.current = true;
    draggingRef.current = false;
    setPhaseBoth('gather');
    setCards((prev) => prev.map((c, i) => ({ ...c, x: rand(5), y: rand(5) - i * 0.3, rot: rand(4), z: i })));
    // After the gather settles, fan out into the three cut piles.
    timers.current.push(
      setTimeout(() => {
        setPhaseBoth('cut');
        setCards((prev) =>
          prev.map((c, i) => {
            const pile = i % 3;
            return {
              ...c,
              pile,
              x: (pile - 1) * PILE_GAP + rand(3),
              y: rand(3) - Math.floor(i / 3) * 0.5,
              rot: rand(3),
              z: i,
            };
          })
        );
      }, 720)
    );
  }

  function onDragMove() {
    if (phaseRef.current !== 'shuffle') return;
    if (!moved) setMoved(true);
    const now = performance.now();
    lastMoveRef.current = now;
    if (now - lastScatterRef.current > SCATTER_MS) {
      lastScatterRef.current = now;
      scatter();
    }
  }

  function selectPile(p: number) {
    if (phaseRef.current !== 'cut') return;
    setHoverPile(p);
    setPhaseBoth('merge');
    // The other two piles slide in beneath the chosen one, which rises to the top
    // of the merged deck (chosen z dominates every other card).
    const tx = (p - 1) * PILE_GAP;
    setCards((prev) =>
      prev.map((c, i) =>
        c.pile === p
          ? { ...c, x: tx + rand(3), y: rand(3), rot: rand(4), z: 200 + i }
          : { ...c, x: tx + rand(3), y: rand(3), rot: rand(7), z: i }
      )
    );
    timers.current.push(setTimeout(() => onComplete(p), 1100));
  }

  // Cleanup pending timers if unmounted mid-sequence.
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col">
      <Starfield density={26} seed={11} />

      {/* Header */}
      <div
        className="relative z-[2] px-7 pt-[70px] text-center transition-opacity duration-[600ms]"
        style={{ opacity: phase === 'merge' ? 0.2 : 1 }}
      >
        <div className="mb-3 font-display text-[11px] tracking-[6px] text-gold opacity-85">
          {phase === 'shuffle' || phase === 'gather' ? 'SHUFFLE' : 'CUT THE DECK'}
        </div>
        <div className="min-h-[62px] whitespace-pre-line text-[17px] font-light leading-[1.8] tracking-[4px] text-parchment">
          {phase === 'shuffle' && '按住牌堆、左右揉搓\n讓牌在桌面流轉、與你共振'}
          {phase === 'gather' && '能量已注入'}
          {(phase === 'cut' || phase === 'merge') && (
            <motion.span
              className="text-gold"
              style={{ textShadow: '0 0 14px rgba(231,215,166,0.55)' }}
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              請直覺選擇其中一疊牌堆
            </motion.span>
          )}
        </div>
      </div>

      {/* Progress bar (fills over the 3s of active shuffling) */}
      <div
        className="relative z-[2] mx-auto mt-6 h-px w-[140px] bg-gold/15 transition-opacity duration-[600ms]"
        style={{ opacity: phase === 'shuffle' ? 1 : 0 }}
      >
        <div
          ref={barRef}
          className="absolute left-1/2 top-0 h-full -translate-x-1/2 bg-gold transition-[width] duration-150 ease-out"
          style={{ width: 0, boxShadow: '0 0 10px var(--color-gold)' }}
        />
      </div>

      {/* Card area */}
      <div className="relative z-[2] flex flex-1 touch-none select-none items-center justify-center">
        {/* Whole pile breathes up and down while idle (hover effect). */}
        <motion.div
          className="relative"
          style={{ width: 360, height: 320 }}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {cards.map((c) => (
            <motion.div
              key={c.id}
              className="absolute left-1/2 top-1/2 -ml-[42px] -mt-[74px]"
              style={{ zIndex: c.z }}
              initial={false}
              animate={{ x: c.x, y: c.y, rotate: c.rot }}
              transition={SPRING}
            >
              <CardBack w={84} h={148} />
            </motion.div>
          ))}

          {/* Drag-to-shuffle gesture surface (only while shuffling) */}
          {phase === 'shuffle' && (
            <motion.div
              className="absolute inset-0 z-[150]"
              style={{ cursor: 'grab' }}
              whileTap={{ cursor: 'grabbing' }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.35}
              dragSnapToOrigin
              onDragStart={() => {
                draggingRef.current = true;
              }}
              onDrag={onDragMove}
              onDragEnd={() => {
                draggingRef.current = false;
              }}
            />
          )}

          {/* Pile tap zones (only while cutting) */}
          {phase === 'cut' && (
            <div className="absolute inset-0 z-[200]">
              {[0, 1, 2].map((p) => (
                <button
                  key={p}
                  onClick={() => selectPile(p)}
                  className="absolute left-1/2 top-1/2 h-[156px] w-[92px] cursor-pointer border-none bg-transparent p-0"
                  style={{ transform: `translate(${(p - 1) * PILE_GAP - 46}px, -73px)` }}
                  onMouseEnter={() => setHoverPile(p)}
                  onMouseLeave={() => setHoverPile(null)}
                >
                  <div
                    className="h-full w-full rounded-lg transition-shadow duration-300"
                    style={{
                      boxShadow:
                        hoverPile === p
                          ? '0 0 28px rgba(231,215,166,0.45), inset 0 0 0 1px rgba(231,215,166,0.5)'
                          : 'inset 0 0 0 1px rgba(231,215,166,0)',
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Hint */}
      <div className="relative z-[2] flex h-16 items-center justify-center">
        {phase === 'shuffle' && !moved && (
          <div className="text-[11px] tracking-[4px] text-muted">按 住 ・ 左 右 揉 搓</div>
        )}
        {phase === 'cut' && (
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
