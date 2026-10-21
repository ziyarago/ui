import type { Plugin } from 'vite';
export interface ZiyaragoCompatViteOptions {
  /** Module the redirected imports resolve to. Default '@ziyarago/ui/compat'. */
  from?: string;
  /** Matches the local ui directory in an import path; group 1 is the folder, group 2 the optional file. */
  ui?: RegExp;
  /** Import paths that stay local. Default [/MultilangInput/]. */
  exclude?: RegExp[];
}
export function ziyaragoCompat(options?: ZiyaragoCompatViteOptions): Plugin;
export default ziyaragoCompat;
