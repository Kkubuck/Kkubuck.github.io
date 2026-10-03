/**
 * Post-build checks on out/. Run after `next build` and the post-build scripts:
 *
 *   npm run verify
 *
 * Fails on missing pages, broken local links and anchors, unrendered Markdown,
 * code blocks without highlighting, redirects that point nowhere, URLs the live
 * site served that no longer resolve, soft-404 pages, and invalid RSS /
 * sitemap / search.json / web manifest output.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { basename, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { loadEnv, siteConfig } from './site-config.mjs';

loadEnv();
const { basePath: base, siteUrl: site } = siteConfig();
const root = fileURLToPath(new URL('../', import.meta.url));
const out = join(root, 'out');
const postsDir = join(root, 'content/posts');

/** @type {string[]} */
const failures = [];
/** @param {string} message */
const fail = (message) => failures.push(message);

/** @param {string} path */
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

/** @param {string | undefined} value */
const decodeEntities = (value = '') =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

/**
 * "/repo/posts/x/" → out/posts/x/index.html; null when the path is outside the base path.
 * @param {string} path
 * @returns {string | null}
 */
function fileForPath(path) {
  let local = path;
  if (base) {
    if (local !== base && !local.startsWith(`${base}/`)) return null;
    local = local.slice(base.length) || '/';
  }
  local = decodeURIComponent(local);
  return local.endsWith('/') ? join(out, local, 'index.html') : join(out, local);
}

/**
 * "https://kkubuck.github.io/repo/x/" → out file, or null for other origins.
 * @param {string} url
 * @returns {string | null}
 */
function fileForUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.origin !== site || parsed.search || parsed.hash) return null;
  return fileForPath(parsed.pathname);
}

/**
 * Inner HTML of the first <div> that starts with `openTag`, matching nested divs.
 * @param {string} html
 * @param {string} openTag
 */
function innerDiv(html, openTag) {
  const start = html.indexOf(openTag);
  if (start < 0) return null;
  const pattern = /<div\b|<\/div>/g;
  pattern.lastIndex = start;
  let depth = 0;
  for (let match = pattern.exec(html); match; match = pattern.exec(html)) {
    depth += match[0] === '</div>' ? -1 : 1;
    if (depth === 0) return html.slice(start + openTag.length, match.index);
  }
  return null;
}

/**
 * Tag balance for small generated XML documents.
 * @param {string} name
 * @param {string} xml
 */
function checkXml(name, xml) {
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) fail(`${name}: missing XML declaration.`);
  /** @type {string[]} */
  const stack = [];
  const body = xml.replace(/^<\?xml[^>]*\?>/, '');
  for (const match of body.matchAll(/<(\/?)([A-Za-z][\w:.-]*)(?:\s[^>]*?)?(\/?)>/g)) {
    const [, closing, tag, selfClosing] = match;
    if (selfClosing) continue;
    if (!closing) stack.push(String(tag));
    else if (stack.pop() !== tag) {
      fail(`${name}: mismatched </${tag}>.`);
      return;
    }
  }
  if (stack.length) fail(`${name}: unclosed <${stack.at(-1)}>.`);
  if (/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/i.test(body)) fail(`${name}: unescaped "&".`);
}

if (!(await exists(out))) {
  console.error('out/ does not exist. Run the build first.');
  process.exit(1);
}

/** @type {Record<string, string>} */
const redirects = JSON.parse(await readFile(join(root, 'src/data/redirects.json'), 'utf8'));
const redirectFiles = new Set(
  Object.keys(redirects).map((from) => join(out, from.endsWith('/') ? `${from}index.html` : from))
);

const files = await walk(out);
const pages = files.filter(
  (file) => extname(file) === '.html' && !redirectFiles.has(file) && !relative(out, file).startsWith(`_next${sep}`)
);

/* Required output ---------------------------------------------------------- */

const required = [
  // Shipped because deploy.yml uploads hidden files (checked below).
  '.nojekyll',
  'index.html',
  '404.html',
  'about/index.html',
  'tags/index.html',
  'category/paper-review/index.html',
  'category/research-note/index.html',
  'category/study/index.html',
  'category/coding-test/index.html',
  'series/data-structures/index.html',
  'series/hongong-ml/index.html',
  'search.json',
  'rss.xml',
  'robots.txt',
  'sitemap.xml',
  'sitemap-0.xml',
  'sitemap-index.xml',
  'favicon.svg',
  'apple-touch-icon.png',
  'og-card.png',
  'site.webmanifest'
];
for (const path of required) {
  if (!(await exists(join(out, path)))) fail(`Missing output: ${path}`);
}

