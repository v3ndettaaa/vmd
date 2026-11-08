import type { ThemeDefinition } from '../tokens';

export const nordTheme: ThemeDefinition = {
  id: 'nord',
  name: 'Nordic Frost',
  isDark: true,
  tokens: {
    '--bg-primary': '#2e3440',
    '--bg-secondary': '#3b4252',
    '--surface-glass': 'rgba(59, 66, 82, 0.72)',
    '--border-subtle': '#4c566a',
    '--text-primary': '#eceff4',
    '--text-muted': '#d8dee9',
    '--accent-primary': '#88c0d0',
    '--accent-hover': '#81a1c1',
    '--selection-bg': 'rgba(136, 192, 208, 0.28)',
    '--code-bg': '#242933',
  },
};
