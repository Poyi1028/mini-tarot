// Hand-drawn line glyphs for the four minor-arcana suits — chalice, disc,
// sword, staff. Replaces the playing-card pips (♥♦♠♣), which read too casual
// against the classical theme. Stroke uses currentColor so the parent sets the
// gold tint; sized to sit where the major-arcana numeral does.

const PATHS = {
  // Chalice — rounded bowl on a stem and foot.
  cups: (
    <>
      <path d="M5.5 4.5 H18.5" />
      <path d="M6 4.5 C6 10.5 8.7 13 12 13 C15.3 13 18 10.5 18 4.5" />
      <path d="M12 13 V18.5" />
      <path d="M8 19.5 C9.5 18.2 14.5 18.2 16 19.5" />
    </>
  ),
  // Pentacle — a circle enclosing an upright five-pointed star.
  pentacles: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6 L15.527 16.854 L6.294 10.146 L17.706 10.146 L8.473 16.854 Z" />
    </>
  ),
  // Sword — point up, with crossguard and pommel.
  swords: (
    <>
      <path d="M9.8 6 L12 3 L14.2 6" />
      <path d="M12 3 V15" />
      <path d="M8 15 H16" />
      <path d="M12 15 V19.5" />
      <circle cx="12" cy="20.6" r="1.3" />
    </>
  ),
  // Staff — a budding rod with a leaf sprouting on each side.
  wands: (
    <>
      <path d="M12 21 V5" />
      <path d="M12 9 C8.5 8.3 7.2 5.8 8 3.2" />
      <path d="M12 7 C15.5 6.3 16.8 3.8 16 1.2" />
      <path d="M12 5 V2.5" />
    </>
  ),
};

export default function SuitGlyph({ suit, size = 26 }) {
  const glyph = PATHS[suit];
  if (!glyph) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyph}
    </svg>
  );
}
