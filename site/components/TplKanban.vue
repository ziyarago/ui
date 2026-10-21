<script setup lang="ts">
const f = ref('all')
const q = ref('')
const open = ref(2)
const done = ref([true, false, false])
const COLS = [
  { title: 'To do', cards: [{ id: 1, title: 'Confirm Hilton block', sub: 'Due Fri', tag: 'Hotels', tone: 'brand' }, { id: 2, title: 'Print visa packets', sub: 'Due Mon', tag: 'Visas', tone: 'warning' }] },
  { title: 'In progress', cards: [{ id: 3, title: 'Group transfer plan', sub: 'Aziz K.', tag: 'Transport', tone: 'info' }, { id: 4, title: 'Pilgrim briefing deck', sub: 'Laila N.', tag: 'Content', tone: 'brand' }] },
  { title: 'Review', cards: [{ id: 5, title: 'Invoice INV-883', sub: 'Finance', tag: 'Billing', tone: 'success' }] },
  { title: 'Done', cards: [{ id: 6, title: 'Flight manifest', sub: 'Shipped', tag: 'Flights', tone: 'success' }] },
]
const cols = computed(() => COLS.map(c => ({ ...c, cards: c.cards.filter(k => (f.value === 'all' || k.tag.toLowerCase() === f.value) && k.title.toLowerCase().includes(q.value.toLowerCase())) })))
const card = computed(() => COLS.flatMap(c => c.cards).find(k => k.id === open.value))
</script>

<template>
  <div class="tb">
    <UiPageHeader title="Tasks" subtitle="Umrah season board"><template #actions><UiButton variant="primary" icon="plus">New task</UiButton></template></UiPageHeader>
    <TplSlot id="filters">
      <div class="tb__bar"><div class="tb__q"><UiSearchInput v-model="q" placeholder="Search tasks" /></div><UiFilterChips v-model="f" :items="[{ value: 'all', label: 'All' }, { value: 'hotels', label: 'Hotels' }, { value: 'visas', label: 'Visas' }, { value: 'transport', label: 'Transport' }]" /></div>
    </TplSlot>
    <div class="tb__two">
      <div class="tb__main">
        <TplSlot id="board">
          <div class="tb__board">
            <UiKanbanColumn v-for="c in cols" :key="c.title" :title="c.title" :count="c.cards.length" class="tb__col">
              <UiKanbanCard v-for="k in c.cards" :key="k.id" :title="k.title" :sub="k.sub" :tag="k.tag" :tone="k.tone as any" class="tb__card" :data-on="open === k.id ? 1 : 0" @click="open = k.id" />
            </UiKanbanColumn>
          </div>
        </TplSlot>
      </div>
      <div class="tb__side">
        <TplSlot id="detail">
          <UiCard v-if="card" :title="card.title">
            <div class="tb__det">
              <UiDescriptions :items="[{ label: 'Status', value: 'In progress' }, { label: 'Assignee', value: 'Aziz Karimov' }, { label: 'Label', value: card.tag }, { label: 'Due', value: card.sub }]" />
              <UiCheckbox v-model="done[0]" label="Collect passports" /><UiCheckbox v-model="done[1]" label="Book rooms" /><UiCheckbox v-model="done[2]" label="Notify the group" />
              <UiTimeline :items="[{ title: 'Moved to In progress', time: '2 h ago' }, { title: 'Created', text: 'by Laila N.', time: 'Mon' }]" />
            </div>
          </UiCard>
        </TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tb { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tb__bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.tb__q { flex: 1 1 220px; max-width: 320px; }
.tb__two { display: flex; gap: 16px; align-items: flex-start; }
.tb__main { flex: 1 1 0; min-width: 0; }
.tb__side { flex: 0 0 320px; min-width: 0; }
.tb__board { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 6px; align-items: flex-start; }
.tb__col { flex: 0 0 240px; }
.tb__card { cursor: pointer; }
.tb__card[data-on='1'] { box-shadow: 0 0 0 2px var(--zg-brand); }
.tb__det { display: flex; flex-direction: column; gap: 12px; }
@media (max-width: 860px) { .tb__two { flex-direction: column; align-items: stretch; } .tb__side { flex-basis: auto; } }
</style>
