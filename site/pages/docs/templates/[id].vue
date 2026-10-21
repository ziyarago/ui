<script setup lang="ts">
import { TEMPLATES } from '~/docs-data/templates'
import type { SlotDoc } from '~/docs-data/templates-types'

const route = useRoute()
const router = useRouter()
const page = computed(() => TEMPLATES.pages.find(p => p.route === route.params.id))
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Template not found' })
useSeo(() => ({ title: `${page.value!.label} page template — @ziyarago/ui`, description: `${page.value!.desc} Live preview in the app shell with slot docs for Vue, Nuxt and React.` }))

const { sel, show, nav, scrollTick, pick } = useTpl()
const shellSlots = computed<SlotDoc[]>(() => (page.value!.shell ? [...TEMPLATES.shell, ...(nav.value === 'side' ? [TEMPLATES.footer] : [])] : []))
const all = computed(() => [...shellSlots.value.map(s => ({ ...s, g: 'Shell' })), ...page.value!.slots.map(s => ({ ...s, g: 'Page' }))])
watch(page, () => { sel.value = page.value!.slots[Math.min(1, page.value!.slots.length - 1)].id }, { immediate: true })
const cur = computed(() => all.value.find(s => s.id === sel.value) ?? all.value[0])

const example = computed(() => {
  const s = cur.value
  const inner = s.use.replace(/\n/g, '\n    ')
  return s.g === 'Shell'
    ? `<UiAppShell nav="${nav.value}" :items="nav" v-model="page">\n  <template #${s.id}>\n    ${inner}\n  </template>\n</UiAppShell>`
    : `<Ui${page.value!.component} title="${page.value!.label}">\n  <template #${s.id}>\n    ${inner}\n  </template>\n</Ui${page.value!.component}>`
})

const frameEl = ref<HTMLElement>()
watch(scrollTick, async () => {
  await nextTick()
  const fr = frameEl.value?.querySelector('.tpl-frame') as HTMLElement | null
  const el = fr?.querySelector(`[data-slot="${sel.value}"]`) as HTMLElement | null
  if (fr && el) fr.scrollTop += el.getBoundingClientRect().top - fr.getBoundingClientRect().top - 90
})

const chips = TEMPLATES.pages.map(p => ({ value: p.route, label: p.label }))
const route$ = computed({ get: () => String(route.params.id), set: (v: string) => router.push(`/docs/templates/${v}`) })
</script>

<template>
  <div class="tv">
    <div class="tv__bar zg-glass">
      <b>Page templates</b>
      <div class="tv__chips"><UiFilterChips v-model="route$" :items="chips" /></div>
      <UiSegmentedControl v-if="page!.shell" v-model="nav" size="sm" :items="[{ value: 'top', label: 'Top menu' }, { value: 'side', label: 'Side menu' }]" />
      <UiSwitch v-model="show" label="Show slots" />
    </div>

    <div class="tv__work" :data-show="show ? '1' : '0'">
      <div ref="frameEl" class="tv__frame"><TplFrame :page="page!" :key="`${page!.route}-${nav}`" /></div>

      <aside class="tv__insp zg-glass">
        <div class="tv__head">
          <span class="tv__eyebrow">Template</span>
          <b class="tv__title">{{ page!.label }}</b>
          <span class="tv__desc">{{ page!.desc }}</span>
          <NuxtLink :to="`/docs/components/${page!.component}`" class="tv__link">Ui{{ page!.component }} API →</NuxtLink>
        </div>

        <div v-if="shellSlots.length" class="tv__group">
          <span class="zg-sidenav__group">Shell · {{ nav }} menu</span>
          <button v-for="s in all.filter(x => x.g === 'Shell')" :key="s.id" type="button" class="tv__item" :aria-current="String(s.id === cur.id)" @click="pick(s.id, true)"><span>{{ s.title }}</span><code>{{ s.id }}</code></button>
        </div>
        <div class="tv__group">
          <span class="zg-sidenav__group">Page slots</span>
          <button v-for="s in all.filter(x => x.g === 'Page')" :key="s.id" type="button" class="tv__item" :aria-current="String(s.id === cur.id)" @click="pick(s.id, true)"><span>{{ s.title }}</span><code>{{ s.id }}</code></button>
        </div>

        <div class="tv__sep" />
        <div class="tv__cur">
          <div class="tv__curh"><b>{{ cur.title }}</b><span class="zg-mono">#{{ cur.id }}</span></div>
          <p>{{ cur.desc }}</p>
          <div class="tv__sec"><span class="zg-label">Accepts</span><div class="zg-chips"><span v-for="a in cur.accepts" :key="a" class="zg-tag">{{ a }}</span></div></div>
          <div class="tv__sec">
            <span class="zg-label">Props / data</span>
            <div class="tv__props">
              <div v-for="(p, i) in cur.props" :key="p.name" class="tv__prop" :class="{ 'tv__prop--b': i }">
                <span><b class="zg-mono">{{ p.name }}</b><span class="zg-mono tv__type">{{ p.type }}</span></span>
                <span v-if="p.desc" class="tv__pd">{{ p.desc }}</span>
              </div>
            </div>
          </div>
          <div class="tv__sec"><span class="zg-label">Example</span><UiCode :code="example" title="vue" /></div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.tv { display: flex; flex-direction: column; gap: 16px; }
