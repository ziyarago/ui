# Migrating from the local glass-ui-kit copies to @ziyarago/ui

For the two projects that vendor `@ziyarago/glass-ui-kit` 1.32.0 as `src/components/ui/Ui*.vue` (qrbon-saas, tartib-saas): Vite 8, Vue 3.5, Tailwind 4, unplugin-vue-components, vue-i18n 10, lucide-vue-next 1.

The plan has two phases so that nothing has to be rewritten on day one:

1. **Switch imports** to `@ziyarago/ui/compat`. It exports the OLD component names (`UiInput`, `UiTable`, `UiSidebar`, ...) as thin Vue wrappers over the new components, with the old props, slots and events. Delete `src/components/ui` afterwards.
2. **Refactor to the new names** (`UiTextField`, `UiDataTable`, `UiSideNav`, ...) component by component, and drop the compat wrappers you no longer use.

General Tailwind/vue-i18n/SSR recipes live in [INTEGRATION.md](./INTEGRATION.md); this file only covers what is specific to the move.

## 0. What was inventoried

| | qrbon-saas | tartib-saas |
|---|---|---|
| local UI SFCs | 42 in 31 folders | 44 (adds `UiConfirmModal`, `MultilangInput`) |
| composables / helpers | `useToast`, `useCommandPalette`, `useTheme`, `dateUtils`, `lib/tones`, `lib/cn` | same |
| pages using `<Ui*>` | 144 | 158 |

Differences between the two copies: tartib uses i18n keys (`common.*`) for every built-in string, a cobalt (bronze-gold) primary instead of ink, a `variant="ink"` button, `anchorClass` and a body-teleported `UiTooltip`, a text time input in `UiDateTimePicker`, `ConfirmModal`, `MultilangInput`. qrbon has English literals and an ink (black) primary.

Real usage (tags in templates, both projects together): `UiButton` 976, `UiCard` 644, `UiInput` 541, `UiBadge` 291, `UiAlert` 275, `UiSkeleton` 224, `UiSelect` 173, `UiModal` 172, `UiMenuItem` 112, `UiSwitch` 97, `UiTab` 79, `UiAvatar` 72, `UiDatePicker` 47, `UiTable` 47, `UiDropdown` 45, `UiTextarea` 45, `UiMenu` 42, `UiPagination` 35, `UiCheckbox` 34, `UiProgress` 31, `UiStatsCard` 30, `UiConfirmModal` 24, the rest under 25. Slots: `#icon-left` 645, `#prefix` 180, `#footer` 175, `#header` 123, `#subtitle` 116, `#actions` 84, `#cell-*` ~300, `#trigger` 45, `#empty` 34.

## 1. Mapping summary

44 local SFCs:

| bucket | count | components |
|---|---|---|
| **1:1**, same name, same props after a mechanical translation | 14 | Alert, Avatar, Badge, Breadcrumbs, Button, Calendar, Checkbox, Combobox, DatePicker (single date), Progress, Select, Skeleton, Switch, Textarea |
| **Renamed or props reshaped**, the new component renders it | 7 | Card (padding to size), ConfirmModal (to ConfirmDialog), Input (to TextField), Modal (sizes, v-model:open), Pagination (current/total to page/pages), SegmentedControl (options to items), StatsCard (to StatsCard or KpiTile) |
| **Different model** (compound or slot API vs data-driven), re-implemented in compat on top of the kit's CSS and components | 20 | Tabs, TabsList, Tab, TabPanel, Radio, RadioGroup, Dropdown, Menu, MenuItem, MenuSeparator, Table (to DataTable), Sidebar, SidebarItem, SidebarSection, Navbar (to TopNav), SubNav, ToastContainer with `useToast`, CommandPalette with `useCommandPalette`, FileUpload (stateless in the new kit), Tooltip (teleported, rich content) |
| **Missing in the new kit** (exist only in compat) | 3 | AvatarGroup, DateTimePicker (ISO string, date + time), MultilangInput (tartib only) |

Also: `useTheme` becomes a compat shim over `@ziyarago/ui/theme`; `useToast` and `useCommandPalette` are re-implemented with the old signatures; `lib/tones.ts` and `lib/cn.ts` are Tailwind helpers and stay.

The published kit (`@ziyarago/glass-ui-kit`, 143 catalog entries): 98 have a same-name component in the new kit (props may differ, check the tables in section 6); 45 do not, see Appendix A.

## 2. Install

```bash
npm i @ziyarago/ui
# peers you already have: vue >= 3.5. Optional, only when you use them: vue-i18n 10 (the compat layer reads it if present), vue-router 4 (UiSubNav).
```

You can later remove `@floating-ui/vue`, `class-variance-authority` and (when no page imports it) `tailwind-merge` from the UI layer; the pages themselves still use `clsx`, `lucide-vue-next` and Tailwind.

**CSP warning:** icons are fetched at runtime. Under `connect-src 'self'` they disappear unless you self-host them as shown below (`setIconBase`). Do this before shipping to a server with a strict CSP.

Keep `lucide-vue-next`. The new kit takes icons by NAME (`icon="trash-2"`) and fetches Lucide SVGs from `unpkg.com/lucide-static@0.460.0/icons/` at runtime; the compat layer converts your Lucide components to names for you (`iconName()`), including the 9 icons that lucide-vue-next 1.x renamed (`funnel` to `filter`, `circle-question-mark` to `circle-help`, `text-align-start` to `align-left`, ...). To avoid the CDN (offline, CSP, flash on first paint) self-host once:

