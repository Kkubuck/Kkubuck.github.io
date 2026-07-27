# Kkubuck

A static archive of computer-vision paper reviews, implementation notes, and research history. Built with Astro, deployed to GitHub Pages.

Live site: <https://kkubuck.github.io>

## Design

The interface is an editorial archive, not a landing page.

- Warm paper background, near-monochrome ink, one deep accent used only for links, focus, and active state.
- Hairline rules instead of cards and shadows.
- Local font stacks only. No webfont download, no layout shift.
- Motion is limited to colour and opacity changes under 200 ms on direct interaction. There are no scroll-triggered reveals, no parallax, and no decorative canvas.

## Mobile

The stylesheet is mobile-first and layered by capability rather than by screen size alone.

- Breakpoints at 640, 840, and 1024 px, written as `min-width` / `max-width`. Range syntax (`width >= 40rem`) is discarded outright by browsers older than 2023, which would drop every layout rule at once.
- Hover styling lives behind `(hover: hover) and (pointer: fine)`. Touch devices report a hover state that persists after a tap, so an untouched rule leaves rows and tiles highlighted after navigation.
- Touch targets are raised to 44 px behind `(pointer: coarse)`. Header controls only shrink under `(min-width: 1024px) and (pointer: fine)`, so a large tablet keeps full-size buttons.
- Every filter and search input is 16 px on small screens. Below that, iOS Safari zooms the viewport on focus and does not zoom back out.
- Search opens full screen on phones. A centred sheet competes with the on-screen keyboard and leaves too little room for results.
- The table of contents is a `<details>` disclosure below 1024 px and a sticky rail above it. One set of markup; the script sets the open state per breakpoint because CSS cannot force a `<details>` open.
- Entry rows put the date and venue on a shared meta line above the title, rather than stacking the venue below the summary where it would read as an afterthought.
- Tables and code blocks scroll inside their own container with `overscroll-behavior-x: contain`, so a horizontal swipe never turns into a page-level gesture.
- `viewport-fit=cover` is deliberately not set. The default viewport inset keeps content clear of the notch and home indicator, and the letterboxed area picks up the page background.

## Features

Reader-facing:

- Global search over every entry (`⌘K` / `Ctrl K`, or `/`), with arrow-key navigation.
- Archive filtering by text, year, and venue. Filter state is mirrored into the URL, so a filtered view is shareable.
- Table of contents with active-section highlighting on articles that have more than one section.
- Reading progress indicator on article pages only, driven by CSS Scroll-Driven Animations where available.
- Copy buttons on code blocks, and a copy-link action per article.
- Light and dark themes, defaulting to the system preference and remembered per browser.
- Topic index that routes each topic to the archive actually containing its entries.
- RSS feed, sitemap, and `robots.txt`.

Not included, by choice: comment widgets, analytics SDKs, view counters, share buttons beyond copy-link, and animated hero graphics.

## Stack

- Astro 7 (static output)
- TypeScript
- Semantic HTML and modern CSS: cascade layers, custom properties, `clamp()`, Scroll-Driven Animations, View Transitions
- GitHub Pages via the official Astro action

No UI framework, CSS framework, animation runtime, or client-side router.

## Local development

Requires Node.js 22.12 or newer. CI builds on Node 24, so that is the version to match locally.

```bash
npm install -g pnpm@10.13.1
pnpm install --frozen-lockfile
pnpm run dev
```

Astro prints the local URL, normally <http://localhost:4321>.

Corepack is no longer distributed with Node.js 25 and later, so `corepack enable` is not a reliable way to obtain pnpm. Installing the pinned version through npm works on every supported Node release. If Corepack is available and preferred, `corepack enable && corepack use pnpm@10.13.1` is equivalent.

## Verification

```bash
pnpm run verify
```

## Packaging

```bash
pnpm run package
```

Writes `../<folder>-source.zip` containing the repository-ready source. Dependencies, build output, caches, and every dotenv file are excluded; `.env.example` is kept.

This runs Astro and TypeScript diagnostics, a production build, legacy URL generation, and `scripts/verify-build.mjs`, which checks:

- every required route, feed, and manifest exists;
- the expected number of papers, notes, and search records;
- the shell still ships search, the theme toggle, and the mobile navigation;
- articles still ship the table of contents hooks, reading indicator, and copy-link action;
- retired effects have not returned through a stale import;
- per-page `lang`, `title`, `description`, and canonical URL;
- no duplicate element ids, no `http://` references, and no `target="_blank"` without `rel="noopener"`;
- every local `href` and `src` resolves to a real file in `dist/`;
- CSS and JavaScript stay inside the payload budget.

## Deployment

1. Push to `main`.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. `.github/workflows/deploy.yml` runs `pnpm run verify` and publishes `dist/`.

This repository uses the `<username>.github.io` naming pattern, so no `base` path is needed. For a project repository, set `BASE_PATH=/repository-name` before building.

## Content

Posts live in `src/content/posts/` and are validated by `src/content.config.ts`.

| Front matter | Effect |
| --- | --- |
| `kind: paper` | Publishes to `/papers/<slug>/` |
| `kind: note` | Publishes to `/notes/<slug>/` |
| `takeaways` | Renders the "In short" panel above the article |
| `subtitle` | Renders as the article lede |
| `sourceUrl`, `pdfUrl`, `codeUrl` | Render source actions |
| `venue`, `paperYear`, `authors` | Feed the archive filters and metadata |
| `draft: true` | Excluded from every route and feed |

## Project layout

```
src/
  components/   SiteHeader, SiteFooter, SearchDialog, Archive, PostRow
  content/      Markdown entries
  data/         site.ts, cv.json, projects.json, post-manifest.json
  layouts/      BaseLayout, PostLayout
  lib/          content helpers, base-path helpers
  pages/        routes, plus search.json / rss.xml / robots.txt endpoints
  scripts/      site.ts — the only client bundle
  styles/       global.css — the whole design system
scripts/        create-legacy-redirects.mjs, verify-build.mjs, package-source.mjs
```

## Notes on the older documents

`docs/` and `MIGRATION.md` describe the previous version of this site, including interaction patterns that have since been removed. Treat this README as the current reference.
