// Every value the types promise for an enum prop (meta `values`) must render something the stylesheet knows: a class `zg-...--value` that has no CSS rule is a silent no-op
// (the type says 'neutral' is fine, the user sees an unstyled component). Rendered through the docs variants of each component.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { loadExamples } from '../lib/examples.mjs';
import { ssrVue } from '../lib/ssr.mjs';
import { meta } from '../../src/meta/index.js';

const stylesDir = new URL('../../src/styles/', import.meta.url);
const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(new URL(e.name + '/', d)) : e.name.endsWith('.css') ? [readFileSync(new URL(e.name, d), 'utf8')] : []);
const css = walk(stylesDir).join('\n');
const hasRule = cls => css.includes('.' + cls);

// Modifier classes that exist without a rule on purpose: the value is the unstyled default.
const DEFAULT_VALUE = {
  'Alert.tone=info': 'info is the base look', 'Banner.tone=info': 'info is the base look', 'Toast.tone=info': 'info is the base look',
  'Avatar.tone=brand': 'brand is the base look', 'Avatar.status=offline': 'offline draws no dot colour override',
};
// Sizes are styled through [data-size] (src/styles/sizes/*), the adapters copy `size` to the root; the zg-*--md class is a leftover hook.
const SIZE_VALUES = new Set(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']);

const examples = await loadExamples();
test('enum values of the meta render classes that exist in the stylesheet', async () => {
  const problems = [];
  for (const ex of examples) {
    const m = meta[ex.name];
    if (!m) continue;
    const v0 = ex.variants[0];
    const base = (v0.items?.length ? v0.items[0] : v0).props ?? {};
    for (const [prop, d] of Object.entries(m.props || {})) {
      if (!Array.isArray(d.values) || d.values.some(x => typeof x !== 'string')) continue;
      for (const val of d.values) {
        if (DEFAULT_VALUE[`${ex.name}.${prop}=${val}`] || (prop === 'size' && SIZE_VALUES.has(val))) continue;
        const props = { ...base, [prop]: val };
        const variant = v0.items?.length ? { ...v0, items: [{ ...v0.items[0], props }] } : { ...v0, props };
        let html;
        try { html = (await ssrVue(ex.name, variant, false)).html; } catch (e) { problems.push(`${ex.name}.${prop}=${val}: THROWS ${e.message}`); continue; }
        const re = new RegExp(`\\b(zg-[\\w-]*--${val.replace(/[^\w-]/g, '\\$&')})\\b`, 'g');
        const classes = new Set([...html.matchAll(re)].map(x => x[1]));
        // many props style through CSS variables or [data-*] attributes and render no class at all: only a class that IS rendered must have a rule
        for (const c of classes) if (!hasRule(c)) problems.push(`${ex.name}.${prop}=${val}: class ${c} has no CSS rule`);
      }
    }
  }
  assert.deepEqual(problems, []);
});
