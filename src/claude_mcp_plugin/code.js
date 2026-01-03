// This is the main code file for the Claude MCP Figma plugin
// It handles Figma API commands

// Plugin state
const state = {
  serverPort: 3055, // Default port
};

// Helper function for progress updates
function sendProgressUpdate(commandId, commandType, status, progress, totalItems, processedItems, message, payload = null) {
  const update = {
    type: 'command_progress',
    commandId,
    commandType,
    status,
    progress,
    totalItems,
    processedItems,
    message,
    timestamp: Date.now()
  };
  
  // Add optional chunk information if present
  if (payload) {
    if (payload.currentChunk !== undefined && payload.totalChunks !== undefined) {
      update.currentChunk = payload.currentChunk;
      update.totalChunks = payload.totalChunks;
      update.chunkSize = payload.chunkSize;
    }
    update.payload = payload;
  }
  
  // Send to UI
  figma.ui.postMessage(update);
  console.log(`Progress update: ${status} - ${progress}% - ${message}`);
  
  return update;
}

// Show UI
figma.showUI(__html__, { width: 350, height: 450 });

// Plugin commands from UI
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case "update-settings":
      updateSettings(msg);
      break;
    case "notify":
      figma.notify(msg.message);
      break;
    case "close-plugin":
      figma.closePlugin();
      break;
    case "execute-command":
      // Execute commands received from UI (which gets them from WebSocket)
      try {
        const result = await handleCommand(msg.command, msg.params);
        // Send result back to UI
        figma.ui.postMessage({
          type: "command-result",
          id: msg.id,
          result,
        });
      } catch (error) {
        figma.ui.postMessage({
          type: "command-error",
          id: msg.id,
          error: error.message || "Error executing command",
        });
      }
      break;
  }
};

// Listen for plugin commands from menu
figma.on("run", ({ command }) => {
  figma.ui.postMessage({ type: "auto-connect" });
});

// Update plugin settings
function updateSettings(settings) {
  if (settings.serverPort) {
    state.serverPort = settings.serverPort;
  }

  figma.clientStorage.setAsync("settings", {
    serverPort: state.serverPort,
  });
}

// Handle commands from UI
async function handleCommand(command, params) {
  switch (command) {
    case "get_document_info":
      return await getDocumentInfo();
    case "get_selection":
      return await getSelection();
    case "get_node_info":
      if (!params || !params.nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      return await getNodeInfo(params.nodeId);
    case "get_nodes_info":
      if (!params || !params.nodeIds || !Array.isArray(params.nodeIds)) {
        throw new Error("Missing or invalid nodeIds parameter");
      }
      return await getNodesInfo(params.nodeIds);
    case "create_rectangle":
      return await createRectangle(params);
    case "create_frame":
      return await createFrame(params);
    case "create_text":
      return await createText(params);
    case "set_fill_color":
      return await setFillColor(params);
    case "set_stroke_color":
      return await setStrokeColor(params);
    case "move_node":
      return await moveNode(params);
    case "resize_node":
      return await resizeNode(params);
    case "delete_node":
      return await deleteNode(params);
    case "set_node_locked":
      return await setNodeLocked(params);
    case "get_styles":
      return await getStyles();
    case "get_local_components":
      return await getLocalComponents();
    // case "get_team_components":
    //   return await getTeamComponents();
    case "create_component_instance":
      return await createComponentInstance(params);
    case "export_node_as_image":
      return await exportNodeAsImage(params);
    case "set_corner_radius":
      return await setCornerRadius(params);
    case "set_text_content":
      return await setTextContent(params);
    case "clone_node":
      return await cloneNode(params);
    case "scan_text_nodes":
      return await scanTextNodes(params);
    case "set_multiple_text_contents":
      return await setMultipleTextContents(params);
    case "set_auto_layout":
      return await setAutoLayout(params);
    // Nuevos comandos para propiedades de texto
    case "set_font_name":
      return await setFontName(params);
    case "set_font_size":
      return await setFontSize(params);
    case "set_font_weight":
      return await setFontWeight(params);
    case "set_letter_spacing":
      return await setLetterSpacing(params);
    case "set_line_height":
      return await setLineHeight(params);
    case "set_paragraph_spacing":
      return await setParagraphSpacing(params);
    case "set_text_case":
      return await setTextCase(params);
    case "set_text_decoration":
      return await setTextDecoration(params);
    case "get_styled_text_segments":
      return await getStyledTextSegments(params);
    case "load_font_async":
      return await loadFontAsyncWrapper(params);
    case "get_remote_components":
      return await getRemoteComponents(params);
    case "set_effects":
      return await setEffects(params);
    case "set_effect_style_id":
      return await setEffectStyleId(params);
    case "group_nodes":
      return await groupNodes(params);
    case "ungroup_nodes":
      return await ungroupNodes(params);
    case "flatten_node":
      return await flattenNode(params);
    case "insert_child":
      return await insertChild(params);
    case "create_ellipse":
      return await createEllipse(params);
    case "create_polygon":
      return await createPolygon(params);
    case "create_star":
      return await createStar(params);
    case "create_vector":
      return await createVector(params);
    case "create_line":
      return await createLine(params);
    case "create_page":
      return await createPage(params);
    case "get_pages":
      return await getPages();
    case "set_current_page":
      return await setCurrentPage(params);
    case "delete_page":
      return await deletePage(params);
    // Advanced tools - batch, gradients, layer ordering, viewport
    case "create_elements":
      return await createElements(params);
    case "set_gradient_fill":
      return await setGradientFill(params);
    case "set_layer_order":
      return await setLayerOrder(params);
    case "zoom_to_node":
      return await zoomToNode(params);
    case "zoom_to_fit":
      return await zoomToFit(params);
    case "set_viewport":
      return await setViewport(params);
    case "get_viewport":
      return await getViewport();
    case "select_nodes":
      return await selectNodes(params);
    // UI Component tools
    case "create_button":
      return await createButton(params);
    case "create_input":
      return await createInput(params);
    case "create_card":
      return await createCard(params);
    case "create_avatar":
      return await createAvatar(params);
    case "create_badge":
      return await createBadge(params);
    case "create_icon_placeholder":
      return await createIconPlaceholder(params);
    case "create_divider":
      return await createDivider(params);
    case "render_html":
      return await renderHtml(params);
    // Image fill command (receives pre-fetched image bytes from UI)
    case "apply_image_fill":
      return await applyImageFill(params);
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

// Command implementations

async function getDocumentInfo() {
  await figma.currentPage.loadAsync();
  const page = figma.currentPage;
  return {
    name: page.name,
    id: page.id,
    type: page.type,
    children: page.children.map((node) => {
      const child = {
        id: node.id,
        name: node.name,
        type: node.type,
      };
      // Include position and size for frames/shapes to enable safe positioning
      if ("x" in node) {
        child.x = node.x;
        child.y = node.y;
      }
      if ("width" in node) {
        child.width = node.width;
        child.height = node.height;
      }
      return child;
    }),
    currentPage: {
      id: page.id,
      name: page.name,
      childCount: page.children.length,
    },
    pages: [
      {
        id: page.id,
        name: page.name,
        childCount: page.children.length,
      },
    ],
  };
}

async function getSelection() {
  return {
    selectionCount: figma.currentPage.selection.length,
    selection: figma.currentPage.selection.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      visible: node.visible,
    })),
  };
}

async function getNodeInfo(nodeId) {
  const node = await figma.getNodeByIdAsync(nodeId);

  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  const response = await node.exportAsync({
    format: "JSON_REST_V1",
  });

  return response.document;
}

async function getNodesInfo(nodeIds) {
  try {
    // Load all nodes in parallel
    const nodes = await Promise.all(
      nodeIds.map((id) => figma.getNodeByIdAsync(id))
    );

    // Filter out any null values (nodes that weren't found)
    const validNodes = nodes.filter((node) => node !== null);

    // Export all valid nodes in parallel
    const responses = await Promise.all(
      validNodes.map(async (node) => {
        const response = await node.exportAsync({
          format: "JSON_REST_V1",
        });
        return {
          nodeId: node.id,
          document: response.document,
        };
      })
    );

    return responses;
  } catch (error) {
    throw new Error(`Error getting nodes info: ${error.message}`);
  }
}

async function createRectangle(params) {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    name = "Rectangle",
    parentId,
  } = params || {};

  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.name = name;

  // If parentId is provided, append to that node, otherwise append to current page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    parentNode.appendChild(rect);
  } else {
    figma.currentPage.appendChild(rect);
  }

  return {
    id: rect.id,
    name: rect.name,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    parentId: rect.parent ? rect.parent.id : undefined,
  };
}

async function createFrame(params) {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    name = "Frame",
    parentId,
    fillColor,
    strokeColor,
    strokeWeight,
  } = params || {};

  const frame = figma.createFrame();
  frame.x = x;
  frame.y = y;
  frame.resize(width, height);
  frame.name = name;

  // Set fill color if provided
  if (fillColor) {
    const paintStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(fillColor.r) || 0,
        g: parseFloat(fillColor.g) || 0,
        b: parseFloat(fillColor.b) || 0,
      },
      opacity: parseFloat(fillColor.a) || 1,
    };
    frame.fills = [paintStyle];
  }

  // Set stroke color and weight if provided
  if (strokeColor) {
    const strokeStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(strokeColor.r) || 0,
        g: parseFloat(strokeColor.g) || 0,
        b: parseFloat(strokeColor.b) || 0,
      },
      opacity: parseFloat(strokeColor.a) || 1,
    };
    frame.strokes = [strokeStyle];
  }

  // Set stroke weight if provided
  if (strokeWeight !== undefined) {
    frame.strokeWeight = strokeWeight;
  }

  // If parentId is provided, append to that node, otherwise append to current page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    parentNode.appendChild(frame);
  } else {
    figma.currentPage.appendChild(frame);
  }

  return {
    id: frame.id,
    name: frame.name,
    x: frame.x,
    y: frame.y,
    width: frame.width,
    height: frame.height,
    fills: frame.fills,
    strokes: frame.strokes,
    strokeWeight: frame.strokeWeight,
    parentId: frame.parent ? frame.parent.id : undefined,
  };
}

async function createText(params) {
  const {
    x = 0,
    y = 0,
    text = "Text",
    fontSize = 14,
    fontWeight = 400,
    fontColor = { r: 0, g: 0, b: 0, a: 1 }, // Default to black
    name = "Text",
    parentId,
  } = params || {};

  // Map common font weights to Figma font styles
  const getFontStyle = (weight) => {
    switch (weight) {
      case 100:
        return "Thin";
      case 200:
        return "Extra Light";
      case 300:
        return "Light";
      case 400:
        return "Regular";
      case 500:
        return "Medium";
      case 600:
        return "Semi Bold";
      case 700:
        return "Bold";
      case 800:
        return "Extra Bold";
      case 900:
        return "Black";
      default:
        return "Regular";
    }
  };

  const textNode = figma.createText();
  textNode.x = x;
  textNode.y = y;
  textNode.name = name;
  try {
    await figma.loadFontAsync({
      family: "Inter",
      style: getFontStyle(fontWeight),
    });
    textNode.fontName = { family: "Inter", style: getFontStyle(fontWeight) };
    textNode.fontSize = parseInt(fontSize);
  } catch (error) {
    console.error("Error setting font size", error);
  }
  setCharacters(textNode, text);

  // Set text color
  const paintStyle = {
    type: "SOLID",
    color: {
      r: parseFloat(fontColor.r) || 0,
      g: parseFloat(fontColor.g) || 0,
      b: parseFloat(fontColor.b) || 0,
    },
    opacity: parseFloat(fontColor.a) || 1,
  };
  textNode.fills = [paintStyle];

  // If parentId is provided, append to that node, otherwise append to current page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    parentNode.appendChild(textNode);
  } else {
    figma.currentPage.appendChild(textNode);
  }

  return {
    id: textNode.id,
    name: textNode.name,
    x: textNode.x,
    y: textNode.y,
    width: textNode.width,
    height: textNode.height,
    characters: textNode.characters,
    fontSize: textNode.fontSize,
    fontWeight: fontWeight,
    fontColor: fontColor,
    fontName: textNode.fontName,
    fills: textNode.fills,
    parentId: textNode.parent ? textNode.parent.id : undefined,
  };
}

async function setFillColor(params) {
  console.log("setFillColor", params);
  const {
    nodeId,
    color: { r, g, b, a },
  } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("fills" in node)) {
    throw new Error(`Node does not support fills: ${nodeId}`);
  }

  // Validate that MCP layer provided complete data
  if (r === undefined || g === undefined || b === undefined || a === undefined) {
    throw new Error("Incomplete color data received from MCP layer. All RGBA components must be provided.");
  }

  // Parse values - no defaults, just format conversion
  const rgbColor = {
    r: parseFloat(r),
    g: parseFloat(g), 
    b: parseFloat(b),
    a: parseFloat(a)
  };

  // Validate parsing succeeded
  if (isNaN(rgbColor.r) || isNaN(rgbColor.g) || isNaN(rgbColor.b) || isNaN(rgbColor.a)) {
    throw new Error("Invalid color values received - all components must be valid numbers");
  }

  // Set fill - pure translation to Figma API format
  const paintStyle = {
    type: "SOLID",
    color: {
      r: rgbColor.r,
      g: rgbColor.g,
      b: rgbColor.b,
    },
    opacity: rgbColor.a,
  };

  console.log("paintStyle", paintStyle);

  node.fills = [paintStyle];

  return {
    id: node.id,
    name: node.name,
    fills: [paintStyle],
  };
}

async function setStrokeColor(params) {
  const {
    nodeId,
    color: { r, g, b, a },
    strokeWeight,
  } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("strokes" in node)) {
    throw new Error(`Node does not support strokes: ${nodeId}`);
  }

  if (r === undefined || g === undefined || b === undefined || a === undefined) {
    throw new Error("Incomplete color data received from MCP layer. All RGBA components must be provided.");
  }
  
  if (strokeWeight === undefined) {
    throw new Error("Stroke weight must be provided by MCP layer.");
  }

  const rgbColor = {
    r: parseFloat(r),
    g: parseFloat(g),
    b: parseFloat(b),
    a: parseFloat(a)
  };
  const strokeWeightParsed = parseFloat(strokeWeight);

  if (isNaN(rgbColor.r) || isNaN(rgbColor.g) || isNaN(rgbColor.b) || isNaN(rgbColor.a)) {
    throw new Error("Invalid color values received - all components must be valid numbers");
  }
  
  if (isNaN(strokeWeightParsed)) {
    throw new Error("Invalid stroke weight - must be a valid number");
  }

  const paintStyle = {
    type: "SOLID",
    color: {
      r: rgbColor.r,
      g: rgbColor.g,
      b: rgbColor.b,
    },
    opacity: rgbColor.a,
  };

  node.strokes = [paintStyle];

  // Set stroke weight if available
  if ("strokeWeight" in node) {
    node.strokeWeight = strokeWeightParsed;
  }

  return {
    id: node.id,
    name: node.name,
    strokes: node.strokes,
    strokeWeight: "strokeWeight" in node ? node.strokeWeight : undefined,
  };
}

