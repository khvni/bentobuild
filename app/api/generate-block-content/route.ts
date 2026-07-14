/**
 * Generate Block Content API Endpoint
 *
 * This endpoint generates AI-powered content for web page blocks using OpenAI.
 *
 * @route POST /api/generate-block-content
 *
 * @body {
 *   contextPrompt: string - Global site context describing the website/business
 *   blockType: string - Type of block (e.g., "hero", "about", "features", "testimonial")
 *   existingFields?: object - Optional current field values to refine/improve
 * }
 *
 * @returns {
 *   success: boolean,
 *   content?: {
 *     title?: string,
 *     body?: string,
 *     cta?: string,
 *     imageUrl?: string,
 *     [key: string]: any
 *   },
 *   error?: string
 * }
 *
 * @example
 * POST /api/generate-block-content
 * {
 *   "contextPrompt": "A modern fitness studio offering yoga and pilates classes",
 *   "blockType": "hero",
 *   "existingFields": {}
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "content": {
 *     "title": "Transform Your Body and Mind",
 *     "body": "Join our expert-led yoga and pilates classes...",
 *     "cta": "Start Your Journey"
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { openai, CONTENT_GENERATION_CONFIG } from '@/lib/openai';
import { getContextualImageUrl, extractImageKeywords } from '@/lib/unsplash';

// Type definitions
interface GenerateBlockContentRequest {
  contextPrompt: string;
  blockType: string;
  existingFields?: Record<string, unknown>;
}

interface BlockContent {
  title?: string;
  body?: string;
  cta?: string;
  imageUrl?: string;
  links?: unknown[];
  socialLinks?: unknown[];
  [key: string]: string | unknown[] | undefined;
}

/**
 * Builds a structured prompt for OpenAI based on block type and context
 */
function buildPrompt(
  blockType: string,
  contextPrompt: string,
  existingFields?: Record<string, unknown>
): string {
  const hasExistingContent =
    existingFields &&
    Object.keys(existingFields).length > 0 &&
    Object.values(existingFields).some((val) => val && String(val).trim().length > 0);

  // Extract existing heading/title to use as primary context
  const existingHeading = existingFields?.heading
    ? String(existingFields.heading)
        .replace(/<[^>]*>/g, '')
        .trim()
    : existingFields?.text
      ? String(existingFields.text)
          .replace(/<[^>]*>/g, '')
          .trim()
      : existingFields?.brandName
        ? String(existingFields.brandName).trim()
        : '';

  // Block-specific instructions with strict copywriting rules
  let blockSpecificInstructions = '';
  switch (blockType) {
    case 'button':
      blockSpecificInstructions = `For a button block, generate:
- text: Ultra-concise, action-oriented button text (3-4 words max, 20 characters max)
- url: Suggest a relevant URL (e.g., "#contact", "#signup", etc.)
- style: Choose from "filled", "outlined", or "text"

COPYWRITING RULES:
- Use strong action verbs (Get, Start, Discover, Join, etc.)
- Focus on immediate benefit
- Create urgency when appropriate
Examples: "Get Started", "Join Free", "See Plans"`;
      break;
    case 'link':
      blockSpecificInstructions = `For a link block, generate:
- text: Compelling link text (max 40 characters)
- url: Suggest a relevant URL
- description: ONE sentence explaining the value (max 100 characters)

COPYWRITING RULES:
- Description must be benefit-focused, not feature-focused
- Use conversational, approachable tone
- Make it scannable and clear`;
      break;
    case 'navbar':
      blockSpecificInstructions = `For a navbar block, generate:
- brandName: Short, memorable brand name (max 25 characters)
- links: Array of 3-5 navigation items with "text" and "url" fields
- logoUrl: Optional - you can omit this

Example: { "brandName": "Studio Co", "links": [{"text": "Home", "url": "#"}, {"text": "Work", "url": "#work"}, {"text": "About", "url": "#about"}] }`;
      break;
    case 'hero':
      blockSpecificInstructions = `For a hero block, generate:
- heading: Bold, benefit-focused headline (max 50 characters)
- subheading: ONE clear sentence explaining the value (1-2 sentences, max 120 characters)
- ctaText: Action-oriented button text (2-3 words, max 20 characters)
- ctaLink: URL for the CTA

COPYWRITING RULES FOR HERO:
- Heading: Lead with the #1 benefit, not a generic description
- Subheading: Explain WHO it's for and WHAT problem it solves
- CTA: Use action verbs that create urgency
- Avoid generic phrases like "Welcome to..." or "We are..."
Examples:
  Good: "Ship Faster, Debug Less" | "Tools built for modern developers"
  Bad: "Welcome to Our Platform" | "We provide software development solutions"`;
      break;
    case 'text':
      const headingContext = existingHeading
        ? `\n\nIMPORTANT: The block heading is "${existingHeading}". Your body copy MUST be specifically about "${existingHeading}" - expand on this exact topic, not generic information about the overall website.`
        : '';

      blockSpecificInstructions = `For a text block, generate:
- heading: Section heading that highlights a key benefit or feature (max 50 characters)
- body: ONE to TWO sentences maximum (max 200 characters total)${headingContext}

COPYWRITING RULES FOR TEXT BLOCKS:
- Body copy must be 1-2 sentences ONLY - no exceptions
- Focus on benefits, not features
- Use conversational, scannable language
- Each text block should focus on ONE clear idea
- If a heading already exists, write body copy SPECIFICALLY about that heading topic

Example for heading "Seasonal Drinks":
  Good: "Try our rotating selection of handcrafted seasonal beverages. Each drink celebrates fresh, local ingredients."
  Bad: "We offer a wide variety of beverages including coffee, tea, and specialty drinks made with quality ingredients from around the world..." (too long, too generic)`;
      break;
    case 'image':
      blockSpecificInstructions = `For an image block, generate:
- src: Placeholder URL like https://via.placeholder.com/800x400
- alt: Descriptive alt text for accessibility
- caption: Optional short caption (1 sentence, max 80 characters)`;
      break;
    case 'footer':
      blockSpecificInstructions = `For a footer block, generate:
- companyName: Short company/brand name (max 30 characters)
- copyright: Standard copyright text
- contactEmail: Professional email address
- socialLinks: Array of 2-4 social platforms with "platform" and "url" fields

Keep footer content minimal and professional.`;
      break;
    default:
      blockSpecificInstructions = `Generate appropriate fields for a ${blockType} block.`;
  }

  const basePrompt = `You are a professional web copywriter specializing in high-converting, concise website copy.

User's website context: "${contextPrompt}"

${hasExistingContent ? `The block currently contains:\n${JSON.stringify(existingFields, null, 2)}\n\nYour task: Generate FRESH, improved content while staying aligned with the user's context and any existing headings/titles. If there's an existing heading, your body copy should be SPECIFICALLY about that heading topic.` : 'Generate brand new, original content based on the user context above.'}

CRITICAL COPYWRITING PRINCIPLES:
1. Ultra-concise: 1-2 sentences maximum for body text
2. Benefits over features: Focus on what the user gains, not what something is
3. Conversational tone: Write like a human, not a corporate brochure
4. Specific, not generic: Avoid vague language like "quality" or "excellence"
5. Action-oriented: Use active voice and strong verbs
6. Scannable: Make every word count

IMPORTANT: Return ONLY valid JSON with no additional text, markdown, or code blocks.

${blockSpecificInstructions}

Remember: MAXIMUM 1-2 sentences for any body/description text. Be ruthlessly concise.`;

  return basePrompt;
}

