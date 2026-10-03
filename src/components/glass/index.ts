/**
 * Liquid glass: one light, a handful of glass surfaces.
 *
 * Usage (overlay engineer):
 *
 *   import { Glass } from '@/components/glass';
 *
 *   // ⌘K sheet inside a native <dialog>: refracts on Chromium desktop, frosted elsewhere
 *   <dialog …><Glass as="div" variant="sheet" className="palette__panel">…</Glass></dialog>
 *
 *   // TOC pill (frosted only) and its bottom sheet
 *   <Glass as="button" type="button" variant="pill" className="tocpill__btn">…</Glass>
 *   <Glass as="div" variant="tocsheet" className="tocsheet">…</Glass>
 *
 * Tint and blur come from the variant (src/styles/glass.css): dock .72/.66 with an
 * 11px blur; sheet .92/.86 with 20px. Override per element with the custom properties
 * --g-tint-a and --g-blur. Hidden elements (display: none, closed dialogs) cost nothing;
 * they are re-shaded and get their refraction map when they get a size.
 *
 * For an element that is not a <Glass> but should answer the same light (e.g. a cast
 * shadow on the paper card), call useGlass(ref, { radius, inFlow: true }) and read
 * --ga (direction toward the light, conic degrees) and --gn (nearness 0…1) in CSS;
 * register them with `--ga: inherit` on any child that needs them (see glass.css).
 *
 * Imperative access anywhere on the client: getGlassLight()?.refreshAll().
 */
export { Glass, GlassLayers, GLASS_VARIANTS, useGlass, useGlassLight, type GlassVariant } from './Glass';
export { GlassLightProvider } from './GlassLightProvider';
export { getGlassLight, type GlassHandle, type GlassLight, type GlassTargetOptions, type RefractOptions } from './store';
export { createSpring, snapSpring, SPRING, stepSpring, type Spring } from './spring';
export { buildInIdle, buildMap, cachedMap, DisplacementFilter, idle, refractionSupported, type MapSpec } from './refraction';
export { shadeRim, type RectLike, type RimState } from './rim';
