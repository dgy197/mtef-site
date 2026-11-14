import type { APIRoute } from 'astro';
import { getNews, urlOf, isoDay, fileHref, picSrc, abs, SITE } from '../lib/news';

/** /sitemap.xml (same URL as before, referenced by robots.txt): pages, items, attachments. No duplicates. */
const LOGO = `${SITE}/assets/brand/magyar-tuzvedelmi-egyezteto-forum-mtef-logo.png`;
const esc = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const GET: APIRoute = async () => {
  const news = await getNews();
  const newest = news[0] ? isoDay(news[0].data.updated ?? news[0].data.date) : undefined;
  type U = { loc: string; lastmod?: string; changefreq: string; priority: string; image?: string };
  const urls: U[] = [
    { loc: `${SITE}/`, lastmod: newest, changefreq: 'weekly', priority: '1.0', image: LOGO },
    { loc: `${SITE}/hirek`, lastmod: newest, changefreq: 'weekly', priority: '0.8' },
  ];
  const seen = new Set(urls.map((u) => u.loc));
  for (const e of news) {
    const lastmod = isoDay(e.data.updated ?? e.data.date);
    urls.push({ loc: SITE + urlOf(e), lastmod, changefreq: 'monthly', priority: '0.9', image: abs(picSrc(e.data.cover)) });
    for (const a of e.data.attachments) {
      const loc = SITE + fileHref(e, a.file);
      if (!seen.has(loc)) urls.push({ loc, lastmod, changefreq: 'yearly', priority: '0.6' });
      seen.add(loc);
    }
  }
  for (const p of ['adatvedelem', 'impresszum', 'sutik'])
    urls.push({ loc: `${SITE}/${p}`, lastmod: '2026-08-18', changefreq: 'monthly', priority: '0.4' });
  const body = urls.map((u) => [
    '  <url>',
    `    <loc>${esc(u.loc)}</loc>`,
    u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : '',
    `    <changefreq>${u.changefreq}</changefreq>`,
    `    <priority>${u.priority}</priority>`,
    u.image ? `    <image:image><image:loc>${esc(u.image)}</image:loc></image:image>` : '',
    '  </url>',
  ].filter(Boolean).join('\n')).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
