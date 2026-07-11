import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const failures = [];
const warnings = [];

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

async function walk(dir) {
  const output = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    else output.push(path);
  }
  return output;
}

function fail(message) { failures.push(message); }
function warn(message) { warnings.push(message); }

if (!(await exists(dist))) fail('dist/ does not exist.');
const files = (await walk(dist)).map((file) => file.replaceAll('\\', '/'));
const htmlFiles = files.filter((file) => extname(file) === '.html');
const normalPages = htmlFiles.filter((file) => file.endsWith('/index.html') && !/\/(?:tistory|course|papers|blog|subprojects)\/\d{4}\//.test(file));

const required = [
  'index.html', 'papers/index.html', 'notes/index.html', 'projects/index.html', 'about/index.html',
  'cv/index.html', 'tags/index.html', '404.html', 'search.json', 'rss.xml', 'robots.txt', 'sitemap-index.xml'
];
for (const path of required) if (!(await exists(join(dist, path)))) fail(`Missing required output: ${path}`);

const paperPages = files.filter((file) => /\/papers\/[^/]+\/index\.html$/.test(file) && !/\/papers\/index\.html$/.test(file));
const notePages = files.filter((file) => /\/notes\/[^/]+\/index\.html$/.test(file) && !/\/notes\/index\.html$/.test(file));
if (paperPages.length !== 38) fail(`Expected 38 paper pages, found ${paperPages.length}.`);
if (notePages.length !== 27) fail(`Expected 27 note pages, found ${notePages.length}.`);

const searchIndex = JSON.parse(await readFile(join(dist, 'search.json'), 'utf8'));
if (!Array.isArray(searchIndex) || searchIndex.length !== 65) fail(`Expected 65 search records, found ${searchIndex?.length ?? 'invalid JSON'}.`);

const rootHtml = await readFile(join(dist, 'index.html'), 'utf8');
const headerMatch = rootHtml.match(/<header class="site-header"[\s\S]*?<\/header>[\s\S]*?<nav id="mobile-navigation"[\s\S]*?<\/nav>/);
if (!headerMatch) fail('Could not locate the generated global navigation.');
else {
  for (const koreanLabel of ['홈', '논문', '기록', '프로젝트', '소개', '태그']) {
    if (headerMatch[0].includes(koreanLabel)) fail(`Korean navigation label remains: ${koreanLabel}`);
  }
  for (const label of ['Home', 'Papers', 'Notes', 'Projects', 'About']) {
    if (!headerMatch[0].includes(`>${label}<`)) fail(`English navigation label missing: ${label}`);
  }
}
if (!rootHtml.includes('data-signal-canvas')) fail('Interactive signal canvas is missing from the home page.');
if (!rootHtml.includes('data-narrative')) fail('Scroll narrative is missing from the home page.');
if (!rootHtml.includes('data-search-dialog')) fail('Global search dialog is missing.');

const idPattern = /\sid="([^"]+)"/g;
const attrPattern = /\s(?:href|src)="([^"]+)"/g;
const checkedTargets = new Set();

function resolveOutputTarget(currentFile, raw) {
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(clean)) return null;
  let disk;
  if (clean.startsWith('/')) disk = join(dist, clean.replace(/^\/+/, ''));
  else disk = resolve(currentFile, '..', clean);
  if (clean.endsWith('/')) return join(disk, 'index.html');
  if (extname(disk)) return disk;
  return join(disk, 'index.html');
}

for (const file of normalPages) {
  const html = await readFile(file, 'utf8');
  const rel = relative(dist, file);
  if (!/<html[^>]+lang="(?:en|ko)"/.test(html)) fail(`${rel}: missing valid html lang.`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${rel}: missing title.`);
  if (!/<meta name="description" content="[^"]+"/.test(html) && rel !== '404.html') fail(`${rel}: missing description.`);
  if (!/<link rel="canonical" href="https:\/\//.test(html)) fail(`${rel}: missing canonical URL.`);
  if (/href="http:\/\//.test(html)) fail(`${rel}: insecure http link found.`);

  const ids = [];
  for (const match of html.matchAll(idPattern)) ids.push(match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(`${rel}: duplicate id(s): ${[...new Set(duplicates)].join(', ')}`);

  for (const match of html.matchAll(attrPattern)) {
    const raw = match[1];
    const target = resolveOutputTarget(file, raw);
    if (!target || checkedTargets.has(target)) continue;
    checkedTargets.add(target);
    if (!(await exists(target))) fail(`${rel}: broken local reference ${raw} -> ${relative(dist, target)}`);
  }
}

const cssFiles = files.filter((file) => file.endsWith('.css'));
const jsFiles = files.filter((file) => file.endsWith('.js'));
const totalCss = (await Promise.all(cssFiles.map(async (file) => (await stat(file)).size))).reduce((a, b) => a + b, 0);
const totalJs = (await Promise.all(jsFiles.map(async (file) => (await stat(file)).size))).reduce((a, b) => a + b, 0);
if (totalCss > 160_000) warn(`CSS payload is ${Math.round(totalCss / 1024)} KiB.`);
if (totalJs > 120_000) warn(`JavaScript payload is ${Math.round(totalJs / 1024)} KiB.`);

console.log(`Verified ${normalPages.length} primary HTML pages, ${paperPages.length} papers, ${notePages.length} notes, and ${checkedTargets.size} local references.`);
console.log(`Built assets: ${Math.round(totalCss / 1024)} KiB CSS, ${Math.round(totalJs / 1024)} KiB JavaScript.`);
for (const message of warnings) console.warn(`WARNING: ${message}`);
if (failures.length) {
  for (const message of failures) console.error(`ERROR: ${message}`);
  process.exit(1);
}
console.log('Build verification passed.');
