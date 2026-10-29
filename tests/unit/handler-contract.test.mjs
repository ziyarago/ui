// A callback documented without a payload ("Called when ...") must be called with no arguments. Binding it straight to a DOM event
// (`onClick: p.onClose`) hands the app a MouseEvent; `close(reason = 'x')` would then receive the event. Static check over the core definitions.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { meta } from '../../src/meta/index.js';

const DIR = new URL('../../src/core/', import.meta.url);
const DOM_KEY = '(?:onClick|onDblclick|onKeydown|onKeyup|onPointer\\w+|onMouse\\w+|onFocus|onBlur|onSubmit|onInput|onChange)';
const hasPayload = d => /native|\bwith\b|receives|payload|\bevent\b|\bas \(|\bnew\b/i.test(d || '');
const evName = e => e[2].toLowerCase() + e.slice(3);
const doc = (c, e) => { const m = meta[c]; if (!m) return null; const d = (m.events && m.events[evName(e)]) ?? (m.props && m.props[e] && m.props[e].description); return d == null ? null : String(d); };

export const violations = (files, read) => {
  const bad = [];
  for (const f of files) {
    const s = read(f);
    const comps = [...s.matchAll(/\n\s*(?:T\.)?(\w+)\s*(?:=|:) *\{/g)].map(m => [m.index, m[1]]);
    const re = new RegExp('\\b' + DOM_KEY + ': *(?:p|props)\\.(on[A-Z]\\w*)(?: *\\|\\| *(?:p|props)\\.(on[A-Z]\\w*))? *(?=[,})])', 'g');
    for (const m of s.matchAll(re)) {
      const c = comps.filter(([i]) => i < m.index).at(-1)?.[1];
      for (const e of [m[1], m[2]].filter(Boolean)) {
        const d = doc(c, e);
        if (d !== null && !hasPayload(d)) bad.push(`${f} ${c}.${evName(e)} is documented without a payload but bound directly to a DOM event: wrap it as () => p.${e} && p.${e}()`);
      }
    }
    for (const m of s.matchAll(/\b(?:o|opts|r\.opts)\.onClose\(\s*\w/g)) bad.push(`${f} onClose called with an argument`);
  }
  return bad;
};

test('no-arg callbacks are not bound directly to DOM events', () => {
  const files = readdirSync(DIR).filter(n => n.endsWith('.js'));
  assert.deepEqual(violations(files, f => readFileSync(new URL(f, DIR), 'utf8')), []);
});

test('the detector flags a direct binding', () => {
  const src = "\n  Alert: { render: ({ h, props: p }) => h('button', { onClick: p.onClose }) },\n";
  assert.equal(violations(['x.js'], () => src).length, 1);
  assert.equal(violations(['x.js'], () => src.replace('p.onClose', '() => p.onClose && p.onClose()')).length, 0);
});
