<script setup lang="ts">
import raw from '../../../CHANGELOG.md?raw'

useSeo({ title: 'Changelog — @ziyarago/ui', description: 'Release notes for @ziyarago/ui: new components, fixes and breaking changes for every version, with an Atom feed.' })
useHead({ link: [{ rel: 'alternate', type: 'application/atom+xml', title: '@ziyarago/ui changelog', href: '/changelog.xml' }] })

const versions = computed(() => parseMarkdown(raw).filter(b => b.t === 'h' && b.level === 2 && /^\[?\d/.test(b.text)).map(b => (b as { id: string }).id))
</script>

<template>
  <article class="g">
    <h1>Changelog</h1>
    <p class="lead">Every release, newest first. Versions follow <a href="https://semver.org">SemVer</a>; before 1.0 a minor version may break. Subscribe with the <a href="/changelog.xml">Atom feed</a>.</p>
    <nav v-if="versions.length" class="vs" aria-label="Versions">
      <a v-for="v in versions" :key="v" :href="`#${v}`"><UiBadge>{{ v }}</UiBadge></a>
    </nav>
    <SiteMarkdown :source="raw" skip-title="Changelog" />
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; }
.lead a { color: var(--zg-brand-text); }
.vs { display: flex; flex-wrap: wrap; gap: 8px; }
.vs a { text-decoration: none; }
</style>
