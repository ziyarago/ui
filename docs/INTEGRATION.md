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

Fonts: Manrope, JetBrains Mono (latin and cyrillic) and Thmanyah (Arabic) ship inside the package (`assets/fonts`) and `style.css` loads them from there. No request goes to Google, so a strict CSP (`style-src 'self'`, `font-src 'self'`) works. Your bundler must resolve the `url(../assets/fonts/...)` references; Vite and Nuxt do it by default.

## 4. vue-i18n, pinia, vue-router

- vue-i18n: components do not read any i18n instance. Built-in strings are English for now ("Copy", "Sign in", "Mark all read" ...). Every text has an override prop, usually `labels` or a `*Label` prop (see the API tables), so wire them yourself: `<UiLoginForm :labels="{ email: t('auth.email'), ... }" />`. `useUiTheme().setLocale('ar')` only flips `dir` (rtl for `ar`).
- pinia, vue-router: no interaction. State is held in your store; components are controlled via props and `v-model`.

## 5. SSR

- Components render on the server (verified with Nuxt and Next). Overlays use a portal and render nothing on the server.
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
