<script setup lang="ts">
const view = ref('week')
const day = ref(new Date(2026, 4, 14))
const sel = ref(1)
const DAYS = ['Mon 11', 'Tue 12', 'Wed 13', 'Thu 14', 'Fri 15', 'Sat 16', 'Sun 17']
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
const EV = [
  { id: 1, d: 3, h: 9, len: 2, title: 'Hilton check-in', sub: 'Makkah · 12 guests', tone: 'brand' },
  { id: 2, d: 1, h: 10, len: 1, title: 'Visa review', sub: 'Documents desk', tone: 'sky' },
  { id: 3, d: 0, h: 13, len: 2, title: 'Airport transfer', sub: 'Jeddah T1', tone: 'success' },
  { id: 4, d: 4, h: 14, len: 1, title: 'Group briefing', sub: 'Online', tone: 'warning' },
  { id: 5, d: 5, h: 11, len: 3, title: 'Ziyarat tour', sub: 'Madinah', tone: 'brand' },
]
const shown = computed(() => view.value === 'day' ? EV.filter(e => e.d === 3) : EV)
const cols = computed(() => view.value === 'day' ? [DAYS[3]] : DAYS)
const cur = computed(() => EV.find(e => e.id === sel.value) ?? EV[0])
const MONTH = [{ date: '2026-05-14', label: 'Check-in' }, { date: '2026-05-12', label: 'Visa' }, { date: '2026-05-16', label: 'Tour' }, { date: '2026-05-20', label: 'Flight' }]
</script>

<template>
  <div class="tk">
    <UiPageHeader title="Calendar" subtitle="May 2026"><template #actions><UiButton variant="primary" icon="plus">New event</UiButton></template></UiPageHeader>
    <TplSlot id="toolbar">
      <div class="tk__bar"><UiSegmentedControl v-model="view" size="sm" :items="[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]" /><span class="tk__nav"><UiIconButton icon="chevron-left" label="Previous" /><UiButton size="sm">Today</UiButton><UiIconButton icon="chevron-right" label="Next" /></span></div>
    </TplSlot>
    <div class="tk__two">
      <div class="tk__main">
        <TplSlot id="grid">
          <UiCard v-if="view === 'month'" padding="md"><UiCalendarView :events="MONTH" :model-value="day" /></UiCard>
          <UiCard v-else padding="none">
            <div class="tk__scroll">
              <div class="tk__g" :style="{ '--n': cols.length }">
                <span class="tk__corner" style="grid-column: 1; grid-row: 1" />
                <b v-for="(c, ci) in cols" :key="c" class="tk__dh" :style="{ gridColumn: ci + 2, gridRow: 1 }">{{ c }}</b>
                <template v-for="(h, hi) in HOURS" :key="h">
                  <span class="tk__hr" :style="{ gridColumn: 1, gridRow: hi + 2 }">{{ String(h).padStart(2, '0') }}:00</span>
                  <span v-for="(c, ci) in cols" :key="c + h" class="tk__cell" :style="{ gridColumn: ci + 2, gridRow: hi + 2 }" />
                </template>
                <button v-for="e in shown" :key="e.id" type="button" class="tk__ev" :data-tone="e.tone" :data-on="sel === e.id ? 1 : 0" :style="{ gridColumn: (view === 'day' ? 0 : e.d) + 2, gridRow: `${e.h - 8 + 2} / span ${e.len}` }" @click="sel = e.id"><b>{{ e.title }}</b><span>{{ e.sub }}</span></button>
              </div>
            </div>
          </UiCard>
        </TplSlot>
      </div>
      <div class="tk__side">
        <TplSlot id="mini"><UiCard padding="sm"><UiCalendar v-model="day" /></UiCard></TplSlot>
        <TplSlot id="details">
          <UiCard :title="cur.title">
            <div class="tk__det">
              <UiDescriptions :items="[{ label: 'Date', value: DAYS[cur.d] + ' May' }, { label: 'Time', value: `${cur.h}:00 - ${cur.h + cur.len}:00` }, { label: 'Place', value: cur.sub }]" />
              <div class="tk__who"><UiAvatar name="Aziz Karimov" :size="32" /><UiAvatar name="Omar Hassan" :size="32" /><UiAvatar name="Laila Noor" :size="32" /><span class="zg-hint">3 guests</span></div>
              <div class="tk__act"><UiButton icon="pencil">Edit</UiButton><UiButton variant="danger" icon="trash-2">Cancel</UiButton></div>
            </div>
          </UiCard>
        </TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tk { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tk__bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.tk__nav { display: inline-flex; align-items: center; gap: 6px; }
.tk__two { display: flex; gap: 16px; align-items: flex-start; }
.tk__main { flex: 1 1 0; min-width: 0; }
.tk__side { flex: 0 0 320px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tk__scroll { overflow-x: auto; }
.tk__g { display: grid; grid-template-columns: 56px repeat(var(--n), minmax(110px, 1fr)); grid-auto-rows: 56px; grid-template-rows: 44px; min-width: 0; position: relative; }
.tk__dh { display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--zg-text-2); box-shadow: inset 0 -1px 0 var(--zg-stroke); }
.tk__corner { box-shadow: inset 0 -1px 0 var(--zg-stroke); }
.tk__hr { font-size: 11px; color: var(--zg-text-3); padding: 4px 8px 0 0; text-align: end; }
.tk__cell { box-shadow: inset 1px 1px 0 var(--zg-stroke); }
.tk__ev { margin: 2px 4px; padding: 6px 8px; border: 0; border-radius: 12px; text-align: start; font: inherit; font-size: 12px; cursor: pointer; display: flex; flex-direction: column; overflow: hidden; color: var(--zg-text-1); background: color-mix(in oklch, var(--ev) 22%, var(--zg-s1)); box-shadow: inset 3px 0 0 var(--ev); z-index: 1; }
.tk__ev[data-tone='brand'] { --ev: var(--zg-brand); }
.tk__ev[data-tone='sky'] { --ev: var(--zg-sky, var(--zg-brand)); }
.tk__ev[data-tone='success'] { --ev: var(--zg-green); }
.tk__ev[data-tone='warning'] { --ev: var(--zg-amber); }
.tk__ev[data-on='1'] { box-shadow: inset 3px 0 0 var(--ev), 0 0 0 2px var(--ev); }
.tk__ev span { color: var(--zg-text-2); }
.tk__det { display: flex; flex-direction: column; gap: 14px; }
.tk__who { display: flex; align-items: center; gap: 6px; }
.tk__act { display: flex; gap: 8px; flex-wrap: wrap; }
@media (max-width: 860px) { .tk__two { flex-direction: column; align-items: stretch; } .tk__side { flex-basis: auto; } }
</style>
