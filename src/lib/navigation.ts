import type { HeaderData, NavLink } from '@/components/navigation/types'
import type { Navigation, SiteSetting } from '@/payload-types'

import { type CmsLink, resolveLink } from './links'
import { mediaUrl } from './media'
import { brandName } from './site'
import { whatsappHref } from './utils'

const toNavLink = (link: unknown, description?: string | null): NavLink | null => {
  const resolved = resolveLink(link as CmsLink | null | undefined)
  if (!resolved) return null
  return {
    href: resolved.href,
    label: resolved.label,
    external: resolved.external,
    newTab: resolved.newTab,
    description: description ?? null,
  }
}

/** Flattens CMS navigation into plain serialisable props for the client header. */
export const buildHeaderData = (navigation: Navigation, settings: SiteSetting): HeaderData => {
  const items = (navigation.header?.items ?? [])
    .filter((item) => !item.hidden)
    .map((item): NavLink | null => {
      const link = toNavLink(item.link)
      if (!link) return null
      const children = (item.children ?? [])
        .filter((c) => !c.hidden)
        .map((c) => toNavLink(c.link, c.description))
        .filter((c): c is NavLink => Boolean(c))
      return { ...link, children }
    })
    .filter((i): i is NavLink => Boolean(i))

  const ctaEnabled = navigation.header?.cta?.enabled !== false
  const cta = ctaEnabled ? toNavLink(navigation.header?.cta?.link) : null

  return {
    brandName: brandName(settings),
    logoVariant: navigation.header?.logoVariant ?? 'auto',
    logoLight: mediaUrl(settings.branding?.logoLight, 480),
    logoDark: mediaUrl(settings.branding?.logoDark ?? settings.branding?.logo, 480),
    items,
    cta,
    contact: {
      email: settings.contact?.email,
      whatsapp: settings.contact?.whatsapp,
      whatsappHref: whatsappHref(settings.contact?.whatsapp),
      location: settings.contact?.location,
    },
  }
}
