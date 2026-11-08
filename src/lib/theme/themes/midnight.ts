import type { ThemeDefinition } from '../tokens';

export const midnightTheme: ThemeDefinition = {
  id: 'midnight',
  name: 'Midnight Glass',
  isDark: true,
  tokens: {
    '--bg-primary': '#0f172a',
    '--bg-secondary': '#1e293b',
    '--surface-glass': 'rgba(15, 23, 42, 0.72)',
    '--border-subtle': '#334155',
    '--text-primary': '#f8fafc',
    '--text-muted': '#94a3b8',
    '--accent-primary': '#38bdf8',
    '--accent-hover': '#0284c7',
    '--selection-bg': 'rgba(56, 189, 248, 0.28)',
    '--code-bg': '#0a0f1d',
  },
};
