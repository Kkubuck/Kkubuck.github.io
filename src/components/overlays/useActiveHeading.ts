'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/rehype-plugins';

/** Reading line: a heading becomes current once it rises above this share of the viewport. */
const LINE = 0.38;
/** Keys that scroll the page: they end a pin set by a TOC jump. */
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/**
 * Index of the heading being read (-1 before the first one): the last heading above
 * the reading line.
 *
 * IntersectionObservers re-pick the moment a heading crosses the viewport edges or the
 * reading line, also when the layout moves under a still page (images, fonts). They
 * cannot see a jump that carries every heading past the viewport without one ever
 * being inside it (dragging the scrollbar, scroll restoration on Back, find-in-page,
 * a programmatic scroll from the bottom into a long section), so a scroll listener
 * also re-picks, at most once per frame: one rect read per heading down to the first
 * one below the line (React skips the render when the index is unchanged).
 *
 * A jump to a heading (a TOC link, or a URL with #id) pins that heading as current
 * until the reader scrolls again: after jumping to a short section, the next heading
 * may already sit above the reading line, and the jump target must still be the one
 * marked.
 */
export function useActiveHeading(headings: Heading[]): number {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const targets = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    if (!targets.length || typeof IntersectionObserver === 'undefined') return;

    let pinned = -1;
    const pick = () => {
      if (pinned >= 0) {
        const top = targets[pinned]!.getBoundingClientRect().top;
        if (top > -8 && top < innerHeight) {
          setActive(pinned);
          return;
        }
        pinned = -1; // the target left the viewport some other way
      }
      const line = innerHeight * LINE;
      let index = -1;
      for (let i = 0; i < targets.length; i += 1) {
        if (targets[i]!.getBoundingClientRect().top <= line) index = i;
        else break;
      }
      setActive(index);
    };
    const pin = (id: string) => {
      const index = targets.findIndex((target) => target.id === id);
      if (index < 0) return;
      pinned = index;
      setActive(index);
    };
    const unpin = () => {
      if (pinned < 0) return;
      pinned = -1;
      pick();
    };
    // Any scroll re-picks on the next frame. A pin survives it while its heading is in
    // view (pick() checks), so the scroll that a TOC jump itself causes keeps the pin.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        pick();
      });
    };
    const fromHash = () => {
      if (location.hash.length > 1) pin(decodeURIComponent(location.hash.slice(1)));
    };
    // Clicks on in-page links (also a second click on the same entry, which fires no hashchange).
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (link) pin(decodeURIComponent(link.hash.slice(1)));
    };
    const onKey = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) unpin();
    };

    // One observer for the band above the reading line, one for the whole viewport:
    // a jump that skips the band (End, a far TOC link) still moves headings in or out of view.
    const band = new IntersectionObserver(pick, { rootMargin: `0px 0px -${Math.round((1 - LINE) * 100)}% 0px` });
    const view = new IntersectionObserver(pick);
    targets.forEach((target) => {
      band.observe(target);
      view.observe(target);
    });
    fromHash();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', pick, { passive: true });
    addEventListener('hashchange', fromHash);
    document.addEventListener('click', onClick);
    addEventListener('wheel', unpin, { passive: true });
    addEventListener('touchmove', unpin, { passive: true });
    addEventListener('keydown', onKey);
    return () => {
      band.disconnect();
      view.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', pick);
      removeEventListener('hashchange', fromHash);
      document.removeEventListener('click', onClick);
      removeEventListener('wheel', unpin);
      removeEventListener('touchmove', unpin);
      removeEventListener('keydown', onKey);
    };
  }, [headings]);

  return active;
}