```bash
npm i -D lucide-static@0.460.0
cp -R node_modules/lucide-static/icons public/lucide      # or copy in your build
```
```ts
import { setIconBase } from "@ziyarago/ui/vue";
setIconBase("/lucide/");
```

## 3. CSS

In `src/styles/main.css`, directly after Tailwind, import the kit INTO the `components` layer (so Tailwind utilities such as `w-44`, `p-0`, `h-20`, `bg-red-500` on kit components still win, and the bundled `@font-face` rules stay valid inside the layer; since 0.7 there is no remote `@import` in `style.css`):

```css
@import "tailwindcss";
@import "@ziyarago/ui/style.css" layer(components);

/* class-based dark mode stays as it is */
@custom-variant dark (&:where(.dark, .dark *));
```

Verified with Vite 6, Tailwind 4.3 in dev and in a production build. Do not add `class="zg-root"` yet: it sets font, text color and background on the element and would replace your body styles. Add it later if you want the kit's typography.

### Making the kit look like your app (optional, 5 lines)

The kit paints with `--zg-*` variables; your Tailwind theme (`--color-cobalt-*`, `--font-sans`) is untouched. To keep your font and brand:

```css
:root {
  --zg-font: var(--font-sans);                 /* Geist instead of Manrope */
  --zg-brand: var(--color-cobalt-600);         /* tartib: bronze-gold. qrbon: leave the default gold, or see "primary" below */
  --zg-brand-hover: var(--color-cobalt-500);
}
```

qrbon's primary button is a black pill. The new `primary` is the brand color. Either keep black: `configureCompat({ primary: "inverse" })` (section 5), or accept the gold CTA.

## 4. Theme

