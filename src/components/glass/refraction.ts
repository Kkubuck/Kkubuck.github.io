/**
 * Edge refraction with SVG feDisplacementMap.
 *
 * Backdrop refraction (`backdrop-filter: url(#…)`) renders only in Chromium; Safari
 * and Firefox accept the syntax and draw nothing, so CSS.supports cannot detect it.
 * It is enabled only on Chromium desktop with a fine pointer, no reduced-transparency
 * preference and at least 4 cores; everything else keeps the blur + rim fallback.
 *
 * Maps are rendered from the shape's signed distance field straight into a PNG (no
 * canvas, see buildMap), built in requestIdleCallback, cached per size, and never
 * rebuilt during an animation: while a shape changes size the existing map is stretched
 * (preserveAspectRatio="none") and the right-sized map is built once the size has been
 * stable for SETTLE_MS.
 */
import { sdRoundedBox } from './rim';

const NS = 'http://www.w3.org/2000/svg';

interface UADataLike {
  brands?: Array<{ brand: string }>;
}

/** The refraction gate from the spec. `?refract=0` forces the fallback for comparison. */
export function refractionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(location.search).get('refract') === '0') return false;
  const brands = (navigator as Navigator & { userAgentData?: UADataLike }).userAgentData?.brands ?? [];
  const chromium = brands.some((entry) => /Chromium/i.test(entry.brand));
  return (
    chromium &&
    matchMedia('(pointer: fine)').matches &&
    !matchMedia('(prefers-reduced-transparency: reduce)').matches &&
    (navigator.hardwareConcurrency ?? 0) >= 4
  );
}

/** requestIdleCallback with a setTimeout fallback; the deadline is undefined in the fallback. */
export const idle = (fn: (deadline?: IdleDeadline) => void, timeout = 500): void => {
  if (typeof requestIdleCallback === 'function') requestIdleCallback((deadline) => fn(deadline), { timeout });
  else setTimeout(() => fn(), 32);
};

/**
 * Builds the maps that are not cached yet, one per idle slice: none is ever built
 * during an animation, and a page's maps never add up to a long task.
 */
export function buildInIdle(specs: MapSpec[], done?: () => void): void {
  const queue = specs.filter((spec) => !cachedMap(spec));
  const step = () => {
    const spec = queue.shift();
    if (!spec) {
      done?.();
      return;
    }
    buildMap(spec).then(
      () => idle(step),
      () => idle(step)
    );
  };
  if (queue.length) idle(step);
  else done?.();
}

export interface MapSpec {
  /** element size in CSS px */
  w: number;
  h: number;
  /** corner radius */
  r: number;
  /** bevel band width in px */
  bevel: number;
  /** profile exponent: 0 slope where the bevel starts, strongest at the rim */
  power: number;
  /** -1: sample inward (backdrop); +1: sample outward (lens clone, a droplet compresses what lies beyond its edge) */
  dir: -1 | 1;
  /** filter region padding in px (lens only) */
  pad: number;
  /** highest map resolution (× CSS px); default: the device pixel ratio */
  res?: number;
}

const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();
export const mapStats = { built: 0, ms: 0, maxSliceMs: 0 };

const keyOf = (s: MapSpec, dpr: number) => [s.w, s.h, s.r, s.bevel, s.power, s.dir, s.pad, s.res ?? dpr, dpr].join('|');

export function cachedMap(spec: MapSpec): string | undefined {
  return cache.get(keyOf(spec, devicePixelRatio || 1));
}

const SLICE_MS = 6; // the pixel loop yields after this long

/**
 * Renders (or returns the cached) displacement map as a PNG data URL.
 *
 * No canvas: the pixels are written straight into PNG scanlines and deflated with
 * CompressionStream. A canvas costs a one-off raster warm-up of several hundred
 * milliseconds on the first putImageData/toBlob of a page (measured in Chromium), which
 * made the first map a long task; this path takes a few milliseconds, and the pixel
 * loop yields every SLICE_MS so even the ⌘K sheet's map stays off the long-task list.
 */
export function buildMap(spec: MapSpec): Promise<string> {
  const dpr = devicePixelRatio || 1;
  const key = keyOf(spec, dpr);
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  let job = pending.get(key);
  if (!job) {
    job = render(spec, dpr).then((url) => {
      cache.set(key, url);
      pending.delete(key);
      return url;
    });
    pending.set(key, job);
  }
  return job;
}

