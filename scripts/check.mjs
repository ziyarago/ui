#!/usr/bin/env node
// Sanity check before publishing: every export target exists, adapters expose every component, types list them all.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const errors = [];
const walk = (v, key) => typeof v === 'string' ? (v.includes('*') ? null : (!existsSync(join(root, v)) && errors.push(`exports["${key}"] → missing ${v}`))) : Object.values(v).forEach(x => walk(x, key));
for (const [k, v] of Object.entries(pkg.exports)) walk(v, k);

const names = [...new Set(['core/components.js', 'core/components2.js', 'core/components3.js', 'core/components4.js', 'core/components6.js', 'core/components7.js', 'core/pages.js'].flatMap(f => [...readFileSync(join(root, 'src', f), 'utf8').matchAll(/^  (\w+): \{|page\('(\w+)'/gm)].map(m => m[1] || m[2])).concat(['PageAuth', 'PageStatus', 'HStack', 'VStack']))];
for (const f of ['vue', 'react']) {
  const src = readFileSync(join(root, `src/${f}/index.js`), 'utf8'), dts = readFileSync(join(root, `types/${f}.d.ts`), 'utf8');
  for (const n of names) { if (!new RegExp(`\\b${n}: Ui${n}\\b`).test(src) && !(n === 'HStack' || n === 'VStack') ) errors.push(`${f}: Ui${n} not exported`); if (!new RegExp(`const Ui${n}\\b`).test(dts)) errors.push(`types/${f}.d.ts: Ui${n} missing`); }
}
if (!existsSync(join(root, 'dist/style.css'))) errors.push('dist/style.css missing — run npm run build');
console.log(names.length + ' components checked');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); } else console.log('OK');
