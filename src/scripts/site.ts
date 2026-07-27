/**
 * Client behaviour for the archive.
 *
 * Scope is deliberately narrow: every function here backs a feature a reader
 * actually operates. There is no scroll-driven storytelling, no pointer
 * parallax, and no decorative canvas.
 */

type SearchItem = {
  title: string;
  summary: string;
  tags: string[];
  kind: 'paper' | 'note';
  url: string;
  date: string;
  venue?: string;
};

const THEME_KEY = 'kkubuck-theme';
const MAX_RESULTS = 10;

/** Fold case, strip diacritics, and reduce punctuation to spaces. */
function normalize(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  const normalized = normalize(value);
  return normalized ? normalized.split(' ') : [];
}

/* -------------------------------------------------------------------------- */
/* Theme                                                                      */
/* -------------------------------------------------------------------------- */

function initTheme(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  if (!buttons.length) return;

  const label = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const text = `Switch to ${next} theme`;
    buttons.forEach((button) => {
      button.setAttribute('aria-label', text);
      button.title = text;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* Private browsing denies writes; the in-page choice still applies. */
      }
      label();
    });
  });

  label();
}

/* -------------------------------------------------------------------------- */
/* Mobile navigation                                                          */
/* -------------------------------------------------------------------------- */

function initMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-mobile-nav]');
  if (!toggle || !nav) return;

  const setOpen = (open: boolean) => {
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.dataset.navOpen = String(open);
  };

  toggle.addEventListener('click', () => setOpen(nav.dataset.open !== 'true'));

  nav.addEventListener('click', (event) => {
    if ((event.target as Element | null)?.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.dataset.open === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Collapse when the layout crosses back into the desktop navigation.
  matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/* -------------------------------------------------------------------------- */
/* Global search                                                              */
/* -------------------------------------------------------------------------- */

function scoreItem(item: SearchItem, tokens: string[]): number {
  const title = normalize(item.title);
  const tags = normalize(item.tags.join(' '));
  const venue = normalize(item.venue ?? '');
  const summary = normalize(item.summary);

  let score = 0;
  for (const token of tokens) {
    let matched = 0;
    if (title.startsWith(token)) matched += 12;
    else if (title.includes(token)) matched += 8;
    if (tags.includes(token)) matched += 5;
    if (venue.includes(token)) matched += 4;
    if (summary.includes(token)) matched += 2;
    // Every token must contribute, so the query behaves as AND.
    if (matched === 0) return 0;
    score += matched;
  }
  return score;
}

function initSearch(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-search-dialog]');
  if (!dialog) return;

  const input = dialog.querySelector<HTMLInputElement>('[data-search-input]');
  const list = dialog.querySelector<HTMLUListElement>('[data-search-results]');
  const message = dialog.querySelector<HTMLElement>('[data-search-message]');
  const closeButton = dialog.querySelector<HTMLButtonElement>('[data-search-close]');
  const openers = document.querySelectorAll<HTMLElement>('[data-search-open]');
  if (!input || !list || !message) return;

  let items: SearchItem[] | null = null;
  let pending: Promise<SearchItem[]> | null = null;
  let selected = -1;
  let restoreFocus: HTMLElement | null = null;

  const load = (): Promise<SearchItem[]> => {
    if (items) return Promise.resolve(items);
    if (!pending) {
      const url = dialog.dataset.indexUrl || '/search.json';
      pending = fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error(`Search index responded ${response.status}`);
          return response.json() as Promise<SearchItem[]>;
        })
        .then((payload) => {
          items = payload;
          return payload;
        })
        .catch((error: unknown) => {
          pending = null;
          throw error;
        });
    }
    return pending;
  };

  const anchors = () => Array.from(list.querySelectorAll<HTMLAnchorElement>('a'));

  const select = (index: number) => {
    const options = anchors();
    if (!options.length) {
      selected = -1;
      input.removeAttribute('aria-activedescendant');
      return;
    }
    selected = (index + options.length) % options.length;
    options.forEach((anchor, position) => {
      anchor.setAttribute('aria-selected', String(position === selected));
    });
    const active = options[selected];
    if (active) {
      input.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    }
  };

  const setMessage = (text: string | null) => {
    message.textContent = text ?? '';
    message.hidden = text === null;
  };

  const render = (results: SearchItem[], query: string) => {
    list.replaceChildren();
    selected = -1;
    input.removeAttribute('aria-activedescendant');
    input.setAttribute('aria-expanded', String(Boolean(query) && results.length > 0));

    if (!query) {
      setMessage('Search titles, venues, and tags.');
      return;
    }
    if (!results.length) {
      setMessage('No matching entry.');
      return;
    }
    setMessage(null);

    const fragment = document.createDocumentFragment();
    results.slice(0, MAX_RESULTS).forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'search-result';
      // The listbox owns the options directly; the li is only a layout hook.
      li.setAttribute('role', 'presentation');

      const anchor = document.createElement('a');
      anchor.id = `search-result-${index}`;
      anchor.href = item.url;
      anchor.setAttribute('role', 'option');
      anchor.setAttribute('aria-selected', 'false');

      const title = document.createElement('strong');
      title.textContent = item.title;
      anchor.append(title);

      if (item.summary) {
        const summary = document.createElement('p');
        summary.textContent = item.summary;
        anchor.append(summary);
      }

      const badge = document.createElement('span');
      badge.className = 'search-result__badge';
      badge.textContent = item.kind === 'paper' ? item.venue || 'Paper' : 'Note';
      anchor.append(badge);

      li.append(anchor);
      fragment.append(li);
    });
    list.append(fragment);
  };

  const run = async () => {
    const tokens = tokenize(input.value);
    if (!tokens.length) {
      render([], '');
      return;
    }
    try {
      const data = await load();
      const results = data
        .map((item) => ({ item, score: scoreItem(item, tokens) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date))
        .map(({ item }) => item);
      render(results, input.value);
    } catch {
      list.replaceChildren();
      setMessage('Search index unavailable. Browse the archive instead.');
    }
  };

  const open = (source?: HTMLElement) => {
    restoreFocus = source ?? (document.activeElement as HTMLElement | null);
    if (!dialog.open) dialog.showModal();
    input.value = '';
    render([], '');
    input.focus();
    // Warm the index so the first keystroke renders without a visible wait.
    void load().catch(() => setMessage('Search index unavailable.'));
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  openers.forEach((opener) => opener.addEventListener('click', () => open(opener)));
  closeButton?.addEventListener('click', close);

  // Clicking the backdrop resolves to the dialog element itself.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener('close', () => {
    restoreFocus?.focus();
    restoreFocus = null;
  });

  input.addEventListener('input', () => void run());

  input.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        select(selected + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        select(selected - 1);
        break;
      case 'Enter':
        if (selected >= 0) {
          event.preventDefault();
          anchors()[selected]?.click();
        }
        break;
      default:
        break;
    }
  });

  document.addEventListener('keydown', (event) => {
    const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (isShortcut) {
      event.preventDefault();
      if (dialog.open) close();
      else open();
      return;
    }
    // "/" is a familiar search shortcut, but must not hijack real typing.
    const target = event.target as HTMLElement | null;
    const typing = target?.closest('input, textarea, select, [contenteditable]');
    if (event.key === '/' && !typing && !dialog.open) {
      event.preventDefault();
      open();
    }
  });
}

