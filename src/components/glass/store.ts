/**
 * The shared light: one light source and one rAF loop for every glass element.
 *
 * - Light source: the pointer on (pointer: fine) devices, otherwise a fixed key light
 *   above the top-left of the viewport. On touch devices the first ~400px of scroll
 *   sweep the key light from left to right so the glint still travels. Under
 *   prefers-reduced-motion the light stays at the key light.
 * - Idle costs nothing: the loop runs only while the light spring moves, a target is
 *   dirty (resized, scrolled, theme) or a target's own tick (the lens) is animating,
 *   and it is cancelled while the page is hidden.
 * - Per frame: all rects are read first, then tick functions run, then each target
 *   gets at most four custom-property writes (--ga --gx --gy --gn), skipped when the
 *   value did not change. No layout-affecting writes. The writes land on the target's
 *   `.glass__light` wrapper (display: contents), which holds only the four material
 *   layers, so a frame restyles five elements per glass object and never its content.
 * - Targets that are not rendered (visibility: hidden, e.g. a closed TOC sheet) or,
 *   for fixed chrome, outside the viewport (the TOC pill before it slides in) are
 *   skipped and stay dirty: they are shaded on the first frame they can be seen.
 *
 * Debug flags (kept for visual-regression shots): ?light=x,y pins the light,
 * ?perf exposes window.__glassPerf, ?refract=0 forces the fallback, ?reduced
 * forces reduced motion, ?slowmo=10 runs every spring ten times slower.
 */
import { buildMap, DisplacementFilter, idle, mapStats, refractionSupported } from './refraction';
import { shadeRim, type RectLike } from './rim';
import { SPRING } from './spring';

export interface RefractOptions {
  /** bevel band width in px */
  bevel: number;
  /** displacement at the rim in px */
  scale: number;
  /** bevel profile exponent (default 1.6) */
  power?: number;
}

export interface GlassTargetOptions {
  /** Corner radius in px, or 'pill' (half the height). Default 'pill'. */
  radius?: number | 'pill';
  /** True when the element scrolls with the page (re-shaded on scroll). Default true. */
  inFlow?: boolean;
  /** Backdrop refraction (Chromium desktop only; ignored elsewhere). */
  refract?: RefractOptions | false;
  /** Element whose backdrop-filter becomes the refraction filter. Default: the `.glass__fx` child. */
  fx?: HTMLElement | null;
  /** Read phase hook: runs before any writes in the frame. Read layout here. */
  read?: () => void;
  /** Geometry to shade from, after this frame's tick. Default: the rect read in the read phase. */
  rect?: () => RectLike | null;
  /** Advances the target's own animation; return true while it is still moving. Write transforms here. */
  tick?: (dt: number) => boolean;
}

export interface GlassHandle {
  /** Re-shade on the next frame (and run the tick loop). */
  refresh(): void;
  unregister(): void;
}

export interface GlassLight {
  register(el: HTMLElement, options?: GlassTargetOptions): GlassHandle;
  /** Schedule a frame. */
  kick(): void;
  /** Re-shade every target (theme switch, fonts loaded). */
  refreshAll(): void;
  /** True when backdrop refraction is enabled on this device. */
  readonly refraction: boolean;
  reducedMotion(): boolean;
  /** Current (smoothed) light position in viewport coordinates. */
  light(): Readonly<{ x: number; y: number }>;
}

interface RefractState {
  filter: DisplacementFilter;
  fx: HTMLElement;
  options: RefractOptions;
  w: number;
  h: number;
  built: string;
  timer: number;
}

interface Target {
  el: HTMLElement;
  /** Receives the four custom properties: the `.glass__light` wrapper, else the element. */
  light: HTMLElement;
  options: GlassTargetOptions;
  radius: number | 'pill';
  inFlow: boolean;
  dirty: boolean;
  hidden: boolean;
  box: RectLike | null;
  written: [string, string, string, string];
  refract: RefractState | null;
}

