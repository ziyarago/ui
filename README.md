# @ziyarago/ui

Glass design system for ZiyaraGo products (Umrah / Hajj). Vue 3 **and** React adapters over one framework-neutral core. Reference: `ziyarago/glass-ui-kit`.

```
src/core/        components.js … components6.js, pages.js — 160+ components and 16 page templates as { state, slots, render(ctx) }; no framework imports
src/vue/         Vue 3 adapter  (UiButton, UiAppShell … + install(app))
src/react/       React adapter  (same names)
src/theme.js     useUiTheme(): theme · palette · dir → <html> attributes, persisted
src/styles/      tokens.css (OKLCH) · components*.css (zg-* classes) · fonts.css
dist/            style.css (single file, fonts rewritten) · tokens.css   ← what you import
types/           .d.ts for core, vue, react, theme
tokens/          tokens.json for Flutter and native clients
assets/          fonts/thmanyah · 3d (PNG icons) · brand (logo)
```

## Install

```bash
npm i @ziyarago/ui            # Vue 3.5+ or React 18+ is a peer dependency, install the one you use
```
```js
import '@ziyarago/ui/style.css'
import { useUiTheme } from '@ziyarago/ui/theme'
useUiTheme().setLocale('ar')   // dir=rtl, Thmanyah Sans
```

Vue: `import { UiButton, UiAppShell } from '@ziyarago/ui/vue'` or `app.use(ui)` with `import ui from '@ziyarago/ui/vue'`.
React: `import { UiButton, UiAppShell } from '@ziyarago/ui/react'`.
Nuxt 3/4: `modules: ['@ziyarago/ui/nuxt']` — registers every `Ui*` component (auto-import), `useUiTheme`, the stylesheet and SSR-safe `<html>` theme attributes. Options: `ziyarago: { css, prefix, theme: { theme, palette, dir } }`. Needs `@nuxt/kit` (ships with Nuxt).
Types ship with the package. Only 9 core components have typed props so far; the rest accept `Record<string, any>`.

### Requirements and notes
- Node 18+ for tooling; any bundler that handles ES modules and CSS imports (Vite, webpack 5, Nuxt, Next). The package is plain ESM, not pre-bundled.
- Fonts: Manrope (Latin, Cyrillic), Thmanyah Sans (Arabic, `dir="rtl"`), JetBrains Mono (code). Thmanyah ships in `assets/fonts`; Manrope and JetBrains Mono load from Google Fonts. Full table, weight mapping and self-hosting: docs site `/docs/fonts`. Colors: `/docs/colors`. Icons (Lucide) and map tiles load from the network — see `THIRD_PARTY_NOTICES.md` for self-hosting.
- SSR: components render on the server; icons, `UiMap`, `UiRichEditor`, `UiTour` and `useUiTheme()` touch `document` only on the client.
- Palettes via `data-palette="gold|tamam"`, theme via `data-theme="dark|light"`, direction via `dir="rtl"` on `<html>`.
- Releases: see `docs/PUBLISHING.md`, history in `CHANGELOG.md`.

## License
Code: MIT (`LICENSE`). Brand assets (logo, 3D icons) are not MIT: see `LICENSE-ASSETS.md`.

## AI and MCP
`npx @ziyarago/ui-mcp init` connects Claude Code, Cursor and others to the component catalog (props, values, slots, templates). Without MCP the package ships `llms.txt`, `llms-full.txt` and `manifest.json`. See `/docs/ai`.

## Display settings
`useUiTheme()`: `setTheme`, `setPalette`, `setDir`, `setMotion('auto|on|off')`, `setEffects('auto|full|lite')`, `setBackground('none|aurora|sunset|ocean|emerald|rose|mesh')`. Lite effects remove blur and glow for weak devices; Auto picks by browser capability and the system reduced-motion setting.

## Sizes
Controls and density-bearing components take `size="xs|sm|md|lg|xl"` (default `md`). Containers, page templates and pure visualisations have no size. Popup-only components (`Tooltip`, `HoverCard`, `ContextMenu`) scale the popup. The scale tokens are `--zg-sz-h`, `--zg-sz-fs`, `--zg-sz-px`, `--zg-sz-gap`, `--zg-sz-icon`, `--zg-sz-pad` on `[data-size]`.

