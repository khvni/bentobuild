import { NextRequest, NextResponse } from 'next/server';
import { openai, CONTENT_GENERATION_CONFIG } from '@/lib/openai';
import { secureApi } from '@/lib/middleware/apiWrapper';
import {
  validateInput,
  schemas,
  sanitizeAIPrompt,
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
} from '@/lib/security/sanitize';
import { ComponentType } from '@/types/canvas.types';

/**
 * Component Generation API Handler
 *
 * Generates AI content for specific component types based on:
 * - Component type (heading, text, button, etc.)
 * - Global context prompt (website description)
 * - Component-specific prompt (what this specific component should contain)
 * - Existing content (optional, for refinement)
 */
async function handlePOST(request: NextRequest) {
  const body = await request.json();

  // Validate input
  const validation = validateInput(schemas.componentGenerate, body);
  if (!validation.success) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
  }

  const { componentType, contextPrompt, blockPrompt } = validation.data;

  // Sanitize prompts to prevent injection attacks
  const sanitizedContext = sanitizeAIPrompt(contextPrompt || '');
  const sanitizedBlock = sanitizeAIPrompt(blockPrompt);

  // Build component-specific prompt
  const prompt = buildComponentPrompt(
    componentType as ComponentType,
    sanitizedContext,
    sanitizedBlock
  );

  try {
    const completion = await openai.chat.completions.create({
      model: CONTENT_GENERATION_CONFIG.model,
      temperature: CONTENT_GENERATION_CONFIG.temperature,
      max_tokens: CONTENT_GENERATION_CONFIG.max_tokens,
      messages: [
        {
          role: 'system',
          content:
            'You are a professional web copywriter. Generate concise, benefit-focused content as JSON. Always return valid JSON matching the requested schema exactly.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      throw new Error('No content generated');
    }

    const parsedContent = JSON.parse(rawContent);
    const validatedContent = validateComponentContent(
      componentType as ComponentType,
      parsedContent
    );

    return NextResponse.json({
      success: true,
      content: validatedContent,
    });
  } catch (error) {
    console.error('Component generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Build component-specific prompt
 *
 * Creates a tailored prompt for each component type that includes:
 * - Global website context
 * - Specific component requirements
 * - Expected JSON structure
 * - Content constraints (length, format, etc.)
 */
function buildComponentPrompt(type: ComponentType, context: string, blockPrompt: string): string {
  const contextSection = context ? `Website context: "${context}"\n` : '';

  const basePrompt = `${contextSection}Specific request: "${blockPrompt}"\n\n`;

  const typeInstructions: Record<ComponentType, string> = {
    heading: `Generate a heading component.

Requirements:
- Heading text should be compelling and clear (max 60 characters)
- Choose appropriate heading level (1-6) based on importance
- Level 1 = main page title, Level 2 = section headers, Level 3+ = subsections

Return JSON with this exact structure:
{
  "text": "Your heading text here",
  "level": 2
}`,

    text: `Generate a text paragraph component.

Requirements:
- Write 1-3 sentences of engaging body text (max 300 characters)
- Focus on benefits and value to the reader
- Use natural, conversational tone
- Keep it concise and scannable

Return JSON with this exact structure:
{
  "body": "Your paragraph text here."
}`,

    button: `Generate a button component.

Requirements:
- Button text should be action-oriented and concise (max 20 characters)
- Use strong action verbs (Get, Start, Learn, Try, etc.)
- URL should be relevant to the action (use placeholder like /signup if needed)
- Choose appropriate variant:
  - "filled" for primary CTAs
  - "outlined" for secondary actions
  - "text" for tertiary/subtle actions

Return JSON with this exact structure:
{
  "text": "Get Started",
  "url": "/signup",
  "variant": "filled"
}`,

    image: `Generate image metadata for a component.

Requirements:
- Alt text must be descriptive for accessibility (max 100 characters)
- Caption is optional but should add context if used (max 150 characters)
- Focus on what the image should convey

Return JSON with this exact structure:
{
  "alt": "Descriptive alt text for accessibility",
  "caption": "Optional caption providing additional context"
}`,

    link: `Generate a hyperlink component.

Requirements:
- Link text should be descriptive and indicate destination (max 50 characters)
- URL should be relevant (use placeholder if needed)
- Description provides additional context on hover/for accessibility (max 100 characters)

Return JSON with this exact structure:
{
  "text": "Link text here",
  "url": "/destination",
  "description": "Additional context about this link"
}`,

    spacer: `Generate vertical spacing configuration.

Requirements:
- Height should be between 20-200 pixels
- Common values: 20, 40, 60, 80, 120 for different spacing needs
- Consider the context and typical spacing conventions

Return JSON with this exact structure:
{
  "height": 40
}`,

    divider: `Generate a horizontal divider configuration.

Requirements:
- Color should be a valid CSS color (hex code preferred)
- Thickness should be 1-5 pixels
- Consider the design context (subtle vs prominent)

Return JSON with this exact structure:
{
  "color": "#e5e7eb",
  "thickness": 2
}`,
  };

  return basePrompt + typeInstructions[type];
}

/**
 * Validate and sanitize component content
 *
 * Ensures generated content:
 * - Matches expected schema for component type
 * - Contains no malicious code (XSS prevention)
 * - Meets length and format requirements
 * - Uses safe URLs
 */
function validateComponentContent(
  type: ComponentType,
  content: Record<string, unknown>
): Record<string, string | number | undefined> {
  switch (type) {
    case 'heading': {
      const text = sanitizeText(String(content.text || '').slice(0, 60));
      const level = Math.min(6, Math.max(1, parseInt(String(content.level || 2), 10))) as
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6;

      if (!text) {
        throw new Error('Heading text is required');
      }

      return {
        text,
        level,
      };
    }

    case 'text': {
      const body = sanitizeHtml(String(content.body || '').slice(0, 300));

      if (!body) {
        throw new Error('Text body is required');
      }

      return {
        body,
      };
    }

    case 'button': {
      const text = sanitizeText(String(content.text || '').slice(0, 20));
      const url = sanitizeUrl(String(content.url || '#'));
      const variantValue = String(content.variant || 'filled');
      const variant = ['filled', 'outlined', 'text'].includes(variantValue)
        ? variantValue
        : 'filled';

      if (!text) {
        throw new Error('Button text is required');
      }

      return {
        text,
        url,
        variant,
      };
    }

    case 'image': {
      const alt = sanitizeText(String(content.alt || '').slice(0, 100));
      const caption = content.caption
        ? sanitizeText(String(content.caption).slice(0, 150))
        : undefined;

      if (!alt) {
        throw new Error('Image alt text is required');
      }

      return {
        alt,
        ...(caption && { caption }),
      };
    }

    case 'link': {
      const text = sanitizeText(String(content.text || '').slice(0, 50));
      const url = sanitizeUrl(String(content.url || '#'));
      const description = content.description
        ? sanitizeText(String(content.description).slice(0, 100))
        : undefined;

      if (!text) {
        throw new Error('Link text is required');
      }

      return {
        text,
        url,
        ...(description && { description }),
      };
    }

    case 'spacer': {
      const height = Math.min(200, Math.max(20, parseInt(String(content.height || 40), 10)));

      return {
        height,
      };
    }

    case 'divider': {
      const color = String(content.color || '#e5e7eb');
      const thickness = Math.min(5, Math.max(1, parseInt(String(content.thickness || 2), 10)));

      // Basic hex color validation
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      const validColor = hexColorRegex.test(color) ? color : '#e5e7eb';

      return {
        color: validColor,
        thickness,
      };
    }

    default:
      throw new Error(`Unknown component type: ${type}`);
  }
}

/**
 * Export secured POST handler with rate limiting
 *
 * Security features:
 * - Rate limiting: 10 requests per minute (AI tier)
 * - Input validation and sanitization
 * - No authentication required (open for demo purposes)
 * - Request logging enabled
 */
export const POST = secureApi(handlePOST, {
  rateLimit: 'ai',
  requireAuth: false,
});
