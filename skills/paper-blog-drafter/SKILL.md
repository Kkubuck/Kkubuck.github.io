# paper-blog-drafter

Use this skill when generating or reviewing a paper-to-blog post for the Kkubuck Jekyll site.

## Goal

- Turn a PDF or arXiv source into a Jekyll post under `/_posts/YYYY-MM-DD-<slug>.md`.
- Save extracted assets under `/assets/papers/<slug>/`.
- Keep the final writing order as:
  - 오버뷰
  - 핵심 주장
  - 초록
  - 서론
  - 본론
  - 제안방법
  - 실험
  - 결론
  - 논의
  - 검수 로그
  - 출처

## Visual rules

- Always include two featured visuals when possible.
- Prefer one overview figure whose caption contains words like `overview`, `architecture`, `framework`, or `pipeline`.
- Prefer one main experiment table whose caption or page text contains words like `main results`, `comparison`, `ablation`, `quantitative`, or `performance`.
- If a table is not embedded as an image, render the page snapshot that contains the table.

## Safety rules

- Do not invent numbers, datasets, or citations.
- Keep claims grounded in the source PDF or arXiv metadata.
- Run two fact-check passes and keep any remaining caveats visible.

## Local command

```bash
paper-blog draft --arxiv-id 2509.15753 --site-dir .
```

## Outputs to verify

- `_posts/`
- `assets/papers/<slug>/evidence.json`
- `assets/papers/<slug>/verification-pass-1.md`
- `assets/papers/<slug>/verification-pass-2.md`
