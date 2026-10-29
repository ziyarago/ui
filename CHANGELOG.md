## [0.20.9](https://github.com/ziyarago/ui/compare/v0.20.8...v0.20.9) (2026-10-29)

### Bug Fixes

* server HTML carries classes instead of inline style attributes (strict CSP); SSR style attribute budget in the bundle audit ([04ee9ab](https://github.com/ziyarago/ui/commit/04ee9ab5a0c6a1f0e25860cbb0e14cc7345e508c))

## [0.20.8](https://github.com/ziyarago/ui/compare/v0.20.7...v0.20.8) (2026-10-29)

### Bug Fixes

* stop shipping the Thmanyah font files (licence); optional thmanyah.css for self-hosting; Arabic fallback stack ([d84ec99](https://github.com/ziyarago/ui/commit/d84ec99a408d1f1403b9493c63d4fccf7a977c98))

## [0.20.7](https://github.com/ziyarago/ui/compare/v0.20.6...v0.20.7) (2026-10-29)

### Bug Fixes

* documented no-argument callbacks are called without the DOM event (Modal, Drawer, Alert, Snackbar, Chip, Tag, ConfirmDialog and more); handler contract tests ([504c5b2](https://github.com/ziyarago/ui/commit/504c5b271a3271a0a875751e7674a38a936bb3c6))

## [0.20.6](https://github.com/ziyarago/ui/compare/v0.20.5...v0.20.6) (2026-10-29)

### Bug Fixes

* Avatar tolerates a non-string name, contrast of Tour, ImageViewer counter and Actionsheet danger item ([76c93ae](https://github.com/ziyarago/ui/commit/76c93ae3aa54717183e521a47f44b0d84f663478))

## [0.20.5](https://github.com/ziyarago/ui/compare/v0.20.4...v0.20.5) (2026-10-29)

### Bug Fixes

* Combobox, Footer, Tooltip, TopNav, calendar RTL chevrons and contrast defects found by the behaviour audit; stress harness in CI ([32b3eaa](https://github.com/ziyarago/ui/commit/32b3eaa00e0c611b24c44960a678cf45a8ecb61a))

## [0.20.4](https://github.com/ziyarago/ui/compare/v0.20.3...v0.20.4) (2026-10-29)

### Bug Fixes

* strict-CSP friendly fonts and built-in icons, 360px layout fixes, typesVersions for i18n, tarball and production bundle audit in CI ([f3b5133](https://github.com/ziyarago/ui/commit/f3b513309fdceafaa5cd04c579c542310706e658))

## [0.20.3](https://github.com/ziyarago/ui/compare/v0.20.2...v0.20.3) (2026-10-29)

### Bug Fixes

* types accept null, undefined and numbers wherever the runtime does; runtime tolerance for odd values; consumer-types CI job ([e1d5411](https://github.com/ziyarago/ui/commit/e1d5411d9887a5c5121f884363562d63b605833c))

## [0.20.2](https://github.com/ziyarago/ui/compare/v0.20.1...v0.20.2) (2026-10-29)

### Bug Fixes

* React types import FocusEvent and friends, .d.ts relative imports carry .js extensions ([d0d96e4](https://github.com/ziyarago/ui/commit/d0d96e45659765d8375680e2095893ba87482bdb))

## [0.20.1](https://github.com/ziyarago/ui/compare/v0.20.0...v0.20.1) (2026-10-29)

### Bug Fixes

* types accept null and numbers in v-model values, native input events typed as DOM events, v-model modifiers ([55c4794](https://github.com/ziyarago/ui/commit/55c479449fc07a1e2f50d6677f45530590071d6f))

## [0.20.0](https://github.com/ziyarago/ui/compare/v0.19.4...v0.20.0) (2026-10-29)

### Features

* popups render in body with fixed positioning (flip, clamp, scroll tracking), Dropdown iconOnly and trigger slot ([becef8d](https://github.com/ziyarago/ui/commit/becef8deb689161086b5b65204f76e7f9ca6b5ff))

## [0.19.4](https://github.com/ziyarago/ui/compare/v0.19.3...v0.19.4) (2026-10-29)

### Bug Fixes

* keep built-in component strings in production bundles (sideEffects), DataTable onRowClick type, neutral Badge tone, tab counts, Modal sizes up to 5xl ([25ec195](https://github.com/ziyarago/ui/commit/25ec1953e6d5370d55a7c2ce68d3c20fdc1327b2))

## [0.19.3](https://github.com/ziyarago/ui/compare/v0.19.2...v0.19.3) (2026-10-21)

### Bug Fixes

* LazyImage and EmptyState images with spaces or parentheses in the URL did not show; cssUrl helper ([0c6b0f6](https://github.com/ziyarago/ui/commit/0c6b0f65ca2834835f271aba4c4be9d7ebe8099b))

## [0.19.2](https://github.com/ziyarago/ui/compare/v0.19.1...v0.19.2) (2026-10-21)

### Bug Fixes

* Progress track stripes and hatch pattern visible in the light theme ([f2b7352](https://github.com/ziyarago/ui/commit/f2b7352703e5c86c95a2a6c3aaf90020242c0baa))

## [0.19.1](https://github.com/ziyarago/ui/compare/v0.19.0...v0.19.1) (2026-10-21)

### Bug Fixes

* UserCell avatar letters no longer stick to the top ([533087d](https://github.com/ziyarago/ui/commit/533087d4b490375a1f3642db7a4b5be16cf4dae4))

## [0.19.0](https://github.com/ziyarago/ui/compare/v0.18.0...v0.19.0) (2026-10-21)

### Features

* SideNav expandable groups with children ([9572ae4](https://github.com/ziyarago/ui/commit/9572ae48a261a8fa3ec3e5d023858d91c2f4cd9b))

## [0.18.0](https://github.com/ziyarago/ui/compare/v0.17.0...v0.18.0) (2026-10-21)

### Features

* TopNav sub-menus with icons and overflow into a More menu, no edge fade ([ed1addd](https://github.com/ziyarago/ui/commit/ed1addd0d9a9844b4e6e23bbe86b18a5a01a74be))

## [0.17.0](https://github.com/ziyarago/ui/compare/v0.16.0...v0.17.0) (2026-10-21)

### Features

* chart components metadata, charts docs page and styles (Pro: LineChart, AreaChart, BarChart, DonutChart) ([be37587](https://github.com/ziyarago/ui/commit/be37587030f01821117364d1ec3f8d7565964f53))

## [0.16.0](https://github.com/ziyarago/ui/compare/v0.15.3...v0.16.0) (2026-10-21)

### Features

* keyboard and ARIA for Combobox, MultiSelect, Calendar and DatePicker, Tooltip Escape, client-side today, changelog cleanup ([ec905ac](https://github.com/ziyarago/ui/commit/ec905ace4be6d59c884b62941a697b53a2d236b7))

## [0.15.3](https://github.com/ziyarago/ui/compare/v0.15.2...v0.15.3) (2026-10-21)

### Bug Fixes

* Vue adapter keeps kebab-case :model-value and still calls an explicit :on-change ([3fbfce4](https://github.com/ziyarago/ui/commit/3fbfce4a12d46d8557044c57cf60294b3ccf2aa7))

## [0.15.2](https://github.com/ziyarago/ui/compare/v0.15.1...v0.15.2) (2026-10-21)

### Bug Fixes

* SideNav scrolls instead of squeezing items, collapsible prop ([1f1190e](https://github.com/ziyarago/ui/commit/1f1190e3d5b1c79cd6b0d82b3c2e0b8970fdcd1f))

## [0.15.1](https://github.com/ziyarago/ui/compare/v0.15.0...v0.15.1) (2026-10-21)

### Bug Fixes

* backdrop-filter order for lightningcss, LoginForm autocomplete and name, built-in icon set (no CDN for component icons), registerIcons ([18dd228](https://github.com/ziyarago/ui/commit/18dd2286c71ac2ff64a126bb1ead76d412b6a92d))

## [0.15.0](https://github.com/ziyarago/ui/compare/v0.14.0...v0.15.0) (2026-10-21)

### Features

* Pro components, page templates and migration tools move to the private @ziyarago/ui-pro package; the public package keeps the free Core (102 components) ([8432716](https://github.com/ziyarago/ui/commit/8432716b2c92def055cb79a44cba22b1eaa59676))

## [0.14.0](https://github.com/ziyarago/ui/compare/v0.13.0...v0.14.0) (2026-10-21)

### Features

* plugin API (registerComponents, defineUiComponents, registerMeta, resolver and Nuxt plugins option) ([ab8b844](https://github.com/ziyarago/ui/commit/ab8b8442a9968cfc0c978d9a5d4c3dc22b28b467))

## [0.13.0](https://github.com/ziyarago/ui/compare/v0.12.0...v0.13.0) (2026-10-21)

### Features

* accessibility audit with axe (0 violations), keyboard navigation for tabs, selects and menus, readable tooltips ([95a25e1](https://github.com/ziyarago/ui/commit/95a25e1d763f2c63ee788986943aeb3abbb669ae))

## [0.12.0](https://github.com/ziyarago/ui/compare/v0.11.0...v0.12.0) (2026-10-21)

### Features

* free Core and Pro split (102 free, 106 Pro): tiers metadata, Pro badges in docs, pricing copy ([9b50a96](https://github.com/ziyarago/ui/commit/9b50a966e9ae0857758630624d6f8c1175063be2))

## [0.11.0](https://github.com/ziyarago/ui/compare/v0.10.0...v0.11.0) (2026-10-21)

### Features

* Localization docs page, i18n tests, Pro language pack moved to private repo ([89dfed3](https://github.com/ziyarago/ui/commit/89dfed36ce7a9de6204fe54e912564ef19723160))

## [0.10.0](https://github.com/ziyarago/ui/compare/v0.9.0...v0.10.0) (2026-10-21)

### Features

* page templates wave 4 (itinerary, prayer, group manager, public tour), QiblaCompass, bundled fonts, auth page and compat fixes ([4809362](https://github.com/ziyarago/ui/commit/48093620085425bb936a44294c6d2c6cf2a888f6))

## [0.9.0](https://github.com/ziyarago/ui/compare/v0.8.0...v0.9.0) (2026-10-21)

### Features

* page templates wave 3 (article, changelog, help, states, legal, locations, booking flow) ([435d5b8](https://github.com/ziyarago/ui/commit/435d5b8209a527c845897968da4ffe8a8e009618))

## [0.8.0](https://github.com/ziyarago/ui/compare/v0.7.0...v0.8.0) (2026-10-21)

### Features

* page templates wave 2 (calendar, kanban, billing, team, integrations, search) ([22397b0](https://github.com/ziyarago/ui/commit/22397b000bcb473708eba3f91c415688bb668932))

## [0.7.0](https://github.com/ziyarago/ui/compare/v0.6.1...v0.7.0) (2026-10-21)

### Features

* page templates wave 1 (landing, onboarding, checkout, inbox, notifications, analytics) ([82bfc3c](https://github.com/ziyarago/ui/commit/82bfc3cd3b80ef875131040490d7d5dfba94adc9))

## [0.6.1](https://github.com/ziyarago/ui/compare/v0.6.0...v0.6.1) (2026-10-21)

### Bug Fixes

* stop shipping 3D icons and brand files, watermark demo icons on the docs site ([4736d3e](https://github.com/ziyarago/ui/commit/4736d3e8217fa4e78a81596f8cd8da7709cbd3a8))

## [0.6.0](https://github.com/ziyarago/ui/compare/v0.5.0...v0.6.0) (2026-10-21)

### Features

* SocialAuth component with Google and Apple buttons ([398b36d](https://github.com/ziyarago/ui/commit/398b36dcc808e8f4656c09e8c12acf2e21c6084d))

## [0.5.0](https://github.com/ziyarago/ui/compare/v0.4.0...v0.5.0) (2026-10-21)

### Features

* AuthShowcase login layouts (photo, light, tint) and PageAuth variants ([4ea5503](https://github.com/ziyarago/ui/commit/4ea5503e223f2c651292372be91987538f0517c8))

## [0.4.0](https://github.com/ziyarago/ui/compare/v0.3.0...v0.4.0) (2026-10-21)

### Features

* per-component translations (en, ar, ru free; 13 more languages in Pro pack), screenshots in README ([5fc8d9f](https://github.com/ziyarago/ui/commit/5fc8d9ffd85be7cacf42c5413561159d287d0316))

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
