import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  tailwindToFigma,
  hexToFigma,
  figmaToHex,
  searchColors,
  getAvailableColors,
  FigmaColor
} from "../utils/tailwind-colors";
import { getConnectionHealth, sendCommandToFigma } from "../utils/websocket";

/**
 * Register utility tools for color conversion and helpers
 * @param server - The MCP server instance
 */
export function registerUtilityTools(server: McpServer): void {
  // Get Tailwind Color Tool
  server.tool(
    "get_tailwind_color",
    "Convert a Tailwind CSS color class to Figma RGBA values (0-1 scale). Supports all Tailwind v3 colors including slate, gray, zinc, neutral, red, orange, yellow, green, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, and rose.",
    {
      className: z
        .string()
        .describe(
          "Tailwind class like 'bg-gray-50', 'text-indigo-600', 'border-gray-300', or just the color name like 'gray-500'"
        ),
    },
    async ({ className }) => {
      const color = tailwindToFigma(className);

      if (!color) {
        // Try to find similar colors
        const suggestions = searchColors(className.replace(/^(bg-|text-|border-)/, ''));
        const suggestionText = suggestions.length > 0
          ? ` Did you mean: ${suggestions.slice(0, 5).join(', ')}?`
          : '';

        return {
          content: [
            {
              type: "text",
              text: `Unknown Tailwind color: "${className}".${suggestionText}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(color, null, 2),
          },
        ],
      };
    }
  );

  // Convert Hex to Figma Color Tool
  server.tool(
    "hex_to_figma_color",
    "Convert a hex color code to Figma RGBA values (0-1 scale)",
    {
      hex: z
        .string()
        .describe("Hex color code like '#3869EB', '3869EB', or '#FFF'"),
    },
    async ({ hex }) => {
      try {
        const color = hexToFigma(hex);
        const hexNormalized = figmaToHex(color);

        return {
          content: [
            {
              type: "text",
              text: `${hexNormalized} = ${JSON.stringify(color)}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Invalid hex color: "${hex}". Use format like '#3869EB' or 'FFF'.`,
            },
          ],
        };
      }
    }
  );

  // Search Tailwind Colors Tool
  server.tool(
    "search_tailwind_colors",
    "Search for Tailwind colors by name. Useful for finding available shades of a color.",
    {
      query: z
        .string()
        .describe("Color name to search for, e.g., 'indigo', 'gray', 'blue-5'"),
    },
    async ({ query }) => {
      const matches = searchColors(query);

      if (matches.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No colors found matching "${query}".`,
            },
          ],
        };
      }

      // Group by color family
      const grouped: Record<string, FigmaColor[]> = {};
      for (const colorName of matches.slice(0, 20)) {
        const color = tailwindToFigma(colorName);
        if (color) {
          const family = colorName.split('-')[0];
          if (!grouped[family]) grouped[family] = [];
          grouped[family].push({ ...color, name: colorName } as any);
        }
      }

      // Format output
      const output = matches.slice(0, 20).map(name => {
        const color = tailwindToFigma(name);
        return `${name}: { r: ${color!.r.toFixed(3)}, g: ${color!.g.toFixed(3)}, b: ${color!.b.toFixed(3)} }`;
      }).join('\n');

      return {
        content: [
          {
            type: "text",
            text: `Found ${matches.length} colors matching "${query}":\n\n${output}${matches.length > 20 ? `\n\n... and ${matches.length - 20} more` : ''}`,
          },
        ],
      };
    }
  );

  // Check Connection Health Tool
  server.tool(
    "check_connection",
    "Check the health of the connection to Figma. Use this to diagnose issues when operations are failing.",
    {},
    async () => {
      const health = getConnectionHealth();

      // Format the health status
      const statusEmoji = health.status === 'healthy' ? '✅' :
                          health.status === 'degraded' ? '⚠️' : '❌';

      let output = `${statusEmoji} Connection Status: ${health.status.toUpperCase()}\n\n`;
      output += `${health.message}\n\n`;
      output += `Details:\n`;
      output += `- Connected: ${health.connected}\n`;
      output += `- Channel: ${health.channel || 'None'}\n`;
      output += `- Pending requests: ${health.pendingRequests}\n`;
      output += `- Consecutive failures: ${health.consecutiveFailures}\n`;

      if (health.lastSuccessfulCommand) {
        const secondsAgo = Math.round((Date.now() - health.lastSuccessfulCommand) / 1000);
        output += `- Last successful command: ${secondsAgo}s ago\n`;
      }

      if (health.lastFailedCommand) {
        const secondsAgo = Math.round((Date.now() - health.lastFailedCommand) / 1000);
        output += `- Last failed command: ${secondsAgo}s ago\n`;
      }

      // If degraded, try a quick health check
      if (health.status === 'degraded' && health.connected && health.channel) {
        output += '\nAttempting health check...\n';
        try {
          await sendCommandToFigma("get_document_info", {}, 5000);
          output += '✅ Health check passed! Connection seems to be working now.';
        } catch (error) {
          output += `❌ Health check failed: ${error instanceof Error ? error.message : String(error)}\n`;
          output += '\nRecommendation: Restart the Figma plugin and use join_channel with a new channel ID.';
        }
      }

      return {
        content: [
          {
            type: "text",
            text: output,
          },
        ],
      };
    }
  );
}
