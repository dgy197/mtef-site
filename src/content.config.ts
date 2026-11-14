import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { kozlemenySchema } from './content/kozlemenyek.schema';

/** One folder per item: src/content/kozlemenyek/<slug>/index.md (folders starting with _ are skipped). */
const kozlemenyek = defineCollection({
  loader: glob({
    pattern: '[^_]*/index.md',
    base: './src/content/kozlemenyek',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) => kozlemenySchema(image()),
});

export const collections = { kozlemenyek };
