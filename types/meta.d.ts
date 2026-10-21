export interface MetaProp { type: string; values?: string[]; default?: unknown; description?: string; required?: boolean; model?: boolean; forwarded?: boolean }
export interface ComponentMeta { description: string; props?: Record<string, MetaProp>; slots?: Record<string, string>; events?: Record<string, string>; notes?: string[] }
export interface MetaGroup { id: string; title?: string; blurb?: string; names: string[] }
/** Extension API: adds metadata for plugin components. `tiers` are marked as pro, `groups` list them in the manifest. */
export function registerMeta(extra: Record<string, ComponentMeta>, options?: { tiers?: string[]; groups?: MetaGroup[] }): Record<string, ComponentMeta>;
export const meta: Record<string, ComponentMeta>;
export default meta;
