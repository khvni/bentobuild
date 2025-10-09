/**
 * OpenAI Client Configuration
 *
 * This module provides a centralized OpenAI client instance
 * for use across the application.
 */

import OpenAI from 'openai';

// Initialize OpenAI client
// API key should be set in environment variables as OPENAI_API_KEY
// Use a placeholder during build time if key is not available
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder-key',
});

/**
 * Default configuration for content generation
 */
export const CONTENT_GENERATION_CONFIG = {
  model: 'gpt-4o-mini', // Cost-effective model for content generation
  temperature: 0.7, // Balance between creativity and consistency
  max_tokens: 1000, // Sufficient for most block content
} as const;

/**
 * Alternative model for more complex content generation
 */
export const ADVANCED_CONTENT_GENERATION_CONFIG = {
  model: 'gpt-4-turbo',
  temperature: 0.7,
  max_tokens: 1500,
} as const;
