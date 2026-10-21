// Shared by run.mjs and interactions.mjs: generated data, Vite dev servers, Chrome, request stubbing.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadExamples } from '../lib/examples.mjs';
import { ssrVue, ssrReact } from '../lib/ssr.mjs';

const require = createRequire(import.meta.url);
export const GEN = join(ROOT, 'tests/apps/.generated');
export const FRAMEWORKS = ['vue', 'react'];

export const chromePath = () => {
  const c = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);
  const p = c.find(existsSync);
  if (!p) throw new Error('Chrome not found; set CHROME_PATH');
  return p;
};

/** examples.json (the docs data, converted once from the .ts sources) + server-rendered HTML for the hydration pass. */
export async function generate({ ssr = true } = {}) {
  mkdirSync(GEN, { recursive: true });
  const examples = await loadExamples();
  const json = examples.map(({ file, ...e }) => e);
  writeFileSync(join(GEN, 'examples.json'), JSON.stringify(json));
  if (ssr) {
    const out = { vue: {}, react: {} };
    for (const e of json) {
      out.vue[e.name] = []; out.react[e.name] = [];
      for (const v of e.variants) {
        const r = await ssrVue(e.name, v);
        out.vue[e.name].push(r.teleports.body ? { html: r.html, tp: r.teleports.body } : r.html);
        out.react[e.name].push(ssrReact(e.name, v).html);
      }
    }
    writeFileSync(join(GEN, 'ssr-vue.json'), JSON.stringify(out.vue));
    writeFileSync(join(GEN, 'ssr-react.json'), JSON.stringify(out.react));
  }
  return json;
}

export async function startServers(frameworks = FRAMEWORKS) {
  const { createServer } = await import('vite');
  const servers = {};
  for (const fw of frameworks) {
    const s = await createServer({ configFile: join(ROOT, `tests/apps/${fw}/vite.config.mjs`), server: { port: 0, host: '127.0.0.1', strictPort: false }, clearScreen: false });
    await s.listen();
    servers[fw] = { server: s, url: `http://127.0.0.1:${s.httpServer.address().port}` };
  }
  return servers;
}

/** Production bundles (minified, no dev warnings) served by `vite preview`. */
export async function startProd(frameworks = FRAMEWORKS) {
  const { build, preview } = await import('vite');
  const out = {};
  for (const fw of frameworks) {
    const configFile = join(ROOT, `tests/apps/${fw}/vite.config.mjs`);
    await build({ configFile, logLevel: 'error' });
    const server = await preview({ configFile, preview: { port: 0, host: '127.0.0.1' } });
    const addr = server.httpServer.address();
    out[fw] = { server: { close: () => new Promise(r => server.httpServer.close(r)) }, url: `http://127.0.0.1:${addr.port}` };
  }
  return out;
}

export async function launch() {
  const puppeteer = require('puppeteer-core');
  return puppeteer.launch({
    executablePath: chromePath(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--force-prefers-reduced-motion=0'],
  });
}

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>';

/** The browser never leaves localhost: icons, fonts and remote images are stubbed so runs are offline-safe and deterministic. */
export async function stubExternal(page, log = []) {
  await page.setRequestInterception(true);
  page.on('request', req => {
    const u = req.url();
    if (/^(http:\/\/(127\.0\.0\.1|localhost)|data:|blob:|about:)/.test(u)) return req.continue();
    const type = req.resourceType();
    const cors = { 'access-control-allow-origin': '*' };
    if (/\.svg(\?|$)/.test(u) || /lucide/.test(u)) return req.respond({ status: 200, contentType: 'image/svg+xml', headers: cors, body: SVG });
    if (type === 'image') return req.respond({ status: 200, contentType: 'image/png', headers: cors, body: PNG });
    if (type === 'stylesheet') return req.respond({ status: 200, contentType: 'text/css', headers: cors, body: '' });
    log.push(type + ' ' + u);
    return req.respond({ status: 204, headers: cors });
  });
}

/** Collects everything that must fail a run. */
export function watch(page) {
  const bad = [];
  page.on('console', m => {
    const t = m.type();
    if (t !== 'error' && t !== 'warning' && t !== 'warn') return;
    const full = m.text();
    const at = /@@(\S+)/.exec(full);
    bad.push({ kind: 'console.' + t, text: full.replace(/@@\S+/, '').split('\n').slice(0, 3).join(' | ').slice(0, 400), at: at && at[1] });
  });
  page.on('pageerror', e => bad.push({ kind: 'uncaught', text: String(e && e.message || e).slice(0, 400) }));
  page.on('response', r => { if (r.status() >= 400 && /^http:\/\/(127\.0\.0\.1|localhost)/.test(r.url())) bad.push({ kind: 'http ' + r.status(), text: r.url() }); });
  page.on('requestfailed', r => { if (/^http:\/\/(127\.0\.0\.1|localhost)/.test(r.url()) && !/net::ERR_ABORTED/.test(r.failure()?.errorText || '')) bad.push({ kind: 'requestfailed', text: r.url() + ' ' + r.failure()?.errorText }); });
  return bad;
}
