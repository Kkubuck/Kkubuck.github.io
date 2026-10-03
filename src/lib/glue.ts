/**
 * Words that must not break inside: a whitespace-delimited word that holds a
 * parenthesis or a quotation mark.
 *
 * Under `word-break: keep-all` a Korean word never breaks between syllables, but the
 * line breaker still allows a break
 *  - between a closing ")" or "”" and the particle after it (Chrome: "Unit(HMU)" /
 *    "이 혼합된", "탐지(SOD)" / "에서도"; UAX #14 lets CP and QU break before Hangul), and
 *  - right after an opening "(" (WebKit: "에포크(" / "epoch)", "검사하기 (" / "2022 …").
 * Keeping each such word whole ("Unit(HMU)이", "(2022", "INTERNSHIP)", "“튀어나와”라는")
 * fixes both. A word wider than `maxEm` (estimated) is not kept whole, so it can still
 * wrap on a phone; instead its pieces between hyphens and slashes that hold the mark
 * are ("만들고(Clustering-" + "then-" + "Retrieval),").
 *
 * Used by the rehype pass for post bodies (src/lib/rehype-plugins.ts), by keepParens()
 * for descriptions and TOC entries, and (through splitTitleGlue, which also binds "A",
 * "the", "of" to the next word) by typesetTitle() for display titles
 * (src/lib/keep-parens.tsx). The text itself never changes; only <span class="nobr">
 * wrappers are added.
 */

export interface GluePart {
  text: string;
  /** keep this word on one line */
  glue: boolean;
}

const GLUE_MARK = /[()“”‘’"']/u;
const WORD = /(\s+)/u;

/** Rough advance width in em (Pretendard): Hangul/CJK 1, Latin capitals .68, the rest .56, punctuation .35. */
export function estimateEm(text: string): number {
  let em = 0;
  for (const char of text) {
    if (/[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(char)) em += 1;
    else if (/[A-Z]/.test(char)) em += 0.68;
    else if (/[\p{L}\p{N}]/u.test(char)) em += 0.56;
    else em += 0.35;
  }
  return em;
}

/** True for a word that should be kept whole (and fits). */
export function needsGlue(word: string, maxEm = 16): boolean {
  return word.length > 1 && GLUE_MARK.test(word) && estimateEm(word) <= maxEm;
}

/**
 * Splits text into runs, marking the words to keep whole. Whitespace stays in the
 * plain runs, so the concatenation of all parts is the original text.
 */
export function splitGlue(text: string, maxEm = 16): GluePart[] {
  if (!GLUE_MARK.test(text)) return [{ text, glue: false }];
  const parts: GluePart[] = [];
  let plain = '';
  const keep = (piece: string) => {
    if (plain) parts.push({ text: plain, glue: false });
    plain = '';
    parts.push({ text: piece, glue: true });
  };
  for (const piece of text.split(WORD)) {
    if (!piece) continue;
    if (/\s/u.test(piece) || !GLUE_MARK.test(piece)) plain += piece;
    else if (needsGlue(piece, maxEm)) keep(piece);
    else {
      // Too wide to keep whole: keep the pieces around the marks, between the word's own
      // break points (after a hyphen or a slash).
      for (const sub of piece.split(/(?<=[-/‐–—])/u)) {
        if (needsGlue(sub, maxEm)) keep(sub);
        else plain += sub;
      }
    }
  }
  if (plain) parts.push({ text: plain, glue: false });
  return parts;
}

/**
 * Short words that must not end a line of a display title: articles, "&" and Latin words
 * of one or two letters ("Zoom in and Out: A / Mixed‑Scale", "Breaking of / Camouflage",
 * "Objects the / Hard Way"). Acronyms in capitals ("AI", "3D") are not among them.
 */
const WEAK_WORD = /^(?:[Aa]n?|[Tt]he|[a-z]{1,2}|[A-Z][a-z]|&)$/u;

/**
 * splitGlue() for display titles: each short function word (WEAK_WORD) is also bound to
 * the word after it, through chains ("of the Unseen"), so a title never ends a line on
 * "A", "the" or "of". A bound run is kept whole only while it fits `maxEm`; past that its
 * words stay free, as in splitGlue().
 */
export function splitTitleGlue(text: string, maxEm = 16): GluePart[] {
  const pieces = text.split(WORD).filter(Boolean);
  const parts: GluePart[] = [];
  const push = (part: GluePart) => {
    const last = parts.at(-1);
    if (last && !last.glue && !part.glue) last.text += part.text;
    else parts.push({ ...part });
  };
  for (let i = 0; i < pieces.length; i += 1) {
    let run = pieces[i]!;
    let end = i;
    while (WEAK_WORD.test(pieces[end]!) && pieces[end + 1] === ' ' && pieces[end + 2] !== undefined) {
      let longer = `${run} ${pieces[end + 2]}`;
      let step = 2;
      // A run never ends on a suspended hyphen ("on Domain- and Class-level"): WebKit lets
      // a nowrap run that ends in "-" overhang the measure, so the next word joins too.
      if (/[-‐‑–—]$/u.test(longer)) {
        if (pieces[end + 3] !== ' ' || pieces[end + 4] === undefined) break;
        longer += ` ${pieces[end + 4]}`;
        step = 4;
      }
      if (estimateEm(longer) > maxEm) break;
      run = longer;
      end += step;
    }
    if (end > i) {
      push({ text: run, glue: true });
      i = end;
    } else {
      splitGlue(run, maxEm).forEach(push);
    }
  }
  return parts;
}
