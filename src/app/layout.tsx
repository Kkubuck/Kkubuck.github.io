import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { GlassLightProvider } from '@/components/glass';
import { Header } from '@/components/Header';
import { IntentPrefetch } from '@/components/IntentPrefetch';
import { SearchDialog } from '@/components/SearchDialog';
import { HOME_TITLE, pageMetadata } from '@/lib/metadata';
import { SITE_URL, routes, withBase } from '@/lib/paths';
import { SITE } from '@/lib/site';
import { themeInitScript } from '@/lib/theme';

// Defaults for every page. Pages set their own canonical URL and social tags
// through pageMetadata(); the layout must not carry a canonical of its own.
const defaults = pageMetadata({ path: routes.home() });

export const metadata: Metadata = {
  ...defaults,
  alternates: { types: defaults.alternates?.types },
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: `%s | ${SITE.name}` },
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
  icons: {
    icon: [{ url: withBase('/favicon.svg'), type: 'image/svg+xml' }],
    apple: [{ url: withBase('/apple-touch-icon.png') }]
  },
  manifest: withBase('/site.webmanifest')
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f2' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e10' }
  ]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-theme is set by the inline script before hydration.
    <html lang={SITE.lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="sitemap" type="application/xml" href={withBase(routes.sitemapIndex())} />
      </head>
      <body>
        <GlassLightProvider>
          <a className="skip-link" href="#main">
            본문으로 건너뛰기
          </a>
          <Header />
          {/* tabIndex -1: the skip link moves focus here (screen-reader cursors follow focus). */}
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <SearchDialog />
          <IntentPrefetch />
        </GlassLightProvider>
      </body>
    </html>
  );
}
