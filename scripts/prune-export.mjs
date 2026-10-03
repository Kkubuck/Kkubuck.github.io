/**
 * Removes the extra copies of the not-found page that `next build` exports.
 *
 * Next.js writes the page to out/404.html (what GitHub Pages serves, with a
 * 404 status, for every missing path) and also to out/404/index.html and
 * out/_not-found/index.html. Those two would answer /404/ and /_not-found/
 * with 200 OK: soft 404s. They are deleted only when they are byte-identical
 * to 404.html, so a real page is never removed.
 *
 * Runs after `next build` (see the "build" script).
 */
import { readFile, rm, rmdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../out/', import.meta.url));

/** @param {string} path */
async function readIfExists(path) {
  try {
    return await readFile(path);
  } catch {
    return null;
  }
}

const notFound = await readIfExists(join(out, '404.html'));
if (!notFound) {
  console.error('out/404.html does not exist. Run `next build` first.');
  process.exit(1);
}

let removed = 0;
for (const copy of ['404/index.html', '_not-found/index.html']) {
  const path = join(out, copy);
  const html = await readIfExists(path);
  if (!html) continue;
  if (!html.equals(notFound)) {
    console.error(`out/${copy} differs from out/404.html; left in place. Check what renders there.`);
    process.exit(1);
  }
  await rm(path);
  removed += 1;
  // Drop the folder too when nothing else is left in it (out/404/).
  await rmdir(dirname(path)).catch(() => {});
}

console.log(`Removed ${removed} soft-404 copies of the not-found page.`);
