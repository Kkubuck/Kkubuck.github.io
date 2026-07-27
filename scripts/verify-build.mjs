/**
 * Post-build validation.
 *
 * Every assertion here maps to something that has broken before: missing
 * routes, dropped content, unresolved links, or a feature quietly disappearing
 * from the shipped HTML.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');

const EXPECTED_PAPERS = 38;
const EXPECTED_NOTES = 27;
const EXPECTED_RECORDS = EXPECTED_PAPERS + EXPECTED_NOTES;
const CSS_BUDGET = 90_000;
const JS_BUDGET = 40_000;

const failures = [];
const warnings = [];

const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const output = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) output.push(...(await walk(path)));
    else output.push(path);
  }
  return output;
}

if (!(await exists(dist))) {
  console.error('ERROR: dist/ does not exist. Run the build first.');
  process.exit(1);
}

const files = (await walk(dist)).map((file) => file.replaceAll('\\', '/'));
const htmlFiles = files.filter((file) => extname(file) === '.html');

// Legacy redirect stubs live under dated paths and are checked separately.
const datedRedirect = /\/\d{4}\/\d{2}\/\d{2}\/[^/]+\.html$/;
const authoredPages = htmlFiles.filter(
  (file) => !datedRedirect.test(file) && (file.endsWith('/index.html') || file.endsWith('/404.html'))
);

/* -- Required routes ------------------------------------------------------- */

const required = [
  'index.html',
  'papers/index.html',
  'notes/index.html',
  'projects/index.html',
  'about/index.html',
  'cv/index.html',
  'tags/index.html',
  '404.html',
  'search.json',
  'rss.xml',
  'robots.txt',
  'sitemap-index.xml',
  'favicon.svg',
  'site.webmanifest'
];

for (const path of required) {
  if (!(await exists(join(dist, path)))) fail(`Missing required output: ${path}`);
}

/* -- Content counts -------------------------------------------------------- */

const paperPages = files.filter((file) => /\/papers\/[^/]+\/index\.html$/.test(file));
const notePages = files.filter((file) => /\/notes\/[^/]+\/index\.html$/.test(file));

if (paperPages.length !== EXPECTED_PAPERS) {
  fail(`Expected ${EXPECTED_PAPERS} paper pages, found ${paperPages.length}.`);
}
if (notePages.length !== EXPECTED_NOTES) {
  fail(`Expected ${EXPECTED_NOTES} note pages, found ${notePages.length}.`);
}

let searchIndex = null;
try {
  searchIndex = JSON.parse(await readFile(join(dist, 'search.json'), 'utf8'));
} catch (error) {
  fail(`search.json could not be parsed: ${error.message}`);
}
if (searchIndex && (!Array.isArray(searchIndex) || searchIndex.length !== EXPECTED_RECORDS)) {
  fail(`Expected ${EXPECTED_RECORDS} search records, found ${searchIndex?.length ?? 'none'}.`);
}
if (Array.isArray(searchIndex)) {
  const malformed = searchIndex.filter((item) => !item?.title || !item?.url);
  if (malformed.length) fail(`${malformed.length} search records are missing a title or url.`);
}

/* -- Global shell ---------------------------------------------------------- */

const home = await readFile(join(dist, 'index.html'), 'utf8');
const shell = home.match(
  /<header class="site-header"[\s\S]*?<\/header>[\s\S]*?<nav id="mobile-navigation"[\s\S]*?<\/nav>/
);

if (!shell) {
  fail('Could not locate the generated site shell (header plus mobile navigation).');
} else {
  for (const label of ['Home', 'Papers', 'Notes', 'Projects', 'About']) {
    if (!shell[0].includes(`>${label}<`)) fail(`Navigation label missing: ${label}`);
  }
  for (const legacy of ['홈', '논문', '기록', '프로젝트', '소개', '태그']) {
    if (shell[0].includes(legacy)) fail(`Untranslated navigation label remains: ${legacy}`);
  }
}

// Features that must survive a refactor, checked on the pages that host them.
const shellFeatures = [
  ['data-search-dialog', 'global search dialog'],
  ['data-theme-toggle', 'theme toggle'],
  ['data-nav-toggle', 'mobile navigation toggle']
];
for (const [marker, name] of shellFeatures) {
  if (!home.includes(marker)) fail(`Home page is missing the ${name}.`);
}
if (!home.includes('class="entry-list"')) fail('Home page is missing the latest-entries list.');

const archive = await readFile(join(dist, 'papers/index.html'), 'utf8');

// The venue select is rendered only when it has something to choose between,
// so derive the expectation from the content instead of hard-coding it.
const paperVenues = Array.isArray(searchIndex)
  ? new Set(searchIndex.filter((item) => item?.kind === 'paper' && item?.venue).map((item) => item.venue))
  : new Set();

