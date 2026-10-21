<script setup lang="ts">
const dep = ref('mar08')
const pax = ref(2)
const DEPS = [{ value: 'mar08', label: '8 March · 8 seats left', p: 2450 }, { value: 'mar22', label: '22 March · 14 seats left', p: 2390 }, { value: 'apr05', label: '5 April · 20 seats left', p: 2290 }]
const price = computed(() => DEPS.find(d => d.value === dep.value)!.p)
const usd = (n: number) => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const TILES = [
  { icon: 'landmark', label: 'Masjid al-Haram', bg: 'radial-gradient(70% 70% at 25% 20%, color-mix(in oklch, var(--zg-amber) 55%, transparent), transparent), linear-gradient(135deg, var(--zg-brand), color-mix(in oklch, var(--zg-brand) 40%, var(--zg-bg)))' },
  { icon: 'moon', label: 'Al-Masjid an-Nabawi', bg: 'radial-gradient(70% 70% at 80% 20%, color-mix(in oklch, var(--zg-green) 55%, transparent), transparent), linear-gradient(135deg, color-mix(in oklch, var(--zg-green) 50%, var(--zg-s2)), var(--zg-s2))' },
  { icon: 'mountain', label: 'Jabal al-Nour', bg: 'linear-gradient(160deg, color-mix(in oklch, var(--zg-sky) 55%, transparent), transparent 70%), var(--zg-s2)' },
  { icon: 'building-2', label: 'Hotel by the Haram', bg: 'radial-gradient(60% 60% at 70% 30%, color-mix(in oklch, var(--zg-brand) 35%, transparent), transparent), var(--zg-s2)' },
  { icon: 'bus', label: 'Ziyarat tours', bg: 'linear-gradient(200deg, color-mix(in oklch, var(--zg-amber) 40%, transparent), transparent 70%), var(--zg-s2)' },
]
const FACTS = [{ icon: 'moon', tone: 'brand', value: '10', label: 'Nights' }, { icon: 'map-pin', tone: 'sky', value: '2', label: 'Cities' }, { icon: 'hotel', tone: 'success', value: '5', label: 'Star hotels' }, { icon: 'plane', tone: 'warning', value: 'Direct', label: 'Flights' }]
const HL = [{ icon: 'footprints', t: 'Hotel 150 m from the Haram', d: 'Walk to every prayer.' }, { icon: 'graduation-cap', t: 'Scholar-led guidance', d: 'Daily lessons on the rites of Umrah.' }, { icon: 'mountain', t: 'Ziyarat of historic sites', d: 'Quba, Uhud, Jabal al-Nour and Hira.' }, { icon: 'languages', t: 'Uzbek, Russian and Arabic', d: 'A guide for every group of 20.' }]
const DAYS = [
  { id: 'a', title: 'Days 1 and 2 · Flight and Madinah', body: 'Direct flight Tashkent to Madinah, hotel check-in and your first visit to the Prophet\'s Mosque. Day 2 is Rawdah and the ziyarat of Quba and Uhud.' },
  { id: 'b', title: 'Days 3 to 5 · Road to Makkah and Umrah', body: 'Ihram at Dhul Hulayfah, a coach to Makkah and the rites of Umrah led by your scholar: tawaf, sa\'i and halq.' },
  { id: 'c', title: 'Days 6 to 9 · Makkah', body: 'Free time for worship in the Haram, optional ziyarat of Jabal al-Nour and Hira, and the night prayers of Ramadan.' },
  { id: 'd', title: 'Day 10 · Farewell and return', body: 'Tawaf al-Wada, check-out and a transfer to Jeddah for the flight home.' },
]
const IN = ['Return flights Tashkent to Madinah and Jeddah', 'Umrah visa and insurance', '4 nights Madinah, 6 nights Makkah, breakfast included', 'Coach transfers and ziyarat tours', 'Guide and scholar for the whole trip']
const OUT = ['Personal expenses and lunches', 'Optional Taif excursion', 'Extra luggage above 30 kg']
const REV = [{ n: 'Aziz Karimov', r: 5, t: 'The hotel was a five-minute walk to the Haram and the guide knew every detail of the rites.' }, { n: 'Madina Yusupova', r: 5, t: 'Everything was organised, including Zamzam at the airport. Our parents felt safe the whole time.' }, { n: 'Jafar Rakhimov', r: 4, t: 'Great program. The coach to Makkah was long, but the stops were well planned.' }]
</script>

