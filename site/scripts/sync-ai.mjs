#!/usr/bin/env node
// Copies the generated AI files from the library build into public/ so the docs site serves /llms.txt, /llms-full.txt and /manifest.json.
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
if (!existsSync(join(root, 'dist/manifest.json'))) execFileSync('node', [join(root, 'scripts/manifest.mjs')], { stdio: 'inherit' });
const pub = join(root, 'site/public');
mkdirSync(pub, { recursive: true });
for (const f of ['manifest.json', 'llms.txt', 'llms-full.txt']) copyFileSync(join(root, 'dist', f), join(pub, f));
console.log('synced llms.txt, llms-full.txt, manifest.json to site/public');
