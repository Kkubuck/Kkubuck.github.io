import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Reuse Astro's image renderer; no additional dependency or build step is needed.
const require = createRequire(import.meta.url);
const astroRequire = createRequire(require.resolve('astro/package.json'));
const sharp = astroRequire('sharp');
const icon = await readFile(new URL('../public/favicon.svg', import.meta.url));
for (const [file, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  await sharp(icon).resize(size, size).png().toFile(fileURLToPath(new URL(`../public/${file}`, import.meta.url)));
}
await sharp(await readFile(new URL('../public/assets/img/og-card.svg', import.meta.url)))
  .png().toFile(fileURLToPath(new URL('../public/assets/img/og-card.png', import.meta.url)));
