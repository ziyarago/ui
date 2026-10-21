<script setup lang="ts">
const S = [{ id: 's1', t: 'Before you travel' }, { id: 's2', t: 'Choosing a hotel' }, { id: 's3', t: 'Daily rhythm' }, { id: 's4', t: 'Checklist' }]
const active = ref('s1')
const REL = [{ t: 'How to pick an Umrah package', c: 'Guide', m: '6 min' }, { t: 'Packing list for Madinah', c: 'Checklist', m: '4 min' }, { t: 'Visa timing in 2026', c: 'News', m: '3 min' }]
</script>

<template>
  <div class="ta">
    <UiPageHeader title="Article" subtitle="Guides and stories from the ZiyaraGo team" />
    <TplSlot id="cover">
      <div class="ta__cover">
        <UiChip tone="brand" size="sm">Guide</UiChip>
        <h2>Planning your first Umrah: a calm, step by step guide</h2>
        <div class="ta__by"><UiAvatar name="Shodiya Karimova" :size="36" /><span><b>Shodiya Karimova</b><small>12 Mar 2026 · 8 min read</small></span></div>
      </div>
    </TplSlot>
    <div class="ta__two">
      <div class="ta__main">
        <TplSlot id="body">
          <UiCard>
            <article class="ta__body">
              <h3 id="s1">Before you travel</h3>
              <p>Start with documents. Check that your passport is valid for at least six months and that your visa is approved before you pay for flights.</p>
              <UiAlert tone="info" title="Tip">Book flexible tickets until the visa is confirmed.</UiAlert>
              <h3 id="s2">Choosing a hotel</h3>
              <p>Distance to the Haram matters more than stars. Walking time, elevator wait and prayer-hall access shape every day of the trip.</p>
              <blockquote>The best hotel is the one you do not have to think about after check-in.</blockquote>
              <h3 id="s3">Daily rhythm</h3>
              <p>Plan around prayer times. Keep mornings free for Tawaf and leave rest between the obligatory prayers.</p>
              <UiCode code="Fajr 04:52 · Dhuhr 12:21 · Asr 15:48 · Maghrib 18:35 · Isha 20:01" />
              <h3 id="s4">Checklist</h3>
              <p>Passport, visa, vaccination card, insurance, a printed hotel voucher and a charged phone.</p>
            </article>
          </UiCard>
        </TplSlot>
        <TplSlot id="share">
          <div class="ta__share"><b>Share this article</b><span><UiIconButton icon="send" label="Telegram" /><UiIconButton icon="mail" label="Email" /><UiIconButton icon="link" label="Link" /><UiCopyButton value="https://ziyarago.com/blog/first-umrah" /></span></div>
        </TplSlot>
        <TplSlot id="related">
          <div class="ta__rel">
            <UiCard v-for="r in REL" :key="r.t"><div class="ta__rc"><div class="ta__img" /><UiChip tone="neutral" size="sm">{{ r.c }}</UiChip><b>{{ r.t }}</b><small>{{ r.m }} read</small></div></UiCard>
          </div>
        </TplSlot>
      </div>
      <div class="ta__side">
        <div class="ta__stick">
          <TplSlot id="toc">
            <UiCard title="On this page">
              <nav class="ta__toc"><a v-for="s in S" :key="s.id" :href="`#${s.id}`" :class="{ on: active === s.id }" @click.prevent="active = s.id">{{ s.t }}</a></nav>
            </UiCard>
          </TplSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ta { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ta__cover { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; justify-content: flex-end; min-height: 260px; padding: clamp(20px, 4vw, 40px); border-radius: 28px; background: radial-gradient(60% 90% at 85% 10%, color-mix(in oklch, var(--zg-brand) 35%, transparent), transparent), linear-gradient(160deg, var(--zg-s2), var(--zg-s1)); box-shadow: var(--zg-rim); }
.ta__cover h2 { margin: 0; font: 600 clamp(24px, 3.4vw, 38px)/1.15 var(--zg-font); max-width: 22ch; }
.ta__by { display: flex; align-items: center; gap: 10px; }
.ta__by span { display: flex; flex-direction: column; font-size: 14px; }
.ta__by small { color: var(--zg-text-3); }
.ta__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch; }
.ta__main { flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.ta__side { flex: 1 1 260px; min-width: 0; }
.ta__stick { position: sticky; top: 16px; }
.ta__body { display: flex; flex-direction: column; gap: 12px; font-size: 15px; line-height: 1.7; color: var(--zg-text-2); }
.ta__body h3 { margin: 12px 0 0; font: 600 20px/1.3 var(--zg-font); color: var(--zg-text-1); }
.ta__body p { margin: 0; }
.ta__body blockquote { margin: 0; padding: 4px 16px; border-inline-start: 3px solid var(--zg-brand); color: var(--zg-text-1); font-size: 17px; }
.ta__toc { display: flex; flex-direction: column; gap: 2px; }
.ta__toc a { padding: 8px 12px; border-radius: 12px; color: var(--zg-text-2); text-decoration: none; font-size: 14px; }
.ta__toc a.on { background: color-mix(in oklch, var(--zg-brand) 14%, transparent); color: var(--zg-brand-text); }
.ta__share { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 18px; border-radius: 22px; background: var(--zg-s1); box-shadow: var(--zg-rim); }
.ta__share span { display: flex; gap: 6px; align-items: center; }
.ta__rel { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 16px; }
.ta__rc { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.ta__rc small { color: var(--zg-text-3); }
.ta__img { align-self: stretch; height: 90px; border-radius: 16px; background: linear-gradient(135deg, color-mix(in oklch, var(--zg-brand) 40%, transparent), color-mix(in oklch, var(--zg-sky) 30%, transparent)); }
@media (max-width: 860px) { .ta__stick { position: static; } .ta__two { align-items: stretch; } }
</style>
