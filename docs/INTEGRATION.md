# Integration guide

Recipes verified against packed tarballs (`npm pack`) in clean projects: Vite 8 + Vue 3.5 + Tailwind 4 + unplugin-vue-components + vue-i18n + pinia + vue-router + vue-tsc 3, Nuxt 3, Next 15 (App Router), React 19.

## 1. Vue 3 + Vite + unplugin-vue-components

```bash
npm i @ziyarago/ui
```

`vite.config.ts`

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import Components from 'unplugin-vue-components/vite';
import { ZiyaragoUiResolver } from '@ziyarago/ui/resolver';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      dirs: ['src/components'],
      dts: 'src/components.d.ts',           // typed <UiButton> etc. in templates (vue-tsc reads it)
      resolvers: [ZiyaragoUiResolver()],
    }),
  ],
});
```

Templates then use `<UiButton>`, `<UiCard>`, `<UiDataTable>` ... with no imports. Resolver options: `css: true` (also import the stylesheet), `exclude: ['Button']` (names you do not want auto-imported), `prefix`, `from`. A component of your own in `src/components/UiButton.vue` wins over the library one (verified), so same-named local files keep working.

CSS: load it once, in your Tailwind entry (see section 3) or `main.ts`:

```ts
import '@ziyarago/ui/style.css';
```

`components.d.ts` is written by the plugin when Vite starts or builds. Run `vite build` (or `vite`) once before `vue-tsc` on a fresh checkout, or commit the file. Your `build` script `vue-tsc --noEmit && vite build` is fine once the file exists.

Without unplugin (manual registration): `import ui from '@ziyarago/ui/vue'; app.use(ui)`, and for template typing add once, e.g. in `env.d.ts`:

```ts
import '@ziyarago/ui/vue/global';   // GlobalComponents for every Ui* tag
```

Plain imports also work: `import { UiButton, type UiButtonProps } from '@ziyarago/ui/vue'`.

### What vue-tsc checks

Every component has `Ui<Name>Props` (JSDoc from the API metadata, so IDE hover shows docs and `@default`), `Ui<Name>Slots`, event payloads (`@change`, `@sort`, `@select` ...) and `v-model` types. Verified failures: `size="huge"` (not assignable to `Size`), missing required prop (`options` on `UiSelect`), wrong event payload (`(p: string) => ...` on `@change` that sends a number), wrong `v-model` type, unknown slot name. `strictTemplates` is supported. Native listeners and arbitrary attributes other than `class`, `style`, `id`, `aria-*`, `data-*` are not part of the component API (the root element receives class, style, id, aria-* and data-*).

Types of shared pieces: `Size` (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`), `Tone`, `Rule`, `Column`, `NavItem`.

