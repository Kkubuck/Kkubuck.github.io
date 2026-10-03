import { Fragment, type ReactNode } from 'react';
import { splitGlue, splitTitleGlue, type GluePart } from './glue';
import { displayTitle } from './typography';

/**
 * Keeps words with a parenthesis or quotation mark whole (src/lib/glue.ts explains
 * the line breaks this prevents in Chrome and WebKit): each becomes
 * <span class="nobr">. The text is unchanged. For front-matter strings rendered by
 * components: list-row and series descriptions, the post lede, takeaways, TOC entries.
 * Post bodies get the same treatment from rehypeKeepParens.
 */
export function keepParens(text: string, maxEm?: number): ReactNode {
  return render(text, splitGlue(text, maxEm));
}

/**
 * A display title (post h1, list row, paper card, pager, series, about publications):
 * U+2011 inside hyphenated Latin words (displayTitle), parenthetical words kept whole,
 * and short function words bound to the next word, so no line ends on "A", "the" or
 * "of" (splitTitleGlue). `maxEm` caps a kept run's width for large type (the post h1
 * on a phone).
 */
export function typesetTitle(text: string, maxEm = 12): ReactNode {
  const title = displayTitle(text);
  return render(title, splitTitleGlue(title, maxEm));
}

function render(text: string, parts: GluePart[]): ReactNode {
  if (parts.length === 1 && !parts[0]!.glue) return text;
  return (
    <Fragment>
      {parts.map((part, index) =>
        part.glue ? (
          <span key={index} className="nobr">
            {part.text}
          </span>
        ) : (
          part.text
        )
      )}
    </Fragment>
  );
}
