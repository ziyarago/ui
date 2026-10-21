#!/usr/bin/env node
// Generates public/og.png (1200x630) with headless Chrome. Run manually when the headline changes: node scripts/og.mjs
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, '../dist/style.css'), 'utf8').replace(/url\(\.\.\/assets\//g, `url(file://${join(root, '../assets')}/`);
const logo = 'data:image/png;base64,' + readFileSync(join(root, 'public/3d/logo.png')).toString('base64');
const html = `<!doctype html><html data-theme="dark" data-palette="gold" data-bg="aurora"><head><meta charset="utf-8"><style>${css}
body{margin:0;width:1200px;height:630px;overflow:hidden}
.w{box-sizing:border-box;width:1200px;height:630px;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between;background:var(--zg-bg-image),var(--zg-bg);font-family:var(--zg-font);color:var(--zg-text-1)}
.t{display:flex;align-items:center;gap:16px;font:600 30px var(--zg-font)}.t img{width:56px;height:56px}
h1{margin:0;font:300 76px/1.05 var(--zg-font);letter-spacing:-.035em;max-width:980px}
.s{display:flex;gap:14px}.s span{padding:10px 20px;border-radius:999px;background:var(--zg-s2);box-shadow:var(--zg-rim);font:600 24px var(--zg-font)}
</style></head><body><div class="w"><div class="t"><img src="${logo}"> @ziyarago/ui</div><h1>Vue, Nuxt &amp; React UI components and page templates</h1><div class="s"><span>203 components</span><span>36 templates</span><span>Dark · Light · RTL</span><span>AI-ready</span></div></div></body></html>`;

const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--allow-file-access-from-files'], defaultViewport: { width: 1200, height: 630 } });
const p = await b.newPage();
await p.setContent(html, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 800));
await p.screenshot({ path: join(root, 'public/og.png') });
await b.close();
console.log('public/og.png written');
