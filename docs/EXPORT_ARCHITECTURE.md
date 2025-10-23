# Export System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BENTOBLOCKS EXPORT SYSTEM                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                            USER INTERFACE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  PreviewButton Component (components/ui/PreviewButton.tsx)   │  │
│   │                                                               │  │
│   │  ┌──────────┐                                                │  │
│   │  │ Preview ▼│  ← Dropdown Menu                              │  │
│   │  └──────────┘                                                │  │
│   │       │                                                       │  │
│   │       ├── Open Preview → handleNewPreview()                  │  │
│   │       └── Download HTML → handleDownload()                   │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        VALIDATION LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  Export Validator (lib/export/exportValidator.ts)            │  │
│   │                                                               │  │
│   │  validatePageForExport(page: Page)                           │  │
│   │    ├─ Check page exists                                      │  │
│   │    ├─ Validate sections                                      │  │
│   │    ├─ Validate components                                    │  │
│   │    └─ Return { valid, errors, warnings }                     │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
   ┌──────────────────┐        ┌──────────────────┐
   │   PREVIEW PATH   │        │  DOWNLOAD PATH   │
   └──────────────────┘        └──────────────────┘
              │                           │
              ▼                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          EXPORT ENGINE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  HTML Exporter (lib/export/htmlExporter.ts)                  │  │
│   │                                                               │  │
│   │  exportToHTML(page: Page): string                            │  │
│   │    │                                                          │  │
│   │    ├─ renderSection(section: Section)                        │  │
│   │    │    └─ renderComponent(component: Component)             │  │
│   │    │                                                          │  │
│   │    ├─ generateCSS(page: Page)                                │  │
│   │    │    ├─ Layout classes (.layout-stack, .layout-grid)     │  │
│   │    │    ├─ Section variants (.section-hero, .section-cta)   │  │
│   │    │    ├─ Component styles (.btn, .text-content, etc.)     │  │
│   │    │    └─ Responsive breakpoints (@media queries)          │  │
│   │    │                                                          │  │
│   │    ├─ generateGoogleFontsLink(page: Page)                    │  │
│   │    │    └─ Detect used fonts → Generate CDN link            │  │
│   │    │                                                          │  │
│   │    └─ escapeHTML(str: string)                                │  │
│   │         └─ XSS protection                                    │  │
│   │                                                               │  │
│   │  OUTPUT: Complete HTML5 Document                             │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
   ┌──────────────────┐        ┌──────────────────┐
   │   API ENDPOINT   │        │  CLIENT DOWNLOAD │
   └──────────────────┘        └──────────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────┐     ┌──────────────────────┐
│  POST /api/           │     │  Create Blob         │
│  export-preview       │     │  Trigger Download    │
│                       │     │  Save to Disk        │
│  1. Validate          │     │                      │
│  2. Export HTML       │     │  File: page-title    │
│  3. Store in Cache    │     │        .html         │
│  4. Generate URL      │     └──────────────────────┘
│  5. Return Response   │
└───────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          PREVIEW CACHE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  Preview Cache (lib/previewCache.ts)                         │  │
│   │                                                               │  │
│   │  Storage: In-Memory Map<slug, PreviewEntry>                  │  │
│   │  TTL: 30 minutes                                             │  │
│   │  Cleanup: Automatic (on read/write)                          │  │
│   │                                                               │  │
│   │  storePreview(html, contextPrompt)                           │  │
│   │    └─ Generate SHA-256 hash → 16-char slug                  │  │
│   │                                                               │  │
│   │  getPreview(slug)                                            │  │
│   │    └─ Retrieve HTML or null if expired                      │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         PREVIEW DISPLAY                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  GET /preview/[slug] (app/preview/[slug]/route.ts)           │  │
│   │                                                               │  │
│   │  1. Extract slug from URL                                    │  │
│   │  2. Lookup in cache                                          │  │
│   │  3. Return HTML or 404                                       │  │
│   │                                                               │  │
│   │  Headers:                                                     │  │
│   │    Content-Type: text/html; charset=utf-8                    │  │
│   │    Cache-Control: no-store, max-age=0                        │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   BROWSER    │
                    │  (New Tab)   │
                    └──────────────┘

═══════════════════════════════════════════════════════════════════════

                        COMPONENT RENDERING

