// One list of component names everywhere: core definitions, meta, Vue and React exports, the auto-import resolver, the Vue global types and the generated d.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { components } from '../../src/core/index.js';
import { meta } from '../../src/meta/index.js';
import { isPro } from '../../src/meta/tiers.js';
import * as vue from '../../src/vue/index.js';
import * as react from '../../src/react/index.js';
import { ZiyaragoUiResolver } from '../../src/resolver.js';

const names = Object.keys(components).sort();
const rd = f => new URL('../../types/' + f, import.meta.url);

test('every free meta entry is a core component and the other way round', () => {
  assert.deepEqual(Object.keys(meta).filter(n => !isPro(n)).sort(), names);
});

test('Vue and React export Ui<Name> for every component', () => {
  assert.deepEqual(names.filter(n => !vue['Ui' + n]), []);
  assert.deepEqual(names.filter(n => !react['Ui' + n]), []);
});

test('the resolver maps every component to the Vue entry', () => {
  const r = ZiyaragoUiResolver();
  assert.deepEqual(names.filter(n => r.resolve('Ui' + n)?.name !== 'Ui' + n || r.resolve('Ui' + n)?.from !== '@ziyarago/ui/vue'), []);
  assert.equal(r.resolve('UiNotAComponent'), undefined);
});

test('generated types declare every component globally and as a typed export', { skip: !existsSync(rd('vue.d.ts')) }, () => {
  const g = readFileSync(rd('vue-global.d.ts'), 'utf8'), v = readFileSync(rd('vue.d.ts'), 'utf8'), r = readFileSync(rd('react.d.ts'), 'utf8');
  assert.deepEqual(names.filter(n => !g.includes(`Ui${n}: typeof Ui.Ui${n};`)), []);
  assert.deepEqual(names.filter(n => !v.includes(`export const Ui${n}: UiVueComponent<Ui${n}Props, Ui${n}Slots>;`)), []);
  assert.deepEqual(names.filter(n => !r.includes(`export const Ui${n}: ComponentType<Ui${n}Props>;`)), []);
});
