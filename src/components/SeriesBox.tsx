import Link from 'next/link';
import type { CSSProperties } from 'react';
import { routes } from '@/lib/paths';
import type { Post } from '@/lib/posts';
import type { Series } from '@/lib/site';
import { typesetTitle } from '@/lib/keep-parens';

interface SeriesBoxProps {
  series: Series;
  /** Posts of the series, oldest first. */
  posts: Post[];
  currentSlug: string;
}

/**
 * Every post of the series, numbered, the current one marked. More than six items
 * flow into two columns (top to bottom, then the second column) from 640px up.
 */
export function SeriesBox({ series, posts, currentSlug }: SeriesBoxProps) {
  if (posts.length < 2) return null;
  const position = posts.findIndex((post) => post.slug === currentSlug) + 1;
  const twoColumns = posts.length > 6;

  return (
    <nav className="series-box" aria-label={`${series.label} 시리즈`}>
      <p className="series-box__head">
        <Link className="series-box__name" href={routes.series(series.id)}>
          {series.label}
        </Link>
        <span className="series-box__position">
          {position} / {posts.length}
        </span>
      </p>
      <ol
        className={twoColumns ? 'series-box__list series-box__list--cols' : 'series-box__list'}
        style={twoColumns ? ({ '--rows': Math.ceil(posts.length / 2) } as CSSProperties) : undefined}
      >
        {posts.map((post) => (
          <li key={post.slug}>
            {post.slug === currentSlug ? (
              <span aria-current="page">
                <span className="series-box__title">{typesetTitle(post.data.title)}</span>
              </span>
            ) : (
              <Link href={routes.post(post.slug)} prefetch={false} data-intent="">
                <span className="series-box__title">{typesetTitle(post.data.title)}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
