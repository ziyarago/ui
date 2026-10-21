<script setup lang="ts">
const bookings = ref(0)
const occ = ref([62, 74, 88, 95, 91, 70, 58])
const progress = ref(34)
const notify = ref(true)
const reduced = ref(false)
let timers: ReturnType<typeof setInterval>[] = []

onMounted(() => {
  reduced.value = document.documentElement.dataset.motion === 'off'
  const target = 1248
  if (reduced.value) { bookings.value = target; progress.value = 82; return }
  const t0 = performance.now()
  const tick = (t: number) => {
    const k = Math.min(1, (t - t0) / 1600)
    bookings.value = Math.round(target * (1 - Math.pow(1 - k, 3)))
    if (k < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
  timers.push(setInterval(() => { occ.value = occ.value.map(v => Math.max(35, Math.min(99, v + Math.round((Math.random() - 0.45) * 22)))) }, 2400))
  timers.push(setInterval(() => { progress.value = progress.value >= 94 ? 18 : progress.value + 13 }, 1500))
  timers.push(setInterval(() => { notify.value = !notify.value }, 3200))
})
onBeforeUnmount(() => timers.forEach(clearInterval))
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
</script>

<template>
  <div class="hs" aria-hidden="true">
    <div class="hs__c hs__a"><UiKpiTile label="Bookings" :value="fmt(bookings)" delta="+12%" sub="vs last week" /></div>
    <div class="hs__c hs__b">
      <UiCard title="Occupancy" subtitle="Next 7 days" size="sm"><UiOccupancyChart :values="occ" :labels="['M', 'T', 'W', 'T', 'F', 'S', 'S']" /></UiCard>
    </div>
    <div class="hs__c hs__d">
      <UiCard title="Umrah, 7 nights" subtitle="Makkah and Madinah" variant="gradient" tone="violet" size="sm">
        <UiVStack :gap="12">
          <UiHStack :gap="10" align="center"><UiAvatar name="Aziz Karimov" :size="36" /><b>Aziz Karimov</b><UiBadge tone="success" dot>Confirmed</UiBadge></UiHStack>
          <UiProgress :value="progress" label="Documents" :meta="progress + '%'" />
          <UiSwitch v-model="notify" label="Telegram updates" />
        </UiVStack>
      </UiCard>
    </div>
    <div class="hs__c hs__e"><UiRing :value="72" label="plan" :size="104" /></div>
    <span class="hs__p hs__p1">Dark</span><span class="hs__p hs__p2">RTL</span><span class="hs__p hs__p3">184 components</span>
  </div>
</template>

<style scoped>
.hs { position: relative; height: 520px; }
.hs__c { position: absolute; will-change: transform; animation: hs-float 8s ease-in-out infinite alternate; }
.hs__a { top: 0; inset-inline-start: 4%; width: 250px; animation-delay: -1s; }
.hs__b { top: 90px; inset-inline-end: 0; width: 300px; animation-duration: 10s; animation-delay: -4s; }
.hs__d { bottom: 0; inset-inline-start: 0; width: 340px; animation-duration: 9s; animation-delay: -2.5s; }
.hs__e { bottom: 40px; inset-inline-end: 6%; animation-duration: 7s; animation-delay: -5s; filter: drop-shadow(0 18px 30px oklch(0 0 0 / .35)); }
.hs__p { position: absolute; padding: 8px 16px; border-radius: 999px; font: 600 14px var(--zg-font); background: var(--zg-pop); box-shadow: var(--zg-rim), var(--zg-shadow-1); animation: hs-float 6s ease-in-out infinite alternate; }
.hs__p1 { top: 18px; inset-inline-start: 46%; animation-delay: -1.5s; }
.hs__p2 { bottom: 14px; inset-inline-start: 60%; animation-delay: -3s; }
.hs__p3 { top: 10px; inset-inline-end: 6%; animation-delay: -4.5s; }
@keyframes hs-float { from { transform: translate3d(0, -10px, 0) rotate(-.6deg); } to { transform: translate3d(0, 12px, 0) rotate(.8deg); } }
@media (max-width: 980px) {
  .hs { height: auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
  .hs__c { position: static; width: auto; animation: none; }
  .hs__p, .hs__e { display: none; }
}
</style>
