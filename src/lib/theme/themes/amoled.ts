import type { ThemeDefinition } from '../tokens';

export const amoledTheme: ThemeDefinition = {
  id: 'amoled',
  name: 'Pure AMOLED',
  isDark: true,
  tokens: {
    '--bg-primary': '#000000',
    '--bg-secondary': '#0a0a0a',
    '--surface-glass': 'rgba(12, 12, 12, 0.75)',
    '--border-subtle': '#222222',
    '--text-primary': '#ffffff',
    '--text-muted': '#888888',
    '--accent-primary': '#6366f1',
    '--accent-hover': '#4f46e5',
    '--selection-bg': 'rgba(99, 102, 241, 0.3)',
    '--code-bg': '#080808',
  },
};
