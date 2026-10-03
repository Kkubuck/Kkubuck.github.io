import Link from 'next/link';
import { routes } from '@/lib/paths';
import type { Post } from '@/lib/posts';
import { typesetTitle } from '@/lib/keep-parens';

interface PagerProps {
  /** Previous post in the newest-first list (written earlier). */
  older?: Post | undefined;
  /** Next post in the newest-first list (written later). */
  newer?: Post | undefined;
}

function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path
        d={dir === 'prev' ? 'M7.5 2.5 4 6l3.5 3.5' : 'M4.5 2.5 8 6 4.5 9.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Older / newer post, two halves divided by a hairline (stacked on phones). */
export function Pager({ older, newer }: PagerProps) {
  return (
    <nav className="pager" aria-label="다른 글">
      {older ? (
        <Link className="pager__link pager__link--prev" href={routes.post(older.slug)} rel="prev" prefetch={false} data-intent="">
          <span className="pager__dir">
            <Chevron dir="prev" />
            이전 글
          </span>
          <strong>{typesetTitle(older.data.title)}</strong>
        </Link>
      ) : (
        <span className="pager__empty" />
      )}
      {newer ? (
        <Link className="pager__link pager__link--next" href={routes.post(newer.slug)} rel="next" prefetch={false} data-intent="">
          <span className="pager__dir">
            다음 글
            <Chevron dir="next" />
          </span>
          <strong>{typesetTitle(newer.data.title)}</strong>
        </Link>
      ) : (
        <span className="pager__empty" />
      )}
    </nav>
  );
}
