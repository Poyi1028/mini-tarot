'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, gold } from '@/lib/constants';
import { EASE, DUR, TAP, SPRING_TAP } from '@/lib/motion';
import Starfield from './Starfield';
import Constellation from './decor/Constellation';
import TextAction from './decor/TextAction';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  cx: number; // offset toward the gathering centre
  cy: number;
  delay: number;
  dur: number;
}

type Phase = 'input' | 'dissolve';
// The sync overlay's life: stars+lines draw in, the centre blooms, then the
// whole thing sinks into near-black so the screen swap reads as dark→dark.
type Stage = 'forming' | 'bloom' | 'exit';

function SyncOverlay({ stage }: { stage: Stage }) {
  const exiting = stage === 'exit';
  return (
    <motion.div
      className="absolute inset-0 z-[5] flex flex-col items-center justify-center p-10 text-center backdrop-blur-[2px]"
      style={{
        background: exiting
          ? 'radial-gradient(ellipse at center, rgba(9,8,15,0.98) 0%, #07060c 70%)'
          : 'radial-gradient(ellipse at center, rgba(26,24,42,0.6) 0%, rgba(9,8,15,0.97) 70%)',
        transition: 'background 600ms ease',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DUR.base, ease: EASE.out }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.5, ease: EASE.inOut }}
      >
        <div className="relative mb-8 h-[140px] w-[180px]">
          <Constellation stage={stage} />
        </div>
        <motion.div
          className="font-serif text-sm font-light leading-[2] tracking-[5px] text-parchment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9, ease: EASE.out }}
        >
          與 星 辰 同 步
          <span className="inline-block w-8 text-left">
            <span className="dotpulse" />
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function InputScreen({
  onSubmit,
  onBack,
}: {
  onSubmit: (q: string) => void;
  onBack: () => void;
}) {
  const [q, setQ] = useState('');
  const [phase, setPhase] = useState<Phase>('input');
  const measureRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showSync, setShowSync] = useState(false);
  const [stage, setStage] = useState<Stage>('forming');
  const [focused, setFocused] = useState(false);

  // Once the char-span layer is rendered (phase === 'dissolve'), measure each
  // glyph and spawn a cluster of light dots from its position. Each mote then
  // drifts INWARD toward a point near the container's upper-centre — the same
  // region where the constellation forms — so "words → light → stars" reads as
  // one continuous gesture instead of a scatter followed by a separate sigil.
  useLayoutEffect(() => {
    if (phase !== 'dissolve') return;
    const container = measureRef.current;
    if (!container) return;
    const charSpans = container.querySelectorAll<HTMLSpanElement>('span[data-c]');
    const cBox = container.getBoundingClientRect();
    const scale = container.offsetWidth ? cBox.width / container.offsetWidth : 1;
    const targetX = container.offsetWidth / 2;
    const targetY = container.offsetHeight * 0.25;
    const pts: Particle[] = [];
    let pid = 0;
    charSpans.forEach((el, idx) => {
      if (el.dataset.c === ' ') return;
      const b = el.getBoundingClientRect();
      const gw = b.width / scale;
      const gh = b.height / scale;
      const baseX = (b.left - cBox.left) / scale + gw / 2;
      const baseY = (b.top - cBox.top) / scale + gh / 2;
      const charDelay = 160 + Math.min(idx, 12) * 46;
      const dots = 5 + Math.floor(Math.random() * 4);
      for (let k = 0; k < dots; k++) {
        const mx = baseX + (Math.random() - 0.5) * gw * 0.6;
        const my = baseY + (Math.random() - 0.5) * gh * 0.6;
        pts.push({
          id: pid++,
          x: mx,
          y: my,
          size: 1.5 + Math.random() * 3,
          cx: targetX - mx + (Math.random() - 0.5) * 18,
          cy: targetY - my + (Math.random() - 0.5) * 18,
          delay: charDelay + Math.random() * 200,
          dur: 1300 + Math.random() * 500,
        });
      }
    });
    setParticles(pts);
  }, [phase]);

  function ignite() {
    if (!q.trim() || phase !== 'input') return;
    setPhase('dissolve');
    // One continuous ~4.3s arc: the words gather into light (mote-gather), the
    // constellation unhurriedly wires itself up, the centre blooms ("synced"),
    // then the overlay sinks to near-black and we hand off dark→dark to the
    // shuffle. The bloom waits for the (now slower) crown to finish drawing.
    setTimeout(() => setShowSync(true), 1300);
    setTimeout(() => setStage('bloom'), 3300);
    setTimeout(() => setStage('exit'), 3800);
    setTimeout(() => onSubmit(q.trim()), 4300);
  }

  const isInput = phase === 'input';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-7 py-[64px]">
      <Starfield density={32} seed={8} />

      {/* Input area — AI-style composer. Bar + box live in one flex column so
          the GROUP's midline lands on the screen centre (the outer wrapper's
          justify-center), instead of the box being centred with the bar
          floating off above it. */}
      <div
        className="relative z-[2] flex w-full max-w-[360px] flex-col items-center"
        style={{ pointerEvents: isInput ? 'auto' : 'none' }}
      >
        {/* Focal bar — sits in flow above the box and counts toward centring.
            Its central sun animates from inside the SVG (see public/bar.svg). */}
        <motion.div
          className="pointer-events-none mb-7 flex w-full justify-center"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: isInput ? 0.95 : 0, y: 0 }}
          transition={{ duration: DUR.base, delay: 0.1, ease: EASE.out }}
        >
          <img
            src="/bar.svg"
            alt=""
            aria-hidden
            draggable={false}
            className="w-[112%] max-w-[400px]"
          />
        </motion.div>

        <div
          className="relative w-full rounded-[26px] transition-shadow duration-300"
          style={{
            border: `1px solid ${gold(focused ? 0.42 : 0.22)}`,
            background:
              'linear-gradient(160deg, rgba(28,26,48,0.52) 0%, rgba(14,13,24,0.72) 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: focused
              ? `0 10px 28px rgba(0,0,0,0.36), 0 0 18px ${gold(0.1)}`
              : '0 8px 22px rgba(0,0,0,0.3)',
          }}
        >
          <div
            ref={measureRef}
            className="relative px-5 pb-[50px] pt-[14px] font-serif text-[16px] leading-[1.8] tracking-[1px] text-parchment"
          >
            {isInput ? (
              <textarea
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    ignite();
                  }
                }}
                placeholder="寫下你心中的疑問"
                maxLength={60}
                rows={1}
                className="h-[40px] w-full resize-none border-none bg-transparent text-left font-serif text-[16px] leading-[1.8] tracking-[1px] text-parchment caret-gold outline-none"
              />
            ) : (
              <div className="min-h-[40px] whitespace-pre-wrap break-words text-left">
                {Array.from(q).map((ch, i) => (
                  <span
                    key={i}
                    data-c={ch}
                    style={{
                      opacity: phase === 'dissolve' ? 0 : 1,
                      filter: phase === 'dissolve' ? 'blur(3px)' : 'blur(0px)',
                      transition: `opacity 950ms ease-out ${200 + Math.min(i, 12) * 52}ms, filter 950ms ease-out ${200 + Math.min(i, 12) * 52}ms`,
                    }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </div>
            )}

            {/* Light-dot particles */}
            {!isInput && (
              <div className="pointer-events-none absolute inset-0">
                {particles.map((p) => (
                  <span
                    key={p.id}
                    className="absolute rounded-full"
                    style={
                      {
                        left: p.x,
                        top: p.y,
                        width: p.size,
                        height: p.size,
                        background: GOLD,
                        boxShadow: `0 0 ${p.size * 2}px ${p.size}px ${GOLD}`,
                        transform: 'translate(-50%,-50%)',
                        animation: `mote-gather ${p.dur}ms cubic-bezier(.3,0,.2,1) ${p.delay}ms forwards`,
                        '--cx': `${p.cx}px`,
                        '--cy': `${p.cy}px`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* embedded send button — a quiet gold "seal" rather than a loud AI
              composer FAB: a hairline gold ring over a faint translucent fill,
              marked with a thin celestial caret + sparkle ("send onward"). */}
          <motion.button
            onClick={ignite}
            disabled={!q.trim() || !isInput}
            aria-label="注入意念"
            whileTap={q.trim() ? TAP : undefined}
            transition={SPRING_TAP}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full transition-[opacity,box-shadow,background,border-color] duration-200 disabled:cursor-default"
            style={{
              background: q.trim() ? gold(0.14) : gold(0.05),
              border: `1px solid ${q.trim() ? gold(0.85) : gold(0.22)}`,
              boxShadow: q.trim() ? `0 0 18px ${gold(0.3)}` : 'none',
              opacity: q.trim() ? 1 : 0.5,
              cursor: q.trim() ? 'pointer' : 'default',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              {/* upward caret — the "onward" gesture, thin and refined */}
              <path
                d="M6 14l6-6 6 6"
                stroke={q.trim() ? GOLD_BRIGHT : GOLD}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* small 4-point sparkle cresting above it */}
              <path
                d="M12 6.5V3.2M12 6.5l1.6-1.1M12 6.5l-1.6-1.1"
                stroke={q.trim() ? GOLD_BRIGHT : GOLD}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* 返回首頁 —— 釘在畫面底部，脫離置中流，讓對話框保持正中。
          與 SpreadScreen 收束處同款 rite（金線 + ○ + 連結）；
          輸入溶解時淡出、停用點擊。 */}
      <div
        className="absolute bottom-[26px] left-0 right-0 z-[4] flex flex-col items-center"
        style={{
          opacity: isInput ? 1 : 0,
          pointerEvents: isInput ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
      >
        <TextAction label="回到首頁" onClick={onBack} ariaLabel="回到首頁" />
      </div>

      <AnimatePresence>{showSync && <SyncOverlay stage={stage} />}</AnimatePresence>
    </div>
  );
}
