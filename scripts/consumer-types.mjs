#!/usr/bin/env node
// Consumer type-check project (CI job `consumer-types`, see .github/workflows/ci.yml).
//   node scripts/consumer-types.mjs generate --out <dir> [--pkg @ziyarago/ui] [--names free | <names.json>] [--global false] [--dep <name>=<tarball>...]
//   node scripts/consumer-types.mjs check <vue-tsc.log> [<tsc.log>] [--allow tests/consumer/allow.txt]
// generate writes a Vue 3.5 + vue-tsc (strictTemplates) project and a React + tsc (strict) project, one generated file per component (scripts/consumer-gen.mjs).
// The workflow then installs the packed package(s) into <dir>, runs `vue-tsc --noEmit -p tsconfig.vue.json` and `tsc -p tsconfig.react.json`, and calls `check` on the logs.
// check groups the errors per file, subtracts tests/consumer/allow.txt ("GenName.vue: text that must appear in the error", every line needs a reason after " # ") and fails on the rest.
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { genVue, genReact, genGlobal } from './consumer-gen.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const mode = argv[0];
const opt = (n, d) => { const i = argv.indexOf('--' + n); return i < 0 ? d : argv[i + 1]; };
const list = n => { const out = []; argv.forEach((a, i) => { if (a === '--' + n) out.push(argv[i + 1]); }); return out; };

if (mode === 'generate') {
  const out = resolve(opt('out', 'consumer-types-project'));
  const pkg = opt('pkg', '@ziyarago/ui');
  const namesArg = opt('names', 'free');
  const { meta } = await import(join(root, 'src/meta/index.js'));
  const { isPro } = await import(join(root, 'src/meta/tiers.js'));
  const names = (namesArg === 'free' ? Object.keys(meta).filter(n => !isPro(n)) : JSON.parse(readFileSync(namesArg, 'utf8'))).filter(n => meta[n]).sort();
  rmSync(out, { recursive: true, force: true });
  mkdirSync(join(out, 'src/vue'), { recursive: true });
  mkdirSync(join(out, 'src/react'), { recursive: true });
  for (const n of names) {
    writeFileSync(join(out, `src/vue/Gen${n}.vue`), genVue(n, meta[n], pkg));
    writeFileSync(join(out, `src/react/Gen${n}.tsx`), genReact(n, meta[n], pkg));
  }
  // global registration types exist for the free package only (Pro components resolve through the resolver / Nuxt module)
  if (opt('global', 'true') !== 'false') {
    writeFileSync(join(out, 'src/vue/GenGlobal.vue'), genGlobal(names, pkg));
    writeFileSync(join(out, 'src/vue/env.d.ts'), `/// <reference types="${pkg}/vue/global" />\nexport {};\n`);
  }
  const deps = { vue: '^3.5.0', react: '^18.3.0', 'react-dom': '^18.3.0', '@types/react': '^18.3.0', typescript: '~5.8.0', 'vue-tsc': '^3.0.0' };
  for (const d of list('dep')) { const i = d.indexOf('='); deps[d.slice(0, i)] = 'file:' + resolve(d.slice(i + 1)); }
  writeFileSync(join(out, 'package.json'), JSON.stringify({ name: 'consumer-types', private: true, type: 'module', dependencies: deps }, null, 2));
  const base = { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, noEmit: true, skipLibCheck: false, lib: ['ES2022', 'DOM', 'DOM.Iterable'], types: [], forceConsistentCasingInFileNames: true };
  writeFileSync(join(out, 'tsconfig.vue.json'), JSON.stringify({ compilerOptions: base, include: ['src/vue/*.vue', 'src/vue/*.ts'], vueCompilerOptions: { strictTemplates: true } }, null, 2));
  writeFileSync(join(out, 'tsconfig.react.json'), JSON.stringify({ compilerOptions: { ...base, jsx: 'react-jsx', types: ['react'] }, include: ['src/react/*.tsx'] }, null, 2));
  console.log(`${names.length} components, ${pkg}, project in ${out}`);
} else if (mode === 'check') {
  const logs = argv.slice(1).filter(a => !a.startsWith('--') && a !== opt('allow'));
  const allowFile = resolve(opt('allow', join(root, 'tests/consumer/allow.txt')));
  const allow = existsSync(allowFile) ? readFileSync(allowFile, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')) : [];
  const rules = allow.map(l => { const m = /^(\S+?):\s*(.+?)\s+#\s+\S/.exec(l); if (!m) throw new Error('allow.txt: every line needs "File: text # reason": ' + l); return { file: m[1], text: m[2], used: 0 }; });
  const errors = [];
  for (const log of logs) {
    let cur = null;
    for (const line of readFileSync(log, 'utf8').split('\n')) {
      const m = /^(\S+?)\((\d+),(\d+)\): error (.*)$/.exec(line);
      if (m) { cur = { file: basename(m[1]), line: +m[2], text: m[4], more: [] }; errors.push(cur); }
      else if (cur && /^\s/.test(line)) cur.more.push(line.trim());
      else if (line.trim()) { cur = null; if (/error/i.test(line)) errors.push({ file: '*', line: 0, text: line.trim(), more: [] }); }
    }
  }
  const bad = [];
  for (const e of errors) {
    const full = e.text + ' ' + e.more.join(' ');
    const r = rules.find(x => x.file === e.file && full.includes(x.text));
    if (r) r.used++; else bad.push(e);
  }
  const by = new Map();
  for (const e of bad) (by.get(e.file) || by.set(e.file, []).get(e.file)).push(e);
  for (const [f, es] of [...by].sort()) {
    console.log(`\n${f}: ${es.length}`);
    for (const e of es) console.log(`  :${e.line} ${e.text}${e.more.length ? '\n      ' + e.more.slice(0, 3).join('\n      ') : ''}`);
  }
  for (const r of rules) if (!r.used) console.log(`\nstale allow entry (nothing matched): ${r.file}: ${r.text}`);
  console.log(`\n${errors.length} errors, ${errors.length - bad.length} allowed, ${bad.length} to fix, ${by.size} files`);
  process.exit(bad.length || rules.some(r => !r.used) ? 1 : 0);
} else {
  console.error('usage: consumer-types.mjs generate|check ...');
  process.exit(2);
}
