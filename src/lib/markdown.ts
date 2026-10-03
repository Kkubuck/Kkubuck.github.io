/**
 * Markdown → HTML at build time.
 *
 *   remark-parse → remark-gfm → smart punctuation → remark-rehype
 *   → Shiki (one theme of CSS variables that switch with light/dark) → figure → image sizes
 *   → heading ids → links → words kept whole → code/table wrappers → rehype-stringify
 *
 * The output is an HTML string for a server component
 * (dangerouslySetInnerHTML) plus the h2/h3 headings for the table of contents.
 */
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { join } from 'node:path';
import { unified } from 'unified';
import type { ShikiTransformer } from 'shiki';
import { codeTheme } from './code-theme';
import { BASE_PATH, SITE_URL } from './paths';
import { remarkSmartPunctuation } from './smart-punctuation';
import { imageSize } from './image-size';
import {
  rehypeBlockWrappers,
  rehypeFigure,
  rehypeHeadingIds,
  rehypeImageSizes,
  rehypeKeepParens,
  rehypeLinks,
  type Heading
} from './rehype-plugins';

export type { Heading } from './rehype-plugins';

export interface RenderedMarkdown {
  html: string;
  /** h2 and h3 in document order. */
  headings: Heading[];
}

/** Matches the Astro output: data-language on <pre>, no trailing blank line. */
const codeTransformer: ShikiTransformer = {
  name: 'kkubuck:code',
  preprocess(code) {
    // Astro trimmed one more trailing newline than @shikijs/rehype does.
    return code.replace(/(?:\r\n|\r|\n)$/, '');
  },
  pre(node) {
    node.properties.dataLanguage = this.options.lang;
  }
};

function createProcessor() {
  return unified()
    .use(remarkParse)
    // Strikethrough needs ~~two~~ tildes. With single tildes on (the default),
    // ranges such as "a~e" and "0~1" in one paragraph struck out the text between them.
    .use(remarkGfm, { singleTilde: false })
    .use(remarkSmartPunctuation)
    .use(remarkRehype)
    .use(rehypeShiki, {
      // The prototype palette as CSS variables; light/dark switch in CSS (code-theme.ts).
      theme: codeTheme,
      langs: ['python', 'bash', 'cpp'],
      lazy: true,
      defaultLanguage: 'plaintext',
      fallbackLanguage: 'plaintext',
      transformers: [codeTransformer]
    })
    .use(rehypeFigure)
    .use(rehypeImageSizes, { sizeOf: (src: string) => imageSize(join(PUBLIC_DIR, decodeURI(src.split(/[?#]/)[0]!))) })
    .use(rehypeHeadingIds)
    .use(rehypeLinks, { basePath: BASE_PATH, siteOrigin: new URL(SITE_URL).origin })
    .use(rehypeKeepParens)
    .use(rehypeBlockWrappers)
    .use(rehypeStringify)
    .freeze();
}

/** Images in posts are root-relative paths under public/. */
const PUBLIC_DIR = join(process.cwd(), 'public');

let processor: ReturnType<typeof createProcessor> | undefined;

export async function renderMarkdown(markdown: string): Promise<RenderedMarkdown> {
  processor ??= createProcessor();
  const file = await processor.process(markdown);
  return { html: String(file), headings: file.data.headings ?? [] };
}
