#!/usr/bin/env node
/**
 * MTEF Directus export.
 * Maps published Directus `mtef_news` records to the existing static `content/news.json` shape.
 *
 * Usage:
 *   node scripts/mtef-directus-export.mjs --sample
 *   DIRECTUS_URL=http://localhost:8055 DIRECTUS_TOKEN=... node scripts/mtef-directus-export.mjs --dry-run
 *   DIRECTUS_URL=http://localhost:8055 DIRECTUS_TOKEN=... node scripts/mtef-directus-export.mjs --write
 *   node scripts/mtef-directus-export.mjs --from-seed --dry-run
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
const dryRun = process.argv.includes('--dry-run');
const writeMode = process.argv.includes('--write');
const fromSeed = process.argv.includes('--from-seed');
const seedPath = process.argv.find(a => a.startsWith('--seed='))?.split('=')[1] || 'content/directus/seed-mtef-current.json';
const outputPath = process.argv.find(a => a.startsWith('--output='))?.split('=')[1] || 'content/news.json';

function compact(value) {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined && v !== null && v !== ''));
}

function mapNews(item) {
  return compact({
    id: item.slug,
    date: item.date || (item.published_at || item.date_created || '').slice(0, 10),
    displayDate: item.display_date || item.displayDate || item.published_at || item.date_created || '',
    category: item.category || 'Közlemény',
    title: item.title,
    excerpt: item.excerpt,
    url: item.url || `/kozlemenyek/${item.slug}`,
    mmkUrl: item.mmk_url || item.mmkUrl,
    pdfUrl: item.pdf_url || item.pdfUrl,
    docxUrl: item.docx_url || item.docxUrl,
    body: item.body,
    imageUrl: item.image_url || item.imageUrl,
    imageAlt: item.image_alt || item.imageAlt,
    ogImageUrl: item.og_image_url || item.ogImageUrl,
    priority: item.priority || 0.8,
    schemaType: item.schema_type || item.schemaType || 'NewsArticle'
  });
}

async function fetchPublishedNews() {
  if (!DIRECTUS_TOKEN) {
    throw new Error('Missing DIRECTUS_TOKEN. Use --sample/--from-seed for local shape preview or set DIRECTUS_TOKEN.');
  }
  const url = new URL('/items/mtef_news', DIRECTUS_URL);
  url.searchParams.set('filter[status][_eq]', 'published');
  url.searchParams.set('sort', '-published_at');
  url.searchParams.set('fields', 'slug,title,excerpt,category,published_at,date_created,display_date,url,mmk_url,pdf_url,docx_url,priority,schema_type');
  const res = await fetch(url, { headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` } });
  if (!res.ok) throw new Error(`Directus fetch failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.data || [];
}

function loadSeedNews() {
  const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
  const docBySlug = Object.fromEntries((seed.documents || []).map(d => [d.slug, d]));
  return (seed.news || []).filter(n => n.status === 'published').map(n => {
    const docs = (n.documents || []).map(slug => docBySlug[slug]).filter(Boolean);
    const pdf = docs.find(d => d.kind === 'pdf');
    const docx = docs.find(d => d.kind === 'docx');
    return {
      ...n,
      pdf_url: pdf?.public_url,
      docx_url: docx?.public_url
    };
  });
}

if (process.argv.includes('--sample')) {
  const sample = mapNews({
    slug: 'minta-kozlemeny',
    title: 'Minta közlemény',
    excerpt: 'Minta összefoglaló.',
    category: 'Közlemény',
    published_at: '2026-05-16T12:00:00Z',
    priority: 0.8
  });
  console.log(JSON.stringify([sample], null, 2));
  process.exit(0);
}

try {
  const rows = fromSeed ? loadSeedNews() : await fetchPublishedNews();
  const mapped = rows.map(mapNews).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (dryRun || !writeMode) {
    console.log(JSON.stringify(mapped, null, 2));
    if (!dryRun && !writeMode) console.error('\n(no write: pass --write to update content/news.json)');
  } else {
    writeFileSync(outputPath, JSON.stringify(mapped, null, 2) + '\n');
    console.log(`Wrote ${mapped.length} news items to ${outputPath}`);
  }
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
