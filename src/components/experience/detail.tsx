import Link from 'next/link'

import { Parallax } from '@/components/animations/parallax'
import { Reveal, TextReveal } from '@/components/animations/reveal'
import { AmbientVideo } from '@/components/media/ambient-video'
import { CmsImage } from '@/components/media/cms-image'
import { Breadcrumbs, type Crumb } from '@/components/navigation/breadcrumbs'
import { hasRichText, RichText } from '@/components/rich-text/rich-text'
import { Arrow, buttonVariants } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/primitives'
import { asMedia, isVideo, mediaUrl } from '@/lib/media'
import { cn, formatEuro, pad, priceLabel, priceUnitLabel, whatsappHref } from '@/lib/utils'
import type { Experience, SiteSetting } from '@/payload-types'
import { pathFor } from '@/payload/preview'

import { experienceFacts } from './facts'

type Props = { experience: Experience }

export function ExperienceHero({ experience, index, crumbs }: Props & { index: number; crumbs: Crumb[] }) {
  const video = asMedia(experience.heroVideo)
  const facts = experienceFacts(experience).filter((f) => ['duration', 'group', 'price', 'location'].includes(f.key))

  return (
    <section data-hero-overlay="" className="tone-ink grain relative flex min-h-[92svh] flex-col overflow-hidden bg-surface text-fg lg:min-h-[100svh]">
      <div className="absolute inset-0">
        <Parallax amount={8}>
          <div className="hero-settle absolute inset-0">
            <CmsImage media={experience.heroImage} sizes="100vw" priority sourceWidth={2880} />
            {video && isVideo(video) && video.url ? (
              <AmbientVideo src={mediaUrl(video)!} type={video.mimeType ?? undefined} poster={mediaUrl(experience.heroImage, 1440)} />
            ) : null}
          </div>
        </Parallax>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/40" />
      </div>

      <div className="container-hn relative z-10 flex flex-1 flex-col pb-8 pt-[calc(var(--hn-header)+1.5rem)] md:pb-10">
        <Reveal immediate delay={150}>
          <Breadcrumbs items={crumbs} />
        </Reveal>

        <div className="mt-auto">
          <Reveal immediate delay={250} className="mb-6">
            <SectionLabel index={index}>{experience.eyebrow || 'Experience'}</SectionLabel>
          </Reveal>
          <TextReveal as="h1" text={experience.title} immediate delay={300} className="max-w-6xl text-display-xl text-fg" />
          {experience.tagline ? (
            <Reveal immediate delay={600}>
              <p className="mt-6 max-w-2xl text-lead text-snow/85">{experience.tagline}</p>
            </Reveal>
          ) : null}

          {facts.length ? (
            <Reveal immediate delay={750} as="dl" className="mt-10 grid grid-cols-2 border-t border-rule md:mt-14 md:grid-cols-4">
              {facts.map((fact, i) => (
                <div key={fact.key} className={cn('py-5 pr-4', i % 2 === 1 && 'pl-4 md:pl-6', i >= 2 && 'border-t border-rule md:border-t-0', i > 0 && 'md:border-l md:border-rule md:pl-6')}>
                  <dt className="label text-fg-muted">{fact.label}</dt>
                  <dd className="numeral mt-2 text-fg">{fact.value}</dd>
                </div>
              ))}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function ExperienceIntro({ experience, settings, bookHref }: Props & { settings: SiteSetting; bookHref: string }) {
  const facts = experienceFacts(experience)
  const wa = whatsappHref(settings.contact?.whatsapp, `Hi HEADING NORTH, I have a question about ${experience.title}.`)
  const bookLabel = experience.booking?.label || settings.booking?.bookLabel || 'Book now'

  return (
    <section id="overview" className="tone-snow section-y bg-surface text-fg" aria-labelledby="overview-title">
      <div className="container-hn grid-hn gap-y-14">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <SectionLabel index="01" className="mb-8">
            <span id="overview-title">Overview</span>
          </SectionLabel>
          <Reveal>
            {hasRichText(experience.description) ? (
              <RichText data={experience.description} lead className="max-w-[34ch] [&_p:first-child]:font-display [&_p:first-child]:text-title [&_p:first-child]:leading-[1.35] [&_p:first-child]:text-fg" />
            ) : (
              <p className="font-display text-display-md text-fg">{experience.shortDescription}</p>
            )}
          </Reveal>
        </div>

        <aside className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9" aria-label="Quick facts">
          <div className="border border-rule p-6 md:p-8 lg:sticky lg:top-[calc(var(--hn-header)+2rem)]">
            <p className="label text-fg-muted">Quick facts</p>
            {experience.pricing && priceLabel(experience.pricing) ? (
              <p className="mt-6 font-display text-display-md text-fg">
                {experience.pricing.displayLabel || (
                  <>
                    <span className="text-lead text-fg-muted">From </span>
                    <span className="numeral">{formatEuro(experience.pricing.fromPrice)}</span>
                    <span className="text-lead text-fg-muted"> {priceUnitLabel(experience.pricing.unit)}</span>
                  </>
                )}
              </p>
            ) : null}
            <dl className="mt-6 divide-y divide-[var(--rule)] border-t border-rule">
              {facts
                .filter((f) => f.key !== 'price')
                .map((fact) => (
                  <div key={fact.key} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5 text-sm">
                    <dt className="label pt-0.5 text-fg-muted">{fact.label}</dt>
                    <dd className="text-fg">{fact.value}</dd>
                  </div>
                ))}
            </dl>
            <div className="mt-8 grid gap-3">
              <Link href={bookHref} className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
                {bookLabel}
                <Arrow />
              </Link>
              {wa ? (
                <a href={wa} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'w-full')}>
                  {settings.booking?.whatsappLabel || 'Message on WhatsApp'}
                  <span className="sr-only">(opens WhatsApp)</span>
                </a>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export function ExperienceStory({ experience }: Props) {
  const story = experience.story
  if (!story?.heading && !hasRichText(story?.body)) return null
  return (
    <section className="tone-snow bg-surface pb-[var(--hn-section)] text-fg">
      <div className="container-hn grid-hn items-center gap-y-12">
        {asMedia(story?.image) ? (
          <Reveal className="relative col-span-4 aspect-[4/5] overflow-hidden md:col-span-8 lg:col-span-6">
            <Parallax amount={6}>
              <CmsImage media={story?.image} sizes="(min-width: 64rem) 50vw, 100vw" sourceWidth={1440} />
            </Parallax>
          </Reveal>
        ) : null}
        <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
          <TextReveal text={story?.heading} className="text-display-md text-fg" />
          <Reveal delay={120} className="mt-8">
            <RichText data={story?.body} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function ExperienceHighlights({ experience }: Props) {
  if (!experience.highlights?.length) return null
  return (
    <section className="tone-ink grain section-y bg-surface text-fg" aria-labelledby="highlights-title">
      <div className="container-hn relative z-10">
        <SectionLabel as="h2" className="mb-12 border-t border-rule pt-5">
          <span id="highlights-title">Highlights</span>
        </SectionLabel>
        <ol className="grid gap-x-[var(--hn-gutter)] gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {experience.highlights.map((h, i) => (
            <Reveal as="li" key={h.id ?? i} delay={i * 70} className="border-t border-rule pt-6">
              <span className="label numeral text-signal">{pad(i + 1)}</span>
              <h3 className="mt-4 text-title text-fg">{h.title}</h3>
              {h.text ? <p className="mt-3 text-fg-muted">{h.text}</p> : null}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function ExperienceOptions({ experience, bookHref }: Props & { bookHref: string }) {
  if (!experience.options?.length) return null
  const withOption = (title: string) => {
    if (!bookHref.startsWith('/')) return bookHref
    const [base, hash] = bookHref.split('#')
    const url = new URL(base, 'http://x')
    url.searchParams.set('option', title)
    return `${url.pathname}${url.search}${hash ? `#${hash}` : ''}`
  }

  return (
    <section className="tone-snow section-y bg-surface text-fg" aria-labelledby="options-title">
      <div className="container-hn">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-t border-rule pt-5">
          <SectionLabel index="02">Options</SectionLabel>
        </div>
        <h2 id="options-title" className="mb-14 max-w-4xl text-display-lg text-fg">
          Choose your journey
        </h2>
        <ol>
          {experience.options.map((option, i) => (
            <Reveal as="li" key={option.id ?? i} delay={i * 60} className="grid-hn items-start gap-y-6 border-t border-rule py-10 last:border-b">
              <span className="label numeral col-span-4 text-signal md:col-span-1">{pad(i + 1)}</span>
              <div className="col-span-4 md:col-span-7 lg:col-span-6">
                <h3 className="text-display-md text-fg">{option.title}</h3>
                {option.description ? <p className="mt-4 max-w-2xl text-fg-muted">{option.description}</p> : null}
              </div>
              <div className="col-span-4 flex flex-col gap-5 md:col-span-8 md:col-start-2 md:flex-row md:items-end md:justify-between lg:col-span-5 lg:col-start-8 lg:items-end">
                <div>
                  {typeof option.price === 'number' ? (
                    <p className="font-display text-display-md text-fg">
                      <span className="numeral">{formatEuro(option.price)}</span>
                      <span className="ml-2 text-body text-fg-muted">{priceUnitLabel(option.unit)}</span>
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm text-fg-muted">{[option.capacity, option.duration].filter(Boolean).join(' · ')}</p>
                </div>
                <Link href={withOption(option.title)} className={buttonVariants({ variant: 'secondary' })}>
                  Enquire
                  <Arrow />
                </Link>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function ExperienceItinerary({ experience }: Props) {
  if (!experience.itinerary?.length) return null
  return (
    <section className="tone-snow section-y bg-surface text-fg" aria-labelledby="itinerary-title">
      <div className="container-hn grid-hn gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <SectionLabel className="mb-8">Itinerary</SectionLabel>
          <h2 id="itinerary-title" className="text-display-md text-fg lg:sticky lg:top-[calc(var(--hn-header)+2rem)]">
            How the experience unfolds
          </h2>
        </div>
        <ol className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
          {experience.itinerary.map((step, i) => (
            <Reveal as="li" key={step.id ?? i} delay={i * 50} className="relative grid grid-cols-[5rem_1fr] gap-4 border-t border-rule py-7">
              <span className="label numeral pt-1.5 text-signal">{step.time || pad(i + 1)}</span>
              <div>
                <h3 className="text-title text-fg">{step.title}</h3>
                {step.description ? <p className="mt-2 text-fg-muted">{step.description}</p> : null}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ListColumn({ title, items, marker }: { title: string; items?: { text: string; id?: string | null }[] | null; marker: 'plus' | 'minus' | 'dot' }) {
  if (!items?.length) return null
  return (
    <div>
      <h3 className="label mb-4 text-fg-muted">{title}</h3>
      <ul className="border-t border-rule">
        {items.map((item, i) => (
          <li key={item.id ?? i} className="flex gap-4 border-b border-rule py-3.5 text-fg">
            <span aria-hidden="true" className="w-4 shrink-0 pt-0.5 text-signal">
              {marker === 'plus' ? '+' : marker === 'minus' ? '–' : '·'}
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ExperienceInclusions({ experience }: Props) {
  const has = experience.included?.length || experience.notIncluded?.length || experience.whatToBring?.length
  if (!has) return null
  return (
    <section className="tone-snow section-y bg-surface text-fg" aria-labelledby="details-title">
      <div className="container-hn">
        <SectionLabel className="mb-8 border-t border-rule pt-5">Details</SectionLabel>
        <h2 id="details-title" className="mb-14 max-w-3xl text-display-lg text-fg">
          Everything you need to know
        </h2>
        <div className="grid gap-x-[var(--hn-gutter)] gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <ListColumn title="What's included" items={experience.included} marker="plus" />
          </Reveal>
          <Reveal delay={80}>
            <ListColumn title="Not included" items={experience.notIncluded} marker="minus" />
          </Reveal>
          <Reveal delay={160}>
            <ListColumn title="What to bring" items={experience.whatToBring} marker="dot" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function ExperiencePickupPrice({ experience, bookHref, bookLabel }: Props & { bookHref: string; bookLabel: string }) {
  const price = priceLabel(experience.pricing)
  const pickup = experience.pickup
  if (!price && !pickup?.summary && !pickup?.details) return null

  return (
    <section className="tone-ink grain section-y bg-surface text-fg" aria-label="Pickup and price">
      <div className="container-hn relative z-10 grid gap-y-16 lg:grid-cols-2 lg:gap-x-[var(--hn-gutter)]">
        {pickup?.summary || pickup?.details ? (
          <Reveal className="lg:border-r lg:border-rule lg:pr-16">
            <SectionLabel className="mb-8">Pickup</SectionLabel>
            {pickup.summary ? <h2 className="text-display-md text-fg">{pickup.summary}</h2> : null}
            {pickup.details ? <p className="mt-6 max-w-xl text-fg-muted">{pickup.details}</p> : null}
            <Link href="/faq" className="group/link label mt-8 inline-flex items-center gap-3 text-fg">
              Pickup questions <Arrow />
            </Link>
          </Reveal>
        ) : null}
        {price ? (
          <Reveal delay={120} className="lg:pl-16">
            <SectionLabel className="mb-8">Price</SectionLabel>
            <p className="font-display text-display-lg text-fg">{price}</p>
            {experience.pricing?.note ? <p className="mt-6 max-w-xl text-fg-muted">{experience.pricing.note}</p> : null}
            <Link href={bookHref} className={cn(buttonVariants({ size: 'lg' }), 'mt-10')}>
              {bookLabel}
              <Arrow />
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

export function ExperienceNotices({ experience }: Props) {
  if (!experience.notices?.length) return null
  return (
    <section className="tone-snow section-y bg-surface text-fg" aria-labelledby="notices-title">
      <div className="container-hn grid-hn gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <SectionLabel className="mb-8">Before you go</SectionLabel>
          <h2 id="notices-title" className="text-display-md text-fg">
            Important information
          </h2>
        </div>
        <div className="col-span-4 grid gap-6 md:col-span-8 lg:col-span-7 lg:col-start-6">
          {experience.notices.map((notice, i) => (
            <Reveal
              key={notice.id ?? i}
              delay={i * 60}
              className={cn('border-l-2 py-1 pl-6', notice.tone === 'important' ? 'border-fg' : 'border-rule')}
            >
              <h3 className="flex items-center gap-3 text-title text-fg">
                {notice.tone === 'important' ? <span className="label rounded-full border border-fg px-2.5 py-1 text-[0.625rem]">Important</span> : null}
                {notice.title}
              </h3>
              <p className="mt-3 text-fg-muted">{notice.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ExperienceBookingCta({
  experience,
  settings,
  bookHref,
  bookLabel,
}: Props & { settings: SiteSetting; bookHref: string; bookLabel: string }) {
  const wa = whatsappHref(settings.contact?.whatsapp, `Hi HEADING NORTH, I'm interested in ${experience.title}.`)
  return (
    <section id="book" className="tone-ink relative overflow-hidden bg-surface text-fg" aria-labelledby="book-title">
      <div className="absolute inset-0">
        <Parallax amount={8}>
          <CmsImage media={experience.heroImage} sizes="100vw" sourceWidth={2048} />
        </Parallax>
        <div aria-hidden="true" className="absolute inset-0 bg-ink/70" />
      </div>
      <div className="container-hn relative z-10 py-[clamp(7rem,16vw,14rem)]">
        <SectionLabel className="mb-10 border-t border-rule pt-5">Book</SectionLabel>
        <TextReveal
          as="h2"
          id="book-title"
          text={experience.booking?.ctaHeading || `Ready for ${experience.shortTitle || experience.title}?`}
          className="max-w-6xl text-display-xl text-fg"
        />
        <div className="mt-12 grid-hn gap-y-8">
          {experience.booking?.ctaBody ? (
            <Reveal delay={150} className="col-span-4 md:col-span-5">
              <p className="text-lead text-fg-muted">{experience.booking.ctaBody}</p>
            </Reveal>
          ) : null}
          <Reveal delay={250} className="col-span-4 flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-8 lg:col-span-6 lg:col-start-7 lg:justify-end">
            <Link href={bookHref} className={buttonVariants({ size: 'lg' })}>
              {bookLabel}
              <Arrow />
            </Link>
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="group/button label inline-flex items-center gap-3 text-fg">
                {settings.booking?.whatsappLabel || 'WhatsApp'}
                <Arrow direction="up-right" />
                <span className="sr-only">(opens WhatsApp)</span>
              </a>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function RelatedExperiences({ experiences }: { experiences: Experience[] }) {
  if (!experiences.length) return null
  return (
    <section className="tone-snow section-y bg-surface text-fg" aria-labelledby="related-title">
      <div className="container-hn">
        <div className="mb-12 flex items-end justify-between gap-6 border-t border-rule pt-5">
          <SectionLabel>Continue exploring</SectionLabel>
          <Link href="/experiences" className="group/link label hidden items-center gap-3 sm:inline-flex">
            All experiences <Arrow />
          </Link>
        </div>
        <h2 id="related-title" className="sr-only">
          Related experiences
        </h2>
        <ul className="grid gap-x-[var(--hn-gutter)] gap-y-12 md:grid-cols-3">
          {experiences.slice(0, 3).map((e, i) => (
            <Reveal as="li" key={e.id} delay={i * 80}>
              <Link href={pathFor('experiences', e.slug)} className="group/link block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <CmsImage
                    media={e.heroImage}
                    sizes="(min-width: 48rem) 33vw, 100vw"
                    sourceWidth={960}
                    imgClassName="transition-transform duration-[1.2s] ease-expo group-hover/link:scale-105"
                  />
                </div>
                <h3 className="mt-5 flex items-center justify-between gap-4 text-title text-fg">
                  {e.title}
                  <Arrow />
                </h3>
                <p className="numeral mt-2 text-sm text-fg-muted">{[e.duration, priceLabel(e.pricing)].filter(Boolean).join(' · ')}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
