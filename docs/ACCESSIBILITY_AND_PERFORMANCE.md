# Accessibility and Performance

## Accessibility baseline

The site is designed around WCAG 2.2 AA expectations. Automated checks cannot prove full conformance, so the repository pairs structural checks with browser and keyboard review.

### Semantics

- One `<main>` landmark per page.
- Global `<header>`, navigation, and `<footer>` landmarks.
- Article pages use `<article>`, nested `<header>`, `<nav>`, `<aside>`, and `<footer>`.
- Archive rows are anchors rather than clickable containers.
- Search uses `<dialog>`, `<input type="search">`, and a result list.
- Filters use labeled native input/select controls.
- Dates use `<time>` where displayed in article metadata.

### Keyboard

Required path:

1. Tab from browser chrome.
2. Skip directly to main content.
3. Reach brand, primary navigation, search, theme, and mobile menu in visual order.
4. Open search, enter text, navigate results with arrows, open with Enter, close with Escape.
5. Operate all archive filters.
6. Reach every article action and source link.
7. Navigate tables without forcing page-level horizontal scroll.

### Focus

- Focus uses a 2px high-contrast outline with 4px offset.
- Focus is never intentionally suppressed.
- The modal dialog traps focus through browser behavior.
- Closing search returns focus to the opener.
- Sticky elements do not cover target headings because headings use scroll margin.

### Targets

Persistent icon controls are 44×44px. Navigation and buttons have at least 44px block size. Dense tags are secondary text links and remain padded; they are not the only route to content.

### Text and zoom

- Body type is never below the browser default equivalent on supported widths.
- Article measure is capped rather than shrinking type on large screens.
- Layouts use flexible tracks and wrap.
- 200% zoom and narrow reflow should not cause two-dimensional page scrolling.
- Korean prose uses `word-break: keep-all` with `overflow-wrap: anywhere` as a final safety valve.

### Contrast

Color roles were selected to meet ordinary text contrast in both themes. Build-time token review and browser contrast inspection should be repeated when tokens change. Translucent borders and decoration are not relied on for text or focus contrast.

### Motion

- `prefers-reduced-motion` is treated as a functional mode.
- No essential meaning depends on animation.
- Continuous motion is limited to one visible canvas.
- User scrolling is never intercepted.
- Animation from direct interaction is brief and bounded.

## Performance model

### Rendering

Every content route is prerendered. Initial article text does not wait for JavaScript, API calls, or hydration.

### JavaScript

One site bundle handles optional enhancements. It avoids third-party code and initializes features only when matching DOM exists.

- Search data is lazy-loaded.
- Canvas rendering is visibility-aware.
- Scroll handlers schedule writes through `requestAnimationFrame`.
- Passive listeners are used for scroll.
- Pointer tilt is initialized only for fine pointers.

### CSS

One shared stylesheet contains tokens and components. Cascade layers make ordering explicit. New component CSS should reuse tokens before adding values.

### Media

- Existing article assets are preserved.
- New interface icons are inline SVG.
- The favicon is SVG.
- No webfont assets are shipped.
- The primary social image is a compressed local PNG.

### Build budgets

The verifier warns above:

- 160 KiB total emitted CSS.
- 120 KiB total emitted JavaScript.

These are guardrails, not targets. A budget increase requires a documented reason and measured benefit.

### Canvas budget

- Maximum DPR: 1.6.
- Node count: 40–78 depending on host width.
- Frame cap: approximately 42 fps.
- Maximum retained ripples: four.
- Visibility pause: IntersectionObserver and document visibility.
- No texture, shader, offscreen worker, or physics dependency.

## Manual audit protocol

At each major release test:

- 390×844 mobile portrait.
- 768×1024 tablet portrait.
- 1440×900 desktop.
- Keyboard-only navigation.
- 200% zoom.
- Light and dark theme.
- Reduced-motion emulation.
- Touch/coarse pointer behavior.
- Search success, no-results, and network-failure states.
- A long paper title and a Korean-heavy article.
- A page with a wide table and multiple images.
- Browser console errors and failed requests.

## Source references

- WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- WCAG 2.2 Focus Visible: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- WCAG 2.2 Target Size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- web.dev, prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
