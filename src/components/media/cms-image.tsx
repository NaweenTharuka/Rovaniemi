import Image from 'next/image'

import { asMedia, focalPosition, mediaUrl, type MediaRef } from '@/lib/media'
import { cn } from '@/lib/utils'

type CmsImageProps = {
  media: MediaRef
  /** Responsive `sizes` attribute — always describe the real rendered width. */
  sizes: string
  className?: string
  imgClassName?: string
  priority?: boolean
  /** Minimum source width to request from the CMS derivatives. */
  sourceWidth?: number
  alt?: string
  quality?: number
}

/**
 * Fills its (relatively positioned) parent. Uses a CMS WebP derivative as the
 * source so the optimiser never processes multi-megabyte originals, and honours
 * the focal point editors set in the media library.
 */
export function CmsImage({
  media,
  sizes,
  className,
  imgClassName,
  priority = false,
  sourceWidth = 2048,
  alt,
  quality = 78,
}: CmsImageProps) {
  const doc = asMedia(media)
  const src = mediaUrl(doc, sourceWidth)
  if (!doc || !src) return <div aria-hidden="true" className={cn('absolute inset-0 bg-ink', className)} />

  const altText = alt ?? (doc.alt === 'decorative' ? '' : doc.alt ?? '')

  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-ink', className)}>
      <Image
        src={src}
        alt={altText}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        quality={quality}
        unoptimized={doc.mimeType === 'image/svg+xml'}
        className={cn('object-cover', imgClassName)}
        style={{ objectPosition: focalPosition(doc) }}
      />
    </div>
  )
}
