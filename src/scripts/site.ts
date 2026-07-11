type SearchItem = {
  title: string;
  summary: string;
  tags: string[];
  kind: 'paper' | 'note';
  url: string;
  date: string;
  venue?: string;
};

type SignalNode = {
  x: number;
  y: number;
  phase: number;
  depth: number;
  size: number;
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function initPageProgress() {
  const root = document.documentElement;
  let ticking = false;

  const update = () => {
    const range = Math.max(1, root.scrollHeight - window.innerHeight);
    root.style.setProperty('--page-progress', String(clamp(window.scrollY / range)));
    ticking = false;
  };

  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  update();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });
}

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  let previous = window.scrollY;
  let ticking = false;

  const update = () => {
    const current = window.scrollY;
    header.dataset.scrolled = String(current > 10);

    if (current > previous && current > 160 && current - previous > 2) {
      header.dataset.hidden = 'true';
    } else if (current < previous - 2 || current < 100) {
      header.dataset.hidden = 'false';
    }

    previous = current;
    ticking = false;
  };

  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
}

function initTheme() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  if (!buttons.length) return;

  const sync = () => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    buttons.forEach((button) => {
      button.dataset.themeState = current;
      button.setAttribute('aria-label', `Switch to ${next} theme`);
      button.title = `Switch to ${next} theme`;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('kkubuck-theme', next);
      sync();
      document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    });
  });

  sync();
}

function initMobileNavigation() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-mobile-nav]');
  if (!toggle || !nav) return;

  const setOpen = (open: boolean) => {
    nav.dataset.open = String(open);
    document.documentElement.dataset.menuOpen = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };

  toggle.addEventListener('click', () => setOpen(nav.dataset.open !== 'true'));
  nav.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) setOpen(false);
  });
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
  addEventListener('resize', () => {
    if (window.innerWidth > 1040) setOpen(false);
  });
}

function initSearch() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-search-dialog]');
  const input = dialog?.querySelector<HTMLInputElement>('[data-search-input]');
  const list = dialog?.querySelector<HTMLUListElement>('[data-search-results]');
  const empty = dialog?.querySelector<HTMLElement>('[data-search-empty]');
  const hint = dialog?.querySelector<HTMLElement>('[data-search-hint]');
  const close = dialog?.querySelector<HTMLButtonElement>('[data-search-close]');
  const openers = document.querySelectorAll<HTMLButtonElement>('[data-search-open]');
  if (!dialog || !input || !list || !empty || !hint || !close || !openers.length) return;

  let items: SearchItem[] | null = null;
  let loading: Promise<SearchItem[]> | null = null;
  let selected = -1;
  let returnFocus: HTMLElement | null = null;

  const load = () => {
    if (items) return Promise.resolve(items);
    if (!loading) {
      const url = dialog.dataset.indexUrl || '/search.json';
      loading = fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error(`Search index returned ${response.status}`);
          return response.json() as Promise<SearchItem[]>;
        })
        .then((payload) => {
          items = payload;
          return payload;
        });
    }
    return loading;
  };

  const getAnchors = () => Array.from(list.querySelectorAll<HTMLAnchorElement>('a'));

  const setSelected = (index: number) => {
    const anchors = getAnchors();
    if (!anchors.length) {
      selected = -1;
      return;
    }
    selected = (index + anchors.length) % anchors.length;
    anchors.forEach((anchor, i) => anchor.setAttribute('aria-selected', String(i === selected)));
    anchors[selected]?.scrollIntoView({ block: 'nearest' });
  };

  const render = (results: SearchItem[], query: string) => {
    list.replaceChildren();
    selected = -1;
    hint.hidden = query.length > 0;
    empty.hidden = results.length > 0 || query.length === 0;

    for (const item of results.slice(0, 12)) {
      const li = document.createElement('li');
      li.className = 'search-result';
      const anchor = document.createElement('a');
      anchor.href = item.url;
      anchor.setAttribute('aria-selected', 'false');

      const content = document.createElement('span');
      const title = document.createElement('strong');
      title.textContent = item.title;
      const summary = document.createElement('p');
      summary.textContent = item.summary;
      content.append(title, summary);

      const type = document.createElement('span');
      type.className = 'search-result__type';
      type.textContent = item.kind === 'paper' ? item.venue || 'Paper' : 'Note';
      anchor.append(content, type);
      li.append(anchor);
      list.append(li);
    }
  };

  const search = async () => {
    const query = normalize(input.value);
    if (!query) {
      render([], '');
      return;
    }

    const tokens = query.split(/\s+/).filter(Boolean);
    const data = await load();
    const ranked = data
      .map((item) => {
        const title = normalize(item.title);
        const summary = normalize(item.summary);
        const tags = normalize(item.tags.join(' '));
        const venue = normalize(item.venue || '');
        let score = 0;
        for (const token of tokens) {
          if (title === token) score += 20;
          if (title.includes(token)) score += 9;
          if (tags.includes(token)) score += 6;
          if (venue.includes(token)) score += 4;
          if (summary.includes(token)) score += 2;
        }
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date))
      .map(({ item }) => item);

    render(ranked, query);
  };

  const open = (source?: HTMLElement) => {
    returnFocus = source || (document.activeElement as HTMLElement | null);
    if (!dialog.open) dialog.showModal();
    input.value = '';
    render([], '');
    requestAnimationFrame(() => input.focus());
    void load().catch(() => {
      empty.hidden = false;
      empty.textContent = 'Search index could not be loaded.';
    });
  };

  const dismiss = () => {
    dialog.close();
    returnFocus?.focus();
  };

  openers.forEach((button) => button.addEventListener('click', () => open(button)));
  close.addEventListener('click', dismiss);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dismiss();
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    dismiss();
  });
  dialog.addEventListener('close', () => returnFocus?.focus());
  input.addEventListener('input', () => void search());
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelected(selected + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelected(selected - 1);
    } else if (event.key === 'Enter' && selected >= 0) {
      event.preventDefault();
      getAnchors()[selected]?.click();
    }
  });

  addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog.open) {
      event.preventDefault();
      dismiss();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      dialog.open ? dismiss() : open();
    }
  });
}

