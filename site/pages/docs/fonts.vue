<script setup lang="ts">
useSeo({ title: 'Fonts and Arabic typography — @ziyarago/ui', description: 'Manrope for Latin, Thmanyah (self-hosted by you) or a system font for Arabic and RTL, JetBrains Mono for code: tokens, weight mapping and setup.' })

const stacks = [
  { token: '--zg-font', role: 'UI text (LTR)', stack: "'Manrope', 'Thmanyah Sans', 'Segoe UI', Tahoma, 'Noto Sans Arabic', system-ui, sans-serif", source: 'Manrope, self-hosted (assets/fonts)', license: 'SIL OFL 1.1', weights: '200 to 700', note: 'Latin and Cyrillic. Shipped in the package, no Google request.' },
  { token: '--zg-font-ar', role: 'UI text (RTL, Arabic)', stack: "'Thmanyah Sans', 'Manrope', 'Segoe UI', Tahoma, 'Noto Sans Arabic', system-ui, sans-serif", source: 'Thmanyah, NOT shipped: you self-host it', license: 'Thmanyah licence (no redistribution)', weights: '300, 400, 500, 700, 900 (mapped, see below)', note: 'Replaces --zg-font automatically when dir="rtl". Falls back to a system Arabic font if the files are absent.' },
  { token: '--zg-font-ar-display', role: 'Arabic display headlines', stack: "'Thmanyah Serif Display', 'Thmanyah Sans', 'Noto Naskh Arabic', 'Traditional Arabic', serif", source: 'Thmanyah, you self-host', license: 'Thmanyah licence', weights: '300, 400, 500, 700', note: 'Optional. For editorial headings and articles.' },
  { token: '--zg-font-ar-text', role: 'Arabic reading text', stack: "'Thmanyah Serif Text', 'Thmanyah Sans', 'Noto Naskh Arabic', 'Traditional Arabic', serif", source: 'Thmanyah, you self-host', license: 'Thmanyah licence', weights: '300, 400, 500, 700', note: 'Optional. For long articles.' },
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
  --zg-font: 'Manrope', 'Thmanyah Sans', 'Segoe UI', Tahoma, 'Noto Sans Arabic', system-ui, sans-serif;
  --zg-font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
[dir="rtl"] { --zg-font: var(--zg-font-ar); }`
const setup = `/* 1. Download Thmanyah from https://font.thmanyah.com and copy the .otf files to public/fonts/thmanyah/ */
/* 2. Ready-made @font-face rules (no font data inside, URLs start with /fonts/thmanyah/): */
@import '@ziyarago/ui/thmanyah.css';

/* or write your own, any URL; the family name is what the stack looks for */
@font-face {
  font-family: 'Thmanyah Sans';
  font-weight: 400 600;               /* Regular covers 400 to 600 */
  src: url('/fonts/thmanyah/thmanyahsans-Regular.otf') format('opentype');
  font-display: swap;
}`
const sample = 'رحلة العمرة إلى مكة المكرمة والمدينة المنورة'
</script>

<template>
  <article class="g">
    <h1>Fonts</h1>
    <p class="lead">Manrope sets Latin and Cyrillic text, JetBrains Mono sets code, and every page with <code>dir="rtl"</code> switches to the Arabic stack. Thmanyah is the preferred Arabic font but this package does not ship it (see below); until you add it Arabic renders with a system font.</p>

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
      <UiCard title="Arabic fallback stack" subtitle="Rendered with the system font, Thmanyah is not shipped">
        <div v-for="w in arWeights" :key="w" class="spec" :style="{ fontFamily: 'var(--zg-font-ar)', fontWeight: w }" dir="rtl"><span class="w" dir="ltr">{{ w }}</span>{{ sample }}</div>
      </UiCard>
      <UiCard title="JetBrains Mono" subtitle="Code and identifiers">
        <div v-for="w in [400, 500, 600]" :key="w" class="spec" :style="{ fontFamily: 'JetBrains Mono', fontWeight: w }" dir="ltr"><span class="w">{{ w }}</span>BK-2041 · SAR 18 400</div>
      </UiCard>
    </UiGrid>

    <h2>Thmanyah weight mapping</h2>
    <p class="muted">Applies once you self-host Thmanyah. It is visually heavier than Manrope at the same weight and has no 600 face, so a 600 label would fall back to Bold. <code>@ziyarago/ui/thmanyah.css</code> maps UI weights to the files with weight ranges, so a button label in Arabic is Regular and only real bold text (700 and up) is Medium or heavier.</p>
    <div class="tbl">
      <div v-for="m in mapping" :key="m.ui" class="row row--s">
        <code>font-weight: {{ m.ui }}</code><b>Thmanyah Sans {{ m.file }}</b><span class="muted">{{ m.use }}</span>
      </div>
    </div>

    <h2>Setup and self-hosting</h2>
    <UiCode :code="css" title="css" />
    <h2>Using Thmanyah</h2>
    <UiCode :code="setup" title="css" />
    <ul>
      <li>Manrope and JetBrains Mono (SIL OFL) ship in the package and load from your own origin through <code>style.css</code>. No Google request, works under a strict CSP.</li>
      <li>Thmanyah is not distributed. Its <a href="https://font.thmanyah.com/licenses" target="_blank" rel="noopener">licence</a> forbids redistributing, hosting or offering the files for download, and forbids modifying them. Download them from <a href="https://font.thmanyah.com" target="_blank" rel="noopener">font.thmanyah.com</a> and host them yourself.</li>
      <li><code>thmanyah.css</code> has no font data. Its URLs point to <code>/fonts/thmanyah/</code>. <code>url()</code> cannot take a CSS variable, so for another folder copy the file and edit the prefix.</li>
      <li>Honest note on the fallback: without the files Arabic uses Segoe UI, Tahoma, Noto Sans Arabic or the system font. It is readable and correct, but visually different from Thmanyah (usually lighter and tighter) and differs between Windows, macOS and Android.</li>
      <li>Every face uses <code>font-display: swap</code>. Licences are listed in <code>THIRD_PARTY_NOTICES.md</code>.</li>
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
