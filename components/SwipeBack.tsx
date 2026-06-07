'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { EASE } from '@/lib/motion';

// iOS-style edge swipe-back. Wraps a full-screen screen; a drag that STARTS
// within `EDGE` px of the left edge and moves rightward translates the whole
// screen with the finger, and on release past `THRESHOLD` (or a fast flick)
// commits `onBack()`. Anything that doesn't start at the edge — or that moves
// vertically first — is ignored, so card taps and vertical scrolling pass
// straight through. The directional locking means it never hijacks a scroll.
const EDGE = 28; // px from the left where a back-swipe may begin
const THRESHOLD = 80; // px dragged to commit the back
const VELOCITY = 0.45; // px/ms flick speed that also commits

export default function SwipeBack({
  onBack,
  children,
}: {
  onBack: () => void;
  children: ReactNode;
}) {
  const x = useMotionValue(0);
  const s = useRef({
    active: false, // a pointer started at the edge
    decided: false, // committed to a horizontal back-gesture
    startX: 0,
    startY: 0,
    lastX: 0,
    lastT: 0,
    vx: 0,
  });

  function down(e: React.PointerEvent) {
    if (e.clientX > EDGE) return;
    const st = s.current;
    st.active = true;
    st.decided = false;
    st.startX = e.clientX;
    st.startY = e.clientY;
    st.lastX = e.clientX;
    st.lastT = performance.now();
    st.vx = 0;
  }

  function move(e: React.PointerEvent) {
    const st = s.current;
    if (!st.active) return;
    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;

    if (!st.decided) {
      // wait for clear intent before claiming the gesture
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      // vertical-dominant or leftward → not a back-swipe; let it go (scroll/tap)
      if (Math.abs(dy) > Math.abs(dx) || dx <= 0) {
        st.active = false;
        return;
      }
      st.decided = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    const now = performance.now();
    const dt = now - st.lastT;
    if (dt > 0) st.vx = (e.clientX - st.lastX) / dt;
    st.lastX = e.clientX;
    st.lastT = now;
    x.set(Math.max(0, dx));
  }

  function up() {
    const st = s.current;
    if (!st.active) return;
    st.active = false;
    if (!st.decided) return;
    if (x.get() > THRESHOLD || st.vx > VELOCITY) {
      // Commit the back, but DON'T fling the screen across the viewport — that
      // reads as an ugly slide. Snap it back to place and let the screen's
      // crossfade handle the actual change, consistent with every transition.
      onBack();
      animate(x, 0, { duration: 0.2, ease: EASE.out });
    } else {
      animate(x, 0, { type: 'spring', stiffness: 420, damping: 38 });
    }
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      {children}
    </motion.div>
  );
}
