<script setup lang="ts">
const props = defineProps<{ source: string; skipTitle?: string }>()
const blocks = computed(() => parseMarkdown(props.source).filter(b => !(b.t === 'h' && b.level === 1 && props.skipTitle && b.text === props.skipTitle)))
</script>

<template>
  <div class="md">
    <template v-for="(b, i) in blocks" :key="i">
      <component :is="`h${Math.min(b.level + 1, 6)}`" v-if="b.t === 'h'" :id="b.id" class="md__h" :class="`md__h${b.level}`"><a class="md__a" :href="`#${b.id}`" aria-label="Link to this section">#</a><span v-html="b.html" /></component>
      <p v-else-if="b.t === 'p'" v-html="b.html" />
      <component :is="b.ordered ? 'ol' : 'ul'" v-else-if="b.t === 'list'"><li v-for="(it, j) in b.items" :key="j" v-html="it" /></component>
      <UiCode v-else-if="b.t === 'code'" :code="b.code" :title="b.lang || 'code'" />
      <div v-else-if="b.t === 'table'" class="md__tbl" tabindex="0" role="region" aria-label="Table"><table><thead><tr><th v-for="(c, j) in b.head" :key="j" v-html="c" /></tr></thead><tbody><tr v-for="(r, j) in b.rows" :key="j"><td v-for="(c, k) in r" :key="k" v-html="c" /></tr></tbody></table></div>
      <blockquote v-else-if="b.t === 'quote'" v-html="b.html" />
      <hr v-else>
    </template>
  </div>
</template>

<style scoped>
.md { display: flex; flex-direction: column; gap: 14px; min-width: 0; color: var(--zg-text-2); line-height: 1.7; }
.md :deep(p), .md :deep(ul), .md :deep(ol), .md :deep(blockquote) { margin: 0; max-width: 78ch; }
.md :deep(ul), .md :deep(ol) { padding-inline-start: 22px; display: flex; flex-direction: column; gap: 4px; }
.md :deep(code) { font-family: var(--zg-font-mono); font-size: .9em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; overflow-wrap: anywhere; color: var(--zg-text-1); }
.md :deep(a) { color: var(--zg-brand-text); text-decoration: underline; text-underline-offset: 3px; overflow-wrap: anywhere; }
.md :deep(strong) { color: var(--zg-text-1); font-weight: 600; }
.md__h { position: relative; margin: 22px 0 0; color: var(--zg-text-1); font-family: var(--zg-font); scroll-margin-top: 84px; line-height: 1.25; }
.md__h1 { font-size: 26px; font-weight: 500; }
.md__h2 { font-size: 20px; font-weight: 500; }
.md__h3, .md__h4 { font-size: 16px; font-weight: 600; }
.md__a { position: absolute; inset-inline-start: -18px; color: var(--zg-text-3); text-decoration: none; opacity: 0; font-weight: 400; }
.md__h:hover .md__a, .md__a:focus { opacity: 1; }
.md__h:target { color: var(--zg-brand-text); }
blockquote { padding-inline-start: 14px; border-inline-start: 3px solid var(--zg-stroke); color: var(--zg-text-3); }
hr { border: 0; height: 1px; background: var(--zg-stroke); width: 100%; }
.md__tbl { overflow-x: auto; border-radius: 12px; box-shadow: inset 0 0 0 1px var(--zg-stroke); }
table { border-collapse: collapse; width: 100%; font-size: 14px; }
th, td { text-align: start; padding: 8px 12px; vertical-align: top; box-shadow: inset 0 -1px 0 var(--zg-stroke); }
th { color: var(--zg-text-1); font-weight: 600; background: var(--zg-s2); white-space: nowrap; }
@media (max-width: 900px) { .md__a { display: none; } }
</style>
