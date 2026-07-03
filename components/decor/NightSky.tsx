'use client';

import { memo } from 'react';
import { GOLD_BRIGHT, gold } from '@/lib/constants';

// A sparse, static night sky with two hand-placed constellations whose stars
// are 4-point sparkles. No scattered background stars or nebula glow.

// Coordinate field for the SVG. Portrait-ish so `slice` covers a phone screen
// without distorting the hand-tuned star positions.
const FIELD_W = 100;
const FIELD_H = 178;

type Pt = { x: number; y: number; r?: number };

// Two small constellations placed in opposite corners, clear of the centre
// where the crystal + title live, so they frame rather than clutter.
const CONSTELLATIONS: ReadonlyArray<{
  stars: ReadonlyArray<Pt>;
  edges: ReadonlyArray<[number, number]>;
  opacity: number;
}> = [
  {
    // upper-left — a flowing line of five stars
    stars: [
      { x: 9, y: 20 },
      { x: 17, y: 29, r: 1.1 },
      { x: 27, y: 26 },
      { x: 33, y: 37 },
      { x: 23, y: 43 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    opacity: 0.55,
  },
  {
    // lower-right — a small four-star arc
    stars: [
      { x: 77, y: 134 },
      { x: 86, y: 139, r: 1.1 },
      { x: 91, y: 149 },
      { x: 80, y: 154 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    opacity: 0.5,
  },
];

// 4-point concave sparkle (the Violet Mist signature star) centred at (cx, cy)
// with point reach r. The waist factor controls how "spiky" the star reads.
function sparkle(cx: number, cy: number, r: number) {
  const i = r * 0.3;
  return `M${cx} ${cy - r}L${cx + i} ${cy - i}L${cx + r} ${cy}L${cx + i} ${cy + i}L${cx} ${cy + r}L${cx - i} ${cy + i}L${cx - r} ${cy}L${cx - i} ${cy - i}Z`;
}

function NightSky() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox={`0 0 ${FIELD_W} ${FIELD_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {CONSTELLATIONS.map((c, ci) => (
          <g key={`c${ci}`} opacity={c.opacity}>
            {c.edges.map(([a, b], i) => (
              <line
                key={`e${i}`}
                x1={c.stars[a].x}
                y1={c.stars[a].y}
                x2={c.stars[b].x}
                y2={c.stars[b].y}
                stroke={GOLD_BRIGHT}
                strokeWidth={0.25}
                strokeLinecap="round"
                opacity={0.5}
              />
            ))}
            {c.stars.map((s, i) => {
              // small sparkles with a faint two-step halo — micro, barely glowing
              const size = (s.r ?? 0.85) * 0.8 + 0.4;
              return (
                <g key={`s${i}`}>
                  <circle cx={s.x} cy={s.y} r={size * 2.4} fill={gold(0.05)} />
                  <circle cx={s.x} cy={s.y} r={size * 1.3} fill={gold(0.1)} />
                  <path d={sparkle(s.x, s.y, size)} fill={GOLD_BRIGHT} />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default memo(NightSky);
