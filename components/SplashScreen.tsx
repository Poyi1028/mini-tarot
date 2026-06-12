'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GOLD, PARCHMENT, gold } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import NightSky from './decor/NightSky';
import CrystalBall from './CrystalBall';

// 開場 splash —— 品牌瞬間，不是強制等待。水晶 + 標題在純黑金底上緩緩浮現，
// 然後「自己」退場交棒給 home（dark → dark，由 TarotApp 的 AnimatePresence
// 淡接）。退場時機綁字體載入：等到字體就緒、且至少停留一個最短品牌秒數後才走，
// 把首屏的 FOUT/無樣式閃爍藏在這層底下。點一下可立即略過。
const SPLASH_BG = `
  radial-gradient(ellipse 80% 55% at 50% 0%, ${gold(0.025)}, transparent 70%),
  linear-gradient(180deg, #0c0b11 0%, #0a0910 55%, #08070d 100%)
`;

const MIN_HOLD = 2000; // 最短品牌停留（ms）
const SAFETY_CAP = 3000; // 字體永遠 ready 不了時的保險上限（ms）

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const firedRef = useRef(false);

  useEffect(() => {
    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      onDone();
    };

    const minHold = new Promise<void>((r) => setTimeout(r, MIN_HOLD));
    const fontsReady =
      typeof document !== 'undefined' && document.fonts?.ready
        ? document.fonts.ready.then(() => undefined)
        : Promise.resolve();
    const cap = new Promise<void>((r) => setTimeout(r, SAFETY_CAP));

    // 取「最短停留 ∧ 字體就緒」與「保險上限」之間先到者。
    Promise.race([Promise.all([minHold, fontsReady]).then(() => undefined), cap]).then(fire);
  }, [onDone]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="進入"
      onClick={onDone}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDone();
        }
      }}
      className="absolute inset-0 flex cursor-pointer flex-col items-center px-8 pb-[12vh] pt-[14vh] outline-none"
      style={{ background: SPLASH_BG }}
    >
      <NightSky />

      {/* crystal ball — occupies the upper space */}
      <motion.div
        className="relative z-[2] flex flex-1 items-center justify-center"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DUR.slow, ease: EASE.out }}
      >
        <CrystalBall size={150} />
      </motion.div>

      {/* title — anchored toward the bottom */}
      <motion.div
        className="relative z-[2] text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.slow, delay: 0.3, ease: EASE.out }}
      >
        <div
          className="whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 30,
            fontWeight: 500,
            lineHeight: 1.28,
            letterSpacing: 6,
            paddingLeft: 6,
            textTransform: 'uppercase',
            color: PARCHMENT,
          }}
        >
          Mini Tarot
        </div>

        {/* plain hairline rule — minimal, in the reference's spirit */}
        <span
          className="mx-auto mt-6 block h-px w-14"
          style={{
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
            opacity: 0.55,
          }}
        />
      </motion.div>
    </div>
  );
}
