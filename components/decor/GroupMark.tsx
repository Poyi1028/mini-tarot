import { GOLD } from '@/lib/constants';
import type { DeckGroup } from '@/lib/deck-groups';
import ElementGlyph from './ElementGlyph';
import SuitGlyph from '../SuitGlyph';

// The section mark for a deck group header: the suit glyph for the four minor
// suits, the alchemical element sparkle for the Major Arcana. Centralised here
// so consumers render <GroupMark grp> instead of branching on grp.id.
export default function GroupMark({ grp, size = 28, color = GOLD }: { grp: DeckGroup; size?: number; color?: string }) {
  if (grp.id === 'major') {
    return <ElementGlyph el={grp.element} size={size - 2} color={color} sw={1.3} />;
  }
  return (
    <span style={{ color }}>
      <SuitGlyph suit={grp.id} size={size} />
    </span>
  );
}