class SignalField {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private host: HTMLElement;
  private nodes: SignalNode[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private pointer = { x: 0.5, y: 0.5, active: false };
  private scroll = 0;
  private targetScroll = 0;
  private raf = 0;
  private visible = true;
  private lastFrame = 0;
  private ripples: Array<{ x: number; y: number; started: number }> = [];
  private observer: IntersectionObserver;
  private resizeObserver: ResizeObserver;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context is unavailable');
    this.canvas = canvas;
    this.context = context;
    this.host = canvas.parentElement || canvas;
    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = Boolean(entry?.isIntersecting);
      if (this.visible) this.start();
      else this.stop();
    });
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.bind();
    this.resize();
    this.observer.observe(this.host);
    this.resizeObserver.observe(this.host);
    this.render(performance.now());
    if (!reduceMotion.matches) this.start();
  }

  private bind() {
    this.host.addEventListener('pointermove', (event) => {
      const rect = this.host.getBoundingClientRect();
      this.pointer.x = clamp((event.clientX - rect.left) / rect.width);
      this.pointer.y = clamp((event.clientY - rect.top) / rect.height);
      this.pointer.active = true;
    });
    this.host.addEventListener('pointerleave', () => {
      this.pointer.active = false;
    });
    this.host.addEventListener('pointerdown', (event) => {
      const rect = this.host.getBoundingClientRect();
      this.ripples.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        started: performance.now()
      });
      if (this.ripples.length > 4) this.ripples.shift();
    });
    addEventListener(
      'scroll',
      () => {
        this.targetScroll = clamp(window.scrollY / Math.max(1, window.innerHeight * 1.4));
      },
      { passive: true }
    );
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop();
      else if (this.visible && !reduceMotion.matches) this.start();
    });
    document.addEventListener('themechange', () => this.render(performance.now()));
    reduceMotion.addEventListener('change', () => {
      if (reduceMotion.matches) {
        this.stop();
        this.render(performance.now());
      } else if (this.visible) {
        this.start();
      }
    });
  }

  private resize() {
    const rect = this.host.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.dpr = Math.min(1.6, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.seed();
    this.render(performance.now());
  }

  private seed() {
    const count = this.width < 520 ? 40 : this.width < 900 ? 58 : 78;
    this.nodes = Array.from({ length: count }, (_, index) => {
      const golden = 2.399963229728653;
      const radius = Math.sqrt((index + 0.5) / count) * 0.47;
      const angle = index * golden;
      return {
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius,
        phase: (index * 0.73) % (Math.PI * 2),
        depth: 0.35 + ((index * 17) % 53) / 70,
        size: 0.8 + ((index * 13) % 11) / 10
      };
    });
  }

  private start() {
    if (this.raf || reduceMotion.matches || !this.visible) return;
    this.raf = requestAnimationFrame((time) => this.loop(time));
  }

  private stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private loop(time: number) {
    this.raf = 0;
    if (!this.visible || document.hidden || reduceMotion.matches) return;
    if (time - this.lastFrame >= 1000 / 42) {
      this.lastFrame = time;
      this.render(time);
    }
    this.start();
  }

  private render(time: number) {
    const ctx = this.context;
    const style = getComputedStyle(document.documentElement);
    const dot = style.getPropertyValue('--canvas-dot').trim();
    const line = style.getPropertyValue('--canvas-line').trim();
    const wave = style.getPropertyValue('--canvas-wave').trim();
    const accentSoft = style.getPropertyValue('--accent-soft').trim();

    ctx.clearRect(0, 0, this.width, this.height);
    this.scroll += (this.targetScroll - this.scroll) * 0.055;

    const points = this.nodes.map((node) => {
      const motion = reduceMotion.matches ? 0 : 1;
      const t = time * 0.00018;
      const orbit = node.phase + t * (0.38 + node.depth * 0.3) + this.scroll * 1.6;
      let x = node.x * this.width + Math.cos(orbit) * 10 * node.depth * motion;
      let y = node.y * this.height + Math.sin(orbit * 1.17) * 8 * node.depth * motion;

      if (this.pointer.active && motion) {
        const px = this.pointer.x * this.width;
        const py = this.pointer.y * this.height;
        const dx = x - px;
        const dy = y - py;
        const distance = Math.hypot(dx, dy) || 1;
        const influence = clamp(1 - distance / Math.min(this.width, this.height) / 0.42);
        x += (dx / distance) * influence * 25 * node.depth;
        y += (dy / distance) * influence * 25 * node.depth;
      }
      return { x, y, size: node.size, depth: node.depth };
    });

    ctx.lineWidth = 0.75;
    ctx.strokeStyle = line;
    const threshold = Math.min(this.width, this.height) * 0.18;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        if (!a || !b) continue;
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < threshold) {
          ctx.globalAlpha = (1 - distance / threshold) * 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    for (const point of points) {
      ctx.beginPath();
      ctx.fillStyle = dot;
      ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.pointer.active && !reduceMotion.matches) {
      const px = this.pointer.x * this.width;
      const py = this.pointer.y * this.height;
      const gradient = ctx.createRadialGradient(px, py, 0, px, py, 72);
      gradient.addColorStop(0, accentSoft);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(px, py, 72, 0, Math.PI * 2);
      ctx.fill();
    }

    this.ripples = this.ripples.filter((ripple) => {
      const progress = (time - ripple.started) / 900;
      if (progress >= 1) return false;
      ctx.strokeStyle = wave;
      ctx.globalAlpha = 1 - progress;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, 8 + progress * 90, 0, Math.PI * 2);
      ctx.stroke();
      return true;
    });
    ctx.globalAlpha = 1;
  }
}