// actions/upload-pages-artifact leaves dotfiles out unless told otherwise, so
// .nojekyll only reaches Pages with include-hidden-files, and nothing else
// hidden may sit in out/ to ride along with it.
const workflow = await readFile(join(root, '.github/workflows/deploy.yml'), 'utf8');
if (!/^\s*include-hidden-files:\s*true\s*$/m.test(workflow)) {
  fail('deploy.yml: upload-pages-artifact needs include-hidden-files: true, or out/.nojekyll is not deployed.');
}
for (const file of files) {
  const name = relative(out, file);
  if (name !== '.nojekyll' && name.split(sep).some((part) => part.startsWith('.'))) fail(`Hidden file in out/: ${name}`);
}

// /404/ and /_not-found/ would answer 200 with the not-found page (scripts/prune-export.mjs removes them).
for (const softNotFound of ['404/index.html', '_not-found/index.html']) {
  if (await exists(join(out, softNotFound))) fail(`Soft 404: out/${softNotFound} serves the not-found page with status 200.`);
}

/* Every URL the live site served still resolves ----------------------------- */

const liveUrls = (await readFile(join(root, 'src/data/live-urls.txt'), 'utf8'))
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));
for (const path of liveUrls) {
  const file = fileForPath(`${base}${path}`);
  if (!file || !(await exists(file))) fail(`Live URL ${path} no longer resolves (src/data/live-urls.txt).`);
}

/* Every post is built ------------------------------------------------------ */

const published = [];
for (const file of (await readdir(postsDir)).filter((name) => name.endsWith('.md')).sort()) {
  const { data } = matter(await readFile(join(postsDir, file), 'utf8'));
  if (data.draft !== true) published.push(file.replace(/\.md$/, ''));
}
for (const slug of published) {
  if (!(await exists(join(out, 'posts', slug, 'index.html')))) fail(`Post not built: ${slug}`);
}

/* search.json -------------------------------------------------------------- */

try {
  const index = JSON.parse(await readFile(join(out, 'search.json'), 'utf8'));
  if (!Array.isArray(index)) throw new Error('not an array');
  if (index.length !== published.length) fail(`search.json has ${index.length} records, expected ${published.length}.`);
  for (const item of index) {
    const label = item?.url ?? JSON.stringify(item).slice(0, 60);
    for (const key of ['title', 'description', 'category', 'text', 'url', 'date']) {
      if (typeof item?.[key] !== 'string' || (key !== 'text' && !item[key])) fail(`search.json ${label}: bad "${key}".`);
    }
    if (!Array.isArray(item?.tags)) fail(`search.json ${label}: tags is not an array.`);
    if (Number.isNaN(Date.parse(item?.date))) fail(`search.json ${label}: date is not ISO 8601.`);
    const file = typeof item?.url === 'string' ? fileForPath(item.url) : null;
    if (!file || !(await exists(file))) fail(`search.json ${label}: url does not resolve to a page.`);
  }
} catch (error) {
  fail(`search.json could not be read: ${String(error)}`);
}

/* RSS ---------------------------------------------------------------------- */

try {
  const rss = await readFile(join(out, 'rss.xml'), 'utf8');
  checkXml('rss.xml', rss);
  if (!/<rss version="2\.0" xmlns:atom="http:\/\/www\.w3\.org\/2005\/Atom"><channel>/.test(rss)) {
    fail('rss.xml: not an RSS 2.0 channel with the Atom namespace.');
  }
  const channel = rss.slice(0, rss.includes('<item>') ? rss.indexOf('<item>') : undefined);
  for (const tag of ['title', 'link', 'description', 'language', 'lastBuildDate']) {
    if (!new RegExp(`<${tag}>[^<]+</${tag}>`).test(channel)) fail(`rss.xml: channel has no <${tag}>.`);
  }
  const self = decodeEntities(channel.match(/<atom:link href="([^"]+)" rel="self" type="application\/rss\+xml"\/>/)?.[1] ?? '');
  if (self !== `${site}${base}/rss.xml`) fail(`rss.xml: atom:link rel="self" is "${self}", expected ${site}${base}/rss.xml.`);
  const items = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1] ?? '');
  if (items.length !== published.length) fail(`rss.xml has ${items.length} items, expected ${published.length}.`);
  for (const item of items) {
    const link = decodeEntities(item.match(/<link>([^<]+)<\/link>/)?.[1] ?? '');
    const guid = decodeEntities(item.match(/<guid isPermaLink="true">([^<]+)<\/guid>/)?.[1] ?? '');
    const pubDate = item.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] ?? '';
    if (!/<title>[^<]+<\/title>/.test(item)) fail(`rss.xml ${link}: item without <title>.`);
    // A post from before /posts/ keeps its old guid (src/data/feed-guids.json):
    // the old URL, which must still redirect to the item's link.
    if (guid !== link) {
      const guidPath = fileForUrl(guid) && new URL(guid).pathname.slice(base.length);
      const linkPath = fileForUrl(link) && new URL(link).pathname.slice(base.length);
      if (!guidPath || !linkPath || redirects[guidPath] !== linkPath) {
        fail(`rss.xml ${link}: guid ${guid} is neither the link nor a redirect to it.`);
      }
    }
    if (!/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(pubDate)) fail(`rss.xml ${link}: bad pubDate "${pubDate}".`);
    const file = fileForUrl(link);
    if (!file || !(await exists(file))) fail(`rss.xml: link ${link} does not resolve to a page.`);
  }
} catch (error) {
  fail(`rss.xml could not be read: ${String(error)}`);
}

