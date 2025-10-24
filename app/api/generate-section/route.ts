/**
 * Generate Section API Endpoint
 *
 * This endpoint generates AI-powered content for entire sections with multiple components.
 *
 * @route POST /api/generate-section
 *
 * @body {
 *   variant: SectionVariant - Type of section (navbar, hero, content, etc.)
 *   contextPrompt: string - Global site context describing the website/business
 *   specificRequest?: string - Optional specific instructions for this section
 * }
 *
 * @returns {
 *   success: boolean,
 *   section?: Section - Complete section with populated components
 *   error?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { secureApi } from '@/lib/middleware/apiWrapper';
import { validateInput, sanitizeAIPrompt } from '@/lib/security/sanitize';
import { Section, SectionVariant, Component } from '@/types/canvas.types';
import { createSection } from '@/lib/factories/sectionFactory';
import {
  createHeading,
  createText,
  createButton,
  createImage,
  createLink,
} from '@/lib/factories/componentFactory';
import { getDefaultTemplate } from '@/lib/ai/sectionTemplates';
import { z } from 'zod';

/**
 * Validation schema for section generation requests
 */
const sectionGenerateSchema = z.object({
  variant: z.enum([
    'navbar',
    'hero',
    'content',
    'features',
    'gallery',
    'testimonials',
    'cta',
    'footer',
  ]),
  contextPrompt: z.string().min(1).max(2000),
  specificRequest: z.string().max(500).optional(),
});

/**
 * AI Response Types - Define expected structure from OpenAI for each section variant
 */
interface NavbarAIData {
  brandName?: string;
  links?: Array<{ text: string; url: string }>;
  ctaText?: string;
  ctaUrl?: string;
}

interface HeroAIData {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaUrl?: string;
}

interface ContentAIData {
  heading?: string;
  paragraphs?: string[];
}

interface FeaturesAIData {
  sectionHeading?: string;
  features?: Array<{ title: string; description: string }>;
}

interface GalleryAIData {
  sectionHeading?: string;
  images?: Array<{ alt: string; caption?: string }>;
}

interface TestimonialsAIData {
  sectionHeading?: string;
  testimonials?: Array<{ quote: string; author: string; role?: string }>;
}

