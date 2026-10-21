<script setup lang="ts">
const tab = ref('profile')
const tabs = [
  { value: 'profile', icon: 'user-round', label: 'Profile' },
  { value: 'team', icon: 'users', label: 'Team' },
  { value: 'projects', icon: 'layout-grid', label: 'Projects' },
  { value: 'conn', icon: 'link', label: 'Connections' },
]
</script>

<template>
  <div class="tpl-col">
    <TplSlot id="profile">
      <UiProfileHeader
        name="Shodiya Karimova"
        :meta="[{ icon: 'briefcase', label: 'Operator' }, { icon: 'map-pin', label: 'Tashkent' }, { icon: 'calendar', label: 'Joined Oct 2025' }]"
      >
        <UiButton variant="primary" icon="check">Connected</UiButton>
      </UiProfileHeader>
    </TplSlot>
    <TplSlot id="tabs"><UiPillTabs :items="tabs" :value="tab" @change="tab = $event" /></TplSlot>
    <div class="tpl-wrap">
      <div class="tpl-aside">
        <TplSlot id="about">
          <UiCard title="About">
            <span class="zg-label tpl-caps">Contacts</span>
            <UiDescriptions :items="[{ label: 'Phone', value: '+998 90 123 45 67' }, { label: 'Telegram', value: '@shodiya_k' }, { label: 'Email', value: null }]" />
          </UiCard>
        </TplSlot>
      </div>
      <div class="tpl-main tpl-col">
        <TplSlot id="activity">
          <UiCard title="Activity">
            <UiTimeline :items="[
              { title: 'Closed deal', text: 'Aziz Karimov · SAR 18 400', time: 'Today' },
              { title: 'Meeting', text: 'Madina Y.', time: 'Yesterday' },
              { title: 'Hotel added', text: 'Hilton Suites Makkah', time: 'Oct 12' },
            ]" />
          </UiCard>
        </TplSlot>
        <TplSlot id="plan">
          <UiCard title="Current plan">
            <div class="tpl-col">
              <div class="tpl-row"><UiBadge tone="brand">Partner</UiBadge><span class="zg-hint">24 days left</span></div>
              <UiProgress :value="80" label="Days used" meta="6/30" />
              <UiButton variant="primary" block>Upgrade plan</UiButton>
            </div>
          </UiCard>
        </TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tpl-col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tpl-wrap { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.tpl-aside { flex: 1 1 320px; min-width: 0; max-width: 100%; }
.tpl-main { flex: 999 1 420px; min-width: 0; }
.tpl-row { display: flex; gap: 8px; align-items: center; }
.tpl-caps { letter-spacing: .1em; text-transform: uppercase; }
</style>
