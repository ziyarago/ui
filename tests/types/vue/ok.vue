<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiCard, UiSelect, UiDataTable, UiTextField, UiCheckbox, UiTabs, UiPagination, UiModal, UiAppShell, UiChip, UiNotificationBell, UiLoginForm } from '@ziyarago/ui/vue';
import type { UiButtonProps, UiSelectProps } from '@ziyarago/ui/vue';

const name = ref('');
const agree = ref(false);
const tab = ref('a');
const sel = ref<string | number>('x');
const open = ref(false);
const btn: UiButtonProps = { variant: 'primary', size: 'lg' };
const selProps: UiSelectProps = { options: [{ value: 1, label: 'One' }] };
const rows = [{ id: 1, title: 'A' }];
const onSort = (key: string, dir: 'asc' | 'desc') => { void key; void dir; };
</script>

<template>
  <UiButton v-bind="btn" tone="success" icon="plus" loading @click="(e: MouseEvent) => e.preventDefault()">Save</UiButton>
  <UiCard title="Hello" subtitle="x" size="sm">
    <template #actions><UiChip tone="brand" @close="open = false">tag</UiChip></template>
    body
  </UiCard>
  <UiSelect v-model="sel" :options="[{ value: 'x', label: 'X' }, { value: 2, label: 'Two' }]" label="Pick" @change="(v: string | number) => (sel = v)" />
  <UiSelect v-bind="selProps" />
  <UiTextField v-model="name" label="Name" placeholder="..." />
  <UiCheckbox v-model="agree" />
  <UiTabs v-model="tab" :items="[{ value: 'a', label: 'A' }]" />
  <UiPagination :page="1" :pages="5" @change="(p: number) => p.toFixed()" />
  <UiDataTable :columns="[{ key: 'title', label: 'Title', sortable: true }]" :rows="rows" @sort="onSort" @select="(ids: (string | number)[]) => ids.length" />
  <UiModal :open="open" title="T" @close="open = false">content</UiModal>
  <UiAppShell nav="side" :items="[{ value: 'h', label: 'Home' }]" @change="(v: string) => v.length" />
  <UiNotificationBell :items="[{ id: 1, title: 'Hi' }]" @read="(id: string | number) => id" @mark-all-read="() => {}" />
  <UiLoginForm @submit="(v) => v.email.length && v.remember" />
</template>
