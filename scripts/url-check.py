#!/usr/bin/env python3
"""Every URL the pre-Astro site served must still be served by the new build.

scripts/legacy-urls.txt is the frozen URL inventory of the static site (origin/main 38b7ad1,
measured 2026-11-14). A URL may only leave the site through an explicit redirect in vercel.json.
Usage: python3 scripts/url-check.py dist scripts/legacy-urls.txt
"""
import json
import sys
from pathlib import Path

out, listing = Path(sys.argv[1]), Path(sys.argv[2])
redirects = {r['source'] for r in json.loads(Path('vercel.json').read_text()).get('redirects', [])}


def served(url: str) -> bool:
    rel = url.lstrip('/')
    if rel == '':
        return (out / 'index.html').is_file()
    return any(p.is_file() for p in (out / rel, out / f'{rel}.html', out / rel / 'index.html'))


urls = [u.strip() for u in listing.read_text().splitlines() if u.strip() and not u.startswith('#')]
lost = [u for u in urls if not served(u) and u not in redirects]
print(f'=== legacy URL check: {len(urls)} URLs, {len(lost)} lost ===')
for u in lost:
    print('  LOST', u)
sys.exit(1 if lost else 0)
