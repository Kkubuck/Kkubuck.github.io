# Validation Report

## Release scope

This report covers the source tree prepared for the `Kkubuck.github.io` GitHub Pages repository on July 10, 2026. The release replaces the Jekyll implementation with Astro while preserving the previously revised post corpus.

Validation was performed against the same commands committed to the repository. A successful local result does not claim that the files were pushed to GitHub or that a live GitHub Pages deployment was executed; no write access to the repository was used during this review.

## Environment

| Component | Version / mode |
|---|---|
| Node.js | 22.16.0 for local verification |
| pnpm | 10.13.1 |
| Astro | 7.0.7 |
| TypeScript | 6.0.3 |
| Browser | Chromium 144 |
| Build target | Static HTML for GitHub Pages |
| CI target | Node.js 24 through `withastro/action@v6` |

Package versions are pinned in `package.json` and `pnpm-lock.yaml`. `pnpm-workspace.yaml` explicitly allows the required `esbuild` install script.

## Clean-install verification

A separate release candidate directory was created from source only. The following generated or local directories were excluded before installation:

- `node_modules/`
- `dist/`
- `.astro/`
- `test-artifacts/`
- `.git/`

The clean copy then passed:

```bash
pnpm install --frozen-lockfile --offline
pnpm run verify
```

The offline install reused the local package cache and ran the required `esbuild` post-install step. `pnpm run verify` completed with zero Astro/TypeScript errors, warnings, or hints.

## Production output

| Check | Result |
|---|---:|
| Astro-generated primary pages | 73 |
| Primary HTML pages checked by verifier | 75 |
| Paper entries | 38 |
| Note entries | 27 |
| Total searchable posts | 65 |
| Legacy Jekyll redirects | 121 |
| Local HTML/resource references checked | 116 |
| Emitted shared CSS | approximately 35 KiB |
| Emitted site JavaScript | approximately 16 KiB |
| Missing internal references | 0 |
| Astro/TypeScript diagnostics | 0 errors, 0 warnings, 0 hints |

The build also generated and checked the search index, RSS feed, sitemap, robots file, custom 404 page, metadata, English navigation, and legacy URL redirects.

## Content-preservation audit

The new Astro content collection was compared with the previously revised Jekyll post corpus.

- 64 post bodies are byte-for-byte identical after front-matter migration.
- One note received a single safety correction: a malformed non-secure URL that represented a code expression was replaced by an inline code element.
- Dates, slugs, post kind, titles, source links, takeaways, and publication metadata were carried into the new content schema.
- Korean article bodies remain Korean by design; global navigation, controls, archive labels, metadata labels, error states, and interface copy are English.

## Browser regression matrix

The production build was served locally and tested in Chromium 144 at three viewports.

| Viewport | Horizontal overflow | Body type | Long-title handling | Controls |
|---|---|---|---|---|
| 1440×900 | None | Sans-serif, article 18.24px | Passed | 44px persistent controls |
| 768×1024 | None | Sans-serif, article 17.23px | Passed | 44px persistent controls |
| 390×844 | None | Sans-serif, article 16.64px | Passed | 44px persistent controls |

The following behaviors passed browser automation and visual review:

- Exact global navigation labels: Home, Papers, Notes, Projects, About.
- Responsive desktop, tablet, and mobile layouts.
- Mobile menu open/close, icon transformation, Escape handling, and background scroll lock.
- Ctrl/Command-K search, lazy index loading, result scoring, arrow-key selection, Enter navigation, Escape close, and focus return.
- Search index count of 65 records.
- Archive text/filter composition, visible count, and URL query synchronization.
- Light/dark theme switching and persistence.
- Pointer movement and press response in the canvas signal field.
- Scroll-correlated research narrative state.
- Article language metadata, Korean body rendering, three takeaway cards, generated table of contents, and safe external-link attributes.
- Article reading progress and copy/share state handling.
- Reduced-motion mode with static canvas behavior and no smooth scrolling.
- Custom 404 output.
- Legacy Jekyll route redirect to the matching Astro article.
- No uncaught browser runtime errors in the tested routes.

## Accessibility review

The implementation and browser pass confirmed:

- Skip link and semantic landmarks.
- Visible keyboard focus.
- Native buttons, links, form controls, and dialog semantics.
- Search keyboard operation and focus restoration.
- 44×44px persistent icon controls.
- Reduced-motion adaptation.
- Article headings with scroll margin for sticky navigation.
- Safe overflow treatment for wide tables.
- Static content access when optional JavaScript enhancements are unavailable.

This is a design and engineering audit, not a certification of complete WCAG conformance. Production content changes should continue to receive keyboard, contrast, zoom, and assistive-technology review.

## GitHub Pages readiness

The workflow at `.github/workflows/deploy.yml` was reviewed against the project build and contains:

1. `actions/checkout@v7`
2. `withastro/action@v6`
3. Node.js 24
4. pnpm 10.13.1
5. `pnpm run verify` as the build command
6. `actions/deploy-pages@v5`
7. Required Pages permissions and deployment environment

The repository is configured for the root user-site URL `https://kkubuck.github.io`. No project-repository base path is applied.

## Deployment boundary

The release candidate is ready to commit and push. The only step not performed in this environment is an actual push to the user’s GitHub repository followed by a live GitHub Pages deployment. After upload, GitHub **Settings → Pages → Build and deployment → Source** must be set to **GitHub Actions**, and the live smoke-test list in `DEPLOYMENT_CHECKLIST.md` should be checked against the public URL.
