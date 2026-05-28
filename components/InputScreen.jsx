'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOLD, GOLD_SOFT } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import Starfield from './Starfield';

function trianglePath(cx, cy, r, rot) {
  const pts = [0, 1, 2].map((i) => {
    const a = rot - Math.PI / 2 + (i * Math.PI * 2) / 3;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]} L ${pts[2][0]} ${pts[2][1]} Z`;
}

function SyncSigil() {
  return (
    <svg viewBox="0 0 110 110" width="110" height="110" className="overflow-visible">
      <g className="animate-sigil-spin" style={{ transformOrigin: '55px 55px' }}>
        <circle cx="55" cy="55" r="50" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.5" />
        <circle
          cx="55"
          cy="55"
          r="40"
          fill="none"
          stroke={GOLD_SOFT}
          strokeWidth="0.4"
          strokeDasharray="2 3"
          opacity="0.6"
        />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          const x = 55 + Math.cos(a) * 50;
          const y = 55 + Math.sin(a) * 50;
          return <circle key={i} cx={x} cy={y} r="1.2" fill={GOLD} />;
        })}
      </g>
      <g className="animate-sigil-spin-r" style={{ transformOrigin: '55px 55px' }}>
        <path d={trianglePath(55, 55, 28, 0)} fill="none" stroke={GOLD} strokeWidth="0.6" />
        <path d={trianglePath(55, 55, 28, Math.PI)} fill="none" stroke={GOLD} strokeWidth="0.6" />
      </g>
      <circle cx="55" cy="55" r="3" fill={GOLD}>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function SyncOverlay() {
  return (
    <motion.div
      className="absolute inset-0 z-[5] flex flex-col items-center justify-center p-10 text-center backdrop-blur-[2px]"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(15, 14, 11, 0.6) 0%, rgba(7, 7, 7, 0.95) 70%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE.out }}
    >
      <div className="relative mb-9 h-[110px] w-[110px]">
        <SyncSigil />
      </div>
      <motion.div
        className="font-serif text-base font-light leading-[2] tracking-[6px] text-parchment"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4, ease: EASE.out }}
      >
        正在將你的意念
        <br />
        與 星 辰 同 步
        <span className="inline-block w-8 text-left">
          <span className="dotpulse" />
        </span>
      </motion.div>
    </motion.div>
  );
}

function CornerFrame({ visible }) {
  const corner = (className) => (
    <div className={`absolute h-3.5 w-3.5 ${className}`}>
      <div className="absolute left-0 top-0 h-px w-3.5 bg-gold-soft" />
      <div className="absolute left-0 top-0 h-3.5 w-px bg-gold-soft" />
    </div>
  );
  return (
    <div
      className="pointer-events-none absolute inset-0 transition-opacity duration-[600ms]"
      style={{ opacity: visible ? 0.85 : 0 }}
    >
      {corner('left-0 top-0')}
      {corner('right-0 top-0 rotate-90')}
      {corner('bottom-0 right-0 rotate-180')}
      {corner('bottom-0 left-0 -rotate-90')}
    </div>
  );
}

export default function InputScreen({ onSubmit }) {
  const [q, setQ] = useState('');
  const [phase, setPhase] = useState('input'); // input | dissolve | sync
  const measureRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [showSync, setShowSync] = useState(false);

  // Once the char-span layer is rendered (phase === 'dissolve'), measure each
  // glyph and spawn a cluster of light dots from its position.
  useLayoutEffect(() => {
    if (phase !== 'dissolve') return;
    const container = measureRef.current;
    if (!container) return;
    const charSpans = container.querySelectorAll('span[data-c]');
    const cBox = container.getBoundingClientRect();
    // The whole device frame is rendered inside a CSS transform: scale() (see
    // FitToViewport), so getBoundingClientRect returns *scaled* screen pixels.
    // The dots' left/top are local pixels that the frame scales again, so we
    // must divide measured deltas by the live scale to land on each glyph.
    const scale = container.offsetWidth ? cBox.width / container.offsetWidth : 1;
    const pts = [];
    let pid = 0;
    charSpans.forEach((el, idx) => {
      if (el.dataset.c === ' ') return;
      const b = el.getBoundingClientRect();
      const gw = b.width / scale;
      const gh = b.height / scale;
      const baseX = (b.left - cBox.left) / scale + gw / 2;
      const baseY = (b.top - cBox.top) / scale + gh / 2;
      // Ignite each glyph's light in lockstep with that glyph's own fade
      // (same per-character schedule as the spans below), so the dots melt
      // out of the letter exactly where — and when — it dissolves.
      const charDelay = 150 + Math.min(idx, 12) * 38;
      // Each glyph bursts into a cluster of light dots.
      const dots = 5 + Math.floor(Math.random() * 4);
      for (let k = 0; k < dots; k++) {
        pts.push({
          id: pid++,
          x: baseX + (Math.random() - 0.5) * gw * 0.6,
          y: baseY + (Math.random() - 0.5) * gh * 0.6,
          size: 1.5 + Math.random() * 3,
          dx: (Math.random() - 0.5) * 50,
          dy: -16 - Math.random() * 64,
          delay: charDelay + Math.random() * 180,
          dur: 850 + Math.random() * 450,
        });
      }
    });
    setParticles(pts);
  }, [phase]);

  function ignite() {
    if (!q.trim() || phase !== 'input') return;
    setPhase('dissolve');
    // The sync overlay fades in over the tail of the scattering light (so the
    // sigil forms as the last motes rise — no dead gap), then we advance.
    setTimeout(() => setShowSync(true), 1500);
    setTimeout(() => onSubmit(q.trim()), 3000);
  }

  const isInput = phase === 'input';

  return (
    <div className="absolute inset-0 flex flex-col items-center px-7 pb-10 pt-[60px]">
      <Starfield density={70} seed={7} />

      {/* Title */}
      <motion.div
        className="relative z-[2] mt-[30px] text-center"
        animate={{ opacity: isInput ? 1 : 0 }}
        transition={{ duration: DUR.base, ease: EASE.out }}
      >
        <div className="mb-3.5 pl-2 font-display text-[13px] tracking-[8px] text-gold opacity-90">
          TAROT
        </div>
        <div className="pl-3 font-serif text-[30px] font-light tracking-[12px] text-parchment">
          聖三角占卜
        </div>
        <div className="mx-auto my-5 h-px w-[60px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="text-xs tracking-[4px] text-muted opacity-90">在此刻，寫下你心中的疑問</div>
      </motion.div>

      {/* Input area */}
      <div className="relative z-[2] mt-[50px] w-full max-w-[320px]">
        <CornerFrame visible={isInput} />

        <div
          ref={measureRef}
          className="relative min-h-[140px] px-5 py-[22px] font-serif text-[17px] leading-[1.8] tracking-[1.5px] text-parchment"
        >
          {isInput ? (
            <textarea
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="例：我此刻最該專注的是什麼？"
              maxLength={60}
              rows={3}
              className="h-[100px] w-full resize-none border-none bg-transparent text-center font-serif text-[17px] leading-[1.8] tracking-[1.5px] text-parchment caret-gold outline-none"
            />
          ) : (
            <div className="whitespace-pre-wrap break-words text-center">
              {Array.from(q).map((ch, i) => (
                <span
                  key={i}
                  data-c={ch}
                  style={{
                    opacity: phase === 'dissolve' ? 0 : 1,
                    filter: phase === 'dissolve' ? 'blur(3px)' : 'blur(0px)',
                    transition: `opacity 600ms ease-out ${150 + Math.min(i, 12) * 38}ms, filter 600ms ease-out ${150 + Math.min(i, 12) * 38}ms`,
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
                  style={{
                    left: p.x,
                    top: p.y,
                    width: p.size,
                    height: p.size,
                    background: GOLD,
                    boxShadow: `0 0 ${p.size * 2}px ${p.size}px ${GOLD}`,
                    transform: 'translate(-50%,-50%)',
                    animation: `motePly ${p.dur}ms cubic-bezier(.15,.6,.3,1) ${p.delay}ms forwards`,
                    '--dx': `${p.dx}px`,
                    '--dy': `${p.dy}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {isInput && (
          <div className="mt-1.5 text-right text-[10px] tracking-[2px] text-muted opacity-60">
            {q.length} / 60
          </div>
        )}
      </div>

      <div className="flex-1" />

      <motion.button
        onClick={ignite}
        disabled={!q.trim() || !isInput}
        className="relative z-[2] mb-[50px] rounded-sm border border-gold bg-transparent py-4 pl-10 pr-8 font-serif text-sm tracking-[8px] text-gold transition-[background,box-shadow] duration-200 disabled:cursor-default"
        animate={{ opacity: !isInput ? 0 : q.trim() ? 1 : 0.35 }}
        transition={{ duration: DUR.base, ease: EASE.out }}
        style={{
          cursor: q.trim() ? 'pointer' : 'default',
          boxShadow: q.trim()
            ? '0 0 24px rgba(212, 175, 55, 0.25), inset 0 0 18px rgba(212, 175, 55, 0.08)'
            : 'none',
        }}
        whileTap={{ backgroundColor: 'rgba(212,175,55,0.08)' }}
      >
        注 入 意 念
      </motion.button>

      <AnimatePresence>{showSync && <SyncOverlay />}</AnimatePresence>
    </div>
  );
}
