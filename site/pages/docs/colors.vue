<script setup lang="ts">
useSeo({ title: 'Colors and design tokens — @ziyarago/ui', description: 'OKLCH color tokens for surfaces, text, brand and status in dark and light themes, with the gold and tamam palettes.' })

type Tok = { name: string; use: string }
const groups: { title: string; blurb: string; tokens: Tok[] }[] = [
  { title: 'Surfaces', blurb: 'Page, cards and popups. Cards are translucent layers over the page color; popups and modals are opaque.', tokens: [
    { name: '--zg-bg', use: 'Page background' },
    { name: '--zg-s1', use: 'Card layer' },
    { name: '--zg-s2', use: 'Inputs, hover, nested blocks' },
    { name: '--zg-s3', use: 'Pressed, strong layer' },
    { name: '--zg-pop', use: 'Menus, selects, calendars, modals (opaque)' },
    { name: '--zg-glass', use: 'Frosted bars' },
    { name: '--zg-stroke', use: 'Hairlines and dividers' },
  ] },
  { title: 'Text', blurb: 'Three levels. text-3 is for hints only; all three pass AA on bg in both themes.', tokens: [
    { name: '--zg-text-1', use: 'Primary text and headings' },
    { name: '--zg-text-2', use: 'Secondary text, descriptions' },
    { name: '--zg-text-3', use: 'Hints, captions, disabled' },
    { name: '--zg-brand-text', use: 'Brand colored text and links' },
    { name: '--zg-sky-text', use: 'Info colored text' },
  ] },
  { title: 'Brand', blurb: 'Switches with data-palette: gold (default) or tamam. Use the brand fill for ONE hero element per view.', tokens: [
    { name: '--zg-brand', use: 'Primary actions, active states' },
    { name: '--zg-brand-hover', use: 'Hover of brand fills' },
    { name: '--zg-brand-soft', use: 'Tinted backgrounds, selected rows' },
    { name: '--zg-brand-glow', use: 'Glow shadow under primary buttons' },
    { name: '--zg-on-brand', use: 'Text on brand fills' },
  ] },
  { title: 'Status', blurb: 'Success, warning, danger, info. Use the text variants on light surfaces.', tokens: [
    { name: '--zg-green', use: 'Success' },
    { name: '--zg-amber', use: 'Warning' },
    { name: '--zg-red', use: 'Danger' },
    { name: '--zg-sky', use: 'Info' },
  ] },
  { title: 'Inverse', blurb: 'A surface that is dark in light theme and light in dark theme, for tooltips and the inverse button.', tokens: [
    { name: '--zg-inv-bg', use: 'Inverse background' },
    { name: '--zg-inv-fg', use: 'Inverse text' },
  ] },
]
const themes = ['dark', 'light'] as const
const palettes = ['gold', 'tamam'] as const
const values = ref<Record<string, string>>({})
const root = ref<HTMLElement>()
function read() {
  const out: Record<string, string> = {}
  for (const t of themes) {
    const el = root.value?.querySelector(`[data-probe="${t}"]`) as HTMLElement | null
    if (!el) continue
    const cs = getComputedStyle(el)
    for (const g of groups) for (const k of g.tokens) out[`${t}:${k.name}`] = cs.getPropertyValue(k.name).trim()
  }
  values.value = out
}
onMounted(() => nextTick(read))
</script>

<template>
  <article ref="root" class="g">
    <h1>Colors</h1>
    <p class="lead">OKLCH tokens in two themes (<code>data-theme="dark|light"</code>) and two palettes (<code>data-palette="gold|tamam"</code>). Components read tokens only, so switching the attribute restyles everything. Both themes are shown below at once.</p>

    <div v-for="t in themes" :key="'p' + t" :data-theme="t" :data-probe="t" class="probe" />

    <section v-for="g in groups" :key="g.title">
      <h2>{{ g.title }}</h2>
      <p class="muted">{{ g.blurb }}</p>
      <div class="themes">
        <div v-for="t in themes" :key="t" :data-theme="t" class="theme">
          <span class="tl">{{ t }}</span>
          <div class="sw-grid">
            <div v-for="k in g.tokens" :key="k.name" class="sw">
              <span class="chip" :style="{ background: `var(${k.name})` }" />
              <span class="meta"><code>{{ k.name }}</code><span>{{ k.use }}</span><span class="val">{{ values[`${t}:${k.name}`] }}</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2>Palettes</h2>
      <p class="muted">Only the brand and sky tokens change between palettes.</p>
      <div class="themes">
        <div v-for="p in palettes" :key="p" :data-palette="p" class="theme">
          <span class="tl">{{ p }}</span>
          <div class="sw-grid">
            <div v-for="k in ['--zg-brand', '--zg-brand-hover', '--zg-brand-soft', '--zg-brand-text', '--zg-sky']" :key="k" class="sw">
              <span class="chip" :style="{ background: `var(${k})` }" /><span class="meta"><code>{{ k }}</code></span>
            </div>
          </div>
          <div class="btns"><UiButton variant="primary">Primary</UiButton><UiBadge tone="brand">Badge</UiBadge><UiProgress :value="64" /></div>
        </div>
      </div>
    </section>

    <section>
      <h2>Rules of thumb</h2>
      <ul>
        <li>Use tokens, never raw hex. A raw color will not follow the theme or the palette.</li>
        <li>Put ONE brand-filled element per view (the main call to action or the hero tile).</li>
        <li>On light theme cards separate from the page by a hairline and a soft shadow. Keep cards on <code>--zg-bg</code> or a <code>--zg-s1</code> layer; do not place a card on another card of the same color.</li>
        <li>For an always-dark surface (hero, code, media) use <code>UiCard variant="inverse"</code>. It re-scopes the tokens to dark inside, so text and charts stay readable in light theme.</li>
        <li>Status color alone is not enough: pair it with an icon or a label.</li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 24px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; line-height: 1.55; }
.muted { color: var(--zg-text-3); font-size: 14px; margin: 4px 0 12px; max-width: 75ch; line-height: 1.55; }
code { font-family: var(--zg-font-mono); font-size: .9em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; }
.probe { position: absolute; width: 0; height: 0; overflow: hidden; }
.themes { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 14px; }
.theme { background: var(--zg-bg); color: var(--zg-text-1); border-radius: 22px; padding: 18px; box-shadow: var(--zg-rim); display: flex; flex-direction: column; gap: 12px; }
.tl { font: 600 11px var(--zg-font); letter-spacing: .12em; text-transform: uppercase; color: var(--zg-text-3); }
.sw-grid { display: flex; flex-direction: column; gap: 8px; }
.sw { display: flex; align-items: center; gap: 12px; }
.chip { width: 44px; height: 44px; border-radius: 12px; flex: none; box-shadow: inset 0 0 0 1px var(--zg-stroke), 0 0 0 1px color-mix(in oklch, var(--zg-text-1) 14%, transparent); }
.meta { display: flex; flex-direction: column; gap: 1px; font-size: 12.5px; color: var(--zg-text-2); min-width: 0; }
.meta code { align-self: flex-start; }
.val { font-family: var(--zg-font-mono); font-size: 11px; color: var(--zg-text-3); word-break: break-all; }
.btns { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
ul { color: var(--zg-text-2); line-height: 1.7; padding-inline-start: 20px; margin: 0; }
</style>
