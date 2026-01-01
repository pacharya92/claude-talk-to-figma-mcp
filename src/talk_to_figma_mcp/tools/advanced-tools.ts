import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendCommandToFigma } from "../utils/websocket";

// Shared color schema
const colorSchema = z.object({
  r: z.number().min(0).max(1).describe("Red component (0-1)"),
  g: z.number().min(0).max(1).describe("Green component (0-1)"),
  b: z.number().min(0).max(1).describe("Blue component (0-1)"),
  a: z.number().min(0).max(1).optional().describe("Alpha component (0-1)"),
});

// Element schema for batch operations
const elementSchema = z.object({
  type: z.enum(["rectangle", "frame", "ellipse", "text", "line"]).describe("Element type"),
  x: z.number().describe("X position"),
  y: z.number().describe("Y position"),
  width: z.number().optional().describe("Width (not needed for text/line)"),
  height: z.number().optional().describe("Height (not needed for text/line)"),
  name: z.string().optional().describe("Element name"),
  parentId: z.string().optional().describe("Parent node ID"),
  fillColor: colorSchema.optional().describe("Fill color"),
  strokeColor: colorSchema.optional().describe("Stroke color"),
  strokeWeight: z.number().optional().describe("Stroke weight"),
  cornerRadius: z.number().optional().describe("Corner radius (for rectangles/frames)"),
  // Text-specific
  text: z.string().optional().describe("Text content (for text elements)"),
  fontSize: z.number().optional().describe("Font size (for text elements)"),
  fontWeight: z.number().optional().describe("Font weight (for text elements)"),
  // Line-specific
  x2: z.number().optional().describe("End X position (for lines)"),
  y2: z.number().optional().describe("End Y position (for lines)"),
  strokeCap: z.enum(["NONE", "ROUND", "SQUARE", "ARROW_LINES", "ARROW_EQUILATERAL"]).optional().describe("Stroke cap style (for lines)"),
});

// Gradient stop schema
const gradientStopSchema = z.object({
  position: z.number().min(0).max(1).describe("Position along gradient (0-1)"),
  color: colorSchema.describe("Color at this stop"),
});

/**
 * Register advanced tools to the MCP server
 * This module contains batch operations, lines, gradients, layer ordering, and viewport controls
 * @param server - The MCP server instance
 */
