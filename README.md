# @ziyarago/ui

[![npm](https://img.shields.io/npm/v/@ziyarago/ui?color=c89b5e)](https://www.npmjs.com/package/@ziyarago/ui) [![license](https://img.shields.io/npm/l/@ziyarago/ui?color=555)](LICENSE) [![docs](https://img.shields.io/badge/docs-ziyara.vip-c89b5e)](https://ziyara.vip)

<p align="center"><a href="https://ziyara.vip"><img src="https://raw.githubusercontent.com/ziyarago/ui/main/docs/images/hero-dark.png" alt="ziyarago/ui: glass design system for Vue, Nuxt and React" width="100%"></a></p>

Glass design system for Vue 3, Nuxt and React: 102 free components and 6 page templates (the Pro package adds 110 components and 33 templates), OKLCH tokens, dark and light, RTL and Arabic, 16 interface languages. One framework-neutral core with thin adapters. Built for Umrah and Hajj products, usable anywhere.

<table>
  <tr>
    <td width="50%"><img src="https://raw.githubusercontent.com/ziyarago/ui/main/docs/images/hero-light.png" alt="Light theme"><br><sub>Light and dark themes</sub></td>
    <td width="50%"><img src="https://raw.githubusercontent.com/ziyarago/ui/main/docs/images/hero-rtl.png" alt="Arabic RTL"><br><sub>Arabic, RTL mirrored</sub></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/ziyarago/ui/main/docs/images/components.png" alt="Component catalog"><br><sub>212 components documented with props and live examples (102 free, 110 Pro)</sub></td>
    <td><img src="https://raw.githubusercontent.com/ziyarago/ui/main/docs/images/templates.png" alt="Page templates"><br><sub>page templates: 6 free, 33 Pro</sub></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/ziyarago/ui/main/docs/images/button-docs.png" alt="Props docs"><br><sub>Every prop and variant documented</sub></td>
    <td><img src="https://raw.githubusercontent.com/ziyarago/ui/main/docs/images/backgrounds.png" alt="Animated backgrounds"><br><sub>Animated backgrounds and gradient cards</sub></td>
  </tr>
</table>

Files:

```
src/core/        components*.js, pages.js: the 102 free components and 6 page templates as { state, slots, render(ctx) }; no framework imports
src/vue/         Vue 3 adapter  (UiButton, UiAppShell … + install(app))
src/react/       React adapter  (same names)
src/theme.js     useUiTheme(): theme · palette · dir → <html> attributes, persisted
src/styles/      tokens.css (OKLCH) · components*.css (zg-* classes) · fonts.css
dist/            style.css (single file, fonts rewritten) · tokens.css   ← what you import
types/           .d.ts for core, vue, react, theme
tokens/          tokens.json for Flutter and native clients
assets/          fonts/thmanyah (the only assets in the npm package)
```

## Packages
- `@ziyarago/ui`: the component library (Vue 3, Nuxt module, React adapter, styles, tokens, API manifest).
- `@ziyarago/ui-mcp`: MCP server and `init` command that connects AI coding tools to the component catalog.

Docs, props and live examples: https://ziyara.vip

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
- Fonts: Manrope (Latin, Cyrillic), Thmanyah Sans (Arabic, `dir="rtl"`), JetBrains Mono (code). All three ship in `assets/fonts` and load from your own origin, no Google request. Full table, weight mapping and self-hosting: docs site `/docs/fonts`. Colors: `/docs/colors`. Icons (Lucide) and map tiles load from the network — see `THIRD_PARTY_NOTICES.md` for self-hosting.
- SSR: components render on the server; icons, `UiMap`, `UiRichEditor`, `UiTour` and `useUiTheme()` touch `document` only on the client.
- Palettes via `data-palette="gold|tamam"`, theme via `data-theme="dark|light"`, direction via `dir="rtl"` on `<html>`.
- Releases: see `docs/PUBLISHING.md`, history in `CHANGELOG.md`.
- Coming from `@ziyarago/glass-ui-kit` (Vue 3, `Ui*` local copies)? migration tooling (the `compat` layer with the old component names and a step by step guide) is part of `@ziyarago/ui-pro`.

## License
Code: MIT (`LICENSE`). The ZiyaraGo logo and 3D icons are not part of the package and are not MIT: they appear on the docs site for demonstration only, see `LICENSE-ASSETS.md`.

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
- Icons are Lucide names (`icon="search"`). SVGs are fetched once from unpkg `lucide-static@0.460.0` and inlined as data-URI masks (they take `currentColor`). Under a strict CSP (`connect-src 'self'`) the CDN request is blocked: copy `lucide-static/icons` to your public folder and call `setIconBase('/icons/')` from `@ziyarago/ui` before mount.
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
Domain: LeadCard · HotelCard · TourCard · PrayerTimes · RamadanTracker · QiblaCompass · CallRow

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
