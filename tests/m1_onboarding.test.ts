import { describe, it, expect, beforeEach } from 'vitest';
import { onboardingStore } from '../src/lib/components/welcome/onboarding_store.svelte';
import { themeStore } from '../src/lib/theme/theme_store.svelte';

describe('Task M1.3: First-Run Onboarding Experience', () => {
  beforeEach(() => {
    onboardingStore.resetOnboarding();
  });

  it('initializes with uncompleted onboarding on clean profile', () => {
    expect(onboardingStore.hasCompletedOnboarding).toBe(false);
  });

  it('completes onboarding and applies user preferences', () => {
    onboardingStore.completeOnboarding({
      theme: 'nord',
      language: 'fa',
      fontScale: 1.1,
      reducedEffects: true,
    });

    expect(onboardingStore.hasCompletedOnboarding).toBe(true);
    expect(onboardingStore.preferences.theme).toBe('nord');
    expect(onboardingStore.preferences.language).toBe('fa');
    expect(onboardingStore.preferences.fontScale).toBe(1.1);
    expect(onboardingStore.preferences.reducedEffects).toBe(true);

    // Verify theme was set
    expect(themeStore.currentThemeId).toBe('nord');
    expect(themeStore.reducedEffects).toBe(true);
  });

  it('persists completion status and prevents recurring welcome modal', () => {
    onboardingStore.completeOnboarding({ theme: 'amoled' });
    expect(onboardingStore.hasCompletedOnboarding).toBe(true);

    // Reload state simulation
    onboardingStore.loadState();
    expect(onboardingStore.hasCompletedOnboarding).toBe(true);
  });
});
