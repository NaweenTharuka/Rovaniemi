/**
 * Builds the URL used by the admin "Preview" button and Live Preview iframe.
 * The route enables Next.js draft mode after verifying the shared secret.
 */
export const pathFor = (collection: 'pages' | 'experiences' | 'journal', slug?: string | null) => {
  if (!slug) return '/'
  if (collection === 'experiences') return `/experiences/${slug}`
  if (collection === 'journal') return `/journal/${slug}`
  return slug === 'home' ? '/' : `/${slug}`
}

export const previewPath = (
  collection: 'pages' | 'experiences' | 'journal',
  slug?: string | null,
): string => {
  const params = new URLSearchParams({
    path: pathFor(collection, slug),
    collection,
    secret: process.env.PREVIEW_SECRET ?? '',
  })
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  return `${base}/next/preview?${params.toString()}`
}
