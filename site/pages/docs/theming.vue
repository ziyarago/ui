<script setup lang="ts">
useSeo({ title: 'Theming, dark mode and RTL — @ziyarago/ui', description: 'Switch dark and light themes, palettes, direction, motion and effects; override OKLCH design tokens.' })
const vars = `/* override any token on :root or a wrapper */
:root {
  --zg-brand: oklch(0.72 0.12 70);
  --zg-r-card: 24px;
}`
const attrs = `<html data-theme="light" data-palette="tamam" dir="rtl">`
const tokens = `// tokens/tokens.json — for Flutter and native clients
import tokens from '@ziyarago/ui/tokens.json'`
</script>

<template>
  <article class="g">
    <h1>Theming</h1>
    <p class="lead">Design tokens are OKLCH CSS variables. Two palettes, dark and light, and RTL are switched with attributes on the root element. Use the controls in the header to try them on this page.</p>
    <h2>Attributes</h2>
    <UiCode :code="attrs" title="html" />
    <h2>Override tokens</h2>
    <UiCode :code="vars" title="css" />
    <h2>Tokens for other platforms</h2>
    <UiCode :code="tokens" title="js" />
    <h2>Palettes</h2>
    <UiGrid :min="220">
      <UiCard title="gold" subtitle="default"><UiButton variant="primary">Primary</UiButton></UiCard>
      <UiCard title="tamam" subtitle="data-palette=&quot;tamam&quot;"><UiButton variant="primary">Primary</UiButton></UiCard>
    </UiGrid>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 20px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; }
</style>
