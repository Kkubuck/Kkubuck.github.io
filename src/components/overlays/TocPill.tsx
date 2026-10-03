'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { getGlassLight, Glass } from '@/components/glass';
import { keepParens } from '@/lib/keep-parens';
import type { Heading } from '@/lib/rehype-plugins';

interface TocPillProps {
  headings: Heading[];
  /** Index of the section being read (-1 before the first heading). */
  active: number;
}

/**
 * Screens < 1180px: a frosted glass pill "n/N · heading" pinned to the bottom edge.
 * It slides in once the first section is reached and opens a frosted bottom sheet
 * with the whole outline. Opening moves focus to the current entry (the sheet precedes
 * the pill in the DOM, so Tab then walks the outline and ends on the pill). Light
 * dismiss (outside press, Esc, focus leaving the pill and sheet) closes it; Esc returns
 * focus to the pill.
 * Both surfaces are frosted only — no backdrop refraction (FINAL_SPEC glass budget).
 * Client-only: nothing is server-rendered, so the no-JS page has just the article.
 */
export function TocPill({ headings, active }: TocPillProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetId = useId();

  useEffect(() => setMounted(true), []);

  // Light dismiss: a press outside, Esc, or the layout widening to the rail.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const wide = matchMedia('(min-width: 1180px)');
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  // Opening scrolls the current entry into view inside the sheet and moves focus to it.
  useEffect(() => {
    if (!open) return;
    const entry =
      rootRef.current?.querySelector<HTMLElement>('.tocsheet [aria-current]') ??
      rootRef.current?.querySelector<HTMLElement>('.tocsheet a');
    entry?.scrollIntoView({ block: 'nearest' });
    entry?.focus({ preventScroll: true });
  }, [open]);

  // The sheet and pill are glass: shade them once they can be seen (the light store
  // skips hidden and off-screen chrome), after the slide/open transition too.
  const shown = active >= 0;
  useEffect(() => {
    const light = getGlassLight();
    if (!light) return;
    light.refreshAll();
    const timer = window.setTimeout(() => light.refreshAll(), 520);
    return () => window.clearTimeout(timer);
  }, [open, shown]);

  if (!mounted || headings.length === 0) return null;

  const current = active >= 0 ? headings[active] : undefined;

  return (
    <div
      ref={rootRef}
      className="tocpill"
      data-on={shown || open ? '' : undefined}
      data-open={open ? '' : undefined}
      onBlur={(event) => {
        // Focus left the pill and the sheet (Tab past the last entry, Shift+Tab out): close.
        if (open && !event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <Glass as="nav" variant="tocsheet" id={sheetId} className="tocsheet" aria-label="목차" inert={!open}>
        <p className="tocsheet__label" aria-hidden="true">
          목차
        </p>
        <ol>
          {headings.map((heading, index) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={heading.depth === 3 ? 'l3' : undefined}
                aria-current={index === active ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                {keepParens(heading.text, 12)}
              </a>
            </li>
          ))}
        </ol>
      </Glass>
      <Glass
        as="button"
        type="button"
        variant="pill"
        ref={buttonRef}
        className="tocpill__btn"
        aria-expanded={open}
        aria-controls={sheetId}
        tabIndex={shown || open ? 0 : -1}
        aria-hidden={shown || open ? undefined : true}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="tocpill__count tabular" aria-hidden="true">
          <b>{Math.max(1, active + 1)}</b>/{headings.length}
        </span>
        <span className="tocpill__text">{current?.text ?? headings[0]!.text}</span>
        <span className="sr-only">
          , 목차 {headings.length}개 중 {Math.max(1, active + 1)}번째
        </span>
        <svg className="tocpill__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M4 10l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Glass>
    </div>
  );
}
