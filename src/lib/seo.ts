import type { Metadata } from 'next'

import type { Media, SiteSetting } from '@/payload-types'

import { ogImageUrl } from './media'
import { brandName, siteOrigin } from './site'

type MetaGroup = {
  title?: string | null
  description?: string | null
  image?: number | string | Media | null
  ogTitle?: string | null
  ogDescription?: string | null
  twitterCard?: 'summary' | 'summary_large_image' | null
  canonicalUrl?: string | null
  noIndex?: boolean | null
}

type BuildMetadataArgs = {
  settings: SiteSetting
  path: string
  meta?: MetaGroup | null
  fallbackTitle?: string | null
  fallbackDescription?: string | null
  fallbackImage?: number | string | Media | null
  type?: 'website' | 'article'
}

const applyTemplate = (title: string, settings: SiteSetting) => {
  const template = settings.seo?.titleTemplate || `%s — ${brandName(settings)}`
  // Titles written in the SEO tab are used verbatim if they already contain the brand.
  if (title.toLowerCase().includes(brandName(settings).toLowerCase())) return title
  return template.includes('%s') ? template.replace('%s', title) : title
}

export const buildMetadata = ({
  settings,
  path,
  meta,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  type = 'website',
}: BuildMetadataArgs): Metadata => {
  const origin = siteOrigin(settings)
  const rawTitle = meta?.title || fallbackTitle
  const title = rawTitle
    ? applyTemplate(rawTitle, settings)
    : settings.seo?.defaultTitle || brandName(settings)
  const description = meta?.description || fallbackDescription || settings.seo?.defaultDescription || undefined
  const image =
    ogImageUrl(meta?.image ?? null, origin) ||
    ogImageUrl(fallbackImage ?? null, origin) ||
    ogImageUrl(settings.seo?.defaultOgImage ?? null, origin)
  const canonical = meta?.canonicalUrl || `${origin}${path === '/' ? '' : path}`
  const noIndex = Boolean(meta?.noIndex || settings.seo?.noIndexSite)

  return {
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type,
      url: canonical,
      siteName: brandName(settings),
      title: meta?.ogTitle || title,
      description: meta?.ogDescription || description,
      locale: 'en_GB',
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: meta?.twitterCard || 'summary_large_image',
      title: meta?.ogTitle || title,
      description: meta?.ogDescription || description,
      images: image ? [image] : undefined,
    },
  }
}
