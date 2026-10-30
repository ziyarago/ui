# Production bundle audit

Emulates a customer: the PACKED tarballs (`npm pack`, the Pro `pack:release` output) are installed into fresh consumer apps, built for
production and every docs example is mounted in headless Chrome served with a strict CSP
(`default-src 'self'; style-src 'self'; font-src 'self'; connect-src 'self'; img-src 'self' data:`, scripts by hash only).
Nothing runs on a developer machine: use the `Audit bundle` workflow (public repo, free package) and the `Audit bundle` workflow of
`ziyarago/ui-pro` (free + Pro).

| Piece | What it does |
| --- | --- |
| `check-tarball.mjs` | files in the tarball, every `exports` target, `typesVersions`, `sideEffects`, no Pro code or 3D assets, peer ranges |
| `run-app.mjs <vue\|react\|nuxt>` | install from tarballs, Node import of every entry, `tsc` against the types, production build, sizes, browser scenarios |
| `lib/analyze.mjs` | what counts as a defect (CSP violation, request outside the origin, console error, missing icon or string, backdrop-filter dropped, overflow, kebab-case props) |
| `allow.json` | reviewed exceptions, each with a reason |
| `baseline.json` | gzip sizes per app (growth above 10% fails) and `ssr-style-attrs`: budget of kit-emitted `style=""` attributes in the Nuxt server HTML (harness wrappers and empty attributes are not counted) |

Apps: Vue 3.5 + Vite 8 + Tailwind 4 (layered import) + vue-i18n 10 + unplugin-vue-components with the kit resolver; React 19 + Vite 8;
Nuxt 3 and 4 with `@ziyarago/ui/nuxt` (SSR + hydration, production hydration mismatch details on). Each full page mounts all
examples; `minimal.html` is a tree-shaken consumer entry.

Tree shaking is measured in isolation (Vue and React apps; the Pro run adds `pro-one` = UiLineChart only, `pro-minimal` = 8 Pro components and `pro-all` = `import * as PRO`, with the same kind of budgets: 8 components below 55% and one below 40% of all Pro, no strings or modules of components they do not use): `base.html` (the app without the kit), `button.html` (only `UiButton`), `minimal.html`
(a handful of components) and `all.html` (`import * as UI`) are each built alone (`ZG_ONLY=<page>.html vite build`), because the multi-page build shares chunks between
entries and would hand every page the union of what all of them use. Kit bytes = gzip JS of the page minus `base`. Failures: the minimal entry above 45% of all, `UiButton`
above 15% of all, or strings of unrelated components (`zg-cal__d`, `Previous month`, `RichEditor`, ...) in the `UiButton` bundle. `baseline.json` keeps the `iso:*` figures.

Reports (`report-*.json`) are uploaded as workflow artifacts.
