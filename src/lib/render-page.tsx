import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/sections/render-blocks'
import { getPageBySlug, getSettings } from '@/lib/cms/queries'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, serializeJsonLd } from '@/lib/structured-data'
import { pathFor } from '@/payload/preview'

export async function pageMetadata(slug: string): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPageBySlug(slug), getSettings()])
  if (!page) return {}
  const hero = page.layout?.find((b) => b.blockType === 'hero')
  return buildMetadata({
    settings,
    path: pathFor('pages', slug),
    meta: page.meta,
    fallbackTitle: slug === 'home' ? null : page.title,
    fallbackImage: hero && 'image' in hero ? hero.image : null,
  })
}

/** Renders a block-composed CMS page. Used by every page route except experience detail. */
export async function CmsPage({ slug }: { slug: string }) {
  const [page, settings] = await Promise.all([getPageBySlug(slug), getSettings()])
  if (!page) notFound()

  const crumbs =
    slug === 'home'
      ? null
      : [
          { name: 'Home', path: '/' },
          { name: page.breadcrumbLabel || page.title, path: pathFor('pages', slug) },
        ]

  return (
    <>
      {crumbs ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd(settings, crumbs)) }} />
      ) : null}
      <RenderBlocks blocks={page.layout} settings={settings} />
    </>
  )
}
