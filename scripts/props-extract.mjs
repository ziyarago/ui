#!/usr/bin/env node
// usage: node scripts/props-extract.mjs [Name ...]   → JSON of what each component's render code actually reads: props, slots, children, state.
// Ground truth for src/meta/*.js. Heuristic (regex over the render source), so review the output.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src/core');
const files = readdirSync(dir).filter(f => /^(components\d*|pages)\.js$/.test(f));
const src = Object.fromEntries(files.map(f => [f, readFileSync(join(dir, f), 'utf8')]));

export function extract() {
  const out = {};
  for (const [file, text] of Object.entries(src)) {
    const re = /^  ([A-Z][A-Za-z0-9]*): \{/gm;
    const hits = [...text.matchAll(re)];
    hits.forEach((m, i) => {
      const body = text.slice(m.index, i + 1 < hits.length ? hits[i + 1].index : text.length);
      const props = [...new Set([...body.matchAll(/\bp\.([A-Za-z_]\w*)/g)].map(x => x[1]))];
      const slots = [...new Set([...body.matchAll(/\bslots\.([A-Za-z_]\w*)/g)].map(x => x[1]))];
      const forwards = [...new Set([...body.matchAll(/h\(C\.([A-Z]\w*)/g)].map(x => x[1]))];
      out[m[1]] = { file, props: props.sort(), slots: slots.sort(), children: /\bchildren\b/.test(body), state: /state:\s*\{/.test(body.slice(0, 200)), uses: forwards };
    });
  }
  for (const m of src['pages.js'].matchAll(/page\('([A-Za-z]+)',\s*\[([^\]]*)\]/g)) {
    out[m[1]] = { ...(out[m[1]] || {}), file: 'pages.js', slots: [...m[2].matchAll(/'(\w+)'/g)].map(x => x[1]) };
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const all = extract();
  const names = process.argv.slice(2);
  console.log(JSON.stringify(names.length ? Object.fromEntries(names.map(n => [n, all[n]])) : all, null, 1));
}