async function render(spec: MapSpec, dpr: number): Promise<string> {
  const t0 = performance.now();
  const { w, h, r, bevel, power, dir, pad } = spec;
  // Device resolution (capped at 3x and ~0.7 MP): a 1x map is upscaled nearest-neighbour and makes glyphs blocky.
  const k = Math.max(1, Math.min(spec.res ?? dpr, dpr, 3, Math.sqrt(700_000 / ((w + 2 * pad) * (h + 2 * pad)))));
  const W = Math.max(1, Math.round((w + 2 * pad) * k));
  const H = Math.max(1, Math.round((h + 2 * pad) * k));
  const stride = W * 3 + 1; // RGB scanlines, each led by filter byte 0
  const raw = new Uint8Array(stride * H);
  const a = w / 2;
  const b = h / 2;
  let slice = performance.now();
  for (let y = 0; y < H; y++) {
    let i = y * stride;
    raw[i++] = 0;
    for (let x = 0; x < W; x++) {
      const px = (x + 0.5) / k - pad - a;
      const py = (y + 0.5) / k - pad - b;
      const sd = sdRoundedBox(px, py, a, b, r);
      let R = 128;
      let G = 128;
      if (sd < 0 && -sd < bevel) {
        const t = 1 + sd / bevel; // 0 where the bevel starts, 1 at the rim
        const qx = Math.abs(px) - (a - r);
        const qy = Math.abs(py) - (b - r);
        let nx: number;
        let ny: number;
        if (qx > 0 && qy > 0) {
          const l = Math.hypot(qx, qy);
          nx = (qx / l) * Math.sign(px);
          ny = (qy / l) * Math.sign(py);
        } else if (qx > qy) {
          nx = Math.sign(px);
          ny = 0;
        } else {
          nx = 0;
          ny = Math.sign(py);
        }
        const m = Math.pow(t, power);
        R = Math.round(128 + dir * nx * m * 127);
        G = Math.round(128 + dir * ny * m * 127);
      }
      raw[i++] = R;
      raw[i++] = G;
      raw[i++] = 128;
    }
    const now = performance.now();
    if (now - slice > SLICE_MS) {
      mapStats.maxSliceMs = Math.max(mapStats.maxSliceMs, now - slice);
      await new Promise((resolve) => setTimeout(resolve, 0));
      slice = performance.now();
    }
  }
  mapStats.maxSliceMs = Math.max(mapStats.maxSliceMs, performance.now() - slice);
  const url = `data:image/png;base64,${base64(await png(W, H, raw))}`;
  mapStats.built += 1;
  mapStats.ms += performance.now() - t0;
  return url;
}

/* ------------------------------------------------------------- PNG encoder */

