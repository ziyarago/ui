export interface ModuleOptions {
  css?: boolean;
  prefix?: string;
  theme?: false | { theme?: 'dark' | 'light'; palette?: 'gold' | 'tamam'; dir?: 'ltr' | 'rtl'; bg?: 'none' | 'aurora' | 'sunset' | 'ocean' | 'emerald' | 'rose' | 'mesh' };
}
declare const _default: import('@nuxt/schema').NuxtModule<ModuleOptions>;
export default _default;
declare module '@nuxt/schema' {
  interface NuxtConfig { ziyarago?: ModuleOptions }
  interface NuxtOptions { ziyarago?: ModuleOptions }
}