/**
 * Validates and sanitizes the AI-generated response
 */
function validateAndSanitizeResponse(data: unknown): BlockContent {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid response format: expected JSON object');
  }

  // Type guard to ensure data is a record
  const record = data as Record<string, unknown>;
  const sanitized: BlockContent = {};

  // Validate and sanitize heading/title (stricter limit)
  if (record.heading && typeof record.heading === 'string') {
    sanitized.heading = record.heading.trim().slice(0, 80);
  }
  if (record.title && typeof record.title === 'string') {
    sanitized.title = record.title.trim().slice(0, 80);
  }

  // Validate and sanitize body/subheading (much stricter limit for conciseness)
  if (record.body && typeof record.body === 'string') {
    sanitized.body = record.body.trim().slice(0, 250);
  }
  if (record.subheading && typeof record.subheading === 'string') {
    sanitized.subheading = record.subheading.trim().slice(0, 150);
  }

  // Validate and sanitize CTA text (very short)
  if (record.cta && typeof record.cta === 'string') {
    sanitized.cta = record.cta.trim().slice(0, 30);
  }
  if (record.ctaText && typeof record.ctaText === 'string') {
    sanitized.ctaText = record.ctaText.trim().slice(0, 30);
  }
  if (record.ctaLink && typeof record.ctaLink === 'string') {
    sanitized.ctaLink = record.ctaLink.trim();
  }

  // Validate and sanitize button/link text
  if (record.text && typeof record.text === 'string') {
    sanitized.text = record.text.trim().slice(0, 50);
  }

  // Validate and sanitize description
  if (record.description && typeof record.description === 'string') {
    sanitized.description = record.description.trim().slice(0, 120);
  }

  // Validate and sanitize URLs
  if (record.url && typeof record.url === 'string') {
    sanitized.url = record.url.trim();
  }
  if (record.imageUrl && typeof record.imageUrl === 'string') {
    const urlPattern = /^https?:\/\/.+/;
    if (urlPattern.test(record.imageUrl)) {
      sanitized.imageUrl = record.imageUrl.trim();
    }
  }

  // Validate brand/company names
  if (record.brandName && typeof record.brandName === 'string') {
    sanitized.brandName = record.brandName.trim().slice(0, 40);
  }
  if (record.companyName && typeof record.companyName === 'string') {
    sanitized.companyName = record.companyName.trim().slice(0, 40);
  }

  // Validate image fields
  if (record.src && typeof record.src === 'string') {
    sanitized.src = record.src.trim();
  }
  if (record.alt && typeof record.alt === 'string') {
    sanitized.alt = record.alt.trim().slice(0, 120);
  }
  if (record.caption && typeof record.caption === 'string') {
    sanitized.caption = record.caption.trim().slice(0, 100);
  }

  // Validate footer fields
  if (record.copyright && typeof record.copyright === 'string') {
    sanitized.copyright = record.copyright.trim().slice(0, 100);
  }
  if (record.contactEmail && typeof record.contactEmail === 'string') {
    sanitized.contactEmail = record.contactEmail.trim().slice(0, 100);
  }

  // Validate array fields (links, socialLinks)
  if (record.links && Array.isArray(record.links)) {
    sanitized.links = record.links;
  }
  if (record.socialLinks && Array.isArray(record.socialLinks)) {
    sanitized.socialLinks = record.socialLinks;
  }

  // Validate style field for buttons
  if (record.style && typeof record.style === 'string') {
    sanitized.style = record.style.trim();
  }

  // Include any other string fields that might be present (with conservative limit)
  for (const [key, value] of Object.entries(record)) {
    if (
      ![
        'heading',
        'title',
        'body',
        'subheading',
        'cta',
        'ctaText',
        'ctaLink',
        'text',
        'description',
        'url',
        'imageUrl',
        'brandName',
        'companyName',
        'src',
        'alt',
        'caption',
        'copyright',
        'contactEmail',
        'links',
        'socialLinks',
        'style',
      ].includes(key) &&
      typeof value === 'string'
    ) {
      sanitized[key] = value.trim().slice(0, 200);
    }
  }

  return sanitized;
}

