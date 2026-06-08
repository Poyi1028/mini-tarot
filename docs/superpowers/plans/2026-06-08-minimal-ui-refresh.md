# Minimal UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh Mini Tarot into a quieter, more polished mobile-first PWA while preserving the current ritual flow, tarot logic, and PWA behavior.

**Architecture:** Keep the existing `TarotApp` client-side screen state machine and current component boundaries. Add a small shared visual language in `components/decor/` and `lib/motion.ts`, then apply it screen by screen with scoped edits.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict mode, Tailwind CSS v4, framer-motion, pnpm. Verification uses `npx tsc --noEmit`; do not run `pnpm build`.

---

## File Structure

- Modify `components/decor/BackButton.tsx`: make back navigation the shared baseline for all screen-level back controls.
- Create `components/decor/TextAction.tsx`: shared quiet text action for return, read-more, and closing actions.
- Create `components/decor/IconEntry.tsx`: shared top icon entry used by deck and daily shortcuts.
- Modify `components/InputScreen.tsx`: use `IconEntry`, reduce composer glow, normalize return-home action.
- Modify `components/HomeScreen.tsx`: reduce ambient effects and add one quiet entry affordance.
- Modify `components/ShuffleScreen.tsx`: simplify motion hierarchy, copy density, and bottom hints.
- Modify `components/SpreadScreen.tsx`: reduce sigil/card glow intensity and use `TextAction` for the closing action.
- Modify `components/DailyScreen.tsx`: reduce single-card sigil intensity and use `TextAction` for detail entry.
- Modify `components/DeckScreen.tsx`: tune tab and header hierarchy without restructuring the deck data.
- Modify `app/globals.css`: add small utility classes only if repeated styles cannot be cleanly represented in components.
- Optional modify `.gitignore`: add `.superpowers/` so brainstorming companion artifacts do not remain as normal untracked project files.

Do not modify `lib/tarot-cards.ts`, `lib/daily.ts`, `public/sw.js`, `app/manifest.ts`, or card image assets.

---

### Task 1: Housekeeping And Shared Interaction Primitives

**Files:**
- Optional Modify: `.gitignore`
- Modify: `components/decor/BackButton.tsx`
- Create: `components/decor/TextAction.tsx`
- Create: `components/decor/IconEntry.tsx`
- Verify: `npx tsc --noEmit`

- [ ] **Step 1: Add `.superpowers/` to `.gitignore` if it is not already ignored**

Open `.gitignore`. If it does not include `.superpowers/`, append:

```gitignore
.superpowers/
```

Do not remove any existing ignore rules.

- [ ] **Step 2: Inspect the existing back button**

Run:

```bash
Get-Content -Path components\decor\BackButton.tsx
```

Confirm the component already exports a clickable control with `onClick`. Preserve its public API unless the file currently exposes additional required props.

- [ ] **Step 3: Normalize `BackButton` styling**

Edit `components/decor/BackButton.tsx` so the visual treatment follows this contract:

```tsx
'use client';

import { motion } from 'framer-motion';
import { TAP, SPRING_TAP } from '@/lib/motion';

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="返回"
      whileTap={TAP}
      transition={SPRING_TAP}
      className="absolute left-3.5 top-[52px] z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gold/15 bg-ink/20 text-gold-soft shadow-[0_4px_18px_rgba(0,0,0,0.22)] backdrop-blur-[6px] transition-[border-color,background,color] duration-200"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M15 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
```

If the current file has additional layout behavior needed by existing screens, keep that behavior and only apply the size, color, tap feedback, and `aria-label` contract above.

- [ ] **Step 4: Create shared quiet text action**

Create `components/decor/TextAction.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import { TAP, SPRING_TAP } from '@/lib/motion';

interface TextActionProps {
  eyebrow?: string;
  label: string;
  sublabel?: string;
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
}

export default function TextAction({
  eyebrow,
  label,
  sublabel,
  onClick,
  ariaLabel,
  className = '',
}: TextActionProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      whileTap={TAP}
      transition={SPRING_TAP}
      className={`group inline-flex min-h-11 flex-col items-center justify-center gap-2 px-5 py-2 text-center ${className}`}
    >
      {eyebrow && <span className="text-[8px] leading-none text-gold-soft/55">{eyebrow}</span>}
      <span className="font-display text-[10px] tracking-[4px] text-gold">{label}</span>
      {sublabel && (
        <span className="font-serif text-[12px] tracking-[3px] text-gold-soft/75">{sublabel}</span>
      )}
      <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold-soft/50 to-transparent transition-[width,opacity] duration-200 group-active:w-12 group-active:opacity-70" />
    </motion.button>
  );
}
```

