import type { Experience, SiteSetting } from '@/payload-types'

import { toAbsoluteUrl } from './base-path'
import { mediaUrl } from './media'
import { pathFor } from '@/payload/preview'
import { brandName, siteOrigin } from './site'

type JsonLd = Record<string, unknown>

const absolute = (origin: string, url?: string | null) =>
  url ? toAbsoluteUrl(origin, url) : undefined

export const organizationJsonLd = (settings: SiteSetting): JsonLd => {
  const origin = siteOrigin(settings)
  const contact = settings.contact
  const sameAs = contact?.socialLinks?.map((s) => s.url).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${origin}/#organization`,
    name: brandName(settings),
    url: origin,
    logo: absolute(origin, mediaUrl(settings.branding?.logo, 480)),
    email: contact?.email || undefined,
    telephone: contact?.phone || contact?.whatsapp || undefined,
    address: contact?.location
      ? {
          '@type': 'PostalAddress',
          addressLocality: contact.location.split(',')[0]?.trim(),
          addressCountry: 'FI',
        }
      : undefined,
    areaServed: { '@type': 'Place', name: 'Finnish Lapland' },
    sameAs: sameAs?.length ? sameAs : undefined,
  }
}

/**
 * TouristTrip + Offer for an experience. Offers are only emitted when a real
 * price exists, so search engines never see invented values.
 */
export const experienceJsonLd = (experience: Experience, settings: SiteSetting): JsonLd => {
  const origin = siteOrigin(settings)
  const url = `${origin}${pathFor('experiences', experience.slug)}`
  const offers = [
    ...(experience.options ?? [])
      .filter((o) => typeof o.price === 'number')
      .map((o) => ({
        '@type': 'Offer',
        name: o.title,
        price: o.price,
        priceCurrency: 'EUR',
        url,
        availability: 'https://schema.org/InStock',
        eligibleQuantity: o.unit === 'group' ? { '@type': 'QuantitativeValue', unitText: 'group' } : undefined,
      })),
    ...(typeof experience.pricing?.fromPrice === 'number' && !experience.options?.length
      ? [
          {
            '@type': 'Offer',
            price: experience.pricing.fromPrice,
            priceCurrency: 'EUR',
            url,
            availability: 'https://schema.org/InStock',
          },
        ]
      : []),
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: experience.title,
    description: experience.shortDescription,
    url,
    image: absolute(origin, mediaUrl(experience.heroImage, 1200)),
    touristType: 'Small groups',
    itinerary: experience.location ? { '@type': 'Place', name: experience.location } : undefined,
    provider: { '@id': `${origin}/#organization` },
    offers: offers.length ? offers : undefined,
  }
}

export const breadcrumbJsonLd = (settings: SiteSetting, items: { name: string; path: string }[]): JsonLd => {
  const origin = siteOrigin(settings)
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  }
}

/** Serialises JSON-LD safely for a <script> tag (no `</script>` breakouts). */
export const serializeJsonLd = (data: JsonLd | JsonLd[]) =>
  JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
