<script setup lang="ts">
type Stop = { time: string, icon: string, tone: string, title: string, place: string, len: string }
type Day = { value: string, label: string, date: string, city: string, stops: Stop[], transport: { icon: string, mode: string, code: string, from: string, to: string, dep: string, arr: string, note: string }[], hotel: { name: string, stars: number, distance: string, rating: string, price: number, tags: string[] } }
const DAYS: Day[] = [
  { value: 'd1', label: 'Day 1', date: 'Sun, 8 Mar', city: 'Tashkent to Madinah', stops: [
    { time: '06:30', icon: 'luggage', tone: 'brand', title: 'Airport meeting', place: 'Tashkent International, Terminal 2', len: '1 h 30' },
    { time: '10:05', icon: 'plane-takeoff', tone: 'sky', title: 'Flight to Madinah', place: 'Uzbekistan Airways HY 561', len: '5 h 40' },
    { time: '13:45', icon: 'plane-landing', tone: 'sky', title: 'Arrival and visa check', place: 'Prince Mohammad bin Abdulaziz Airport', len: '1 h 15' },
    { time: '17:30', icon: 'bed-double', tone: 'success', title: 'Hotel check-in', place: 'Anwar Al Madinah Movenpick', len: '45 min' },
    { time: '19:15', icon: 'moon', tone: 'brand', title: 'Maghrib at Al-Masjid an-Nabawi', place: 'Gate 21, 200 m from the hotel', len: '1 h' },
  ], transport: [{ icon: 'plane', mode: 'Flight', code: 'HY 561', from: 'Tashkent TAS', to: 'Madinah MED', dep: '10:05', arr: '13:45', note: '1 checked bag of 30 kg' }, { icon: 'bus', mode: 'Transfer', code: 'Bus 2', from: 'Airport', to: 'Hotel', dep: '15:30', arr: '16:20', note: 'Driver speaks Uzbek and Russian' }], hotel: { name: 'Anwar Al Madinah Movenpick', stars: 5, distance: '200 m to the Prophet\'s Mosque', rating: '9.0', price: 640, tags: ['Breakfast', 'Free Wi-Fi'] } },
  { value: 'd2', label: 'Day 2', date: 'Mon, 9 Mar', city: 'Madinah', stops: [
    { time: '04:30', icon: 'sunrise', tone: 'warning', title: 'Fajr and Rawdah visit', place: 'Al-Masjid an-Nabawi', len: '2 h' },
    { time: '09:00', icon: 'utensils', tone: 'success', title: 'Breakfast', place: 'Hotel restaurant', len: '1 h' },
    { time: '10:30', icon: 'landmark', tone: 'brand', title: 'Ziyarat of Quba Mosque', place: 'Quba Mosque, 5 km', len: '1 h 30' },
    { time: '14:00', icon: 'mountain', tone: 'sky', title: 'Mount Uhud and the martyrs', place: 'Uhud, 6 km', len: '2 h' },
    { time: '18:30', icon: 'clock', tone: 'neutral', title: 'Free time and Isha', place: 'Al-Masjid an-Nabawi', len: '2 h' },
  ], transport: [{ icon: 'bus', mode: 'Ziyarat bus', code: 'Bus 2', from: 'Hotel', to: 'Quba and Uhud', dep: '10:15', arr: '16:30', note: 'Water on board' }], hotel: { name: 'Anwar Al Madinah Movenpick', stars: 5, distance: '200 m to the Prophet\'s Mosque', rating: '9.0', price: 640, tags: ['Breakfast', 'Free Wi-Fi'] } },
  { value: 'd3', label: 'Day 3', date: 'Tue, 10 Mar', city: 'Madinah to Makkah', stops: [
    { time: '05:00', icon: 'sunrise', tone: 'warning', title: 'Fajr and farewell visit', place: 'Al-Masjid an-Nabawi', len: '1 h 30' },
    { time: '09:30', icon: 'shirt', tone: 'brand', title: 'Ihram at Dhul Hulayfah', place: 'Abyar Ali Miqat', len: '1 h' },
    { time: '11:00', icon: 'bus', tone: 'sky', title: 'Road to Makkah', place: 'Highway 15, 450 km', len: '5 h' },
    { time: '17:00', icon: 'bed-double', tone: 'success', title: 'Hotel check-in', place: 'Hilton Suites Makkah', len: '45 min' },
    { time: '21:00', icon: 'landmark', tone: 'brand', title: 'Umrah: tawaf and sa\'i', place: 'Masjid al-Haram', len: '3 h 30' },
  ], transport: [{ icon: 'bus', mode: 'Coach', code: 'Bus 2', from: 'Madinah hotel', to: 'Makkah hotel', dep: '11:00', arr: '16:30', note: 'One rest stop at 13:30' }], hotel: { name: 'Hilton Suites Makkah', stars: 5, distance: '300 m to the Haram', rating: '9.2', price: 780, tags: ['Haram view', 'Breakfast'] } },
  { value: 'd4', label: 'Day 4', date: 'Wed, 11 Mar', city: 'Makkah', stops: [
    { time: '05:00', icon: 'sunrise', tone: 'warning', title: 'Fajr at the Haram', place: 'Masjid al-Haram', len: '1 h 30' },
    { time: '10:00', icon: 'scissors', tone: 'neutral', title: 'Halq and leaving ihram', place: 'Barber near the Clock Tower', len: '45 min' },
    { time: '15:00', icon: 'mountain', tone: 'sky', title: 'Ziyarat: Jabal al-Nour and Hira', place: 'Jabal al-Nour, 4 km', len: '2 h 30' },
    { time: '20:00', icon: 'moon', tone: 'brand', title: 'Tarawih at the Haram', place: 'Masjid al-Haram', len: '2 h' },
  ], transport: [{ icon: 'bus', mode: 'Ziyarat bus', code: 'Bus 2', from: 'Hotel', to: 'Jabal al-Nour', dep: '15:00', arr: '15:25', note: 'Back by 18:00' }], hotel: { name: 'Hilton Suites Makkah', stars: 5, distance: '300 m to the Haram', rating: '9.2', price: 780, tags: ['Haram view', 'Breakfast'] } },
  { value: 'd5', label: 'Day 5', date: 'Thu, 12 Mar', city: 'Makkah to Tashkent', stops: [
    { time: '05:00', icon: 'sunrise', tone: 'warning', title: 'Tawaf al-Wada', place: 'Masjid al-Haram', len: '2 h' },
    { time: '09:00', icon: 'luggage', tone: 'brand', title: 'Check-out and luggage', place: 'Hilton Suites Makkah', len: '1 h' },
    { time: '10:30', icon: 'bus', tone: 'sky', title: 'Transfer to Jeddah airport', place: 'King Abdulaziz International', len: '1 h 30' },
    { time: '15:20', icon: 'plane-takeoff', tone: 'sky', title: 'Flight to Tashkent', place: 'Uzbekistan Airways HY 562', len: '6 h' },
  ], transport: [{ icon: 'bus', mode: 'Transfer', code: 'Bus 2', from: 'Makkah hotel', to: 'Jeddah JED', dep: '10:30', arr: '12:00', note: 'Arrive 3 h before departure' }, { icon: 'plane', mode: 'Flight', code: 'HY 562', from: 'Jeddah JED', to: 'Tashkent TAS', dep: '15:20', arr: '23:20', note: 'Zamzam, up to 5 l per person' }], hotel: { name: 'Hilton Suites Makkah', stars: 5, distance: 'Check-out at 09:00', rating: '9.2', price: 780, tags: ['Late check-out on request'] } },
]
const day = ref('d3')
const cur = computed(() => DAYS.find(d => d.value === day.value)!)
const idx = computed(() => DAYS.findIndex(d => d.value === day.value))
const tabs = DAYS.map(d => ({ value: d.value, label: `${d.label} · ${d.date}` }))
</script>

