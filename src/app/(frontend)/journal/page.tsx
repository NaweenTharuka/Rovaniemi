import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Reveal, TextReveal } from '@/components/animations/reveal'
import { CmsImage } from '@/components/media/cms-image'
import { Arrow } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/primitives'
import { getJournalEntries, getSettings } from '@/lib/cms/queries'
import { buildMetadata } from '@/lib/seo'
import { pathFor } from '@/payload/preview'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return buildMetadata({ settings, path: '/journal', fallbackTitle: 'Journal' })
}

/** Future-ready: the journal stays unreachable (404) until the first entry is published. */
export default async function JournalIndex() {
  const entries = await getJournalEntries()
  if (!entries.length) notFound()

  return (
    <section className="tone-snow bg-surface pb-[var(--hn-section)] pt-[calc(var(--hn-header)+clamp(3rem,9vw,8rem))] text-fg">
      <div className="container-hn">
        <SectionLabel className="mb-10 border-t border-rule pt-5">Journal</SectionLabel>
        <TextReveal as="h1" text="Notes from the North" immediate className="max-w-5xl text-display-xl text-fg" />
        <ul className="mt-20 grid gap-x-[var(--hn-gutter)] gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry, i) => (
            <Reveal as="li" key={entry.id} delay={i * 60}>
              <Link href={pathFor('journal', entry.slug)} className="group/link block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <CmsImage media={entry.coverImage} sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw" sourceWidth={960} imgClassName="transition-transform duration-[1.2s] ease-expo group-hover/link:scale-105" />
                </div>
                {entry.publishedAt ? (
                  <p className="label mt-5 text-fg-muted">
                    {new Date(entry.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                ) : null}
                <h2 className="mt-3 flex items-start justify-between gap-4 text-title text-fg">
                  {entry.title}
                  <Arrow className="mt-2" />
                </h2>
                {entry.excerpt ? <p className="mt-3 text-fg-muted">{entry.excerpt}</p> : null}
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
