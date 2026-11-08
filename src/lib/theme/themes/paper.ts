import type { ThemeDefinition } from '../tokens';

export const paperTheme: ThemeDefinition = {
  id: 'paper',
  name: 'Warm Paper',
  isDark: false,
  tokens: {
    '--bg-primary': '#fbfbf9',
    '--bg-secondary': '#f2f2ee',
    '--surface-glass': 'rgba(242, 242, 238, 0.85)',
    '--border-subtle': '#e4e4dc',
    '--text-primary': '#1c1917',
    '--text-muted': '#78716c',
    '--accent-primary': '#d97706',
    '--accent-hover': '#b45309',
    '--selection-bg': 'rgba(217, 119, 6, 0.22)',
    '--code-bg': '#f5f5f0',
  },
};
