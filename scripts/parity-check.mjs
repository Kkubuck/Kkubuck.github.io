/**
 * Compares this build (out/) with the old Astro build (dist/).
 *
 *   node scripts/parity-check.mjs <old-dist> [new-out]
 *   OLD_DIST=../Kkubuck.github.io-main/dist npm run parity
 *
 * Not part of `npm run verify`: it needs the old build on disk. (URLs the live
 * site served beyond that build are checked by verify, from src/data/live-urls.txt.)
 * It checks that
 * - every file the old site published exists here (pages, redirect stubs, assets),
 *   a real page is still a real page, a redirect still goes to the same place;
 * - every post renders the same body: heading ids, counts of code blocks,
 *   tables, figures, images, blockquotes, links, lists, ... and the same text;
 * - post chrome (title, date, reading time, paper card, takeaways, tags, series,
 *   prev/next, table of contents) and head tags match;
 * - list pages show the same posts in the same order;
 * - search.json, RSS, the sitemap URL set, the web manifest and robots.txt match.
 *
 * Differences made on purpose are listed in INTENTIONAL and CORRECTIONS and
 * reported apart. Exit code 1 when anything else differs.
 */
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const oldDist = resolve(process.argv[2] || process.env.OLD_DIST || '');
const newOut = resolve(process.argv[3] || join(root, 'out'));

if (!process.argv[2] && !process.env.OLD_DIST) {
  console.error('Usage: node scripts/parity-check.mjs <old-dist> [new-out]');
  process.exit(2);
}

/* Helpers ------------------------------------------------------------------ */

/** @type {string[]} */
const differences = [];
/** @type {string[]} */
const intentional = [];
/**
 * @param {string} where
 * @param {string} message
 */
const differ = (where, message) => differences.push(`${where}: ${message}`);

/** Known, deliberate changes. Each entry: [path, what, why]. */
const INTENTIONAL = [
  ['index.html', 'intro', 'Home page intro copy removed at the owner’s request (wordmark only).'],
  ['index.html', 'title', 'Home <title> is the wordmark "Kkubuck Blog" instead of a tagline.'],
  ['404.html', 'canonical', 'No canonical URL on the noindex 404 page.'],
  ['rss.xml', 'guid', 'Items keep the guid the live feed gave them (/notes/…, /papers/…), not the dist build’s /posts/ URL.'],
  // Path '*': applies to every list page. The data behind these is still compared field by field (section 3).
  ['*', 'year count', 'Year headings count posts as “34편” (the number itself is still compared).'],
  [
    '*',
    'list rows',
    'List rows show the date as MM.DD under its year heading (the full date in flat lists) and one secondary label ' +
      '(venue › series › category, hidden when it repeats the page’s category) instead of date, category, venue and ' +
      'reading time; display titles use U+2011 inside hyphenated words. Title, description, date and link are still compared.'
  ],
  [
    '*',
    'series short label',
    'A series label in a list row uses the series’ short name as <abbr title="full name"> (it must fit the narrow right column); ' +
      'the title is checked against the series names.'
  ],
  [
    '*',
    'page header count',
    'The tags index and series pages show their count beside the title ("40", "7편") instead of a sentence ' +
      '("40개의 태그로 글을 모아 봅니다."); the title and the number are still compared.'
  ],
  [
    'search.json',
    'excerpt',
    'The body excerpt drops Markdown marks instead of turning them into spaces ("SAM-DSA", "깊이 영상을"); ' +
      'every other field is compared exactly, and the excerpt’s words are compared without marks and spaces.'
  ],
  [
    'about/index.html',
    'display titles',
    'Publication titles on the about page are display titles: U+2011 inside hyphenated words (compared as "-").'
  ]
];
// Post pages: display titles (h1, paper card, series box, pager) use U+2011 inside hyphenated
// words and compare as "-"; the eyebrow's venue label is compared with the old paper card (section 2).
/**
 * @param {string} path
 * @param {string} what
 * @param {string} fallback
 */
function note(path, what, fallback) {
  const known = INTENTIONAL.find(([p, w]) => (p === path || p === '*') && w === what);
  if (known) intentional.push(`${known[0] === '*' ? 'list pages' : path}: ${known[2]}`);
  else differ(path, fallback);
}

/**
 * Bugs fixed on purpose, so the new output differs from the old build there.
 * Before comparing, every old file is patched with these (in raw, &quot;-,
 * &#39;- and JSON-escaped spellings), so the fixed spots compare equal and
 * nothing else may differ. A correction that no longer matches anything in
 * the old build is reported, so this list cannot go stale.
 *
 * @type {{ file?: string, from: string, to: string, why: string }[]}
 */
