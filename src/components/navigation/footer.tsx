import Link from 'next/link'

import { Arrow } from '@/components/ui/button'
import { resolveLink } from '@/lib/links'
import { brandName } from '@/lib/site'
import { splitLines, whatsappHref } from '@/lib/utils'
import type { Navigation, SiteSetting } from '@/payload-types'

import { SOCIAL_PLATFORMS } from '@/payload/globals/SiteSettings'

import { BrandMark } from './brand-mark'

const socialLabel = (platform: string) => SOCIAL_PLATFORMS.find((p) => p.value === platform)?.label ?? platform

export function Footer({ navigation, settings }: { navigation: Navigation; settings: SiteSetting }) {
  const name = brandName(settings)
  const contact = settings.contact
  const finalCta = resolveLink(navigation.footer?.finalCta?.link)
  const wa = whatsappHref(contact?.whatsapp)
  const year = new Date().getFullYear()
  const copyright = (settings.footer?.copyright || `© {year} ${name}`).replace('{year}', String(year))
  const socials = contact?.socialLinks?.filter((s) => s.url) ?? []

  return (
    <footer className="tone-ink grain relative overflow-hidden bg-surface text-fg">
      <div className="relative z-10">
        {finalCta && navigation.footer?.finalCta?.heading ? (
          <div className="container-hn border-b border-rule pb-16 pt-24 md:pb-24 md:pt-36">
            <Link href={finalCta.href} className="group/link block">
              <span className="label mb-6 block text-fg-muted">{finalCta.label}</span>
              <span className="flex items-end justify-between gap-6">
                <span className="font-display text-display-xl text-fg">
                  {splitLines(navigation.footer.finalCta.heading).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
                <span className="mb-4 inline-flex size-16 shrink-0 items-center justify-center rounded-full border border-rule transition-colors duration-500 group-hover/link:border-aurora group-hover/link:bg-aurora group-hover/link:text-ink md:size-24">
                  <Arrow className="w-8" />
                </span>
              </span>
            </Link>
          </div>
        ) : null}

        <div className="container-hn grid-hn gap-y-12 py-16 md:py-20">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <p className="font-display text-title text-fg">{settings.footer?.statement || settings.branding?.tagline}</p>
            <dl className="mt-8 grid gap-3 text-sm">
              {contact?.email ? (
                <div>
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a className="link-underline" href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {wa ? (
                <div>
                  <dt className="sr-only">WhatsApp</dt>
                  <dd>
                    <a className="link-underline" href={wa} target="_blank" rel="noopener noreferrer">
                      WhatsApp {contact?.whatsapp}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contact?.phone ? (
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a className="link-underline" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                      {contact.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contact?.location ? (
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd className="text-fg-muted">{contact.location}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          {navigation.footer?.columns?.map((column) => {
            const links = (column.links ?? []).filter((l) => !l.hidden).map((l) => resolveLink(l.link)).filter(Boolean)
            if (!links.length) return null
            return (
              <nav
                key={column.id ?? column.title}
                aria-label={column.title}
                className="col-span-2 md:col-span-2 lg:col-span-2 lg:col-start-auto"
              >
                <h2 className="label mb-5 text-fg-muted">{column.title}</h2>
                <ul className="grid gap-2.5">
                  {links.map((link) => (
                    <li key={link!.href}>
                      {link!.external ? (
                        <a href={link!.href} className="link-underline" target={link!.newTab ? '_blank' : undefined} rel={link!.newTab ? 'noopener noreferrer' : undefined}>
                          {link!.label}
                        </a>
                      ) : (
                        <Link href={link!.href} className="link-underline">
                          {link!.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            )
          })}

          {socials.length ? (
            <nav aria-label="Social media" className="col-span-2 md:col-span-2">
              <h2 className="label mb-5 text-fg-muted">Follow</h2>
              <ul className="grid gap-2.5">
                {socials.map((s) => (
                  <li key={s.id ?? s.url}>
                    <a href={s.url} className="link-underline" target="_blank" rel="noopener noreferrer">
                      {socialLabel(s.platform)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>

        <div className="container-hn">
          <p
            aria-hidden="true"
            className="select-none overflow-hidden whitespace-nowrap font-display text-[clamp(2.5rem,11vw,13rem)] leading-[0.78] font-semibold tracking-[-0.05em] text-fg/[0.07]"
          >
            {name}
          </p>
        </div>

        <div className="container-hn flex flex-col gap-3 border-t border-rule py-6 text-xs text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3">
            <BrandMark className="size-4" />
            {copyright}
          </p>
          <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/photo-credits" className="link-underline hover:text-fg">
              Photo credits
            </Link>
            {contact?.businessId ? <span>Business ID {contact.businessId}</span> : null}
          </p>
        </div>
      </div>
    </footer>
  )
}
