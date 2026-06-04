import type { CSSProperties } from 'react';
import { GOLD } from '@/lib/constants';
import Sparkle from './Sparkle';

export type Element = '火' | '水' | '風' | '土' | '靈';

// Alchemical element glyph (geometric line-art): fire/water △▽, air/earth with a
// bar, spirit (靈) as a sparkle. Used by the deck tabs and headers.
export default function ElementGlyph({
  el,
  size = 14,
  color = GOLD,
  sw = 1.2,
  style = {},
}: {
  el: Element;
  size?: number;
  color?: string;
  sw?: number;
  style?: CSSProperties;
}) {
  if (el === '靈') {
    return <Sparkle size={size} color={color} style={style} />;
  }
  const c = size / 2;
  const up = `M${c} ${size * 0.12} L${size * 0.86} ${size * 0.86} L${size * 0.14} ${size * 0.86} Z`;
  const down = `M${size * 0.14} ${size * 0.14} L${size * 0.86} ${size * 0.14} L${c} ${size * 0.88} Z`;
  const bar = (y: number) => `M${size * 0.28} ${y} L${size * 0.72} ${y}`;
  const tri = el === '火' || el === '風' ? up : down;
  const showBar = el === '風' || el === '土';
  const barY = el === '風' ? size * 0.6 : size * 0.42;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible', ...style }}
    >
      <path d={tri} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      {showBar && <path d={bar(barY)} stroke={color} strokeWidth={sw} strokeLinecap="round" />}
    </svg>
  );
}
