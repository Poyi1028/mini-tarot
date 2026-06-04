import { motion } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, PARCHMENT } from '@/lib/constants';
import { EASE } from '@/lib/motion';

// The sync sigil, reimagined: the dissolved question's light settles into a
// handful of stars that then wire themselves together into a constellation.
// Replaces the old spinning geometric `SyncSigil`. Driven by `stage`:
//   forming → stars fade in, then lines draw in sequence (pathLength)
//   bloom   → a soft flare blooms at the centre ("synced")
//   exit    → handled by the parent overlay fading the whole group out
type Stage = 'forming' | 'bloom' | 'exit';

// Hand-placed asterism in a 180×140 field, centred ≈ (90, 76).
const STARS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 30, y: 96 },
  { x: 58, y: 60 },
  { x: 86, y: 78 },
  { x: 104, y: 40 },
  { x: 132, y: 54 },
  { x: 150, y: 96 },
  { x: 120, y: 108 },
  { x: 74, y: 112 },
];

// Drawn in order, so the line stagger traces a continuous path then closes.
const EDGES: ReadonlyArray<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 0],
  [2, 7],
];

// Tuned so stars + lines finish just before the bloom beat (~1.7s after the
// overlay mounts; see ignite() in InputScreen).
const STAR_IN = 0.1; // first star appears
const STAR_STEP = 0.06; // per-star stagger
const LINE_BASE = 0.7; // first line starts as the stars settle
const LINE_STEP = 0.07; // per-line stagger

export default function Constellation({ stage }: { stage: Stage }) {
  return (
    <svg viewBox="0 0 180 140" width="180" height="140" className="overflow-visible">
      {/* Centre bloom — a blurred flare that only swells on the `bloom` beat. */}
      <motion.circle
        cx={90}
        cy={76}
        r={7}
        fill={GOLD_BRIGHT}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: stage === 'bloom' ? 0.85 : 0,
          scale: stage === 'bloom' ? 2.3 : stage === 'exit' ? 2.8 : 1,
        }}
        transition={{ duration: 0.7, ease: EASE.reveal }}
        style={{ filter: 'blur(6px)', transformOrigin: '90px 76px' }}
      />

      {/* Constellation lines — each traces itself on via pathLength. */}
      {EDGES.map(([a, b], i) => (
        <motion.line
          key={`e${i}`}
          x1={STARS[a].x}
          y1={STARS[a].y}
          x2={STARS[b].x}
          y2={STARS[b].y}
          stroke={PARCHMENT}
          strokeWidth={0.7}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.65 }}
          transition={{ duration: 0.35, ease: EASE.out, delay: LINE_BASE + i * LINE_STEP }}
        />
      ))}

      {/* Stars — framer fades/scales the GROUP in; the CSS twinkle lives on a
          child circle so the two never fight over `opacity`. */}
      {STARS.map((s, i) => (
        <motion.g
          key={`s${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: EASE.out, delay: STAR_IN + i * STAR_STEP }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        >
          <circle
            cx={s.x}
            cy={s.y}
            r={4.5}
            fill={GOLD}
            className="animate-star-twinkle"
            style={{ animationDelay: `${-i * 0.4}s`, filter: 'blur(2px)' }}
          />
          <circle cx={s.x} cy={s.y} r={1.6} fill={GOLD_BRIGHT} />
        </motion.g>
      ))}
    </svg>
  );
}
