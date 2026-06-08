# Mini Tarot Minimal UI Refresh Design

## Goal

Refresh Mini Tarot into a quieter, more polished mobile-first PWA while preserving its current ritual flow and tarot atmosphere.

The target feel is an understated boutique tarot tool: mystical, tactile, and focused, but with less visual noise and more consistent interaction patterns.

## Design Direction

Use a hybrid of three compatible directions:

- Quiet ritual as the primary mood.
- Editorial tarot as the typography and reading style.
- Native app clarity as the interaction model.

The app should not become flat or purely utilitarian. It should keep the existing gold, ink, and lilac identity, but use motion, glow, particles, and ornaments more selectively.

## Core Principle

Each screen gets one visual protagonist.

- Home: crystal ball and brand.
- Input: the user's question.
- Shuffle: the deck gesture.
- Spread: the three drawn cards.
- Daily: the single daily card.
- Card detail: the selected card and its interpretation.
- Deck: the card catalog content.

Background effects, decorative lines, sigils, and secondary labels must support that protagonist instead of competing with it.

## Scope

This refresh focuses on UI presentation and interaction consistency. It does not change tarot data, card draw logic, PWA installation behavior, service worker strategy, or the current client-side screen state machine.

In scope:

- Reduce background and glow density.
- Normalize navigation and action controls.
- Improve visual hierarchy, spacing, and typography.
- Clarify primary and secondary actions.
- Keep the existing screen flow and core animations.

Out of scope:

- New tarot spreads.
- New card meanings.
- Backend or API features.
- Replacing the Rider-Waite artwork.
- Reworking card draw randomness.

## Screen Treatments

### Home

Keep the crystal ball and `Mini Tarot` as the first impression. Reduce ambient motes and back-glow so the screen feels more premium and less busy.

The screen can remain tap-anywhere, but the entry affordance should be more legible. Use one quiet cue such as a small underline, text prompt, or subtle bottom hint rather than multiple decorative signals.

### Input

Make the question composer the clear center of the screen.

The top actions for deck and daily draw should read as lightweight app navigation. Their icon size, label style, spacing, and tap target should be consistent. They should feel useful, not ornamental.

The input container should use a restrained border, low blur, and reduced glow. The active state can use gold, but only enough to show focus.

### Shuffle

Preserve the drag-to-shuffle and cut-the-deck sequence. This is one of the app's strongest ritual interactions.

Simplify instructional copy and reduce simultaneous motion. The moving cards should be the focus; header text, hints, and glow should stay quiet.

### Spread

The three cards should dominate the composition.

The triangular guide, outer circles, card aura, position labels, and flip hint should be lower contrast. The next card cue should remain, but it should guide attention without creating a second focal object.

After all cards are flipped, the closing action should be clearer and more app-like while still matching the ritual tone.

### Daily

Treat daily draw as a focused single-card reading.

Reduce the sigil and radial glow intensity around the card. Once revealed, prioritize the card name, orientation, keywords, and the detail entry. The text hierarchy should be closer to editorial reading than decorative UI.

### Deck

Keep the deck grid dense enough for browsing, but clean up the hierarchy:

- Tabs should be easy to scan and not feel fragile.
- The group header should be smaller than the actual card grid.
- Card thumbnails should stay visually consistent with the rest of the app.

## Component System

Create or consolidate a small set of reusable UI conventions:

- Back control: same placement, size, and pressed state across screens.
- Text action: shared style for quiet actions such as return, read more, and close.
- Icon entry: shared style for top-level shortcuts like deck and daily.
- Hint text: one scale, color, and spacing rule for instructional hints.
- Card label: shared treatment for card names, position labels, and orientation.

Do not introduce heavy card-like panels around every section. Cards should be reserved for actual tarot cards, repeated deck items, and modal/detail surfaces.

## Visual System

Keep the palette, but reduce overuse:

- Gold: focus, active state, selected state, and important ritual lines.
- Parchment: primary readable text.
- Lilac or muted purple: secondary text and quiet labels.
- Ink: dominant background.

Use glow as an accent, not a default. If several elements glow at once, only one should be strong.

Reduce background star density on screens where text or cards need focus. Prefer static low-density stars over multiple simultaneous animated layers.

## Motion System

Keep meaningful motion:

- Screen crossfade.
- Question dissolve.
- Shuffle and cut sequence.
- Card flip.
- Detail open and close.

Reduce constant decorative motion:

- Lower particle count.
- Lower breathing glow intensity.
- Avoid multiple pulsing elements in the same viewport.
- Keep idle animation subtle enough that the interface still feels settled.

Motion should clarify state changes, not continuously ask for attention.

## Accessibility And Usability

Maintain mobile-first portrait behavior and safe-area spacing.

Controls should have practical tap targets even when they appear visually minimal. Text must stay readable on small screens and must not overlap fixed-position card layouts.

Because this is a PWA, the interface should feel native: predictable back behavior, clear touch feedback, and no ambiguous decorative controls masquerading as actions.

## Verification

Use `npx tsc --noEmit` as the main verification gate. Do not run `pnpm build`.

For visual QA after implementation, inspect the app at mobile and desktop portrait-strip sizes. Check:

- Home, input, shuffle, spread, daily, deck, and detail screens.
- Safe-area spacing.
- Tap targets.
- Text overflow and overlap.
- Motion intensity and focus hierarchy.

## Open Decision

The implementation should start with the smallest high-impact pass:

1. Normalize control styles.
2. Reduce background, glow, and decorative intensity.
3. Refine typography and spacing screen by screen.

This sequence improves perceived quality without risking the card draw logic or PWA runtime behavior.
