# MTEF landing page

Statikus, egyoldalas bemutatkozó honlap a Magyar Tűzvédelmi Egyeztető Fórum számára.

## Állapot
- design: megtartva az eredeti koncepció szerint
- tech: statikus HTML, Vercelre azonnal kitehető
- cél: gyors publikus preview + későbbi fokozatos dinamizálás

## Fájlok
- `index.html` — főoldal
- `logos/` — használt logók
- `assets/` — kiegészítő assetek / OG image helye
- `adatvedelem.html` — adatkezelési tájékoztató
- `impresszum.html` — impresszum oldal
- `vercel.json` — Vercel beállítások
- `robots.txt`, `sitemap.xml` — alap SEO fájlok

## Lokális futtatás
```bash
python3 -m http.server 4173
```

## Site database + kötelező asset guard

A honlap kezdő adatbázisa: `site-database.json` és `SITE-DATABASE.md`.

Tartalomfrissítés emlékeztetője: `content-update-runbook.json` és `CONTENT-UPDATE-RUNBOOK.md`.

Production deploy előtt kötelező:

```bash
./validate.sh .
python3 scripts/asset-guard.py --site . --output .vercel/output/static
vercel deploy --prebuilt --prod --yes
```

Az `asset-guard.py` azért kötelező, mert 2026-05-16-án a HTML `logos/*.png` képekre hivatkozott, de a Vercel prebuilt outputból hiányzott a `/logos` mappa, ezért eltűntek a logók productionben.


## GitHub + Vercel
1. hozz létre új GitHub repót
2. pushold ezt a mappát
3. Vercelben importáld a repót
4. framework preset: Other
5. output directory nem kell

## Javasolt következő lépések
- végleges OG image készítése: `assets/og-image.png`
- végleges PDF közlemény publikálása
- OG image optimalizálása social previewhoz
- statikus buildelt CSS-re váltás a Tailwind Play CDN helyett

## MCP / Directus CMS pilot

Az első háttérmotor irány elindult: **Directus + per-site MCP pilot**.

Belépési pontok:

- `docs/mcp-cms/spec.md` — célok, scope, tartalommodell, acceptance criteria
- `docs/mcp-cms/blueprint.md` — ajánlott architektúra, jogosultsági modell, fázisok
- `docs/mcp-cms/schema.md` — Directus collection draft
- `docker/directus/docker-compose.yml` — lokális Directus + Postgres dev stack
- `docker/directus/.env.example` — példa környezeti változók, éles secret nélkül
- `scripts/mtef-directus-export.mjs` — Directus → jelenlegi `content/news.json` alak export skeleton
- `scripts/mtef-ai-content.mjs` — lokális JSON-backed AI/MCP tartalomkezelési MVP a jogosultságos draft → review → publish flow tesztelésére
- `scripts/build-preview-output.sh` — seed/test-cms export → statikus hírgenerálás → `public/` + `.vercel/output/static` → validáció + asset guard
- `mcp/mtef-cms-server.mjs` — stdio MCP MVP a MTEF test CMS toolokhoz
- `docs/mcp-cms/mcp-stdio-mvp.md` — MCP tool/resource contract, kliens config és verification
- `docs/mcp-cms/remote-production-plan.md` — remote MCP és éles módosítás biztonságos terve
- `docs/mcp-cms/editorial-roles.md` — szerkesztői jogosultságok és content-only határok
- `docs/mcp-cms/supabase-architecture.md` — Supabase DB/storage architektúra
- `docs/mcp-cms/supabase-runbook.md` — Supabase migration/import/export/build lépések
- `docs/mcp-cms/vps-deploy.md` — VPS-en futó MCP service deploy terve
- `docs/mcp-cms/client-config.md` — remote MCP kliens bekötés és smoke példa
- `docs/mcp-cms/admin-ui.md` — tokenvédett MTEF CMS tesztfelület
- `api/mcp.js` — Vercel Streamable HTTP MCP endpoint teszt/proposal irányhoz
- `server/http-mcp-server.mjs` — VPS Streamable HTTP MCP szerver
- `deploy/vps/` — systemd/nginx/env példák a VPS telepítéshez
- `scripts/mtef-vps-package.sh` — VPS deploy tarball készítése
- `scripts/mtef-vps-local-smoke.sh` — VPS-style lokális MCP smoke teszt

Lokális pilot indítása később:

```bash
cd docker/directus
cp .env.example .env
# .env secret értékek átírása után:
docker compose up -d
```

MVP stratégia: a frontend egyelőre marad statikus/Vercel, Directus először szerkesztőségi forrás lesz. A publish után export/deploy folyamat generálja a mostani statikus fájlokat. AI/MCP hozzáférés csak dedikált, limitált `mtef_ai_writer` role-lal történhet; delete/schema/admin/publish jog nélkül.

### AI/MCP test flow Vercel test környezetre

Docker Compose ezen a gépen jelenleg nem elérhető, ezért a Directus-réteg helyét ideiglenesen a `content/directus/test-cms-state.json` lokális test CMS állapot veszi át. Ugyanazt a jogosultsági logikát modellezi: AI writer csak draftot hoz létre és review-t kér, publish csak publisher role-lal lehetséges.

Példa:

```bash
node scripts/mtef-ai-content.mjs init-state
node scripts/mtef-ai-content.mjs create-news-draft --role mtef_ai_writer --title "..." --excerpt "..." --body "..." --category "CMS pilot"
node scripts/mtef-ai-content.mjs request-review --role mtef_ai_writer --slug <slug>
node scripts/mtef-ai-content.mjs publish-news --role mtef_publisher --slug <slug> --date YYYY-MM-DD
MTEF_EXPORT_SOURCE=test-cms ./scripts/build-preview-output.sh
```

A jelenlegi publikus test deploy: `https://mtef-cms-vercel-test.vercel.app`.

Fontos: az új CMS/AI közleményekhez a generator létrehoz önálló `/kozlemenyek/<slug>/` oldalt. A meglévő, kézzel kidolgozott MTEF közleményoldalakat nem írja felül.

### MCP stdio MVP

Telepítés után:

```bash
npm run mtef:mcp:smoke
npm run mtef:mcp
```

A stdio MCP szerver tooljai: `list_news`, `create_news_draft`, `update_news_draft`, `upload_media`, `attach_document_to_news`, `attach_media_to_news`, `add_video_embed_to_news`, `request_review`, `publish_news`, `create_production_change_proposal`, `preview_news_export`. Részletek: `docs/mcp-cms/mcp-stdio-mvp.md`.

### VPS MCP Server deploy

A VPS-en futó Streamable HTTP MCP szerver telepítési csomagja:

- `deploy/vps/README.md` — lépésenkénti telepítési útmutató
- `deploy/vps/env.example` — környezeti változók sablonjai
- `deploy/vps/mtef-cms-mcp.service.example` — systemd unit
- `deploy/vps/nginx-mtef-cms-mcp.conf.example` — nginx reverse proxy

```bash
# VPS csomag létrehozása
bash scripts/mtef-vps-package.sh

# Lokális HTTP smoke teszt
bash scripts/mtef-vps-local-smoke.sh
```
