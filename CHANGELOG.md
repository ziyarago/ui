## [0.3.0](https://github.com/ziyarago/ui/compare/v0.2.0...v0.3.0) (2026-10-21)

### Features

* animated aurora background, kit-owned i18n core, glass-ui-kit compat layer, new landing ([f3882ca](https://github.com/ziyarago/ui/commit/f3882caa86a7bdddf4996c28140e0363d9af7e1b))

## [0.2.0](https://github.com/ziyarago/ui/compare/v0.1.1...v0.2.0) (2026-10-21)

### Features

* pricing page with early access list and MCP registry metadata ([b71cb10](https://github.com/ziyarago/ui/commit/b71cb100ff903574bafddc70bebf1b0193256b2e))

## [0.1.1](https://github.com/ziyarago/ui/compare/v0.1.0...v0.1.1) (2026-10-21)

### Bug Fixes

* **mcp:** add repository metadata required for npm provenance ([392da6d](https://github.com/ziyarago/ui/commit/392da6d2c33aa13943290854ca0b6845e21f0057))

## [0.1.0](https://github.com/ziyarago/ui/compare/v0.0.0...v0.1.0) (2026-10-21)

### Features

* publish @ziyarago/ui and @ziyarago/ui-mcp to npm ([bc42145](https://github.com/ziyarago/ui/commit/bc42145f7750fdd8071a29bc088b8366a1adb391))

# Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com) and [SemVer](https://semver.org). Pre-1.0: minor versions may break.

## 0.1.0 — first release

### Added
- Docs site SEO: canonical, Open Graph, Twitter and JSON-LD tags per page, generated `sitemap.xml` and `robots.txt`, 404 page with noindex, og.png, favicon; Google Analytics 4 and Yandex Metrika loaded from build variables.
- Deployment of the docs to your own server over SSH (releases directory, atomic switch, rollback): `deploy/`, `.github/workflows/deploy-docs.yml`, `docs/DEPLOYMENT.md`.
- Display settings: `useUiTheme()` gains `setMotion('auto|on|off')`, `setEffects('auto|full|lite')` and `setBackground(name)`; attributes `data-motion`, `data-fx`, `data-bg`; no-flash init script in the Nuxt module.
- Page backgrounds (`aurora`, `sunset`, `ocean`, `emerald`, `rose`, `mesh`) and gradient cards (`<UiCard variant="gradient" tone intensity>`; 8 tones, soft and vivid, dark and light).
- API metadata for all 182 components in `src/meta/` (props with every value, defaults, slots, events), validated against the render code by `npm run check`; shown as API reference tables in the docs.
- AI tooling: `dist/manifest.json`, `llms.txt`, `llms-full.txt` and the `@ziyarago/ui-mcp` package (MCP server + `init` for AGENTS.md, Claude skill, Cursor rule).
- Automated releases: GitHub Actions + semantic-release (version from commit messages), npm publish with provenance and docs deploy to ziyara.vip. See CONTRIBUTING.md.
- Page templates gallery in the docs site (`/docs/templates`): 17 live templates in the app shell with top or side menu, slot highlighting and an inspector (accepted components, props, example) for 89 page slots and 5 shell slots.
- `size` prop (`xs | sm | md | lg | xl`, default `md`) on controls and density-bearing components (about 120). Adapters set `data-size` on the root; `md` keeps the previous look. Scale tokens `--zg-sz-*` live in `tokens.css`, per-group overrides in `src/styles/sizes/`.
- Popup surfaces (`--zg-pop`), stacking tokens (`--zg-z-bar`, `--zg-z-pop`, `--zg-z-modal`) and entrance motion for selects, calendars, menus, hover cards, modals and drawers.
- Docs pages for Fonts and Colors (families, tokens, weight mapping, swatches in both themes and both palettes).
- Documentation site in `site/` (Nuxt): landing, getting started, theming, 182 component pages with live previews and Vue/React code.
- gluestack parity, 16 components: Heading, Text, Box, Center, HStack, VStack, Grid, Link, Pressable, Icon, Portal, LiquidGlass, BottomSheet, Actionsheet, ImageViewer, ChatAi.
- Nuxt module `@ziyarago/ui/nuxt` (auto-registered components, CSS, theme attributes, SSR).
- Framework-neutral core with Vue 3 (`@ziyarago/ui/vue`) and React 18+ (`@ziyarago/ui/react`) adapters.
- 160+ components in 12 groups: actions, forms, surfaces, data, navigation, layout, CRM, hotels, tours and 360°, prayer and Ramadan.
- 16 page templates with named slots (`PageDashboard`, `PageCrm`, `PageBookings`, `PageCatalog`, `PageDetail`, `PageSettings`, `PageUserList`, `PageProfile`, `PageForm`, `PageOrder`, `PageAccount`, `PagePricing`, `PageFaq`, `PagePatterns`, `PageAuth`, `PageStatus`).
- Two menus in one shell: top and side, with a collapsible sidebar.
- OKLCH tokens, palettes `gold` and `tamam`, dark and light themes, RTL, Thmanyah and Manrope.
- Validation rules (`rules`) and `ValidatedField`.
- `UiMap`, `UiTour` with spotlight, `UiSortable`, `UiTreeSelect`, `UiRichEditor`.
- `tokens/tokens.json` for Flutter and native clients; `dist/style.css` single-file stylesheet.

### Known gaps
- Props are typed for 9 core components; the rest accept `Record<string, any>`.
- Installed from the packed tarball into clean Vite+Vue, Vite+React and Nuxt 3 apps: all build, Nuxt SSR renders. No automated tests yet.
- Light theme and RTL are covered by tokens but not yet screenshot-tested for every component.

### Fixed before release
- Arabic looked bold: Thmanyah has no 600 face and is heavier than Manrope. `fonts.css` now maps weights with ranges (200-300 Light, 400-600 Regular, 700 Medium, 800 Bold, 900 Black).
- Light theme: stronger card separation (`--zg-s1/s2/s3`, `--zg-stroke`, `--zg-rim`, `--zg-shadow-1`); `UiCard variant="inverse"` re-scopes tokens to dark so content inside stays readable; bell counter and incoming-call button text contrast.
- `Page*` templates with `title` crashed in Vue/React (`C.PageHeader` was called as a function).
- `useUiTheme()` and `UiMap` touched `document` during SSR.
