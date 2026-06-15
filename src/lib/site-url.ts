function cleanAndNormalize(urlStr: string): string | null {
  if (!urlStr) return null;
  let target = urlStr.trim();

  // If it's a host-only string (like Vercel variables), default to https://
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  try {
    const parsed = new URL(target);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    // Return origin (strips path, query, and trailing slashes)
    return parsed.origin;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  // 1. NEXT_PUBLIC_SITE_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = cleanAndNormalize(process.env.NEXT_PUBLIC_SITE_URL);
    if (url) return url;
  }

  // 2. VERCEL_PROJECT_PRODUCTION_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const url = cleanAndNormalize(process.env.VERCEL_PROJECT_PRODUCTION_URL);
    if (url) return url;
  }

  // 3. VERCEL_URL
  if (process.env.VERCEL_URL) {
    const url = cleanAndNormalize(process.env.VERCEL_URL);
    if (url) return url;
  }

  // 4. Fallback to localhost
  return 'http://localhost:3000';
}
