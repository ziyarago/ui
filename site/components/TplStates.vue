<script setup lang="ts">
const retries = ref(0)
</script>

<template>
  <div class="tst">
    <UiPageHeader title="States" subtitle="Every empty, error and loading variant in one place" />
    <div class="tst__grid">
      <TplSlot id="empty"><UiCard title="Empty list"><UiEmptyState icon="inbox" title="No bookings yet" description="Create your first booking to see it here."><UiButton variant="primary" icon="plus">New booking</UiButton></UiEmptyState></UiCard></TplSlot>
      <TplSlot id="noresults"><UiCard title="No results"><UiEmptyState icon="search-x" title="Nothing found" description="Try a different word or reset the filters."><UiButton variant="ghost">Reset filters</UiButton></UiEmptyState></UiCard></TplSlot>
      <TplSlot id="forbidden"><UiCard title="No permission"><UiEmptyState icon="lock" title="You do not have access" description="Ask an owner to give you the Manager role."><UiButton icon="send">Request access</UiButton></UiEmptyState></UiCard></TplSlot>
    </div>
    <div class="tst__grid">
      <TplSlot id="offline"><UiCard title="Offline"><UiDataState state="offline" /></UiCard></TplSlot>
      <TplSlot id="error"><UiCard title="Error with retry"><UiDataState state="error" description="We could not load your trips." @retry="retries++" /></UiCard></TplSlot>
      <TplSlot id="loading">
        <UiCard title="Loading"><div class="tst__sk"><UiSkeleton variant="rect" height="80px" /><UiSkeleton :lines="3" /><div class="tst__skr"><UiSkeleton variant="circle" /><UiSkeleton :lines="2" /></div></div></UiCard>
      </TplSlot>
    </div>
    <TplSlot id="success"><UiAlert tone="success" title="Payment received">Your booking BK-2041 is confirmed. We sent the voucher to your email.<template #actions><UiButton size="sm" variant="primary">View booking</UiButton><UiButton size="sm" variant="ghost">Download receipt</UiButton></template></UiAlert></TplSlot>
  </div>
</template>

<style scoped>
.tst { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tst__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 16px; align-items: stretch; }
.tst__grid > :deep(.zgs) { display: flex; flex-direction: column; }
.tst__grid > :deep(.zgs) > * { flex: 1; }
.tst__sk { display: flex; flex-direction: column; gap: 14px; }
.tst__skr { display: flex; gap: 12px; align-items: center; }
.tst__skr > :last-child { flex: 1; }
</style>
