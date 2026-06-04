import type { CSSProperties } from 'react';
import { GOLD } from '@/lib/constants';

// Crescent moon — pure geometry (no face), with two small accent stars beside it.
export default function Crescent({
  size = 44,
  color = GOLD,
  sw = 1.2,
  className = '',
  style = {},
}: {
  size?: number;
  color?: string;
  sw?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      className={className}
      style={{ overflow: 'visible', ...style }}
    >
      <path
        d="M30 6 A18 18 0 1 0 30 38 A14 14 0 1 1 30 6 Z"
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <circle cx="9" cy="13" r="0.9" fill={color} />
      <circle cx="13" cy="33" r="0.7" fill={color} opacity="0.7" />
    </svg>
  );
}
