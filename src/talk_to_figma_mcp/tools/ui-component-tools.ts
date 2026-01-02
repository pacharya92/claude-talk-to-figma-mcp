import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendCommandToFigma } from "../utils/websocket";

/**
 * Design tokens for consistent UI creation
 * These are example styles that can be customized
 */
const DESIGN_TOKENS = {
  colors: {
    primary: { r: 0.22, g: 0.42, b: 0.92, a: 1 },
    primaryDark: { r: 0.16, g: 0.32, b: 0.75, a: 1 },
    secondary: { r: 0.96, g: 0.96, b: 0.96, a: 1 },
    white: { r: 1, g: 1, b: 1, a: 1 },
    black: { r: 0, g: 0, b: 0, a: 1 },
    gray100: { r: 0.96, g: 0.96, b: 0.96, a: 1 },
    gray200: { r: 0.90, g: 0.90, b: 0.90, a: 1 },
    gray300: { r: 0.80, g: 0.80, b: 0.80, a: 1 },
    gray500: { r: 0.60, g: 0.60, b: 0.60, a: 1 },
    gray700: { r: 0.40, g: 0.40, b: 0.40, a: 1 },
    gray900: { r: 0.13, g: 0.13, b: 0.13, a: 1 },
    success: { r: 0.13, g: 0.72, b: 0.45, a: 1 },
    warning: { r: 0.95, g: 0.68, b: 0.14, a: 1 },
    error: { r: 0.91, g: 0.27, b: 0.27, a: 1 },
    info: { r: 0.20, g: 0.60, b: 0.86, a: 1 },
    transparent: { r: 0, g: 0, b: 0, a: 0 },
  },
  sizes: {
    button: {
      sm: { height: 32, fontSize: 12, paddingX: 12, paddingY: 6 },
      md: { height: 40, fontSize: 14, paddingX: 16, paddingY: 10 },
      lg: { height: 48, fontSize: 16, paddingX: 24, paddingY: 14 },
    },
    input: {
      height: 44,
      fontSize: 14,
      paddingX: 12,
      paddingY: 10,
    },
    avatar: {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
    },
    badge: {
      height: 24,
      fontSize: 12,
      paddingX: 8,
      paddingY: 4,
    },
    icon: 24,
  },
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

/**
 * Register UI component tools to the MCP server
 * These are high-level tools that create complete UI components
 * @param server - The MCP server instance
 */
export function registerUIComponentTools(server: McpServer): void {

  // ============================================
  // CREATE BUTTON
  // ============================================
  server.tool(
    "create_button",
    "Create a complete button with text, proper padding, and styling. Returns a ready-to-use button component.",
    {
      x: z.number().describe("X position"),
      y: z.number().describe("Y position"),
      text: z.string().describe("Button text"),
      variant: z.enum(["primary", "secondary", "outline", "ghost", "danger"]).optional()
        .describe("Button variant (default: primary)"),
      size: z.enum(["sm", "md", "lg"]).optional().describe("Button size (default: md)"),
      width: z.number().optional().describe("Fixed width (optional, auto-sizes to content by default)"),
      parentId: z.string().optional().describe("Optional parent node ID"),
      name: z.string().optional().describe("Optional name for the button"),
    },
    async ({ x, y, text, variant = "primary", size = "md", width, parentId, name }) => {
      try {
        const sizeConfig = DESIGN_TOKENS.sizes.button[size];

        // Determine colors based on variant
        let fillColor, textColor, strokeColor, strokeWeight = 0;

        switch (variant) {
          case "primary":
            fillColor = DESIGN_TOKENS.colors.primary;
            textColor = DESIGN_TOKENS.colors.white;
            break;
          case "secondary":
            fillColor = DESIGN_TOKENS.colors.secondary;
            textColor = DESIGN_TOKENS.colors.gray900;
            break;
          case "outline":
            fillColor = DESIGN_TOKENS.colors.transparent;
            textColor = DESIGN_TOKENS.colors.primary;
            strokeColor = DESIGN_TOKENS.colors.primary;
            strokeWeight = 1;
            break;
          case "ghost":
            fillColor = DESIGN_TOKENS.colors.transparent;
            textColor = DESIGN_TOKENS.colors.primary;
            break;
          case "danger":
            fillColor = DESIGN_TOKENS.colors.error;
            textColor = DESIGN_TOKENS.colors.white;
            break;
          default:
            fillColor = DESIGN_TOKENS.colors.primary;
            textColor = DESIGN_TOKENS.colors.white;
        }

        const result = await sendCommandToFigma("create_button", {
          x,
          y,
          text,
          width,
          height: sizeConfig.height,
          fontSize: sizeConfig.fontSize,
          fontWeight: 600,
          paddingX: sizeConfig.paddingX,
          paddingY: sizeConfig.paddingY,
          fillColor,
          textColor,
          strokeColor,
          strokeWeight,
          cornerRadius: DESIGN_TOKENS.borderRadius.md,
          parentId,
          name: name || `Button - ${text}`,
        });

        const typedResult = result as { id: string; name: string };
        return {
          content: [
            {
              type: "text",
              text: `Created ${variant} button "${text}" with ID: ${typedResult.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating button: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // CREATE INPUT
  // ============================================
  server.tool(
    "create_input",
    "Create a form input field with optional label and placeholder text.",
    {
      x: z.number().describe("X position"),
      y: z.number().describe("Y position"),
      label: z.string().optional().describe("Label text above the input"),
      placeholder: z.string().optional().describe("Placeholder text inside the input"),
      width: z.number().optional().describe("Width of the input (default: 280)"),
      state: z.enum(["default", "focused", "error", "disabled"]).optional()
        .describe("Input state (default: default)"),
      errorMessage: z.string().optional().describe("Error message to show when state is error"),
      parentId: z.string().optional().describe("Optional parent node ID"),
      name: z.string().optional().describe("Optional name for the input"),
    },
    async ({ x, y, label, placeholder, width = 280, state = "default", errorMessage, parentId, name }) => {
      try {
        const inputConfig = DESIGN_TOKENS.sizes.input;

        // Determine colors based on state
        let strokeColor, backgroundColor, textColor, labelColor;

        switch (state) {
          case "focused":
            strokeColor = DESIGN_TOKENS.colors.primary;
            backgroundColor = DESIGN_TOKENS.colors.white;
            textColor = DESIGN_TOKENS.colors.gray900;
            labelColor = DESIGN_TOKENS.colors.primary;
            break;
          case "error":
            strokeColor = DESIGN_TOKENS.colors.error;
            backgroundColor = DESIGN_TOKENS.colors.white;
            textColor = DESIGN_TOKENS.colors.gray900;
            labelColor = DESIGN_TOKENS.colors.error;
            break;
          case "disabled":
            strokeColor = DESIGN_TOKENS.colors.gray200;
            backgroundColor = DESIGN_TOKENS.colors.gray100;
            textColor = DESIGN_TOKENS.colors.gray500;
            labelColor = DESIGN_TOKENS.colors.gray500;
            break;
          default:
            strokeColor = DESIGN_TOKENS.colors.gray300;
            backgroundColor = DESIGN_TOKENS.colors.white;
            textColor = DESIGN_TOKENS.colors.gray900;
            labelColor = DESIGN_TOKENS.colors.gray700;
        }

        const result = await sendCommandToFigma("create_input", {
          x,
          y,
          label,
          placeholder: placeholder || "",
          width,
          height: inputConfig.height,
          fontSize: inputConfig.fontSize,
          paddingX: inputConfig.paddingX,
          paddingY: inputConfig.paddingY,
          strokeColor,
          backgroundColor,
          textColor,
          labelColor,
          placeholderColor: DESIGN_TOKENS.colors.gray500,
          cornerRadius: DESIGN_TOKENS.borderRadius.md,
          errorMessage: state === "error" ? errorMessage : undefined,
          errorColor: DESIGN_TOKENS.colors.error,
          parentId,
          name: name || (label ? `Input - ${label}` : "Input"),
        });

        const typedResult = result as { id: string; name: string };
        return {
          content: [
            {
              type: "text",
              text: `Created input field${label ? ` "${label}"` : ""} with ID: ${typedResult.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating input: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // CREATE CARD
  // ============================================
  server.tool(
    "create_card",
    "Create a card container with padding, border-radius, and optional shadow. Use as a container for other elements.",
    {
      x: z.number().describe("X position"),
      y: z.number().describe("Y position"),
      width: z.number().optional().describe("Width of the card (default: 320)"),
      height: z.number().optional().describe("Height of the card (default: 200)"),
      padding: z.number().optional().describe("Padding inside the card (default: 24)"),
      hasShadow: z.boolean().optional().describe("Whether to add a drop shadow (default: true)"),
      hasStroke: z.boolean().optional().describe("Whether to add a border stroke (default: false)"),
      backgroundColor: z.object({
        r: z.number().min(0).max(1),
        g: z.number().min(0).max(1),
        b: z.number().min(0).max(1),
        a: z.number().min(0).max(1).optional(),
      }).optional().describe("Background color (default: white)"),
      parentId: z.string().optional().describe("Optional parent node ID"),
      name: z.string().optional().describe("Optional name for the card"),
    },
    async ({ x, y, width = 320, height = 200, padding = 24, hasShadow = true, hasStroke = false, backgroundColor, parentId, name }) => {
      try {
        const result = await sendCommandToFigma("create_card", {
          x,
          y,
          width,
          height,
          padding,
          backgroundColor: backgroundColor || DESIGN_TOKENS.colors.white,
          cornerRadius: DESIGN_TOKENS.borderRadius.lg,
          hasShadow,
          shadowColor: { r: 0, g: 0, b: 0, a: 0.08 },
          shadowOffset: { x: 0, y: 2 },
          shadowRadius: 8,
          hasStroke,
          strokeColor: DESIGN_TOKENS.colors.gray200,
          strokeWeight: 1,
          parentId,
          name: name || "Card",
        });

        const typedResult = result as { id: string; name: string };
        return {
          content: [
            {
              type: "text",
              text: `Created card with ID: ${typedResult.id}. Use this ID as parentId to add elements inside the card.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating card: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // CREATE AVATAR
  // ============================================
  server.tool(
    "create_avatar",
    "Create a circular avatar placeholder.",
    {
      x: z.number().describe("X position"),
      y: z.number().describe("Y position"),
      size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional().describe("Avatar size (default: md)"),
      initials: z.string().optional().describe("Initials to display (max 2 characters)"),
      backgroundColor: z.object({
        r: z.number().min(0).max(1),
        g: z.number().min(0).max(1),
        b: z.number().min(0).max(1),
        a: z.number().min(0).max(1).optional(),
      }).optional().describe("Background color (default: primary)"),
      parentId: z.string().optional().describe("Optional parent node ID"),
      name: z.string().optional().describe("Optional name for the avatar"),
    },
    async ({ x, y, size = "md", initials, backgroundColor, parentId, name }) => {
      try {
        const dimension = DESIGN_TOKENS.sizes.avatar[size];
        const fontSize = Math.round(dimension * 0.4);

        const result = await sendCommandToFigma("create_avatar", {
          x,
          y,
          size: dimension,
          initials: initials?.substring(0, 2).toUpperCase(),
          backgroundColor: backgroundColor || DESIGN_TOKENS.colors.primary,
          textColor: DESIGN_TOKENS.colors.white,
          fontSize,
          fontWeight: 600,
          parentId,
          name: name || "Avatar",
        });

        const typedResult = result as { id: string; name: string };
        return {
          content: [
            {
              type: "text",
              text: `Created ${size} avatar with ID: ${typedResult.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating avatar: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // CREATE BADGE
  // ============================================
  server.tool(
    "create_badge",
    "Create a small badge/tag for labels and status indicators.",
    {
      x: z.number().describe("X position"),
      y: z.number().describe("Y position"),
      text: z.string().describe("Badge text"),
      variant: z.enum(["default", "success", "warning", "error", "info"]).optional()
        .describe("Badge variant (default: default)"),
      parentId: z.string().optional().describe("Optional parent node ID"),
      name: z.string().optional().describe("Optional name for the badge"),
    },
    async ({ x, y, text, variant = "default", parentId, name }) => {
      try {
        const badgeConfig = DESIGN_TOKENS.sizes.badge;

        // Determine colors based on variant
        let fillColor, textColor;

        switch (variant) {
          case "success":
            fillColor = { r: 0.85, g: 0.95, b: 0.88, a: 1 }; // Light green
            textColor = { r: 0.08, g: 0.5, b: 0.28, a: 1 };  // Dark green
            break;
          case "warning":
            fillColor = { r: 1, g: 0.95, b: 0.85, a: 1 };    // Light yellow
            textColor = { r: 0.7, g: 0.5, b: 0.05, a: 1 };   // Dark yellow
            break;
          case "error":
            fillColor = { r: 1, g: 0.9, b: 0.9, a: 1 };      // Light red
            textColor = { r: 0.7, g: 0.15, b: 0.15, a: 1 };  // Dark red
            break;
          case "info":
            fillColor = { r: 0.9, g: 0.95, b: 1, a: 1 };     // Light blue
            textColor = { r: 0.1, g: 0.4, b: 0.7, a: 1 };    // Dark blue
            break;
          default:
            fillColor = DESIGN_TOKENS.colors.gray100;
            textColor = DESIGN_TOKENS.colors.gray700;
        }

        const result = await sendCommandToFigma("create_badge", {
          x,
          y,
          text,
          height: badgeConfig.height,
          fontSize: badgeConfig.fontSize,
          fontWeight: 500,
          paddingX: badgeConfig.paddingX,
          paddingY: badgeConfig.paddingY,
          fillColor,
          textColor,
          cornerRadius: DESIGN_TOKENS.borderRadius.full,
          parentId,
          name: name || `Badge - ${text}`,
        });

        const typedResult = result as { id: string; name: string };
        return {
          content: [
            {
              type: "text",
              text: `Created ${variant} badge "${text}" with ID: ${typedResult.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating badge: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // CREATE ICON PLACEHOLDER
  // ============================================
  server.tool(
    "create_icon_placeholder",
    "Create a square placeholder for icons.",
    {
      x: z.number().describe("X position"),
      y: z.number().describe("Y position"),
      size: z.number().optional().describe("Icon size in pixels (default: 24)"),
      color: z.object({
        r: z.number().min(0).max(1),
        g: z.number().min(0).max(1),
        b: z.number().min(0).max(1),
        a: z.number().min(0).max(1).optional(),
      }).optional().describe("Icon color (default: gray700)"),
      parentId: z.string().optional().describe("Optional parent node ID"),
      name: z.string().optional().describe("Optional name for the icon placeholder"),
    },
    async ({ x, y, size = 24, color, parentId, name }) => {
      try {
        const result = await sendCommandToFigma("create_icon_placeholder", {
          x,
          y,
          size,
          color: color || DESIGN_TOKENS.colors.gray700,
          parentId,
          name: name || "Icon",
        });

        const typedResult = result as { id: string; name: string };
        return {
          content: [
            {
              type: "text",
              text: `Created icon placeholder (${size}x${size}) with ID: ${typedResult.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating icon placeholder: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // CREATE DIVIDER
  // ============================================
  server.tool(
    "create_divider",
    "Create a horizontal or vertical divider line.",
    {
      x: z.number().describe("X position"),
      y: z.number().describe("Y position"),
      length: z.number().optional().describe("Length of the divider (default: 100)"),
      orientation: z.enum(["horizontal", "vertical"]).optional()
        .describe("Divider orientation (default: horizontal)"),
      color: z.object({
        r: z.number().min(0).max(1),
        g: z.number().min(0).max(1),
        b: z.number().min(0).max(1),
        a: z.number().min(0).max(1).optional(),
      }).optional().describe("Divider color (default: gray200)"),
      parentId: z.string().optional().describe("Optional parent node ID"),
      name: z.string().optional().describe("Optional name for the divider"),
    },
    async ({ x, y, length = 100, orientation = "horizontal", color, parentId, name }) => {
      try {
        const result = await sendCommandToFigma("create_divider", {
          x,
          y,
          length,
          orientation,
          color: color || DESIGN_TOKENS.colors.gray200,
          thickness: 1,
          parentId,
          name: name || "Divider",
        });

        const typedResult = result as { id: string; name: string };
        return {
          content: [
            {
              type: "text",
              text: `Created ${orientation} divider with ID: ${typedResult.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating divider: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // CREATE LOGIN SCREEN
  // ============================================
  server.tool(
    "create_login_screen",
    "Create a complete login screen with email input, password input, sign in button, and optional forgot password/sign up links.",
    {
      x: z.number().describe("X position"),
      y: z.number().describe("Y position"),
      title: z.string().optional().describe("Title text (default: 'Welcome Back')"),
      subtitle: z.string().optional().describe("Optional subtitle text"),
      buttonText: z.string().optional().describe("Sign in button text (default: 'Sign In')"),
      showForgotPassword: z.boolean().optional().describe("Show 'Forgot Password?' link (default: true)"),
      showSignUp: z.boolean().optional().describe("Show 'Sign Up' link (default: true)"),
      width: z.number().optional().describe("Width of the login card (default: 400)"),
      variant: z.enum(["default", "minimal", "branded"]).optional()
        .describe("Visual variant (default: 'default')"),
      brandColor: z.object({
        r: z.number().min(0).max(1),
        g: z.number().min(0).max(1),
        b: z.number().min(0).max(1),
      }).optional().describe("Brand color for branded variant"),
      name: z.string().optional().describe("Optional name for the login screen frame"),
    },
    async ({
      x, y,
      title = "Welcome Back",
      subtitle,
      buttonText = "Sign In",
      showForgotPassword = true,
      showSignUp = true,
      width = 400,
      variant = "default",
      brandColor,
      name
    }) => {
      try {
        // Use a longer timeout (60s) for login screen as it loads multiple fonts and creates many elements
        const result = await sendCommandToFigma("create_login_screen", {
          x,
          y,
          title,
          subtitle,
          buttonText,
          showForgotPassword,
          showSignUp,
          width,
          variant,
          brandColor: brandColor || DESIGN_TOKENS.colors.primary,
          name: name || "Login Screen",
        }, 60000);

        const typedResult = result as { id: string; name: string };
        return {
          content: [
            {
              type: "text",
              text: `Created login screen "${title}" with ID: ${typedResult.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating login screen: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // ============================================
  // RENDER HTML TO FIGMA
  // ============================================
  server.tool(
    "render_html",
    "Render HTML (with inline CSS or Tailwind classes) to Figma elements. The HTML is converted to Figma nodes preserving layout, colors, and typography. Great for quickly creating UI from HTML prototypes or generating UI from descriptions. Supports flexbox, colors, shadows, border-radius, and more.",
    {
      html: z.string().describe("HTML string to render. Can include inline styles or Tailwind classes."),
      x: z.number().optional().describe("X position for the rendered frame (default: 0)"),
      y: z.number().optional().describe("Y position for the rendered frame (default: 0)"),
      width: z.number().optional().describe("Width of the render container (default: 1440)"),
      name: z.string().optional().describe("Name for the rendered frame (default: 'HTML Render')"),
    },
    async ({ html, x = 0, y = 0, width = 1440, name = "HTML Render" }) => {
      try {
        // Use a longer timeout (60s) for HTML rendering as it can create many elements
        const result = await sendCommandToFigma("render_html", {
          html,
          x,
          y,
          width,
          name,
        }, 60000);

        const typedResult = result as { success: boolean; frameId: string; frameName: string };

        if (typedResult.success) {
          return {
            content: [
              {
                type: "text",
                text: `Successfully rendered HTML to Figma. Frame ID: ${typedResult.frameId}, Name: "${typedResult.frameName}"`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `HTML rendering completed but may have issues. Frame ID: ${typedResult.frameId}`,
              },
            ],
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error rendering HTML to Figma: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );
}