const CORRECTIONS = [
  {
    file: 'posts/hongong-ml-logistic-regression/index.html',
    from: 'a<del>e는',
    to: 'a~e는',
    why: 'Single tildes ("a~e", "0~1") no longer make a strikethrough (remark-gfm singleTilde: false).'
  },
  {
    file: 'posts/hongong-ml-logistic-regression/index.html',
    from: '쓰려면 0</del>1',
    to: '쓰려면 0~1',
    why: 'Single tildes ("a~e", "0~1") no longer make a strikethrough (remark-gfm singleTilde: false).'
  },
  ...[
    ['posts/hat-activating-more-pixels-cvpr2023/index.html', '썼는가</strong>“를', '썼는가</strong>”를'],
    ['posts/noisy-pseudo-label-cod-eccv2024/index.html', '(박스)“와', '(박스)”와'],
    ['posts/noisy-pseudo-label-cod-eccv2024/index.html', '(20%)“로', '(20%)”로'],
    ['posts/rank-camouflaged-objects-cvpr2021/index.html', '난이도인가?“라는', '난이도인가?”라는'],
    ['posts/source-free-depth-pop-out-iccv2023/index.html', '있다</strong>“는', '있다</strong>”는']
  ].map(([file, from, to]) => ({
    file,
    from: String(from),
    to: String(to),
    why: 'A closing " between punctuation and a Korean particle ("**강조**"를) renders ” instead of “.'
  })),
  ...[
    ['"튀어나와"', '“튀어나와”'],
    ['"두 번 보기"', '“두 번 보기”'],
    ['"얼마나 잘 숨었는가(위장 정도)"', '“얼마나 잘 숨었는가(위장 정도)”'],
    ["Yu'ang", 'Yu’ang']
  ].map(([from, to]) => ({
    from: String(from),
    to: String(to),
    why: 'Front matter (titles, descriptions, takeaways, paper card) gets the same smart punctuation as the body.'
  })),
  {
    from: '컴퓨터 비전 논문 리뷰와 공부 기록. 위장 객체 탐지, 개방 어휘 분할, 원격 탐사 논문을 주로 읽습니다.',
    to: '컴퓨터 비전 논문 리뷰와 공부 기록',
    why: 'Site description (home/404 meta, RSS channel) is the og card’s line, without the intro sentence the owner dropped.'
  }
];
const correctionHits = CORRECTIONS.map(() => 0);

/**
 * Brand files redrawn on purpose: the old blue (#2d63e2) tile and white og card became
 * ink on paper (FINAL_SPEC: no blue accent anywhere). They must still exist at the same
 * path and, for images, keep their pixel size; SVGs must stay SVG.
 */
