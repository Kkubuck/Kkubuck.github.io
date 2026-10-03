import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';

// Exported as out/404.html, which GitHub Pages serves for unknown paths. Next.js
// adds <meta name="robots" content="noindex"> to this page itself, so the
// robots field is dropped here rather than emitted twice.
const { robots: _addedByNext, ...notFoundMetadata } = pageMetadata({
  title: '페이지를 찾을 수 없습니다',
  path: '/404.html',
  noindex: true
});
export const metadata = notFoundMetadata;

export default function NotFound() {
  return (
    <div className="wrap not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">페이지를 찾을 수 없습니다</h1>
      <p className="not-found__text">주소가 바뀌었거나 삭제된 글일 수 있습니다.</p>
      <p className="not-found__actions">
        <Link className="button" href="/">
          전체 글 보기
        </Link>
        <button className="button button--ghost js-only" type="button" data-search-open>
          검색하기
        </button>
      </p>
    </div>
  );
}