async function moveNode(params) {
  const { nodeId, x, y, relative = false } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (x === undefined || y === undefined) {
    throw new Error("Missing x or y parameters");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("x" in node) || !("y" in node)) {
    throw new Error(`Node does not support position: ${nodeId}`);
  }

  // Store original position for response
  const originalX = node.x;
  const originalY = node.y;

  // Apply position based on mode
  if (relative) {
    // Relative mode: x/y are offsets from current position
    node.x = node.x + x;
    node.y = node.y + y;
  } else {
    // Absolute mode: x/y are absolute page coordinates
    node.x = x;
    node.y = y;
  }

  return {
    id: node.id,
    name: node.name,
    originalX: originalX,
    originalY: originalY,
    x: node.x,
    y: node.y,
    mode: relative ? "relative" : "absolute",
  };
}

async function resizeNode(params) {
  const { nodeId, width, height } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (width === undefined || height === undefined) {
    throw new Error("Missing width or height parameters");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("resize" in node)) {
    throw new Error(`Node does not support resizing: ${nodeId}`);
  }

  node.resize(width, height);

  return {
    id: node.id,
    name: node.name,
    width: node.width,
    height: node.height,
  };
}

async function deleteNode(params) {
  const { nodeId } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  // Save node info before deleting
  const nodeInfo = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  node.remove();

  return nodeInfo;
}

// Lock or unlock a node
async function setNodeLocked(params) {
  const { nodeId, locked } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (typeof locked !== "boolean") {
    throw new Error("Missing or invalid locked parameter (must be boolean)");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  // Check if the node supports the locked property
  if (!("locked" in node)) {
    throw new Error(`Node type ${node.type} does not support locking`);
  }

  node.locked = locked;

  return {
    id: node.id,
    name: node.name,
    type: node.type,
    locked: node.locked,
  };
}

async function getStyles() {
  const styles = {
    colors: await figma.getLocalPaintStylesAsync(),
    texts: await figma.getLocalTextStylesAsync(),
    effects: await figma.getLocalEffectStylesAsync(),
    grids: await figma.getLocalGridStylesAsync(),
  };

  return {
    colors: styles.colors.map((style) => ({
      id: style.id,
      name: style.name,
      key: style.key,
      paint: style.paints[0],
    })),
    texts: styles.texts.map((style) => ({
      id: style.id,
      name: style.name,
      key: style.key,
      fontSize: style.fontSize,
      fontName: style.fontName,
    })),
    effects: styles.effects.map((style) => ({
      id: style.id,
      name: style.name,
      key: style.key,
    })),
    grids: styles.grids.map((style) => ({
      id: style.id,
      name: style.name,
      key: style.key,
    })),
  };
}

async function getLocalComponents() {
  await figma.loadAllPagesAsync();

  const components = figma.root.findAllWithCriteria({
    types: ["COMPONENT"],
  });

  return {
    count: components.length,
    components: components.map((component) => ({
      id: component.id,
      name: component.name,
      key: "key" in component ? component.key : null,
    })),
  };
}

// async function getTeamComponents() {
//   try {
//     const teamComponents =
//       await figma.teamLibrary.getAvailableComponentsAsync();

//     return {
//       count: teamComponents.length,
//       components: teamComponents.map((component) => ({
//         key: component.key,
//         name: component.name,
//         description: component.description,
//         libraryName: component.libraryName,
//       })),
//     };
//   } catch (error) {
//     throw new Error(`Error getting team components: ${error.message}`);
//   }
// }

async function createComponentInstance(params) {
  const { componentKey, x = 0, y = 0 } = params || {};

  if (!componentKey) {
    throw new Error("Missing componentKey parameter");
  }

  try {
    // Set up a manual timeout to detect long operations
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Timeout while creating component instance (10s). The component may be too complex or unavailable."));
      }, 10000); // 10 seconds timeout
    });
    
    console.log(`Starting component import for key: ${componentKey}...`);
    
    // Execute the import with a timeout
    const importPromise = figma.importComponentByKeyAsync(componentKey);
    
    // Use Promise.race to implement the timeout
    const component = await Promise.race([importPromise, timeoutPromise])
      .finally(() => {
        clearTimeout(timeoutId); // Clear the timeout to prevent memory leaks
      });

    // Add progress logging
    console.log(`Component imported successfully, creating instance...`);
    
    // Create instance and set properties in a separate try block to handle errors specifically from this step
    try {
      const instance = component.createInstance();
      instance.x = x;
      instance.y = y;

      figma.currentPage.appendChild(instance);
      
      console.log(`Component instance created and added to page successfully`);

      return {
        id: instance.id,
        name: instance.name,
        x: instance.x,
        y: instance.y,
        width: instance.width,
        height: instance.height,
        componentId: instance.componentId,
      };
    } catch (instanceError) {
      console.error(`Error creating component instance: ${instanceError.message}`);
      throw new Error(`Error creating component instance: ${instanceError.message}`);
    }
  } catch (error) {
    console.error(`Detailed error creating component instance: ${error.message || "Unknown error"}`);
    console.error(`Stack trace: ${error.stack || "Not available"}`);
    
    // Provide more helpful error messages for common failure scenarios
    if (error.message.includes("timeout") || error.message.includes("Timeout")) {
      throw new Error(`The component import timed out after 10 seconds. This usually happens with complex remote components or network issues. Try again later or use a simpler component.`);
    } else if (error.message.includes("not found") || error.message.includes("Not found")) {
      throw new Error(`Component with key "${componentKey}" not found. Make sure the component exists and is accessible in your document or team libraries.`);
    } else if (error.message.includes("permission") || error.message.includes("Permission")) {
      throw new Error(`You don't have permission to use this component. Make sure you have access to the team library containing this component.`);
    } else {
      throw new Error(`Error creating component instance: ${error.message}`);
    }
  }
}

async function exportNodeAsImage(params) {
  const { nodeId, scale = 1 } = params || {};

  const format = "PNG";

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("exportAsync" in node)) {
    throw new Error(`Node does not support exporting: ${nodeId}`);
  }

  try {
    const settings = {
      format: format,
      constraint: { type: "SCALE", value: scale },
    };

    const bytes = await node.exportAsync(settings);

    let mimeType;
    switch (format) {
      case "PNG":
        mimeType = "image/png";
        break;
      case "JPG":
        mimeType = "image/jpeg";
        break;
      case "SVG":
        mimeType = "image/svg+xml";
        break;
      case "PDF":
        mimeType = "application/pdf";
        break;
      default:
        mimeType = "application/octet-stream";
    }

    // Proper way to convert Uint8Array to base64
    const base64 = customBase64Encode(bytes);
    // const imageData = `data:${mimeType};base64,${base64}`;

    return {
      nodeId,
      format,
      scale,
      mimeType,
      imageData: base64,
    };
  } catch (error) {
    throw new Error(`Error exporting node as image: ${error.message}`);
  }
}
function customBase64Encode(bytes) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let base64 = "";

  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  let a, b, c, d;
  let chunk;

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032 = (2^6 - 1) << 6
    d = chunk & 63; // 63 = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += chars[a] + chars[b] + chars[c] + chars[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3 = 2^2 - 1

    base64 += chars[a] + chars[b] + "==";
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008 = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15 = 2^4 - 1

    base64 += chars[a] + chars[b] + chars[c] + "=";
  }

  return base64;
}

