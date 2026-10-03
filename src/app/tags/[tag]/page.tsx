import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/PostList';
import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/lib/paths';
import { collectTags, getPosts, postsWithTag } from '@/lib/posts';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return collectTags(getPosts()).map(({ slug }) => ({ tag: slug }));
}

function findTag(slug: string) {
  const posts = getPosts();
  const entry = collectTags(posts).find((tag) => tag.slug === slug);
  return entry ? { tag: entry.tag, posts: postsWithTag(posts, slug) } : undefined;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: slug } = await params;
  const found = findTag(slug);
  if (!found) return {};
  return pageMetadata({
    title: `#${found.tag}`,
    description: `#${found.tag} 태그가 붙은 글 ${found.posts.length}편`,
    path: routes.tag(found.tag)
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: slug } = await params;
  const found = findTag(slug);
  if (!found) notFound();

  return (
    <div className="wrap">
      <header className="page-header">
        <p className="page-header__eyebrow">
          <Link href={routes.tags()}>태그</Link>
        </p>
        <h1 className="page-header__title">#{found.tag}</h1>
        <p className="page-header__desc">{found.posts.length}편의 글</p>
      </header>

      <PostList posts={found.posts} byYear={false} />
    </div>
  );
}
