# Section-Level AI Generation

This document describes the section-level AI generation system in Bentoblocks, which allows users to generate complete sections with multiple components in one shot.

## Overview

The section-level AI generation system provides a streamlined way to populate entire sections with cohesive, contextually-aware content. Instead of generating components one by one, users can generate an entire section structure (navbar, hero, features, etc.) complete with all necessary components.

## Architecture

### Components

1. **API Endpoint**: `/app/api/generate-section/route.ts`
   - Handles POST requests to generate section content
   - Uses OpenAI GPT-4o-mini model
   - Returns a complete Section object with populated components

2. **Section Templates Library**: `/lib/ai/sectionTemplates.ts`
   - Pre-defined section structures for common patterns
   - Defines component types and layouts for each variant
   - Provides helper functions to retrieve templates

3. **Generate Section Modal**: `/components/ai/GenerateSectionModal.tsx`
   - User interface for triggering section generation
   - Shows section description and context
   - Allows optional specific instructions

4. **Section Node Integration**: `/components/canvas/nodes/SectionNode.tsx`
   - Adds "Generate with AI" button to section controls
   - Integrates the GenerateSectionModal
   - Provides visual feedback during generation

5. **Zustand Store Action**: `addSectionWithComponents`
   - Adds a complete section with all components to the page
   - Calculates appropriate positioning
   - Updates section order

## Supported Section Variants

### 1. Navbar

**Structure**: Brand name + navigation links + optional CTA button

**Generated Components**:

- Heading (brand name)
- Multiple Link components (navigation)
- Button (optional CTA)

**Layout**: Horizontal stack with space-between alignment

**Example Use Case**: "Include links to Home, About, Services, and Contact with a Get Started button"

### 2. Hero

**Structure**: Headline + subheading + call-to-action

**Generated Components**:

- Heading (H1 - main headline)
- Text (subheading/value proposition)
- Button (primary CTA)

**Layout**: Vertical stack, centered alignment

**Example Use Case**: "Emphasize fast delivery and premium quality for our design agency"

### 3. Content

**Structure**: Section heading + 2-3 paragraphs

**Generated Components**:

- Heading (H2 - section heading)
- Multiple Text components (paragraphs)

**Layout**: Vertical stack

**Example Use Case**: "Explain our company history and mission in 2-3 paragraphs"

### 4. Features

**Structure**: Main heading + 3 feature items (each with heading + description)

**Generated Components**:

- Heading (H2 - section heading, spans full width)
- 3x Heading (H3 - feature titles)
- 3x Text (feature descriptions)

**Layout**: 3-column grid

**Example Use Case**: "Highlight 3 key benefits: speed, reliability, and support"

### 5. Gallery

**Structure**: Optional heading + 4-6 images with captions

**Generated Components**:

- Heading (H2 - optional section heading)
- Multiple Image components with captions

**Layout**: 3-column grid

**Example Use Case**: "Showcase 6 recent project images from our portfolio"

### 6. Testimonials

**Structure**: Section heading + 2-3 testimonials

**Generated Components**:

- Heading (H2 - section heading)
- Multiple Text components (formatted testimonials with attribution)

**Layout**: Vertical stack, centered

**Example Use Case**: "Include 3 customer testimonials about our excellent service"

### 7. CTA (Call-to-Action)

**Structure**: Compelling heading + description + action button

**Generated Components**:

- Heading (H2 - action-oriented)
- Text (reason to act)
- Button (primary action)

**Layout**: Vertical stack, centered

**Example Use Case**: "Encourage visitors to sign up for our free trial"

### 8. Footer

**Structure**: Company name + links + copyright

**Generated Components**:

- Heading (H4 - company/brand name)
- Multiple Link components (footer navigation)
- Text (copyright notice)

**Layout**: Horizontal stack with space-between alignment

**Example Use Case**: "Include Privacy, Terms, and Contact links with social media icons"

## API Reference

### POST /api/generate-section

Generates a complete section with AI-populated components.

#### Request Body

```typescript
{
  variant: SectionVariant;        // Required: navbar, hero, content, features, etc.
  contextPrompt: string;          // Required: Global website context (max 2000 chars)
  specificRequest?: string;       // Optional: Specific instructions (max 500 chars)
}
```

#### Response

```typescript
{
  success: boolean;
  section?: Section;              // Complete section with populated components
  error?: string;
}
```

#### Example Request

```json
{
  "variant": "hero",
  "contextPrompt": "A modern fitness studio offering yoga and pilates classes",
  "specificRequest": "Emphasize our expert instructors and welcoming atmosphere"
}
```

#### Example Response

```json
{
  "success": true,
  "section": {
    "id": "section-abc123",
    "type": "section",
    "variant": "hero",
    "order": 0,
    "position": { "x": 100, "y": 100 },
    "layout": {
      "type": "stack",
      "direction": "vertical",
      "align": "center",
      "gap": 24,
      "padding": "4rem 2rem"
    },
    "style": {
      "backgroundColor": "#F9FAFB",
      "textColor": "#111827"
    },
    "children": [
      {
        "id": "comp-1",
        "type": "heading",
        "content": {
          "text": "Transform Your Body and Mind",
          "level": 1
        }
        // ... component details
      },
      {
        "id": "comp-2",
        "type": "text",
        "content": {
          "body": "Join expert-led yoga and pilates classes in our welcoming studio."
        }
        // ... component details
      },
      {
        "id": "comp-3",
        "type": "button",
        "content": {
          "text": "Start Your Journey",
          "url": "#signup",
          "variant": "filled"
        }
        // ... component details
      }
    ]
  }
}
```

## Section Templates

The system uses pre-defined templates to ensure consistent layouts for each section variant.

### Template Structure