async function setCornerRadius(params) {
  const { nodeId, radius, corners } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (radius === undefined) {
    throw new Error("Missing radius parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  // Check if node supports corner radius
  if (!("cornerRadius" in node)) {
    throw new Error(`Node does not support corner radius: ${nodeId}`);
  }

  // If corners array is provided, set individual corner radii
  if (corners && Array.isArray(corners) && corners.length === 4) {
    if ("topLeftRadius" in node) {
      // Node supports individual corner radii
      if (corners[0]) node.topLeftRadius = radius;
      if (corners[1]) node.topRightRadius = radius;
      if (corners[2]) node.bottomRightRadius = radius;
      if (corners[3]) node.bottomLeftRadius = radius;
    } else {
      // Node only supports uniform corner radius
      node.cornerRadius = radius;
    }
  } else {
    // Set uniform corner radius
    node.cornerRadius = radius;
  }

  return {
    id: node.id,
    name: node.name,
    cornerRadius: "cornerRadius" in node ? node.cornerRadius : undefined,
    topLeftRadius: "topLeftRadius" in node ? node.topLeftRadius : undefined,
    topRightRadius: "topRightRadius" in node ? node.topRightRadius : undefined,
    bottomRightRadius:
      "bottomRightRadius" in node ? node.bottomRightRadius : undefined,
    bottomLeftRadius:
      "bottomLeftRadius" in node ? node.bottomLeftRadius : undefined,
  };
}

async function setTextContent(params) {
  const { nodeId, text } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (text === undefined) {
    throw new Error("Missing text parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (node.type !== "TEXT") {
    throw new Error(`Node is not a text node: ${nodeId}`);
  }

  try {
    await figma.loadFontAsync(node.fontName);

    await setCharacters(node, text);

    return {
      id: node.id,
      name: node.name,
      characters: node.characters,
      fontName: node.fontName,
    };
  } catch (error) {
    throw new Error(`Error setting text content: ${error.message}`);
  }
}

// Initialize settings on load
(async function initializePlugin() {
  try {
    const savedSettings = await figma.clientStorage.getAsync("settings");
    if (savedSettings) {
      if (savedSettings.serverPort) {
        state.serverPort = savedSettings.serverPort;
      }
    }

    // Send initial settings to UI
    figma.ui.postMessage({
      type: "init-settings",
      settings: {
        serverPort: state.serverPort,
      },
    });
  } catch (error) {
    console.error("Error loading settings:", error);
  }
})();

function uniqBy(arr, predicate) {
  const cb = typeof predicate === "function" ? predicate : (o) => o[predicate];
  return [
    ...arr
      .reduce((map, item) => {
        const key = item === null || item === undefined ? item : cb(item);

        map.has(key) || map.set(key, item);

        return map;
      }, new Map())
      .values(),
  ];
}
const setCharacters = async (node, characters, options) => {
  const fallbackFont = (options && options.fallbackFont) || {
    family: "Inter",
    style: "Regular",
  };
  try {
    if (node.fontName === figma.mixed) {
      if (options && options.smartStrategy === "prevail") {
        const fontHashTree = {};
        for (let i = 1; i < node.characters.length; i++) {
          const charFont = node.getRangeFontName(i - 1, i);
          const key = `${charFont.family}::${charFont.style}`;
          fontHashTree[key] = fontHashTree[key] ? fontHashTree[key] + 1 : 1;
        }
        const prevailedTreeItem = Object.entries(fontHashTree).sort(
          (a, b) => b[1] - a[1]
        )[0];
        const [family, style] = prevailedTreeItem[0].split("::");
        const prevailedFont = {
          family,
          style,
        };
        await figma.loadFontAsync(prevailedFont);
        node.fontName = prevailedFont;
      } else if (options && options.smartStrategy === "strict") {
        return setCharactersWithStrictMatchFont(node, characters, fallbackFont);
      } else if (options && options.smartStrategy === "experimental") {
        return setCharactersWithSmartMatchFont(node, characters, fallbackFont);
      } else {
        const firstCharFont = node.getRangeFontName(0, 1);
        await figma.loadFontAsync(firstCharFont);
        node.fontName = firstCharFont;
      }
    } else {
      await figma.loadFontAsync({
        family: node.fontName.family,
        style: node.fontName.style,
      });
    }
  } catch (err) {
    console.warn(
      `Failed to load "${node.fontName["family"]} ${node.fontName["style"]}" font and replaced with fallback "${fallbackFont.family} ${fallbackFont.style}"`,
      err
    );
    await figma.loadFontAsync(fallbackFont);
    node.fontName = fallbackFont;
  }
  try {
    node.characters = characters;
    return true;
  } catch (err) {
    console.warn(`Failed to set characters. Skipped.`, err);
    return false;
  }
};

const setCharactersWithStrictMatchFont = async (
  node,
  characters,
  fallbackFont
) => {
  const fontHashTree = {};
  for (let i = 1; i < node.characters.length; i++) {
    const startIdx = i - 1;
    const startCharFont = node.getRangeFontName(startIdx, i);
    const startCharFontVal = `${startCharFont.family}::${startCharFont.style}`;
    while (i < node.characters.length) {
      i++;
      const charFont = node.getRangeFontName(i - 1, i);
      if (startCharFontVal !== `${charFont.family}::${charFont.style}`) {
        break;
      }
    }
    fontHashTree[`${startIdx}_${i}`] = startCharFontVal;
  }
  await figma.loadFontAsync(fallbackFont);
  node.fontName = fallbackFont;
  node.characters = characters;
  console.log(fontHashTree);
  await Promise.all(
    Object.keys(fontHashTree).map(async (range) => {
      console.log(range, fontHashTree[range]);
      const [start, end] = range.split("_");
      const [family, style] = fontHashTree[range].split("::");
      const matchedFont = {
        family,
        style,
      };
      await figma.loadFontAsync(matchedFont);
      return node.setRangeFontName(Number(start), Number(end), matchedFont);
    })
  );
  return true;
};

const getDelimiterPos = (str, delimiter, startIdx = 0, endIdx = str.length) => {
  const indices = [];
  let temp = startIdx;
  for (let i = startIdx; i < endIdx; i++) {
    if (
      str[i] === delimiter &&
      i + startIdx !== endIdx &&
      temp !== i + startIdx
    ) {
      indices.push([temp, i + startIdx]);
      temp = i + startIdx + 1;
    }
  }
  temp !== endIdx && indices.push([temp, endIdx]);
  return indices.filter(Boolean);
};

const buildLinearOrder = (node) => {
  const fontTree = [];
  const newLinesPos = getDelimiterPos(node.characters, "\n");
  newLinesPos.forEach(([newLinesRangeStart, newLinesRangeEnd], n) => {
    const newLinesRangeFont = node.getRangeFontName(
      newLinesRangeStart,
      newLinesRangeEnd
    );
    if (newLinesRangeFont === figma.mixed) {
      const spacesPos = getDelimiterPos(
        node.characters,
        " ",
        newLinesRangeStart,
        newLinesRangeEnd
      );
      spacesPos.forEach(([spacesRangeStart, spacesRangeEnd], s) => {
        const spacesRangeFont = node.getRangeFontName(
          spacesRangeStart,
          spacesRangeEnd
        );
        if (spacesRangeFont === figma.mixed) {
          const spacesRangeFont = node.getRangeFontName(
            spacesRangeStart,
            spacesRangeStart[0]
          );
          fontTree.push({
            start: spacesRangeStart,
            delimiter: " ",
            family: spacesRangeFont.family,
            style: spacesRangeFont.style,
          });
        } else {
          fontTree.push({
            start: spacesRangeStart,
            delimiter: " ",
            family: spacesRangeFont.family,
            style: spacesRangeFont.style,
          });
        }
      });
    } else {
      fontTree.push({
        start: newLinesRangeStart,
        delimiter: "\n",
        family: newLinesRangeFont.family,
        style: newLinesRangeFont.style,
      });
    }
  });
  return fontTree
    .sort((a, b) => +a.start - +b.start)
    .map(({ family, style, delimiter }) => ({ family, style, delimiter }));
};

const setCharactersWithSmartMatchFont = async (
  node,
  characters,
  fallbackFont
) => {
  const rangeTree = buildLinearOrder(node);
  const fontsToLoad = uniqBy(
    rangeTree,
    ({ family, style }) => `${family}::${style}`
  ).map(({ family, style }) => ({
    family,
    style,
  }));

  await Promise.all([...fontsToLoad, fallbackFont].map(figma.loadFontAsync));

  node.fontName = fallbackFont;
  node.characters = characters;

  let prevPos = 0;
  rangeTree.forEach(({ family, style, delimiter }) => {
    if (prevPos < node.characters.length) {
      const delimeterPos = node.characters.indexOf(delimiter, prevPos);
      const endPos =
        delimeterPos > prevPos ? delimeterPos : node.characters.length;
      const matchedFont = {
        family,
        style,
      };
      node.setRangeFontName(prevPos, endPos, matchedFont);
      prevPos = endPos + 1;
    }
  });
  return true;
};

// Add the cloneNode function implementation
async function cloneNode(params) {
  const { nodeId, x, y } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  // Clone the node
  const clone = node.clone();

  // If x and y are provided, move the clone to that position
  if (x !== undefined && y !== undefined) {
    if (!("x" in clone) || !("y" in clone)) {
      throw new Error(`Cloned node does not support position: ${nodeId}`);
    }
    clone.x = x;
    clone.y = y;
  }

  // Add the clone to the same parent as the original node
  if (node.parent) {
    node.parent.appendChild(clone);
  } else {
    figma.currentPage.appendChild(clone);
  }

  return {
    id: clone.id,
    name: clone.name,
    x: "x" in clone ? clone.x : undefined,
    y: "y" in clone ? clone.y : undefined,
    width: "width" in clone ? clone.width : undefined,
    height: "height" in clone ? clone.height : undefined,
  };
}

async function scanTextNodes(params) {
  console.log(`Starting to scan text nodes from node ID: ${params.nodeId}`);
  const { nodeId, useChunking = true, chunkSize = 10, commandId = generateCommandId() } = params || {};
  
  const node = await figma.getNodeByIdAsync(nodeId);

  if (!node) {
    console.error(`Node with ID ${nodeId} not found`);
    // Send error progress update
    sendProgressUpdate(
      commandId,
      'scan_text_nodes',
      'error',
      0,
      0,
      0,
      `Node with ID ${nodeId} not found`,
      { error: `Node not found: ${nodeId}` }
    );
    throw new Error(`Node with ID ${nodeId} not found`);
  }

  // If chunking is not enabled, use the original implementation
  if (!useChunking) {
    const textNodes = [];
    try {
      // Send started progress update
      sendProgressUpdate(
        commandId,
        'scan_text_nodes',
        'started',
        0,
        1, // Not known yet how many nodes there are
        0,
        `Starting scan of node "${node.name || nodeId}" without chunking`,
        null
      );

      await findTextNodes(node, [], 0, textNodes);
      
      // Send completed progress update
      sendProgressUpdate(
        commandId,
        'scan_text_nodes',
        'completed',
        100,
        textNodes.length,
        textNodes.length,
        `Scan complete. Found ${textNodes.length} text nodes.`,
        { textNodes }
      );

      return {
        success: true,
        message: `Scanned ${textNodes.length} text nodes.`,
        count: textNodes.length,
        textNodes: textNodes, 
        commandId
      };
    } catch (error) {
      console.error("Error scanning text nodes:", error);
      
      // Send error progress update
      sendProgressUpdate(
        commandId,
        'scan_text_nodes',
        'error',
        0,
        0,
        0,
        `Error scanning text nodes: ${error.message}`,
        { error: error.message }
      );
      
      throw new Error(`Error scanning text nodes: ${error.message}`);
    }
  }
  
  // Chunked implementation
  console.log(`Using chunked scanning with chunk size: ${chunkSize}`);
  
  // First, collect all nodes to process (without processing them yet)
  const nodesToProcess = [];
  
  // Send started progress update
  sendProgressUpdate(
    commandId,
    'scan_text_nodes',
    'started',
    0,
    0, // Not known yet how many nodes there are
    0,
    `Starting chunked scan of node "${node.name || nodeId}"`,
    { chunkSize }
  );
  
  await collectNodesToProcess(node, [], 0, nodesToProcess);
  
  const totalNodes = nodesToProcess.length;
  console.log(`Found ${totalNodes} total nodes to process`);
  
  // Calculate number of chunks needed
  const totalChunks = Math.ceil(totalNodes / chunkSize);
  console.log(`Will process in ${totalChunks} chunks`);
  
  // Send update after node collection
  sendProgressUpdate(
    commandId,
    'scan_text_nodes',
    'in_progress',
    5, // 5% progress for collection phase
    totalNodes,
    0,
    `Found ${totalNodes} nodes to scan. Will process in ${totalChunks} chunks.`,
    {
      totalNodes,
      totalChunks,
      chunkSize
    }
  );
  
  // Process nodes in chunks
  const allTextNodes = [];
  let processedNodes = 0;
  let chunksProcessed = 0;
  
  for (let i = 0; i < totalNodes; i += chunkSize) {
    const chunkEnd = Math.min(i + chunkSize, totalNodes);
    console.log(`Processing chunk ${chunksProcessed + 1}/${totalChunks} (nodes ${i} to ${chunkEnd - 1})`);
    
    // Send update before processing chunk
    sendProgressUpdate(
      commandId,
      'scan_text_nodes',
      'in_progress',
      Math.round(5 + ((chunksProcessed / totalChunks) * 90)), // 5-95% for processing
      totalNodes,
      processedNodes,
      `Processing chunk ${chunksProcessed + 1}/${totalChunks}`,
      {
        currentChunk: chunksProcessed + 1,
        totalChunks,
        textNodesFound: allTextNodes.length
      }
    );
    
    const chunkNodes = nodesToProcess.slice(i, chunkEnd);
    const chunkTextNodes = [];
    
    // Process each node in this chunk
    for (const nodeInfo of chunkNodes) {
      if (nodeInfo.node.type === "TEXT") {
        try {
          const textNodeInfo = await processTextNode(nodeInfo.node, nodeInfo.parentPath, nodeInfo.depth);
          if (textNodeInfo) {
            chunkTextNodes.push(textNodeInfo);
          }
        } catch (error) {
          console.error(`Error processing text node: ${error.message}`);
          // Continue with other nodes
        }
      }
      
      // Brief delay to allow UI updates and prevent freezing
      await delay(5);
    }
    
    // Add results from this chunk
    allTextNodes.push(...chunkTextNodes);
    processedNodes += chunkNodes.length;
    chunksProcessed++;
    
    // Send update after processing chunk
    sendProgressUpdate(
      commandId,
      'scan_text_nodes',
      'in_progress',
      Math.round(5 + ((chunksProcessed / totalChunks) * 90)), // 5-95% for processing
      totalNodes,
      processedNodes,
      `Processed chunk ${chunksProcessed}/${totalChunks}. Found ${allTextNodes.length} text nodes so far.`,
      {
        currentChunk: chunksProcessed,
        totalChunks,
        processedNodes,
        textNodesFound: allTextNodes.length,
        chunkResult: chunkTextNodes
      }
    );
    
    // Small delay between chunks to prevent UI freezing
    if (i + chunkSize < totalNodes) {
      await delay(50);
    }
  }
  
  // Send completed progress update
  sendProgressUpdate(
    commandId,
    'scan_text_nodes',
    'completed',
    100,
    totalNodes,
    processedNodes,
    `Scan complete. Found ${allTextNodes.length} text nodes.`,
    {
      textNodes: allTextNodes,
      processedNodes,
      chunks: chunksProcessed
    }
  );
  
  return {
    success: true,
    message: `Chunked scan complete. Found ${allTextNodes.length} text nodes.`,
    totalNodes: allTextNodes.length,
    processedNodes: processedNodes,
    chunks: chunksProcessed,
    textNodes: allTextNodes,
    commandId
  };
}

// Helper function to collect all nodes that need to be processed
async function collectNodesToProcess(node, parentPath = [], depth = 0, nodesToProcess = []) {
  // Skip invisible nodes
  if (node.visible === false) return;
  
  // Get the path to this node
  const nodePath = [...parentPath, node.name || `Unnamed ${node.type}`];
  
  // Add this node to the processing list
  nodesToProcess.push({
    node: node,
    parentPath: nodePath,
    depth: depth
  });
  
  // Recursively add children
  if ("children" in node) {
    for (const child of node.children) {
      await collectNodesToProcess(child, nodePath, depth + 1, nodesToProcess);
    }
  }
}

// Process a single text node
async function processTextNode(node, parentPath, depth) {
  if (node.type !== "TEXT") return null;
  
  try {
    // Safely extract font information
    let fontFamily = "";
    let fontStyle = "";

    if (node.fontName) {
      if (typeof node.fontName === "object") {
        if ("family" in node.fontName) fontFamily = node.fontName.family;
        if ("style" in node.fontName) fontStyle = node.fontName.style;
      }
    }

    // Create a safe representation of the text node
    const safeTextNode = {
      id: node.id,
      name: node.name || "Text",
      type: node.type,
      characters: node.characters,
      fontSize: typeof node.fontSize === "number" ? node.fontSize : 0,
      fontFamily: fontFamily,
      fontStyle: fontStyle,
      x: typeof node.x === "number" ? node.x : 0,
      y: typeof node.y === "number" ? node.y : 0,
      width: typeof node.width === "number" ? node.width : 0,
      height: typeof node.height === "number" ? node.height : 0,
      path: parentPath.join(" > "),
      depth: depth,
    };

    // Highlight the node briefly (optional visual feedback)
    try {
      const originalFills = JSON.parse(JSON.stringify(node.fills));
      node.fills = [
        {
          type: "SOLID",
          color: { r: 1, g: 0.5, b: 0 },
          opacity: 0.3,
        },
      ];

      // Brief delay for the highlight to be visible
      await delay(100);
      
      try {
        node.fills = originalFills;
      } catch (err) {
        console.error("Error resetting fills:", err);
      }
    } catch (highlightErr) {
      console.error("Error highlighting text node:", highlightErr);
      // Continue anyway, highlighting is just visual feedback
    }

    return safeTextNode;
  } catch (nodeErr) {
    console.error("Error processing text node:", nodeErr);
    return null;
  }
}

// A delay function that returns a promise
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Keep the original findTextNodes for backward compatibility
async function findTextNodes(node, parentPath = [], depth = 0, textNodes = []) {
  // Skip invisible nodes
  if (node.visible === false) return;

  // Get the path to this node including its name
  const nodePath = [...parentPath, node.name || `Unnamed ${node.type}`];

  if (node.type === "TEXT") {
    try {
      // Safely extract font information to avoid Symbol serialization issues
      let fontFamily = "";
      let fontStyle = "";

      if (node.fontName) {
        if (typeof node.fontName === "object") {
          if ("family" in node.fontName) fontFamily = node.fontName.family;
          if ("style" in node.fontName) fontStyle = node.fontName.style;
        }
      }

      // Create a safe representation of the text node with only serializable properties
      const safeTextNode = {
        id: node.id,
        name: node.name || "Text",
        type: node.type,
        characters: node.characters,
        fontSize: typeof node.fontSize === "number" ? node.fontSize : 0,
        fontFamily: fontFamily,
        fontStyle: fontStyle,
        x: typeof node.x === "number" ? node.x : 0,
        y: typeof node.y === "number" ? node.y : 0,
        width: typeof node.width === "number" ? node.width : 0,
        height: typeof node.height === "number" ? node.height : 0,
        path: nodePath.join(" > "),
        depth: depth,
      };

      // Only highlight the node if it's not being done via API
      try {
        // Safe way to create a temporary highlight without causing serialization issues
        const originalFills = JSON.parse(JSON.stringify(node.fills));
        node.fills = [
          {
            type: "SOLID",
            color: { r: 1, g: 0.5, b: 0 },
            opacity: 0.3,
          },
        ];

        // Promise-based delay instead of setTimeout
        await delay(500);
        
        try {
          node.fills = originalFills;
        } catch (err) {
          console.error("Error resetting fills:", err);
        }
      } catch (highlightErr) {
        console.error("Error highlighting text node:", highlightErr);
        // Continue anyway, highlighting is just visual feedback
      }

      textNodes.push(safeTextNode);
    } catch (nodeErr) {
      console.error("Error processing text node:", nodeErr);
      // Skip this node but continue with others
    }
  }

  // Recursively process children of container nodes
  if ("children" in node) {
    for (const child of node.children) {
      await findTextNodes(child, nodePath, depth + 1, textNodes);
    }
  }
}

// Replace text in a specific node
async function setMultipleTextContents(params) {
  const { nodeId, text } = params || {};
  const commandId = params.commandId || generateCommandId();

  if (!nodeId || !text || !Array.isArray(text)) {
    const errorMsg = "Missing required parameters: nodeId and text array";
    
    // Send error progress update
    sendProgressUpdate(
      commandId,
      'set_multiple_text_contents',
      'error',
      0,
      0,
      0,
      errorMsg,
      { error: errorMsg }
    );
    
    throw new Error(errorMsg);
  }

  console.log(
    `Starting text replacement for node: ${nodeId} with ${text.length} text replacements`
  );
  
  // Send started progress update
  sendProgressUpdate(
    commandId,
    'set_multiple_text_contents',
    'started',
    0,
    text.length,
    0,
    `Starting text replacement for ${text.length} nodes`,
    { totalReplacements: text.length }
  );

  // Define the results array and counters
  const results = [];
  let successCount = 0;
  let failureCount = 0;

  // Split text replacements into chunks of 5
  const CHUNK_SIZE = 5;
  const chunks = [];
  
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }
  
  console.log(`Split ${text.length} replacements into ${chunks.length} chunks`);
  
  // Send chunking info update
  sendProgressUpdate(
    commandId,
    'set_multiple_text_contents',
    'in_progress',
    5, // 5% progress for planning phase
    text.length,
    0,
    `Preparing to replace text in ${text.length} nodes using ${chunks.length} chunks`,
    {
      totalReplacements: text.length,
      chunks: chunks.length,
      chunkSize: CHUNK_SIZE
    }
  );

  // Process each chunk sequentially
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];
    console.log(`Processing chunk ${chunkIndex + 1}/${chunks.length} with ${chunk.length} replacements`);
    
    // Send chunk processing start update
    sendProgressUpdate(
      commandId,
      'set_multiple_text_contents',
      'in_progress',
      Math.round(5 + ((chunkIndex / chunks.length) * 90)), // 5-95% for processing
      text.length,
      successCount + failureCount,
      `Processing text replacements chunk ${chunkIndex + 1}/${chunks.length}`,
      {
        currentChunk: chunkIndex + 1,
        totalChunks: chunks.length,
        successCount,
        failureCount
      }
    );
    
    // Process replacements within a chunk in parallel
    const chunkPromises = chunk.map(async (replacement) => {
      if (!replacement.nodeId || replacement.text === undefined) {
        console.error(`Missing nodeId or text for replacement`);
        return {
          success: false,
          nodeId: replacement.nodeId || "unknown",
          error: "Missing nodeId or text in replacement entry"
        };
      }

      try {
        console.log(`Attempting to replace text in node: ${replacement.nodeId}`);

        // Get the text node to update (just to check it exists and get original text)
        const textNode = await figma.getNodeByIdAsync(replacement.nodeId);

        if (!textNode) {
          console.error(`Text node not found: ${replacement.nodeId}`);
          return {
            success: false,
            nodeId: replacement.nodeId,
            error: `Node not found: ${replacement.nodeId}`
          };
        }

        if (textNode.type !== "TEXT") {
          console.error(`Node is not a text node: ${replacement.nodeId} (type: ${textNode.type})`);
          return {
            success: false,
            nodeId: replacement.nodeId,
            error: `Node is not a text node: ${replacement.nodeId} (type: ${textNode.type})`
          };
        }

        // Save original text for the result
        const originalText = textNode.characters;
        console.log(`Original text: "${originalText}"`);
        console.log(`Will translate to: "${replacement.text}"`);

        // Highlight the node before changing text
        let originalFills;
        try {
          // Save original fills for restoration later
          originalFills = JSON.parse(JSON.stringify(textNode.fills));
          // Apply highlight color (orange with 30% opacity)
          textNode.fills = [
            {
              type: "SOLID",
              color: { r: 1, g: 0.5, b: 0 },
              opacity: 0.3,
            },
          ];
        } catch (highlightErr) {
          console.error(`Error highlighting text node: ${highlightErr.message}`);
          // Continue anyway, highlighting is just visual feedback
        }

        // Use the existing setTextContent function to handle font loading and text setting
        await setTextContent({
          nodeId: replacement.nodeId,
          text: replacement.text
        });

        // Keep highlight for a moment after text change, then restore original fills
        if (originalFills) {
          try {
            // Use delay function for consistent timing
            await delay(500);
            textNode.fills = originalFills;
          } catch (restoreErr) {
            console.error(`Error restoring fills: ${restoreErr.message}`);
          }
        }

        console.log(`Successfully replaced text in node: ${replacement.nodeId}`);
        return {
          success: true,
          nodeId: replacement.nodeId,
          originalText: originalText,
          translatedText: replacement.text
        };
      } catch (error) {
        console.error(`Error replacing text in node ${replacement.nodeId}: ${error.message}`);
        return {
          success: false,
          nodeId: replacement.nodeId,
          error: `Error applying replacement: ${error.message}`
        };
      }
    });

    // Wait for all replacements in this chunk to complete
    const chunkResults = await Promise.all(chunkPromises);
    
    // Process results for this chunk
    chunkResults.forEach(result => {
      if (result.success) {
        successCount++;
      } else {
        failureCount++;
      }
      results.push(result);
    });
    
    // Send chunk processing complete update with partial results
    sendProgressUpdate(
      commandId,
      'set_multiple_text_contents',
      'in_progress',
      Math.round(5 + (((chunkIndex + 1) / chunks.length) * 90)), // 5-95% for processing
      text.length,
      successCount + failureCount,
      `Completed chunk ${chunkIndex + 1}/${chunks.length}. ${successCount} successful, ${failureCount} failed so far.`,
      {
        currentChunk: chunkIndex + 1,
        totalChunks: chunks.length,
        successCount,
        failureCount,
        chunkResults: chunkResults
      }
    );
    
    // Add a small delay between chunks to avoid overloading Figma
    if (chunkIndex < chunks.length - 1) {
      console.log('Pausing between chunks to avoid overloading Figma...');
      await delay(1000); // 1 second delay between chunks
    }
  }

  console.log(
    `Replacement complete: ${successCount} successful, ${failureCount} failed`
  );
  
  // Send completed progress update
  sendProgressUpdate(
    commandId,
    'set_multiple_text_contents',
    'completed',
    100,
    text.length,
    successCount + failureCount,
    `Text replacement complete: ${successCount} successful, ${failureCount} failed`,
    {
      totalReplacements: text.length,
      replacementsApplied: successCount,
      replacementsFailed: failureCount,
      completedInChunks: chunks.length,
      results: results
    }
  );

  return {
    success: successCount > 0,
    nodeId: nodeId,
    replacementsApplied: successCount,
    replacementsFailed: failureCount,
    totalReplacements: text.length,
    results: results,
    completedInChunks: chunks.length,
    commandId
  };
}

