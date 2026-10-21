<script setup lang="ts">
import { LOCALES, FREE_LOCALES, RTL_LOCALES } from '../../../src/i18n/index.js'
useSeo({ title: 'Localization — @ziyarago/ui', description: 'Built-in component strings in 16 languages: English, Arabic and Russian free, 13 more in the Pro language pack. Switching language, RTL, overriding strings and syncing with vue-i18n.' })

const NAMES: Record<string, string> = { en: 'English', ar: 'العربية', ru: 'Русский', uz: 'Oʻzbekcha', tg: 'Тоҷикӣ', tr: 'Türkçe', fr: 'Français', fa: 'فارسی', hi: 'हिन्दी', ur: 'اردو', bn: 'বাংলা', id: 'Indonesia', kk: 'Қазақша', ky: 'Кыргызча', ms: 'Melayu', ha: 'Hausa' }
const langs = (LOCALES as string[]).map(code => ({ code, name: NAMES[code], free: (FREE_LOCALES as string[]).includes(code), rtl: (RTL_LOCALES as string[]).includes(code) }))

const files = import.meta.glob('../../../src/i18n/components/[A-Z]*.js', { eager: true }) as Record<string, { default: Record<string, Record<string, string>> }>
const comps = Object.entries(files).map(([path, m]) => ({ name: path.split('/').pop()!.replace('.js', ''), keys: Object.entries(m.default.en) })).sort((a, b) => a.name.localeCompare(b.name))
const q = ref('')
const shown = computed(() => comps.filter(c => !q.value || c.name.toLowerCase().includes(q.value.toLowerCase())))

const basic = `import { setUiLocale } from '@ziyarago/ui/i18n'
setUiLocale('ru')                    // components re-render by themselves

// with the theme controller: also sets <html lang> and dir (rtl for ar, fa, ur) and remembers the choice
import { useUiTheme } from '@ziyarago/ui/vue'   // or '@ziyarago/ui/react'
useUiTheme().setLocale('ar')`
const override = `import { setUiMessages } from '@ziyarago/ui/i18n'
setUiMessages('ru', { Pagination: { prev: 'Назад', next: 'Вперёд' } })   // wins over the built-in text
setUiMessages('ru', null)                                               // clear overrides for a locale`
const i18n = `// vue-i18n: follow the app language
import { watch } from 'vue'
import { setUiLocale } from '@ziyarago/ui/i18n'
watch(() => i18n.global.locale.value, l => setUiLocale(l), { immediate: true })`
const pro = `import '@ziyarago/ui-pro/languages'       // Pro pack: once, before mount
import { setUiLocale } from '@ziyarago/ui/i18n'
setUiLocale('uz')`
const order = `1. a prop of the component (labels, label, placeholder, ariaLabel ...)
2. setUiMessages(locale, ...) from your app
3. the built-in text for the current locale
4. English`
</script>

<template>
  <article class="g">
    <h1>Localization</h1>
    <p class="lead">Built-in texts of the components (Close, Next, Search, validation messages, dates) have their own translator. It does not depend on the i18n library of your app, so it works the same in Vue, Nuxt and React.</p>

    <h2>Languages</h2>
    <p>English, Arabic and Russian are included in <code>@ziyarago/ui</code>. The other 13 come with the Pro language pack. A language without strings shows English, nothing breaks.</p>
    <div class="langs">
      <div v-for="l in langs" :key="l.code" class="lang">
        <b>{{ l.code }}</b><span :dir="l.rtl ? 'rtl' : 'ltr'">{{ l.name }}</span>
        <UiBadge :tone="l.free ? 'success' : 'brand'">{{ l.free ? 'Free' : 'Pro' }}</UiBadge>
        <UiBadge v-if="l.rtl">RTL</UiBadge>
      </div>
    </div>

    <h2>Switch the language</h2>
    <pre class="code">{{ basic }}</pre>
    <h2>Override single texts</h2>
    <pre class="code">{{ override }}</pre>
    <p>Which text wins:</p>
    <pre class="code">{{ order }}</pre>
    <h2>Sync with vue-i18n</h2>
    <pre class="code">{{ i18n }}</pre>
    <h2>Pro language pack</h2>
    <p>Install <code>@ziyarago/ui-pro/languages</code> (private, access after purchase), import it once and use the codes above.</p>
    <pre class="code">{{ pro }}</pre>

    <h2>Texts per component</h2>
    <p class="muted">{{ comps.length }} components have built-in texts. Use the keys below with <code>setUiMessages</code>. Components not listed have no default texts.</p>
    <UiSearchInput v-model="q" placeholder="Filter components" />
    <div class="tbl"><div v-for="c in shown" :key="c.name" class="row"><b>{{ c.name }}</b><span><code v-for="[k, v] in c.keys" :key="k" :title="v">{{ k }}</code></span></div></div>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 20px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; }
.muted { margin: 0; color: var(--zg-text-3); font-size: 14px; }
p { margin: 0; color: var(--zg-text-2); max-width: 70ch; line-height: 1.6; }
code { font-family: var(--zg-font-mono); font-size: .92em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; overflow-wrap: anywhere; }
.code { margin: 0; padding: 16px; border-radius: 14px; background: var(--zg-s2); font: 13px/1.6 var(--zg-font-mono); overflow-x: auto; max-width: 100%; }
.langs { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; }
.lang { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 14px; box-shadow: inset 0 0 0 1px var(--zg-stroke); }
.lang b { font-family: var(--zg-font-mono); text-transform: uppercase; width: 28px; }
.lang span { flex: 1; color: var(--zg-text-1); }
.tbl { display: flex; flex-direction: column; border-radius: 14px; box-shadow: inset 0 0 0 1px var(--zg-stroke); overflow: hidden; }
.row { display: grid; grid-template-columns: minmax(150px, 220px) minmax(0, 1fr); gap: 16px; padding: 10px 16px; color: var(--zg-text-2); font-size: 14px; }
.row + .row { box-shadow: inset 0 1px 0 var(--zg-stroke); }
.row b { color: var(--zg-text-1); font-weight: 600; }
.row span { display: flex; gap: 6px; flex-wrap: wrap; }
@media (max-width: 700px) { .row { grid-template-columns: minmax(0, 1fr); gap: 4px; } }
</style>
