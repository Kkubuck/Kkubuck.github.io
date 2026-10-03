'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/lib/site';

/** "글" stays current everywhere a post list or a post is shown. */
function isCurrent(pathname: string, href: string): boolean {
  if (href === '/') {
    return (
      pathname === '/' ||
      pathname.startsWith('/posts/') ||
      pathname.startsWith('/category/') ||
      pathname.startsWith('/series/')
    );
  }
  return pathname.startsWith(href);
}

export function SiteNav({ className = 'site-nav', linkClassName }: { className?: string; linkClassName?: string }) {
  // Known at build time too, so the static HTML already marks the current item.
  const pathname = usePathname() ?? '/';
  return (
    <nav className={className} aria-label="주요 메뉴">
      {NAV.map((item) => (
        <Link
          key={item.href}
          className={linkClassName}
          href={item.href}
          aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
