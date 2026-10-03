import { absoluteUrl, routes } from '@/lib/paths';

export const dynamic = 'force-static';

/** robots.txt and search consoles point at /sitemap-index.xml; like the old site's, it lists /sitemap-0.xml. */
export function GET() {
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    `<sitemap><loc>${absoluteUrl(routes.sitemap())}</loc></sitemap>` +
    '</sitemapindex>';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
