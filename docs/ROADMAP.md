# Roadmap

What we plan to work on, in rough priority. No dates: items move between columns when we learn something. Want something sooner or have a use case? [Open an issue](https://github.com/ziyarago/ui/issues).

## Now

- **Per-component tree-shaking and smaller bundles.** The Vue, Nuxt and React adapters build every component at import time, so the Vue demo bundle is about 150 KB even when a page uses three components.
- **Map component fixes.** `UiMap` has known gaps in panning, markers and SSR behaviour that we are fixing before recommending it for production.
- **Accessibility audit with axe.** An automated axe run over the docs pages and component previews, with the results published on the Accessibility page.

## Next

- **Built-in i18n of component strings.** Labels such as "Previous", "Next", "Search" and "Loading" are English today; we plan en, ru, uz, ar, tr and zh.
- **React and Next verification.** The React adapter shares the core with Vue, but it is tested less; we want a verified Next.js (App Router) setup and tests for it.
- **More domain blocks.** More Umrah, Hajj and travel-specific blocks (itineraries, visa status, group manifests) on top of the existing components.

## Later

- **Pro starters.** Full application starters (CRM, hotel booking, Umrah operator) as paid products built on the free MIT library; the library itself stays free.
- **Flutter widgets from tokens.json.** An idea only: `tokens.json` is ready for a port, but we have not started and may not.
