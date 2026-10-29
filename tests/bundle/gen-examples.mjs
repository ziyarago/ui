// Writes the docs examples (the same data the unit/SSR/browser tests render) as JSON for the consumer apps.
// usage: node tests/bundle/gen-examples.mjs <out.json> [--pro]
import { writeFileSync } from 'node:fs';
import { loadExamples } from '../lib/examples.mjs';
import { PRO_NAMES } from '../../src/meta/tiers.js';

const out = process.argv[2];
const pro = process.argv.includes('--pro');
const examples = (await loadExamples({ pro })).map(({ file, ...e }) => e);
// stress: image URLs with a space, parentheses and a quote must survive url() in inline styles (the file is created by run-app.mjs)
// the Pro Map loads CARTO tiles by default (needs img-src for that host); the audit serves them from its own origin through the tiles prop
if (pro) for (const e of examples) if (e.name === 'Map') for (const v of e.variants) for (const it of v.items?.length ? v.items : [v]) it.props = { ...(it.props || {}), tiles: '/tiles/{style}/{z}/{x}/{y}.png' };
const STRESS = "/img/a b(1)'s.png";
for (const [name, props] of [['EmptyState', { title: 'Stress url', image: STRESS }], ['LazyImage', { src: STRESS, alt: 'stress', aspectRatio: '4/3' }]]) {
  const e = examples.find(x => x.name === name);
  if (e) e.variants.push({ label: 'stress url()', props });
}
writeFileSync(out, JSON.stringify({ edition: pro ? 'pro' : 'free', proNames: [...PRO_NAMES], examples }));
console.log(`examples: ${examples.length} components, ${examples.reduce((a, e) => a + e.variants.length, 0)} variants (${pro ? 'free + pro' : 'free'}) -> ${out}`);
