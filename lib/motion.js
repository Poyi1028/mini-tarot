// Single source of truth for animation feel across every screen.
// Components import these instead of hand-writing easing arrays/durations,
// so the whole app shares one consistent, tunable motion language.

// Cubic-bezier easing curves, each with a clear job.
export const EASE = {
  out: [0.22, 1, 0.36, 1], // decelerate — entrances, fades-in
  inOut: [0.65, 0, 0.35, 1], // symmetric — crossfades, position moves
  reveal: [0.5, 0.05, 0.2, 1], // dramatic — card flips and the spread
};

// Durations in seconds.
export const DUR = {
  fast: 0.3,
  base: 0.7,
  slow: 1.1,
};

// Floating spring — re-targeted continuously during the shuffle for a fluid,
// never-settling drift.
export const SPRING_FLOAT = { type: 'spring', stiffness: 70, damping: 15, mass: 0.7 };

// Smear spring — soft and slightly underdamped so cards trail the fingertip
// and glide across the "table" like a wash shuffle, instead of snapping.
export const SPRING_SHUFFLE = { type: 'spring', stiffness: 90, damping: 13, mass: 0.5 };

// Pop spring — for the hero cards snapping to attention as they reveal.
export const SPRING_POP = { type: 'spring', stiffness: 220, damping: 20, mass: 0.9 };

// Plain opacity crossfade (used for screen-to-screen transitions).
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Rise + fade, as a variant pair so it can be driven by a parent stagger.
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE.out } },
};

// Parent variant that releases its `fadeUp` children one after another.
export const stagger = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});
