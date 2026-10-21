// Accessibility audit: axe-core (WCAG 2.0/2.1 A and AA) over the docs site in dark and light themes.
// Starts nothing: run `cd site && npx nuxt dev --port 3000` first.
// Usage: node scripts/a11y.mjs [baseUrl] [--json=out.json] [--only=/docs/components/Select,...] [--palette=gold|tamam] [--open]
// --open also opens every popup trigger on the page (aria-haspopup) before running axe, to check the open lists.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const axeSrc = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const args = process.argv.slice(2);
const flag = n => (args.find(a => a.startsWith(`--${n}=`)) || '').split('=').slice(1).join('=');
const base = (args.find(a => !a.startsWith('--')) || 'http://localhost:3000').replace(/\/$/, '');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!existsSync(CHROME)) throw new Error('Chrome not found; set CHROME_PATH');

const COMPONENTS = ['Button', 'TextField', 'Select', 'Combobox', 'MultiSelect', 'Tabs', 'Modal', 'DataTable', 'Calendar', 'DatePicker', 'Menu', 'Dropdown', 'Tooltip', 'Accordion', 'Alert', 'Pagination', 'SegmentedControl', 'PillTabs', 'Checkbox', 'Switch', 'Slider', 'CommandPalette', 'Drawer', 'Card', 'Badge', 'Progress', 'Avatar'];
const pages = flag('only') ? flag('only').split(',') : [
  '/', ...COMPONENTS.map(n => `/docs/components/${n}`),
  ...['dashboard', 'auth', 'settings', 'inbox'].map(t => `/docs/templates/${t}`),
  '/docs/accessibility', '/docs/localization', '/docs/colors',
];
const palette = flag('palette');
const themes = ['dark', 'light'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const rules = new Map(); // id -> { impact, help, count, pages:Set, examples:[] }
let passes = new Set(), total = 0;
for (const theme of themes) {
  for (const path of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.evaluateOnNewDocument((t, p) => {
      try { localStorage.setItem('zg-ui', JSON.stringify({ theme: t, motion: 'off', ...(p ? { palette: p } : {}) })); } catch {}
    }, theme, palette);
    try {
      await page.goto(base + path, { waitUntil: 'networkidle0', timeout: 60000 });
      await new Promise(r => setTimeout(r, 400));
      if (args.includes('--open')) { await page.evaluate(() => document.querySelectorAll('.doc__stage [aria-haspopup][aria-expanded="false"]').forEach(b => b.click())); await new Promise(r => setTimeout(r, 300)); }
      await page.evaluate(axeSrc);
      const res = await page.evaluate(tags => axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'passes'] }), TAGS);
      res.passes.forEach(p => passes.add(p.id));
      for (const v of res.violations) {
        const r = rules.get(v.id) || { impact: v.impact, help: v.help, count: 0, pages: new Set(), examples: [], seen: new Set() };
        r.count += v.nodes.length; r.pages.add(`${path} (${theme})`);
        for (const n of v.nodes) { const key = n.target.join(' ').replace(/\[data-v-[^\]]*\]/g, '').replace(/:nth-child\(\d+\)/g, ''); if (r.examples.length < 14 && !r.seen.has(key)) { r.seen.add(key); r.examples.push(`${path} [${theme}] ${key}  ${(n.any[0] || n.all[0] || n.none[0] || {}).message || ''}`.slice(0, 280)); } }
        rules.set(v.id, r);
      }
      total++;
    } catch (e) { console.error(`! ${path} [${theme}]: ${e.message}`); }
    await page.close();
  }
}
await browser.close();

const out = [...rules].sort((a, b) => b[1].count - a[1].count);
console.log(`\naxe ${TAGS.join(',')}: ${total} page runs (${pages.length} pages x ${themes.length} themes)${palette ? `, palette ${palette}` : ''}`);
console.log(`rules passed: ${[...passes].filter(p => !rules.has(p)).length}, rules with violations: ${out.length}, nodes: ${out.reduce((s, [, r]) => s + r.count, 0)}\n`);
for (const [id, r] of out) {
  console.log(`${id}  [${r.impact}]  ${r.count} nodes on ${r.pages.size} page runs — ${r.help}`);
  r.examples.forEach(e => console.log(`    ${e}`));
}
if (flag('json')) writeFileSync(flag('json'), JSON.stringify({ pages, passes: [...passes], violations: out.map(([id, r]) => ({ id, ...r, seen: undefined, pages: [...r.pages] })) }, null, 2));
process.exit(out.length ? 1 : 0);
