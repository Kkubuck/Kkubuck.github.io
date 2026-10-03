# AGENTS.md

Guide for coding agents and developers working on this repository: the source of <https://kkubuck.github.io>, a Korean computer-vision blog (paper reviews and study notes) by 이지상 (Jisang Lee, GitHub `Kkubuck`). It is a Next.js 16 App Router site exported as static HTML and deployed to GitHub Pages by GitHub Actions.

Read [DESIGN.md](DESIGN.md) before touching anything visual. The owner-facing guide (writing posts, deploying) is [README.md](README.md), in Korean.

## Commands

Node 24 (`.nvmrc`) and npm. Dependencies are pinned to exact versions; install with `npm ci`.

| command | what it does |
|---|---|
| `npm run dev` | dev server on <http://localhost:3000>; posts are re-read on every request |
| `npm run build` | `next build` (static export to `out/`) → `scripts/prune-export.mjs` (drops soft-404 copies of the not-found page) → `scripts/create-legacy-redirects.mjs` (redirect stubs from `src/data/redirects.json`) |
| `npm run verify` | `build`, then `scripts/verify-build.mjs` over `out/`. This is exactly what CI runs before deploying |
| `npm run typecheck` | `next typegen && tsc --noEmit` |
| `node scripts/parity-check.mjs ../Kkubuck.github.io-main/dist` | compares `out/` with the old Astro build (also `OLD_DIST=… npm run parity`) |
| `npm run package` | zips the git-tracked files to `../<folder>-source.zip` (refuses secret-shaped names) |
| `npm run clean` | removes `.next/` and `out/` |

`next.config.ts` sets `agentRules: false` so `next dev` never writes its own AGENTS.md or CLAUDE.md over these.

## Architecture map

```
content/posts/<slug>.md        posts; the file name is the URL (/posts/<slug>/)
public/                        static files copied to out/ as is (images under assets/img/, icons, og card,
                               frozen legacy files kept because live URLs point at them)
src/
  app/                         routes (all static: force-static, dynamicParams = false)
    layout.tsx                 <html>, theme head script, masthead + dock, <main>, footer, ⌘K dialog,
                               GlassLightProvider (the page's single light), IntentPrefetch
    (lists)/layout.tsx         shared by / and /category/<id>/: renders SegmentedNav, so the lens
                               persists across client navigations and animates between routes
    (lists)/page.tsx           home: the full list grouped by year
    (lists)/category/[category]/   one page per CATEGORIES entry
    posts/[slug]/page.tsx      post: PostHeader, summary (PaperCard + Takeaways), prose, tags,
                               SeriesBox, Pager, Toc, CodeCopy
    series/[series]/  tags/  tags/[tag]/  about/  not-found.tsx (→ out/404.html)
    rss.xml/  search.json/  sitemap.xml/  sitemap-0.xml/  sitemap-index.xml/  robots.ts
  components/
    Header.tsx, Footer.tsx, SiteNav.tsx, shell/Dock.tsx      masthead wordmark and the glass dock
    list/SegmentedNav.tsx      category control: real links + the glass lens (springs, scrub, keyboard)
    PostList.tsx, PostItem.tsx year groups and rows (one secondary label per row)
    PostHeader.tsx, PaperCard.tsx, Takeaways.tsx, SeriesBox.tsx, Pager.tsx
    Toc.tsx, overlays/TocPill.tsx, overlays/useActiveHeading.ts   TOC rail (≥ 1180px) and pill + sheet
    SearchDialog.tsx           ⌘K: native <dialog>, lazy /search.json, IME guard
    ThemeToggle.tsx, CodeCopy.tsx, IntentPrefetch.tsx, icons.tsx
    glass/                     the light model: store.ts (one light, one rAF loop), rim.ts (light → 4 CSS
                               vars), spring.ts, refraction.ts (SVG displacement maps, Chromium gate),
                               Glass.tsx (<Glass>, useGlass, GlassLayers, the variant list),
                               GlassLightProvider.tsx
  lib/
    site.ts                    SITE (name, author, links), NAV, CATEGORIES, SERIES
    posts.ts                   reads content/posts, validates front matter (zod), sorting, grouping,
                               tags, search index, dates (Asia/Seoul)
    markdown.ts                remark → rehype → Shiki → rehype-plugins.ts → HTML + headings
    rehype-plugins.ts          figure/figcaption, heading ids, link rewriting, code/table wrappers,
                               keep-parens, image sizes
    smart-punctuation.ts       “” ’ … – —, matching the old Astro output
    glue.ts, keep-parens.tsx, typography.ts   Korean line-break fixes and display titles (U+2011)
    paths.ts                   BASE_PATH, SITE_URL, withBase(), absoluteUrl(), routes, tagSlug()
    metadata.ts                pageMetadata(): title, canonical, og/twitter, RSS alternate
    theme.ts                   no-flash head script; localStorage['theme']; sets html.js
    code-theme.ts              the Shiki theme as CSS variables (light/dark switch in CSS)
    chrome-events.ts           window events between the dock and the overlays (open search, theme)
    sitemap.ts, image-size.ts
  data/
    redirects.json             old path → new path (every legacy URL)
    live-urls.txt              every URL the live site served before the rebuild; verify fails if one 404s
    feed-guids.json            RSS guids of posts published before the move to /posts/<slug>/
  styles/                      base, glass, shell, list, pages, overlays, reading (inside @layer)
  app/globals.css              tokens: Tailwind @theme scale, light/dark colours, glass material
scripts/                       site-config.mjs (BASE_PATH/SITE_URL validation, shared), prune-export,
                               create-legacy-redirects, verify-build, parity-check, package-source
.github/workflows/deploy.yml   npm ci → npm run verify → upload out/ (include-hidden-files) → deploy-pages
```

