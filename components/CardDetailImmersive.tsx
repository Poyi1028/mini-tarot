'use client';

import { useEffect, useId, useRef } from 'react';
import { motion } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, MUTED, PARCHMENT } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import type { Card } from '@/lib/tarot-cards';
import OrnDivider from './decor/OrnDivider';

const TAP_MOVE_THRESHOLD = 8;
const TAP_SCROLL_THRESHOLD = 2;

type PointerStart = {
  id: number;
  x: number;
  y: number;
  scrollTop: number;
};

// 沉浸式牌義頁：牌面作為上方主視覺，現有牌名與牌義由圖像下緣向下閱讀。
// 點擊畫面任一處關閉。Spread、Daily 與 Deck 共用此元件。
export default function CardDetailImmersive({
  card,
  reversed = false,
  pos,
  onClose,
}: {
  card: Card;
  reversed?: boolean;
  pos?: { cn: string };
  onClose: () => void;
}) {
  const ts = '0 2px 14px rgba(5,4,10,0.88)';
  const keywords = reversed ? card.reversedKeywords : card.keywords;
  const meaning = reversed ? card.reversedMeaning : card.meaning;
  const titleId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<PointerStart | null>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const scroller = scrollerRef.current;

    scroller?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [onClose]);

  return (
    <motion.div
      ref={scrollerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="absolute inset-0 z-[100] overflow-x-hidden overflow-y-auto overscroll-contain"
      onPointerDown={(event) => {
        if (!event.isPrimary) return;

        pointerStartRef.current = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          scrollTop: event.currentTarget.scrollTop,
        };
      }}
      onPointerUp={(event) => {
        const start = pointerStartRef.current;
        pointerStartRef.current = null;

        if (!event.isPrimary || !start || start.id !== event.pointerId) return;

        const moved = Math.max(
          Math.abs(event.clientX - start.x),
          Math.abs(event.clientY - start.y),
        );
        const scrolled = Math.abs(event.currentTarget.scrollTop - start.scrollTop);

        if (moved <= TAP_MOVE_THRESHOLD && scrolled <= TAP_SCROLL_THRESHOLD) onClose();
      }}
      onPointerCancel={() => {
        pointerStartRef.current = null;
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.slow, ease: EASE.reveal }}
      style={{
        cursor: 'pointer',
        isolation: 'isolate',
        background: '#09090d',
        touchAction: 'pan-y',
      }}
    >
      {/* 高度隨裝置調整；只略微裁掉牌圖素材本身的細黑框。 */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(470px, 72dvh, 650px)' }}
      >
        <img
          src={card.img}
          alt={`${card.cn} ${card.en}`}
          draggable={false}
          className="pointer-events-none absolute object-cover"
          style={{
            inset: -2,
            width: 'calc(100% + 4px)',
            height: 'calc(100% + 4px)',
            objectPosition: 'center 30%',
            filter: 'brightness(0.94) saturate(0.94)',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(9,9,13,0.06) 0%, rgba(9,9,13,0) 48%, rgba(9,9,13,0.22) 62%, rgba(9,9,13,0.82) 84%, #09090d 100%)',
          }}
        />
      </div>

      {/* 牌名輕疊在圖像下緣，其餘資訊順著頁面自然向下排列。 */}
      <motion.div
        className="relative z-[3] px-6 text-left"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DUR.base, delay: 0.14, ease: EASE.out }}
        style={{
          marginTop: 'calc(-1 * clamp(128px, 18dvh, 166px))',
          paddingBottom: 'max(36px, env(safe-area-inset-bottom))',
        }}
      >
        <div
          className="font-display"
          style={{ fontSize: 12, letterSpacing: 3.5, color: GOLD, textShadow: ts }}
        >
          {pos?.cn ?? card.roman}
        </div>

        <div
          id={titleId}
          style={{
            marginTop: 5,
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 34,
            lineHeight: 1.15,
            letterSpacing: 7,
            color: PARCHMENT,
            textShadow: ts,
          }}
        >
          {card.cn}
        </div>

        <div
          style={{
            marginTop: 5,
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontSize: 18,
            letterSpacing: 1.2,
            color: GOLD_BRIGHT,
            textShadow: ts,
          }}
        >
          {card.en}
        </div>

        <div
          style={{
            marginTop: 11,
            fontFamily: 'var(--font-serif)',
            fontSize: 10,
            letterSpacing: 3.5,
            color: reversed ? MUTED : GOLD,
            textShadow: ts,
          }}
        >
          {reversed ? '逆 位' : '正 位'}
        </div>

        <OrnDivider w={112} color={GOLD} style={{ marginTop: 26 }} />

        <div
          style={{
            marginTop: 22,
            fontFamily: 'var(--font-serif)',
            fontSize: 13,
            lineHeight: 1.85,
            letterSpacing: 2,
            color: GOLD_BRIGHT,
            textShadow: ts,
          }}
        >
          {keywords.join(' · ')}
        </div>

        <p
          style={{
            margin: '16px 0 0',
            maxWidth: '22rem',
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 16,
            lineHeight: 2,
            letterSpacing: 0.5,
            color: 'rgba(236,230,216,0.92)',
            textShadow: ts,
          }}
        >
          {meaning}
        </p>

        <div
          style={{
            marginTop: 24,
            fontFamily: 'var(--font-serif)',
            fontSize: 10,
            letterSpacing: 3,
            color: MUTED,
            textShadow: ts,
          }}
        >
          輕 觸 任 意 處 關 閉
        </div>
      </motion.div>
    </motion.div>
  );
}
