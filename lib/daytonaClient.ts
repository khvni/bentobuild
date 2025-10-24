import { Daytona } from '@daytonaio/sdk';
import { storePreview } from '@/lib/previewCache';
import { Block, BlockType, FontFamily } from '@/types/block.types';

// Font family mapping for HTML/CSS
const FONT_MAP: Record<FontFamily, string> = {
  Inter: "'Inter', sans-serif",
  'Instrument Serif': "'Instrument Serif', serif",
  'Noto Sans': "'Noto Sans', sans-serif",
  Lexend: "'Lexend', sans-serif",
  Manrope: "'Manrope', sans-serif",
  'EB Garamond': "'EB Garamond', serif",
  'Playfair Display': "'Playfair Display', serif",
};

const DEFAULT_FONT_BY_BLOCK: Record<BlockType, FontFamily> = {
  hero: 'Instrument Serif',
  text: 'Instrument Serif',
  image: 'Instrument Serif',
  button: 'Manrope',
  link: 'Manrope',
  navbar: 'Manrope',
  footer: 'Instrument Serif',
};

// Convert FontFamily to CSS font-family value, falling back to sensible block defaults
function getFontFamilyCSS(font: FontFamily | undefined, blockType: BlockType): string {
  const resolvedFont = font ?? DEFAULT_FONT_BY_BLOCK[blockType];
  return FONT_MAP[resolvedFont] ?? FONT_MAP['Manrope'];
}

// Convert fontSize to CSS classes
function getFontSizeCSS(size?: string, type: 'heading' | 'body' = 'heading'): string {
  if (type === 'heading') {
    switch (size) {
      case 'small':
        return 'font-size: 1.875rem;'; // text-3xl
      case 'large':
        return 'font-size: 4.5rem;'; // text-7xl
      case 'xlarge':
        return 'font-size: 6rem;'; // text-8xl
      default:
        return 'font-size: 3rem;'; // text-5xl (medium)
    }
  } else {
    switch (size) {
      case 'small':
        return 'font-size: 1rem;'; // text-base
      case 'large':
        return 'font-size: 1.25rem;'; // text-xl
      case 'xlarge':
        return 'font-size: 1.5rem;'; // text-2xl
      default:
        return 'font-size: 1.125rem;'; // text-lg (medium)
    }
  }
}

interface PreviewResult {
  success: boolean;
  url?: string;
  sandboxId?: string;
  error?: string;
  isMock?: boolean;
  fallbackSlug?: string;
}

/**
 * Generate static HTML from blocks array
 */
