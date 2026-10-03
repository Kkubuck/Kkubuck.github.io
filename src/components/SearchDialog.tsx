'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import { Glass } from '@/components/glass';
import { onOpenSearch, onSearchIntent } from '@/lib/chrome-events';
import { BASE_PATH, routes, withBase } from '@/lib/paths';
import type { SearchRecord } from '@/lib/posts';
import { SearchIcon } from './icons';

const MAX_RESULTS = 12;
const RECENT = 8;
const CLOSE_MS = 160; // matches the sheet's fade-out in overlays.css

/** Lowercase, NFKC, punctuation → space. Korean is matched as plain substrings. */
function normalize(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** A lone jamo: a Korean syllable still being composed ("검색 ㅇ" on the way to "검색 알"). */
const TRAILING_JAMO = /[\u1100-\u11FF\u3131-\u318E]+$/u;

function tokenize(query: string): string[] {
  return normalize(query.replace(TRAILING_JAMO, '')).split(' ').filter(Boolean);
}

/** Same weights as the old site: every token must match somewhere. */
function score(item: SearchRecord, tokens: string[]): number {
  const title = normalize(item.title);
  const meta = normalize([item.description, item.category, item.venue ?? '', item.tags.join(' ')].join(' '));
  const text = normalize(item.text);
  let total = 0;
  for (const token of tokens) {
    let hit = 0;
    if (title.includes(token)) hit += title.startsWith(token) ? 12 : 8;
    if (meta.includes(token)) hit += 4;
    if (text.includes(token)) hit += 1;
    if (!hit) return 0;
    total += hit;
  }
  return total;
}

function search(items: SearchRecord[], query: string): SearchRecord[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  return items
    .map((item) => ({ item, value: score(item, tokens) }))
    .filter(({ value }) => value > 0)
    .sort((a, b) => b.value - a.value || b.item.date.localeCompare(a.item.date))
    .map(({ item }) => item);
}

/** Wraps every case-insensitive occurrence of a token in <mark> (styled in ink, not colour). */
function highlight(text: string, tokens: string[]): ReactNode {
  if (!tokens.length || !text) return text;
  const lower = text.toLocaleLowerCase();
  const ranges: Array<[number, number]> = [];
  for (const token of tokens) {
    let from = 0;
    for (let at = lower.indexOf(token, from); at !== -1; at = lower.indexOf(token, from)) {
      ranges.push([at, at + token.length]);
      from = at + token.length;
    }
  }
  if (!ranges.length) return text;
  ranges.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const merged: Array<[number, number]> = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  const parts: ReactNode[] = [];
  let cursor = 0;
  merged.forEach(([start, end], index) => {
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(<mark key={index}>{text.slice(start, end)}</mark>);
    cursor = end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <Fragment>{parts}</Fragment>;
}

/**
 * Why a row matched when the title alone doesn't show it: a short window of the
 * description (rows don't otherwise show it), else of the body text.
 */
function snippet(item: SearchRecord, tokens: string[]): string | null {
  const title = item.title.toLocaleLowerCase();
  const missing = tokens.filter((token) => !title.includes(token));
  if (!missing.length) return null;
  for (const source of [item.description, item.text]) {
    const lower = source.toLocaleLowerCase();
    const hits = missing.map((token) => lower.indexOf(token)).filter((index) => index >= 0);
    if (!hits.length) continue;
    const at = Math.min(...hits);
    const start = at <= 12 ? 0 : at - 12; // the line is clipped, so keep the match near its start
    const end = Math.min(source.length, start + 120);
    return `${start > 0 ? '…' : ''}${source.slice(start, end).trim()}${end < source.length ? '…' : ''}`;
  }
  return null;
}

/** search.json URLs carry the base path; next/link wants the route path. */
function toRoute(url: string): string {
  return BASE_PATH && url.startsWith(`${BASE_PATH}/`) ? url.slice(BASE_PATH.length) : url;
}

const dateLabel = (iso: string) => iso.slice(0, 10).replaceAll('-', '.');

type Status = 'idle' | 'loading' | 'ready' | 'error';

/**
 * ⌘K palette: a glass sheet in a native modal <dialog> (showModal → the page is
 * inert, focus is trapped, Esc closes) over a dim scrim.
 *  - /search.json is fetched lazily on intent: pointerenter/focus on the dock's
 *    search button (chrome-events searchIntent) or the first open.
 *  - Shortcuts: ⌘K / Ctrl+K (toggle) and "/" outside text fields.
 *  - Korean IME: Enter and arrows are ignored while a syllable is being composed; a
 *    trailing lone jamo is not searched for, and while composing, a query that matches
 *    nothing keeps the last results instead of flashing "no results". The live region
 *    is debounced and stays quiet during composition.
 *  - Empty query lists recent posts; matches are set in ink weight + underline.
 *  - Focus returns to whatever opened it; after opening a result, it moves to the new
 *    page's <main> once the route commits.
 * Any element with [data-search-open] also opens it.
 */
export function SearchDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const hlRef = useRef<HTMLSpanElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const loading = useRef<Promise<SearchRecord[]> | null>(null);
  const closeTimer = useRef(0);
  const focusMain = useRef(false);
  const shown = useRef<SearchRecord[]>([]);

  const [items, setItems] = useState<SearchRecord[] | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [composing, setComposing] = useState(false);
  const [announced, setAnnounced] = useState('');

  const load = useCallback(() => {
    if (items) return Promise.resolve(items);
    loading.current ??= fetch(withBase(routes.searchIndex()))
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<SearchRecord[]>;
      })
      .then((data) => {
        setItems(data);
        setStatus('ready');
        return data;
      })
      .catch((error: unknown) => {
        loading.current = null;
        setStatus('error');
        throw error;
      });
    setStatus((current) => (current === 'ready' ? current : 'loading'));
    return loading.current;
  }, [items]);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    window.clearTimeout(closeTimer.current);
    if (!dialog.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setQuery('');
      setSelected(0);
      dialog.showModal();
      // Next frame: from the closed styles to the open ones (transitions run).
      requestAnimationFrame(() => dialog.setAttribute('data-open', ''));
    } else dialog.setAttribute('data-open', '');
    inputRef.current?.focus();
    load().catch(() => undefined);
  }, [load]);

  /** Fade out, then close. `instant` for navigation and reduced motion. */
  const close = useCallback((instant = false) => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    dialog.removeAttribute('data-open');
    window.clearTimeout(closeTimer.current);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (instant || reduced) dialog.close();
    else closeTimer.current = window.setTimeout(() => dialog.close(), CLOSE_MS);
  }, []);

  // Global shortcuts and [data-search-open] triggers.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.isComposing || event.keyCode === 229) return;
      const dialog = dialogRef.current;
      if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (dialog?.open && dialog.hasAttribute('data-open')) close();
        else open();
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      const typing = target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
      if (event.key === '/' && !typing && !dialog?.open && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        open();
      }
    };
    const onClick = (event: MouseEvent) => {
      const trigger = event.target instanceof Element ? event.target.closest('[data-search-open]') : null;
      if (trigger) {
        event.preventDefault();
        open();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    // Hook points from the dock (src/lib/chrome-events.ts).
    const offOpen = onOpenSearch(open);
    const offIntent = onSearchIntent(() => void load().catch(() => undefined));
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
      offOpen();
      offIntent();
    };
  }, [open, close, load]);

  // Esc (cancel) fades out like every other close; focus returns to the opener.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      close();
    };
    const onClose = () => {
      dialog.removeAttribute('data-open');
      const opener = returnFocus.current;
      returnFocus.current = null;
      // Closed to open a result: focus goes to the new page (see the pathname effect), not the dock.
      if (focusMain.current) {
        if (dialog.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
      } else if (opener && opener !== document.body && opener.isConnected) opener.focus({ preventScroll: true });
      // Opened from the keyboard with nothing focused: don't leave focus in the closed sheet.
      else if (dialog.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
    };
    dialog.addEventListener('cancel', onCancel);
    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('cancel', onCancel);
      dialog.removeEventListener('close', onClose);
    };
  }, [close]);

  // After opening a result: once the new route has committed, focus its <main>.
  useEffect(() => {
    if (!focusMain.current) return;
    focusMain.current = false;
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);

  const tokens = useMemo(() => tokenize(query), [query]);
  const recent = useMemo(
    () => (items ? [...items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, RECENT) : []),
    [items]
  );
  const matches = useMemo(() => (items && tokens.length ? search(items, query) : []), [items, query, tokens]);
  let results = tokens.length ? matches.slice(0, MAX_RESULTS) : recent;
  // Mid-syllable a query can match nothing ("앍" on the way to "알고"): keep what was shown.
  const holding = composing && tokens.length > 0 && results.length === 0 && shown.current.length > 0;
  if (holding) results = shown.current;
  const active = results.length ? Math.min(selected, results.length - 1) : -1;
  useEffect(() => {
    shown.current = results;
  });

  // Results are not prefetched as they appear (every keystroke would fetch a screenful of
  // posts); the selected one is, once the selection rests for a moment. Hover goes through
  // IntentPrefetch.
  const selectedRoute = active >= 0 && results[active] ? toRoute(results[active]!.url) : null;
  useEffect(() => {
    if (!selectedRoute || !dialogRef.current?.open) return;
    const timer = window.setTimeout(() => router.prefetch(selectedRoute), 180);
    return () => window.clearTimeout(timer);
  }, [selectedRoute, router]);

  // The highlight slides (--ease-spring) to the selected row; the row scrolls into view.
  useLayoutEffect(() => {
    const hl = hlRef.current;
    const row = active >= 0 ? listRef.current?.children[active] : undefined;
    if (!hl) return;
    if (!(row instanceof HTMLElement)) {
      hl.style.opacity = '0';
      return;
    }
    const first = hl.style.opacity !== '1';
    if (first) hl.style.transition = 'none';
    hl.style.transform = `translateY(${row.offsetTop}px)`;
    hl.style.height = `${row.offsetHeight}px`;
    hl.style.opacity = '1';
    if (first) {
      void hl.offsetWidth;
      hl.style.transition = '';
    }
    row.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  /** Closing to open a result: focus moves to the new page's <main>, not back to the dock. */
  const leave = (item: SearchRecord) => {
    focusMain.current = true;
    const target = toRoute(item.url);
    // The same page: no route change will come to move focus, so do it now.
    if (target === pathname) {
      focusMain.current = false;
      requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }));
    }
  };

  const go = (item: SearchRecord) => {
    leave(item);
    close(true);
    router.push(toRoute(item.url));
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Korean IME: Enter/arrows confirm the syllable being composed; never act on them.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === 'Escape') {
      // A search field would spend the first Esc on clearing itself; the hint says esc closes.
      event.preventDefault();
      close();
      return;
    }
    if (!results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelected((active + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelected(active <= 0 ? results.length - 1 : active - 1);
    } else if (event.key === 'Enter') {
      const item = results[active];
      if (item) {
        event.preventDefault();
        go(item);
      }
    }
  };

  let message: string | null = null;
  if (status === 'error') message = '검색 목록을 불러오지 못했습니다.';
  else if (!items) message = '불러오는 중…';
  else if (tokens.length && !results.length) message = `‘${query.trim()}’에 맞는 글이 없습니다.`;

  const groupLabel = tokens.length ? (holding ? '결과' : `결과 ${matches.length}`) : '최근 글';
  const announce = message ?? (tokens.length ? `검색 결과 ${matches.length}개` : '');

  // The polite live region speaks once typing settles, never mid-syllable.
  useEffect(() => {
    if (composing) return;
    const timer = window.setTimeout(() => setAnnounced(announce), 300);
    return () => window.clearTimeout(timer);
  }, [announce, composing]);

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="글 검색"
      onClick={(event) => {
        // A press on the scrim lands on the full-viewport <dialog> itself.
        if (event.target === event.currentTarget) close();
      }}
    >
      <Glass as="div" variant="sheet" className="palette__panel">
        <div className="palette__head">
          <SearchIcon />
          <label className="sr-only" htmlFor="search-input">
            검색어
          </label>
          <input
            ref={inputRef}
            id="search-input"
            className="palette__input"
            type="search"
            enterKeyHint="go"
            placeholder="제목, 내용, 태그로 검색"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={onInputKeyDown}
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `search-result-${active}` : undefined}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {/* The visible "esc" starts the accessible name (label in name, WCAG 2.5.3). */}
          <button className="palette__esc" type="button" onClick={() => close()}>
            esc<span className="sr-only"> 닫기</span>
          </button>
        </div>

        {/* tabIndex -1: the list is driven from the input; the scroller is not a Tab stop. */}
        <div className="palette__body" tabIndex={-1}>
          {message === null ? (
            <p className="palette__group" aria-hidden="true">
              {groupLabel}
            </p>
          ) : (
            <p className="palette__empty">{message}</p>
          )}
          <div className="palette__listwrap">
            <span ref={hlRef} className="palette__hl" aria-hidden="true" />
            <ul ref={listRef} id="search-results" className="palette__list" role="listbox" aria-label={tokens.length ? '검색 결과' : '최근 글'}>
              {results.map((item, index) => {
                const extra = tokens.length ? snippet(item, tokens) : null;
                return (
                  <li key={item.url} role="presentation" className="palette__opt">
                    <Link
                      id={`search-result-${index}`}
                      href={toRoute(item.url)}
                      prefetch={false}
                      data-intent=""
                      role="option"
                      aria-selected={index === active}
                      tabIndex={-1}
                      onClick={() => {
                        leave(item);
                        close(true);
                      }}
                      onPointerMove={() => index !== active && setSelected(index)}
                    >
                      <span className="palette__optTitle">{highlight(item.title, tokens)}</span>
                      <span className="palette__optMeta">
                        {[item.category, item.venue, dateLabel(item.date)].filter(Boolean).join(' · ')}
                      </span>
                      {extra && <span className="palette__optSnip">{highlight(extra, tokens)}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="palette__foot" aria-hidden="true">
          <span>
            <kbd>↑↓</kbd>이동
          </span>
          <span>
            <kbd>↵</kbd>열기
          </span>
          <span>
            <kbd>esc</kbd>닫기
          </span>
          {items && <span className="palette__count tabular">글 {items.length}개</span>}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {announced}
        </p>
      </Glass>
    </dialog>
  );
}
