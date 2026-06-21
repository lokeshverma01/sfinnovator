/**
 * Generate the default OG share image (PNG) from scripts/og-default.svg.
 * Social platforms (LinkedIn, X, Facebook, Slack) don't reliably render SVG
 * OG images, so we rasterize to a 1200x630 PNG that they all accept.
 *
 * Run:  node scripts/build-og.mjs
 * Output: public/images/og-default.png
 */
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

const svg = readFileSync(new URL('./og-default.svg', import.meta.url));
mkdirSync(new URL('../public/images/', import.meta.url), { recursive: true });

await sharp(svg, { density: 144 })
  .resize(1200, 630)
  .png()
  .toFile(new URL('../public/images/og-default.png', import.meta.url).pathname);

console.log('✓ Wrote public/images/og-default.png (1200x630)');
