# MTEF / MTFE landing page

Statikus, egyoldalas bemutatkozó honlap a Magyar Tűzvédelmi Egyeztető Fórum számára.

## Állapot
- design: megtartva az eredeti koncepció szerint
- tech: statikus HTML, Vercelre azonnal kitehető
- cél: gyors publikus preview + későbbi fokozatos dinamizálás

## Fájlok
- `index.html` — főoldal
- `logos/` — használt logók
- `assets/` — kiegészítő assetek / OG image helye
- `adatvedelem.html` — ideiglenes adatvédelmi oldal
- `impresszum.html` — ideiglenes impresszum oldal
- `vercel.json` — Vercel beállítások
- `robots.txt`, `sitemap.xml` — alap SEO fájlok

## Lokális futtatás
```bash
python3 -m http.server 4173
```

## GitHub + Vercel
1. hozz létre új GitHub repót
2. pushold ezt a mappát
3. Vercelben importáld a repót
4. framework preset: Other
5. output directory nem kell

## Javasolt következő lépések
- végleges OG image készítése: `assets/og-image.png`
- végleges PDF közlemény publikálása
- végleges adatvédelmi + impresszum szöveg
- domain bekötés (`mtef.hu` vagy aldomain)
- strukturált adatok / NewsArticle / Organization JSON-LD

## MCP / dinamizálás irány
A jelenlegi statikus oldal jó public shell lehet. A későbbi dinamikus elemeket érdemes külön adatforrásból húzni:
- közlemények
- hírek / sajtó
- dokumentumtár
- események
- alapító szervezetek és contact adatok

Javasolt architektúra: statikus frontend + külön lightweight content/API réteg, ami később MCP-kompatibilis lehet.
