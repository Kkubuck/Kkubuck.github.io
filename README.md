# Kkubuck 연구 노트

컴퓨터 비전 논문 리뷰, 연구 과정, 구현 기록을 연결하는 Jekyll 기반 GitHub Pages 블로그입니다. 기존 글의 날짜·URL·정적 자산은 유지하면서 화면 구조, 타이포그래피, 검색, 읽기 경험과 논문 콘텐츠를 전면 정비했습니다.

## 이번 리뉴얼에서 바뀐 점

- 따뜻한 종이색과 잉크색을 바탕으로 한 편집형 디자인 시스템
- `clamp()` 기반 유동 타이포그래피, 760px 읽기 폭, 모바일 재배치
- `⌘/Ctrl + K` 통합 검색, `/` 아카이브 검색 포커스, 연도·학회·주제 필터
- 자동 목차, 현재 섹션 표시, 읽기 진행률, 원문·PDF·코드 링크 도구막대
- 포인터에 반응하는 홈 주제 지도와 가벼운 빗방울·물결 캔버스
- 라이트·다크 모드, 선택 상태 저장, 키보드 포커스 관리, 모션 감소 지원
- 논문·벤치마크 리뷰 38편을 공식 논문/프로젝트 자료 기준으로 재작성
- Jekyll + Liquid + SCSS + Vanilla JavaScript만 사용하여 별도 프런트엔드 빌드 단계 없이 배포

구현 원칙과 참고한 디자인 시스템, 반응형 기준은 [`DESIGN_PROMPT.md`](./DESIGN_PROMPT.md)에 정리했습니다.

## 로컬 실행

Ruby 3.3과 Bundler를 사용합니다.

```bash
bundle install
bundle exec jekyll serve --livereload
```

브라우저에서 `http://127.0.0.1:4000`을 엽니다.

## 전체 검증

```bash
bash _scripts/verify.sh
```

검증 스크립트는 front matter·Liquid·레이아웃/인클루드 참조와 논문 메타데이터를 먼저 검사한 뒤, JavaScript·Python·Ruby·셸 문법, 프로덕션 Jekyll 빌드, 생성 HTML의 기본 구조, 내부 링크·프래그먼트·정적 자산, 검색 JSON과 웹 매니페스트를 확인합니다.

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
paper_year: 2026
paper_authors: Author A, Author B
source_url: https://example.com/paper
pdf_url: https://example.com/paper.pdf
code_url: https://github.com/example/repository
takeaways:
  - 가장 먼저 남길 핵심 문장
  - 설계의 중요한 차이
  - 실험을 읽을 때 확인할 한계
---
```

`categories`에 `papers`를 넣으면 논문 아카이브에 포함됩니다. 직접 재현한 결과가 아니라면 본문에서 원 논문의 보고와 개인 해석을 구분합니다.

## 주요 경로

```text
_layouts/                  페이지와 포스트 구조
_includes/                 헤더, 푸터, 검색 팔레트
_sass/_field-notes.scss    전체 디자인 시스템
assets/js/app.js           검색, 필터, 읽기, 인터랙션
assets/img/og-card.png     공유용 대표 이미지
search.json                빌드 시 생성되는 검색 인덱스
_data/cv.yml               CV 콘텐츠
DESIGN_PROMPT.md           디자인 원칙과 유지보수 기준
_scripts/verify_source.rb  빌드 전 소스·글 메타데이터 검증
_scripts/verify.sh         로컬 통합 검증
```

## GitHub Pages 배포

`main` 또는 `master` 브랜치에 push하면 `.github/workflows/pages.yml`이 Jekyll을 빌드하고 Pages artifact를 배포합니다. 저장소 **Settings → Pages → Source**는 **GitHub Actions**로 설정합니다.

```bash
git add .
git commit -m "Redesign research blog"
git push
```

사이트 주소나 저장소명이 달라질 때는 `_config.yml`의 `url`과 `baseurl`을 조정합니다.

## 보존 범위

- 기존 `_posts/`와 Tistory 로컬 이미지
- `/papers/`, `/blog/`, `/projects/`, `/tags/`, `/cv/`, `/about/`
- 기존 포스트 날짜와 개별 URL 규칙
- CV PDF, 연구 데이터, 프로젝트 이미지

## License

콘텐츠의 권리는 작성자에게 있습니다. 코드 관련 고지와 기존 프로젝트의 MIT 라이선스 표기는 [`LICENSE.txt`](./LICENSE.txt)를 따릅니다.
