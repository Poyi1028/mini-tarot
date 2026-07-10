'use client';

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MUTED, PARCHMENT } from '@/lib/constants';
import { EASE, DUR, SPRING_TAP, TAP } from '@/lib/motion';
import { QUOTES, type Quote } from '@/lib/quotes';
import {
  dateDisplay,
  prepareDailyDraw,
  saveDailyDraw,
  type PreparedDailyDraw,
} from '@/lib/daily';
import NightSky from './decor/NightSky';
import IconEntry from './decor/IconEntry';
import CardFlip from './CardFlip';
import CardDetailImmersive from './CardDetailImmersive';

// 首頁 = 每日神諭舞台。每日牌佔據中央主視覺，引言退居為氛圍文字，
// 占卜與牌庫則固定收在頁尾，讓首頁一眼只有一個明確焦點。
const HOME_BG = `
  linear-gradient(180deg, #0c0b11 0%, #0a0910 55%, #08070d 100%)
`;

const DAILY_CARD_W = 184;
const DAILY_CARD_H = 323;
const DAILY_CHARGE_MS = 1400;

export default function HomeScreen({
  onStart,
  onOpenDeck,
}: {
  onStart: () => void;
  onOpenDeck: () => void;
}) {
  // 隨機挑一句引言 —— 只在 client 端 mount 後挑（Math.random 不能進 render，
  // 否則 SSR 與 client 首屏不一致會 hydration mismatch）。挑定後再淡入。
  const [quote, setQuote] = useState<Quote | null>(null);
  const [dailyState, setDailyState] = useState<PreparedDailyDraw | null>(null);
  const [dailyFlipped, setDailyFlipped] = useState(false);
  const [dailyRevealed, setDailyRevealed] = useState(false);
  const [dailyDetail, setDailyDetail] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(0);
  const chargeStartedAtRef = useRef(0);
  const chargeFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    const prepared = prepareDailyDraw();
    setDailyState(prepared);
    if (prepared.alreadyDrawn) {
      setDailyFlipped(true);
      setDailyRevealed(true);
    }
  }, []);

  useEffect(() => {
    if (!dailyFlipped || dailyRevealed) return;
    const timer = setTimeout(() => setDailyRevealed(true), 700);
    return () => clearTimeout(timer);
  }, [dailyFlipped, dailyRevealed]);

  const dailyDraw = dailyState?.draw;

  const clearChargeFrame = () => {
    if (chargeFrameRef.current === null) return;
    cancelAnimationFrame(chargeFrameRef.current);
    chargeFrameRef.current = null;
  };

  useEffect(() => clearChargeFrame, []);

  const resetDailyCharge = () => {
    clearChargeFrame();
    setIsCharging(false);
    setChargeProgress(0);
  };

  const revealDailyDraw = () => {
    if (!dailyDraw || dailyFlipped) return;

    clearChargeFrame();
    saveDailyDraw(dailyDraw);
    setDailyFlipped(true);
    setIsCharging(false);
    setChargeProgress(1);
  };

  const startDailyCharge = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dailyDraw || dailyFlipped) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    clearChargeFrame();
    chargeStartedAtRef.current = performance.now();
    setIsCharging(true);
    setChargeProgress(0);

    const tick = (now: number) => {
      const nextProgress = Math.min(
        (now - chargeStartedAtRef.current) / DAILY_CHARGE_MS,
        1,
      );

      setChargeProgress(nextProgress);

      if (nextProgress >= 1) {
        chargeFrameRef.current = null;
        revealDailyDraw();
        return;
      }

      chargeFrameRef.current = requestAnimationFrame(tick);
    };

    chargeFrameRef.current = requestAnimationFrame(tick);
  };

  const cancelDailyCharge = () => {
    if (dailyFlipped) return;
    resetDailyCharge();
  };

  const handleDailyKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (dailyFlipped || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    revealDailyDraw();
  };

  const handleDailyClick = () => {
    if (!dailyDraw) return;

    if (dailyRevealed) setDailyDetail(true);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center px-6 pb-4"
      style={{ background: HOME_BG, paddingTop: 24 }}
    >
      <NightSky />

      <motion.header
        className="relative z-[2] w-full shrink-0"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.slow, ease: EASE.out }}
      >
        <div className="flex items-end justify-between border-b border-gold/15 pb-3">
          <h1 className="font-serif text-[21px] font-light tracking-[6px] text-gold-soft">
            今日運勢
          </h1>
          {dailyDraw && (
            <span className="pb-0.5 font-display text-[10px] tracking-[2px] text-muted">
              {dateDisplay(dailyDraw.dateKey)}
            </span>
          )}
        </div>
      </motion.header>

      {/* 每日牌佔據頁面中央，翻牌前後都維持同一個清楚的互動焦點。 */}
      <motion.section
        className="relative z-[2] flex min-h-0 w-full flex-1 flex-col items-center justify-center py-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.slow, delay: 0.08, ease: EASE.out }}
        aria-labelledby="daily-oracle-title"
      >
        <span
          id="daily-oracle-title"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          今日運勢
        </span>

        <div
          className="relative shrink-0"
          style={{ width: DAILY_CARD_W, height: DAILY_CARD_H, perspective: 1400 }}
        >
          {dailyDraw && (
            <motion.button
              type="button"
              onClick={handleDailyClick}
              onContextMenu={(event) => event.preventDefault()}
              onKeyDown={handleDailyKeyDown}
              onPointerDown={startDailyCharge}
              onPointerUp={cancelDailyCharge}
              onPointerCancel={cancelDailyCharge}
              onPointerLeave={cancelDailyCharge}
              whileTap={TAP}
              transition={SPRING_TAP}
              className="relative block h-full w-full cursor-pointer touch-none select-none rounded-[14px] bg-transparent p-0"
              aria-describedby="daily-oracle-status"
              aria-label={
                dailyRevealed
                  ? `查看${dailyDraw.card.cn}牌義`
                  : '長按揭開今日運勢'
              }
            >
              <motion.div
                className="h-full w-full"
                animate={{ scale: isCharging ? 1.025 : 1 }}
                transition={{ duration: 0.2, ease: EASE.out }}
              >
                <CardFlip
                  card={dailyDraw.card}
                  reversed={dailyDraw.reversed}
                  flipped={dailyFlipped}
                  w={DAILY_CARD_W}
                  h={DAILY_CARD_H}
                />
              </motion.div>

              {!dailyFlipped && (
                <>
                  <motion.span
                    className="pointer-events-none absolute -inset-2 rounded-[18px] border border-gold/25"
                    style={{
                      boxShadow: `0 0 ${8 + chargeProgress * 18}px rgba(218, 186, 107, ${
                        0.18 + chargeProgress * 0.26
                      })`,
                    }}
                    animate={{ opacity: isCharging ? 1 : 0 }}
                    transition={{ duration: 0.18, ease: EASE.out }}
                  />
                  <motion.span
                    className="pointer-events-none absolute -bottom-5 left-0 h-px rounded-full bg-gold/85"
                    style={{ width: `${chargeProgress * 100}%` }}
                    animate={{ opacity: isCharging ? 1 : 0 }}
                    transition={{ duration: 0.12, ease: EASE.out }}
                  />
                </>
              )}
            </motion.button>
          )}
        </div>

        <div
          id="daily-oracle-status"
          className="mt-3 flex min-h-10 flex-col items-center justify-center text-center"
          aria-live="polite"
        >
          {dailyRevealed && dailyDraw ? (
            <motion.button
              type="button"
              onClick={() => setDailyDetail(true)}
              whileTap={TAP}
              transition={SPRING_TAP}
              className="group flex min-h-10 flex-col items-center justify-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="font-serif text-[15px] tracking-[4px] text-gold-soft">
                {dailyDraw.card.cn}
                {dailyDraw.reversed ? '・逆位' : ''}
              </span>
            </motion.button>
          ) : (
            <>
              <span className="text-[11px] tracking-[3.5px] text-gold-soft/80">
                {isCharging ? '凝聚中...' : '長按，凝聚今日訊息'}
              </span>
            </>
          )}
        </div>
      </motion.section>

      {/* 引言只保留一個安靜的停頓，不再與每日牌競爭視覺重量。 */}
      <div className="relative z-[2] mb-3 flex min-h-[78px] w-full shrink-0 items-center justify-center">
        {quote && (
          <motion.blockquote
            className="w-full max-w-[310px]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.slow, delay: 0.18, ease: EASE.out }}
          >
            <p
              className="whitespace-pre-line text-left font-serif text-[17px] font-light leading-[1.8] tracking-[1.2px]"
              style={{ color: PARCHMENT }}
            >
              {quote.text}
            </p>
            <footer
              className="mt-1 text-right text-[11px] tracking-[1.5px]"
              style={{ color: MUTED }}
            >
              —— {quote.author}
              {quote.source ? `《${quote.source}》` : ''}
            </footer>
          </motion.blockquote>
        )}
      </div>

      {/* 頁尾把主行動與牌庫拉成同一導覽帶，層級仍低於每日牌。 */}
      <motion.footer
        className="relative z-[2] mt-2 flex w-full shrink-0 items-center justify-between border-t border-gold/15 pt-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.slow, delay: 0.28, ease: EASE.out }}
      >
        <motion.button
          type="button"
          onClick={onStart}
          whileTap={TAP}
          transition={SPRING_TAP}
          aria-label="開始占卜"
          className="group flex min-h-[68px] flex-col items-start justify-center px-1 text-left"
        >
          <span className="font-serif text-[18px] tracking-[5px] text-gold-soft">
            開始占卜
          </span>
          <span className="mt-2 h-px w-20 bg-gold/45 transition-[width,opacity] duration-200 group-active:w-14 group-active:opacity-60" />
        </motion.button>

        <IconEntry icon="/cards.svg" label="牌庫" ariaLabel="開啟牌庫" onClick={onOpenDeck} />
      </motion.footer>

      <AnimatePresence>
        {dailyDetail && dailyDraw && (
          <CardDetailImmersive
            card={dailyDraw.card}
            reversed={dailyDraw.reversed}
            onClose={() => setDailyDetail(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
