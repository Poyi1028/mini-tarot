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

// Corona Borealis — the Northern Crown, reimagined as a delicate gem-set arc.
// A graceful open semicircle of stars (no closed blob) reads as elegant ritual
// rather than a busy sigil; the central jewel (index 3, Alphecca) sits lowest,
// where the bloom flares. Placed in a 180×140 field, centred ≈ (92, 66).
const STARS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 32, y: 56 },
  { x: 50, y: 70 },
  { x: 72, y: 80 },
  { x: 92, y: 83 }, // Alphecca — the crown's jewel
  { x: 114, y: 78 },
  { x: 134, y: 66 },
  { x: 152, y: 50 },
];

// Drawn left→right in order, so the line stagger traces the crown's sweep as
// one continuous gesture (an open arc — the crown is not closed).
const EDGES: ReadonlyArray<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
];

// Tuned so stars + lines finish just before the bloom beat (~2.0s after the
// overlay mounts; see ignite() in InputScreen). Slower/longer than before so
// the wiring-up reads as unhurried rather than a quick snap.
const STAR_IN = 0.12; // first star appears
const STAR_STEP = 0.09; // per-star stagger
const LINE_BASE = 0.75; // first line starts as the stars settle
const LINE_STEP = 0.12; // per-line stagger

export default function Constellation({ stage }: { stage: Stage }) {
  return (
    <svg viewBox="0 0 180 140" width="180" height="140" className="overflow-visible">
      {/* Centre bloom — a blurred flare that only swells on the `bloom` beat. */}
      <motion.circle
        cx={92}
        cy={80}
        r={7}
        fill={GOLD_BRIGHT}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: stage === 'bloom' ? 0.85 : 0,
          scale: stage === 'bloom' ? 2.3 : stage === 'exit' ? 2.8 : 1,
        }}
        transition={{ duration: 0.7, ease: EASE.reveal }}
        style={{ filter: 'blur(6px)', transformOrigin: '92px 80px' }}
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
          transition={{ duration: 0.55, ease: EASE.out, delay: LINE_BASE + i * LINE_STEP }}
        />
      ))}

      {/* Stars — framer fades/scales the GROUP in; the CSS twinkle lives on a
          child circle so the two never fight over `opacity`. */}
      {STARS.map((s, i) => (
        <motion.g
          key={`s${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE.out, delay: STAR_IN + i * STAR_STEP }}
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
