// Loads site/docs-data/examples/*.ts without ts-node: esbuild strips the types, the result is imported from a data: URL.
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const { transformSync } = createRequire(import.meta.url)('esbuild');
const DIR = join(ROOT, 'site/docs-data/examples');

export async function loadExamples() {
  const out = [];
  for (const f of readdirSync(DIR).filter(n => n.endsWith('.ts')).sort()) {
    const js = transformSync(readFileSync(join(DIR, f), 'utf8'), { loader: 'ts', format: 'esm', target: 'es2022' }).code;
    const mod = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
    for (const e of mod.default) out.push({ ...e, file: f });
  }
  return out;
}

/** Plain-JSON copy for the browser apps. */
export const toJSON = async () => JSON.parse(JSON.stringify(await loadExamples()));
