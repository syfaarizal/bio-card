# ADR 006 — Mobile-First, Portrait-Only Preview

**Date:** November 2026  
**Status:** Accepted

## Context
BioCard's public profile is shared overwhelmingly on phones — from Instagram bios, WhatsApp
forwards, and QR codes on printed material. Yet the editor preview rendered the card at the
full width of the editor window, and the card itself carried a separate desktop layout
(`md:flex-row`, `lg:` variants) that only appeared on wide screens.

That created two problems:
- **The preview lied.** In the editor, viewport breakpoints were evaluated against the *editor
  window's* width, not the width of the device a visitor would use. A user editing on a laptop
  saw a two-column avatar-and-text card, then opened their own public link on a phone and got a
  completely different stacked layout. There was no way to see the real result without leaving
  the editor.
- **Two layouts meant two bugs.** Every visual change had to be reasoned about twice, and the
  desktop variant was exercised by far fewer people than the mobile one, so it drifted.

## Decision
BioCard is **mobile-first and portrait-only**. There is exactly one card layout: a single
portrait column.

- **The public page** renders the card at `max-w-md` (~448px), horizontally centred. On large
  screens the theme backdrop fills the viewport while the card stays portrait in the middle —
  a Linktree-style presentation. There is no separate desktop layout.
- **The editor preview** renders the card inside an `<iframe>` with a fixed 390px viewport and a
  scrollable frame. Because the iframe has its own viewport, viewport-based media queries
  evaluate against 390px rather than the editor window's width. The preview is therefore
  pixel-identical to the public page on a phone.
- **The device switcher is removed.** There is no desktop or tablet preview to switch to,
  because there is no desktop or tablet layout.
- **Width-dependent styling uses container queries** (`@container` / `@sm:`) on the card, never
  viewport breakpoints (`sm:`, `md:`, `lg:`). The card adapts to the space it is given, so the
  same markup behaves correctly whether it is rendered in the 390px preview frame or centred in
  a 1440px browser.
- **Themes are defined once** as CSS custom properties (`--theme-page`, `--theme-panel`,
  `--theme-soft`, `--theme-border`, `--theme-text`, `--theme-muted`, `--theme-accent`) scoped by
  a `data-theme` attribute, and consumed by the card and the landing gallery alike. A theme can
  no longer be half-applied because one surface hardcoded a different palette.

## Reasoning
- **One layout, one truth** — a single card means the preview and the public page cannot
  disagree. The iframe enforces this at the rendering level rather than by convention.
- **The iframe's viewport is the feature** — it is the only way to make a browser evaluate
  media queries against a fixed width regardless of the outer window.
- **Container queries over media queries** — the card is a component that can be placed in
  different contexts. Media queries make the component depend on the viewport, which is exactly
  the coupling that made the preview untrustworthy. Container queries make it depend on itself.
- **Themes as tokens** — with the card's colours driven by CSS variables rather than Tailwind
  class strings chosen per surface, every theme renders correctly everywhere by construction.
- **Linktree-style desktop presentation** — a wide screen showing a large themed backdrop with
  a centred phone-width card reads as intentional and keeps the card's proportions intact. A
  stretched two-column card reads as a different product.

## Alternatives Considered
- **Keep the device switcher** — rejected. It implies multiple layouts exist, and every layout
  added is a layout that must be kept in sync.
- **Zoom / `transform: scale()` the desktop preview** — rejected. Scaling shrinks the rendered
  pixels and still evaluates media queries against the real viewport, so it does not solve the
  problem and produces blurry output.
- **Render the preview in a fixed-width div without an iframe** — rejected. A `div` has no
  separate viewport; media queries still evaluate against the window.
- **Drop media queries entirely and scale everything with `clamp()`** — rejected as too blunt.
  Container queries give per-element control while keeping the card fluid.

## Consequences
- `ProfileLayout` no longer takes a `mode`/`deviceMode`/`fillHeight` prop. It takes only the
  profile and renders the one layout.
- `components/shared/device-switcher.tsx` is deleted.
- The preview synchronises editor state over `postMessage` (see `features/preview/`), so the
  editor remains the single owner of form state.
- The card's fluid width and internal padding must stay safe down to 320px — the smallest
  phone width we support — with no horizontal clipping.
- Themes must be verified in both the preview frame and on the public page; the shared token
  system is what keeps them in agreement.
