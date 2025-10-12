import crypto from 'crypto';

interface PreviewEntry {
  html: string;
  contextPrompt: string;
  createdAt: number;
}

type PreviewCache = Map<string, PreviewEntry>;

declare global {
  // eslint-disable-next-line no-var
  var __previewCache: PreviewCache | undefined;
}

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

function getCache(): PreviewCache {
  if (!global.__previewCache) {
    global.__previewCache = new Map();
  }
  return global.__previewCache;
}

function cleanupExpiredEntries(cache: PreviewCache) {
  const now = Date.now();
  for (const [slug, entry] of cache.entries()) {
    if (now - entry.createdAt > CACHE_TTL_MS) {
      cache.delete(slug);
    }
  }
}

export function storePreview(html: string, contextPrompt: string): string {
  const cache = getCache();
  cleanupExpiredEntries(cache);

  const hash = crypto
    .createHash('sha256')
    .update(html)
    .update(':')
    .update(contextPrompt)
    .digest('hex')
    .slice(0, 16);

  cache.set(hash, {
    html,
    contextPrompt,
    createdAt: Date.now(),
  });

  return hash;
}

export function getPreview(slug: string): PreviewEntry | null {
  const cache = getCache();
  cleanupExpiredEntries(cache);

  const entry = cache.get(slug);
  if (!entry) {
    return null;
  }

  return entry;
}

export function deletePreview(slug: string): void {
  const cache = getCache();
  cache.delete(slug);
}
