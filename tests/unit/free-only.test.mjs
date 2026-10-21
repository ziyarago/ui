// The public package must contain only free components. Pro names are documented (tier "pro") and have no implementation here.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { components } from '../../src/core/index.js';
import { PRO_NAMES, isPro } from '../../src/meta/tiers.js';
import { meta } from '../../src/meta/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = p => readFileSync(join(root, p), 'utf8');
const pro = [...PRO_NAMES];

describe('free-only package', () => {
  test('tiers: 110 Pro names, 102 free components, 6 free page templates', () => {
    assert.equal(pro.length, 110);
    assert.equal(Object.keys(components).length, 102);
    assert.equal(Object.keys(components).filter(n => /^Page[A-Z]/.test(n) && n !== 'PageHeader').length, 6);
  });

  test('no Pro name in Object.keys(components)', () => {
    assert.deepEqual(Object.keys(components).filter(isPro), []);
  });

  test('Pro names stay documented in the meta', () => {
    assert.deepEqual(pro.filter(n => !meta[n]?.description), []);
  });

  test('no Pro definition source in src/core', () => {
    for (const f of readdirSync(join(root, 'src/core')).filter(f => f.endsWith('.js'))) {
      const s = read('src/core/' + f);
      for (const n of pro) {
        assert.ok(!new RegExp(`^  ${n}: \\{`, 'm').test(s), `${f} defines ${n}`);
        assert.ok(!new RegExp(`page\\('${n}'`).test(s), `${f} defines page ${n}`);
      }
    }
  });

  test('adapters export free components only', () => {
    for (const fw of ['vue', 'react']) {
      const s = read(`src/${fw}/index.js`);
      for (const n of pro) assert.ok(!new RegExp(`\\bUi${n}\\b`).test(s), `${fw} adapter mentions Ui${n}`);
    }
  });

  test('dist/manifest.json lists Pro names as tier pro without implementation', { skip: !existsSync(join(root, 'dist/manifest.json')) && 'run npm run build first' }, () => {
    const m = JSON.parse(read('dist/manifest.json'));
    const byName = Object.fromEntries(m.components.map(c => [c.name, c]));
    for (const n of pro) { assert.equal(byName[n]?.tier, 'pro', n); assert.equal(byName[n].implemented, false, n); }
    for (const c of m.components) if (c.tier === 'free') assert.equal(c.implemented, true, c.name);
    assert.equal(m.components.filter(c => c.implemented).length, 102);
    assert.equal(m.components.filter(c => c.tier === 'pro').length, 110);
  });

  test('generated types have no Pro component', { skip: !existsSync(join(root, 'types/vue.d.ts')) && 'run npm run build first' }, () => {
    for (const f of ['vue.d.ts', 'react.d.ts', 'vue-global.d.ts']) {
      const s = read('types/' + f);
      for (const n of pro) assert.ok(!new RegExp(`\\bUi${n}(Props|Slots)?\\b`).test(s), `types/${f} has Ui${n}`);
    }
  });

  test('i18n: no Pro component strings in src/i18n/components', () => {
    const files = readdirSync(join(root, 'src/i18n/components')).filter(f => /^[A-Z]/.test(f)).map(f => f.replace(/\.js$/, ''));
    assert.deepEqual(files.filter(isPro), []);
  });

  test('npm pack lists no Pro definition files and no compat files', () => {
    const out = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
    const files = out[0].files.map(f => f.path);
    assert.ok(files.includes('src/internal.js') && files.includes('src/core/components.js'));
    assert.deepEqual(files.filter(f => /compat|MIGRATION/i.test(f)), []);
    assert.deepEqual(files.filter(f => /\.pro\.js$|pro-private|assets-private|docs-private/.test(f)), []);
    assert.deepEqual(files.filter(f => /^src\/i18n\/components\//.test(f) && isPro(f.split('/').pop().replace(/\.js$/, ''))), []);
    // every packed core source is free-only
    for (const f of files.filter(f => /^src\/core\/.*\.js$/.test(f))) {
      const s = read(f);
      for (const n of pro) assert.ok(!new RegExp(`^  ${n}: \\{|page\\('${n}'`, 'm').test(s), `${f} defines ${n}`);
    }
  });
});
