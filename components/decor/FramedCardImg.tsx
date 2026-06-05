'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { GOLD } from '@/lib/constants';

// Framed card artwork at the catalog 300:527 ratio: a gold border over a faint
// placeholder gradient (so an unloaded frame reads as a dim card, not an empty
// rectangle), an inner gold hairline, and a fade-in once the image loads (so
// lazy/late images don't pop). Shared by the deck grid thumbnails and the
// deck-card detail portrait, which differ only in size and shadow.
export default function FramedCardImg({
  src,
  alt,
  width,
  radius,
  borderWidth = 1,
  ringWidth,
  ringAlpha = 0.22,
  boxShadow,
  lazy = false,
  fadeMs = 550,
}: {
  src: string;
  alt: string;
  width?: number | string;
  radius: number;
  borderWidth?: number;
  ringWidth: number;
  ringAlpha?: number;
  boxShadow: string;
  lazy?: boolean;
  fadeMs?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const frame: CSSProperties = {
    width: width ?? '100%',
    aspectRatio: '300 / 527',
    borderRadius: radius,
    border: `${borderWidth}px solid ${GOLD}`,
    background: 'linear-gradient(160deg, rgba(40,36,66,0.5), rgba(18,16,34,0.6))',
    boxShadow,
  };
  return (
    <div className="relative overflow-hidden" style={frame}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        loading={lazy ? 'lazy' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className="block h-full w-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: `opacity ${fadeMs}ms ease` }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ borderRadius: radius, boxShadow: `inset 0 0 0 ${ringWidth}px rgba(216,189,143,${ringAlpha})` }}
      />
    </div>
  );
}
