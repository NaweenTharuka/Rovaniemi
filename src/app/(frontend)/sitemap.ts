import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/cms/client'
import { siteOrigin } from '@/lib/site'
import { pathFor } from '@/payload/preview'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const origin = siteOrigin(settings)
  const live = { _status: { equals: 'published' }, workflowStatus: { not_equals: 'archived' } } as const

  const [pages, experiences, journal] = await Promise.all([
    payload.find({ collection: 'pages', depth: 0, limit: 500, where: live, select: { slug: true, updatedAt: true, meta: true } }),
    payload.find({ collection: 'experiences', depth: 0, limit: 500, where: live, select: { slug: true, updatedAt: true, meta: true } }),
    payload.find({ collection: 'journal', depth: 0, limit: 500, where: live, select: { slug: true, updatedAt: true, meta: true } }),
  ])

  const entry = (collection: 'pages' | 'experiences' | 'journal', doc: { slug?: string | null; updatedAt: string; meta?: { noIndex?: boolean | null } | null }) =>
    doc.meta?.noIndex
      ? null
      : {
          url: `${origin}${pathFor(collection, doc.slug)}`,
          lastModified: new Date(doc.updatedAt),
          changeFrequency: collection === 'pages' ? ('monthly' as const) : ('weekly' as const),
          priority: doc.slug === 'home' ? 1 : collection === 'experiences' ? 0.9 : 0.6,
        }

  return [
    ...pages.docs.map((d) => entry('pages', d)),
    ...experiences.docs.map((d) => entry('experiences', d)),
    ...(journal.docs.length ? [{ url: `${origin}/journal`, lastModified: new Date() }] : []),
    ...journal.docs.map((d) => entry('journal', d)),
  ].filter((e): e is NonNullable<typeof e> => Boolean(e))
}
