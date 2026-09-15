import 'server-only'

import { unstable_cache } from 'next/cache'
import type { Where } from 'payload'
import { cache } from 'react'

import { TAGS } from '@/payload/hooks/revalidate'
import type {
  Experience,
  Faq,
  FaqCategory,
  Journal,
  Media,
  Navigation,
  Page,
  SiteSetting,
  Testimonial,
} from '@/payload-types'

import { getPayloadClient, isDraft } from './client'

const REVALIDATE_SECONDS = 60 * 60

/** Visible on the website: published (or any draft in preview) and not archived. */
const visible = (draft: boolean, extra?: Where): Where => ({
  and: [
    ...(draft ? [] : [{ _status: { equals: 'published' } } as Where]),
    { workflowStatus: { not_equals: 'archived' } },
    ...(extra ? [extra] : []),
  ],
})

/**
 * Runs a query through the Next.js data cache when not previewing,
 * so pages stay static until a CMS change revalidates the tag.
 */
const cached = <Args extends unknown[], R>(
  key: string,
  tags: string[],
  fn: (draft: boolean, ...args: Args) => Promise<R>,
) =>
  cache(async (...args: Args): Promise<R> => {
    const draft = await isDraft()
    if (draft) return fn(true, ...args)
    return unstable_cache((...a: Args) => fn(false, ...a), [key, JSON.stringify(args)], {
      tags,
      revalidate: REVALIDATE_SECONDS,
    })(...args)
  })

/* ---------------------------------------------------------------- globals */

export const getSettings = cached('settings', [TAGS.settings, TAGS.media], async () => {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({ slug: 'site-settings', depth: 1 })) as SiteSetting
})

export const getNavigation = cached('navigation', [TAGS.navigation, TAGS.pages, TAGS.experiences], async () => {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({ slug: 'navigation', depth: 1 })) as Navigation
})

/* ---------------------------------------------------------------- pages */

export const getPageBySlug = cached(
  'page',
  [TAGS.pages, TAGS.media, TAGS.experiences, TAGS.faqs, TAGS.testimonials],
  async (draft, slug: string): Promise<Page | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'pages',
      draft,
      depth: 2,
      limit: 1,
      overrideAccess: draft,
      where: visible(draft, { slug: { equals: slug } }),
    })
    return docs[0] ?? null
  },
)

export const getPageSlugs = async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 200,
    select: { slug: true },
    where: visible(false),
  })
  return docs.map((d) => d.slug).filter(Boolean) as string[]
}

/* ---------------------------------------------------------------- experiences */

type ExperienceQuery = { featured?: boolean; ids?: (string | number)[]; limit?: number; excludeId?: string | number }

export const getExperiences = cached(
  'experiences',
  [TAGS.experiences, TAGS.media],
  async (draft, opts: ExperienceQuery = {}): Promise<Experience[]> => {
    const payload = await getPayloadClient()
    const filters: Where[] = []
    if (opts.featured) filters.push({ featured: { equals: true } })
    if (opts.ids?.length) filters.push({ id: { in: opts.ids } })
    if (opts.excludeId !== undefined) filters.push({ id: { not_equals: opts.excludeId } })

    const { docs } = await payload.find({
      collection: 'experiences',
      draft,
      depth: 1,
      limit: opts.limit ?? 50,
      overrideAccess: draft,
      sort: '_order',
      where: visible(draft, filters.length ? { and: filters } : undefined),
      select: {
        title: true,
        shortTitle: true,
        eyebrow: true,
        tagline: true,
        categories: true,
        slug: true,
        shortDescription: true,
        heroImage: true,
        duration: true,
        groupSize: true,
        difficulty: true,
        location: true,
        startingPoint: true,
        season: true,
        pricing: true,
        featured: true,
      },
    })

    if (opts.ids?.length) {
      const order = opts.ids.map(String)
      return (docs as Experience[]).sort((a, b) => order.indexOf(String(a.id)) - order.indexOf(String(b.id)))
    }
    return docs as Experience[]
  },
)

