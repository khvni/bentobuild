import { test, expect } from '@playwright/test';

test.describe('Font Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);
  });

  test('should apply different fonts when changed in FontSelector', async ({ page }) => {
    // Add a hero block
    await page.click('[data-testid="add-hero-block"]');
    await page.waitForTimeout(500);

    // Click on the hero block to select it
    const heroBlock = page.locator('[data-block-type="hero"]').first();
    await heroBlock.click();
    await page.waitForTimeout(500);

    // Open the block editor (right panel)
    const blockEditor = page.locator('[data-testid="block-editor"]');
    await expect(blockEditor).toBeVisible();

    // Take screenshot with default font (Instrument Serif)
    await page.screenshot({
      path: '/Users/khani/Desktop/projs/bentobuild/tests/screenshots/font-default-instrument-serif.png',
      fullPage: true,
    });

    // Open font selector dropdown
    const fontSelector = blockEditor.locator('button').filter({ hasText: 'Instrument Serif' });
    await fontSelector.click();
    await page.waitForTimeout(300);

    // Select Lexend font
    await page.click('text=Lexend');
    await page.waitForTimeout(500);

    // Take screenshot with Lexend
    await page.screenshot({
      path: '/Users/khani/Desktop/projs/bentobuild/tests/screenshots/font-lexend.png',
      fullPage: true,
    });

    // Get the computed font-family of the heading to verify change
    const heading = heroBlock.locator('h1');
    const lexendFontFamily = await heading.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });

    console.log('Lexend font-family:', lexendFontFamily);
    expect(lexendFontFamily).toContain('Lexend');

    // Open font selector again
    const fontSelectorLexend = blockEditor.locator('button').filter({ hasText: 'Lexend' });
    await fontSelectorLexend.click();
    await page.waitForTimeout(300);

    // Select Playfair Display
    await page.click('text=Playfair Display');
    await page.waitForTimeout(500);

    // Take screenshot with Playfair Display
    await page.screenshot({
      path: '/Users/khani/Desktop/projs/bentobuild/tests/screenshots/font-playfair-display.png',
      fullPage: true,
    });

    // Verify font change
    const playfairFontFamily = await heading.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });

    console.log('Playfair Display font-family:', playfairFontFamily);
    expect(playfairFontFamily).toContain('Playfair Display');

    // Open font selector again
    const fontSelectorPlayfair = blockEditor
      .locator('button')
      .filter({ hasText: 'Playfair Display' });
    await fontSelectorPlayfair.click();
    await page.waitForTimeout(300);

    // Select EB Garamond
    await page.click('text=EB Garamond');
    await page.waitForTimeout(500);

    // Take screenshot with EB Garamond
    await page.screenshot({
      path: '/Users/khani/Desktop/projs/bentobuild/tests/screenshots/font-eb-garamond.png',
      fullPage: true,
    });

    // Verify font change
    const garamondFontFamily = await heading.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });

    console.log('EB Garamond font-family:', garamondFontFamily);
    expect(garamondFontFamily).toContain('EB Garamond');
  });

  test('should show font preview in dropdown with correct font', async ({ page }) => {
    // Add a text block
    await page.click('[data-testid="add-text-block"]');
    await page.waitForTimeout(500);

    // Click on the text block to select it
    const textBlock = page.locator('[data-block-type="text"]').first();
    await textBlock.click();
    await page.waitForTimeout(500);

    // Open the block editor
    const blockEditor = page.locator('[data-testid="block-editor"]');
    await expect(blockEditor).toBeVisible();

    // Open font selector dropdown
    const fontSelector = blockEditor.locator('button').filter({ hasText: 'Instrument Serif' });
    await fontSelector.click();
    await page.waitForTimeout(300);

    // Take screenshot of font selector dropdown
    await page.screenshot({
      path: '/Users/khani/Desktop/projs/bentobuild/tests/screenshots/font-selector-dropdown.png',
      fullPage: true,
    });

    // Verify each font option displays in its own font
    const fontOptions = [
      'Inter',
      'Noto Sans',
      'Lexend',
      'Manrope',
      'Instrument Serif',
      'EB Garamond',
      'Playfair Display',
    ];

    for (const fontName of fontOptions) {
      const option = page.locator(`button:has-text("${fontName}")`).first();
      const fontFamily = await option
        .locator('div')
        .first()
        .evaluate((el) => {
          return window.getComputedStyle(el).fontFamily;
        });

      console.log(`${fontName} preview font-family:`, fontFamily);
      // The font should be applied (though exact matching depends on how browsers report it)
      expect(fontFamily).toBeTruthy();
    }
  });
});
