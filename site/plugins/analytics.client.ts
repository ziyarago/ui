// Loads Google Analytics 4 and Yandex Metrika only in production and only when their IDs are configured.
// Both are initialised without an automatic first hit: the first page view and every client-side navigation are sent here exactly once.
import { START_LOCATION } from 'vue-router'

export default defineNuxtPlugin(nuxtApp => {
  const { gaId, ymId } = useRuntimeConfig().public
  if (import.meta.dev) return
  const router = useRouter()
  const w = window as any

  if (gaId) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.append(s)
    w.dataLayer = w.dataLayer || []
    w.gtag = function () { w.dataLayer.push(arguments) }
    w.gtag('js', new Date())
    w.gtag('config', gaId, { send_page_view: false })
  }

  if (ymId) {
    const id = Number(ymId)
    w.ym = w.ym || function () { (w.ym.a = w.ym.a || []).push(arguments) }
    w.ym.l = Date.now()
    const s = document.createElement('script')
    s.async = true
    s.src = `https://mc.yandex.ru/metrika/tag.js?id=${id}`
    document.head.append(s)
    w.ym(id, 'init', { defer: true, trackHash: true, clickmap: true, trackLinks: true, accurateTrackBounce: true, referrer: document.referrer, url: location.href })
  }

  let last = ''
  const hit = (path: string) => {
    if (path === last) return
    last = path
    if (gaId) w.gtag('event', 'page_view', { page_path: path, page_location: location.origin + path, page_title: document.title })
    if (ymId) w.ym(Number(ymId), 'hit', path, { title: document.title, referer: document.referrer })
  }
  nuxtApp.hook('app:mounted', () => hit(location.pathname + location.search))
  router.afterEach((to, from) => { if (from !== START_LOCATION) nextTick(() => hit(to.fullPath)) })
})
