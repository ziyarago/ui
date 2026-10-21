<script setup lang="ts">
const FEATURES = [
  { icon: 'map-pin', tone: 'brand', title: 'Places and routes', text: 'Every holy site with hours, crowd level and a walking route.' },
  { icon: 'hotel', tone: 'sky', title: 'Hotels near Haram', text: 'Compare rooms by distance, view and cancellation terms.' },
  { icon: 'clock', tone: 'success', title: 'Prayer times', text: 'Accurate times for Makkah and Madinah with gentle reminders.' },
  { icon: 'wifi-off', tone: 'warning', title: 'Offline guides', text: 'Download a guide once and use it without a connection.' },
  { icon: 'languages', tone: 'neutral', title: '16 languages', text: 'Arabic, Uzbek, Turkish and more, with full right-to-left support.' },
  { icon: 'shield-check', tone: 'danger', title: 'Safe payments', text: 'Pay in your currency with refunds handled for you.' },
]
const STATS = [{ icon: 'users', tone: 'brand', value: '20k+', label: 'Pilgrims' }, { icon: 'building-2', tone: 'sky', value: '340', label: 'Hotels' }, { icon: 'star', tone: 'warning', value: '4.8', label: 'Average rating' }]
const QUOTES = [
  { name: 'Aziz Karimov', text: 'The offline guide saved our group in Madinah when roaming stopped working.' },
  { name: 'Dilnoza Rahimova', text: 'Booking the hotel and the transfer took ten minutes.' },
]
</script>

<template>
  <div class="tl">
    <TplSlot id="hero">
      <div class="tl__hero">
        <UiChip tone="brand" pill size="sm" icon="sparkles">New: offline guides</UiChip>
        <h1>Your Umrah, planned in one place</h1>
        <p>Hotels, tours and prayer times for Makkah and Madinah, in your language.</p>
        <div class="tl__row"><UiButton variant="primary" size="lg" iconRight="arrow-right">Get started</UiButton><UiButton size="lg" icon="play">Watch demo</UiButton></div>
      </div>
    </TplSlot>
    <TplSlot id="logos">
      <div class="tl__logos"><span class="zg-hint">Trusted by agencies in</span><UiChip pill>Tashkent</UiChip><UiChip pill>Istanbul</UiChip><UiChip pill>Jakarta</UiChip><UiChip pill>Dubai</UiChip><UiChip pill>Kuala Lumpur</UiChip></div>
    </TplSlot>
    <TplSlot id="features">
      <div class="tl__grid">
        <UiCard v-for="f in FEATURES" :key="f.title"><div class="tl__feat"><UiIconTile :icon="f.icon" :tone="f.tone as any" /><b>{{ f.title }}</b><span>{{ f.text }}</span></div></UiCard>
      </div>
    </TplSlot>
    <TplSlot id="proof">
      <div class="tl__proof">
        <UiStatStrip :items="STATS" />
        <div class="tl__grid tl__grid--2">
          <UiCard v-for="q in QUOTES" :key="q.name"><div class="tl__quote"><p>"{{ q.text }}"</p><UiUserCell :name="q.name" sub="Verified traveler" /></div></UiCard>
        </div>
      </div>
    </TplSlot>
    <TplSlot id="pricing">
      <div class="tl__grid tl__grid--2">
        <UiPricingCard name="Free" price="$0" :features="['Prayer times', 'Hotels and places']" cta="Start free" />
        <UiPricingCard name="Plus" price="$4.99" period="/ month" badge="Popular" featured :features="['Offline guides', 'PDF trip plan']" cta="Get Plus" />
      </div>
    </TplSlot>
    <TplSlot id="cta">
      <UiCard variant="gradient"><div class="tl__cta"><b>Ready for your journey?</b><span>Join 20 000 pilgrims who plan with ZiyaraGo.</span><UiButton variant="inverse" size="lg">Create free account</UiButton></div></UiCard>
    </TplSlot>
    <TplSlot id="footer"><UiFooter copyright="© 2026 ZiyaraGo" :links="[{ label: 'About' }, { label: 'Pricing' }, { label: 'Privacy' }, { label: 'Terms' }]" /></TplSlot>
  </div>
</template>

<style scoped>
.tl { display: flex; flex-direction: column; gap: 28px; min-width: 0; padding: clamp(16px, 3vw, 40px); }
.tl__hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; padding: clamp(32px, 6vw, 80px) 16px; border-radius: 32px; background: radial-gradient(60% 80% at 50% 0, color-mix(in oklch, var(--zg-brand) 28%, transparent), transparent), var(--zg-s1); box-shadow: var(--zg-rim); }
.tl__hero h1 { margin: 0; max-width: 18ch; font: 300 clamp(34px, 5vw, 64px)/1.05 var(--zg-font); letter-spacing: -.04em; }
.tl__hero p { margin: 0; max-width: 46ch; color: var(--zg-text-2); font-size: 17px; }
.tl__row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.tl__logos { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: center; }
.tl__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 16px; align-items: stretch; }
.tl__grid--2 { grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); }
.tl__feat { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.tl__feat span { color: var(--zg-text-2); font-size: 14px; line-height: 1.5; }
.tl__proof { display: flex; flex-direction: column; gap: 16px; }
.tl__quote { display: flex; flex-direction: column; gap: 12px; }
.tl__quote p { margin: 0; font-size: 16px; line-height: 1.5; }
.tl__cta { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: clamp(16px, 3vw, 32px); }
.tl__cta b { font: 300 clamp(26px, 3vw, 38px) var(--zg-font); letter-spacing: -.03em; }
</style>
