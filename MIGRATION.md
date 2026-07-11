# Migration from Jekyll to Astro

## Preserved

- 65 Markdown posts.
- Existing article bodies and rewritten paper reviews.
- Publication metadata, authors, venues, dates, source links, PDF links, code links, tags, and takeaways.
- CV PDF and existing image assets.
- Original source dates and stable slugs.
- Public GitHub Pages domain.

## Replaced

| Previous | Current |
|---|---|
| Jekyll + Ruby/Bundler | Astro 7 + Node/pnpm |
| Liquid layouts/includes | Astro components and layouts |
| SCSS theme structure | One tokenized modern CSS system |
| Korean site chrome | English site chrome |
| Serif editorial identity | Sans-serif research interface |
| Theme/plugin build | Pinned content-first static build |
| Ad hoc checks | Type, build, output, link, and browser validation |

## Route mapping

- Paper reviews: `/papers/<slug>/`
- Research notes: `/notes/<slug>/`
- Old Jekyll category/date URLs: generated static redirect files
- `/blog/`: redirects to `/notes/`
- `/subprojects/`: redirects to `/projects/`
- `/publications/`: redirects to `/papers/`

## Content conversion

Jekyll post files named `YYYY-MM-DD-slug.md` became `src/content/posts/slug.md`. Date and slug moved into validated front matter. Bodies were not rewritten during framework migration.

The schema in `src/content.config.ts` is the authoritative metadata contract. Invalid URLs, dates, enum values, or required fields fail the build.

## Asset migration

Assets moved under `public/assets/`, preserving the public `/assets/...` path. Markdown root-relative links continue to resolve on the user-site domain.

## Operational change

Local build:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run verify
```

Production deployment is performed by `.github/workflows/deploy.yml`. GitHub Pages must use **GitHub Actions** as its source.
