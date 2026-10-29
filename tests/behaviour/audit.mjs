// Behaviour audit: every free component and docs variant, in Vue and React, under many themes/palettes/directions/widths and stress data,
// with automatic oracles (overflow, clipping, squeeze, contrast, focus ring, target size, ids, tab order, axe, console, layout shift).
// usage: node tests/behaviour/audit.mjs [--scenarios=base,rtl,...] [--fw=vue|react] [--only=Button,Select] [--out=audit-out] [--report-only]
// Gate: findings whose "Component|oracle" key is not in tests/behaviour/baseline.json fail the run. --write-baseline rewrites it.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, startServers, launch, stubExternal, watch, GEN, FRAMEWORKS } from '../browser/lib.mjs';
import { stressExamples, MODES } from './stress.mjs';
import { audit, judgeSamples, runAxe } from './oracles.mjs';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const arg = k => (process.argv.find(a => a.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const has = k => process.argv.includes('--' + k);
const fws = arg('fw') ? [arg('fw')] : FRAMEWORKS;
const only = arg('only');
const OUT = arg('out') || 'audit-out';
const axeSrc = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASELINE = join(here, 'baseline.json');
const baseline = new Set(existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : []);

const D = { theme: 'dark', palette: 'gold', dir: 'ltr', w: 1440, data: 'examples' };
const cfg = (o) => ({ ...D, ...o });
const SCENARIOS = {
  base: [cfg({}), cfg({ theme: 'light' })],
  palette: [cfg({ palette: 'tamam' }), cfg({ palette: 'tamam', theme: 'light' })],
  rtl: [cfg({ dir: 'rtl' }), cfg({ dir: 'rtl', theme: 'light', w: 360 })],
  narrow: [cfg({ w: 360 }), cfg({ w: 360, theme: 'light', palette: 'tamam' })],
  size: ['xs', 'sm', 'md', 'lg', 'xl'].map(s => cfg({ data: 'stress-size-' + s })),
  overlay: [cfg({ overlay: true }), cfg({ overlay: true, theme: 'light', dir: 'rtl', w: 360 })],
};
for (const m of MODES) SCENARIOS[m] = [cfg({ data: 'stress-' + m, fixh: true }), cfg({ data: 'stress-' + m, theme: 'light', dir: 'rtl', w: 360, palette: 'tamam', fixh: true })];
const wanted = (arg('scenarios') || Object.keys(SCENARIOS).join(',')).split(',');

const AXE_OFF = ['region', 'landmark-one-main', 'landmark-unique', 'page-has-heading-one', 'document-title', 'html-has-lang', 'bypass', 'duplicate-id', 'duplicate-id-aria', 'duplicate-id-active', 'meta-viewport', 'heading-order', 'landmark-no-duplicate-main', 'landmark-banner-is-top-level', 'landmark-complementary-is-top-level', 'landmark-contentinfo-is-top-level', 'landmark-main-is-top-level', 'landmark-no-duplicate-banner', 'landmark-no-duplicate-contentinfo'];

const examples = await generate({ ssr: false });
for (const m of MODES) writeFileSync(join(GEN, `stress-${m}.json`), JSON.stringify(stressExamples(examples, m)));
for (const s of ['xs', 'sm', 'md', 'lg', 'xl']) writeFileSync(join(GEN, `stress-size-${s}.json`), JSON.stringify(stressExamples(examples, 'size-' + s)));
const overlayNames = examples.filter(e => e.variants.some(v => v.overlay)).map(e => e.name).filter(n => !only || only.split(',').includes(n));

mkdirSync(join(OUT, 'shots'), { recursive: true });
const servers = await startServers(fws);
const browser = await launch();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rows = [];

const slug = s => String(s).replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 60);
const scenName = c => [c.data === 'examples' ? 'normal' : c.data.replace('stress-', ''), c.theme, c.palette, c.dir, c.w + 'px', c.overlay ? 'overlay' : ''].filter(Boolean).join('-');

async function runPage(fw, sid, c, extra = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: c.w, height: 900 });
  const bad = watch(page);
  await stubExternal(page, []);
  await page.evaluateOnNewDocument(() => {
    window.__shifts = [];
    try {
      new PerformanceObserver(l => {
        for (const e of l.getEntries()) {
          if (e.hadRecentInput) continue;
          const nodes = (e.sources || []).map(s => s.node && s.node.nodeType === 1 ? (s.node.closest('[data-component]') || {}).getAttribute?.('data-component') || (s.node.className + '').slice(0, 40) : '?');
          window.__shifts.push({ t: e.startTime, v: e.value, n: nodes });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {}
  });
  const q = new URLSearchParams({ theme: c.theme, palette: c.palette, dir: c.dir, motion: 'off', data: c.data });
  if (c.fixh) q.set('fixh', '1');
  if (c.overlay) q.set('overlays', '1');
  const only_ = extra.only || only;
  if (only_) q.set('only', only_);
  const scen = `${sid}/${scenName(c)}`;
  const push = (r) => rows.push({ fw, scenario: scen, ...r });
  try {
    await page.goto(`${servers[fw].url}/?${q}`, { waitUntil: 'load', timeout: 120000 });
    await page.waitForFunction('window.__zg && window.__zg.done', { timeout: 300000 });
    await sleep(500);
    const t0 = await page.evaluate(() => performance.now());
    const z = await page.evaluate(() => ({ errors: window.__zg.errors, mounted: window.__zg.mounted, expected: window.__zg.expected }));
    for (const e of z.errors) push({ c: e.component, v: e.variant, o: 'render-error', d: e.message.split('\n')[0].slice(0, 200) });
    const seen = new Set();
    for (const b of bad) {
      const comp = b.at ? b.at.split('#')[0] : '(page)';
      const k = comp + b.kind + b.text;
      if (seen.has(k)) continue; seen.add(k);
      push({ c: comp, v: b.at ? +b.at.split('#')[1] : -1, o: 'console', d: `${b.kind}: ${b.text}`.slice(0, 220) });
    }
    await page.keyboard.press('Shift');
    const mode = c.overlay ? 'portal' : 'variants';
    const { findings, samples } = await page.evaluate(audit, { mode, component: extra.only, minTarget: 24, focus: true });
    for (const f of findings) push({ c: f.c, v: f.v, label: f.label, o: f.o, d: f.d, el: f.el, rect: f.r });

    // gradient/image backgrounds: judge contrast on real pixels with the text hidden
    if (samples.length) {
      const byVar = new Map();
      for (const s of samples) { const k = s.c + '#' + s.v; if (!byVar.has(k)) byVar.set(k, []); byVar.get(k).push(s); }
      await page.addStyleTag({ content: '*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}svg *{stroke:transparent!important;fill:transparent!important}', id: 'zg-hide' }).catch(() => {});
      let n = 0;
      for (const [k, items] of byVar) {
        if (n++ >= 40) break;
        const x = Math.max(0, Math.min(...items.map(i => i.r.x)) - 4), y = Math.max(0, Math.min(...items.map(i => i.r.y)) - 4);
        const w = Math.min(1600, Math.max(...items.map(i => i.r.x + i.r.w)) - x + 4), h = Math.min(1600, Math.max(...items.map(i => i.r.y + i.r.h)) - y + 4);
        try {
          const b64 = await page.screenshot({ clip: { x, y, width: Math.max(2, w), height: Math.max(2, h) }, captureBeyondViewport: true, encoding: 'base64' });
          const res = await page.evaluate(judgeSamples, b64, { x, y, w: Math.max(2, w) }, items);
          for (const r of res) if (r.bad) { const it = items.find(i => i.id === r.id); push({ c: it.c, v: it.v, label: it.label, o: it.kind === 'icon' ? 'contrast-graphic' : 'contrast-text', d: `${r.ratio} < ${it.need} on gradient/image (sampled)`, el: it.el, rect: it.r }); }
        } catch (e) { push({ c: items[0].c, v: items[0].v, o: 'harness', d: 'sampling failed: ' + e.message.slice(0, 100) }); }
      }
      await page.evaluate(() => document.getElementById('zg-hide')?.remove());
    }

    // axe
    try {
      await page.evaluate(axeSrc);
      const ax = await page.evaluate(runAxe, { off: AXE_OFF, component: extra.only });
      const dedupe = new Set();
      for (const a of ax) { const k = a.rule + a.c + a.v + a.target; if (dedupe.has(k)) continue; dedupe.add(k); push({ c: a.c, v: a.v, o: 'axe:' + a.rule, d: `${a.impact}: ${a.msg}`, el: a.target }); }
    } catch (e) { push({ c: '(page)', v: -1, o: 'harness', d: 'axe failed: ' + e.message.slice(0, 100) }); }

    // late layout shift
    await sleep(300);
    const mark = await page.evaluate(() => performance.now());
    await sleep(1500);
    const shifts = await page.evaluate(m => window.__shifts.filter(s => s.t > m), mark);
    const per = new Map();
    for (const s of shifts) for (const n of new Set(s.n)) per.set(n, (per.get(n) || 0) + s.v);
    for (const [n, v] of per) if (v > 0.01) push({ c: n, v: -1, o: 'layout-shift', d: `late shift ${v.toFixed(3)} after load` });

    // page-level horizontal scroll (reported once per page)
    const hs = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    if (hs.sw > hs.cw + 1) push({ c: '(page)', v: -1, o: 'page-hscroll', d: `scrollWidth ${hs.sw} > ${hs.cw}` });

    // evidence screenshots: highlight the offending rect
    const mine = rows.filter(r => r.scenario === scen && r.fw === fw && r.rect && r.o !== 'harness');
    const groups = new Map();
    for (const r of mine) { const k = r.c + '#' + r.v; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
    let shots = 0;
    for (const [k, rs] of groups) {
      if (shots++ >= 25) break;
      const x = Math.max(0, Math.min(...rs.map(r => r.rect.x)) - 8), y = Math.max(0, Math.min(...rs.map(r => r.rect.y)) - 8);
      const x2 = Math.min(Math.max(...rs.map(r => r.rect.x + r.rect.w)) + 8, c.w + 400), y2 = Math.max(...rs.map(r => r.rect.y + r.rect.h)) + 8;
      const file = `shots/${fw}-${slug(sid)}-${slug(scenName(c))}-${slug(k)}.png`;
      try {
        await page.evaluate(rects => { rects.forEach((r, i) => { const d = document.createElement('div'); d.className = 'zg-audit-mark'; d.style.cssText = `position:absolute;z-index:2147483647;pointer-events:none;outline:2px solid red;left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`; document.body.append(d); }); }, rs.map(r => r.rect));
        await page.screenshot({ path: join(OUT, file), clip: { x, y, width: Math.max(20, Math.min(x2 - x, 1600)), height: Math.max(20, Math.min(y2 - y, 900)) }, captureBeyondViewport: true });
        await page.evaluate(() => document.querySelectorAll('.zg-audit-mark').forEach(e => e.remove()));
        for (const r of rs) r.shot = file;
      } catch {}
    }
  } catch (e) {
    push({ c: '(page)', v: -1, o: 'harness', d: 'page failed: ' + String(e.message).slice(0, 200) });
  }
  await page.close();
}

const jobs = [];
for (const sid of wanted) {
  if (!SCENARIOS[sid]) { console.error('unknown scenario ' + sid); continue; }
  for (const fw of fws) for (const c of SCENARIOS[sid]) {
    if (c.overlay) for (const name of overlayNames) jobs.push(() => runPage(fw, sid, c, { only: name }));
    else jobs.push(() => runPage(fw, sid, c));
  }
}
const CONC = Number(process.env.BROWSER_CONCURRENCY || 3);
let done = 0;
await Promise.all(Array.from({ length: CONC }, async () => { while (jobs.length) { const j = jobs.shift(); await j(); done++; } }));
await browser.close();
for (const s of Object.values(servers)) await s.server.close();

// ---- report
const key = r => `${r.c}|${r.o}`;
const groups = new Map();
for (const r of rows) { const k = key(r); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
writeFileSync(join(OUT, 'findings.json'), JSON.stringify(rows, null, 1));
const md = ['| component | oracle | count | scenarios | variant | detail | evidence |', '| --- | --- | ---: | --- | --- | --- | --- |'];
const sorted = [...groups].sort((a, b) => a[0].localeCompare(b[0]));
for (const [k, rs] of sorted) {
  const [c, o] = k.split('|');
  const sc = [...new Set(rs.map(r => r.fw + ':' + r.scenario))];
  const first = rs.find(r => r.shot) || rs[0];
  md.push(`| ${c} | ${o} | ${rs.length} | ${sc.slice(0, 3).join('; ')}${sc.length > 3 ? ` (+${sc.length - 3})` : ''} | ${first.label || first.v} | ${String(first.d).replace(/\|/g, '/').slice(0, 120)} ${first.el ? '`' + String(first.el).replace(/\|/g, '/').slice(0, 60) + '`' : ''} | ${first.shot || ''} |`);
}
writeFileSync(join(OUT, 'report.md'), md.join('\n') + '\n');
const fresh = sorted.filter(([k]) => !baseline.has(k));
console.log(`\nBehaviour audit: ${wanted.join(',')} x ${fws.join('+')}; ${rows.length} findings in ${groups.size} component/oracle groups; ${fresh.length} not in baseline`);
for (const [k, rs] of sorted) {
  const f = rs[0];
  console.log(`${baseline.has(k) ? '  known ' : '  NEW   '} ${k.padEnd(40)} x${String(rs.length).padEnd(4)} [${f.fw} ${f.scenario}] ${f.label ?? f.v}: ${String(f.d).slice(0, 140)}`);
}
if (has('write-baseline')) writeFileSync(BASELINE, JSON.stringify([...new Set([...baseline, ...groups.keys()])].sort(), null, 1) + '\n');
const harness = rows.filter(r => r.o === 'harness');
console.log(`\n${fresh.length || harness.length ? 'FINDINGS' : 'CLEAN'}: ${fresh.length} new groups, ${harness.length} harness problems`);
process.exit(!has('report-only') && (fresh.length || harness.length) ? 1 : 0);