- [ ] **Step 5: Create shared icon entry**

Create `components/decor/IconEntry.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import { TAP, SPRING_TAP } from '@/lib/motion';

interface IconEntryProps {
  icon: string;
  label: string;
  ariaLabel: string;
  onClick: () => void;
}

export default function IconEntry({ icon, label, ariaLabel, onClick }: IconEntryProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={TAP}
      transition={SPRING_TAP}
      className="flex min-h-[58px] min-w-[54px] flex-col items-center justify-center gap-1.5 rounded-full px-1 py-1 text-lilac/85 transition-[opacity,transform] duration-200 active:opacity-80"
    >
      <span className="flex h-[34px] w-[40px] items-center justify-center">
        <img
          src={icon}
          alt=""
          draggable={false}
          className="h-full w-full object-contain opacity-90"
          style={{ filter: 'drop-shadow(0 0 4px rgba(216,189,143,0.22))' }}
        />
      </span>
      <span className="whitespace-nowrap text-[10px] tracking-[2px]">{label}</span>
    </motion.button>
  );
}
```

- [ ] **Step 6: Run typecheck**

Run:

```bash
npx tsc --noEmit
```

Expected: command completes with exit code 0. If it fails because the existing project has unrelated encoding or syntax errors, record the exact file and error before making unrelated fixes.

- [ ] **Step 7: Commit Task 1**

Run:

```bash
git add .gitignore components/decor/BackButton.tsx components/decor/TextAction.tsx components/decor/IconEntry.tsx
git commit -m "refactor: add minimal shared UI controls"
```

If `.gitignore` was unchanged, omit it from `git add`.

---

### Task 2: Input And Home Screen Focus Pass

**Files:**
- Modify: `components/HomeScreen.tsx`
- Modify: `components/InputScreen.tsx`
- Verify: `npx tsc --noEmit`

- [ ] **Step 1: Update `HomeScreen` ambient density**

In `components/HomeScreen.tsx`, lower the ambient layers:

```tsx
<Starfield density={24} seed={4} />
<Motes count={5} seed={6} color={GOLD_BRIGHT} area={{ x: 52, y: 44, w: 40, h: 30 }} />
```

Change the crystal back-glow radial opacity from `0.08` to `0.045`.

- [ ] **Step 2: Add one quiet home entry cue**

Under the existing `OrnDivider`, replace the current tiny animated subtitle with one stable cue:

```tsx
<div className="mt-[18px] text-[10px] tracking-[4px]" style={{ color: MUTED }}>
  點一下開始
</div>
```

If the current Traditional Chinese copy is already correct in the local file, keep the wording aligned to that copy style, but use one line, `text-[10px]`, and `tracking-[4px]`.

- [ ] **Step 3: Import shared controls in `InputScreen`**

Add:

```tsx
import IconEntry from './decor/IconEntry';
import TextAction from './decor/TextAction';
```

Remove direct imports of constants that become unused after replacing inline icon labels.

- [ ] **Step 4: Replace top icon buttons in `InputScreen`**

Replace the two inline `motion.button` blocks for deck and daily with:

```tsx
<IconEntry icon="/cards.svg" label="牌庫" ariaLabel="開啟牌庫" onClick={onOpenDeck} />
<IconEntry icon="/book.svg" label="每日" ariaLabel="開啟今日運勢" onClick={onOpenDaily} />
```

Keep the surrounding absolute top-right container, but reduce its gap to `gap-3`.

- [ ] **Step 5: Reduce composer glow in `InputScreen`**

In the input container style, change the border and shadow to:

```tsx
border: `1px solid rgba(216,189,143,${focused ? 0.42 : 0.22})`,
background:
  'linear-gradient(160deg, rgba(28,26,48,0.52) 0%, rgba(14,13,24,0.72) 100%)',
boxShadow: focused
  ? '0 10px 28px rgba(0,0,0,0.36), 0 0 18px rgba(216,189,143,0.10)'
  : '0 8px 22px rgba(0,0,0,0.3)',
```

