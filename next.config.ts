import type { NextConfig } from 'next';
import { siteConfig } from './scripts/site-config.mjs';

/**
 * Static export for GitHub Pages.
 *
 * BASE_PATH: empty for the user site (https://kkubuck.github.io); set it to
 * "/repo-name" to deploy from a project repository.
 * SITE_URL: absolute origin used for canonical URLs, RSS and the sitemap.
 * Both are validated in scripts/site-config.mjs, which the post-build scripts share.
 */
const { basePath, siteUrl } = siteConfig();

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl
  },
  reactStrictMode: true,
  // `next dev` would otherwise write AGENTS.md and CLAUDE.md into the repository
  // whenever it runs under a coding agent.
  agentRules: false
};

export default nextConfig;