for (const [marker, name, expected] of [
  ['data-filter-query', 'archive text filter', true],
  ['data-filter-year', 'archive year filter', true],
  ['data-filter-row', 'filterable archive rows', true],
  ['data-filter-venue', 'archive venue filter', paperVenues.size > 1]
]) {
  if (expected && !archive.includes(marker)) fail(`Papers archive is missing the ${name}.`);
}

const samplePaper = paperPages[0];
if (samplePaper) {
  const article = await readFile(samplePaper, 'utf8');
  for (const [marker, name] of [
    ['data-article', 'article enhancement hook'],
    ['data-read-progress', 'reading progress indicator'],
    ['data-copy-link', 'copy-link action']
  ]) {
    if (!article.includes(marker)) fail(`${relative(dist, samplePaper)} is missing the ${name}.`);
  }
}

// Removed effects must not reappear by way of a stale import.
for (const [marker, name] of [
  ['data-signal-canvas', 'decorative signal canvas'],
  ['data-narrative', 'scroll narrative'],
  ['data-tilt', 'pointer tilt'],
  ['data-reveal', 'scroll reveal']
]) {
  const offenders = [];
  for (const file of authoredPages) {
    if ((await readFile(file, 'utf8')).includes(marker)) offenders.push(relative(dist, file));
  }
  if (offenders.length) fail(`Retired ${name} still present in: ${offenders.slice(0, 3).join(', ')}`);
}

/* -- Per-page metadata and link integrity ---------------------------------- */

const idPattern = /\sid="([^"]+)"/g;
const refPattern = /\s(?:href|src)="([^"]+)"/g;
const checked = new Map();

function resolveTarget(currentFile, raw) {
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(clean)) return null;
  const disk = clean.startsWith('/')
    ? join(dist, clean.replace(/^\/+/, ''))
    : resolve(currentFile, '..', clean);
  if (clean.endsWith('/')) return join(disk, 'index.html');
  return extname(disk) ? disk : join(disk, 'index.html');
}

for (const file of authoredPages) {
  const html = await readFile(file, 'utf8');
  const rel = relative(dist, file);
  const is404 = rel === '404.html';

  if (!/<html[^>]+lang="(?:en|ko)"/.test(html)) fail(`${rel}: missing a valid html lang.`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${rel}: missing a title.`);
  if (!is404 && !/<meta name="description" content="[^"]+"/.test(html)) {
    fail(`${rel}: missing a description.`);
  }
  if (!/<link rel="canonical" href="https:\/\//.test(html)) fail(`${rel}: missing a canonical URL.`);
  // Insecure links are authored by us, so they are a hard failure. Insecure
  // media can only arrive through imported markup, and browsers block it
  // anyway, so it is surfaced without blocking a deployment.
  if (/href="http:\/\//.test(html)) fail(`${rel}: insecure http link found.`);
  if (/src="http:\/\//.test(html)) warn(`${rel}: insecure http media reference found.`);

  // Modern browsers imply noopener for target="_blank"; flag omissions in
  // imported markup without failing the build over them.
  for (const tag of html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []) {
    if (!/\brel="[^"]*\bnoopener\b/.test(tag)) {
      warn(`${rel}: target="_blank" without rel="noopener" -> ${tag.slice(0, 100)}`);
    }
  }

  const ids = [...html.matchAll(idPattern)].map((match) => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicates.length) fail(`${rel}: duplicate id(s): ${duplicates.join(', ')}`);

  for (const match of html.matchAll(refPattern)) {
    const target = resolveTarget(file, match[1]);
    if (!target || checked.has(target)) continue;
    checked.set(target, rel);
    if (!(await exists(target))) {
      fail(`${rel}: broken local reference ${match[1]} -> ${relative(dist, target)}`);
    }
  }
}

/* -- Payload budget -------------------------------------------------------- */

const sizeOf = async (list) =>
  (await Promise.all(list.map(async (file) => (await stat(file)).size))).reduce((a, b) => a + b, 0);

const cssBytes = await sizeOf(files.filter((file) => file.endsWith('.css')));
const jsBytes = await sizeOf(files.filter((file) => file.endsWith('.js')));

if (cssBytes > CSS_BUDGET) warn(`CSS payload is ${Math.round(cssBytes / 1024)} KiB (budget ${Math.round(CSS_BUDGET / 1024)} KiB).`);
if (jsBytes > JS_BUDGET) warn(`JavaScript payload is ${Math.round(jsBytes / 1024)} KiB (budget ${Math.round(JS_BUDGET / 1024)} KiB).`);

/* -- Report ---------------------------------------------------------------- */

console.log(
  `Checked ${authoredPages.length} pages, ${paperPages.length} papers, ${notePages.length} notes, ` +
    `${checked.size} local references.`
);
console.log(`Payload: ${Math.round(cssBytes / 1024)} KiB CSS, ${Math.round(jsBytes / 1024)} KiB JS.`);

for (const message of warnings) console.warn(`WARNING: ${message}`);

if (failures.length) {
  for (const message of failures) console.error(`ERROR: ${message}`);
  process.exit(1);
}

console.log('Build verification passed.');