export function registerAdvancedTools(server: McpServer): void {

  // ============================================
  // BATCH OPERATIONS
  // ============================================

  server.tool(
    "create_elements",
    "Create multiple elements in Figma in a single batch operation. Much faster than creating elements one by one. Use nestInFirstFrame to automatically nest all elements inside the first frame.",
    {
      elements: z.array(elementSchema).min(1).max(100).describe("Array of elements to create (max 100)"),
      nestInFirstFrame: z.boolean().optional().describe("If true and first element is a frame, all subsequent elements are created as children of that frame (recommended for building components)"),
      groupResult: z.boolean().optional().describe("If true, group all created elements together after creation"),
    },
    async ({ elements, nestInFirstFrame, groupResult }) => {
      try {
        const result = await sendCommandToFigma("create_elements", {
          elements,
          nestInFirstFrame: nestInFirstFrame ?? false,
          groupResult: groupResult ?? false
        });
        const typedResult = result as {
          created: Array<{ id: string; name: string; type: string }>;
          failed: Array<{ index: number; error: string }>;
          totalCreated: number;
          totalFailed: number;
          groupId?: string;
          parentFrameId?: string;
        };

        let message = `Created ${typedResult.totalCreated} elements successfully.`;
        if (typedResult.totalFailed > 0) {
          message += ` ${typedResult.totalFailed} failed.`;
        }
        if (typedResult.parentFrameId) {
          message += ` All elements nested in frame ${typedResult.parentFrameId}.`;
        }
        if (typedResult.groupId) {
          message += ` Elements grouped with ID: ${typedResult.groupId}.`;
        }

        const createdList = typedResult.created
          .map(el => `- ${el.name} (${el.type}): ${el.id}`)
          .join('\n');

        return {
          content: [
            {
              type: "text",
              text: `${message}\n\nCreated elements:\n${createdList}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error in batch create: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // LINE TOOL
  // ============================================

  server.tool(
    "create_line",
    "Create a line or arrow in Figma",
    {
      x1: z.number().describe("Start X position"),
      y1: z.number().describe("Start Y position"),
      x2: z.number().describe("End X position"),
      y2: z.number().describe("End Y position"),
      name: z.string().optional().describe("Name for the line"),
      parentId: z.string().optional().describe("Parent node ID to append to"),
      strokeColor: colorSchema.optional().describe("Stroke color (defaults to black)"),
      strokeWeight: z.number().positive().optional().describe("Stroke weight (default: 1)"),
      strokeCap: z.enum(["NONE", "ROUND", "SQUARE", "ARROW_LINES", "ARROW_EQUILATERAL"]).optional()
        .describe("Stroke cap style. Use ARROW_LINES or ARROW_EQUILATERAL for arrows"),
    },
    async ({ x1, y1, x2, y2, name, parentId, strokeColor, strokeWeight, strokeCap }) => {
      try {
        const result = await sendCommandToFigma("create_line", {
          x1,
          y1,
          x2,
          y2,
          name: name || "Line",
          parentId,
          strokeColor: strokeColor || { r: 0, g: 0, b: 0, a: 1 },
          strokeWeight: strokeWeight || 1,
          strokeCap: strokeCap || "NONE",
        });

        const typedResult = result as { id: string; name: string };
        return {
          content: [
            {
              type: "text",
              text: `Created line "${typedResult.name}" with ID: ${typedResult.id} from (${x1}, ${y1}) to (${x2}, ${y2})`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating line: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // GRADIENT TOOLS
  // ============================================

  server.tool(
    "set_gradient_fill",
    "Set a gradient fill on a node in Figma",
    {
      nodeId: z.string().describe("The ID of the node to modify"),
      gradientType: z.enum(["LINEAR", "RADIAL", "ANGULAR", "DIAMOND"]).describe("Type of gradient"),
      stops: z.array(gradientStopSchema).min(2).describe("Gradient color stops (minimum 2)"),
      angle: z.number().optional().describe("Angle in degrees for linear gradient (default: 0, which is left to right)"),
    },
    async ({ nodeId, gradientType, stops, angle }) => {
      try {
        const result = await sendCommandToFigma("set_gradient_fill", {
          nodeId,
          gradientType,
          stops,
          angle: angle || 0,
        });

        const typedResult = result as { name: string };
        return {
          content: [
            {
              type: "text",
              text: `Set ${gradientType} gradient on "${typedResult.name}" with ${stops.length} color stops`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error setting gradient: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // LAYER ORDERING TOOLS
  // ============================================

  server.tool(
    "set_layer_order",
    "Change the layer order of a node in Figma (bring to front, send to back, etc.)",
    {
      nodeId: z.string().describe("The ID of the node to reorder"),
      order: z.enum(["FRONT", "BACK", "FORWARD", "BACKWARD"]).describe(
        "FRONT: bring to top, BACK: send to bottom, FORWARD: move up one, BACKWARD: move down one"
      ),
    },
    async ({ nodeId, order }) => {
      try {
        const result = await sendCommandToFigma("set_layer_order", {
          nodeId,
          order,
        });

        const typedResult = result as { name: string; newIndex: number };
        const orderDescription = {
          FRONT: "brought to front",
          BACK: "sent to back",
          FORWARD: "moved forward",
          BACKWARD: "moved backward",
        };

        return {
          content: [
            {
              type: "text",
              text: `Node "${typedResult.name}" ${orderDescription[order]} (new index: ${typedResult.newIndex})`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error changing layer order: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // VIEWPORT TOOLS
  // ============================================

  server.tool(
    "zoom_to_node",
    "Zoom the viewport to focus on a specific node",
    {
      nodeId: z.string().describe("The ID of the node to zoom to"),
    },
    async ({ nodeId }) => {
      try {
        const result = await sendCommandToFigma("zoom_to_node", { nodeId });

        const typedResult = result as { name: string; zoom: number };
        return {
          content: [
            {
              type: "text",
              text: `Zoomed to node "${typedResult.name}" at ${Math.round(typedResult.zoom * 100)}% zoom`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error zooming to node: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "zoom_to_fit",
    "Zoom the viewport to fit all content or selected nodes",
    {
      nodeIds: z.array(z.string()).optional().describe("Optional array of node IDs to fit. If not provided, fits all content on the page."),
    },
    async ({ nodeIds }) => {
      try {
        const result = await sendCommandToFigma("zoom_to_fit", { nodeIds });

        const typedResult = result as { zoom: number; nodeCount: number };
        return {
          content: [
            {
              type: "text",
              text: `Viewport fitted to ${typedResult.nodeCount} node(s) at ${Math.round(typedResult.zoom * 100)}% zoom`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fitting viewport: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "set_viewport",
    "Set the viewport position and zoom level",
    {
      x: z.number().describe("X position of the viewport center"),
      y: z.number().describe("Y position of the viewport center"),
      zoom: z.number().min(0.01).max(256).describe("Zoom level (0.01 to 256, where 1 = 100%)"),
    },
    async ({ x, y, zoom }) => {
      try {
        const result = await sendCommandToFigma("set_viewport", { x, y, zoom });

        const typedResult = result as { x: number; y: number; zoom: number };
        return {
          content: [
            {
              type: "text",
              text: `Viewport set to position (${typedResult.x}, ${typedResult.y}) at ${Math.round(typedResult.zoom * 100)}% zoom`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error setting viewport: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "get_viewport",
    "Get the current viewport position and zoom level",
    {},
    async () => {
      try {
        const result = await sendCommandToFigma("get_viewport", {});

        const typedResult = result as {
          x: number;
          y: number;
          zoom: number;
          width: number;
          height: number;
        };

        return {
          content: [
            {
              type: "text",
              text: `Current viewport: position (${Math.round(typedResult.x)}, ${Math.round(typedResult.y)}), zoom ${Math.round(typedResult.zoom * 100)}%, size ${Math.round(typedResult.width)}x${Math.round(typedResult.height)}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting viewport: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // SELECTION CONTROL (Bonus - helps verify work)
  // ============================================

  server.tool(
    "select_nodes",
    "Select nodes in Figma by their IDs",
    {
      nodeIds: z.array(z.string()).min(1).describe("Array of node IDs to select"),
    },
    async ({ nodeIds }) => {
      try {
        const result = await sendCommandToFigma("select_nodes", { nodeIds });

        const typedResult = result as {
          selectedCount: number;
          nodes: Array<{ id: string; name: string }>;
        };

        const nodeList = typedResult.nodes
          .map(n => `- ${n.name} (${n.id})`)
          .join('\n');

        return {
          content: [
            {
              type: "text",
              text: `Selected ${typedResult.selectedCount} node(s):\n${nodeList}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error selecting nodes: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );
}
