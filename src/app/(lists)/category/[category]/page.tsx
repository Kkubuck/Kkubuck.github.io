import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/PostList';
import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/lib/paths';
import { getPosts, postsInCategory } from '@/lib/posts';
import { CATEGORIES, getCategory, isCategoryId } from '@/lib/site';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: id } = await params;
  if (!isCategoryId(id)) return {};
  const category = getCategory(id);
  return pageMetadata({ title: category.label, description: category.description, path: routes.category(id) });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: id } = await params;
  if (!isCategoryId(id)) notFound();
  const category = getCategory(id);

  return (
    <>
      {/* The lens already shows where you are; the heading and description are for
          screen readers and outlines (and the meta description). */}
      <div className="sr-only">
        <header className="page-header">
          <h1 className="page-header__title">{category.label}</h1>
          <p className="page-header__desc">{category.description}</p>
        </header>
      </div>
      <PostList posts={postsInCategory(getPosts(), category.id)} activeCategory={category.id} />
    </>
  );
}
