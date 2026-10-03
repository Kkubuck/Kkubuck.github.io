# Design system: Liquid Glass Chrome

The content is calm paper. Only the chrome that floats above it is glass. One light source lights every piece of glass on the page, so the highlights agree with each other and with the pointer.

The site is a blog, not a portfolio, a lab page or a landing page. Nothing on it introduces the author or explains the site. The only branding is the wordmark **Kkubuck** with a small **Blog**.

Source of truth: tokens in `src/app/globals.css`; component styles in `src/styles/` (one file per area: `base`, `glass`, `shell`, `list`, `pages`, `overlays`, `reading`); the light model in `src/components/glass/`. If this document and the code disagree, fix one of them in the same change.

## The owner's rules

These come from the owner, in his words where possible. They are not up for reinterpretation.

1. **No intro or tagline copy anywhere on home.** No "읽은 논문과 공부한 것을 정리합니다", no "컴퓨터 비전을 연구하는 이지상의 블로그입니다". The home page is the wordmark, the dock, the category control and the list. The site description exists only in metadata (`<meta name="description">`, og, RSS, manifest).
2. **Clean, well-designed blog.** "완벽하게 깔끔하게 딱 블로그 느낌". Korean long-form readability is the product.
3. **Monochrome.** There is no accent colour: links, focus, the current tab, search matches and the TOC indicator are all ink. The only colour on the site is inside code blocks (syntax tokens).
4. **No AI tells.** No gradient washes, glow blobs, aurora or mesh backgrounds, gradient text, emoji, sparkles, coloured pill badges, bento grids, fake stats, "welcome" heroes, typewriter text, heavy drop-shadowed cards, or every element fading in on scroll.
5. **Light reflection (빛반사) is a material property, not decoration.** It must be visible in light mode at rest, without moving the mouse, and physically believable: a glint on the edge facing the light, a dimmer counter-glint on the far inner wall, a shadow that leans away.

## Colour tokens

All colours are CSS custom properties on `:root`, switched by `data-theme` on `<html>` (set before first paint by the head script in `src/lib/theme.ts`) and by `prefers-color-scheme` when JS is off.

| token | light | dark | use |
|---|---|---|---|
| `--paper` | `#F5F5F2` | `#0E0E10` | page background, browser `theme-color` |
| `--surface` | `#FBFBF9` | `#141416` | summary object, series box |
| `--sunken` | `#EDEDE9` | `#18181B` | inline code, current item |
| `--track` | `#E8E8E4` | `#1C1C1F` | segmented rail |
| `--ink` | `#16161A` (17:1) | `#EEEEF0` | titles, links, focus ring, rules |
| `--ink-body` | `#2A2A2F` | `#D3D3D8` | body text |
| `--ink-2` | `#4D4D55` (7.7:1) | `#A8A8B0` (8.2:1) | descriptions, secondary text |
| `--ink-3` | `#6A6A72` (4.9:1) | `#8A8A93` (5.6:1) | meta, captions (the lightest text allowed) |
| `--seg-count` | `#626269` (4.9:1 on track) | `#92929B` | tab counts on the rail |
| `--line` / `--line-2` | ink at 8.5% / 15% | white at 7.5% / 13% | hairlines / link underlines, separators |
| `--hover` | ink at 5% | white at 6% | hover wash |
| `--selection` | ink at 13% | white at 20% | text selection |
| `--scrim` | `rgb(14 14 16 / .38)` | `rgb(0 0 0 / .45)` | behind modal sheets |

Contrast figures are against `--paper`. Never introduce text lighter than `--ink-3`.

**Code palette** (`--code-*`, `--t-*`; mapped onto one Shiki theme of CSS variables in `src/lib/code-theme.ts`). Every token is at least 4.5:1 on `--code-bg` in both themes.

