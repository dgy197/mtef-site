/**
 * Shared content schema of an MTEF news item / statement.
 *
 * One item = one folder: src/content/kozlemenyek/<slug>/index.md, next to its own
 * images and attachments. The folder name is the slug and the last URL segment:
 * /kozlemenyek/<slug>.
 *
 * This file has NO Astro dependency (plain zod) so the MCP connector can import
 * the very same rules. Astro passes its `image()` helper for folder images; the
 * connector can pass `localImage` below (a string check of the same rule).
 */
import { z } from 'zod';

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const slugSchema = z.string().min(3).max(80).regex(SLUG_RE);

/** Image or file next to index.md (the only form new content may use). */
export const LOCAL_IMAGE_RE = /^\.\/[a-z0-9]+(-[a-z0-9]+)*\.(jpe?g|png|webp)$/;
export const LOCAL_FILE_RE = /^\.\/[a-z0-9]+(-[a-z0-9]+)*\.(pdf|docx)$/;
/** Pre-Astro public paths, kept so legacy URLs stay valid. Migrated items only. */
export const LEGACY_IMAGE_RE = /^\/assets\/uploads\/[A-Za-z0-9._-]+\.(jpe?g|png|webp)$/;
export const LEGACY_FILE_RE = /^\/assets\/documents\/[a-z0-9-]+\.(pdf|docx)$/;
export const VIDEO_RE = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=[\w-]{11}|youtu\.be\/[\w-]{11}|vimeo\.com\/\d+)$/;

export const localImage = z.string().regex(LOCAL_IMAGE_RE);
const legacyImage = z.string().regex(LEGACY_IMAGE_RE);

export const TYPE_LABELS = { kozlemeny: 'Szakmai közlemény', hir: 'Hír' } as const;

export function kozlemenySchema<I extends z.ZodType>(image: I) {
  const picture = z.union([legacyImage, image]);
  return z
    .object({
      title: z.string().min(10).max(160),
      /** Publication day; the displayed Hungarian date is derived from it. */
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      type: z.enum(['kozlemeny', 'hir']),
      /** Displayed category (e.g. "Konferencia"); defaults to the type's label. */
      label: z.string().min(2).max(40).optional(),
      /** Card text and meta description. */
      summary: z.string().min(50).max(300),
      /** Small grey line above the title (article page only). */
      kicker: z.string().min(5).max(200).optional(),
      /** Serif standfirst under the title (article page only). */
      subtitle: z.string().min(20).max(400).optional(),
      /** Replaces the derived date in the article meta row, e.g. "Budapest · 2026. május 4. · 10:50". */
      dateline: z.string().min(5).max(80).optional(),
      /** Second item of the meta row; default "Kiadta: a Magyar Tűzvédelmi Egyeztető Fórum" (or the author). Empty = hidden. */
      byline: z.string().max(120).optional(),
      cover: picture.optional(),
      coverAlt: z.string().min(5).max(300).optional(),
      galleryTitle: z.string().max(80).optional(),
      gallery: z.array(z.object({ src: picture, alt: z.string().min(5).max(300) })).max(40).default([]),
      attachments: z
        .array(z.object({
          file: z.union([z.string().regex(LOCAL_FILE_RE), z.string().regex(LEGACY_FILE_RE)]),
          title: z.string().min(3).max(120),
        }))
        .max(10)
        .default([]),
      video: z.string().regex(VIDEO_RE).optional(),
      links: z
        .array(z.object({ title: z.string().min(3).max(200), url: z.url().regex(/^https?:\/\//) }))
        .max(10)
        .default([]),
      author: z.string().min(2).max(120).default('MTEF'),
      /** Missing flag = not published. */
      draft: z.boolean().default(true),
    })
    .strict()
    .refine((d) => !d.cover || !!d.coverAlt, { message: 'coverAlt is required when cover is set', path: ['coverAlt'] })
    .refine((d) => !d.updated || d.updated >= d.date, { message: 'updated must not precede date', path: ['updated'] });
}
