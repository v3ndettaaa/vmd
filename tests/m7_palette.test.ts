import { describe, it, expect } from 'vitest';
import { fuzzyMatch, filterCommands, type PaletteCommand } from '../src/lib/services/search_service';

describe('Task M7.2: Command Palette & Global Search', () => {
  const dummyCommands: PaletteCommand[] = [
    { id: '1', title: 'New Document', category: 'File', action: () => {} },
    { id: '2', title: 'Open File', category: 'File', action: () => {} },
    { id: '3', title: 'Switch to Live Mode', category: 'View', action: () => {} },
    { id: '4', title: 'Toggle Reduced Effects', category: 'Editor', action: () => {} },
  ];

  it('matches fuzzy query sequences accurately', () => {
    expect(fuzzyMatch('ndoc', 'New Document')).toBe(true);
    expect(fuzzyMatch('live', 'Switch to Live Mode')).toBe(true);
    expect(fuzzyMatch('xyz', 'New Document')).toBe(false);
  });

  it('filters commands by title and category', () => {
    const fileCmds = filterCommands(dummyCommands, 'file');
    expect(fileCmds.length).toBe(2);

    const modeCmds = filterCommands(dummyCommands, 'live');
    expect(modeCmds.length).toBe(1);
    expect(modeCmds[0].title).toBe('Switch to Live Mode');
  });
});
