<script setup lang="ts">
const cat = ref('g')
const q = ref('')
const CATS = [{ value: 'g', icon: 'info', label: 'General' }, { value: 'b', icon: 'calendar-check', label: 'Bookings' }, { value: 'v', icon: 'stamp', label: 'Visa' }]
const Q: Record<string, [string, string][]> = {
  g: [['What is ZiyaraGo?', 'A guide to Makkah and Madinah with hotels, places and prayer times.'], ['Is it free?', 'The basics are free. Plus adds offline guides.']],
  b: [['How do I book?', 'Open a hotel and press Reserve.'], ['Can I cancel?', 'Depends on the rate.']],
  v: [['Which visa fits me?', 'Open the visa checker and choose your passport.']],
}
const items = computed(() => Q[cat.value].map(([title, body], i) => ({ id: `${cat.value}${i}`, title, body })).filter(x => !q.value || x.title.toLowerCase().includes(q.value.toLowerCase())))
</script>

<template>
  <div class="tf">
    <div class="tf__hero">
      <h1>How can we help?</h1>
      <TplSlot id="search"><div class="tf__search"><UiSearchInput v-model="q" placeholder="Search questions" /></div></TplSlot>
    </div>
    <div class="tf__wrap">
      <div class="tf__aside"><TplSlot id="cats"><UiPillTabs vertical :items="CATS" :value="cat" @change="cat = $event" /></TplSlot></div>
      <div class="tf__main"><TplSlot id="answers"><UiAccordion :key="cat + q" :items="items" /></TplSlot></div>
    </div>
    <TplSlot id="contact">
      <div class="tf__auto">
        <UiCard title="Telegram" subtitle="Replies in minutes"><UiButton variant="primary" icon="send">Open chat</UiButton></UiCard>
        <UiCard title="Email" subtitle="support@ziyarago.com"><UiButton icon="mail">Write us</UiButton></UiCard>
      </div>
    </TplSlot>
  </div>
</template>

<style scoped>
.tf { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tf__hero { text-align: center; display: flex; flex-direction: column; gap: 12px; align-items: center; }
.tf__hero h1 { margin: 0; font: 300 clamp(28px, 3vw, 40px) var(--zg-font); letter-spacing: -.03em; }
.tf__search { width: min(480px, 100%); }
.tf__wrap { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.tf__aside { flex: 1 1 200px; min-width: 0; max-width: 100%; }
.tf__main { flex: 999 1 420px; min-width: 0; }
.tf__auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 16px; align-items: start; }
</style>
