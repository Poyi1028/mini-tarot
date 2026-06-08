'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { GOLD, GOLD_DIM, MUTED, PARCHMENT } from '@/lib/constants';
import { EASE, TAP, SPRING_TAP } from '@/lib/motion';
import { DECK, DECK_GROUPS } from '@/lib/deck-groups';
import type { DeckCard, DeckGroupId } from '@/lib/deck-groups';
import Starfield from './Starfield';
import OrnDivider from './decor/OrnDivider';
import BackButton from './decor/BackButton';
import GroupMark from './decor/GroupMark';
import FramedCardImg from './decor/FramedCardImg';
import DeckCardDetail from './DeckCardDetail';

// Grid entrance — a parent that releases its thumbnails in a gentle stagger so
// the page assembles itself instead of snapping in all at once. Keyed by tab so
// it replays on each tab switch.
const GRID_CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } },
};
const GRID_ITEM: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.out } },
};

// Text-underline tab strip (大牌 / 聖杯 / 錢幣 / 寶劍 / 權杖).
function DeckTabs({ tab, setTab }: { tab: DeckGroupId; setTab: (id: DeckGroupId) => void }) {
  return (
    // Left padding clears the back button (sits at left-3.5, ~30px wide) so the
    // first tab no longer overlaps the arrow; right padding keeps the strip
    // optically balanced against it.
    <div className="flex justify-between pl-[46px] pr-[18px]">
      {DECK_GROUPS.map((grp) => {
        const on = tab === grp.id;
        return (
          <motion.button
            key={grp.id}
            onClick={() => setTab(grp.id)}
            whileTap={TAP}
            transition={SPRING_TAP}
            className="flex flex-col items-center gap-[7px] border-none bg-transparent p-0"
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 300,
                fontSize: 13,
                letterSpacing: 1.5,
                color: on ? PARCHMENT : MUTED,
              }}
            >
              {grp.cn}
            </span>
            <span
              className="transition-[width] duration-300"
              style={{
                width: on ? 14 : 0,
                height: 1.5,
                background: GOLD,
                boxShadow: on ? `0 0 4px ${GOLD}` : 'none',
              }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

// Framed card thumbnail. A staggered entrance item (variants inherited from the
// grid parent); the artwork itself fades in on load so lazy images don't pop.
function DeckThumb({ card, onClick }: { card: DeckCard; onClick: () => void }) {
  return (
    <motion.div variants={GRID_ITEM} className="flex flex-col items-center gap-[7px]">
      <motion.button
        onClick={onClick}
        whileTap={TAP}
        transition={SPRING_TAP}
        className="block w-full border-none bg-transparent p-0"
      >
        <FramedCardImg
          src={card.img}
          alt={`${card.cn} ${card.en}`}
          radius={5}
          ringWidth={2}
          boxShadow="0 3px 10px rgba(0,0,0,0.45)"
          lazy
        />
      </motion.button>
      <div className="flex flex-col items-center text-center leading-[1.3]">
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 11.5, letterSpacing: 1, color: PARCHMENT }}>
          {card.cn}
        </div>
        <div className="font-display" style={{ fontSize: 8, letterSpacing: 1.5, color: GOLD_DIM, marginTop: 2 }}>
          {card.badge}
        </div>
      </div>
    </motion.div>
  );
}

export default function DeckScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<DeckGroupId>('major');
  const [detail, setDetail] = useState<DeckCard | null>(null);
  const cards = DECK[tab];
  const grp = DECK_GROUPS.find((x) => x.id === tab)!;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Starfield density={26} seed={9} />

      {/* back */}
      <BackButton onClick={onBack} />

      {/* tabs */}
      <div className="absolute left-0 right-0 top-[52px] z-10">
        <DeckTabs tab={tab} setTab={setTab} />
      </div>

      {/* scroll body */}
      <div className="absolute bottom-0 left-0 right-0 top-[94px] overflow-y-auto pb-9">
        {/* element header — fades in on each tab switch so the change of suit
            doesn't read as an abrupt content swap. */}
        <motion.div
          key={`head-${tab}`}
          className="flex flex-col items-center px-0 pb-3.5 pt-[18px]"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE.out }}
        >
          {/* Section mark — the suit symbol's home (not the card thumbnails). */}
          <GroupMark grp={grp} />
          <div
            className="mt-[11px] italic"
            style={{ fontFamily: 'var(--font-cormorant)', fontSize: 23, letterSpacing: 2, color: PARCHMENT }}
          >
            {grp.en}
          </div>
          <div className="font-display mt-1 pl-1 text-[9px] tracking-[3px]" style={{ color: MUTED }}>
            {grp.cn} · {grp.count} 張
          </div>
          <OrnDivider w={40} color={GOLD} style={{ marginTop: 12 }} />
        </motion.div>

        {/* grid — staggered entrance, replayed per tab via the key */}
        <motion.div
          key={`grid-${tab}`}
          className="grid grid-cols-3 gap-x-[13px] gap-y-4 px-5 pt-1.5"
          variants={GRID_CONTAINER}
          initial="hidden"
          animate="show"
        >
          {cards.map((c) => (
            <DeckThumb key={c.num} card={c} onClick={() => setDetail(c)} />
          ))}
        </motion.div>
      </div>

      {/* bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-10"
        style={{ background: 'linear-gradient(to top, rgba(11,10,18,0.9), transparent)' }}
      />

      <AnimatePresence>
        {detail && <DeckCardDetail card={detail} onBack={() => setDetail(null)} />}
      </AnimatePresence>
    </div>
  );
}
