import type { Block } from 'payload'

import {
  CtaBlock,
  GalleryBlock,
  ImageGridBlock,
  NewsletterBlock,
  RichTextBlock,
  StatsBlock,
  TimelineBlock,
} from './content'
import { ContactFormBlock, ExperienceShowcaseBlock, FaqBlock, TestimonialsBlock } from './dynamic'
import {
  ChaptersBlock,
  CinematicSequenceBlock,
  FullBleedImageBlock,
  HeroBlock,
  ImageTextBlock,
  QuoteBlock,
  SplitBlock,
} from './story'

/** Order here is the order editors see in the "Add section" drawer. */
export const pageBlocks: Block[] = [
  HeroBlock,
  ChaptersBlock,
  CinematicSequenceBlock,
  ExperienceShowcaseBlock,
  ImageTextBlock,
  SplitBlock,
  FullBleedImageBlock,
  StatsBlock,
  TestimonialsBlock,
  FaqBlock,
  GalleryBlock,
  ImageGridBlock,
  TimelineBlock,
  QuoteBlock,
  RichTextBlock,
  CtaBlock,
  ContactFormBlock,
  NewsletterBlock,
]