function initSignalFields() {
  document.querySelectorAll<HTMLCanvasElement>('[data-signal-canvas]').forEach((canvas) => {
    try {
      new SignalField(canvas);
    } catch (error) {
      console.warn('Signal field disabled:', error);
    }
  });
}

function initNarrative() {
  document.querySelectorAll<HTMLElement>('[data-narrative]').forEach((section) => {
    const stage = section.querySelector<HTMLElement>('[data-narrative-stage]');
    const phase = section.querySelector<HTMLElement>('[data-narrative-phase]');
    const core = section.querySelector<HTMLElement>('[data-narrative-core]');
    const steps = Array.from(section.querySelectorAll<HTMLElement>('[data-narrative-step]'));
    if (!stage || !phase || !core || !steps.length) return;

    let ticking = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / range);
      stage.style.setProperty('--scene-progress', String(progress));
      ticking = false;
    };
    const request = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const element = visible.target as HTMLElement;
        const index = steps.indexOf(element);
        steps.forEach((step) => step.removeAttribute('aria-current'));
        element.setAttribute('aria-current', 'step');
        phase.textContent = element.dataset.phase || `Phase ${index + 1}`;
        core.textContent = element.dataset.core || element.dataset.phase || '';
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: [0.15, 0.4, 0.7] }
    );
    steps.forEach((step) => observer.observe(step));
  });
}

