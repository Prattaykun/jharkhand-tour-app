// lib/getURL.ts
export function getURL() {
  // 1. Prefer explicit NEXT_PUBLIC_SITE_URL for production
  let url =
    // process?.env?.NEXT_PUBLIC_SITE_URL ??
    // 2. Fallback to Vercel-provided domain during previews
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    // 3. Local development default
    'http://localhost:3000/';

  // Ensure it has protocol
  url = url.startsWith('http') ? url : `https://${url}`;
  // Ensure trailing slash
  if (!url.endsWith('/')) url = `${url}/`;
  return url;
}
