#!/usr/bin/env node
// Content guard for src/content/kozlemenyek (run in CI and before commits).
//
// 1. Folder rules: one folder per item, named by a valid slug, holding index.md
//    plus only images/attachments with lower-case kebab-case names.
// 2. Body rules: Markdown only. No raw HTML (except <sup>), no MDX/ESM
//    import/export lines, no .mdx files (the .md pipeline never evaluates {braces}).
// 3. Route guard: on a content/* branch every changed file must sit under
//    src/content/kozlemenyek/<slug>/. Branch and base come from the CI env
//    (GITHUB_HEAD_REF / GITHUB_BASE_REF) or from --branch / --base.
//
// The frontmatter itself is validated by the zod schema during `astro build`.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SLUG_RE } from '../src/content/kozlemenyek.schema.ts';

const ROOT = 'src/content/kozlemenyek';
const ASSET_RE = /^[a-z0-9]+(-[a-z0-9]+)*\.(jpe?g|png|webp|pdf|docx)$/;
const ALLOWED_TAG_RE = /^<\/?sup>$/;
const AUTOLINK_RE = /^<(https?:\/\/[^\s>]+|[^\s@<>]+@[^\s@<>]+\.[a-z]{2,})>$/i;

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

/** Body without frontmatter, fenced code and inline code (those may show `<` freely). */
function prose(md) {
  const body = md.replace(/^---\n[\s\S]*?\n---\n?/, '');
  return body.replace(/^(```|~~~)[\s\S]*?^\1/gm, '').replace(/`[^`\n]*`/g, '');
}

function checkBody(file, md) {
  const text = prose(md);
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (/^\s*(import|export)\s/.test(line)) fail(file, `line ${i + 1}: import/export is not allowed`);
  });
  for (const m of text.matchAll(/<[^>\n]*>?/g)) {
    const tag = m[0];
    if (ALLOWED_TAG_RE.test(tag) || AUTOLINK_RE.test(tag)) continue;
    if (!/^<[!/?a-zA-Z]/.test(tag)) continue; // a lone "<" in prose, e.g. "< 5 m"
    const line = text.slice(0, m.index).split('\n').length;
    fail(file, `body line ${line}: raw HTML ${JSON.stringify(tag.slice(0, 60))} (only <sup> is allowed)`);
  }
}

function checkFolders() {
  for (const name of readdirSync(ROOT)) {
    const dir = join(ROOT, name);
    if (!statSync(dir).isDirectory()) {
      fail(dir, 'only item folders may sit here');
      continue;
    }
    if (name.startsWith('_')) continue; // templates / drafts skipped by the loader
    if (!SLUG_RE.test(name) || name.length < 3 || name.length > 80) fail(dir, 'folder name is not a valid slug');
    const files = readdirSync(dir);
    if (!files.includes('index.md')) fail(dir, 'index.md is missing');
    for (const f of files) {
      const p = join(dir, f);
      if (f === 'index.md') {
        checkBody(p, readFileSync(p, 'utf8'));
      } else if (f.endsWith('.mdx')) {
        fail(p, 'MDX is not allowed');
      } else if (statSync(p).isDirectory() || !ASSET_RE.test(f)) {
        fail(p, 'only lower-case kebab-case images (jpg/png/webp) and attachments (pdf/docx) are allowed');
      }
    }
  }
}

function checkRoute() {
  const branch = opt('--branch') ?? process.env.GITHUB_HEAD_REF ?? '';
  if (!branch.startsWith('content/')) return;
  const base = opt('--base') ?? (process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'origin/main');
  const out = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { encoding: 'utf8' });
  const changed = out.split('\n').filter(Boolean);
  const inside = new RegExp(`^${ROOT}/[a-z0-9]+(-[a-z0-9]+)*/[^/]+$`);
  for (const f of changed) {
    if (!inside.test(f)) fail(f, `a content/* branch may only change files under ${ROOT}/<slug>/`);
  }
  console.log(`route guard: ${branch} vs ${base}, ${changed.length} changed file(s)`);
}

checkFolders();
checkRoute();
if (errors.length) {
  console.error(`=== MTEF content guard: ${errors.length} problem(s) ===`);
  for (const e of errors) console.error(`FAIL ${e}`);
  process.exit(1);
}
console.log('=== MTEF content guard: PASS ===');
