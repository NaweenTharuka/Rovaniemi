import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BookingBar } from '@/components/experience/booking-bar'
import {
  ExperienceBookingCta,
  ExperienceHero,
  ExperienceHighlights,
  ExperienceInclusions,
  ExperienceIntro,
  ExperienceItinerary,
  ExperienceNotices,
  ExperienceOptions,
  ExperiencePickupPrice,
  ExperienceStory,
  RelatedExperiences,
} from '@/components/experience/detail'
import { summaryFacts } from '@/components/experience/facts'
import { toFaqViews } from '@/components/sections/faq'
import { FaqExplorer } from '@/components/sections/faq-explorer'
import { toGalleryItems } from '@/components/sections/gallery-block'
import { Gallery } from '@/components/sections/gallery'
import { TestimonialList } from '@/components/sections/testimonials'
import { SectionLabel } from '@/components/ui/primitives'
import { getExperienceBySlug, getExperienceSlugs, getExperiences, getFaqs, getSettings, getTestimonials } from '@/lib/cms/queries'
import { bookingHref } from '@/lib/links'
import type { MediaRef } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, experienceJsonLd, serializeJsonLd } from '@/lib/structured-data'
import type { Experience } from '@/payload-types'
import { pathFor } from '@/payload/preview'

export const revalidate = 3600
export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    return (await getExperienceSlugs()).map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [experience, settings] = await Promise.all([getExperienceBySlug(slug), getSettings()])
  if (!experience) return {}
  return buildMetadata({
    settings,
    path: pathFor('experiences', slug),
    meta: experience.meta,
    fallbackTitle: experience.title,
    fallbackDescription: experience.shortDescription,
    fallbackImage: experience.heroImage,
  })
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params
  const [experience, settings, all] = await Promise.all([getExperienceBySlug(slug), getSettings(), getExperiences()])
  if (!experience) notFound()

  const [faqs, testimonials] = await Promise.all([
    getFaqs({ experienceId: experience.id }),
    getTestimonials({ experienceId: experience.id, limit: 6 }),
  ])

  const index = Math.max(1, all.findIndex((e) => e.id === experience.id) + 1)
  const bookHref = bookingHref(experience, settings.booking?.bookUrl || '/contact')
  const bookLabel = experience.booking?.label || settings.booking?.bookLabel || 'Book now'

  const manualRelated = (experience.relatedExperiences ?? []).filter((e): e is Experience => typeof e === 'object')
  const related = manualRelated.length ? manualRelated : all.filter((e) => e.id !== experience.id)

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Experiences', path: '/experiences' },
    { name: experience.shortTitle || experience.title, path: pathFor('experiences', slug) },
  ]
  const gallery = toGalleryItems(experience.gallery as MediaRef[])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([experienceJsonLd(experience, settings), breadcrumbJsonLd(settings, crumbs)]),
        }}
      />

      <ExperienceHero experience={experience} index={index} crumbs={crumbs} />
      <ExperienceIntro experience={experience} settings={settings} bookHref={bookHref} />
      <ExperienceStory experience={experience} />

      {gallery.length ? (
        <section className="tone-snow bg-surface pb-[var(--hn-section)] text-fg" aria-label="Gallery">
          <Gallery items={gallery} label={`${experience.title} gallery`} />
        </section>
      ) : null}

      <ExperienceHighlights experience={experience} />
      <ExperienceOptions experience={experience} bookHref={bookHref} />
      <ExperienceItinerary experience={experience} />
      <ExperienceInclusions experience={experience} />
      <ExperiencePickupPrice experience={experience} bookHref={bookHref} bookLabel={bookLabel} />
      <ExperienceNotices experience={experience} />

      {testimonials.length ? (
        <section className="tone-snow section-y bg-surface text-fg" aria-label="Guest testimonials">
          <TestimonialList
            testimonials={testimonials}
            style={testimonials.length > 2 ? 'carousel' : 'editorial'}
            label="Guest testimonials"
            header={<SectionLabel className="border-t border-rule pt-5">From our guests</SectionLabel>}
          />
        </section>
      ) : null}

      {faqs.length ? (
        <section className="tone-snow section-y border-t border-rule bg-surface text-fg" aria-labelledby="xp-faq-title">
          <div className="container-hn mb-12">
            <SectionLabel className="mb-8">Questions</SectionLabel>
            <h2 id="xp-faq-title" className="text-display-lg text-fg">
              Good to know
            </h2>
          </div>
          <FaqExplorer faqs={toFaqViews(faqs)} categories={[]} enableSearch={false} enableFilters={false} grouped={false} />
        </section>
      ) : null}

      <ExperienceBookingCta experience={experience} settings={settings} bookHref={bookHref} bookLabel={bookLabel} />
      <RelatedExperiences experiences={related} />

      {settings.booking?.mobileBookingBar !== false ? (
        <BookingBar
          title={experience.title}
          summary={summaryFacts(experience).slice(0, 2).join(' · ')}
          href={bookHref}
          // The bar is narrow: use the short site-wide label so the title stays readable.
          label={settings.booking?.bookLabel || 'Book now'}
        />
      ) : null}
    </>
  )
}