const REDRAWN = new Set(['favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'og-card.png', 'og-card.svg']);
const REDRAWN_WHY = 'Brand icons and the og card are redrawn in ink on paper (#16161a / #f5f5f2) instead of the old blue tile.';
/** The web manifest's colours follow the paper colour of the redesign. */
const MANIFEST_COLOURS = { background_color: '#f5f5f2', theme_color: '#f5f5f2' };

/**
 * PNG pixel size from the IHDR chunk.
 * @param {Buffer} buffer
 */
const pngSize = (buffer) => (buffer.readUInt32BE(0) === 0x89504e47 ? `${buffer.readUInt32BE(16)}x${buffer.readUInt32BE(20)}` : null);

/**
 * The spellings a string can have in HTML text, attributes, JSON and XML.
 * @param {string} value
 */
const spellings = (value) => [
  ...new Set([
    value,
    value.replaceAll('"', '&quot;').replaceAll("'", '&#39;'),
    value.replaceAll('"', '&#34;').replaceAll("'", '&#x27;'),
    value.replaceAll("'", '&apos;'),
    value.replaceAll('"', '\\"')
  ])
];

/**
 * An old file's text with CORRECTIONS applied.
 * @param {string} file path relative to the old build
 */
async function readOld(file) {
  let content = await readFile(join(oldDist, file), 'utf8');
  CORRECTIONS.forEach((correction, index) => {
    if (correction.file && correction.file !== file.split(sep).join('/')) return;
    for (const spelling of spellings(correction.from)) {
      const parts = content.split(spelling);
      if (parts.length === 1) continue;
      correctionHits[index] = (correctionHits[index] ?? 0) + parts.length - 1;
      content = parts.join(correction.to);
    }
  });
  return content;
}

/** @param {string} file path relative to the new build */
const readNew = (file) => readFile(join(newOut, file), 'utf8');

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

/** @param {string} value */
const decode = (value) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

/**
 * Drops the <span class="nobr"> wrappers that keep a word with a parenthesis on one line
 * (src/lib/glue.ts): typography that adds no text, and may start or end inside a word
 * ("<span class="nobr">만들고(Clustering-</span>then-"), where every other tag reads as a space.
 * Matching </span> tags are found with a stack, so other spans are untouched.
 * @param {string} html
 */
function unwrapNobr(html) {
  if (!html.includes('class="nobr"')) return html;
  /** @type {boolean[]} */
  const stack = [];
  return html.replace(/<span\b[^>]*>|<\/span>/g, (tag) => {
    if (tag === '</span>') return stack.pop() ? '' : tag;
    const nobr = /\sclass="nobr"/.test(tag);
    stack.push(nobr);
    return nobr ? '' : tag;
  });
}

/**
 * Visible text: no comments, scripts, code toolbars or tags; whitespace collapsed.
 * @param {string} [html]
 */
const text = (html = '') =>
  decode(
    unwrapNobr(html)
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<div class="code-block__bar">[\s\S]*?<\/div>/g, '')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Inner HTML of the first element whose opening tag contains `marker`, matching nested tags of its name.
 * @param {string} html
 * @param {string} marker
 * @returns {string | null}
 */
function inner(html, marker) {
  const at = html.indexOf(marker);
  if (at < 0) return null;
  const start = html.lastIndexOf('<', at);
  const name = /^<([a-z0-9]+)/i.exec(html.slice(start))?.[1];
  if (!name) return null;
  const openEnd = html.indexOf('>', at) + 1;
  const pattern = new RegExp(`<${name}\\b|</${name}>`, 'gi');
  pattern.lastIndex = start;
  let depth = 0;
  for (let match = pattern.exec(html); match; match = pattern.exec(html)) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return html.slice(openEnd, match.index);
  }
  return null;
}

/**
 * @param {string} html
 * @param {string} attr
 */
const attrs = (html, attr) => [...html.matchAll(new RegExp(`\\s${attr}="([^"]*)"`, 'g'))].map((match) => decode(match[1] ?? ''));
/**
 * @param {string} html
 * @param {string} tag
 */
const count = (html, tag) => (html.match(new RegExp(`<${tag}\\b`, 'g')) ?? []).length;
/**
 * @param {string} html
 * @param {RegExp} pattern
 */
const head = (html, pattern) => {
  const value = html.match(pattern)?.[1];
  return value === undefined ? undefined : decode(value);
};
/**
 * @param {string} html
 * @param {string} key
 */
const meta = (html, key) =>
  head(html, new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`)) ??
  head(html, new RegExp(`<meta content="([^"]*)" (?:name|property)="${key}"`));

/**
 * @param {string} where
 * @param {string} label
 * @param {unknown} a
 * @param {unknown} b
 */
function same(where, label, a, b) {
  const left = JSON.stringify(a) ?? 'undefined';
  const right = JSON.stringify(b) ?? 'undefined';
  if (left === right) return true;
  let at = 0;
  while (at < left.length && left[at] === right[at]) at += 1;
  differ(where, `${label} differs\n      old: …${left.slice(Math.max(0, at - 60), at + 80)}\n      new: …${right.slice(Math.max(0, at - 60), at + 80)}`);
  return false;
}

/** @param {string} html */
const isRedirect = (html) => /<meta http-equiv="refresh" content="0;url=([^"]*)"/.exec(html)?.[1];
/** @param {Buffer} buffer */
const sha = (buffer) => createHash('sha256').update(buffer).digest('hex');

/**
 * A web manifest with its URLs resolved against where it is served, so
 * "/icon-192.png" and "icon-192.png" compare equal.
 * @param {string} json
 */
function manifestModel(json) {
  const manifestUrl = 'https://site.invalid/site.webmanifest';
  const manifest = JSON.parse(json);
  /** @param {unknown} value */
  const absolute = (value) => (typeof value === 'string' ? new URL(value, manifestUrl).href : value);
  const model = {
    ...manifest,
    start_url: absolute(manifest.start_url ?? '.'),
    scope: absolute(manifest.scope ?? '.'),
    icons: (manifest.icons ?? []).map((/** @type {{ src: string }} */ icon) => ({ ...icon, src: absolute(icon.src) }))
  };
  return Object.fromEntries(Object.entries(model).sort(([a], [b]) => a.localeCompare(b)));
}

/* 1. Every old file exists ------------------------------------------------ */

const oldFiles = (await walk(oldDist)).map((file) => relative(oldDist, file));
let pagesChecked = 0;
let redirectsChecked = 0;
let assetsChecked = 0;
const oldIndexPages = oldFiles.filter((file) => file.endsWith('index.html'));