| token | light | dark |
|---|---|---|
| background / ink | `#FBFBF9` / `#2A2A30` | `#131315` / `#E1E1E6` |
| keyword | `#B3245F` | `#FF7FAA` |
| function | `#1F55C4` | `#8DB3FF` |
| string | `#2C7646` | `#8ED19F` |
| number, constant | `#A0520A` | `#F0B272` |
| comment | `#72727B` | `#84848F` |
| builtin | `#0B6C7E` | `#6FCFDD` |
| operator | `#6A6A74` | `#9A9AA4` |

**Glass material** tokens (`--g-*`) are listed in `globals.css` next to the colours, with a comment on each. The ones that matter most:

| token | light | dark |
|---|---|---|
| tint `--g-tint` at `--g-tint-a` | `246 246 243` at .72 | `30 30 34` at .66 |
| sheet tint `--g-tint-sheet` | .92 | .86 |
| backdrop | blur 11px, saturate 160% (sheets blur 20px) | same |
| outer hairline `--g-hairline` | `rgb(18 18 26 / .2)` | `rgb(0 0 0 / .42)` |
| inner reflection line, lit / far | .55 / .2 | .2 / .07 |
| glint core `--g-glint-a` | 1 | .42 |
| glint underside `--g-under` | graphite at .2 | none |
| micro-shadow `--g-shadow` at `--g-shadow-a` | `34 34 44` at .14 | black at .6 |
| lens at rest `--lens-rest` | white | `64 64 70` |

## Type

Pretendard Variable for everything (`--font-sans`), `ui-monospace` stack for code. Body text uses `word-break: keep-all` and `overflow-wrap: break-word`; headings use `text-wrap: balance`, paragraphs `pretty` (plain `wrap` in WebKit, whose `pretty` breaks after an opening parenthesis). Dates and counts use tabular numerals.

| role | size / line-height / weight / tracking | token |
|---|---|---|
| post h1 | clamp(27px → 37px) / 1.24 / 720 / −0.026em | `--text-h1` |
| post h1, long titles (> ~45em) | clamp(25px → 37px) | `--text-h1-long` |
| prose h2 | 23 / 1.38 / 700 / −0.02em | `--text-h2` |
| prose h3 | 18.5 / 1.5 / 650 / −0.014em | `--text-h3` |
| lede (post description) | 18.5 / 1.72 / 400 | `--text-lede` |
| body | **17 / 1.82** / 400, measure 680px | `--text-body` |
| list title | 17 / 1.5 / 620 / −0.014em (16.5 on phones) | `--text-body` |
| secondary, descriptions | 15.5 / 1.68 (15 on phones) | `--text-md` |
| UI (dock, tabs) | 14.5 / 560 | `--text-ui` |
| meta, captions | 13.5 and 12.5 / 1.6 | `--text-sm`, `--text-xs` |
| code | 13.5 / 1.75 | — |
| wordmark | 20 / 720 / −0.035em; `Blog` 420 in ink-3 | `--text-wordmark` |

**Display titles** (post h1, list rows, paper card, pager, series box, about publications) go through `typesetTitle()` in `src/lib/keep-parens.tsx`: hyphens inside Latin words become U+2011 so "Mixed‑Scale" never breaks, words holding a parenthesis or quotation mark stay whole, and short function words bind to the next word so no line ends on "A", "the" or "of". Metadata, RSS, search and `<title>` keep the original text. Pretendard's subset has no U+2011, so `src/styles/fonts/pretendard-u2011.woff2` supplies that glyph.

## Layout

