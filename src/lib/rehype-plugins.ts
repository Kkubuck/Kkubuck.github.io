/**
 * Small rehype plugins for post bodies. Each one ports a behaviour of the old
 * Astro site so the HTML stays the same:
 *
 * - rehypeFigure: a paragraph holding a single image becomes <figure>; the
 *   Markdown title becomes <figcaption>.
 * - rehypeHeadingIds: github-slugger ids (what Astro used), headings collected
 *   for the table of contents.
 * - rehypeLinks: external links open in a new tab; root-relative links and
 *   images get the base path.
 * - rehypeBlockWrappers: code blocks get a toolbar (language + copy button),
 *   tables get a horizontal scroller that keyboard users can focus and scroll
 *   (role=region, labelled by the table's number and the section it sits in).
 * - rehypeKeepParens: words with a parenthesis or quotation mark are kept on one line
 *   (<span class="nobr">), also across an inline element ("<strong>에포크</strong>(epoch)라고").
 * - rehypeImageSizes (in markdown.ts, it reads files): width/height from the image file,
 *   so a lazy image reserves its box before it loads.
 */
import GithubSlugger from 'github-slugger';
import { estimateEm, splitGlue } from './glue';
import { toString } from 'hast-util-to-string';
import { SKIP, visit } from 'unist-util-visit';
import type { Element, ElementContent, Root } from 'hast';
import type { VFile } from 'vfile';

export interface Heading {
  depth: 2 | 3;
  id: string;
  text: string;
}

declare module 'vfile' {
  interface DataMap {
    headings: Heading[];
  }
}

const isBlankText = (node: ElementContent) => node.type === 'text' && !node.value.trim();

export function rehypeFigure() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const content = node.children.filter((child) => !isBlankText(child));
      const image = content[0];
      if (content.length !== 1 || !image || image.type !== 'element' || image.tagName !== 'img') return;

      const { title, ...rest } = image.properties;
      const children: ElementContent[] = [
        { type: 'element', tagName: 'img', properties: { ...rest, loading: 'lazy', decoding: 'async' }, children: [] }
      ];
      if (title) {
        children.push({
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: String(title) }]
        });
      }
      parent.children[index] = { type: 'element', tagName: 'figure', properties: {}, children };
      return SKIP;
    });
  };
}

export function rehypeHeadingIds() {
  return (tree: Root, file: VFile) => {
    const slugger = new GithubSlugger();
    const headings: Heading[] = [];
    visit(tree, 'element', (node) => {
      const match = /^h([1-6])$/.exec(node.tagName);
      if (!match) return;
      const text = toString(node);
      const existing = node.properties.id;
      const id = typeof existing === 'string' ? existing : slugger.slug(text);
      node.properties.id = id;
      const depth = Number(match[1]);
      if (depth === 2 || depth === 3) headings.push({ depth, id, text });
    });
    file.data.headings = headings;
  };
}

export interface LinkOptions {
  /** "" or "/repo-name" */
  basePath: string;
  /** Links to this origin are internal, e.g. "https://kkubuck.github.io". */
  siteOrigin: string;
}

export function rehypeLinks({ basePath, siteOrigin }: LinkOptions) {
  const prefix = (url: string) =>
    basePath && url.startsWith('/') && !url.startsWith('//') && !url.startsWith(`${basePath}/`) ? `${basePath}${url}` : url;

  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && typeof node.properties.src === 'string') {
        node.properties.src = prefix(node.properties.src);
        return;
      }
      if (node.tagName !== 'a' || typeof node.properties.href !== 'string') return;
      const href = node.properties.href;
      if (href.startsWith('/') && !href.startsWith('//')) {
        node.properties.href = prefix(href);
        return;
      }
      let url: URL;
      try {
        url = new URL(href, `${siteOrigin}/`);
      } catch {
        return; // leave malformed links untouched
      }
      if ((url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== siteOrigin) {
        node.properties.target = '_blank';
        node.properties.rel = ['noopener', 'noreferrer'];
      }
    });
  };
}

const LANGUAGE_NAMES: Record<string, string> = {
  python: 'Python',
  py: 'Python',
  cpp: 'C++',
  c: 'C',
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  json: 'JSON',
  yaml: 'YAML',
  text: 'Text',
  txt: 'Text',
  plaintext: 'Text'
};

