import type { CSSProperties } from 'react';
import { GOLD } from '@/lib/constants';

// 4-point concave star — the Violet Mist signature sparkle.
export default function Sparkle({
  size = 16,
  color = GOLD,
  opacity = 1,
  className = '',
  style = {},
}: {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ opacity, overflow: 'visible', ...style }}
    >
      <path
        d="M12 0 C12.6 7.2 16.8 11.4 24 12 C16.8 12.6 12.6 16.8 12 24 C11.4 16.8 7.2 12.6 0 12 C7.2 11.4 11.4 7.2 12 0 Z"
        fill={color}
      />
    </svg>
  );
}