for (const file of oldFiles.sort()) {
  if (file.startsWith(`_assets${sep}`)) continue; // Astro's hashed CSS/JS/fonts
  const newPath = join(newOut, file);
  if (!(await exists(newPath))) {
    note(file, 'file', 'missing in the new build');
    continue;
  }
  if (file.endsWith('.html')) {
    const [before, after] = await Promise.all([readOld(file), readNew(file)]);
    const oldTarget = isRedirect(before);
    const newTarget = isRedirect(after);
    if (oldTarget !== undefined || newTarget !== undefined) {
      redirectsChecked += 1;
      if (oldTarget !== newTarget) differ(file, `redirect target ${oldTarget ?? '(real page)'} → ${newTarget ?? '(real page)'}`);
    } else {
      pagesChecked += 1;
    }
  } else if (file.endsWith('.webmanifest')) {
    assetsChecked += 1;
    const before = manifestModel(await readOld(file));
    const after = manifestModel(await readNew(file));
    const colours = Object.entries(MANIFEST_COLOURS).every(([key, value]) => after[key] === value);
    if (!colours) differ(file, `manifest colours are not the paper colour ${JSON.stringify(MANIFEST_COLOURS)}`);
    else if (Object.keys(MANIFEST_COLOURS).some((key) => before[key] !== after[key])) {
      intentional.push(`${file}: background_color and theme_color follow the paper colour (#f5f5f2); every other field is compared.`);
    }
    same(file, 'manifest', { ...before, ...MANIFEST_COLOURS }, after);
  } else if (!/\.(xml|json|txt)$/.test(file)) {
    assetsChecked += 1;
    const [before, after] = await Promise.all([readFile(join(oldDist, file)), readFile(newPath)]);
    if (sha(before) === sha(after)) continue;
    const name = file.split(sep).join('/');
    const base = name.split('/').pop() ?? '';
    if (REDRAWN.has(base) && (name === base || name === `assets/img/${base}`)) {
      if (base.endsWith('.svg') && !after.toString('utf8').trimStart().startsWith('<svg')) differ(file, 'redrawn SVG is not an SVG');
      else if (base.endsWith('.png') && pngSize(before) !== pngSize(after)) differ(file, `redrawn PNG is ${pngSize(after)}, was ${pngSize(before)}`);
      else intentional.push(`${file}: ${REDRAWN_WHY}`);
    } else differ(file, 'asset bytes differ');
  }
}

/* 2. Posts ----------------------------------------------------------------- */

const COUNTED = ['pre', 'table', 'figure', 'figcaption', 'img', 'blockquote', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'p', 'strong', 'em', 'code', 'hr', 'del', 'th', 'td', 'br'];
/** @type {Record<string, number>} */
const totals = Object.fromEntries(COUNTED.map((tag) => [tag, 0]));
const postFiles = oldIndexPages.filter((file) => file.startsWith(`posts${sep}`));
let postsIdentical = 0;

/**
 * Display titles (post h1, paper-card title, series and pager titles) use U+2011
 * NON-BREAKING HYPHEN inside hyphenated words; that is typography, so it compares as "-".
 * @param {string} [html]
 */
const displayText = (html) => text(html).replaceAll('\u2011', '-');

/**
 * The eyebrow's venue label (redesign: category · series · venue). Old pages had no
 * such label; the venue is checked against the paper card's 발표 row instead.
 * @param {string} eyebrow
 */
const venueLabel = (eyebrow) => {
  const match = /<span class="post-header__venue">([\s\S]*?)<\/span>/.exec(eyebrow);
  return match ? text(match[1]) : null;
};
/** @param {string | null} paper */
const paperVenue = (paper) => {
  const match = paper && /<dt>발표<\/dt><dd\b[^>]*>([\s\S]*?)<\/dd>/.exec(paper);
  return match ? text(match[1]) : null;
};

/**
 * Everything a reader sees on a post page, as comparable data.
 * @param {string} html
 */
