import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { typographyStore } from '../src/lib/typography/typography_store.svelte';

describe('Task M6.1: Font Bundling & Typography Engine', () => {
  it('bundles all 4 OFL-1.1 fonts and license files locally', () => {
    const fonts = [
      'vazirmatn/Vazirmatn.woff2',
      'google-sans/GoogleSansFlex.woff2',
      'plus-jakarta-sans/PlusJakartaSans.woff2',
      'jetbrains-mono/JetBrainsMono.woff2',
    ];

    for (const font of fonts) {
      const fontPath = resolve(__dirname, `../src/assets/fonts/${font}`);
      expect(existsSync(fontPath), `Font missing: ${font}`).toBe(true);

      const oflPath = resolve(__dirname, `../src/assets/fonts/${font.split('/')[0]}/OFL.txt`);
      expect(existsSync(oflPath), `OFL license missing: ${font}`).toBe(true);
      const oflContent = readFileSync(oflPath, 'utf-8');
      expect(oflContent).toContain('SIL OPEN FONT LICENSE Version 1.1');
    }
  });

  it('declares local font-face definitions in fonts.css', () => {
    const cssPath = resolve(__dirname, '../src/lib/typography/fonts.css');
    const css = readFileSync(cssPath, 'utf-8');

    expect(css).toContain("font-family: 'Vazirmatn'");
    expect(css).toContain("font-family: 'Google Sans Flex'");
    expect(css).toContain("font-family: 'Plus Jakarta Sans'");
    expect(css).toContain("font-family: 'JetBrains Mono'");
  });

  it('clamps and updates typography settings in typographyStore', () => {
    typographyStore.setFontSize(18);
    expect(typographyStore.baseFontSize).toBe(18);

    // Clamps minimum to 12
    typographyStore.setFontSize(8);
    expect(typographyStore.baseFontSize).toBe(12);

    // Clamps maximum to 24
    typographyStore.setFontSize(32);
    expect(typographyStore.baseFontSize).toBe(24);
  });
});
