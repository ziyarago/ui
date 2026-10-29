// Writes the docs examples (the same data the unit/SSR/browser tests render) as JSON for the consumer apps.
// usage: node tests/bundle/gen-examples.mjs <out.json> [--pro]
import { writeFileSync } from 'node:fs';
import { loadExamples } from '../lib/examples.mjs';
import { PRO_NAMES } from '../../src/meta/tiers.js';

const out = process.argv[2];
const pro = process.argv.includes('--pro');
const examples = (await loadExamples({ pro })).map(({ file, ...e }) => e);
writeFileSync(out, JSON.stringify({ edition: pro ? 'pro' : 'free', proNames: [...PRO_NAMES], examples }));
console.log(`examples: ${examples.length} components, ${examples.reduce((a, e) => a + e.variants.length, 0)} variants (${pro ? 'free + pro' : 'free'}) -> ${out}`);
