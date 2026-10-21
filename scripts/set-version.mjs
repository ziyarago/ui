#!/usr/bin/env node
// usage: node scripts/set-version.mjs 1.2.3 — sets the version in the library and the MCP package, and pins the MCP peer range.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const v = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(v || '')) { console.error('usage: set-version.mjs <semver>'); process.exit(1); }
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const f of ['package.json', 'packages/mcp/package.json']) {
  const p = join(root, f), d = JSON.parse(readFileSync(p, 'utf8'));
  d.version = v;
  if (d.peerDependencies?.['@ziyarago/ui']) d.peerDependencies['@ziyarago/ui'] = '>=' + v.replace(/-.*/, '');
  writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
}
console.log('version set to ' + v);
