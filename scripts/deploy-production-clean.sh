#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! git -C "$ROOT" diff --quiet || ! git -C "$ROOT" diff --cached --quiet; then
  echo "Refusing production deploy: commit tracked changes first." >&2
  exit 1
fi

if [ ! -f "$ROOT/.vercel/project.json" ]; then
  echo "Missing $ROOT/.vercel/project.json; link the Vercel project first." >&2
  exit 1
fi

RELEASE_DIR="$(mktemp -d /tmp/mtef-production-release.XXXXXX)"
trap 'rm -rf "$RELEASE_DIR"' EXIT

git -C "$ROOT" archive HEAD | tar -x -C "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR/.vercel"
cp "$ROOT/.vercel/project.json" "$RELEASE_DIR/.vercel/project.json"

cd "$RELEASE_DIR"
./scripts/build-preview-output.sh

# Deploy the exact committed snapshot through Vercel's normal static builder.
# Do not replace .vercel/output/static after `vercel build` and then use
# `--prebuilt`: that produced a Ready deployment with missing static files.
vercel deploy --prod --yes
