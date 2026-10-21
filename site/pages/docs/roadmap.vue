<script setup lang="ts">
import md from '../../../docs/ROADMAP.md?raw'

useSeo({ title: 'Roadmap — @ziyarago/ui', description: 'What is planned for @ziyarago/ui: tree-shaking, built-in i18n, accessibility audit, React verification, Pro starters. No dates, honest status.' })
</script>

<template>
  <article class="g">
    <h1>Roadmap</h1>
    <SiteMarkdown :source="md" skip-title="Roadmap" />
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
</style>
