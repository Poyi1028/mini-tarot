'use client';

import { useEffect, useId, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, MUTED, PARCHMENT, gold } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import type { Card } from '@/lib/tarot-cards';
import BackButton from './decor/BackButton';
import OrnDivider from './decor/OrnDivider';

const TAP_MOVE_THRESHOLD = 8;
const TAP_SCROLL_THRESHOLD = 2;

type PointerStart = {
  id: number;
  x: number;
  y: number;
  scrollTop: number;
};

// 沉浸式牌義頁：完整牌面固定在首屏，牌名與牌義由下緣的透明閱讀層浮現。
// 點擊畫面任意處或返回按鈕關閉；捲動手勢不會誤關閉。Spread、Daily 與 Deck 共用此元件。
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
  const descriptionId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<PointerStart | null>(null);
  const reduceMotion = useReducedMotion();

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
      aria-describedby={descriptionId}
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
      {/* 牌面固定在完整首屏；內容向上捲動時，圖像仍留在後方。 */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <motion.img
          src={card.img}
          alt={`${card.cn} ${card.en} ${reversed ? '逆位' : '正位'}`}
          draggable={false}
          className="pointer-events-none absolute object-cover"
          initial={{ opacity: 0.78, scale: reduceMotion ? 1.04 : 1.075 }}
          animate={{ opacity: 1, scale: 1.04 }}
          transition={{ duration: reduceMotion ? DUR.fast : DUR.slow, ease: EASE.reveal }}
          style={{
            inset: -3,
            width: 'calc(100% + 6px)',
            height: 'calc(100% + 6px)',
            objectPosition: 'center 33%',
            filter: 'brightness(0.92) saturate(0.92) contrast(1.02)',
          }}
        />

        {/* 保留中央人物的亮度，只在四周與文字所在的下半部壓暗。 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 86% 64% at 50% 34%, rgba(9,9,13,0) 34%, rgba(9,9,13,0.2) 72%, rgba(9,9,13,0.5) 100%), linear-gradient(180deg, rgba(9,9,13,0.2) 0%, rgba(9,9,13,0) 25%, rgba(9,9,13,0.08) 48%, rgba(9,9,13,0.48) 70%, rgba(9,9,13,0.92) 100%)',
          }}
        />

        {/* 返回按鈕有獨立點擊區，不讓事件再觸發背景的短點擊關閉。 */}
        <div
          className="absolute left-0 top-0 z-20 h-28 w-20"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
        >
          <BackButton onClick={onClose} />
        </div>
      </div>

      {/* 無邊框閱讀層從牌面下半部升起；內容較長時自然延伸成閱讀頁。 */}
      <motion.section
        className="relative z-[3] min-h-[52dvh] px-5 text-left sm:px-6"
        initial={{ y: reduceMotion ? 0 : 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: reduceMotion ? DUR.fast : DUR.base,
          delay: reduceMotion ? 0 : 0.12,
          ease: EASE.out,
        }}
        style={{
          marginTop: '-52dvh',
          paddingTop: 'clamp(80px, 11dvh, 108px)',
          paddingBottom: 'max(42px, env(safe-area-inset-bottom))',
          background:
            'linear-gradient(180deg, rgba(9,9,13,0) 0%, rgba(9,9,13,0.04) 18%, rgba(9,9,13,0.16) 36%, rgba(9,9,13,0.42) 58%, rgba(9,9,13,0.76) 80%, rgba(9,9,13,0.96) 96%, #09090d 100%)',
        }}
      >
        <motion.div
          className="flex items-center gap-2 font-display"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.fast, delay: reduceMotion ? 0 : 0.18, ease: EASE.out }}
          style={{ fontSize: 11, letterSpacing: 3.2, color: GOLD, textShadow: ts }}
        >
          {pos?.cn ?? card.roman}
          <span className="h-px w-7" style={{ background: gold(0.58) }} />
          <span style={{ color: reversed ? MUTED : GOLD }}>{reversed ? '逆 位' : '正 位'}</span>
        </motion.div>

        <motion.div
          id={titleId}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, delay: reduceMotion ? 0 : 0.22, ease: EASE.out }}
          style={{
            marginTop: 7,
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 'clamp(34px, 9.2vw, 40px)',
            lineHeight: 1.1,
            letterSpacing: 8,
            color: PARCHMENT,
            textShadow: ts,
          }}
        >
          {card.cn}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, delay: reduceMotion ? 0 : 0.27, ease: EASE.out }}
          style={{
            marginTop: 6,
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontSize: 19,
            letterSpacing: 1.4,
            color: GOLD_BRIGHT,
            textShadow: ts,
          }}
        >
          {card.en}
        </motion.div>

        <OrnDivider w={112} color={GOLD} style={{ marginTop: 22 }} />

        <ul
          aria-label={`${reversed ? '逆位' : '正位'}關鍵字`}
          className="mt-5 flex list-none flex-wrap gap-2 p-0"
        >
          {keywords.map((keyword, index) => (
            <motion.li
              key={keyword}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: DUR.fast,
                delay: reduceMotion ? 0 : 0.32 + index * 0.07,
                ease: EASE.out,
              }}
              className="rounded-full border px-3 py-1 font-serif"
              style={{
                borderColor: gold(0.22),
                background: 'rgba(10,9,16,0.38)',
                boxShadow: `inset 0 0 0 1px ${gold(0.035)}`,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                fontSize: 12,
                lineHeight: 1.5,
                letterSpacing: 2,
                color: GOLD_BRIGHT,
                textShadow: ts,
              }}
            >
              {keyword}
            </motion.li>
          ))}
        </ul>

        <motion.p
          id={descriptionId}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, delay: reduceMotion ? 0 : 0.48, ease: EASE.out }}
          style={{
            margin: '18px 0 0',
            maxWidth: '22rem',
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 'clamp(15px, 4.1vw, 17px)',
            lineHeight: 1.9,
            letterSpacing: 0.6,
            color: 'rgba(236,230,216,0.94)',
            textShadow: ts,
          }}
        >
          {meaning}
        </motion.p>

        <div
          aria-hidden="true"
          className="flex items-center gap-3"
          style={{
            marginTop: 26,
            color: MUTED,
          }}
        >
          <span className="h-px w-7" style={{ background: gold(0.24) }} />
          <span className="font-serif text-[9px] tracking-[3px]">輕 觸 任 意 處 關 閉</span>
        </div>
      </motion.section>
    </motion.div>
  );
}
