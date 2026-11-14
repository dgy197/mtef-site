// Markdown body pictures that point into public/ (legacy /assets/uploads/... paths)
// are not processed by Astro. This Sätteri hast plugin gives them lazy loading and
// their intrinsic size, so the browser reserves the box (no layout shift).
// Sätteri visitors are synchronous, so the sizes are read once, up front.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const UPLOADS = '/assets/uploads';

/** Map of public path -> { width, height } for every picture under public/assets/uploads. */
export async function readPublicSizes(root = process.cwd()) {
  const dir = join(root, 'public', UPLOADS);
  const sizes = new Map();
  for (const name of readdirSync(dir)) {
    if (!/\.(jpe?g|png|webp)$/i.test(name)) continue;
    const m = await sharp(join(dir, name)).metadata();
    sizes.set(`${UPLOADS}/${name}`, { width: m.width, height: m.height });
  }
  return sizes;
}

let cached;
/** Memoized readPublicSizes() for pages (the article template sizes legacy covers and galleries). */
export const publicSizes = () => (cached ??= readPublicSizes());

/** Intrinsic size of a legacy /assets/uploads picture; throws if it is unknown. */
export async function sizeOf(src) {
  const s = (await publicSizes()).get(src);
  if (!s) throw new Error(`public-img: no size for ${src} (only ${UPLOADS}/* is supported)`);
  return s;
}

export function publicImgPlugin(sizes) {
  return {
    name: 'public-img',
    element: {
      filter: ['img'],
      visit(node, ctx) {
        const p = node.properties ?? {};
        const src = typeof p.src === 'string' ? decodeURI(p.src) : '';
        if (!src.startsWith('/') || src.startsWith('//')) return;
        if (p.loading == null) ctx.setProperty(node, 'loading', 'lazy');
        if (p.decoding == null) ctx.setProperty(node, 'decoding', 'async');
        const s = sizes.get(src);
        if (!s) throw new Error(`public-img: no size for ${src} (only ${UPLOADS}/* is supported)`);
        if (p.width == null) ctx.setProperty(node, 'width', String(s.width));
        if (p.height == null) ctx.setProperty(node, 'height', String(s.height));
      },
    },
  };
}
