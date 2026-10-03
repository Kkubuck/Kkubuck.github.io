/**
 * BASE_PATH and SITE_URL, read and validated in one place.
 *
 * next.config.ts and every post-build script use siteConfig(), and the scripts
 * call loadEnv() first so they read the same .env files `next build` does.
 * Without that, a value set in .env would reach the pages but not the redirect
 * stubs or the build checks.
 *
 * SITE_URL is an origin only (https://kkubuck.github.io). A project site's
 * repository path goes in BASE_PATH, never in SITE_URL, or every absolute URL
 * would carry the path twice.
 */
import { fileURLToPath } from 'node:url';
import nextEnv from '@next/env';

export const DEFAULT_SITE_URL = 'https://kkubuck.github.io';

const root = fileURLToPath(new URL('../', import.meta.url));

/** Loads .env, .env.production, .env.local and .env.production.local like `next build`; shell variables win. */
export function loadEnv() {
  nextEnv.loadEnvConfig(root, false);
}

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {{ basePath: string, siteUrl: string }}
 */
export function siteConfig(env = process.env) {
  const rawBase = (env.BASE_PATH ?? '').trim().replace(/\/+$/, '');
  const basePath = rawBase && !rawBase.startsWith('/') ? `/${rawBase}` : rawBase;
  if (basePath && !/^(?:\/[\w.~-]+)+$/.test(basePath)) {
    throw new Error(`BASE_PATH must look like "/repository-name", got "${env.BASE_PATH}".`);
  }

  const rawSite = (env.SITE_URL || DEFAULT_SITE_URL).trim();
  let url;
  try {
    url = new URL(rawSite);
  } catch {
    throw new Error(`SITE_URL must be an absolute URL such as ${DEFAULT_SITE_URL}, got "${rawSite}".`);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`SITE_URL must be an http(s) URL, got "${rawSite}".`);
  }
  if (url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error(
      `SITE_URL must be an origin with no path, got "${rawSite}". ` +
        'Put a repository path in BASE_PATH instead (SITE_URL=https://user.github.io BASE_PATH=/repo).'
    );
  }
  return { basePath, siteUrl: url.origin };
}
