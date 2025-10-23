# Export System Documentation

The Bentoblocks Export System converts the canvas Page/Section/Component architecture into standalone HTML files that can be downloaded, previewed, or deployed.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [HTML Export Engine](#html-export-engine)
4. [CSS Generation Strategy](#css-generation-strategy)
5. [Preview System](#preview-system)
6. [Validation](#validation)
7. [API Endpoints](#api-endpoints)
8. [Usage Guide](#usage-guide)
9. [Responsive Design](#responsive-design)
10. [Font Loading](#font-loading)

---

## Overview

The Export System provides two key features:

1. **Preview**: Generate and view your site in a new browser tab
2. **Download HTML**: Export your site as a standalone HTML file

Both features use the same HTML generation engine, ensuring consistency between preview and export.

### Key Features

- Converts Page → Section → Component hierarchy to semantic HTML
- Generates embedded CSS with responsive breakpoints
- Automatically loads Google Fonts used in the design
- Validates page structure before export
- XSS protection via HTML escaping
- No external dependencies in exported HTML

---

## Architecture

### File Structure

```
lib/export/
├── htmlExporter.ts      # Core HTML generation engine
└── exportValidator.ts   # Page validation logic

app/api/
└── export-preview/
    └── route.ts         # Preview API endpoint

components/ui/
└── PreviewButton.tsx    # UI component with dropdown menu

lib/
└── previewCache.ts      # In-memory preview storage (30min TTL)
```

### Data Flow

```
User clicks "Preview" or "Download"
          ↓
    Validate Page
          ↓
    Export to HTML
          ↓
Preview: Store in cache → Open in new tab
Download: Create Blob → Trigger download
```

---

## HTML Export Engine

### Core Function: `exportToHTML(page: Page)`

Located in `/lib/export/htmlExporter.ts`

**Purpose**: Converts a Page object into a complete, standalone HTML document.

**Process**:

1. **Extract Sections**: Sort sections by `order` field
2. **Render Sections**: Convert each section to HTML with layout classes
3. **Render Components**: Convert each component to semantic HTML
4. **Generate CSS**: Create embedded stylesheet with responsive rules
5. **Add Fonts**: Include Google Fonts link if fonts are used
6. **Build Document**: Assemble complete HTML5 document

**Example Output**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Bentoblocks Site</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    /* ... embedded CSS ... */
  </style>
</head>
<body>
  <section class="layout-stack layout-stack-vertical section-hero">
    <h1>Welcome to My Site</h1>
    <div class="text-content">This is my homepage.</div>
  </section>
</body>
</html>
```

### Component Rendering

Each component type has a dedicated rendering function:

| Component Type | HTML Output | Special Features |
|---------------|-------------|------------------|
| Heading | `<h1>` - `<h6>` | Dynamic level based on content |
| Text | `<div class="text-content">` | Supports rich HTML content |
| Button | `<a class="btn">` | Variant classes (filled/outlined/text) |
| Image | `<figure>` + `<img>` | Optional caption, object-fit |
| Link | `<a class="link-component">` | Optional description |
| Spacer | `<div class="spacer">` | Custom height |
| Divider | `<hr>` | Custom color and thickness |

### HTML Escaping

All user content is escaped to prevent XSS attacks:

```typescript
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

---

## CSS Generation Strategy

### Layout System

Bentoblocks uses three layout types:

#### 1. Stack Layout (Flexbox)

```css
.layout-stack {
  display: flex;
  padding: 2rem;
}

.layout-stack-vertical {
  flex-direction: column;
  gap: 16px;
}

.layout-stack-horizontal {
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
}
```

**Use case**: Linear layouts like navigation bars, vertical content flows

#### 2. Grid Layout (CSS Grid)

```css
.layout-grid {
  display: grid;
  gap: 32px;
  padding: 2rem;
}

.layout-grid-2 { grid-template-columns: repeat(2, 1fr); }
.layout-grid-3 { grid-template-columns: repeat(3, 1fr); }
.layout-grid-4 { grid-template-columns: repeat(4, 1fr); }
```

**Use case**: Features grids, galleries, card layouts

#### 3. Absolute Layout

```css
.layout-absolute {
  position: relative;
  min-height: 400px;
  padding: 2rem;
}
```

**Use case**: Free-form layouts with absolute positioning

### Section Variants

Each section variant has default styling:

```css
.section-hero {
  padding: 4rem 2rem;
  min-height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.section-navbar {
  padding: 1rem 2rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}
```

**Available variants**: navbar, hero, content, features, gallery, testimonials, cta, footer

### Inline Styles

Component-specific styles are applied inline:

```html
<h1 style="color: #3B82F6; font-size: 3rem; font-family: 'Inter', sans-serif;">
  My Heading
</h1>
```

This allows per-component customization while maintaining semantic class structure.

---

## Preview System

### Preview Cache

Located in `/lib/previewCache.ts`

**Features**:
- In-memory Map storage (global singleton)
- 30-minute TTL (time-to-live)
- Automatic cleanup of expired entries
- Content-based hash generation

**Storage**:

```typescript
interface PreviewEntry {
  html: string;
  contextPrompt: string;
  createdAt: number;
}
```

**Hash Generation**:

```typescript
const hash = crypto
  .createHash('sha256')
  .update(html)
  .update(':')
  .update(contextPrompt)
  .digest('hex')
  .slice(0, 16);
```

### Preview URL

Preview URLs are ephemeral and automatically expire after 30 minutes:

```
https://bentoblocks.com/preview/a1b2c3d4e5f6g7h8
```

**Route**: `/app/preview/[slug]/route.ts`

**Response**:
- Content-Type: `text/html; charset=utf-8`
- Cache-Control: `no-store, max-age=0`

---

## Validation

### Validation Levels

The validator checks for:

1. **Errors** (blocking): Missing required data, invalid structure
2. **Warnings** (non-blocking): Missing alt text, empty sections

### Validation Rules

#### Page Level
- ✅ Page exists and is not null
- ✅ At least one section exists
- ⚠️ Page has title (warning if missing)
- ⚠️ Page has meta description (warning if missing)

#### Section Level
- ✅ Section has ID
- ✅ Section has layout configuration
- ⚠️ Section has at least one component (warning if empty)

#### Component Level

| Component | Required Fields | Warnings |
|-----------|----------------|----------|
| Heading | `text`, `level` (1-6) | Empty text |
| Text | `body` | Empty body |
| Button | `text`, `url` | Empty text, invalid URL |
| Image | `src` | Missing alt text |
| Link | `text`, `url` | Empty text, invalid URL |
| Spacer | `height` (> 0) | - |
| Divider | - | Invalid thickness |

### Usage

```typescript
import { validatePageForExport } from '@/lib/export/exportValidator';

const validation = validatePageForExport(page);

if (!validation.valid) {
  console.error('Errors:', validation.errors);
  return;
}

if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}
```

---

## API Endpoints

### POST `/api/export-preview`

Generate preview URL from Page data.

**Request**:

```json
{
  "page": {
    "id": "page-123",
    "sections": [...],
    "viewport": {...},
    "metadata": {
      "title": "My Site",
      "description": "..."
    }
  }
}
```

**Response (Success)**:

```json
{
  "success": true,
  "url": "http://localhost:3000/preview/a1b2c3d4e5f6g7h8",
  "slug": "a1b2c3d4e5f6g7h8",
  "warnings": []
}
```

**Response (Validation Error)**:

```json
{
  "success": false,
  "error": "Page validation failed",
  "errors": [
    "Page has no sections. Add at least one section to export."
  ]
}
```

**Rate Limiting**: 5 requests per minute

### GET `/preview/[slug]`

Retrieve preview HTML by slug.

**Response**: Raw HTML document

**Errors**:
- 404: Preview expired or not found

---

## Usage Guide

### Basic Preview Workflow

1. **Build your page** using the canvas editor
2. **Click Preview button** in the header
3. **Select "Open Preview"** from dropdown menu
4. Preview opens in a new tab
5. Preview expires after 30 minutes

### Download HTML Workflow

1. **Build your page** using the canvas editor
2. **Click Preview button** in the header
3. **Select "Download HTML"** from dropdown menu
4. HTML file downloads to your computer
5. Open the HTML file in any browser (fully standalone)

### Programmatic Export

```typescript
import { exportToHTML } from '@/lib/export/htmlExporter';
import { validatePageForExport } from '@/lib/export/exportValidator';

// Validate first
const validation = validatePageForExport(page);
if (!validation.valid) {
  throw new Error(validation.errors.join(', '));
}

// Export
const html = exportToHTML(page);

// Save or send
fs.writeFileSync('output.html', html);
```

---

## Responsive Design

### Breakpoints

Bentoblocks uses two responsive breakpoints:

| Breakpoint | Size | Adjustments |
|------------|------|-------------|
| **Tablet** | ≤ 810px | Single column grids, stacked layouts |
| **Mobile** | ≤ 480px | Reduced padding, smaller typography |

### Responsive Behavior

#### Grid Layouts

```css
@media (max-width: 810px) {
  .layout-grid {
    grid-template-columns: 1fr !important;
  }
}
```

All grid layouts collapse to single column on tablet and mobile.

#### Stack Layouts

```css
@media (max-width: 810px) {
  .layout-stack-horizontal {
    flex-direction: column;
  }
}
```

Horizontal stacks become vertical on smaller screens.

#### Typography Scaling

```css
/* Desktop */
h1 { font-size: 3rem; }
h2 { font-size: 2.25rem; }

/* Tablet (≤810px) */
h1 { font-size: 2.25rem; }
h2 { font-size: 1.875rem; }

/* Mobile (≤480px) */
h1 { font-size: 1.875rem; }
h2 { font-size: 1.5rem; }
```

### Testing Responsive Export

1. Export/preview your site
2. Open browser DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M)
4. Test at 1920px, 810px, and 480px widths
5. Verify layouts collapse correctly

---

## Font Loading

### Google Fonts Integration

The export engine automatically detects fonts used in your design and generates the appropriate Google Fonts link.

**Supported Fonts**:
- Inter
- Instrument Serif
- Noto Sans
- Lexend
- Manrope
- EB Garamond
- Playfair Display
- Roboto
- Open Sans
- Lato
- Montserrat
- Poppins

### Font Loading Strategy

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

**Features**:
- Preconnect for faster loading
- Weight variants: 400 (regular), 600 (semibold), 700 (bold)
- `display=swap` to prevent invisible text flash

### Font Application

Fonts are applied via inline styles:

```html
<h1 style="font-family: 'Inter', sans-serif;">
  Heading with Inter font
</h1>
```

**Fallback Stack**: All custom fonts include `sans-serif` fallback.

---

## Best Practices

### For Designers

1. **Test responsive layouts**: Always preview at multiple screen sizes
2. **Use semantic sections**: Choose appropriate section variants (hero, navbar, etc.)
3. **Add alt text**: Include alt text for all images (accessibility)
4. **Set page title**: Add a descriptive title in page metadata
5. **Test standalone**: Download HTML and open locally to ensure no missing dependencies

### For Developers

1. **Validate before export**: Always run validation and handle errors gracefully
2. **Escape user content**: The exporter handles this, but be aware when extending
3. **Keep CSS embedded**: Don't reference external stylesheets
4. **Test preview expiration**: Remember previews expire after 30 minutes
5. **Monitor cache size**: Preview cache is in-memory; consider persistent storage for production

### Performance Tips

1. **Optimize images**: Use appropriately sized images before adding to canvas
2. **Minimize custom fonts**: Limit to 2-3 font families per page
3. **Use modern formats**: WebP for images when possible
4. **Lazy load images**: Consider adding lazy loading for image-heavy pages

---

## Troubleshooting

### Common Issues

**Issue**: Preview URL returns 404

**Solution**: Preview expired (30min TTL). Generate a new preview.

---

**Issue**: Downloaded HTML missing styles

**Solution**: Styles are embedded. Check for browser extensions blocking inline CSS.

---

**Issue**: Fonts not loading in exported HTML

**Solution**: Ensure you have internet connection. Fonts load from Google Fonts CDN.

---

**Issue**: Layout broken on mobile

**Solution**: Test responsive breakpoints. Grids auto-collapse at 810px.

---

**Issue**: Export validation fails

**Solution**: Check validation errors. Ensure all components have required fields.

---

## Future Enhancements

Planned improvements to the export system:

1. **Static Asset Bundling**: Include images inline as base64 or bundle in ZIP
2. **Theme Presets**: Export with different color schemes
3. **Minification**: Compress HTML/CSS for smaller file sizes
4. **Custom CSS Injection**: Allow users to add custom CSS rules
5. **Multiple Page Export**: Export entire multi-page sites
6. **PDF Export**: Generate PDF versions of pages
7. **Email Template Export**: Special export mode for email HTML

---

## Related Documentation

- [Canvas Architecture](./CANVAS_ARCHITECTURE.md)
- [Component System](./COMPONENT_SYSTEM.md)
- [API Security](./API_SECURITY.md)

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