┌─────────────────────────────────────────────────────────────────────┐
│  Input: Component Object                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  { type: 'heading', content: { text: 'Hello', level: 1 } }          │
│                                                                       │
│                            ↓                                          │
│                   renderComponent()                                   │
│                            ↓                                          │
│                                                                       │
│  Output: HTML String                                                 │
│                                                                       │
│  <h1 style="...">Hello</h1>                                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

Component Type Mapping:
┌──────────┬─────────────────────┬────────────────────────────────────┐
│   Type   │    HTML Element     │        CSS Classes                 │
├──────────┼─────────────────────┼────────────────────────────────────┤
│ heading  │ <h1> - <h6>         │ (none)                             │
│ text     │ <div>               │ .text-content                      │
│ button   │ <a>                 │ .btn .btn-{variant}                │
│ image    │ <figure> + <img>    │ (none)                             │
│ link     │ <a>                 │ .link-component                    │
│ spacer   │ <div>               │ .spacer                            │
│ divider  │ <hr>                │ (none)                             │
└──────────┴─────────────────────┴────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

                        LAYOUT RENDERING

┌─────────────────────────────────────────────────────────────────────┐
│  Stack Layout (Flexbox)                                              │
├─────────────────────────────────────────────────────────────────────┤
│  <section class="layout-stack layout-stack-vertical">                │
│    [components arranged vertically with gap]                         │
│  </section>                                                           │
│                                                                       │
│  CSS:                                                                 │
│    display: flex;                                                    │
│    flex-direction: column;                                           │
│    gap: 16px;                                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Grid Layout (CSS Grid)                                              │
├─────────────────────────────────────────────────────────────────────┤
│  <section class="layout-grid layout-grid-3">                         │
│    [components in 3-column grid]                                     │
│  </section>                                                           │
│                                                                       │
│  CSS:                                                                 │
│    display: grid;                                                    │
│    grid-template-columns: repeat(3, 1fr);                            │
│    gap: 32px;                                                        │
│                                                                       │
│  Responsive:                                                          │
│    @media (max-width: 810px) {                                       │
│      grid-template-columns: 1fr !important;                          │
│    }                                                                  │
└─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

                     RESPONSIVE BREAKPOINTS

Desktop (> 810px)          Tablet (≤ 810px)         Mobile (≤ 480px)
┌──────────────┐          ┌──────────────┐         ┌──────────────┐
│  ┌────┬────┐ │          │  ┌────────┐  │         │  ┌────────┐  │
│  │    │    │ │          │  │        │  │         │  │        │  │
│  │ 1  │ 2  │ │   →      │  └────────┘  │   →     │  └────────┘  │
│  │    │    │ │          │  ┌────────┐  │         │  ┌────────┐  │
│  └────┴────┘ │          │  │        │  │         │  │        │  │
│  Grid: 2 cols │          │  └────────┘  │         │  └────────┘  │
│               │          │  Grid: 1 col  │         │  Smaller pad │
└──────────────┘          └──────────────┘         └──────────────┘

Typography Scaling:
Desktop: h1 = 3rem, h2 = 2.25rem
Tablet:  h1 = 2.25rem, h2 = 1.875rem
Mobile:  h1 = 1.875rem, h2 = 1.5rem

═══════════════════════════════════════════════════════════════════════

                        SECURITY LAYER

User Input → escapeHTML() → Safe Output

Examples:
  <script>alert('XSS')</script>
    ↓
  &lt;script&gt;alert('XSS')&lt;/script&gt;

  <img src=x onerror="alert('XSS')">
    ↓
  &lt;img src=x onerror=&quot;alert('XSS')&quot;&gt;

Escaping Rules:
  & → &amp;
  < → &lt;
  > → &gt;
  " → &quot;
  ' → &#039;

═══════════════════════════════════════════════════════════════════════

                      PERFORMANCE METRICS

Preview Generation:     < 500ms  (simple page)
HTML Export:            < 100ms
API Response:           < 1s
Download Trigger:       Instant
File Size:              5-10 KB (simple page)
Cache Lookup:           < 10ms
Preview TTL:            30 minutes

═══════════════════════════════════════════════════════════════════════

                         ERROR HANDLING

User Action → Validation → Export/Preview
                  ↓
               Errors?
            ┌─────┴─────┐
           Yes          No
            ↓            ↓
     Show Alert     Continue
     Exit Early     (Success)
```

**Last Updated**: 2025-10-23
**Version**: 1.0.0
