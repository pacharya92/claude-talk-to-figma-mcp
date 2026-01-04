// Define TypeScript interfaces for Figma responses
export interface FigmaResponse {
  id: string;
  result?: any;
  error?: string;
}

// Define interface for command progress updates
export interface CommandProgressUpdate {
  type: 'command_progress';
  commandId: string;
  commandType: string;
  status: 'started' | 'in_progress' | 'completed' | 'error';
  progress: number;
  totalItems: number;
  processedItems: number;
  currentChunk?: number;
  totalChunks?: number;
  chunkSize?: number;
  message: string;
  payload?: any;
  timestamp: number;
}

// Define TypeScript interfaces for tracking WebSocket requests
export interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timeout: ReturnType<typeof setTimeout>;
  lastActivity: number;
}

// Define WebSocket message structures
export interface ProgressMessage {
  message: FigmaResponse | any;
  type?: string;
  id?: string;
  [key: string]: any; // Allow any other properties
}

// Define possible command types for Figma
export type FigmaCommand =
  | "get_document_info"
  | "get_selection"
  | "get_node_info"
  | "create_rectangle"
  | "create_frame"
  | "create_text"
  | "create_ellipse"
  | "create_polygon"
  | "create_star"
  | "create_vector"
  | "create_line"
  | "set_fill_color"
  | "set_stroke_color"
  | "move_node"
  | "resize_node"
  | "delete_node"
  | "get_styles"
  | "get_local_components"
  | "get_team_components"
  | "create_component_instance"
  | "export_node_as_image"
  | "set_image_fill"
  | "join"
  | "set_corner_radius"
  | "clone_node"
  | "set_text_content"
  | "scan_text_nodes"
  | "set_multiple_text_contents"
  | "set_auto_layout"
  | "set_font_name"
  | "set_font_size"
  | "set_font_weight"
  | "set_letter_spacing"
  | "set_line_height"
  | "set_paragraph_spacing"
  | "set_text_case"
  | "set_text_decoration"
  | "get_styled_text_segments"
  | "load_font_async"
  | "get_remote_components"
  | "set_effects"
  | "set_effect_style_id"
  | "group_nodes"
  | "ungroup_nodes"
  | "flatten_node"
  | "insert_child"
  | "split_frames_to_pages"
  | "create_elements"
  | "create_line"
  | "set_gradient_fill"
  | "set_layer_order"
  | "zoom_to_node"
  | "zoom_to_fit"
  | "set_viewport"
  | "get_viewport"
  | "select_nodes"
  | "create_button"
  | "create_input"
  | "create_card"
  | "create_avatar"
  | "create_badge"
  | "create_icon_placeholder"
  | "create_divider"
  | "render_html"
  | "set_image_fill"
  | "apply_image_fill"
  | "create_page"
  | "get_pages"
  | "set_current_page"
  | "delete_page"
  | "move_frames_to_page";