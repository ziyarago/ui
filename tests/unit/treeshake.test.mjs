// The adapters must be tree-shakeable: importing a few components bundles those components, their dependencies and their own
// strings, nothing else. esbuild is the strictest of the common bundlers about side effects, so this is the lower bound.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { NAMES } from '../../src/core/names.js';
import { components } from '../../src/core/index.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bundle = async code => {
  const r = await build({ stdin: { contents: code, resolveDir: root, loader: 'js' }, bundle: true, write: false, format: 'esm', minify: true, platform: 'browser', external: ['vue', 'react', 'react-dom', 'react-dom/*', 'react/*'], logLevel: 'silent' });
  return r.outputFiles[0].text;
};
const gz = s => gzipSync(s).length;
const EIGHT = ['Button', 'CopyButton', 'Pagination', 'Alert', 'Select', 'DataTable', 'EmptyState', 'SearchInput'];
// strings that only unrelated components contain: class names and built-in messages
const FOREIGN = ['zg-cal__d', 'Previous month', 'zg-sheet', 'zg-heading', 'zg-press', 'zg-chip2', 'zg-foot', 'RichEditor', 'zg-menu__sep'];
const sizes = {};

for (const fw of ['vue', 'react']) {
  const entry = names => `export { ${names.map(n => 'Ui' + n).join(', ')} } from './src/${fw}/index.js';`;
  test(`${fw}: one component does not pull in the others`, async () => {
    const js = await bundle(entry(['Button']));
    sizes[fw + ' Button'] = gz(js);
    assert.ok(js.includes('zg-btn'), 'the Button itself is bundled');
    assert.deepEqual(FOREIGN.filter(s => js.includes(s)), [], 'strings of unrelated components in the Button bundle');
  });
  test(`${fw}: a handful of components stays far below the whole kit`, async () => {
    const small = await bundle(entry(EIGHT));
    const all = await bundle(`import * as ns from './src/${fw}/index.js'; console.log(ns);`);
    sizes[fw + ' 8 components'] = gz(small); sizes[fw + ' all'] = gz(all);
    assert.ok(gz(small) < gz(all) * 0.45, `${fw}: 8 components ${gz(small)} B gzip vs all ${gz(all)} B`);
  });
  test(`${fw}: i18n strings follow the components`, async () => {
    const js = await bundle(entry(['Pagination']));
    assert.ok(js.includes('Previous') || js.includes('Prev'), 'Pagination strings are bundled with it');
    assert.ok(!js.includes('Previous month'), 'Calendar strings are not');
  });
}

test('names.js lists exactly the built-in components', () => {
  assert.deepEqual([...NAMES].sort(), Object.keys(components).sort());
  assert.equal(NAMES.length, 102);
});

test('install(app) still registers every component globally (Vue)', async () => {
  const vue = await import('../../src/vue/index.js');
  const reg = {};
  vue.default.install({ component: (n, c) => { reg[n] = c; } });
  assert.deepEqual(Object.keys(reg).sort(), NAMES.map(n => 'Ui' + n).sort());
  assert.equal(reg.UiButton, vue.UiButton);
});

test('sizes (gzip, kit only, vue/react external)', () => { console.log(JSON.stringify(sizes)); });
