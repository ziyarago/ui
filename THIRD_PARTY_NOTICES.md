# Third-party notices

| Asset | Source | License | How it is used |
|---|---|---|---|
| Thmanyah Sans, Serif Display, Serif Text | https://font.thmanyah.com | Own licence, https://font.thmanyah.com/licenses: free to use, but redistributing, hosting or making the files available for download is forbidden, and so is modifying them | NOT distributed. The font stack names it first; get the files from the official site and self-host them (`@ziyarago/ui/thmanyah.css`) |
| Manrope | https://fonts.google.com/specimen/Manrope | SIL OFL 1.1 | Shipped in `assets/fonts/manrope` (variable woff2, latin and cyrillic) |
| JetBrains Mono | https://www.jetbrains.com/lp/mono/ | SIL OFL 1.1 | Shipped in `assets/fonts/jetbrains-mono` (variable woff2, latin and cyrillic) |
| Lucide icons | https://lucide.dev | ISC | Fetched at runtime from unpkg; set a self-hosted path with `setIconBase()` |
| Map tiles (`UiMap`) | CARTO basemaps, © OpenStreetMap contributors | ODbL data, CARTO terms | Requested at runtime; keep the attribution the component shows |
| ZiyaraGo logo and 3D icons | ZiyaraGo | All rights reserved | not shipped in the package; shown on ziyara.vip for demonstration only |

Offline or strict-CSP deployments: self-host the Google Fonts and Lucide SVGs and point `setIconBase()` at your copy.
