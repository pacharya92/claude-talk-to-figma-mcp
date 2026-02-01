#!/usr/bin/env node

/**
 * Navigation-only entry point for the Figma MCP Server.
 * Registers only read-only tools: search, inspection, viewport,
 * selection helpers, and connection health.
 *
 * No create/edit/delete tools are included, making this safe
 * for read-only exploration of Figma documents.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { logger } from "./utils/logger";
import { connectToFigma } from "./utils/websocket";

import { registerConnectionTools } from "./tools/connection-tools";
import { registerNavigationTools } from "./tools/navigation-tools";
import { registerViewportTools } from "./tools/viewport-tools";

const NAV_SERVER_CONFIG = {
  name: "ClaudeTalkToFigmaNav",
  description: "Claude MCP Plugin for Figma — Navigation & Inspection only (read-only)",
  version: "0.4.0",
};

async function main() {
  try {
    const server = new McpServer(NAV_SERVER_CONFIG);

    registerConnectionTools(server);
    registerNavigationTools(server);
    registerViewportTools(server);

    try {
      connectToFigma();
    } catch (error) {
      logger.warn(`Could not connect to Figma initially: ${error instanceof Error ? error.message : String(error)}`);
      logger.warn('Will try to connect when the first command is sent');
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info('FigmaMCP Nav server running on stdio');
  } catch (error) {
    logger.error(`Error starting FigmaMCP Nav server: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main().catch(error => {
  logger.error(`Error starting FigmaMCP Nav server: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
