import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

/** Cache tags shared between the CMS hooks and `src/lib/cms` queries. */
export const TAGS = {
  pages: 'cms:pages',
  experiences: 'cms:experiences',
  faqs: 'cms:faqs',
  testimonials: 'cms:testimonials',
  journal: 'cms:journal',
  navigation: 'cms:navigation',
  settings: 'cms:settings',
  media: 'cms:media',
} as const

type Tag = (typeof TAGS)[keyof typeof TAGS]

const revalidate = async (req: PayloadRequest, tags: Tag[]) => {
  // Seed scripts and CLI runs have no Next.js cache to revalidate.
  if (req.context?.disableRevalidate) return
  try {
    const { revalidateTag } = await import('next/cache')
    for (const tag of tags) revalidateTag(tag, 'max')
  } catch (error) {
    req.payload.logger.debug({ msg: 'Skipped revalidation outside Next.js', error })
  }
}

export const revalidateCollection =
  (...tags: Tag[]): CollectionAfterChangeHook =>
  async ({ doc, req }) => {
    await revalidate(req, tags)
    return doc
  }

export const revalidateCollectionDelete =
  (...tags: Tag[]): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    await revalidate(req, tags)
    return doc
  }

export const revalidateGlobal =
  (...tags: Tag[]): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    await revalidate(req, tags)
    return doc
  }