// Function to generate simple UUIDs for command IDs
function generateCommandId() {
  return 'cmd_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function setAutoLayout(params) {
  const { 
    nodeId, 
    layoutMode, 
    paddingTop, 
    paddingBottom, 
    paddingLeft, 
    paddingRight, 
    itemSpacing, 
    primaryAxisAlignItems, 
    counterAxisAlignItems, 
    layoutWrap, 
    strokesIncludedInLayout 
  } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (!layoutMode) {
    throw new Error("Missing layoutMode parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  // Check if the node is a frame or group
  if (!("layoutMode" in node)) {
    throw new Error(`Node does not support auto layout: ${nodeId}`);
  }

  // Configure layout mode
  if (layoutMode === "NONE") {
    node.layoutMode = "NONE";
  } else {
    // Set auto layout properties
    node.layoutMode = layoutMode;
    
    // Configure padding if provided
    if (paddingTop !== undefined) node.paddingTop = paddingTop;
    if (paddingBottom !== undefined) node.paddingBottom = paddingBottom;
    if (paddingLeft !== undefined) node.paddingLeft = paddingLeft;
    if (paddingRight !== undefined) node.paddingRight = paddingRight;
    
    // Configure item spacing
    if (itemSpacing !== undefined) node.itemSpacing = itemSpacing;
    
    // Configure alignment
    if (primaryAxisAlignItems !== undefined) {
      node.primaryAxisAlignItems = primaryAxisAlignItems;
    }
    
    if (counterAxisAlignItems !== undefined) {
      node.counterAxisAlignItems = counterAxisAlignItems;
    }
    
    // Configure wrap
    if (layoutWrap !== undefined) {
      node.layoutWrap = layoutWrap;
    }
    
    // Configure stroke inclusion
    if (strokesIncludedInLayout !== undefined) {
      node.strokesIncludedInLayout = strokesIncludedInLayout;
    }
  }

  return {
    id: node.id,
    name: node.name,
    layoutMode: node.layoutMode,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    itemSpacing: node.itemSpacing,
    primaryAxisAlignItems: node.primaryAxisAlignItems,
    counterAxisAlignItems: node.counterAxisAlignItems,
    layoutWrap: node.layoutWrap,
    strokesIncludedInLayout: node.strokesIncludedInLayout
  };
}

// Nuevas funciones para propiedades de texto

async function setFontName(params) {
  const { nodeId, family, style } = params || {};
  if (!nodeId || !family) {
    throw new Error("Missing nodeId or font family");
  }
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }
  
  if (node.type !== "TEXT") {
    throw new Error(`Node is not a text node: ${nodeId}`);
  }
  
  try {
    await figma.loadFontAsync({ family, style: style || "Regular" });
    node.fontName = { family, style: style || "Regular" };
    return {
      id: node.id,
      name: node.name,
      fontName: node.fontName
    };
  } catch (error) {
    throw new Error(`Error setting font name: ${error.message}`);
  }
}

async function setFontSize(params) {
  const { nodeId, fontSize } = params || {};
  if (!nodeId || fontSize === undefined) {
    throw new Error("Missing nodeId or fontSize");
  }
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }
  
  if (node.type !== "TEXT") {
    throw new Error(`Node is not a text node: ${nodeId}`);
  }
  
  try {
    await figma.loadFontAsync(node.fontName);
    node.fontSize = fontSize;
    return {
      id: node.id,
      name: node.name,
      fontSize: node.fontSize
    };
  } catch (error) {
    throw new Error(`Error setting font size: ${error.message}`);
  }
}

async function setFontWeight(params) {
  const { nodeId, weight } = params || {};
  if (!nodeId || weight === undefined) {
    throw new Error("Missing nodeId or weight");
  }
  
  // Map weight to font style
  const getFontStyle = (weight) => {
    switch (weight) {
      case 100: return "Thin";
      case 200: return "Extra Light";
      case 300: return "Light";
      case 400: return "Regular";
      case 500: return "Medium";
      case 600: return "Semi Bold";
      case 700: return "Bold";
      case 800: return "Extra Bold";
      case 900: return "Black";
      default: return "Regular";
    }
  };
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }
  
  if (node.type !== "TEXT") {
    throw new Error(`Node is not a text node: ${nodeId}`);
  }
  
  try {
    const family = node.fontName.family;
    const style = getFontStyle(weight);
    await figma.loadFontAsync({ family, style });
    node.fontName = { family, style };
    return {
      id: node.id,
      name: node.name,
      fontName: node.fontName,
      weight: weight
    };
  } catch (error) {
    throw new Error(`Error setting font weight: ${error.message}`);
  }
}

async function setLetterSpacing(params) {
  const { nodeId, letterSpacing, unit = "PIXELS" } = params || {};
  if (!nodeId || letterSpacing === undefined) {
    throw new Error("Missing nodeId or letterSpacing");
  }
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }
  
  if (node.type !== "TEXT") {
    throw new Error(`Node is not a text node: ${nodeId}`);
  }
  
  try {
    await figma.loadFontAsync(node.fontName);
    node.letterSpacing = { value: letterSpacing, unit };
    return {
      id: node.id,
      name: node.name,
      letterSpacing: node.letterSpacing
    };
  } catch (error) {
    throw new Error(`Error setting letter spacing: ${error.message}`);
  }
}

async function setLineHeight(params) {
  const { nodeId, lineHeight, unit = "PIXELS" } = params || {};
  if (!nodeId || lineHeight === undefined) {
    throw new Error("Missing nodeId or lineHeight");
  }
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }
  
  if (node.type !== "TEXT") {
    throw new Error(`Node is not a text node: ${nodeId}`);
  }
  
  try {
    await figma.loadFontAsync(node.fontName);
    node.lineHeight = { value: lineHeight, unit };
    return {
      id: node.id,
      name: node.name,
      lineHeight: node.lineHeight
    };
  } catch (error) {
    throw new Error(`Error setting line height: ${error.message}`);
  }
}

async function setParagraphSpacing(params) {
  const { nodeId, paragraphSpacing } = params || {};
  if (!nodeId || paragraphSpacing === undefined) {
    throw new Error("Missing nodeId or paragraphSpacing");
  }
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }
  
  if (node.type !== "TEXT") {
    throw new Error(`Node is not a text node: ${nodeId}`);
  }
  
  try {
    await figma.loadFontAsync(node.fontName);
    node.paragraphSpacing = paragraphSpacing;
    return {
      id: node.id,
      name: node.name,
      paragraphSpacing: node.paragraphSpacing
    };
  } catch (error) {
    throw new Error(`Error setting paragraph spacing: ${error.message}`);
  }
}

async function setTextCase(params) {
  const { nodeId, textCase } = params || {};
  if (!nodeId || textCase === undefined) {
    throw new Error("Missing nodeId or textCase");
  }
  
  // Valid textCase values: "ORIGINAL", "UPPER", "LOWER", "TITLE"
  if (!["ORIGINAL", "UPPER", "LOWER", "TITLE"].includes(textCase)) {
    throw new Error("Invalid textCase value. Must be one of: ORIGINAL, UPPER, LOWER, TITLE");
  }
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }
  
  if (node.type !== "TEXT") {
    throw new Error(`Node is not a text node: ${nodeId}`);
  }
  
  try {
    await figma.loadFontAsync(node.fontName);
    node.textCase = textCase;
    return {
      id: node.id,
      name: node.name,
      textCase: node.textCase
    };
  } catch (error) {
    throw new Error(`Error setting text case: ${error.message}`);
  }
}

async function setTextDecoration(params) {
  const { nodeId, textDecoration } = params || {};
  if (!nodeId || textDecoration === undefined) {
    throw new Error("Missing nodeId or textDecoration");
  }
  
  // Valid textDecoration values: "NONE", "UNDERLINE", "STRIKETHROUGH"
  if (!["NONE", "UNDERLINE", "STRIKETHROUGH"].includes(textDecoration)) {
    throw new Error("Invalid textDecoration value. Must be one of: NONE, UNDERLINE, STRIKETHROUGH");
  }
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }
  
  if (node.type !== "TEXT") {
    throw new Error(`Node is not a text node: ${nodeId}`);
  }
  
  try {
    await figma.loadFontAsync(node.fontName);
    node.textDecoration = textDecoration;
    return {
      id: node.id,
      name: node.name,
      textDecoration: node.textDecoration
    };
  } catch (error) {
    throw new Error(`Error setting text decoration: ${error.message}`);
  }
}

async function getStyledTextSegments(params) {
  const { nodeId, property } = params || {};
  if (!nodeId || !property) {
    throw new Error("Missing nodeId or property");
  }
  
  // Valid properties: "fillStyleId", "fontName", "fontSize", "textCase", 
  // "textDecoration", "textStyleId", "fills", "letterSpacing", "lineHeight", "fontWeight"
  const validProperties = [
    "fillStyleId", "fontName", "fontSize", "textCase", 
    "textDecoration", "textStyleId", "fills", "letterSpacing", 
    "lineHeight", "fontWeight"
  ];
  
  if (!validProperties.includes(property)) {
    throw new Error(`Invalid property. Must be one of: ${validProperties.join(", ")}`);
  }
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }
  
  if (node.type !== "TEXT") {
    throw new Error(`Node is not a text node: ${nodeId}`);
  }
  
  try {
    const segments = node.getStyledTextSegments([property]);
    
    // Prepare segments data in a format safe for serialization
    const safeSegments = segments.map(segment => {
      const safeSegment = {
        characters: segment.characters,
        start: segment.start,
        end: segment.end
      };
      
      // Handle different property types for safe serialization
      if (property === "fontName") {
        if (segment[property] && typeof segment[property] === "object") {
          safeSegment[property] = {
            family: segment[property].family || "",
            style: segment[property].style || ""
          };
        } else {
          safeSegment[property] = { family: "", style: "" };
        }
      } else if (property === "letterSpacing" || property === "lineHeight") {
        // Handle spacing properties which have a value and unit
        if (segment[property] && typeof segment[property] === "object") {
          safeSegment[property] = {
            value: segment[property].value || 0,
            unit: segment[property].unit || "PIXELS"
          };
        } else {
          safeSegment[property] = { value: 0, unit: "PIXELS" };
        }
      } else if (property === "fills") {
        // Handle fills which can be complex
        safeSegment[property] = segment[property] ? JSON.parse(JSON.stringify(segment[property])) : [];
      } else {
        // Handle simple properties
        safeSegment[property] = segment[property];
      }
      
      return safeSegment;
    });
    
    return {
      id: node.id,
      name: node.name,
      property: property,
      segments: safeSegments
    };
  } catch (error) {
    throw new Error(`Error getting styled text segments: ${error.message}`);
  }
}

