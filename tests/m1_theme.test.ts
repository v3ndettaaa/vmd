import { describe, it, expect } from 'vitest';
import { REQUIRED_TOKEN_KEYS, type ThemeId } from '../src/lib/theme/tokens';
import { THEMES, themeStore } from '../src/lib/theme/theme_store.svelte';

describe('Task M1.1: Design Token System & 6 Core Themes', () => {
  const themeIds: ThemeId[] = ['amoled', 'obsidian', 'nord', 'catppuccin', 'paper', 'midnight'];

  it('defines all 6 themes with required design tokens', () => {
    for (const id of themeIds) {
      const theme = THEMES[id];
      expect(theme).toBeDefined();
      expect(theme.id).toBe(id);
      expect(typeof theme.name).toBe('string');
      expect(typeof theme.isDark).toBe('boolean');

      for (const tokenKey of REQUIRED_TOKEN_KEYS) {
        expect(theme.tokens[tokenKey], `Theme ${id} missing ${tokenKey}`).toBeDefined();
        expect(theme.tokens[tokenKey].length).toBeGreaterThan(0);
      }
    }
  });

  it('distinguishes dark themes from light themes', () => {
    expect(THEMES.amoled.isDark).toBe(true);
    expect(THEMES.obsidian.isDark).toBe(true);
    expect(THEMES.nord.isDark).toBe(true);
    expect(THEMES.catppuccin.isDark).toBe(true);
    expect(THEMES.midnight.isDark).toBe(true);
    expect(THEMES.paper.isDark).toBe(false);
  });

  it('updates themeStore when switching themes', () => {
    themeStore.setTheme('nord');
    expect(themeStore.currentThemeId).toBe('nord');
    expect(themeStore.currentTheme.name).toBe('Nordic Frost');

    themeStore.setTheme('paper');
    expect(themeStore.currentThemeId).toBe('paper');
    expect(themeStore.currentTheme.isDark).toBe(false);

    // Revert back to obsidian
    themeStore.setTheme('obsidian');
    expect(themeStore.currentThemeId).toBe('obsidian');
  });

  it('toggles reduced-effects state in themeStore', () => {
    themeStore.setReducedEffects(false);
    expect(themeStore.reducedEffects).toBe(false);

    themeStore.toggleReducedEffects();
    expect(themeStore.reducedEffects).toBe(true);

    themeStore.toggleReducedEffects();
    expect(themeStore.reducedEffects).toBe(false);
  });
});
