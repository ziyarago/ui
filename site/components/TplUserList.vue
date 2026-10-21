<script setup lang="ts">
import { h, resolveComponent } from 'vue'
const drawer = ref(false)
const picked = ref<number[]>([])
const role = ref('a')
const plan = ref('p')
const status = ref('a')
const perPage = ref(10)
const q = ref('')
const fullName = ref('')
const newEmail = ref('')
const newRole = ref('a')
const USERS = [
  { id: 1, n: 'Aziz Karimov', e: 'aziz@mail.uz', role: 'Agent', plan: 'Plus', st: 'Active' },
  { id: 2, n: 'Madina Yusupova', e: 'madina@mail.uz', role: 'Manager', plan: 'Free', st: 'Pending' },
  { id: 3, n: 'Zaynab Aliyeva', e: 'zaynab@mail.ru', role: 'Agent', plan: 'Partner', st: 'Active' },
  { id: 4, n: 'Jafar Rakhimov', e: 'jafar@mail.uz', role: 'Operator', plan: 'Free', st: 'Inactive' },
]
const TONE: Record<string, string> = { Active: 'success', Pending: 'warning', Inactive: 'neutral' }
const rows = computed(() => USERS.filter(u => !q.value || u.n.toLowerCase().includes(q.value.toLowerCase())))
const columns = [
  { key: 'n', label: 'User', render: (v: string, r: any) => h(resolveComponent('UiUserCell') as any, { name: v, sub: r.e }) },
  { key: 'role', label: 'Role' },
  { key: 'plan', label: 'Plan', render: (v: string) => h(resolveComponent('UiChip') as any, { tone: 'sky', variant: 'tonal', size: 'sm' }, () => v) },
  { key: 'st', label: 'Status', render: (v: string) => h(resolveComponent('UiChip') as any, { tone: TONE[v], size: 'sm' }, () => v) },
]
const roles = [{ value: 'a', label: 'Agent' }, { value: 'm', label: 'Manager' }, { value: 'o', label: 'Operator' }]
</script>

<template>
  <div class="tpl-col">
    <TplSlot id="header">
      <UiPageHeader title="Users" subtitle="Team and agents">
        <template #actions><UiButton variant="primary" icon="plus" @click="drawer = !drawer">Add user</UiButton></template>
      </UiPageHeader>
    </TplSlot>
    <TplSlot id="stats">
      <UiStatStrip :items="[
        { icon: 'users', tone: 'brand', value: '128', label: 'Users' },
        { icon: 'user-check', tone: 'success', value: '104', label: 'Active' },
        { icon: 'clock', tone: 'warning', value: '16', label: 'Pending' },
        { icon: 'user-x', tone: 'neutral', value: '8', label: 'Inactive' },
      ]" />
    </TplSlot>
    <div class="tpl-two">
      <div class="tpl-two-main tpl-col">
        <TplSlot id="filters">
          <UiCard title="Filters">
            <div class="tpl-auto">
              <UiSelect v-model="role" label="Role" :options="roles" />
              <UiSelect v-model="plan" label="Plan" :options="[{ value: 'f', label: 'Free' }, { value: 'p', label: 'Plus' }, { value: 'r', label: 'Partner' }]" />
              <UiSelect v-model="status" label="Status" :options="[{ value: 'a', label: 'Active' }, { value: 'p', label: 'Pending' }, { value: 'i', label: 'Inactive' }]" />
            </div>
          </UiCard>
        </TplSlot>
        <TplSlot id="toolbar">
          <div class="tpl-row">
            <UiPillSelect :options="[{ value: 10, label: 'Show 10' }, { value: 25, label: 'Show 25' }]" :value="perPage" @change="perPage = $event" />
            <div class="tpl-search"><UiSearchInput v-model="q" placeholder="Search user" /></div>
            <UiButton variant="tonal" tone="neutral" icon="upload">Export</UiButton>
          </div>
        </TplSlot>
        <TplSlot id="table">
          <UiCard><UiDataTable :columns="columns" :rows="rows" :selected="picked" @select="picked = $event" /></UiCard>
        </TplSlot>
      </div>
      <div class="tpl-two-side tpl-col">
        <TplSlot id="drawer">
          <UiCard v-if="drawer" title="Add user" subtitle="Drawer · 380 px">
            <div class="tpl-col">
              <UiTextField v-model="fullName" label="Full name" />
              <UiTextField v-model="newEmail" label="Email" icon="mail" />
              <UiSelect v-model="newRole" label="Role" :options="roles" />
              <div class="tpl-row">
                <UiButton variant="primary" @click="drawer = false">Submit</UiButton>
                <UiButton variant="tonal" tone="danger" @click="drawer = false">Cancel</UiButton>
              </div>
            </div>
          </UiCard>
          <div v-else class="tpl-hintbox">Press “Add user” to open the drawer panel.</div>
        </TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tpl-col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tpl-two { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.tpl-two-main { flex: 999 1 460px; min-width: 0; }
.tpl-two-side { flex: 1 1 300px; min-width: 0; }
.tpl-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 16px; align-items: start; }
.tpl-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.tpl-search { flex: 1; min-width: 160px; max-width: 300px; }
.tpl-hintbox { padding: 14px; border-radius: 20px; background: var(--zg-s1); color: var(--zg-text-3); font-size: 13px; line-height: 1.5; }
</style>
