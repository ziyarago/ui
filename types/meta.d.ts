export interface MetaProp { type: string; values?: string[]; default?: unknown; description?: string; required?: boolean; model?: boolean; forwarded?: boolean }
export interface ComponentMeta { description: string; props?: Record<string, MetaProp>; slots?: Record<string, string>; events?: Record<string, string>; notes?: string[] }
export const meta: Record<string, ComponentMeta>;
export default meta;
