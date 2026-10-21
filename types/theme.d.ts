export type Theme = 'dark' | 'light';
export type Palette = 'gold' | 'tamam';
export type Dir = 'ltr' | 'rtl';
export interface UiTheme { readonly theme: Theme; readonly palette: Palette; readonly dir: Dir; readonly palettes: Palette[]; setTheme(t: Theme): void; toggleTheme(): void; setPalette(p: Palette): void; setDir(d: Dir): void; setLocale(code: string): void }
export const PALETTES: Palette[];
export function useUiTheme(): UiTheme;
