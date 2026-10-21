<script setup lang="ts">
import { twoWeeks, revenue90, orders24, branches, channels, days365, huge, negatives, gaps, week } from '~/docs-data/examples/data'
useSeo({ title: 'Charts — @ziyarago/ui', description: 'LineChart, AreaChart, BarChart and DonutChart from @ziyarago/ui-pro: inline SVG charts with localized axes, empty and loading states, RTL, tooltips and keyboard navigation. Live examples including the edge cases.' })

const revenue = revenue90()
const orders = orders24()
const visits = days365()
const clicked = ref('Click or press Enter on a point')
const toggled = ref('Press a legend button')
const onPoint = (p: any) => (clicked.value = `${p.series}: ${p.label} = ${p.y}`)
const onSlice = (p: any) => (clicked.value = `${p.label}: ${Math.round(p.share * 100)}%`)
const onToggle = (e: any) => (toggled.value = `${e.label} is now ${e.hidden ? 'hidden' : 'shown'}`)
const sar = week().map(p => ({ x: p.x, y: (p.y as number) * 1000 }))
const arabic = [
  { key: 'a', label: 'المبيعات', tone: 'brand', values: sar },
  { key: 'b', label: 'الأسبوع السابق', tone: 'neutral', dashed: true, values: week().map((p, i) => ({ x: p.x, y: [31, 40, 44, 52, 58, 70, 66][i] * 1000 })) },
]
const single = [{ key: 'a', label: 'Orders', tone: 'brand', values: [{ x: '2026-10-12', y: 42 }] }]
const flat = [{ key: 'a', label: 'Orders', values: week().map(p => ({ x: p.x, y: 5 })) }]
const nulls = [{ key: 'a', label: 'Orders', values: [{ x: '2026-10-12', y: null }, { x: '2026-10-13', y: null }] }]
const zeros = [{ key: 'a', label: 'Orders', values: orders.slice(0, 1).flatMap(s => s.values.slice(0, 8).map(p => ({ x: p.x, y: 0 }))) }]
const zeroDonut = [{ key: 'a', label: 'Direct', value: 0 }, { key: 'b', label: 'Partners', value: 0 }]
const keys: [string, string][] = [
  ['Left / Right', 'Previous and next point or category (mirrored in RTL). The tooltip follows and the value is read out by a live region.'],
  ['Up / Down', 'Previous and next series at the same point (bars: the same keys; horizontal bars swap the pairs).'],
  ['Home / End', 'First and last point.'],
  ['Enter / Space', 'Fires point-click for the point in focus.'],
  ['Escape', 'Hides the tooltip.'],
]
const props: [string, string][] = [
  ['series', 'LineChart, AreaChart, BarChart: { key, label, values: { x: string | number | Date, y: number | null }[], tone?, dashed? }[]. A null y is a gap, never a zero.'],
  ['data', 'DonutChart: { key, label, value, tone? }[].'],
  ['unit, currency, y-format', 'count (compact axis 1.2k, 1.2M by Intl), currency with an ISO code (UZS, SAR, USD) or percent; y-format (n) => string replaces them.'],
  ['orientation, stacked', 'BarChart only: vertical or horizontal, grouped or stacked.'],
  ['height, size', 'Height in px or xs to xl (donut: diameter). The width is the width of the container.'],
  ['loading, empty-text, empty-icon', 'Skeleton in the shape of the chart; empty state text (default "No data for this period") and an optional icon.'],
  ['legend, locale, dir, label', 'Text legend with toggle buttons (aria-pressed), number and date locale, direction, accessible name.'],
  ['@point-click, @legend-toggle', 'React: onPointClick, onLegendToggle. Payloads: { seriesKey, series, index, x, label, y } (donut: { key, label, value, share, index }) and { key, label, hidden }.'],
]
</script>

