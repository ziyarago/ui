<script setup lang="ts">
const section = ref('profile')
const name = ref('Shodiya Karimova')
const email = ref('shodiya@ziyarago.com')
const phone = ref<{ code?: string; number?: string }>({ code: '+998', number: '90 123 45 67' })
const sw = reactive({ tg: true, em: false, sms: false })
const items = [
  { value: 'profile', label: 'Profile', icon: 'user-round' },
  { value: 'notif', label: 'Notifications', icon: 'bell', badge: 3 },
  { value: 'int', label: 'Integrations', icon: 'plug' },
  { value: 'team', label: 'Team', icon: 'users' },
]
</script>

<template>
  <div class="tpl-col">
    <TplSlot id="header"><UiPageHeader title="Settings" subtitle="Account and notifications" /></TplSlot>
    <div class="tpl-wrap">
      <div class="tpl-aside">
        <TplSlot id="subnav"><UiCard><UiSubNav title="Settings" :items="items" :value="section" @change="section = $event" /></UiCard></TplSlot>
      </div>
      <div class="tpl-main tpl-col">
        <TplSlot id="profile">
          <UiCard>
            <UiSettingsSection title="Profile" description="Shown to guests and colleagues">
              <UiTextField v-model="name" label="Name" />
              <UiTextField v-model="email" label="Email" hint="Used for reports" />
              <UiPhoneInput v-model="phone" label="Phone" />
            </UiSettingsSection>
          </UiCard>
        </TplSlot>
        <TplSlot id="notifications">
          <UiCard>
            <UiSettingsSection title="Notifications" description="Where we send reminders">
              <UiSwitch v-model="sw.tg" label="Telegram" />
              <UiSwitch v-model="sw.em" label="Email reports" />
              <UiSwitch v-model="sw.sms" label="SMS" />
            </UiSettingsSection>
          </UiCard>
        </TplSlot>
        <TplSlot id="integrations">
          <div class="tpl-auto">
            <UiIntegrationCard name="Telegram" description="Reminders and bot" status="off" />
            <UiIntegrationCard name="Risal AI" description="On-site assistant" status="connected" />
            <UiIntegrationCard name="Analytics" description="Web and app events" status="error" />
          </div>
        </TplSlot>
        <TplSlot id="danger">
          <UiAlert tone="danger" title="Danger zone">
            <div class="tpl-row">Deleting the account removes all bookings.<UiPopconfirm label="Delete account" title="Delete account?" /></div>
          </UiAlert>
        </TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tpl-col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tpl-wrap { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.tpl-aside { flex: 1 1 220px; min-width: 0; max-width: 100%; }
.tpl-main { flex: 999 1 420px; min-width: 0; }
.tpl-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 16px; align-items: start; }
.tpl-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
</style>
