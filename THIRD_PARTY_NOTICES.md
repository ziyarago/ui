# Third-party notices

| Asset | Source | License | How it is used |
|---|---|---|---|
| Thmanyah Sans, Serif Display, Serif Text | https://font.thmanyah.com | Free, including commercial use (check the foundry page before redistributing changes) | Shipped in `assets/fonts/thmanyah` for Arabic and RTL |
| Manrope | https://fonts.google.com/specimen/Manrope | SIL OFL 1.1 | Loaded from Google Fonts in `dist/style.css` |
| JetBrains Mono | https://www.jetbrains.com/lp/mono/ | SIL OFL 1.1 | Loaded from Google Fonts |
| Lucide icons | https://lucide.dev | ISC | Fetched at runtime from unpkg; set a self-hosted path with `setIconBase()` |
| Map tiles (`UiMap`) | CARTO basemaps, © OpenStreetMap contributors | ODbL data, CARTO terms | Requested at runtime; keep the attribution the component shows |
| ZiyaraGo logo and 3D icons | ZiyaraGo | All rights reserved | `assets/brand`, `assets/3d`; not covered by the package license |

Offline or strict-CSP deployments: self-host the Google Fonts and Lucide SVGs and point `setIconBase()` at your copy.