<template>
  <article class="g">
    <h1>Charts</h1>
    <p class="lead">Four chart components in <code>@ziyarago/ui-pro</code>, group Data display: <code>UiLineChart</code>, <code>UiAreaChart</code>, <code>UiBarChart</code> and <code>UiDonutChart</code>. Inline SVG, no dependencies, colors from <code>--zg-chart-*</code> tokens in light, dark, gold and tamam. Resize the window, switch the theme or the language: every example below follows.</p>

    <h2>Time series</h2>
    <div class="grid">
      <UiChartCard title="Orders per day" subtitle="This week and the previous one (dashed)">
        <UiLineChart :series="twoWeeks" label="Orders per day" @point-click="onPoint" @legend-toggle="onToggle" />
        <p class="out" aria-live="polite">{{ clicked }} · {{ toggled }}</p>
      </UiChartCard>
      <UiChartCard title="Revenue" subtitle="Last 90 days, UZS (millions on the axis)">
        <UiAreaChart :series="revenue" unit="currency" currency="UZS" label="Revenue" size="lg" />
      </UiChartCard>
      <UiChartCard title="Visits" subtitle="365 points, the label step adapts">
        <UiLineChart :series="visits" :show-points="false" label="Visits" />
      </UiChartCard>
      <UiChartCard title="Huge numbers" subtitle="Monthly volume, 1.2T to 6.5T">
        <UiAreaChart :series="huge" unit="currency" currency="USD" label="Gross volume" />
      </UiChartCard>
      <UiChartCard title="Negative values" subtitle="Zero line drawn, fill goes to zero">
        <UiAreaChart :series="negatives" unit="currency" currency="USD" label="Net cash flow" />
      </UiChartCard>
      <UiChartCard title="Gaps" subtitle="null breaks the line, it is not a zero">
        <UiLineChart :series="gaps" label="Orders by branch" />
      </UiChartCard>
    </div>

    <h2>Bars</h2>
    <div class="grid">
      <UiChartCard title="Orders by hour" subtitle="24 hours">
        <UiBarChart :series="orders" label="Orders by hour" />
      </UiChartCard>
      <UiChartCard title="Revenue per branch" subtitle="Grouped">
        <UiBarChart :series="branches" unit="currency" currency="USD" label="Revenue per branch" />
      </UiChartCard>
      <UiChartCard title="Revenue per branch" subtitle="Stacked, horizontal">
        <UiBarChart :series="branches" stacked orientation="horizontal" unit="currency" currency="USD" label="Revenue per branch" />
      </UiChartCard>
    </div>

    <h2>Shares</h2>
    <div class="grid">
      <UiChartCard title="Sales channels" subtitle="Total in the centre, legend toggles the slices">
        <UiDonutChart :data="channels" unit="currency" currency="UZS" label="Sales by channel" @point-click="onSlice" />
      </UiChartCard>
      <UiChartCard title="Payments" subtitle="Percent, one slice is wide">
        <UiDonutChart :data="[{ key: 'a', label: 'Paid', value: 72 }, { key: 'b', label: 'Pending', value: 21 }, { key: 'c', label: 'Failed', value: 7, tone: 'danger' }]" unit="percent" />
      </UiChartCard>
    </div>

    <h2>Empty, loading, edge cases</h2>
    <div class="grid">
      <UiChartCard title="Empty series" subtitle="series = []"><UiLineChart :series="[]" /></UiChartCard>
      <UiChartCard title="Only null values" subtitle="Custom empty text"><UiLineChart :series="nulls" empty-text="Nothing sold yet" empty-icon="inbox" /></UiChartCard>
      <UiChartCard title="All zeros, bars" subtitle="No axis of zeros"><UiBarChart :series="zeros" /></UiChartCard>
      <UiChartCard title="All zeros, donut" subtitle="Same empty state"><UiDonutChart :data="zeroDonut" /></UiChartCard>
      <UiChartCard title="Single point" subtitle="One dot, centered"><UiLineChart :series="single" /></UiChartCard>
      <UiChartCard title="All values equal (5)" subtitle="Axis from 0 with headroom"><UiLineChart :series="flat" /></UiChartCard>
      <UiChartCard title="Loading" subtitle="Skeleton in the shape of the chart">
        <div class="trio"><UiLineChart :series="[]" loading size="sm" /><UiBarChart :series="[]" loading size="sm" /><UiDonutChart :data="[]" loading size="sm" /></div>
      </UiChartCard>
      <UiChartCard title="Arabic, right to left" subtitle="locale ar: digits, month names, mirrored axis and tooltip">
        <UiLineChart dir="rtl" locale="ar" :series="arabic" unit="currency" currency="SAR" />
      </UiChartCard>
    </div>

    <h2>Keyboard and tooltip</h2>
    <p>The plot is one tab stop with <code>role="img"</code>, an <code>aria-label</code> that states the series, the period, the minimum, the maximum and the last value, and a visually hidden data table. The tooltip shows on hover and on tap and stays inside the chart box.</p>
    <div class="tbl" role="table" aria-label="Keyboard"><div v-for="[k, d] in keys" :key="k" class="row" role="row"><b role="cell">{{ k }}</b><span role="cell">{{ d }}</span></div></div>

    <h2>API</h2>
    <div class="tbl" role="table" aria-label="Props"><div v-for="[k, d] in props" :key="k" class="row" role="row"><b role="cell">{{ k }}</b><span role="cell">{{ d }}</span></div></div>
    <p class="muted">Full props, events and notes are on the component pages: <NuxtLink to="/docs/components/LineChart">LineChart</NuxtLink>, <NuxtLink to="/docs/components/AreaChart">AreaChart</NuxtLink>, <NuxtLink to="/docs/components/BarChart">BarChart</NuxtLink>, <NuxtLink to="/docs/components/DonutChart">DonutChart</NuxtLink>. The charts are part of the Pro package, see <NuxtLink to="/pricing">pricing</NuxtLink>.</p>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 20px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; }
.muted { margin: 0; color: var(--zg-text-3); font-size: 14px; }
p { margin: 0; color: var(--zg-text-2); max-width: 70ch; line-height: 1.6; }
code { font-family: var(--zg-font-mono); font-size: .92em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; overflow-wrap: anywhere; }
a { color: var(--zg-brand-text); text-decoration: none; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr)); gap: 16px; align-items: start; }
.out { font-size: 13px; color: var(--zg-text-3); }
.trio { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); gap: 12px; align-items: end; }
.tbl { display: flex; flex-direction: column; border-radius: 14px; box-shadow: inset 0 0 0 1px var(--zg-stroke); overflow: hidden; }
.row { display: grid; grid-template-columns: minmax(150px, 240px) minmax(0, 1fr); gap: 16px; padding: 12px 16px; color: var(--zg-text-2); line-height: 1.6; font-size: 15px; }
.row + .row { box-shadow: inset 0 1px 0 var(--zg-stroke); }
.row b { color: var(--zg-text-1); font-weight: 600; }
@media (max-width: 700px) { .row { grid-template-columns: minmax(0, 1fr); gap: 4px; } }
</style>
