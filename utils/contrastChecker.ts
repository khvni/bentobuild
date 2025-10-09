/**
 * Contrast Checker Utility
 *
 * Calculates WCAG contrast ratios and validates compliance.
 *
 * WCAG Standards:
 * - Level AA: 4.5:1 for normal text, 3:1 for large text (18pt+)
 * - Level AAA: 7:1 for normal text, 4.5:1 for large text
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance
 * Formula from WCAG 2.1: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;

  // Convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const rLinear =
    rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear =
    gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear =
    bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * Formula from WCAG 2.1: (L1 + 0.05) / (L2 + 0.05)
 * where L1 is the lighter color and L2 is the darker color
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export interface ContrastCheck {
  ratio: number;
  passAA: boolean;
  passAALarge: boolean;
  passAAA: boolean;
  passAAALarge: boolean;
}

export function checkContrast(
  foreground: string,
  background: string
): ContrastCheck {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passAA: ratio >= 4.5,
    passAALarge: ratio >= 3,
    passAAA: ratio >= 7,
    passAAALarge: ratio >= 4.5,
  };
}

/**
 * Get a readable description of contrast compliance
 */
export function getContrastDescription(check: ContrastCheck): string {
  if (check.passAAA) {
    return `Excellent (${check.ratio}:1) - Passes WCAG AAA`;
  } else if (check.passAA) {
    return `Good (${check.ratio}:1) - Passes WCAG AA`;
  } else if (check.passAALarge) {
    return `Fair (${check.ratio}:1) - Passes WCAG AA for large text only`;
  } else {
    return `Poor (${check.ratio}:1) - Fails WCAG standards`;
  }
}

/**
 * Suggest a compliant color by adjusting lightness
 */
export function suggestCompliantColor(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): string {
  // This is a simplified version - would need more sophisticated algorithm
  // for production use
  const ratio = getContrastRatio(foreground, background);

  if (ratio >= targetRatio) {
    return foreground; // Already compliant
  }

  // For now, suggest darkening or lightening
  const bgLum = getLuminance(background);

  if (bgLum > 0.5) {
    return '#000000'; // Use black on light backgrounds
  } else {
    return '#FFFFFF'; // Use white on dark backgrounds
  }
}