/** The markup ships the macOS glyph; correct it for everyone else. */
function initShortcutHint(): void {
  const hints = document.querySelectorAll<HTMLElement>('[data-shortcut-hint]');
  if (!hints.length) return;
  const apple = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
  if (apple) return;
  hints.forEach((hint) => {
    hint.textContent = 'Ctrl K';
  });
}

/* -------------------------------------------------------------------------- */
/* Archive filters                                                            */
/* -------------------------------------------------------------------------- */

function initFilters(): void {
  const archive = document.querySelector<HTMLElement>('[data-archive]');
  if (!archive) return;

  const query = archive.querySelector<HTMLInputElement>('[data-filter-query]');
  const year = archive.querySelector<HTMLSelectElement>('[data-filter-year]');
  const count = archive.querySelector<HTMLElement>('[data-filter-count]');
  const empty = archive.querySelector<HTMLElement>('[data-filter-empty]');
  if (!query || !year || !count || !empty) return;

  // Rendered only when the archive holds more than one venue.
  const venue = archive.querySelector<HTMLSelectElement>('[data-filter-venue]');
  const reset = archive.querySelector<HTMLButtonElement>('[data-filter-reset]');
  const rows = Array.from(archive.querySelectorAll<HTMLElement>('[data-filter-row]'));

  const params = new URLSearchParams(location.search);
  query.value = params.get('q') ?? '';

  // Guard against stale or hand-edited query strings.
  const setIfPresent = (select: HTMLSelectElement | null, value: string | null) => {
    if (!select || !value) return;
    if ([...select.options].some((option) => option.value === value)) select.value = value;
  };
  setIfPresent(year, params.get('year'));
  setIfPresent(venue, params.get('venue'));

  const apply = (writeUrl = true) => {
    const tokens = tokenize(query.value);
    const wantedYear = year.value;
    const wantedVenue = normalize(venue?.value ?? '');
    let visible = 0;

    for (const row of rows) {
      const haystack = normalize(row.dataset.search ?? row.textContent ?? '');
      const matches =
        tokens.every((token) => haystack.includes(token)) &&
        (!wantedYear || row.dataset.year === wantedYear) &&
        (!wantedVenue || normalize(row.dataset.venue ?? '') === wantedVenue);
      row.hidden = !matches;
      if (matches) visible += 1;
    }

    count.textContent = `${visible} ${visible === 1 ? 'entry' : 'entries'}`;
    empty.hidden = visible > 0;
    if (reset) reset.hidden = !query.value && !wantedYear && !venue?.value;

    if (!writeUrl) return;
    const next = new URL(location.href);
    const sync = (key: string, value: string) => {
      if (value) next.searchParams.set(key, value);
      else next.searchParams.delete(key);
    };
    sync('q', query.value.trim());
    sync('year', wantedYear);
    sync('venue', venue?.value ?? '');
    history.replaceState(null, '', `${next.pathname}${next.search}`);
  };

  query.addEventListener('input', () => apply());
  year.addEventListener('change', () => apply());
  venue?.addEventListener('change', () => apply());
  reset?.addEventListener('click', () => {
    query.value = '';
    year.value = '';
    if (venue) venue.value = '';
    apply();
    query.focus();
  });

  apply(false);
}