Server components render everything; client components are only the interactive chrome (`'use client'` in Dock, SiteNav, SegmentedNav, SearchDialog, Toc, TocPill, ThemeToggle, CodeCopy, IntentPrefetch, glass/*). Posts are fully rendered HTML at build time.

## Invariants

Every change must keep these true. Check them before you call a change done.

1. **`npm run verify` passes.** It checks pages, links and anchors, unrendered Markdown, highlighted code, redirects, every URL in `live-urls.txt`, soft 404s, head tags (one h1, canonical, description, lang), RSS, sitemaps, search.json and the manifest.
2. **Parity passes**: `node scripts/parity-check.mjs ../Kkubuck.github.io-main/dist` ends with "No unexpected differences." It guards the migration from the old Astro build (which lives outside this repo; if it is not on disk, say so instead of skipping silently). When markup changes on purpose, add an entry to `INTENTIONAL` (or `CORRECTIONS` for a bug fixed on purpose) with the reason. Never weaken a comparison or widen a wildcard to make a difference disappear. New posts added after the migration legitimately show up as differences on list pages and feeds; content changes are judged by verify.
3. **No intro copy on home.** Wordmark (`Kkubuck` + small `Blog`), dock, category control, list. Category descriptions are metadata and screen-reader text only.
4. **Glass budget.** Only the five `GlassVariant`s are glass: `dock`, `lens`, `sheet` (⌘K), `pill` and `tocsheet` (TOC below 1180px). Content is never glass.
5. **Monochrome.** No accent colour. Links are ink with a `--line-2` hairline underline; focus is a 2px ink ring; search matches are weight and underline. Colour exists only in code tokens.
6. **No WebGL** (no three.js, no canvas effects) and no animation library; the springs are `src/components/glass/spring.ts`.
7. **The light loop stays cheap.** One rAF loop, idle when settled and when the page is hidden; read all rects, then write; at most four custom properties (`--ga --gx --gy --gn`) per element per frame; no layout-affecting writes; transforms only for motion; ≤ 0.5ms JS per frame for all glass (measure with `?perf`). Refraction only behind the Chromium-desktop gate in `refraction.ts`.
8. **Works without JS.** Posts render completely; category tabs are links; search and theme controls are hidden unless `html.js` is set. The static CSS rim is the key-light rim.
9. **URLs never break.** Never delete a line from `live-urls.txt`; add a redirect or keep the file. Never change an existing post's slug without a redirect. Never change an existing RSS guid (`feed-guids.json`). `/assets/files/CV_jisanglee.pdf` stays removed on purpose (it showed a GPA and wrong details); `/cv/` redirects to `/about/`.
10. **Base path safety.** Route paths go through `routes.*` with `next/link`; raw `<a>`, `fetch()`, assets and metadata use `withBase()` / `absoluteUrl()`. Never hard-code `"/..."` in a raw href. Verify builds must also pass with `BASE_PATH=/repo`.
11. **Static export only.** No middleware, rewrites, headers, server actions, runtime data or image optimisation. Every dynamic route has `generateStaticParams` and `dynamicParams = false`; route handlers are `force-static`.
12. **Display titles** (post h1, list rows, paper card, pager, series box, about publications) use `typesetTitle()`; `<title>`, metadata, RSS and search keep the original text.
13. **Budget.** Our own client JS ≤ ~30 KB gzipped (excluding the Next/React runtime). No layout shift from fonts, images or glass hydration (images carry width/height from `rehypeImageSizes`).
14. **No secrets in the repo.** `.env` is ignored; only `.env.example` is tracked.

## How to

### Add a post

Create `content/posts/<slug>.md` (lowercase letters, digits, hyphens) with front matter validated by `postSchema` in `src/lib/posts.ts`; see README.md for every field. Required: `title`, `description`, `pubDate`, `category`. Images go under `public/assets/img/` and are referenced as `/assets/img/…`. Use only `##` and `###` headings (the post title is the page's only h1). Run `npm run verify`.

### Add a category

Add `{ id, label, description }` to `CATEGORIES` in `src/lib/site.ts`. That alone extends the front-matter enum, adds a tab (with count) to the segmented control in array order, and generates `/category/<id>/`. Check the rail at 390px: it scrolls with edge fades and must not clip. Parity will report the new tab and page; add an `INTENTIONAL` entry if so.

### Add a series

Add `{ id, label, short }` to `SERIES` in `src/lib/site.ts`. `short` is the name shown in a list row's narrow right column (inside `<abbr title={label}>`), so keep it to a few Korean syllables. Posts join with `series: <id>`; the series box lists them oldest first by `pubDate`. `/series/<id>/` is generated.

### Rename a post or add a redirect

Rename the file, then add `"/posts/<old-slug>/": "/posts/<new-slug>/"` to `src/data/redirects.json` and repoint any existing entries whose target was the old slug (verify fails on a redirect to a missing page). `feed-guids.json` is keyed by slug: rename the post's key to the new slug and keep its value, or, if it had no entry, add `"<new-slug>": "/posts/<old-slug>/"` so feed readers do not see the post as new. Redirect stubs are HTML pages (canonical + meta refresh + `location.replace`), because GitHub Pages cannot send 301s; a stub never overwrites a real page.

### Change the about page, links or site metadata

About content (bio, publications) is in `src/app/about/page.tsx`. Name, author, external links and the metadata description are `SITE` in `src/lib/site.ts`; the dock items are `NAV`.

### Change the design safely

1. Read DESIGN.md. Change tokens in `src/app/globals.css` in all three places (light `:root`, `[data-theme='dark']`, and the `prefers-color-scheme: dark` block for readers without JS). Keep text contrast ≥ 4.5:1.
2. Put component styles in the owning file under `src/styles/`, inside the existing `@layer`. Tailwind runs with `source(none)`: utility classes are not generated from markup, so style with the CSS files and tokens.
3. Glass: use `<Glass variant=…>` or `useGlass` + `<GlassLayers>`; never style `.glass` with `opacity`, `filter`, `mask` or `clip-path` (it becomes the backdrop root and the blur goes blank). Do not add a variant without the owner asking.
4. Look at the result yourself: light and dark, 1440px and 390px, Chrome and Safari/WebKit (Firefox for the fallback), with `prefers-reduced-motion`, and with JS disabled for posts. Glass debug flags: `?light=x,y`, `?perf`, `?refract=0`, `?reduced`, `?slowmo=10`.
5. If the markup changed, run parity and record intended differences deliberately. Then run `npm run verify`.
6. Re-check the owner's rules in DESIGN.md: no intro copy, monochrome, no AI tells, reflection visible at rest in light mode.

### Deploy

Push to `main` of `Kkubuck/Kkubuck.github.io`; `.github/workflows/deploy.yml` verifies and publishes (Settings → Pages → Source must be GitHub Actions). Pull requests run the same verification without publishing. Never push unless the owner asks.
