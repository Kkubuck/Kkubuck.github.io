/**
 * The sitemap, served at two URLs with identical content:
 *
 * - /sitemap-0.xml: the URL the old site published and /sitemap-index.xml
 *   lists, which search consoles already know.
 * - /sitemap.xml: the conventional location crawlers probe.
 */
import { absoluteUrl, routes } from './paths';
import { collectTags, getPosts } from './posts';
import { CATEGORIES, SERIES } from './site';

interface SitemapEntry {
  url: string;
  lastModified?: Date;
}

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]!);

/** Every indexable page (not the 404 page or legacy redirect stubs). */
function sitemapEntries(): SitemapEntry[] {
  const posts = getPosts();
  const page = (path: string): SitemapEntry => ({ url: absoluteUrl(path) });

  return [
    page(routes.home()),
    page(routes.about()),
    ...CATEGORIES.map((category) => page(routes.category(category.id))),
    ...posts.map((post) => ({
      url: absoluteUrl(routes.post(post.slug)),
      lastModified: post.data.updatedDate ?? post.data.pubDate
    })),
    ...SERIES.map((series) => page(routes.series(series.id))),
    page(routes.tags()),
    ...collectTags(posts).map(({ tag }) => page(routes.tag(tag)))
  ];
}

export function sitemapResponse(): Response {
  const urls = sitemapEntries()
    .map(
      ({ url, lastModified }) =>
        `<url><loc>${escapeXml(url)}</loc>${lastModified ? `<lastmod>${lastModified.toISOString()}</lastmod>` : ''}</url>`
    )
    .join('\n');
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
