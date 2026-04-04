# Kkubuck Papers

`Kkubuck.github.io`는 논문 리뷰와 개인 연구 메모를 올리는 GitHub Pages 블로그입니다.

## What lives in this repo

- Jekyll 기반 블로그 레이아웃과 스타일
- 공개 포스트(`_posts/`)와 공개 자산(`assets/`)
- 논문 리뷰 아카이브와 태그 페이지
- GitHub Pages 배포 설정

## Repo split

블로그용 코드와 툴킷 코드는 분리했습니다.

- Blog repo: `Kkubuck/Kkubuck.github.io`
- Toolkit repo: `Kkubuck/paper-blog-toolkit`

논문 초안 생성, 로컬 Qwen 추론, 자동 게시 파이프라인은 toolkit repo에서 관리합니다.

## Local blog preview

```bash
bundle install
bundle exec jekyll serve
```
