<script setup lang="ts">
import { BACKGROUNDS } from '@ziyarago/ui/theme'
useSeo({ title: 'Backgrounds and gradient cards — @ziyarago/ui', description: 'Page backgrounds and eight gradient card tones in soft and vivid variants, readable in dark and light themes.' })
const tones = ['brand', 'sky', 'success', 'warning', 'danger', 'violet', 'rose', 'neutral']
const themes = ['dark', 'light'] as const
const code = `import { useUiTheme } from '@ziyarago/ui/theme'

useUiTheme().setBackground('aurora')   // none | aurora | sunset | ocean | emerald | rose | mesh`
const cardCode = `<UiCard variant="gradient" tone="sky" title="Soft" />
<UiCard variant="gradient" tone="rose" intensity="vivid" title="Vivid" />`
const elCode = `<div class="zg-bg" data-bg="ocean" data-theme="light">any content</div>`
</script>

<template>
  <article class="g">
    <h1>Backgrounds and gradients</h1>
    <p class="lead">Page backgrounds are built from OKLCH gradients that adapt to the theme: pastel in light, deep in dark. Cards come in eight gradient tones, soft and vivid, and keep readable text in both themes. Backgrounds animate slowly when animations and full effects are on (see Display settings in the header).</p>

    <h2>Page backgrounds</h2>
    <UiCode :code="code" title="js" />
    <div class="bgs">
      <div v-for="t in themes" :key="t" class="bgcol">
        <span class="tl">{{ t }}</span>
        <div v-for="b in BACKGROUNDS" :key="b" class="zg-bg bg" :data-bg="b" :data-theme="t">
          <b>{{ b }}</b>
          <UiHStack :gap="8" wrap>
            <UiCard title="Card" subtitle="on the background" size="sm" class="mini" />
            <UiButton variant="primary" size="sm">Primary</UiButton>
          </UiHStack>
        </div>
      </div>
    </div>
    <p class="muted">Use the same background on any element with <code>class="zg-bg"</code> and <code>data-bg</code>.</p>
    <UiCode :code="elCode" title="html" />

    <h2>Gradient cards</h2>
    <UiCode :code="cardCode" title="vue" />
    <div v-for="t in themes" :key="'c' + t" class="zg-bg panel" :data-theme="t" data-bg="none">
      <span class="tl">{{ t }} · soft</span>
      <UiGrid :min="200" :gap="14">
        <UiCard v-for="tone in tones" :key="tone" variant="gradient" :tone="tone" :title="tone"><span class="txt">Soft gradient tinted with the {{ tone }} tone.</span></UiCard>
      </UiGrid>
      <span class="tl">{{ t }} · vivid</span>
      <UiGrid :min="200" :gap="14">
        <UiCard v-for="tone in tones" :key="tone" variant="gradient" intensity="vivid" :tone="tone" :title="tone"><span class="txt">Vivid gradient, readable text.</span></UiCard>
      </UiGrid>
    </div>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 24px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 75ch; line-height: 1.55; }
.muted { color: var(--zg-text-3); font-size: 14px; margin: 0; }
code { font-family: var(--zg-font-mono); font-size: .9em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; }
.bgs { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
.bgcol { display: flex; flex-direction: column; gap: 10px; }
.tl { font: 600 11px var(--zg-font); letter-spacing: .12em; text-transform: uppercase; color: var(--zg-text-3); }
.bg { border-radius: 22px; padding: 18px; min-height: 120px; display: flex; flex-direction: column; gap: 12px; color: var(--zg-text-1); box-shadow: inset 0 0 0 1px var(--zg-stroke); }
.bg[data-bg="none"] { background: var(--zg-bg); }
.panel { border-radius: 26px; padding: 22px; display: flex; flex-direction: column; gap: 14px; background-color: var(--zg-bg); color: var(--zg-text-1); box-shadow: inset 0 0 0 1px var(--zg-stroke); }
.txt { font-size: 14px; line-height: 1.5; }
</style>
