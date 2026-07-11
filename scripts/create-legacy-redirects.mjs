import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const manifest = JSON.parse(await readFile(new URL('../src/data/post-manifest.json', import.meta.url), 'utf8'));

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

async function writeRedirect(relativePath, target) {
  const file = join(dist, relativePath);
  await mkdir(dirname(file), { recursive: true });
  const safeTarget = escapeHtml(target);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="description" content="This archive entry has moved to a new URL."><meta http-equiv="refresh" content="0;url=${safeTarget}"><link rel="canonical" href="https://kkubuck.github.io${safeTarget}"><title>Moved — Kkubuck</title></head><body><p>This entry moved to <a href="${safeTarget}">${safeTarget}</a>.</p><script>location.replace(${JSON.stringify(target)});</script></body></html>`;
  await writeFile(file, html);
}

let count = 0;
for (const item of manifest) {
  const [year, month, day] = item.date.split('-');
  const target = `/${item.kind === 'paper' ? 'papers' : 'notes'}/${item.slug}/`;
  const categorySets = new Set([
    (item.categories || []).join('/'),
    item.categories?.[0] || '',
    item.kind === 'paper' ? 'papers' : 'blog'
  ].filter(Boolean));
  for (const categories of categorySets) {
    await writeRedirect(`${categories}/${year}/${month}/${day}/${item.slug}.html`, target);
    count += 1;
  }
}

for (const [path, target] of [
  ['blog/index.html', '/notes/'],
  ['subprojects/index.html', '/projects/'],
  ['publications/index.html', '/papers/']
]) {
  await writeRedirect(path, target);
  count += 1;
}

console.log(`Generated ${count} legacy redirect files.`);
