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

// Cygnus — the Swan, a.k.a. the Northern Cross. Chosen over a single open arc
// because its shape genuinely BRANCHES: a long spine (tail → heart → head) is
// crossed by an outstretched pair of wings, all four limbs meeting at the
// central star Sadr. That 4-way junction reads as a cross/swan in flight —
// recognisable and ritualistic — rather than one unbroken line. Laid out in
// the 180×140 field as a gently tilted cross, heart (Sadr) ≈ (90, 70).
const STARS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 96, y: 18 }, // 0 Deneb — the tail, brightest, high on the spine
  { x: 90, y: 70 }, // 1 Sadr — the heart, where spine and wings cross (bloom)
  { x: 82, y: 118 }, // 2 Albireo — the head/beak, low on the spine
  { x: 30, y: 56 }, // 3 west wing inner (Fawaris / δ Cygni)
  { x: 150, y: 84 }, // 4 east wing outer (ε Cygni / Gienah) tip
  { x: 60, y: 62 }, // 5 west wing mid, between Sadr and the tip
  { x: 120, y: 78 }, // 6 east wing mid, between Sadr and the tip
];

// Edges fan OUT from the heart (1) along all four limbs, so the draw-in stagger
// blooms from the centre: first the spine (tail then head), then each wing
// sweeps outward. Multiple edges share node 1 — this is the branch, not a chain.
const EDGES: ReadonlyArray<[number, number]> = [
  [1, 0], // heart → tail (Deneb)
  [1, 2], // heart → head (Albireo)
  [1, 5], // heart → west wing mid
  [5, 3], // west wing mid → inner tip
  [1, 6], // heart → east wing mid
  [6, 4], // east wing mid → outer tip
];

// Tuned so stars + lines finish just before the bloom beat (~2.0s after the
// overlay mounts; see ignite() in InputScreen). With more edges than the old
// arc, the per-line stagger is tightened so the full wiring still lands < ~2s,
// yet each limb still draws as one unhurried outward gesture.
const STAR_IN = 0.12; // first star appears
const STAR_STEP = 0.08; // per-star stagger (7 stars → settle by ~0.7s)
const LINE_BASE = 0.7; // first line starts as the stars settle
const LINE_STEP = 0.11; // per-line stagger (6 edges → last starts ~1.25s, ends ~1.8s)

export default function Constellation({ stage }: { stage: Stage }) {
  return (
    <svg viewBox="0 0 180 140" width="180" height="140" className="overflow-visible">
      {/* Centre bloom — a blurred flare that only swells on the `bloom` beat.
          Sits at Sadr (the heart, where all four limbs cross). */}
      <motion.circle
        cx={90}
        cy={70}
        r={7}
        fill={GOLD_BRIGHT}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: stage === 'bloom' ? 0.85 : 0,
          scale: stage === 'bloom' ? 2.3 : stage === 'exit' ? 2.8 : 1,
        }}
        transition={{ duration: 0.7, ease: EASE.reveal }}
        style={{ filter: 'blur(6px)', transformOrigin: '90px 70px' }}
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
