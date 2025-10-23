# Export System Testing Guide

This guide walks through testing the complete Preview/Export system for Bentoblocks.

## Prerequisites

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Have a page with at least one section and components

## Test Scenarios

### Scenario 1: Basic Preview Test

**Goal**: Verify preview generation works for a simple page

**Steps**:

1. Create a new section (e.g., Hero section)
2. Add components:
   - Heading: "Welcome to My Site"
   - Text: "This is a test page"
   - Button: "Get Started" → "#contact"
3. Click the **Preview** button in the header
4. Select **"Open Preview"** from dropdown
5. New tab should open with preview

**Expected Results**:
- Preview URL format: `http://localhost:3000/preview/[16-char-hash]`
- Page displays correctly with all components
- Styles match the canvas editor
- Heading renders as `<h1>`
- Button is clickable link

**Verify**:
- Open browser DevTools
- Check HTML structure is semantic
- Check inline CSS is applied
- Verify responsive breakpoints (resize window)

---

### Scenario 2: Download HTML Test

**Goal**: Verify HTML export downloads correctly

**Steps**:

1. Use the same page from Scenario 1
2. Click the **Preview** button
3. Select **"Download HTML"** from dropdown
4. File should download as `bentoblocks-site.html` (or custom title)

**Expected Results**:
- HTML file downloads immediately
- File size: ~5-10 KB for simple page
- No errors in browser console

**Verify**:
- Open downloaded file in browser (double-click)
- Page displays identically to preview
- All styles are embedded (no external CSS)
- Fonts load from Google Fonts CDN
- Works offline for non-font content

---

### Scenario 3: Multi-Section Layout Test

**Goal**: Test complex layouts with multiple sections

**Steps**:

1. Create a page with:
   - Navbar section (horizontal stack)
   - Hero section (vertical stack)
   - Features section (2-column grid)
   - Footer section
2. Add various components to each section
3. Preview and download

**Expected Results**:
- All sections render in correct order
- Grid layouts display as 2 columns on desktop
- Stack layouts respect direction (vertical/horizontal)
- Section variants apply correct default styles

**Verify**:
- Inspect HTML: sections have correct class names
- CSS includes all layout classes
- Responsive: grids collapse to 1 column on mobile

---

### Scenario 4: Responsive Design Test

**Goal**: Verify responsive breakpoints work correctly

**Steps**:

1. Create a page with grid layout (3 columns)
2. Add multiple components
3. Preview the page
4. Test at different screen sizes:
   - Desktop: 1920px
   - Tablet: 810px
   - Mobile: 480px

**Expected Results**:

| Screen Size | Grid Behavior | Typography |
|-------------|---------------|------------|
| 1920px | 3 columns | h1: 3rem |
| 810px | 1 column | h1: 2.25rem |
| 480px | 1 column | h1: 1.875rem |

**Verify**:
- Use Chrome DevTools responsive mode
- Grids collapse at 810px breakpoint
- Font sizes scale down appropriately
- Padding reduces on mobile

---

### Scenario 5: Google Fonts Integration Test

**Goal**: Verify custom fonts load correctly

**Steps**:

1. Create components with different fonts:
   - Heading: "Inter"
   - Text: "EB Garamond"
   - Button: "Poppins"
2. Download HTML
3. Open in browser

**Expected Results**:
- HTML `<head>` contains Google Fonts link
- Link includes all 3 fonts
- Fonts load and display correctly
- Fallback to sans-serif if offline

**Verify in HTML**:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=EB+Garamond:wght@400;600;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

---

### Scenario 6: Validation Test (Error Cases)

**Goal**: Test validation catches errors

**Steps**:

1. **Test 1**: Empty page
   - Clear all sections
   - Try to preview
   - Expected: Alert "Add some sections or blocks to your canvas first!"

2. **Test 2**: Button without URL
   - Add button with empty URL
   - Try to export
   - Expected: Validation error

3. **Test 3**: Image without src
   - Add image component
   - Clear the src field
   - Try to preview
   - Expected: Error "Image component has no source URL"

