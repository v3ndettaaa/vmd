/**
 * VMD Internationalization & Localization Engine
 * English & Persian with dynamic RTL/LTR shell toggling.
 */

import en from './locales/en.json';
import fa from './locales/fa.json';
import { typographyStore } from '../typography/typography_store.svelte';

export type Locale = 'en' | 'fa';

const translations: Record<Locale, Record<string, unknown>> = {
  en,
  fa,
};

class I18nState {
  currentLocale = $state<Locale>('en');

  setLocale(locale: Locale): void {
    this.currentLocale = locale;
    typographyStore.setLanguage(locale);
  }

  t(path: string): string {
    const keys = path.split('.');
    let current: unknown = translations[this.currentLocale];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return path;
      }
    }

    return typeof current === 'string' ? current : path;
  }
}

export const i18n = new I18nState();
