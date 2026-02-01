import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAdvancedTools } from "./advanced-tools";
import { registerUIComponentTools } from "./ui-component-tools";
import { registerUtilityTools } from "./utility-tools";
import { registerNavigationTools } from "./navigation-tools";
import { registerViewportTools } from "./viewport-tools";
import { registerConnectionTools } from "./connection-tools";

/**
 * Register extended Figma tools to the MCP server.
 * These are the tools that exceed the per-server tool limit (~43)
 * when registered alongside the core tools in the primary server.
 *
 * Categories:
 * - Connection tools (join_channel — needed for independent WebSocket connection)
 * - Advanced tools (create_elements, gradients, zoom, viewport, select, etc.)
 * - UI Component tools (create_button, create_input, create_card, etc.)
 * - Utility tools (render_html, tailwind colors, check_connection, etc.)
 * - Navigation tools (find_nodes_by_name, find_nodes_by_type, get_children, etc.)
 *
 * @param server - The MCP server instance
 */
export function registerExtendedTools(server: McpServer): void {
  registerConnectionTools(server);
  registerAdvancedTools(server);
  registerUIComponentTools(server);
  registerUtilityTools(server);
  registerNavigationTools(server);
}

export {
  registerAdvancedTools,
  registerUIComponentTools,
  registerUtilityTools,
  registerNavigationTools,
  registerViewportTools,
};
