import type { Metadata } from 'next';
import { SITE } from './site';
import { absoluteUrl, routes, withBase } from './paths';

/** Home page title and header wordmark. No tagline: the brand is the only copy. */
export const WORDMARK = { name: SITE.name, suffix: 'Blog' } as const;
export const HOME_TITLE = `${WORDMARK.name} ${WORDMARK.suffix}`;

interface PageMetadataOptions {
  /** Page title without the " | Kkubuck" suffix; omit on the home page. */
  title?: string;
  description?: string;
  /** Route path, e.g. "/posts/x/". */
  path: string;
  type?: 'website' | 'article';
  publishedTime?: Date;
  modifiedTime?: Date;
  noindex?: boolean;
}

/**
 * Full metadata for one page. Next.js replaces (not merges) nested objects such
 * as openGraph and alternates, so every page builds the complete set here.
 */
export function pageMetadata({
  title,
  description = SITE.description,
  path,
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex = false
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  // A noindex page (the 404 page) is served at any missing URL, so it claims no URL of its own.
  const ogUrl = noindex ? {} : { url };
  const image = absoluteUrl('/og-card.png');
  const socialTitle = title ?? HOME_TITLE;

  const openGraph: NonNullable<Metadata['openGraph']> =
    type === 'article'
      ? {
          type: 'article',
          siteName: SITE.name,
          title: socialTitle,
          description,
          ...ogUrl,
          images: [{ url: image, width: 1200, height: 630 }],
          locale: SITE.locale,
          ...(publishedTime ? { publishedTime: publishedTime.toISOString() } : {}),
          ...(modifiedTime ? { modifiedTime: modifiedTime.toISOString() } : {}),
          authors: [SITE.author]
        }
      : {
          type: 'website',
          siteName: SITE.name,
          title: socialTitle,
          description,
          ...ogUrl,
          images: [{ url: image, width: 1200, height: 630 }],
          locale: SITE.locale
        };

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      ...(noindex ? {} : { canonical: url }),
      types: { 'application/rss+xml': [{ url: withBase(routes.rss()), title: SITE.name }] }
    },
    openGraph,
    twitter: { card: 'summary_large_image', title: socialTitle, description, images: [image] },
    ...(noindex ? { robots: { index: false } } : {})
  };
}
