import { Fragment } from 'react'

import type { Page, SiteSetting } from '@/payload-types'

import { ChaptersBlock } from './chapters'
import { CinematicSequenceBlock } from './cinematic-sequence'
import { ContactFormBlock } from './contact-block'
import { CtaBlock, ImageGridBlock, NewsletterBlock, RichTextBlock, StatsBlock, TimelineBlock } from './content-blocks'
import { ExperienceShowcaseBlock } from './experience-showcase'
import { FaqBlock } from './faq'
import { GalleryBlock } from './gallery-block'
import { HeroBlock } from './hero'
import { FullBleedImageBlock, ImageTextBlock, QuoteBlock, SplitBlock } from './media-blocks'
import { TestimonialsBlock } from './testimonials'

type Block = NonNullable<Page['layout']>[number]

/**
 * Maps CMS section data to presentation components.
 * Content decides *what* is shown; these components decide *how* it looks.
 */
export function RenderBlocks({ blocks, settings }: { blocks?: Page['layout']; settings: SiteSetting }) {
  const visible = (blocks ?? []).filter((block) => !block.hidden)
  if (!visible.length) return null

  return (
    <>
      {visible.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`
        const isFirst = index === 0
        return <Fragment key={key}>{renderBlock(block, { isFirst, settings })}</Fragment>
      })}
    </>
  )
}

function renderBlock(block: Block, ctx: { isFirst: boolean; settings: SiteSetting }) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock block={block} isFirst={ctx.isFirst} />
    case 'chapters':
      return <ChaptersBlock block={block} />
    case 'cinematicSequence':
      return <CinematicSequenceBlock block={block} />
    case 'experienceShowcase':
      return <ExperienceShowcaseBlock block={block} />
    case 'imageText':
      return <ImageTextBlock block={block} />
    case 'split':
      return <SplitBlock block={block} />
    case 'fullBleedImage':
      return <FullBleedImageBlock block={block} />
    case 'stats':
      return <StatsBlock block={block} />
    case 'testimonials':
      return <TestimonialsBlock block={block} />
    case 'faq':
      return <FaqBlock block={block} />
    case 'gallery':
      return <GalleryBlock block={block} />
    case 'imageGrid':
      return <ImageGridBlock block={block} />
    case 'timeline':
      return <TimelineBlock block={block} />
    case 'quote':
      return <QuoteBlock block={block} />
    case 'richText':
      return <RichTextBlock block={block} />
    case 'cta':
      return <CtaBlock block={block} settings={ctx.settings} />
    case 'contactForm':
      return <ContactFormBlock block={block} />
    case 'newsletter':
      return <NewsletterBlock block={block} />
    default: {
      const unknown: never = block
      return unknown
    }
  }
}
