# Kkubuck Research Interface

A static research archive for computer-vision paper reviews, implementation notes, and research history. This version replaces the previous Jekyll theme with an Astro 7 architecture, an English interface, a sans-serif visual system, and progressively enhanced interaction.

## What changed

- Entire site shell and navigation are in English.
- Jekyll, Ruby gems, theme inheritance, and Liquid templates were removed.
- All 65 previously edited posts are preserved as Markdown content entries.
- Paper reviews and general notes have separate routes and searchable archives.
- The visual system uses a compact sans-serif stack, restrained cobalt accent, low-noise surfaces, and fluid type.
- Interaction includes a pointer-responsive canvas field, a wheel/scroll-driven research narrative, view transitions, filtering, global search, reading progress, and automatic article navigation.
- Motion is disabled or reduced when `prefers-reduced-motion` is enabled.
- The production build verifies output counts, internal links, assets, metadata, navigation language, and legacy redirects.

## Stack

- Astro 7.0.7
- TypeScript 6.0.3
- Semantic HTML
- Modern CSS: cascade layers, custom properties, `clamp()`, container-safe responsive layout, Scroll-Driven Animations, View Transitions
- Canvas 2D for the live signal field
- GitHub Pages via the official Astro action

No React, Vue, Tailwind, animation runtime, WebGL engine, external font binary, analytics SDK, or client-side router is required.

## Local development

Requirements: Node.js 22.12 or newer. GitHub Actions uses Node.js 24.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

Open the local URL printed by Astro.

## Verification

```bash
pnpm run verify
```

This command performs:

1. Astro and TypeScript diagnostics.
2. A production static build.
3. Legacy Jekyll URL generation.
4. Output validation for pages, posts, search, RSS, sitemap, metadata, local links, assets, and English navigation.

## Deployment

1. Replace the contents of the `Kkubuck.github.io` repository with this project.
2. Commit `pnpm-lock.yaml` and `pnpm-workspace.yaml` along with the source.
3. Push to `main`.
4. In **Settings → Pages**, choose **GitHub Actions** as the source.
5. The workflow at `.github/workflows/deploy.yml` verifies and deploys the site.

Because this repository follows the special `<username>.github.io` naming pattern, no `base` path is required. For a project repository, set `BASE_PATH=/repository-name` and update any root-relative URLs in legacy Markdown before deployment.

## Content

Posts live in `src/content/posts/`. A post must contain front matter validated by `src/content.config.ts`.

- `kind: paper` publishes to `/papers/<slug>/`
- `kind: note` publishes to `/notes/<slug>/`
- `takeaways` renders the article summary panel
- `sourceUrl`, `pdfUrl`, and `codeUrl` render source actions
- `venue`, `paperYear`, and `authors` enrich archive filters and metadata

## Architecture and design documents

- [`docs/DESIGN_PHILOSOPHY.md`](docs/DESIGN_PHILOSOPHY.md)
- [`docs/DESIGN_RESEARCH.md`](docs/DESIGN_RESEARCH.md)
- [`docs/TECH_STACK.md`](docs/TECH_STACK.md)
- [`docs/INTERACTION_SPEC.md`](docs/INTERACTION_SPEC.md)
- [`docs/ACCESSIBILITY_AND_PERFORMANCE.md`](docs/ACCESSIBILITY_AND_PERFORMANCE.md)
- [`docs/DEPLOYMENT_CHECKLIST.md`](docs/DEPLOYMENT_CHECKLIST.md)
- [`docs/VALIDATION_REPORT.md`](docs/VALIDATION_REPORT.md)
- [`MIGRATION.md`](MIGRATION.md)