export const getExperienceBySlug = cached(
  'experience',
  [TAGS.experiences, TAGS.media, TAGS.faqs, TAGS.testimonials],
  async (draft, slug: string): Promise<Experience | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'experiences',
      draft,
      depth: 2,
      limit: 1,
      overrideAccess: draft,
      where: visible(draft, { slug: { equals: slug } }),
      joins: { faqs: false, testimonials: false },
    })
    return docs[0] ?? null
  },
)

export const getExperienceSlugs = async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'experiences',
    depth: 0,
    limit: 200,
    select: { slug: true },
    where: visible(false),
  })
  return docs.map((d) => d.slug).filter(Boolean) as string[]
}

/* ---------------------------------------------------------------- faqs */

type FaqQuery = {
  featured?: boolean
  categoryIds?: (string | number)[]
  ids?: (string | number)[]
  experienceId?: string | number
  limit?: number
}

export const getFaqs = cached('faqs', [TAGS.faqs], async (draft, opts: FaqQuery = {}): Promise<Faq[]> => {
  const payload = await getPayloadClient()
  const filters: Where[] = []
  if (opts.featured) filters.push({ featured: { equals: true } })
  if (opts.categoryIds?.length) filters.push({ category: { in: opts.categoryIds } })
  if (opts.ids?.length) filters.push({ id: { in: opts.ids } })
  if (opts.experienceId !== undefined) filters.push({ experiences: { in: [opts.experienceId] } })

  const { docs } = await payload.find({
    collection: 'faqs',
    draft,
    depth: 1,
    limit: opts.limit ?? 100,
    overrideAccess: draft,
    sort: '_order',
    where: visible(draft, filters.length ? { and: filters } : undefined),
  })

  if (opts.ids?.length) {
    const order = opts.ids.map(String)
    return docs.sort((a, b) => order.indexOf(String(a.id)) - order.indexOf(String(b.id)))
  }
  return docs
})

export const getFaqCategories = cached('faq-categories', [TAGS.faqs], async (): Promise<FaqCategory[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'faq-categories', depth: 0, limit: 100, sort: '_order' })
  return docs
})

/* ---------------------------------------------------------------- testimonials */

type TestimonialQuery = {
  featured?: boolean
  experienceId?: string | number
  ids?: (string | number)[]
  limit?: number
}

export const getTestimonials = cached(
  'testimonials',
  [TAGS.testimonials, TAGS.media],
  async (draft, opts: TestimonialQuery = {}): Promise<Testimonial[]> => {
    const payload = await getPayloadClient()
    const filters: Where[] = []
    if (opts.featured) filters.push({ featured: { equals: true } })
    if (opts.experienceId !== undefined) filters.push({ experience: { equals: opts.experienceId } })
    if (opts.ids?.length) filters.push({ id: { in: opts.ids } })

    const { docs } = await payload.find({
      collection: 'testimonials',
      draft,
      depth: 1,
      limit: opts.limit ?? 12,
      overrideAccess: draft,
      sort: '_order',
      where: visible(draft, filters.length ? { and: filters } : undefined),
    })
    return docs
  },
)

/* ---------------------------------------------------------------- media credits */

export const getCreditedMedia = cached('media-credits', [TAGS.media], async (): Promise<Media[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 500,
    sort: 'title',
    where: { and: [{ credit: { exists: true } }, { credit: { not_equals: '' } }] },
  })
  return docs
})

/* ---------------------------------------------------------------- journal */

export const getJournalEntries = cached('journal', [TAGS.journal, TAGS.media], async (draft): Promise<Journal[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'journal',
    draft,
    depth: 1,
    limit: 50,
    overrideAccess: draft,
    sort: '-publishedAt',
    where: visible(draft),
  })
  return docs
})

export const getJournalEntry = cached(
  'journal-entry',
  [TAGS.journal, TAGS.media, TAGS.experiences],
  async (draft, slug: string): Promise<Journal | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'journal',
      draft,
      depth: 2,
      limit: 1,
      overrideAccess: draft,
      where: visible(draft, { slug: { equals: slug } }),
    })
    return docs[0] ?? null
  },
)
