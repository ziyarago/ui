#!/usr/bin/env node
// Builds a consumer app from the PACKED tarballs and audits its production bundle in headless Chrome under a strict CSP.
// usage: node tests/bundle/run-app.mjs <vue|react|nuxt> --tarballs <dir> --examples <examples.json> --out <dir> [--pro] [--nuxt 3|4] [--keep]
import { spawn, execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import net from 'node:net';
import { startServer } from './lib/csp-server.mjs';
import { launch, runPage } from './lib/browser.mjs';
import { analyzePage, compareKebab, allowed } from './lib/analyze.mjs';
import { bundleSizes, compareBaseline, flat, kitBytes } from './lib/sizes.mjs';
import { extract, builtinIcons, i18nKeys, backdropSelectors } from './lib/tarball.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const appName = args[0];
const val = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const PRO = args.includes('--pro');
const NUXT = val('--nuxt') || '3';
const tarballs = val('--tarballs'), examples = val('--examples'), outDir = val('--out') || join(HERE, 'out');
if (!['vue', 'react', 'nuxt'].includes(appName) || !tarballs || !examples) { console.error('usage: run-app.mjs <vue|react|nuxt> --tarballs <dir> --examples <json> --out <dir> [--pro] [--nuxt 3|4]'); process.exit(2); }
mkdirSync(outDir, { recursive: true });

const log = (...a) => console.log(`[${appName}${appName === 'nuxt' ? NUXT : ''}${PRO ? '+pro' : ''}]`, ...a);
const sh = (cmd, a, opts = {}) => { log('$', cmd, a.join(' ')); return execFileSync(cmd, a, { stdio: 'inherit', ...opts }); };
const find = re => { const f = readdirSync(tarballs).find(n => re.test(n)); return f ? join(tarballs, f) : null; };
const uiTgz = find(/^ziyarago-ui-\d.*\.tgz$/), proTgz = PRO ? find(/^ziyarago-ui-pro-.*\.tgz$/) : null;
if (!uiTgz || (PRO && !proTgz)) { console.error('tarballs not found in', tarballs, readdirSync(tarballs)); process.exit(2); }

const work = mkdtempSync(join(tmpdir(), `zg-${appName}-`));
const app = join(work, 'app');
cpSync(join(HERE, 'apps', appName), app, { recursive: true });
cpSync(join(HERE, 'shared'), join(app, 'auditkit'), { recursive: true });
cpSync(join(HERE, '../lib/spy.js'), join(app, 'auditkit/spy.js'));

// ---- package.json: tarballs installed like a customer would
const deps = { '@ziyarago/ui': 'file:' + uiTgz, ...(PRO ? { '@ziyarago/ui-pro': 'file:' + proTgz } : {}) };
const base = { name: 'consumer', private: true, type: 'module', scripts: {} };
const common = { tailwindcss: '^4', '@tailwindcss/vite': '^4', typescript: '^5.9' };
const pkgs = {
  vue: { dependencies: { ...deps, vue: '^3.5', 'vue-i18n': '^10' }, devDependencies: { ...common, vite: '^8', '@vitejs/plugin-vue': 'latest', 'unplugin-vue-components': 'latest' } },
  react: { dependencies: { ...deps, react: '^19', 'react-dom': '^19' }, devDependencies: { ...common, vite: '^8', '@vitejs/plugin-react': 'latest', '@types/react': '^19', '@types/react-dom': '^19' } },
  nuxt: { dependencies: { ...deps, nuxt: '^' + NUXT, vue: '^3.5' }, devDependencies: { ...common } },
}[appName];
writeFileSync(join(app, 'package.json'), JSON.stringify({ ...base, ...pkgs }, null, 2));

// ---- generated glue
const uiEntry = appName === 'react'
  ? `import * as FREE from '@ziyarago/ui/react';\n${PRO ? "import * as PROX from '@ziyarago/ui-pro/react';\n" : ''}const pick = ns => Object.fromEntries(Object.entries(ns).filter(([k]) => /^Ui[A-Z]/.test(k)));\nexport const UI = { ...pick(FREE)${PRO ? ', ...pick(PROX)' : ''} };\n`
  : `import * as FREE from '@ziyarago/ui/vue';\n${PRO ? "import * as PROX from '@ziyarago/ui-pro/vue';\n" : ''}const pick = ns => Object.fromEntries(Object.entries(ns).filter(([k]) => /^Ui[A-Z]/.test(k)));\nexport const UI = { ...pick(FREE)${PRO ? ', ...pick(PROX)' : ''} };\n`;
writeFileSync(join(app, 'auditkit/ui-entry.js'), uiEntry);
const proCss = PRO ? '@import "@ziyarago/ui-pro/style.css" layer(components);' : '';
for (const f of [join(app, 'auditkit/style.css'), join(app, 'assets/app.css')]) if (existsSync(f)) writeFileSync(f, readFileSync(f, 'utf8').replace('/*PRO_CSS*/', proCss));
if (existsSync(join(app, 'auditkit/style.css'))) cpSync(join(app, 'auditkit/style.css'), join(app, 'src/style.css'));
const pub = join(app, 'public');
mkdirSync(pub, { recursive: true });
if (appName === 'nuxt') { mkdirSync(join(app, 'data'), { recursive: true }); cpSync(examples, join(app, 'data/examples.json')); }
else cpSync(examples, join(pub, 'examples.json'));
// the docs examples point at site assets (/3d/kaaba.png ...): serve a placeholder so a 404 means a real defect
{
  const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
  const urls = new Set();
  JSON.stringify(JSON.parse(readFileSync(examples, 'utf8')).examples, (k, v) => { if (typeof v === 'string' && /^\/[\w./-]+\.(png|jpe?g|webp|gif)$/.test(v)) urls.add(v); return v; });
  urls.add("/img/a b(1)'s.png");
  // map tiles requested through the tiles prop: any /tiles/<style>/<z>/<x>/<y>.png is served by a placeholder
  for (const st of ['light_all', 'dark_all']) for (let z = 3; z <= 18; z++) if (z === 14 || z === 13 || z === 15) {
    const x0 = Math.floor((39.8262 + 180) / 360 * 2 ** z) - 4, y0 = Math.floor((1 - Math.log(Math.tan(21.4225 * Math.PI / 180) + 1 / Math.cos(21.4225 * Math.PI / 180)) / Math.PI) / 2 * 2 ** z) - 4;
    for (let x = x0; x < x0 + 9; x++) for (let y = y0; y < y0 + 9; y++) urls.add(`/tiles/${st}/${z}/${x}/${y}.png`);
  }
  for (const u of urls) { mkdirSync(dirname(join(pub, u)), { recursive: true }); writeFileSync(join(pub, u), PNG); }
  log('placeholder images', [...urls].join(' '));
}

const issues = [];
const results = [];
let sizes = null, versions = {};
const baseKey = `${appName}${appName === 'nuxt' ? NUXT : ''}${PRO ? '+pro' : ''}`;
const addIssue = (where, i) => issues.push({ where, ...i });

// ---- install
const t0 = Date.now();
sh('npm', ['install', '--no-audit', '--no-fund', '--legacy-peer-deps', '--loglevel=error'], { cwd: app });
log('installed in', Math.round((Date.now() - t0) / 1000), 's');
const installed = pkg => JSON.parse(readFileSync(join(app, 'node_modules', ...pkg.split('/'), 'package.json'), 'utf8')).version;
versions = Object.fromEntries(['vite', 'vue', 'react', 'nuxt', 'tailwindcss', 'vue-i18n', 'unplugin-vue-components', 'lightningcss', '@ziyarago/ui', '@ziyarago/ui-pro'].filter(p => existsSync(join(app, 'node_modules', ...p.split('/'), 'package.json'))).map(p => [p, installed(p)]));
log('versions', JSON.stringify(versions));

// ---- exports resolve and import in Node (customer view of the exports map)
{
  const req = createRequire(join(app, 'package.json'));
  const pkgJson = JSON.parse(readFileSync(join(app, 'node_modules/@ziyarago/ui/package.json'), 'utf8'));
  const importable = ['', '/theme', '/meta', '/resolver', '/i18n', '/internal', ...(appName === 'react' ? ['/react'] : ['/vue']), ...(appName === 'nuxt' ? ['/nuxt'] : [])];
  for (const key of Object.keys(pkgJson.exports)) {
    if (key.includes('*')) continue;
    const spec = '@ziyarago/ui' + key.slice(1);
    try { const p = req.resolve(spec); if (!existsSync(p)) addIssue('exports', { cat: 'exports', sev: 'fail', msg: `${spec} resolves to missing ${p}` }); }
    catch (e) { addIssue('exports', { cat: 'exports', sev: 'fail', msg: `${spec} does not resolve: ${String(e.message).split('\n')[0]}` }); }
  }
  const script = `const specs = ${JSON.stringify(importable.map(s => '@ziyarago/ui' + s))}; const out = {}; for (const s of specs) { try { const m = await import(s); out[s] = Object.keys(m).length; } catch (e) { out[s] = 'ERR ' + String(e.message).split('\\n')[0]; } } console.log('IMPORTS ' + JSON.stringify(out));`;
  try {
    const o = execFileSync('node', ['--input-type=module', '-e', script], { cwd: app, encoding: 'utf8' });
    const res = JSON.parse(o.split('IMPORTS ')[1]);
    for (const [s, n] of Object.entries(res)) { log('import', s, n); if (typeof n === 'string') addIssue('exports', { cat: 'exports', sev: 'fail', msg: `import('${s}') in Node: ${n}` }); }
  } catch (e) { addIssue('exports', { cat: 'exports', sev: 'fail', msg: 'node import check crashed: ' + String(e.message).split('\n')[0] }); }
}

// ---- types: every entry point as a TypeScript consumer sees it
{
  const imports = {
    vue: ["import { UiButton, useUiTheme } from '@ziyarago/ui/vue'", "import type { UiButtonProps, UiSelectProps } from '@ziyarago/ui/vue'", "import '@ziyarago/ui/vue/global'", ...(PRO ? ["import * as PROV from '@ziyarago/ui-pro/vue'", 'void PROV'] : [])],
    react: ["import { UiButton, useUiTheme } from '@ziyarago/ui/react'", "import type { UiButtonProps, UiSelectProps } from '@ziyarago/ui/react'", ...(PRO ? ["import * as PROR from '@ziyarago/ui-pro/react'", 'void PROR'] : [])],
    nuxt: ["import nuxtModule from '@ziyarago/ui/nuxt'", 'void nuxtModule', "import { UiButton } from '@ziyarago/ui/vue'"],
  }[appName];
  const body = `${imports.join(';\n')};
import { themeInitScript, configureTheme } from '@ziyarago/ui/theme';
import { meta } from '@ziyarago/ui/meta';
import { ZiyaragoUiResolver } from '@ziyarago/ui/resolver';
import { t, setUiLocale } from '@ziyarago/ui/i18n';
import * as internal from '@ziyarago/ui/internal';
import * as core from '@ziyarago/ui';
void [UiButton, themeInitScript, configureTheme, meta, ZiyaragoUiResolver, t, setUiLocale, internal, core];
export {};
`;
  writeFileSync(join(app, 'types-check.ts'), body);
  for (const [name, resolution, module] of [['bundler', 'bundler', 'esnext'], ['node10', 'node10', 'commonjs']]) {
    writeFileSync(join(app, `tsconfig.${name}.json`), JSON.stringify({ compilerOptions: { target: 'es2022', module, moduleResolution: resolution, strict: true, noEmit: true, skipLibCheck: true, jsx: 'react-jsx', types: [], lib: ['es2022', 'dom'] }, files: ['types-check.ts'] }));
    try { execFileSync('npx', ['tsc', '-p', `tsconfig.${name}.json`], { cwd: app, encoding: 'utf8', stdio: 'pipe' }); log('types ok', name); }
    catch (e) {
      const text = String(e.stdout || e.message);
      // node10 cannot see "exports"-only subpaths of third-party packages, so only errors about @ziyarago are relevant
      const lines = text.split('\n').filter(l => /error TS/.test(l) && (/ziyarago/.test(l) || name === 'bundler'));
      for (const l of lines.slice(0, 15)) addIssue('types', { cat: 'types', sev: 'fail', msg: `tsc ${name}: ${l.slice(0, 300)}` });
      if (!lines.length) log('tsc', name, 'reported only unrelated errors:', text.split('\n').slice(0, 3).join(' | '));
    }
  }
}

// ---- build
process.env.ZG_PRO = PRO ? '1' : '0';
const tb = Date.now();
const build = appName === 'nuxt' ? ['npx', ['nuxt', 'build']] : ['npx', ['vite', 'build']];
try { sh(build[0], build[1], { cwd: app, env: { ...process.env, NODE_ENV: 'production', NUXT_TELEMETRY_DISABLED: '1' } }); }
catch (e) { addIssue('build', { cat: 'build', sev: 'fail', msg: `${build[1].join(' ')} failed` }); finish(); }
log('built in', Math.round((Date.now() - tb) / 1000), 's');

// ---- sizes
const dist = appName === 'nuxt' ? join(app, '.output/public') : join(app, 'dist');
sizes = bundleSizes(dist, appName === 'nuxt' ? [] : ['index.html', 'minimal.html']);
// Tree shaking, measured in isolation: the multi-entry build above shares chunks between pages (a shared module keeps the union of what every
// entry needs), so each of these pages is built alone. base = the app without the kit, button = UiButton only, minimal = 8 components, all = every export.
const isoBuild = (pages) => {
  const iso = {};
  for (const page of pages) {
    const out = `dist-iso-${page}`;
    try { sh('npx', ['vite', 'build', '--outDir', out, '--emptyOutDir'], { cwd: app, env: { ...process.env, NODE_ENV: 'production', ZG_ONLY: `${page}.html` } }); }
    catch (e) { addIssue('treeshake', { cat: 'build', sev: 'fail', msg: `isolated build of ${page}.html failed` }); continue; }
    iso[page] = bundleSizes(join(app, out), [`${page}.html`]).entries[`${page}.html`];
  }
  return iso;
};
const isoJs = page => iso_[page].refs.filter(r => /\.m?js$/.test(r)).map(r => readFileSync(join(app, `dist-iso-${page}`, r), 'utf8')).join('\n');
let iso_ = {};
if (appName !== 'nuxt' && !PRO) {
  const iso = iso_ = isoBuild(['base', 'button', 'minimal', 'all']);
  sizes.iso = iso;
  if (['base', 'button', 'minimal', 'all'].every(k => iso[k])) {
    const all = kitBytes(iso, 'all'), mini = kitBytes(iso, 'minimal'), one = kitBytes(iso, 'button');
    log(`tree shaking (gzip JS of the kit alone): UiButton ${one} B, 8 components ${mini} B, all ${all} B (8 components = ${Math.round(100 * mini / all)}% of all); app without the kit ${iso.base.js} B`);
    if (!(mini < 0.45 * all)) addIssue('treeshake', { cat: 'treeshake', sev: 'fail', msg: `8 components weigh ${mini} B gzip of kit JS, ${Math.round(100 * mini / all)}% of all components (${all} B): the limit is 45%` });
    if (!(one < 0.15 * all)) addIssue('treeshake', { cat: 'treeshake', sev: 'fail', msg: `UiButton alone weighs ${one} B gzip of kit JS, ${Math.round(100 * one / all)}% of all components (${all} B): the limit is 15%` });
    const js = isoJs('button');
    const foreign = ['zg-cal__d', 'Previous month', 'zg-sheet', 'zg-heading', 'zg-press', 'zg-chip2', 'zg-foot', 'RichEditor', 'zg-menu__sep'].filter(x => js.includes(x));
    if (foreign.length) addIssue('treeshake', { cat: 'treeshake', sev: 'fail', msg: `the UiButton-only bundle contains strings of unrelated components: ${foreign.join(', ')}` });
  }
}
// Pro tree shaking, measured the same way: pro-one = UiLineChart only, pro-minimal = 8 Pro components, pro-all = every Pro export (import * as PRO).
if (appName !== 'nuxt' && PRO) {
  const iso = iso_ = isoBuild(['base', 'pro-one', 'pro-minimal', 'pro-all']);
  sizes.iso = iso;
  if (['base', 'pro-one', 'pro-minimal', 'pro-all'].every(k => iso[k])) {
    const all = kitBytes(iso, 'pro-all'), mini = kitBytes(iso, 'pro-minimal'), one = kitBytes(iso, 'pro-one');
    log(`Pro tree shaking (gzip JS of the kit alone): UiLineChart ${one} B, 8 Pro components ${mini} B, all Pro ${all} B (one = ${Math.round(100 * one / all)}%, 8 = ${Math.round(100 * mini / all)}% of all); app without the kit ${iso.base.js} B`);
    if (!(mini < 0.5 * all)) addIssue('treeshake', { cat: 'treeshake', sev: 'fail', msg: `8 Pro components weigh ${mini} B gzip of kit JS, ${Math.round(100 * mini / all)}% of all Pro (${all} B): the limit is 50%` });
    if (!(one < 0.25 * all)) addIssue('treeshake', { cat: 'treeshake', sev: 'fail', msg: `UiLineChart alone weighs ${one} B gzip of kit JS, ${Math.round(100 * one / all)}% of all Pro (${all} B): the limit is 25%` });
    // markers of components the one-component bundle does not depend on: Pro (hotel card, kanban, rich editor and chat strings, map, tree) and free (calendar, menu, chip, footer, sheet, heading, press)
    const js = isoJs('pro-one');
    if (!js.includes('zg-chart')) addIssue('treeshake', { cat: 'treeshake', sev: 'fail', msg: 'the UiLineChart-only bundle does not contain the chart (zg-chart): the marker check is blind' });
    const foreignPro = ['zg-hotel__img', 'zg-kcol__head', 'zg-lead__row', 'zg-rte', 'Code block', 'Ask anything', 'zg-map', 'zg-tree', 'zg-qibla'].filter(x => js.includes(x));
    if (foreignPro.length) addIssue('treeshake', { cat: 'treeshake', sev: 'fail', msg: `the UiLineChart-only bundle contains strings of unrelated Pro components: ${foreignPro.join(', ')}` });
    const foreignFree = ['zg-cal__d', 'Previous month', 'zg-sheet', 'zg-heading', 'zg-press', 'zg-chip2', 'zg-foot', 'zg-menu__sep', 'zg-select__list'].filter(x => js.includes(x));
    if (foreignFree.length) addIssue('treeshake', { cat: 'treeshake', sev: 'fail', msg: `the UiLineChart-only bundle contains free components it does not depend on: ${foreignFree.join(', ')}` });
    const js8 = isoJs('pro-minimal');
    const foreign8 = ['zg-rte', 'Code block', 'Ask anything', 'zg-map', 'zg-qibla', 'zg-cal__d', 'Previous month', 'zg-menu__sep', 'zg-foot'].filter(x => js8.includes(x));
    if (foreign8.length) addIssue('treeshake', { cat: 'treeshake', sev: 'fail', msg: `the 8-component Pro bundle contains strings of components it does not use: ${foreign8.join(', ')}` });
  }
}
log('sizes', JSON.stringify(flat(sizes)));
const baseline = existsSync(join(HERE, 'baseline.json')) ? JSON.parse(readFileSync(join(HERE, 'baseline.json'), 'utf8')) : {};
for (const i of compareBaseline(baseKey, sizes, baseline)) addIssue('size', i);
// the compiled stylesheet: glass surfaces must keep backdrop-filter after lightningcss
{
  const css = readdirSync(dist, { recursive: true }).filter(f => String(f).endsWith('.css')).map(f => readFileSync(join(dist, String(f)), 'utf8')).join('\n');
  const n = (css.match(/backdrop-filter/g) || []).length;
  log('minified css has', n, 'backdrop-filter declarations');
  writeFileSync(join(outDir, `css-${baseKey}.txt`), `backdrop-filter declarations: ${n}\n`);
  const srcCount = (readFileSync(join(app, 'node_modules/@ziyarago/ui/dist/style.css'), 'utf8').match(/(?<!-webkit-)backdrop-filter/g) || []).length;
  if (n < srcCount) addIssue('css', { cat: 'backdrop', sev: 'fail', msg: `minified CSS has ${n} backdrop-filter declarations, the package stylesheet has ${srcCount}` });
  if (/@import\s+url\(\s*["']?https?:/.test(css) || /url\(\s*["']?https?:\/\/(fonts|unpkg)/.test(css)) addIssue('css', { cat: 'external-request', sev: 'fail', msg: 'compiled CSS references a remote url()/@import' });
}

if (appName === 'nuxt') {
  const js = readdirSync(dist, { recursive: true }).filter(f => String(f).endsWith('.js')).map(f => readFileSync(join(dist, String(f)), 'utf8')).join('\n');
  const detailed = /Hydration (children|text|node|class|style|attribute)[^"'`]*mismatch/i.test(js);
  log('hydration mismatch details compiled in:', detailed);
  if (!detailed) addIssue('hydration', { cat: 'hydration', sev: 'warn', msg: 'production bundle has no hydration mismatch warnings compiled in: the hydration check is blind (__VUE_PROD_HYDRATION_MISMATCH_DETAILS__)' });
}

// ---- context for the browser checks
const pkgDir = join(app, 'node_modules/@ziyarago/ui');
const builtin = new Set(await builtinIcons(pkgDir));
const comps = await i18nKeys(pkgDir);
if (PRO) Object.assign(comps, await i18nKeys(join(app, 'node_modules/@ziyarago/ui-pro')));
const backdropSels = backdropSelectors(readFileSync(join(pkgDir, 'dist/style.css'), 'utf8'));
log('built-in icons', builtin.size, 'i18n components', Object.keys(comps).length, 'backdrop selectors', backdropSels.length);
const stringsFor = loc => { const out = []; for (const [c, m] of Object.entries(comps)) for (const [k, en] of Object.entries(m.en || {})) out.push([c, k, (m[loc] && m[loc][k]) ?? en]); return out; };
const keyed = (() => { const o = new Map(); for (const [c, m] of Object.entries(comps)) for (const [k, en] of Object.entries(m.en || {})) if (k !== en && k.length > 2 && /^[a-z][A-Za-z0-9]*$/.test(k) && !o.has(k)) o.set(k, en); return [...o]; })();
// translation coverage of the shipped files themselves
for (const [c, m] of Object.entries(comps)) for (const l of ['ar', 'ru']) {
  if (!m[l]) { addIssue('i18n', { cat: 'strings', sev: 'warn', msg: `${c}: no ${l} strings in the package (falls back to English)` }); continue; }
  for (const k of Object.keys(m.en || {})) if (!(k in m[l])) addIssue('i18n', { cat: 'strings', sev: 'warn', msg: `${c}.${l}: missing key ${k}` });
}

// ---- serve
let nuxtProc = null, srv;
async function freePort() { return new Promise(r => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); }); }); }
if (appName === 'nuxt') {
  const port = await freePort();
  nuxtProc = spawn('node', ['.output/server/index.mjs'], { cwd: app, env: { ...process.env, NITRO_PORT: String(port), PORT: String(port), NITRO_HOST: '127.0.0.1', HOST: '127.0.0.1' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let nuxtLog = ''; nuxtProc.stdout.on('data', d => nuxtLog += d); nuxtProc.stderr.on('data', d => nuxtLog += d);
  for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${port}/`); if (r.ok) break; } catch {} await new Promise(r => setTimeout(r, 500)); }
  srv = await startServer({ proxy: `http://127.0.0.1:${port}`, styleAttr: true });
  srv.nuxtLog = () => nuxtLog;
} else srv = await startServer({ root: dist });
log('serving', srv.url);

const browser = await launch();
const scen = async (id, o) => {
  const ctx = { locale: o.locale || 'en', ssr: appName === 'nuxt', builtinIcons: builtin };
  log('scenario', id);
  const r = await runPage(browser, { base: srv.url, strings: o.strings === false ? [] : stringsFor(o.locale || 'en'), keyed: o.strings === false ? [] : keyed, components: Object.keys(comps), backdrop: o.backdrop === false ? [] : backdropSels, ...o.page });
  const found = analyzePage(r, ctx).map(i => ({ where: id, ...i }));
  results.push({ id, raw: r, issues: found });
  log('  ', id, r.fatal ? 'FATAL ' + r.fatal : `${r.data.zg.mounted}/${r.data.zg.expected} mounted, ${found.length} findings, ${r.ms} ms`);
  return r;
};
const W = { width: 1440, height: 900 }, N = { width: 360, height: 800 };
const q = (o) => new URLSearchParams(o).toString();
try {
  if (appName === 'nuxt') {
    const sw = (locale, dir) => `(() => { const t = window.__zgTheme; t.setLocale('${locale}'); t.setDir('${dir}'); })()`;
    await scen('ssr-en-ltr-1440', { page: { path: '/', viewport: W } });
    await scen('ssr-en-ltr-360', { page: { path: '/', viewport: N } });
    await scen('ssr-en-rtl-360', { page: { path: '/', viewport: N, after: sw('en', 'rtl') } });
    await scen('ssr-ar-rtl-1440', { locale: 'ar', page: { path: '/', viewport: W, after: sw('ar', 'rtl') } });
    await scen('ssr-ru-ltr-1440', { locale: 'ru', page: { path: '/', viewport: W, after: sw('ru', 'ltr') } });
    await scen('auto-import-en', { strings: false, page: { path: '/auto', viewport: W } });
    // raw server HTML
    const html = await (await fetch(srv.url + '/')).text();
    writeFileSync(join(outDir, `ssr-index-${baseKey}.html`), html);
    const a = /<html[^>]*>/.exec(html)?.[0] || '';
    log('html tag', a);
    if (!/data-theme=/.test(a) || !/dir=/.test(a)) addIssue('ssr', { cat: 'ssr', sev: 'fail', msg: `server HTML tag lacks data-theme/dir: ${a}` });
    // the harness' own .doc-preview wrappers and empty style="" attributes are not the kit's output and are not counted
    const styleAttrs = [...html.matchAll(/<[a-z0-9]+\b[^>]*?\sstyle="([^"]+)"/g)].filter(m => !/class="doc-preview/.test(m[0])).length;
    const budget = baseline['ssr-style-attrs']?.[baseKey];
    addIssue('ssr', { cat: 'csp-ssr-inline', sev: budget != null && styleAttrs > budget ? 'fail' : 'info', msg: `${styleAttrs} inline style="" attributes in the server HTML${budget != null ? ` (budget ${budget})` : ''}; the audit CSP allows style-src-attr 'unsafe-inline' for SSR output, a stricter policy ignores them` });
    const kitStyles = {};
    for (const m of html.matchAll(/<([a-z0-9]+)\b([^>]*?)\sstyle="([^"]+)"/g)) { if (/class="doc-preview/.test(m[0])) continue; const k = m[1] + ' ' + (/class="([^" ]*)/.exec(m[2])?.[1] || '-') + ' ' + m[3].replace(/[0-9.]+/g, 'N').slice(0, 60); kitStyles[k] = (kitStyles[k] || 0) + 1; }
    writeFileSync(join(outDir, `ssr-styles-${baseKey}.json`), JSON.stringify(Object.entries(kitStyles).sort((a, b) => b[1] - a[1]).slice(0, 60), null, 1));
    for (const s of srv.log.inline) addIssue('ssr', { cat: 'csp-inline-script', sev: /zg-ui|ziyarago/i.test(s.head) ? 'warn' : 'info', msg: `inline <script> on ${s.path} needs a CSP hash/nonce: ${s.head}` });
  } else {
    const ex = appName === 'vue' ? ['kebab'] : [];
    await scen('en-ltr-1440', { page: { query: q({ locale: 'en', dir: 'ltr' }), viewport: W } });
    await scen('en-ltr-360', { page: { query: q({ locale: 'en', dir: 'ltr' }), viewport: N } });
    await scen('en-rtl-360', { page: { query: q({ locale: 'en', dir: 'rtl' }), viewport: N } });
    await scen('en-rtl-1440', { page: { query: q({ locale: 'en', dir: 'rtl' }), viewport: W } });
    await scen('ar-rtl-1440', { locale: 'ar', page: { query: q({ locale: 'ar' }), viewport: W } });
    await scen('ru-ltr-1440', { locale: 'ru', page: { query: q({ locale: 'ru' }), viewport: W } });
    await scen('light-en-1440', { page: { query: q({ locale: 'en', theme: 'light' }), viewport: W } });
    await scen('overlays-en-1440', { page: { query: q({ locale: 'en', overlays: '1' }), viewport: W } });
    if (ex.includes('kebab')) await scen('kebab-en-1440', { page: { query: q({ locale: 'en', dir: 'ltr', kebab: '1' }), viewport: W } });
    // the typical consumer entry: only what the templates import (tree shaken), built-in strings must survive
    const probe = (loc) => ({ fn: (arg) => { const html = document.body.innerHTML; const miss = []; for (const [c, vals] of Object.entries(arg)) if (!vals.some(v => html.includes(v))) miss.push(c); return { miss, text: document.body.innerText.slice(0, 200) }; }, arg: Object.fromEntries(['CopyButton', 'Pagination', 'SearchInput'].filter(c => comps[c]).map(c => [c, Object.values(comps[c][loc] || comps[c].en || {})])) });
    for (const loc of ['en', 'ar', 'ru']) {
      const r = await scen(`minimal-${loc}`, { locale: loc, strings: false, backdrop: false, page: { path: '/minimal.html', query: q({ locale: loc }), viewport: W, extra: probe(loc) } });
      if (r.data?.extra?.miss.length) addIssue(`minimal-${loc}`, { cat: 'strings', sev: 'fail', msg: `tree-shaken entry lost built-in ${loc} strings of: ${r.data.extra.miss.join(', ')}` });
    }
  }
} finally {
  await browser.close();
  if (nuxtProc) nuxtProc.kill();
  await srv.close();
}
const byId = Object.fromEntries(results.map(r => [r.id, r.raw]));
if (byId['en-ltr-1440'] && byId['kebab-en-1440']) for (const i of compareKebab(byId['en-ltr-1440'], byId['kebab-en-1440'])) addIssue('kebab-en-1440', i);
for (const f of srv.log.notFound) addIssue('server', { cat: 'request', sev: 'fail', msg: `404 ${f}` });
finish();

