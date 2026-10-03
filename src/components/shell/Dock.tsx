'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Glass } from '@/components/glass';
import { SearchIcon } from '@/components/icons';
import { SiteNav } from '@/components/SiteNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { openSearch, searchIntent } from '@/lib/chrome-events';
import { WORDMARK } from '@/lib/metadata';

/**
 * The floating capsule nav (glass): 글 / 태그 / 소개 · 검색 ⌘K · theme.
 * Once the masthead wordmark scrolls away, a compact wordmark slides into the
 * dock's left end (grid 0fr → 1fr on --ease-spring-soft); the capsule grows to the
 * left and the rim follows its shape every frame (the light store observes resizes).
 */
export function Dock({ mastheadId = 'masthead' }: { mastheadId?: string }) {
  const [docked, setDocked] = useState(false);
  const [mac, setMac] = useState(true);
  const markRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const masthead = document.getElementById(mastheadId);
    if (!masthead || typeof IntersectionObserver === 'undefined') return;
    // Docked once the masthead's bottom passes 18px from the top (scrollY > height - 18).
    const io = new IntersectionObserver(([entry]) => setDocked(!entry?.isIntersecting), { rootMargin: '-18px 0px 0px 0px' });
    io.observe(masthead);
    return () => io.disconnect();
  }, [mastheadId]);

  useEffect(() => {
    const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform;
    setMac(/mac|iphone|ipad/i.test(platform || navigator.userAgent));
  }, []);

  return (
    <Glass as="div" variant="dock" className={docked ? 'dock is-docked' : 'dock'}>
      <span className="dock__markwrap">
        <Link ref={markRef} className="dock__mark" href="/" tabIndex={docked ? 0 : -1} aria-hidden={!docked}>
          <span>{WORDMARK.name}</span>
        </Link>
      </span>
      <span className="dock__sep dock__sep--mark" aria-hidden="true" />
      <SiteNav className="dock__nav" linkClassName="dock__link" />
      <span className="dock__sep js-only" aria-hidden="true" />
      <button
        type="button"
        className="dock__btn dock__search js-only"
        onClick={openSearch}
        onPointerEnter={searchIntent}
        onFocus={searchIntent}
        aria-label="글 검색"
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K /"
      >
        <SearchIcon />
        <span className="dock__label" aria-hidden="true">
          검색
        </span>
        <kbd aria-hidden="true">{mac ? '⌘K' : 'Ctrl K'}</kbd>
      </button>
      <ThemeToggle className="dock__btn dock__theme js-only" />
    </Glass>
  );
}
