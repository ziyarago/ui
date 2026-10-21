import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createSSRApp, h } from 'vue';
import { renderToString as vueRender } from 'vue/server-renderer';
import { createElement } from 'react';
import { renderToString as reactRender } from 'react-dom/server';
import * as vue from '../fixtures/fake-pro/vue.js';
import * as react from '../fixtures/fake-pro/react.js';
import { defineUiComponents } from '../../src/vue/index.js';
import { defineUiComponents as reactDefine } from '../../src/react/index.js';

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
});
