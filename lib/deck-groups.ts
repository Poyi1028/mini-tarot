// Deck library grouping — derived entirely from the existing card catalog in
// lib/tarot-cards.ts (no duplicated card data). Adds an alchemical `element`
// per group for the deck tabs / element headers.
import { MAJOR_ARCANA, MINOR_ARCANA } from './tarot-cards';
import type { Card, Suit } from './tarot-cards';
import type { Element } from '@/components/decor/ElementGlyph';

export type DeckGroupId = 'major' | Suit;

// Intersection (not Omit) preserves the MajorCard | MinorCard discriminated
// union — so `suit` survives on the minor branch. `badge` is the short label
// shown under each thumbnail: a numeral for majors, the rank for minors (the
// card's own `roman` is the suit symbol, shared by all 14 — not per-card).
export type DeckCard = (Card & { element: Element; badge: string });

export interface DeckGroup {
  id: DeckGroupId;
  cn: string;
  en: string;
  element: Element;
  count: number;
}

const SUIT_ELEMENT: Record<Suit, Element> = {
  cups: '水',
  pentacles: '土',
  swords: '風',
  wands: '火',
};

// Rank labels for minor cards (Ace–Ten, then court), matching the design稿.
const RANK_BADGE = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'P', 'Kn', 'Q', 'K'];

const majors: DeckCard[] = MAJOR_ARCANA.map((c) => ({ ...c, element: '靈', badge: c.roman }));
const bySuit = (suit: Suit): DeckCard[] =>
  MINOR_ARCANA.filter((c) => c.arcana === 'minor' && c.suit === suit).map((c, i) => ({
    ...c,
    element: SUIT_ELEMENT[suit],
    badge: RANK_BADGE[i] ?? c.roman,
  }));

// Grouped cards keyed by tab id.
export const DECK: Record<DeckGroupId, DeckCard[]> = {
  major: majors,
  cups: bySuit('cups'),
  pentacles: bySuit('pentacles'),
  swords: bySuit('swords'),
  wands: bySuit('wands'),
};

// Tab metadata — order matters (drives the tab strip).
export const DECK_GROUPS: DeckGroup[] = [
  { id: 'major', cn: '大牌', en: 'Major', element: '靈', count: DECK.major.length },
  { id: 'cups', cn: '聖杯', en: 'Cups', element: '水', count: DECK.cups.length },
  { id: 'pentacles', cn: '錢幣', en: 'Pentacles', element: '土', count: DECK.pentacles.length },
  { id: 'swords', cn: '寶劍', en: 'Swords', element: '風', count: DECK.swords.length },
  { id: 'wands', cn: '權杖', en: 'Wands', element: '火', count: DECK.wands.length },
];