function finish() {
  const all = [...issues, ...results.flatMap(r => r.issues)];
  // merge the same finding across scenarios
  const merged = new Map();
  for (const i of all) {
    if (allowed(i, appName)) continue;
    const k = i.cat + '|' + i.sev + '|' + i.msg;
    const m = merged.get(k) || { ...i, where: [] };
    if (!m.where.includes(i.where)) m.where.push(i.where);
    merged.set(k, m);
  }
  const list = [...merged.values()].sort((a, b) => a.sev.localeCompare(b.sev) || a.cat.localeCompare(b.cat));
  const report = { app: baseKey, versions, sizes, issues: list, scenarios: results.map(r => ({ id: r.id, ms: r.raw.ms, fatal: r.raw.fatal, mounted: r.raw.data?.zg.mounted, expected: r.raw.data?.zg.expected, fonts: [...new Set((r.raw.data?.fonts || []).filter(f => f.status === 'loaded').map(f => f.family))], html: r.raw.data?.html, pageOverflow: r.raw.data?.pageOverflow, icons: r.raw.data ? Object.keys(r.raw.data.icons).length : 0 })) };
  writeFileSync(join(outDir, `report-${baseKey}.json`), JSON.stringify(report, null, 2));
  const fails = list.filter(i => i.sev === 'fail');
  console.log(`\n===== ${baseKey}: ${fails.length} failures, ${list.filter(i => i.sev === 'warn').length} warnings, ${list.filter(i => i.sev === 'info').length} notes =====`);
  for (const i of list) console.log(`${i.sev.toUpperCase().padEnd(5)} [${i.cat}] ${i.msg}  {${i.where.join(', ')}}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const md = [`### ${baseKey}: ${fails.length} failures, ${list.filter(i => i.sev === 'warn').length} warnings`, ...list.filter(i => i.sev !== 'info').slice(0, 60).map(i => `- **${i.sev}** [${i.cat}] ${i.msg.replace(/\|/g, '/').slice(0, 300)} _(${i.where.slice(0, 3).join(', ')})_`), ''].join('\n');
    try { writeFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n', { flag: 'a' }); } catch {}
  }
  if (!process.argv.includes('--keep')) { try { rmSync(work, { recursive: true, force: true }); } catch {} }
  process.exit(fails.length ? 1 : 0);
}
