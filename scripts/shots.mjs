#!/usr/bin/env node
// Screenshots of docs pages for visual checks, run by the "visual" workflow on GitHub (not on a laptop).
// node scripts/shots.mjs <baseUrl> <outDir> <paths comma list> [widths comma list] [themes comma list] [dir]
// Example: node scripts/shots.mjs http://localhost:8080 shots /docs/charts,/docs/components/Select 1440,360 dark,light ltr
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const [base, out, pathsArg, widthsArg = '1440', themesArg = 'dark,light', dir = 'ltr'] = process.argv.slice(2);
const paths = pathsArg.split(','), widths = widthsArg.split(',').map(Number), themes = themesArg.split(',');
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
for (const path of paths) for (const theme of themes) for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 1000 });
  page.on('pageerror', e => console.log('pageerror', path, e.message));
  await page.evaluateOnNewDocument((t, d) => { localStorage.setItem('zg-ui', JSON.stringify({ theme: t, motion: 'off', dir: d, locale: d === 'rtl' ? 'ar' : 'en' })); }, theme, dir);
  await page.goto(base + path, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  const name = path.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home';
  await page.screenshot({ path: `${out}/${name}-${theme}-${w}${dir === 'rtl' ? '-rtl' : ''}.png`, fullPage: false });
  await page.close();
}
await browser.close();
console.log('shots done');
