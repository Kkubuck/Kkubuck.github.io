# Kkubuck Research Notes

컴퓨터 비전 논문 리뷰, 연구 과정, 구현 기록을 연결하는 Jekyll 기반 GitHub Pages 블로그입니다. 기존 글과 URL은 유지하면서 화면 구조, 탐색, 검색, 읽기 경험, 반응형 동작을 전면 재설계했습니다.

## 핵심 경험

- **Research Orbit**: 홈 화면에서 연구 주제를 탐색하는 절제된 원형 인터랙션
- **Command Search**: `⌘/Ctrl + K`로 제목·태그·학회·요약 통합 검색
- **Paper Index**: 연도·학회·주제·키워드 동시 필터
- **Research Reader**: 자동 목차, 읽기 진행률, 헤딩 링크, 원문/PDF 패널
- **Adaptive Theme**: 다크/라이트 테마, 시스템 설정 연동, 선택 상태 저장
- **Responsive & Accessible**: 모바일 재배치, 키보드 탐색, 포커스 관리, 모션 감소 지원
- **No front-end framework**: Jekyll + Liquid + SCSS + Vanilla JavaScript

전체 디자인 요구사항과 재현 가능한 제작 프롬프트는 [`DESIGN_PROMPT.md`](./DESIGN_PROMPT.md)에 있습니다.

## 로컬 실행

Ruby 3.3 환경을 권장합니다.

```bash
bundle install
bundle exec jekyll serve --livereload
```

브라우저에서 `http://127.0.0.1:4000`을 엽니다.

## 검증

```bash
bash _scripts/verify.sh
```

검증 스크립트는 JavaScript 문법, Python 보조 스크립트, 프로덕션 Jekyll 빌드, 생성된 JSON, 내부 링크와 정적 자산 경로를 확인합니다.

## 글 작성

`_posts/YYYY-MM-DD-slug.md` 파일을 만들고 다음 front matter를 사용합니다.

```yaml
---
layout: post
title: "논문 또는 기록 제목"
date: 2026-06-19
summary: "목록과 검색에 표시될 짧은 요약"
categories:
  - papers
tags:
  - COD
  - segmentation
venue: CVPR 2026
source_url: https://example.com/paper
pdf_url: https://example.com/paper.pdf
---
```

`categories`에 `papers`를 넣으면 논문 아카이브에 포함됩니다. `venue`, `source_url`, `pdf_url`은 선택 항목입니다.

## 주요 경로

```text
_layouts/                 페이지 및 포스트 구조
_includes/                헤더, 푸터, 검색 팔레트
_sass/_research-glass.scss 전체 디자인 시스템
assets/js/app.js           탐색, 검색, 필터, 읽기 인터랙션
search.json                빌드 시 생성되는 검색 인덱스
_data/cv.yml               CV 콘텐츠
DESIGN_PROMPT.md           디자인·구현 마스터 프롬프트
```

## GitHub Pages 배포

`main` 또는 `master` 브랜치에 push하면 `.github/workflows/pages.yml`이 프로덕션 빌드 후 Pages artifact를 배포합니다. 저장소의 **Settings → Pages → Source**가 **GitHub Actions**로 설정되어 있어야 합니다.

```bash
git add .
git commit -m "Redesign research blog"
git push
```

사이트 주소와 저장소명이 달라질 경우 `_config.yml`의 `url`과 `baseurl`만 조정합니다.

## 콘텐츠 보존

- 기존 `_posts/` 65개와 Tistory 로컬 이미지 유지
- `/papers/`, `/blog/`, `/projects/`, `/tags/`, `/cv/`, `/about/` 유지
- 기존 포스트의 개별 permalink 규칙 유지
- CV PDF와 연구 데이터 유지

## License

콘텐츠의 권리는 작성자에게 있습니다. 코드 관련 고지와 기존 프로젝트의 MIT 라이선스 표기는 [`LICENSE.txt`](./LICENSE.txt)를 따릅니다.