/**
 * POST handler for generating block content
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'AI service is not configured. Please set OPENAI_API_KEY environment variable.',
        },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { contextPrompt, blockType, existingFields } = body as GenerateBlockContentRequest;

    if (!contextPrompt || typeof contextPrompt !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: "contextPrompt" is required and must be a string',
        },
        { status: 400 }
      );
    }

    if (!blockType || typeof blockType !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: "blockType" is required and must be a string',
        },
        { status: 400 }
      );
    }

    // Build the prompt
    const prompt = buildPrompt(blockType, contextPrompt, existingFields);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: CONTENT_GENERATION_CONFIG.model,
      temperature: CONTENT_GENERATION_CONFIG.temperature,
      max_tokens: CONTENT_GENERATION_CONFIG.max_tokens,
      messages: [
        {
          role: 'system',
          content:
            'You are a professional web copywriter specializing in high-converting, ultra-concise website copy. Your writing is benefit-focused (not feature-focused), conversational, scannable, and ruthlessly concise. Body text is ALWAYS 1-2 sentences maximum. You avoid generic corporate language and focus on clear value propositions. Generate content in JSON format only - never include markdown code blocks or additional text, return only raw JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' }, // Ensure JSON response
    });

    // Extract the generated content
    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error('No content generated from OpenAI');
    }

    // Parse and validate JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(rawContent);
    } catch {
      console.error('Failed to parse OpenAI response:', rawContent);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate and sanitize the response
    const sanitizedContent = validateAndSanitizeResponse(parsedContent);

    // If this is an image block and no image URL was provided, fetch from Unsplash
    if (blockType === 'image' && !sanitizedContent.src) {
      try {
        const keywords = extractImageKeywords(contextPrompt, 'image');
        const imageUrl = await getContextualImageUrl(keywords);
        sanitizedContent.src = imageUrl;
      } catch (error) {
        console.error('Failed to fetch image from Unsplash:', error);
        // Use placeholder as fallback
        sanitizedContent.src =
          'https://picsum.photos/seed/' + encodeURIComponent(contextPrompt) + '/1200/800';
      }
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      content: sanitizedContent,
    });
  } catch (error) {
    console.error('Error generating block content:', error);

    // Handle different types of errors
    if (error instanceof Error) {
      // OpenAI API errors
      if (error.message.includes('API key')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid API key configuration',
          },
          { status: 500 }
        );
      }

      // Rate limiting or quota errors
      if (error.message.includes('rate') || error.message.includes('quota')) {
        return NextResponse.json(
          {
            success: false,
            error: 'AI service temporarily unavailable. Please try again later.',
          },
          { status: 429 }
        );
      }

      // Generic error response
      return NextResponse.json(
        {
          success: false,
          error: `Failed to generate content: ${error.message}`,
        },
        { status: 500 }
      );
    }

    // Unknown error
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
