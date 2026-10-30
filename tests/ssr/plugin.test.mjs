import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createSSRApp, h } from 'vue';
import { renderToString as vueRender } from 'vue/server-renderer';
import { createElement } from 'react';
import { renderToString as reactRender } from 'react-dom/server';
import * as vue from '../fixtures/fake-pro/vue.js';
import * as react from '../fixtures/fake-pro/react.js';
import { defineUiComponents, defineUiComponent } from '../../src/vue/index.js';
import { defineUiComponents as reactDefine, defineUiComponent as reactDefineOne } from '../../src/react/index.js';
import { ButtonDef, BadgeDef, pageDefinition } from '../../src/internal.js';

const Tagged = { deps: () => ({ Button: ButtonDef, Badge: BadgeDef }), render: ({ C, h, props }) => h('div', { class: 'tagged' }, h(C.Button, null, props.label ?? 'go'), h(C.Badge, null, 'b')) };

describe('plugin components render through both adapters', () => {
  test('Vue SSR: own markup and C.Button cross reference', async () => {
    const html = await vueRender(createSSRApp({ render: () => h(vue.UiFakeAction, { label: 'Pay' }) }));
    assert.match(html, /fake-action/);
    assert.match(html, /<button/);
    assert.match(html, /Pay/);
    assert.match(html, /fake-badge[^>]*>inner/);
  });
  test('React SSR: own markup and C.Button cross reference', () => {
    const html = reactRender(createElement(react.UiFakeAction, { label: 'Pay' }));
    assert.match(html, /fake-action/);
    assert.match(html, /<button/);
    assert.match(html, /Pay/);
    assert.match(html, /fake-badge[^>]*>inner/);
  });
  test('clash with a different definition throws in both adapters', () => {
    assert.throws(() => defineUiComponents({ Button: { render: () => null } }), /already registered/);
    assert.throws(() => reactDefine({ Button: { render: () => null } }), /already registered/);
  });
  test('defineUiComponent wraps one definition on demand (deps from the built-in definitions, no registration)', async () => {
    const V = defineUiComponent('Tagged', Tagged), R = reactDefineOne('Tagged', Tagged);
    assert.equal(defineUiComponent('Tagged', Tagged), V);
    const v = await vueRender(createSSRApp({ render: () => h(V, { label: 'Pay' }) }));
    const r = reactRender(createElement(R, { label: 'Pay' }));
    for (const html of [v, r]) { assert.match(html, /class="tagged"/); assert.match(html, /<button/); assert.match(html, /Pay/); }
  });
  test('page definitions of an add-on render like the built-in pages', async () => {
    const P = defineUiComponent('PageFake', pageDefinition(['header', 'body'], ['col', 'header', 'body']));
    const html = await vueRender(createSSRApp({ render: () => h(P, { title: 'Hello' }, { body: () => 'content' }) }));
    assert.match(html, /Hello/);
    assert.match(html, /content/);
  });
});
