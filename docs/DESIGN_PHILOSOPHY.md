# Design Philosophy

## 1. Product definition

Kkubuck is a research interface, not a portfolio template, magazine theme, or animated landing-page demo. Its primary job is to make difficult technical writing easier to enter, navigate, compare, and return to.

The experience is organized around four promises:

1. **Legibility before atmosphere.** Typography, hierarchy, and line length must work before decorative effects are considered.
2. **Structure should be felt, not advertised.** Layout divisions clarify information without surrounding every object with a card or border.
3. **Motion must explain state or progress.** Interaction is allowed only when it communicates location, relationship, continuity, or responsiveness.
4. **The archive remains durable without JavaScript.** Reading, navigation, source links, and content discovery continue to work as static HTML.

## 2. Why the previous direction was rejected

The previous design used serif typography, Korean interface labels, ornamental paper metaphors, and a stylized “field notes” identity. Those choices made the interface feel older than the subject matter and competed with long technical titles. They also created a recognizable generated-theme aesthetic: too many themed surfaces, over-explicit labels, and decoration that did not carry information.

This redesign removes:

- Serif display and body typography.
- Korean navigation and system labels.
- Decorative paper, handwriting, notebook, neon, and glass-morphism motifs.
- Uniform card grids for every content type.
- Scroll hijacking, custom wheel physics, and animation that delays reading.
- Heavy client frameworks for static content.
- External font downloads and icon packages.

## 3. Reference synthesis

This system does not copy a single company site. It extracts durable principles from several mature design organizations.

### Apple: hierarchy, directness, and restraint

Apple’s Human Interface Guidelines emphasize clear visual hierarchy, legible typography, appropriate contrast, familiar interaction, and motion that helps people understand change. The implementation adopts those ideas through a small type scale, generous but purposeful spacing, large touch targets, immediate controls, and reduced-motion behavior.

What is adopted:

- One dominant action per context.
- Plain, direct interface language.
- High-quality typographic rhythm instead of ornamental framing.
- Familiar controls and consistent system feedback.
- Motion used to maintain spatial continuity.

What is not copied:

- Product-marketing scale, cinematic media, or full-screen storytelling.
- Apple-specific visual materials or device imagery.
- Scroll sequences that make sense for a product reveal but obstruct an archive.

### Linear: low-noise structure

Linear’s 2026 design refresh describes an interface where “structure should be felt, not seen,” with fewer and softer borders. That is especially useful for a research archive: the reader should perceive grouping and rhythm without seeing a grid of boxed modules.

The blog therefore uses:

- Rules only at meaningful transitions.
- Shared alignment lines across header, hero, archives, and article content.
- A limited number of elevated surfaces.
- Dense metadata set in a small mono face, separated from reading text.
- Hover states that expose interaction without permanently increasing visual noise.

### Vercel Geist: token discipline and high contrast

Geist demonstrates how a restrained system can remain expressive through type, spacing, color roles, and reusable primitives. The implementation follows that systems approach rather than copying individual components.

The blog uses:

- Semantic color tokens (`--bg`, `--text`, `--muted`, `--line`, `--accent`).
- A compact, fluid type scale.
- System-aware light and dark themes.
- Sans-serif reading typography and mono metadata.
- Shared button, tag, archive, and article primitives.

### Stripe: interaction with a communication goal

Stripe’s engineering writing on interactive graphics stresses that advanced rendering should serve a specific communication objective. The live canvas field follows this rule: it visualizes a responsive network and signals that the page is interactive, but never blocks content, captures scrolling, or becomes a required control.

The interaction is intentionally 2D rather than a Three.js/WebGL scene because the message does not require depth, texture, or a 3D camera. The simpler medium improves reliability, input latency, power consumption, and maintenance.

## 4. Visual language

### Typography

The stack is deliberately local and sans-serif:

```css
Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont,
"Segoe UI", "Noto Sans KR", sans-serif
```

Inter is used only when already installed. Apple platforms use San Francisco through `-apple-system`; Windows uses Segoe UI; Korean text falls through to Noto Sans KR or the user’s system sans. No font files are shipped.

Rules:

- Body size is fluid from approximately 16px to 18px.
- Article leading is approximately 1.82 for mixed Korean/Latin technical text.
- Article measure is capped at 760px.
- Headings use weight and scale, not a separate display family.
- Large titles use tight tracking but never condensed text.
- Mono is reserved for dates, venue labels, counters, shortcuts, and machine-like metadata.
- Uppercase is limited to short metadata; prose is never transformed.

### Color

The palette is neutral with one cobalt action color and one green status signal.

- Backgrounds are slightly warm in light mode and near-black in dark mode.
- Text contrast is stronger than decorative contrast.
- Borders use translucent neutral ink and never define every object.
- Accent color communicates action, current state, focus, and links.
- Gradients are sparse, low-amplitude, and spatial—not decorative rainbow fills.

Color is never the only carrier of state. Current navigation has both color and surface; focus has an outline; selected results have state attributes; form controls have labels.

### Spacing and grid

- Maximum content width: 1240px.
- Adaptive gutter: 20px to 56px.
- Reading width: 760px.
- Header height: 72px desktop, 64px compact.
- Major section rhythm: approximately 88px to 168px.
- Mobile layouts collapse structurally rather than scaling desktop modules down.

The base layer includes a very low-opacity grid near the top of the page. It references measurement and systems work, but fades before the reading region and never reduces text contrast.

### Shape

Rounded geometry is functional rather than thematic:

- Pills for compact actions and tags.
- Small radii for inputs and code blocks.
- Circular controls for icon-only actions.
- Large radii only for the modal search surface.
- Archive rows and major sections remain mostly unboxed.

## 5. Information architecture

The primary navigation contains five stable destinations:

- Home
- Papers
- Notes
- Projects
- About

CV, Tags, RSS, GitHub, and Email are secondary destinations placed in contextual links and the footer. This keeps the header small and gives the two core content types—Papers and Notes—clear priority.

### Home

The home page performs five tasks in order:

1. Defines the archive’s purpose.
2. Demonstrates restrained interaction.
3. Quantifies the archive.
4. Exposes recent writing.
5. Explains the editorial research loop and author context.

### Archives

Papers and Notes use the same archive grammar so learned behavior transfers. Filtering supports free text, year, and venue/type. All entries remain in source order in HTML and are hidden only after client-side filtering.

### Article

The article layout separates:

- Identity and source metadata.
- Three high-value takeaways.
- Navigable body content.
- Persistent table of contents on wide screens.
- Source, PDF, code, copy, and share actions.
- Adjacent reading.

The Korean body content remains unchanged. The surrounding interface is English.

## 6. Interaction principles

### Native-first

Use platform behavior before custom behavior:

- Native document scrolling.
- Native `<dialog>` for search.
- Native links and form controls.
- CSS Scroll-Driven Animations where supported.
- Cross-document View Transitions where supported.
- IntersectionObserver only as a progressive fallback.

### Scroll is an input, not a hostage

The wheel/trackpad drives the research-loop narrative because the visual stage is sticky while the adjacent steps move through normal document flow. The implementation never prevents default wheel behavior, remaps vertical movement to horizontal motion, or adds artificial easing to page position.

The result feels synchronized with the reader’s scroll while preserving:

- Browser scrollbars.
- Keyboard scrolling.
- Find-in-page.
- Anchor links.
- Back/forward restoration.
- Reduced-motion preferences.

### Pointer behavior

Pointer effects are subtle and optional:

- The canvas network repels slightly from the pointer.
- A press creates a short ripple.
- Archive rows use less than two degrees of perspective response.
- Effects activate only for fine pointers with hover capability.
- Touch does not emulate desktop hover.
- Reduced motion disables continuous and transform-based movement.

### Continuity

Cross-document View Transitions preserve a sense of continuity for the brand and page title in supporting browsers. Unsupported browsers receive an immediate normal navigation. No page depends on transition lifecycle APIs.

### Search

Global search opens with Ctrl/Command-K and supports keyboard result navigation. The full index is fetched only when the user opens or uses search. Search is client-side because the archive is small, static, and privacy-sensitive.

## 7. Content design

Interface writing follows these rules:

- Use concrete nouns and verbs.
- Avoid “discover,” “journey,” “unlock,” and other generic marketing language.
- Labels describe destinations (`Papers`) rather than organizational metaphors.
- Buttons describe the result (`Open curriculum vitae`, `Copy link`).
- Empty states say what happened and how to recover.
- Technical claims distinguish reported evidence from reviewer inference.
- English UI text does not translate or rewrite Korean article bodies.

## 8. Accessibility contract

The design targets WCAG 2.2 AA behavior and includes:

- Semantic landmarks and heading order.
- Skip link.
- Visible focus ring.
- Minimum 44px interactive controls in the persistent interface.
- Keyboard-operable search, navigation, filters, links, and dialog.
- Explicit labels for form fields and icon controls.
- Sufficient text contrast in light and dark themes.
- No information conveyed solely through motion or color.
- `prefers-reduced-motion` support that removes continuous canvas movement, parallax, transform reveal, and smooth scrolling.
- Text that tolerates browser zoom and user text-spacing overrides.
- Horizontal table regions with keyboard focus rather than viewport overflow.

## 9. Performance contract

Budgets are treated as design constraints:

- Static HTML for every article.
- No hydration framework.
- One small site script.
- One stylesheet shared by all pages.
- No external font request.
- No third-party runtime request.
- Canvas DPR capped at 1.6.
- Canvas animation capped near 42 fps and paused when off-screen or hidden.
- Search index loaded on demand.
- CSS and JS payload warnings in the build verifier.

## 10. Anti-pattern checklist

Reject a change when it does any of the following:

- Makes the user wait to see text.
- Captures or changes wheel behavior.
- Adds a framework for one small interaction.
- Uses animation without a state, relationship, or communication goal.
- Requires hover to reveal essential information.
- Replaces a link or button with a non-semantic clickable container.
- Introduces a new color without a semantic role.
- Adds a border to compensate for weak spacing or hierarchy.
- Uses a large headline that forces technical titles into unreadable fragments.
- Makes light and dark themes structurally different.
- Reduces article line height to fit more content above the fold.
- Hides uncertainty in research writing.

## 11. Evaluation questions

Before merging a visual or interaction change, ask:

1. What user problem does this solve?
2. Is the same result possible with semantic HTML or CSS alone?
3. Does the page remain complete without JavaScript?
4. Does it work with keyboard, touch, zoom, and reduced motion?
5. Is the visual hierarchy clearer at 390px, 768px, and 1440px?
6. Does it improve comprehension, continuity, or control?
7. What is the runtime and maintenance cost?
8. Can a future reader understand why this behavior exists from the code and documentation?

## Sources

Accessed July 10, 2026.

- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Apple HIG, Typography: https://developer.apple.com/design/human-interface-guidelines/typography
- Apple HIG, Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- Apple HIG, Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Apple HIG, Writing: https://developer.apple.com/design/human-interface-guidelines/writing
- Linear, A new design for Linear: https://linear.app/now/a-new-design-for-linear
- Vercel Geist Design System: https://vercel.com/geist/introduction
- Stripe Engineering, Building an interactive globe: https://stripe.com/blog/globe
- Chrome for Developers, Scroll-driven animations: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- Chrome for Developers, View Transition API: https://developer.chrome.com/docs/web-platform/view-transitions/
- web.dev, prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
- W3C, WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