interface CtaAIData {
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface FooterAIData {
  companyName?: string;
  links?: Array<{ text: string; url: string }>;
  copyright?: string;
}

type SectionAIData =
  | NavbarAIData
  | HeroAIData
  | ContentAIData
  | FeaturesAIData
  | GalleryAIData
  | TestimonialsAIData
  | CtaAIData
  | FooterAIData;

/**
 * Builds a structured prompt for OpenAI based on section variant and context
 */
function buildSectionPrompt(variant: SectionVariant, context: string, request: string): string {
  const variantPrompts: Record<SectionVariant, string> = {
    navbar: `Generate a navbar section with brand name and 3-5 navigation links.
Return JSON with this exact structure:
{
  "brandName": "short brand name (max 25 chars)",
  "links": [
    {"text": "link text", "url": "#anchor"},
    {"text": "link text", "url": "#anchor"}
  ],
  "ctaText": "optional CTA button text",
  "ctaUrl": "optional CTA URL"
}`,

    hero: `Generate a hero section with compelling heading, subheading, and call-to-action.
Return JSON with this exact structure:
{
  "heading": "bold, benefit-focused headline (max 60 chars)",
  "subheading": "1-2 sentences explaining value (max 150 chars)",
  "ctaText": "action-oriented button text (2-3 words)",
  "ctaUrl": "#signup or similar"
}`,

    content: `Generate a content section with heading and 2-3 concise paragraphs.
Return JSON with this exact structure:
{
  "heading": "section heading (max 60 chars)",
  "paragraphs": [
    "first paragraph (1-2 sentences, max 200 chars)",
    "second paragraph (1-2 sentences, max 200 chars)"
  ]
}`,

    features: `Generate a features section with 3 feature items (each with heading and description).
Return JSON with this exact structure:
{
  "sectionHeading": "main section heading (max 60 chars)",
  "features": [
    {"title": "feature name (max 30 chars)", "description": "benefit-focused (1 sentence, max 120 chars)"},
    {"title": "feature name", "description": "benefit-focused description"},
    {"title": "feature name", "description": "benefit-focused description"}
  ]
}`,

    gallery: `Generate a gallery section with 4-6 images (alt text and captions).
Return JSON with this exact structure:
{
  "sectionHeading": "optional gallery heading",
  "images": [
    {"alt": "descriptive alt text", "caption": "optional short caption"},
    {"alt": "descriptive alt text", "caption": "optional short caption"}
  ]
}`,

    testimonials: `Generate 2-3 testimonial items with realistic quotes and author information.
Return JSON with this exact structure:
{
  "sectionHeading": "section heading like 'What Our Clients Say'",
  "testimonials": [
    {"quote": "realistic testimonial (2-3 sentences)", "author": "Full Name", "role": "Job Title, Company"},
    {"quote": "realistic testimonial", "author": "Full Name", "role": "Job Title"}
  ]
}`,

    cta: `Generate a call-to-action section with compelling heading, description, and button.
Return JSON with this exact structure:
{
  "heading": "action-oriented heading (max 60 chars)",
  "description": "compelling reason to act (1-2 sentences, max 150 chars)",
  "buttonText": "clear action verb (2-3 words)",
  "buttonUrl": "#signup or similar"
}`,

    footer: `Generate a footer with company name, copyright, and 3-4 useful links.
Return JSON with this exact structure:
{
  "companyName": "brand or company name",
  "copyright": "© 2024 Company Name. All rights reserved.",
  "links": [
    {"text": "Privacy", "url": "#privacy"},
    {"text": "Terms", "url": "#terms"}
  ],
  "contactEmail": "contact@example.com"
}`,
  };

  return `Website context: "${context}"
${request ? `Specific request: "${request}"\n` : ''}
CRITICAL INSTRUCTIONS:
- Generate concise, benefit-focused copy (not feature-focused)
- Keep all text scannable and conversational
- Headings should highlight clear value
- Body text must be 1-2 sentences maximum
- CTAs should use strong action verbs
- Return ONLY valid JSON with no markdown formatting

${variantPrompts[variant]}`;
}

/**
 * Builds a complete Section with Components from AI-generated data
 */
function buildSectionFromAI(
  variant: SectionVariant,
  aiData: SectionAIData,
  order: number
): Section {
  const section = createSection(variant, order);
  const template = getDefaultTemplate(variant);

  // Apply template layout settings
  section.layout.type = template.layout;
  if (template.layout === 'grid' && template.columns) {
    section.layout.columns = template.columns;
  }
  if (template.layout === 'stack' && template.direction) {
    section.layout.direction = template.direction;
  }

  // Build components based on variant and AI data
  switch (variant) {
    case 'navbar':
      section.children = buildNavbarComponents(aiData as NavbarAIData);
      break;

    case 'hero':
      section.children = buildHeroComponents(aiData as HeroAIData);
      break;

    case 'content':
      section.children = buildContentComponents(aiData as ContentAIData);
      break;

    case 'features':
      section.children = buildFeaturesComponents(aiData as FeaturesAIData);
      section.layout.type = 'grid';
      section.layout.columns = 3;
      break;

    case 'gallery':
      section.children = buildGalleryComponents(aiData as GalleryAIData);
      section.layout.type = 'grid';
      section.layout.columns = 3;
      break;

    case 'testimonials':
      section.children = buildTestimonialsComponents(aiData as TestimonialsAIData);
      break;

    case 'cta':
      section.children = buildCtaComponents(aiData as CtaAIData);
      break;

    case 'footer':
      section.children = buildFooterComponents(aiData as FooterAIData);
      break;
  }

  return section;
}

// Component builders for each section variant

function buildNavbarComponents(data: NavbarAIData): Component[] {
  const components: Component[] = [];

  // Brand name
  if (data.brandName) {
    components.push(createHeading(data.brandName, 3));
  }

  // Navigation links
  if (data.links && Array.isArray(data.links)) {
    data.links.forEach((link) => {
      components.push(createLink(link.text || 'Link', link.url || '#'));
    });
  }

  // Optional CTA button
  if (data.ctaText) {
    components.push(createButton(data.ctaText, data.ctaUrl || '#', 'filled'));
  }

  return components;
}

function buildHeroComponents(data: HeroAIData): Component[] {
  const components: Component[] = [];

  if (data.heading) {
    components.push(createHeading(data.heading, 1));
  }

  if (data.subheading) {
    components.push(createText(data.subheading));
  }

  if (data.ctaText) {
    components.push(createButton(data.ctaText, data.ctaUrl || '#', 'filled'));
  }

  return components;
}

function buildContentComponents(data: ContentAIData): Component[] {
  const components: Component[] = [];

  if (data.heading) {
    components.push(createHeading(data.heading, 2));
  }

  if (data.paragraphs && Array.isArray(data.paragraphs)) {
    data.paragraphs.forEach((paragraph: string) => {
      components.push(createText(paragraph));
    });
  }

  return components;
}

function buildFeaturesComponents(data: FeaturesAIData): Component[] {
  const components: Component[] = [];

  // Main section heading
  if (data.sectionHeading) {
    components.push(
      createHeading(data.sectionHeading, 2, 'relative', {
        grid: { column: '1 / -1', row: 'auto' }, // Span full width
      })
    );
  }

  // Feature items
  if (data.features && Array.isArray(data.features)) {
    data.features.forEach((feature) => {
      components.push(createHeading(feature.title || 'Feature', 3));
      components.push(createText(feature.description || ''));
    });
  }

  return components;
}

function buildGalleryComponents(data: GalleryAIData): Component[] {
  const components: Component[] = [];

  // Optional section heading
  if (data.sectionHeading) {
    components.push(
      createHeading(data.sectionHeading, 2, 'relative', {
        grid: { column: '1 / -1', row: 'auto' },
      })
    );
  }

  // Gallery images
  if (data.images && Array.isArray(data.images)) {
    data.images.forEach((img, index: number) => {
      components.push(
        createImage(
          `https://picsum.photos/seed/${index}/600/400`,
          img.alt || 'Gallery image',
          'relative',
          { caption: img.caption }
        )
      );
    });
  }

  return components;
}

function buildTestimonialsComponents(data: TestimonialsAIData): Component[] {
  const components: Component[] = [];

  if (data.sectionHeading) {
    components.push(createHeading(data.sectionHeading, 2));
  }

  if (data.testimonials && Array.isArray(data.testimonials)) {
    data.testimonials.forEach((testimonial) => {
      const testimonialText = `"${testimonial.quote}" - ${testimonial.author}${testimonial.role ? `, ${testimonial.role}` : ''}`;
      components.push(createText(testimonialText));
    });
  }

  return components;
}

function buildCtaComponents(data: CtaAIData): Component[] {
  const components: Component[] = [];

  if (data.heading) {
    components.push(createHeading(data.heading, 2));
  }

  if (data.description) {
    components.push(createText(data.description));
  }

  if (data.buttonText) {
    components.push(createButton(data.buttonText, data.buttonUrl || '#', 'filled'));
  }

  return components;
}

function buildFooterComponents(data: FooterAIData): Component[] {
  const components: Component[] = [];

  // Company name
  if (data.companyName) {
    components.push(createHeading(data.companyName, 4));
  }

  // Footer links
  if (data.links && Array.isArray(data.links)) {
    data.links.forEach((link) => {
      components.push(createLink(link.text || 'Link', link.url || '#'));
    });
  }

  // Copyright text
  if (data.copyright) {
    components.push(createText(data.copyright));
  }

  return components;
}

/**
 * POST handler for generating section content
 */
async function handlePOST(request: NextRequest) {
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

    const validation = validateInput(sectionGenerateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const { variant, contextPrompt, specificRequest } = validation.data;

    // Sanitize inputs to prevent prompt injection
    const sanitizedContext = sanitizeAIPrompt(contextPrompt);
    const sanitizedRequest = specificRequest ? sanitizeAIPrompt(specificRequest) : '';

    if (sanitizedContext.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid context prompt' },
        { status: 400 }
      );
    }

    // Build the prompt
    const prompt = buildSectionPrompt(variant, sanitizedContext, sanitizedRequest);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content:
            'You are a web design expert generating complete section structures with components. Generate concise, benefit-focused copy. Return only valid JSON with no markdown formatting or code blocks.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    // Extract and parse the generated content
    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error('No content generated from OpenAI');
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      console.error('Failed to parse OpenAI response:', rawContent);
      throw new Error('Invalid JSON response from AI');
    }

    // Build the section with components
    const section = buildSectionFromAI(variant, parsed, 0);

    return NextResponse.json({
      success: true,
      section,
    });
  } catch (error) {
    console.error('Section generation error:', error);

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { success: false, error: 'Invalid API key configuration' },
          { status: 500 }
        );
      }

      if (error.message.includes('rate') || error.message.includes('quota')) {
        return NextResponse.json(
          { success: false, error: 'AI service temporarily unavailable. Please try again later.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { success: false, error: `Failed to generate section: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Export secured API handler with rate limiting
export const POST = secureApi(handlePOST, {
  rateLimit: 'ai', // 10 requests per minute for AI endpoints
  requireAuth: false, // Allow unauthenticated access for now
  logRequests: true,
});
