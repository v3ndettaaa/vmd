import type { ThemeDefinition } from '../tokens';

export const obsidianTheme: ThemeDefinition = {
  id: 'obsidian',
  name: 'Obsidian Night',
  isDark: true,
  tokens: {
    '--bg-primary': '#0d0d11',
    '--bg-secondary': '#16161c',
    '--surface-glass': 'rgba(22, 22, 28, 0.72)',
    '--border-subtle': '#272732',
    '--text-primary': '#e2e8f0',
    '--text-muted': '#94a3b8',
    '--accent-primary': '#818cf8',
    '--accent-hover': '#6366f1',
    '--selection-bg': 'rgba(129, 140, 248, 0.28)',
    '--code-bg': '#121217',
  },
};
