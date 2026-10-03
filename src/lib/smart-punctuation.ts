/**
 * remark plugin: CommonMark-style smart punctuation.
 *
 * The Astro site rendered Markdown with smart punctuation on (Astro's default),
 * so "인용" became “인용”, `--` an en dash and `...` an ellipsis. This plugin
 * reproduces those rules on the mdast so the text stays identical:
 *
 * - `"` becomes ” when it can close (right-flanking), otherwise “. One
 *   correction for Korean: a `"` between closing punctuation and a letter, as in
 *   `"**강조**"를` or `(박스)"와`, is an opener by the flanking rules alone; when a
 *   `"` is still open in the same scope it closes instead, because particles
 *   attach directly to a closing quote.
 * - `'` becomes ‘ when it opens and a later closer in the same inline scope
 *   matches it, otherwise ’ (so apostrophes stay ’).
 * - `...` → …, runs of `-` (2+) → en/em dashes using the CommonMark split.
 *
 * Flanking follows the CommonMark spec (Unicode whitespace and P/S punctuation),
 * looking at the neighbouring character in the inline content: inside a text
 * node that is the neighbouring value character; at a node edge it is the raw
 * source character next to the node (an emphasis `*`, a code backtick, ...);
 * at the edge of a block it is treated as whitespace. Escaped characters and
 * character references stay literal. Code, inline code, HTML and autolinks are
 * never touched.
 */
import type { Root, Nodes, Parent, Text, Link } from 'mdast';
import type { VFile } from 'vfile';

