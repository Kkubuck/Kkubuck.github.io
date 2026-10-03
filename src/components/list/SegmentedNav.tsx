'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import {
  buildInIdle,
  buildMap,
  cachedMap,
  createSpring,
  DisplacementFilter,
  getGlassLight,
  GlassLayers,
  idle,
  snapSpring,
  SPRING,
  stepSpring,
  type GlassHandle,
  type MapSpec
} from '@/components/glass';

export interface SegmentTab {
  key: string;
  /** Route path, e.g. "/" or "/category/study/". */
  href: string;
  label: string;
  count: number;
}

const normalize = (path: string) => (path.endsWith('/') ? path : `${path}/`);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const LENS_PAD = 16; // filter region padding: the rim samples labels just beyond the lens edge
const MAX_DISPLACEMENT = 8; // feDisplacementMap scale: at most 4px at the rim
const TOUCH_ARM_MS = 170; // touch: hold this long before the lens can be scrubbed (else the rail scrolls)
const TOUCH_DECIDE_PX = 4; // touch: after the hold, the first move this long decides scrub (sideways) or scroll

interface Geo {
  x: number;
  w: number;
}

/**
 * The category control: real links (/ and /category/<id>/) on a rail, with a glass
 * lens that slides between them. It lives in the (lists) route-group layout, so it
 * persists across client navigations and the lens animates from route to route.
 *
 * The lens is an opaque glass drop that carries a clone of the labels, aligned to the
 * rail and magnified about its centre. It moves with transforms only (translate +
 * scale; its width is set once per target, outside the frame loop). Click: it lifts,
 * travels with spring and stretch, and sets down. Drag (mouse/pen, or touch after a
 * short hold, then a sideways move; a vertical move scrolls the page as usual): scrub
 * across the labels; release goes to the nearest tab. Keyboard: ←/→/Home/End with a
 * roving tabindex (history is replaced, not pushed, while arrowing through the tabs);
 * the focus ring is drawn on the lens.
 * Without JS the lens is hidden and the current tab gets a static pill.
 */
