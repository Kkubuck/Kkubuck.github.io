# Kkubuck Blog

<https://kkubuck.github.io>의 소스입니다. 컴퓨터 비전 논문 리뷰와 공부 기록을 올리는 블로그이고, Markdown 파일로 글을 쓰면 GitHub Actions가 정적 사이트로 빌드해 GitHub Pages에 올립니다.

- 홈: 카테고리 탭(전체 · 논문 리뷰 · 연구 노트 · 공부 · 코딩 테스트)과 연도별 글 목록. 소개 문구 없이 `Kkubuck Blog` 워드마크만 둡니다.
- 글: 논문 정보 카드와 핵심 요약, 본문, 목차, 태그, 시리즈 목록, 이전·다음 글.
- 그 밖에: 태그·시리즈 페이지, 소개 페이지, ⌘K 검색, 라이트·다크 테마, RSS, 사이트맵, 예전 주소 리다이렉트.
- 디자인: 본문은 차분한 종이, 그 위에 떠 있는 메뉴(독), 카테고리 렌즈, 검색 창, 모바일 목차만 유리로 만들고 빛 반사를 넣었습니다. 자세한 내용은 [DESIGN.md](DESIGN.md)에 있습니다.

## 사용 기술

- [Next.js](https://nextjs.org) 16 (App Router, `output: 'export'`로 정적 HTML 생성), React 19, TypeScript
- Tailwind CSS 4 (디자인 토큰), 나머지 스타일은 `src/styles/`의 일반 CSS
- Markdown: unified · remark · rehype, 코드 문법 강조는 [Shiki](https://shiki.style)
- 글 머리말 검사: gray-matter + zod
- 폰트: [Pretendard](https://github.com/orioncactus/pretendard) Variable
- 배포: GitHub Actions → GitHub Pages
- WebGL과 애니메이션 라이브러리는 쓰지 않습니다. 유리 효과는 CSS와 SVG 필터, 작은 스프링 계산 코드로 만듭니다.

## 로컬에서 실행하기

Node.js 24와 npm이 필요합니다. 버전은 `.nvmrc`에 적혀 있고, CI도 이 버전으로 빌드합니다.

```bash
nvm use            # nvm을 쓴다면 .nvmrc의 Node 24로 맞춥니다
npm ci             # package-lock.json 그대로 설치
npm run dev        # http://localhost:3000
```

개발 서버가 켜져 있으면 글을 고친 뒤 브라우저를 새로고침하면 바로 반영됩니다.

## 글 쓰기

글은 `content/posts/` 아래에 Markdown 파일 하나로 씁니다. **파일 이름이 곧 주소**입니다.

```
content/posts/zoomnet-cvpr2022.md  →  https://kkubuck.github.io/posts/zoomnet-cvpr2022/
```

파일 이름은 소문자 영어, 숫자, 하이픈으로 짓습니다. 한 번 올린 글의 파일 이름을 바꾸면 주소가 바뀌므로, 바꿔야 한다면 [옛 주소](#옛-주소) 항목대로 리다이렉트를 추가하세요.

### 머리말(front matter)

파일 맨 위 `---` 사이에 씁니다. 전체 항목은 다음과 같습니다.

```yaml
---
title: 'Zoom in and Out: A Mixed-Scale Triplet Network for Camouflaged Object Detection'
description: 목록, 검색 결과, 공유 카드와 글 머리에 보이는 한두 문장
pubDate: 2026-03-12 09:00:00 +0900
updatedDate: 2026-03-20 10:00:00 +0900    # 선택
category: paper-review                     # paper-review | research-note | study | coding-test
series: data-structures                    # 선택. data-structures | hongong-ml
tags: [cod, multi-scale, uncertainty]      # 선택
takeaways:                                 # 선택. 글 위의 '핵심 요약'
  - 첫 번째 요점
  - 두 번째 요점
paper:                                     # 선택. 논문 리뷰의 논문 정보 카드
  title: 'Zoom in and Out: A Mixed-Scale Triplet Network for Camouflaged Object Detection'
  authors: Youwei Pang, Xiaoqi Zhao, Tian-Zhu Xiang, Lihe Zhang, Huchuan Lu
  venue: CVPR 2022
  year: 2022
  url: https://openaccess.thecvf.com/...   # 선택. 논문 페이지
  pdf: https://openaccess.thecvf.com/...   # 선택
  code: https://github.com/lartpang/ZoomNet  # 선택
origin:                                    # 선택. 다른 곳에서 옮겨 온 글
  name: Tistory
  url: https://jms3084.tistory.com/10
draft: true                                # 선택. true면 게시하지 않음
---
```

| 항목 | 필수 | 설명 |
|---|---|---|
| `title` | 필수 | 글 제목. `:`이 들어가면 작은따옴표로 감쌉니다. |
| `description` | 필수 | 목록의 두 줄 설명, 검색 결과, 공유 카드(og), RSS, 글 제목 아래 리드 문단에 쓰입니다. |
| `pubDate` | 필수 | 게시 시각. `2026-03-12 09:00:00 +0900` 형식. 목록 순서와 연도 묶음, 시리즈 순서가 이 값으로 정해집니다(서울 시간 기준). |
| `updatedDate` | 선택 | 고친 날. 사이트맵, RSS, 공유 메타데이터에만 쓰이고 화면에는 나오지 않습니다. |
| `category` | 필수 | `paper-review`(논문 리뷰), `research-note`(연구 노트), `study`(공부), `coding-test`(코딩 테스트) 중 하나. |
| `series` | 선택 | `data-structures`(자료구조), `hongong-ml`(혼자 공부하는 머신러닝 + 딥러닝). 글 아래 시리즈 목록에 오래된 글부터 순서대로 나옵니다. |
| `tags` | 선택 | 소문자 영어, 단어는 하이픈으로 잇습니다. 태그 주소는 `/tags/<태그>/`이고 글 아래에 `#cod`처럼 글자로만 표시됩니다. |
| `takeaways` | 선택 | 글 위 `핵심 요약`에 번호를 붙여 보여 줍니다. |
| `paper` | 선택 | 논문 정보 카드. `title`, `authors`, `venue`, `year`는 필수이고 `year`는 따옴표 없는 숫자입니다. `url`, `pdf`, `code`는 `https://`로 시작하는 전체 주소. `venue`는 목록 오른쪽 라벨로도 쓰입니다. |
| `origin` | 선택 | 옮겨 온 글의 원래 위치. 날짜 옆에 "Tistory에서 옮긴 글" 링크가 붙습니다. |
| `draft` | 선택 | `true`면 목록, 검색, RSS, 사이트맵에서 빠지고 페이지도 만들어지지 않습니다. 로컬 개발 서버에서도 보이지 않습니다. |

머리말에 오타가 있으면(없는 카테고리, 빠진 필수 항목, 숫자가 아닌 `year` 등) 빌드가 멈추고 파일 이름과 항목을 알려 줍니다.

카테고리와 시리즈 목록은 `src/lib/site.ts`에서 고칩니다. 새 카테고리를 추가하면 홈의 탭과 `/category/<id>/` 페이지가 함께 생깁니다.

### 본문 작성 요령

- 제목은 `##`(큰 제목)과 `###`(작은 제목)만 씁니다. 목차가 이 제목들로 만들어집니다. `#` 하나짜리 제목은 쓰지 마세요. 글 제목이 이미 페이지의 유일한 h1이라 검사에서 실패합니다.
- 코드는 언어를 적은 코드 블록으로 씁니다. 문법 강조, 언어 이름, 복사 버튼이 자동으로 붙습니다. 언어를 적지 않으면 일반 텍스트로 표시됩니다.

  ````markdown
  ```python
  print("hello")
  ```
  ````

- 이미지는 `public/assets/img/` 아래에 두고 `/assets/...`로 시작하는 주소로 씁니다. 큰따옴표 안의 글은 이미지 아래 캡션이 됩니다. 이미지 크기는 빌드할 때 파일에서 읽어 오므로, 페이지가 로드되면서 글이 밀리지 않습니다.

  ```markdown
  ![대체 텍스트](/assets/img/example.png "캡션")
  ```

- 다른 글로 가는 링크는 `/posts/<파일 이름>/`처럼 씁니다. 없는 주소를 가리키면 검사에서 실패합니다. 외부 링크는 자동으로 새 탭에서 열립니다.
- 표는 GFM 표(`| a | b |`)로 씁니다. 화면보다 넓으면 표만 가로로 스크롤됩니다.
- 굵게 표시한 단어 바로 뒤에 조사가 붙을 때, 괄호나 따옴표로 끝나는 부분을 `**`로 감싸면 굵게 표시가 풀리고 별표가 그대로 보입니다. 괄호와 따옴표는 밖으로 빼 주세요. (검사에서 남은 `**`를 찾아 실패로 알려 줍니다.)

  ```markdown
  **분류**(classification)라고 한다.     ← O
  **분류(classification)**라고 한다.     ← X, 별표가 그대로 보임
  "**강조**"를 넣었다.                   ← O
  **"강조"**를 넣었다.                   ← X
  ```

- 곧은따옴표 `"…"`는 둥근따옴표 `“…”`로, `...`는 `…`로, `--`는 `–`로 자동으로 바뀝니다. 코드 안은 바뀌지 않습니다.
- 취소선은 물결표 두 개(`~~취소~~`)입니다. `0~1`, `a~e`처럼 하나만 쓴 물결표는 그대로 보입니다.
- HTML 태그와 수식은 지원하지 않습니다. HTML 태그는 출력되지 않습니다.

### 확인

```bash
npm run verify
```

올리기 전에 이 명령이 성공하는지 확인하세요. GitHub Actions도 똑같은 검사를 거친 뒤에만 배포합니다. 실패하면 마지막 몇 줄에 어느 파일의 무엇이 문제인지 나옵니다.

## 명령어

| 명령 | 하는 일 |
|---|---|
| `npm ci` | `package-lock.json` 그대로 의존성 설치 |
| `npm run dev` | 개발 서버 (<http://localhost:3000>) |
| `npm run build` | `out/`에 정적 사이트 생성, 중복 404 페이지 정리, 옛 주소 리다이렉트 페이지 생성 |
| `npm run verify` | `build` 후 검사: 빠진 페이지, 깨진 링크와 앵커, 렌더링되지 않은 Markdown(`**` 등), 문법 강조가 빠진 코드 블록, 리다이렉트, 예전 사이트 주소(`src/data/live-urls.txt`), RSS · 사이트맵 · 검색 색인 · 웹 매니페스트 |
| `npm run typecheck` | 타입 검사만 |
| `npm run clean` | `.next/`, `out/` 삭제 |
| `npm run package` | git이 추적하는 파일만 묶어 상위 폴더에 `<폴더 이름>-source.zip` 생성 |

빌드 결과를 그대로 보고 싶으면 `npm run build` 뒤에 `python3 -m http.server 8080 -d out`을 실행하고 <http://localhost:8080>을 엽니다.

## 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 `npm ci` → `npm run verify`를 거쳐 `out/`을 GitHub Pages에 올립니다. 검사가 실패하면 배포하지 않으므로, 사이트는 마지막으로 성공한 버전 그대로 남습니다.

### 처음 한 번: Pages 설정

저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 둡니다. (예전 Astro 사이트도 이 방식이라 이미 그렇게 되어 있을 수 있습니다.)

### 방법 1. git으로 올리기 (권장)

`Kkubuck/Kkubuck.github.io` 저장소를 받아 `.git` 폴더만 남기고 모두 지운 뒤, 이 소스를 복사해 넣고 push합니다. 커밋 기록은 그대로 남고, 예전 Astro 파일은 삭제로 기록됩니다.

```bash
cd ~/Downloads
git clone https://github.com/Kkubuck/Kkubuck.github.io.git
cd Kkubuck.github.io

# .git만 남기고 모두 삭제 (숨김 파일 포함)
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +

# 압축을 푼 새 소스를 숨김 파일까지 복사. 경로 끝의 /. 이 숨김 파일을 함께 복사합니다.
# (압축을 푼 폴더가 다른 곳에 있다면 그 경로로 바꾸세요.)
cp -R ~/Downloads/Kkubuck.github.io-main/. .

# 숨김 파일이 들어왔는지 확인: .env.example .gitattributes .github .gitignore .nvmrc
ls -A

# 선택: 올리기 전에 로컬에서 한 번 확인
npm ci && npm run verify

git add -A
git status          # 예전 src/pages/, astro.config.mjs, pnpm-lock.yaml 등이 deleted로 보여야 합니다
git commit -m "블로그 v4: Next.js 16 정적 사이트로 교체"
git push origin main
```

`node_modules/`, `.next/`, `out/`은 `.gitignore`에 있어서 커밋되지 않습니다.

### 방법 2. GitHub 웹에서 올리기

git을 쓰기 어렵다면 웹에서도 할 수 있지만, 두 가지를 꼭 지켜야 합니다.

1. **예전 Astro 파일을 먼저 모두 지웁니다.** 새 파일을 그 위에 덮어 올리기만 하면 예전 파일이 남습니다. 특히 `src/pages/`가 남아 있으면 Next.js가 그 폴더를 Pages Router로 읽어 빌드가 실패하고, `astro.config.mjs`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, 예전 `src/content/`도 쓸모없이 남습니다. 저장소의 모든 폴더와 파일을 지우세요. 폴더는 그 폴더를 연 뒤 오른쪽 위 `…` 메뉴의 **Delete directory**로, 파일은 파일을 연 뒤 `…` 메뉴의 **Delete file**로 지웁니다.
2. **숨김 파일까지 올립니다.** `.github/`(배포 워크플로), `.gitignore`, `.nvmrc`, `.env.example`, `.gitattributes`가 빠지면 배포가 되지 않거나 빌드 결과가 커밋됩니다. Finder에서는 숨김 파일이 보이지 않으므로 압축을 푼 폴더에서 **⌘⇧.**(Command + Shift + 마침표)를 눌러 보이게 한 뒤 선택하세요.

올리는 순서:

1. 저장소 첫 화면에서 **Add file → Upload files**를 엽니다.
2. 브라우저 업로드는 한 번에 100개 파일까지라서 세 번에 나눠 끌어다 놓습니다.
   - 첫 번째: 맨 위의 파일들(숨김 파일 포함)과 `.github/`, `scripts/`, `src/` 폴더
   - 두 번째: `content/` 폴더
   - 세 번째: `public/` 폴더
3. 매번 아래 **Commit changes**를 누릅니다. 중간 커밋마다 Actions가 실행되어 실패할 수 있지만, 실패한 실행은 배포하지 않으므로 무시해도 됩니다.
4. 다 올린 뒤 저장소에서 `.github/workflows/deploy.yml`이 보이는지 확인합니다. 없다면 **Add file → Create new file**에서 파일 이름에 `.github/workflows/deploy.yml`을 입력하고 내용을 붙여 넣어 만듭니다.

### 배포 확인

1. 저장소의 **Actions** 탭에서 **Build and Deploy** 워크플로의 가장 위 실행(방금 커밋)을 엽니다.
2. `build`와 `deploy` 두 단계가 모두 초록색 체크가 되면 끝입니다. 보통 2–3분 걸립니다. `deploy` 단계에 나오는 주소로 사이트가 열립니다.
3. 실패했다면 빨간 단계를 열어 **Type-check, build, and verify**의 마지막 줄을 봅니다. 대부분 머리말 오타, 깨진 링크, `**` 같은 Markdown 문제이고, 고쳐서 다시 push하면 됩니다.
4. `deploy`가 "Branch main is not allowed to deploy to github-pages" 같은 메시지로 실패하면 **Settings → Environments → github-pages**에서 `main` 브랜치 배포를 허용합니다.

브라우저 캐시 때문에 새 디자인이 바로 안 보이면 강력 새로고침(⌘⇧R)을 합니다.

### 다른 저장소 이름으로 배포할 때

지금은 사용자 사이트(`Kkubuck.github.io`)라 경로 접두사가 없습니다. 프로젝트 저장소(예: `github.com/Kkubuck/blog` → `https://kkubuck.github.io/blog/`)로 옮기면 Actions의 `configure-pages`가 주소와 경로를 알아서 넘겨 주므로 따로 설정할 것이 없습니다. 로컬에서 같은 조건으로 빌드하려면 `.env.example`을 `.env`로 복사해 `BASE_PATH=/blog`를 적습니다.

## 옛 주소

예전 Jekyll 블로그와 이전 버전의 주소(`/papers/...`, `/notes/...`, `/blog/...`, `/research/` 등)는 `src/data/redirects.json`에 적힌 대로 새 주소로 넘어갑니다. 글 주소를 바꿀 때는 이 파일에 `"옛 주소": "새 주소"`를 추가하세요.

`src/data/live-urls.txt`는 예전 사이트가 실제로 응답하던 주소 목록입니다. 검사는 이 주소가 모두 페이지, 리다이렉트, 파일 중 하나로 살아 있는지 확인합니다. 줄을 지워서 검사를 통과시키지 말고, 리다이렉트를 추가하세요.

## 폴더 구조

```
content/posts/          글 (Markdown)
public/                 이미지, 아이콘, 공유 카드 (assets/img/에 글 이미지)
src/
  app/                  페이지와 RSS · 사이트맵 · 검색 색인 (Next.js App Router)
    (lists)/            홈과 카테고리 페이지 (카테고리 렌즈를 함께 씀)
    posts/[slug]/       글 페이지
  components/           독, 목록, 글 머리, 논문 카드, 목차, 검색 창, 테마 버튼
    glass/              유리 효과 (빛 하나, 테두리 반사, 굴절)
  lib/                  사이트 정보(site.ts), 글 읽기(posts.ts), Markdown 변환, 주소
  data/                 옛 주소 리다이렉트, 예전 사이트 주소 목록, RSS guid
  styles/               CSS (기본, 유리, 틀, 목록, 글, 오버레이)
scripts/                빌드 후 처리와 검사, 소스 압축
.github/workflows/      배포
```

사이트 이름, 소개, 메뉴, 외부 링크, 카테고리, 시리즈는 `src/lib/site.ts`, 소개 페이지 내용은 `src/app/about/page.tsx`에 있습니다.

## 문서

- [DESIGN.md](DESIGN.md): 디자인 시스템 (색, 글꼴, 레이아웃, 유리와 빛, 움직임, 하지 말 것)
- [AGENTS.md](AGENTS.md): 코드 구조와 고칠 때 지켜야 할 규칙 (코딩 에이전트와 개발자용)

## 라이선스

사이트 소스 코드는 MIT 라이선스입니다. `content/`의 글과 `public/assets/`의 파일은 여기에 포함되지 않으며 권리는 저자에게 있습니다. 자세한 내용은 [LICENSE.txt](LICENSE.txt)를 보세요.
