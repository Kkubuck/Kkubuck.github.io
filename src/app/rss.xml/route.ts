import feedGuids from '@/data/feed-guids.json';
import { absoluteUrl, routes } from '@/lib/paths';
import { getPosts, type Post } from '@/lib/posts';
import { SITE, getCategory } from '@/lib/site';

export const dynamic = 'force-static';

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]!);

const element = (name: string, value: string, attributes = '') => `<${name}${attributes}>${escapeXml(value)}</${name}>`;

/**
 * Feed readers recognise an item by its guid. Posts published before the move
 * to /posts/<slug>/ keep the guid the live feed gave them (/notes/... or
 * /papers/..., now redirect stubs), so the rebuild does not re-announce them.
 */
const LEGACY_GUIDS: Readonly<Record<string, string>> = feedGuids;

const guidFor = (post: Post) => absoluteUrl(LEGACY_GUIDS[post.slug] ?? routes.post(post.slug));

/** RSS 2.0: the old @astrojs/rss channel and items, plus atom:link rel="self" and lastBuildDate. */
export function GET() {
  const posts = getPosts();
  // The newest change to any post, so the feed is identical between builds of the same content.
  const lastBuild = posts.reduce(
    (latest, post) => Math.max(latest, (post.data.updatedDate ?? post.data.pubDate).valueOf()),
    0
  );
  const items = posts
    .map((post) => {
      const url = absoluteUrl(routes.post(post.slug));
      const categories = [getCategory(post.data.category).label, ...post.data.tags];
      return [
        '<item>',
        element('title', post.data.title),
        element('link', url),
        element('guid', guidFor(post), ' isPermaLink="true"'),
        element('description', post.data.description),
        element('pubDate', post.data.pubDate.toUTCString()),
        ...categories.map((category) => element('category', category)),
        element('author', `${SITE.links.email} (${SITE.author})`),
        '</item>'
      ].join('');
    })
    .join('');

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>' +
    element('title', SITE.title) +
    element('description', SITE.description) +
    element('link', absoluteUrl(routes.home())) +
    `<atom:link href="${escapeXml(absoluteUrl(routes.rss()))}" rel="self" type="application/rss+xml"/>` +
    element('language', 'ko-kr') +
    (lastBuild ? element('lastBuildDate', new Date(lastBuild).toUTCString()) : '') +
    items +
    '</channel></rss>';

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
