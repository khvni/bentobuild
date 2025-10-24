import { test, expect } from '@playwright/test';

test.describe('Google Fonts Verification', () => {
  test('should load all Google Fonts and allow font switching', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check if CSS variables are set on the HTML element
    const htmlElement = page.locator('html');
    const htmlClass = await htmlElement.getAttribute('class');
    console.log('HTML class attribute:', htmlClass);

    // Next.js hashes the font variable names, so we should see multiple __variable_ classes
    // Verify that we have 7 font classes (one for each font)
    const variableClasses = htmlClass?.match(/__variable_\w+/g) || [];
    console.log(`Found ${variableClasses.length} font variable classes:`, variableClasses);
    expect(variableClasses.length).toBe(7);

    // Check if Next.js has embedded Google Fonts CSS in the page
    const fontStyleTags = await page.locator('style[data-href*="fonts.googleapis.com"]').count();
    const fontLinkTags = await page.locator('link[href*="fonts.googleapis.com"]').count();
    console.log(`Font style tags found: ${fontStyleTags}`);
    console.log(`Font link tags found: ${fontLinkTags}`);

    // Check computed styles to verify CSS variables are defined
    const cssVarCheck = await page.evaluate(() => {
      const html = document.documentElement;
      const computed = window.getComputedStyle(html);
      const vars = [
        '--font-inter',
        '--font-noto-sans',
        '--font-lexend',
        '--font-manrope',
        '--font-instrument-serif',
        '--font-eb-garamond',
        '--font-playfair-display',
      ];

      const results: Record<string, string> = {};
      vars.forEach((varName) => {
        const value = computed.getPropertyValue(varName);
        results[varName] = value || 'NOT_DEFINED';
      });
      return results;
    });
    console.log('CSS variables:', cssVarCheck);

    // Check for @font-face rules
    const fontFaceRules = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      let fontFaceCount = 0;
      const fontFaces: string[] = [];

      styleSheets.forEach((sheet) => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          rules.forEach((rule) => {
            if (rule instanceof CSSFontFaceRule) {
              fontFaceCount++;
              const fontFamily = rule.style.getPropertyValue('font-family');
              if (fontFamily) {
                fontFaces.push(fontFamily.replace(/['"]/g, ''));
              }
            }
          });
        } catch (e) {
          // Skip stylesheets we can't access (CORS)
        }
      });

      return { count: fontFaceCount, fonts: [...new Set(fontFaces)] };
    });
    console.log(`@font-face rules found: ${fontFaceRules.count}`);
    console.log(`Font families declared:`, fontFaceRules.fonts);

    // Add a Hero block
    console.log('Adding Hero block...');
    const heroPaletteButton = page.locator('button:has-text("Hero")').first();
    await heroPaletteButton.click();

    // Wait for the block to appear
    await page.waitForTimeout(1000);

    // Take screenshot of initial state
    await page.screenshot({
      path: 'tests/screenshots/font-test-01-initial.png',
      fullPage: true,
    });
    console.log('Screenshot 1: Initial state saved');

    // Click on the Hero block to select it
    console.log('Selecting Hero block...');
    const heroBlock = page.locator('[data-block-type="hero"]').first();
    await heroBlock.click();

    // Wait for BlockEditorPanel to open
    await page.waitForTimeout(1000);

    // Verify the editor panel is visible using aria-label
    const editorPanel = page.locator('aside[aria-label="Block editor panel"]');
    await expect(editorPanel).toBeVisible();

    console.log('BlockEditorPanel is visible');

    // Expand Typography section if it's collapsed
    const typographySection = page.locator('button:has-text("Typography")');
    const typographyExpanded = await typographySection.evaluate((el) => {
      const svg = el.querySelector('svg');
      return svg?.classList.contains('rotate-180') || false;
    });

    if (!typographyExpanded) {
      console.log('Expanding Typography section...');
      await typographySection.click();
      await page.waitForTimeout(500);
    }

    // Find the Font Family button (custom dropdown trigger)
    const fontButton = page
      .locator('button:has-text("Instrument Serif")')
      .or(page.locator('label:has-text("Font Family")').locator('~ button'))
      .first();

    await expect(fontButton).toBeVisible();
    console.log('Font selector button found');

    // Get current font value
    const currentFont = await fontButton.textContent();
    console.log('Current font:', currentFont?.trim());

    // Helper function to select a font
    const selectFont = async (fontName: string) => {
      // Click to open dropdown
      await fontButton.click();
      await page.waitForTimeout(300);

      // Click the font option
      const fontOption = page
        .locator(`button:has-text("${fontName}")`)
        .filter({
          has: page.locator(`div:text-is("${fontName}")`),
        })
        .first();
      await fontOption.click();
      await page.waitForTimeout(500);
    };

    // Get computed font-family from the hero heading
    const heroHeading = page.locator('[data-block-type="hero"] .tiptap').first();

    // Test 1: Change to Lexend
    console.log('Changing font to Lexend...');
    await selectFont('Lexend');

    // Check what classes are applied to the parent element with the font class
    const fontParent = page.locator('[data-block-type="hero"] .max-w-3xl').first();
    const parentClasses = await fontParent.getAttribute('class');
    console.log('Font parent element classes:', parentClasses);

    // Check the actual computed font on the .max-w-3xl element
    const maxWidthFont = await fontParent.evaluate((el) => {
      const computed = window.getComputedStyle(el).fontFamily;

      // Check if Tailwind font utility exists
      const testDiv = document.createElement('div');
      testDiv.className = 'font-lexend';
      document.body.appendChild(testDiv);
      const tailwindFont = window.getComputedStyle(testDiv).fontFamily;
      document.body.removeChild(testDiv);

      return { elementFont: computed, tailwindUtility: tailwindFont };
    });
    console.log('Font check:', maxWidthFont);

    const lexendFont = await heroHeading.evaluate((el) => {
      // Find the parent with the font class (the .max-w-3xl div)
      const parent = el.parentElement?.parentElement;
      const parentFont = parent ? window.getComputedStyle(parent).fontFamily : 'N/A';
      const parentClasses = parent ? parent.className : 'N/A';
      const elFont = window.getComputedStyle(el).fontFamily;
      return {
        parentClasses,
        parentFont,
        elementFont: elFont,
      };
    });
    console.log('Font details after Lexend change:', lexendFont);

    await page.screenshot({
      path: 'tests/screenshots/font-test-02-lexend.png',
      fullPage: true,
    });
    console.log('Screenshot 2: Lexend font saved');

    // Test 2: Change to Noto Sans
    console.log('Changing font to Noto Sans...');
    await selectFont('Noto Sans');

    const notoFont = await heroHeading.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
    console.log('Font after Noto Sans change:', notoFont);

    await page.screenshot({
      path: 'tests/screenshots/font-test-03-noto-sans.png',
      fullPage: true,
    });
    console.log('Screenshot 3: Noto Sans font saved');

    // Test 3: Change to Playfair Display
    console.log('Changing font to Playfair Display...');
    await selectFont('Playfair Display');

    const playfairFont = await heroHeading.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
    console.log('Font after Playfair Display change:', playfairFont);

    await page.screenshot({
      path: 'tests/screenshots/font-test-04-playfair.png',
      fullPage: true,
    });
    console.log('Screenshot 4: Playfair Display font saved');

    // Verify fonts are different
    expect(lexendFont).not.toBe(notoFont);
    expect(notoFont).not.toBe(playfairFont);

    console.log('Font switching test completed successfully!');
  });

  test('should check browser console for font loading errors', async ({ page }) => {
    const consoleMessages: string[] = [];
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);
      if (msg.type() === 'error') {
        consoleErrors.push(text);
        console.log('Console error:', text);
      }
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for font-related errors
    const fontErrors = consoleErrors.filter(
      (err) =>
        err.toLowerCase().includes('font') ||
        err.toLowerCase().includes('googleapis') ||
        err.toLowerCase().includes('gstatic')
    );

    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Total console errors: ${consoleErrors.length}`);
    console.log(`Font-related errors: ${fontErrors.length}`);

    if (fontErrors.length > 0) {
      console.log('Font errors found:');
      fontErrors.forEach((err) => console.log('  -', err));
    }

    // Test should still pass even if there are errors, we just want to report them
    expect(fontErrors.length).toBe(0);
  });
});