## 2. Nuxt 3 / 4

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@ziyarago/ui/nuxt'],
  ziyarago: { theme: { theme: 'dark', palette: 'gold', dir: 'ltr' } },   // theme: false to disable
});
```

The module registers all `Ui*` components (auto-import, typed through the generated `.nuxt/components.d.ts`), pushes `@ziyarago/ui/style.css`, adds `data-theme`, `data-palette`, `dir` to `<html>` during SSR and the no-flash init script in `<head>`. Do not add the unplugin resolver in Nuxt. Verified: `nuxt build` from a tarball, SSR output contains the components, `<html data-theme="dark" data-palette="gold" dir="ltr">`.

With Tailwind in Nuxt, use the layered import from section 3: set `css: false` in `ziyarago` and import the stylesheet from your Tailwind CSS file:

```css
@import "tailwindcss";
@import "@ziyarago/ui/style.css" layer(components);
```

## 3. Tailwind 4 coexistence

Tailwind 4 puts preflight in `@layer base` and utilities in `@layer utilities`. CSS outside any layer beats every layer, regardless of specificity. So an unlayered `@ziyarago/ui/style.css` next to Tailwind has two problems (both reproduced):

1. Utilities on our components lose: `<UiButton class="px-10 rounded-none bg-red-500">` keeps the padding, radius and background of `.zg-btn`.
2. Order matters: `@import "tailwindcss"; @import "@ziyarago/ui/style.css";` silently dropped the old Google Fonts `@import url(...)`. Since 0.7 the fonts are bundled (`@font-face` with local files), so there is no `@import` to lose.

Recipe (single CSS entry, Vite or Nuxt):

```css
@import "tailwindcss";
@import "@ziyarago/ui/style.css" layer(components);
```

Result: preflight < our styles < utilities. `class="w-48"`, `px-10`, `rounded-none`, `bg-red-500` on `UiButton`/`UiCard` all apply; the fonts load from your own origin. Do not also import the stylesheet from `main.ts`.

Put `class="zg-root"` on your app root (`<div id="app" class="zg-root">` or body). It sets font, text color, background and the reduced-motion rule.

### Conflicts found and fixed on our side

Compared computed styles of every element of every documented example (182 components, 1061 examples) with and without Tailwind 4 preflight. Before the fix about 10 500 elements differed; the causes and fixes (all in `src/styles/components.css`, zero specificity via `:where`, so any class, utility or app rule overrides them):

- `line-height`: preflight sets 1.5 on `html`; components were designed with `normal`. Now `normal` on `.zg-root` and `zg-*` elements. Without this heights drifted 2-13 px (tables, cards, boards).
- Form controls: without preflight the browser defaults leaked (inputs black text and white background on the dark theme, Arial font, 13px, UA padding). Now `font`, `color`, `letter-spacing`, `margin`, `padding` are inherited/reset and the background is transparent inside `zg-*` components. This also fixes the same bugs for apps without Tailwind.
- `box-sizing: border-box` for zg elements even outside `.zg-root` (preflight did it globally, a plain app did not).
- `svg { vertical-align }` baseline gap and classless links (`LoginForm` forgot link lost its underline under preflight) normalized.
- Rich text editor content: preflight removes `p` margins, list bullets and heading sizes; defaults restored in `.zg-rte__c`.
- `all: unset` rules (accordion headers, menu items, tree nodes, ...) are fine: they live in the same layer as the rest of our CSS, so they still win over preflight and still lose to utilities.
- `--zg-*` custom properties do not collide with Tailwind's `--color-*`, `--spacing`, `--font-*`.

After the fix the remaining differences between the two setups are `appearance: button`, `img { max-width: 100% }`, `svg { display: block }` and running animation frames; none is visible.

Fonts: Manrope and JetBrains Mono (SIL OFL, latin and cyrillic) ship inside the package (`assets/fonts`) and `style.css` loads them from there. No request goes to Google, so a strict CSP (`style-src 'self'`, `font-src 'self'`) works. Your bundler must resolve the `url(../assets/fonts/...)` references; Vite and Nuxt do it by default.

Thmanyah (Arabic) is NOT shipped: its licence (https://font.thmanyah.com/licenses) forbids redistributing or hosting the files. `--zg-font-ar` names `'Thmanyah Sans'` first, then `'Segoe UI', Tahoma, 'Noto Sans Arabic', system-ui`, so Arabic renders with a system font until you add the font. To use Thmanyah: download the files from https://font.thmanyah.com, put them in your public folder at `/fonts/thmanyah/` and add `import '@ziyarago/ui/thmanyah.css'` (it contains only `@font-face` rules, no font data). For another path copy that file and edit the URLs, or declare your own `@font-face` for `'Thmanyah Sans'`.

## 4. vue-i18n, pinia, vue-router

- vue-i18n: components do not read any i18n instance. Built-in strings are English for now ("Copy", "Sign in", "Mark all read" ...). Every text has an override prop, usually `labels` or a `*Label` prop (see the API tables), so wire them yourself: `<UiLoginForm :labels="{ email: t('auth.email'), ... }" />`. `useUiTheme().setLocale('ar')` only flips `dir` (rtl for `ar`).
- pinia, vue-router: no interaction. State is held in your store; components are controlled via props and `v-model`.

## 5. SSR

- Components render on the server (verified with Nuxt and Next). Overlays use a portal and render nothing on the server.
- Popups (Select, Combobox, MultiSelect, DatePicker, Dropdown, Menu, ContextMenu, Popover, Popconfirm and the Pro GroupedSelect, TreeSelect, NotificationBell) are rendered in `document.body` with `position: fixed` from the trigger rect (class `zg-float`, `data-zg-for` = anchor id, trigger gets `aria-controls`), so `overflow: hidden`, transforms and scrolling modal bodies never clip them. They flip above when there is no room, follow the trigger on scroll or resize, and sit above modals (`--zg-z-float`). In tests query the list by `[role=listbox]` / `aria-controls`, not inside the component root.
- Theme: the init script applies the saved theme before first paint. Nuxt does it for you. For any other SSR setup, inline `themeInitScript` (exported from `@ziyarago/ui/theme`) in `<head>`.
- `useUiTheme()` reads `localStorage` on the client. Do not render its values into markup during the first render (hydration mismatch); read them in `onMounted` / `useEffect` or in event handlers.

## 6. React / Next.js (App Router)

```bash
npm i @ziyarago/ui react react-dom
```

`src/react/index.js` starts with `'use client'`, so the components can be imported from server components and client components alike (verified with `next build` of Next 15.x, SSR HTML contains the markup). The adapter uses explicit named exports (`export const UiButton = ...`) because Next reads the export names of a client module statically; a destructured export list is reported as "not exported".

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';
import '@ziyarago/ui/style.css';
import { themeInitScript } from '@ziyarago/ui/theme';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-palette="gold" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
      <body className="zg-root">{children}</body>
    </html>
  );
}
```

