export interface SeoInput { title: string; description: string; type?: 'website' | 'article'; noindex?: boolean; image?: string }

/** Canonical URL, Open Graph and Twitter tags for one page. Call once per page. */
export function useSeo(input: SeoInput | (() => SeoInput)) {
  const { siteUrl } = useRuntimeConfig().public
  const route = useRoute()
  const read = () => (typeof input === 'function' ? input() : input)
  const url = () => siteUrl + (route.path === '/' ? '/' : route.path.replace(/\/+$/, ''))
  useHead(() => ({ title: read().title, link: [{ rel: 'canonical', href: url() }] }))
  useSeoMeta({
    title: () => read().title,
    description: () => read().description,
    ogTitle: () => read().title,
    ogDescription: () => read().description,
    ogType: () => read().type ?? 'website',
    ogUrl: url,
    ogSiteName: '@ziyarago/ui',
    ogImage: () => siteUrl + (read().image ?? '/og.png'),
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image',
    twitterTitle: () => read().title,
    twitterDescription: () => read().description,
    twitterImage: () => siteUrl + (read().image ?? '/og.png'),
    robots: () => (read().noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'),
  })
}
