<script setup lang="ts">
const annual = ref(false)
const FAQ = [
  { id: 1, title: 'Can I cancel anytime?', body: 'Yes. The plan stays active until the end of the paid period.' },
  { id: 2, title: 'Is Free really free?', body: 'Yes, no card required.' },
  { id: 3, title: 'Do you issue invoices?', body: 'Partners get invoices by email each month.' },
]
</script>

<template>
  <div class="tp">
    <div class="tp__hero">
      <h1>Pricing plans</h1>
      <span class="tp__sub">Free to start. Pay only when you grow.</span>
      <TplSlot id="toggle">
        <div class="tp__row">
          <span class="zg-hint">Monthly</span>
          <UiSwitch v-model="annual" />
          <span class="zg-hint">Annually</span>
          <UiChip tone="brand" size="sm" pill>Save up to 10%</UiChip>
        </div>
      </TplSlot>
    </div>
    <TplSlot id="plans">
      <div class="tp__auto">
        <UiPricingCard name="Free" price="$0" :features="['Prayer times', 'Hotels and places', '360° tours']" cta="Current plan" />
        <UiPricingCard name="Plus" :price="annual ? '$54' : '$4.99'" :period="annual ? '/ year' : '/ month'" badge="Popular" featured :features="['Offline guides', 'PDF trip plan', 'Telegram reminders']" cta="Get Plus" />
        <UiPricingCard name="Partner" :price="annual ? '$320' : '$29'" :period="annual ? '/ year' : '/ month'" :features="['Hotel listing', 'Bookings in CRM', 'Reports by email']" cta="Become a partner" />
      </div>
    </TplSlot>
    <TplSlot id="faq"><UiAccordion :items="FAQ" /></TplSlot>
  </div>
</template>

<style scoped>
.tp { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tp__hero { text-align: center; display: flex; flex-direction: column; gap: 8px; align-items: center; }
.tp__hero h1 { margin: 0; font: 300 clamp(28px, 3vw, 40px) var(--zg-font); letter-spacing: -.03em; }
.tp__sub { color: var(--zg-text-2); }
.tp__row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: center; }
.tp__auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 16px; align-items: start; }
</style>