export function languageName(language: string): string {
  return LANGUAGE_NAMES[language] ?? language;
}

/** Shiki writes `class` as a string; remark-rehype writes `className` as an array. */
const hasClass = (node: Element, name: string) => {
  const value = node.properties.className ?? node.properties.class;
  const list = Array.isArray(value) ? value.map(String) : typeof value === 'string' ? value.split(/\s+/) : [];
  return list.includes(name);
};

/** Columns whose every cell is at most this many characters never wrap. */
const SHORT_CELL = 14;

/**
 * Marks short columns (labels such as "F-measure", "학습·테스트", "CHAMELEON") with
 * class="nowrap", so a long neighbouring column cannot squeeze them into breaking
 * at a hyphen or a middle dot. Long columns still wrap; the scroller takes overflow.
 */
function markShortColumns(table: Element) {
  const rows: Element[] = [];
  visit(table, 'element', (node) => {
    if (node.tagName === 'tr') rows.push(node);
  });
  const cellsOf = (row: Element) =>
    row.children.filter((cell): cell is Element => cell.type === 'element' && (cell.tagName === 'td' || cell.tagName === 'th'));
  const longest: number[] = [];
  for (const row of rows) {
    cellsOf(row).forEach((cell, column) => {
      longest[column] = Math.max(longest[column] ?? 0, [...toString(cell).trim()].length);
    });
  }
  for (const row of rows) {
    cellsOf(row).forEach((cell, column) => {
      if ((longest[column] ?? Infinity) <= SHORT_CELL) cell.properties.className = ['nowrap'];
    });
  }
}

export function rehypeBlockWrappers() {
  return (tree: Root) => {
    let section = '';
    let tables = 0;
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.tagName === 'h2' || node.tagName === 'h3') section = toString(node).trim();

      if (node.tagName === 'pre' && hasClass(node, 'shiki')) {
        const language = String(node.properties.dataLanguage ?? '');
        const bar: Element = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['code-block__bar'] },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['code-block__lang'] },
              children: [{ type: 'text', value: languageName(language) }]
            },
            // Shown by the CodeCopy client component when the Clipboard API exists.
            {
              type: 'element',
              tagName: 'button',
              properties: { type: 'button', className: ['code-block__copy'], dataCodeCopy: true, hidden: true },
              children: [{ type: 'text', value: '복사' }]
            }
          ]
        };
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['code-block'] },
          children: [bar, node]
        };
        return [SKIP, index + 1];
      }

      if (node.tagName === 'table') {
        markShortColumns(node);
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['table-scroll'],
            tabIndex: 0,
            role: 'region',
            ariaLabel: `표 ${(tables += 1)}${section ? `: ${section}` : ''}`
          },
          children: [node]
        };
        return [SKIP, index + 1];
      }
      return undefined;
    });
  };
}

/* -------------------------------------------------------------- keep parens */

/** Never touched: code, and anything that is not running text. */
const NO_GLUE = new Set(['pre', 'code', 'kbd', 'samp', 'script', 'style', 'svg', 'math', 'textarea']);
/** Inline elements a kept word may run into ("<strong>에포크</strong>(epoch)라고"). */
const INLINE = new Set(['a', 'strong', 'b', 'em', 'i', 'del', 's', 'mark', 'sup', 'sub', 'abbr', 'span', 'code']);
/** Width cap for a kept word in post bodies (17px type in a 358px phone column ≈ 21em). */
const MAX_EM = 16;

const nobr = (children: ElementContent[]): Element => ({
  type: 'element',
  tagName: 'span',
  properties: { className: ['nobr'] },
  children
});
const isInline = (node: ElementContent | undefined): node is Element =>
  node?.type === 'element' && INLINE.has(node.tagName);
/**
 * An element that may join a kept run: one word, or inline code ("절반(`start = mid + 1`)"
 * reads as one token). Emphasis with spaces stays out: its words may wrap, and WebKit
 * lets a kept run of several bold words overflow the line by a few pixels.
 */
const oneWord = (node: Element, text: string) => node.tagName === 'code' || !/\s/u.test(text);

