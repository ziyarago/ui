// Server rendering helpers shared by the SSR test and the hydration pass of the browser run.
import { createSSRApp } from 'vue';
import { renderToString as vueRender } from 'vue/server-renderer';
import { createElement } from 'react';
import { renderToString as reactRender } from 'react-dom/server';
import { Preview as VuePreview } from './preview-vue.js';
import { Preview as ReactPreview } from './preview-react.js';

export async function ssrVue(name, variant, open = false) {
  const warnings = [];
  const app = createSSRApp(VuePreview, { name, variant, open });
  app.config.warnHandler = (msg) => warnings.push(msg);
  const errors = [];
  app.config.errorHandler = (e) => errors.push(e);
  const ctx = {};
  const html = await vueRender(app, ctx);
  if (errors.length) throw errors[0];
  return { html, warnings, teleports: ctx.teleports || {} };
}

/** React logs problems through console.error; capture them for the duration of the render. */
export function ssrReact(name, variant, open = false) {
  const warnings = [];
  const orig = console.error;
  console.error = (...a) => warnings.push(a.map(String).join(' '));
  try {
    const html = reactRender(createElement(ReactPreview, { name, variant, open }));
    return { html, warnings };
  } finally { console.error = orig; }
}
