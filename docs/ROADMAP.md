# Roadmap

What we plan to work on, in rough priority. No dates: items move between columns when we learn something. Want something sooner or have a use case? [Open an issue](https://github.com/ziyarago/ui/issues).

## Page templates plan

Goal: a ready layout for almost every screen a product needs. Each template ships as `UiPage<Name>` with named slots, a props table, a live demo on the docs site (dark, light, RTL, mobile), SSR and type tests. Built in four waves; a wave is released when all its pages pass the checks.

**Wave 1: every product needs these**
- Landing: hero, features, proof, pricing, footer.
- Onboarding: setup steps, checklist, progress.
- Checkout: cart, address, payment, summary.
- Inbox and chat: conversation list, thread, customer panel.
- Notifications and activity: feed, filters, mark as read.
- Analytics and reports: charts, period picker, table, export.

**Wave 2: product scenarios**
- Calendar and schedule: week, day, events.
- Kanban and tasks: board, card in a side panel.
- Billing: plan, invoices, payment methods, usage.
- Team and roles: members, invites, permissions.
- Integrations and API keys: connections, keys, webhooks.
- Search results: results, filters, empty state.

**Wave 3: content and utility**
- Blog and article, Changelog, Help center (category and article).
- Empty and error states: one page with every variant.
- Legal: document with a table of contents.
- Map and locations: list plus map.
- Booking flow: search, pick, guests, confirm.

**Wave 4: Umrah and Hajj**
- Itinerary: days, places, times.
- Prayer times and Qibla.
- Group manager: pilgrims, rooms, documents, payments.
- Public tour page: tour details with price and booking.

Rules for every page: composed from existing components (a missing small component is added properly with meta and example), no hard-coded English that the i18n layer should own, no 3D icons (icon names only), mobile first, works with `data-size`.

## Now

- **Bundled icons.** Lucide icons are fetched from a CDN by default and break under a strict CSP. Plan: an `@ziyarago/ui/icons` entry with the used icons bundled, no network.

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
