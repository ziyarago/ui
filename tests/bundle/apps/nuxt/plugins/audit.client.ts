export default defineNuxtPlugin(nuxtApp => {
  const w = window as any;
  w.__zg = w.__zg || { errors: [], mounted: 0, expected: 0, done: false, current: '', fingerprints: {} };
  for (const k of ['error', 'warn'] as const) {
    const orig = console[k].bind(console);
    console[k] = (...a: any[]) => orig(...a);
  }
  nuxtApp.vueApp.config.errorHandler = (err: any) => w.__zg.errors.push({ component: 'app', variant: 0, message: String(err && (err.stack || err.message) || err).split('\n').slice(0, 4).join('\n') });
});
