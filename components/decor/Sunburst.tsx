import type { CSSProperties } from 'react';
import { GOLD } from '@/lib/constants';

// Radiant sun: a central disc with alternating long/short rays. Pure geometric
// line-art, parametrised by stroke colour and ray count.
export default function Sunburst({
  size = 120,
  color = GOLD,
  sw = 1.2,
  rays = 24,
  className = '',
  style = {},
  pulseRays = false,
}: {
  size?: number;
  color?: string;
  sw?: number;
  rays?: number;
  className?: string;
  style?: CSSProperties;
  // When true, the rays dramatically shoot out and retract from their fixed
  // inner root — like a sun flaring — independent of any rotation on the svg.
  pulseRays?: boolean;
}) {
  const c = 60;
  const rInner = 17;
  const r1 = 30;
  const r2 = 52;
  const rI = rInner + 5;

  const rayEls = [];
  for (let i = 0; i < rays; i++) {
    const long = i % 2 === 0;
    const rO = long ? r2 : r1 + 4;
    const deg = (i / rays) * 360;

    if (pulseRays) {
      // Each ray is drawn pointing straight up from the core, then rotated into
      // place. The line is animated with scaleY about its BOTTOM (the inner
      // root), so the root stays pinned and only the tip flares out/in — a big,
      // unmistakable pulse. Brightness pulses with it to read as light emitting.
      //
      // Rays are deliberately OUT of sync: a golden-ratio phase and a slightly
      // varied period per ray make them flare at different moments — the sun
      // shimmers/twinkles instead of breathing as one block. Both are pure
      // functions of `i` (no Math.random) so SSR and client markup match.
      const frac = (x: number) => x - Math.floor(x);
      const dur = 1.0 + 0.9 * frac(i * 0.7548776662); // ~2.0–2.9s
      const delay = -frac(i * 0.6180339887) * dur; // spread start phase
      rayEls.push(
        <g key={i} transform={`rotate(${deg} ${c} ${c})`}>
          <line
            x1={c}
            y1={c - rI}
            x2={c}
            y2={c - rO}
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            style={
              {
                transformBox: 'fill-box',
                transformOrigin: 'bottom',
                animation: `sun-ray ${dur.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
              } as CSSProperties
            }
          />
        </g>
      );
    } else {
      const a = (i / rays) * Math.PI * 2;
      rayEls.push(
        <line
          key={i}
          x1={c + Math.cos(a) * rI}
          y1={c + Math.sin(a) * rI}
          x2={c + Math.cos(a) * rO}
          y2={c + Math.sin(a) * rO}
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      );
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={{ overflow: 'visible', ...style }}
    >
      <circle cx={c} cy={c} r={rInner} fill="none" stroke={color} strokeWidth={sw} />
      <circle
        cx={c}
        cy={c}
        r={rInner - 4.5}
        fill="none"
        stroke={color}
        strokeWidth={sw * 0.7}
        opacity="0.6"
      />
      {rayEls}
    </svg>
  );
}
