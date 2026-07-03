import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const news = JSON.parse(readFileSync('content/news.json', 'utf8'));
const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
const esc = (s) => String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function homeCard(item) {
  return `      <article class="bg-white border border-line/80 rounded-2xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(26,29,33,0.04)] reveal">
        <p class="eyebrow text-[10px] text-fire mb-4 font-semibold">${esc(item.category)} · ${esc(item.displayDate)}</p>
        <h3 class="text-xl font-semibold leading-snug text-ink">${esc(item.title)}</h3>
        <p class="mt-4 text-[15px] leading-relaxed text-warmgray">${esc(item.excerpt)}</p>
        <a href="${esc(item.url)}" class="mt-6 inline-flex items-center gap-2 text-[14.5px] font-medium text-fire hover:underline underline-offset-4 decoration-fire/40">
          Közlemény olvasása
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </article>`;
}

function listCard(item) {
  const downloads = [
    item.pdfUrl ? `<a href="${esc(item.pdfUrl)}" download class="text-[14.5px] font-medium text-ink/70 hover:text-fire hover:underline underline-offset-4 decoration-fire/40">PDF letöltése</a>` : '',
    item.docxUrl ? `<a href="${esc(item.docxUrl)}" download class="text-[14.5px] font-medium text-ink/70 hover:text-fire hover:underline underline-offset-4 decoration-fire/40">DOCX letöltése</a>` : '',
  ].filter(Boolean).join('\n      ');
  return `  <article class="border border-line rounded-2xl p-7 sm:p-8 hover:border-ink/20 hover:shadow-[0_8px_30px_rgba(26,29,33,0.06)] transition-all mb-6">
    <p class="eyebrow text-[11px] text-fire mb-3 font-semibold">${esc(item.category)} · ${esc(item.displayDate)}</p>
    <h2 class="font-bold tracking-tightish text-ink text-2xl sm:text-3xl leading-[1.1] mb-3">
      <a href="${esc(item.url)}" class="hover:text-fire transition-colors">${esc(item.title)}</a>
    </h2>
    <p class="text-[16px] text-ink/70 leading-[1.72] mb-5 max-w-2xl">${esc(item.excerpt)}</p>
    <div class="flex flex-wrap items-center gap-4">
      <a href="${esc(item.url)}" class="inline-flex items-center gap-2 text-fire text-[14.5px] font-medium hover:underline underline-offset-4 decoration-fire/40">
        Közlemény teljes szövege
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
      ${downloads}
    </div>
  </article>`;
}

