#!/usr/bin/env node
// Inspects the packed tarballs the way a customer receives them.
// usage: node tests/bundle/check-tarball.mjs <ziyarago-ui-x.y.z.tgz> [--pro <ziyarago-ui-pro-x.y.z.tgz>] [--json out.json]
import { statSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { extract, walk, readJson } from './lib/tarball.mjs';

const args = process.argv.slice(2);
const val = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const freeTgz = args.find(a => a.endsWith('.tgz') && args[args.indexOf(a) - 1] !== '--pro');
const proTgz = val('--pro');
const issues = [];
const add = (sev, cat, msg) => issues.push({ sev, cat, msg });

const FORBIDDEN = /^(tests|site|docs-private|pro-private|assets-private|packages|scripts|\.github|releases|node_modules)\/|(^|\/)\.env|\.(glb|gltf|usdz|hdr|exr|fbx|obj|blend|mp4|mov|psd|fig)$/i;
const REQUIRED_FREE = ['README.md', 'LICENSE', 'CHANGELOG.md', 'THIRD_PARTY_NOTICES.md', 'dist/style.css', 'dist/tokens.css', 'dist/manifest.json', 'dist/llms.txt', 'dist/llms-full.txt', 'docs/INTEGRATION.md', 'tokens/tokens.json', 'src/core/index.js', 'src/vue/index.js', 'src/react/index.js', 'src/nuxt/module.mjs', 'src/icons/builtin.js', 'src/i18n/components/index.js'];

const targets = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') for (const x of Object.values(v)) targets(x, out); return out; };
const globToRe = g => new RegExp('^' + g.replace(/^\.\//, '').replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*\//g, '(?:.*/)?').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*') + '$');

function checkPackage(label, dir, files, pkg) {
  const set = new Set(files.map(f => f.path));
  const where = `[${label}]`;
  for (const f of files) {
    if (FORBIDDEN.test(f.path)) add('fail', 'tarball', `${where} forbidden file shipped: ${f.path}`);
    if (/\.map$/.test(f.path)) add('warn', 'tarball', `${where} source map shipped: ${f.path}`);
    if (f.size > 1.5 * 1024 * 1024) add('warn', 'tarball', `${where} large file ${f.path} ${(f.size / 1048576).toFixed(1)} MB`);
  }
  // exports
  for (const [key, v] of Object.entries(pkg.exports || {})) {
    for (const t of targets(v)) {
      const rel = t.replace(/^\.\//, '');
      if (rel.includes('*')) { const re = new RegExp('^' + rel.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'); if (![...set].some(p => re.test(p))) add('fail', 'exports', `${where} exports["${key}"] -> ${t}: no file matches`); continue; }
      if (!set.has(rel)) add('fail', 'exports', `${where} exports["${key}"] -> ${t} is not in the tarball`);
    }
  }
  for (const k of ['main', 'module', 'types']) if (pkg[k] && !set.has(pkg[k].replace(/^\.\//, ''))) add('fail', 'exports', `${where} "${k}" -> ${pkg[k]} missing`);
  for (const [sub, list] of Object.entries(pkg.typesVersions?.['*'] || {})) for (const t of list) if (!set.has(t.replace(/^\.\//, ''))) add('fail', 'exports', `${where} typesVersions["${sub}"] -> ${t} missing`);
  // the types a customer imports: every exports key that has a "types" condition resolves and each d.ts only refers to shipped relative files
  for (const f of files.filter(f => f.path.endsWith('.d.ts'))) {
    const src = readFileSync(join(dir, f.path), 'utf8');
    for (const m of src.matchAll(/(?:from|import)\s+['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const base = f.path.split('/').slice(0, -1);
      for (const seg of m[1].split('/')) { if (seg === '..') base.pop(); else if (seg !== '.') base.push(seg); }
      const p = base.join('/');
      if (![p, p + '.d.ts', p + '.ts', p + '/index.d.ts', p.replace(/\.js$/, '.d.ts'), p + '.js', p + '.mjs'].some(x => set.has(x))) add('fail', 'types', `${where} ${f.path} imports ${m[1]} which is not shipped`);
    }
  }
  // sideEffects
  const se = pkg.sideEffects;
  if (!Array.isArray(se)) add('warn', 'sideEffects', `${where} sideEffects is ${JSON.stringify(se)} (an explicit allowlist is expected)`);
  else {
    if (!se.some(s => /\*\.css/.test(s))) add('fail', 'sideEffects', `${where} sideEffects does not list css`);
    const res = se.map(s => [s, globToRe(s)]);
    for (const [s, re] of res) if (![...set].some(p => re.test(p))) add('fail', 'sideEffects', `${where} sideEffects entry ${s} matches no file`);
    const listed = p => res.some(([, re]) => re.test(p));
    for (const f of files.filter(f => /^src\/.*\.(js|mjs)$/.test(f.path) && !listed(f.path))) {
      const src = readFileSync(join(dir, f.path), 'utf8');
      const m = /^(defineMessages|registerComponents|registerMeta)\(/m.exec(src);
      if (m) add('fail', 'sideEffects', `${where} ${f.path} calls ${m[1]}() at top level but is not in sideEffects (a bundler may drop it)`);
    }
  }
  // peers
  for (const [k, v] of Object.entries(pkg.peerDependencies || {})) if (!/^[\^~>=<0-9 .xX|*-]+$/.test(v)) add('fail', 'peers', `${where} peerDependencies["${k}"] = "${v}" is not a semver range`);
  if (!pkg.license) add('warn', 'tarball', `${where} no license field`);
  return set;
}

const ver = v => v.split('.').map(Number);
const cmp = (a, b) => { for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };

const info = {};
if (!freeTgz) { console.error('usage: check-tarball.mjs <ui.tgz> [--pro <ui-pro.tgz>]'); process.exit(2); }
const dir = extract(freeTgz);
const files = walk(dir);
const pkg = readJson(join(dir, 'package.json'));
info.free = { name: pkg.name, version: pkg.version, files: files.length, bytes: files.reduce((a, f) => a + f.size, 0), tgzBytes: statSync(freeTgz).size, top: files.sort((a, b) => b.size - a.size).slice(0, 8).map(f => `${f.path} ${f.size}`) };
const set = checkPackage('ui', dir, files, pkg);
for (const r of REQUIRED_FREE) if (!set.has(r)) add('fail', 'tarball', `[ui] required file missing: ${r}`);
const proFiles = files.filter(f => /(^|[/.])pro[./-]/i.test(f.path) && !/^(docs|CHANGELOG|README)/i.test(f.path));
for (const f of proFiles) add('warn', 'free-only', `[ui] file name mentions pro: ${f.path}`);
// the assets/* export: which paths can a customer actually reach?
const assetsShipped = [...set].filter(p => p.startsWith('assets/'));
const assetTop = new Set(assetsShipped.map(p => p.split('/')[1]));
info.free.assetDirs = [...assetTop];
// free-only: import the shipped core
let freeNames = [];
try {
  const core = await import(pathToFileURL(join(dir, 'src/core/index.js')).href);
  const tiers = await import(pathToFileURL(join(dir, 'src/meta/tiers.js')).href);
  freeNames = Object.keys(core.components);
  for (const n of freeNames) if (tiers.isPro(n)) add('fail', 'free-only', `[ui] Pro component ${n} is registered in the free core`);
  info.free.components = freeNames.length;
  if (freeNames.length !== 102) add('warn', 'free-only', `[ui] ${freeNames.length} free components (expected 102)`);
  const manifest = readJson(join(dir, 'dist/manifest.json'));
  const list = manifest.components || manifest;
  const arr = Array.isArray(list) ? list : Object.values(list);
  const proImpl = arr.filter(c => c && c.tier === 'pro' && c.implemented === true).map(c => c.name);
  if (proImpl.length) add('fail', 'free-only', `[ui] manifest marks Pro components implemented: ${proImpl.slice(0, 5).join(', ')}`);
} catch (e) { add('fail', 'free-only', `[ui] cannot import the shipped core in Node: ${String(e && e.message || e).split('\n')[0]}`); }
// built-in icons vs names referenced by components
try {
  const icons = (await import(pathToFileURL(join(dir, 'src/icons/builtin.js')).href)).default;
  info.free.icons = Object.keys(icons).length;
} catch (e) { add('fail', 'tarball', `[ui] cannot import src/icons/builtin.js: ${e.message}`); }

if (proTgz) {
  const pdir = extract(proTgz);
  const pfiles = walk(pdir);
  const ppkg = readJson(join(pdir, 'package.json'));
  info.pro = { name: ppkg.name, version: ppkg.version, files: pfiles.length, bytes: pfiles.reduce((a, f) => a + f.size, 0), tgzBytes: statSync(proTgz).size };
  checkPackage('ui-pro', pdir, pfiles, ppkg);
  const range = ppkg.peerDependencies?.['@ziyarago/ui'];
  const m = /^>=\s*(\d+\.\d+\.\d+)\s*<\s*(\d+\.\d+\.\d+)$/.exec(range || '');
  if (!m) add('fail', 'peers', `[ui-pro] peerDependencies["@ziyarago/ui"] = "${range}" (expected ">=x.y.z <x.(y+1).0")`);
  else if (cmp(ver(pkg.version), ver(m[1])) < 0 || cmp(ver(pkg.version), ver(m[2])) >= 0) add('fail', 'peers', `[ui-pro] peer range "${range}" does not accept the free package ${pkg.version}`);
  try {
    const names = readJson(join(pdir, 'src/names.json'));
    info.pro.names = names.length;
    const clash = names.filter(n => freeNames.includes(n));
    if (clash.length) add('fail', 'peers', `[ui-pro] names also registered by the free package: ${clash.join(', ')}`);
    const vueSrc = readFileSync(join(pdir, 'src/vue/index.js'), 'utf8');
    const reactSrc = readFileSync(join(pdir, 'src/react/index.js'), 'utf8');
    for (const n of names) {
      if (!new RegExp(`\\bUi${n}\\b`).test(vueSrc)) add('fail', 'exports', `[ui-pro] src/vue/index.js does not export Ui${n}`);
      if (!new RegExp(`\\bUi${n}\\b`).test(reactSrc)) add('fail', 'exports', `[ui-pro] src/react/index.js does not export Ui${n}`);
    }
    if (names.length !== 110) add('warn', 'tarball', `[ui-pro] ${names.length} names (expected 110)`);
  } catch (e) { add('fail', 'tarball', `[ui-pro] names.json: ${e.message}`); }
}

console.log(JSON.stringify(info, null, 2));
for (const i of issues) console.log(`${i.sev.toUpperCase().padEnd(5)} [${i.cat}] ${i.msg}`);
const fails = issues.filter(i => i.sev === 'fail').length;
console.log(`\ntarball check: ${fails} failures, ${issues.length - fails} warnings`);
const out = val('--json');
if (out) writeFileSync(out, JSON.stringify({ info, issues }, null, 2));
process.exit(fails ? 1 : 0);