function postModel(html) {
  const prose = inner(html, 'class="prose"') ?? '';
  const header = inner(html, 'class="post-header"') ?? '';
  const paper = inner(html, 'class="paper-card"');
  const takeaways = inner(html, 'class="takeaways"');
  const tags = inner(html, 'class="post-tags"');
  const series = inner(html, 'class="series-box"');
  const pager = inner(html, 'class="pager"') ?? '';
  const toc = inner(html, 'class="toc"');
  const eyebrow = inner(header, 'class="post-header__eyebrow"') ?? '';
  return {
    head: {
      title: head(html, /<title>([^<]*)<\/title>/),
      description: meta(html, 'description'),
      canonical: head(html, /<link rel="canonical" href="([^"]*)"/),
      ogTitle: meta(html, 'og:title'),
      ogType: meta(html, 'og:type'),
      published: meta(html, 'article:published_time')
    },
    header: {
      eyebrow: attrs(eyebrow, 'href'),
      eyebrowText: text(eyebrow.replace(/<span class="post-header__venue">[\s\S]*?<\/span>/, '')),
      title: displayText(inner(header, 'class="post-header__title"') ?? ''),
      description: text(inner(header, 'class="post-header__desc"') ?? ''),
      meta: text(inner(header, 'class="post-header__meta"') ?? ''),
      datetime: /** @type {string[] | undefined} */ (attrs(header, 'datetime').concat(attrs(header, 'dateTime'))),
      origin: attrs(inner(header, 'class="post-header__meta"') ?? '', 'href')
    },
    venue: venueLabel(eyebrow),
    paperVenue: paperVenue(paper),
    paper: paper === null ? null : { text: displayText(paper.replace(/<svg[\s\S]*?<\/svg>/g, '')), links: attrs(paper, 'href') },
    takeaways: takeaways === null ? null : [...takeaways.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => text(match[1])),
    tags: tags === null ? null : { hrefs: attrs(tags, 'href'), text: text(tags) },
    series: series === null ? null : { hrefs: attrs(series, 'href'), text: displayText(series) },
    pager: { hrefs: attrs(pager, 'href'), text: displayText(pager) },
    toc: toc === null ? null : { hrefs: attrs(toc, 'href'), text: text(toc) },
    prose
  };
}

/**
 * Code blocks as their plain text: syntax-highlight spans are styling, and where one
 * token ends and the next begins depends on the palette (Shiki merges neighbouring
 * tokens of the same colour). Dropping the tags without a space compares the code
 * character for character.
 * @param {string} prose
 */
const plainCode = (prose) =>
  prose.replace(/(<pre\b[^>]*>)([\s\S]*?)(<\/pre>)/g, (_, open, body, close) => open + body.replace(/<[^>]+>/g, '') + close);

/** @param {string} prose */
const languages = (prose) => [...prose.matchAll(/<pre\b[^>]*\sdata-language="([^"]*)"/g)].map((match) => match[1]);

for (const file of postFiles.sort()) {
  const where = file.replace(`${sep}index.html`, '/');
  if (!(await exists(join(newOut, file)))) continue; // reported above
  const before = postModel(await readOld(file));
  const after = postModel(await readNew(file));
  const start = differences.length;

  same(where, 'heading ids', attrs(before.prose, 'id'), attrs(after.prose, 'id'));
  const oldCounts = Object.fromEntries(COUNTED.map((tag) => [tag, count(before.prose, tag)]));
  const newCounts = Object.fromEntries(COUNTED.map((tag) => [tag, count(after.prose, tag)]));
  same(where, 'element counts', oldCounts, newCounts);
  for (const tag of COUNTED) totals[tag] = (totals[tag] ?? 0) + (newCounts[tag] ?? 0);
  same(where, 'image sources', attrs(before.prose, 'src'), attrs(after.prose, 'src'));
  same(where, 'link targets', attrs(before.prose, 'href'), attrs(after.prose, 'href'));
  same(where, 'code languages', languages(before.prose), languages(after.prose));
  same(where, 'body text', text(plainCode(before.prose)), text(plainCode(after.prose)));
  same(where, 'head', before.head, after.head);
  same(where, 'header', { ...before.header, datetime: undefined }, { ...after.header, datetime: undefined });
  same(where, 'datetime', before.header.datetime, after.header.datetime);
  // The eyebrow now names the venue of a paper review; it must be the paper card's venue.
  if (same(where, 'eyebrow venue', before.paperVenue, after.venue) && after.venue)
    intentional.push('posts: The eyebrow adds the paper’s venue (category · series · venue); it is checked against the old paper card.');
  same(where, 'paper card', before.paper, after.paper);
  same(where, 'takeaways', before.takeaways, after.takeaways);
  same(where, 'tags', before.tags, after.tags);
  same(where, 'series box', before.series, after.series);
  same(where, 'prev/next', before.pager, after.pager);
  same(where, 'table of contents', before.toc, after.toc);
  if (differences.length === start) postsIdentical += 1;
}

/* 3. List pages ------------------------------------------------------------ */

/**
 * One list row as data. Display titles may use U+2011 (non-breaking hyphen) inside
 * hyphenated words; that is typography, so it compares as "-".
 * @param {string} li
 */
