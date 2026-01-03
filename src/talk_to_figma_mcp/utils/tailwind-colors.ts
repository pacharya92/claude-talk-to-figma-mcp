/**
 * Tailwind CSS v3 default color palette converted to Figma RGBA format (0-1 scale)
 * Reference: https://tailwindcss.com/docs/customizing-colors
 */

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

// Complete Tailwind v3 color palette
export const tailwindColors: Record<string, FigmaColor> = {
  // Slate
  'slate-50': { r: 0.973, g: 0.980, b: 0.988 },
  'slate-100': { r: 0.945, g: 0.961, b: 0.976 },
  'slate-200': { r: 0.886, g: 0.910, b: 0.941 },
  'slate-300': { r: 0.796, g: 0.835, b: 0.882 },
  'slate-400': { r: 0.580, g: 0.639, b: 0.722 },
  'slate-500': { r: 0.392, g: 0.455, b: 0.545 },
  'slate-600': { r: 0.278, g: 0.333, b: 0.412 },
  'slate-700': { r: 0.200, g: 0.255, b: 0.333 },
  'slate-800': { r: 0.118, g: 0.161, b: 0.231 },
  'slate-900': { r: 0.059, g: 0.090, b: 0.165 },
  'slate-950': { r: 0.008, g: 0.024, b: 0.090 },

  // Gray
  'gray-50': { r: 0.976, g: 0.980, b: 0.984 },
  'gray-100': { r: 0.953, g: 0.957, b: 0.965 },
  'gray-200': { r: 0.898, g: 0.906, b: 0.922 },
  'gray-300': { r: 0.820, g: 0.835, b: 0.859 },
  'gray-400': { r: 0.612, g: 0.639, b: 0.686 },
  'gray-500': { r: 0.420, g: 0.447, b: 0.502 },
  'gray-600': { r: 0.294, g: 0.333, b: 0.388 },
  'gray-700': { r: 0.216, g: 0.255, b: 0.318 },
  'gray-800': { r: 0.122, g: 0.161, b: 0.216 },
  'gray-900': { r: 0.067, g: 0.094, b: 0.153 },
  'gray-950': { r: 0.012, g: 0.027, b: 0.071 },

  // Zinc
  'zinc-50': { r: 0.980, g: 0.980, b: 0.980 },
  'zinc-100': { r: 0.953, g: 0.953, b: 0.961 },
  'zinc-200': { r: 0.894, g: 0.894, b: 0.906 },
  'zinc-300': { r: 0.831, g: 0.831, b: 0.847 },
  'zinc-400': { r: 0.631, g: 0.631, b: 0.667 },
  'zinc-500': { r: 0.443, g: 0.443, b: 0.478 },
  'zinc-600': { r: 0.322, g: 0.322, b: 0.357 },
  'zinc-700': { r: 0.247, g: 0.247, b: 0.275 },
  'zinc-800': { r: 0.153, g: 0.153, b: 0.176 },
  'zinc-900': { r: 0.094, g: 0.094, b: 0.106 },
  'zinc-950': { r: 0.035, g: 0.035, b: 0.043 },

  // Neutral
  'neutral-50': { r: 0.980, g: 0.980, b: 0.980 },
  'neutral-100': { r: 0.961, g: 0.961, b: 0.961 },
  'neutral-200': { r: 0.898, g: 0.898, b: 0.898 },
  'neutral-300': { r: 0.831, g: 0.831, b: 0.831 },
  'neutral-400': { r: 0.639, g: 0.639, b: 0.639 },
  'neutral-500': { r: 0.451, g: 0.451, b: 0.451 },
  'neutral-600': { r: 0.322, g: 0.322, b: 0.322 },
  'neutral-700': { r: 0.251, g: 0.251, b: 0.251 },
  'neutral-800': { r: 0.149, g: 0.149, b: 0.149 },
  'neutral-900': { r: 0.090, g: 0.090, b: 0.090 },
  'neutral-950': { r: 0.039, g: 0.039, b: 0.039 },

  // Red
  'red-50': { r: 0.996, g: 0.949, b: 0.949 },
  'red-100': { r: 0.996, g: 0.886, b: 0.886 },
  'red-200': { r: 0.996, g: 0.792, b: 0.792 },
  'red-300': { r: 0.988, g: 0.647, b: 0.647 },
  'red-400': { r: 0.973, g: 0.443, b: 0.443 },
  'red-500': { r: 0.937, g: 0.267, b: 0.267 },
  'red-600': { r: 0.863, g: 0.149, b: 0.149 },
  'red-700': { r: 0.725, g: 0.110, b: 0.110 },
  'red-800': { r: 0.600, g: 0.106, b: 0.106 },
  'red-900': { r: 0.498, g: 0.114, b: 0.114 },
  'red-950': { r: 0.271, g: 0.039, b: 0.039 },

  // Orange
  'orange-50': { r: 1.000, g: 0.969, b: 0.929 },
  'orange-100': { r: 1.000, g: 0.929, b: 0.835 },
  'orange-200': { r: 0.996, g: 0.843, b: 0.667 },
  'orange-300': { r: 0.992, g: 0.729, b: 0.455 },
  'orange-400': { r: 0.984, g: 0.573, b: 0.235 },
  'orange-500': { r: 0.976, g: 0.451, b: 0.086 },
  'orange-600': { r: 0.918, g: 0.345, b: 0.047 },
  'orange-700': { r: 0.761, g: 0.255, b: 0.047 },
  'orange-800': { r: 0.604, g: 0.204, b: 0.063 },
  'orange-900': { r: 0.486, g: 0.176, b: 0.071 },
  'orange-950': { r: 0.263, g: 0.078, b: 0.024 },

  // Yellow
  'yellow-50': { r: 0.996, g: 0.988, b: 0.906 },
  'yellow-100': { r: 0.996, g: 0.976, b: 0.765 },
  'yellow-200': { r: 0.996, g: 0.941, b: 0.541 },
  'yellow-300': { r: 0.992, g: 0.878, b: 0.278 },
  'yellow-400': { r: 0.980, g: 0.800, b: 0.082 },
  'yellow-500': { r: 0.918, g: 0.702, b: 0.031 },
  'yellow-600': { r: 0.792, g: 0.541, b: 0.020 },
  'yellow-700': { r: 0.631, g: 0.384, b: 0.027 },
  'yellow-800': { r: 0.522, g: 0.302, b: 0.051 },
  'yellow-900': { r: 0.443, g: 0.247, b: 0.071 },
  'yellow-950': { r: 0.259, g: 0.129, b: 0.024 },

  // Green
  'green-50': { r: 0.941, g: 0.992, b: 0.961 },
  'green-100': { r: 0.863, g: 0.988, b: 0.906 },
  'green-200': { r: 0.733, g: 0.969, b: 0.820 },
  'green-300': { r: 0.525, g: 0.937, b: 0.682 },
  'green-400': { r: 0.290, g: 0.871, b: 0.502 },
  'green-500': { r: 0.133, g: 0.773, b: 0.369 },
  'green-600': { r: 0.086, g: 0.639, b: 0.290 },
  'green-700': { r: 0.082, g: 0.502, b: 0.243 },
  'green-800': { r: 0.090, g: 0.396, b: 0.204 },
  'green-900': { r: 0.082, g: 0.325, b: 0.176 },
  'green-950': { r: 0.020, g: 0.180, b: 0.086 },

  // Teal
  'teal-50': { r: 0.941, g: 0.992, b: 0.980 },
  'teal-100': { r: 0.800, g: 0.984, b: 0.945 },
  'teal-200': { r: 0.600, g: 0.965, b: 0.894 },
  'teal-300': { r: 0.369, g: 0.918, b: 0.831 },
  'teal-400': { r: 0.176, g: 0.831, b: 0.749 },
  'teal-500': { r: 0.078, g: 0.722, b: 0.651 },
  'teal-600': { r: 0.051, g: 0.580, b: 0.533 },
  'teal-700': { r: 0.059, g: 0.463, b: 0.431 },
  'teal-800': { r: 0.067, g: 0.369, b: 0.349 },
  'teal-900': { r: 0.075, g: 0.306, b: 0.290 },
  'teal-950': { r: 0.016, g: 0.180, b: 0.176 },

  // Cyan
  'cyan-50': { r: 0.925, g: 0.996, b: 1.000 },
  'cyan-100': { r: 0.812, g: 0.980, b: 0.996 },
  'cyan-200': { r: 0.647, g: 0.953, b: 0.988 },
  'cyan-300': { r: 0.404, g: 0.910, b: 0.976 },
  'cyan-400': { r: 0.133, g: 0.827, b: 0.933 },
  'cyan-500': { r: 0.024, g: 0.714, b: 0.831 },
  'cyan-600': { r: 0.031, g: 0.569, b: 0.698 },
  'cyan-700': { r: 0.055, g: 0.455, b: 0.565 },
  'cyan-800': { r: 0.082, g: 0.369, b: 0.459 },
  'cyan-900': { r: 0.086, g: 0.306, b: 0.388 },
  'cyan-950': { r: 0.031, g: 0.200, b: 0.267 },

  // Sky
  'sky-50': { r: 0.941, g: 0.976, b: 1.000 },
  'sky-100': { r: 0.878, g: 0.949, b: 0.996 },
  'sky-200': { r: 0.729, g: 0.902, b: 0.992 },
  'sky-300': { r: 0.490, g: 0.827, b: 0.988 },
  'sky-400': { r: 0.220, g: 0.725, b: 0.969 },
  'sky-500': { r: 0.055, g: 0.647, b: 0.914 },
  'sky-600': { r: 0.008, g: 0.518, b: 0.780 },
  'sky-700': { r: 0.012, g: 0.412, b: 0.631 },
  'sky-800': { r: 0.027, g: 0.349, b: 0.522 },
  'sky-900': { r: 0.047, g: 0.290, b: 0.431 },
  'sky-950': { r: 0.031, g: 0.184, b: 0.286 },

  // Blue
  'blue-50': { r: 0.937, g: 0.965, b: 1.000 },
  'blue-100': { r: 0.859, g: 0.918, b: 0.996 },
  'blue-200': { r: 0.749, g: 0.859, b: 0.996 },
  'blue-300': { r: 0.576, g: 0.773, b: 0.992 },
  'blue-400': { r: 0.376, g: 0.647, b: 0.980 },
  'blue-500': { r: 0.231, g: 0.510, b: 0.965 },
  'blue-600': { r: 0.145, g: 0.388, b: 0.922 },
  'blue-700': { r: 0.114, g: 0.306, b: 0.847 },
  'blue-800': { r: 0.118, g: 0.251, b: 0.686 },
  'blue-900': { r: 0.118, g: 0.227, b: 0.541 },
  'blue-950': { r: 0.090, g: 0.145, b: 0.329 },

  // Indigo
  'indigo-50': { r: 0.933, g: 0.949, b: 1.000 },
  'indigo-100': { r: 0.878, g: 0.906, b: 1.000 },
  'indigo-200': { r: 0.780, g: 0.824, b: 0.996 },
  'indigo-300': { r: 0.647, g: 0.706, b: 0.988 },
  'indigo-400': { r: 0.506, g: 0.549, b: 0.973 },
  'indigo-500': { r: 0.388, g: 0.400, b: 0.945 },
  'indigo-600': { r: 0.310, g: 0.275, b: 0.898 },
  'indigo-700': { r: 0.263, g: 0.220, b: 0.792 },
  'indigo-800': { r: 0.216, g: 0.188, b: 0.639 },
  'indigo-900': { r: 0.192, g: 0.180, b: 0.506 },
  'indigo-950': { r: 0.118, g: 0.106, b: 0.294 },

  // Violet
  'violet-50': { r: 0.961, g: 0.953, b: 1.000 },
  'violet-100': { r: 0.929, g: 0.914, b: 0.996 },
  'violet-200': { r: 0.867, g: 0.839, b: 0.996 },
  'violet-300': { r: 0.769, g: 0.710, b: 0.992 },
  'violet-400': { r: 0.655, g: 0.545, b: 0.980 },
  'violet-500': { r: 0.545, g: 0.361, b: 0.961 },
  'violet-600': { r: 0.486, g: 0.227, b: 0.929 },
  'violet-700': { r: 0.427, g: 0.157, b: 0.851 },
  'violet-800': { r: 0.357, g: 0.129, b: 0.714 },
  'violet-900': { r: 0.298, g: 0.114, b: 0.584 },
  'violet-950': { r: 0.180, g: 0.063, b: 0.400 },

  // Purple
  'purple-50': { r: 0.980, g: 0.961, b: 1.000 },
  'purple-100': { r: 0.953, g: 0.910, b: 0.996 },
  'purple-200': { r: 0.914, g: 0.835, b: 0.996 },
  'purple-300': { r: 0.847, g: 0.706, b: 0.992 },
  'purple-400': { r: 0.753, g: 0.518, b: 0.988 },
  'purple-500': { r: 0.659, g: 0.333, b: 0.969 },
  'purple-600': { r: 0.576, g: 0.200, b: 0.918 },
  'purple-700': { r: 0.494, g: 0.133, b: 0.808 },
  'purple-800': { r: 0.420, g: 0.129, b: 0.659 },
  'purple-900': { r: 0.345, g: 0.110, b: 0.529 },
  'purple-950': { r: 0.235, g: 0.027, b: 0.392 },

  // Fuchsia
  'fuchsia-50': { r: 0.992, g: 0.957, b: 1.000 },
  'fuchsia-100': { r: 0.980, g: 0.906, b: 0.996 },
  'fuchsia-200': { r: 0.961, g: 0.816, b: 0.992 },
  'fuchsia-300': { r: 0.941, g: 0.675, b: 0.984 },
  'fuchsia-400': { r: 0.910, g: 0.475, b: 0.969 },
  'fuchsia-500': { r: 0.851, g: 0.275, b: 0.937 },
  'fuchsia-600': { r: 0.753, g: 0.149, b: 0.827 },
  'fuchsia-700': { r: 0.635, g: 0.110, b: 0.682 },
  'fuchsia-800': { r: 0.525, g: 0.102, b: 0.557 },
  'fuchsia-900': { r: 0.439, g: 0.102, b: 0.455 },
  'fuchsia-950': { r: 0.290, g: 0.016, b: 0.306 },

  // Pink
  'pink-50': { r: 0.992, g: 0.949, b: 0.973 },
  'pink-100': { r: 0.988, g: 0.902, b: 0.937 },
  'pink-200': { r: 0.984, g: 0.812, b: 0.886 },
  'pink-300': { r: 0.976, g: 0.651, b: 0.788 },
  'pink-400': { r: 0.957, g: 0.447, b: 0.651 },
  'pink-500': { r: 0.925, g: 0.282, b: 0.529 },
  'pink-600': { r: 0.859, g: 0.153, b: 0.412 },
  'pink-700': { r: 0.745, g: 0.094, b: 0.322 },
  'pink-800': { r: 0.616, g: 0.090, b: 0.271 },
  'pink-900': { r: 0.514, g: 0.094, b: 0.235 },
  'pink-950': { r: 0.310, g: 0.024, b: 0.118 },

  // Rose
  'rose-50': { r: 1.000, g: 0.945, b: 0.949 },
  'rose-100': { r: 1.000, g: 0.894, b: 0.906 },
  'rose-200': { r: 0.996, g: 0.804, b: 0.827 },
  'rose-300': { r: 0.992, g: 0.643, b: 0.686 },
  'rose-400': { r: 0.984, g: 0.443, b: 0.522 },
  'rose-500': { r: 0.957, g: 0.247, b: 0.369 },
  'rose-600': { r: 0.882, g: 0.114, b: 0.282 },
  'rose-700': { r: 0.745, g: 0.071, b: 0.235 },
  'rose-800': { r: 0.624, g: 0.071, b: 0.220 },
  'rose-900': { r: 0.533, g: 0.075, b: 0.204 },
  'rose-950': { r: 0.298, g: 0.020, b: 0.090 },

  // Special colors
  'white': { r: 1, g: 1, b: 1 },
  'black': { r: 0, g: 0, b: 0 },
  'transparent': { r: 0, g: 0, b: 0, a: 0 },
};

