import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const env = (k: string) => process.env[k] ?? ''

export default defineNuxtConfig({
  css: ['~/assets/site.css'],
  modules: ['@ziyarago/ui/nuxt'],
  compatibilityDate: '2025-01-01',
  ziyarago: { theme: { theme: 'dark', palette: 'gold', dir: 'ltr' } },
  // IDs and verification tokens come from the build environment (GitHub Actions variables), never from the code.
  runtimeConfig: {
    public: {
      version: pkg.version,
      siteUrl: env('NUXT_PUBLIC_SITE_URL') || 'https://ziyara.vip',
      gaId: env('NUXT_PUBLIC_GA_ID') || 'G-EECT5CXTJQ',
      ymId: env('NUXT_PUBLIC_YM_ID') || '113703146',
      googleVerification: env('NUXT_PUBLIC_GOOGLE_VERIFICATION'),
      yandexVerification: env('NUXT_PUBLIC_YANDEX_VERIFICATION'),
    },
  },
  nitro: { prerender: { crawlLinks: true, routes: ['/', '/docs', '/404.html'], failOnError: false } },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }, { rel: 'apple-touch-icon', href: '/favicon.png' }],
      noscript: [{ tagPosition: 'bodyClose', innerHTML: `<div><img src="https://mc.yandex.ru/watch/${env('NUXT_PUBLIC_YM_ID') || '113703146'}" style="position:absolute;left:-9999px" alt="" /></div>` }],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1c1b1b' },
        { name: 'author', content: 'ZiyaraGo' },
        ...(env('NUXT_PUBLIC_GOOGLE_VERIFICATION') ? [{ name: 'google-site-verification', content: env('NUXT_PUBLIC_GOOGLE_VERIFICATION') }] : []),
        ...(env('NUXT_PUBLIC_YANDEX_VERIFICATION') ? [{ name: 'yandex-verification', content: env('NUXT_PUBLIC_YANDEX_VERIFICATION') }] : []),
      ],
    },
  },
})