- [ ] **Step 6: Replace bottom return action in `InputScreen`**

Replace the custom return-home `motion.button` with:

```tsx
<TextAction eyebrow="⌂" label="RETURN HOME" sublabel="回到首頁" onClick={onBack} ariaLabel="回到首頁" />
```

Keep the bottom absolute wrapper and its opacity behavior.

- [ ] **Step 7: Run typecheck**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 8: Commit Task 2**

Run:

```bash
git add components/HomeScreen.tsx components/InputScreen.tsx
git commit -m "style: quiet home and input screens"
```

---

### Task 3: Shuffle And Spread Visual Hierarchy Pass

**Files:**
- Modify: `components/ShuffleScreen.tsx`
- Modify: `components/SpreadScreen.tsx`
- Verify: `npx tsc --noEmit`

- [ ] **Step 1: Lower shuffle background density**

In `components/ShuffleScreen.tsx`, change:

```tsx
<Starfield density={20} seed={11} />
```

- [ ] **Step 2: Simplify shuffle header scale**

In the shuffle header, use this class contract:

```tsx
className="absolute left-0 right-0 top-0 z-[3] px-7 pt-[70px] text-center transition-opacity duration-[600ms]"
```

For the heading:

```tsx
className="mb-3 font-display text-[10px] tracking-[5px] text-gold/80"
```

For the instruction block:

```tsx
className="min-h-[58px] whitespace-pre-line text-[15px] font-light leading-[1.75] tracking-[3px] text-parchment/88"
```

- [ ] **Step 3: Reduce shuffle idle motion**

Change the whole-pile breathing animation from:

```tsx
animate={{ y: [0, -7, 0] }}
transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
```

to:

```tsx
animate={{ y: [0, -4, 0] }}
transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
```

- [ ] **Step 4: Lower spread background density**

In `components/SpreadScreen.tsx`, change:

```tsx
<Starfield density={20} seed={13} />
```

- [ ] **Step 5: Reduce spread sigil opacity**

In the spread guide `motion.svg`, change the animated opacity to:

```tsx
animate={{ opacity: phase === 'spread' ? [0.32, 0.52, 0.32] : 0.16 }}
```

Then reduce the main triangle `strokeOpacity` to `0.28`, and lower the fill opacity to `0.02`.

- [ ] **Step 6: Reduce card aura intensity**

In `FlipCard`, change:

```tsx
style={{ boxShadow: '0 0 12px rgba(216,189,143,0.10)' }}
```

For the next-card pulse, use:

```tsx
style={{ boxShadow: '0 0 16px rgba(216,189,143,0.20), inset 0 0 0 1px rgba(216,189,143,0.22)' }}
```

For revealed cards, use:

```tsx
boxShadow: `0 0 22px rgba(216,189,143,0.24), 0 0 42px rgba(216,189,143,0.10)`,
```

- [ ] **Step 7: Use `TextAction` for spread closing action**

Add:

```tsx
import TextAction from './decor/TextAction';
```

Replace the custom button in `ReadingPanel` with:

```tsx
<TextAction eyebrow="⌂" label="RETURN HOME" sublabel="回到首頁" onClick={onRestart} ariaLabel="回到首頁" />
```

- [ ] **Step 8: Run typecheck**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 9: Commit Task 3**

Run:

```bash
git add components/ShuffleScreen.tsx components/SpreadScreen.tsx
git commit -m "style: reduce shuffle and spread visual noise"
```

---

### Task 4: Daily And Deck Editorial Pass

**Files:**
- Modify: `components/DailyScreen.tsx`
- Modify: `components/DeckScreen.tsx`
- Verify: `npx tsc --noEmit`

- [ ] **Step 1: Lower daily background density**

In `components/DailyScreen.tsx`, change:

```tsx
<Starfield density={20} seed={21} />
```

- [ ] **Step 2: Reduce daily sigil opacity**

In `DailySigil`, change:

```tsx
animate={{ opacity: active ? 0.55 : 0.28 }}
```

Reduce outer circle opacity values by about one third:

```tsx
opacity={0.26}
opacity={0.15}
opacity={0.16}
```

For the rotating dotted circle, use:

```tsx
opacity={0.32}
```

