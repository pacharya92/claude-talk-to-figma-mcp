# Claude Figma MCP Instructions

> **Note**: The design tokens and styles below are examples that may change as we build. Feel free to customize them to match your project's design system.

## Quick Start

1. **Connect to Figma**: Always start with `join_channel` using the channel ID from the Figma plugin
2. **Use batch operations**: Prefer `create_elements` over individual create calls for speed
3. **Maintain hierarchy**: Set `nestInFirstFrame: true` to keep elements organized
4. **Apply auto-layout**: Use `set_auto_layout` for responsive, well-spaced designs

## Design Tokens (Example Styles)

These are starter tokens - customize them to match your brand and design needs.

### Colors (RGBA 0-1 scale)

```javascript
// Primary palette
primary:     { r: 0.22, g: 0.42, b: 0.92, a: 1 }  // #3869EB - Blue
primaryDark: { r: 0.16, g: 0.32, b: 0.75, a: 1 }  // #2951BF - Dark blue

// Neutrals
white:       { r: 1, g: 1, b: 1, a: 1 }           // #FFFFFF
background:  { r: 0.98, g: 0.98, b: 0.98, a: 1 }  // #FAFAFA
gray100:     { r: 0.96, g: 0.96, b: 0.96, a: 1 }  // #F5F5F5
gray200:     { r: 0.90, g: 0.90, b: 0.90, a: 1 }  // #E5E5E5
gray300:     { r: 0.80, g: 0.80, b: 0.80, a: 1 }  // #CCCCCC
gray500:     { r: 0.60, g: 0.60, b: 0.60, a: 1 }  // #999999
gray700:     { r: 0.40, g: 0.40, b: 0.40, a: 1 }  // #666666
gray900:     { r: 0.13, g: 0.13, b: 0.13, a: 1 }  // #212121
black:       { r: 0, g: 0, b: 0, a: 1 }           // #000000

// Semantic
success:     { r: 0.13, g: 0.72, b: 0.45, a: 1 }  // #22B873
warning:     { r: 0.95, g: 0.68, b: 0.14, a: 1 }  // #F2AD24
error:       { r: 0.91, g: 0.27, b: 0.27, a: 1 }  // #E84545
info:        { r: 0.20, g: 0.60, b: 0.86, a: 1 }  // #3399DB
```

### Spacing Scale (pixels)

```
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
```

### Border Radius

```javascript
none: 0
sm:   4
md:   8
lg:   12
xl:   16
full: 9999  // Pill shape
```

### Typography

```javascript
// Headings
h1: { fontSize: 48, fontWeight: 700, lineHeight: 56 }
h2: { fontSize: 36, fontWeight: 700, lineHeight: 44 }
h3: { fontSize: 24, fontWeight: 600, lineHeight: 32 }
h4: { fontSize: 20, fontWeight: 600, lineHeight: 28 }

// Body
bodyLarge:  { fontSize: 18, fontWeight: 400, lineHeight: 28 }
body:       { fontSize: 16, fontWeight: 400, lineHeight: 24 }
bodySmall:  { fontSize: 14, fontWeight: 400, lineHeight: 20 }

// Labels
label:      { fontSize: 14, fontWeight: 500, lineHeight: 20 }
caption:    { fontSize: 12, fontWeight: 400, lineHeight: 16 }

// Buttons
buttonLarge:  { fontSize: 16, fontWeight: 600 }
button:       { fontSize: 14, fontWeight: 600 }
buttonSmall:  { fontSize: 12, fontWeight: 600 }
```

### Shadows (for set_effects)

```javascript
// Elevation 1 - Cards, dropdowns
shadow1: {
  type: "DROP_SHADOW",
  color: { r: 0, g: 0, b: 0, a: 0.08 },
  offset: { x: 0, y: 2 },
  radius: 8,
  spread: 0
}

// Elevation 2 - Modals, popovers
shadow2: {
  type: "DROP_SHADOW",
  color: { r: 0, g: 0, b: 0, a: 0.12 },
  offset: { x: 0, y: 4 },
  radius: 16,
  spread: 0
}

// Elevation 3 - Floating elements
shadow3: {
  type: "DROP_SHADOW",
  color: { r: 0, g: 0, b: 0, a: 0.16 },
  offset: { x: 0, y: 8 },
  radius: 24,
  spread: 0
}
```

## High-Level Component Tools

Use these tools for rapid UI creation:

### `create_button`
Creates a complete button with text, proper padding, and styling.
- Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`
- Sizes: `sm`, `md`, `lg`

### `create_input`
Creates a form input field with optional label and placeholder.
- Types: `text`, `password`, `email`, `search`
- States: `default`, `focused`, `error`, `disabled`

### `create_card`
Creates a card container with padding, border-radius, and optional shadow.

### `create_avatar`
Creates a circular avatar placeholder.
- Sizes: `xs` (24), `sm` (32), `md` (40), `lg` (48), `xl` (64)

### `create_badge`
Creates a small badge/tag for labels and status indicators.
- Variants: `default`, `success`, `warning`, `error`, `info`

### `create_icon_placeholder`
Creates a square placeholder for icons.

## UI Pattern Examples

### Login Screen
```
1. Create main frame (400x600, white background)
2. Add logo placeholder (centered, 80x80)
3. Add heading "Welcome Back" (h3)
4. Add email input with label
5. Add password input with label
6. Add primary login button (full width)
7. Add "Forgot password?" link
8. Apply vertical auto-layout, 24px spacing, 40px padding
```

### Card Component
```
1. Create card frame (320x auto, white, 12px radius, shadow1)
2. Add image placeholder (320x180)
3. Add content container with 16px padding
4. Add title (h4), description (bodySmall, gray700)
5. Add action button
6. Apply vertical auto-layout
```

### Navigation Bar
```
1. Create navbar frame (full width x 64, white, shadow1)
2. Add horizontal auto-layout, SPACE_BETWEEN
3. Left: Logo + nav links
4. Right: Avatar + menu button
5. Padding: 16px horizontal
```

### Form Section
```
1. Create form container
2. For each field: label (14px, gray700) + input
3. Group related fields
4. Add submit button at bottom
5. Vertical auto-layout, 16px between fields, 24px between groups
```

## Best Practices

1. **Start with structure**: Create container frames before content
2. **Use auto-layout**: Always apply auto-layout for spacing consistency
3. **Name everything**: Use semantic names like "Login Button" not "Frame 123"
4. **Group related elements**: Keep inputs with their labels
5. **Use design tokens**: Reference the colors and spacing above
6. **Test responsiveness**: Use auto-layout constraints properly
7. **Add visual feedback**: Export preview after major changes

## Common Dimensions

| Component | Dimensions |
|-----------|------------|
| Mobile screen | 375 x 812 |
| Tablet screen | 768 x 1024 |
| Desktop screen | 1440 x 900 |
| Button height (sm) | 32 |
| Button height (md) | 40 |
| Button height (lg) | 48 |
| Input height | 44 |
| Avatar (sm) | 32 x 32 |
| Avatar (md) | 40 x 40 |
| Avatar (lg) | 48 x 48 |
| Icon | 24 x 24 |
| Navbar height | 64 |
| Card width | 280-360 |

## Workflow Tips

1. **Batch create**: Use `create_elements` with `nestInFirstFrame: true`
2. **Verify work**: Use `export_node_as_image` to see results
3. **Iterate quickly**: Modify with `set_fill_color`, `resize_node`, etc.
4. **Keep hierarchy**: Check `get_node_info` if structure seems wrong
5. **Use selection**: `get_selection` helps understand what user wants to modify