/**
 * Wraps each word that holds a parenthesis or a quotation mark in <span class="nobr">
 * (src/lib/glue.ts). Within one text node a word starts and ends at whitespace or at an
 * element boundary, so the visible text is unchanged. A word glued to a neighbouring
 * inline element (no space between) takes that element into its span when the whole
 * still fits, so "<strong>에포크</strong>(epoch)라고" and "분할(<em>OVCOS</em>)를" stay whole.
 */
export function rehypeKeepParens() {
  const walk = (node: Element | Root) => {
    for (const child of node.children) {
      if (child.type === 'element' && !NO_GLUE.has(child.tagName)) walk(child);
    }
    const input = node.children as ElementContent[];
    if (!input.some((child) => child.type === 'text' && splitGlue(child.value, MAX_EM).some((part) => part.glue))) return;

    const out: ElementContent[] = [];
    for (let i = 0; i < input.length; i += 1) {
      const child = input[i]!;
      if (child.type !== 'text') {
        out.push(child);
        continue;
      }
      const parts = splitGlue(child.value, MAX_EM);
      parts.forEach((part, index) => {
        if (!part.glue) {
          out.push({ type: 'text', value: part.text });
          return;
        }
        const span = nobr([{ type: 'text', value: part.text }]);
        let width = estimateEm(part.text);
        // Glued to a one-word element before it: take it in.
        const before = out.at(-1);
        if (index === 0 && isInline(before)) {
          const text = toString(before);
          if (text && oneWord(before, text) && width + estimateEm(text) <= MAX_EM) {
            out.pop();
            span.children.unshift(before);
            width += estimateEm(text);
          }
        }
        // Glued to the element after it ("분할(" + <em>OVCOS</em> + ")를"): take it in, with
        // the start of the text after it up to the next space.
        const after = input[i + 1];
        if (index === parts.length - 1 && isInline(after)) {
          const text = toString(after);
          const next = input[i + 2];
          const lead = next?.type === 'text' ? (/^\S+/u.exec(next.value)?.[0] ?? '') : '';
          if (text && oneWord(after, text) && width + estimateEm(text + lead) <= MAX_EM) {
            span.children.push(after);
            i += 1;
            if (lead && next?.type === 'text') {
              span.children.push({ type: 'text', value: lead });
              next.value = next.value.slice(lead.length);
            }
          }
        }
        out.push(span);
      });
    }
    node.children = out.filter((child) => child.type !== 'text' || child.value !== '') as typeof node.children;
  };
  return (tree: Root) => walk(tree);
}

/* ------------------------------------------------------------- image sizes */

export interface ImageSizeOptions {
  /** Size of a root-relative image ("/assets/…"), or null when unknown. */
  sizeOf: (src: string) => { width: number; height: number } | null;
  /** The first image this close to the top (top-level blocks) loads eagerly with high priority. */
  eagerWithin?: number;
}

/**
 * width/height attributes on every image whose file size is known (the CSS keeps
 * them responsive with max-width and height: auto), so a lazy image reserves its box
 * before it loads. The first figure, when it sits in the first few blocks, is likely the
 * LCP element: it loads eagerly with fetchpriority=high instead of lazily.
 */
export function rehypeImageSizes({ sizeOf, eagerWithin = 4 }: ImageSizeOptions) {
  return (tree: Root) => {
    let first = true;
    const blocks = tree.children.filter((child) => child.type === 'element');
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img' || typeof node.properties.src !== 'string') return;
      const size = node.properties.src.startsWith('/') ? sizeOf(node.properties.src) : null;
      if (size && node.properties.width === undefined && node.properties.height === undefined) {
        node.properties.width = size.width;
        node.properties.height = size.height;
      }
      if (first) {
        first = false;
        const top = blocks.findIndex((block) => block === node || (block.type === 'element' && contains(block, node)));
        if (top >= 0 && top < eagerWithin) {
          node.properties.loading = 'eager';
          node.properties.fetchPriority = 'high';
        }
      }
    });
  };
}

function contains(parent: Element, target: Element): boolean {
  let found = false;
  visit(parent, 'element', (node) => {
    if (node === target) {
      found = true;
      return false;
    }
    return undefined;
  });
  return found;
}
