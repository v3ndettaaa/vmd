/**
 * VMD Typography Settings Store
 * Configures font scales, line heights, and typography defaults.
 */

class TypographyState {
  baseFontSize = $state<number>(15);
  lineHeight = $state<number>(1.65);
  primaryLanguage = $state<'en' | 'fa'>('en');

  setFontSize(sizePx: number): void {
    this.baseFontSize = Math.max(12, Math.min(24, sizePx));
    this.applyToDOM();
  }

  setLineHeight(lh: number): void {
    this.lineHeight = Math.max(1.4, Math.min(2.0, lh));
    this.applyToDOM();
  }

  setLanguage(lang: 'en' | 'fa'): void {
    this.primaryLanguage = lang;
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    }
  }

  applyToDOM(): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--font-base-size', `${this.baseFontSize}px`);
    root.style.setProperty('--line-height-base', `${this.lineHeight}`);
  }
}

export const typographyStore = new TypographyState();
