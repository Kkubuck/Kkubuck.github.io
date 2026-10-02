# Refresh validation — 2026-10-02

## Automated checks

`pnpm run verify` runs Astro's type/content checks, the production build, legacy redirect creation, build integrity checks, and six research-data tests.

- Astro: zero errors, warnings, or hints.
- 38 existing paper entries, 29 notes (27 existing + 2 new), 16 additional reading references.
- 80 authored HTML pages verified; 121 legacy redirect pages generated.
- 123 local asset references resolved; generated metadata, IDs, navigation, archive/search totals, and bundle budgets passed.
- Six tests passed: a synthetic PCA with known eigenvectors/eigenvalues; translation invariance and degenerate inputs; the complete 54-entry corpus; real projection orthogonality and variance; Jaccard neighbor links; and all 12 reading plans with complete coverage of new references.
- No runtime dependency added. Emitted CSS is approximately 49 KiB and JavaScript 24 KiB, before transfer compression.
- `git diff --check` passed.

## Browser checks

Checked the local site in Chrome at desktop width (1440 CSS pixels), mobile width (433), and a narrow 320-pixel viewport. The desktop homepage and mobile atlas were visually inspected; document width matched viewport width. The topic map reflows into two columns on phones. Dark and light themes were checked.

Verified interactions:

- Topic, PCA and list views; selection and review/source links.
- Keyboard selection with Enter.
- Intersecting OVCOS + reviewed filters return the two existing OVCOS reviews.
- Search with no matches hides the detail panel and shows an empty state.
- Excluding preprints returns 52 of 54 entries in the list and map.
- The 2026 year filter returns 10 entries.
- Reload restores selected paper, view and preprint filter from the URL.
- Zoom changes the SVG view box and reset restores the default scale.
- Mobile navigation opens and reaches the reading desk.
- Reading outlines expand and individual paper links carry the selected paper into the map.
- Global search finds BaCLIP and clearly labels it as a reading reference.
- No captured browser console errors or warnings on the final local homepage.

## Evidence boundaries

This is functional and visual browser QA, not a claim of complete accessibility conformance or a Lighthouse score. A real touch device, Safari, Firefox, and every external historical link have not been exhaustively tested. Primary-source verification and the scope of literature reading are documented in [REFRESH_2026.md](REFRESH_2026.md), with individual source/evidence fields in the research data. The graph's editorial categories and coarse manual features should not be interpreted as a learned research taxonomy.