function rowModel(li) {
  const meta = inner(li, 'class="post-item__meta"') ?? '';
  const abbr = /<abbr\b[^>]*\stitle="([^"]*)"/.exec(meta)?.[1];
  return {
    title: text(inner(li, 'class="post-item__title"') ?? '').replaceAll('\u2011', '-'),
    description: text(inner(li, 'class="post-item__desc"') ?? ''),
    datetime: [...attrs(li, 'datetime'), ...attrs(li, 'dateTime')][0],
    meta: [...meta.matchAll(/<(time|span)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((match) => text(match[2])),
    /** A short series name: <abbr title="full series name"> inside the label. */
    abbr: abbr === undefined ? undefined : decode(abbr)
  };
}

/** @param {string} html */
function listModel(html) {
  const main = inner(html, 'id="main"') ?? '';
  return {
    title: /** @type {string | undefined} */ (head(html, /<title>([^<]*)<\/title>/)),
    description: meta(html, 'description'),
    canonical: head(html, /<link rel="canonical" href="([^"]*)"/),
    h1: /** @type {string | undefined} */ (text(inner(main, '<h1') ?? '')),
    pageHeader: /** @type {string | undefined} */ (text(inner(main, 'class="page-header"') ?? '')),
    tabs: text(inner(main, 'class="tabs"') ?? ''),
    tabLinks: attrs(inner(main, 'class="tabs"') ?? '', 'href'),
    years: /** @type {string[] | undefined} */ (
      [...main.matchAll(/<h2 class="post-group__year"[^>]*>([\s\S]*?)<\/h2>/g)].map((match) => text(match[1]))
    ),
    posts: [...main.matchAll(/<a class="post-item__link"[^>]*?\shref="([^"]*)"/g)].map((match) => match[1]),
    items: /** @type {string[] | undefined} */ (
      [...main.matchAll(/<li class="post-item">([\s\S]*?)<\/li>/g)].map((match) => match[1] ?? '')
    ),
    series: attrs(inner(main, 'class="series-list"') ?? '', 'href'),
    seriesText: text(inner(main, 'class="series-list"') ?? '').replaceAll('\u2011', '-'), // display titles
    tagCloud: text(inner(main, 'class="tag-cloud"') ?? ''),
    tagLinks: attrs(inner(main, 'class="tag-cloud"') ?? '', 'href')
  };
}