/* Sitemap and robots ------------------------------------------------------- */

/** @type {string[]} */
let sitemapUrls = [];
try {
  const sitemap = await readFile(join(out, 'sitemap.xml'), 'utf8');
  checkXml('sitemap.xml', sitemap);
  // /sitemap-0.xml is the old site's URL for the same file; the index lists it.
  if ((await readFile(join(out, 'sitemap-0.xml'), 'utf8')) !== sitemap) fail('sitemap-0.xml differs from sitemap.xml.');
  if (!/<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(sitemap)) fail('sitemap.xml: missing <urlset>.');
  sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeEntities(match[1]));
  if (new Set(sitemapUrls).size !== sitemapUrls.length) fail('sitemap.xml: duplicate URLs.');
  for (const url of sitemapUrls) {
    const file = fileForUrl(url);
    if (!file || !(await exists(file)) || redirectFiles.has(file)) fail(`sitemap.xml: ${url} is not a built page.`);
  }

  const index = await readFile(join(out, 'sitemap-index.xml'), 'utf8');
  checkXml('sitemap-index.xml', index);
  const locs = [...index.matchAll(/<sitemap><loc>([^<]+)<\/loc><\/sitemap>/g)].map((match) => decodeEntities(match[1]));
  if (!locs.length) fail('sitemap-index.xml: no <sitemap> entries.');
  for (const loc of locs) {
    const file = fileForUrl(loc);
    if (!file || !(await exists(file))) fail(`sitemap-index.xml: ${loc} does not exist.`);
  }

  const robots = await readFile(join(out, 'robots.txt'), 'utf8');
  const sitemapLine = robots.match(/^Sitemap: (\S+)$/m)?.[1];
  if (!sitemapLine) fail('robots.txt: no Sitemap line.');
  else {
    const file = fileForUrl(sitemapLine);
    if (!file || !(await exists(file))) fail(`robots.txt: ${sitemapLine} does not exist.`);
  }
} catch (error) {
  fail(`sitemap could not be read: ${String(error)}`);
}

/* Web app manifest ---------------------------------------------------------- */

// Browsers resolve start_url, scope and icon paths against the manifest's own
// URL, so they must land inside the base path on files that exist.
try {
  const manifestUrl = `${site}${base}/site.webmanifest`;
  const manifest = JSON.parse(await readFile(join(out, 'site.webmanifest'), 'utf8'));
  for (const [label, value] of [
    ['start_url', manifest.start_url],
    ['scope', manifest.scope ?? '.'],
    ...(manifest.icons ?? []).map((/** @type {{ src: string }} */ icon) => ['icon', icon.src])
  ]) {
    const resolved = new URL(String(value), manifestUrl).href;
    const file = fileForUrl(resolved);
    if (!file || !(await exists(file))) fail(`site.webmanifest: ${label} "${value}" resolves to ${resolved}, which is not in out/.`);
  }
} catch (error) {
  fail(`site.webmanifest could not be read: ${String(error)}`);
}

/* Page-level checks -------------------------------------------------------- */

/** @type {Map<string, boolean>} */
const existsCache = new Map();
/** @param {string} path */
const cachedExists = async (path) => {
  if (!existsCache.has(path)) existsCache.set(path, await exists(path));
  return existsCache.get(path);
};

