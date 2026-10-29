# Tests

`npm test` runs everything (about 20 s locally). Not published: `files` in `package.json` does not include `tests/`.

| Script | What it proves |
| --- | --- |
| `npm run test:unit` | `fmt`, `rules`, date parsing (`pd`), the theme controller (stubbed `document`/`localStorage`), size helpers, registry shape. `node:test`, no mocks of the code under test. |
| `npm run test:ssr` | Every component and every docs variant renders with Vue `renderToString` and React `renderToString`: no throw, no framework warning, no `undefined` / `[object Object]` / `NaN` / `null` text, non-empty output. Overlays are rendered closed and open. |
| `npm run test:browser` | `run.mjs` then `interactions.mjs`, in headless Chrome, against a Vue app and a React app. |

## How it works

- **One data source.** `tests/lib/examples.mjs` strips the types from `site/docs-data/examples/*.ts` with esbuild and imports them. Nothing is duplicated: add or edit an example in the docs and the tests pick it up.
- **Variant to render.** `tests/lib/preview-vue.js` and `preview-react.js` are ports of `site/components/DocPreview.ts` (props, items, text, slots, children trees, `modelValue` / `value` / `index` / `page` state). Both import the library from `src/` directly. Pro names in an example tree (free page templates show Pro blocks) render as a stub there; `loadExamples()` returns the free examples only.
- **Apps.** `tests/apps/vue` and `tests/apps/react` are small Vite apps (dependencies come from the repo root). Each variant is mounted in its own root, so one failure cannot hide another; errors are recorded per component. `run.mjs` starts them through the Vite JS API on free ports.
- **`run.mjs` scenarios** (each renders all 102 free components / 285 variants, for Vue and React; Pro components are tested in @ziyarago/ui-pro): dark, light, `dir=rtl`, all overlays open, SSR HTML from Node then hydration in the browser, production build via `vite build` + `preview`. It fails on any `console.error`/`warn` (Vue warn, React warn, hydration), uncaught exception, empty component, local 404 or failed request. Console problems are tagged with `<Component#variant>`.
- **`interactions.mjs`** drives real mouse and keyboard events and asserts DOM and model state in both adapters: Select, MultiSelect, Combobox, DatePicker, Tabs, SegmentedControl, Switch, Checkbox, Modal and Drawer (open, focus trap, Escape, focus restore, backdrop), Pagination, Accordion, Dropdown, TextField, CommandPalette, ContextMenu. Fixtures are in `interaction-cases.mjs`; callbacks written as `"$spy:label"` are recorded on `window.__zgSpy` (`tests/lib/spy.js`).
- Chrome is not downloaded. It is found via `CHROME_PATH`, then the usual macOS/Linux locations. External requests (icons, fonts, remote images) are stubbed, so runs are offline-safe.

## Consumer type check (CI job `consumer-types`)

`scripts/consumer-types.mjs generate` writes a temporary project the way a product team sets one up (Vue 3.5 + vue-tsc with `strictTemplates`, React + tsc strict, the packed `@ziyarago/ui` tarball installed from `npm pack`): one Vue SFC and one TSX file per component, generated from `src/meta` by `scripts/consumer-gen.mjs`. It exercises required props only, every optional prop as `null` and as `undefined`, boolean shorthand, kebab-case props, `id`/`class`/`style`/`aria-*`/`data-*`, every event as `@event`, `@kebab-event` and `:on-event` (zero args, rest args, native DOM events), every slot, `v-model` with `ref<T>`, `ref<T | null>`, `ref<T | undefined>`, `v-model.trim/.number/.lazy`, template refs, and for React a controlled value with `useState<T | null>`. `check` classifies the compiler output: anything not listed in `tests/consumer/allow.txt` (with a reason) fails the job. The Pro repo runs the same generator against the packed Core + Pro packages. Unit tests of the generator: `tests/unit/consumer-gen.test.mjs`; runtime counterpart of the null rule: `tests/ssr/null-props.test.mjs`.

Run it: the job runs on every push and pull request. Locally (needs network and a few minutes): `npm run build && npm pack --ignore-scripts --pack-destination /tmp/pk && node scripts/consumer-types.mjs generate --out /tmp/consumer --dep @ziyarago/ui=/tmp/pk/ziyarago-ui-<version>.tgz && cd /tmp/consumer && npm i && npx vue-tsc --noEmit -p tsconfig.vue.json && npx tsc -p tsconfig.react.json`.

## Adding a component


1. Add its example to `site/docs-data/examples/*.ts` (the docs need it anyway). `test:ssr` and `run.mjs` cover it automatically.
2. If it legitimately renders nothing on the server, or contains text that looks like a leak, add a documented entry to `tests/ssr/allowlist.mjs`.
3. If it has behaviour worth asserting (open/close, keyboard, model), add a fixture to `tests/browser/interaction-cases.mjs` and a check to `tests/browser/interactions.mjs`.

Useful flags: `node tests/browser/run.mjs --only=Select,Combobox --fw=react`, `node tests/browser/interactions.mjs --case=Modal --fw=vue`, `BROWSER_CONCURRENCY=2` on small machines.

## Known limits

React is tested on the version installed in the repo (19.x); the adapter targets `>=18`. Vue and React dev builds are used for the warning scenarios; the production scenario only checks for errors and rendering.
