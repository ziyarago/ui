<script setup lang="ts">
const tab = ref('acc')
const first = ref('Shodiya')
const last = ref('Karimova')
const phone = ref<{ code?: string; number?: string }>({ code: '+998', number: '90 123 45 67' })
const cur = ref('')
const next = ref('')
const sw = reactive({ tg: true, em: false, br: true })
const tabs = [
  { value: 'acc', icon: 'user-round', label: 'Account' },
  { value: 'sec', icon: 'lock-keyhole', label: 'Security' },
  { value: 'bill', icon: 'credit-card', label: 'Billing' },
  { value: 'not', icon: 'bell', label: 'Notifications' },
]
</script>

<template>
  <div class="tpl-col">
    <TplSlot id="header"><UiPageHeader title="Account settings" /></TplSlot>
    <TplSlot id="tabs"><UiPillTabs :items="tabs" :value="tab" @change="tab = $event" /></TplSlot>
    <TplSlot id="panel">
      <UiCard v-if="tab === 'acc'" title="Profile details">
        <div class="tpl-col">
          <UiSettingsSection title="Photo" description="JPG or PNG, up to 2 MB">
            <div class="tpl-row">
              <UiAvatar name="Shodiya Karimova" :size="84" />
              <UiButton variant="primary">Upload new</UiButton>
              <UiButton variant="tonal" tone="neutral">Reset</UiButton>
            </div>
          </UiSettingsSection>
          <UiSettingsSection title="Details">
            <div class="tpl-auto">
              <UiTextField v-model="first" label="First name" />
              <UiTextField v-model="last" label="Last name" />
            </div>
            <UiPhoneInput v-model="phone" label="Phone" />
          </UiSettingsSection>
        </div>
      </UiCard>
      <UiCard v-else-if="tab === 'sec'" title="Change password">
        <div class="tpl-col">
          <UiPasswordInput v-model="cur" label="Current password" />
          <UiPasswordInput v-model="next" label="New password" />
          <div><UiButton variant="primary">Save</UiButton></div>
          <UiAlert tone="warning" title="Two-step verification">Turn it on to protect client data.</UiAlert>
        </div>
      </UiCard>
      <UiCard v-else-if="tab === 'bill'" title="Billing">
        <div class="tpl-col">
          <UiDescriptions :items="[{ label: 'Plan', value: 'Partner' }, { label: 'Next payment', value: 'Nov 1 · $29' }, { label: 'Card', value: 'Visa ···· 4242' }]" />
          <div><UiButton variant="outlined">Change plan</UiButton></div>
        </div>
      </UiCard>
      <UiCard v-else title="Notifications">
        <div class="tpl-col">
          <UiSwitch v-model="sw.tg" label="Telegram" />
          <UiSwitch v-model="sw.em" label="Email reports" />
          <UiSwitch v-model="sw.br" label="Browser" />
        </div>
      </UiCard>
    </TplSlot>
  </div>
</template>

<style scoped>
.tpl-col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tpl-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.tpl-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px; align-items: start; }
</style>
