import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/lib/paths';
import { getPosts, seriesPosts, shortDate } from '@/lib/posts';
import { SERIES, getSeries, isSeriesId } from '@/lib/site';
import { keepParens, typesetTitle } from '@/lib/keep-parens';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface SeriesPageProps {
  params: Promise<{ series: string }>;
}

export function generateStaticParams() {
  return SERIES.map((series) => ({ series: series.id }));
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { series: id } = await params;
  if (!isSeriesId(id)) return {};
  const series = getSeries(id);
  const count = seriesPosts(getPosts(), id).length;
  return pageMetadata({ title: series.label, description: `${series.label} 시리즈 ${count}편`, path: routes.series(id) });
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { series: id } = await params;
  if (!isSeriesId(id)) notFound();
  const series = getSeries(id);
  const items = seriesPosts(getPosts(), id);

  return (
    <div className="wrap">
      <header className="page-header">
        <p className="page-header__eyebrow">시리즈</p>
        <div className="page-header__row">
          <h1 className="page-header__title">{series.label}</h1>
          <span className="page-header__count">{items.length}편</span>
        </div>
      </header>

      <ol className="series-list">
        {items.map((post, index) => (
          <li key={post.slug}>
            <Link href={routes.post(post.slug)} prefetch={false} data-intent="">
              <span className="series-list__no">{String(index + 1).padStart(2, '0')}</span>
              <span className="series-list__body">
                <strong>{typesetTitle(post.data.title, 14)}</strong>
                <span>{keepParens(post.data.description)}</span>
              </span>
              <time dateTime={post.data.pubDate.toISOString()}>{shortDate(post.data.pubDate)}</time>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