let codeBlocks = 0;
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const name = relative(out, file);
  const noindex = /<meta name="robots" content="noindex/.test(html);

  if (!/<html lang="ko"/.test(html)) fail(`${name}: missing lang="ko".`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${name}: missing <title>.`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(`${name}: missing meta description.`);
  const canonical = decodeEntities(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '');
  if (!noindex && !canonical) fail(`${name}: missing canonical URL.`);
  if (canonical && fileForUrl(canonical) !== file) fail(`${name}: canonical ${canonical} is not this page.`);
  const ogUrl = decodeEntities(html.match(/<meta property="og:url" content="([^"]+)"/)?.[1] ?? '');
  if (ogUrl !== canonical) fail(`${name}: og:url "${ogUrl}" differs from the canonical URL "${canonical}".`);
  const robotsTags = (html.match(/<meta name="robots"/g) ?? []).length;
  if (robotsTags > 1) fail(`${name}: ${robotsTags} robots meta tags.`);
  if (name === '404.html' && !noindex) fail('404.html: not marked noindex.');
  if (/(?:src|href)="http:\/\//.test(html)) fail(`${name}: insecure http:// reference.`);
  const h1 = (html.match(/<h1\b/g) ?? []).length;
  if (h1 !== 1) fail(`${name}: has ${h1} <h1> elements, expected 1.`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => decodeEntities(match[1]));
  const idSet = new Set(ids);
  const duplicate = ids.find((id, index) => ids.indexOf(id) !== index);
  if (duplicate) fail(`${name}: duplicate id "${duplicate}".`);

  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(match[0])) fail(`${name}: target="_blank" without rel="noopener".`);
  }

  // In-page anchors (table of contents, skip link) must point at an element.
  for (const match of html.matchAll(/href="#([^"]+)"/g)) {
    const id = decodeURIComponent(decodeEntities(match[1]));
    if (!idSet.has(id)) fail(`${name}: anchor #${id} has no target.`);
  }

  // Local links and assets must resolve to a built file. Resource hints such as
  // Next.js' <link rel="preconnect" href="/"> name an origin, not a file.
  const linkable = html.replace(/<link rel="(?:preconnect|dns-prefetch)"[^>]*>/g, '');
  for (const match of linkable.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const path = decodeEntities(match[1]);
    if (path.startsWith('//')) continue;
    const target = fileForPath(path);
    if (!target) fail(`${name}: local link ${path} is outside the base path "${base}".`);
    else if (!(await cachedExists(target))) fail(`${name}: broken local link ${path}`);
  }

  // Article bodies must not leak raw Markdown or imported markup.
  const body = innerDiv(html, '<div class="prose">');
  if (name.startsWith(`posts${sep}`) && body === null) fail(`${name}: no article body.`);
  if (body !== null) {
    const text = decodeEntities(
      body
        .replace(/<pre[\s\S]*?<\/pre>/g, '')
        .replace(/<code>[\s\S]*?<\/code>/g, '')
        .replace(/<[^>]+>/g, '')
    );
    if (text.includes('**')) fail(`${name}: unrendered ** in article text.`);
    if (/\{:\s*[.#]?[\w-]/.test(text)) fail(`${name}: leftover Kramdown attribute list.`);
    if (/\]\((?:https?:|\/|#)/.test(text)) fail(`${name}: unrendered Markdown link.`);
    if (/&amp;(?:lt|gt|amp|nbsp|quot);/.test(body)) fail(`${name}: double-escaped HTML entity.`);
    for (const match of body.matchAll(/<pre\b[^>]*>/g)) {
      codeBlocks += 1;
      if (!/class="shiki\b/.test(match[0])) fail(`${name}: code block without syntax highlighting.`);
      else if (!/data-language="[^"]+"/.test(match[0])) fail(`${name}: highlighted code block without data-language.`);
    }
  }
}

/* Redirects ---------------------------------------------------------------- */

for (const [from, to] of Object.entries(redirects)) {
  const page = join(out, from.endsWith('/') ? `${from}index.html` : from);
  if (!(await exists(page))) {
    fail(`Redirect page missing: ${from}`);
    continue;
  }
  const html = await readFile(page, 'utf8');
  // A real page may legitimately sit at an old URL (the script never overwrites one).
  if (/http-equiv="refresh"/.test(html) && !html.includes(`content="0;url=${base}${to}"`)) {
    fail(`Redirect ${from} does not point to ${base}${to}.`);
  }
  const target = to.endsWith('/') ? join(out, to, 'index.html') : join(out, to);
  if (!(await exists(target))) fail(`Redirect ${from} points to a missing page: ${to}`);
}

/* Payload (reported, not enforced: the design will change it) --------------- */

let css = 0;
let js = 0;
for (const file of files) {
  if (file.endsWith('.css')) css += (await stat(file)).size;
  if (file.endsWith('.js')) js += (await stat(file)).size;
}

/* Report ------------------------------------------------------------------- */

if (failures.length) {
  console.error(`Verification failed with ${failures.length} problem(s):`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}

console.log(
  `Verified ${published.length} posts, ${pages.length} pages, ${codeBlocks} code blocks, ` +
    `${Object.keys(redirects).length} redirects, ${sitemapUrls.length} sitemap URLs ` +
    `(CSS ${(css / 1024).toFixed(1)} KB, JS ${(js / 1024).toFixed(1)} KB on disk).`
);
