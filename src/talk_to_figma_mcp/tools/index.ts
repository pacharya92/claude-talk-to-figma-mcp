import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDocumentTools } from "./document-tools";
import { registerCreationTools } from "./creation-tools";
import { registerModificationTools } from "./modification-tools";
import { registerTextTools } from "./text-tools";
import { registerComponentTools } from "./component-tools";
import { registerConnectionTools } from "./connection-tools";

/**
 * Register core Figma tools to the MCP server.
 * Only the core categories are registered here to stay within
 * the per-server tool limit (~43 tools).
 *
 * Extended tools (advanced, ui-component, utility, navigation)
 * are registered in a separate server via index-extended.ts.
 *
 * @param server - The MCP server instance
 */
export function registerTools(server: McpServer): void {
  registerConnectionTools(server);
  registerDocumentTools(server);
  registerCreationTools(server);
  registerModificationTools(server);
  registerTextTools(server);
  registerComponentTools(server);
}

export {
  registerConnectionTools,
  registerDocumentTools,
  registerCreationTools,
  registerModificationTools,
  registerTextTools,
  registerComponentTools,
};