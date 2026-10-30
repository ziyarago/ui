// Every handler a component reads (`p.onX`) must be documented in the meta (event or on* prop), because the types are generated from the meta.
// And the other way round: a documented event nobody calls is a dead handler in the types.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { meta } from '../../src/meta/index.js';

const DIR = new URL('../../src/core/', import.meta.url);
const used = {};
for (const f of readdirSync(DIR).filter(n => n.endsWith('.js'))) {
  const s = readFileSync(new URL(f, DIR), 'utf8');
  const comps = [...s.matchAll(/\nexport const (\w+)Def = /g)].map(m => [m.index, m[1]]);
  for (const m of s.matchAll(/\b(?:p|props)\.(on[A-Z]\w*)\b/g)) {
    const c = comps.filter(([i]) => i < m.index).at(-1)?.[1];
    if (c) (used[c] ||= new Set()).add(m[1]);
  }
}
const evName = e => e[2].toLowerCase() + e.slice(3);

// Handlers read by a component but forwarded to a child component (which documents them) or internal plumbing.
const FORWARDED = {
  AppShell: ['onChange', 'onCollapse'],
};

test('every handler read by the core is documented in the meta', () => {
  const missing = [];
  for (const [c, evs] of Object.entries(used)) {
    const m = meta[c];
    if (!m) continue;
    for (const e of evs) {
      if ((FORWARDED[c] || []).includes(e)) continue;
      if (!(m.events && evName(e) in m.events) && !(m.props && e in m.props)) missing.push(`${c}.${evName(e)}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('every documented event is read by the core (free components)', () => {
  const dead = [];
  for (const c of Object.keys(used)) {
    const m = meta[c];
    if (!m) continue;
    for (const e of Object.keys(m.events || {})) {
      const name = 'on' + e[0].toUpperCase() + e.slice(1);
      if (!used[c].has(name) && !(m.props && name in m.props)) dead.push(`${c}.${e}`);
    }
  }
  // change / click on a model component are emitted by the adapters (v-model plumbing), not read by the definition
  // blur, focus, keydown, keyup, paste of TextField / Textarea are native input listeners forwarded through INPUT_ATTRS
  assert.deepEqual(dead.filter(d => !/\.(change|click)$/.test(d) && !/^Text(field|area)\.(blur|focus|keydown|keyup|paste)$/i.test(d)), []);
});
