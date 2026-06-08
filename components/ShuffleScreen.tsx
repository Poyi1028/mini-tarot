'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '@/lib/motion';
import Starfield from './Starfield';
import CardBack from './CardBack';

// ── Tunables ────────────────────────────────────────────────────────────────
const N_DECK = 12; // divisible by 3 → even left/mid/right piles (fewer = smoother on phones)
const SCATTER_MS = 140; // re-randomise the spread at most this often while dragging
const SPREAD_X = 210; // how far cards smear left/right while shuffling
const SPREAD_Y = 96;
const PILE_GAP = 88; // distance between the three cut piles
const STAGE_W = 440; // card-stage box (drag/cut surface) — a touch narrower
const STAGE_H = 460; // …and taller, for a roomier shuffle

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
  const lastScatterRef = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function setPhaseBoth(next: Phase) {
    phaseRef.current = next;
    setPhase(next);
  }

  // Smear: fling every card to a fresh random spot, rotated within ±28°.
  function scatter() {
    setCards((prev) =>
      prev.map((c, i) => ({
        ...c,
        x: rand(SPREAD_X),
        y: rand(SPREAD_Y),
        rot: rand(28),
        z: i,
      }))
    );
  }

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
    if (now - lastScatterRef.current > SCATTER_MS) {
      lastScatterRef.current = now;
      scatter();
    }
  }

  // Release-to-finish: once the deck has actually been rubbed, letting go gathers
  // it and moves on to the cut. A bare tap (no movement) does nothing.
  function onDragRelease() {
    draggingRef.current = false;
    if (phaseRef.current === 'shuffle' && moved) finishShuffle();
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
    <div className="absolute inset-0">
      <Starfield density={20} seed={11} />

      {/* Header — floats at the top so the card stage can sit dead-center */}
      <div
        className="absolute left-0 right-0 top-0 z-[3] px-7 pt-[70px] text-center transition-opacity duration-[600ms]"
        style={{ opacity: phase === 'merge' ? 0.2 : 1 }}
      >
        <div className="mb-3 font-display text-[10px] tracking-[5px] text-gold/80">
          {phase === 'shuffle' || phase === 'gather' ? 'SHUFFLE' : 'CUT THE DECK'}
        </div>
        <div className="min-h-[58px] whitespace-pre-line text-[15px] font-light leading-[1.75] tracking-[3px] text-parchment/88">
          {phase === 'shuffle' && '按住牌堆、左右揉搓\n讓牌在桌面流轉、與你共振'}
          {phase === 'gather' && '能量已注入'}
          {(phase === 'cut' || phase === 'merge') && (
            <motion.span
              className="text-gold"
              style={{ textShadow: '0 0 14px rgba(216,189,143,0.55)' }}
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              請直覺選擇其中一疊牌堆
            </motion.span>
          )}
        </div>
      </div>

      {/* Card area — pinned to the full screen so the pile (and the cut piles)
          land at the true center, with the header/hint floating over the edges */}
      <div className="absolute inset-0 z-[2] flex touch-none select-none items-center justify-center">
        {/* Deck lands softly: a one-time scale+fade on mount, wrapping (not
            replacing) the idle breathing container so it never fights the
            y-loop — picks up where the sync overlay's dark hand-off leaves off. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE.out }}
          style={{ transformOrigin: 'center' }}
        >
          {/* Whole pile breathes up and down while idle (hover effect). */}
          <motion.div
            className="relative"
            style={{ width: STAGE_W, height: STAGE_H }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
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
              onDragEnd={onDragRelease}
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
                          ? '0 0 28px rgba(216,189,143,0.45), inset 0 0 0 1px rgba(216,189,143,0.5)'
                          : 'inset 0 0 0 1px rgba(216,189,143,0)',
                    }}
                  />
                </button>
              ))}
            </div>
          )}
          </motion.div>
        </motion.div>
      </div>

      {/* Hint — floats along the bottom edge */}
      <div className="absolute bottom-7 left-0 right-0 z-[3] flex h-16 items-center justify-center">
        {phase === 'shuffle' && (
          <div className="text-[11px] tracking-[4px] text-muted">
            {moved ? '放 開 即 完 成 洗 牌' : '按 住 ・ 左 右 揉 搓'}
          </div>
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