function statementPage(item) {
  const canonical = `https://mtef.hu${item.url}`;
  const description = item.seoDescription || item.excerpt;
  const title = item.seoTitle || `${item.title} — MTEF`;
  const body = item.body || item.excerpt;
  const downloads = [
    item.pdfUrl ? `<a href="${esc(item.pdfUrl)}" download class="inline-flex items-center gap-2 text-[14.5px] font-medium text-ink hover:text-fire hover:underline underline-offset-4 decoration-fire/40">PDF letöltése</a>` : '',
    item.docxUrl ? `<a href="${esc(item.docxUrl)}" download class="inline-flex items-center gap-2 text-[14.5px] font-medium text-ink hover:text-fire hover:underline underline-offset-4 decoration-fire/40">DOCX letöltése</a>` : '',
  ].filter(Boolean).join('\n        ');
  const mediaBlock = item.imageUrl ? `<figure class="my-8"><img src="${esc(item.imageUrl)}" alt="${esc(item.imageAlt || item.title)}" class="w-full rounded-2xl border border-line bg-white" loading="lazy" /></figure>` : '';
  const videoBlock = (item.videoEmbeds || []).map((video) => {
    const url = typeof video === 'string' ? video : video.url;
    const videoTitle = typeof video === 'string' ? 'Kapcsolódó videó' : (video.title || 'Kapcsolódó videó');
    return `<div class="my-8 rounded-2xl border border-line bg-white p-5"><p class="eyebrow text-[10px] text-fire mb-2 font-semibold">Videó</p><a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="text-fire font-medium hover:underline underline-offset-4">${esc(videoTitle)}</a></div>`;
  }).join('\n      ');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': item.schemaType || 'NewsArticle',
    headline: item.title,
    description,
    datePublished: `${item.date}T12:00:00+02:00`,
    dateModified: `${item.date}T12:00:00+02:00`,
    inLanguage: 'hu-HU',
    mainEntityOfPage: canonical,
    url: canonical,
    publisher: {
      '@type': 'Organization',
      name: 'Magyar Tűzvédelmi Egyeztető Fórum',
      alternateName: 'MTEF',
      url: 'https://mtef.hu/',
      logo: { '@type': 'ImageObject', url: 'https://mtef.hu/assets/brand/magyar-tuzvedelmi-egyezteto-forum-mtef-logo.png' }
    },
    author: { '@type': 'Organization', name: 'Magyar Tűzvédelmi Egyeztető Fórum', url: 'https://mtef.hu/' },
    image: item.ogImageUrl ? `https://mtef.hu${item.ogImageUrl}` : (item.imageUrl ? `https://mtef.hu${item.imageUrl}` : 'https://mtef.hu/assets/og-image.png'),
    articleSection: item.category || 'Közlemény'
  };
  return `<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${esc(canonical)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${esc(canonical)}" />
<meta property="og:site_name" content="MTEF" />
<meta property="og:locale" content="hu_HU" />
<meta property="og:image" content="${esc(item.ogImageUrl ? `https://mtef.hu${item.ogImageUrl}` : (item.imageUrl ? `https://mtef.hu${item.imageUrl}` : 'https://mtef.hu/assets/og-image.png'))}" />
<meta property="og:image:alt" content="Magyar Tűzvédelmi Egyeztető Fórum — hivatalos megjelenés" />
<meta property="article:published_time" content="${esc(item.date)}T12:00:00+02:00" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${esc(item.ogImageUrl ? `https://mtef.hu${item.ogImageUrl}` : (item.imageUrl ? `https://mtef.hu${item.imageUrl}` : 'https://mtef.hu/assets/og-image.png'))}" />
<link rel="icon" href="/favicon.ico?v=20260514b" sizes="any" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=20260514b" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20260514b" />
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=20260514b" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=20260514b" />
<link rel="manifest" href="/site.webmanifest?v=20260514b" />
<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = { theme: { extend: { colors: { fire:'#CD2A3E', forest:'#436F4D', ink:'#1A1D21', warmgray:'#6B7280', sand:'#F8F6F2', line:'#E5E7EB' }, fontFamily: { sans:['\"DM Sans\"','system-ui','sans-serif'], serif:['Newsreader','Georgia','serif'], mono:['\"JetBrains Mono\"','ui-monospace','monospace'] }, letterSpacing: { tightish:'-0.02em' } } } }
</script>
<style>
  body { font-family: 'DM Sans', system-ui, sans-serif; color: #1A1D21; background: #F8F6F2; }
  .eyebrow { font-family: 'JetBrains Mono', ui-monospace, monospace; letter-spacing: 0.16em; text-transform: uppercase; }
  .editorial { font-size: clamp(1.06rem, 1rem + 0.22vw, 1.15rem); line-height: 1.9; }
  .hu-stripe-soft { height: 2px; background: linear-gradient(to right, rgba(205,42,62,0.85) 0% 33.33%, rgba(229,231,235,0.9) 33.33% 66.66%, rgba(67,111,77,0.85) 66.66% 100%); }
</style>
</head>
<body class="antialiased">
<header class="border-b border-line bg-white sticky top-0 z-50">
  <div class="max-w-4xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2.5" aria-label="MTEF főoldal"><img src="/logos/mtef.png" alt="MTEF" class="w-8 h-8 object-contain" loading="eager"/><span class="font-bold tracking-tightish text-ink text-[15px] hidden sm:block">MTEF</span></a>
    <nav class="flex items-center gap-5 text-[13px] text-ink/70"><a href="/hirek" class="hover:text-fire transition-colors">← Hírek</a><a href="/" class="hover:text-fire transition-colors">Főoldal</a></nav>
  </div>
</header>
<main>
  <article class="max-w-[720px] mx-auto px-5 sm:px-8 py-14 sm:py-20">
    <header class="mb-10 sm:mb-12">
      <p class="eyebrow text-[11px] text-fire mb-5 font-semibold">${esc(item.category || 'Közlemény')}</p>
      <h1 class="font-bold tracking-tightish text-ink text-3xl sm:text-4xl md:text-5xl leading-[1.05]">${esc(item.title)}</h1>
      <div class="eyebrow mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-warmgray font-medium"><span>${esc(item.displayDate || item.date)}</span><span class="hidden sm:inline text-line">|</span><span>Kiadta: a Magyar Tűzvédelmi Egyeztető Fórum</span></div>
      <div class="hu-stripe-soft w-32 mt-7"></div>
    </header>
    ${mediaBlock}
    <div class="editorial text-ink/85 space-y-6 sm:space-y-7">
      ${String(body).split(/\n{2,}/).map(p => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
    ${videoBlock}
    <footer class="mt-12 pt-8 border-t border-line">
      <div class="flex flex-wrap items-center gap-4">
        ${downloads}
        <a href="mailto:info@mtef.hu" class="inline-flex items-center gap-2 text-[14.5px] font-medium text-fire hover:underline underline-offset-4 decoration-fire/40">info@mtef.hu</a>
        <a href="/" class="inline-flex items-center gap-2 text-[14.5px] font-medium text-ink/60 hover:text-fire transition-colors">← Vissza a főoldalra</a>
        <a href="/hirek" class="inline-flex items-center gap-2 text-[14.5px] font-medium text-ink/60 hover:text-fire transition-colors">Összes közlemény</a>
      </div>
    </footer>
  </article>
</main>
<footer class="border-t border-line bg-white mt-4"><div class="max-w-4xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><p class="text-[12.5px] text-warmgray">© 2026 Magyar Tűzvédelmi Egyeztető Fórum</p><nav class="flex gap-4 text-[12.5px] text-warmgray"><a href="/adatvedelem" class="hover:text-fire transition-colors">Adatvédelem</a><a href="/impresszum" class="hover:text-fire transition-colors">Impresszum</a></nav></div></footer>
</body>
</html>
`;
}

function replaceBetween(text, startMarker, endMarker, replacement) {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker, start);
  if (start === -1 || end === -1) throw new Error(`marker not found: ${startMarker}`);
  return text.slice(0, start + startMarker.length) + '\n' + replacement + '\n' + text.slice(end);
}

let index = readFileSync('index.html', 'utf8');
const homeCards = sorted.slice(0, 2).map(homeCard).join('\n\n') + `\n\n      <article class="bg-white/80 border border-dashed border-line rounded-2xl p-6 sm:p-7 reveal">
        <p class="eyebrow text-[10px] text-warmgray mb-4 font-semibold">Előkészítés alatt</p>
        <h3 class="text-xl font-semibold leading-snug text-ink">Szakmai egyeztetések és állásfoglalások</h3>
        <p class="mt-4 text-[15px] leading-relaxed text-warmgray">A későbbi szakmai hírek, egyeztetések és állásfoglalások itt jelennek meg, önálló, hivatkozható oldalakkal.</p>
      </article>`;
index = replaceBetween(index, '<!-- NEWS_CARDS_START -->', '<!-- NEWS_CARDS_END -->', homeCards);
writeFileSync('index.html', index);

let list = readFileSync('hirek/index.html', 'utf8');
list = replaceBetween(list, '<!-- NEWS_LIST_START -->', '<!-- NEWS_LIST_END -->', sorted.map(listCard).join('\n\n'));
writeFileSync('hirek/index.html', list);

for (const item of sorted) {
  const slug = item.id || item.slug;
  if (!slug || !item.url?.startsWith('/kozlemenyek/')) continue;
  const dir = `kozlemenyek/${slug}`;
  const outputFile = `${dir}/index.html`;
  const shouldGenerate = Boolean(item.body) || item.source === 'ai-tool-test';
  if (!shouldGenerate && existsSync(outputFile)) continue;
  mkdirSync(dir, { recursive: true });
  writeFileSync(outputFile, statementPage({ ...item, slug }));
}

const sitemapExtra = sorted.map((item) => {
  const urls = [`  <url><loc>https://mtef.hu${item.url}</loc><lastmod>${item.date}</lastmod></url>`];
  if (item.pdfUrl) urls.push(`  <url><loc>https://mtef.hu${item.pdfUrl}</loc><lastmod>${item.date}</lastmod></url>`);
  if (item.docxUrl) urls.push(`  <url><loc>https://mtef.hu${item.docxUrl}</loc><lastmod>${item.date}</lastmod></url>`);
  return urls.join('\n');
}).join('\n');
let sitemap = readFileSync('sitemap.xml', 'utf8');
sitemap = replaceBetween(sitemap, '<!-- NEWS_SITEMAP_START -->', '<!-- NEWS_SITEMAP_END -->', sitemapExtra);
writeFileSync('sitemap.xml', sitemap);
console.log(`Generated MTEF news from ${sorted.length} items.`);
