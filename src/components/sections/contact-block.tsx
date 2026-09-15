import { Suspense } from 'react'

import { Reveal } from '@/components/animations/reveal'
import { Skeleton } from '@/components/ui/primitives'
import { getExperiences, getSettings } from '@/lib/cms/queries'
import { cn, whatsappHref } from '@/lib/utils'
import type { ContactFormBlock as ContactData } from '@/payload-types'

import { ContactForm } from './contact-form'
import { MapEmbed } from './map-embed'
import { Section, SectionHeader } from './section'

function FormSkeleton() {
  return (
    <div className="grid gap-9" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-14" />
      ))}
    </div>
  )
}

export async function ContactFormBlock({ block }: { block: ContactData }) {
  const [experiences, settings] = await Promise.all([getExperiences(), getSettings()])
  const contact = settings.contact
  const wa = whatsappHref(contact?.whatsapp)

  const channels = [
    contact?.email ? { label: 'Email', value: contact.email, href: `mailto:${contact.email}` } : null,
    wa ? { label: 'WhatsApp', value: contact?.whatsapp ?? '', href: wa, external: true } : null,
    contact?.phone ? { label: 'Phone', value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` } : null,
  ].filter(Boolean) as { label: string; value: string; href: string; external?: boolean }[]

  return (
    <Section settings={block}>
      <SectionHeader label={block.sectionLabel} eyebrow={block.eyebrow} heading={block.heading} size="md" className="mb-14 md:mb-20" />

      <div className="container-hn grid-hn gap-y-16">
        <div className="col-span-4 md:col-span-8 lg:col-span-5">
          {block.intro ? (
            <Reveal>
              <p className="text-lead text-fg-muted">{block.intro}</p>
            </Reveal>
          ) : null}

          {block.showDirectContacts && channels.length ? (
            <Reveal delay={100} as="dl" className="mt-12 grid gap-8">
              {channels.map((c) => (
                <div key={c.label} className="border-t border-rule pt-5">
                  <dt className="label text-fg-muted">{c.label}</dt>
                  <dd className="mt-3">
                    <a
                      href={c.href}
                      className="link-underline font-display text-title text-fg break-all"
                      target={c.external ? '_blank' : undefined}
                      rel={c.external ? 'noopener noreferrer' : undefined}
                    >
                      {c.value}
                    </a>
                  </dd>
                </div>
              ))}
              {contact?.location ? (
                <div className="border-t border-rule pt-5">
                  <dt className="label text-fg-muted">Based in</dt>
                  <dd className="mt-3 font-display text-title text-fg">{contact.location}</dd>
                </div>
              ) : null}
            </Reveal>
          ) : null}

          {block.pickupNote || contact?.pickupSummary ? (
            <Reveal delay={160} className="mt-12 border-l border-rule pl-5">
              <p className="label text-fg-muted">Pickup</p>
              <p className="mt-3 text-fg-muted">{block.pickupNote || contact?.pickupSummary}</p>
            </Reveal>
          ) : null}
        </div>

        <div id="enquiry" className={cn('col-span-4 scroll-mt-[calc(var(--hn-header)+2rem)] md:col-span-8 lg:col-span-6 lg:col-start-7')}>
          <Suspense fallback={<FormSkeleton />}>
            <ContactForm
              experiences={experiences.map((e) => ({ value: e.slug!, label: e.title }))}
              heading={block.formHeading}
              submitLabel={block.submitLabel}
              successMessage={block.successMessage}
              privacyHref="/privacy"
            />
          </Suspense>
        </div>
      </div>

      {block.showMap && (contact?.mapQuery || contact?.location) ? (
        <div className="container-hn mt-24">
          <MapEmbed query={contact?.mapQuery || contact?.location || ''} externalUrl={contact?.googleMapsUrl} />
        </div>
      ) : null}
    </Section>
  )
}