- **Column:** `--wrap` 960px with `--gutter` 16px (32px from 720px). The wordmark, year labels and post column share one left edge; the dock's right edge lines up with the right edge of the list and the TOC.
- **Measure:** `--measure` 680px (40em at 17px) for the article.
- **Breakpoints:** 360 (very narrow phones), 640 (phone ↔ tablet), 720 (gutter), 900 (sticky year gutter), 1180 (TOC rail). Use these; do not invent new ones.
- **Home list:** from 900px the year labels sit in a sticky 136px gutter with a count (`34편`). Each row: title, two-line clamped description, and a right column with the date (`04.04`) over one secondary label: venue, else series (short name in `<abbr>`), else category. A label that only repeats the active category is hidden. On phones the right column folds into one meta line (`04.04 · ICCV 2025`).
- **Post:** header (eyebrow · h1 across the full 680px · lede · date and reading time), then the summary object, the prose, and the footer. From 1180px a sticky TOC rail sits in column 2 with an ink bar on the current section; below that a frosted pill `n/N · heading` opens a bottom sheet.
- **Dock:** 46px tall (44px on phones), 14px from the top (12px on phones). Anchored headings clear it with `scroll-padding-top` 88px (76px on phones).
- **Radii:** pills 999px; content 8 / 12 / 16; the ⌘K sheet 26, the TOC sheet 24.

## Content components (never glass)

- **Links:** ink, 1px underline in `--line-2`, offset 0.22em, darkens to ink on hover (`.ink-link`).
- **Summary object:** the paper card (title, authors, venue, then 논문 · PDF · 코드 inline links) and 핵심 요약 (numbered takeaways) are one `--surface` object divided by a hairline. It carries no light cue: an effect that cannot be seen is not shipped.
- **Code:** `--code-bg` plate, toolbar with the language and a copy button (announces "복사됨" through a live region; falls back to `execCommand` outside secure contexts).
- **Tables:** booktabs. 1.5px ink rules top and bottom, a hairline under the head, faint row hairlines, no box or radius. Wrapped in a focusable `.table-scroll` region with edge shades that appear only on a side with more table.
- **Figures:** a white plate with an inset hairline in light mode. In dark mode the plate goes dark and the image is dimmed (`brightness(.78) contrast(.92)`, whites land near `#C0C0BC`). Never invert images.
- **Post footer:** tags as plain text (`#cod  #multi-scale`); the series box lists every item, numbered, the current one marked, in two columns past six items; prev/next as two halves split by a 1px vertical hairline, no card borders.

## The glass budget

Exactly these surfaces are glass (`src/components/glass/Glass.tsx`, `GlassVariant`). Nothing else ever is: not rows, cards, code, tables, tags, the pager or the footer.

| variant | surface | shape | tint | backdrop refraction |
|---|---|---|---|---|
| `dock` | sticky capsule nav: 글 · 태그 · 소개 · 검색 ⌘K · theme; the wordmark docks into its left end once the masthead scrolls away | pill | .72 / .66 | Chromium desktop |
| `lens` | the selected drop in the category control | pill, opaque at rest | `--lens-rest`, clears toward the rail as it lifts | none (its label clone is refracted instead) |
| `sheet` | ⌘K search sheet in a native `<dialog>` | radius 26 | .92 / .86 (+.04 without refraction) | Chromium desktop |
| `pill` | TOC pill below 1180px | pill | .72 / .66 | none, frosted only |
| `tocsheet` | TOC bottom sheet below 1180px | radius 24 | .92 / .86 | none, frosted only |

## The light model

One light for the whole page: `GlassLightProvider` (root layout) and the lazy singleton store in `src/components/glass/store.ts`. One `requestAnimationFrame` loop serves every glass element.

**Light source.**
- `(pointer: fine)`: the pointer, smoothed by a spring (k=170, c=26, critically damped, settles in about 0.3s).
- Otherwise a fixed key light above the top-left of the viewport (`x = 36% of the width, y = −60% of the height`).
- Touch devices: the first 400px of scroll sweep the key light from 14% to 86% of the width, so a phone reader still sees the glint travel.
- `prefers-reduced-motion`: the key light, fixed.