`suppressHydrationWarning` is needed because the script changes `data-theme`, `dir` and friends before React hydrates. Toggle the theme from a client component: `'use client'; import { useUiTheme } from '@ziyarago/ui/theme'; ... useUiTheme().toggleTheme()`.

With Tailwind 4 in Next, use the same layered import as in section 3 in `globals.css`.

React types: `Ui<Name>Props` (props, callbacks, named slots as `ReactNode` props, `children`), components are `ComponentType<Ui<Name>Props>`. Event props are `onChange`, `onClick` (`React.MouseEvent<HTMLElement>`), `onSort` ...

## 7. Checking the types yourself

`npm run test:types` in this repository runs vue-tsc and tsc over `tests/types/*`: valid usage must compile, invalid enum / missing required prop / wrong event payload / wrong model type / unknown slot / wrong slot type must fail with the expected message.

## 8. Add-on packages (plugins)

An add-on package (for example `@ziyarago/ui-pro`) plugs components into the same registry through `registerComponents` / `defineUiComponents`, so its definitions can use `C.Button` and the core components can reference them. A plugin ships its own stylesheet: import it after the core one.

```ts
import '@ziyarago/ui/style.css'
import '@ziyarago/ui-pro/style.css'   // plugin css, always after style.css
```

Plugin CSS must only use the public design tokens (`--zg-*`, see `@ziyarago/ui/tokens.css`) and its own prefixed classes. Auto-import: pass `plugins: ['@ziyarago/ui-pro']` to the Nuxt module options (`ziyarago: { plugins: [...] }`) or to `ZiyaragoUiResolver({ plugins: [...] })`.

## Migrating from local copies of glass-ui-kit
The migration tooling (compat layer with the old component names, resolver and Vite plugin, step by step guide) is part of `@ziyarago/ui-pro`.

## 9. Icons and CSP
The icons the components use themselves (about 100: chevrons, close, search, eye, calendar ...) are built into the package and load without a network request, so they work under `connect-src 'self'`. Icons you pass by name that are not in that set (`<UiButton icon="rocket">`) are fetched once from `https://unpkg.com/lucide-static@0.460.0/icons/`. Under a strict CSP either self-host them or register them:

```js
import { setIconBase, registerIcons } from '@ziyarago/ui/vue';
setIconBase('/icons/');                       // copy node_modules/lucide-static/icons to public/icons
registerIcons({ 'my-logo': '<svg viewBox="0 0 24 24" ...>...</svg>' });   // or inline SVG strings, no request at all
```

