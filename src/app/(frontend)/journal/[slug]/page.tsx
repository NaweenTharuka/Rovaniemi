import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Reveal, TextReveal } from '@/components/animations/reveal'
import { CmsImage } from '@/components/media/cms-image'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { RichText } from '@/components/rich-text/rich-text'
import { getJournalEntry, getSettings } from '@/lib/cms/queries'
import { asMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'
import { pathFor } from '@/payload/preview'

export const revalidate = 3600
export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [entry, settings] = await Promise.all([getJournalEntry(slug), getSettings()])
  if (!entry) return {}
  return buildMetadata({
    settings,
    path: pathFor('journal', slug),
    meta: entry.meta,
    fallbackTitle: entry.title,
    fallbackDescription: entry.excerpt,
    fallbackImage: entry.coverImage,
    type: 'article',
  })
}

export default async function JournalEntryPage({ params }: Props) {
  const { slug } = await params
  const entry = await getJournalEntry(slug)
  if (!entry) notFound()

  return (
    <article className="tone-snow bg-surface pb-[var(--hn-section)] text-fg">
      <header className="container-hn pt-[calc(var(--hn-header)+clamp(3rem,8vw,7rem))]">
        <Breadcrumbs
          className="mb-12"
          items={[
            { name: 'Home', path: '/' },
            { name: 'Journal', path: '/journal' },
            { name: entry.title, path: pathFor('journal', slug) },
          ]}
        />
        <TextReveal as="h1" text={entry.title} immediate className="max-w-5xl text-display-lg text-fg" />
        {entry.excerpt ? (
          <Reveal immediate delay={200}>
            <p className="mt-8 max-w-2xl text-lead text-fg-muted">{entry.excerpt}</p>
          </Reveal>
        ) : null}
      </header>
      {asMedia(entry.coverImage) ? (
        <div className="relative mt-16 aspect-[16/10] overflow-hidden lg:aspect-[21/9]">
          <CmsImage media={entry.coverImage} sizes="100vw" priority sourceWidth={2048} />
        </div>
      ) : null}
      <div className="container-hn mt-16 grid-hn">
        <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-3">
          <RichText data={entry.content} />
        </div>
      </div>
    </article>
  )
}
