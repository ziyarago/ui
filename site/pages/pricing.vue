<script setup lang="ts">
useSeo({ title: 'Pricing: free MIT library and Pro starters — @ziyarago/ui', description: 'The @ziyarago/ui library is free and MIT-licensed. Pro starter apps, domain packs and priority support are in development: join the early access list for launch pricing.' })

const { ymId, gaId } = useRuntimeConfig().public
const mail = 'dev@ziyarago.com'

type Plan = { id: string; name: string; price: string; period?: string; badge?: string; featured?: boolean; cta: string; features: string[]; goal: string }
const plans: Plan[] = [
  { id: 'free', name: 'Open source', price: '$0', period: 'forever', cta: 'Get started', goal: 'pricing_free', features: ['184 components', '17 page templates with source', 'Vue 3, Nuxt and React', 'Dark, light, RTL and Arabic', 'MCP server and llms.txt for AI tools', 'MIT license, community support'] },
  { id: 'solo', name: 'Pro Solo', price: '$149', period: 'one-time', badge: 'Early access', featured: true, cta: 'Join the waitlist', goal: 'waitlist_solo', features: ['Everything in Open source', 'Starter apps: CRM, hotel booking, Umrah operator admin', 'Domain pack: hotel, tour, booking and prayer blocks', '1 developer, unlimited own projects', '12 months of updates', 'Email support'] },
  { id: 'team', name: 'Pro Team', price: '$399', period: 'one-time', cta: 'Join the waitlist', goal: 'waitlist_team', features: ['Everything in Pro Solo', 'Up to 5 developers', 'Priority support, 2 business days', 'Early access to new starters'] },
  { id: 'agency', name: 'Pro Agency', price: '$899', period: 'one-time', cta: 'Join the waitlist', goal: 'waitlist_agency', features: ['Everything in Pro Team', 'Unlimited developers in your company', 'Use in client projects', 'Private support channel'] },
]
const faq = [
  { id: 1, title: 'Can I buy Pro today?', body: 'Not yet. The starters and the domain pack are in development. Join the waitlist and you get early access and the launch price, which is lower than the list price. The open source library is complete and free now.' },
  { id: 2, title: 'What stays free?', body: 'All 184 components, all 17 page templates with their source, the docs, the MCP server and the AI catalog stay MIT-licensed. We will not move existing free features behind a paywall.' },
  { id: 3, title: 'What is in Pro exactly?', body: 'New work that is not in the open source repository: complete starter apps built on the templates (CRM, hotel booking, Umrah operator admin), domain components for hotels, tours, bookings and prayer times, and support.' },
  { id: 4, title: 'Can I use it for client work?', body: 'The MIT library: yes, always. Pro Solo and Team: in your own projects. Agency: in projects you build for clients.' },
  { id: 5, title: 'Do you build custom interfaces?', body: 'Yes. We design and build admin panels and booking products on this system, with Arabic and RTL. Write to us with a short description.' },
  { id: 6, title: 'How do updates work?', body: 'Pro includes 12 months of updates. After that you keep the version you have and can renew updates for $49 per year.' },
]

function track(goal: string) {
  const w = window as any
  try { if (ymId && w.ym) w.ym(Number(ymId), 'reachGoal', goal) } catch {}
  try { if (gaId && w.gtag) w.gtag('event', goal) } catch {}
}
function select(p: Plan) {
  track(p.goal)
  if (p.id === 'free') return navigateTo('/docs')
  const subject = encodeURIComponent(`Early access: ${p.name}`)
  const body = encodeURIComponent(`Hi, I want early access to ${p.name}.\n\nName:\nCompany:\nWhat I plan to build:\n`)
  window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`
}
function services() {
  track('services_contact')
  window.location.href = `mailto:${mail}?subject=${encodeURIComponent('Custom interface project')}&body=${encodeURIComponent('Hi, we need help building:\n')}`
}
</script>

<template>
  <article class="pr">
    <header class="pr__h">
      <UiBadge tone="brand">Open core</UiBadge>
      <h1>The library is free. Pro starters are coming.</h1>
      <p>@ziyarago/ui is MIT-licensed and complete. We are building paid Pro products on top of it: full starter apps, domain packs and support. Join the waitlist for early access and launch pricing.</p>
    </header>

    <UiGrid :min="240" :gap="16">
      <UiPricingCard v-for="p in plans" :key="p.id" :name="p.name" :price="p.price" :period="p.period" :badge="p.badge" :featured="p.featured" :cta="p.cta" :features="p.features" @select="select(p)" />
    </UiGrid>
    <p class="pr__note">Prices are the planned list prices in US dollars. Pro is not on sale yet: the buttons start an email to the team and the waitlist gets the launch price.</p>

    <UiCard variant="gradient" tone="violet" title="Need it built for you?" subtitle="Interfaces on this system, with Arabic and RTL">
      <UiVStack :gap="12">
        <UiText>Admin panels, CRM, hotel and tour booking, mobile-first guest apps. We use the same components, so the result stays maintainable by your team.</UiText>
        <div><UiButton variant="primary" @click="services">Describe your project</UiButton></div>
      </UiVStack>
    </UiCard>

    <section>
      <h2>Questions</h2>
      <UiAccordion :items="faq.map(f => ({ id: f.id, title: f.title, body: f.body }))" />
    </section>
  </article>
</template>

<style scoped>
.pr { display: flex; flex-direction: column; gap: 28px; padding: 40px 0 24px; }
.pr__h { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; max-width: 760px; }
.pr__h h1 { margin: 0; font: 300 clamp(34px, 5vw, 56px) / 1.05 var(--zg-font); letter-spacing: -.03em; }
.pr__h p { margin: 0; color: var(--zg-text-2); font-size: 18px; line-height: 1.55; }
.pr__note { margin: -10px 0 0; color: var(--zg-text-3); font-size: 13.5px; max-width: 80ch; }
.pr h2 { margin: 0 0 14px; font: 500 24px var(--zg-font); }
</style>