async function loadFontAsyncWrapper(params) {
  const { family, style = "Regular" } = params || {};
  if (!family) {
    throw new Error("Missing font family");
  }
  
  try {
    await figma.loadFontAsync({ family, style });
    return {
      success: true,
      family: family,
      style: style,
      message: `Successfully loaded ${family} ${style}`
    };
  } catch (error) {
    throw new Error(`Error loading font: ${error.message}`);
  }
}

async function getRemoteComponents() {
  try {
    // Check if figma.teamLibrary is available
    if (!figma.teamLibrary) {
      console.error("Error: figma.teamLibrary API is not available");
      throw new Error("The figma.teamLibrary API is not available in this context");
    }
    
    // Check if figma.teamLibrary.getAvailableComponentsAsync exists
    if (!figma.teamLibrary.getAvailableComponentsAsync) {
      console.error("Error: figma.teamLibrary.getAvailableComponentsAsync is not available");
      throw new Error("The getAvailableComponentsAsync method is not available");
    }
    
    console.log("Starting remote components retrieval...");
    
    // Set up a manual timeout to detect deadlocks
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Internal timeout while retrieving remote components (15s)"));
      }, 15000); // 15 seconds internal timeout
    });
    
    // Execute the request with a manual timeout
    const fetchPromise = figma.teamLibrary.getAvailableComponentsAsync();
    
    // Use Promise.race to implement the timeout
    const teamComponents = await Promise.race([fetchPromise, timeoutPromise])
      .finally(() => {
        clearTimeout(timeoutId); // Clear the timeout
      });
    
    console.log(`Retrieved ${teamComponents.length} remote components`);
    
    return {
      success: true,
      count: teamComponents.length,
      components: teamComponents.map(component => ({
        key: component.key,
        name: component.name,
        description: component.description || "",
        libraryName: component.libraryName
      }))
    };
  } catch (error) {
    console.error(`Detailed error retrieving remote components: ${error.message || "Unknown error"}`);
    console.error(`Stack trace: ${error.stack || "Not available"}`);
    
    // Instead of returning an error object, throw an exception with the error message
    throw new Error(`Error retrieving remote components: ${error.message}`);
  }
}

// Set Effects Tool
async function setEffects(params) {
  const { nodeId, effects } = params || {};
  
  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }
  
  if (!effects || !Array.isArray(effects)) {
    throw new Error("Missing or invalid effects parameter. Must be an array.");
  }
  
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }
  
  if (!("effects" in node)) {
    throw new Error(`Node does not support effects: ${nodeId}`);
  }
  
  try {
    // Convert incoming effects to valid Figma effects
    const validEffects = effects.map(effect => {
      // Ensure all effects have the required properties
      if (!effect.type) {
        throw new Error("Each effect must have a type property");
      }
      
      // Create a clean effect object based on type
      switch (effect.type) {
        case "DROP_SHADOW":
        case "INNER_SHADOW":
          return {
            type: effect.type,
            color: effect.color || { r: 0, g: 0, b: 0, a: 0.5 },
            offset: effect.offset || { x: 0, y: 0 },
            radius: effect.radius || 5,
            spread: effect.spread || 0,
            visible: effect.visible !== undefined ? effect.visible : true,
            blendMode: effect.blendMode || "NORMAL"
          };
        case "LAYER_BLUR":
        case "BACKGROUND_BLUR":
          return {
            type: effect.type,
            radius: effect.radius || 5,
            visible: effect.visible !== undefined ? effect.visible : true
          };
        default:
          throw new Error(`Unsupported effect type: ${effect.type}`);
      }
    });
    
    // Apply the effects to the node
    node.effects = validEffects;
    
    return {
      id: node.id,
      name: node.name,
      effects: node.effects
    };
  } catch (error) {
    throw new Error(`Error setting effects: ${error.message}`);
  }
}

// Set Effect Style ID Tool
async function setEffectStyleId(params) {
  const { nodeId, effectStyleId } = params || {};
  
  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }
  
  if (!effectStyleId) {
    throw new Error("Missing effectStyleId parameter");
  }
  
  try {
    // Set up a manual timeout to detect long operations
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Timeout while setting effect style ID (8s). The operation took too long to complete."));
      }, 8000); // 8 seconds timeout
    });
    
    console.log(`Starting to set effect style ID ${effectStyleId} on node ${nodeId}...`);
    
    // Get node and validate in a promise
    const nodePromise = (async () => {
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      
      if (!("effectStyleId" in node)) {
        throw new Error(`Node with ID ${nodeId} does not support effect styles`);
      }
      
      // Try to validate the effect style exists before applying
      console.log(`Fetching effect styles to validate style ID: ${effectStyleId}`);
      const effectStyles = await figma.getLocalEffectStylesAsync();
      const foundStyle = effectStyles.find(style => style.id === effectStyleId);
      
      if (!foundStyle) {
        throw new Error(`Effect style not found with ID: ${effectStyleId}. Available styles: ${effectStyles.length}`);
      }
      
      console.log(`Effect style found, applying to node...`);
      
      // Apply the effect style to the node
      node.effectStyleId = effectStyleId;
      
      return {
        id: node.id,
        name: node.name,
        effectStyleId: node.effectStyleId,
        appliedEffects: node.effects
      };
    })();
    
    // Race between the node operation and the timeout
    const result = await Promise.race([nodePromise, timeoutPromise])
      .finally(() => {
        // Clear the timeout to prevent memory leaks
        clearTimeout(timeoutId);
      });
    
    console.log(`Successfully set effect style ID on node ${nodeId}`);
    return result;
  } catch (error) {
    console.error(`Error setting effect style ID: ${error.message || "Unknown error"}`);
    console.error(`Stack trace: ${error.stack || "Not available"}`);
    
    // Proporcionar mensajes de error específicos para diferentes casos
    if (error.message.includes("timeout") || error.message.includes("Timeout")) {
      throw new Error(`The operation timed out after 8 seconds. This could happen with complex nodes or effects. Try with a simpler node or effect style.`);
    } else if (error.message.includes("not found") && error.message.includes("Node")) {
      throw new Error(`Node with ID "${nodeId}" not found. Make sure the node exists in the current document.`);
    } else if (error.message.includes("not found") && error.message.includes("style")) {
      throw new Error(`Effect style with ID "${effectStyleId}" not found. Make sure the style exists in your local styles.`);
    } else if (error.message.includes("does not support")) {
      throw new Error(`The selected node type does not support effect styles. Only certain node types like frames, components, and instances can have effect styles.`);
    } else {
      throw new Error(`Error setting effect style ID: ${error.message}`);
    }
  }
}

// Function to group nodes
async function groupNodes(params) {
  const { nodeIds, name } = params || {};
  
  if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length < 2) {
    throw new Error("Must provide at least two nodeIds to group");
  }
  
  try {
    // Get all nodes to be grouped
    const nodesToGroup = [];
    for (const nodeId of nodeIds) {
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node) {
        throw new Error(`Node not found with ID: ${nodeId}`);
      }
      nodesToGroup.push(node);
    }
    
    // Verify that all nodes have the same parent
    const parent = nodesToGroup[0].parent;
    for (const node of nodesToGroup) {
      if (node.parent !== parent) {
        throw new Error("All nodes must have the same parent to be grouped");
      }
    }
    
    // Create a group and add the nodes to it
    const group = figma.group(nodesToGroup, parent);
    
    // Optionally set a name for the group
    if (name) {
      group.name = name;
    }
    
    return {
      id: group.id,
      name: group.name,
      type: group.type,
      children: group.children.map(child => ({ id: child.id, name: child.name, type: child.type }))
    };
  } catch (error) {
    throw new Error(`Error grouping nodes: ${error.message}`);
  }
}

// Function to ungroup nodes
async function ungroupNodes(params) {
  const { nodeId } = params || {};
  
  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }
  
  try {
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) {
      throw new Error(`Node not found with ID: ${nodeId}`);
    }
    
    // Verify that the node is a group or a frame
    if (node.type !== "GROUP" && node.type !== "FRAME") {
      throw new Error(`Node with ID ${nodeId} is not a GROUP or FRAME`);
    }
    
    // Get the parent and children before ungrouping
    const parent = node.parent;
    const children = [...node.children];
    
    // Ungroup the node
    const ungroupedItems = figma.ungroup(node);
    
    return {
      success: true,
      ungroupedCount: ungroupedItems.length,
      items: ungroupedItems.map(item => ({ id: item.id, name: item.name, type: item.type }))
    };
  } catch (error) {
    throw new Error(`Error ungrouping node: ${error.message}`);
  }
}

// Function to flatten nodes (e.g., boolean operations, convert to path)
async function flattenNode(params) {
  const { nodeId } = params || {};
  
  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }
  
  try {
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) {
      throw new Error(`Node not found with ID: ${nodeId}`);
    }
    
    // Check for specific node types that can be flattened
    const flattenableTypes = ["VECTOR", "BOOLEAN_OPERATION", "STAR", "POLYGON", "ELLIPSE", "RECTANGLE"];
    
    if (!flattenableTypes.includes(node.type)) {
      throw new Error(`Node with ID ${nodeId} and type ${node.type} cannot be flattened. Only vector-based nodes can be flattened.`);
    }
    
    // Verify the node has the flatten method before calling it
    if (typeof node.flatten !== 'function') {
      throw new Error(`Node with ID ${nodeId} does not support the flatten operation.`);
    }
    
    // Implement a timeout mechanism
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Flatten operation timed out after 8 seconds. The node may be too complex."));
      }, 8000); // 8 seconds timeout
    });
    
    // Execute the flatten operation in a promise
    const flattenPromise = new Promise((resolve, reject) => {
      // Execute in the next tick to allow UI updates
      setTimeout(() => {
        try {
          console.log(`Starting flatten operation for node ID ${nodeId}...`);
          const flattened = node.flatten();
          console.log(`Flatten operation completed successfully for node ID ${nodeId}`);
          resolve(flattened);
        } catch (err) {
          console.error(`Error during flatten operation: ${err.message}`);
          reject(err);
        }
      }, 0);
    });
    
    // Race between the timeout and the operation
    const flattened = await Promise.race([flattenPromise, timeoutPromise])
      .finally(() => {
        // Clear the timeout to prevent memory leaks
        clearTimeout(timeoutId);
      });
    
    return {
      id: flattened.id,
      name: flattened.name,
      type: flattened.type
    };
  } catch (error) {
    console.error(`Error in flattenNode: ${error.message}`);
    if (error.message.includes("timed out")) {
      // Provide a more helpful message for timeout errors
      throw new Error(`The flatten operation timed out. This usually happens with complex nodes. Try simplifying the node first or breaking it into smaller parts.`);
    } else {
      throw new Error(`Error flattening node: ${error.message}`);
    }
  }
}

// Function to insert a child into a parent node
async function insertChild(params) {
  const { parentId, childId, index } = params || {};
  
  if (!parentId) {
    throw new Error("Missing parentId parameter");
  }
  
  if (!childId) {
    throw new Error("Missing childId parameter");
  }
  
  try {
    // Get the parent and child nodes
    const parent = await figma.getNodeByIdAsync(parentId);
    if (!parent) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    
    const child = await figma.getNodeByIdAsync(childId);
    if (!child) {
      throw new Error(`Child node not found with ID: ${childId}`);
    }
    
    // Check if the parent can have children
    if (!("appendChild" in parent)) {
      throw new Error(`Parent node with ID ${parentId} cannot have children`);
    }
    
    // Save child's current parent for proper handling
    const originalParent = child.parent;
    
    // Insert the child at the specified index or append it
    if (index !== undefined && index >= 0 && index <= parent.children.length) {
      parent.insertChild(index, child);
    } else {
      parent.appendChild(child);
    }
    
    // Verify that the insertion worked
    const newIndex = parent.children.indexOf(child);
    
    return {
      parentId: parent.id,
      childId: child.id,
      index: newIndex,
      success: newIndex !== -1,
      previousParentId: originalParent ? originalParent.id : null
    };
  } catch (error) {
    console.error(`Error inserting child: ${error.message}`, error);
    throw new Error(`Error inserting child: ${error.message}`);
  }
}

async function createEllipse(params) {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    name = "Ellipse",
    parentId,
    fillColor = { r: 0.8, g: 0.8, b: 0.8, a: 1 },
    strokeColor,
    strokeWeight
  } = params || {};

  // Create a new ellipse node
  const ellipse = figma.createEllipse();
  ellipse.name = name;
  
  // Position and size the ellipse
  ellipse.x = x;
  ellipse.y = y;
  ellipse.resize(width, height);
  
  // Set fill color if provided
  if (fillColor) {
    const fillStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(fillColor.r) || 0,
        g: parseFloat(fillColor.g) || 0,
        b: parseFloat(fillColor.b) || 0,
      },
      opacity: parseFloat(fillColor.a) || 1
    };
    ellipse.fills = [fillStyle];
  }
  
  // Set stroke color and weight if provided
  if (strokeColor) {
    const strokeStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(strokeColor.r) || 0,
        g: parseFloat(strokeColor.g) || 0,
        b: parseFloat(strokeColor.b) || 0,
      },
      opacity: parseFloat(strokeColor.a) || 1
    };
    ellipse.strokes = [strokeStyle];
    
    if (strokeWeight) {
      ellipse.strokeWeight = strokeWeight;
    }
  }

  // If parentId is provided, append to that node, otherwise append to current page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    parentNode.appendChild(ellipse);
  } else {
    figma.currentPage.appendChild(ellipse);
  }
  
  return {
    id: ellipse.id,
    name: ellipse.name,
    type: ellipse.type,
    x: ellipse.x,
    y: ellipse.y,
    width: ellipse.width,
    height: ellipse.height
  };
}

async function createPolygon(params) {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    sides = 6,
    name = "Polygon",
    parentId,
    fillColor,
    strokeColor,
    strokeWeight
  } = params || {};

  // Create the polygon
  const polygon = figma.createPolygon();
  polygon.x = x;
  polygon.y = y;
  polygon.resize(width, height);
  polygon.name = name;
  
  // Set the number of sides
  if (sides >= 3) {
    polygon.pointCount = sides;
  }

  // Set fill color if provided
  if (fillColor) {
    const paintStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(fillColor.r) || 0,
        g: parseFloat(fillColor.g) || 0,
        b: parseFloat(fillColor.b) || 0,
      },
      opacity: parseFloat(fillColor.a) || 1,
    };
    polygon.fills = [paintStyle];
  }

  // Set stroke color and weight if provided
  if (strokeColor) {
    const strokeStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(strokeColor.r) || 0,
        g: parseFloat(strokeColor.g) || 0,
        b: parseFloat(strokeColor.b) || 0,
      },
      opacity: parseFloat(strokeColor.a) || 1,
    };
    polygon.strokes = [strokeStyle];
  }

  // Set stroke weight if provided
  if (strokeWeight !== undefined) {
    polygon.strokeWeight = strokeWeight;
  }

  // If parentId is provided, append to that node, otherwise append to current page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    parentNode.appendChild(polygon);
  } else {
    figma.currentPage.appendChild(polygon);
  }

  return {
    id: polygon.id,
    name: polygon.name,
    type: polygon.type,
    x: polygon.x,
    y: polygon.y,
    width: polygon.width,
    height: polygon.height,
    pointCount: polygon.pointCount,
    fills: polygon.fills,
    strokes: polygon.strokes,
    strokeWeight: polygon.strokeWeight,
    parentId: polygon.parent ? polygon.parent.id : undefined,
  };
}

