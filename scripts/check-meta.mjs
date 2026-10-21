#!/usr/bin/env node
// Validates src/meta/* against the render code. Errors fail the build, warnings are informational.
import { components } from '../src/core/index.js';
import { meta } from '../src/meta/index.js';
import { extract } from './props-extract.mjs';

const ignore = new Set(['style', 'class', 'key', 'ref', 'id', 'actions', 'footer', 'children']);
const found = extract();
const errors = [], warnings = [];
let documented = 0;

for (const name of Object.keys(components)) {
  const m = meta[name];
  if (!m) { errors.push(`${name}: no metadata`); continue; }
  documented++;
  if (!m.description) errors.push(`${name}: missing description`);
  const props = m.props || {}, events = m.events || {}, slots = m.slots || {};
  const real = found[name] || { props: [], slots: [] };
  for (const p of real.props || []) {
    if (ignore.has(p)) continue;
    const isEvent = /^on[A-Z]/.test(p);
    const ev = isEvent ? p.slice(2, 3).toLowerCase() + p.slice(3) : null;
    if (isEvent ? !(ev in events) && !(p in props) : !(p in props)) errors.push(`${name}: undocumented ${isEvent ? 'event' : 'prop'} "${p}"`);
  }
  for (const [p, d] of Object.entries(props)) {
    if (!d.type) errors.push(`${name}.${p}: missing type`);
    if (!d.description) errors.push(`${name}.${p}: missing description`);
    if (/^'[^']+'(\s*\|\s*'[^']+')+$/.test(d.type || '') && !d.values) errors.push(`${name}.${p}: enum without values`);
    if (d.values) for (const v of d.values) if (typeof v === 'string' && !(d.type || '').includes(`'${v}'`)) warnings.push(`${name}.${p}: value "${v}" not in type`);
    if (!(real.props || []).includes(p) && !p.startsWith('on') && !['size', 'modelValue'].includes(p) && !d.forwarded) warnings.push(`${name}.${p}: not read by the render code (forwarded? set forwarded: true)`);
  }
  for (const s of real.slots || []) if (!ignore.has(s) && !(s in slots)) errors.push(`${name}: undocumented slot "${s}"`);
}
for (const n of Object.keys(meta)) if (!(n in components)) errors.push(`${n}: metadata for unknown component`);

console.log(`${documented}/${Object.keys(components).length} components documented, ${errors.length} errors, ${warnings.length} warnings`);
if (process.argv.includes('-v') || errors.length) console.log([...errors.map(e => 'ERROR ' + e), ...(process.argv.includes('-v') ? warnings.map(w => 'warn  ' + w) : [])].join('\n'));
process.exit(errors.length && !process.argv.includes('--soft') ? 1 : 0);
