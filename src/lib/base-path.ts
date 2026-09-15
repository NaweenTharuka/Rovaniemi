/**
 * Sub-path the site is served from. Empty for the normal site; set via
 * NEXT_PUBLIC_BASE_PATH for static previews such as GitHub Pages (/Rovaniemi).
 * Next.js <Link> adds it automatically — raw URLs (images, fetches, <a>) need this helper.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')

export const withBasePath = (url: string) =>
  BASE_PATH && url.startsWith('/') && !url.startsWith('//') && !url.startsWith(`${BASE_PATH}/`) ? `${BASE_PATH}${url}` : url

/** Absolute URL for metadata/JSON-LD. `origin` already includes the base path when one is set. */
export const toAbsoluteUrl = (origin: string, url: string) => {
  if (/^https?:\/\//.test(url)) return url
  const path = BASE_PATH && url.startsWith(`${BASE_PATH}/`) ? url.slice(BASE_PATH.length) : url
  return `${origin}${path}`
}
