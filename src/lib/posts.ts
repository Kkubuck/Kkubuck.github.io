/**
 * Post loading for build time (server only).
 *
 * content/posts/<slug>.md → /posts/<slug>/. Front matter is validated with the
 * same schema the Astro site used, so a typo in a post fails the build with the
 * file name instead of rendering a broken page.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { CATEGORY_IDS, SERIES_IDS, getCategory, type CategoryId, type SeriesId } from './site';
import { routes, tagSlug, withBase } from './paths';
import { smartenText } from './smart-punctuation';

const POSTS_DIR = join(process.cwd(), 'content', 'posts');

export const postSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  category: z.enum(CATEGORY_IDS),
  series: z.enum(SERIES_IDS).optional(),
  tags: z.array(z.string()).default([]),
  /** Rendered as the "핵심 요약" box above the body. */
  takeaways: z.array(z.string()).default([]),
  /** Paper reviews only: rendered as the paper information card. */
  paper: z
    .object({
      title: z.string(),
      authors: z.string(),
      venue: z.string(),
      year: z.number().int(),
      url: z.url().optional(),
      pdf: z.url().optional(),
      code: z.url().optional()
    })
    .optional(),
  /** Where an imported post was first published. */
  origin: z.object({ name: z.string(), url: z.url() }).optional(),
  draft: z.boolean().default(false)
});

export type PostData = z.infer<typeof postSchema>;
export type Paper = NonNullable<PostData['paper']>;

export interface Post {
  /** File name without .md; also the URL segment. */
  slug: string;
  data: PostData;
  /** Markdown body without front matter. */
  body: string;
}

let allPosts: Post[] | undefined;

/** Reader-facing front matter gets the body's smart punctuation ("…" → “…”), everywhere it is shown. */
function smartenFrontMatter(data: PostData): PostData {
  return {
    ...data,
    title: smartenText(data.title),
    description: smartenText(data.description),
    takeaways: data.takeaways.map(smartenText),
    ...(data.paper
      ? { paper: { ...data.paper, title: smartenText(data.paper.title), authors: smartenText(data.paper.authors) } }
      : {})
  };
}

function loadAll(): Post[] {
  const files = readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();
  return files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const parsed = postSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`);
      throw new Error(`Invalid front matter in content/posts/${file}:\n${issues.join('\n')}`);
    }
    return { slug, data: smartenFrontMatter(parsed.data), body: content };
  });
}

const byNewest = (a: Post, b: Post) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/** Every published post, newest first. Re-read on each request in `next dev` so edits show up on reload. */
export function getPosts(): Post[] {
  const posts = process.env.NODE_ENV === 'production' ? (allPosts ??= loadAll()) : loadAll();
  return posts.filter((post) => !post.data.draft).sort(byNewest);
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function postsInCategory(posts: Post[], category: CategoryId): Post[] {
  return posts.filter((post) => post.data.category === category);
}

/** Posts of one series, oldest first, which is the order they were written to be read in. */
export function seriesPosts(posts: Post[], series: SeriesId): Post[] {
  return posts.filter((post) => post.data.series === series).sort((a, b) => -byNewest(a, b));
}

export function postsWithTag(posts: Post[], slug: string): Post[] {
  return posts.filter((post) => post.data.tags.some((tag) => tagSlug(tag) === slug));
}

/** Neighbours in the newest-first list: `older` is the previous post, `newer` the next one. */
export function adjacentPosts(posts: Post[], slug: string): { older?: Post; newer?: Post } {
  const index = posts.findIndex((post) => post.slug === slug);
  const result: { older?: Post; newer?: Post } = {};
  if (index > 0) result.newer = posts[index - 1];
  if (index >= 0 && index < posts.length - 1) result.older = posts[index + 1];
  return result;
}

/* Dates ------------------------------------------------------------------- */

const seoul = { timeZone: 'Asia/Seoul' } as const;

export function yearOf(date: Date): number {
  return Number(new Intl.DateTimeFormat('en-CA', { ...seoul, year: 'numeric' }).format(date));
}

/** 2026.03.12 */
export function shortDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { ...seoul, year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(date)
    .replaceAll('-', '.');
}

/** 03.12 (inside a year group, where the year is already shown) */
export function monthDay(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { ...seoul, month: '2-digit', day: '2-digit' }).format(date).replace('-', '.');
}

/** 2026년 3월 12일 */
export function longDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', { ...seoul, year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

/** Technical Korean reads at roughly 400 syllables a minute, code and English at about 200 words. */
export function readingMinutes(body = ''): number {
  const korean = (body.match(/[가-힣]/g) ?? []).length;
  const words = (body.replace(/[가-힣]/g, ' ').match(/[\p{L}\p{N}_]+/gu) ?? []).length;
  return Math.max(1, Math.ceil(korean / 400 + words / 200));
}

/* Grouping ---------------------------------------------------------------- */

export function groupByYear(posts: Post[]): Array<[year: number, posts: Post[]]> {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = yearOf(post.data.pubDate);
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}

export interface TagCount {
  slug: string;
  /** The spelling of the tag where it first appeared. */
  tag: string;
  count: number;
}

/** Tags by use, most used first, then alphabetically. */
export function collectTags(posts: Post[]): TagCount[] {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      const entry = counts.get(slug) ?? { tag, count: 0 };
      entry.count += 1;
      counts.set(slug, entry);
    }
  }
  return [...counts.entries()]
    .map(([slug, entry]) => ({ slug, ...entry }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/* Search index ------------------------------------------------------------ */

export interface SearchRecord {
  title: string;
  description: string;
  category: string;
  venue?: string | undefined;
  tags: string[];
  text: string;
  /** Base-prefixed URL, ready for an <a href>. */
  url: string;
  /** ISO 8601 */
  date: string;
}

/**
 * Plain text of a Markdown body, trimmed so the index stays small. The ⌘K sheet shows
 * it as a snippet, so Markdown marks are removed without leaving holes: emphasis and
 * code marks vanish ("**깊이 영상**을" → "깊이 영상을"), block markers (headings,
 * quotes, list bullets, table rules) go, and hyphens inside words stay ("SAM-DSA").
 */
function excerpt(body = ''): string {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^[ \t]*\|?[ \t]*:?-{3,}[-:| \t]*$/gm, ' ') // table rule rows
    .replace(/^[ \t]*(?:[-*_][ \t]*){3,}$/gm, ' ') // thematic breaks
    .replace(/^[ \t]*(?:#{1,6}|>|[-*+])[ \t]+/gm, '') // heading, quote and bullet markers
    .replace(/\*\*|__|~~|[*`]/g, '') // emphasis, strikethrough and code marks
    .replace(/\|/g, ' ') // table cells
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 600);
}

export function searchIndex(posts: Post[]): SearchRecord[] {
  // Same keys in the same order as the old search.json; JSON.stringify drops an undefined venue.
  return posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    category: getCategory(post.data.category).label,
    venue: post.data.paper?.venue,
    tags: post.data.tags,
    text: excerpt(post.body),
    url: withBase(routes.post(post.slug)),
    date: post.data.pubDate.toISOString()
  }));
}
