<script setup lang="ts">
const q = ref('')
const CATS = [{ i: 'rocket', t: 'Getting started', n: 12 }, { i: 'credit-card', t: 'Billing and payments', n: 18 }, { i: 'calendar-check', t: 'Bookings', n: 24 }, { i: 'user', t: 'Account and security', n: 9 }, { i: 'plane', t: 'Visas and travel', n: 15 }, { i: 'plug', t: 'Integrations', n: 7 }]
const POP = ['How do I change my booking dates?', 'Where can I find my invoice?', 'How to invite a teammate', 'What is the cancellation policy?', 'Resetting your password']
</script>

<template>
  <div class="th">
    <UiPageHeader title="Help center" subtitle="Find answers or talk to a person" />
    <TplSlot id="search">
      <div class="th__hero"><h2>How can we help?</h2><div class="th__s"><UiSearchInput v-model="q" size="lg" placeholder="Search articles" /></div></div>
    </TplSlot>
    <TplSlot id="categories">
      <div class="th__cats"><UiCard v-for="c in CATS" :key="c.t"><div class="th__cat"><UiIconTile :icon="c.i" tone="brand" /><span><b>{{ c.t }}</b><small>{{ c.n }} articles</small></span></div></UiCard></div>
    </TplSlot>
    <div class="th__row">
      <TplSlot id="popular">
        <UiCard title="Popular articles">
          <div v-for="p in POP" :key="p" class="th__a"><UiIcon name="file-text" :size="18" /><span class="th__tx">{{ p }}</span><UiIcon name="chevron-right" :size="16" class="th__ch" /></div>
        </UiCard>
      </TplSlot>
      <TplSlot id="contact">
        <UiCard title="Still need help?">
          <div class="th__c"><span class="zg-hint">Our team replies within one working day.</span><UiButton variant="primary" icon="message-circle" block>Start a chat</UiButton><UiButton icon="mail" block>Email support</UiButton></div>
        </UiCard>
      </TplSlot>
    </div>
  </div>
</template>

<style scoped>
.th { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.th__hero { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; padding: clamp(28px, 5vw, 56px) 16px; border-radius: 28px; background: radial-gradient(60% 90% at 50% 0, color-mix(in oklch, var(--zg-brand) 26%, transparent), transparent), var(--zg-s1); box-shadow: var(--zg-rim); }
.th__hero h2 { margin: 0; font: 600 clamp(24px, 3.4vw, 36px)/1.2 var(--zg-font); }
.th__s { width: min(100%, 560px); }
.th__cats { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 16px; }
.th__cat { display: flex; align-items: center; gap: 14px; }
.th__cat span { display: flex; flex-direction: column; min-width: 0; font-size: 14px; }
.th__cat small { color: var(--zg-text-3); }
.th__row { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr)); gap: 16px; align-items: start; }
.th__a { display: flex; align-items: center; gap: 12px; padding: 12px 0; color: var(--zg-text-1); text-decoration: none; font-size: 14px; }
.th__a + .th__a { box-shadow: 0 -1px 0 var(--zg-stroke); }
.th__tx { flex: 1; min-width: 0; }
.th__ch { color: var(--zg-text-3); }
.th__c { display: flex; flex-direction: column; gap: 10px; }
:global([dir="rtl"]) .th__ch { transform: scaleX(-1); }
</style>
