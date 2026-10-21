import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export function loadManifest() {
  const tried = [];
  const candidates = [
    process.env.ZIYARAGO_UI_MANIFEST,
    join(process.cwd(), 'node_modules/@ziyarago/ui/dist/manifest.json'),
    resolve(here, '../../../dist/manifest.json'),
  ].filter(Boolean);
  try { candidates.push(createRequire(import.meta.url).resolve('@ziyarago/ui/manifest.json')); } catch {}
  for (const p of candidates) { tried.push(p); if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf8')); }
  throw new Error('Cannot find @ziyarago/ui manifest.json. Install @ziyarago/ui in the project or set ZIYARAGO_UI_MANIFEST. Tried:\n' + tried.join('\n'));
}
