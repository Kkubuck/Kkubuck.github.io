# Technology Stack and Language Rationale

## Executive decision

The site is implemented with:

- **Astro 7** for static routing, content collections, Markdown rendering, and build output.
- **TypeScript 6** for browser behavior, content schemas, and build-time safety.
- **Semantic HTML** for durable content and interaction contracts.
- **Modern CSS** for the complete visual system and most motion.
- **Canvas 2D** for one bounded interactive visualization.
- **Node.js 24 in CI** and Node.js 22.12+ locally.

The result is a static site: GitHub Pages serves generated HTML, CSS, JavaScript, JSON, XML, images, and documents. There is no production Node server.

## What “language” means in this project

Several layers are involved:

| Layer | Language/format | Responsibility |
|---|---|---|
| Content | Markdown + YAML front matter | Long-form reviews, metadata, links, takeaways |
| Templates | Astro component syntax | Build-time composition of pages and layouts |
| Structure | HTML | Landmarks, links, forms, dialog, article semantics |
| Presentation | CSS | Tokens, responsive layout, themes, transitions, scroll animation |
| Interaction | TypeScript | Search, filters, canvas, accessibility state, fallbacks |
| Data | JSON | CV, projects, profile, migration manifest |
| Automation | JavaScript modules + YAML | Verification, redirects, GitHub Actions |

A visitor downloads ordinary HTML/CSS and one compiled JavaScript bundle. Astro component code and TypeScript types do not ship as source runtime.

## Why TypeScript now

GitHub’s 2025 Octoverse analysis reported that TypeScript became the most-used language on GitHub by contributor counts in August 2025, ahead of Python and JavaScript. Popularity alone is not a design reason, but it confirms that typed JavaScript is a mainstream maintenance choice rather than a niche addition.

For this repository, TypeScript provides practical value:

- Typed content records and search items.
- Null-safe DOM selection.
- Explicit event and element types.
- Compile-time detection of framework API changes.
- Safer refactoring than untyped global scripts.
- No additional browser runtime after compilation.

## Why Astro 7

Astro matches the site’s content-first workload:

- Static generation is the default.
- Markdown entries are first-class content records.
- Zod-backed schemas reject malformed front matter.
- Pages can include JavaScript only where needed.
- RSS and sitemap output are official integrations.
- GitHub Pages has an official maintained deployment action.
- Astro 7 uses the current Vite/Rolldown toolchain and modern Node baseline.

Astro 7’s June 2026 release moved to Vite 8/Rolldown and continued compiler and Markdown performance work. The project pins exact package versions in `package.json` and `pnpm-lock.yaml` to make CI reproducible.

## Why not Next.js or React

React is appropriate for complex stateful applications, but this archive does not need:

- Server rendering on request.
- Authentication.
- Mutating application state.
- Real-time collaboration.
- Client-side data cache synchronization.
- Large reusable interactive widget trees.

Using React here would add hydration, dependency surface, and framework conventions without improving article delivery. Components are still available at build time through Astro.

## Why not Tailwind CSS

A utility framework was rejected because:

- The visual system is small and deliberately tokenized.
- Long class strings would obscure semantic component structure.
- There is no need for a third-party design vocabulary.
- Native cascade layers and custom properties provide sufficient organization.
- The repository benefits from a readable source-of-truth stylesheet for design review.

This is not a claim that Tailwind is generally inferior; it is a scope decision.

## Why not GSAP, Framer Motion, or an animation library

The required interactions are covered by:

- CSS transitions.
- CSS Scroll-Driven Animations.
- Native View Transitions.
- IntersectionObserver fallback.
- `requestAnimationFrame` for a single canvas.

An animation dependency would duplicate platform features and enlarge the maintenance surface. A library should be reconsidered only if future storytelling requires timeline orchestration that cannot be expressed accessibly with native behavior.

## Why not Three.js/WebGL

The live hero visual needs points, connections, pointer displacement, and ripples. Canvas 2D handles this directly. WebGL would add:

- Shader and GPU compatibility complexity.
- A larger dependency or custom rendering layer.
- More demanding accessibility fallback design.
- Higher risk of battery and thermal cost.
- No meaningful improvement to the information being communicated.

## CSS capabilities used

- Cascade layers.
- Custom properties and semantic tokens.
- `clamp()` fluid type and spacing.
- Grid and Flexbox.
- `color-mix()` progressive color composition.
- `scrollbar-gutter`.
- `text-wrap: balance` and `text-wrap: pretty`.
- `@view-transition { navigation: auto; }`.
- `animation-timeline: scroll()` and `animation-timeline: view()` with feature queries.
- `prefers-reduced-motion`.
- `hover`/`pointer` media queries.
- Print stylesheet.

Fallbacks preserve content and layout when a newer feature is unavailable.

## Browser API use

| API | Use | Failure behavior |
|---|---|---|
| `<dialog>` | Global search | Search trigger is omitted only if unsupported by the browser’s baseline; content remains navigable |
| Fetch | Lazy-load search index | Search shows a load error; archive pages still work |
| Canvas 2D | Signal field | Static CSS geometry remains |
| IntersectionObserver | Narrative state, TOC, reveal fallback, canvas pause | Content remains visible; state simply does not update |
| ResizeObserver | Canvas sizing | Canvas may retain initial size; page content unaffected |
| Clipboard API | Copy URL | Reports failure without blocking article use |
| Web Share API | Native share sheet | Falls back to copy link |
| View Transition API | Navigation continuity | Normal navigation |
| Scroll-Driven Animations | Progress and entry reveals | JavaScript or immediate static fallback |

## Dependency policy

A production dependency is allowed only when all conditions are met:

1. It solves a product requirement not adequately covered by the platform.
2. Its shipped bytes and execution cost are measured.
3. It is actively maintained and compatible with static output.
4. Failure does not block reading.
5. The repository documents why native implementation was rejected.

Current production dependencies are limited to Astro and two official Astro output integrations.

## Version policy

- Exact versions are pinned.
- `pnpm-lock.yaml` is committed.
- Major upgrades require `pnpm run verify` and browser regression tests.
- Current versions are documented in `package.json`, not duplicated as an untrusted badge.
- Dependabot or a scheduled update workflow can be added later, but updates should not auto-merge visual/runtime changes.

## Sources

Accessed July 10, 2026.

- Astro 7 release: https://astro.build/blog/astro-7/
- Astro content collections: https://docs.astro.build/en/guides/content-collections/
- Astro GitHub Pages deployment: https://docs.astro.build/en/guides/deploy/github/
- TypeScript official site: https://www.typescriptlang.org/
- GitHub Octoverse 2025 language analysis: https://github.blog/news-insights/octoverse/octoverse-2025/
- Chrome, Scroll-Driven Animations: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- Chrome, View Transition API: https://developer.chrome.com/docs/web-platform/view-transitions/
