const FALLBACK_SITE_URL = 'http://localhost:3000'

function normalizeBaseUrl(rawUrl: string): string {
  return rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl
}

export function getSiteUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL

  if (!configuredUrl) return FALLBACK_SITE_URL
  if (configuredUrl.startsWith('http://') || configuredUrl.startsWith('https://')) {
    return normalizeBaseUrl(configuredUrl)
  }

  return normalizeBaseUrl(`https://${configuredUrl}`)
}

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}

export const siteConfig = {
  name: 'sea-specter',
  description: 'An editorial blog on design, culture, and the spaces between.',
  keywords: ['editorial blog', 'design', 'culture', 'creative writing', 'visual essays'],
}