| | old (`composables/useTheme.ts`) | new (`@ziyarago/ui/theme`) |
|---|---|---|
| API | `useTheme()` returns `{ theme, setTheme, toggleTheme }` (`theme` is a readonly ref) | `useUiTheme()` returns `{ theme, palette, dir, motion, effects, bg, setTheme, toggleTheme, setPalette, setDir, setLocale, setMotion, setEffects, setBackground, subscribe, snapshot }`, plain getters (not refs) |
| dark mode | class `.dark` on `<html>` + `color-scheme` | attribute `data-theme="dark"|"light"` on `<html>` |
| storage | `localStorage["glass-ui-theme"]` = `"light"|"dark"` | `localStorage["zg-ui"]` = JSON (theme, palette, dir, motion, effects, bg) |
| default | system preference | `dark` |
| palettes | one (the project's `@theme` colors) | `gold` (default, brand `oklch(0.676 0.084 67.4)`) and `tamam` (green) via `data-palette` |
| RTL | `applyBootLocale` sets `dir` itself | `setDir("rtl")` / `setLocale("ar")` sets `dir` |
| flash prevention | none | `themeInitScript` (inline in `<head>`) |

Compat shim: `useTheme` from `@ziyarago/ui/compat` has the OLD signature, calls `useUiTheme` underneath, sets BOTH `data-theme` and the `.dark` class (so Tailwind `dark:` keeps working), mirrors the value into the old storage key, and on first run adopts `glass-ui-theme` if the new key is empty. Replace the body of the existing file and nothing else changes:

```ts
// src/composables/useTheme.ts
export { useTheme } from "@ziyarago/ui/compat";
export type { Theme } from "@ziyarago/ui/compat";
```

Pre-paint (optional): `@ziyarago/ui/theme` also exports `themeInitScript`, a string of JavaScript that sets the kit's attributes on `<html>` before the first frame. Inline it in `<head>` (paste it, or inject it with a small Vite `transformIndexHtml` plugin). It only reads `localStorage["zg-ui"]`; your own `.dark` class logic keeps running.

New API when you are off the shim: `const ui = useUiTheme(); ui.setTheme("light"); ui.setPalette("tamam")`. Subscribe with `ui.subscribe(s => ...)` if you need reactivity; wrap it in a `ref` yourself.

## 5. Replace the local components with the compat layer

`vite.config.ts` (order matters: the redirect plugin runs before `vue()`):

```ts
import Components from "unplugin-vue-components/vite";
import { ZiyaragoCompatResolver } from "@ziyarago/ui/compat/resolver";
import { ziyaragoCompat } from "@ziyarago/ui/compat/vite";

export default defineConfig({
  plugins: [
    ziyaragoCompat(),            // rewrites imports of ".../components/ui/..." to "@ziyarago/ui/compat"
    vue(),
    tailwindcss(),
    Components({
      dirs: ["src/components"],  // keeps PageHeader, KpiTile and the other app components
      dts: "src/components.d.ts",
      directoryAsNamespace: false,
      extensions: ["vue"],
      resolvers: [ZiyaragoCompatResolver()],   // <UiInput>, <UiTable>, ... come from compat
    }),
  ],
});
```

- The resolver wins over local files in `dirs` (verified), so you can leave `src/components/ui` in place while you test, then delete it.
- `ziyaragoCompat()` fixes the script imports. In the two projects there are ~290 of them: `import { useToast } from "../../../components/ui/Toast"` (157), `import type { SelectOption } from ".../ui/Select"`, `TableColumn`, `SegmentedOption`, `DateRange`, `useCommandPalette`, `UiDatePicker`/`UiDateTimePicker` from `.../ui/DatePicker`, `import UiInput from ".../ui/Input/UiInput.vue"`. Matching is `components/ui/<Folder>[/<File>]`; `MultilangInput` is excluded (see below). If you prefer to touch the files, replace the paths with `@ziyarago/ui/compat` yourself (all those names are exported).
- Types come with `@ziyarago/ui/compat` (`types/compat.d.ts`): `SelectOption`, `TableColumn<T>`, `TableVariant`, `TableDensity`, `SubNavItem`, `SegmentedOption`, `BreadcrumbItem`, `DateRange`, `Command`, `Toast*`, `MultilangValue`.
- `MultilangInput` (tartib, not part of the published kit) is also exported by compat (a 40-line version: language switcher + `UiTextField`). Keep your local file if you rely on its details: `ziyaragoCompat()` leaves it alone by default.

`main.ts`: nothing for components (auto-import). Keep `useToast` and `<UiToastContainer />` and `<UiCommandPalette />` in `App.vue` as they are. Optional configuration (before `app.mount`):

```ts
import { configureCompat } from "@ziyarago/ui/compat";

configureCompat({
  sizes: "height",      // default. Keeps old pixel heights: old md (48px) renders as new lg (48px), old lg (56px) as new xl. "name" maps md to md.
  primary: "inverse",   // qrbon only: keep the black primary button
  warn: true,           // dev warnings for props the new kit cannot honour (once per prop)
  // t: (key, fallback) => ...   // i18n bridge, see below
});
```

i18n: with vue-i18n installed (`globalInjection` is on by default) the wrappers translate their own default texts through your keys when the key exists, otherwise they fall back to English. Keys read (the tartib ones, already in its messages): `common.areYouSure`, `common.irreversible`, `common.delete`, `common.cancel` (ConfirmModal), `common.select` (Select placeholder), `common.noMatches` (Combobox), `common.noData` (Table, new key), `common.dropFilesOrBrowse` (FileUpload), `common.prevPage`, `common.nextPage` (Pagination), `common.datePlaceholder`, `common.selectDates` (new key, range picker). Date pickers also take their locale from `$i18n.locale` when no `locale` prop is given. Not covered because the new components render the text themselves: aria-labels of the Modal/Alert close button ("Close"), calendar arrows, FileUpload reject texts, Spinner ("Loading").

### After the build is green

Delete `src/components/ui/*` (keep `MultilangInput/` in tartib if you use it) and the `@ziyarago/ui/compat/vite` plugin once every import is rewritten.

## 6. Prop-level mapping

"compat" = what `@ziyarago/ui/compat` does for you automatically. "new" = what to write when you use the new component directly (phase 2).

Size tables, used everywhere below:

| old control size (`UiButton`, `UiInput`, `UiSelect`, `UiCombobox`, `UiDatePicker`) | px | compat, `sizes: "height"` | compat, `sizes: "name"` | new component size for the same height |
|---|---|---|---|---|
| sm | 36 | md (40) | sm | md |
| md | 48 | lg (48) | md | lg |
| lg (old default) | 56 | xl (56) | lg | xl |
| xl | 64 | xl (56) | xl | xl |

New scale: xs 28, sm 32, md 40, lg 48, xl 56 px. Components that are not height-based keep the same names (`Switch`, `Checkbox`, `Radio`, `Textarea`, `Avatar`, `Skeleton`, `Progress`), except `Badge` and `SegmentedControl` (old sm/md/lg become new md/lg/xl in height mode).

### UiButton

| old | compat and new | note |
|---|---|---|
| `variant` primary / glass / ghost / danger | primary / secondary / ghost / danger | `configureCompat({ primary: "inverse" })` renders primary as `inverse` |
| `variant="gradient"` | `variant="tonal" tone="brand"` | |
| `variant="ink"` (tartib) | `variant="inverse"` | |
| `size` md / lg (default) / xl | see size table | |
| `iconOnly`, `block`, `loading`, `disabled` | same (`iconOnly` is a new core prop: square, width = height) | |
| `type` button / submit / reset | `type` (new core prop; the new Button used to be always `type="button"`) | |
| `title` | `title` (new core prop) | |
| slot `icon-left` / `icon-right` | compat renders them around the label inside the default slot, hidden while `loading`. New: `icon="trash-2"` / `iconRight="arrow-right"` (string names) | |
| slot `loading` | not supported (new shows a spinner in place of the icon) | |
| event `click` | same, not fired while disabled or loading | |

### UiInput to UiTextField

| old | compat and new | note |
|---|---|---|
| `modelValue`, `label`, `hint`, `placeholder`, `disabled`, `readonly`, `type` | same | |
| `error` string \| boolean | `error` string. `true` shows the red state without a message | |
| `size` sm md lg xl (default lg) | see size table | |
| `required` | label asterisk + native `required` | |
| `autocomplete`, `name`, `maxlength`, `minlength`, `min`, `max`, `step`, `inputmode`, `pattern`, `spellcheck`, `autofocus`, `autocapitalize` | forwarded to the inner `<input>` (new core feature) | |
| `id` | lands on the root `<label>`, not on the input | |
| `help` | `hint` (it was silently ignored by the old kit: tartib `NotificationConfigPage` passes it, so the text appears now) | |
| `clearable` | unsupported (the old kit ignored it too) | |
| slot `prefix` / `suffix` | same (new core slots; new also has `icon="search"` and the `suffix` prop) | |
| `@update:model-value` | `v-model` works; `@change` now receives the string, not a DOM event | |
| `@input`, `@blur`, `@focus`, `@keydown.enter` | forwarded to the input element. `@input` receives the native `Event` | |

### UiTextarea

`modelValue`, `label`, `hint`, `error`, `rows`, `placeholder`, `disabled`, `required`, `readonly`, `maxlength`, `name` same. `size` md/lg/xl same names. `autoResize` same (CSS `field-sizing: content`, Chromium and Safari). `showCount` same (shows `n / maxlength`). `resize`: old default false, new default true; compat passes `resize: false` unless you set it. `@blur`, `@keydown` forwarded to the `<textarea>`.

### UiSelect, UiCombobox

| old | compat and new | note |
|---|---|---|
| `modelValue`, `options` (`{label, value, disabled}`), `label`, `disabled` | same | option `value: null` works (shows as a normal option) |
| `hint`, `error`, `required`, `name` | same (new core props; `name` renders a hidden input) | |
| `size` md lg xl (default lg) | see size table | |
| `placeholder` (default "Select an option") | default from `common.select` or English | |
| Combobox `clearable`, `filter(option, query)`, `emptyText` | same (new core props; `emptyText` default from `common.noMatches`) | |
| `id` | root element | |
| events | `update:modelValue` and `change(value)` | |

### UiCheckbox, UiSwitch, UiRadio, UiRadioGroup

| old | compat and new |
|---|---|
| Checkbox `modelValue`, `label`, `disabled`, `size`, `name`, `value` | same (`indeterminate`, `hint`, `error` are new core props) |
| Switch `modelValue`, `label`, `hint`, `error`, `disabled`, `size`, `labelLeft` | same (`hint`, `error`, `labelLeft` are new core props) |
| `<UiRadioGroup v-model>` + `<UiRadio :value label hint disabled>` children | compat reads the children and renders the new `RadioGroup`. New: `<UiRadioGroup v-model="x" :options="[{ value, label, hint, disabled }]" />` |
| RadioGroup `label`, `hint`, `error`, `size`, `disabled`, `orientation` | same (`hint`, `error`, `orientation` are new core props) |
| standalone `<UiRadio v-model :value>` (no group) | one-option group each |

### UiBadge, UiAlert, UiAvatar, UiAvatarGroup, UiProgress, UiSkeleton

| old | compat result |
|---|---|
| Badge `tone` sunshine (default) / cobalt | `brand` |
| Badge `tone` petrol | `info` |
| Badge `tone` ink | `inverse` (new tone) |
| Badge `tone` glass / neutral | neutral (no tone) |
| Badge `tone` success warning danger info | same |
| Badge `size` sm md lg | md lg xl in height mode (24/28/32 px), sm md lg in name mode |
| Badge `shape="square"` | `shape="square"` (new core prop); `dot` same; slots `icon-left` / `icon-right` rendered around the label |
| Alert `tone` success warning danger info | same; `glass` and `neutral` render as `info` |
| Alert `title`, `hideIcon`, slots `title` / `icon` / `actions` | same (new core props and slots) |
| Alert `closable` | close button, event `close` (compat attaches the handler only when `closable`). New: handle `@close` yourself (the button exists only when a handler is set). `dismissible` / `@dismiss` were never implemented in the old kit and are ignored |
| Avatar `src`, `size` xs..xl | same (px differ: new 24/32/40/56/72) |
| Avatar `initials` | `initials` (new core prop) |
| Avatar `alt` | `name` |
| Avatar `tone` cobalt / sunshine / petrol / pink / ink | brand / warning / sky / danger / neutral (new core prop `tone`) |
| Avatar `shape="squircle"` | `shape="rounded"`; `ring`, `status` online/offline/away/busy are new core props |
| AvatarGroup `spacing`, `reverse` | compat only (`.zg-avgroup`) |
| Progress `value`, `max`, `label`, `showValue`, `size`, `tone` | value normalised to 0-100 using `max`; `showValue` becomes `meta="NN%"`; tone success warning danger same, sunshine = warning, ink cobalt petrol = brand. Indeterminate (no `value`) shows 0% |
| Skeleton `variant` text rect circle line, `size`, `lines` | same; `line` = 1 px rect; `lastLineWidth` dropped (last line is 60%); a Tailwind `h-*` class on a rect makes it fill the wrapper |

### UiCard, UiModal, UiConfirmModal

| old | compat and new |
|---|---|
| Card `variant` glass / solid | default glass card |
| Card `variant` outline | `variant="outline"` (new core) |
| Card `variant` gradient | `variant="gradient"` |
| Card `variant="block"` + `tone` cobalt / sunshine / petrol / ink | `variant="gradient" intensity="vivid"` + tone brand / warning / sky / neutral |
| Card `padding` none / sm / md / lg (default) / xl | `padding="none"` (new core) or `size`: sm to md, md to lg, lg to lg, xl to xl (name mode: same names) |
| Card `interactive`, `@click` | same (new core: pointer, hover lift, Enter key) |
| Card slots `header` / `footer` | same (new core slots) |
| Card `as` | unsupported |
| Modal `open` + `v-model:open`, `title`, slots `title` / `subtitle` / `default` / `footer` | same (`subtitle`, `title` slot are new core). New: `:open` + `@close` (there is no `update:open` event) |
| Modal `size` sm md lg xl 2xl 3xl 4xl 5xl | sm md lg xl xl; 3xl 4xl 5xl add `width` 768 / 896 / 1024 px (new core prop `width`) |
| Modal `closable`, `closeOnBackdrop`, `closeOnEsc` | same (new core props) |
| Modal events `close` and `update:open` | both emitted on close button, backdrop, Escape |
| ConfirmModal `open`, `title`, `message`, `confirmLabel`, `confirmVariant` danger / primary / glass, `loading`, events `confirm` / `cancel`, default slot | `ConfirmDialog` `open`, `title`, `description`, `confirmLabel`, `tone` danger / default, `loading`, `@confirm`, `@cancel`; the body slot is accepted (new core). Defaults from `common.*` keys |

### UiTooltip, UiDropdown, UiMenu, UiMenuItem, UiMenuSeparator

| old | compat result |
|---|---|
| Tooltip `text`, `placement`, `tone` ink/glass, `delay`, `disabled`, `anchorClass`, slot `content` | all supported by the compat tooltip (teleported to body, so `overflow:hidden` parents never clip it). The NEW `UiTooltip` is a CSS bubble (`placement` added, no rich content, no delay) |
| `<UiDropdown placement offset v-model:open>` + `#trigger="{ isOpen, toggle }"` + default slot with `<UiMenu>` | compat: trigger wrapper, body-teleported panel, flips and clamps to the viewport, outside click and Escape close. New: `<UiDropdown label icon :items="[{ label, value, icon, tone: 'danger', onClick, separator }]" @select>` |
| `UiMenu` `minWidth`, `autofocus`; `UiMenuItem` `tone` danger, `disabled`, `closeOnClick`, slots `icon-left` / `icon-right` / `shortcut`; `UiMenuSeparator` `label` | compat components (arrow keys, Home, End). `loading` on a menu item is ignored |

### UiTable to UiDataTable

| old | compat | new |
|---|---|---|
| `rows`, `columns` `{ key, label, accessor?, sortable?, align?, width? }`, `rowKey(row, i)` | same | `rows` need an `id` field (compat generates it from `rowKey` or the index); columns `{ key, label, sortable, num, align, width, render(value, row, h) }` |
| client-side sorting on click | yes (compat sorts) | controlled: handle `@sort(key, dir)` and pass `sortKey`/`sortDir` |
| slots `cell-<key>` `{ row, value, index }`, `header-<key>` `{ column }`, `empty` | same | `render` per column; `empty` slot (new core) or `empty` text |
| `loading` + `skeletonRows` | skeleton rows | not in the new component |
| `@row-click(row, index)` | same | `@rowClick(row, index)` (new core event) |
| `density` comfortable / compact | `size` md / sm | `size` |
| `variant` default / striped / bordered, `hoverable` | ignored | rows always hover |
| `width` Tailwind class (`w-32`, `w-[120px]`, `w-1/2`, `w-full`) | converted to CSS width | CSS width string |

### UiTabs family, UiPagination, UiBreadcrumbs, UiSegmentedControl, UiSubNav

| old | compat result | new |
|---|---|---|
| `UiTabs v-model variant` + `UiTabsList` + `UiTab value disabled` + `UiTabPanel value` | compound components kept (pill = kit pill tabs, underline = kit tabs) | `<UiTabs v-model :items="[{ value, label }]">` renders only the strip; show the panel yourself with `v-if` |
| `UiPagination current total siblings hideArrows`, `v-model:current` | `page`, `pages`, `siblings`, `hideArrows` (new core), event `update:current` | `:page="p" :pages="n" @change="p = $event"`; aria labels via `labels` (new core) |
| `UiBreadcrumbs items separator` chevron / slash / dot | same (`separator` is new core) | same |
| `UiSegmentedControl v-model options size block iconOnly ariaLabel` | `options` to `items`; Lucide icons to names; `block`, `iconOnly`, `ariaLabel`, per-item `disabled` / `icon` (new core) | `items` |
| `UiSubNav items { path, label, icon, badge } title titleIcon matchExact` | compat: route-aware (`$route`, `$router.push`) | new `UiSubNav` is value based: `:items="[{ value, label, icon, badge }]" :value @change` |

### UiSidebar, UiNavbar

| old | compat | new |
|---|---|---|
| `UiSidebar v-model:collapsed v-model:open defaultCollapsed storageKey`, slots `header` / `footer` with `{ collapsed }`, `UiSidebarSection label`, `UiSidebarItem icon label active badge href disabled` | same API on the kit's sidebar look, always dark like the old one (`--sidebar-bg` is honoured), mobile drawer below 1024 px, `widthExpanded` / `widthCollapsed` Tailwind classes ignored | `UiSideNav :brand :items="[{ group }, { value, label, icon, count }]" :value :collapsed @change @toggle` plus the `footer` slot, or `UiAppShell` |
| `UiNavbar variant size sticky`, slots `left` / `center` / `right` | same slots on `.zg-topnav` (variant ignored, sticky off by default like the old one) | `UiTopNav :brand :items :value @change` plus the `actions` slot |

### UiDatePicker, UiCalendar, UiDateTimePicker, UiFileUpload, UiStatsCard, UiCommandPalette, toasts

| old | compat result |
|---|---|
| DatePicker `modelValue` Date, `label`, `placeholder`, `hint`, `error`, `disabled`, `required`, `size`, `locale`, `weekStartsOn` | same; `locale` defaults to the host `$i18n.locale` |
| DatePicker `clearable` (old default true) | `clearable` (new core); compat default true |
| DatePicker `min`, `max`, `disabledDate` | same (new core props on Calendar and DatePicker) |
| DatePicker `range` + `DateRange { start, end }` model | compat range picker (new `RangeCalendar` in a popup); not in the new `DatePicker` |
| Calendar `range`, `initialMonth` | unsupported |
| DateTimePicker `modelValue` ISO string (UTC), `defaultTime`, `label`, `hint`, `error`, `disabled` | compat: date picker + text time field (`HH:MM`, auto colon), emits `update:modelValue` with an ISO string or `null` |
| FileUpload `modelValue` File[], `multiple`, `accept`, `maxSize`, `label`, `hint`, `error`, `@reject({ file, cause })`, slot `title` | compat keeps the file list (chips with remove) and the old `reject` shape; the new `FileUpload` is stateless and calls `onReject(file, reason)` |
| StatsCard `label value icon delta { value, trend, sublabel }` | `StatsCard` (`delta` string + `trend` up/down; `flat` renders as up). `variant="block"` renders `KpiTile` (brand, or inverse for `tone="ink"`; the icon is dropped) |
| CommandPalette + `useCommandPalette()` `register` `unregister` `clear` `open` `close` `toggle` | same API; ⌘/Ctrl+K handled by the compat component; `group`, `description` are folded into the search text (no group headings, no description line) |
| `useToast()` `push` `success` `info` `warning` `danger` `dismiss` `clear` + `<UiToastContainer position>` | same API and positions; `tone: "default"` renders as info |

## 7. Behaviour differences

Look and feel (by design of the new kit):

1. Inputs, buttons and selects are pills; surfaces are glass; the default font is Manrope (override `--zg-font`). Sizes follow the new scale, see section 6.
2. Primary buttons use `--zg-brand`; tartib's cobalt maps to the gold brand, qrbon's black primary needs `primary: "inverse"`.
3. Pill tabs are rectangular brand-filled tabs, not a black capsule. Active nav items are inverse (white on dark) pills.
4. Avatars default to the brand color; the 5 old tones map to brand, warning, sky, danger, neutral.

Mechanics:

5. Icons are strings loaded from a CDN, so an icon can appear a moment after first paint; self-host with `setIconBase` (section 2).
6. Vue "bare boolean" attributes (`<UiButton block loading>`) used to work only because the old components declared real props. The new adapter now turns `''` into `true` for every documented boolean prop, and kebab-case attributes (`icon-only`) are camelCased. `modelValue=""` and other text props are left alone.
7. `class`, `style`, `id`, `aria-*` and `data-*` now land on the root element of every new component (needed for `class="w-44"` and `class="!size-12"`). `id` on an input goes to the root `<label>`.
8. Popups: `Select`, `Combobox`, `DatePicker` lists are positioned `absolute` inside the component (the old kit used floating-ui). Inside a scrolling `Modal` body the list scrolls into view instead of floating above it. The compat `Dropdown` and `Tooltip` are teleported and never clipped; the new `Dropdown`/`Tooltip` are not.
9. `change` on every new component is emitted with the value; `@change` handlers that expected a DOM event break (none found in the two projects).
10. Emitted payloads: `DatePicker` and `Calendar` give a `Date`; `TimePicker` gives `HH:mm`.
11. The new `Modal` unmounts its content when closed (state inside is lost on close, same as the old `v-if`).
12. Built-in English strings (see section 5 for what the bridge translates). RTL works through `dir="rtl"`.
13. Dropdown/Menu: keyboard (arrows, Home, End, Escape) kept; no arrow/shift middleware, the panel is clamped to the viewport.
14. `UiAlert` `closable` shows the close button only because compat attaches `onClose` for you; with the new `Alert` no handler means no button.
15. Toasts have no enter/leave animation; the stack is rendered by compat (`UiToastContainer`), the new `UiToast` is a static card.

## 8. What to test

Compat smoke (render once, no console errors): the 29 kit demo pages in qrbon `src/pages/*Page.vue` (one per component) render through compat without console errors; keep them as a visual regression route while migrating.

Manual checklist (each item has a real counterpart in the two apps):

- [ ] Light and dark toggle, reload keeps the choice (`useTheme`, old key adopted once).
- [ ] App shell: sidebar rail, collapse persists (`storage-key`), mobile drawer (< 1024 px, scrim, close button), navbar dropdowns (language, user menu open above/below, close on outside click and Escape), ⌘K palette, toast stack and action buttons.
- [ ] Tables: sort, loading skeleton, empty slot, `cell-*` slots with `value`, row click, right-aligned numeric columns, width classes.
- [ ] Forms: Input with prefix slot and `v-model.number`, required asterisk, error and hint text, Select inside a Modal (opens and scrolls into view), Switch with hint, Textarea counter, DatePicker min/max/clear, DateTimePicker ISO value round trip across a timezone change.
- [ ] Modal sizes 3xl-5xl, `#subtitle`, Esc and backdrop close, `ConfirmModal` with `loading`.
- [ ] Buttons: `icon-only` square, `loading` hides icons, `type="submit"` inside a form, `class="w-full"`.
- [ ] Avatar status dots, rings, `!size-12` overrides.
- [ ] RTL (`dir="rtl"`) for a table page and the shell.
- [ ] Production build: `vite build` and look for `@import` order in the emitted CSS (fonts first, then the layered kit).

Automated: `node --test tests/unit/compat.test.mjs` in the kit repo covers the mapping tables (sizes, tones, variants, events, slots, i18n fallbacks) and renders the main compat components on the server.

## 9. Codemod checklist (phase 2)

Run on copies or in a clean working tree; each command is idempotent. All use perl (BSD and GNU).

1. Tags that are pure renames (props are mechanically the same after step 3):

```bash
find src -name '*.vue' -not -path 'src/components/ui/*' -print0 | xargs -0 perl -pi -e '
  s/<(\/?)UiInput(?=[\s>\/])/<$1UiTextField/g;
  s/<(\/?)UiConfirmModal(?=[\s>\/])/<$1UiConfirmDialog/g;
  s/<(\/?)UiKpiCard(?=[\s>\/])/<$1UiKpiTile/g;
  s/<(\/?)UiOtpInput(?=[\s>\/])/<$1UiCodeInput/g;'
```

Then import those names from `@ziyarago/ui/vue` (the resolver `ZiyaragoUiResolver` from `@ziyarago/ui/resolver` does it for auto-import; put it AFTER `ZiyaragoCompatResolver` and add `exclude` for the names you still take from compat).

2. Shift sizes to the new scale on components you moved off compat (static `size="..."` only; the pattern tolerates `=>` inside other attributes):

```bash
find src -name '*.vue' -not -path 'src/components/ui/*' -print0 | xargs -0 perl -0777 -pi -e '
  s{(<Ui(?:Button|TextField|Select|Combobox|DatePicker)\b(?:[^>]|=>)*?\ssize=")(xl|lg|md|sm)(")}{$1.{xl=>"xl",lg=>"xl",md=>"lg",sm=>"md"}->{$2}.$3}gse'
```

Tags without a `size` attribute used the old default (`lg`, 56 px) and now get `md` (40 px): list them and add `size="xl"` where the height matters:

```bash
grep -rnE '<Ui(Button|TextField|Select|Combobox)\b' src --include='*.vue' | grep -v 'size='   # single-line tags only
```

3. Props and events:

```bash
# ConfirmDialog: message -> description, confirm-variant -> tone
perl -0777 -pi -e 's{(<UiConfirmDialog\b[^>]*?)\smessage=}{$1 description=}g; s{(<UiConfirmDialog\b[^>]*?)\sconfirm-variant="danger"}{$1 tone="danger"}g; s{(<UiConfirmDialog\b[^>]*?)\sconfirm-variant="[a-z]+"}{$1}g' $(find src -name '*.vue')
# Pagination: current/total/v-model:current -> page/pages/@change
perl -pi -e 's/v-model:current="([^"]+)"/:page="$1" \@change="$1 = \$event"/; s/(<UiPagination\b[^>]*?)\s:total=/$1 :pages=/' $(find src -name '*.vue')
# Card padding -> size (xl stays xl, lg stays lg; none needs padding="none")
perl -pi -e 's/(<UiCard\b[^>]*?)\spadding="(sm|md|lg|xl)"/$1 size="$2"/' $(find src -name '*.vue')
# Modal: v-model:open -> :open + @close   (check each one: handlers that did more than close need a manual change)
perl -pi -e 's/(<UiModal\b[^>]*?)\sv-model:open="([^"]+)"/$1 :open="$2" \@close="$2 = false"/' $(find src -name '*.vue')
# Avatar: initials -> name is NOT a rename (initials is kept), tone cobalt|sunshine|petrol|pink|ink
perl -pi -e 's/(<UiAvatar\b[^>]*?)\stone="cobalt"/$1 tone="brand"/; s/(<UiAvatar\b[^>]*?)\stone="sunshine"/$1 tone="warning"/; s/(<UiAvatar\b[^>]*?)\stone="petrol"/$1 tone="sky"/; s/(<UiAvatar\b[^>]*?)\stone="pink"/$1 tone="danger"/; s/(<UiAvatar\b[^>]*?)\stone="ink"/$1 tone="neutral"/; s/(<UiAvatar\b[^>]*?)\sshape="squircle"/$1 shape="rounded"/' $(find src -name '*.vue')
# Badge tones
perl -pi -e 's/(<UiBadge\b[^>]*?)\stone="(sunshine|cobalt)"/$1 tone="brand"/; s/(<UiBadge\b[^>]*?)\stone="petrol"/$1 tone="info"/; s/(<UiBadge\b[^>]*?)\stone="ink"/$1 tone="inverse"/; s/(<UiBadge\b[^>]*?)\stone="(glass|neutral)"/$1/' $(find src -name '*.vue')
```

Single-line tags only; multi-line tags need `perl -0777` with `[^>]*?` (as in step 2). Review the diff: `[^>]` stops at the first `>` inside an attribute value.

4. Things that need a hand (grep lists):

```bash
grep -rnE '#icon-(left|right)' src --include='*.vue' | wc -l   # Button/Badge/MenuItem icon slots: keep through compat, or move to icon="trash-2" (string name)
grep -rnE '<UiTable\b|#cell-' src --include='*.vue' -l          # move to UiDataTable columns[].render
grep -rnE '<UiTabs\b|<UiTabsList\b|<UiTab\b' src --include='*.vue' -l
grep -rnE '<UiRadio(Group)?\b' src --include='*.vue' -l
grep -rnE '<UiDropdown\b|<UiMenu\b' src --include='*.vue' -l   # trigger slot -> items[] when the menu is simple
grep -rnE '<UiSidebar|<UiNavbar|<UiSubNav' src --include='*.vue' -l
grep -rn 'components/ui/' src --include='*.vue' --include='*.ts' | grep import   # imports the compat plugin rewrites
```

5. Cleanup: when `grep -rn "@ziyarago/ui/compat"` shows nothing, remove the resolver and the Vite plugin, `rm -r src/components/ui` (MultilangInput excepted), and the `@floating-ui/*`, `class-variance-authority` dependencies.

## Appendix A. Published kit components without a same-name component in the new kit

DashboardLayout (to `AppShell`), Form (to `FormField`, `LoginForm`, or a plain `<form>`; compat has `UiForm`), Input (to `TextField`), Navbar (to `TopNav`), Page (to `PageHeader`, `SplitLayout`), Radio (to `RadioGroup`), OtpInput (to `CodeInput`), Sidebar (to `SideNav`), KpiCard (to `KpiTile`), Table (to `DataTable`), RichTextEditor (to `RichEditor`), Kanban (to `PipelineBoard`, `KanbanColumn`), PillTab (to `PillTabs`), ActivityTimeline (to `Timeline`), Chart (to `MiniChart`, `ChartCard`), AuthPages (to `PageAuth`), CrmDashboard (to `PageCrm`), TourBiDashboard and AdminBiDashboard (to `PageDashboard`), Icons (to `Icon`), ChatBubble and ConversationList (to `ChatAi`).

No equivalent (not used by the two apps): ChunkCard, the AI group (ModelSelector, AiSettingsPanel, AiChatBox, PromptInput, StreamingMessage, RagSourcesList, AiFeedback, TokenCounter, AiCostBadge, AgentTaskCard, McpToolBadge), Restaurants (OrderCard, ServiceTimeline, TableMap, MenuCategoryGrid, KitchenDisplay, OrderStream), Logistics (ShipmentCard, DeliveryTimeline, RouteMap, VehicleStatus, WarehouseStock).

## Appendix B. What the compat package exports

Components: `UiAlert UiAvatar UiAvatarGroup UiBadge UiBanner UiBreadcrumbs UiButton UiCalendar UiCard UiCheckbox UiCombobox UiCommandPalette UiConfirmModal UiDatePicker UiDateTimePicker UiDivider UiDrawer UiDropdown UiEmptyState UiFileUpload UiForm UiFormField UiInput UiKpiCard UiMenu UiMenuItem UiMenuSeparator UiModal UiMultilangInput (also MultilangInput) UiNavbar UiOtpInput UiPagination UiProgress UiRadio UiRadioGroup UiSegmentedControl UiSelect UiSidebar UiSidebarItem UiSidebarSection UiSkeleton UiSpinner UiStatsCard UiSubNav UiSwitch UiTab UiTabPanel UiTable UiTabs UiTabsList UiTag UiTextarea UiToastContainer UiTooltip`.

Functions: `useToast`, `useCommandPalette`, `useTheme`, `configureCompat`, `iconName`, `install` (default export, `app.use(compat)` registers every component globally), plus `translate`, `SPECS`, `COMPAT_NAMES` for tooling. `@ziyarago/ui/compat/resolver` and `@ziyarago/ui/compat/vite` for the build.

## Appendix C. Known gaps and effort

| gap | now | effort to close in the kit |
|---|---|---|
| Built-in strings are English (Modal/Alert close, calendar arrows, Spinner, FileUpload) | compat bridge covers placeholders, empty texts, pagination and confirm labels | 0.5 to 1 day: a `labels` prop on about 12 components or a global `setLabels()` |
| Select, Combobox, DatePicker lists are not teleported (clipped by `overflow:hidden` ancestors) | list scrolls into view inside a Modal | about 1 day: render the list through the adapters' `portal` with fixed positioning, flip, tests |
| Table: no striped/bordered/hoverable, built-in sorting and loading | compat sorts and shows skeletons | 0.5 day for core `loading`, `striped`, optional client sort |
| Toast manager (stack, timers, actions) | compat `useToast` + container | 1 day for a core `Toaster` |
| Command palette groups and descriptions | folded into search text | 0.5 day |
| `AvatarGroup`, `DateTimePicker`, `MultilangInput`, compound Tabs/Radio/Dropdown | compat only | AvatarGroup 0.5 h, DateTimePicker 2 h, MultilangInput 2 h, compound APIs not planned |
| Icons by name from a CDN | `setIconBase` self-hosting | 1 to 2 days to bundle an SVG sprite |
| Calendar range / `initialMonth`, Progress indeterminate, Skeleton `lastLineWidth`, Alert `neutral` / `glass` | ignored or mapped to the nearest | 1 to 2 h each |
| React compat | none: the old kit was Vue-only | not needed |
