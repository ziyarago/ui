export type UiLocale = 'en' | 'uz' | 'ru' | 'tr' | 'zh' | 'ar';
export const LOCALES: readonly UiLocale[];
export const RTL_LOCALES: readonly UiLocale[];
/** Switch the language of the built-in component strings. Components re-render by themselves. */
export function setUiLocale(locale: UiLocale | string): void;
export function getUiLocale(): UiLocale;
export function isRtlLocale(locale?: string): boolean;
/** Override single strings from the app: setUiMessages('ru', { Pagination: { prev: 'Назад' } }). Pass null to clear a locale. */
export function setUiMessages(locale: UiLocale | string, messages: Record<string, Record<string, string>> | null): void;
export function t(component: string, key: string, params?: Record<string, string | number>): string;
export function defineMessages(component: string, messages: Record<UiLocale, Record<string, string>>): void;
export function subscribeUiLocale(fn: (locale: UiLocale) => void): () => void;
