<script setup lang="ts">
const { s, resolved, set, start, BACKGROUNDS } = useDisplay()
onMounted(() => { const off = start(); onBeforeUnmount(off) })
const sw = ref(true)
const prog = ref(64)
const rows = [
  { id: 1, code: 'ZG-1042', guest: 'Ahmed Khan', hotel: 'Hilton Makkah', total: '4 250' },
  { id: 2, code: 'ZG-1043', guest: 'Fatima Noor', hotel: 'Pullman Zamzam', total: '6 120' },
  { id: 3, code: 'ZG-1044', guest: 'Yusuf Ali', hotel: 'Anwar Al Madinah', total: '2 380' },
]
</script>

<template>
  <section id="customize" class="lc">
    <div class="lc__head">
      <h2>Make it yours, right here</h2>
      <p>Change the theme, palette, direction, animations and background. This whole page, every card and button, follows your choice instantly. The same switches are one function call in your app.</p>
    </div>
    <div class="lc__grid">
      <UiCard class="lc__ctl" title="Appearance">
        <UiVStack :gap="16">
          <div class="lc__row"><span class="lc__l">Theme</span><UiSegmentedControl :modelValue="s.theme" :items="[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]" @update:model-value="set.theme" /></div>
          <div class="lc__row"><span class="lc__l">Palette</span><UiSegmentedControl :modelValue="s.palette" :items="[{ value: 'gold', label: 'Gold' }, { value: 'tamam', label: 'Tamam' }]" @update:model-value="set.palette" /></div>
          <div class="lc__row"><span class="lc__l">Direction</span><UiSegmentedControl :modelValue="s.dir" :items="[{ value: 'ltr', label: 'LTR' }, { value: 'rtl', label: 'RTL (Arabic)' }]" @update:model-value="set.dir" /></div>
          <div class="lc__row"><span class="lc__l">Animations</span><UiSegmentedControl :modelValue="s.motion" :items="[{ value: 'auto', label: 'Auto' }, { value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]" @update:model-value="set.motion" /></div>
          <div class="lc__row"><span class="lc__l">Effects</span><UiSegmentedControl :modelValue="s.effects" :items="[{ value: 'auto', label: 'Auto' }, { value: 'full', label: 'Full' }, { value: 'lite', label: 'Lite' }]" @update:model-value="set.effects" /></div>
          <div>
            <span class="lc__l">Background</span>
            <div class="lc__bgs">
              <button v-for="b in BACKGROUNDS" :key="b" type="button" class="lc__bg" :aria-pressed="String(s.bg === b)" @click="set.bg(b)">
                <span class="zg-bg lc__sw" :data-bg="b" :data-theme="s.theme" /><span>{{ b }}</span>
              </button>
            </div>
          </div>
          <p class="lc__hint">Now: animations {{ resolved.motion }}, effects {{ resolved.effects }}.</p>
        </UiVStack>
      </UiCard>

      <div class="lc__prev">
        <UiGrid :min="200" :gap="14">
          <UiCard variant="gradient" tone="brand" title="Gradient card"><span class="lc__t">Soft brand tone that follows the palette.</span></UiCard>
          <UiCard variant="gradient" tone="sky" intensity="vivid" title="Vivid sky"><span class="lc__t">Readable in dark and light.</span></UiCard>
          <UiKpiTile label="Revenue" value="$214k" delta="+8%" variant="brand" />
          <UiCard title="Controls">
            <UiVStack :gap="12"><UiSwitch v-model="sw" label="Notifications" /><UiProgress :value="prog" label="Progress" :meta="prog + '%'" /><UiSlider v-model="prog" /></UiVStack>
          </UiCard>
        </UiGrid>
        <UiCard title="Bookings" subtitle="Table, badges and avatars">
          <UiDataTable :columns="[{ key: 'code', label: 'Code' }, { key: 'guest', label: 'Guest' }, { key: 'hotel', label: 'Hotel' }, { key: 'total', label: 'Total, SAR', num: true }]" :rows="rows" />
        </UiCard>
        <UiAlert tone="info" title="Direction check">Switch to RTL and watch the layout mirror. Arabic text uses the Arabic font stack (Thmanyah Sans if you self-host it, otherwise a system Arabic font).</UiAlert>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lc { display: flex; flex-direction: column; gap: 24px; }
.lc__head h2 { margin: 0 0 8px; font: 300 clamp(28px, 4vw, 40px) var(--zg-font); letter-spacing: -.02em; }
.lc__head p { margin: 0; color: var(--zg-text-2); max-width: 70ch; line-height: 1.55; }
.lc__grid { display: grid; grid-template-columns: minmax(300px, 380px) minmax(0, 1fr); gap: 20px; align-items: start; }
.lc__prev { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.lc__row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.lc__l { font: 600 12px var(--zg-font); letter-spacing: .04em; text-transform: uppercase; color: var(--zg-text-3); }
.lc__bgs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 8px; }
.lc__bg { all: unset; box-sizing: border-box; display: flex; flex-direction: column; gap: 4px; align-items: center; cursor: pointer; font: 500 11px var(--zg-font); color: var(--zg-text-2); padding: 4px; border-radius: 12px; }
.lc__bg:hover { background: var(--zg-s2); }
.lc__bg:focus-visible { outline: 2px solid var(--zg-brand); }
.lc__bg[aria-pressed="true"] { background: var(--zg-brand-soft); color: var(--zg-brand-text); }
.lc__sw { width: 100%; height: 36px; border-radius: 10px; box-shadow: inset 0 0 0 1px var(--zg-stroke); background-color: var(--zg-bg); background-attachment: scroll !important; }
.lc__hint { margin: 0; font-size: 12.5px; color: var(--zg-text-3); }
.lc__t { font-size: 14px; line-height: 1.5; }
@media (max-width: 900px) { .lc__grid { grid-template-columns: minmax(0, 1fr); } }
</style>
