'use client';

import { useLayoutEffect, useRef } from 'react';
import { keepParens } from '@/lib/keep-parens';
import type { Heading } from '@/lib/rehype-plugins';
import { TocPill } from './overlays/TocPill';
import { useActiveHeading } from './overlays/useActiveHeading';

interface TocProps {
  headings: Heading[];
}

/**
 * Table of contents for h2/h3.
 *  - ≥ 1180px: a sticky rail beside the article. An ink bar slides (--ease-spring) to
 *    the section being read, which also gets aria-current="location".
 *  - < 1180px: a frosted glass pill "n/N · heading" at the bottom that opens a sheet
 *    (TocPill). It is JS-only; without JS the rail's plain links still work on wide screens.
 */
export function Toc({ headings }: TocProps) {
  const active = useActiveHeading(headings);
  // The rail marks the first section until the reader reaches it, so it never looks inert.
  const railActive = Math.max(0, active);
  const listRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  // Move the bar to the current link. Runs only when the section changes (and on
  // font/size changes via ResizeObserver), never per scroll frame.
  useLayoutEffect(() => {
    const list = listRef.current;
    const bar = barRef.current;
    if (!list || !bar) return;
    const place = () => {
      const link = list.querySelectorAll<HTMLElement>('a')[railActive];
      if (!link) {
        bar.style.opacity = '0';
        return;
      }
      // The first placement jumps; later ones slide.
      const first = bar.style.opacity !== '1';
      if (first) bar.style.transition = 'none';
      bar.style.transform = `translateY(${link.offsetTop + 4}px)`;
      bar.style.height = `${Math.max(12, link.offsetHeight - 8)}px`;
      bar.style.opacity = '1';
      if (first) {
        void bar.offsetWidth;
        bar.style.transition = '';
      }
    };
    place();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [railActive]);

  return (
    <>
      <aside className="toc" aria-label="목차">
        <div className="toc__inner">
          <p className="toc__title" aria-hidden="true">
            목차
          </p>
          <div className="toc__track">
            <span ref={barRef} className="toc__bar" aria-hidden="true" />
            <ol ref={listRef} className="toc__list">
            {headings.map((heading, index) => (
              <li key={heading.id} className={heading.depth === 3 ? 'toc__sub' : undefined}>
                <a href={`#${heading.id}`} aria-current={index === railActive ? 'location' : undefined} data-toc-link>
                  {keepParens(heading.text, 12)}
                </a>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </aside>
      <TocPill headings={headings} active={active} />
    </>
  );
}
