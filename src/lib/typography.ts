/**
 * Display typography helpers.
 *
 * displayTitle: in display titles (post h1, list row titles, paper-card title, pager
 * titles) a hyphen inside a word becomes U+2011 NON-BREAKING HYPHEN, so Latin
 * compounds such as "Mixed-Scale" or "SAM-DSA" never break at the hyphen. Use it only
 * where the title is shown; metadata, RSS, search and <title> keep the original text.
 * Pretendard's dynamic subset lacks U+2011, so src/styles/base.css adds a 1 KB subset
 * of the same font for that one glyph.
 */
const INNER_HYPHEN = /(?<=[\p{L}\p{N}])-(?=[\p{L}\p{N}])/gu;

export function displayTitle(text: string): string {
  return text.replace(INNER_HYPHEN, '‑');
}
