import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './paths';

export type Post = CollectionEntry<'posts'>;

export async function getAllPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getPostsByKind(kind: Post['data']['kind']) {
  return (await getAllPosts()).filter((post) => post.data.kind === kind);
}

export function getPostUrl(post: Post) {
  const root = post.data.kind === 'paper' ? 'papers' : 'notes';
  return withBase(`/${root}/${post.data.slug}/`);
}

export function getPostPath(post: Post) {
  const root = post.data.kind === 'paper' ? 'papers' : 'notes';
  return `/${root}/${post.data.slug}/`;
}

export function formatDate(date: Date, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'Asia/Seoul'
  }).format(date);
}

export function readingTime(body = '') {
  const korean = (body.match(/[가-힣]/g) ?? []).length;
  const latinWords = (body.replace(/[가-힣]/g, ' ').match(/[\p{L}\p{N}_-]+/gu) ?? []).length;
  const minutes = Math.max(1, Math.ceil(korean / 500 + latinWords / 220));
  return `${minutes} min read`;
}

export function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

export function tagSlug(tag: string) {
  return tag.trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
}

export function titleCaseTag(tag: string) {
  return tag
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => (part.length <= 4 ? part.toUpperCase() : `${part[0]?.toUpperCase()}${part.slice(1)}`))
    .join(' ');
}

export function getLegacyPath(post: Post) {
  const y = post.data.pubDate.getFullYear();
  const m = String(post.data.pubDate.getMonth() + 1).padStart(2, '0');
  const d = String(post.data.pubDate.getDate()).padStart(2, '0');
  const category = post.data.categories[0] || (post.data.kind === 'paper' ? 'papers' : 'notes');
  return `/${category}/${y}/${m}/${d}/${post.id}.html`;
}
