import Link from 'next/link';
import { getCategory, getSeries, type CategoryId } from '@/lib/site';
import { routes } from '@/lib/paths';
import { monthDay, shortDate, type Post } from '@/lib/posts';
import { keepParens, typesetTitle } from '@/lib/keep-parens';

interface PostItemProps {
  post: Post;
  /** The category the list is filtered to; a label that only repeats it is hidden. */
  activeCategory?: CategoryId | undefined;
  /** 'md' (04.04) under a year heading, 'ymd' (2026.04.04) in flat lists. */
  date?: 'md' | 'ymd';
}

/** One secondary label: venue, else series (its short name), else category. */
function SecondaryLabel({ post, activeCategory }: { post: Post; activeCategory?: CategoryId | undefined }) {
  const { data } = post;
  if (data.paper?.venue) return <span className="post-item__label">{data.paper.venue}</span>;
  if (data.series) {
    const series = getSeries(data.series);
    return (
      <span className="post-item__label">
        {series.short === series.label ? series.label : <abbr title={series.label}>{series.short}</abbr>}
      </span>
    );
  }
  if (data.category === activeCategory) return null;
  return <span className="post-item__label">{getCategory(data.category).label}</span>;
}

/**
 * A list row: title (17/1.5, 620), a two-line description, and on the right the date
 * over one secondary label. On phones the aside folds into one line: "04.04 · ICCV 2025".
 *
 * The whole row is one link; its accessible name is the title alone (the description
 * and meta would make every name 150+ characters), and the date and label describe it.
 * Rows are not prefetched as they scroll into view (a long list would fetch every post's
 * payload); IntentPrefetch fetches one on hover, focus or touch instead.
 */
export function PostItem({ post, activeCategory, date = 'md' }: PostItemProps) {
  const { data } = post;
  const titleId = `row-${post.slug}`;
  return (
    <li className="post-item">
      <Link
        className="post-item__link"
        href={routes.post(post.slug)}
        prefetch={false}
        data-intent=""
        aria-labelledby={titleId}
        aria-describedby={`${titleId}-meta`}
      >
        <h3 className="post-item__title" id={titleId}>
          {typesetTitle(data.title, 14)}
        </h3>
        <p className="post-item__desc">{keepParens(data.description)}</p>
        <p className="post-item__meta" id={`${titleId}-meta`}>
          <time dateTime={data.pubDate.toISOString()}>{date === 'md' ? monthDay(data.pubDate) : shortDate(data.pubDate)}</time>
          <SecondaryLabel post={post} activeCategory={activeCategory} />
        </p>
      </Link>
    </li>
  );
}
