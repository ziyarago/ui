<script setup lang="ts">
const name = ref('')
const distance = ref('')
const gate = ref('')
const desc = ref('<p>Describe the hotel for guests.</p>')
const price = ref(1200)
const status = ref('d')
const tags = ref(['360°', 'Haram view'])
const room = ref('tw')
</script>

<template>
  <div class="tpl-col">
    <TplSlot id="header">
      <UiPageHeader title="Add hotel" subtitle="Information, media and pricing">
        <template #actions>
          <TplSlot id="actions">
            <div class="tpl-row">
              <UiButton variant="tonal" tone="danger">Discard</UiButton>
              <UiButton>Save draft</UiButton>
              <UiButton variant="primary">Publish</UiButton>
            </div>
          </TplSlot>
        </template>
      </UiPageHeader>
    </TplSlot>
    <div class="tpl-two">
      <div class="tpl-two-main tpl-col">
        <TplSlot id="main">
          <UiCard title="Hotel information">
            <div class="tpl-col">
              <UiTextField v-model="name" label="Name" placeholder="Hilton Suites Makkah" />
              <div class="tpl-auto">
                <UiTextField v-model="distance" label="Distance to the Haram" placeholder="300 m" />
                <UiTextField v-model="gate" label="Gate" placeholder="Gate 1" />
              </div>
              <UiRichEditor v-model="desc" label="Description" />
            </div>
          </UiCard>
        </TplSlot>
        <TplSlot id="media">
          <UiCard title="Photos"><UiFileUpload title="Drop photos here" hint="JPG up to 10 MB" multiple /></UiCard>
        </TplSlot>
      </div>
      <div class="tpl-two-side tpl-col">
        <TplSlot id="side">
          <UiCard title="Pricing">
            <div class="tpl-col">
              <UiNumberInput v-model="price" label="Price per night, SAR" :step="50" />
              <UiSelect v-model="status" label="Status" :options="[{ value: 'p', label: 'Published' }, { value: 'd', label: 'Draft' }]" />
              <UiChipInput v-model="tags" label="Tags" />
              <UiOptionCards v-model="room" label="Room type" :min="140" :options="[{ value: 'tw', icon: 'bed-double', title: 'Twin' }, { value: 'su', icon: 'sofa', title: 'Suite' }]" />
            </div>
          </UiCard>
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
.tpl-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px; align-items: start; }
.tpl-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
</style>
