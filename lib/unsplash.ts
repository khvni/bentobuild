/**
 * Unsplash API Integration
 *
 * Provides functions to search and fetch images from Unsplash.
 * Free tier: 50 requests/hour
 *
 * @see https://unsplash.com/developers
 */

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

/**
 * Unsplash image result
 */
export interface UnsplashImage {
  id: string;
  url: string;
  thumbUrl: string;
  fullUrl: string;
  alt: string;
  author: string;
  authorUrl: string;
  width: number;
  height: number;
}

/**
 * Search for images on Unsplash
 *
 * @param query - Search query (e.g., "landscape", "business", "portrait")
 * @param perPage - Number of results to return (default: 10, max: 30)
 * @returns Array of image results
 */
export async function searchUnsplashImages(
  query: string,
  perPage: number = 10
): Promise<UnsplashImage[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('UNSPLASH_ACCESS_KEY not configured, using placeholder images');
    return getPlaceholderImages(query, perPage);
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    interface UnsplashPhoto {
      id: string;
      urls: { regular: string; thumb: string; full: string };
      alt_description?: string;
      description?: string;
      user: { name: string; links: { html: string } };
      width: number;
      height: number;
    }

    return data.results.map((photo: UnsplashPhoto) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbUrl: photo.urls.thumb,
      fullUrl: photo.urls.full,
      alt: photo.alt_description || photo.description || query,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      width: photo.width,
      height: photo.height,
    }));
  } catch (error) {
    console.error('Unsplash search failed:', error);
    return getPlaceholderImages(query, perPage);
  }
}

/**
 * Get a random image from Unsplash
 *
 * @param query - Optional search query to constrain randomness
 * @returns Single random image
 */
export async function getRandomUnsplashImage(query?: string): Promise<UnsplashImage | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('UNSPLASH_ACCESS_KEY not configured, using placeholder image');
    const placeholders = getPlaceholderImages(query || 'nature', 1);
    return placeholders[0] || null;
  }

  try {
    const queryParam = query ? `?query=${encodeURIComponent(query)}` : '';
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random${queryParam}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const photo = await response.json();

    return {
      id: photo.id,
      url: photo.urls.regular,
      thumbUrl: photo.urls.thumb,
      fullUrl: photo.urls.full,
      alt: photo.alt_description || photo.description || query || 'Random image',
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      width: photo.width,
      height: photo.height,
    };
  } catch (error) {
    console.error('Unsplash random image failed:', error);
    const placeholders = getPlaceholderImages(query || 'nature', 1);
    return placeholders[0] || null;
  }
}

/**
 * Get contextually relevant image URL based on keywords
 *
 * This is the main function to use for AI-generated image suggestions.
 * It searches Unsplash and returns the best match URL.
 *
 * @param keywords - Search keywords (e.g., "landscape photography", "business professional")
 * @returns Image URL ready to use in img src
 */
export async function getContextualImageUrl(keywords: string): Promise<string> {
  const images = await searchUnsplashImages(keywords, 1);

  if (images.length > 0) {
    return images[0].url;
  }

  // Fallback to placeholder
  return getPlaceholderImageUrl(keywords);
}

/**
 * Generate placeholder images when Unsplash is unavailable
 * Uses Picsum Photos (Lorem Picsum) as fallback
 */
function getPlaceholderImages(query: string, count: number): UnsplashImage[] {
  const images: UnsplashImage[] = [];

  for (let i = 0; i < count; i++) {
    const seed = `${query}-${i}`;
    const width = 1200;
    const height = 800;
    const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;

    images.push({
      id: `placeholder-${seed}`,
      url,
      thumbUrl: `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/300`,
      fullUrl: url,
      alt: `${query} image`,
      author: 'Placeholder',
      authorUrl: 'https://picsum.photos',
      width,
      height,
    });
  }

  return images;
}

/**
 * Get a single placeholder image URL
 */
function getPlaceholderImageUrl(query: string): string {
  const seed = encodeURIComponent(query);
  return `https://picsum.photos/seed/${seed}/1200/800`;
}

/**
 * Extract image keywords from context prompt
 *
 * This helps determine what kind of images to search for based on user's context.
 *
 * @param contextPrompt - User's website description
 * @param blockType - Type of block needing an image
 * @returns Search keywords for Unsplash
 */
export function extractImageKeywords(
  contextPrompt: string,
  blockType: 'hero' | 'image' = 'image'
): string {
  const lower = contextPrompt.toLowerCase();

  // Industry-specific keywords
  if (lower.includes('photograph')) return 'professional camera photography';
  if (lower.includes('restaurant') || lower.includes('food')) return 'gourmet food restaurant';
  if (lower.includes('fitness') || lower.includes('gym')) return 'fitness training gym';
  if (lower.includes('spa') || lower.includes('wellness')) return 'spa wellness relaxation';
  if (lower.includes('tech') || lower.includes('software')) return 'technology workspace';
  if (lower.includes('design') || lower.includes('creative')) return 'creative design workspace';
  if (lower.includes('real estate') || lower.includes('property'))
    return 'modern architecture home';
  if (lower.includes('travel') || lower.includes('tour')) return 'travel destination landscape';
  if (lower.includes('fashion')) return 'fashion style clothing';
  if (lower.includes('coffee') || lower.includes('cafe')) return 'coffee shop cafe';
  if (lower.includes('music') || lower.includes('band')) return 'live music performance';
  if (lower.includes('art') || lower.includes('gallery')) return 'art gallery exhibition';

  // Default based on block type
  if (blockType === 'hero') {
    return 'professional workspace teamwork';
  }

  // Generic fallback
  return 'professional business office';
}
