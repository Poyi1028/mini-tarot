'use client';

import { useLayoutEffect, useRef, useState } from 'react';

// Scales a fixed-size child (the device frame) to fit the viewport while
// preserving its aspect ratio — grows on large screens, shrinks on small
// ones, always fully visible.
export default function FitToViewport({ width, height, padding = 24, children }) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function fit() {
      const availW = window.innerWidth - padding * 2;
      const availH = window.innerHeight - padding * 2;
      const s = Math.min(availW / width, availH / height);
      setScale(s > 0 ? s : 1);
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [width, height, padding]);

  return (
    <div
      style={{
        width: width * scale,
        height: height * scale,
        position: 'relative',
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
