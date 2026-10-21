export interface ZiyaragoUiResolverOptions {
  /** Component prefix used in templates. Default 'Ui'. */
  prefix?: string;
  /** true: also import '@ziyarago/ui/style.css'; a string: import that module instead. Default false (import the css once in main.ts). */
  css?: boolean | string;
  /** Component names, without prefix, that must not be auto-imported (for example ['Button']). */
  exclude?: string[];
  /** Module the components come from. Default '@ziyarago/ui/vue'. */
  from?: string;
}
export interface ZiyaragoUiResolverResult { name: string; from: string; sideEffects?: string }
export interface ZiyaragoUiResolver { type: 'component'; resolve(name: string): ZiyaragoUiResolverResult | undefined }
export function ZiyaragoUiResolver(options?: ZiyaragoUiResolverOptions): ZiyaragoUiResolver;
export default ZiyaragoUiResolver;
