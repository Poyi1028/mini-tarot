import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const svg = readFileSync(resolve(root, 'public/crystal.svg'), 'utf8');

// Original viewBox: 23.879 262.732 218.499 205.729
// Make square by centering the shorter height axis, add padding
const vbX = 23.879, vbY = 262.732, vbW = 218.499, vbH = 205.729;
const size = Math.max(vbW, vbH);
const padFactor = 0.12;
const pad = size * padFactor;
const cx = vbX + vbW / 2;
const cy = vbY + vbH / 2;
const half = size / 2 + pad;
const nx = cx - half, ny = cy - half, ns = half * 2;

const modifiedSvg = svg
  .replace(/viewBox="[^"]*"/, `viewBox="${nx} ${ny} ${ns} ${ns}"`)
  .replace(/width="[^"]*"/, 'width="512"')
  .replace(/height="[^"]*"/, 'height="512"')
  .replace(
    /<g id="OBJECTS">/,
    `<rect x="${nx}" y="${ny}" width="${ns}" height="${ns}" fill="#070709"/>\n\t<g id="OBJECTS">`
  );

const buf = Buffer.from(modifiedSvg);

await sharp(buf).resize(192, 192).png().toFile(resolve(root, 'public/icon-192.png'));
console.log('icon-192.png done');

await sharp(buf).resize(512, 512).png().toFile(resolve(root, 'public/icon-512.png'));
console.log('icon-512.png done');
