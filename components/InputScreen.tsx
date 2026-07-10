'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOLD, gold } from '@/lib/constants';
import { EASE, DUR, TAP, SPRING_TAP } from '@/lib/motion';
import Starfield from './Starfield';
import Constellation from './decor/Constellation';
import type { ConstellationVariant } from './decor/Constellation';
import Sparkle from './decor/Sparkle';
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
const MAX_PARTICLE_GLYPHS = 80;
// The sync overlay's life: stars+lines draw in, the centre blooms, then the
// whole thing sinks into near-black so the screen swap reads as dark→dark.
type Stage = 'forming' | 'bloom' | 'exit';

function SyncOverlay({
  stage,
  constellation,
}: {
  stage: Stage;
  constellation: ConstellationVariant;
}) {
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
          <Constellation stage={stage} variant={constellation} />
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

function AltarArtwork({ visible, focused }: { visible: boolean; focused: boolean }) {
  return (
    <motion.div
      className="pointer-events-none relative h-[clamp(245px,34svh,360px)] w-[124%] max-w-[470px] shrink-0"
      initial={{ opacity: 0, scale: 0.975 }}
      animate={{
        opacity: visible ? (focused ? 0.96 : 0.82) : 0,
        scale: visible ? 1 : 0.985,
      }}
      transition={{ duration: DUR.slow, delay: 0.08, ease: EASE.out }}
    >
      <img
        src="/altar.png"
        alt=""
        aria-hidden
        draggable={false}
        className="h-full w-full object-contain"
      />
    </motion.div>
  );
}

function IntentionSeal({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!active}
      aria-label="注入意念"
      whileTap={active ? TAP : undefined}
      transition={SPRING_TAP}
      className="absolute bottom-0 left-1/2 z-[4] flex h-[clamp(86px,22vw,104px)] w-[clamp(86px,22vw,104px)] -translate-x-1/2 translate-y-1/2 flex-col items-center justify-center rounded-full bg-ink transition-[opacity,border-color,box-shadow] duration-300 disabled:cursor-default"
      style={{
        border: `1px solid ${active ? gold(0.72) : gold(0.3)}`,
        boxShadow: active ? `0 0 0 5px #0b0a12, 0 0 0 6px ${gold(0.28)}` : '0 0 0 5px #0b0a12',
        opacity: active ? 1 : 0.58,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[7px] rounded-full border border-dashed border-gold/35"
      />
      <Sparkle size={7} opacity={active ? 0.9 : 0.5} className="mb-2" />
      <span className="font-serif text-[14px] tracking-[4px] text-gold-soft">注入意念</span>
      <Sparkle size={6} opacity={active ? 0.72 : 0.38} className="mt-2" />
    </motion.button>
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaMirrorRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showSync, setShowSync] = useState(false);
  const [stage, setStage] = useState<Stage>('forming');
  const [constellation, setConstellation] = useState<ConstellationVariant>('lyra');
  const [focused, setFocused] = useState(false);

  useLayoutEffect(() => {
    textareaRef.current?.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    if (phase !== 'input') return;
    const textarea = textareaRef.current;
    const mirror = textareaMirrorRef.current;
    if (!textarea || !mirror) return;

    const styles = window.getComputedStyle(textarea);
    const minHeight = Number.parseFloat(styles.minHeight) || 40;
    const maxHeight = Number.parseFloat(styles.maxHeight) || Number.POSITIVE_INFINITY;
    const contentHeight = mirror.scrollHeight;
    const nextHeight = Math.min(maxHeight, Math.max(minHeight, contentHeight));

    if (Math.abs(textarea.offsetHeight - nextHeight) > 0.5) {
      textarea.style.height = `${nextHeight}px`;
    }
    textarea.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
  }, [q, phase]);

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
    const visibleGlyphs = Array.from(charSpans).filter((el) => el.dataset.c !== ' ');
    const particleStep = Math.max(1, Math.ceil(visibleGlyphs.length / MAX_PARTICLE_GLYPHS));
    visibleGlyphs
      .filter((_, idx) => idx % particleStep === 0)
      .forEach((el, idx) => {
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
    setConstellation(Math.random() < 0.5 ? 'lyra' : 'corona');
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
    <div
      className="absolute inset-0 overflow-hidden px-5 pb-[20px] pt-[18px] [overflow-anchor:none]"
      style={{ overscrollBehavior: 'none' }}
    >
      <Starfield
        density={16}
        seed={8}
        bg="linear-gradient(180deg, #100e16 0%, #0d0c13 50%, #0b0a10 100%)"
      />
      <div className="relative z-[2] flex h-full w-full flex-col items-center">
        <AltarArtwork visible={isInput} focused={focused} />

        <motion.section
          className="relative -mt-5 w-full max-w-[400px] shrink-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: isInput ? 1 : 0, y: 0 }}
          transition={{ duration: DUR.base, delay: 0.16, ease: EASE.out }}
          style={{ pointerEvents: isInput ? 'auto' : 'none' }}
        >
          <div
            className="relative w-full rounded-[30px] border bg-ink/45 transition-[border-color,background-color] duration-300"
            style={{ borderColor: focused ? gold(0.68) : gold(0.42) }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[8px] rounded-[22px] border border-dashed border-gold/20"
            />

            <label
              htmlFor="tarot-question"
              className="absolute left-1/2 top-0 z-[3] flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 whitespace-nowrap rounded-full border border-gold/45 bg-ink px-5 py-2 font-serif text-[13px] tracking-[7px] text-gold-soft"
            >
              <Sparkle size={6} opacity={0.62} />
              你的問題
              <Sparkle size={6} opacity={0.62} />
            </label>

            <div
              ref={measureRef}
              className="relative min-h-[clamp(190px,25svh,260px)] px-7 pb-[72px] pt-[44px] font-serif text-[16px] leading-[1.9] tracking-[1px] text-parchment"
            >
              <div
                ref={textareaMirrorRef}
                aria-hidden
                className="pointer-events-none invisible absolute left-7 right-7 top-[44px] whitespace-pre-wrap break-words p-0 font-serif text-[16px] leading-[1.9] tracking-[1px]"
              >
                {q || ' '}
                {'\u200b'}
              </div>

              {isInput ? (
                <textarea
                  id="tarot-question"
                  ref={textareaRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onPointerDown={(e) => {
                    if (!q && document.activeElement !== e.currentTarget) {
                      e.preventDefault();
                      e.currentTarget.focus({ preventScroll: true });
                    }
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      ignite();
                    }
                  }}
                  placeholder="寫下你心中的疑問"
                  rows={1}
                  className="min-h-[clamp(104px,16svh,168px)] max-h-[28svh] w-full resize-none overflow-y-hidden border-none bg-transparent p-0 text-left font-serif text-[16px] leading-[1.9] tracking-[1px] text-parchment caret-gold outline-none [overflow-anchor:none]"
                />
              ) : (
                <div className="min-h-[clamp(104px,16svh,168px)] max-h-[28svh] overflow-y-auto whitespace-pre-wrap break-words text-left [overflow-anchor:none]">
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

            <IntentionSeal active={Boolean(q.trim()) && isInput} onClick={ignite} />
          </div>
        </motion.section>

        <motion.div
          className="relative z-[4] mt-auto flex shrink-0 flex-col items-center pt-[clamp(56px,8svh,86px)]"
          animate={{ opacity: isInput ? 1 : 0 }}
          transition={{ duration: DUR.fast, ease: EASE.out }}
          style={{ pointerEvents: isInput ? 'auto' : 'none' }}
        >
          <TextAction
            label="回到首頁"
            onClick={onBack}
            ariaLabel="回到首頁"
            className="px-7 py-3 [&>span:first-of-type]:text-[13px] [&>span:first-of-type]:tracking-[5px] [&>span:last-child]:w-20"
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {showSync && <SyncOverlay stage={stage} constellation={constellation} />}
      </AnimatePresence>
    </div>
  );
}
