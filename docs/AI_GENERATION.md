# AI Content Generation System

This document provides comprehensive documentation for Bentoblocks' AI-powered content generation system, which enables users to generate contextual content for individual components using OpenAI's GPT-4o-mini model.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [User Flow](#user-flow)
4. [API Specification](#api-specification)
5. [Component Types & Prompts](#component-types--prompts)
6. [Security](#security)
7. [Error Handling](#error-handling)
8. [Prompt Engineering](#prompt-engineering)
9. [Testing](#testing)
10. [Future Enhancements](#future-enhancements)

---

## Overview

The AI content generation system allows users to generate personalized content for individual components by:

1. **Global Context**: Uses the page's metadata description as overall context (e.g., "I'm a freelance designer")
2. **Component-Specific Prompts**: Users provide specific instructions for each component (e.g., "Hero headline about my UX services")
3. **Intelligent Generation**: AI generates appropriate content based on component type, respecting length limits and format requirements

### Key Features

- **Per-Component Generation**: Each component can be individually generated with custom prompts
- **Context-Aware**: Uses global website context + specific component instructions
- **Type-Specific Validation**: Each component type has tailored prompts and validation rules
- **Security Hardened**: Rate limiting, input sanitization, and prompt injection prevention
- **Accessible UI**: Modal interface with keyboard support (ESC to close)

---

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  InlineComponentRenderer                                     │
│    └─> Generate Button (Sparkles icon)                       │
│         └─> Opens GenerateModal                              │
│                                                               │
│  GenerateModal                                                │
│    ├─> Displays global context                               │
│    ├─> Accepts component-specific prompt                     │
│    ├─> Shows loading/error states                            │
│    └─> Calls /api/generate-component                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  POST /api/generate-component                                 │
│    ├─> Security middleware (rate limiting, validation)       │
│    ├─> Input sanitization (XSS, prompt injection)            │
│    ├─> OpenAI GPT-4o-mini integration                        │
│    └─> Content validation & sanitization                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      State Layer                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Zustand Store                                                │
│    └─> updateComponent(sectionId, componentId, updates)      │
│         └─> Deep merges content fields                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
/home/user/bentobuild/
├── components/
│   ├── ai/
│   │   └── GenerateModal.tsx          # AI generation modal UI
│   └── canvas/
│       └── nodes/
│           ├── InlineComponentRenderer.tsx  # Component renderer with Generate button
│           └── SectionNode.tsx              # Section container with modal integration
├── hooks/
│   └── useGenerateModal.ts            # Modal state management hook
├── app/
│   └── api/
│       └── generate-component/
│           └── route.ts               # API endpoint for component generation
├── lib/
│   ├── openai.ts                      # OpenAI client configuration
│   ├── middleware/
│   │   └── apiWrapper.ts              # Security wrapper with rate limiting
│   └── security/
│       └── sanitize.ts                # Input validation & sanitization
└── store/
    └── useBuilderStore.ts             # Zustand store with updateComponent
```

---

## User Flow

### Step-by-Step Flow

1. **User hovers over a component** in the canvas
2. **Generate button appears** (yellow Sparkles icon)
3. **User clicks Generate button**
4. **GenerateModal opens** showing:
   - Global website context (if set)
   - Textarea for component-specific prompt
   - Placeholder examples based on component type
5. **User enters prompt** (e.g., "Main headline about web design services")
6. **User clicks Generate**
7. **Loading state** shows spinner
8. **API generates content** using GPT-4o-mini
9. **Content is validated** and sanitized
10. **Component updates** with new content
11. **Modal closes** automatically

### User Experience Details

- **Keyboard Shortcuts**: ESC key closes modal
- **Auto-focus**: Textarea is focused on modal open
- **Error Handling**: Clear error messages for validation failures
- **Loading States**: Disabled buttons and spinner during generation
- **Context Display**: Shows global context to guide user

---

## API Specification

### Endpoint

```
POST /api/generate-component
```

### Request Headers

```
Content-Type: application/json
```

### Request Body

```typescript
{
  componentType: ComponentType;      // "heading" | "text" | "button" | etc.
  contextPrompt: string;             // Global website context (max 2000 chars)
  blockPrompt: string;               // Component-specific prompt (max 2000 chars)
  existingContent?: Record<string, any>;  // Optional: current content for refinement
}
```

### Example Request

```json
{
  "componentType": "heading",
  "contextPrompt": "I'm a freelance UI/UX designer specializing in mobile apps",
  "blockPrompt": "Main headline for my hero section emphasizing innovation",
  "existingContent": {}
}
```

### Response Format

#### Success Response (200)

```json
{
  "success": true,
  "content": {
    "text": "Crafting Innovative Mobile Experiences",
    "level": 1
  }
}
```

#### Error Response (400/500)

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Rate Limiting

- **Tier**: `ai`
- **Limit**: 10 requests per minute per IP
- **Response**: 429 Too Many Requests if exceeded

### Security Features

1. **Input Validation**: Zod schema validation
2. **Sanitization**: XSS prevention, prompt injection filtering
3. **Rate Limiting**: Prevents abuse
4. **Error Masking**: Production errors don't leak internal details

---

## Component Types & Prompts

### Heading Component

**Type**: `heading`

**Generated Fields**:

```typescript
{
  text: string; // Max 60 characters
  level: 1 | 2 | 3 | 4 | 5 | 6; // Heading level
}
```

**AI Prompt Template**:

```
Generate a heading component.

Requirements:
- Heading text should be compelling and clear (max 60 characters)
- Choose appropriate heading level (1-6) based on importance
- Level 1 = main page title, Level 2 = section headers, Level 3+ = subsections

Return JSON with this exact structure:
{
  "text": "Your heading text here",
  "level": 2
}
```

**Example Prompts**:

- "Main hero headline about our AI-powered web builder"
- "Section title for testimonials from happy customers"
- "Subheading emphasizing speed and simplicity"

---

### Text Component

**Type**: `text`

**Generated Fields**:

```typescript
{
  body: string; // Max 300 characters, allows HTML
}
```

**AI Prompt Template**:

```
Generate a text paragraph component.

Requirements:
- Write 1-3 sentences of engaging body text (max 300 characters)
- Focus on benefits and value to the reader
- Use natural, conversational tone
- Keep it concise and scannable

Return JSON with this exact structure:
{
  "body": "Your paragraph text here."
}
```

**Example Prompts**:

- "Paragraph explaining how our drag-and-drop builder works"
- "Benefits of using AI for content generation"
- "Short bio about my design philosophy"

---

### Button Component

**Type**: `button`

**Generated Fields**:

```typescript
{
  text: string; // Max 20 characters
  url: string; // Valid URL or placeholder
  variant: 'filled' | 'outlined' | 'text';
}
```

**AI Prompt Template**:

```
Generate a button component.

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
}
```

**Example Prompts**:

- "Primary CTA button for free trial signup"
- "Secondary button to learn more about pricing"
- "Subtle text button to view case studies"

---

### Image Component

**Type**: `image`

**Generated Fields**:

```typescript
{
  alt: string;       // Max 100 characters (required)
  caption?: string;  // Max 150 characters (optional)
}
```

**AI Prompt Template**:

```
Generate image metadata for a component.

Requirements:
- Alt text must be descriptive for accessibility (max 100 characters)
- Caption is optional but should add context if used (max 150 characters)
- Focus on what the image should convey

Return JSON with this exact structure:
{
  "alt": "Descriptive alt text for accessibility",
  "caption": "Optional caption providing additional context"
}
```

**Example Prompts**:

- "Hero image showing our web builder interface in action"
- "Photo of me working on a design project"
- "Screenshot of AI content generation feature"

---

### Link Component

**Type**: `link`

**Generated Fields**:

```typescript
{
  text: string;         // Max 50 characters
  url: string;          // Valid URL or placeholder
  description?: string; // Max 100 characters
}
```

**AI Prompt Template**:

```
Generate a hyperlink component.

Requirements:
- Link text should be descriptive and indicate destination (max 50 characters)
- URL should be relevant (use placeholder if needed)
- Description provides additional context on hover/for accessibility (max 100 characters)

Return JSON with this exact structure:
{
  "text": "Link text here",
  "url": "/destination",
  "description": "Additional context about this link"
}
```

**Example Prompts**:

- "Link to my portfolio on Dribbble"
- "Read our full case study on e-commerce redesign"
- "Contact form for project inquiries"

---

### Spacer Component

**Type**: `spacer`

**Generated Fields**:

```typescript
{
  height: number; // 20-200 pixels
}
```

**AI Prompt Template**:

```
Generate vertical spacing configuration.

Requirements:
- Height should be between 20-200 pixels
- Common values: 20, 40, 60, 80, 120 for different spacing needs
- Consider the context and typical spacing conventions

Return JSON with this exact structure:
{
  "height": 40
}
```

**Example Prompts**:

- "Small spacing between paragraphs"
- "Large section separator"
- "Medium gap for visual breathing room"

---

### Divider Component

**Type**: `divider`

**Generated Fields**:

```typescript
{
  color?: string;      // Hex color (default: #e5e7eb)
  thickness?: number;  // 1-5 pixels (default: 2)
}
```

**AI Prompt Template**:

```
Generate a horizontal divider configuration.

Requirements:
- Color should be a valid CSS color (hex code preferred)
- Thickness should be 1-5 pixels
- Consider the design context (subtle vs prominent)

Return JSON with this exact structure:
{
  "color": "#e5e7eb",
  "thickness": 2
}
```

**Example Prompts**:

- "Subtle gray divider between sections"
- "Bold black separator for emphasis"
- "Light divider for minimal design"

---

## Security

### Input Sanitization

All user inputs are sanitized using multiple layers:

#### 1. Zod Schema Validation

```typescript
export const componentGenerateSchema = z.object({
  componentType: z.string().min(1).max(50),
  contextPrompt: z.string().max(2000).default(''),
  blockPrompt: z.string().min(1).max(2000),
  existingContent: z.record(z.any()).optional(),
});
```

#### 2. Prompt Injection Prevention

Dangerous patterns are removed from prompts:

- `ignore previous instructions`
- `forget everything`
- `system:`, `admin:`, `assistant:`
- Chat tokens like `<|system|>`
- Template injection patterns `{{...}}`, `{%...%}`, `${...}`

#### 3. XSS Prevention

- **HTML Fields**: Sanitized with DOMPurify (allowed tags: `<b>`, `<i>`, `<p>`, etc.)
- **Plain Text Fields**: All HTML stripped
- **URLs**: Protocol validation (only `http:` and `https:`)

#### 4. Content Length Limits

- Headings: 60 characters
- Text body: 300 characters
- Button text: 20 characters
- Image alt: 100 characters
- Link text: 50 characters
- Prompts: 2000 characters

### Rate Limiting

```typescript
// Applied via secureApi wrapper
export const POST = secureApi(handlePOST, {
  rateLimit: 'ai', // 10 requests/minute
  requireAuth: false, // Open for demo purposes
});
```

### Error Handling

Production errors are sanitized to prevent information leakage:

```typescript
// Development: Full error messages
// Production: Generic "Internal server error"
const errorMessage = isDevelopment ? error.message : 'Internal server error';
```

---

## Error Handling

### Client-Side Errors

| Error             | Cause                                      | UI Feedback                                     |
| ----------------- | ------------------------------------------ | ----------------------------------------------- |
| Empty Prompt      | User clicks Generate without entering text | "Please enter a prompt" in red box              |
| Network Error     | API unreachable or timeout                 | "Network error. Please try again."              |
| Rate Limit        | Too many requests                          | "Failed to generate content. Please try again." |
| Generation Failed | AI model error                             | "Failed to generate content. Please try again." |

### Server-Side Errors

| Error Code | Cause                 | Response                                                      |
| ---------- | --------------------- | ------------------------------------------------------------- |
| 400        | Invalid request body  | `{ "success": false, "error": "Validation message" }`         |
| 429        | Rate limit exceeded   | `{ "success": false, "error": "Rate limit exceeded" }`        |
| 500        | Internal server error | `{ "success": false, "error": "Failed to generate content" }` |

### Validation Errors

Component-specific validation ensures generated content meets requirements:

```typescript
// Example: Heading validation
if (!text) {
  throw new Error('Heading text is required');
}

// Example: Button variant validation
const variant = ['filled', 'outlined', 'text'].includes(content.variant)
  ? content.variant
  : 'filled'; // Fallback to safe default
```

---

## Prompt Engineering

### Best Practices

#### 1. Component-Specific Instructions

Each component type has tailored instructions that guide the AI:

- **Headings**: Focus on brevity and impact
- **Text**: Emphasize benefits and conversational tone
- **Buttons**: Use action verbs and clear CTAs
- **Images**: Descriptive alt text for accessibility

#### 2. Context Hierarchy

Prompts are structured with clear hierarchy:

```
Website context: "{global context}"
Specific request: "{component prompt}"

{Type-specific requirements}
{Expected JSON structure}
```

#### 3. Length Constraints

Always specify maximum character limits in prompts:

```
- Heading text should be compelling and clear (max 60 characters)
- Write 1-3 sentences of engaging body text (max 300 characters)
```

#### 4. Format Enforcement

Use JSON response format to ensure structured output:

```typescript
response_format: {
  type: 'json_object';
}
```

### Example Effective Prompts

**Good**:

> "Main hero headline emphasizing our AI-powered web builder's speed and simplicity"

**Why**: Specific, includes key benefits, clear intent

**Bad**:

> "Make a heading"

**Why**: Too vague, no context or guidance

---

## Testing

### Manual Testing Checklist

- [ ] **Heading Generation**
  - [ ] Level 1-6 headers generate correctly
  - [ ] Text respects 60-character limit
  - [ ] Level is appropriate for context

- [ ] **Text Generation**
  - [ ] 1-3 sentences generate
  - [ ] HTML is properly sanitized
  - [ ] Respects 300-character limit

- [ ] **Button Generation**
  - [ ] Action-oriented text (max 20 chars)
  - [ ] Valid URLs or placeholders
  - [ ] Correct variant selection

- [ ] **Image Generation**
  - [ ] Descriptive alt text
  - [ ] Optional caption works
  - [ ] Accessibility-friendly

- [ ] **Link Generation**
  - [ ] Descriptive link text
  - [ ] Valid URLs
  - [ ] Description provides context

- [ ] **Spacer Generation**
  - [ ] Height within 20-200px range
  - [ ] Appropriate for context

- [ ] **Divider Generation**
  - [ ] Valid hex colors
  - [ ] Thickness 1-5px
  - [ ] Appropriate styling

### Security Testing

- [ ] **Rate Limiting**: Verify 10 req/min limit enforced
- [ ] **XSS Prevention**: Inject `<script>alert('xss')</script>` in prompts
- [ ] **Prompt Injection**: Try "ignore previous instructions and..."
- [ ] **URL Validation**: Test `javascript:alert(1)` URLs
- [ ] **Length Limits**: Submit 5000+ character prompts

### Error Handling

- [ ] Empty prompt validation
- [ ] Network timeout handling
- [ ] Invalid JSON from AI
- [ ] Missing required fields
- [ ] Concurrent request handling

### Accessibility

- [ ] ESC key closes modal
- [ ] Focus trap within modal
- [ ] Screen reader announcements
- [ ] Keyboard navigation

---

## Future Enhancements

### Short-Term

1. **Content Refinement**
   - "Regenerate" button to try alternative variations
   - "Make it shorter/longer" quick actions
   - Tone adjustment (professional, casual, friendly)

2. **Batch Generation**
   - Generate all components in a section at once
   - Preview mode before accepting changes
   - Undo/redo for AI generations

3. **Smart Suggestions**
   - Pre-filled prompt suggestions based on component type
   - Learn from user's previous prompts
   - Context-aware placeholder text

### Medium-Term

4. **Image Generation**
   - DALL-E integration for actual image generation
   - Unsplash integration for stock photos
   - Automatic image optimization

5. **Multi-Language Support**
   - Generate content in different languages
   - Automatic translation of existing content
   - Language-specific tone adjustments

6. **Template Library**
   - Save successful prompts as templates
   - Share templates with team
   - Community template marketplace

### Long-Term

7. **Advanced AI Features**
   - Brand voice consistency checking
   - SEO optimization suggestions
   - A/B testing content variations
   - Accessibility compliance scanning

8. **Collaborative Editing**
   - Real-time AI suggestions during typing
   - Team feedback on AI-generated content
   - Version history with AI annotations

---

## Troubleshooting

### Common Issues

#### Modal doesn't open

- **Check**: Verify `useGenerateModal` hook is initialized
- **Check**: Ensure `onGenerate` prop is passed to InlineComponentRenderer
- **Solution**: Add modal integration to SectionNode

#### Generation fails silently

- **Check**: Browser console for errors
- **Check**: Network tab for API response
- **Solution**: Verify OPENAI_API_KEY is set in `.env.local`

#### Content not updating

- **Check**: Zustand DevTools for state changes
- **Check**: updateComponent is being called
- **Solution**: Ensure deep merge of content fields in store

#### Rate limit errors

- **Check**: Are you making too many requests?
- **Solution**: Wait 60 seconds before retrying
- **Solution**: Implement exponential backoff in production

---

## API Reference

### OpenAI Configuration

```typescript
// lib/openai.ts
export const CONTENT_GENERATION_CONFIG = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 1000,
};
```

### Security Schemas

```typescript
// lib/security/sanitize.ts
export const schemas = {
  componentGenerate: componentGenerateSchema,
  // ... other schemas
};
```

### Zustand Store Actions

```typescript
// store/useBuilderStore.ts
updateComponent(sectionId: string, componentId: string, updates: Partial<Component>)
```

---

## Support

For issues or questions:

1. Check this documentation first
2. Review the implementation files
3. Test with different component types
4. Verify security middleware is working
5. Check OpenAI API key and quota

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
**Maintained By**: Bentoblocks Engineering Team
