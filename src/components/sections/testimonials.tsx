import { HorizontalScroller } from '@/components/animations/horizontal-scroller'
import { Reveal, TextReveal } from '@/components/animations/reveal'
import { CmsImage } from '@/components/media/cms-image'
import { getTestimonials } from '@/lib/cms/queries'
import { asMedia } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { Testimonial, TestimonialsBlock as TestimonialsData } from '@/payload-types'

import { Section, SectionHeader } from './section'

const experienceTitle = (t: Testimonial) =>
  typeof t.experience === 'object' && t.experience ? t.experience.shortTitle || t.experience.title : null

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : null

function Stars({ rating }: { rating?: number | null }) {
  if (!rating) return null
  return (
    <p className="flex items-center gap-1 text-signal" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} aria-hidden="true" viewBox="0 0 12 12" className={cn('size-3', i >= rating && 'opacity-25')}>
          <path fill="currentColor" d="M6 .6l1.6 3.5 3.8.4-2.9 2.6.8 3.7L6 8.9 2.7 10.8l.8-3.7L.6 4.5l3.8-.4z" />
        </svg>
      ))}
    </p>
  )
}

function Attribution({ t }: { t: Testimonial }) {
  const meta = [t.customerLocation, experienceTitle(t), formatDate(t.date)].filter(Boolean).join(' · ')
  return (
    <figcaption className="flex items-center gap-4">
      {asMedia(t.profileImage) ? (
        <span className="relative size-12 shrink-0 overflow-hidden rounded-full">
          <CmsImage media={t.profileImage} sizes="48px" sourceWidth={480} alt="" />
        </span>
      ) : (
        <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
      )}
      <span>
        <span className="block text-fg">{t.customerName}</span>
        {meta ? <span className="label mt-1 block text-fg-muted">{meta}</span> : null}
      </span>
    </figcaption>
  )
}

/** Renders a list of testimonials in one of three editorial styles. Used by the block and experience pages. */
export function TestimonialList({
  testimonials,
  style,
  header,
  label,
}: {
  testimonials: Testimonial[]
  style: 'editorial' | 'carousel' | 'minimal'
  header?: React.ReactNode
  label: string
}) {
  if (!testimonials.length) return null

  if (style === 'carousel') {
    return (
      <HorizontalScroller header={header} label={label} pin={false}>
        {testimonials.map((t) => (
          <figure key={t.id} className="flex w-[82vw] flex-col justify-between gap-10 border-t border-rule pt-8 sm:w-[28rem]">
            <div>
              <Stars rating={t.rating} />
              {t.headline ? <p className="mt-6 font-display text-title text-fg">“{t.headline}”</p> : null}
              <blockquote className="mt-4 text-fg-muted">
                <p>{t.quote}</p>
              </blockquote>
            </div>
            <Attribution t={t} />
          </figure>
        ))}
      </HorizontalScroller>
    )
  }

  if (style === 'minimal') {
    return (
      <>
        {header}
        <ul className="container-hn grid gap-x-[var(--hn-gutter)] gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 60}>
              <figure className="border-t border-rule pt-6">
                <Stars rating={t.rating} />
                <blockquote className="mt-4">
                  <p className="text-lead text-fg">“{t.headline || t.quote}”</p>
                  {t.headline ? <p className="mt-3 text-fg-muted">{t.quote}</p> : null}
                </blockquote>
                <div className="mt-6">
                  <Attribution t={t} />
                </div>
              </figure>
            </Reveal>
          ))}
        </ul>
      </>
    )
  }

  const [lead, ...rest] = testimonials
  return (
    <>
      {header}
      <figure className="container-hn grid-hn gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-10 lg:col-start-2">
          <Stars rating={lead.rating} />
          <blockquote className="mt-8">
            <TextReveal as="p" text={`“${lead.headline || lead.quote}”`} className="font-display text-display-lg text-fg" />
            {lead.headline ? (
              <Reveal delay={150}>
                <p className="mt-8 max-w-2xl text-lead text-fg-muted">{lead.quote}</p>
              </Reveal>
            ) : null}
          </blockquote>
          <Reveal delay={250} className="mt-10">
            <Attribution t={lead} />
          </Reveal>
        </div>
      </figure>
      {rest.length ? (
        <ul className="container-hn mt-20 grid gap-x-[var(--hn-gutter)] gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 60}>
              <figure className="border-t border-rule pt-6">
                <blockquote>
                  <p className="text-fg">“{t.headline || t.quote}”</p>
                </blockquote>
                <div className="mt-5">
                  <Attribution t={t} />
                </div>
              </figure>
            </Reveal>
          ))}
        </ul>
      ) : null}
    </>
  )
}

export async function TestimonialsBlock({ block }: { block: TestimonialsData }) {
  const experienceId =
    block.source === 'experience' && block.experience
      ? typeof block.experience === 'object'
        ? block.experience.id
        : block.experience
      : undefined
  const ids =
    block.source === 'manual' ? (block.testimonials ?? []).map((t) => (typeof t === 'object' ? t.id : t)) : undefined

  const testimonials = await getTestimonials({
    featured: block.source === 'featured',
    experienceId,
    ids,
    limit: block.limit ?? 6,
  })

  // Nothing published yet → the section simply does not appear.
  if (!testimonials.length) return null

  const style = block.style ?? 'editorial'
  const header = (
    <SectionHeader
      label={block.sectionLabel}
      eyebrow={block.eyebrow}
      heading={block.heading}
      className={style === 'carousel' ? 'px-0!' : 'mb-14 md:mb-20'}
      size="md"
    />
  )

  return (
    <Section settings={block}>
      <TestimonialList
        testimonials={testimonials}
        style={style}
        header={header}
        label={block.heading?.replace(/\n/g, ' ') || 'Guest testimonials'}
      />
    </Section>
  )
}
