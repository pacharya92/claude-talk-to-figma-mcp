import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAdvancedTools } from '../../src/talk_to_figma_mcp/tools/advanced-tools';

// Mock the WebSocket layer
jest.mock('../../src/talk_to_figma_mcp/utils/websocket', () => ({
  sendCommandToFigma: jest.fn()
}));

describe("split_frames_to_pages tool integration", () => {
  let server: McpServer;
  let mockSendCommand: jest.Mock;
  let toolHandler: Function;
  let toolSchema: z.ZodObject<any>;

  beforeEach(() => {
    server = new McpServer(
      { name: 'test-server', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );

    mockSendCommand = require('../../src/talk_to_figma_mcp/utils/websocket').sendCommandToFigma;
    mockSendCommand.mockClear();

    // Set up a successful mock response
    mockSendCommand.mockResolvedValue({
      success: true,
      dryRun: false,
      pagesCreated: 3,
      framesMoved: 3,
      framesCopied: 0,
      framesSkipped: 0,
      ignoredNonFrames: 0,
      warnings: [],
      pages: [
        { pageId: 'page-1', pageName: 'Login', frameId: 'frame-1', frameName: 'Login', operation: 'moved' },
        { pageId: 'page-2', pageName: 'Dashboard', frameId: 'frame-2', frameName: 'Dashboard', operation: 'moved' },
        { pageId: 'page-3', pageName: 'Settings', frameId: 'frame-3', frameName: 'Settings', operation: 'moved' },
      ]
    });

    // Capture the tool handler and schema
    const originalTool = server.tool.bind(server);
    jest.spyOn(server, 'tool').mockImplementation((...args: any[]) => {
      if (args.length === 4) {
        const [name, description, schema, handler] = args;
        if (name === 'split_frames_to_pages') {
          toolHandler = handler;
          toolSchema = z.object(schema);
        }
      }
      return (originalTool as any)(...args);
    });

    registerAdvancedTools(server);
  });

  async function callToolWithValidation(args: any) {
    const validatedArgs = toolSchema.parse(args);
    const result = await toolHandler(validatedArgs, { meta: {} });
    return result;
  }

  describe("basic functionality", () => {
    it("should call sendCommandToFigma with default parameters", async () => {
      const response = await callToolWithValidation({});

      expect(mockSendCommand).toHaveBeenCalledTimes(1);
      const [command, payload] = mockSendCommand.mock.calls[0];

      expect(command).toBe("split_frames_to_pages");
      expect(payload).toEqual({
        source: "currentPage",
        sourcePageId: undefined,
        frameQuery: "topLevelFrames",
        nameRegex: undefined,
        mode: "move",
        pageName: {
          strategy: "frameName",
          prefix: "",
          suffix: "",
        },
        positioning: "preserve",
        normalizeMargin: { x: 64, y: 64 },
        sort: "layerOrder",
        dryRun: false,
      });
    });

    it("should return success message with page count", async () => {
      const response = await callToolWithValidation({});

      expect(response.content[0].text).toContain("Successfully created 3 page(s)");
      expect(response.content[0].text).toContain("3 frame(s) moved");
    });
  });

  describe("parameter handling", () => {
    it("should pass custom frameQuery", async () => {
      await callToolWithValidation({
        frameQuery: "selectionOnly"
      });

      const [, payload] = mockSendCommand.mock.calls[0];
      expect(payload.frameQuery).toBe("selectionOnly");
    });

    it("should pass nameRegex with byNameRegex query", async () => {
      await callToolWithValidation({
        frameQuery: "byNameRegex",
        nameRegex: "^Screen.*"
      });

      const [, payload] = mockSendCommand.mock.calls[0];
      expect(payload.frameQuery).toBe("byNameRegex");
      expect(payload.nameRegex).toBe("^Screen.*");
    });

    it("should pass copy mode", async () => {
      mockSendCommand.mockResolvedValueOnce({
        success: true,
        dryRun: false,
        pagesCreated: 2,
        framesMoved: 0,
        framesCopied: 2,
        framesSkipped: 0,
        ignoredNonFrames: 0,
        warnings: [],
        pages: [
          { pageId: 'p1', pageName: 'A', frameId: 'f1', frameName: 'A', operation: 'copied' },
          { pageId: 'p2', pageName: 'B', frameId: 'f2', frameName: 'B', operation: 'copied' },
        ]
      });

      const response = await callToolWithValidation({
        mode: "copy"
      });

      const [, payload] = mockSendCommand.mock.calls[0];
      expect(payload.mode).toBe("copy");
      expect(response.content[0].text).toContain("2 frame(s) copied");
    });

    it("should pass page name strategy with prefix and suffix", async () => {
      await callToolWithValidation({
        pageName: {
          strategy: "prefix+frameName",
          prefix: "v2 - ",
          suffix: " (Final)"
        }
      });

      const [, payload] = mockSendCommand.mock.calls[0];
      expect(payload.pageName).toEqual({
        strategy: "prefix+frameName",
        prefix: "v2 - ",
        suffix: " (Final)"
      });
    });

    it("should pass numbered strategy", async () => {
      await callToolWithValidation({
        pageName: {
          strategy: "numbered",
          prefix: "Page "
        }
      });

      const [, payload] = mockSendCommand.mock.calls[0];
      expect(payload.pageName.strategy).toBe("numbered");
      expect(payload.pageName.prefix).toBe("Page ");
    });

    it("should pass normalize positioning with custom margins", async () => {
      await callToolWithValidation({
        positioning: "normalize",
        normalizeMargin: { x: 100, y: 50 }
      });

      const [, payload] = mockSendCommand.mock.calls[0];
      expect(payload.positioning).toBe("normalize");
      expect(payload.normalizeMargin).toEqual({ x: 100, y: 50 });
    });

    it("should pass canvasReadingOrder sort", async () => {
      await callToolWithValidation({
        sort: "canvasReadingOrder"
      });

      const [, payload] = mockSendCommand.mock.calls[0];
      expect(payload.sort).toBe("canvasReadingOrder");
    });

    it("should pass source pageId", async () => {
      await callToolWithValidation({
        source: "pageId",
        sourcePageId: "123:456"
      });

      const [, payload] = mockSendCommand.mock.calls[0];
      expect(payload.source).toBe("pageId");
      expect(payload.sourcePageId).toBe("123:456");
    });
  });

  describe("dry run mode", () => {
    it("should pass dryRun flag", async () => {
      mockSendCommand.mockResolvedValueOnce({
        success: true,
        dryRun: true,
        pagesCreated: 2,
        framesMoved: 2,
        framesCopied: 0,
        framesSkipped: 0,
        ignoredNonFrames: 0,
        warnings: [],
        pages: [
          { pageId: '(dry-run)', pageName: 'Page A', frameId: 'f1', frameName: 'Frame A', operation: 'moved' },
          { pageId: '(dry-run)', pageName: 'Page B', frameId: 'f2', frameName: 'Frame B', operation: 'moved' },
        ]
      });

      const response = await callToolWithValidation({
        dryRun: true
      });

      const [, payload] = mockSendCommand.mock.calls[0];
      expect(payload.dryRun).toBe(true);
      expect(response.content[0].text).toContain("[DRY RUN]");
      expect(response.content[0].text).toContain("Would create 2 page(s)");
    });
  });

  describe("warning handling", () => {
    it("should display warnings in response", async () => {
      mockSendCommand.mockResolvedValueOnce({
        success: true,
        dryRun: false,
        pagesCreated: 1,
        framesMoved: 1,
        framesCopied: 0,
        framesSkipped: 0,
        ignoredNonFrames: 2,
        warnings: ['Page name "Dashboard" already exists, using "Dashboard (2)" instead.'],
        pages: [
          { pageId: 'p1', pageName: 'Dashboard (2)', frameId: 'f1', frameName: 'Dashboard', operation: 'moved' },
        ]
      });

      const response = await callToolWithValidation({});

      expect(response.content[0].text).toContain("Warnings:");
      expect(response.content[0].text).toContain('Dashboard (2)');
      expect(response.content[0].text).toContain("2 non-frame element(s) ignored");
    });
  });

  describe("empty results handling", () => {
    it("should handle no frames found", async () => {
      mockSendCommand.mockResolvedValueOnce({
        success: true,
        dryRun: false,
        pagesCreated: 0,
        framesMoved: 0,
        framesCopied: 0,
        framesSkipped: 0,
        ignoredNonFrames: 3,
        warnings: ['No frames found matching the query criteria.'],
        pages: []
      });

      const response = await callToolWithValidation({
        frameQuery: "selectionOnly"
      });

      expect(response.content[0].text).toContain("0 page(s)");
      expect(response.content[0].text).toContain("3 non-frame element(s) ignored");
    });
  });

  describe("error handling", () => {
    it("should return error message on failure", async () => {
      mockSendCommand.mockRejectedValueOnce(new Error("Not connected to Figma"));

      const response = await callToolWithValidation({});

      expect(response.content[0].text).toContain("Error splitting frames to pages");
      expect(response.content[0].text).toContain("Not connected to Figma");
    });

    it("should handle invalid source page ID", async () => {
      mockSendCommand.mockRejectedValueOnce(new Error("Invalid source page ID: invalid-id"));

      const response = await callToolWithValidation({
        source: "pageId",
        sourcePageId: "invalid-id"
      });

      expect(response.content[0].text).toContain("Invalid source page ID");
    });
  });

  describe("Zod validation", () => {
    it("should accept valid enum values for source", async () => {
      await callToolWithValidation({ source: "currentPage" });
      await callToolWithValidation({ source: "pageId", sourcePageId: "123:456" });

      expect(mockSendCommand).toHaveBeenCalledTimes(2);
    });

    it("should reject invalid enum value for frameQuery", async () => {
      await expect(callToolWithValidation({
        frameQuery: "invalidQuery"
      })).rejects.toThrow();

      expect(mockSendCommand).not.toHaveBeenCalled();
    });

    it("should reject invalid enum value for mode", async () => {
      await expect(callToolWithValidation({
        mode: "delete"
      })).rejects.toThrow();

      expect(mockSendCommand).not.toHaveBeenCalled();
    });

    it("should accept all valid positioning values", async () => {
      await callToolWithValidation({ positioning: "preserve" });
      mockSendCommand.mockClear();
      await callToolWithValidation({ positioning: "normalize" });

      expect(mockSendCommand).toHaveBeenCalledTimes(1);
    });

    it("should accept all valid sort values", async () => {
      await callToolWithValidation({ sort: "layerOrder" });
      mockSendCommand.mockClear();
      await callToolWithValidation({ sort: "canvasReadingOrder" });

      expect(mockSendCommand).toHaveBeenCalledTimes(1);
    });
  });
});
