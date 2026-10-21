#!/usr/bin/env node
// Type-level tests: each project under tests/types/* is checked with vue-tsc (vue*) or tsc (react*).
// ok.* files must compile cleanly; fail-*.* files must produce an error that contains the text after "@expect:" in the file.
// Run: npm run test:types   (needs the generated types: npm run types)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = join(root, 'tests/types');
const bin = n => join(root, 'node_modules/.bin', n);
const isFile = p => { try { return statSync(p).isFile(); } catch { return false; } };
let failed = 0, passed = 0;
const bad = m => { failed++; console.error('  FAIL ' + m); };

for (const dir of readdirSync(base).filter(d => statSync(join(base, d)).isDirectory()).sort()) {
  const cwd = join(base, dir);
  const r = spawnSync(bin(dir.startsWith('vue') ? 'vue-tsc' : 'tsc'), ['-p', 'tsconfig.json', '--pretty', 'false'], { cwd, encoding: 'utf8' });
  if (r.error) { console.error(r.error.message); process.exit(2); }
  const errors = new Map();
  let cur = null;
  for (const line of (r.stdout + r.stderr).split('\n')) {
    const m = /^(\S+?)\((\d+),(\d+)\): error /.exec(line);
    if (m) { cur = m[1]; errors.set(cur, (errors.get(cur) || '') + '\n' + line); }
    else if (cur && /^\s/.test(line)) errors.set(cur, errors.get(cur) + '\n' + line);
    else if (line.trim()) { cur = null; errors.set('*', (errors.get('*') || '') + '\n' + line); }
  }
  console.log(`[${dir}]`);
  for (const f of readdirSync(cwd).filter(f => /\.(vue|tsx?)$/.test(f) && !f.endsWith('.d.ts')).sort()) {
    const text = errors.get(f) || '';
    if (f.startsWith('fail-')) {
      const want = /@expect:\s*(.+?)\s*(?:-->|\*\/)?\s*$/m.exec(readFileSync(join(cwd, f), 'utf8'))?.[1];
      if (!text) bad(`${f}: expected a type error, got none`);
      else if (want && !text.includes(want)) bad(`${f}: error does not mention ${want}\n${text}`);
      else { passed++; console.log('  ok   ' + f + '  (rejected as expected)'); }
    } else if (text) bad(`${f}: unexpected errors${text}`);
    else { passed++; console.log('  ok   ' + f); }
  }
  for (const [f, t] of errors) if (f !== '*' && !isFile(join(cwd, f))) bad(`${f}: errors outside fixtures${t}`);
  if (errors.has('*')) bad('tool output' + errors.get('*'));
}
console.log(failed ? `\n${failed} failed, ${passed} passed` : `\n${passed} fixtures OK`);
process.exit(failed ? 1 : 0);
