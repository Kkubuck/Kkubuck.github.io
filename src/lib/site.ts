export const SITE = {
  name: 'Kkubuck',
  title: 'Kkubuck',
  // Meta/og/RSS description only; the home page itself shows no tagline. Same words as the og card and manifest.
  description: '컴퓨터 비전 논문 리뷰와 공부 기록',
  url: 'https://kkubuck.github.io',
  author: '이지상',
  authorEn: 'Jisang Lee',
  lang: 'ko',
  locale: 'ko_KR',
  links: {
    github: 'https://github.com/Kkubuck',
    scholar: 'https://scholar.google.com/citations?user=54qWclUAAAAJ',
    linkedin: 'https://www.linkedin.com/in/jisanglee/',
    email: 'nacl3084@gmail.com'
  }
} as const;

export const NAV = [
  { href: '/', label: '글' },
  { href: '/tags/', label: '태그' },
  { href: '/about/', label: '소개' }
] as const;

export const CATEGORIES = [
  {
    id: 'paper-review',
    label: '논문 리뷰',
    description: '읽은 논문을 문제, 방법, 실험, 한계 순서로 정리합니다.'
  },
  {
    id: 'research-note',
    label: '연구 노트',
    description: '벤치마크 읽는 법, 비교 실험 설계처럼 연구하면서 정리한 메모입니다.'
  },
  {
    id: 'study',
    label: '공부',
    description: '자료구조, 머신러닝, 딥러닝 공부 기록입니다.'
  },
  {
    id: 'coding-test',
    label: '코딩 테스트',
    description: '백준과 프로그래머스 문제 풀이입니다.'
  }
] as const;

/**
 * `short`: the name in a list row's narrow right column (rendered as <abbr> with the
 * full name), where the full name would not fit. Everywhere else: `label`.
 */
export const SERIES = [
  { id: 'data-structures', label: '자료구조', short: '자료구조' },
  { id: 'hongong-ml', label: '혼자 공부하는 머신러닝 + 딥러닝', short: '혼공머신' }
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Series = (typeof SERIES)[number];
export type CategoryId = Category['id'];
export type SeriesId = Series['id'];

export const CATEGORY_IDS = CATEGORIES.map((category) => category.id) as [CategoryId, ...CategoryId[]];
export const SERIES_IDS = SERIES.map((series) => series.id) as [SeriesId, ...SeriesId[]];

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((category) => category.id === id)!;
}

export function getSeries(id: SeriesId): Series {
  return SERIES.find((series) => series.id === id)!;
}

export function isCategoryId(value: string): value is CategoryId {
  return (CATEGORY_IDS as readonly string[]).includes(value);
}

export function isSeriesId(value: string): value is SeriesId {
  return (SERIES_IDS as readonly string[]).includes(value);
}