<template>
  <div class="ti">
    <TplSlot id="header">
      <UiPageHeader title="Ramadan Umrah, 5 days" subtitle="Tashkent, Madinah, Makkah · 8 to 12 March" :crumbs="[{ label: 'Groups' }, { label: 'RU-0308' }, { label: 'Itinerary' }]">
        <template #actions>
          <div class="ti__row"><UiButton icon="share-2">Share</UiButton><UiButton variant="primary" icon="download">PDF</UiButton></div>
        </template>
      </UiPageHeader>
    </TplSlot>
    <TplSlot id="days"><div class="ti__tabs"><UiPillTabs :items="tabs" :value="day" @change="day = $event" /></div></TplSlot>
    <div class="ti__two">
      <div class="ti__main">
        <TplSlot id="timeline">
          <UiCard :title="`${cur.label} · ${cur.city}`" :subtitle="cur.date">
            <ol class="ti__tl">
              <li v-for="s in cur.stops" :key="s.time + s.title" class="ti__st">
                <span class="ti__time zg-num">{{ s.time }}</span>
                <UiIconTile :icon="s.icon" :tone="s.tone" />
                <span class="ti__txt"><b>{{ s.title }}</b><small>{{ s.place }}</small></span>
                <UiChip size="sm" pill icon="timer">{{ s.len }}</UiChip>
              </li>
            </ol>
          </UiCard>
        </TplSlot>
        <TplSlot id="transport">
          <UiCard title="Transport">
            <div class="ti__tr">
              <div v-for="t in cur.transport" :key="t.code + t.from" class="ti__leg">
                <div class="ti__lh"><UiIconTile :icon="t.icon" tone="sky" size="sm" /><b>{{ t.mode }}</b><UiBadge tone="info">{{ t.code }}</UiBadge></div>
                <div class="ti__route"><span><b class="zg-num">{{ t.dep }}</b><small>{{ t.from }}</small></span><i aria-hidden="true" /><span class="ti__end"><b class="zg-num">{{ t.arr }}</b><small>{{ t.to }}</small></span></div>
                <small class="ti__note">{{ t.note }}</small>
              </div>
            </div>
          </UiCard>
        </TplSlot>
        <TplSlot id="hotel">
          <UiCard>
            <div class="ti__hotel">
              <div class="ti__thumb" aria-hidden="true"><UiIcon name="building-2" :size="32" /></div>
              <div class="ti__hb">
                <span class="zg-hint">Tonight's hotel</span>
                <b>{{ cur.hotel.name }}</b>
                <span class="ti__stars"><UiIcon name="star" :size="14" />{{ cur.hotel.stars }} · {{ cur.hotel.rating }} · {{ cur.hotel.distance }}</span>
                <div class="ti__row"><UiBadge v-for="t in cur.hotel.tags" :key="t" tone="success">{{ t }}</UiBadge></div>
              </div>
              <div class="ti__price"><b class="zg-num">SAR {{ cur.hotel.price }}</b><span class="zg-hint">per night</span></div>
            </div>
          </UiCard>
        </TplSlot>
      </div>
      <div class="ti__side">
        <div class="ti__stick">
          <TplSlot id="summary">
            <UiCard title="Trip summary">
              <div class="ti__sum">
                <UiProgress :value="Math.round((idx + 1) / DAYS.length * 100)" label="Trip progress" :meta="`Day ${idx + 1} of ${DAYS.length}`" />
                <UiDescriptions :items="[{ label: 'Group', value: 'RU-0308 · 32 pilgrims' }, { label: 'Dates', value: '8 to 12 March' }, { label: 'Flights', value: 'HY 561, HY 562' }, { label: 'Hotels', value: 'Madinah 2 nights, Makkah 2 nights' }, { label: 'Guide', value: 'Abdulaziz Rahimov' }]" />
                <UiButton variant="primary" icon="message-circle" block>Message the guide</UiButton>
              </div>
            </UiCard>
          </TplSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ti { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ti__row { display: flex; gap: 8px; flex-wrap: wrap; }
.ti__tabs { max-width: 100%; overflow-x: auto; }
.ti__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch; }
.ti__main { flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.ti__side { flex: 1 1 300px; min-width: 0; }
.ti__stick { position: sticky; top: 16px; }
.ti__tl { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.ti__st { display: flex; align-items: center; gap: 14px; padding: 12px 0; }
.ti__st + .ti__st { box-shadow: 0 -1px 0 var(--zg-stroke); }
.ti__time { flex: 0 0 48px; font-size: 14px; color: var(--zg-text-2); }
.ti__txt { flex: 1; min-width: 0; display: flex; flex-direction: column; font-size: 15px; }
.ti__txt small { color: var(--zg-text-3); font-size: 13px; }
.ti__tr { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 12px; }
.ti__leg { display: flex; flex-direction: column; gap: 12px; padding: 14px; border-radius: 20px; background: var(--zg-s2); box-shadow: var(--zg-rim); }
.ti__lh { display: flex; align-items: center; gap: 10px; }
.ti__lh .zg-badge { margin-inline-start: auto; }
.ti__route { display: flex; align-items: center; gap: 12px; }
.ti__route span { display: flex; flex-direction: column; font-size: 18px; min-width: 0; }
.ti__route small { font-size: 12px; color: var(--zg-text-3); }
.ti__route i { flex: 1; height: 2px; min-width: 24px; border-radius: 2px; background: repeating-linear-gradient(90deg, var(--zg-text-3) 0 6px, transparent 6px 12px); }
.ti__end { text-align: end; align-items: flex-end; }
.ti__note { color: var(--zg-text-3); font-size: 13px; }
.ti__hotel { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.ti__thumb { flex: 0 0 96px; height: 96px; display: grid; place-items: center; border-radius: 22px; color: var(--zg-on-brand); background: radial-gradient(80% 80% at 20% 15%, color-mix(in oklch, #fff 35%, transparent), transparent), linear-gradient(135deg, var(--zg-brand), color-mix(in oklch, var(--zg-sky) 70%, var(--zg-brand))); box-shadow: var(--zg-rim); }
.ti__hb { flex: 1 1 200px; min-width: 0; display: flex; flex-direction: column; gap: 6px; font-size: 16px; }
.ti__stars { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--zg-text-3); }
.ti__stars .zg-icon { color: var(--zg-amber); }
.ti__price { display: flex; flex-direction: column; align-items: flex-end; font-size: 20px; }
.ti__sum { display: flex; flex-direction: column; gap: 16px; }
@media (max-width: 860px) { .ti__stick { position: static; } .ti__st { flex-wrap: wrap; } .ti__time { flex-basis: 44px; } }
</style>
