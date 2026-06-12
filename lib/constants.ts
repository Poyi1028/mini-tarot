// 紫霧 Violet Mist palette — mirrors the @theme tokens in app/globals.css.
// These JS constants exist for inline style={{}} props (the SVG-heavy card and
// decoration components rely on them); keep the two in sync.
export const GOLD = '#e8ddcb';
export const GOLD_BRIGHT = '#f5eede';
export const GOLD_DIM = '#bcb097';

// RGB channels for the two golds, kept as the single source for translucent
// uses (glows, borders, shadows). Change the gold here and every gold()/
// goldBright() call updates with it — no more hand-written rgba() literals.
const GOLD_RGB = '232, 221, 203'; // = GOLD #e8ddcb
const GOLD_BRIGHT_RGB = '245, 238, 222'; // = GOLD_BRIGHT #f5eede
export const gold = (a: number) => `rgba(${GOLD_RGB}, ${a})`;
export const goldBright = (a: number) => `rgba(${GOLD_BRIGHT_RGB}, ${a})`;
export const INK = '#0b0a12';
export const INK_2 = '#121019';
export const PURPLE_DEEP = '#181626';
export const PURPLE_ACCENT = '#161327';
export const PARCHMENT = '#ece6d8';
export const MUTED = '#928dad';
export const LILAC = '#bcb6dc';

// Deep-indigo screen backdrop (radial), the signature of the Violet Mist screen.
export const NAVY_BG =
  'radial-gradient(ellipse 92% 58% at 50% 22%, #25224a 0%, #1a1736 52%, #141228 100%)';
