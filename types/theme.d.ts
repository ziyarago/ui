export type Theme = 'dark' | 'light';
export type Palette = 'gold' | 'tamam';
export type Dir = 'ltr' | 'rtl';
export type Motion = 'auto' | 'on' | 'off';
export type Effects = 'auto' | 'full' | 'lite';
export type Background = 'none' | 'aurora' | 'sunset' | 'ocean' | 'emerald' | 'rose' | 'mesh';
export interface UiThemeState { theme: Theme; palette: Palette; dir: Dir; motion: Motion; effects: Effects; bg: Background }
export interface UiTheme {
  readonly theme: Theme; readonly palette: Palette; readonly dir: Dir;
  readonly motion: Motion; readonly effects: Effects; readonly bg: Background;
  readonly resolved: { motion: 'on' | 'off'; effects: 'full' | 'lite' };
  readonly palettes: Palette[]; readonly backgrounds: Background[];
  setTheme(t: Theme): void; toggleTheme(): void; setPalette(p: Palette): void; setDir(d: Dir): void; setLocale(code: string): void;
  setMotion(m: Motion): void; setEffects(e: Effects): void; setBackground(b: Background): void;
  subscribe(fn: (state: UiThemeState) => void): () => void;
  snapshot(): UiThemeState;
}
export const PALETTES: Palette[];
export const BACKGROUNDS: Background[];
/** Inline script for <head>: applies the saved theme/palette/dir before first paint. Inject it in SSR layouts (Next: <script dangerouslySetInnerHTML>). */
export const themeInitScript: string;
export function useUiTheme(): UiTheme;

export function configureTheme(defaults?: Partial<{ theme: 'dark' | 'light'; palette: string; dir: 'ltr' | 'rtl'; motion: 'auto' | 'on' | 'off'; effects: 'auto' | 'full' | 'lite'; bg: string }>): void;
export function applySavedLocale(): void;
