import type { Experience, Page } from '@/payload-types'

import { pathFor } from '@/payload/preview'

export type CmsLink = {
  type?: 'reference' | 'custom' | null
  reference?:
    | { relationTo: 'pages'; value: Page | number | string }
    | { relationTo: 'experiences'; value: Experience | number | string }
    | null
  url?: string | null
  label?: string | null
  newTab?: boolean | null
  appearance?: 'primary' | 'secondary' | 'link' | null
}

export type ResolvedLink = {
  href: string
  label: string
  newTab: boolean
  external: boolean
  appearance: 'primary' | 'secondary' | 'link'
}

export const resolveLink = (link?: CmsLink | null): ResolvedLink | null => {
  if (!link) return null
  let href: string | null = null

  if (link.type === 'custom') {
    href = link.url || null
  } else if (link.reference && typeof link.reference.value === 'object' && link.reference.value) {
    const slug = (link.reference.value as { slug?: string | null }).slug
    href = pathFor(link.reference.relationTo, slug)
  }

  const label = link.label?.trim() || (link.reference && typeof link.reference.value === 'object'
    ? (link.reference.value as { title?: string }).title ?? ''
    : '')

  if (!href || !label) return null
  const external = /^https?:\/\//.test(href)
  return {
    href,
    label,
    newTab: Boolean(link.newTab),
    external,
    appearance: link.appearance ?? 'primary',
  }
}

export const bookingHref = (experience: Pick<Experience, 'slug' | 'booking'>, fallback = '/contact') => {
  if (experience.booking?.url) return experience.booking.url
  const base = fallback || '/contact'
  if (!base.startsWith('/')) return base
  const [path, query] = base.split('?')
  const params = new URLSearchParams(query)
  if (experience.slug) params.set('experience', experience.slug)
  return `${path}?${params.toString()}#enquiry`
}
