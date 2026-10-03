import type { ReactNode } from 'react';
import { SegmentedNav, type SegmentTab } from '@/components/list/SegmentedNav';
import { routes } from '@/lib/paths';
import { getPosts } from '@/lib/posts';
import { CATEGORIES } from '@/lib/site';

/**
 * Shared by / and /category/<id>/: the segmented control lives here, so it persists
 * across client navigations between them and its lens animates from route to route.
 * The URLs stay real pages for static export and readers without JS.
 */
export default function ListsLayout({ children }: { children: ReactNode }) {
  const posts = getPosts();
  const tabs: SegmentTab[] = [
    { key: 'all', href: routes.home(), label: '전체', count: posts.length },
    ...CATEGORIES.map((category) => ({
      key: category.id,
      href: routes.category(category.id),
      label: category.label,
      count: posts.filter((post) => post.data.category === category.id).length
    }))
  ];

  return (
    <div className="wrap home">
      <div className="home__controls">
        <SegmentedNav tabs={tabs} />
      </div>
      <div className="home__list">{children}</div>
    </div>
  );
}
