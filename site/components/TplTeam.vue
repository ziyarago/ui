<script setup lang="ts">
const role = ref('member')
const email = ref('')
const RO = [{ value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }, { value: 'member', label: 'Member' }, { value: 'viewer', label: 'Viewer' }]
const MEM = [{ id: 1, name: 'Shodiya Karimova', sub: 'shodiya@ziyara.vip', role: 'Admin', st: 'Active' }, { id: 2, name: 'Aziz Karimov', sub: 'aziz@ziyara.vip', role: 'Manager', st: 'Active' }, { id: 3, name: 'Laila Noor', sub: 'laila@ziyara.vip', role: 'Member', st: 'Invited' }]
const MC = [{ key: 'name', label: 'Member', sortable: true }, { key: 'sub', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'st', label: 'Status' }]
const perms = ref([{ id: 1, p: 'View bookings', a: true, m: true, mb: true, v: true }, { id: 2, p: 'Edit bookings', a: true, m: true, mb: true, v: false }, { id: 3, p: 'Manage billing', a: true, m: false, mb: false, v: false }, { id: 4, p: 'Invite members', a: true, m: true, mb: false, v: false }])
const PK = ['a', 'm', 'mb', 'v'] as const
</script>

<template>
  <div class="tt">
    <UiPageHeader title="Team" subtitle="Members, invites and permissions" />
    <TplSlot id="stats"><div class="tt__kpis"><UiKpiTile label="Members" value="12" /><UiKpiTile label="Pending invites" value="3" /><UiKpiTile label="Admins" value="2" /></div></TplSlot>
    <div class="tt__two">
      <div class="tt__main">
        <TplSlot id="members">
          <UiCard title="Members">
            <UiDataTable :columns="MC" :rows="MEM" />
          </UiCard>
        </TplSlot>
        <TplSlot id="roles">
          <UiCard title="Roles and permissions">
            <div class="tt__mx">
              <div class="tt__r tt__h"><span>Permission</span><b v-for="r in RO" :key="r.value">{{ r.label }}</b></div>
              <div v-for="p in perms" :key="p.id" class="tt__r"><span>{{ p.p }}</span><span v-for="k in PK" :key="k" class="tt__c"><UiCheckbox v-model="(p as any)[k]" /></span></div>
            </div>
          </UiCard>
        </TplSlot>
      </div>
      <div class="tt__side">
        <TplSlot id="invite">
          <UiCard title="Invite a teammate">
            <div class="tt__inv"><UiTextField v-model="email" label="Email" icon="mail" placeholder="name@company.com" /><UiSelect v-model="role" label="Role" :options="RO" /><UiButton variant="primary" icon="send" block>Send invite</UiButton><span class="zg-hint">Invites expire after 7 days.</span></div>
          </UiCard>
        </TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tt { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tt__kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 16px; }
.tt__two { display: flex; gap: 16px; align-items: flex-start; }
.tt__main { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.tt__side { flex: 0 0 320px; min-width: 0; }
.tt__inv { display: flex; flex-direction: column; gap: 14px; }
.tt__mx { overflow-x: auto; }
.tt__r { display: grid; grid-template-columns: minmax(150px, 1.6fr) repeat(4, minmax(64px, 1fr)); align-items: center; gap: 8px; padding: 10px 0; font-size: 14px; min-width: 440px; }
.tt__r + .tt__r { box-shadow: 0 -1px 0 var(--zg-stroke); }
.tt__h { font-size: 12px; color: var(--zg-text-3); }
.tt__h b { font-weight: 500; text-align: center; }
.tt__c { display: flex; justify-content: center; }
@media (max-width: 860px) { .tt__two { flex-direction: column; align-items: stretch; } .tt__side { flex-basis: auto; } }
</style>
