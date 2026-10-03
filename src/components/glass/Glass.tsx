'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type RefObject
} from 'react';
import { getGlassLight, type GlassLight, type GlassTargetOptions, type RefractOptions } from './store';

/**
 * The glass budget. Nothing else on the site is ever glass.
 *   dock      sticky capsule nav                      pill, refracts (Chromium desktop)
 *   sheet     ⌘K search sheet                         radius 26, refracts
 *   pill      TOC pill on screens < 1180px            pill, frosted only
 *   tocsheet  TOC bottom sheet                        radius 24, frosted only
 *   lens      segmented-control lens (SegmentedNav)   pill, opaque at rest
 */
export type GlassVariant = 'dock' | 'sheet' | 'pill' | 'tocsheet' | 'lens';

interface VariantDefaults {
  radius: number | 'pill';
  inFlow: boolean;
  refract: RefractOptions | false;
}

export const GLASS_VARIANTS: Record<GlassVariant, VariantDefaults> = {
  dock: { radius: 'pill', inFlow: false, refract: { bevel: 13, scale: 22, power: 1.6 } },
  sheet: { radius: 26, inFlow: false, refract: { bevel: 20, scale: 30, power: 1.5 } },
  pill: { radius: 'pill', inFlow: false, refract: false },
  tocsheet: { radius: 24, inFlow: false, refract: false },
  lens: { radius: 'pill', inFlow: true, refract: false }
};

/**
 * Registers an element with the shared light. The element needs the glass layers
 * (render <GlassLayers /> inside it, or use <Glass>) and the `glass glass--<variant>`
 * classes. Returns `refresh()` for when its shape changes outside a resize (rare:
 * resizes are observed).
 */
export function useGlass(ref: RefObject<HTMLElement | null>, options: GlassTargetOptions = {}): { refresh: () => void } {
  const handle = useRef<{ refresh(): void; unregister(): void } | null>(null);
  const latest = useRef(options);
  latest.current = options;
  const key = JSON.stringify([options.radius, options.inFlow, options.refract]);
  useEffect(() => {
    const el = ref.current;
    const light = getGlassLight();
    if (!el || !light) return;
    const h = light.register(el, latest.current);
    handle.current = h;
    return () => {
      h.unregister();
      handle.current = null;
    };
  }, [ref, key]);
  return useMemo(() => ({ refresh: () => handle.current?.refresh() }), []);
}

/** The shared light store after mount (null during SSR and the first render). */
export function useGlassLight(): GlassLight | null {
  const [light, setLight] = useState<GlassLight | null>(null);
  useEffect(() => setLight(getGlassLight()), []);
  return light;
}

/**
 * The material layers. Order in the DOM does not matter; CSS stacks them:
 * shadow + body below the content, glint core and 1px rim above it.
 *
 * They sit in a `display: contents` wrapper that receives the light store's four
 * per-frame custom properties, so a light frame restyles the wrapper and its four
 * layers only, never the content of the glass (which is the wrapper's sibling).
 */
export function GlassLayers() {
  return (
    <span className="glass__light" aria-hidden="true">
      <span className="glass__shadow" />
      <span className="glass__fx" />
      <span className="glass__glint" />
      <span className="glass__rim" />
    </span>
  );
}

type GlassProps = HTMLAttributes<HTMLElement> & {
  /** Element to render. Default 'div'. */
  as?: ElementType;
  variant?: GlassVariant;
  /** Backdrop refraction on Chromium desktop. Defaults to the variant's setting (dock, sheet). */
  refract?: boolean;
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
  /** Any other attribute of the rendered element (type, href, open, …). */
  [attribute: string]: unknown;
};

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/**
 * A glass surface lit by the page's single light.
 *
 *   <Glass as="div" variant="sheet">…</Glass>
 *   <Glass as="button" type="button" variant="pill" onClick={…}>…</Glass>
 *
 * Without JS (and before hydration) the rim is a static key-light rim from CSS.
 * Do not put opacity < 1, filter, mask or clip-path on the Glass element itself:
 * that makes it the backdrop root and the blur goes blank. Fade its children instead.
 */
export function Glass({ as, variant = 'pill', refract, className, children, ref, ...rest }: GlassProps) {
  const Tag = (as ?? 'div') as ElementType;
  const local = useRef<HTMLElement | null>(null);
  const defaults = GLASS_VARIANTS[variant];
  useGlass(local, {
    radius: defaults.radius,
    inFlow: defaults.inFlow,
    refract: refract === false ? false : refract === true && !defaults.refract ? GLASS_VARIANTS.dock.refract : defaults.refract
  });
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      local.current = node;
      assignRef(ref, node);
    },
    [ref]
  );
  const classes = ['glass', `glass--${variant}`, className].filter(Boolean).join(' ');
  return (
    <Tag {...rest} ref={setRef} className={classes}>
      <GlassLayers />
      {children}
    </Tag>
  );
}
