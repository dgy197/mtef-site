# mtef.hu

A Magyar Tűzvédelmi Egyeztető Fórum honlapja. Astro 7 statikus build, Tailwind 3 (buildelt CSS),
saját tárhelyes betűk (fontsource), Vercel-hosting. Külső CDN-szkript és Google Fonts nincs.

## Szerkezet

- `src/pages/` - oldalak: főoldal, `/hirek`, a három jogi oldal, a cikk-sablon (`kozlemenyek/[slug].astro`),
  `sitemap.xml`, `hirek/rss.xml`.
- `src/content/kozlemenyek/<slug>/index.md` - egy közlemény vagy hír = egy mappa. A mappa neve a slug és
  az URL utolsó tagja: `/kozlemenyek/<slug>`. A képek és a csatolmányok a mappában, az `index.md` mellett.
- `src/content/kozlemenyek.schema.ts` - a tartalom sémája (zod, Astro-függőség nélkül, a konnektor is ezt használja).
- `public/` - változatlan URL-ű fájlok: logók, ikonok, a régi `/assets/uploads/*` képek és `/assets/documents/*` csatolmányok.
- `scripts/` - ellenőrzések: `asset-guard.py`, `url-check.py` + `legacy-urls.txt`, `content-guard.mjs`.

## Új közlemény vagy hír

1. Ág: `content/<slug>` a `main`-ből.
2. Mappa: `src/content/kozlemenyek/<slug>/` (kisbetű, ékezet nélkül, kötőjellel).
3. `index.md` frontmatterrel, a törzs Markdown. Nyers HTML nem lehet, csak `<sup>`; import/export és MDX sem.
4. Képek és csatolmányok a mappába, kisbetűs kötőjeles névvel (`jpg`, `png`, `webp`, `pdf`, `docx`), hivatkozás `./nev.jpg` alakban.
   A mappán belüli képeket az Astro optimalizálja.
5. `draft: false` nélkül a tétel nem jelenik meg (a hiányzó jelölés = piszkozat).
6. PR a `main` felé. A `content/*` ág csak a `src/content/kozlemenyek/<slug>/` alá írhat, ezt a CI ellenőrzi.

Frontmatter-minta:

```yaml
---
title: "A közlemény címe"
date: 2026-11-14
type: kozlemeny            # kozlemeny | hir
label: "Szakmai közlemény"  # nem kötelező, a típusból is jön
summary: "Egy-két mondat a kártyára és a meta descriptionbe (50-300 karakter)."
cover: "./borito.jpg"
coverAlt: "A kép leírása"
attachments:
  - file: "./kozlemeny.pdf"
    title: "PDF letöltése"
draft: false
---
```

Opcionális mezők még: `updated`, `kicker` (felcím), `subtitle` (alcím), `dateline` (a dátum helyett, pl.
„Budapest · 2026. május 4. · 10:50”), `byline` (a meta-sor második eleme; alapból
„Kiadta: a Magyar Tűzvédelmi Egyeztető Fórum”, üres szöveg = nincs), `gallery`, `galleryTitle`, `video`, `links`, `author`.
A pontos szabályok a sémában.

## Helyi munka

```bash
npm ci
npm run dev            # http://127.0.0.1:4321
npm run build          # astro build + asset guard
npm run check          # astro check
npm run check:urls     # minden régi URL megvan-e a dist-ben
npm run check:content  # tartalom- és útvonal-őr
```

## Kiadás

- A `main` védett: csak PR-rel, zöld CI-vel. A `main`-re merge maga az éles kiadás (Vercel Git-integráció).
- A PR-ekből Vercel-előnézet készül.
- URL-t megszüntetni csak `vercel.json` redirecttel lehet; a `scripts/legacy-urls.txt` a régi oldal befagyasztott URL-listája.
- Rollback: azonnal az előző production-deploy promote-ja, tartósan revert-commit.
