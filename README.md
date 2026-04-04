# Kkubuck Papers

`Kkubuck.github.io`를 논문 요약 블로그로 쓰기 위한 Jekyll + Python 모노레포입니다.

## What this repo does

- GitHub Pages에서 돌아가는 Jekyll 블로그를 유지합니다.
- 논문 PDF 또는 arXiv URL을 받아 `_posts/YYYY-MM-DD-*.md` 포스트를 생성합니다.
- 상단에는 대표 오버뷰 피규어 1개와 메인 실험 테이블 1개를 우선 넣습니다.
- 그림 선택은 캡션 키워드 기준으로 점수화합니다.
- 팩트체크를 2회 돌리고 evidence와 검수 로그를 같이 저장합니다.
- 검수 로그는 내부 자산으로만 남기고, 공개 포스트 본문에는 넣지 않습니다.

## Local setup

```bash
python3 -m pip install -e '.[dev,llm]'
bundle install
```

## Paper draft workflow

```bash
paper-blog doctor
paper-blog draft --arxiv-id 2509.15753 --site-dir .
bundle exec jekyll serve
```

생성 직후 자동 업로드까지 하려면 다음처럼 실행할 수 있습니다.

```bash
paper-blog draft --arxiv-id 2509.15753 --site-dir . --publish
```

`--backend` 는 다음 중 하나를 선택할 수 있습니다.

- `auto`: 가능한 로컬 런타임을 순서대로 시도
- `llama` or `llama_cpp` or `gguf`: 로컬 GGUF 파일 기반 llama.cpp
- `mlx`: Apple Silicon에서 MLX backend 시도
- `transformers`: Hugging Face + torch 기반
- `heuristic`: 규칙 기반 안전망

자동 업로드는 현재 브랜치에 생성된 포스트와 자산만 커밋하고 `git push`까지 수행합니다.
GitHub Pages 배포는 기존 `.github/workflows/pages.yml` 이 처리합니다.

## Recommended models

- 기본값: `Qwen/Qwen3-14B-Instruct-2507`
- fallback: `Qwen/Qwen3-8B-Instruct-2507`

M1 Max 32GB에서는 GGUF 또는 MLX 쪽이 가장 편하고, 환경이 없을 때는 `transformers` 또는 heuristic fallback으로 내려갑니다.
다만 한국어 게시 품질은 `heuristic`보다 실제 Qwen 백엔드가 훨씬 낫기 때문에, 공개 게시에는 `mlx`, `transformers`, `llama.cpp` 중 하나를 권장합니다.

## Output contract

생성기는 다음을 만듭니다.

- `/_posts/YYYY-MM-DD-<slug>.md`
- `/assets/papers/<slug>/figures/`
- `/assets/papers/<slug>/evidence.json`
- `/assets/papers/<slug>/verification-pass-1.md`
- `/assets/papers/<slug>/verification-pass-2.md`

## GitHub Pages

`.github/workflows/pages.yml` 이 `master` 또는 `main` 푸시 시 Jekyll을 빌드하고 `gh-pages` 브랜치로 배포합니다.
