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
}: {
  size?: number;
  color?: string;
  sw?: number;
  rays?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const c = 60;
  const rInner = 17;
  const r1 = 30;
  const r2 = 52;
  const lines = [];
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const long = i % 2 === 0;
    const rO = long ? r2 : r1 + 4;
    lines.push(
      <line
        key={i}
        x1={c + Math.cos(a) * (rInner + 5)}
        y1={c + Math.sin(a) * (rInner + 5)}
        x2={c + Math.cos(a) * rO}
        y2={c + Math.sin(a) * rO}
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    );
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
      {lines}
    </svg>
  );
}
