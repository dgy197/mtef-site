# MTEF site kezdő adatbázis

Ez a fájl a `site-database.json` emberi olvasatú párja. Cél: ne csak a fejünkben legyen, mi van a honlapon, hanem deploy előtt géppel is ellenőrizhető legyen.

## Alapadatok

- Site: Magyar Tűzvédelmi Egyeztető Fórum (MTEF)
- Production: https://mtef.hu
- Projekt: `/Users/openclaw/.openclaw/workspace/projects/mtef-site`
- Platform: Vercel prebuilt static output
- Deploy: `vercel deploy --prebuilt --prod --yes`

## Kritikus invariant

**Minden HTML-ben hivatkozott lokális assetnek léteznie kell a forrásban ÉS a `.vercel/output/static` deploy outputban is.**

2026-05-16 incidens: az oldal `logos/*.png` képekre hivatkozott, de a prebuilt Vercel outputból hiányzott a teljes `/logos` mappa, ezért eltűnt a fő MTEF logó és a partnerlogók.

## Oldalak

- `/` → `index.html`
- `/hirek` → `hirek/index.html`
- `/kozlemenyek/30-eves-a-magyar-mernoki-kamara-gyapjas-janos-pap-zoltan-nivodij` → jubileumi hír és laudáció
- `/kozlemenyek/megalakult-a-magyar-tuzvedelmi-egyezteto-forum` → közlemény oldal
- `/kozlemenyek/kozos-szakmai-alapvetes-a-magyar-tuzvedelem-korszerusitesehez` → közös szakmai alapvetés oldal
- `/adatvedelem` → `adatvedelem.html`
- `/impresszum` → `impresszum.html`
- `/sitemap.xml`
- `/robots.txt`

## Kritikus assetek

### Brand

- `logos/mtef.png` — navbar/footer látható MTEF logó
- `assets/brand/magyar-tuzvedelmi-egyezteto-forum-mtef-logo.png` — schema/brand logo
- `mtef-logo-google.png`

### Hero

- `assets/hero-grafika-cutout.png`
- `assets/hero-grafika.png`

### Partnerlogók

- `logos/mtsz.png`
- `logos/mmk.png`
- `logos/mek.png`
- `logos/tszvsz.png`
- `logos/evosz.png`
- `logos/tmke.png`

### Favikonok

- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-48x48.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest`

### Dokumentumok

- `assets/uploads/mmk-30-ev-gyapjas-janos.jpg`
- `assets/documents/mtef-kozlemeny-2026-05-04.pdf`
- `assets/documents/kozos-szakmai-alapvetes-magyar-tuzvedelem-2026.pdf`
- `assets/documents/kozos-szakmai-alapvetes-magyar-tuzvedelem-2026.docx`

## Kötelező predeploy lépések

```bash
./validate.sh .
python3 scripts/asset-guard.py --site . --output .vercel/output/static
vercel deploy --prebuilt --prod --yes
```

Live check deploy után:

- `https://mtef.hu/`
- `https://mtef.hu/logos/mtef.png`
- minden `https://mtef.hu/logos/*.png` partnerlogó
- `https://mtef.hu/assets/hero-grafika-cutout.png`
- `https://mtef.hu/hirek`
- `https://mtef.hu/sitemap.xml`
- `https://mtef.hu/robots.txt`

## Megjegyzés

Ez kezdő adatbázis, nem végleges CMS. Ha új oldal, hír, dokumentum vagy asset kerül fel, frissíteni kell a `site-database.json`-t és ezt a fájlt is.
