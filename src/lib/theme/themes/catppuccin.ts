import type { ThemeDefinition } from '../tokens';

export const catppuccinTheme: ThemeDefinition = {
  id: 'catppuccin',
  name: 'Catppuccin Mocha',
  isDark: true,
  tokens: {
    '--bg-primary': '#1e1e2e',
    '--bg-secondary': '#181825',
    '--surface-glass': 'rgba(30, 30, 46, 0.72)',
    '--border-subtle': '#313244',
    '--text-primary': '#cdd6f4',
    '--text-muted': '#a6adc8',
    '--accent-primary': '#cba6f7',
    '--accent-hover': '#b4befe',
    '--selection-bg': 'rgba(203, 166, 247, 0.28)',
    '--code-bg': '#11111b',
  },
};