- [ ] **Step 3: Reduce daily radial glow**

In `DailyCard`, replace the radial glow background with:

```tsx
background:
  'radial-gradient(circle at center, rgba(238,212,160,0.62) 0%, rgba(228,198,150,0.34) 30%, rgba(216,189,143,0.16) 52%, rgba(216,189,143,0.05) 70%, transparent 82%)',
filter: 'blur(24px)',
```

Set the animated glow opacity range to:

```tsx
animate={{ opacity: [0.55, 0.78, 0.55] }}
```

- [ ] **Step 4: Use `TextAction` for daily detail entry**

Add:

```tsx
import TextAction from './decor/TextAction';
```

Replace the current detail `motion.button` with:

```tsx
<TextAction
  label="READ MORE"
  sublabel="查看牌義"
  onClick={() => setDetail(true)}
  ariaLabel="查看牌義"
  className="mt-3"
/>
```

- [ ] **Step 5: Tune deck tabs**

In `components/DeckScreen.tsx`, adjust tab text to be slightly calmer:

```tsx
fontSize: 13,
letterSpacing: 1.5,
color: on ? PARCHMENT : MUTED,
```

Change the active underline width from `16` to `14`, and remove the active underline glow or reduce it to:

```tsx
boxShadow: on ? `0 0 4px ${GOLD}` : 'none',
```

- [ ] **Step 6: Reduce deck group header dominance**

In the group English title, change `fontSize: 26` to `fontSize: 23`.

In the metadata line, use:

```tsx
className="font-display mt-1 pl-1 text-[9px] tracking-[3px]"
```

- [ ] **Step 7: Run typecheck**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 8: Commit Task 4**

Run:

```bash
git add components/DailyScreen.tsx components/DeckScreen.tsx
git commit -m "style: refine daily and deck hierarchy"
```

---

### Task 5: Final Visual QA And Verification

**Files:**
- Read: all modified files from Tasks 1-4
- Verify: `npx tsc --noEmit`
- Optional Read: browser screenshots or local dev server view

- [ ] **Step 1: Run final typecheck**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 2: Start the dev server**

Run:

```bash
pnpm dev
```

Expected: Next.js dev server starts at `http://localhost:3000`. Do not run `pnpm build`.

- [ ] **Step 3: Inspect the primary flow**

Open `http://localhost:3000` and check:

- Home: crystal and brand are the only strong focal point.
- Input: top actions are consistent and composer focus is clear.
- Shuffle: deck gesture is more prominent than text or glow.
- Spread: cards dominate over sigil and aura.
- Daily: single card dominates over sigil and glow.
- Deck: tabs and group header do not compete with card thumbnails.

- [ ] **Step 4: Inspect small-screen fit**

Use a narrow mobile viewport around `390x844`. Check that:

- Text does not overlap cards.
- Back buttons avoid the safe area and top actions.
- Bottom actions remain tappable.
- The spread still fits in portrait layout.

- [ ] **Step 5: Stop the dev server**

Stop the `pnpm dev` process after QA.

- [ ] **Step 6: Commit final QA notes if documentation changed**

If no files changed during QA, do not create an empty commit. If a small doc note was added, run:

```bash
git add docs/superpowers/plans/2026-06-08-minimal-ui-refresh.md
git commit -m "docs: record minimal UI refresh QA"
```

---

## Self-Review

Spec coverage:

- Quiet ritual mood: covered by Tasks 2, 3, and 4 through reduced density, glow, and motion.
- Editorial typography and reading style: covered by Tasks 2 and 4 through text hierarchy changes and shared `TextAction`.
- Native app clarity: covered by Task 1 shared controls and Task 2 shortcut normalization.
- One protagonist per screen: covered screen by screen in Tasks 2-4.
- PWA and tarot logic preservation: addressed by file structure exclusions and no changes to tarot data, draw logic, service worker, or manifest.
- Verification: covered by every task's `npx tsc --noEmit` gate and Task 5 visual QA.

Placeholder scan:

- No `TBD`, `TODO`, or unspecified implementation steps are intentionally left in the plan.

Type consistency:

- `TextAction` and `IconEntry` prop names are defined in Task 1 and reused consistently in later tasks.
- Existing screen callback names are preserved: `onBack`, `onRestart`, `onOpenDeck`, `onOpenDaily`, and `setDetail`.
