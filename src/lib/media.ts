import type { Media } from '@/payload-types'

import { toAbsoluteUrl, withBasePath } from './base-path'
import { isObject } from './utils'

export type MediaRef = Media | number | string | null | undefined
type SizeName = keyof NonNullable<Media['sizes']>

export const asMedia = (ref: MediaRef): Media | null => (isObject<Media>(ref) ? ref : null)

export const isVideo = (media?: Media | null) => Boolean(media?.mimeType?.startsWith('video/'))

/**
 * Payload prefixes file URLs with serverURL. Same-origin files are served as
 * site-relative paths so next/image treats them as local (no remotePatterns needed)
 * and previews work on any host.
 */
export const relativeUrl = (url?: string | null): string | null => {
  if (!url) return null
  // The server URL may carry a sub-path (static preview), so match the media route anywhere after the host.
  const match = url.match(/^https?:\/\/[^/]+(?:\/.*?)?(\/api\/media\/file\/.*)$/)
  return withBasePath(match ? match[1] : url)
}

/**
 * Picks the smallest generated size that still covers `minWidth`.
 * If none does (Payload never upscales, so small uploads lack the big sizes),
 * uses whichever is wider: the largest derivative or the original — never a
 * derivative that is smaller than the file we already have.
 */
export const mediaUrl = (ref: MediaRef, minWidth = 2048): string | null => {
  const media = asMedia(ref)
  if (!media?.url) return null
  if (isVideo(media) || media.mimeType === 'image/svg+xml') return relativeUrl(media.url)

  const order: SizeName[] = ['thumbnail', 'card', 'tablet', 'desktop', 'hero']
  for (const name of order) {
    const size = media.sizes?.[name]
    if (size?.url && size.width && size.width >= minWidth) return relativeUrl(size.url)
  }
  const largest = [...order].reverse().find((name) => media.sizes?.[name]?.url)
  const largestSize = largest ? media.sizes?.[largest] : null
  if (largestSize?.url && (largestSize.width ?? 0) >= (media.width ?? 0)) return relativeUrl(largestSize.url)
  return relativeUrl(media.url)
}

export const focalPosition = (ref: MediaRef) => {
  const media = asMedia(ref)
  const x = typeof media?.focalX === 'number' ? media.focalX : 50
  const y = typeof media?.focalY === 'number' ? media.focalY : 50
  return `${x}% ${y}%`
}

export const ogImageUrl = (ref: MediaRef, origin: string) => {
  const media = asMedia(ref)
  const url = relativeUrl(media?.sizes?.og?.url) || mediaUrl(media, 1200)
  if (!url) return undefined
  return toAbsoluteUrl(origin, url)
}
