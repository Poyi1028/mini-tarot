import type { CSSProperties } from 'react';
import { GOLD } from '@/lib/constants';

// Ornate divider — a gilded diamond flanked by fading rules.
export default function OrnDivider({
  w = 48,
  color = GOLD,
  className = '',
  style = {},
}: {
  w?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, ...style }}
    >
      <span
        style={{
          height: 1,
          width: w,
          background: `linear-gradient(to right, transparent, ${color})`,
          opacity: 0.7,
        }}
      />
      <span
        style={{
          width: 5,
          height: 5,
          transform: 'rotate(45deg)',
          border: `1px solid ${color}`,
          display: 'block',
        }}
      />
      <span
        style={{
          height: 1,
          width: w,
          background: `linear-gradient(to left, transparent, ${color})`,
          opacity: 0.7,
        }}
      />
    </div>
  );
}