```typescript
interface SectionTemplate {
  variant: SectionVariant;
  layout: 'stack' | 'grid';
  columns?: number; // For grid layouts
  direction?: 'vertical' | 'horizontal'; // For stack layouts
  components: ComponentType[]; // Ordered list of component types
  description: string;
}
```

### Available Templates

- `hero-basic`: Simple hero with heading, text, button
- `hero-with-image`: Hero with 2-column grid (text + image)
- `content-basic`: Content section with heading and paragraphs
- `content-with-image`: Content with 2-column grid (text + image)
- `features-3-col`: Features in 3-column grid
- `features-2-col`: Features in 2-column grid
- `gallery-grid`: Image gallery in 3-column grid
- `gallery-masonry`: Image gallery in 2-column layout
- `cta-centered`: Centered CTA with single button
- `cta-with-buttons`: CTA with primary and secondary buttons
- `testimonials-stack`: Testimonials stacked vertically
- `testimonials-grid`: Testimonials in 2-column grid
- `navbar-standard`: Standard navbar with brand, links, and CTA
- `footer-standard`: Standard footer with brand, links, and copyright

### Helper Functions

```typescript
// Get default template for a variant
const template = getDefaultTemplate('hero');

// Get all templates for a variant
const heroTemplates = getTemplatesForVariant('hero');

// Get specific template by name
const template = getTemplate('hero-with-image');
```

## User Flow

1. **User creates or selects a section** on the canvas
2. **User clicks the "Generate with AI" button** (Sparkles icon) in the section controls
3. **Modal opens** showing:
   - Section type and description
   - Current website context (if set)
   - Optional specific instructions field
4. **User provides specific instructions** (optional) or proceeds with default context
5. **User clicks "Generate Section"** button
6. **System generates content**:
   - Sends request to `/api/generate-section`
   - OpenAI generates appropriate content based on context
   - Components are created using factory functions
   - Section layout is applied from template
7. **Section updates** with all new components
8. **Modal closes** automatically on success

## Error Handling

### API Errors

- **Missing API Key**: Returns 500 with error message
- **Invalid Input**: Returns 400 with validation error
- **Rate Limiting**: Returns 429 when rate limit exceeded
- **AI Generation Failure**: Returns 500 with descriptive error

### UI Error States

- Error message displayed in modal
- User can retry without closing modal
- Loading state prevents duplicate requests

## Security

### Input Sanitization

All user inputs are sanitized to prevent:

- Prompt injection attacks
- XSS attacks
- Malicious content

### Rate Limiting

- AI endpoints limited to 10 requests per minute
- Prevents abuse and manages API costs

### Validation

- Zod schema validation for all API requests
- Context prompt: 1-2000 characters
- Specific request: max 500 characters
- Variant: must be valid SectionVariant

## Performance

### Optimization Strategies

1. **Efficient Prompts**: Structured prompts reduce token usage
2. **Template-Based Generation**: Pre-defined structures speed up generation
3. **Component Factories**: Fast component creation with sensible defaults
4. **Single API Call**: Generate entire section in one request vs. multiple component requests

### Response Times

- Average generation time: 2-4 seconds
- Model: GPT-4o-mini (optimized for speed and cost)
- Max tokens: 1000 (sufficient for most sections)

## Best Practices

### For Users

1. **Set global context first**: Provides better results across all sections
2. **Use specific instructions**: Add details for more tailored content
3. **Review and edit**: AI-generated content is a starting point
4. **Regenerate if needed**: Don't settle for first result if it doesn't fit

### For Developers

1. **Keep prompts structured**: Clear JSON output formats
2. **Use templates**: Don't hardcode component structures
3. **Handle errors gracefully**: Always provide fallback options
4. **Test with various contexts**: Ensure quality across different use cases
5. **Monitor API usage**: Track costs and rate limits

## Future Enhancements

### Planned Features

1. **Template Selection**: Allow users to choose specific templates in modal
2. **Partial Generation**: Regenerate individual components within section
3. **Content Refinement**: Iterate on generated content without full regeneration
4. **Multi-Language Support**: Generate content in different languages
5. **Style Inheritance**: Apply custom themes to generated sections
6. **Image Integration**: Generate relevant images with DALL-E or Unsplash
7. **A/B Testing**: Generate variations for comparison

### Potential Improvements

1. **Smarter Layouts**: AI-suggested layouts based on content
2. **Component Recommendations**: Suggest additional components
3. **Content Consistency**: Cross-section content validation
4. **Tone Customization**: Professional, casual, playful, etc.
5. **Industry Templates**: Pre-configured templates for specific industries

## Troubleshooting

### Common Issues

**Issue**: Section generates with empty components

- **Cause**: Invalid or too-short context prompt
- **Solution**: Provide more detailed context (minimum 10 characters)

**Issue**: Generation fails with 500 error

- **Cause**: OpenAI API key not configured
- **Solution**: Set `OPENAI_API_KEY` in environment variables

**Issue**: Generated content doesn't match context

- **Cause**: Generic or unclear context prompt
- **Solution**: Be specific about website purpose and audience

**Issue**: Components have incorrect layout

- **Cause**: Template mismatch
- **Solution**: Check section variant matches intended layout

**Issue**: Rate limit exceeded

- **Cause**: Too many generation requests
- **Solution**: Wait 1 minute before retrying

## Related Documentation

- [Component Factory](/lib/factories/componentFactory.ts)
- [Section Factory](/lib/factories/sectionFactory.ts)
- [Security Middleware](/lib/middleware/apiWrapper.ts)
- [Input Sanitization](/lib/security/sanitize.ts)
- [OpenAI Client Configuration](/lib/openai.ts)

## Support

For issues or questions:

1. Check this documentation
2. Review API response errors
3. Verify environment configuration
4. Test with simple contexts first
5. Check browser console for client-side errors