let crcTable: Uint32Array | null = null;
function crc32(bytes: Uint8Array): number {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]!) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** zlib stream: CompressionStream('deflate') where available, else stored (uncompressed) blocks. */
async function zlib(data: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream === 'function') {
    const stream = new Blob([data as BlobPart]).stream().pipeThrough(new CompressionStream('deflate'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  const blocks = Math.max(1, Math.ceil(data.length / 65535));
  const out = new Uint8Array(2 + data.length + blocks * 5 + 4);
  out[0] = 0x78;
  out[1] = 0x01;
  let o = 2;
  for (let i = 0; i < blocks; i++) {
    const chunk = data.subarray(i * 65535, Math.min(data.length, (i + 1) * 65535));
    out[o++] = i === blocks - 1 ? 1 : 0;
    out[o++] = chunk.length & 0xff;
    out[o++] = chunk.length >>> 8;
    out[o++] = ~chunk.length & 0xff;
    out[o++] = (~chunk.length >>> 8) & 0xff;
    out.set(chunk, o);
    o += chunk.length;
  }
  let s1 = 1;
  let s2 = 0;
  for (let i = 0; i < data.length; i++) {
    s1 = (s1 + data[i]!) % 65521;
    s2 = (s2 + s1) % 65521;
  }
  new DataView(out.buffer).setUint32(o, ((s2 << 16) | s1) >>> 0);
  return out;
}

async function png(width: number, height: number, raw: Uint8Array): Promise<Uint8Array> {
  const chunk = (type: string, body: Uint8Array) => {
    const out = new Uint8Array(12 + body.length);
    const view = new DataView(out.buffer);
    view.setUint32(0, body.length);
    for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
    out.set(body, 8);
    view.setUint32(8 + body.length, crc32(out.subarray(4, 8 + body.length)));
    return out;
  };
  const header = new Uint8Array(13);
  const view = new DataView(header.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  header.set([8, 2, 0, 0, 0], 8); // 8-bit RGB, no interlace
  const parts = [
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', await zlib(raw)),
    chunk('IEND', new Uint8Array(0))
  ];
  const out = new Uint8Array(parts.reduce((n, part) => n + part.length, 0));
  let o = 0;
  for (const part of parts) {
    out.set(part, o);
    o += part.length;
  }
  return out;
}

function base64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

let defs: SVGDefsElement | null = null;
function ensureDefs(): SVGDefsElement {
  if (defs?.isConnected) return defs;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'glass-defs');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  defs = document.createElementNS(NS, 'defs');
  svg.appendChild(defs);
  document.body.appendChild(svg);
  return defs;
}

const el = <K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string | number>) => {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
};

let uid = 0;

/**
 * One SVG filter: [blur →] feImage(map) → feDisplacementMap [→ saturate].
 * For backdrop use, blur and saturate must live inside the filter: Chromium drops
 * CSS blur()/saturate() that follow a url() in backdrop-filter.
 */
export class DisplacementFilter {
  readonly id: string;
  private filter: SVGFilterElement;
  private image: SVGFEImageElement;
  private disp: SVGFEDisplacementMapElement;
  private sat: SVGFEColorMatrixElement | null = null;
  private url = '';
  private size = '';
  private scale = '';

  constructor(name: string, { blur = 0, saturate = 1 }: { blur?: number; saturate?: number } = {}) {
    this.id = `glass-${name}-${(uid += 1)}`;
    this.filter = el('filter', {
      id: this.id,
      filterUnits: 'userSpaceOnUse',
      primitiveUnits: 'userSpaceOnUse',
      'color-interpolation-filters': 'sRGB',
      x: 0,
      y: 0,
      width: 1,
      height: 1
    });
    let source = 'SourceGraphic';
    if (blur > 0) {
      this.filter.appendChild(el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: blur, edgeMode: 'duplicate', result: 'soft' }));
      source = 'soft';
    }
    this.image = el('feImage', { result: 'map', preserveAspectRatio: 'none', x: 0, y: 0, width: 1, height: 1 });
    this.disp = el('feDisplacementMap', { in: source, in2: 'map', xChannelSelector: 'R', yChannelSelector: 'G', scale: 0, result: 'bent' });
    this.filter.append(this.image, this.disp);
    if (saturate !== 1) {
      this.sat = el('feColorMatrix', { in: 'bent', type: 'saturate', values: saturate });
      this.filter.appendChild(this.sat);
    }
    ensureDefs().appendChild(this.filter);
  }

  get ref(): string {
    return `url(#${this.id})`;
  }

  /** Filter region and map placement; stretching the current map when it was built for another size. */
  setSize(w: number, h: number, pad = 0): void {
    const key = `${w.toFixed(1)}|${h.toFixed(1)}|${pad}`;
    if (key === this.size) return;
    this.size = key;
    for (const node of [this.filter, this.image] as SVGElement[]) {
      node.setAttribute('x', String(-pad));
      node.setAttribute('y', String(-pad));
      node.setAttribute('width', String(w + 2 * pad));
      node.setAttribute('height', String(h + 2 * pad));
    }
  }

  setMap(url: string): void {
    if (!url || url === this.url) return;
    this.url = url;
    this.image.setAttribute('href', url);
  }

  get hasMap(): boolean {
    return this.url !== '';
  }

  /** Displacement in px (clamped by the caller). */
  setScale(scale: number): void {
    const value = scale.toFixed(2);
    if (value === this.scale) return;
    this.scale = value;
    this.disp.setAttribute('scale', value);
  }

  setSaturate(value: number): void {
    this.sat?.setAttribute('values', String(value));
  }

  destroy(): void {
    this.filter.remove();
  }
}
