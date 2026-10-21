<script setup lang="ts">
const tag = ref('all')
const email = ref('')
const TONE: Record<string, string> = { new: 'success', improved: 'brand', fix: 'warning' }
const R = [
  { v: '0.7.0', d: '21 Oct 2026', t: 'Wave 2 templates', items: [{ k: 'new', x: 'Billing, Team, Integrations and Search page templates' }, { k: 'improved', x: 'Sticky side columns on long pages' }, { k: 'fix', x: 'Kanban board no longer clips cards in RTL' }] },
  { v: '0.6.2', d: '30 Sep 2026', t: 'Date pickers', items: [{ k: 'improved', x: 'RangeCalendar keyboard navigation' }, { k: 'fix', x: 'DatePicker reopened at the wrong month' }] },
  { v: '0.6.0', d: '02 Sep 2026', t: 'Map and Tour', items: [{ k: 'new', x: 'Map component with markers' }, { k: 'new', x: 'Tour popover for product walkthroughs' }] },
]
const shown = computed(() => R.map(r => ({ ...r, items: r.items.filter(i => tag.value === 'all' || i.k === tag.value) })).filter(r => r.items.length))
</script>

<template>
  <div class="tg">
    <UiPageHeader title="Changelog" subtitle="What shipped, what improved, what we fixed" />
    <div class="tg__two">
      <div class="tg__main">
        <TplSlot id="filters"><UiFilterChips v-model="tag" :items="[{ value: 'all', label: 'All' }, { value: 'new', label: 'New' }, { value: 'improved', label: 'Improved' }, { value: 'fix', label: 'Fixes' }]" /></TplSlot>
        <TplSlot id="timeline">
          <div class="tg__tl">
            <div v-for="r in shown" :key="r.v" class="tg__rel">
              <div class="tg__when"><b>v{{ r.v }}</b><small>{{ r.d }}</small></div>
              <UiCard :title="r.t">
                <ul class="tg__list"><li v-for="i in r.items" :key="i.x"><UiChip :tone="(TONE[i.k] as any)" size="sm">{{ i.k }}</UiChip><span>{{ i.x }}</span></li></ul>
              </UiCard>
            </div>
          </div>
        </TplSlot>
      </div>
      <div class="tg__side">
        <div class="tg__stick">
          <TplSlot id="subscribe">
            <UiCard title="Get release notes">
              <div class="tg__sub"><span class="zg-hint">One short email per release. No spam.</span><UiTextField v-model="email" label="Email" icon="mail" placeholder="you@mail.com" /><UiButton variant="primary" block>Subscribe</UiButton></div>
            </UiCard>
          </TplSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tg { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tg__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch; }
.tg__main { flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.tg__side { flex: 1 1 300px; min-width: 0; }
.tg__stick { position: sticky; top: 16px; }
.tg__tl { display: flex; flex-direction: column; gap: 16px; }
.tg__rel { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 16px; align-items: start; }
.tg__when { display: flex; flex-direction: column; padding-top: 18px; }
.tg__when small { color: var(--zg-text-3); }
.tg__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.tg__list li { display: flex; gap: 10px; align-items: center; font-size: 14px; color: var(--zg-text-2); }
.tg__sub { display: flex; flex-direction: column; gap: 12px; }
@media (max-width: 860px) { .tg__rel { grid-template-columns: 1fr; gap: 6px; } .tg__when { padding-top: 0; flex-direction: row; gap: 10px; align-items: baseline; } .tg__stick { position: static; } }
</style>
