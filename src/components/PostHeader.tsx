import Link from 'next/link';
import { routes } from '@/lib/paths';
import { longDate, type PostData } from '@/lib/posts';
import type { Category, Series } from '@/lib/site';
import { estimateEm } from '@/lib/glue';
import { keepParens, typesetTitle } from '@/lib/keep-parens';

interface PostHeaderProps {
  data: PostData;
  category: Category;
  series?: Series | undefined;
  minutes: number;
}

/** Estimated width (em) past which a post title takes the smaller phone size. */
const LONG_TITLE_EM = 45;

/**
 * Eyebrow (category · series · venue), the title across the full 680px measure,
 * the lede, then date · reading time · origin. The title uses typesetTitle() so
 * Latin compounds never break at their hyphen, "(2022" never splits after its
 * parenthesis and no line ends on "A" or "the"; <title> and metadata keep the
 * original. A title wider than LONG_TITLE_EM (the long English paper titles) is set a
 * step smaller below the desktop width (data-long, src/styles/reading.css).
 */
export function PostHeader({ data, category, series, minutes }: PostHeaderProps) {
  const venue = data.paper?.venue;
  return (
    <header className="post-header">
      <p className="post-header__eyebrow">
        <Link className="post-header__crumb" href={routes.category(category.id)}>
          {category.label}
        </Link>
        {series && (
          <Link className="post-header__crumb" href={routes.series(series.id)}>
            {series.label}
          </Link>
        )}
        {venue && <span className="post-header__venue">{venue}</span>}
      </p>
      <h1 className="post-header__title" data-long={estimateEm(data.title) > LONG_TITLE_EM ? '' : undefined}>
        {typesetTitle(data.title, 10)}
      </h1>
      <p className="post-header__desc">{keepParens(data.description)}</p>
      <p className="post-header__meta">
        <time dateTime={data.pubDate.toISOString()}>{longDate(data.pubDate)}</time>
        <span>{minutes}분 분량</span>
        {data.origin && (
          <span>
            <a className="ink-link" href={data.origin.url} target="_blank" rel="noopener noreferrer">
              {data.origin.name}에서 옮긴 글
            </a>
          </span>
        )}
      </p>
    </header>
  );
}
