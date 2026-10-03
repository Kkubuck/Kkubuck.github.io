/**
 * URL helpers.
 *
 * The site is a GitHub Pages user site (https://kkubuck.github.io), so the base
 * path is empty. For a project repository, build with BASE_PATH=/repo-name;
 * next.config.ts forwards it (and SITE_URL) as NEXT_PUBLIC_* so the same values
 * are inlined into server and client code.
 *
 * Two kinds of paths are used:
 * - Route paths ("/posts/x/") for next/link, which adds the base path itself.
 * - Base-prefixed URLs (withBase) for raw <a>, fetch(), assets and metadata.
 */

function normalizeBase(value: string | undefined): string {
  const trimmed = (value ?? '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export const BASE_PATH = normalizeBase(process.env.NEXT_PUBLIC_BASE_PATH);

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kkubuck.github.io').replace(/\/+$/, '');

/** "/about/" → "/repo/about/" (unchanged when there is no base path). */
export function withBase(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

/** "/about/" → "https://kkubuck.github.io/about/" */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${withBase(path)}`;
}

/** Tag text → URL segment, identical to the old site so tag URLs do not change. */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** Route paths (no base path; pass to next/link or wrap with withBase). */
export const routes = {
  home: () => '/',
  post: (slug: string) => `/posts/${slug}/`,
  category: (id: string) => `/category/${id}/`,
  series: (id: string) => `/series/${id}/`,
  tags: () => '/tags/',
  tag: (tag: string) => `/tags/${tagSlug(tag)}/`,
  about: () => '/about/',
  rss: () => '/rss.xml',
  searchIndex: () => '/search.json',
  sitemapIndex: () => '/sitemap-index.xml',
  /** The sitemap the index lists (the old site's URL); /sitemap.xml serves the same file. */
  sitemap: () => '/sitemap-0.xml'
} as const;
