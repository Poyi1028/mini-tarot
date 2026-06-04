'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOLD } from '@/lib/constants';
import { EASE, DUR } from '@/lib/motion';
import Starfield from './Starfield';
import Constellation from './decor/Constellation';

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

export default function InputScreen({ onSubmit }: { onSubmit: (q: string) => void }) {
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
    // One continuous ~4s arc: the words gather into light (mote-gather), the
    // constellation wires itself up, the centre blooms ("synced"), then the
    // overlay sinks to near-black and we hand off dark→dark to the shuffle.
    setTimeout(() => setShowSync(true), 1300);
    setTimeout(() => setStage('bloom'), 3000);
    setTimeout(() => setStage('exit'), 3500);
    setTimeout(() => onSubmit(q.trim()), 4000);
  }

  const isInput = phase === 'input';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-7 py-[64px]">
      <Starfield density={32} seed={8} />

      {/* Input area — AI-style composer, centred on screen */}
      <div
        className="relative z-[2] w-full max-w-[360px]"
        style={{ pointerEvents: isInput ? 'auto' : 'none' }}
      >
        {/* Focal bar — floats above the box without pushing it off-centre. Its
            central sun animates from inside the SVG (see public/bar.svg). */}
        <motion.div
          className="pointer-events-none absolute bottom-full left-0 right-0 mb-7 flex justify-center"
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
          className="relative rounded-[26px] transition-shadow duration-300"
          style={{
            border: `1px solid rgba(216,189,143,${focused ? 0.55 : 0.32})`,
            background:
              'linear-gradient(160deg, rgba(36,33,66,0.6) 0%, rgba(18,16,34,0.72) 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: focused
              ? '0 10px 34px rgba(0,0,0,0.4), 0 0 26px rgba(216,189,143,0.14)'
              : '0 8px 24px rgba(0,0,0,0.34)',
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

          {/* embedded send button (AI composer) */}
          <button
            onClick={ignite}
            disabled={!q.trim() || !isInput}
            aria-label="注入意念"
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full transition-[opacity,box-shadow,background] duration-200 disabled:cursor-default"
            style={{
              background: q.trim() ? 'rgba(216,189,143,0.95)' : 'rgba(216,189,143,0.1)',
              boxShadow: q.trim() ? '0 0 18px rgba(216,189,143,0.35)' : 'none',
              opacity: q.trim() ? 1 : 0.5,
              cursor: q.trim() ? 'pointer' : 'default',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 19V5M12 5l-6 6M12 5l6 6"
                stroke={q.trim() ? '#1a1736' : GOLD}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>{showSync && <SyncOverlay stage={stage} />}</AnimatePresence>
    </div>
  );
}
