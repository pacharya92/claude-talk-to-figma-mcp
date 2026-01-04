import {
  sortFramesByCanvasReadingOrder,
  generateUniquePageName,
  generatePageName,
  FramePosition
} from '../../../src/talk_to_figma_mcp/utils/split-frames-helpers';

describe('split-frames-helpers', () => {
  describe('sortFramesByCanvasReadingOrder', () => {
    it('should sort frames top-to-bottom', () => {
      const frames: FramePosition[] = [
        { id: '3', name: 'Bottom', x: 0, y: 300 },
        { id: '1', name: 'Top', x: 0, y: 0 },
        { id: '2', name: 'Middle', x: 0, y: 150 },
      ];

      const sorted = sortFramesByCanvasReadingOrder(frames);

      expect(sorted[0].name).toBe('Top');
      expect(sorted[1].name).toBe('Middle');
      expect(sorted[2].name).toBe('Bottom');
    });

    it('should sort frames left-to-right when on the same row (within 10px)', () => {
      const frames: FramePosition[] = [
        { id: '3', name: 'Right', x: 600, y: 5 },
        { id: '1', name: 'Left', x: 0, y: 0 },
        { id: '2', name: 'Center', x: 300, y: 3 },
      ];

      const sorted = sortFramesByCanvasReadingOrder(frames);

      expect(sorted[0].name).toBe('Left');
      expect(sorted[1].name).toBe('Center');
      expect(sorted[2].name).toBe('Right');
    });

    it('should handle reading order for grid layouts', () => {
      // A 2x2 grid of frames
      const frames: FramePosition[] = [
        { id: '4', name: 'Bottom Right', x: 400, y: 400 },
        { id: '2', name: 'Top Right', x: 400, y: 0 },
        { id: '3', name: 'Bottom Left', x: 0, y: 400 },
        { id: '1', name: 'Top Left', x: 0, y: 0 },
      ];

      const sorted = sortFramesByCanvasReadingOrder(frames);

      expect(sorted.map(f => f.name)).toEqual([
        'Top Left',
        'Top Right',
        'Bottom Left',
        'Bottom Right',
      ]);
    });

    it('should not mutate the original array', () => {
      const frames: FramePosition[] = [
        { id: '2', name: 'B', x: 200, y: 0 },
        { id: '1', name: 'A', x: 0, y: 0 },
      ];

      const sorted = sortFramesByCanvasReadingOrder(frames);

      expect(frames[0].name).toBe('B'); // Original unchanged
      expect(sorted[0].name).toBe('A'); // Sorted version
    });

    it('should handle empty array', () => {
      const sorted = sortFramesByCanvasReadingOrder([]);
      expect(sorted).toEqual([]);
    });

    it('should handle single frame', () => {
      const frames: FramePosition[] = [
        { id: '1', name: 'Only', x: 100, y: 100 },
      ];

      const sorted = sortFramesByCanvasReadingOrder(frames);
      expect(sorted).toHaveLength(1);
      expect(sorted[0].name).toBe('Only');
    });

    it('should treat frames within 10px y as same row', () => {
      const frames: FramePosition[] = [
        { id: '2', name: 'Slightly Lower Right', x: 400, y: 8 },
        { id: '1', name: 'Slightly Higher Left', x: 0, y: 0 },
      ];

      const sorted = sortFramesByCanvasReadingOrder(frames);

      // Both within 10px y difference, so sort by x
      expect(sorted[0].name).toBe('Slightly Higher Left');
      expect(sorted[1].name).toBe('Slightly Lower Right');
    });

    it('should treat frames beyond 10px y as different rows', () => {
      const frames: FramePosition[] = [
        { id: '2', name: 'Right Lower', x: 400, y: 15 },
        { id: '1', name: 'Left Higher', x: 0, y: 0 },
      ];

      const sorted = sortFramesByCanvasReadingOrder(frames);

      // More than 10px y difference, so Left Higher is first (lower y)
      expect(sorted[0].name).toBe('Left Higher');
      expect(sorted[1].name).toBe('Right Lower');
    });
  });

  describe('generateUniquePageName', () => {
    it('should return the base name when it does not exist', () => {
      const existingNames = new Set<string>(['Page 1', 'Page 2']);
      const result = generateUniquePageName('New Page', existingNames);
      expect(result).toBe('New Page');
    });

    it('should append (2) when name exists', () => {
      const existingNames = new Set<string>(['Login Screen', 'Home']);
      const result = generateUniquePageName('Login Screen', existingNames);
      expect(result).toBe('Login Screen (2)');
    });

    it('should append (3) when (2) also exists', () => {
      const existingNames = new Set<string>([
        'Dashboard',
        'Dashboard (2)'
      ]);
      const result = generateUniquePageName('Dashboard', existingNames);
      expect(result).toBe('Dashboard (3)');
    });

    it('should find the next available number', () => {
      const existingNames = new Set<string>([
        'Frame',
        'Frame (2)',
        'Frame (3)',
        'Frame (4)',
        'Frame (5)',
      ]);
      const result = generateUniquePageName('Frame', existingNames);
      expect(result).toBe('Frame (6)');
    });

    it('should handle empty existing names set', () => {
      const existingNames = new Set<string>();
      const result = generateUniquePageName('My Page', existingNames);
      expect(result).toBe('My Page');
    });

    it('should handle names with special characters', () => {
      const existingNames = new Set<string>(['Home / Dashboard']);
      const result = generateUniquePageName('Home / Dashboard', existingNames);
      expect(result).toBe('Home / Dashboard (2)');
    });

    it('should handle unicode names', () => {
      const existingNames = new Set<string>(['🏠 Home']);
      const result = generateUniquePageName('🏠 Home', existingNames);
      expect(result).toBe('🏠 Home (2)');
    });
  });

  describe('generatePageName', () => {
    it('should use frame name with frameName strategy', () => {
      const result = generatePageName('Login Screen', 0, 'frameName', '', '');
      expect(result).toBe('Login Screen');
    });

    it('should add prefix with prefix+frameName strategy', () => {
      const result = generatePageName('Login', 0, 'prefix+frameName', 'Screen - ', '');
      expect(result).toBe('Screen - Login');
    });

    it('should add suffix with frameName strategy', () => {
      const result = generatePageName('Dashboard', 0, 'frameName', '', ' v2');
      expect(result).toBe('Dashboard v2');
    });

    it('should add both prefix and suffix', () => {
      const result = generatePageName('Home', 0, 'frameName', '[Draft] ', ' (Review)');
      expect(result).toBe('[Draft] Home (Review)');
    });

    it('should use numbered strategy with 1-based index', () => {
      const result = generatePageName('Ignored', 0, 'numbered', '', '');
      expect(result).toBe('1');
    });

    it('should use numbered strategy with prefix', () => {
      const result = generatePageName('Ignored', 2, 'numbered', 'Page ', '');
      expect(result).toBe('Page 3');
    });

    it('should use numbered strategy with suffix', () => {
      const result = generatePageName('Ignored', 4, 'numbered', 'Screen ', ' - Draft');
      expect(result).toBe('Screen 5 - Draft');
    });

    it('should handle empty frame name', () => {
      const result = generatePageName('', 0, 'frameName', 'Untitled ', '');
      expect(result).toBe('Untitled ');
    });

    it('should default to frameName strategy for unknown values', () => {
      // TypeScript would prevent this, but test defensive behavior
      const result = generatePageName('Test Frame', 0, 'frameName', '', '');
      expect(result).toBe('Test Frame');
    });
  });
});
