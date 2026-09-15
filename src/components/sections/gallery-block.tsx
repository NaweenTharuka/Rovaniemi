import { CmsImage } from '@/components/media/cms-image'
import { asMedia, mediaUrl, type MediaRef } from '@/lib/media'
import type { GalleryBlock as GalleryData } from '@/payload-types'

import { Gallery, type GalleryItem } from './gallery'
import { Section, SectionHeader } from './section'

export const toGalleryItems = (images: MediaRef[] | null | undefined): GalleryItem[] =>
  (images ?? [])
    .map(asMedia)
    .filter((m): m is NonNullable<typeof m> => Boolean(m?.url && m.mimeType?.startsWith('image/')))
    .map((m) => ({
      id: String(m.id),
      thumb: <CmsImage media={m} sizes="(min-width: 48rem) 40vw, 100vw" sourceWidth={960} />,
      full: mediaUrl(m, 2048)!,
      alt: m.alt === 'decorative' ? '' : m.alt,
      caption: m.caption,
      credit: m.credit,
      width: m.width,
      height: m.height,
    }))

export function GalleryBlock({ block }: { block: GalleryData }) {
  const items = toGalleryItems(block.images as MediaRef[])
  if (!items.length) return null
  return (
    <Section settings={block}>
      <SectionHeader label={block.sectionLabel} eyebrow={block.eyebrow} heading={block.heading} size="md" className="mb-12 md:mb-16" />
      <Gallery items={items} layout={block.layout} label={block.heading?.replace(/\n/g, ' ') || 'Gallery'} />
    </Section>
  )
}
