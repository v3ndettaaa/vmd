/**
 * VMD Svelte 5 Theme Store
 * Injects CSS variables onto :root dynamically and handles reduced-effects state.
 */

import type { ThemeId, ThemeDefinition } from './tokens';
import { amoledTheme } from './themes/amoled';
import { obsidianTheme } from './themes/obsidian';
import { nordTheme } from './themes/nord';
import { catppuccinTheme } from './themes/catppuccin';
import { paperTheme } from './themes/paper';
import { midnightTheme } from './themes/midnight';

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  amoled: amoledTheme,
  obsidian: obsidianTheme,
  nord: nordTheme,
  catppuccin: catppuccinTheme,
  paper: paperTheme,
  midnight: midnightTheme,
};

class ThemeState {
  currentThemeId = $state<ThemeId>('obsidian');
  reducedEffects = $state<boolean>(false);

  get currentTheme(): ThemeDefinition {
    return THEMES[this.currentThemeId] || THEMES.obsidian;
  }

  setTheme(id: ThemeId): void {
    if (!THEMES[id]) return;
    this.currentThemeId = id;
    this.applyToDOM();
  }

  setReducedEffects(enabled: boolean): void {
    this.reducedEffects = enabled;
    this.applyToDOM();
  }

  toggleReducedEffects(): void {
    this.setReducedEffects(!this.reducedEffects);
  }

  applyToDOM(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const theme = this.currentTheme;

    // Apply color tokens
    for (const [key, val] of Object.entries(theme.tokens)) {
      root.style.setProperty(key, val);
    }

    // Apply reduced effects class
    if (this.reducedEffects) {
      root.classList.add('reduced-effects');
    } else {
      root.classList.remove('reduced-effects');
    }

    // Set color-scheme
    root.style.colorScheme = theme.isDark ? 'dark' : 'light';
  }
}

export const themeStore = new ThemeState();
