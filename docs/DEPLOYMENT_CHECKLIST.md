# GitHub Pages Deployment Checklist

## Repository assumptions

- Repository name: `Kkubuck.github.io`
- Branch: `main`
- Public URL: `https://kkubuck.github.io`
- Pages source: GitHub Actions
- Package manager: pnpm 10.13.1
- Node version in CI: 24

The special `<username>.github.io` repository is published at the domain root, so `astro.config.mjs` does not require a `base` path.

## Before committing

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run verify
```

Confirm that the command reports:

- 38 paper pages.
- 27 note pages.
- 65 search records.
- No missing internal references.
- English global navigation.
- Search, RSS, robots, sitemap, and 404 output.
- Legacy redirect generation.

## Files that must be committed

- `.github/workflows/deploy.yml`
- `astro.config.mjs`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `src/`
- `public/`
- `scripts/`
- `docs/`
- `README.md`
- `MIGRATION.md`
- `LICENSE.txt`

Do not commit:

- `node_modules/`
- `dist/`
- `.astro/`
- local screenshots or browser reports
- `.env` files

## GitHub configuration

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` or run the workflow manually.
5. Open the **Actions** tab and confirm both `build` and `deploy` jobs succeed.
6. Open the deployment URL shown by the `github-pages` environment.

## Production smoke test

Check these routes:

- `/`
- `/papers/`
- `/notes/`
- `/projects/`
- `/about/`
- `/cv/`
- `/tags/`
- one recent paper route
- one early note route
- `/search.json`
- `/rss.xml`
- `/sitemap-index.xml`
- an intentionally missing route to confirm `404.html`
- one old Jekyll `.../YYYY/MM/DD/slug.html` route

Check behavior:

- Header navigation is English.
- Search opens with Ctrl/Command-K.
- Search returns paper and note results.
- Archive filters update count and URL query.
- Theme persists after navigation and refresh.
- Home canvas reacts to pointer and press.
- Research loop updates while scrolling.
- Reduced-motion emulation produces a static experience.
- Article TOC highlights the active heading.
- Source/PDF/code links open safely.
- Copy and share work or fall back.
- No horizontal page overflow at 390px.
- Browser console has no uncaught errors.

## Rollback

GitHub Pages deployments are tied to commits. To roll back:

1. Revert the problematic commit on `main`, or reset to a known-good commit through a new commit.
2. Push the rollback commit.
3. Let the deployment workflow publish the previous source state.

Do not upload `dist/` manually to a branch; the workflow is the source of truth.

## Custom domain later

When adding a custom domain:

1. Add `public/CNAME` with the domain.
2. Change `site` in `astro.config.mjs` or set `SITE_URL` in the workflow.
3. Keep `base` unset.
4. Configure DNS and HTTPS in GitHub Pages.
5. Re-run the full production smoke test.