<template>
  <div class="tt">
    <TplSlot id="header">
      <UiPageHeader title="Ramadan Umrah, 10 days" subtitle="Tashkent · Madinah · Makkah · 5-star hotels near the Haram" :crumbs="[{ label: 'Tours' }, { label: 'Umrah' }, { label: 'Ramadan Umrah' }]">
        <template #actions><div class="tt__row"><UiIconButton icon="share-2" label="Share" /><UiIconButton icon="heart" label="Save" /></div></template>
      </UiPageHeader>
    </TplSlot>
    <TplSlot id="gallery">
      <div class="tt__gal">
        <div v-for="(g, i) in TILES" :key="g.label" class="tt__tile" :class="{ big: i === 0 }" :style="{ background: g.bg }" role="img" :aria-label="g.label">
          <UiIcon :name="g.icon" :size="i === 0 ? 56 : 28" />
          <span class="tt__cap">{{ g.label }}</span>
        </div>
      </div>
    </TplSlot>
    <div class="tt__two">
      <div class="tt__main">
        <TplSlot id="highlights">
          <UiCard title="Highlights">
            <div class="tt__hl">
              <UiStatStrip :items="FACTS" />
              <div class="tt__hg"><div v-for="h in HL" :key="h.t" class="tt__h"><UiIconTile :icon="h.icon" tone="brand" /><span><b>{{ h.t }}</b><small>{{ h.d }}</small></span></div></div>
            </div>
          </UiCard>
        </TplSlot>
        <TplSlot id="itinerary"><UiCard title="Itinerary"><UiAccordion :items="DAYS" /></UiCard></TplSlot>
        <TplSlot id="included">
          <div class="tt__inc">
            <UiCard title="Included"><ul class="tt__ul"><li v-for="i in IN" :key="i"><UiIcon name="circle-check" :size="18" class="ok" />{{ i }}</li></ul></UiCard>
            <UiCard title="Not included"><ul class="tt__ul"><li v-for="i in OUT" :key="i"><UiIcon name="circle-x" :size="18" class="no" />{{ i }}</li></ul></UiCard>
          </div>
        </TplSlot>
        <TplSlot id="reviews">
          <UiCard title="Reviews" subtitle="4.9 from 312 pilgrims">
            <div class="tt__rv">
              <div v-for="r in REV" :key="r.n" class="tt__r"><UiAvatar :name="r.n" :size="40" /><span><b>{{ r.n }}</b><span class="tt__st" :aria-label="`${r.r} of 5`"><UiIcon v-for="n in 5" :key="n" name="star" :size="16" :class="{ off: n > r.r }" /></span><p>{{ r.t }}</p></span></div>
            </div>
          </UiCard>
        </TplSlot>
      </div>
      <div class="tt__side">
        <div class="tt__stick">
          <TplSlot id="booking">
            <UiCard>
              <div class="tt__bk">
                <div><span class="zg-hint">From</span><div class="tt__price zg-num">{{ usd(price) }}<span class="zg-hint"> per person</span></div></div>
                <UiSelect v-model="dep" label="Departure" :options="DEPS" />
                <UiNumberInput v-model="pax" label="Pilgrims" :min="1" :max="8" />
                <div class="tt__tot"><span>Total for {{ pax }}</span><b class="zg-num">{{ usd(price * pax) }}</b></div>
                <UiButton variant="primary" size="lg" icon="calendar-check" block>Book this tour</UiButton>
                <div class="tt__row"><UiBadge tone="success" dot>Free cancellation 30 days</UiBadge><UiBadge tone="warning" dot>8 seats left</UiBadge></div>
                <UiButton icon="message-circle" block>Ask the operator</UiButton>
              </div>
            </UiCard>
          </TplSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tt { display: flex; flex-direction: column; gap: 20px; min-width: 0; padding: clamp(16px, 3vw, 40px); }
.tt__row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.tt__gal { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: clamp(110px, 14vw, 170px); gap: 12px; }
.tt__tile { position: relative; overflow: hidden; display: grid; place-items: center; border-radius: 28px; color: var(--zg-text-1); box-shadow: var(--zg-rim); }
.tt__tile.big { grid-column: span 2; grid-row: span 2; }
.tt__cap { position: absolute; inset-inline: 10px; bottom: 10px; padding: 6px 12px; border-radius: 14px; font-size: 13px; background: color-mix(in oklch, var(--zg-bg) 55%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: var(--zg-rim); }
.tt__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch; }
.tt__main { flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.tt__side { flex: 1 1 320px; min-width: 0; }
.tt__stick { position: sticky; top: 16px; }
.tt__hl { display: flex; flex-direction: column; gap: 18px; }
.tt__hg { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 14px; }
.tt__h { display: flex; gap: 12px; align-items: flex-start; }
.tt__h span { display: flex; flex-direction: column; font-size: 15px; min-width: 0; }
.tt__h small { color: var(--zg-text-3); font-size: 13px; }
.tt__inc { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 16px; }
.tt__ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 14px; }
.tt__ul li { display: flex; gap: 10px; align-items: flex-start; }
.tt__ul .ok { color: var(--zg-green); }
.tt__ul .no { color: var(--zg-red); }
.tt__rv { display: flex; flex-direction: column; gap: 18px; }
.tt__r { display: flex; gap: 14px; }
.tt__r span { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.tt__st { flex-direction: row !important; gap: 2px; color: var(--zg-amber); }
.tt__st .off { color: var(--zg-text-3); opacity: .5; }
.tt__r p { margin: 0; color: var(--zg-text-2); font-size: 14px; line-height: 1.5; }
.tt__bk { display: flex; flex-direction: column; gap: 16px; }
.tt__price { font-size: 32px; font-weight: 300; letter-spacing: -.02em; }
.tt__tot { display: flex; justify-content: space-between; align-items: baseline; font-size: 15px; }
.tt__tot b { font-size: 22px; }
@media (max-width: 860px) { .tt__stick { position: static; } .tt__gal { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
