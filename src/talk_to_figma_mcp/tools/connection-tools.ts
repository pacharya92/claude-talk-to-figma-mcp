import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { joinChannel, getConnectionHealth, sendCommandToFigma } from "../utils/websocket.js";

/**
 * Register connection-related tools (join_channel, check_connection) to the MCP server.
 * Shared across primary, extended, and nav servers.
 * @param server - The MCP server instance
 */
export function registerConnectionTools(server: McpServer): void {
  // Join Channel Tool
  server.tool(
    "join_channel",
    "Join a specific channel to communicate with Figma",
    {
      channel: z.string().describe("The name of the channel to join").default(""),
    },
    async ({ channel }) => {
      try {
        if (!channel) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Please provide a channel name to join:",
              },
            ],
          };
        }

        await joinChannel(channel);

        return {
          content: [
            {
              type: "text" as const,
              text: `Successfully joined channel: ${channel}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error joining channel: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // Check Connection Health Tool
  server.tool(
    "check_connection",
    "Check the health of the connection to Figma. Use this to diagnose issues when operations are failing.",
    {},
    async () => {
      const health = getConnectionHealth();

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
