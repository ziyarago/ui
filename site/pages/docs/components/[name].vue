<script setup lang="ts">
import { EXAMPLES, allNames } from '~/docs-data'
import { groupOf } from '~/docs-data/groups'
import { vueCode, reactCode } from '~/utils/codegen'

const route = useRoute()
const name = computed(() => String(route.params.name))
if (!allNames.includes(name.value)) throw createError({ statusCode: 404, statusMessage: 'Component not found' })
const ex = computed(() => EXAMPLES[name.value])
const group = computed(() => groupOf(name.value))
const idx = computed(() => allNames.indexOf(name.value))
import { meta } from '@ziyarago/ui/meta'
useSeo(() => ({ title: `Ui${name.value} component — @ziyarago/ui`, description: `${(meta as Record<string, any>)[name.value]?.description ?? name.value} Live examples, Vue and React code and the full props reference.` }))

const tab = ref<'preview' | 'code'>('preview')
const importVue = computed(() => `import { Ui${name.value} } from '@ziyarago/ui/vue'`)
const importReact = computed(() => `import { Ui${name.value} } from '@ziyarago/ui/react'`)
</script>

<template>
  <article class="doc">
    <UiBreadcrumbs :items="[{ label: 'Components', href: '/docs/components' }, { label: group?.title ?? '' }, { label: name }]" />
    <h1 class="doc__h">{{ name }}</h1>
    <p class="doc__d">{{ ex?.description ?? `${name} from the ${group?.title.toLowerCase()} group.` }}</p>

    <p class="doc__jump"><a href="#api">Jump to API reference</a></p>
    <h2>Import</h2>
    <CodeTabs :vue="importVue" :react="importReact" />

    <template v-if="ex">
      <section v-for="(v, i) in ex.variants" :key="i" class="doc__v">
        <h2>{{ v.label }}</h2>
        <div class="doc__stage"><DocPreview :name="name" :variant="v" /></div>
        <CodeTabs :vue="vueCode(name, v)" :react="reactCode(name, v)" />
      </section>
    </template>
    <UiAlert v-else tone="info">Examples for this component are not written yet. Import it as shown above and use the props from the API reference below.</UiAlert>

    <ApiTable :name="name" />

    <nav class="doc__nav">
      <NuxtLink v-if="idx > 0" :to="`/docs/components/${allNames[idx - 1]}`">← {{ allNames[idx - 1] }}</NuxtLink>
      <NuxtLink v-if="idx < allNames.length - 1" :to="`/docs/components/${allNames[idx + 1]}`" class="doc__next">{{ allNames[idx + 1] }} →</NuxtLink>
    </nav>
  </article>
</template>

<style scoped>
.doc { display: flex; flex-direction: column; gap: 20px; }
.doc__h { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.doc__d { margin: 0; color: var(--zg-text-2); font-size: 17px; line-height: 1.5; max-width: 70ch; }
.doc h2 { margin: 16px 0 0; font: 500 20px var(--zg-font); }
.doc__v { display: flex; flex-direction: column; gap: 14px; }
.doc__stage { border-radius: 20px; padding: 32px 24px; background: var(--zg-s1); box-shadow: var(--zg-rim); min-height: 120px; display: flex; align-items: center; justify-content: center; }
.doc__stage :deep(.doc-preview) { width: 100%; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: center; }
.doc__jump { margin: -8px 0 0; font-size: 14px; }
.doc__jump a { color: var(--zg-brand-text); text-decoration: none; }
.doc__nav { display: flex; justify-content: space-between; margin-top: 32px; }
.doc__nav a { color: var(--zg-brand-text); text-decoration: none; }
code { font-family: var(--zg-font-mono); }
</style>
