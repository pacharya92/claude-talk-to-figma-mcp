/**
 * Utilities for the split_frames_to_pages tool
 * These are pure functions for sorting and name deduplication
 */

export interface FramePosition {
  id: string;
  name: string;
  x: number;
  y: number;
}

/**
 * Sort frames by canvas reading order (top-to-bottom, left-to-right)
 * Frames within 10px of the same y are considered on the same "row"
 * @param frames - Array of frame positions
 * @returns Sorted array of frame positions
 */
export function sortFramesByCanvasReadingOrder<T extends FramePosition>(frames: T[]): T[] {
  return [...frames].sort((a, b) => {
    // First compare by y position (top to bottom)
    // Use a threshold of 10px to consider frames on the same "row"
    if (Math.abs(a.y - b.y) > 10) {
      return a.y - b.y;
    }
    // If roughly same y, compare by x (left to right)
    return a.x - b.x;
  });
}

/**
 * Generate a unique page name by appending (2), (3), etc. if name already exists
 * @param baseName - The desired page name
 * @param existingNames - Set of existing page names
 * @returns A unique page name
 */
export function generateUniquePageName(baseName: string, existingNames: Set<string>): string {
  if (!existingNames.has(baseName)) {
    return baseName;
  }

  let counter = 2;
  let uniqueName = `${baseName} (${counter})`;

  while (existingNames.has(uniqueName)) {
    counter++;
    uniqueName = `${baseName} (${counter})`;
  }

  return uniqueName;
}

/**
 * Generate a page name based on strategy and frame info
 * @param frameName - The frame's name
 * @param index - The frame's index (0-based)
 * @param strategy - The naming strategy
 * @param prefix - Optional prefix
 * @param suffix - Optional suffix
 * @returns The generated page name
 */
export function generatePageName(
  frameName: string,
  index: number,
  strategy: 'frameName' | 'prefix+frameName' | 'numbered',
  prefix: string = '',
  suffix: string = ''
): string {
  switch (strategy) {
    case 'numbered':
      return `${prefix}${index + 1}${suffix}`;
    case 'prefix+frameName':
    case 'frameName':
    default:
      return `${prefix}${frameName}${suffix}`;
  }
}
