'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BASE_PATH } from '@/lib/paths';

/**
 * Prefetch on intent, not on sight. Links marked `prefetch={false} data-intent` (post
 * rows, tag lists, series lists, the pager) would otherwise each fetch their route
 * payload as they scroll into view — on a phone, the home list alone is ~1 MB of posts
 * the reader never opens. Here a route is prefetched once, when a link to it is
 * hovered, focused or touched, which still leaves 100–300 ms before the click lands.
 */
export function IntentPrefetch() {
  const router = useRouter();

  useEffect(() => {
    const done = new Set<string>();
    const intent = (event: Event) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-intent]') : null;
      if (!link || link.origin !== location.origin) return;
      let path = link.pathname;
      if (BASE_PATH && path.startsWith(`${BASE_PATH}/`)) path = path.slice(BASE_PATH.length);
      if (done.has(path)) return;
      done.add(path);
      router.prefetch(path);
    };
    const options = { passive: true, capture: true } as const;
    document.addEventListener('pointerover', intent, options);
    document.addEventListener('focusin', intent, options);
    document.addEventListener('touchstart', intent, options);
    return () => {
      document.removeEventListener('pointerover', intent, options);
      document.removeEventListener('focusin', intent, options);
      document.removeEventListener('touchstart', intent, options);
    };
  }, [router]);

  return null;
}