export function SegmentedNav({ tabs, label = '카테고리' }: { tabs: SegmentTab[]; label?: string }) {
  const pathname = normalize(usePathname() ?? '/');
  const router = useRouter();
  const routeIndex = Math.max(
    0,
    tabs.findIndex((tab) => normalize(tab.href) === pathname)
  );

  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(routeIndex);

  const segRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  // All animation state lives outside React: the frame loop must not re-render.
  const st = useRef({
    X: createSpring(0, SPRING.lens),
    W: createSpring(60, SPRING.lens),
    Lift: createSpring(0, SPRING.lift),
    geo: [] as Geo[],
    pad: 3,
    tabH: 34,
    base: 0,
    cur: routeIndex,
    travelling: false,
    drag: null as null | {
      id: number;
      sx: number;
      sy: number;
      x0: number;
      touch: boolean;
      armed: boolean;
      /** touch: the first move after the hold was sideways (scrub); until then nothing moves */
      decided: boolean;
      timer: number;
    },
    mapsQueued: false,
    rail: null as DOMRect | null,
    vis: { x: 0, y: 0 },
    filter: null as DisplacementFilter | null,
    filterOn: false,
    handle: null as GlassHandle | null,
    reduced: false,
    moving: false
  });

  // 1x maps: the clone refracts only while the lens travels fast, when nothing reads as blocky.
  const mapSpec = (w: number): MapSpec => {
    const h = st.current.tabH;
    return { w: Math.round(w), h, r: h / 2, bevel: 10, power: 2, dir: 1, pad: LENS_PAD, res: 1 };
  };

  /** Sets the lens's own box to a tab's width (once per target, never per frame). */
  const setBase = useCallback((w: number) => {
    const s = st.current;
    const lens = lensRef.current;
    const base = Math.round(w);
    if (!lens || base === s.base || base < 1) return;
    s.base = base;
    lens.style.width = `${base}px`;
    lens.style.height = `${s.tabH}px`;
    const f = s.filter;
    if (f) {
      f.setSize(base, s.tabH, LENS_PAD);
      const url = cachedMap(mapSpec(base));
      if (url) f.setMap(url); // otherwise the previous map stretches until idle builds this one
      else
        idle(() => {
          void buildMap(mapSpec(base)).then((built) => {
            if (st.current.filter === f && st.current.base === base) f.setMap(built);
          });
        });
    }
  }, []);

  /** Writes the lens and clone transforms from the springs. */
  const render = useCallback(() => {
    const s = st.current;
    const lens = lensRef.current;
    const clone = cloneRef.current;
    const inner = innerRef.current;
    if (!lens || !clone || !inner || !s.base) return;
    const lift = s.Lift.x;
    const stretch = s.reduced ? 0 : Math.min(0.18, Math.abs(s.X.v) / 2600);
    const w = s.W.x * (1 + stretch) + lift * 12;
    const h = s.tabH * (1 - stretch * 0.32) + lift * 10;
    const x = s.X.x + (s.W.x - w) / 2;
    const y = s.pad + (s.tabH - h) / 2;
    const sx = w / s.base;
    const sy = h / s.tabH;
    s.vis.x = x;
    s.vis.y = y;
    lens.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    // The clone shows the rail's labels magnified about the lens centre, undistorted by the lens's own scale.
    const mag = s.reduced ? 1 : 1 + lift * 0.1 + stretch * 0.3;
    const tx = (x + w / 2) * (1 - mag) - x;
    const ty = (y + h / 2) * (1 - mag) - y;
    clone.style.transform = `scale(${(1 / sx).toFixed(4)},${(1 / sy).toFixed(4)}) translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${mag.toFixed(4)})`;
    lens.style.setProperty('--lift', clamp(lift, 0, 1.2).toFixed(3));
    // Edge refraction of the clone, only while the drop travels fast. Skia samples
    // feDisplacementMap nearest-neighbour, which makes crisp glyph strokes jagged, so a
    // lens at rest, held or dragged slowly shows the labels undisplaced; the outer 3px
    // fade (.seg__bevel) hides where the magnified clone meets the rim.
    const f = s.filter;
    if (f) {
      const scale = Math.min(MAX_DISPLACEMENT, stretch * 60);
      const on = scale > 0.15;
      if (on) f.setScale(scale);
      if (on !== s.filterOn) {
        s.filterOn = on;
        inner.style.filter = on ? f.ref : '';
      }
    }
  }, []);

  const measure = useCallback(() => {
    const s = st.current;
    const els = tabRefs.current.filter((el): el is HTMLAnchorElement => !!el);
    if (!els.length) return false;
    s.geo = els.map((el) => ({ x: el.offsetLeft, w: el.offsetWidth }));
    s.pad = els[0]!.offsetTop;
    s.tabH = els[0]!.offsetHeight || 34;
    return true;
  }, []);

  const scrollIntoRail = useCallback((i: number, smooth: boolean) => {
    const seg = segRef.current;
    const g = st.current.geo[i];
    const rail = railRef.current;
    if (!seg || !g || !rail || seg.scrollWidth <= seg.clientWidth + 1) return;
    const left = rail.offsetLeft + g.x;
    const right = left + g.w;
    const margin = 36;
    let to: number | null = null;
    if (left - margin < seg.scrollLeft) to = left - margin;
    else if (right + margin > seg.scrollLeft + seg.clientWidth) to = right + margin - seg.clientWidth;
    if (to !== null) seg.scrollTo({ left: Math.max(0, to), behavior: smooth && !st.current.reduced ? 'smooth' : 'auto' });
  }, []);

  /** Moves the lens to tab i. */
  const select = useCallback(
    (i: number, animate = true) => {
      const s = st.current;
      const g = s.geo[i];
      if (!g) return;
      s.cur = i;
      setCurrent(i);
      s.X.t = g.x;
      s.W.t = g.w;
      setBase(g.w);
      if (animate && !s.reduced) {
        s.Lift.t = 1;
        s.travelling = true;
      } else {
        snapSpring(s.X, g.x);
        snapSpring(s.W, g.w);
        snapSpring(s.Lift, 0);
        render();
      }
      scrollIntoRail(i, animate);
      s.handle?.refresh();
    },
    [render, scrollIntoRail, setBase]
  );

  /* ------------------------------------------------------------- mount */
  useEffect(() => {
    const s = st.current;
    const light = getGlassLight();
    const lens = lensRef.current;
    const rail = railRef.current;
    if (!light || !lens || !rail || !measure()) return;
    s.reduced = light.reducedMotion();
    // Clone refraction shares the backdrop gate: WebKit leaves a filtered clone's
    // transform stale while it moves, and it is a Chromium-desktop nicety anyway.
    if (light.refraction) s.filter = new DisplacementFilter('lens');
    innerRef.current?.style.removeProperty('filter');

    const params = new URLSearchParams(location.search);
    const g = s.geo[s.cur]!;
    snapSpring(s.X, g.x);
    snapSpring(s.W, g.w);
    setBase(g.w);
    if (params.has('lift')) {
      // Debug pin for screenshots: ?lift=1&liftdx=40
      snapSpring(s.Lift, Number(params.get('lift')) || 1);
      snapSpring(s.X, g.x + (Number(params.get('liftdx')) || 0));
    }
    render();

    s.handle = light.register(lens, {
      radius: 'pill',
      inFlow: true,
      read: () => {
        s.rail = rail.getBoundingClientRect();
      },
      rect: () => (s.rail ? { left: s.rail.left + s.vis.x, top: s.rail.top + s.vis.y, width: s.base, height: s.tabH } : null),
      tick: (dt) => {
        s.reduced = light.reducedMotion();
        if (params.has('lift')) return false;
        if (s.reduced) {
          const off = s.X.x !== s.X.t || s.W.x !== s.W.t || s.Lift.x !== 0;
          snapSpring(s.X);
          snapSpring(s.W);
          snapSpring(s.Lift, 0);
          if (off) render();
          return false;
        }
        let moving = stepSpring(s.X, dt);
        moving = stepSpring(s.W, dt) || moving;
        if (s.travelling && !s.drag && Math.abs(s.X.x - s.X.t) < 10) {
          s.Lift.t = 0;
          s.travelling = false;
        }
        moving = stepSpring(s.Lift, dt, 0.002, 0.01) || moving;
        // Render the frame a spring snaps to rest too, and the one that turns refraction off.
        if (moving || s.moving || s.filterOn) render();
        s.moving = moving;
        return moving;
      }
    });
    setReady(true);
    scrollIntoRail(s.cur, false);

    // The current tab's map now (idle); the others once the rail shows intent
    // (pointerenter / focus, see queueMaps), one per idle slice: none is ever built
    // mid-animation, and none becomes a long task at load.
    if (s.filter)
      buildInIdle([mapSpec(s.base)], () => {
        const url = cachedMap(mapSpec(s.base));
        if (url) s.filter?.setMap(url);
      });

    const remeasure = () => {
      if (params.has('lift') || !measure()) return;
      const cur = s.geo[s.cur]!;
      s.X.t = cur.x;
      s.W.t = cur.w;
      setBase(cur.w);
      if (!s.travelling && !s.drag) {
        snapSpring(s.X);
        snapSpring(s.W);
        render();
      }
      s.handle?.refresh();
    };
    const ro = new ResizeObserver(remeasure);
    ro.observe(rail);
    document.fonts?.ready.then(remeasure).catch(() => undefined);

    return () => {
      ro.disconnect();
      s.handle?.unregister();
      s.handle = null;
      s.filter?.destroy();
      s.filter = null;
    };
  }, [measure, render, scrollIntoRail, setBase]);

  /* ------------------------------------------- route changes (back/forward) */
  useEffect(() => {
    if (!ready) return;
    if (routeIndex === st.current.cur) return;
    document.documentElement.dataset.nav = '';
    select(routeIndex);
  }, [ready, routeIndex, select]);

  /* -------------------------------------------------------- edge fade */
  useEffect(() => {
    const seg = segRef.current;
    if (!seg) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const start = seg.scrollLeft > 2;
      const end = seg.scrollLeft + seg.clientWidth < seg.scrollWidth - 2;
      const value = [start && 'start', end && 'end'].filter(Boolean).join(' ');
      if (seg.dataset.fade !== value) seg.dataset.fade = value;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    seg.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(seg);
    return () => {
      seg.removeEventListener('scroll', onScroll);
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  /* ---------------------------------------------------------- input */
  /** Intent: build the lens maps for every tab before the first travel. */
  const queueMaps = () => {
    const s = st.current;
    if (!s.filter || s.mapsQueued) return;
    s.mapsQueued = true;
    buildInIdle(s.geo.map((g) => mapSpec(g.w)));
  };

  /** Keyboard traversal replaces the history entry, so Back does not step through every tab passed. */
  const go = (i: number, replace = false) => {
    const tab = tabs[i];
    if (!tab) return;
    document.documentElement.dataset.nav = '';
    select(i);
    if (replace) router.replace(tab.href, { scroll: false });
    else router.push(tab.href, { scroll: false });
  };

  const onTabClick = (i: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (i === st.current.cur) return;
    document.documentElement.dataset.nav = ''; // lets the incoming list fade in (list.css)
    select(i); // Link navigates; the lens leaves now, not when the route commits
  };

  const onTabPointerDown = (i: number) => (event: PointerEvent<HTMLAnchorElement>) => {
    const s = st.current;
    if (event.button !== 0 || i === s.cur || s.reduced || event.pointerType === 'touch') return;
    s.Lift.t = 0.6; // anticipation
    s.handle?.refresh();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const s = st.current;
    const map: Record<string, number> = { ArrowRight: s.cur + 1, ArrowLeft: s.cur - 1, Home: 0, End: tabs.length - 1 };
    const next = map[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const i = clamp(next, 0, tabs.length - 1);
    if (i !== s.cur) go(i, true);
    tabRefs.current[i]?.focus({ preventScroll: true });
    syncFocus();
  };

  const syncFocus = () => {
    const lens = lensRef.current;
    const focused = document.activeElement;
    const on = !!focused && focused === tabRefs.current[st.current.cur] && focused.matches(':focus-visible');
    lens?.classList.toggle('is-focus', on);
  };

  // Scrub: grab the lens and drag it across the labels; release goes to the nearest tab.
  const nearest = (cx: number) => {
    let best = 0;
    let bestD = Infinity;
    st.current.geo.forEach((g, i) => {
      const d = Math.abs(g.x + g.w / 2 - cx);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (!s.drag) return;
    s.drag.armed = true;
    measure();
    s.Lift.t = 1;
    s.handle?.refresh();
    try {
      lensRef.current?.setPointerCapture(event.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  const onLensPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (event.button !== 0 || s.reduced) return;
    const touch = event.pointerType === 'touch';
    s.drag = { id: event.pointerId, sx: event.clientX, sy: event.clientY, x0: s.X.x, touch, armed: false, decided: !touch, timer: 0 };
    if (touch) {
      const persisted = { pointerId: event.pointerId } as PointerEvent<HTMLDivElement>;
      s.drag.timer = window.setTimeout(() => startDrag(persisted), TOUCH_ARM_MS);
    } else {
      event.preventDefault();
      startDrag(event);
    }
  };

  const onLensPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    const d = s.drag;
    if (!d || event.pointerId !== d.id) return;
    if (!d.armed) {
      if (Math.abs(event.clientX - d.sx) > 8 || Math.abs(event.clientY - d.sy) > 8) {
        clearTimeout(d.timer); // a swipe before the hold: let the rail (or the page) scroll
        s.drag = null;
      }
      return;
    }
    if (!d.decided) return; // the touchmove listener below decides scrub or scroll
    const first = s.geo[0];
    const last = s.geo[s.geo.length - 1];
    if (!first || !last) return;
    const nx = clamp(d.x0 + (event.clientX - d.sx), first.x - 8, last.x + last.w - s.W.x + 8);
    s.X.t = nx;
    const width = s.geo[nearest(nx + s.W.x / 2)]!.w;
    s.W.t = width;
    setBase(width);
    s.handle?.refresh();
  };

  const onLensPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    const d = s.drag;
    if (!d || event.pointerId !== d.id) return;
    clearTimeout(d.timer);
    s.drag = null;
    if (!d.armed) return;
    const i = nearest(s.X.t + s.W.x / 2);
    s.travelling = true;
    if (i === s.cur) {
      const g = s.geo[i]!;
      s.X.t = g.x;
      s.W.t = g.w;
      setBase(g.w);
      s.handle?.refresh();
    } else go(i);
  };

  // A held touch decides on its first real move: sideways scrubs (and from then on the
  // page must not scroll), vertical drops the scrub and never blocks the page's scroll.
  // Nothing is prevented before that decision.
  useEffect(() => {
    const lens = lensRef.current;
    if (!lens) return;
    const onTouchMove = (event: TouchEvent) => {
      const s = st.current;
      const d = s.drag;
      if (!d?.armed) return;
      if (!d.decided) {
        const touch = event.touches[0];
        if (!touch) return;
        const dx = Math.abs(touch.clientX - d.sx);
        const dy = Math.abs(touch.clientY - d.sy);
        if (Math.max(dx, dy) < TOUCH_DECIDE_PX) return;
        if (dy > dx) {
          s.drag = null;
          s.Lift.t = 0;
          s.travelling = true;
          try {
            lens.releasePointerCapture(d.id);
          } catch {
            /* not captured */
          }
          s.handle?.refresh();
          return;
        }
        d.decided = true;
      }
      if (event.cancelable) event.preventDefault();
    };
    lens.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => lens.removeEventListener('touchmove', onTouchMove);
  }, []);

  return (
    <nav className="seg" aria-label={label} ref={segRef} data-ready={ready ? '' : undefined}>
      <div className="seg__rail" ref={railRef} onPointerEnter={queueMaps} onFocus={queueMaps}>
        <div className="tabs" onKeyDown={onKeyDown}>
          {tabs.map((tab, i) => (
            <Link
              key={tab.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              className="tabs__item seg__tab"
              href={tab.href}
              scroll={false}
              aria-current={i === current ? 'page' : undefined}
              tabIndex={ready ? (i === current ? 0 : -1) : undefined}
              data-category={tab.key}
              onClick={onTabClick(i)}
              onPointerDown={onTabPointerDown(i)}
              onFocus={syncFocus}
              onBlur={syncFocus}
            >
              <span className="seg__label">{tab.label}</span>
              <span className="tabs__count seg__count">{tab.count}</span>
            </Link>
          ))}
        </div>
        <div
          className="seg__lens glass glass--lens"
          ref={lensRef}
          aria-hidden="true"
          onPointerDown={onLensPointerDown}
          onPointerMove={onLensPointerMove}
          onPointerUp={onLensPointerUp}
          onPointerCancel={onLensPointerUp}
        >
          <GlassLayers />
          <div className="seg__lensInner" ref={innerRef}>
            <div className="seg__clone" ref={cloneRef}>
              {tabs.map((tab) => (
                <span key={tab.key} className="seg__tab">
                  <span className="seg__label">{tab.label}</span>
                  <span className="seg__count">{tab.count}</span>
                </span>
              ))}
            </div>
          </div>
          <span className="seg__bevel" />
        </div>
      </div>
    </nav>
  );
}
