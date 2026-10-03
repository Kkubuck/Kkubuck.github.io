import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/lib/paths';
import { collectTags, getPosts } from '@/lib/posts';

export const dynamic = 'force-static';

export const metadata = pageMetadata({ title: '태그', description: '주제별로 글을 모아 봅니다.', path: routes.tags() });

export default function TagsPage() {
  const tags = collectTags(getPosts());

  return (
    <div className="wrap">
      <header className="page-header">
        <div className="page-header__row">
          <h1 className="page-header__title">태그</h1>
          <span className="page-header__count">{tags.length}</span>
        </div>
      </header>

      <ul className="tag-cloud">
        {tags.map(({ slug, tag, count }) => (
          <li key={slug}>
            <Link href={routes.tag(tag)} prefetch={false} data-intent="">
              #{tag}
              <span className="tag-cloud__count">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