**Expected Results**:
- All validation errors are caught before export
- User receives clear error messages
- Export/preview does not proceed on errors
- Warnings are logged to console but don't block export

---

### Scenario 7: Preview Cache Expiration Test

**Goal**: Verify preview URLs expire after 30 minutes

**Steps**:

1. Generate a preview
2. Copy the preview URL
3. Wait 30+ minutes (or manually delete from cache)
4. Revisit the URL

**Expected Results**:
- After 30 minutes: 404 "Preview expired or not found"
- Cache cleanup happens automatically
- New preview gets fresh URL

**Note**: For quick testing, modify `CACHE_TTL_MS` in `lib/previewCache.ts` to a shorter duration (e.g., 60000 = 1 minute).

---

### Scenario 8: XSS Protection Test

**Goal**: Verify HTML escaping prevents XSS

**Steps**:

1. Add heading with text: `<script>alert('XSS')</script>`
2. Add text with: `<img src=x onerror="alert('XSS')">`
3. Preview and download

**Expected Results**:
- Scripts do not execute
- HTML is escaped:
  ```html
  <h1>&lt;script&gt;alert('XSS')&lt;/script&gt;</h1>
  ```
- No JavaScript alerts appear
- Content displays as plain text

---

### Scenario 9: Component Type Coverage Test

**Goal**: Test all component types export correctly

**Steps**:

Create a page with one of each component type:

1. **Heading** (level 1-6)
2. **Text** (with rich HTML)
3. **Button** (filled, outlined, text variants)
4. **Image** (with caption)
5. **Link** (with description)
6. **Spacer** (various heights)
7. **Divider** (custom color/thickness)

**Expected HTML Output**:

| Component | Expected HTML Element |
|-----------|-----------------------|
| Heading | `<h1>` - `<h6>` |
| Text | `<div class="text-content">` |
| Button | `<a class="btn btn-filled">` |
| Image | `<figure><img></figure>` |
| Link | `<a class="link-component">` |
| Spacer | `<div class="spacer">` |
| Divider | `<hr>` |

**Verify**:
- Each component renders with correct HTML tag
- CSS classes are applied
- Inline styles work
- Interactive elements (buttons, links) are functional

---

### Scenario 10: Performance Test

**Goal**: Test export performance with large pages

**Steps**:

1. Create a page with:
   - 10 sections
   - 50+ components total
   - Multiple images
   - Various fonts
2. Measure preview generation time
3. Measure download time

**Expected Results**:
- Preview generation: < 2 seconds
- Download: < 1 second
- HTML file size: < 100 KB (without base64 images)
- No browser console errors
- No memory leaks

**Monitor**:
- Network tab: Preview API call time
- Console: Any performance warnings
- Memory: Check for leaks after multiple exports

---

## Automated Testing (Future)

### Playwright Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should preview page successfully', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Add a section and component
  await page.click('[data-testid="add-section-hero"]');
  await page.fill('[data-testid="heading-input"]', 'Test Heading');

  // Click preview
  const previewButton = page.locator('button:has-text("Preview")');
  await previewButton.click();

  // Wait for new tab
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=Open Preview'),
  ]);

  // Verify preview content
  await expect(newPage.locator('h1')).toHaveText('Test Heading');
});
```

---

## Troubleshooting

### Issue: Preview returns 404
**Solution**: Preview expired (30min TTL). Generate new preview.

### Issue: Fonts not loading
**Solution**: Check internet connection. Fonts load from Google CDN.

### Issue: Layout broken on mobile
**Solution**: Verify responsive CSS is included. Check breakpoints at 810px and 480px.

### Issue: Download not working
**Solution**: Check browser pop-up blocker. Some browsers block automatic downloads.

### Issue: HTML file won't open
**Solution**: Ensure file extension is `.html`. Try different browser.

---

## Success Criteria

✅ All 10 test scenarios pass
✅ No console errors during export/preview
✅ HTML validates (W3C Validator)
✅ Responsive design works on all breakpoints
✅ XSS protection prevents script execution
✅ Performance meets targets (< 2s preview generation)
✅ Downloaded HTML works offline (except fonts)

---

**Last Updated**: 2025-10-23
