// Loads site/docs-data/examples/*.ts without ts-node: esbuild strips the types, the result is imported from a data: URL.
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPro } from '../../src/meta/tiers.js';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const { transformSync } = createRequire(import.meta.url)('esbuild');
const DIR = join(ROOT, 'site/docs-data/examples');

// Only free components by default: Pro examples stay in the docs data but are rendered by the @ziyarago/ui-pro tests. { pro: true } returns everything.
export async function loadExamples({ pro = false } = {}) {
  const out = [];
  for (const f of readdirSync(DIR).filter(n => n.endsWith('.ts')).sort()) {
    const js = transformSync(readFileSync(join(DIR, f), 'utf8'), { loader: 'ts', format: 'esm', target: 'es2022' }).code;
    const mod = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
    for (const e of mod.default) if (pro || !isPro(e.name)) out.push({ ...e, file: f });
  }
  return out;
}

/** Plain-JSON copy for the browser apps. */
export const toJSON = async (opts) => JSON.parse(JSON.stringify(await loadExamples(opts)));
