import { test, expect } from '@playwright/test';

test.describe('Simple Font Test', () => {
  test('Check if font utilities work', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Create a test div with font class
    const fontTest = await page.evaluate(() => {
      const testDiv = document.createElement('div');
      testDiv.className = 'font-lexend';
      testDiv.textContent = 'Test';
      document.body.appendChild(testDiv);

      const computed = window.getComputedStyle(testDiv);
      const result = {
        fontFamily: computed.fontFamily,
        className: testDiv.className
      };

      document.body.removeChild(testDiv);
      return result;
    });

    console.log('Font utility test:', fontTest);

    // Check if Lexend font is applied (should contain 'Lexend' in the font-family string)
    expect(fontTest.fontFamily).toContain('Lexend');
  });
});
