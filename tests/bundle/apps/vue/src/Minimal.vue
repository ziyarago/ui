<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const pagination = { pages: 12, page: 3 };
const rows = [{ id: 1, name: 'Ahmed', status: 'ok' }, { id: 2, name: 'Omar', status: 'pending' }];
const cols = [{ key: 'name', label: 'Name', sortable: true }, { key: 'status', label: 'Status' }];
const model = ['a'];
const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }];
</script>

<template>
  <div class="zg-root p-4 flex flex-col gap-4" data-minimal>
    <h1 class="text-xl">{{ t('title') }}</h1>
    <UiButton variant="primary" icon="rocket">Primary</UiButton>
    <UiCopyButton value="hello" />
    <UiPagination v-bind="pagination" :hide-arrows="false" />
    <UiAlert tone="info" title="Heads up">Plain alert</UiAlert>
    <UiSelect :options="options" model-value="a" />
    <UiMultiSelect :options="options" :model-value="model" />
    <UiDatePicker />
    <UiDataTable :columns="cols" :rows="rows" />
    <UiEmptyState title="Nothing here" description="Add something" icon="inbox" />
    <UiSearchInput />
    <UiFileUpload />
  </div>
</template>
