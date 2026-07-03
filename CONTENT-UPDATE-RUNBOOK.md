# MTEF hírek / közlemények / dokumentumok frissítési emlékeztető

Ez a fájl azt rögzíti, hogy egy új vagy módosított MTEF hír/közlemény/dokumentum esetén **mit hol kell átírni**. Párja: `content-update-runbook.json`.

## Aranyszabály

**Soha nem frissítünk csak egyetlen oldalt.**

Egy új közlemény vagy dokumentum akkor kész, ha megjelenik:

- a belső adatlistában,
- az önálló közleményoldalon,
- a főoldali hírkártyák között, ha releváns,
- a `/hirek` listában,
- a sitemapben,
- a JSON-LD/schema adatokban,
- és minden letölthető dokumentum tényleg létezik productionben.

## 1. Alap adatforrás

### `content/news.json`

Új hír/közlemény első helye ez a fájl.

Kötelező mezők:

```json
{
  "id": "kebab-case-slug",
  "date": "YYYY-MM-DD",
  "displayDate": "YYYY. hónap nap.",
  "category": "Kategória",
  "title": "Cím",
  "excerpt": "Rövid összefoglaló",
  "url": "/kozlemenyek/kebab-case-slug",
  "pdfUrl": "/assets/documents/file.pdf",
  "docxUrl": "/assets/documents/file.docx",
  "priority": 0.9,
  "schemaType": "NewsArticle"
}
```

Megjegyzés:
- `id` = stabil slug, lehetőleg egyezzen az URL utolsó részével.
- `pdfUrl` / `docxUrl` csak akkor kell, ha van dokumentum.
- A `scripts/generate-news.mjs` dátum szerint csökkenő sorrendbe rendezi.

## 2. Önálló közleményoldal

### `kozlemenyek/<id>/index.html`

Új közleménynél hozz létre önálló oldalt. Legbiztonságosabb egy meglévő közleményoldalt másolni, majd minden meta/adat részt átírni.

Ellenőrizendő:

- `<title>`
- meta description
- canonical URL
- OG/Twitter title/description/url
- `NewsArticle` JSON-LD
- `datePublished`
- `dateModified`
- publisher/logo URL
- teljes szöveg
- PDF/DOCX gombok
- visszalink `/` és `/hirek` felé

## 3. Dokumentumok

### `assets/documents/`

Minden PDF/DOCX ide kerüljön.

Névkonvenció:

- kisbetű
- kötőjeles
- ékezet nélkül
- szóköz nélkül
- lehetőleg év/téma szerepeljen benne

Példa:

```text
assets/documents/kozos-szakmai-alapvetes-magyar-tuzvedelem-2026.pdf
assets/documents/kozos-szakmai-alapvetes-magyar-tuzvedelem-2026.docx
```

Ha új tartós dokumentum kerül fel, frissítsd:

- `content/news.json` `pdfUrl` / `docxUrl`
- a közleményoldal download linkjeit
- a közleményoldal JSON-LD `associatedMedia` / `encoding` részét
- `site-database.json` `criticalAssets.documents` listáját, ha fontos/durva hivatkozású dokumentum
- `SITE-DATABASE.md` dokumentum listáját

## 4. Generált belépési pontok

### `scripts/generate-news.mjs`

Ez frissíti:

- `index.html` `<!-- NEWS_CARDS_START --> ... <!-- NEWS_CARDS_END -->`
- `hirek/index.html` `<!-- NEWS_LIST_START --> ... <!-- NEWS_LIST_END -->`
- `sitemap.xml` `<!-- NEWS_SITEMAP_START --> ... <!-- NEWS_SITEMAP_END -->`

Futtatás:

```bash
node scripts/generate-news.mjs
```

Általában a scriptet nem kell átírni, csak futtatni. Csak akkor módosítsd, ha a hírkártya/lista/sitemap sablon változik.

## 5. Főoldal manuális hotspot

### `index.html`

A generator frissíti a látható hírkártyákat, de a `<head>` környéki strukturált adatokban (`NewsArticle`, dokumentum schema) lehet kézi frissítési igény.

Új fontos közleménynél ellenőrizd az `index.html` elején:

- `NewsArticle` schema
- dokumentum `MediaObject` URL-ek
- dátumok
- címek

## 6. Hírek oldal

### `hirek/index.html`

Generator után ellenőrizd:

- az új hír megjelent,
- legfrissebb hír van legfelül,
- PDF/DOCX linkek jók,
- minden link clean URL-re mutat.

## 7. Sitemap

### `sitemap.xml`

Generator után ellenőrizd:

- új közlemény URL szerepel,
- PDF/DOCX URL szerepel, ha van,
- `lastmod` helyes.

## 8. Site-adatbázis frissítés

Ha új tartós route vagy fontos dokumentum kerül fel:

- `site-database.json`
- `SITE-DATABASE.md`

Ezek a honlap “kezdő adatbázisai”. Nem maradhatnak le a tartós változásokról.

## 9. Kötelező parancsok deploy előtt

```bash
node scripts/generate-news.mjs
./validate.sh .
python3 scripts/asset-guard.py --site . --output .vercel/output/static
```

Ha production deploy is kell:

```bash
vercel deploy --prebuilt --prod --yes
```

## 10. Deploy utáni live check

Ellenőrizd élőben:

- `https://mtef.hu/`
- `https://mtef.hu/hirek`
- `https://mtef.hu/kozlemenyek/<id>`
- minden új PDF/DOCX URL
- `https://mtef.hu/sitemap.xml`
- `https://mtef.hu/logos/mtef.png`
- partnerlogók és hero kép továbbra is 200

## Rövid checklist új közleményhez

- [ ] PDF/DOCX bemásolva `assets/documents/` alá
- [ ] új elem `content/news.json`-ban
- [ ] új oldal `kozlemenyek/<id>/index.html`
- [ ] article schema kész
- [ ] download linkek jók
- [ ] `node scripts/generate-news.mjs`
- [ ] főoldali schema kézzel ellenőrizve
- [ ] `/hirek` sorrend ellenőrizve
- [ ] sitemap ellenőrizve
- [ ] `site-database.json` / `SITE-DATABASE.md` frissítve, ha tartós elem
- [ ] `./validate.sh .`
- [ ] `python3 scripts/asset-guard.py --site . --output .vercel/output/static`
- [ ] deploy után live check
