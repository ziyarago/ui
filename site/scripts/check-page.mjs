#!/usr/bin/env node
// usage: node scripts/check-page.mjs Name [Name...]  — fetches the SSR page, reports status and number of rendered previews vs declared variants
const names = process.argv.slice(2)
for (const n of names) {
  const r = await fetch(`http://localhost:3000/docs/components/${n}`)
  const html = await r.text()
  const stages = (html.match(/class="doc__stage/g) || []).length
  const err = /Failed to resolve|Cannot read|is not a function|<!--\[-->\s*<!--\]-->/.test(html) ? ' SUSPICIOUS' : ''
  console.log(`${n}: HTTP ${r.status}, ${stages} preview stage(s)${err}`)
}