async function createStar(params) {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    points = 5,
    innerRadius = 0.5, // As a proportion of the outer radius
    name = "Star",
    parentId,
    fillColor,
    strokeColor,
    strokeWeight
  } = params || {};

  // Create the star
  const star = figma.createStar();
  star.x = x;
  star.y = y;
  star.resize(width, height);
  star.name = name;
  
  // Set the number of points
  if (points >= 3) {
    star.pointCount = points;
  }

  // Set the inner radius ratio
  if (innerRadius > 0 && innerRadius < 1) {
    star.innerRadius = innerRadius;
  }

  // Set fill color if provided
  if (fillColor) {
    const paintStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(fillColor.r) || 0,
        g: parseFloat(fillColor.g) || 0,
        b: parseFloat(fillColor.b) || 0,
      },
      opacity: parseFloat(fillColor.a) || 1,
    };
    star.fills = [paintStyle];
  }

  // Set stroke color and weight if provided
  if (strokeColor) {
    const strokeStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(strokeColor.r) || 0,
        g: parseFloat(strokeColor.g) || 0,
        b: parseFloat(strokeColor.b) || 0,
      },
      opacity: parseFloat(strokeColor.a) || 1,
    };
    star.strokes = [strokeStyle];
  }

  // Set stroke weight if provided
  if (strokeWeight !== undefined) {
    star.strokeWeight = strokeWeight;
  }

  // If parentId is provided, append to that node, otherwise append to current page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    parentNode.appendChild(star);
  } else {
    figma.currentPage.appendChild(star);
  }

  return {
    id: star.id,
    name: star.name,
    type: star.type,
    x: star.x,
    y: star.y,
    width: star.width,
    height: star.height,
    pointCount: star.pointCount,
    innerRadius: star.innerRadius,
    fills: star.fills,
    strokes: star.strokes,
    strokeWeight: star.strokeWeight,
    parentId: star.parent ? star.parent.id : undefined,
  };
}

async function createVector(params) {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    name = "Vector",
    parentId,
    vectorPaths = [],
    fillColor,
    strokeColor,
    strokeWeight
  } = params || {};

  // Create the vector
  const vector = figma.createVector();
  vector.x = x;
  vector.y = y;
  vector.resize(width, height);
  vector.name = name;

  // Set vector paths if provided
  if (vectorPaths && vectorPaths.length > 0) {
    vector.vectorPaths = vectorPaths.map(path => {
      return {
        windingRule: path.windingRule || "EVENODD",
        data: path.data || ""
      };
    });
  }

  // Set fill color if provided
  if (fillColor) {
    const paintStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(fillColor.r) || 0,
        g: parseFloat(fillColor.g) || 0,
        b: parseFloat(fillColor.b) || 0,
      },
      opacity: parseFloat(fillColor.a) || 1,
    };
    vector.fills = [paintStyle];
  }

  // Set stroke color and weight if provided
  if (strokeColor) {
    const strokeStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(strokeColor.r) || 0,
        g: parseFloat(strokeColor.g) || 0,
        b: parseFloat(strokeColor.b) || 0,
      },
      opacity: parseFloat(strokeColor.a) || 1,
    };
    vector.strokes = [strokeStyle];
  }

  // Set stroke weight if provided
  if (strokeWeight !== undefined) {
    vector.strokeWeight = strokeWeight;
  }

  // If parentId is provided, append to that node, otherwise append to current page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    parentNode.appendChild(vector);
  } else {
    figma.currentPage.appendChild(vector);
  }

  return {
    id: vector.id,
    name: vector.name,
    type: vector.type,
    x: vector.x,
    y: vector.y,
    width: vector.width,
    height: vector.height,
    vectorNetwork: vector.vectorNetwork,
    fills: vector.fills,
    strokes: vector.strokes,
    strokeWeight: vector.strokeWeight,
    parentId: vector.parent ? vector.parent.id : undefined,
  };
}

async function createLine(params) {
  const {
    x1 = 0,
    y1 = 0,
    x2 = 100,
    y2 = 0,
    name = "Line",
    parentId,
    strokeColor = { r: 0, g: 0, b: 0, a: 1 },
    strokeWeight = 1,
    strokeCap = "NONE" // Can be "NONE", "ROUND", "SQUARE", "ARROW_LINES", or "ARROW_EQUILATERAL"
  } = params || {};

  // Create a vector node to represent the line
  const line = figma.createVector();
  line.name = name;
  
  // Position the line at the starting point
  line.x = x1;
  line.y = y1;
  
  // Calculate the vector size
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  line.resize(width > 0 ? width : 1, height > 0 ? height : 1);
  
  // Create vector path data for a straight line
  // SVG path data format: M (move to) starting point, L (line to) ending point
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  // Calculate relative endpoint coordinates in the vector's local coordinate system
  const endX = dx > 0 ? width : 0;
  const endY = dy > 0 ? height : 0;
  const startX = dx > 0 ? 0 : width;
  const startY = dy > 0 ? 0 : height;
  
  // Generate SVG path data for the line
  const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
  
  // Set vector paths
  line.vectorPaths = [{
    windingRule: "NONZERO",
    data: pathData
  }];
  
  // Set stroke color
  const strokeStyle = {
    type: "SOLID",
    color: {
      r: parseFloat(strokeColor.r) || 0,
      g: parseFloat(strokeColor.g) || 0,
      b: parseFloat(strokeColor.b) || 0,
    },
    opacity: parseFloat(strokeColor.a) || 1
  };
  line.strokes = [strokeStyle];
  
  // Set stroke weight
  line.strokeWeight = strokeWeight;
  
  // Set stroke cap style if supported
  if (["NONE", "ROUND", "SQUARE", "ARROW_LINES", "ARROW_EQUILATERAL"].includes(strokeCap)) {
    line.strokeCap = strokeCap;
  }
  
  // Set fill to none (transparent) as lines typically don't have fills
  line.fills = [];
  
  // If parentId is provided, append to that node, otherwise append to current page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    parentNode.appendChild(line);
  } else {
    figma.currentPage.appendChild(line);
  }
  
  return {
    id: line.id,
    name: line.name,
    type: line.type,
    x: line.x,
    y: line.y,
    width: line.width,
    height: line.height,
    strokeWeight: line.strokeWeight,
    strokeCap: line.strokeCap,
    strokes: line.strokes,
    vectorPaths: line.vectorPaths,
    parentId: line.parent ? line.parent.id : undefined
  };
}

// Page management functions

async function createPage(params) {
  const { name = "New Page" } = params || {};

  const page = figma.createPage();
  page.name = name;

  return {
    id: page.id,
    name: page.name,
    type: page.type,
    childCount: page.children.length
  };
}

async function getPages() {
  const pages = figma.root.children;

  return {
    pages: pages.map(page => ({
      id: page.id,
      name: page.name,
      type: page.type,
      childCount: page.children.length,
      isCurrent: page.id === figma.currentPage.id
    })),
    currentPageId: figma.currentPage.id,
    totalPages: pages.length
  };
}

async function setCurrentPage(params) {
  const { pageId } = params || {};

  if (!pageId) {
    throw new Error("Missing pageId parameter");
  }

  const page = await figma.getNodeByIdAsync(pageId);

  if (!page) {
    throw new Error(`Page not found with ID: ${pageId}`);
  }

  if (page.type !== "PAGE") {
    throw new Error(`Node is not a page: ${pageId}`);
  }

  figma.currentPage = page;

  return {
    id: page.id,
    name: page.name,
    type: page.type,
    success: true
  };
}

async function deletePage(params) {
  const { pageId } = params || {};

  if (!pageId) {
    throw new Error("Missing pageId parameter");
  }

  // Cannot delete the last page
  if (figma.root.children.length <= 1) {
    throw new Error("Cannot delete the last page in the document");
  }

  const page = await figma.getNodeByIdAsync(pageId);

  if (!page) {
    throw new Error(`Page not found with ID: ${pageId}`);
  }

  if (page.type !== "PAGE") {
    throw new Error(`Node is not a page: ${pageId}`);
  }

  const pageName = page.name;

  // If deleting current page, switch to another page first
  if (figma.currentPage.id === pageId) {
    const otherPage = figma.root.children.find(p => p.id !== pageId);
    if (otherPage) {
      figma.currentPage = otherPage;
    }
  }

  page.remove();

  return {
    success: true,
    deletedPageId: pageId,
    deletedPageName: pageName
  };
}

// ============================================
// ADVANCED TOOLS - Batch, Gradients, Layer Ordering, Viewport
// ============================================

// Batch create multiple elements
async function createElements(params) {
  const { elements = [], nestInFirstFrame = false, groupResult = false } = params || {};

  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    throw new Error("Elements array is required and must not be empty");
  }

  const created = [];
  const createdNodes = []; // Keep references for grouping
  const failed = [];
  let parentFrame = null;
  let parentFrameId = null;

  // Check if first element is a frame for nesting
  if (nestInFirstFrame && elements[0] && elements[0].type === "frame") {
    // We'll set parentFrame after creating the first element
  }

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    try {
      let node;

      switch (el.type) {
        case "rectangle":
          node = figma.createRectangle();
          node.x = el.x || 0;
          node.y = el.y || 0;
          node.resize(el.width || 100, el.height || 100);
          if (el.cornerRadius) {
            node.cornerRadius = el.cornerRadius;
          }
          break;

        case "frame":
          node = figma.createFrame();
          node.x = el.x || 0;
          node.y = el.y || 0;
          node.resize(el.width || 100, el.height || 100);
          if (el.cornerRadius) {
            node.cornerRadius = el.cornerRadius;
          }
          break;

        case "ellipse":
          node = figma.createEllipse();
          node.x = el.x || 0;
          node.y = el.y || 0;
          node.resize(el.width || 100, el.height || 100);
          break;

        case "text":
          node = figma.createText();
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          node.x = el.x || 0;
          node.y = el.y || 0;
          node.characters = el.text || "Text";
          if (el.fontSize) {
            node.fontSize = el.fontSize;
          }
          if (el.fontWeight) {
            const style = el.fontWeight >= 700 ? "Bold" : el.fontWeight >= 500 ? "Medium" : "Regular";
            await figma.loadFontAsync({ family: "Inter", style });
            node.fontName = { family: "Inter", style };
          }
          break;

        case "line":
          node = figma.createVector();
          const x1 = el.x || 0;
          const y1 = el.y || 0;
          const x2 = el.x2 !== undefined ? el.x2 : x1 + 100;
          const y2 = el.y2 !== undefined ? el.y2 : y1;

          node.x = Math.min(x1, x2);
          node.y = Math.min(y1, y2);

          const width = Math.abs(x2 - x1) || 1;
          const height = Math.abs(y2 - y1) || 1;
          node.resize(width, height);

          const dx = x2 - x1;
          const dy = y2 - y1;
          const endX = dx >= 0 ? width : 0;
          const endY = dy >= 0 ? height : 0;
          const startX = dx >= 0 ? 0 : width;
          const startY = dy >= 0 ? 0 : height;

          node.vectorPaths = [{
            windingRule: "NONZERO",
            data: `M ${startX} ${startY} L ${endX} ${endY}`
          }];
          node.fills = [];
          break;

        default:
          throw new Error(`Unknown element type: ${el.type}`);
      }

      node.name = el.name || `${el.type}-${i}`;

      // Apply fill color
      if (el.fillColor && node.fills !== undefined) {
        node.fills = [{
          type: "SOLID",
          color: {
            r: el.fillColor.r || 0,
            g: el.fillColor.g || 0,
            b: el.fillColor.b || 0
          },
          opacity: el.fillColor.a !== undefined ? el.fillColor.a : 1
        }];
      }

      // Apply stroke
      if (el.strokeColor) {
        node.strokes = [{
          type: "SOLID",
          color: {
            r: el.strokeColor.r || 0,
            g: el.strokeColor.g || 0,
            b: el.strokeColor.b || 0
          },
          opacity: el.strokeColor.a !== undefined ? el.strokeColor.a : 1
        }];
        node.strokeWeight = el.strokeWeight || 1;
      }

      // Apply stroke cap for lines
      if (el.type === "line" && el.strokeCap) {
        node.strokeCap = el.strokeCap;
      }

      // Determine parent for this node
      let targetParent = null;

      if (el.parentId) {
        // Explicit parent ID takes priority
        targetParent = await figma.getNodeByIdAsync(el.parentId);
      } else if (nestInFirstFrame && i > 0 && parentFrame) {
        // Nest in first frame (for elements after the first one)
        targetParent = parentFrame;
      }

      // Append to determined parent or current page
      if (targetParent && "appendChild" in targetParent) {
        targetParent.appendChild(node);
      } else {
        figma.currentPage.appendChild(node);
      }

      // Store reference to first frame for nesting
      if (nestInFirstFrame && i === 0 && el.type === "frame") {
        parentFrame = node;
        parentFrameId = node.id;
      }

      created.push({
        id: node.id,
        name: node.name,
        type: node.type
      });
      createdNodes.push(node);

    } catch (error) {
      failed.push({
        index: i,
        error: error.message || String(error)
      });
    }
  }

  // Group result if requested (and not nesting in frame)
  let groupId = null;
  if (groupResult && createdNodes.length > 1 && !nestInFirstFrame) {
    try {
      const group = figma.group(createdNodes, figma.currentPage);
      group.name = "Batch Group";
      groupId = group.id;
    } catch (error) {
      // Grouping failed, but elements were still created
      console.error("Failed to group elements:", error);
    }
  }

  return {
    created,
    failed,
    totalCreated: created.length,
    totalFailed: failed.length,
    parentFrameId,
    groupId
  };
}

