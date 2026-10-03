/**
 * Rim shading: from the light position to four numbers the CSS rim is drawn from.
 *
 * The CSS (src/styles/glass.css) paints the 1px rim with two conic gradients of a
 * fixed, small stop structure. Only these four custom properties change per frame:
 *
 *   --ga  angle of the outward normal at the rim point nearest the light
 *         (CSS conic convention: 0deg = up, clockwise). The front glint is centred
 *         on it, the inner light and sheen face it, the drop shadow leans away from it.
 *   --gx  conic centre for the front glint, in px from the element's left edge:
 *   --gy  the rim point pushed inward along its normal by ρ (the corner radius, or
 *         half the height for a pill), i.e. the centre of curvature of a rounded
 *         corner. Seen from there the glint's angular width maps to a nearly constant
 *         arc length on caps and straight edges alike. The counter-glint uses the
 *         point mirrored through the box centre (calc(100% - var(--gx))).
 *   --gn  nearness of the light, 0 (far) … 1 (at the rim): tightens and brightens the
 *         glint and lengthens the shadow.
 *
 * For a convex rounded rectangle the nearest boundary point to an outside light
 * is exactly where the normal points at the light, i.e. where n·l is largest —
 * the same spot the prototype found by sampling 60–110 rim points per frame.
 */

export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface RimState {
  ga: number;
  gx: number;
  gy: number;
  gn: number;
}

/** Signed distance from a point to a rounded box centred on the origin (half sizes a, b; radius r). */
export function sdRoundedBox(px: number, py: number, a: number, b: number, r: number): number {
  const qx = Math.abs(px) - (a - r);
  const qy = Math.abs(py) - (b - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

const MARGIN = 16; // a light over the glass is treated as hovering this far beyond the rim
const FALLOFF = 620; // px over which nearness falls from 1 to 0

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/**
 * @param rect   the element's border box in viewport coordinates
 * @param Lx,Ly  light position in viewport coordinates
 * @param radius corner radius in px, or 'pill'
 * @param dpr    devicePixelRatio, for snapping the conic centre (Skia draws a seam
 *               along a conic's branch cut when its centre is on a fractional pixel)
 */
export function shadeRim(rect: RectLike, Lx: number, Ly: number, radius: number | 'pill', dpr: number): RimState | null {
  const w = rect.width;
  const h = rect.height;
  if (w < 1 || h < 1) return null;
  const a = w / 2;
  const b = h / 2;
  const r = Math.min(radius === 'pill' ? b : radius, a, b);
  const rho = Math.max(4, r);
  let lx = Lx - (rect.left + a);
  let ly = Ly - (rect.top + b);

  let sd = sdRoundedBox(lx, ly, a, b, r);
  if (sd < MARGIN) {
    // Light over (or just at) the glass: push it out along the centre ray until it
    // sits MARGIN beyond the rim, so the glint stays on the nearest edge.
    const d = Math.hypot(lx, ly);
    const ux = d < 1e-3 ? 0 : lx / d;
    const uy = d < 1e-3 ? -1 : ly / d;
    let t = Math.max(d, 1);
    for (let i = 0; i < 8; i++) t += MARGIN - sdRoundedBox(ux * t, uy * t, a, b, r);
    lx = ux * t;
    ly = uy * t;
    sd = MARGIN;
  }

  // Nearest boundary point P and its outward normal n.
  const qx = clamp(lx, -(a - r), a - r);
  const qy = clamp(ly, -(b - r), b - r);
  let nx = lx - qx;
  let ny = ly - qy;
  const nl = Math.hypot(nx, ny) || 1;
  nx /= nl;
  ny /= nl;
  const px = qx + nx * r;
  const py = qy + ny * r;

  // Conic centre: P pushed inward by ρ, snapped to the device-pixel grid in page space.
  const cx = clamp(a + px - nx * rho, 0, w);
  const cy = clamp(b + py - ny * rho, 0, h);
  const snap = (v: number, origin: number) => Math.round((origin + v) * dpr) / dpr - origin;

  const ga = (Math.atan2(nx, -ny) * 180) / Math.PI;
  const gn = 1 - clamp((sd - MARGIN) / FALLOFF, 0, 1);
  return { ga: ga < 0 ? ga + 360 : ga, gx: snap(cx, rect.left), gy: snap(cy, rect.top), gn };
}