// Series names, for row labels the old build did not show (section 3).
const seriesLabels = new Set();
for (const entry of await readdir(join(newOut, 'series'), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const page = await readNew(join('series', entry.name, 'index.html'));
  seriesLabels.add(text(inner(page, '<h1') ?? ''));
}

/**
 * Compares the rows of one list page: title, description and date exactly; the
 * redesigned meta line (date format, one label) against what the old row showed.
 * @param {string} where
 * @param {string[]} oldItems
 * @param {string[]} newItems
 */
function compareRows(where, oldItems, newItems) {
  const before = oldItems.map(rowModel);
  const after = newItems.map(rowModel);
  const core = (/** @type {ReturnType<typeof rowModel>} */ { meta: _, abbr: __, ...row }) => row;
  if (!same(where, 'list rows (title, description, date)', before.map(core), after.map(core))) return;
  let changed = false;
  before.forEach((old, index) => {
    const row = after[index];
    if (!row) return;
    const [oldDate = '', ...oldLabels] = old.meta;
    const [newDate = '', ...newLabels] = row.meta;
    if (JSON.stringify(old.meta) !== JSON.stringify(row.meta)) changed = true;
    if (newDate !== oldDate && newDate !== oldDate.slice(5)) differ(where, `row ${index + 1}: date "${newDate}" is not "${oldDate}" or its MM.DD`);
    if (newLabels.length > 1) differ(where, `row ${index + 1}: ${newLabels.length} secondary labels, expected at most one`);
    const label = newLabels[0];
    if (label === undefined) {
      if (!where.startsWith('category/')) differ(where, `row ${index + 1}: no secondary label outside a category page`);
    } else if (row.abbr !== undefined) {
      // A short series name: its full name (the abbr title) must be a series.
      if (seriesLabels.has(row.abbr)) note(where, 'series short label', 'series short label');
      else differ(where, `row ${index + 1}: label "${label}" abbreviates "${row.abbr}", which is not a series`);
    } else if (!oldLabels.includes(label) && !seriesLabels.has(label)) {
      differ(where, `row ${index + 1}: label "${label}" is neither a venue/category the old row showed nor a series`);
    }
  });
  if (changed) note(where, 'list rows', 'list row meta differs');
}

const listFiles = oldIndexPages.filter((file) => /^(index\.html|category|series|tags)/.test(file.split(sep).join('/')));
let listsChecked = 0;
for (const file of listFiles.sort()) {
  if (!(await exists(join(newOut, file)))) continue;
  const oldHtml = await readOld(file);
  if (isRedirect(oldHtml) !== undefined) continue;
  listsChecked += 1;
  const newHtml = await readNew(file);
  const before = listModel(oldHtml);
  const after = listModel(newHtml);
  const where = file.split(sep).join('/');
  if (where === 'index.html') {
    if (before.title !== after.title) note(where, 'title', `title ${before.title} → ${after.title}`);
    if (before.pageHeader !== after.pageHeader || before.h1 !== after.h1) note(where, 'intro', 'intro differs');
    for (const model of [before, after]) {
      model.title = undefined;
      model.h1 = undefined;
      model.pageHeader = undefined;
    }
    const intro = inner(oldHtml, 'class="intro"');
    if (intro && !text(newHtml).includes(text(intro))) note(where, 'intro', 'intro removed');
  }
  // Year headings: the same years and counts; "편" is an intentional unit.
  const oldYears = before.years ?? [];
  const newYears = after.years ?? [];
  if (same(where, 'year headings', oldYears, newYears.map((year) => year.replace(/(\d)편$/, '$1')))) {
    if (JSON.stringify(oldYears) !== JSON.stringify(newYears)) note(where, 'year count', 'year headings differ');
  }
  compareRows(where, before.items ?? [], after.items ?? []);
  for (const model of [before, after]) {
    model.years = undefined;
    model.items = undefined;
  }
  // A count beside the title instead of a sentence: same title, same numbers, ends with the count.
  if (before.pageHeader !== after.pageHeader && before.h1 === after.h1) {
    /** @param {string | undefined} value */
    const numbers = (value) => (value ?? '').match(/\d+/g)?.join(',') ?? '';
    if (numbers(before.pageHeader) === numbers(after.pageHeader) && /\d+편?$/.test(after.pageHeader ?? '') && numbers(after.pageHeader)) {
      note(where, 'page header count', 'page header differs');
      before.pageHeader = after.pageHeader;
    }
  }
  same(where, 'list page', before, after);
}

/* 4. About and 404 --------------------------------------------------------- */

for (const file of ['about/index.html', '404.html']) {
  const [oldHtml, newHtml] = await Promise.all([readOld(file), readNew(file)]);
  /** @param {string} html */
  const body = (html) => inner(html, 'id="main"') ?? '';
  same(file, 'title', head(oldHtml, /<title>([^<]*)<\/title>/), head(newHtml, /<title>([^<]*)<\/title>/));
  same(file, 'description', meta(oldHtml, 'description'), meta(newHtml, 'description'));
  same(file, 'robots', meta(oldHtml, 'robots'), meta(newHtml, 'robots'));
  // Display titles (the about page's publications) use U+2011 inside hyphenated words.
  const bodyText = (/** @type {string} */ html) => text(body(html)).replaceAll('\u2011', '-');
  if (same(file, 'body text', text(body(oldHtml)), bodyText(newHtml)) && text(body(newHtml)).includes('\u2011')) {
    note(file, 'display titles', 'display titles differ');
  }
  same(file, 'body links', attrs(body(oldHtml), 'href'), attrs(body(newHtml), 'href'));
  const oldCanonical = head(oldHtml, /<link rel="canonical" href="([^"]*)"/);
  const newCanonical = head(newHtml, /<link rel="canonical" href="([^"]*)"/);
  if (oldCanonical !== newCanonical) note(file, 'canonical', `canonical ${oldCanonical} → ${newCanonical}`);
}

/* 5. Feeds and indexes ----------------------------------------------------- */