// Set gradient fill on a node
async function setGradientFill(params) {
  const { nodeId, gradientType, stops, angle = 0 } = params || {};

  if (!nodeId) throw new Error("Missing nodeId parameter");
  if (!gradientType) throw new Error("Missing gradientType parameter");
  if (!stops || !Array.isArray(stops) || stops.length < 2) {
    throw new Error("At least 2 gradient stops are required");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) throw new Error(`Node not found: ${nodeId}`);
  if (!("fills" in node)) throw new Error("Node does not support fills");

  // Convert angle to transform matrix for linear gradient
  // Figma uses a 2D transformation matrix for gradient positioning
  const angleRad = (angle * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  // Create gradient stops
  const gradientStops = stops.map(stop => ({
    position: stop.position,
    color: {
      r: stop.color.r || 0,
      g: stop.color.g || 0,
      b: stop.color.b || 0,
      a: stop.color.a !== undefined ? stop.color.a : 1
    }
  }));

  // Create the gradient fill
  const gradientFill = {
    type: `GRADIENT_${gradientType}`,
    gradientStops,
    gradientTransform: [
      [cos, sin, 0.5 - cos * 0.5 - sin * 0.5],
      [-sin, cos, 0.5 + sin * 0.5 - cos * 0.5]
    ]
  };

  node.fills = [gradientFill];

  return {
    name: node.name,
    id: node.id,
    gradientType,
    stopsCount: stops.length
  };
}

// Set layer order (bring to front, send to back, etc.)
async function setLayerOrder(params) {
  const { nodeId, order } = params || {};

  if (!nodeId) throw new Error("Missing nodeId parameter");
  if (!order) throw new Error("Missing order parameter");

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) throw new Error(`Node not found: ${nodeId}`);

  const parent = node.parent;
  if (!parent || !("children" in parent)) {
    throw new Error("Node has no parent with children");
  }

  const siblings = parent.children;
  const currentIndex = siblings.indexOf(node);
  let newIndex;

  switch (order) {
    case "FRONT":
      // Move to end (top of layer stack)
      parent.appendChild(node);
      newIndex = siblings.length - 1;
      break;

    case "BACK":
      // Move to beginning (bottom of layer stack)
      parent.insertChild(0, node);
      newIndex = 0;
      break;

    case "FORWARD":
      // Move up one position
      if (currentIndex < siblings.length - 1) {
        parent.insertChild(currentIndex + 2, node);
        newIndex = currentIndex + 1;
      } else {
        newIndex = currentIndex;
      }
      break;

    case "BACKWARD":
      // Move down one position
      if (currentIndex > 0) {
        parent.insertChild(currentIndex - 1, node);
        newIndex = currentIndex - 1;
      } else {
        newIndex = currentIndex;
      }
      break;

    default:
      throw new Error(`Unknown order: ${order}`);
  }

  return {
    name: node.name,
    id: node.id,
    newIndex,
    order
  };
}

// Zoom viewport to focus on a specific node
async function zoomToNode(params) {
  const { nodeId } = params || {};

  if (!nodeId) throw new Error("Missing nodeId parameter");

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) throw new Error(`Node not found: ${nodeId}`);

  // Scroll and zoom to the node
  figma.viewport.scrollAndZoomIntoView([node]);

  return {
    name: node.name,
    id: node.id,
    zoom: figma.viewport.zoom
  };
}

// Zoom viewport to fit nodes or all content
async function zoomToFit(params) {
  const { nodeIds } = params || {};

  let nodesToFit = [];

  if (nodeIds && Array.isArray(nodeIds) && nodeIds.length > 0) {
    // Fit specific nodes
    for (const id of nodeIds) {
      const node = await figma.getNodeByIdAsync(id);
      if (node) {
        nodesToFit.push(node);
      }
    }
  } else {
    // Fit all content on current page
    nodesToFit = figma.currentPage.children;
  }

  if (nodesToFit.length === 0) {
    throw new Error("No nodes to fit in viewport");
  }

  figma.viewport.scrollAndZoomIntoView(nodesToFit);

  return {
    zoom: figma.viewport.zoom,
    nodeCount: nodesToFit.length
  };
}

// Set viewport position and zoom
async function setViewport(params) {
  const { x, y, zoom } = params || {};

  if (x === undefined || y === undefined) {
    throw new Error("Missing x or y parameter");
  }
  if (zoom === undefined) {
    throw new Error("Missing zoom parameter");
  }

  figma.viewport.center = { x, y };
  figma.viewport.zoom = zoom;

  return {
    x: figma.viewport.center.x,
    y: figma.viewport.center.y,
    zoom: figma.viewport.zoom
  };
}

// Get current viewport state
async function getViewport() {
  const bounds = figma.viewport.bounds;

  return {
    x: figma.viewport.center.x,
    y: figma.viewport.center.y,
    zoom: figma.viewport.zoom,
    width: bounds.width,
    height: bounds.height
  };
}

// Select nodes by IDs
async function selectNodes(params) {
  const { nodeIds } = params || {};

  if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length === 0) {
    throw new Error("nodeIds array is required and must not be empty");
  }

  const nodesToSelect = [];

  for (const id of nodeIds) {
    const node = await figma.getNodeByIdAsync(id);
    if (node && "id" in node) {
      nodesToSelect.push(node);
    }
  }

  if (nodesToSelect.length === 0) {
    throw new Error("No valid nodes found to select");
  }

  figma.currentPage.selection = nodesToSelect;

  return {
    selectedCount: nodesToSelect.length,
    nodes: nodesToSelect.map(n => ({
      id: n.id,
      name: n.name
    }))
  };
}

// ============================================
// UI COMPONENT TOOLS
// High-level tools for creating common UI components
// ============================================

async function createButton(params) {
  const {
    x = 0,
    y = 0,
    text = "Button",
    width,
    height = 40,
    fontSize = 14,
    fontWeight = 600,
    paddingX = 16,
    paddingY = 10,
    fillColor = { r: 0.22, g: 0.42, b: 0.92, a: 1 },
    textColor = { r: 1, g: 1, b: 1, a: 1 },
    strokeColor,
    strokeWeight = 0,
    cornerRadius = 8,
    parentId,
    name = "Button",
  } = params || {};

  // Create button frame
  const button = figma.createFrame();
  button.name = name;
  button.x = x;
  button.y = y;

  // Set fill color
  button.fills = [{
    type: "SOLID",
    color: { r: fillColor.r, g: fillColor.g, b: fillColor.b },
    opacity: fillColor.a !== undefined ? fillColor.a : 1,
  }];

  // Set stroke if provided
  if (strokeColor && strokeWeight > 0) {
    button.strokes = [{
      type: "SOLID",
      color: { r: strokeColor.r, g: strokeColor.g, b: strokeColor.b },
      opacity: strokeColor.a !== undefined ? strokeColor.a : 1,
    }];
    button.strokeWeight = strokeWeight;
  }

  // Set corner radius
  button.cornerRadius = cornerRadius;

  // Set up auto-layout for proper padding
  button.layoutMode = "HORIZONTAL";
  button.primaryAxisAlignItems = "CENTER";
  button.counterAxisAlignItems = "CENTER";
  button.paddingLeft = paddingX;
  button.paddingRight = paddingX;
  button.paddingTop = paddingY;
  button.paddingBottom = paddingY;
  button.primaryAxisSizingMode = width ? "FIXED" : "AUTO";
  button.counterAxisSizingMode = "AUTO";
  if (width) {
    button.resize(width, height);
  }

  // Create text
  const textNode = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  textNode.fontName = { family: "Inter", style: "Semi Bold" };
  textNode.characters = text;
  textNode.fontSize = fontSize;
  textNode.fills = [{
    type: "SOLID",
    color: { r: textColor.r, g: textColor.g, b: textColor.b },
    opacity: textColor.a !== undefined ? textColor.a : 1,
  }];
  textNode.name = "Label";

  button.appendChild(textNode);

  // Append to parent or page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (parentNode && "appendChild" in parentNode) {
      parentNode.appendChild(button);
    }
  } else {
    figma.currentPage.appendChild(button);
  }

  return {
    id: button.id,
    name: button.name,
    width: button.width,
    height: button.height,
  };
}

async function createInput(params) {
  const {
    x = 0,
    y = 0,
    label,
    placeholder = "",
    width = 280,
    height = 44,
    fontSize = 14,
    paddingX = 12,
    paddingY = 10,
    strokeColor = { r: 0.8, g: 0.8, b: 0.8, a: 1 },
    backgroundColor = { r: 1, g: 1, b: 1, a: 1 },
    textColor = { r: 0.13, g: 0.13, b: 0.13, a: 1 },
    labelColor = { r: 0.4, g: 0.4, b: 0.4, a: 1 },
    placeholderColor = { r: 0.6, g: 0.6, b: 0.6, a: 1 },
    cornerRadius = 8,
    errorMessage,
    errorColor = { r: 0.91, g: 0.27, b: 0.27, a: 1 },
    parentId,
    name = "Input",
  } = params || {};

  // Create container for label + input
  const container = figma.createFrame();
  container.name = name;
  container.x = x;
  container.y = y;
  container.fills = [];
  container.layoutMode = "VERTICAL";
  container.itemSpacing = 8;
  // Use FIXED sizing when width is explicitly provided, otherwise AUTO
  container.primaryAxisSizingMode = width ? "FIXED" : "AUTO";
  container.counterAxisSizingMode = width ? "FIXED" : "AUTO";
  if (width) {
    // Resize container to specified width (height will adjust based on content)
    container.resize(width, 69); // Default height accommodates label + input
  }

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  // Add label if provided
  if (label) {
    const labelNode = figma.createText();
    labelNode.fontName = { family: "Inter", style: "Medium" };
    labelNode.characters = label;
    labelNode.fontSize = 14;
    labelNode.fills = [{
      type: "SOLID",
      color: { r: labelColor.r, g: labelColor.g, b: labelColor.b },
      opacity: labelColor.a !== undefined ? labelColor.a : 1,
    }];
    labelNode.name = "Label";
    container.appendChild(labelNode);
  }

  // Create input field frame
  const inputFrame = figma.createFrame();
  inputFrame.name = "Input Field";
  inputFrame.resize(width, height);
  inputFrame.fills = [{
    type: "SOLID",
    color: { r: backgroundColor.r, g: backgroundColor.g, b: backgroundColor.b },
    opacity: backgroundColor.a !== undefined ? backgroundColor.a : 1,
  }];
  inputFrame.strokes = [{
    type: "SOLID",
    color: { r: strokeColor.r, g: strokeColor.g, b: strokeColor.b },
    opacity: strokeColor.a !== undefined ? strokeColor.a : 1,
  }];
  inputFrame.strokeWeight = 1;
  inputFrame.cornerRadius = cornerRadius;

  // Auto-layout for input
  inputFrame.layoutMode = "HORIZONTAL";
  inputFrame.primaryAxisAlignItems = "MIN";
  inputFrame.counterAxisAlignItems = "CENTER";
  inputFrame.paddingLeft = paddingX;
  inputFrame.paddingRight = paddingX;
  inputFrame.paddingTop = paddingY;
  inputFrame.paddingBottom = paddingY;
  // Use FIXED sizing to respect width/height parameters (not HUG content)
  inputFrame.primaryAxisSizingMode = "FIXED";
  inputFrame.counterAxisSizingMode = "FIXED";

  // Add placeholder text
  const placeholderNode = figma.createText();
  placeholderNode.fontName = { family: "Inter", style: "Regular" };
  placeholderNode.characters = placeholder || "Enter text...";
  placeholderNode.fontSize = fontSize;
  placeholderNode.fills = [{
    type: "SOLID",
    color: { r: placeholderColor.r, g: placeholderColor.g, b: placeholderColor.b },
    opacity: placeholderColor.a !== undefined ? placeholderColor.a : 1,
  }];
  placeholderNode.name = "Placeholder";
  inputFrame.appendChild(placeholderNode);

  container.appendChild(inputFrame);

  // Add error message if provided
  if (errorMessage) {
    const errorNode = figma.createText();
    errorNode.fontName = { family: "Inter", style: "Regular" };
    errorNode.characters = errorMessage;
    errorNode.fontSize = 12;
    errorNode.fills = [{
      type: "SOLID",
      color: { r: errorColor.r, g: errorColor.g, b: errorColor.b },
      opacity: errorColor.a !== undefined ? errorColor.a : 1,
    }];
    errorNode.name = "Error Message";
    container.appendChild(errorNode);
  }

  // Append to parent or page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (parentNode && "appendChild" in parentNode) {
      parentNode.appendChild(container);
    }
  } else {
    figma.currentPage.appendChild(container);
  }

  return {
    id: container.id,
    name: container.name,
    width: container.width,
    height: container.height,
    inputFieldId: inputFrame.id,
  };
}

async function createCard(params) {
  const {
    x = 0,
    y = 0,
    width = 320,
    height = 200,
    padding = 24,
    backgroundColor = { r: 1, g: 1, b: 1, a: 1 },
    cornerRadius = 12,
    hasShadow = true,
    shadowColor = { r: 0, g: 0, b: 0, a: 0.08 },
    shadowOffset = { x: 0, y: 2 },
    shadowRadius = 8,
    hasStroke = false,
    strokeColor = { r: 0.9, g: 0.9, b: 0.9, a: 1 },
    strokeWeight = 1,
    parentId,
    name = "Card",
  } = params || {};

  const card = figma.createFrame();
  card.name = name;
  card.x = x;
  card.y = y;
  card.resize(width, height);

  // Set fill
  card.fills = [{
    type: "SOLID",
    color: { r: backgroundColor.r, g: backgroundColor.g, b: backgroundColor.b },
    opacity: backgroundColor.a !== undefined ? backgroundColor.a : 1,
  }];

  // Set corner radius
  card.cornerRadius = cornerRadius;

  // Set stroke if enabled
  if (hasStroke) {
    card.strokes = [{
      type: "SOLID",
      color: { r: strokeColor.r, g: strokeColor.g, b: strokeColor.b },
      opacity: strokeColor.a !== undefined ? strokeColor.a : 1,
    }];
    card.strokeWeight = strokeWeight;
  }

  // Set shadow if enabled
  if (hasShadow) {
    card.effects = [{
      type: "DROP_SHADOW",
      visible: true,
      blendMode: "NORMAL",
      color: { r: shadowColor.r, g: shadowColor.g, b: shadowColor.b, a: shadowColor.a || 0.08 },
      offset: { x: shadowOffset.x || 0, y: shadowOffset.y || 2 },
      radius: shadowRadius,
      spread: 0,
    }];
  }

  // Set up auto-layout with padding
  card.layoutMode = "VERTICAL";
  card.paddingLeft = padding;
  card.paddingRight = padding;
  card.paddingTop = padding;
  card.paddingBottom = padding;
  card.primaryAxisSizingMode = "FIXED";
  card.counterAxisSizingMode = "FIXED";

  // Append to parent or page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (parentNode && "appendChild" in parentNode) {
      parentNode.appendChild(card);
    }
  } else {
    figma.currentPage.appendChild(card);
  }

  return {
    id: card.id,
    name: card.name,
    width: card.width,
    height: card.height,
  };
}

async function createAvatar(params) {
  const {
    x = 0,
    y = 0,
    size = 40,
    initials,
    backgroundColor = { r: 0.22, g: 0.42, b: 0.92, a: 1 },
    textColor = { r: 1, g: 1, b: 1, a: 1 },
    fontSize = 16,
    fontWeight = 600,
    parentId,
    name = "Avatar",
  } = params || {};

  const avatar = figma.createFrame();
  avatar.name = name;
  avatar.x = x;
  avatar.y = y;
  avatar.resize(size, size);

  // Set fill
  avatar.fills = [{
    type: "SOLID",
    color: { r: backgroundColor.r, g: backgroundColor.g, b: backgroundColor.b },
    opacity: backgroundColor.a !== undefined ? backgroundColor.a : 1,
  }];

  // Make it circular
  avatar.cornerRadius = size / 2;

  // Center content
  avatar.layoutMode = "HORIZONTAL";
  avatar.primaryAxisAlignItems = "CENTER";
  avatar.counterAxisAlignItems = "CENTER";

  // Add initials if provided
  if (initials) {
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    const textNode = figma.createText();
    textNode.fontName = { family: "Inter", style: "Semi Bold" };
    textNode.characters = initials.substring(0, 2).toUpperCase();
    textNode.fontSize = fontSize;
    textNode.fills = [{
      type: "SOLID",
      color: { r: textColor.r, g: textColor.g, b: textColor.b },
      opacity: textColor.a !== undefined ? textColor.a : 1,
    }];
    textNode.name = "Initials";
    avatar.appendChild(textNode);
  }

  // Append to parent or page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (parentNode && "appendChild" in parentNode) {
      parentNode.appendChild(avatar);
    }
  } else {
    figma.currentPage.appendChild(avatar);
  }

  return {
    id: avatar.id,
    name: avatar.name,
    size: avatar.width,
  };
}