export interface GlassPerf {
  frames: number;
  /** JS time inside the frame callback, ms */
  totalMs: number;
  maxMs: number;
  /** Longest read phase (getBoundingClientRect): a layout the frame would do anyway when the DOM changed. */
  maxReadMs: number;
  samples: number[];
  maps: typeof mapStats;
}

const SETTLE_MS = 140; // a size must be stable this long before its displacement map is rebuilt
const BLUR_IN_FILTER = 0.6; // refraction already scatters the backdrop; keep the edge bend legible

type CheckVisibility = (options?: Record<string, boolean>) => boolean;
/** Element.checkVisibility (Chrome 121, Safari 17.4, Firefox 125): false for display: none and visibility: hidden. */
const visible: CheckVisibility | undefined =
  typeof Element !== 'undefined' ? (Element.prototype as { checkVisibility?: CheckVisibility }).checkVisibility : undefined;
const VISIBILITY = { visibilityProperty: true, checkVisibilityCSS: true };

let instance: GlassLight | null = null;

/** The page's light store (created on first use in the browser; null during SSR). */
export function getGlassLight(): GlassLight | null {
  if (typeof window === 'undefined') return null;
  instance ??= createGlassLight();
  return instance;
}

function createGlassLight(): GlassLight {
  const params = new URLSearchParams(location.search);
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = matchMedia('(pointer: fine)');
  const reduced = () => mqReduce.matches || params.has('reduced');
  const refraction = refractionSupported();
  if (refraction) document.documentElement.classList.add('glass-refract');

  const slowmo = Math.max(1, Number(params.get('slowmo')) || 1);
  const pin = (params.get('light') ?? '').split(',').map(Number);
  const pinned = pin.length === 2 && pin.every(Number.isFinite) ? { x: pin[0]!, y: pin[1]! } : null;

  const perf: GlassPerf | null = params.has('perf') ? { frames: 0, totalMs: 0, maxMs: 0, maxReadMs: 0, samples: [], maps: mapStats } : null;
  if (perf) (window as unknown as { __glassPerf: GlassPerf }).__glassPerf = perf;

  const targets = new Set<Target>();
  const byElement = new WeakMap<Element, Target>();

  /* ---------------------------------------------------------------- light */

  /** Key light above the top-left; on touch devices scroll sweeps it to the right. */
  const keyLight = () => {
    const W = innerWidth;
    const H = innerHeight;
    if (!mqFine.matches && !reduced()) {
      const sweep = Math.min(1, Math.max(0, scrollY / 400));
      return { x: W * (0.14 + 0.72 * sweep), y: -0.6 * H };
    }
    return { x: W * 0.36, y: -0.6 * H };
  };
  const start = pinned ?? keyLight();
  const L = { x: start.x, y: start.y, vx: 0, vy: 0, tx: start.x, ty: start.y };
  let pointerSeen = false;

  const toKey = (snap = false) => {
    if (pinned) return;
    const k = keyLight();
    L.tx = k.x;
    L.ty = k.y;
    if (snap) {
      L.x = k.x;
      L.y = k.y;
      L.vx = L.vy = 0;
    }
    kick();
  };

  addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType === 'touch' || pinned || reduced()) return;
      L.tx = event.clientX;
      L.ty = event.clientY;
      pointerSeen = true;
      kick();
    },
    { passive: true }
  );
  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget && event.pointerType !== 'touch') {
      pointerSeen = false;
      toKey();
    }
  });
  addEventListener('blur', () => {
    pointerSeen = false;
    toKey();
  });

  /* ------------------------------------------------------------ the loop */

  let raf = 0;
  let last = 0;

  function kick() {
    if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
  }

  function frame(now: number) {
    raf = 0;
    const t0 = perf ? performance.now() : 0;
    const dt = (last ? Math.min(0.05, (now - last) / 1000) : 1 / 60) / slowmo;
    last = now;
    let busy = false;

    // 1. Light spring (critically damped: the glint glides after the pointer, never snaps).
    const px = L.x;
    const py = L.y;
    if (reduced() || pinned) {
      L.x = L.tx;
      L.y = L.ty;
      L.vx = L.vy = 0;
    } else {
      const n = Math.max(1, Math.ceil(dt * 240));
      const h = dt / n;
      const { k, c } = SPRING.light;
      for (let i = 0; i < n; i++) {
        L.vx += (-k * (L.x - L.tx) - c * L.vx) * h;
        L.vy += (-k * (L.y - L.ty) - c * L.vy) * h;
        L.x += L.vx * h;
        L.y += L.vy * h;
      }
      busy = Math.abs(L.x - L.tx) + Math.abs(L.y - L.ty) > 0.15 || Math.abs(L.vx) + Math.abs(L.vy) > 0.5;
      if (!busy) {
        L.x = L.tx;
        L.y = L.ty;
        L.vx = L.vy = 0;
      }
    }
    const lightMoved = L.x !== px || L.y !== py;

    // 2. Read phase: every rect before any write.
    const todo: Target[] = [];
    for (const t of targets) if (lightMoved || t.dirty || t.options.tick) todo.push(t);
    for (const t of todo) {
      if (t.options.read) t.options.read();
      else t.box = t.el.getBoundingClientRect();
      t.hidden = visible ? !visible.call(t.el, VISIBILITY) : false;
    }
    if (perf) perf.maxReadMs = Math.max(perf.maxReadMs, performance.now() - t0);

    // 3. Tick phase: targets advance their own animation (transforms only).
    for (const t of todo) {
      if (t.options.tick?.(dt)) {
        busy = true;
        t.dirty = true;
      }
    }

    // 4. Write phase: at most four custom properties per target.
    const dpr = devicePixelRatio || 1;
    const vh = innerHeight;
    for (const t of todo) {
      if (!lightMoved && !t.dirty) continue;
      const rect = t.options.rect ? t.options.rect() : t.box;
      // In-flow glass is shaded a little before it scrolls into view; fixed chrome only once it is in view.
      const margin = t.inFlow ? 200 : 0;
      if (!rect || t.hidden || rect.top > vh + margin || rect.top + rect.height < -margin) {
        t.dirty = true;
        continue;
      }
      t.dirty = false;
      const s = shadeRim(rect, L.x, L.y, t.radius, dpr);
      if (!s) continue;
      const w = t.written;
      const st = t.light.style;
      const ga = `${s.ga.toFixed(1)}deg`;
      const gx = `${s.gx.toFixed(2)}px`;
      const gy = `${s.gy.toFixed(2)}px`;
      const gn = s.gn.toFixed(3);
      if (w[0] !== ga) st.setProperty('--ga', (w[0] = ga));
      if (w[1] !== gx) st.setProperty('--gx', (w[1] = gx));
      if (w[2] !== gy) st.setProperty('--gy', (w[2] = gy));
      if (w[3] !== gn) st.setProperty('--gn', (w[3] = gn));
    }

    if (perf) {
      const ms = performance.now() - t0;
      perf.frames += 1;
      perf.totalMs += ms;
      perf.maxMs = Math.max(perf.maxMs, ms);
      if (perf.samples.length < 2000) perf.samples.push(ms);
    }
    if (busy) kick();
    else last = 0;
  }

  /* ------------------------------------------------------- page events */

  const markAll = () => {
    for (const t of targets) t.dirty = true;
    kick();
  };

  addEventListener(
    'scroll',
    () => {
      let any = false;
      for (const t of targets) {
        if (t.inFlow) {
          t.dirty = true;
          any = true;
        }
      }
      if (!pointerSeen && !pinned && !reduced() && !mqFine.matches) {
        toKey();
        any = true;
      }
      if (any) kick();
    },
    { passive: true }
  );
  addEventListener('resize', () => {
    if (!pointerSeen) toKey(true);
    markAll();
  });
  mqReduce.addEventListener('change', () => {
    toKey(true);
    markAll();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    } else markAll();
  });
  // Theme switches change nothing the loop computes, but a re-shade keeps any
  // element that was hidden at the time in step.
  new MutationObserver(markAll).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ------------------------------------------------- size + refraction */

  const resize = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const t = byElement.get(entry.target);
      if (!t) continue;
      t.dirty = true;
      const r = t.refract;
      if (!r) continue;
      const box = entry.borderBoxSize?.[0];
      r.w = box ? box.inlineSize : (entry.target as HTMLElement).offsetWidth;
      r.h = box ? box.blockSize : (entry.target as HTMLElement).offsetHeight;
      // Stretch the current map to the new shape now; build the right one once it settles.
      r.filter.setSize(r.w, r.h);
      clearTimeout(r.timer);
      r.timer = window.setTimeout(() => idle(() => rebuild(t)), SETTLE_MS);
    }
    kick();
  });

  function rebuild(t: Target) {
    const r = t.refract;
    if (!r || !targets.has(t)) return;
    const w = Math.round(r.w);
    const h = Math.round(r.h);
    if (w < 2 || h < 2) return;
    const key = `${w}x${h}`;
    if (key === r.built) return;
    const radius = Math.min(t.radius === 'pill' ? h / 2 : t.radius, w / 2, h / 2);
    void buildMap({ w, h, r: radius, bevel: r.options.bevel, power: r.options.power ?? 1.6, dir: -1, pad: 0 }).then((url) => {
      // Unregistered, or resized again while the map was being built (a newer rebuild follows).
      if (!url || !targets.has(t) || t.refract !== r || `${Math.round(r.w)}x${Math.round(r.h)}` !== key) return;
      r.built = key;
      r.filter.setSize(r.w, r.h);
      r.filter.setMap(url);
      r.filter.setScale(r.options.scale);
      const ref = r.filter.ref;
      if (r.fx.style.backdropFilter !== ref) {
        r.fx.style.backdropFilter = ref;
        r.fx.style.setProperty('-webkit-backdrop-filter', ref);
        r.fx.dataset.refract = '';
      }
    });
  }

  function setupRefraction(t: Target, options: RefractOptions): RefractState | null {
    const fx = t.options.fx ?? t.light.querySelector<HTMLElement>(':scope > .glass__fx');
    if (!fx) return null;
    const cs = getComputedStyle(fx);
    const blur = parseFloat(cs.getPropertyValue('--g-blur')) || 11;
    const saturate = (parseFloat(cs.getPropertyValue('--g-sat')) || 160) / 100;
    const filter = new DisplacementFilter('backdrop', { blur: blur * BLUR_IN_FILTER, saturate });
    return { filter, fx, options, w: 0, h: 0, built: '', timer: 0 };
  }

  /* ------------------------------------------------------------ the API */

  function register(el: HTMLElement, options: GlassTargetOptions = {}): GlassHandle {
    const t: Target = {
      el,
      light: el.querySelector<HTMLElement>(':scope > .glass__light') ?? el,
      options,
      radius: options.radius ?? 'pill',
      inFlow: options.inFlow ?? true,
      dirty: true,
      hidden: false,
      box: null,
      written: ['', '', '', ''],
      refract: null
    };
    if (refraction && options.refract) t.refract = setupRefraction(t, options.refract);
    targets.add(t);
    byElement.set(el, t);
    resize.observe(el);
    kick();
    return {
      refresh() {
        t.dirty = true;
        kick();
      },
      unregister() {
        targets.delete(t);
        byElement.delete(el);
        resize.unobserve(el);
        if (t.refract) {
          clearTimeout(t.refract.timer);
          t.refract.fx.style.removeProperty('backdrop-filter');
          t.refract.fx.style.removeProperty('-webkit-backdrop-filter');
          delete t.refract.fx.dataset.refract;
          t.refract.filter.destroy();
        }
      }
    };
  }

  return {
    register,
    kick,
    refreshAll: markAll,
    refraction,
    reducedMotion: reduced,
    light: () => ({ x: L.x, y: L.y })
  };
}
