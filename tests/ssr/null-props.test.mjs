// The types accept `null` for every optional prop and `null` as a model value. The adapters treat a null prop as "not set": rendering with `prop: null` must equal rendering without it,
// and a null / undefined model value must render without errors, warnings or a literal "null" in the output (Vue and React).
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadExamples } from '../lib/examples.mjs';
import { ssrVue, ssrReact } from '../lib/ssr.mjs';

const examples = await loadExamples();
const MODEL = new Set(['modelValue', 'value', 'index']);
const norm = h => h.replace(/\bzg[0-9a-z]{1,6}\b/g, 'zgID').replace(/\s+/g, ' ');

describe('null props behave as unset (Vue and React)', () => {
  for (const ex of examples) {
    test(ex.name, async () => {
      const problems = [];
      for (const [vi, v] of ex.variants.slice(0, 4).entries()) {
        const base = v.items?.length ? v.items[0] : v;
        const props = base.props ?? {};
        const mk = p => v.items?.length ? { ...v, items: [{ ...base, props: p }] } : { ...v, props: p };
        for (const fw of ['vue', 'react']) {
          const run = async p => { const r = fw === 'vue' ? await ssrVue(ex.name, mk(p)) : ssrReact(ex.name, mk(p)); return { html: norm(r.html), warnings: r.warnings }; };
          let ref;
          try { ref = await run(props); } catch { continue; }
          for (const k of Object.keys(props)) {
            if (MODEL.has(k) || /^on[A-Z]/.test(k) || typeof props[k] === 'function') continue;
            const { [k]: _drop, ...without } = props;
            try {
              const a = await run(without), b = await run({ ...props, [k]: null });
              if (a.html !== b.html) problems.push(`${fw} variant #${vi}: ${k}: null renders differently from unset`);
              for (const w of b.warnings) if (!a.warnings.includes(w)) problems.push(`${fw} variant #${vi}: ${k}: null warns ${String(w).split('\n')[0]}`);
            } catch (e) { problems.push(`${fw} variant #${vi}: ${k}: null THROWS ${e && e.message}`); }
          }
          if ('modelValue' in props) {
            for (const val of [null, undefined]) {
              try {
                const r = await run({ ...props, modelValue: val });
                if (r.warnings.length) problems.push(`${fw} variant #${vi}: modelValue ${val}: warns ${String(r.warnings[0]).split('\n')[0]}`);
                if (/>\s*null\s*<|\bundefined\b|\[object Object\]|NaN/.test(r.html.replace(/<style[\s\S]*?<\/style>/g, ''))) problems.push(`${fw} variant #${vi}: modelValue ${val}: leaks into the output`);
              } catch (e) { problems.push(`${fw} variant #${vi}: modelValue ${val} THROWS ${e && e.message}`); }
            }
          }
        }
      }
      assert.equal(problems.length, 0, '\n' + problems.join('\n'));
    });
  }
});