{
  /** @type {Array<Record<string, unknown> & { text: string }>} */
  const before = JSON.parse(await readOld('search.json'));
  /** @type {Array<Record<string, unknown> & { text: string }>} */
  const after = JSON.parse(await readNew('search.json'));
  // Every field but the body excerpt exactly.
  const withoutText = (/** @type {typeof before} */ records) => records.map(({ text: _, ...record }) => record);
  same('search.json', 'records', withoutText(before), withoutText(after));
  // The excerpt: the old one turned every Markdown mark into a space ("SAM DSA", "깊이 영상 을"),
  // the new one drops the marks and keeps hyphens inside words. Without marks and spaces the
  // two must read the same, as far as the shorter one goes (each is cut at 600 characters).
  const squash = (/** @type {string} */ value) => value.replace(/[#*_`>|\-\s]/g, '');
  let cleaner = 0;
  before.forEach((record, index) => {
    const a = squash(record.text);
    const b = squash(after[index]?.text ?? '');
    const n = Math.min(a.length, b.length);
    if (a.slice(0, n) !== b.slice(0, n) || (n === 0 && a.length + b.length > 0)) {
      differ('search.json', `record ${index + 1} (${String(record.url)}): body excerpt has different words`);
    } else if (record.text !== after[index]?.text) cleaner += 1;
  });
  if (cleaner) note('search.json', 'excerpt', 'search excerpts differ');
}

/** @param {string} xml */
function rssModel(xml) {
  const channel = xml.slice(0, xml.indexOf('<item>'));
  /**
   * @param {string} source
   * @param {string} tag
   */
  const field = (source, tag) =>
    [...source.matchAll(new RegExp(`<${tag}(?: [^>]*)?>([^<]*)</${tag}>`, 'g'))].map((match) => decode(match[1] ?? ''));
  return {
    channel: { title: field(channel, 'title'), description: field(channel, 'description'), link: field(channel, 'link'), language: field(channel, 'language') },
    items: [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item = '']) => ({
      title: field(item, 'title'),
      link: field(item, 'link'),
      description: field(item, 'description'),
      pubDate: field(item, 'pubDate'),
      categories: field(item, 'category'),
      author: field(item, 'author')
    })),
    guids: [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item = '']) => field(item, 'guid')[0])
  };
}
const oldFeed = rssModel(await readOld('rss.xml'));
const newFeed = rssModel(await readNew('rss.xml'));
same('rss.xml', 'feed', { ...oldFeed, guids: undefined }, { ...newFeed, guids: undefined });
// The old build's guid was the item link; the new one is the live feed's guid
// (src/data/feed-guids.json) wherever the post existed before the rebuild.
/** @type {Record<string, string>} */
const feedGuids = JSON.parse(await readFile(join(root, 'src/data/feed-guids.json'), 'utf8'));
const expectedGuids = newFeed.items.map(({ link: [link = ''] }) => {
  const url = new URL(link);
  const slug = url.pathname.match(/\/posts\/([^/]+)\/$/)?.[1] ?? '';
  return feedGuids[slug] ? new URL(feedGuids[slug], url).href : link;
});
if (same('rss.xml', 'guids', expectedGuids, newFeed.guids) && JSON.stringify(oldFeed.guids) !== JSON.stringify(newFeed.guids)) {
  note('rss.xml', 'guid', 'guids differ');
}

/** @param {string} xml */
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1] ?? '')).sort();
same('sitemap-0.xml', 'URL set', locs(await readOld('sitemap-0.xml')), locs(await readNew('sitemap-0.xml')));
same('sitemap.xml', 'URL set (same as sitemap-0.xml)', locs(await readNew('sitemap-0.xml')), locs(await readNew('sitemap.xml')));
same('sitemap-index.xml', 'sitemaps', locs(await readOld('sitemap-index.xml')), locs(await readNew('sitemap-index.xml')));
/**
 * Field names are case-insensitive and blank lines only separate groups.
 * @param {string} txt
 */
const directives = (txt) =>
  txt
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [key = '', ...value] = line.split(':');
      return [key.trim().toLowerCase(), value.join(':').trim()];
    });
same('robots.txt', 'directives', directives(await readOld('robots.txt')), directives(await readNew('robots.txt')));

CORRECTIONS.forEach((correction, index) => {
  if (correctionHits[index]) intentional.push(`${correction.file ?? 'all files'}: ${correction.why} (${correction.from} → ${correction.to})`);
  else differ(correction.file ?? 'CORRECTIONS', `correction "${correction.from}" no longer matches the old build`);
});

/* Report ------------------------------------------------------------------- */

const newIndexPages = (await walk(newOut)).filter((file) => file.endsWith('index.html')).length;
console.log(`Old build: ${oldDist}`);
console.log(`New build: ${newOut}`);
console.log(
  `Checked ${oldIndexPages.length} old index.html paths (new build has ${newIndexPages}), ` +
    `${pagesChecked} real pages, ${redirectsChecked} redirect stubs, ${assetsChecked} assets.`
);
console.log(`Posts: ${postsIdentical}/${postFiles.length} identical in body, chrome and head. List pages: ${listsChecked}.`);
console.log(`Post body totals (new): ${COUNTED.filter((tag) => totals[tag]).map((tag) => `${tag} ${totals[tag]}`).join(', ')}.`);
const intentionalLines = [...new Set(intentional)];
if (intentionalLines.length) {
  console.log(`\nIntentional differences (${intentionalLines.length}):`);
  for (const line of intentionalLines) console.log(`  - ${line}`);
}
if (differences.length) {
  console.error(`\nUnexpected differences (${differences.length}):`);
  for (const line of differences) console.error(`  - ${line}`);
  process.exit(1);
}
console.log('\nNo unexpected differences.');
