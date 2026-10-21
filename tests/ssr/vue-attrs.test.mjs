import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { UiFilterChips } from '../../src/vue/index.js';

const items = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
const on = async attrs => (await renderToString(createSSRApp({ render: () => h(UiFilterChips, { items, ...attrs }) }))).match(/aria-pressed="true"|aria-checked="true"/g)?.length ?? 0;

test('kebab-case :model-value behaves like modelValue', async () => {
  const camel = await on({ modelValue: 'b' });
  assert.ok(camel > 0, 'the selected chip is marked');
  assert.equal(await on({ 'model-value': 'b' }), camel);
});