/**
 * Parse a Tailwind color class and return the Figma color value
 * Supports formats like: bg-gray-50, text-indigo-600, border-gray-300, ring-blue-500, etc.
 *
 * @param className - The Tailwind class name (e.g., 'bg-gray-50', 'text-indigo-600', 'gray-500')
 * @returns The Figma color object or null if not found
 *
 * @example
 * tailwindToFigma('bg-gray-50')     // { r: 0.976, g: 0.98, b: 0.984 }
 * tailwindToFigma('text-indigo-600') // { r: 0.31, g: 0.275, b: 0.898 }
 * tailwindToFigma('gray-500')        // { r: 0.42, g: 0.447, b: 0.502 }
 */
export function tailwindToFigma(className: string): FigmaColor | null {
  // Strip common Tailwind prefixes
  const prefixes = [
    'bg-', 'text-', 'border-', 'ring-', 'divide-', 'placeholder-',
    'from-', 'via-', 'to-', 'accent-', 'caret-', 'fill-', 'stroke-',
    'outline-', 'decoration-', 'shadow-'
  ];

  let colorName = className.toLowerCase().trim();

  // Remove any prefix
  for (const prefix of prefixes) {
    if (colorName.startsWith(prefix)) {
      colorName = colorName.slice(prefix.length);
      break;
    }
  }

  // Look up the color
  return tailwindColors[colorName] || null;
}

/**
 * Convert a hex color string to Figma color format
 *
 * @param hex - Hex color string (e.g., '#3869EB', '3869EB', '#FFF')
 * @returns The Figma color object
 */
export function hexToFigma(hex: string): FigmaColor {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Expand shorthand (e.g., 'FFF' -> 'FFFFFF')
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  return { r, g, b };
}

/**
 * Convert Figma color to hex string
 *
 * @param color - Figma color object
 * @returns Hex color string (e.g., '#3869EB')
 */
export function figmaToHex(color: FigmaColor): string {
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

/**
 * Get all available Tailwind color names
 */
export function getAvailableColors(): string[] {
  return Object.keys(tailwindColors);
}

/**
 * Search for colors by partial name
 *
 * @param query - Partial color name to search for
 * @returns Array of matching color names
 */
export function searchColors(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  return Object.keys(tailwindColors).filter(name =>
    name.includes(lowerQuery)
  );
}
