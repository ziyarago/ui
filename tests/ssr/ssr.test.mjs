import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadExamples } from '../lib/examples.mjs';
import { ssrVue, ssrReact } from '../lib/ssr.mjs';
import { ALLOW, EMPTY_OK } from './allowlist.mjs';

const examples = await loadExamples();
const LEAK = /\bundefined\b|\[object Object\]|\bNaN\b|\bnull\b(?![-\w])/g;

const inner = html => {
  const m = /^<div class="doc-preview"[^>]*>([\s\S]*)<\/div>$/.exec(html.trim());
  return m ? m[1].replace(/<!--[\s\S]*?-->/g, '').trim() : html.trim();
};
const leaks = (name, html) => {
  const out = [];
  const clean = html.replace(/<style[\s\S]*?<\/style>/g, '');
  for (const m of clean.matchAll(LEAK)) {
    const snippet = clean.slice(Math.max(0, m.index - 40), m.index + m[0].length + 20);
    if (ALLOW.some(a => (a.component === '*' || a.component === name) && a.re.test(snippet))) continue;
    out.push(`${m[0]} in ...${snippet.replace(/\s+/g, ' ')}...`);
  }
  return out;
};

describe('SSR: every component, every docs variant, Vue and React', () => {
  for (const ex of examples) {
    test(ex.name, async () => {
      const problems = [];
      for (const [vi, v] of ex.variants.entries()) {
        const modes = v.overlay ? [false, true] : [false];
        for (const open of modes) {
          for (const fw of ['vue', 'react']) {
            const tag = `${fw} variant #${vi} "${v.label}"${open ? ' (open)' : ''}`;
            let r;
            try { r = fw === 'vue' ? await ssrVue(ex.name, v, open) : ssrReact(ex.name, v, open); }
            catch (e) { problems.push(`${tag}: THROW ${e && e.message}`); continue; }
            for (const w of r.warnings) problems.push(`${tag}: warning ${String(w).split('\n')[0]}`);
            if (!v.overlay && !EMPTY_OK[ex.name] && !inner(r.html)) problems.push(`${tag}: empty output`);
            if (v.overlay && !open && !inner(r.html)) problems.push(`${tag}: overlay trigger missing`);
            for (const l of leaks(ex.name, r.html)) problems.push(`${tag}: leak ${l}`);
          }
        }
      }
      assert.equal(problems.length, 0, '\n' + problems.join('\n'));
    });
  }
  test('coverage: all components of the library have examples', async () => {
    const { components } = await import('../../src/core/index.js');
    const have = new Set(examples.map(e => e.name));
    assert.deepEqual(Object.keys(components).filter(n => !have.has(n)), []);
    assert.deepEqual([...have].filter(n => !components[n]), []);
  });
});
