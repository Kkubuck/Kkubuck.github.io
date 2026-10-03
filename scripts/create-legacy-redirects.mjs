/**
 * Writes static redirect pages for every URL the blog used to have.
 *
 * GitHub Pages cannot send real 301s, so each old path gets a tiny HTML page
 * with a canonical link, a meta refresh, and a script fallback. The map lives
 * in src/data/redirects.json; add an entry there when a post's URL changes.
 *
 * Runs after `next build` (see the "build" script). Never overwrites a page
 * the site builds itself.
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, siteConfig } from './site-config.mjs';

loadEnv();
const { basePath: base, siteUrl: site } = siteConfig();
const root = fileURLToPath(new URL('../', import.meta.url));
const out = join(root, 'out');
/** @type {Record<string, string>} */
const redirects = JSON.parse(await readFile(join(root, 'src/data/redirects.json'), 'utf8'));

/** @type {Record<string, string>} */
const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
/** @param {string} value */
const escape = (value) => value.replace(/[&<>'"]/g, (char) => ENTITIES[char] ?? char);

/** @param {string} path */
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(out))) {
  console.error('out/ does not exist. Run `next build` first.');
  process.exit(1);
}

let written = 0;
let skipped = 0;
for (const [from, to] of Object.entries(redirects)) {
  const file = join(out, from.endsWith('/') ? `${from}index.html` : from);
  // Never overwrite a page the site actually builds.
  if (await exists(file)) {
    console.warn(`Skipped ${from}: a real page already exists there.`);
    skipped += 1;
    continue;
  }
  const target = `${base}${to}`;
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>페이지가 이동했습니다</title><link rel="canonical" href="${escape(site + target)}"><meta http-equiv="refresh" content="0;url=${escape(target)}"></head><body><p><a href="${escape(target)}">새 주소로 이동합니다.</a></p><script>location.replace(${JSON.stringify(target)} + location.hash);</script></body></html>`;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  written += 1;
}

console.log(`Generated ${written} redirect pages${skipped ? ` (${skipped} skipped)` : ''}.`);
