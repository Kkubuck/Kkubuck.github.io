import { PostList } from '@/components/PostList';
import { HOME_TITLE, pageMetadata } from '@/lib/metadata';
import { routes } from '@/lib/paths';
import { getPosts } from '@/lib/posts';

export const dynamic = 'force-static';

export const metadata = pageMetadata({ path: routes.home() });

export default function HomePage() {
  return (
    <>
      {/* No intro copy on the home page; the heading exists for screen readers and outlines. */}
      <h1 className="sr-only">{HOME_TITLE}</h1>
      <PostList posts={getPosts()} />
    </>
  );
}
