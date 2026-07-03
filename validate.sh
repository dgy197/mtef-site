#!/bin/bash
# MTEF site local validation script
PASS=0; FAIL=0; SITE="${1:-.}"

ok()  { echo "  PASS  $1"; ((PASS++)); }
fail(){ echo "  FAIL  $1"; ((FAIL++)); }
chk() { local label="$1"; shift; if "$@" 2>/dev/null; then ok "$label"; else fail "$label"; fi; }

echo "=== MTEF site validation (dir: $SITE) ==="
echo ""
echo "--- Required files ---"
chk "index.html exists"             test -f "$SITE/index.html"
chk "hirek/index.html exists"       test -f "$SITE/hirek/index.html"
chk "kozlemenyek page exists"       test -f "$SITE/kozlemenyek/megalakult-a-magyar-tuzvedelmi-egyezteto-forum/index.html"
chk "adatvedelem.html exists"       test -f "$SITE/adatvedelem.html"
chk "impresszum.html exists"        test -f "$SITE/impresszum.html"
chk "sitemap.xml exists"            test -f "$SITE/sitemap.xml"
chk "robots.txt exists"             test -f "$SITE/robots.txt"

echo ""
echo "--- Homepage SEO ---"
chk "Title: Magyar Tűzvédelmi Egyeztető Fórum" \
    grep -q "Magyar Tűzvédelmi Egyeztető Fórum" "$SITE/index.html"
chk "Title contains MTEF" \
    grep -q "MTEF" "$SITE/index.html"
chk "Description: tűzvédelmi szakmai" \
    grep -q "tűzvédelmi szakmai" "$SITE/index.html"
chk "Description: modernizáció" \
    grep -q "modernizáció" "$SITE/index.html"
chk "Has 'Mi az MTEF?' heading" \
    grep -q "Mi az MTEF" "$SITE/index.html"
chk "Has canonical to https://mtef.hu/" \
    grep -q 'canonical.*https://mtef.hu/' "$SITE/index.html"
chk "No noindex on homepage" \
    bash -c '! grep -q "noindex" "$SITE/index.html"'

echo ""
echo "--- Homepage internal links ---"
chk "Links to /hirek" \
    grep -q '"/hirek"' "$SITE/index.html"
chk "Links to /kozlemenyek/megalakult" \
    grep -q 'kozlemenyek/megalakult' "$SITE/index.html"
chk "Footer adatvedelem link is clean (no .html)" \
    bash -c '! grep -q "adatvedelem\.html" "$SITE/index.html"'
chk "Footer impresszum link is clean (no .html)" \
    bash -c '! grep -q "impresszum\.html" "$SITE/index.html"'

echo ""
echo "--- Homepage schema ---"
chk "Organization schema present" \
    grep -q '"Organization"' "$SITE/index.html"
chk "WebSite schema present" \
    grep -q '"WebSite"' "$SITE/index.html"
chk "NewsArticle schema present" \
    grep -q '"NewsArticle"' "$SITE/index.html"
chk "foundingDate present" \
    grep -q 'foundingDate' "$SITE/index.html"
chk "contactPoint present" \
    grep -q 'contactPoint' "$SITE/index.html"

echo ""
echo "--- /hirek page ---"
chk "No noindex on hirek" \
    bash -c '! grep -q "noindex" "$SITE/hirek/index.html"'
chk "hirek canonical correct" \
    grep -q 'https://mtef.hu/hirek' "$SITE/hirek/index.html"
chk "hirek links to kozlemenyek page" \
    grep -q 'kozlemenyek/megalakult' "$SITE/hirek/index.html"
chk "hirek links to homepage" \
    grep -q 'href="/"' "$SITE/hirek/index.html"

echo ""
echo "--- /kozlemenyek page ---"
KOZ="$SITE/kozlemenyek/megalakult-a-magyar-tuzvedelmi-egyezteto-forum/index.html"
chk "No noindex on kozlemenyek" \
    bash -c '! grep -q "noindex" "$KOZ"'
chk "kozlemenyek canonical correct" \
    grep -q 'megalakult-a-magyar-tuzvedelmi-egyezteto-forum' "$KOZ"
chk "kozlemenyek has NewsArticle schema" \
    grep -q '"NewsArticle"' "$KOZ"
chk "kozlemenyek contains full title phrase" \
    grep -q 'Megalakult a Magyar Tűzvédelmi Egyeztető Fórum' "$KOZ"
chk "kozlemenyek has verbatim statement text" \
    grep -q 'Kelt Szent Flórián napjának előestéjén' "$KOZ"
chk "kozlemenyek links to homepage" \
    grep -q 'href="/"' "$KOZ"
chk "kozlemenyek links to contact email" \
    grep -q 'info@mtef.hu' "$KOZ"
chk "kozlemenyek links to /hirek" \
    grep -q '/hirek' "$KOZ"

echo ""
echo "--- Sitemap ---"
chk "Sitemap: https://mtef.hu/" \
    grep -q 'https://mtef.hu/' "$SITE/sitemap.xml"
chk "Sitemap: /hirek" \
    grep -q 'https://mtef.hu/hirek' "$SITE/sitemap.xml"
chk "Sitemap: kozlemenyek page" \
    grep -q 'megalakult-a-magyar-tuzvedelmi-egyezteto-forum' "$SITE/sitemap.xml"
chk "Sitemap: /adatvedelem" \
    grep -q 'https://mtef.hu/adatvedelem' "$SITE/sitemap.xml"
chk "Sitemap: /impresszum" \
    grep -q 'https://mtef.hu/impresszum' "$SITE/sitemap.xml"
chk "Sitemap has lastmod" \
    grep -q 'lastmod' "$SITE/sitemap.xml"

echo ""
echo "--- robots.txt ---"
chk "robots.txt allows crawling" \
    grep -q 'Allow: /' "$SITE/robots.txt"
chk "robots.txt references sitemap" \
    grep -q 'Sitemap:' "$SITE/robots.txt"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ $FAIL -eq 0 ] && exit 0 || exit 1
