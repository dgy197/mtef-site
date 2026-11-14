import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { TYPE_LABELS } from '../content/kozlemenyek.schema';

export type Item = CollectionEntry<'kozlemenyek'>;
export const SITE = 'https://mtef.hu';

/** Published items, newest first (drafts only in `astro dev`). */
export async function getNews(): Promise<Item[]> {
  const all = await getCollection('kozlemenyek', (e) => import.meta.env.DEV || !e.data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export const urlOf = (e: Item) => `/kozlemenyek/${e.id}`;
export const labelOf = (e: Item) => e.data.label ?? TYPE_LABELS[e.data.type];
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

const HU_MONTHS = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus',
  'szeptember', 'október', 'november', 'december'];
/** "2026. november 12." (UTC day: frontmatter dates have no time part). */
export const huDate = (d: Date) => `${d.getUTCFullYear()}. ${HU_MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}.`;

/** Public path of a cover/gallery picture (legacy public path or optimized asset). */
export const picSrc = (p: string | ImageMetadata | undefined) => (typeof p === 'string' ? p : p?.src);
export const abs = (path: string | undefined) => (path ? new URL(path, SITE).href : undefined);

/** Public path of an attachment: legacy /assets/documents/... or the item's own folder. */
export const fileHref = (e: Item, file: string) => (file.startsWith('./') ? `/kozlemenyek/${e.id}/${file.slice(2)}` : file);
