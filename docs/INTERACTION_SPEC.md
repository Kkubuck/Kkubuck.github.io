# Interaction Specification

## Interaction inventory

### Global header

- Stays at the top of the viewport.
- Gains a boundary after the page leaves the top.
- Moves out of view on sustained downward scrolling and returns on upward scrolling.
- Never hides within the first 100px of the document.
- Mobile navigation uses a real button with `aria-expanded` and closes on link activation, Escape, or desktop resize.

### Theme

- Initial theme resolves before first paint from stored preference, then system preference.
- Toggle updates `data-theme`, accessible label, local storage, and the canvas color source.
- Both themes share layout and component geometry.

### Global search

- Opens through the header action or Ctrl/Command-K.
- Uses a native modal dialog.
- Loads `/search.json` on first use, not on page load.
- Scores exact title matches above title substrings, tags, venues, and summaries.
- Displays at most 12 results.
- Arrow keys cycle results; Enter opens; Escape closes.
- Focus returns to the trigger.
- The search index contains all 65 entries.

### Signal field

Purpose: communicate a responsive research network and establish that the interface reacts to direct input.

Behavior:

- Deterministic node distribution.
- Slow orbital movement influenced by early page scroll.
- Pointer proximity displaces nearby nodes.
- Pointer press creates a short outward ripple.
- Node links appear only below a local distance threshold.
- Device-pixel ratio is capped at 1.6.
- Frame rate is capped near 42 fps.
- Animation pauses outside the viewport and when the document is hidden.
- Reduced motion produces a static frame.
- CSS circles and lines remain when canvas is unavailable.

### Research narrative

Purpose: explain the review method through a scroll-correlated model.

Behavior:

- Page scrolling remains native.
- The left stage is sticky on wide viewports.
- Four text steps move through normal document flow.
- IntersectionObserver updates current phase and accessible state.
- Scroll progress rotates three diagram orbits.
- On narrow screens the stage becomes a normal block above the steps.
- Reduced motion removes orbit transforms while preserving every step.

### Archive filters

- Text search, year, and venue/type filters compose with logical AND.
- Search tokenizes normalized Unicode input.
- Hidden rows remain in the document and become visible when filters clear.
- Visible result count updates in an ARIA-live-compatible status region.
- Filter state is mirrored in query parameters with `history.replaceState`.
- The archive works as an unfiltered static list before JavaScript initializes.

### Archive row response

- Fine-pointer hover adjusts less than two degrees of perspective and moves a low-opacity radial highlight.
- Touch and coarse pointers do not receive tilt behavior.
- Reduced motion disables tilt.
- The complete row is a link with visible title, summary, date, venue, and arrow affordance.

### Article reading

- A top progress bar represents document progress.
- CSS scroll timeline drives the bar where available; JavaScript supplies a fallback.
- Wide screens show a sticky table of contents.
- IntersectionObserver marks the current heading.
- Tables are wrapped in keyboard-focusable horizontal regions.
- External article links open in a new tab with `noopener noreferrer`.
- Copy uses the Clipboard API; failure is reported inline without blocking article use.
- Share uses Web Share API with copy fallback.
- Previous and next links remain ordinary anchors.

### Page transitions

- Cross-document View Transitions are enabled as progressive enhancement.
- The site brand and page title receive stable transition names.
- The duration is 260ms.
- Unsupported browsers navigate normally.
- Reduced motion removes transition animation.

## Timing system

| Role | Duration | Use |
|---|---:|---|
| Fast | 150ms | Hover, border, color, button press |
| Medium | 280ms | Header, menu, control state |
| Slow | 650ms | Entry reveal only |
| Page transition | 260ms | Cross-document continuity |
| Canvas ripple | 900ms | Direct pointer feedback |

Easing:

- Standard: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Emphasized: `cubic-bezier(0.16, 1, 0.3, 1)`

## Motion-reduction behavior

When `prefers-reduced-motion: reduce` is active:

- Smooth scrolling becomes immediate.
- CSS reveal animations are removed.
- View transitions are effectively disabled.
- Canvas continuous animation stops.
- Narrative orbit rotation stops.
- Archive perspective response is not initialized.
- The header may still appear/disappear without animated travel only where necessary for state.
- Search, filters, navigation, theme, copy, and share remain functional.

## Input matrix

| Feature | Mouse/trackpad | Touch | Keyboard | Reduced motion |
|---|---|---|---|---|
| Navigation | Yes | Yes | Yes | Yes |
| Search | Yes | Yes | Full | Yes |
| Theme | Yes | Yes | Yes | Yes |
| Canvas movement | Full | Press ripple | Not required | Static |
| Scroll narrative | Native | Native | Native page scroll | Static stages |
| Archive filters | Yes | Yes | Full | Yes |
| Row tilt | Fine pointer only | No | No decoration | Off |
| Article TOC | Yes | Yes | Yes | Yes |
| Share/copy | Yes | Yes | Yes | Yes |

## Implementation boundaries

Do not:

- Call `preventDefault()` on wheel or touchmove for storytelling.
- Add global cursor replacement.
- Require drag to access content.
- Animate font size, line height, or layout-critical text geometry.
- Animate large blurred layers continuously.
- start a canvas loop when the host is off-screen.
- add a new animation dependency for a single effect.
- hide controls until hover.
- use sound or autoplay media.