function initReveal() {
  if (CSS.supports('animation-timeline: view()')) return;
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!elements.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  elements.forEach((element) => observer.observe(element));
}

function initPointerTilt() {
  if (!finePointer.matches || reduceMotion.matches) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width);
      const y = clamp((event.clientY - rect.top) / rect.height);
      card.style.setProperty('--tilt-x', `${(0.5 - y) * 1.6}deg`);
      card.style.setProperty('--tilt-y', `${(x - 0.5) * 1.8}deg`);
      card.style.setProperty('--hover-x', `${x * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--hover-x', '50%');
    });
  });
}

function initArchiveFilters() {
  document.querySelectorAll<HTMLElement>('[data-archive]').forEach((archive) => {
    const input = archive.querySelector<HTMLInputElement>('[data-filter-query]');
    const year = archive.querySelector<HTMLSelectElement>('[data-filter-year]');
    const venue = archive.querySelector<HTMLSelectElement>('[data-filter-venue]');
    const rows = Array.from(archive.querySelectorAll<HTMLElement>('[data-filter-row]'));
    const count = archive.querySelector<HTMLElement>('[data-filter-count]');
    const empty = archive.querySelector<HTMLElement>('[data-filter-empty]');
    if (!input || !year || !venue || !count || !empty) return;

    const params = new URLSearchParams(location.search);
    input.value = params.get('q') || '';
    year.value = params.get('year') || '';
    venue.value = params.get('venue') || '';

    const apply = () => {
      const query = normalize(input.value);
      const selectedYear = year.value;
      const selectedVenue = normalize(venue.value);
      let visible = 0;

      rows.forEach((row) => {
        const text = normalize(row.dataset.search || row.textContent || '');
        const rowYear = row.dataset.year || '';
        const rowVenue = normalize(row.dataset.venue || '');
        const matches =
          (!query || query.split(/\s+/).every((token) => text.includes(token))) &&
          (!selectedYear || rowYear === selectedYear) &&
          (!selectedVenue || rowVenue === selectedVenue);
        row.hidden = !matches;
        if (matches) visible += 1;
      });

      count.textContent = `${visible} ${visible === 1 ? 'entry' : 'entries'}`;
      empty.hidden = visible !== 0;

      const next = new URL(location.href);
      input.value ? next.searchParams.set('q', input.value) : next.searchParams.delete('q');
      selectedYear ? next.searchParams.set('year', selectedYear) : next.searchParams.delete('year');
      venue.value ? next.searchParams.set('venue', venue.value) : next.searchParams.delete('venue');
      history.replaceState(null, '', `${next.pathname}${next.search}${next.hash}`);
    };

    input.addEventListener('input', apply);
    year.addEventListener('change', apply);
    venue.addEventListener('change', apply);
    apply();
  });
}

function initArticle() {
  const article = document.querySelector<HTMLElement>('[data-article]');
  if (!article) return;

  article.querySelectorAll<HTMLTableElement>('table').forEach((table) => {
    if (table.parentElement?.classList.contains('table-wrapper')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', 'Scrollable table');
    table.before(wrapper);
    wrapper.append(table);
  });

  article.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
    try {
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
    } catch {
      // Ignore malformed links already visible in the source article.
    }
  });

  const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
  const headings = tocLinks
    .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
    .filter((heading): heading is HTMLElement => Boolean(heading));

  if (headings.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!current) return;
        tocLinks.forEach((link) => {
          const active = link.hash === `#${current.target.id}`;
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      },
      { rootMargin: '-18% 0px -70% 0px', threshold: [0, 1] }
    );
    headings.forEach((heading) => observer.observe(heading));
  }

  document.querySelectorAll<HTMLButtonElement>('[data-copy-link]').forEach((button) => {
    button.addEventListener('click', async () => {
      const original = button.textContent || 'Copy link';
      try {
        await navigator.clipboard.writeText(location.href);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Copy failed';
      }
      setTimeout(() => {
        button.textContent = original;
      }, 1600);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-share]').forEach((button) => {
    button.addEventListener('click', async () => {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: location.href }).catch(() => undefined);
      } else {
        document.querySelector<HTMLButtonElement>('[data-copy-link]')?.click();
      }
    });
  });
}

function init() {
  initPageProgress();
  initHeader();
  initTheme();
  initMobileNavigation();
  initSearch();
  initSignalFields();
  initNarrative();
  initReveal();
  initPointerTilt();
  initArchiveFilters();
  initArticle();
}

init();
