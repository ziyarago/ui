// Bundle size per entry: raw and gzip of the JS/CSS the page loads statically (html script/link tags), plus totals of the output.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const walk = (d, o = []) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p, o) : o.push(p); } return o; };
const sz = f => { const b = readFileSync(f); return { raw: b.length, gzip: gzipSync(b).length }; };

export function bundleSizes(dist, pages) {
  const files = walk(dist);
  const total = { js: { raw: 0, gzip: 0 }, css: { raw: 0, gzip: 0 }, fonts: { raw: 0, gzip: 0 } };
  const top = [];
  for (const f of files) {
    const ext = f.split('.').pop();
    const k = ext === 'js' || ext === 'mjs' ? 'js' : ext === 'css' ? 'css' : /woff2?|ttf/.test(ext) ? 'fonts' : null;
    if (!k) continue;
    const s = sz(f);
    total[k].raw += s.raw; total[k].gzip += s.gzip;
    top.push({ file: f.slice(dist.length + 1), ...s });
  }
  const entries = {};
  for (const page of pages) {
    const html = join(dist, page);
    if (!existsSync(html)) continue;
    const src = readFileSync(html, 'utf8');
    const refs = [...src.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(m => m[1].replace(/^\//, ''));
    let raw = 0, gzip = 0;
    for (const r of refs) { const f = join(dist, r); if (existsSync(f)) { const s = sz(f); raw += s.raw; gzip += s.gzip; } }
    entries[page] = { files: refs.length, raw, gzip };
  }
  return { total, entries, top: top.sort((a, b) => b.raw - a.raw).slice(0, 12) };
}

/** Flags growth against a committed baseline (tests/bundle/baseline.json): > 10% on a gzip figure is a failure. */
export function compareBaseline(key, sizes, baseline, tol = 0.1) {
  const b = baseline?.[key];
  if (!b) return [{ cat: 'size', sev: 'info', msg: `no baseline for ${key}; current ${JSON.stringify(flat(sizes))}` }];
  const cur = flat(sizes), out = [];
  for (const [k, v] of Object.entries(cur)) if (b[k] && v > b[k] * (1 + tol)) out.push({ cat: 'size', sev: 'fail', msg: `${key} ${k}: ${v} B gzip vs baseline ${b[k]} (+${Math.round((v / b[k] - 1) * 100)}%)` });
  return out;
}
export const flat = s => ({ jsTotal: s.total.js.gzip, cssTotal: s.total.css.gzip, ...Object.fromEntries(Object.entries(s.entries).map(([k, v]) => ['entry:' + k, v.gzip])) });
