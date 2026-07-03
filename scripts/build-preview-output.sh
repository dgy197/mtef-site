#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

EXPORT_SOURCE="${MTEF_EXPORT_SOURCE:-seed}"

# 1) Export content/news.json from selected CMS-like source.
#    - seed: current production content mapping
#    - test-cms: local JSON-backed AI/MCP test state
#    - supabase: Supabase CMS source-of-truth
if [ "$EXPORT_SOURCE" = "test-cms" ]; then
  node scripts/mtef-ai-content.mjs export-published --output content/news.json
elif [ "$EXPORT_SOURCE" = "supabase" ]; then
  node scripts/mtef-supabase-export.mjs --write
else
  node scripts/mtef-directus-export.mjs --from-seed --write
fi

# 2) Regenerate static news surfaces from content/news.json.
node scripts/generate-news.mjs

# 3) Rebuild Vercel prebuilt output deterministically from the current static site.
rm -rf .vercel/output/static
mkdir -p .vercel/output/static

copy_path() {
  local path="$1"
  if [ -e "$path" ]; then
    mkdir -p ".vercel/output/static/$(dirname "$path")"
    cp -R "$path" ".vercel/output/static/$path"
  fi
}

STATIC_PATHS=(
  index.html
  hirek
  kozlemenyek
  adatvedelem.html
  impresszum.html
  sitemap.xml
  robots.txt
  site.webmanifest
  favicon.ico
  favicon-16x16.png
  favicon-32x32.png
  favicon-48x48.png
  apple-touch-icon.png
  android-chrome-192x192.png
  android-chrome-512x512.png
  mtef-logo-google.png
  assets
  logos
)

for path in "${STATIC_PATHS[@]}"; do
  copy_path "$path"
done

# Keep public in sync too, because several runbooks and local checks use it.
rm -rf public
mkdir -p public
for path in "${STATIC_PATHS[@]}"; do
  if [ -e "$path" ]; then cp -R "$path" "public/$path"; fi
done

./validate.sh .
python3 scripts/asset-guard.py --site . --output .vercel/output/static

echo "MTEF preview output ready: .vercel/output/static (source: $EXPORT_SOURCE)"
