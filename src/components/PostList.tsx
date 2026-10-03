import type { CategoryId } from '@/lib/site';
import { groupByYear, type Post } from '@/lib/posts';
import { PostItem } from './PostItem';

interface PostListProps {
  posts: Post[];
  /** The category the list is filtered to (hides labels that only repeat it). */
  activeCategory?: CategoryId | undefined;
  /** Split the list under year headings (sticky year gutter with a count on desktop). */
  byYear?: boolean;
}

export function PostList({ posts, activeCategory, byYear = true }: PostListProps) {
  if (!byYear) {
    return (
      <section className="post-group post-group--flat">
        <ul className="post-list">
          {posts.map((post) => (
            <PostItem key={post.slug} post={post} activeCategory={activeCategory} date="ymd" />
          ))}
        </ul>
      </section>
    );
  }

  return groupByYear(posts).map(([year, items]) => (
    <section key={year} className="post-group" aria-labelledby={`year-${year}`}>
      <h2 className="post-group__year" id={`year-${year}`}>
        <span className="post-group__num">{year}</span>
        <span className="post-group__count">{items.length}편</span>
      </h2>
      <ul className="post-list">
        {items.map((post) => (
          <PostItem key={post.slug} post={post} activeCategory={activeCategory} />
        ))}
      </ul>
    </section>
  ));
}
