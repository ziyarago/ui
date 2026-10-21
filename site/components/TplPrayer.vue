<script setup lang="ts">
type City = { label: string, sub: string, bearing: number, dist: string, base: number[] }
const CITIES: Record<string, City> = {
  madinah: { label: 'Madinah', sub: 'Saudi Arabia', bearing: 186, dist: '340 km to the Kaaba', base: [5 * 60 + 17, 6 * 60 + 38, 12 * 60 + 29, 15 * 60 + 47, 18 * 60 + 20, 19 * 60 + 40] },
  tashkent: { label: 'Tashkent', sub: 'Uzbekistan', bearing: 246, dist: '3 960 km to the Kaaba', base: [5 * 60 + 3, 6 * 60 + 27, 12 * 60 + 36, 16 * 60 + 5, 18 * 60 + 41, 20 * 60 + 2] },
  istanbul: { label: 'Istanbul', sub: 'Turkey', bearing: 151, dist: '2 360 km to the Kaaba', base: [5 * 60 + 29, 6 * 60 + 56, 12 * 60 + 37, 15 * 60 + 39, 18 * 60 + 8, 19 * 60 + 31] },
  jakarta: { label: 'Jakarta', sub: 'Indonesia', bearing: 295, dist: '7 920 km to the Kaaba', base: [4 * 60 + 41, 5 * 60 + 53, 12 * 60 + 1, 15 * 60 + 8, 18 * 60 + 5, 19 * 60 + 13] },
}
const METHODS = [{ value: 'uq', label: 'Umm al-Qura, Makkah' }, { value: 'mwl', label: 'Muslim World League' }, { value: 'isna', label: 'ISNA, North America' }, { value: 'egy', label: 'Egyptian General Authority' }]
const city = ref('madinah')
const method = ref('uq')
const NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
const DRIFT = [-0.8, -0.75, 0, 0.3, 0.7, 0.7]
const TODAY = 8
const NOW = 15 * 60 + 12
const f = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.round(m) % 60).padStart(2, '0')}`
const mins = (c: City, day: number) => c.base.map((b, i) => b + DRIFT[i] * (day - TODAY))
const c = computed(() => CITIES[city.value])
const today = computed(() => mins(c.value, TODAY))
const PRAYERS = [0, 2, 3, 4, 5]
const items = computed(() => PRAYERS.map(i => ({ name: NAMES[i], time: f(today.value[i]) })))
const next = computed(() => { const k = PRAYERS.findIndex(i => today.value[i] > NOW); return k < 0 ? 0 : k })
const left = computed(() => { const t = today.value[PRAYERS[next.value]]; const d = Math.round(t - NOW); return d < 60 ? `${d} min` : `${Math.floor(d / 60)} h ${d % 60} min` })
const COLS = [{ key: 'date', label: 'Date' }, ...NAMES.map((n, i) => ({ key: 'p' + i, label: n, num: true }))]
const rows = computed(() => Array.from({ length: 31 }, (_, k) => { const day = k + 1; const m = mins(c.value, day); const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(day - 1) % 7]; return { id: day, date: day === TODAY ? `${wd}, ${day} Mar (today)` : `${wd}, ${day} Mar`, ...Object.fromEntries(m.map((v, i) => [`p${i}`, f(v)])) } }))
const cityOpts = Object.entries(CITIES).map(([value, v]) => ({ value, label: `${v.label}, ${v.sub}` }))
</script>

<template>
  <div class="tp">
    <UiPageHeader title="Prayer times" subtitle="Sunday, 8 March 2026 · 19 Ramadan 1447" :crumbs="[{ label: 'Pilgrim tools' }, { label: 'Prayer times' }]" />
    <TplSlot id="location">
      <div class="tp__loc">
        <div class="tp__f"><UiSelect v-model="city" label="City" :options="cityOpts" /></div>
        <div class="tp__f"><UiSelect v-model="method" label="Calculation method" :options="METHODS" /></div>
        <UiButton icon="locate">Use my location</UiButton>
      </div>
    </TplSlot>
    <div class="tp__two">
      <div class="tp__main">
        <TplSlot id="today">
          <UiCard>
            <div class="tp__today">
              <div class="tp__hero">
                <span class="zg-hint">Next prayer</span>
                <b class="tp__name">{{ items[next].name }}</b>
                <span class="tp__time zg-num">{{ items[next].time }}</span>
                <UiChip tone="brand" pill icon="timer">in {{ left }}</UiChip>
              </div>
              <div class="tp__side">
                <UiStatRow title="Sunrise" :sub="c.label" :value="f(today[1])" icon="sunrise" />
                <UiStatRow title="Sunset" :sub="c.label" :value="f(today[4])" icon="sunset" />
              </div>
            </div>
            <UiPrayerTimes :items="items" :next="next" />
            <div class="tp__ram"><span class="zg-hint">Ramadan, day 19 of 30</span><UiRamadanTracker :day="19" /></div>
          </UiCard>
        </TplSlot>
        <TplSlot id="month">
          <UiCard title="March 2026" :subtitle="`${c.label} · ${METHODS.find(m => m.value === method)?.label}`">
            <div class="tp__scroll"><UiDataTable :columns="COLS" :rows="rows" /></div>
          </UiCard>
        </TplSlot>
      </div>
      <div class="tp__aside">
        <div class="tp__stick">
          <TplSlot id="qibla">
            <UiCard title="Qibla" :subtitle="`From ${c.label}`">
              <div class="tp__q"><UiQiblaCompass :bearing="c.bearing" :distance="c.dist" size="lg" /><span class="zg-hint">Point the top of your phone to the north and follow the Kaaba marker.</span></div>
            </UiCard>
          </TplSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tp { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tp__loc { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; }
.tp__f { flex: 1 1 220px; max-width: 320px; min-width: 0; }
.tp__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch; }
.tp__main { flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.tp__aside { flex: 1 1 300px; min-width: 0; }
.tp__stick { position: sticky; top: 16px; }
.tp__today { display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch; margin-bottom: 16px; }
.tp__hero { flex: 1 1 240px; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 20px; border-radius: 24px; background: radial-gradient(70% 90% at 90% 0, color-mix(in oklch, var(--zg-brand) 30%, transparent), transparent), var(--zg-s2); box-shadow: var(--zg-rim); }
.tp__name { font: 300 clamp(28px, 4vw, 40px)/1 var(--zg-font); letter-spacing: -.03em; }
.tp__time { font-size: clamp(34px, 5vw, 52px); line-height: 1; color: var(--zg-brand-text); }
.tp__side { flex: 1 1 200px; display: flex; flex-direction: column; justify-content: center; gap: 8px; min-width: 0; }
.tp__ram { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.tp__scroll { max-height: 440px; overflow: auto; }
.tp__scroll :deep(table) { min-width: 640px; }
.tp__scroll :deep(th), .tp__scroll :deep(td) { white-space: nowrap; }
.tp__q { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
@media (max-width: 860px) { .tp__stick { position: static; } }
</style>
