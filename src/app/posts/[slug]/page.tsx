import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CodeCopy } from '@/components/CodeCopy';
import { Pager } from '@/components/Pager';
import { PaperCard } from '@/components/PaperCard';
import { PostHeader } from '@/components/PostHeader';
import { SeriesBox } from '@/components/SeriesBox';
import { Takeaways } from '@/components/Takeaways';
import { Toc } from '@/components/Toc';
import { renderMarkdown } from '@/lib/markdown';
import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/lib/paths';
import { adjacentPosts, getPost, getPosts, readingMinutes, seriesPosts } from '@/lib/posts';
import { getCategory, getSeries } from '@/lib/site';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.data.title,
    description: post.data.description,
    path: routes.post(post.slug),
    type: 'article',
    publishedTime: post.data.pubDate,
    ...(post.data.updatedDate ? { modifiedTime: post.data.updatedDate } : {})
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const posts = getPosts();
  const post = getPost(slug);
  if (!post) notFound();

  const { data } = post;
  const category = getCategory(data.category);
  const series = data.series ? getSeries(data.series) : undefined;
  const seriesList = data.series ? seriesPosts(posts, data.series) : [];
  const { older, newer } = adjacentPosts(posts, post.slug);
  const { html, headings } = await renderMarkdown(post.body);

  return (
    <article className="post wrap" data-article>
      <div className="post-layout">
        <div className="post-main">
          <PostHeader data={data} category={category} series={series} minutes={readingMinutes(post.body)} />

          {(data.paper || data.takeaways.length > 0) && (
            <div className="summary">
              {data.paper && <PaperCard paper={data.paper} />}
              <Takeaways items={data.takeaways} />
            </div>
          )}

          {/* Rendered from Markdown at build time; see src/lib/markdown.ts. */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          <footer className="post-foot">
            {data.tags.length > 0 && (
              <ul className="post-tags" aria-label="태그">
                {data.tags.map((tag) => (
                  <li key={tag}>
                    <Link href={routes.tag(tag)} prefetch={false} data-intent="">
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {series && <SeriesBox series={series} posts={seriesList} currentSlug={post.slug} />}

            <Pager older={older} newer={newer} />
          </footer>
        </div>

        {headings.length > 2 && <Toc headings={headings} />}
      </div>

      <CodeCopy key={post.slug} />
    </article>
  );
}