const WHITESPACE = /^[\s   -   　]$/u;
const PUNCTUATION = /^[\p{P}\p{S}]$/u;
const ASCII_PUNCTUATION = /^[!-/:-@[-`{-~]$/;
const ENTITY = /^&(?:#[0-9]{1,7}|#[xX][0-9a-fA-F]{1,6}|[A-Za-z][A-Za-z0-9]{1,31});/;
/** Containers whose inline content is parsed on its own (one delimiter stack each). */
const BLOCKS = new Set(['paragraph', 'heading', 'tableCell']);

type Char = string | undefined;

const isWhitespace = (char: Char) => char === undefined || WHITESPACE.test(char);
const isPunctuation = (char: Char) => char !== undefined && PUNCTUATION.test(char);
/** Punctuation that ends a phrase: closing brackets and quotes, ?, !, ., %, emphasis `*`/`_`, `~`, a code backtick. */
const CLOSING_PUNCTUATION = /^[\p{Pe}\p{Pf}\p{Po}\p{Pc}~`]$/u;
const endsPhrase = (char: Char) => char !== undefined && char !== '"' && char !== "'" && CLOSING_PUNCTUATION.test(char);

function flanking(before: Char, after: Char) {
  const left = !isWhitespace(after) && (!isPunctuation(after) || isWhitespace(before) || isPunctuation(before));
  const right = !isWhitespace(before) && (!isPunctuation(before) || isWhitespace(after) || isPunctuation(after));
  return { left, right };
}

/** The code point that ends right before `index`. */
function codePointBefore(text: string, index: number): Char {
  if (index <= 0) return undefined;
  const low = text.charCodeAt(index - 1);
  if (low >= 0xdc00 && low <= 0xdfff && index >= 2) return text.slice(index - 2, index);
  return text[index - 1];
}

/** The code point that starts at `index`. */
function codePointAt(text: string, index: number): Char {
  if (index >= text.length) return undefined;
  const point = text.codePointAt(index);
  return point === undefined ? undefined : String.fromCodePoint(point);
}

/**
 * Marks value characters that came from a backslash escape or a character
 * reference. Those are literal text in CommonMark and never become smart.
 */
function literalMask(value: string, raw: string): boolean[] {
  const literal = new Array<boolean>(value.length).fill(false);
  if (raw === value) return literal;
  let r = 0;
  for (let v = 0; v < value.length; v++) {
    while (r < raw.length) {
      const char = raw[r]!;
      if (char === '\\' && r + 1 < raw.length && ASCII_PUNCTUATION.test(raw[r + 1]!)) {
        const escaped = raw[r + 1];
        r += 2;
        if (escaped === value[v]) {
          literal[v] = true;
          break;
        }
        continue;
      }
      if (char === '&') {
        const entity = ENTITY.exec(raw.slice(r, r + 40))?.[0];
        if (entity && (value[v] !== '&' || entity.toLowerCase() === '&amp;')) {
          literal[v] = true;
          r += entity.length;
          break;
        }
      }
      r += 1;
      if (char === value[v]) break;
      // Anything else only exists in the source: block prefixes such as
      // "> " or list indentation on continuation lines.
    }
  }
  return literal;
}

interface Delimiter {
  node: Text;
  index: number;
  char: '"' | "'";
  canOpen: boolean;
  canClose: boolean;
  /** A single-quote opener that a later closer matched. */
  matched?: boolean;
}

function isAutolink(node: Link): boolean {
  const text = node.children.length === 1 && node.children[0]!.type === 'text' ? node.children[0]!.value : undefined;
  if (text === undefined) return false;
  return node.url === text || node.url === `http://${text}` || node.url === `https://${text}` || node.url === `mailto:${text}`;
}

export function remarkSmartPunctuation() {
  return (tree: Root, file: VFile) => {
    const source = String(file.value ?? '');

    /** Raw source character before an offset, with block prefixes read as a line start. */
    const rawBefore = (offset: number): Char => {
      let i = offset - 1;
      while (i >= 0 && (source[i] === ' ' || source[i] === '\t' || source[i] === '>')) i -= 1;
      if (i < 0 || source[i] === '\n') return '\n';
      return codePointBefore(source, offset);
    };
    const rawAfter = (offset: number): Char => codePointAt(source, offset) ?? '\n';

    /** Literal-character mask of a text node, computed once from its original value. */
    const masks = new WeakMap<Text, boolean[]>();
    const maskFor = (node: Text): boolean[] => {
      let mask = masks.get(node);
      if (!mask) {
        const start = node.position?.start.offset;
        const end = node.position?.end.offset;
        const raw = start !== undefined && end !== undefined ? source.slice(start, end) : node.value;
        mask = literalMask(node.value, raw);
        masks.set(node, mask);
      }
      return mask;
    };

    /** Replaces quotes in every text node below `container`, one inline scope at a time. */
    const processScope = (container: Parent, isBlock: boolean) => {
      const delimiters: Delimiter[] = [];
      const openers: Delimiter[] = [];

      const visitChildren = (parent: Parent) => {
        parent.children.forEach((child: Nodes, position: number) => {
          if (child.type === 'text') {
            collect(child, parent, position);
          } else if (child.type === 'link' || child.type === 'linkReference') {
            if (child.type === 'link' && isAutolink(child)) return;
            // Link text has its own delimiter stack.
            processScope(child, false);
          } else if (child.type === 'emphasis' || child.type === 'strong' || child.type === 'delete') {
            const mark = openers.length;
            visitChildren(child);
            // CommonMark drops delimiters between a matched emphasis pair.
            openers.length = mark;
          }
        });
      };

      const collect = (node: Text, parent: Parent, position: number) => {
        const value = node.value;
        const start = node.position?.start.offset;
        const end = node.position?.end.offset;
        const literal = maskFor(node);
        // Only the edges of the block itself count as whitespace; inside link
        // text the neighbours are the brackets.
        const first = isBlock && parent === container && position === 0;
        const last = isBlock && parent === container && position === parent.children.length - 1;

        for (let i = 0; i < value.length; i++) {
          const char = value[i];
          if ((char !== '"' && char !== "'") || literal[i]) continue;
          const before: Char =
            i > 0 ? codePointBefore(value, i) : first || start === undefined ? undefined : rawBefore(start);
          const after: Char =
            i < value.length - 1 ? codePointAt(value, i + 1) : last || end === undefined ? undefined : rawAfter(end);
          const { left, right } = flanking(before, after);
          const delimiter: Delimiter = { node, index: i, char, canOpen: left && !right, canClose: right };
          delimiters.push(delimiter);

          if (char === '"') {
            const open = openers.findLastIndex((entry) => entry.char === '"');
            if (!delimiter.canClose && open >= 0 && endsPhrase(before)) {
              delimiter.canOpen = false;
              delimiter.canClose = true;
            }
            if (delimiter.canClose && open >= 0) openers.splice(open, 1);
          }
          if (char === "'" && delimiter.canClose) {
            const opener = openers.findLast((entry) => entry.char === "'");
            if (opener) opener.matched = true;
          }
          if (delimiter.canOpen) openers.push(delimiter);
        }
      };

      visitChildren(container);

      // Every replacement is one UTF-16 unit, so the literal masks stay aligned.
      for (const delimiter of delimiters) {
        const replacement =
          delimiter.char === '"'
            ? delimiter.canClose
              ? '”'
              : '“'
            : !delimiter.canClose && delimiter.matched
              ? '‘'
              : '’';
        const { node, index } = delimiter;
        node.value = node.value.slice(0, index) + replacement + node.value.slice(index + 1);
      }
    };

    /** Ellipses and dashes, per text node. */
    const dashes = (parent: Parent) => {
      for (const child of parent.children as Nodes[]) {
        if (child.type === 'text') {
          const literal = maskFor(child);
          child.value = child.value.replace(/\.\.\.|--+/g, (run, offset: number) => {
            for (let i = offset; i < offset + run.length; i++) if (literal[i]) return run;
            if (run === '...') return '…';
            const length = run.length;
            let en = 0;
            let em = 0;
            if (length % 3 === 0) em = length / 3;
            else if (length % 2 === 0) en = length / 2;
            else if (length % 3 === 2) {
              en = 1;
              em = (length - 2) / 3;
            } else {
              en = 2;
              em = (length - 4) / 3;
            }
            return '—'.repeat(em) + '–'.repeat(en);
          });
        } else if (child.type === 'link' && isAutolink(child)) {
          continue;
        } else if ('children' in child) {
          // code, inlineCode and html carry `value`, not children, so they are skipped.
          dashes(child);
        }
      }
    };

    const walk = (node: Nodes) => {
      if (BLOCKS.has(node.type)) {
        // Quotes first: they keep string lengths, so the masks still line up for dashes.
        processScope(node as Parent, true);
        dashes(node as Parent);
        return;
      }
      if ('children' in node) for (const child of node.children) walk(child as Nodes);
    };

    walk(tree);
  };
}

/**
 * The same rules for a plain string (front matter such as descriptions and
 * takeaways), so text outside the Markdown body gets the same quotes, dashes
 * and ellipses as the body.
 */
export function smartenText(value: string): string {
  const text: Text = { type: 'text', value };
  const tree: Root = { type: 'root', children: [{ type: 'paragraph', children: [text] }] };
  remarkSmartPunctuation()(tree, { value } as VFile);
  return text.value;
}