async function createBadge(params) {
  const {
    x = 0,
    y = 0,
    text = "Badge",
    height = 24,
    fontSize = 12,
    fontWeight = 500,
    paddingX = 8,
    paddingY = 4,
    fillColor = { r: 0.96, g: 0.96, b: 0.96, a: 1 },
    textColor = { r: 0.4, g: 0.4, b: 0.4, a: 1 },
    cornerRadius = 9999,
    parentId,
    name = "Badge",
  } = params || {};

  const badge = figma.createFrame();
  badge.name = name;
  badge.x = x;
  badge.y = y;

  // Set fill
  badge.fills = [{
    type: "SOLID",
    color: { r: fillColor.r, g: fillColor.g, b: fillColor.b },
    opacity: fillColor.a !== undefined ? fillColor.a : 1,
  }];

  // Pill shape
  badge.cornerRadius = cornerRadius;

  // Auto-layout
  badge.layoutMode = "HORIZONTAL";
  badge.primaryAxisAlignItems = "CENTER";
  badge.counterAxisAlignItems = "CENTER";
  badge.paddingLeft = paddingX;
  badge.paddingRight = paddingX;
  badge.paddingTop = paddingY;
  badge.paddingBottom = paddingY;
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "AUTO";

  // Add text
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  const textNode = figma.createText();
  textNode.fontName = { family: "Inter", style: "Medium" };
  textNode.characters = text;
  textNode.fontSize = fontSize;
  textNode.fills = [{
    type: "SOLID",
    color: { r: textColor.r, g: textColor.g, b: textColor.b },
    opacity: textColor.a !== undefined ? textColor.a : 1,
  }];
  textNode.name = "Text";
  badge.appendChild(textNode);

  // Append to parent or page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (parentNode && "appendChild" in parentNode) {
      parentNode.appendChild(badge);
    }
  } else {
    figma.currentPage.appendChild(badge);
  }

  return {
    id: badge.id,
    name: badge.name,
    width: badge.width,
    height: badge.height,
  };
}

async function createIconPlaceholder(params) {
  const {
    x = 0,
    y = 0,
    size = 24,
    color = { r: 0.4, g: 0.4, b: 0.4, a: 1 },
    parentId,
    name = "Icon",
  } = params || {};

  const icon = figma.createFrame();
  icon.name = name;
  icon.x = x;
  icon.y = y;
  icon.resize(size, size);

  // Light gray background
  icon.fills = [{
    type: "SOLID",
    color: { r: 0.95, g: 0.95, b: 0.95 },
    opacity: 1,
  }];

  // Small corner radius
  icon.cornerRadius = 4;

  // Center layout
  icon.layoutMode = "HORIZONTAL";
  icon.primaryAxisAlignItems = "CENTER";
  icon.counterAxisAlignItems = "CENTER";

  // Add an X shape as placeholder indicator
  const line1 = figma.createLine();
  line1.resize(size * 0.4, 0);
  line1.rotation = 45;
  line1.strokes = [{
    type: "SOLID",
    color: { r: color.r, g: color.g, b: color.b },
    opacity: color.a !== undefined ? color.a : 1,
  }];
  line1.strokeWeight = 1.5;

  const line2 = figma.createLine();
  line2.resize(size * 0.4, 0);
  line2.rotation = -45;
  line2.strokes = [{
    type: "SOLID",
    color: { r: color.r, g: color.g, b: color.b },
    opacity: color.a !== undefined ? color.a : 1,
  }];
  line2.strokeWeight = 1.5;

  // Position lines in center
  line1.x = size * 0.3;
  line1.y = size * 0.5;
  line2.x = size * 0.3;
  line2.y = size * 0.5;

  icon.appendChild(line1);
  icon.appendChild(line2);

  // Append to parent or page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (parentNode && "appendChild" in parentNode) {
      parentNode.appendChild(icon);
    }
  } else {
    figma.currentPage.appendChild(icon);
  }

  return {
    id: icon.id,
    name: icon.name,
    size: icon.width,
  };
}

async function createDivider(params) {
  const {
    x = 0,
    y = 0,
    length = 100,
    orientation = "horizontal",
    color = { r: 0.9, g: 0.9, b: 0.9, a: 1 },
    thickness = 1,
    parentId,
    name = "Divider",
  } = params || {};

  const divider = figma.createLine();
  divider.name = name;

  if (orientation === "horizontal") {
    divider.x = x;
    divider.y = y;
    divider.resize(length, 0);
    divider.rotation = 0;
  } else {
    divider.x = x;
    divider.y = y;
    divider.resize(length, 0);
    divider.rotation = 90;
  }

  divider.strokes = [{
    type: "SOLID",
    color: { r: color.r, g: color.g, b: color.b },
    opacity: color.a !== undefined ? color.a : 1,
  }];
  divider.strokeWeight = thickness;

  // Append to parent or page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (parentNode && "appendChild" in parentNode) {
      parentNode.appendChild(divider);
    }
  } else {
    figma.currentPage.appendChild(divider);
  }

  return {
    id: divider.id,
    name: divider.name,
    length: length,
    orientation: orientation,
  };
}

// ============================================================================
// HTML to Figma Rendering
// ============================================================================

/**
 * Render HTML to Figma by converting LayerNodes to Figma nodes
 * The html is first converted to LayerNodes in ui.html (browser environment),
 * then this function creates actual Figma nodes from those LayerNodes.
 */
async function renderHtml(params) {
  const { html, x = 0, y = 0, width = 1440, name = "HTML Render" } = params || {};

  if (!html) {
    throw new Error("Missing required parameter: html");
  }

  // Create a base frame
  const baseFrame = figma.createFrame();
  baseFrame.name = name;
  baseFrame.x = x;
  baseFrame.y = y;
  baseFrame.resize(width, 100); // Will be resized based on content
  baseFrame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  baseFrame.clipsContent = false;

  figma.currentPage.appendChild(baseFrame);

  // Send the HTML to ui.html for conversion to LayerNodes
  return new Promise((resolve, reject) => {
    let isComplete = false;
    let timeoutId = null;

    // Helper to safely remove frame
    const safeRemoveFrame = () => {
      try {
        if (baseFrame && baseFrame.parent) {
          baseFrame.remove();
        }
      } catch (e) {
        console.warn("Could not remove frame:", e);
      }
    };

    // Set up a one-time message handler
    const messageHandler = async (msg) => {
      if (msg.type === "html-layers-result") {
        if (isComplete) return; // Already handled
        isComplete = true;

        // Clear timeout
        if (timeoutId) clearTimeout(timeoutId);

        // Remove this handler
        figma.ui.off("message", messageHandler);

        if (msg.error) {
          safeRemoveFrame();
          reject(new Error(msg.error));
          return;
        }

        try {
          const layers = msg.layers;
          console.log("Received layers:", JSON.stringify(layers).slice(0, 500));

          if (!layers || (Array.isArray(layers) && layers.length === 0)) {
            safeRemoveFrame();
            reject(new Error("No layers generated from HTML"));
            return;
          }

          // Process the layer tree
          await processLayersToFigma(layers, baseFrame);

          // Resize frame to fit content
          const children = baseFrame.children;
          if (children.length > 0) {
            let maxWidth = 0;
            let maxHeight = 0;
            for (const child of children) {
              if ('x' in child && 'width' in child) {
                maxWidth = Math.max(maxWidth, child.x + child.width);
              }
              if ('y' in child && 'height' in child) {
                maxHeight = Math.max(maxHeight, child.y + child.height);
              }
            }
            if (maxWidth > 0 && maxHeight > 0) {
              baseFrame.resize(Math.max(width, maxWidth), maxHeight);
            }
          }

          resolve({
            success: true,
            frameId: baseFrame.id,
            frameName: baseFrame.name,
          });
        } catch (err) {
          console.error("Error processing layers:", err);
          safeRemoveFrame();
          reject(err);
        }
      }
    };

    figma.ui.on("message", messageHandler);

    // Request conversion from ui.html
    console.log("Sending convert-html to UI");
    figma.ui.postMessage({
      type: "convert-html",
      html: html,
      width: width,
    });

    // Timeout after 90 seconds (increased from 30s for complex HTML)
    timeoutId = setTimeout(() => {
      if (isComplete) return; // Already handled
      isComplete = true;
      figma.ui.off("message", messageHandler);
      safeRemoveFrame();
      reject(new Error("HTML to Figma conversion timed out after 90 seconds. Try simplifying the HTML or breaking it into smaller chunks."));
    }, 90000);
  });
}

/**
 * Process LayerNodes and create corresponding Figma nodes
 */
async function processLayersToFigma(layers, parentFrame) {
  if (!layers) return;

  // Handle both single layer and array of layers
  const layerArray = Array.isArray(layers) ? layers : [layers];

  for (const layer of layerArray) {
    if (!layer || !layer.type) continue;

    try {
      const node = await createNodeFromLayer(layer);
      if (node) {
        parentFrame.appendChild(node);

        // Process children recursively
        if (layer.children && layer.children.length > 0 && 'appendChild' in node) {
          await processLayersToFigma(layer.children, node);
        }
      }
    } catch (err) {
      console.warn("Error processing layer:", layer.type, err);
    }
  }
}

/**
 * Create a Figma node from a LayerNode
 */
async function createNodeFromLayer(layer) {
  let node;

  switch (layer.type) {
    case "FRAME":
    case "GROUP":
      node = figma.createFrame();
      break;
    case "RECTANGLE":
      node = figma.createRectangle();
      break;
    case "TEXT":
      node = figma.createText();
      break;
    case "SVG":
      if (layer.svg) {
        try {
          node = figma.createNodeFromSvg(layer.svg);
        } catch (e) {
          console.warn("Error creating SVG node:", e);
          return null;
        }
      }
      break;
    case "ELLIPSE":
      node = figma.createEllipse();
      break;
    case "LINE":
      node = figma.createLine();
      break;
    default:
      console.warn("Unknown layer type:", layer.type);
      return null;
  }

  if (!node) return null;

  // Apply common properties
  if (layer.name) node.name = layer.name;
  if (typeof layer.x === "number") node.x = layer.x;
  if (typeof layer.y === "number") node.y = layer.y;
  if (typeof layer.opacity === "number") node.opacity = layer.opacity;
  if (typeof layer.visible === "boolean") node.visible = layer.visible;

  // Apply size
  if (typeof layer.width === "number" && typeof layer.height === "number") {
    try {
      node.resize(Math.max(1, layer.width), Math.max(1, layer.height));
    } catch (e) {
      // Some nodes can't be resized
    }
  }

  // Apply fills
  if (layer.fills && Array.isArray(layer.fills)) {
    try {
      node.fills = layer.fills;
    } catch (e) {
      console.warn("Error applying fills:", e);
    }
  }

  // Apply strokes
  if (layer.strokes && Array.isArray(layer.strokes)) {
    try {
      node.strokes = layer.strokes;
    } catch (e) {
      console.warn("Error applying strokes:", e);
    }
  }

  if (typeof layer.strokeWeight === "number") {
    node.strokeWeight = layer.strokeWeight;
  }

  // Apply effects (shadows, blurs)
  if (layer.effects && Array.isArray(layer.effects)) {
    try {
      node.effects = layer.effects;
    } catch (e) {
      console.warn("Error applying effects:", e);
    }
  }

  // Apply corner radius for frames/rectangles
  if (typeof layer.cornerRadius === "number" && 'cornerRadius' in node) {
    node.cornerRadius = layer.cornerRadius;
  }

  // Apply auto-layout properties for frames
  if (node.type === "FRAME") {
    if (layer.layoutMode) {
      node.layoutMode = layer.layoutMode;
    }
    if (typeof layer.primaryAxisAlignItems === "string") {
      node.primaryAxisAlignItems = layer.primaryAxisAlignItems;
    }
    if (typeof layer.counterAxisAlignItems === "string") {
      node.counterAxisAlignItems = layer.counterAxisAlignItems;
    }
    if (typeof layer.itemSpacing === "number") {
      node.itemSpacing = layer.itemSpacing;
    }
    if (typeof layer.paddingTop === "number") node.paddingTop = layer.paddingTop;
    if (typeof layer.paddingRight === "number") node.paddingRight = layer.paddingRight;
    if (typeof layer.paddingBottom === "number") node.paddingBottom = layer.paddingBottom;
    if (typeof layer.paddingLeft === "number") node.paddingLeft = layer.paddingLeft;
    if (typeof layer.clipsContent === "boolean") node.clipsContent = layer.clipsContent;
  }

  // Apply text properties
  if (node.type === "TEXT") {
    // Load font first
    const fontFamily = layer.fontFamily || "Inter";
    const fontStyle = layer.fontStyle || "Regular";

    try {
      await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
      node.fontName = { family: fontFamily, style: fontStyle };
    } catch (e) {
      // Fallback to Inter
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      node.fontName = { family: "Inter", style: "Regular" };
    }

    // Set text content
    if (layer.characters) {
      node.characters = layer.characters;
    }

    // Set text properties
    if (typeof layer.fontSize === "number") {
      node.fontSize = layer.fontSize;
    }

    if (layer.textAlignHorizontal) {
      node.textAlignHorizontal = layer.textAlignHorizontal;
    }

    if (layer.textAlignVertical) {
      node.textAlignVertical = layer.textAlignVertical;
    }

    if (layer.lineHeight) {
      node.lineHeight = layer.lineHeight;
    }

    if (layer.letterSpacing) {
      node.letterSpacing = layer.letterSpacing;
    }

    // Auto-resize text
    node.textAutoResize = "HEIGHT";
  }

  return node;
}


// Apply an image fill to a node from pre-fetched image bytes
async function applyImageFill(params) {
  const { nodeId, imageBytes, scaleMode = "FILL" } = params;

  if (!nodeId) {
    throw new Error("Missing required parameter: nodeId");
  }

  if (!imageBytes || !Array.isArray(imageBytes)) {
    throw new Error("Missing or invalid imageBytes parameter");
  }

  // Find the node
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  // Check if node supports fills
  if (!("fills" in node)) {
    throw new Error(`Node type ${node.type} does not support fills`);
  }

  try {
    // Convert array back to Uint8Array
    const uint8Array = new Uint8Array(imageBytes);

    // Create image from bytes
    const image = figma.createImage(uint8Array);

    // Create image fill paint
    const imageFill = {
      type: "IMAGE",
      scaleMode: scaleMode, // FILL, FIT, CROP, TILE
      imageHash: image.hash,
    };

    // Apply the fill
    node.fills = [imageFill];

    return {
      success: true,
      nodeId: node.id,
      nodeName: node.name,
      imageHash: image.hash,
      message: `Applied image fill to ${node.name}`,
    };
  } catch (error) {
    throw new Error(`Failed to apply image fill: ${error.message}`);
  }
}