## Two menus
```vue
<UiAppShell nav="top"  :items="nav" v-model="page"> … </UiAppShell>
<UiAppShell nav="side" :items="nav" v-model="page" collapsible> … </UiAppShell>
```
`items`: `{ value, label, icon, count }`; `{ group: 'Workspace' }` adds a section label in the sidebar. Sidebar collapses to icons (76 px); below 820 px it hides and a top bar takes over. RTL flips automatically.

## Conventions
- Controlled inputs: Vue `v-model` / `@change`; React `modelValue` + `onChange(value)`.
- Slots: Vue named slots (`#actions`, `#footer`); React props `actions`, `footer`.
- Icons are Lucide names (`icon="search"`). SVGs are fetched once from unpkg `lucide-static@0.460.0` and inlined as data-URI masks (they take `currentColor`). Self-host with `setIconBase('/icons/')` from `@ziyarago/ui`.
- Theme: `[data-theme=dark|light]`, palette `[data-palette=gold|tamam]`, direction `dir`.
- Formatters `fmt.num / sar / dur`: `-1 → ∞`, NaN/null → `—`, `1 м 05 с`.
- Brand fill for ONE hero element per view.

## Components (37)
Actions: Button · IconButton · Badge · Avatar · Switch · Checkbox · SegmentedControl · Tabs · FilterChips
Fields: TextField · Select · CodeInput · Stepper
Surfaces: Card · Modal · Drawer · Toast
Data: KpiTile · Progress · Ring · DataTable · KanbanColumn · KanbanCard · Timeline
Navigation: TopNav · SideNav · Breadcrumbs · Pagination
Layout: AppShell · PageHeader · AuthLayout
Domain: LeadCard · HotelCard · TourCard · PrayerTimes · RamadanTracker · CallRow

## Not done yet
TypeScript typings, a build step (the package ships ES source), tests, DatePicker, CommandPalette, Map components, i18n bundle (6 locales), and a Flutter widget port (tokens.json is ready for it).


## Page templates

16 ready layouts live in `src/core/pages.js`. Put them inside `<UiAppShell>` (except `PageAuth` and `PageStatus`, which are full-screen) and fill only the slots you need. Empty slots render nothing.

| Component | Slots |
|---|---|
| PageDashboard | header · hero · kpis · occupancy · funnel · top · activity |
| PagePatterns | header · hero · strip · statlines · chartcard · tiles · listrows · countries · versus · segbar · activity · actioncard |
| PageCrm | header · summary · filters · board · calls |
| PageBookings | header · stats · toolbar · bulk · table · pager |
| PageCatalog | header · filters · toolbar · grid · pager |
| PageDetail | header · gallery · summary · tabs · history · booking |
| PageSettings | header · subnav · profile · notifications · integrations · danger |
| PageUserList | header · stats · filters · toolbar · table · drawer |
| PageProfile | profile · tabs · about · activity · plan |
| PageForm | header · main · media · side |
| PageOrder | header · status · items · shipping · side |
| PageAccount | header · tabs · panel |
| PagePricing | toggle · plans · faq |
| PageFaq | search · cats · answers · contact |
| PageAuth | background · logo · aside · form · footer (props: title, subtitle, layout="card"\|"split") |
| PageStatus | code · message · action (or prop kind="404"\|"401"\|"maintenance"\|"soon") |

`header` is built from props `title`, `subtitle`, `crumbs` and the `actions` slot, or replaced entirely by a `header` slot.

```vue
<UiAppShell nav="top" :items="nav" v-model="page">
  <UiPageDashboard title="Dashboard">
    <template #kpis><UiKpiTile label="Bookings" value="1 248" /></template>
    <template #funnel><UiSalesFunnel :steps="steps" /></template>
  </UiPageDashboard>
</UiAppShell>
```

```jsx
<UiPageDashboard title="Dashboard" kpis={<UiKpiTile label="Bookings" value="1 248" />} />
```