/* -------------------------------------------------------------------------- */
/* Article enhancements                                                       */
/* -------------------------------------------------------------------------- */

function enhanceTables(article: HTMLElement): void {
  for (const table of article.querySelectorAll<HTMLTableElement>('table')) {
    if (table.parentElement?.classList.contains('table-scroll')) continue;
    const scroller = document.createElement('div');
    scroller.className = 'table-scroll';
    scroller.tabIndex = 0;
    scroller.setAttribute('role', 'region');
    scroller.setAttribute('aria-label', 'Table, scrolls horizontally');
    table.before(scroller);
    scroller.append(table);
  }
}

function enhanceExternalLinks(article: HTMLElement): void {
  for (const anchor of article.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    try {
      if (new URL(anchor.href, location.href).origin !== location.origin) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
    } catch {
      /* Malformed hrefs in imported markup are left exactly as authored. */
    }
  }
}

function enhanceCodeBlocks(article: HTMLElement): void {
  if (!navigator.clipboard) return;

  for (const pre of article.querySelectorAll<HTMLPreElement>('pre')) {
    if (pre.parentElement?.classList.contains('code-block')) continue;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.before(wrapper);
    wrapper.append(pre);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code');

    let timer: number | undefined;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ''));
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Failed';
      }
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.textContent = 'Copy';
      }, 1500);
    });

    wrapper.append(button);
  }
}

/**
 * The contents list is one `<details>` serving two layouts: a collapsed
 * disclosure on small screens, an always-open sticky rail from 1024px. CSS
 * cannot force a `<details>` open, so the state is set here.
 */
function initTocDisclosure(): void {
  const toc = document.querySelector<HTMLDetailsElement>('[data-toc]');
  if (!toc) return;

  const wide = matchMedia('(min-width: 1024px)');
  const sync = () => {
    toc.open = wide.matches;
  };

  sync();
  wide.addEventListener('change', sync);

  // On a phone the list has done its job once a section is chosen.
  toc.addEventListener('click', (event) => {
    if (wide.matches) return;
    if ((event.target as Element | null)?.closest('a')) toc.open = false;
  });
}

function initTocHighlight(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
  if (links.length < 2) return;

  const headings = links
    .map((link) => {
      const id = decodeURIComponent(link.hash.slice(1));
      const heading = document.getElementById(id);
      return heading ? { link, heading } : null;
    })
    .filter((pair): pair is { link: HTMLAnchorElement; heading: HTMLElement } => pair !== null);
  if (!headings.length) return;

  const setActive = (active: HTMLElement) => {
    for (const { link, heading } of headings) {
      if (heading === active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const onscreen = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (onscreen) setActive(onscreen.target as HTMLElement);
    },
    { rootMargin: '-15% 0px -72% 0px' }
  );

  for (const { heading } of headings) observer.observe(heading);
}

function initCopyLink(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy-link]')) {
    const original = button.textContent ?? 'Copy link';
    let timer: number | undefined;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        button.textContent = 'Link copied';
      } catch {
        button.textContent = 'Copy failed';
      }
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.textContent = original;
      }, 1600);
    });
  }
}

/**
 * Fallback for the reading indicator.
 *
 * Where Scroll-Driven Animations are available the bar is driven entirely in
 * CSS and this listener never attaches. It also runs under reduced-motion,
 * because the stylesheet disables the CSS animation in that mode.
 */
function initReadProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-read-progress]');
  if (!bar) return;

  const cssDriven =
    CSS.supports('animation-timeline: scroll()') &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cssDriven) return;

  const root = document.documentElement;
  let queued = false;

  const update = () => {
    queued = false;
    const range = root.scrollHeight - window.innerHeight;
    const ratio = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    root.style.setProperty('--read-progress', ratio.toFixed(4));
  };

  const request = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  update();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });
}

function initArticle(): void {
  const article = document.querySelector<HTMLElement>('[data-article]');
  if (!article) return;
  enhanceTables(article);
  enhanceExternalLinks(article);
  enhanceCodeBlocks(article);
  initTocDisclosure();
  initTocHighlight();
  initReadProgress();
}

/* -------------------------------------------------------------------------- */

initTheme();
initMobileNav();
initSearch();
initShortcutHint();
initFilters();
initArticle();
initCopyLink();
