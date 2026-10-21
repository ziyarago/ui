<script setup lang="ts">
import { BACKGROUNDS } from '@ziyarago/ui/theme'

const s = reactive({ theme: 'dark', palette: 'gold', dir: 'ltr', motion: 'auto', effects: 'auto', bg: 'none' })
const open = ref(false)
const root = ref<HTMLElement>()
const resolved = ref({ motion: 'on', effects: 'full' })
let ui: ReturnType<typeof useUiTheme>
let off: (() => void) | undefined

onMounted(() => {
  ui = useUiTheme()
  const sync = () => { Object.assign(s, ui.snapshot()); resolved.value = ui.resolved }
  sync()
  off = ui.subscribe(sync)
  const onDoc = (e: MouseEvent) => { if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false }
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') open.value = false }
  document.addEventListener('mousedown', onDoc)
  document.addEventListener('keydown', onKey)
  onBeforeUnmount(() => { off?.(); document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) })
})

const set = {
  theme: (v: string) => ui.setTheme(v), palette: (v: string) => ui.setPalette(v), dir: (v: string) => ui.setDir(v),
  motion: (v: string) => ui.setMotion(v), effects: (v: string) => ui.setEffects(v), bg: (v: string) => ui.setBackground(v),
}
</script>

<template>
  <div ref="root" class="ss">
    <UiSegmentedControl size="sm" :modelValue="s.theme" :items="[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]" @update:modelValue="set.theme" />
    <UiButton size="sm" class="ss__btn" aria-haspopup="dialog" :aria-expanded="String(open)" @click="open = !open"><UiIcon name="sliders-horizontal" :size="16" /> <span class="ss__t">Display</span></UiButton>

    <div v-if="open" class="ss__panel zg-pop" role="dialog" aria-label="Display settings">
      <div class="ss__row"><span class="ss__l">Theme</span><UiSegmentedControl size="sm" :modelValue="s.theme" :items="[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]" @update:modelValue="set.theme" /></div>
      <div class="ss__row"><span class="ss__l">Palette</span><UiSegmentedControl size="sm" :modelValue="s.palette" :items="[{ value: 'gold', label: 'Gold' }, { value: 'tamam', label: 'Tamam' }]" @update:modelValue="set.palette" /></div>
      <div class="ss__row"><span class="ss__l">Direction</span><UiSegmentedControl size="sm" :modelValue="s.dir" :items="[{ value: 'ltr', label: 'LTR' }, { value: 'rtl', label: 'RTL' }]" @update:modelValue="set.dir" /></div>
      <div class="ss__sep" />
      <div class="ss__row"><span class="ss__l">Animations</span><UiSegmentedControl size="sm" :modelValue="s.motion" :items="[{ value: 'auto', label: 'Auto' }, { value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]" @update:modelValue="set.motion" /></div>
      <div class="ss__row"><span class="ss__l">Effects</span><UiSegmentedControl size="sm" :modelValue="s.effects" :items="[{ value: 'auto', label: 'Auto' }, { value: 'full', label: 'Full' }, { value: 'lite', label: 'Lite' }]" @update:modelValue="set.effects" /></div>
      <p class="ss__hint">Now: animations {{ resolved.motion }}, effects {{ resolved.effects }}. Auto follows the system reduced-motion setting and the browser capability. Lite removes blur and glow for weak devices.</p>
      <div class="ss__sep" />
      <span class="ss__l">Background</span>
      <div class="ss__bgs">
        <button v-for="b in BACKGROUNDS" :key="b" type="button" class="ss__bg" :aria-pressed="String(s.bg === b)" :title="b" @click="set.bg(b)">
          <span class="zg-bg ss__sw" :data-bg="b" :data-theme="s.theme" />
          <span>{{ b }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ss { position: relative; display: flex; align-items: center; gap: 8px; }
.ss__btn { display: inline-flex; align-items: center; gap: 6px; }
.ss__panel { position: absolute; top: calc(100% + 10px); inset-inline-start: auto; inset-inline-end: 0; width: min(380px, calc(100vw - 24px)); min-width: 0; z-index: 70; padding: 16px; gap: 12px; }
.ss__row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.ss__l { font: 600 12px var(--zg-font); letter-spacing: .04em; text-transform: uppercase; color: var(--zg-text-3); }
.ss__sep { height: 1px; background: var(--zg-stroke); }
.ss__hint { margin: 0; font-size: 12.5px; line-height: 1.5; color: var(--zg-text-3); }
.ss__bgs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.ss__bg { all: unset; box-sizing: border-box; display: flex; flex-direction: column; gap: 4px; align-items: center; cursor: pointer; font: 500 11px var(--zg-font); color: var(--zg-text-2); padding: 4px; border-radius: 12px; }
.ss__bg:hover { background: var(--zg-s2); }
.ss__bg:focus-visible { outline: 2px solid var(--zg-brand); }
.ss__bg[aria-pressed="true"] { background: var(--zg-brand-soft); color: var(--zg-brand-text); }
.ss__sw { width: 100%; height: 36px; border-radius: 10px; box-shadow: inset 0 0 0 1px var(--zg-stroke); background-color: var(--zg-bg); background-attachment: scroll !important; }
@media (max-width: 700px) { .ss__t { display: none; } }
</style>