.tv__bar { position: sticky; top: 76px; z-index: 40; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 10px 14px; border-radius: 28px; box-shadow: var(--zg-rim), var(--zg-shadow-1); background: var(--zg-pop); }
.tv__chips { flex: 1 1 0; min-width: 120px; overflow-x: auto; scrollbar-width: none; }
.tv__chips :deep(.zg-chips) { flex-wrap: nowrap; width: max-content; }
.tv__chips :deep(.zg-chip) { flex: none; white-space: nowrap; }
.tv__work { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 20px; align-items: start; }
.tv__frame { min-width: 0; }
.tv__insp { position: sticky; top: 150px; max-height: calc(100vh - 170px); overflow: auto; border-radius: 32px; padding: 18px; display: flex; flex-direction: column; gap: 16px; }
.tv__head, .tv__cur, .tv__sec, .tv__group { display: flex; flex-direction: column; gap: 6px; }
.tv__cur { gap: 12px; }
.tv__eyebrow { font: 600 11px var(--zg-font); letter-spacing: .12em; text-transform: uppercase; color: var(--zg-brand-text); }
.tv__title { font-size: 20px; }
.tv__desc, .tv__cur p { margin: 0; font-size: 13.5px; line-height: 1.55; color: var(--zg-text-2); }
.tv__link { font-size: 13px; color: var(--zg-brand-text); text-decoration: none; }
.tv__sep { height: 1px; background: var(--zg-stroke); }
.tv__curh { display: flex; align-items: baseline; gap: 10px; }
.tv__curh b { font-size: 17px; }
.tv__curh span { font-size: 12px; color: var(--zg-brand-text); }
.tv__item { all: unset; box-sizing: border-box; display: flex; align-items: center; gap: 10px; width: 100%; min-height: 40px; padding: 0 12px; border-radius: 14px; cursor: pointer; font: 500 14px var(--zg-font); color: var(--zg-text-1); }
.tv__item:hover { background: var(--zg-s2); }
.tv__item:focus-visible { outline: 2px solid var(--zg-brand); }
.tv__item[aria-current="true"] { background: var(--zg-brand-soft); color: var(--zg-brand-text); font-weight: 700; }
.tv__item code { margin-inline-start: auto; font: 600 11px var(--zg-font-mono); color: var(--zg-text-3); }
.tv__props { display: flex; flex-direction: column; border-radius: 18px; background: var(--zg-s1); box-shadow: var(--zg-rim); }
.tv__prop { display: grid; gap: 2px; padding: 10px 14px; }
.tv__prop--b { box-shadow: inset 0 1px 0 var(--zg-stroke); }
.tv__prop b { font-size: 13px; }
.tv__type { margin-inline-start: 8px; font-size: 11px; color: var(--zg-sky-text); }
.tv__pd { font-size: 12.5px; color: var(--zg-text-3); line-height: 1.45; }
@media (max-width: 1060px) { .tv__work { grid-template-columns: minmax(0, 1fr); } .tv__insp { position: static; max-height: none; } }
</style>
