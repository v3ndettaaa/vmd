import { describe, it, expect } from 'vitest';
import { i18n } from '../src/lib/i18n/i18n.svelte';
import { typographyStore } from '../src/lib/typography/typography_store.svelte';

describe('Task M6.2: RTL/LTR Bidirectional Editing & Localization', () => {
  it('provides translations for English and Persian', () => {
    i18n.setLocale('en');
    expect(i18n.t('app.title')).toBe('VMD Workspace');
    expect(i18n.t('shell.source')).toBe('Source');
    expect(typographyStore.primaryLanguage).toBe('en');

    i18n.setLocale('fa');
    expect(i18n.t('app.title')).toBe('محیط کاری VMD');
    expect(i18n.t('shell.source')).toBe('منبع');
    expect(typographyStore.primaryLanguage).toBe('fa');

    // Restore to en
    i18n.setLocale('en');
  });

  it('falls back to key string when translation is missing', () => {
    expect(i18n.t('nonexistent.path.key')).toBe('nonexistent.path.key');
  });
});
