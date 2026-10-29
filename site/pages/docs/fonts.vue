<script setup lang="ts">
useSeo({ title: 'Fonts and Arabic typography — @ziyarago/ui', description: 'Manrope for Latin, Thmanyah for Arabic and RTL, JetBrains Mono for code: tokens, weight mapping and self-hosting.' })

const stacks = [
  { token: '--zg-font', role: 'UI text (LTR)', stack: "'Manrope', 'Thmanyah Sans', system-ui, sans-serif", source: 'Manrope, self-hosted (assets/fonts)', license: 'SIL OFL 1.1', weights: '200 to 700', note: 'Latin and Cyrillic. Loaded from Google Fonts in dist/style.css.' },
  { token: '--zg-font-ar', role: 'UI text (RTL, Arabic)', stack: "'Thmanyah Sans', system-ui, sans-serif", source: 'Thmanyah, shipped in the package', license: 'Free incl. commercial', weights: '300, 400, 500, 700, 900 (mapped, see below)', note: 'Replaces --zg-font automatically when dir="rtl".' },
  { token: '--zg-font-ar-display', role: 'Arabic display headlines', stack: "'Thmanyah Serif Display', 'Thmanyah Sans', serif", source: 'Thmanyah, shipped', license: 'Free incl. commercial', weights: '300, 400, 500, 700', note: 'Optional. For editorial headings and articles.' },
  { token: '--zg-font-ar-text', role: 'Arabic reading text', stack: "'Thmanyah Serif Text', 'Thmanyah Sans', serif", source: 'Thmanyah, shipped', license: 'Free incl. commercial', weights: '300, 400, 500, 700', note: 'Optional. For long articles.' },
  { token: '--zg-font-mono', role: 'Code, numbers in tables', stack: "'JetBrains Mono', ui-monospace, monospace", source: 'JetBrains Mono, self-hosted (assets/fonts)', license: 'SIL OFL 1.1', weights: '400, 500, 600', note: 'Used by Code, Kbd, codes and IDs.' },
]
const mapping = [
  { ui: '200 to 300', file: 'Light', use: 'Large headings, big numbers' },
  { ui: '400 to 600', file: 'Regular', use: 'Body text, labels, buttons, tabs, card titles' },
  { ui: '700', file: 'Medium', use: 'Bold emphasis (b, strong, 700)' },
  { ui: '800', file: 'Bold', use: 'Rare, strong emphasis' },
  { ui: '900', file: 'Black', use: 'Display numerals only' },
]
const weights = [300, 400, 500, 600, 700]
const arWeights = [300, 400, 500, 600, 700, 900]
const css = `:root {
  --zg-font: 'Manrope', 'Thmanyah Sans', system-ui, sans-serif;
  --zg-font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
[dir="rtl"] { --zg-font: var(--zg-font-ar); }

/* self-host: copy assets/fonts/thmanyah and point the URLs at your copy */
@font-face {
  font-family: 'Thmanyah Sans';
  font-weight: 400 600;               /* Regular covers 400 to 600 */
  src: url('/fonts/thmanyahsans-Regular.woff2') format('woff2');
  font-display: swap;
}`
</script>

