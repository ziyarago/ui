// Turns raw page results into issues: { cat, sev: 'fail'|'warn'|'info', where, msg }.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ALLOW = existsSync(join(here, '../allow.json')) ? JSON.parse(readFileSync(join(here, '../allow.json'), 'utf8')) : [];
// allow.json: [{ "cat": "overflow", "match": "regex tested against the issue message", "app": "vue|react|nuxt (optional)", "reason": "why this is fine" }]
export const allowed = (issue, app) => ALLOW.find(a => a.cat === issue.cat && (!a.app || a.app === app) && new RegExp(a.match).test(issue.msg));

const hostOf = u => { try { return new URL(u).host; } catch { return u; } };

export function analyzePage(r, ctx) {
  const out = [];
  const add = (cat, sev, msg) => out.push({ cat, sev, msg });
  if (r.fatal) { add('page', 'fail', 'page did not finish: ' + r.fatal); }
  for (const b of r.bad) add('console', 'fail', `${b.kind}: ${b.text}${b.url ? ' (' + b.url + ')' : ''}`);
  for (const f of r.failed) add('request', 'fail', `${f.status} ${f.url}`);
  for (const e of r.external) {
    const h = hostOf(e.url);
    add('external-request', 'fail', `${e.type} ${e.url}${/unpkg|googleapis|gstatic/.test(h) ? '  <-- CDN request' : ''}`);
  }
  const d = r.data;
  if (!d) return out;
  for (const v of d.csp) {
    const kind = /style-src/.test(v.directive) && v.blocked === 'inline' && ctx.ssr ? 'csp-ssr-inline' : 'csp';
    add(kind, kind === 'csp-ssr-inline' ? 'warn' : 'fail', `${v.directive} blocked ${v.blocked} ${v.source ? v.source + ':' + v.line : ''} ${v.sample ? '"' + v.sample + '"' : ''}`.trim());
  }
  const z = d.zg;
  if (z.expected !== undefined && z.mounted !== z.expected) add('mount', 'fail', `mounted ${z.mounted} of ${z.expected} variants`);
  for (const e of z.errors) add('render-error', 'fail', `${e.component}#${e.variant}: ${String(e.message).split('\n')[0]}`);
  if (d.errorsInDom) add('render-error', 'fail', `${d.errorsInDom} variants carry data-error`);

  for (const [name, v] of Object.entries(d.icons)) {
    if (!v.missing) continue;
    const builtin = ctx.builtinIcons.has(name);
    add(builtin ? 'icon-builtin-missing' : 'icon-not-builtin', builtin ? 'fail' : 'warn', `${name}: ${v.missing} of ${v.missing + v.ok} without --zg-icon${v.in.length ? ' in ' + v.in.join(',') : ''}${builtin ? ' (name IS in the built-in set)' : ' (not in the built-in set: needs registerIcons/setIconBase, otherwise fetched from unpkg)'}`);
  }

  const loaded = new Set(d.fonts.filter(f => f.status === 'loaded').map(f => f.family));
  const rtl = d.html.dir === 'rtl';
  if (!rtl && !loaded.has('Manrope')) add('fonts', 'fail', `Manrope not loaded (loaded: ${[...loaded].join(', ') || 'none'}; declared: ${[...new Set(d.fonts.map(f => f.family + ':' + f.status))].join(', ')})`);
  if ((ctx.locale === 'ar' || rtl) && ![...loaded].some(f => /^Thmanyah/.test(f))) add('fonts', 'fail', `Thmanyah (Arabic) not loaded for locale ${ctx.locale} dir ${d.html.dir} (loaded: ${[...loaded].join(', ') || 'none'})`);
  for (const f of d.fonts) if (f.status === 'error') add('fonts', 'fail', `font face ${f.family} ${f.weight} failed to load`);
  if (d.fontFamily.body && !/Manrope/i.test(d.fontFamily.body) && !/Thmanyah/i.test(d.fontFamily.body)) add('fonts', 'warn', `body font-family is "${d.fontFamily.body}"`);

  if (d.stringMismatchCount) add('strings', 'fail', `${d.stringMismatchCount} built-in strings differ from the package files in locale ${ctx.locale}: ${d.stringMismatch.slice(0, 6).map(([c, k, want, got]) => `${c}.${k} want "${want}" got "${got}"`).join('; ')}`);
  for (const l of d.leaks) add('strings', 'fail', `${l.component}: text "${l.text}" renders as its key (${l.kind})`);

  for (const [sel, v] of Object.entries(d.backdrop)) if (v.none) add('backdrop', 'fail', `${sel}: backdrop-filter computes to none on all ${v.n} sampled elements (fx=${d.html.fx})`);
  if (Object.keys(d.backdrop).length && d.html.fx !== 'full') add('backdrop', 'warn', `data-fx is "${d.html.fx}", glass checks are not meaningful`);

  if (d.pageOverflow > 0) add('overflow', 'warn', `page scrolls horizontally by ${d.pageOverflow}px`);
  for (const c of d.pageCulprits || []) add('overflow', 'warn', `page-level: ${c.component} <${c.el}> position ${c.pos} spans ${c.left}..${c.right} "${c.text}"`);
  const seen = new Set();
  for (const c of d.culprits) { const k = c.component; if (seen.has(k)) continue; seen.add(k); add('overflow', 'warn', `${c.component}#${c.variant}: <${c.el}> spans ${c.left}..${c.right} (${c.width}px) outside the ${d.html.dir} viewport`); }
  for (const x of d.stress || []) if (!/: url\(/.test(x)) add('css-url', 'fail', `background image with a space/parenthesis/quote in the URL is dropped: ${x}`);
  for (const u of d.remoteCss) add('external-request', 'fail', 'stylesheet/@import from another origin: ' + u);
  return out;
}

/** Compares kebab-case props against camelCase props: same markup expected. */
export function compareKebab(base, kebab) {
  const out = [];
  if (!base?.data || !kebab?.data) return out;
  const a = base.data.zg.fingerprints, b = kebab.data.zg.fingerprints;
  for (const k of Object.keys(a)) if (b[k] && a[k][0] !== b[k][0]) out.push({ cat: 'kebab-props', sev: 'fail', msg: `${k}: markup differs when props are passed in kebab-case (camel: ${a[k][1]} | kebab: ${b[k][1]})` });
  return out;
}