## 10. Strict CSP checklist
Verified in CI (`tests/bundle`, workflow `Audit bundle`): packed tarballs installed into Vue + Vite 8, React 19 + Vite 8 and Nuxt 3/4 apps, every example mounted in the production build behind `default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; connect-src 'self'; img-src 'self' data:` with no violation and no request to another origin.

- Fonts: the small subsets (`*-cyrillic-ext.woff2`, below Vite's 4 KB `assetsInlineLimit`) are referenced with `?no-inline`, so Vite keeps them as files instead of `data:` URIs that `font-src 'self'` blocks.
- Icons: names outside the built-in set are fetched from unpkg, see section 9 (`registerIcons`, `setIconBase`). The built-in set covers the icons used by the components and by the docs examples.
- Client rendering (Vite, plain Vue or React) sets styles through the DOM, which `style-src 'self'` allows.
- SSR (Nuxt, Next) and style attributes: the components emit sizes, gaps, columns, alignments, tones, percentages and the like as classes and `data-zg-p` attributes (rules in `src/styles/csp.css`), not as `style="..."`, so server HTML is styled under `style-src 'self'` without `style-src-attr`. The rule the components follow: (a) static values are CSS classes; (b) values from a finite set (sizes xs..xl and the usual pixel sizes, gap 0..48, columns 1..12, aspect ratios, radii, `align`/`justify`) are classes, and a value outside the set falls back to an inline style; (c) a percentage (Progress, Slider, MiniChart) is rounded to an integer in `data-zg-p` for the server HTML and set exactly through the CSSOM after mount; image URLs (`LazyImage`, `EmptyState` image) are set through the CSSOM after mount, so the image appears at hydration, not in the server HTML. The CSSOM is not governed by `style-src-attr`. What still ends up in a `style` attribute of server HTML: a `style` prop you pass yourself, a size, gap, padding, width or max-height outside the sets above (e.g. `<UiStack gap="1.5rem">`, `<UiSkeleton width="120px">`), a custom `columns` of `SplitLayout`, a custom Ring color, and the icon mask `--zg-icon` (not in server HTML: icons are masks that load after mount). Those are ignored without `style-src-attr 'unsafe-inline'` until the component renders on the client.
- Pro components follow the same rules (`src/core/csp.pro.js` in `@ziyarago/ui-pro`, rules in `src/styles/csp-pro.css`): static values and finite sets (icon and tile sizes, font sizes, gaps, chart plot heights and donut diameters, chart series colours `zg-cc-*`, indents, ratios) are classes; bar and funnel widths are `data-zg-p` set precisely after mount; chart geometry stays in SVG attributes (the donut total uses `font-size`); background images, Map tile and marker positions are set through the CSSOM after mount. Still inline in server HTML: values outside the sets, custom colours, and tooltips/overlays that render only on the client. `tests/bundle/baseline.json` keeps a separate `ssr-style-attrs` budget for the `+pro` scenarios.
- The exact policy for a strict SSR site:

```
default-src 'self'; script-src 'self' 'sha256-<hash of themeInitScript()>' 'sha256-<hash of the framework payload script>'; style-src 'self'; font-src 'self'; connect-src 'self'; img-src 'self' data:
```

  Add `style-src-attr 'unsafe-inline'` only if your own pages or the cases above put `style="..."` into server HTML. `style-src-elem` is not needed with `inlineStyles: false` (Nuxt) because no `<style>` block is emitted. The audit (`tests/bundle`) keeps a budget of kit-emitted inline style attributes in the Nuxt server HTML (`ssr-style-attrs` in `baseline.json`) and fails when it grows.
- SSR inline scripts need a hash or nonce: the no-flash theme script (`themeInitScript` from `@ziyarago/ui/theme`, sha256 of the string) and the framework's own payload script.
- Pro `Map` loads CARTO tiles by default (`img-src https://*.basemaps.cartocdn.com`). Pass `tiles="/tiles/{style}/{z}/{x}/{y}.png"` to serve them from your origin.