**What each glass object draws** (`src/styles/glass.css`, layers rendered by `<GlassLayers>`):
- `.glass__shadow`: a crisp dark outer hairline and a graphite micro-shadow, 1.5–3px, leaning away from the light. Never a soft grey cushion.
- `.glass__fx`: tint plus backdrop blur and saturate (plus SVG refraction where enabled), a broad sheen toward the light, the inner wall facing the light, a bevel band, and a far-side thickness shade.
- `.glass__rim`: a 1px ring (mask-composited). It is the internal-reflection line, bright on the side facing the light and dim on the far side, with the front glint centred on the nearest rim point and a dimmer counter-glint on the far inner wall. Without refraction the dock and sheet also get a 1px specular line along the bottom edge under the light.
- `.glass__glint`: the glint on the shoulder facing the light. Its white core replaces the dark hairline where it sits (a highlight blows out its edge) and runs 2px inside; in light mode a graphite underside gives the white something to read against on near-white paper.

**Four numbers per element per frame.** `rim.ts` turns the light position into `--ga` (angle of the outward normal at the rim point nearest the light), `--gx`/`--gy` (the centre of curvature behind that point, the conic centre) and `--gn` (nearness, 0–1). The glint tightens as `--gn` grows. The CSS draws everything from these four through conic gradients with a fixed, small stop structure. The defaults in `glass.css` are the key light, so the first paint and the no-JS page already show a correctly lit rim.

**Light mode at rest** is a bright-field rim: dark outer hairline, bright 1px inner reflection line, a narrow strong white glint on the top-left shoulder, a light graphite micro-shadow. Dark mode is the reverse: no underside, a softer glint, a deeper shadow.

### Performance rules

These are hard limits. Check them with `?perf` (see below) after any change to the light or the glass.

- One rAF loop for everything. It runs only while the light spring moves, a target is dirty (resize, scroll for in-flow glass, theme switch) or a target's own animation (the lens) is moving. It stops when everything settles and is cancelled while the page is hidden. Idle costs nothing.
- Per frame: read every rect first, then run ticks, then write. At most four custom properties per element (`--ga --gx --gy --gn`), skipped when unchanged, written on the `display: contents` wrapper `.glass__light`, so a frame restyles the glass layers and never the links and buttons inside.
- No layout-affecting writes in the loop. Animate with `transform` only (the lens moves by translate and scale, never width or height).
- Budget: ≤ 0.5ms of JS per frame for all glass together on an M-series Mac.
- Never put `opacity`, `filter`, `mask` or `clip-path` on the `.glass` element itself: it would become the backdrop root and the blur would go blank. Fade or mask its children instead.
- No WebGL. WebGL cannot see the DOM behind it; SVG filters can.

### Refraction

Backdrop refraction uses `feDisplacementMap` through `backdrop-filter: url(#…)`, which only Chromium renders (Safari and Firefox accept the syntax and draw nothing, so `CSS.supports` cannot detect it). It is enabled only when `navigator.userAgentData.brands` names Chromium, the pointer is fine, `prefers-reduced-transparency` is off and `hardwareConcurrency >= 4`; `html.glass-refract` marks it. The default is the fallback.

- Displacement maps come from the shape's signed distance field, are built in `requestIdleCallback` (with a `setTimeout` fallback), cached per size, and never rebuilt during an animation: while a shape changes size the existing map is stretched (`preserveAspectRatio="none"`) and the right-sized one is built once the size has settled.
- Blur and saturate live inside the SVG filter, because Chromium drops CSS `blur()`/`saturate()` that follow a `url()` in `backdrop-filter`.
- Dock: bevel 13px, scale 22. Sheet: bevel 20px, scale 30.
- The lens refracts its own magnified label clone (CSS `filter: url()`), displacement clamped to 8 (≤ 4px at the rim), with the clone faded to the lens colour in the outer 3px of the bevel so glyphs never tear.

## Motion

