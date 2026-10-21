export interface ZiyaragoCompatResolverOptions {
  /** Module the compat components come from. Default '@ziyarago/ui/compat'. */
  from?: string;
  /** Full component names (with the Ui prefix) to leave to other resolvers or local files, for example ['UiTable']. */
  exclude?: string[];
  /** true: also import '@ziyarago/ui/style.css'; a string: import that module instead. Default false. */
  css?: boolean | string;
}
export interface ZiyaragoCompatResolverResult { name: string; from: string; sideEffects?: string }
export interface ZiyaragoCompatResolver { type: 'component'; resolve(name: string): ZiyaragoCompatResolverResult | undefined }
export function ZiyaragoCompatResolver(options?: ZiyaragoCompatResolverOptions): ZiyaragoCompatResolver;
export default ZiyaragoCompatResolver;
