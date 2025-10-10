/**
 * Sanitize HTML content to prevent XSS attacks while preserving rich text formatting
 *
 * Allows safe HTML tags and styling attributes needed for rich text editing.
 * Strips dangerous tags like <script>, <iframe>, event handlers, etc.
 */

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'blockquote', 'code', 'pre'
];

const ALLOWED_ATTRIBUTES = [
  'style', 'class', 'href', 'target', 'rel'
];

const ALLOWED_STYLES = [
  'color', 'background-color', 'font-size', 'font-family', 'font-weight',
  'font-style', 'text-decoration', 'text-align'
];

/**
 * Check if content contains HTML tags
 */
export function isHtmlContent(content: string): boolean {
  if (!content) return false;
  // Check for common HTML tags
  return /<[a-z][\s\S]*>/i.test(content);
}

/**
 * Convert plain text to HTML paragraph
 */
export function plainTextToHtml(text: string): string {
  if (!text) return '<p></p>';
  if (isHtmlContent(text)) return text;

  // Convert newlines to <br> tags and wrap in paragraph
  const htmlText = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('<br>');

  return `<p>${htmlText}</p>`;
}

/**
 * Strip HTML tags from content, leaving only plain text
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitize HTML content by removing dangerous tags and attributes
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Create a temporary DOM element to parse HTML
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization using regex
    return serverSideSanitize(html);
  }

  // Client-side: use DOM parsing
  const temp = document.createElement('div');
  temp.innerHTML = html;

  return sanitizeNode(temp).innerHTML;
}

/**
 * Server-side sanitization fallback using regex
 */
function serverSideSanitize(html: string): string {
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');

  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  return sanitized;
}

/**
 * Recursively sanitize DOM nodes
 */
function sanitizeNode(node: HTMLElement): HTMLElement {
  const nodeName = node.nodeName.toLowerCase();

  // Remove the node if it's not allowed
  if (node.nodeType === 1) { // Element node
    if (!ALLOWED_TAGS.includes(nodeName)) {
      // Replace with text content
      const textNode = document.createTextNode(node.textContent || '');
      node.parentNode?.replaceChild(textNode, node);
      return node;
    }

    // Remove dangerous attributes
    const attributes = Array.from(node.attributes);
    for (const attr of attributes) {
      const attrName = attr.name.toLowerCase();

      // Remove event handlers
      if (attrName.startsWith('on')) {
        node.removeAttribute(attr.name);
        continue;
      }

      // Remove dangerous protocols
      if (attrName === 'href' || attrName === 'src') {
        const value = attr.value.toLowerCase();
        if (value.startsWith('javascript:') || value.startsWith('data:')) {
          node.removeAttribute(attr.name);
          continue;
        }
      }

      // Only allow specific attributes
      if (!ALLOWED_ATTRIBUTES.includes(attrName)) {
        node.removeAttribute(attr.name);
        continue;
      }

      // Sanitize style attribute
      if (attrName === 'style') {
        sanitizeStyle(node);
      }
    }
  }

  // Recursively sanitize children
  const children = Array.from(node.children) as HTMLElement[];
  for (const child of children) {
    sanitizeNode(child);
  }

  return node;
}

/**
 * Sanitize inline styles
 */
function sanitizeStyle(element: HTMLElement): void {
  const style = element.getAttribute('style');
  if (!style) return;

  const styles = style.split(';').map(s => s.trim()).filter(s => s);
  const allowedStyles: string[] = [];

  for (const styleRule of styles) {
    const [property] = styleRule.split(':').map(s => s.trim());
    if (ALLOWED_STYLES.includes(property)) {
      allowedStyles.push(styleRule);
    }
  }

  if (allowedStyles.length > 0) {
    element.setAttribute('style', allowedStyles.join('; '));
  } else {
    element.removeAttribute('style');
  }
}

/**
 * Validate and ensure HTML content is safe for rendering
 */
export function validateHtmlContent(content: string): string {
  if (!content) return '<p></p>';

  // Convert plain text to HTML if needed
  if (!isHtmlContent(content)) {
    return plainTextToHtml(content);
  }

  // Sanitize HTML content
  return sanitizeHtml(content);
}
