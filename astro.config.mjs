import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const base = process.env.BASE_PATH?.replace(/\/$/, '') || undefined;

export default defineConfig({
  site: process.env.SITE_URL || 'https://kkubuck.github.io',
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      defaultColor: false,
      wrap: true
    }
  },
  build: {
    format: 'directory',
    assets: '_assets'
  },
  // prefetchAll is required for defaultStrategy to apply to ordinary links;
  // without it only links carrying data-astro-prefetch are considered.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  vite: {
    build: {
      cssMinify: 'lightningcss'
    }
  }
});
