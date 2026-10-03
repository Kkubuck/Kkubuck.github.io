/**
 * Intrinsic size of a PNG, JPEG, GIF or WebP file, from its header (build time only).
 * Post images get width/height attributes from it, so the browser reserves their box
 * before a lazy image loads (no layout shift, and TOC jumps land where they aim).
 */
import { readFileSync } from 'node:fs';

export interface ImageSize {
  width: number;
  height: number;
}

const cache = new Map<string, ImageSize | null>();

export function imageSize(file: string): ImageSize | null {
  if (cache.has(file)) return cache.get(file)!;
  let size: ImageSize | null = null;
  try {
    size = parse(readFileSync(file));
  } catch {
    size = null;
  }
  cache.set(file, size);
  return size;
}

function parse(b: Buffer): ImageSize | null {
  // PNG: signature, then the IHDR chunk.
  if (b.length >= 24 && b.readUInt32BE(0) === 0x89504e47 && b.toString('ascii', 12, 16) === 'IHDR') {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  // GIF
  if (b.length >= 10 && b.toString('ascii', 0, 3) === 'GIF') {
    return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  }
  // WebP (lossy, lossless, extended)
  if (b.length >= 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16);
    if (kind === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (kind === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (kind === 'VP8X') return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
  }
  // JPEG: walk the segments to a start-of-frame marker.
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    let at = 2;
    while (at + 9 < b.length) {
      if (b[at] !== 0xff) return null;
      const marker = b[at + 1]!;
      const length = b.readUInt16BE(at + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: b.readUInt16BE(at + 7), height: b.readUInt16BE(at + 5) };
      }
      at += 2 + length;
    }
  }
  return null;
}
