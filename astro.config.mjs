// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { readPublicSizes, publicImgPlugin } from './src/lib/public-img.mjs';

const publicSizes = await readPublicSizes();

// Static build served by Vercel with cleanUrls + trailingSlash:false (vercel.json).
// build.format 'file' emits /kozlemenyek/<slug>.html, so every legacy URL
// (/hirek, /adatvedelem, /kozlemenyek/<slug>) keeps its exact path.
export default defineConfig({
  site: 'https://mtef.hu',
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: false,
  markdown: { processor: satteri({ hastPlugins: [publicImgPlugin(publicSizes)] }) },
});
