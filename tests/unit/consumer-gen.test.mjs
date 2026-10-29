import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { meta } from '../../src/meta/index.js';
import { isPro } from '../../src/meta/tiers.js';
import { genVue, genReact, genGlobal, modelOf, eventsOf } from '../../scripts/consumer-gen.mjs';

const sample = {
  description: 'x',
  props: {
    items: { type: '{ value: string; label: string }[]', required: true },
    label: { type: 'string' },
    disabled: { type: 'boolean' },
    iconRight: { type: 'string' },
    modelValue: { type: 'string | number | null', model: true },
    onClose: { type: '() => void' },
  },
  slots: { default: 'x', footer: 'y' },
  events: { change: 'c', rowClick: 'r', blur: 'b' },
};

test('genVue covers required props, null/undefined, shorthand, kebab, events, slots, v-model and refs', () => {
  const s = genVue('Foo', sample, '@x/ui');
  assert.match(s, /from '@x\/ui\/vue'/);
  assert.match(s, /const req = \{ items: all\.items \}/);
  assert.match(s, /:label="nul" :disabled="nul" :iconRight="nul"/);
  assert.match(s, /:label="und"/);
  assert.match(s, / disabled \/>/);
  assert.match(s, /:icon-right="all\.iconRight"/);
  assert.match(s, /@row-click="\(\) => \{\}"/);
  assert.match(s, /:on-change="\(\) => \{\}"/);
  assert.match(s, /@blur="\(e: FocusEvent\) => e\.type"/);
  assert.match(s, /<template #footer>/);
  assert.match(s, /v-model\.number="n2"/);
  assert.match(s, /v-model\.trim="s2"/);
  assert.match(s, /ref="el"/);
  assert.doesNotMatch(s, /:onClose=/);
});

test('genReact controlled value with null state and null optional props', () => {
  const s = genReact('Foo', sample, '@x/ui');
  assert.match(s, /from '@x\/ui\/react'/);
  assert.match(s, /label: null, disabled: null, iconRight: null/);
  assert.match(s, /useState<NonNullable<UiFooProps\['modelValue'\]> \| null>\(null\)/);
  assert.match(s, /onChange=\{setV2\}/);
});

test('modelOf / eventsOf / genGlobal', () => {
  assert.deepEqual(modelOf(sample), { name: 'modelValue', type: 'string | number | null' });
  assert.deepEqual(eventsOf(sample).sort(), ['blur', 'change', 'close', 'rowClick']);
  assert.match(genGlobal(['A', 'B']), /<UiB v-bind="pB" \/>/);
});

test('every free component yields a file for both frameworks without a bare "undefined" prop', () => {
  for (const n of Object.keys(meta).filter(n => !isPro(n))) {
    for (const s of [genVue(n, meta[n]), genReact(n, meta[n])]) assert.ok(s.length > 100 && !/\bundefined\.\w/.test(s), n);
  }
});

test('generated types: optional props accept null, handlers are bivariant methods, update handler is open', { skip: !existsSync(new URL('../../types/vue.d.ts', import.meta.url)) }, () => {
  const v = readFileSync(new URL('../../types/vue.d.ts', import.meta.url), 'utf8');
  const r = readFileSync(new URL('../../types/react.d.ts', import.meta.url), 'utf8');
  const btn = v.slice(v.indexOf('export interface UiButtonProps'), v.indexOf('export interface UiButtonSlots'));
  assert.match(btn, /\n {2}label\?: string \| null \| undefined;|\n {2}icon\?: string \| null \| undefined;/);
  assert.match(btn, /onClick\?\(event: MouseEvent\): void;/);
  assert.doesNotMatch(btn, /: \(.*\) => void;/);
  assert.match(v, /'onUpdate:modelValue'\?\(value: any\): void;/);
  assert.match(r, /onChange\?\(value: /);
});
