import { SITE } from '@/lib/site';
import { routes, withBase } from '@/lib/paths';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="wrap site-footer">
      <p className="site-footer__brand">
        <b>{SITE.name}</b>© {year} {SITE.author}
      </p>
      <nav aria-label="외부 링크">
        <a href={withBase(routes.rss())}>RSS</a>
        <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={SITE.links.scholar} target="_blank" rel="noopener noreferrer">
          Scholar
        </a>
      </nav>
    </footer>
  );
}
