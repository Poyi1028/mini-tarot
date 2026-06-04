'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOLD, GOLD_BRIGHT, PARCHMENT } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import Starfield from './Starfield';
import Sunburst from './decor/Sunburst';
import Sparkle from './decor/Sparkle';
import Crescent from './decor/Crescent';
import OrnDivider from './decor/OrnDivider';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  delay: number;
  dur: number;
}

type Phase = 'input' | 'dissolve' | 'sync';

function trianglePath(cx: number, cy: number, r: number, rot: number) {
  const pts = [0, 1, 2].map((i) => {
    const a = rot - Math.PI / 2 + (i * Math.PI * 2) / 3;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]} L ${pts[2][0]} ${pts[2][1]} Z`;
}

// Celestial sigil that forms while the intention syncs with the stars.
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
          stroke={GOLD_BRIGHT}
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
          'radial-gradient(ellipse at center, rgba(46,42,82,0.6) 0%, rgba(20,18,40,0.96) 70%)',
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

export default function InputScreen({ onSubmit }: { onSubmit: (q: string) => void }) {
  const [q, setQ] = useState('');
  const [phase, setPhase] = useState<Phase>('input');
  const measureRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showSync, setShowSync] = useState(false);

  // Once the char-span layer is rendered (phase === 'dissolve'), measure each
  // glyph and spawn a cluster of light dots from its position.
  useLayoutEffect(() => {
    if (phase !== 'dissolve') return;
    const container = measureRef.current;
    if (!container) return;
    const charSpans = container.querySelectorAll<HTMLSpanElement>('span[data-c]');
    const cBox = container.getBoundingClientRect();
    const scale = container.offsetWidth ? cBox.width / container.offsetWidth : 1;
    const pts: Particle[] = [];
    let pid = 0;
    charSpans.forEach((el, idx) => {
      if (el.dataset.c === ' ') return;
      const b = el.getBoundingClientRect();
      const gw = b.width / scale;
      const gh = b.height / scale;
      const baseX = (b.left - cBox.left) / scale + gw / 2;
      const baseY = (b.top - cBox.top) / scale + gh / 2;
      const charDelay = 200 + Math.min(idx, 12) * 52;
      const dots = 5 + Math.floor(Math.random() * 4);
      for (let k = 0; k < dots; k++) {
        pts.push({
          id: pid++,
          x: baseX + (Math.random() - 0.5) * gw * 0.6,
          y: baseY + (Math.random() - 0.5) * gh * 0.6,
          size: 1.5 + Math.random() * 3,
          dx: (Math.random() - 0.5) * 50,
          dy: -16 - Math.random() * 64,
          delay: charDelay + Math.random() * 260,
          dur: 1500 + Math.random() * 700,
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
    setTimeout(() => setShowSync(true), 2400);
    setTimeout(() => onSubmit(q.trim()), 5400);
  }

  const isInput = phase === 'input';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-7 py-[64px]">
      <Starfield density={32} seed={8} />

      {/* Focal sunburst + title */}
      <motion.div
        className="relative z-[2] flex flex-col items-center text-center"
        animate={{ opacity: isInput ? 1 : 0 }}
        transition={{ duration: DUR.base, ease: EASE.out }}
      >
        <Sunburst size={74} color={PARCHMENT} sw={0.9} rays={24} className="animate-spin360-slow" />
        <div className="mt-5 pl-2 font-display text-[11px] tracking-[8px] text-gold">
          YOUR INTENTION
        </div>
        <div className="mt-3.5 pl-2 font-serif text-[22px] font-light tracking-[6px] text-parchment">
          寫下你心中的疑問
        </div>
        <OrnDivider w={46} color={GOLD} style={{ marginTop: 16 }} />
      </motion.div>

      {/* Input area — altar slab */}
      <div className="relative z-[2] mt-9 w-full max-w-[330px]">
        {/* spotlight pooled behind the slab */}
        <div
          className="pointer-events-none absolute -inset-7"
          style={{
            background:
              'radial-gradient(ellipse 72% 64% at 50% 45%, rgba(188,182,220,0.14) 0%, transparent 70%)',
          }}
        />
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            border: '1px solid rgba(216,189,143,0.4)',
            background:
              'linear-gradient(160deg, rgba(46,42,82,0.55) 0%, rgba(20,18,40,0.6) 100%)',
            backdropFilter: 'blur(7px)',
            WebkitBackdropFilter: 'blur(7px)',
            boxShadow:
              '0 0 40px rgba(20,18,40,0.6), inset 0 1px 0 rgba(216,189,143,0.12), inset 0 0 26px rgba(216,189,143,0.04)',
          }}
        >
          {/* inner hairline */}
          <div
            className="pointer-events-none absolute inset-[6px] rounded-xl"
            style={{ border: '1px solid rgba(216,189,143,0.16)' }}
          />
          {/* sparkle corners */}
          <Sparkle size={12} color={GOLD} style={{ position: 'absolute', top: 12, left: 12 }} />
          <Sparkle size={12} color={GOLD} style={{ position: 'absolute', bottom: 12, right: 12 }} />

          <div
            ref={measureRef}
            className="relative min-h-[150px] px-7 py-[30px] font-serif text-[17px] leading-[1.8] tracking-[1.5px] text-parchment"
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
                        animation: `motePly ${p.dur}ms cubic-bezier(.15,.6,.3,1) ${p.delay}ms forwards`,
                        '--dx': `${p.dx}px`,
                        '--dy': `${p.dy}px`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit — gilded pill with a crescent */}
      <motion.button
        onClick={ignite}
        disabled={!q.trim() || !isInput}
        className="relative z-[2] mt-10 flex items-center justify-center rounded-full font-serif text-[13px] tracking-[6px] text-gold-bright transition-[background,box-shadow] duration-200 disabled:cursor-default"
        animate={{ opacity: !isInput ? 0 : q.trim() ? 1 : 0.35 }}
        transition={{ duration: DUR.base, ease: EASE.out }}
        style={{
          border: '1px solid rgba(216,189,143,0.85)',
          background: 'rgba(216,189,143,0.06)',
          padding: '14px 34px',
          cursor: q.trim() ? 'pointer' : 'default',
          boxShadow: q.trim() ? '0 0 24px rgba(216,189,143,0.2)' : 'none',
        }}
        whileTap={{ backgroundColor: 'rgba(216,189,143,0.12)' }}
      >
        <Crescent size={16} color={GOLD_BRIGHT} style={{ marginRight: 10 }} />
        <span>注 入 意 念</span>
      </motion.button>

      <AnimatePresence>{showSync && <SyncOverlay />}</AnimatePresence>
    </div>
  );
}
