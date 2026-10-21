<script setup lang="ts">
const f = ref('all')
const read = ref<number[]>([])
const G = [
  { day: 'Today', items: [{ id: 1, icon: 'credit-card', tone: 'success', title: 'Payment received', text: 'BK-2041 · SAR 18 400', time: '2 min ago' }, { id: 2, icon: 'message-circle', tone: 'brand', title: 'Aziz mentioned you', text: 'Can you confirm the room?', time: '1 h ago' }] },
  { day: 'Yesterday', items: [{ id: 3, icon: 'triangle-alert', tone: 'warning', title: 'Room overbooked', text: 'Hilton Suites, 14 May', time: '18:40' }, { id: 4, icon: 'user-plus', tone: 'sky', title: 'New lead', text: 'Omar Hassan · Hajj', time: '09:12' }] },
  { day: 'Earlier', items: [{ id: 5, icon: 'file-text', tone: 'neutral', title: 'Invoice ready', text: 'INV-883 for April', time: 'Mon' }] },
]
const groups = computed(() => G.map(g => ({ ...g, items: g.items.filter(i => f.value === 'all' || (f.value === 'unread' && !read.value.includes(i.id)) || (f.value === 'mentions' && i.id === 2)) })).filter(g => g.items.length))
const markAll = () => { read.value = G.flatMap(g => g.items.map(i => i.id)) }
</script>

<template>
  <div class="tn">
    <UiPageHeader title="Notifications" subtitle="Everything that happened in your workspace"><template #actions><UiButton icon="check-check" @click="markAll">Mark all read</UiButton></template></UiPageHeader>
    <TplSlot id="filters"><UiFilterChips v-model="f" :items="[{ value: 'all', label: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'mentions', label: 'Mentions' }]" /></TplSlot>
    <TplSlot id="feed">
      <div v-for="g in groups" :key="g.day" class="tn__g">
        <UiDivider :label="g.day" />
        <UiCard padding="none">
          <div v-for="i in g.items" :key="i.id" class="tn__row">
            <UiIconTile :icon="i.icon" :tone="i.tone as any" />
            <span class="tn__t"><b>{{ i.title }}</b><span>{{ i.text }}</span></span>
            <span class="zg-hint">{{ i.time }}</span>
            <UiBadge v-if="!read.includes(i.id)" tone="brand" dot>New</UiBadge>
          </div>
        </UiCard>
      </div>
    </TplSlot>
    <TplSlot id="empty"><UiEmptyState v-if="!groups.length" icon="bell-off" title="All caught up" description="No notifications match this filter." /></TplSlot>
  </div>
</template>

<style scoped>
.tn { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tn__g { display: flex; flex-direction: column; gap: 8px; }
.tn__row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; flex-wrap: wrap; }
.tn__row + .tn__row { box-shadow: 0 -1px 0 var(--zg-stroke); }
.tn__t { flex: 1 1 180px; min-width: 0; display: flex; flex-direction: column; font-size: 14px; }
.tn__t span { color: var(--zg-text-2); }
</style>
