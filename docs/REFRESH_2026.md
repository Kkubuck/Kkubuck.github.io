# Research desk refresh — 2026-10-02

## Direction and references

A personal research site with a short introduction, publication records, and a browsable body of work. The homepage uses the author's name rather than an aspirational slogan. Thin rules and spacing carry hierarchy. Muted colors identify research themes. The atlas is an actual view of the content, not a decorative network.

References inspected on 2026-10-02:

| Reference | Application |
| --- | --- |
| [Distill](https://distill.pub/) | Compact editorial metadata; prioritize articles and research questions. |
| [Communicating with Interactive Articles](https://distill.pub/2020/communicating-with-interactive-articles/) | Reader actions reveal relationships; retain a readable alternative to the visualization. |
| [Google PAIR Explorables](https://pair.withgoogle.com/explorables/) | Controls should make a specific question inspectable. |
| [Butterick's Practical Typography](https://practicaltypography.com/typography-in-ten-minutes.html) | Reading width, hierarchy, and spacing before ornament. Local typefaces preserve the existing site's fast loading. |
| [Observable Plot](https://observablehq.com/plot/) | Assess compact declarative views and legible scales; a custom SVG is sufficient for this small corpus. |
| [D3 force](https://d3js.org/d3-force) | Considered for a dynamic network. Stable positions better support comparison here; no simulation runs on the client. |
| [Astro Pages deployment](https://docs.astro.build/en/guides/deploy/github/) | Keep the existing static build and deployment workflow. |
| [Reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | Disable layout transitions when reduced motion is requested. |

The refresh adds no runtime packages. Astro renders the complete text and graph. A separate TypeScript bundle enhances only pages containing the atlas. Layout changes use a 600 ms direct-action transition; no autoplay, parallax, scroll animation, tracking SDK, or remote font dependency is introduced.

## Research scope and evidence

The corpus contains 38 existing archive entries (including the COD benchmark guide) and 16 new references. Fifteen new references have a verified conference/journal attribution; ViCo-SAM3 is explicitly a preprint. The existing SR survey also retains its original arXiv label. This is a curated reading corpus, not an exhaustive systematic review.

New research is centered on OVCOS (OVCoser, SuCLIP, BaCLIP, training-free object binding, cascaded VLMs), OVCIS, dense vision–language alignment, structural reasoning, foundation model adaptation, and transfer to remote sensing. Publication years follow the proceedings/journal issue rather than the initial arXiv date. The CVM DOI contains 2025 while its journal publication is 2026. VSCode-v2 appeared online in 2025 and in TPAMI volume 48(3) in 2026.

`src/data/research.ts` records a primary source URL and evidence scope for each added paper. Most additions were checked against proceedings abstracts, author abstracts, or author repositories. The IJCV paper was inspected in publisher full text. ReAttnCLIP, The Power of Prior, and Direct Segmentation are bibliography/title level entries awaiting deeper review; their summaries do not invent method details. Questions are editorial research questions, not paper claims. No cross-paper performance leaderboard is inferred.

The two new posts are a reading map and a proposed comparison protocol. The 12 items in `/reading/` are planned articles with outlines and sources, not completed reviews.

## Atlas method

- Six theme colors are **editorial categories**, not learned cluster labels.
- Ten binary, manually coded descriptors represent task and method characteristics. They are not method-quality scores.
- The topic view uses deterministic, nonmetric positions within each theme.
- The dimension view uses mean-centered covariance PCA of the full 54 × 10 feature matrix. No standardization, pretrained text embedding, UMAP, or t-SNE is used.
- Power iteration with orthogonalization computes two principal components. Axis signs are fixed. The data endpoint exposes feature means, loadings, variance ratios and raw coordinates.
- A small deterministic display offset separates identical feature vectors; raw coordinates stay available. Filtering never recomputes the projection.
- Edges are the undirected union of up to three highest Jaccard-similarity neighbors per node with similarity ≥ 0.5. They are **not citation links**. Only edges touching the selected node are displayed.
- On narrow screens the nonmetric topic view becomes two columns; the PCA coordinates retain their definition. A list view provides the same selection/detail interface.

A label such as `foundation` means the method uses/adapts a pretrained foundation representation. `multimodal` denotes multiple visual/sensor or text-conditioned input streams in the reviewed method. `alignment` specifically refers to vision–language alignment; the SAR domain-alignment papers are coded as domain transfer. Descriptors are a coarse reading aid: a missing tag is not proof that the property is absent from a paper.

## Profile provenance

The snapshot in `profile-source-2026-10-02.md` came from the user's public `Kkubuck/kkubuck` README through the authenticated GitHub API. It supersedes the old blog's education dates. The update adds PR/ACCV acceptances, four under-review manuscripts, the missing 2025 JBE paper, 2026 competition results, graduate teaching, and competition hosting. Existing older records are preserved.

Profile source revision: `3fd02d1a0f7c4f598660e24af6465328fb754027`.

Accepted and under-review records are visibly separated. No DOI, full title, impact factor, publication date, or result was fabricated for unpublished work. Three abbreviated manuscript titles remain abbreviated exactly as in the public profile. The old PDF remains accessible and is labeled April 2026; the current HTML CV supports Print / Save PDF.

## Maintenance

Add a verified reference to `additions`, including source/evidence, a short factual summary and a clearly phrased reading question. Add it to a reading plan. When a review is published, remove the duplicate addition and annotate its post slug in `reviewAnnotations` so that the corpus contains one node per work. Update the explicit expected counts in the verification scripts deliberately.

The favicon and social card have editable SVG sources. Run `node scripts/create-brand-assets.mjs` to regenerate their PNG versions using Astro's existing Sharp dependency.

The existing post URLs, RSS, tags, search, legacy redirects, article table of contents, reading progress and copy actions are retained. Global search also indexes the 16 reading references and labels them as Reading. Atlas filters and selected-paper state are shareable URLs. JSON is available at `/research/data.json`.

Verification is recorded in `VALIDATION_2026.md`.
