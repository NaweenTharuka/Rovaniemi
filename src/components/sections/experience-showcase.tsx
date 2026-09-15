import Link from 'next/link'

import { Parallax } from '@/components/animations/parallax'
import { Reveal } from '@/components/animations/reveal'
import { ExperienceHorizontal } from '@/components/experience/experience-cards'
import { ExperienceIndex, type ExperienceRow } from '@/components/experience/experience-index'
import { summaryFacts } from '@/components/experience/facts'
import { CmsImage } from '@/components/media/cms-image'
import { Arrow } from '@/components/ui/button'
import { CmsLink } from '@/components/ui/cms-link'
import { getExperiences } from '@/lib/cms/queries'
import { cn, pad } from '@/lib/utils'
import type { Experience, ExperienceShowcaseBlock as ShowcaseData } from '@/payload-types'
import { pathFor } from '@/payload/preview'

import { Section, SectionHeader } from './section'

const toRow = (e: Experience, sizes: string, sourceWidth: number): ExperienceRow => ({
  id: String(e.id),
  href: pathFor('experiences', e.slug),
  title: e.title,
  tagline: e.tagline || e.shortDescription,
  description: e.shortDescription,
  facts: summaryFacts(e),
  categories: e.categories ?? [],
  image: <CmsImage media={e.heroImage} sizes={sizes} sourceWidth={sourceWidth} />,
})

export async function ExperienceShowcaseBlock({ block }: { block: ShowcaseData }) {
  const manualIds =
    block.source === 'manual'
      ? (block.experiences ?? []).map((e) => (typeof e === 'object' ? e.id : e))
      : undefined
  const experiences = await getExperiences({
    featured: block.source === 'featured',
    ids: manualIds,
  })

  if (!experiences.length) return null
  const layout = block.layout ?? 'index'

  const header = (
    <SectionHeader
      label={block.sectionLabel}
      eyebrow={block.eyebrow}
      heading={block.heading}
      intro={block.intro}
      className={layout === 'horizontal' ? 'px-0!' : 'mb-14 md:mb-20'}
    />
  )

  if (layout === 'horizontal') {
    const rows = experiences.map((e) => toRow(e, '(min-width: 64rem) 38vw, 82vw', 1440))
    return (
      <Section settings={block}>
        <ExperienceHorizontal rows={rows} header={header} label={block.heading?.replace(/\n/g, ' ') || 'Experiences'} showFilters={Boolean(block.showFilters)} />
        {block.cta ? (
          <div className="container-hn mt-12">
            <CmsLink link={block.cta} appearance="secondary" />
          </div>
        ) : null}
      </Section>
    )
  }

  if (layout === 'stacked') {
    return (
      <Section settings={block}>
        {header}
        <ol>
          {experiences.map((e, i) => (
            <li key={e.id} className="border-t border-rule">
              <Link href={pathFor('experiences', e.slug)} className="group/link container-hn grid-hn items-center gap-y-8 py-12 md:py-16">
                <div className={cn('relative col-span-4 aspect-[4/3] overflow-hidden md:col-span-8 lg:col-span-7', i % 2 && 'lg:order-2 lg:col-start-6')}>
                  <Parallax amount={6}>
                    <CmsImage media={e.heroImage} sizes="(min-width: 64rem) 58vw, 100vw" sourceWidth={1440} />
                  </Parallax>
                </div>
                <Reveal className={cn('col-span-4 md:col-span-6 lg:col-span-4', i % 2 ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-9')}>
                  <span className="label numeral text-signal">{pad(i + 1)}</span>
                  <h3 className="mt-4 text-display-md text-fg">{e.title}</h3>
                  <p className="mt-4 text-fg-muted">{e.shortDescription}</p>
                  <p className="numeral mt-6 text-sm text-fg">{summaryFacts(e).join(' · ')}</p>
                  <span className="label mt-8 inline-flex items-center gap-3 text-fg">
                    Explore <Arrow />
                  </span>
                </Reveal>
              </Link>
            </li>
          ))}
        </ol>
        {block.cta ? (
          <div className="container-hn mt-12">
            <CmsLink link={block.cta} appearance="secondary" />
          </div>
        ) : null}
      </Section>
    )
  }

  const rows = experiences.map((e) => toRow(e, '(min-width: 64rem) 22rem, (min-width: 48rem) 37vw, 100vw', 960))
  return (
    <Section settings={block}>
      {header}
      <ExperienceIndex rows={rows} showFilters={Boolean(block.showFilters)} />
      {block.cta ? (
        <Reveal className="container-hn mt-12 flex justify-end">
          <CmsLink link={block.cta} appearance="secondary" />
        </Reveal>
      ) : null}
    </Section>
  )
}
