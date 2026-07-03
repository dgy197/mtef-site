#!/usr/bin/env python3
"""MTEF static asset guard.

Fails the build/deploy if any local asset referenced by HTML is missing from
source or from the Vercel prebuilt output directory.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

ASSET_EXTS = ('.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.pdf', '.docx', '.css', '.js', '.webmanifest')
REF_RE = re.compile(r'''(?:src|href)=["']([^"'#]+)(?:#[^"']*)?["']''', re.I)


def norm_ref(ref: str) -> str | None:
    ref = ref.strip()
    if not ref or ref.startswith(('http://', 'https://', 'mailto:', 'tel:', '#')):
        return None
    ref = ref.split('?', 1)[0]
    if not ref:
        return None
    parsed = urlparse(ref)
    path = parsed.path or ref
    if path.startswith('//'):
        return None
    path = path.lstrip('/')
    if not path:
        return None
    if path.endswith(ASSET_EXTS) or path.startswith(('logos/', 'assets/')):
        return path
    return None


def html_files(site: Path) -> list[Path]:
    return sorted(p for p in site.rglob('*.html') if '.vercel' not in p.parts and 'node_modules' not in p.parts)


def collect_refs(site: Path) -> dict[str, set[str]]:
    refs: dict[str, set[str]] = {}
    for html in html_files(site):
        text = html.read_text(encoding='utf-8', errors='ignore')
        found = set()
        for raw in REF_RE.findall(text):
            ref = norm_ref(raw)
            if ref:
                found.add(ref)
        if found:
            refs[str(html.relative_to(site))] = found
    return refs


def load_manifest(site: Path) -> set[str]:
    manifest = site / 'site-database.json'
    if not manifest.exists():
        return set()
    data = json.loads(manifest.read_text(encoding='utf-8'))
    critical: set[str] = set()
    for items in data.get('criticalAssets', {}).values():
        for item in items:
            if '*' not in item:
                critical.add(item.lstrip('/'))
    return critical


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--site', default='.', help='Site source root')
    ap.add_argument('--output', default='.vercel/output/static', help='Vercel prebuilt static output root')
    ap.add_argument('--json', action='store_true')
    args = ap.parse_args()

    site = Path(args.site).resolve()
    output = (site / args.output).resolve() if not Path(args.output).is_absolute() else Path(args.output)

    refs_by_file = collect_refs(site)
    refs = set().union(*refs_by_file.values()) if refs_by_file else set()
    refs |= load_manifest(site)

    missing_source = sorted(ref for ref in refs if not (site / ref).exists())
    missing_output = sorted(ref for ref in refs if not (output / ref).exists())

    result = {
        'site': str(site),
        'output': str(output),
        'htmlFilesScanned': len(html_files(site)),
        'assetRefsChecked': len(refs),
        'missingSource': missing_source,
        'missingOutput': missing_output,
        'ok': not missing_source and not missing_output,
    }

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print('=== MTEF asset guard ===')
        print(f'Site: {site}')
        print(f'Output: {output}')
        print(f'HTML files scanned: {result["htmlFilesScanned"]}')
        print(f'Asset refs checked: {result["assetRefsChecked"]}')
        if missing_source:
            print('\nMissing in source:')
            for ref in missing_source:
                print(f'  - {ref}')
        if missing_output:
            print('\nMissing in Vercel output:')
            for ref in missing_output:
                print(f'  - {ref}')
        if result['ok']:
            print('\nPASS: all referenced/critical assets exist in source and Vercel output.')
        else:
            print('\nFAIL: missing assets would break production deploy.', file=sys.stderr)

    return 0 if result['ok'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
