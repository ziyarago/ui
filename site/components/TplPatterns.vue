<script setup lang="ts">
const tile = ref('o')
</script>

<template>
  <div class="col">
    <TplSlot id="header">
      <UiPageHeader title="Dashboard patterns" subtitle="Twelve reusable cards" />
    </TplSlot>
    <div class="auto" style="--min: 340px">
      <TplSlot id="hero">
        <UiHeroBanner title="Congratulations, Shodiya" text="You closed 14 of 20 sales this month." value="$42 800" cta="View sales" image="/3d/mosque.png" />
      </TplSlot>
      <TplSlot id="strip">
        <UiStatStrip :items="[{ icon: 'users', tone: 'brand', value: '1 240', label: 'Leads' }, { icon: 'calendar-check', tone: 'sky', value: '268', label: 'Meetings' }, { icon: 'wallet', tone: 'success', value: '86', label: 'Paid' }]" />
      </TplSlot>
    </div>
    <TplSlot id="statlines">
      <div class="auto" style="--min: 190px">
        <UiStatLine tone="brand" icon="wallet" value="$214k" label="Revenue" delta="+8%" />
        <UiStatLine tone="sky" icon="users" value="1 240" label="Guests" delta="+12%" />
        <UiStatLine tone="warning" icon="clock" value="31" label="Pending" />
        <UiStatLine tone="danger" icon="x" value="34" label="Cancelled" delta="-3%" />
      </div>
    </TplSlot>
    <div class="auto" style="--min: 360px">
      <TplSlot id="chartcard">
        <UiChartCard title="Occupancy" subtitle="Next 7 days" :menu="['View more', 'Delete']">
          <UiOccupancyChart :values="[62, 74, 88, 95, 91, 70, 58]" :labels="['M', 'T', 'W', 'T', 'F', 'S', 'S']" />
        </UiChartCard>
      </TplSlot>
      <TplSlot id="tiles">
        <UiCard title="Earning reports">
          <UiTabTiles :value="tile" addable :items="[{ value: 'o', icon: 'shopping-cart', label: 'Orders' }, { value: 's', icon: 'chart-column', label: 'Sales' }, { value: 'p', icon: 'wallet', label: 'Profit' }]" @change="tile = $event" />
          <UiMiniChart :values="[4, 8, 5, 12, 9, 14, 11]" highlight-last :height="90" />
        </UiCard>
      </TplSlot>
    </div>
    <div class="auto" style="--min: 320px">
      <TplSlot id="listrows">
        <UiCard title="Transactions">
          <UiStatRow icon="wallet" tone="brand" title="Wallet" sub="Starbucks" value="$1 200" delta="+8%" />
          <UiStatRow icon="credit-card" tone="sky" title="Card" sub="Hilton Suites" value="$18 400" delta="+12%" />
          <UiStatRow icon="banknote" tone="success" title="Cash" sub="Airport transfer" value="$240" delta="-2%" />
        </UiCard>
      </TplSlot>
      <TplSlot id="countries">
        <UiCard title="Sales by countries">
          <UiCountryRow code="UZ" amount="$8 700" name="Uzbekistan" pct="+25%" />
          <UiCountryRow code="SA" amount="$7 200" name="Saudi Arabia" pct="+14%" />
          <UiCountryRow code="RU" amount="$3 100" name="Russia" pct="-8%" />
        </UiCard>
      </TplSlot>
      <TplSlot id="versus">
        <UiCard title="Sales overview">
          <UiVersusBar :left="{ label: 'Orders', value: 62100 }" :right="{ label: 'Visits', value: 25500 }" />
          <div style="height: 14px" />
          <TplSlot id="segbar">
            <UiSegBar :segments="[{ label: 'Confirmed', value: 86 }, { label: 'Pending', value: 31 }, { label: 'Cancelled', value: 34 }]" />
          </TplSlot>
        </UiCard>
      </TplSlot>
    </div>
    <div class="auto" style="--min: 360px">
      <TplSlot id="activity">
        <UiCard title="Activity">
          <UiTimeline :items="[{ title: 'Payment received', text: 'BK-2041', time: '2 min ago' }, { title: 'Status changed', time: '10 min ago' }]" />
        </UiCard>
      </TplSlot>
      <TplSlot id="actioncard">
        <UiActionCard title="Weekly report" subtitle="Collapse · refresh · close">
          <p class="note">Every Monday we email the report to the manager and post a copy in Telegram.</p>
        </UiActionCard>
      </TplSlot>
    </div>
  </div>
</template>

<style scoped>
.col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min)), 1fr)); gap: 16px; align-items: start; }
.note { margin: 0; color: var(--zg-text-2); line-height: 1.6; }
</style>
