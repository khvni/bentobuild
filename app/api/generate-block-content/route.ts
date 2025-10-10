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
  [key: string]: string | undefined;
}

/**
 * Builds a structured prompt for OpenAI based on block type and context
 */
function buildPrompt(
  blockType: string,
  contextPrompt: string,
  existingFields?: Record<string, unknown>
): string {
  const hasExistingContent = existingFields && Object.keys(existingFields).length > 0
    && Object.values(existingFields).some(val => val && String(val).trim().length > 0);

  // Block-specific instructions
  let blockSpecificInstructions = '';
  switch (blockType) {
    case 'button':
      blockSpecificInstructions = `For a button block, generate:
- text: Clear, action-oriented button text (max 25 characters)
- url: Suggest a relevant URL (e.g., "#contact", "#signup", etc.)
- style: Choose from "filled", "outlined", or "text"
- color: Suggest a Tailwind color (e.g., "blue", "purple", "green")`;
      break;
    case 'link':
      blockSpecificInstructions = `For a link block, generate:
- text: Compelling link text that describes the destination (max 50 characters)
- url: Suggest a relevant URL
- description: Brief explanation of where the link leads or why it's useful (max 150 characters)`;
      break;
    case 'navbar':
      blockSpecificInstructions = `For a navbar block, generate:
- brandName: A short, memorable brand name (max 30 characters)
- links: Array of 3-5 navigation items with "text" and "url" fields
- logoUrl: Optional - you can omit this or suggest a placeholder
Example: { "brandName": "My Brand", "links": [{"text": "Home", "url": "#"}, {"text": "About", "url": "#about"}] }`;
      break;
    case 'hero':
      blockSpecificInstructions = `For a hero block, generate:
- heading: Bold, attention-grabbing headline (max 60 characters)
- subheading: Supporting text (max 120 characters)
- ctaText: Call-to-action button text (max 25 characters)
- ctaLink: URL for the CTA`;
      break;
    case 'text':
      blockSpecificInstructions = `For a text block, generate:
- heading: Section heading (max 60 characters)
- body: Descriptive content (max 500 characters)`;
      break;
    case 'image':
      blockSpecificInstructions = `For an image block, generate:
- src: Placeholder URL like https://via.placeholder.com/800x400
- alt: Descriptive alt text
- caption: Optional caption`;
      break;
    default:
      blockSpecificInstructions = `Generate appropriate fields for a ${blockType} block.`;
  }

  const basePrompt = `You are generating web copy for a ${blockType} section.

User's website context: ${contextPrompt}

${hasExistingContent ? `The block currently contains the following content:\n${JSON.stringify(existingFields, null, 2)}\n\nYour task: Generate FRESH content that builds upon or improves this existing content while staying aligned with the user's context. Use the existing content as inspiration but create new variations. Do not simply repeat the existing text.` : 'Generate brand new, original content based on the user context above.'}

IMPORTANT: Return ONLY valid JSON with no additional text, markdown, or code blocks.

${blockSpecificInstructions}

Generate concise, natural, and engaging content appropriate for a ${blockType} section.
Ensure all text is professional, engaging, and tailored to both the user's context and the existing content.`;

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

  // Validate and sanitize title
  if (record.title && typeof record.title === 'string') {
    sanitized.title = record.title.trim().slice(0, 200);
  }

  // Validate and sanitize body
  if (record.body && typeof record.body === 'string') {
    sanitized.body = record.body.trim().slice(0, 1000);
  }

  // Validate and sanitize CTA
  if (record.cta && typeof record.cta === 'string') {
    sanitized.cta = record.cta.trim().slice(0, 50);
  }

  // Validate and sanitize image URL
  if (record.imageUrl && typeof record.imageUrl === 'string') {
    const urlPattern = /^https?:\/\/.+/;
    if (urlPattern.test(record.imageUrl)) {
      sanitized.imageUrl = record.imageUrl.trim();
    }
  }

  // Include any other string fields that might be present
  for (const [key, value] of Object.entries(record)) {
    if (
      !['title', 'body', 'cta', 'imageUrl'].includes(key) &&
      typeof value === 'string'
    ) {
      sanitized[key] = value.trim().slice(0, 500);
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
            'You are a professional web copywriter. Generate concise, engaging content in JSON format only. Never include markdown code blocks or additional text - return only raw JSON.',
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
        sanitizedContent.src = 'https://picsum.photos/seed/' + encodeURIComponent(contextPrompt) + '/1200/800';
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
