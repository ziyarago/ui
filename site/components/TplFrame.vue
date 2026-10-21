<script setup lang="ts">
import type { TemplatePage } from '~/docs-data/templates-types'
import { TEMPLATES } from '~/docs-data/templates'
const props = defineProps<{ page: TemplatePage }>()
const { nav, pick, sel } = useTpl()
const col = ref(false)
const NAV = [
  { value: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { value: 'crm', label: 'CRM', icon: 'kanban' },
  { value: 'bookings', label: 'Bookings', icon: 'calendar-check', badge: 31 },
  { value: 'catalog', label: 'Hotels', icon: 'building-2' },
  { value: 'user-list', label: 'Users', icon: 'users' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]
const NAV_OF: Record<string, string> = { detail: 'catalog', form: 'catalog', profile: 'user-list', order: 'bookings', account: 'settings', pricing: 'settings', patterns: 'dashboard', onboarding: 'dashboard', checkout: 'bookings', inbox: 'crm', notifications: 'dashboard', analytics: 'dashboard', calendar: 'bookings', kanban: 'crm', billing: 'settings', team: 'user-list', integrations: 'settings', search: 'dashboard', article: 'dashboard', changelog: 'dashboard', help: 'settings', states: 'dashboard', legal: 'settings', locations: 'catalog', 'booking-flow': 'bookings' }
const router = useRouter()
const current = computed(() => NAV_OF[props.page.route] ?? props.page.route)
const go = (v: string) => { if (TEMPLATES.pages.some(p => p.route === v)) router.push(`/docs/templates/${v}`) }
const mods = import.meta.glob('./Tpl*.vue', { eager: true }) as Record<string, { default: any }>
const Missing = defineComponent({ render: () => h('div', { style: 'padding:40px;color:var(--zg-text-3)' }, `${props.page.tpl}.vue is not written yet`) })
const Tpl = computed(() => mods[`./${props.page.tpl}.vue`]?.default ?? Missing)
</script>

<template>
  <div class="tpl-frame" :data-theme="page.shell || !['auth', 'status'].includes(page.route) ? undefined : 'dark'">
    <UiAppShell v-if="page.shell" :nav="nav" frame brand="ZiyaraGo" :items="NAV" :value="current" :collapsed="col" @change="go" @collapse="col = $event">
      <template #actions>
        <TplSlot id="actions">
          <div class="tpl-actions">
            <UiIconButton icon="search" label="Search" />
            <UiNotificationBell :items="[{ id: 1, title: 'Payment received', message: 'BK-2041 · SAR 18 400', time: '2 min ago' }]" />
            <UiAvatar name="Shodiya Karimova" :size="36" />
          </div>
        </TplSlot>
      </template>
      <template #footer>
        <TplSlot id="footer">
          <div class="tpl-foot"><UiAvatar name="Shodiya Karimova" :size="36" /><span v-if="!col"><b>Shodiya K.</b><UiBadge tone="success" dot>Online</UiBadge></span></div>
        </TplSlot>
      </template>
      <component :is="Tpl" />
      <TplSlot id="pagefooter"><UiFooter copyright="© 2026 ZiyaraGo" :links="[{ label: 'Help' }, { label: 'Privacy' }, { label: 'Terms' }]" /></TplSlot>
    </UiAppShell>
    <component :is="Tpl" v-else />
  </div>
</template>

<style scoped>
.tpl-frame { height: min(84vh, 940px); min-height: 560px; overflow: auto; border-radius: 32px; background: var(--zg-bg); color: var(--zg-text-1); box-shadow: var(--zg-rim), var(--zg-shadow-2); position: relative; isolation: isolate; }
.tpl-actions { display: flex; align-items: center; gap: 8px; }
.tpl-foot { display: flex; align-items: center; gap: 10px; padding: 8px; }
.tpl-foot span { display: flex; flex-direction: column; font-size: 13px; }
</style>
