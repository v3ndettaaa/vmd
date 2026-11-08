/**
 * VMD Command Palette & Search Service
 */

export interface PaletteCommand {
  id: string;
  title: string;
  shortcut?: string;
  category: 'Editor' | 'File' | 'Theme' | 'View';
  action: () => void;
}

export function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  let qIdx = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] === q[qIdx]) {
      qIdx++;
      if (qIdx === q.length) return true;
    }
  }
  return false;
}

export function filterCommands(commands: PaletteCommand[], query: string): PaletteCommand[] {
  if (!query.trim()) return commands;
  return commands.filter((c) =>
    fuzzyMatch(query, c.title) || fuzzyMatch(query, c.category)
  );
}