export function generateStaticHTML(blocks: Block[], contextPrompt: string): string {
  if (!blocks || blocks.length === 0) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Empty Preview - Bentoblocks</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen">
  <div class="text-center">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">No Content</h1>
    <p class="text-gray-600">Add blocks to your canvas to preview your site.</p>
  </div>
</body>
</html>`;
  }

  const blocksHTML = blocks
    .sort((a, b) => a.order - b.order)
    .map((block) => {
      try {
        switch (block.type) {
          case 'hero': {
            const bgColor = block.content.backgroundColor || '#3B82F6';
            const textColor = block.content.textColor || '#FFFFFF';
            const buttonBg = block.content.buttonColor || '#FFFFFF';
            const buttonText = block.content.buttonTextColor || '#3B82F6';
            const fontFamily = getFontFamilyCSS(block.content.fontFamily, 'hero');
            const headingSize = getFontSizeCSS(block.content.fontSize, 'heading');
            const bodySize = getFontSizeCSS(block.content.fontSize, 'body');

            return `
    <section class="relative px-8 py-16" style="background-color: ${bgColor}; color: ${textColor}; font-family: ${fontFamily};">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="font-bold mb-4" style="${headingSize}">${sanitizeHtmlForPreview(block.content.heading)}</h1>
        <p class="mb-8" style="${bodySize}">${sanitizeHtmlForPreview(block.content.subheading)}</p>
        ${
          block.content.ctaText
            ? `<a href="${escapeHTML(block.content.ctaLink)}" class="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90" style="background-color: ${buttonBg}; color: ${buttonText};">${escapeHTML(block.content.ctaText)}</a>`
            : ''
        }
      </div>
    </section>`;
          }

          case 'text': {
            const bgColor = block.content.backgroundColor || '#FFFFFF';
            const headingColor = block.content.headingColor || '#111827';
            const textColor = block.content.textColor || '#4B5563';
            const fontFamily = getFontFamilyCSS(block.content.fontFamily, 'text');
            const headingSize = getFontSizeCSS(block.content.fontSize, 'heading');
            const bodySize = getFontSizeCSS(block.content.fontSize, 'body');

            return `
    <section class="px-8 py-12" style="background-color: ${bgColor}; font-family: ${fontFamily};">
      <div class="max-w-3xl mx-auto">
        <h2 class="font-bold mb-4" style="color: ${headingColor}; ${headingSize}">${sanitizeHtmlForPreview(block.content.heading)}</h2>
        <div class="leading-relaxed prose prose-sm max-w-none" style="color: ${textColor}; ${bodySize}">${sanitizeHtmlForPreview(block.content.body)}</div>
      </div>
    </section>`;
          }

          case 'image': {
            const bgColor = block.content.backgroundColor || '#F9FAFB';
            const captionColor = block.content.captionColor || '#4B5563';
            const fontFamily = getFontFamilyCSS(block.content.fontFamily, 'image');

            return `
    <section class="px-8 py-12" style="background-color: ${bgColor};">
      <div class="max-w-4xl mx-auto">
        <img src="${escapeHTML(block.content.src)}" alt="${escapeHTML(block.content.alt)}" class="w-full rounded-lg shadow-lg mb-4" />
        ${block.content.caption ? `<div class="text-center italic" style="color: ${captionColor}; font-family: ${fontFamily};">${sanitizeHtmlForPreview(block.content.caption)}</div>` : ''}
      </div>
    </section>`;
          }

          case 'button': {
            const buttonStyle = block.content.style || 'filled';
            const backgroundColor = block.content.backgroundColor || '#3B82F6';
            const textColor = block.content.textColor || '#FFFFFF';
            const borderColor = block.content.borderColor || backgroundColor;
            const fontFamily = getFontFamilyCSS(block.content.fontFamily, 'button');
            let buttonClass =
              'inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200';
            let styleAttr = '';

            if (buttonStyle === 'filled') {
              buttonClass += ' shadow-md hover:shadow-lg';
              styleAttr = `background-color: ${backgroundColor}; color: ${textColor}; font-family: ${fontFamily};`;
            } else if (buttonStyle === 'outlined') {
              buttonClass += ' border-2';
              styleAttr = `border-color: ${borderColor}; color: ${borderColor}; font-family: ${fontFamily};`;
            } else if (buttonStyle === 'text') {
              styleAttr = `color: ${textColor}; font-family: ${fontFamily};`;
            }

            return `
    <section class="px-8 py-12 bg-white">
      <div class="max-w-2xl mx-auto text-center">
        <a href="${escapeHTML(block.content.url)}" class="${buttonClass}" style="${styleAttr}">${escapeHTML(block.content.text)}</a>
      </div>
    </section>`;
          }

          case 'link': {
            const bgColor = block.content.backgroundColor || '#FFFFFF';
            const textColor = block.content.textColor || '#4B5563';
            const linkColor = block.content.linkColor || '#3B82F6';
            const fontFamily = getFontFamilyCSS(block.content.fontFamily, 'link');

            return `
    <section class="px-8 py-12 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors" style="background-color: ${bgColor}; font-family: ${fontFamily};">
      <div class="max-w-2xl mx-auto">
        <a href="${escapeHTML(block.content.url)}" class="flex items-start gap-3 group">
          <svg class="w-6 h-6 flex-shrink-0 mt-1 transition-colors" style="color: ${linkColor};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <div>
            <h3 class="text-2xl font-semibold mb-2 transition-colors" style="color: ${linkColor};">${escapeHTML(block.content.text)}</h3>
            ${block.content.description ? `<p style="color: ${textColor};">${escapeHTML(block.content.description)}</p>` : ''}
            <p class="text-sm mt-2 font-mono" style="color: ${textColor}; opacity: 0.8;">${escapeHTML(block.content.url)}</p>
          </div>
        </a>
      </div>
    </section>`;
          }

          case 'navbar': {
            const links = block.content.links || [];
            const bgColor = block.content.backgroundColor || '#FFFFFF';
            const textColor = block.content.textColor || '#111827';
            const linkColor = block.content.linkColor || '#4B5563';
            const linkHoverColor = block.content.linkHoverColor || '#3B82F6';
            const fontFamily = getFontFamilyCSS(block.content.fontFamily, 'navbar');

            const linksHTML = links
              .map(
                (link) =>
                  `<a href="${escapeHTML(link.url)}" class="font-medium transition-colors" style="color: ${linkColor}; font-family: ${fontFamily};" onmouseover="this.style.color='${linkHoverColor}'" onmouseout="this.style.color='${linkColor}'">${escapeHTML(link.text)}</a>`
              )
              .join('\n            ');

            return `
    <nav class="border-b-2 border-gray-200 shadow-sm sticky top-0 z-50" style="background-color: ${bgColor}; font-family: ${fontFamily};">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            ${block.content.logoUrl ? `<img src="${escapeHTML(block.content.logoUrl)}" alt="${escapeHTML(block.content.brandName)}" class="h-8 w-8 object-contain" />` : ''}
            <span class="text-xl font-bold" style="color: ${textColor};">${escapeHTML(block.content.brandName)}</span>
          </div>
          <div class="hidden md:flex items-center gap-6">
            ${linksHTML}
          </div>
          <button class="md:hidden p-2 rounded-lg transition-colors" style="color: ${linkColor};" onmouseover="this.style.backgroundColor='rgba(0,0,0,0.05)'" onmouseout="this.style.backgroundColor='transparent'" onclick="this.nextElementSibling.classList.toggle('hidden')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="hidden md:hidden absolute top-16 left-0 right-0 border-b border-gray-200 shadow-lg p-4" style="background-color: ${bgColor};">
            <div class="flex flex-col gap-3">
              ${links.map((link) => `<a href="${escapeHTML(link.url)}" class="font-medium py-2 transition-colors" style="color: ${linkColor};" onmouseover="this.style.color='${linkHoverColor}'" onmouseout="this.style.color='${linkColor}'">${escapeHTML(link.text)}</a>`).join('\n              ')}
            </div>
          </div>
        </div>
      </div>
    </nav>`;
          }

          case 'footer': {
            const socialLinks = block.content.socialLinks || [];
            const bgColor = block.content.backgroundColor || '#111827';
            const textColor = block.content.textColor || '#FFFFFF';
            const linkColor = block.content.linkColor || '#9CA3AF';
            const fontFamily = getFontFamilyCSS(block.content.fontFamily, 'footer');

            const socialLinksHTML = socialLinks
              .map(
                (link) =>
                  `<a href="${escapeHTML(link.url)}" class="transition-colors hover:underline" style="color: ${linkColor};">${escapeHTML(link.platform)}</a>`
              )
              .join('\n            ');

            return `
    <footer class="border-t-4 border-yellow-400" style="background-color: ${bgColor}; color: ${textColor}; font-family: ${fontFamily};">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <div class="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 class="text-xl font-bold mb-3">${escapeHTML(block.content.companyName)}</h3>
            <p class="text-sm" style="color: ${linkColor};">
              <a href="mailto:${escapeHTML(block.content.contactEmail)}" class="hover:underline">${escapeHTML(block.content.contactEmail)}</a>
            </p>
          </div>
          <div class="flex items-center justify-center">
            <p class="text-sm" style="color: ${linkColor};">${escapeHTML(block.content.copyright)}</p>
          </div>
          <div>
            <p class="text-sm font-semibold mb-3 uppercase tracking-wide" style="color: ${linkColor};">Connect</p>
            <div class="flex flex-col gap-2 text-sm">
              ${socialLinksHTML}
            </div>
          </div>
        </div>
      </div>
    </footer>`;
          }

          default:
            return '';
        }
      } catch (error) {
        console.error('Error rendering block:', block.id, error);
        return `<!-- Error rendering block ${block.id} -->`;
      }
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - Bentoblocks</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <meta name="description" content="${escapeHTML(contextPrompt)}">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans:wght@400;600;700&family=Lexend:wght@400;600;700&family=Manrope:wght@400;600;700&family=Instrument+Serif&family=EB+Garamond:wght@400;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">

  <style>
    body {
      margin: 0;
      font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
  </style>
</head>
<body class="bg-gray-50">
  ${blocksHTML}

  <footer class="px-8 py-6 bg-gray-900 text-white text-center text-sm">
    <p>Built with <span class="text-purple-400">Bentoblocks</span> - AI-powered website builder</p>
  </footer>
</body>
</html>`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(str: string | undefined): string {
  if (!str) return '';

  const div = typeof document !== 'undefined' ? document.createElement('div') : null;

  if (div) {
    div.textContent = str;
    return div.innerHTML;
  }

  // Server-side fallback
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Check if content contains HTML tags
 */
function isHtmlContent(content: string): boolean {
  if (!content) return false;
  return /<[a-z][\s\S]*>/i.test(content);
}

/**
 * Sanitize HTML content for preview while preserving rich text formatting
 * This allows safe HTML tags (b, i, u, span with style) but strips dangerous content
 */
function sanitizeHtmlForPreview(content: string): string {
  if (!content) return '';

  // If it's not HTML content, just escape it
  if (!isHtmlContent(content)) {
    return escapeHTML(content);
  }

  // Allow safe HTML tags and attributes
  // This is a basic sanitizer - for production, consider using a library like DOMPurify
  let sanitized = content;

  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');

  // Remove event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized;
}

function normalizeBaseUrl(rawBaseUrl: string): string {
  if (!rawBaseUrl) {
    return 'http://localhost:3000';
  }

  return rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
}

function createFallbackPreview(
  html: string,
  contextPrompt: string,
  fallbackBaseUrl: string,
  reason: string
): PreviewResult {
  console.warn('⚠️ Falling back to local preview due to Daytona issue:', reason);

  const slug = storePreview(html, contextPrompt);
  const baseUrl = normalizeBaseUrl(fallbackBaseUrl);
  const fallbackUrl = `${baseUrl}/preview/${slug}`;

  console.log('✓ Fallback preview generated at', fallbackUrl);

  return {
    success: true,
    url: fallbackUrl,
    isMock: true,
    fallbackSlug: slug,
  };
}

/**
 * Deploy HTML to Daytona sandbox
 */
interface DeployOptions {
  html: string;
  contextPrompt: string;
  fallbackBaseUrl: string;
}

async function deploySandbox({
  html,
  contextPrompt,
  fallbackBaseUrl,
}: DeployOptions): Promise<PreviewResult> {
  const apiKey = process.env.DAYTONA_API_KEY;

  // Enhanced logging for environment variable debugging
  console.log('=== Daytona Preview Debug Info ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('API Key present:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('API Key prefix:', apiKey ? `${apiKey.substring(0, 8)}...` : 'N/A');
  console.log('=================================');

  if (!apiKey) {
    return createFallbackPreview(html, contextPrompt, fallbackBaseUrl, 'DAYTONA_API_KEY not found');
  }

  try {
    console.log('🚀 Initializing Daytona SDK...');

    // Initialize Daytona SDK with explicit error handling
    let daytona;
    try {
      daytona = new Daytona({ apiKey });
      console.log('✓ Daytona SDK initialized successfully');
    } catch (initError) {
      console.error('❌ Failed to initialize Daytona SDK:', initError);
      throw new Error(
        `Daytona SDK initialization failed: ${initError instanceof Error ? initError.message : 'Unknown error'}`
      );
    }

    console.log('📦 Creating Daytona sandbox for live preview...');
    console.log('Config: { language: javascript, envVars: { NODE_ENV: production } }');

    // Create a new sandbox with Node.js/web server capabilities
    let sandbox;
    try {
      sandbox = await daytona.create({
        language: 'javascript',
        envVars: {
          NODE_ENV: 'production',
        },
      });
      console.log('✓ Sandbox created successfully');
      console.log('Sandbox ID:', sandbox.id || 'N/A');
    } catch (createError) {
      console.error('❌ Failed to create sandbox:', createError);
      throw new Error(
        `Sandbox creation failed: ${createError instanceof Error ? createError.message : 'Unknown error'}`
      );
    }

    console.log('📤 Uploading HTML content...');

    // Verify Node.js is available in the sandbox
    try {
      const nodeCheck = await sandbox.process.executeCommand('node --version');
      console.log('✓ Node.js version:', nodeCheck.artifacts?.stdout?.trim() || 'Unknown');
    } catch (nodeError) {
      console.warn('⚠️ Could not verify Node.js version:', nodeError);
    }

    // Create public directory structure
    try {
      await sandbox.fs.createFolder('public', '755');
      console.log('✓ Created public directory');
    } catch (folderError) {
      console.error('❌ Failed to create public directory:', folderError);
      throw new Error(
        `Failed to create directory: ${folderError instanceof Error ? folderError.message : 'Unknown error'}`
      );
    }

    // Upload the HTML content to index.html
    try {
      await sandbox.fs.uploadFile(Buffer.from(html, 'utf-8'), 'public/index.html');
      console.log('✓ Uploaded index.html');
      console.log('HTML size:', html.length, 'bytes');
    } catch (uploadError) {
      console.error('❌ Failed to upload HTML file:', uploadError);
      throw new Error(
        `Failed to upload HTML: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`
      );
    }

    // Create a simple HTTP server script to serve the HTML
    const serverScript = `
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');

  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;

    // Upload the server script
    try {
      await sandbox.fs.uploadFile(Buffer.from(serverScript, 'utf-8'), 'server.js');
      console.log('✓ Uploaded server.js');
    } catch (uploadError) {
      console.error('❌ Failed to upload server script:', uploadError);
      throw new Error(
        `Failed to upload server: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`
      );
    }

    console.log('🚀 Starting web server in sandbox...');

    // Start the HTTP server in the background using nohup for persistence
    let startResult;
    try {
      startResult = await sandbox.process.executeCommand(
        'nohup node server.js > server.log 2>&1 & echo $!'
      );
      console.log('✓ Server started with PID:', startResult.artifacts?.stdout?.trim() || 'Unknown');
    } catch (startError) {
      console.error('❌ Failed to start server:', startError);
      throw new Error(
        `Failed to start server: ${startError instanceof Error ? startError.message : 'Unknown error'}`
      );
    }

    // Wait a moment for the server to start and listen
    console.log('⏳ Waiting for server to initialize...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get the preview URL for port 3000
    let previewLink;
    try {
      previewLink = await sandbox.getPreviewLink(3000);
      console.log('✓ Preview link generated:', previewLink.url);
    } catch (linkError) {
      console.error('❌ Failed to get preview link:', linkError);
      throw new Error(
        `Failed to get preview link: ${linkError instanceof Error ? linkError.message : 'Unknown error'}`
      );
    }

    console.log('✅ Deployment successful! Preview URL:', previewLink.url);
    console.log('Sandbox ID:', sandbox.id);
    console.log('=================================');

    return {
      success: true,
      url: previewLink.url,
      sandboxId: sandbox.id,
      isMock: false,
    };
  } catch (error) {
    console.error('=== Daytona Deployment Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));

    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }

    // Log additional error details if available
    if (typeof error === 'object' && error !== null) {
      console.error('Error details:', JSON.stringify(error, null, 2));
    }

    console.error('================================');

    return createFallbackPreview(
      html,
      contextPrompt,
      fallbackBaseUrl,
      error instanceof Error ? error.message : 'Unknown Daytona error'
    );
  }
}

/**
 * Main function to create preview
 */
export async function createPreview(
  blocks: Block[],
  contextPrompt: string,
  fallbackBaseUrl: string
): Promise<PreviewResult> {
  try {
    // Generate static HTML
    const html = generateStaticHTML(blocks, contextPrompt);

    // Deploy to Daytona sandbox
    const result = await deploySandbox({
      html,
      contextPrompt,
      fallbackBaseUrl,
    });

    return result;
  } catch (error) {
    console.error('Preview creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create preview',
    };
  }
}
