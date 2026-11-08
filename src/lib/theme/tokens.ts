/**
 * VMD Design Token Specification & Theme Contracts
 */

export type ThemeId = 'amoled' | 'obsidian' | 'nord' | 'catppuccin' | 'paper' | 'midnight';

export interface ThemeTokens {
  '--bg-primary': string;
  '--bg-secondary': string;
  '--surface-glass': string;
  '--border-subtle': string;
  '--text-primary': string;
  '--text-muted': string;
  '--accent-primary': string;
  '--accent-hover': string;
  '--selection-bg': string;
  '--code-bg': string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  isDark: boolean;
  tokens: ThemeTokens;
}

export const REQUIRED_TOKEN_KEYS: (keyof ThemeTokens)[] = [
  '--bg-primary',
  '--bg-secondary',
  '--surface-glass',
  '--border-subtle',
  '--text-primary',
  '--text-muted',
  '--accent-primary',
  '--accent-hover',
  '--selection-bg',
  '--code-bg',
];
