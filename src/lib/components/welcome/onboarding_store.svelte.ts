/**
 * VMD Onboarding Store
 * Tracks first-run onboarding completion and user preferences.
 */

import type { ThemeId } from '../../theme/tokens';
import { themeStore } from '../../theme/theme_store.svelte';

export interface UserPreferences {
  theme: ThemeId;
  language: 'en' | 'fa';
  fontScale: number;
  reducedEffects: boolean;
}

const ONBOARDING_KEY = 'vmd_onboarding_completed';
const PREFS_KEY = 'vmd_user_preferences';

class OnboardingState {
  hasCompletedOnboarding = $state<boolean>(false);
  preferences = $state<UserPreferences>({
    theme: 'obsidian',
    language: 'en',
    fontScale: 1.0,
    reducedEffects: false,
  });

  constructor() {
    this.loadState();
  }

  loadState(): void {
    if (typeof localStorage === 'undefined') return;

    const completed = localStorage.getItem(ONBOARDING_KEY);
    this.hasCompletedOnboarding = completed === 'true';

    const savedPrefs = localStorage.getItem(PREFS_KEY);
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs) as UserPreferences;
        this.preferences = { ...this.preferences, ...parsed };
      } catch {
        // Use default preferences
      }
    }
  }

  completeOnboarding(prefs: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...prefs };
    this.hasCompletedOnboarding = true;

    // Apply choices immediately
    if (prefs.theme) {
      themeStore.setTheme(prefs.theme);
    }
    if (prefs.reducedEffects !== undefined) {
      themeStore.setReducedEffects(prefs.reducedEffects);
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      localStorage.setItem(PREFS_KEY, JSON.stringify(this.preferences));
    }
  }

  resetOnboarding(): void {
    this.hasCompletedOnboarding = false;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ONBOARDING_KEY);
    }
  }
}

export const onboardingStore = new OnboardingState();
