#!/usr/bin/env python3
"""MTEF build guard: every local href/src in the built HTML must resolve inside the build output.

Covers images, PDFs/DOCX, CSS/JS, logos and internal page links (clean URLs: /x -> x.html or x/index.html).
Background: the 2026-05-16 incident (missing /logos in a deploy).
Usage: python3 scripts/asset-guard.py --output dist
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

REF_RE = re.compile(r'''(?:src|href|srcset)=["']([^"']+)["']''', re.I)
SKIP = ('http://', 'https://', 'mailto:', 'tel:', '#', 'data:', '//', 'javascript:')


def resolves(out: Path, path: str) -> bool:
    rel = path.lstrip('/')
    if rel.startswith('_vercel/'):
        return True  # Vercel platform route (analytics), served at runtime
    if rel == '':
        return (out / 'index.html').exists()
    cand = [out / rel, out / f'{rel}.html', out / rel / 'index.html']
    return any(c.is_file() for c in cand)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--output', default='dist')
    out = Path(ap.parse_args().output).resolve()
    pages = sorted(out.rglob('*.html'))
    missing: dict[str, set[str]] = {}
    checked = 0
    for page in pages:
        for raw in REF_RE.findall(page.read_text(encoding='utf-8', errors='ignore')):
            for ref in [r.strip().split(' ')[0] for r in raw.split(',')] if ',' in raw and ' ' in raw else [raw]:
                if not ref or ref.startswith(SKIP):
                    continue
                path = unquote(urlparse(ref).path)
                if not path.startswith('/'):
                    path = '/' + str((page.parent.relative_to(out) / path).as_posix()).lstrip('./')
                checked += 1
                if not resolves(out, path):
                    missing.setdefault(path, set()).add(str(page.relative_to(out)))
    print(f'=== MTEF asset guard: {len(pages)} pages, {checked} local refs ===')
    for path, where in sorted(missing.items()):
        print(f'  MISSING {path}  (in {", ".join(sorted(where))})')
    if missing:
        print('FAIL: missing local targets would break the deploy.', file=sys.stderr)
        return 1
    print('PASS: every local reference resolves inside the build output.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
