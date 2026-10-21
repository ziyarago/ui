// Renders every docs variant of every component in real Chrome, in both adapters and several modes.
// usage: node tests/browser/run.mjs [--only=Button,Select] [--fw=vue|react] [--verbose]
import { generate, startServers, startProd, launch, stubExternal, watch, FRAMEWORKS } from './lib.mjs';
import { EMPTY_OK } from '../ssr/allowlist.mjs';

const arg = k => (process.argv.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1];
const verbose = process.argv.includes('--verbose');
const only = arg('only');
const fws = arg('fw') ? [arg('fw')] : FRAMEWORKS;

const SCENARIOS = [
  { id: 'dark', q: 'theme=dark', title: 'dark, ltr' },
  { id: 'light', q: 'theme=light', title: 'light' },
  { id: 'rtl', q: 'theme=dark&dir=rtl', title: 'rtl' },
  { id: 'overlays', q: 'overlays=1', title: 'overlays open' },
  { id: 'hydrate', q: 'hydrate=1&theme=dark', title: 'SSR + hydrate' },
  { id: 'prod', q: 'theme=dark', title: 'production build', prod: true },
];

const examples = await generate();
const servers = await startServers(fws);
const prod = await startProd(fws);
const browser = await launch();

async function runPage(fw, sc) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const external = [];
  await stubExternal(page, external);
  const bad = watch(page);
  const url = `${(sc.prod ? prod : servers)[fw].url}/?${sc.q}${only ? '&only=' + only : ''}`;
  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction('window.__zg && window.__zg.done', { timeout: 180000 });
  await new Promise(r => setTimeout(r, sc.id === 'hydrate' ? 1500 : 400));
  const res = await page.evaluate((emptyOk, expectOpen) => {
    const z = window.__zg;
    const empty = [], variants = {};
    for (const sec of document.querySelectorAll('[data-component]')) {
      const name = sec.getAttribute('data-component');
      variants[name] = 0;
      for (const v of sec.querySelectorAll('[data-variant]')) {
        variants[name]++;
        const pv = v.querySelector('.doc-preview');
        if (!pv) { empty.push(`${name} #${v.dataset.variant} (${v.dataset.label}): no preview root`); continue; }
        const rendered = pv.childElementCount > 0 || pv.textContent.trim() !== '';
        if (!rendered && !(name in emptyOk)) empty.push(`${name} #${v.dataset.variant} (${v.dataset.label}): rendered empty`);
        if (expectOpen && pv.childElementCount < 2) empty.push(`${name} #${v.dataset.variant} (${v.dataset.label}): overlay did not open (only the trigger is present)`);
      }
    }
    return { errors: z.errors, mounted: z.mounted, expected: z.expected, variants, empty };
  }, EMPTY_OK, sc.id === 'overlays');
  await page.close();
  return { fw, sc, bad, res, ms: Date.now() - t0, external, url };
}

const jobs = [];
for (const fw of fws) for (const sc of SCENARIOS) jobs.push([fw, sc]);
const results = [];
const CONC = Number(process.env.BROWSER_CONCURRENCY || 4);
const queue = [...jobs];
await Promise.all(Array.from({ length: CONC }, async () => {
  while (queue.length) {
    const [fw, sc] = queue.shift();
    try { results.push(await runPage(fw, sc)); }
    catch (e) { results.push({ fw, sc, fatal: String(e && e.message || e), bad: [], res: { errors: [], empty: [], variants: {} } }); }
  }
}));
await browser.close();
for (const s of Object.values(servers)) await s.server.close();
for (const s of Object.values(prod)) await s.server.close();

// ---- report
const fail = new Map();
const note = (fw, sc, comp, msg) => { const k = `${comp}`; if (!fail.has(k)) fail.set(k, []); fail.get(k).push(`[${fw}/${sc.id}] ${msg}`); };
const globalFail = [];
for (const r of results.sort((a, b) => a.fw.localeCompare(b.fw) || SCENARIOS.indexOf(a.sc) - SCENARIOS.indexOf(b.sc))) {
  if (r.fatal) { globalFail.push(`[${r.fw}/${r.sc.id}] page failed: ${r.fatal}`); continue; }
  for (const e of r.res.errors) note(r.fw, r.sc, e.component, `render error in variant #${e.variant}: ${e.message.split('\n')[0]}`);
  for (const m of r.res.empty) note(r.fw, r.sc, m.split(' #')[0], m);
  if (!only && r.res.expected !== undefined && r.res.mounted !== r.res.expected) globalFail.push(`[${r.fw}/${r.sc.id}] mounted ${r.res.mounted} of ${r.res.expected}`);
  const seen = new Map();
  for (const b of r.bad) { const k = (b.at ? `<${b.at}> ` : '') + b.kind + ' ' + b.text; seen.set(k, (seen.get(k) || 0) + 1); }
  for (const [k, n] of seen) globalFail.push(`[${r.fw}/${r.sc.id}] ${k}${n > 1 ? ` (x${n})` : ''}`);
}

const names = examples.filter(e => !only || only.split(',').includes(e.name)).map(e => e.name);
const cols = 4, w = 30;
const nVariants = examples.filter(e => names.includes(e.name)).reduce((a, e) => a + e.variants.length, 0);
console.log(`\nBrowser render: ${names.length} components, ${nVariants} variants, frameworks ${fws.join('+')}, ${SCENARIOS.length} scenarios each (${SCENARIOS.map(s => s.title).join('; ')})`);
{
  const cells = names.map(n => (fail.has(n) ? 'FAIL ' : 'ok   ') + n);
  for (let i = 0; i < cells.length; i += cols) console.log('  ' + cells.slice(i, i + cols).map(c => c.padEnd(w)).join(''));
}
for (const r of results.filter(r => !r.fatal)) if (verbose) console.log(`  ${r.fw}/${r.sc.id}: ${r.res.expected} variants mounted in ${(r.ms / 1000).toFixed(1)}s, ${r.bad.length} console/network problems`);
if (fail.size || globalFail.length) {
  console.log('\nFAILURES');
  for (const [c, msgs] of fail) { console.log(`  ${c}`); for (const m of [...new Set(msgs)].slice(0, 6)) console.log('    ' + m); }
  if (globalFail.length) { console.log('  (page level)'); for (const m of globalFail.slice(0, 60)) console.log('    ' + m); if (globalFail.length > 60) console.log(`    ... ${globalFail.length - 60} more`); }
}
const pages = results.filter(r => !r.fatal).length;
console.log(`\nSummary: ${pages}/${jobs.length} pages ran, ${names.length - [...fail.keys()].filter(k => names.includes(k)).length}/${names.length} components clean, ${globalFail.length} page-level problems. ${fail.size || globalFail.length ? 'FAILED' : 'PASSED'}`);
process.exit(fail.size || globalFail.length ? 1 : 0);
