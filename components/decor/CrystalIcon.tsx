import { PARCHMENT } from '@/lib/constants';

// Line crystal-ball glyph (Violet Mist hero) — an orb on a stand with a card
// peeking behind it. Pure stroke geometry; colour defaults to parchment.
export default function CrystalIcon({ size = 120, color = PARCHMENT }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: 'visible' }}>
      {/* a card peeking behind the orb */}
      <g stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round">
        <rect x="62" y="30" width="30" height="46" rx="3" transform="rotate(12 77 53)" />
        <circle cx="80" cy="46" r="3" transform="rotate(12 77 53)" />
        <path d="M74 60 h12" transform="rotate(12 77 53)" />
      </g>
      {/* orb */}
      <circle cx="52" cy="56" r="26" fill="none" stroke={color} strokeWidth="1.6" />
      <path d="M40 50 q8 8 24 4" fill="none" stroke={color} strokeWidth="1.2" opacity="0.7" />
      <circle cx="46" cy="48" r="2" fill={color} />
      {/* stand */}
      <path d="M34 84 q18 10 36 0" fill="none" stroke={color} strokeWidth="1.6" />
      <path
        d="M40 84 l4 14 h32 l4 -14"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