| what | curve |
|---|---|
| light position | spring k=170, c=26, integrated at 240 Hz substeps (`spring.ts`) |
| lens x | spring k=520, c=40 (ζ≈0.88, a hair of overshoot) |
| lens lift | spring k=340, c=30; lifts on press or travel, sets down within 10px of the target |
| lens stretch | scaleX `1 + min(.18, |v|/2600)`, volume-preserving squash; the clone magnifies by `1 + .1·lift + .3·stretch` |
| `--ease-spring` | `linear()` curve, about 9% overshoot: TOC bar, palette highlight |
| `--ease-spring-soft` | `linear()` curve, about 2%: dock docking (0.55s), sheets opening |
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)`: fades, list swap (0.2s, +4px) |
| theme switch | View Transition crossfade |

The two `linear()` curves fall back to cubic-béziers where `linear()` is unsupported. Under `prefers-reduced-motion` the light stays at the key light, the lens snaps without lift, stretch or magnification, every CSS transition and animation is zeroed, smooth scrolling is off and the theme switches instantly.

Motion is for the chrome. Content does not animate in on scroll.

## Fallbacks

| condition | what happens |
|---|---|
| Chromium desktop | full stack: refraction, rim, glint, sheen, shadow |
| Safari, Firefox, phones | blur + saturate + the full rim, glint and inner-light stack, plus the 1px bottom-edge specular line on the dock and sheet; sheets +.04 tint |
| no `backdrop-filter` | every glass surface at least .92 tint |
| `prefers-reduced-transparency` | opaque surfaces, rim kept, no backdrop filter (last rule in source order, so it wins) |
| `prefers-reduced-motion` | fixed key light, snapping lens, no transitions, instant theme switch |
| `forced-colors` | `Canvas` surfaces, `CanvasText` rim |
| no JS | posts fully readable; the static CSS rim lit from the key light; category tabs are plain links with a static pill on the current one; search and theme controls hidden (`html.js` gates them); the TOC rail's links work on wide screens |

## Accessibility

- Focus: a 2px ink outline, offset 2px, visible in both themes. On the category control the ring is drawn on the lens, because the tab under it is covered.
- Keyboard: ⌘K / Ctrl+K / `/` opens search; ←/→/Home/End move through the category tabs (roving tabindex); Esc closes sheets and returns focus; a skip link leads to `main`.
- Search ignores Enter and arrow keys while a Korean IME is composing (`isComposing` or `keyCode 229`). Matches are marked in ink (weight and underline), not colour.
- Dock labels stay at least 4.5:1 over the busiest content scrolling under them (post titles, code blocks).

## Do and don't

**Do**
- Keep the home page to wordmark, dock, category control and list.
- Use ink, hairlines and weight for emphasis.
- Light any new glass through `<Glass>` / `useGlass` and the shared store.
- Use the tokens; add a token in both themes (and in the `prefers-color-scheme` block for no-JS readers) when a new value is needed.
- Check every visual change in light and dark, at 1440px and 390px, in Chrome and Safari (WebKit), and with reduced motion.
- Keep motion on transforms and opacity, short, and springy only on the chrome.

**Don't**
- Add intro, tagline, "about this blog" or welcome copy anywhere on home.
- Add an accent colour, coloured badges or coloured links.
- Make a new surface glass, or give content cards blur, glow or heavy shadows.
- Add gradient washes, glow blobs, gradient text, emoji, sparkles, bento grids or scroll-reveal animations.
- Add WebGL, canvas backgrounds or a 3D object.
- Write layout properties (width, height, top, left) in the light loop, or rebuild gradient strings per frame.
- Ship an effect nobody can perceive.

## Testing the glass

Query flags (kept for visual-regression screenshots):

| flag | effect |
|---|---|
| `?light=x,y` | pins the light at viewport coordinates |
| `?perf` | records frame times in `window.__glassPerf` (frames, totalMs, maxMs, maxReadMs, map build stats) |
| `?refract=0` | forces the no-refraction fallback |
| `?reduced` | forces reduced-motion behaviour |
| `?slowmo=10` | runs every spring ten times slower |