<template>
  <article class="g">
    <h1>Fonts</h1>
    <p class="lead">Two scripts, three families. Manrope sets Latin and Cyrillic text, Thmanyah sets Arabic and every page with <code>dir="rtl"</code>, JetBrains Mono sets code. The tokens switch automatically with the direction.</p>

    <h2>Families and tokens</h2>
    <div class="tbl">
      <div v-for="s in stacks" :key="s.token" class="row">
        <div class="c1"><code>{{ s.token }}</code><b>{{ s.role }}</b></div>
        <div class="c2"><code class="stack">{{ s.stack }}</code><span>{{ s.note }}</span></div>
        <div class="c3"><span>{{ s.source }}</span><span class="muted">{{ s.license }}</span><span class="muted">Weights: {{ s.weights }}</span></div>
      </div>
    </div>

    <h2>Specimen</h2>
    <UiGrid :min="320">
      <UiCard title="Manrope" subtitle="Latin, Cyrillic. LTR UI">
        <div v-for="w in weights" :key="w" class="spec" :style="{ fontFamily: 'Manrope', fontWeight: w }" dir="ltr"><span class="w">{{ w }}</span>Umrah trip to Makkah and Madinah</div>
      </UiCard>
      <UiCard title="Thmanyah Sans" subtitle="Arabic. RTL UI">
        <div v-for="w in arWeights" :key="w" class="spec" :style="{ fontFamily: 'Thmanyah Sans', fontWeight: w }" dir="rtl"><span class="w" dir="ltr">{{ w }}</span>رحلة العمرة إلى مكة المكرمة والمدينة</div>
      </UiCard>
      <UiCard title="JetBrains Mono" subtitle="Code and identifiers">
        <div v-for="w in [400, 500, 600]" :key="w" class="spec" :style="{ fontFamily: 'JetBrains Mono', fontWeight: w }" dir="ltr"><span class="w">{{ w }}</span>BK-2041 · SAR 18 400</div>
      </UiCard>
    </UiGrid>

    <h2>Why Arabic looks lighter than before</h2>
    <p class="muted">Thmanyah is visually heavier than Manrope at the same weight and has no 600 face, so a 600 label used to fall back to Bold. The library now maps UI weights to the files with weight ranges in <code>fonts.css</code>, so a button label in Arabic is Regular and only real bold text (700 and up) is Medium or heavier.</p>
    <div class="tbl">
      <div v-for="m in mapping" :key="m.ui" class="row row--s">
        <code>font-weight: {{ m.ui }}</code><b>Thmanyah Sans {{ m.file }}</b><span class="muted">{{ m.use }}</span>
      </div>
    </div>

    <h2>Setup and self-hosting</h2>
    <UiCode :code="css" title="css" />
    <ul>
      <li>Manrope and JetBrains Mono load from Google Fonts through <code>@import</code> in <code>dist/style.css</code>. For offline or strict-CSP deployments download them, self-host and remove that line.</li>
      <li>Thmanyah files ship in <code>@ziyarago/ui/assets/fonts/thmanyah</code>. Bundlers (Vite, Nuxt, Next) resolve the URLs from <code>style.css</code> automatically.</li>
      <li>Every face uses <code>font-display: swap</code>. The browser keeps the fallback stack until a file arrives.</li>
      <li>Licenses are listed in <code>THIRD_PARTY_NOTICES.md</code>. Thmanyah is free for commercial use; check the foundry page before redistributing changed files.</li>
    </ul>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 24px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; line-height: 1.55; }
.muted { color: var(--zg-text-3); font-size: 14px; margin: 0; line-height: 1.55; max-width: 75ch; }
code { font-family: var(--zg-font-mono); font-size: .9em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; }
.tbl { display: flex; flex-direction: column; border-radius: 20px; background: var(--zg-s1); box-shadow: var(--zg-rim); overflow: hidden; }
.row { display: grid; grid-template-columns: minmax(180px, 1fr) minmax(0, 2fr) minmax(160px, 1fr); gap: 16px; padding: 14px 18px; align-items: start; }
.row + .row { box-shadow: inset 0 1px 0 var(--zg-stroke); }
.row--s { grid-template-columns: 200px 220px minmax(0, 1fr); align-items: center; }
.c1, .c2, .c3 { display: flex; flex-direction: column; gap: 4px; min-width: 0; font-size: 14px; }
.stack { word-break: break-word; }
.spec { display: flex; align-items: baseline; gap: 14px; font-size: 20px; line-height: 1.6; }
.spec .w { font: 12px var(--zg-font-mono); color: var(--zg-text-3); width: 30px; flex: none; }
ul { color: var(--zg-text-2); line-height: 1.7; padding-inline-start: 20px; margin: 0; }
@media (max-width: 800px) { .row, .row--s { grid-template-columns: minmax(0, 1fr); gap: 6px; } }
</style>
