import type { MetadataRoute } from 'next'

import { getSettings } from '@/lib/cms/queries'
import { siteOrigin } from '@/lib/site'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings()
  const origin = siteOrigin(settings)
  if (settings.seo?.noIndexSite) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/next'] },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  }
}
