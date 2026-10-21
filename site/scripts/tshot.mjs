#!/usr/bin/env node
// usage: node scripts/tshot.mjs <route> <out.png> [top|side] [selectedSlotId]
// Screenshots /docs/templates/<route> (1700x1000), prints console errors/warnings and the list of data-slot ids found in the frame.
import puppeteer from 'puppeteer-core'
const [route, out, nav = 'top', slot] = process.argv.slice(2)
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', defaultViewport: { width: 1700, height: 1000 } })
const p = await b.newPage()
const logs = []
p.on('console', m => { if (['error', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text().slice(0, 200)}`) })
p.on('pageerror', e => logs.push('pageerror: ' + e.message.slice(0, 200)))
await p.goto(`http://localhost:3000/docs/templates/${route}`, { waitUntil: 'networkidle0' })
if (nav === 'side') { await p.evaluate(() => [...document.querySelectorAll('.zg-seg button')].find(x => x.textContent.trim() === 'Side menu')?.click()); await new Promise(r => setTimeout(r, 500)) }
if (slot) { await p.evaluate(s => document.querySelector(`.tv__frame [data-slot="${s}"]`)?.click(), slot); await new Promise(r => setTimeout(r, 400)) }
const slots = await p.evaluate(() => [...document.querySelectorAll('.tv__frame [data-slot]')].map(e => e.dataset.slot))
await p.screenshot({ path: out })
console.log('slots in frame:', slots.join(', '))
console.log(logs.length ? logs.join('\n') : 'no console errors/warnings')
await b.close()
