#!/usr/bin/env node
// usage: node scripts/measure.mjs Name [Name...]
// Opens each component page, finds the variant titled "Sizes", and prints width x height of every preview root (expected order: xs < sm < md < lg < xl).
import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', defaultViewport: { width: 1100, height: 900 } })
const p = await b.newPage()
for (const n of process.argv.slice(2)) {
  await p.goto(`http://localhost:3000/docs/components/${n}`, { waitUntil: 'networkidle0' })
  const res = await p.evaluate(() => {
    const sec = [...document.querySelectorAll('.doc__v')].find(s => s.querySelector('h2')?.textContent.trim() === 'Sizes')
    if (!sec) return null
    return [...sec.querySelectorAll('.doc-preview > *')].map(e => { const r = e.getBoundingClientRect(); return `${e.getAttribute('data-size') || '-'}:${Math.round(r.width)}x${Math.round(r.height)}` })
  })
  console.log(n.padEnd(16), res ? res.join('  ') : 'NO "Sizes" VARIANT')
}
await b.close()
