import { motion } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, PARCHMENT } from '@/lib/constants';
import { EASE } from '@/lib/motion';

type Stage = 'forming' | 'bloom' | 'exit';
export type ConstellationVariant = 'lyra' | 'corona';

interface Star {
  x: number;
  y: number;
  r?: number;
}

interface ConstellationDefinition {
  stars: ReadonlyArray<Star>;
  segments: ReadonlyArray<string>;
  bloom: { x: number; y: number };
}

// Stars are ordered from the focal point outward so their stagger reads as
// light gathering into a shape rather than a diagram appearing node-by-node.
const LYRA: ConstellationDefinition = {
  bloom: { x: 53, y: 24 },
  stars: [
    { x: 53, y: 24, r: 2.1 },
    { x: 73, y: 50, r: 1.5 },
    { x: 119, y: 58, r: 1.7 },
    { x: 128, y: 91, r: 1.5 },
    { x: 77, y: 106, r: 1.8 },
    { x: 43, y: 76, r: 1.6 },
    { x: 94, y: 78, r: 1.2 },
    { x: 66, y: 128, r: 1.4 },
  ],
  segments: [
    'M 53 24 Q 58 38 73 50',
    'M 73 50 L 119 58',
    'M 119 58 Q 130 72 128 91',
    'M 128 91 L 77 106',
    'M 77 106 L 43 76',
    'M 43 76 Q 45 43 53 24',
    'M 73 50 L 77 106',
    'M 119 58 L 77 106',
    'M 77 106 Q 70 118 66 128',
  ],
};

const CORONA: ConstellationDefinition = {
  bloom: { x: 90, y: 35 },
  stars: [
    { x: 90, y: 35, r: 2.2 },
    { x: 67, y: 67, r: 1.6 },
    { x: 113, y: 67, r: 1.7 },
    { x: 41, y: 89, r: 1.8 },
    { x: 140, y: 90, r: 1.8 },
    { x: 20, y: 62, r: 1.4 },
    { x: 162, y: 61, r: 1.5 },
  ],
  segments: [
    'M 90 35 L 67 67',
    'M 90 35 L 113 67',
    'M 67 67 Q 53 78 41 89',
    'M 113 67 Q 127 79 140 90',
    'M 41 89 L 20 62',
    'M 140 90 L 162 61',
  ],
};

const DEFINITIONS: Record<ConstellationVariant, ConstellationDefinition> = {
  lyra: LYRA,
  corona: CORONA,
};

const STAR_IN = 0.12;
const STAR_STEP = 0.07;
const LINE_BASE = 0.68;
const LINE_STEP = 0.075;

export default function Constellation({
  stage,
  variant,
}: {
  stage: Stage;
  variant: ConstellationVariant;
}) {
  const definition = DEFINITIONS[variant];

  return (
    <svg
      viewBox="0 0 180 140"
      width="180"
      height="140"
      className="overflow-visible"
      aria-hidden
    >
      <motion.circle
        cx={definition.bloom.x}
        cy={definition.bloom.y}
        r={7}
        fill={GOLD_BRIGHT}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: stage === 'bloom' ? 0.85 : 0,
          scale: stage === 'bloom' ? 2.3 : stage === 'exit' ? 2.8 : 1,
        }}
        transition={{ duration: 0.7, ease: EASE.reveal }}
        style={{
          filter: 'blur(6px)',
          transformOrigin: `${definition.bloom.x}px ${definition.bloom.y}px`,
        }}
      />

      {definition.segments.map((d, i) => (
        <motion.path
          key={`${variant}-segment-${i}`}
          d={d}
          fill="none"
          stroke={PARCHMENT}
          strokeWidth={0.72}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.62 }}
          transition={{
            duration: 0.55,
            ease: EASE.out,
            delay: LINE_BASE + i * LINE_STEP,
          }}
        />
      ))}

      {definition.stars.map((star, i) => {
        const radius = star.r ?? 1.5;
        return (
          <motion.g
            key={`${variant}-star-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: EASE.out,
              delay: STAR_IN + i * STAR_STEP,
            }}
            style={{ transformOrigin: `${star.x}px ${star.y}px` }}
          >
            <circle
              cx={star.x}
              cy={star.y}
              r={radius * 3.2}
              fill={GOLD}
              className="animate-star-twinkle"
              style={{ animationDelay: `${-i * 0.37}s`, filter: 'blur(2.2px)' }}
            />
            <circle cx={star.x} cy={star.y} r={radius} fill={GOLD_BRIGHT} />
          </motion.g>
        );
      })}
    </svg>
  );
}
