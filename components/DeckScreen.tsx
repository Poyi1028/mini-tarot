'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, GOLD_DIM, LILAC, MUTED, PARCHMENT } from '@/lib/constants';
import { DECK, DECK_GROUPS } from '@/lib/deck-groups';
import type { DeckCard, DeckGroupId } from '@/lib/deck-groups';
import Starfield from './Starfield';
import OrnDivider from './decor/OrnDivider';
import ElementGlyph from './decor/ElementGlyph';
import CardDetailImmersive from './CardDetailImmersive';

// Text-underline tab strip (大牌 / 聖杯 / 錢幣 / 寶劍 / 權杖).
function DeckTabs({ tab, setTab }: { tab: DeckGroupId; setTab: (id: DeckGroupId) => void }) {
  return (
    <div className="flex justify-between px-[22px]">
      {DECK_GROUPS.map((grp) => {
        const on = tab === grp.id;
        return (
          <button
            key={grp.id}
            onClick={() => setTab(grp.id)}
            className="flex flex-col items-center gap-[7px] border-none bg-transparent p-0"
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 300,
                fontSize: 14,
                letterSpacing: 2,
                color: on ? PARCHMENT : MUTED,
              }}
            >
              {grp.cn}
            </span>
            <span
              className="transition-[width] duration-300"
              style={{
                width: on ? 16 : 0,
                height: 1.5,
                background: GOLD,
                boxShadow: on ? `0 0 6px ${GOLD}` : 'none',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

// Framed card thumbnail.
function DeckThumb({ card, onClick }: { card: DeckCard; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-[7px]">
      <button onClick={onClick} className="block w-full border-none bg-transparent p-0">
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: '300 / 527',
            borderRadius: 5,
            border: `1px solid ${GOLD}`,
            boxShadow: '0 3px 10px rgba(0,0,0,0.45)',
          }}
        >
          <img
            src={card.img}
            alt={`${card.cn} ${card.en}`}
            draggable={false}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ borderRadius: 5, boxShadow: 'inset 0 0 0 2px rgba(216,189,143,0.22)' }}
          />
        </div>
      </button>
      <div className="text-center leading-[1.3]">
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 11.5, letterSpacing: 1, color: PARCHMENT }}>
          {card.cn}
        </div>
        <div className="font-display" style={{ fontSize: 8, letterSpacing: 1.5, color: GOLD_DIM, marginTop: 2 }}>
          {card.badge}
        </div>
      </div>
    </div>
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
      <button
        onClick={onBack}
        aria-label="返回"
        className="absolute left-3.5 top-[50px] z-20 flex h-[30px] w-[30px] items-center justify-center border-none bg-transparent"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={GOLD_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 3 L5 9 L11 15" />
        </svg>
      </button>

      {/* tabs */}
      <div className="absolute left-0 right-0 top-[52px] z-10">
        <DeckTabs tab={tab} setTab={setTab} />
      </div>

      {/* scroll body */}
      <div className="absolute bottom-0 left-0 right-0 top-[94px] overflow-y-auto pb-9">
        {/* element header */}
        <div className="flex flex-col items-center px-0 pb-3.5 pt-[18px]">
          <ElementGlyph el={grp.element} size={26} color={GOLD} sw={1.3} />
          <div
            className="mt-[11px] italic"
            style={{ fontFamily: 'var(--font-cormorant)', fontSize: 26, letterSpacing: 2, color: PARCHMENT }}
          >
            {grp.en}
          </div>
          <div className="font-display mt-1 pl-1 text-[9.5px] tracking-[4px]" style={{ color: MUTED }}>
            {grp.cn} · {grp.count} 張
          </div>
          <OrnDivider w={40} color={GOLD} style={{ marginTop: 12 }} />
        </div>

        {/* grid */}
        <div className="grid grid-cols-3 gap-x-[13px] gap-y-4 px-5 pt-1.5">
          {cards.map((c) => (
            <DeckThumb key={c.num} card={c} onClick={() => setDetail(c)} />
          ))}
        </div>
      </div>

      {/* bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-10"
        style={{ background: 'linear-gradient(to top, rgba(20,18,40,0.85), transparent)' }}
      />

      <AnimatePresence>
        {detail && <CardDetailImmersive card={detail} onClose={() => setDetail(null)} />}
      </AnimatePresence>
    </div>
  );
}
