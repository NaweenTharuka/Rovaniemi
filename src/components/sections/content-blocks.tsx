import Link from 'next/link'

import { Parallax } from '@/components/animations/parallax'
import { Reveal, TextReveal } from '@/components/animations/reveal'
import { CmsImage } from '@/components/media/cms-image'
import { headingsOf, RichText } from '@/components/rich-text/rich-text'
import { Arrow } from '@/components/ui/button'
import { CmsLink } from '@/components/ui/cms-link'
import { parseSectionLabel, SectionLabel } from '@/components/ui/primitives'
import { resolveLink } from '@/lib/links'
import { asMedia } from '@/lib/media'
import { cn, pad, whatsappHref } from '@/lib/utils'
import type {
  CtaBlock as CtaData,
  ImageGridBlock as ImageGridData,
  NewsletterBlock as NewsletterData,
  RichTextBlock as RichTextData,
  SiteSetting,
  StatsBlock as StatsData,
  TimelineBlock as TimelineData,
} from '@/payload-types'

import { Section, SectionHeader } from './section'

export function RichTextBlock({ block }: { block: RichTextData }) {
  const toc = block.tableOfContents ? headingsOf(block.content) : []
  const updated = block.lastUpdated
    ? new Date(block.lastUpdated).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null

  return (
    <Section settings={block}>
      <SectionHeader label={block.sectionLabel} eyebrow={block.eyebrow} heading={block.heading} size="md" className="mb-12 md:mb-16" />
      <div className="container-hn grid-hn gap-y-10">
        {toc.length ? (
          <aside className="col-span-4 md:col-span-8 lg:col-span-3">
            <nav aria-label="On this page" className="lg:sticky lg:top-[calc(var(--hn-header)+2rem)]">
              <p className="label mb-4 text-fg-muted">On this page</p>
              <ol className="grid gap-2 border-l border-rule pl-4 text-sm">
                {toc.map((h, i) => (
                  <li key={h.id} className="flex gap-3">
                    <span className="numeral text-fg-subtle">{pad(i + 1)}</span>
                    <a href={`#${h.id}`} className="link-underline text-fg-muted hover:text-fg">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        ) : null}
        <div
          className={cn(
            'col-span-4 md:col-span-8',
            toc.length ? 'lg:col-span-7 lg:col-start-5' : block.width === 'wide' ? 'lg:col-span-10' : 'lg:col-span-7 lg:col-start-3',
          )}
        >
          {updated ? <p className="label mb-8 text-fg-muted">Last updated: {updated}</p> : null}
          <RichText data={block.content} className={block.width === 'wide' ? 'max-w-none' : undefined} />
        </div>
      </div>
    </Section>
  )
}

export function StatsBlock({ block }: { block: StatsData }) {
  return (
    <Section settings={block}>
      <SectionHeader label={block.sectionLabel} eyebrow={block.eyebrow} heading={block.heading} className="mb-14 md:mb-20" />
      <dl className="container-hn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {block.items?.map((item, i) => (
          <Reveal key={item.id ?? i} delay={i * 80} className="border-t border-rule py-8 pr-6 sm:[&:nth-child(odd)]:pr-10 lg:border-l lg:border-t-0 lg:px-8 lg:py-4 lg:first:border-l-0 lg:first:pl-0">
            <dt className="sr-only">{item.label}</dt>
            <dd className="font-display text-display-lg text-fg numeral">{item.value}</dd>
            <dd className="label mt-4 text-fg">{item.label}</dd>
            {item.description ? <dd className="mt-3 max-w-xs text-fg-muted">{item.description}</dd> : null}
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}

export function TimelineBlock({ block }: { block: TimelineData }) {
  return (
    <Section settings={block}>
      <SectionHeader label={block.sectionLabel} eyebrow={block.eyebrow} heading={block.heading} size="md" className="mb-14" />
      <ol className="container-hn">
        {block.items?.map((item, i) => (
          <Reveal as="li" key={item.id ?? i} delay={i * 50} className="grid-hn border-t border-rule py-8">
            <span className="label numeral col-span-1 pt-1.5 text-signal md:col-span-2">{item.marker || pad(i + 1)}</span>
            <h3 className="col-span-3 text-title text-fg md:col-span-3 lg:col-span-4">{item.title}</h3>
            {item.body ? <p className="col-span-4 mt-3 text-fg-muted md:col-span-3 md:mt-0 lg:col-span-5 lg:col-start-8">{item.body}</p> : null}
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}

export function ImageGridBlock({ block }: { block: ImageGridData }) {
  const items = block.items ?? []
  return (
    <Section settings={block}>
      <SectionHeader label={block.sectionLabel} eyebrow={block.eyebrow} heading={block.heading} className="mb-14" />
      <ul className="container-hn grid gap-x-[var(--hn-gutter)] gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const link = resolveLink({ ...item.link, label: item.title })
          const inner = (
            <>
              <div className={cn('relative overflow-hidden', i % 2 ? 'aspect-[4/5] lg:mt-16' : 'aspect-[4/5]')}>
                <CmsImage
                  media={item.image}
                  sizes="(min-width: 64rem) 25vw, (min-width: 30rem) 50vw, 100vw"
                  sourceWidth={960}
                  imgClassName="transition-transform duration-[1.2s] ease-expo group-hover/link:scale-105"
                />
              </div>
              <p className="label numeral mt-5 text-signal">{pad(i + 1)}</p>
              <h3 className="mt-2 flex items-center justify-between gap-4 text-title text-fg">
                {item.title}
                {link ? <Arrow /> : null}
              </h3>
              {item.text ? <p className="mt-2 text-fg-muted">{item.text}</p> : null}
            </>
          )
          return (
            <Reveal as="li" key={item.id ?? i} delay={i * 70}>
              {link ? (
                <Link href={link.href} className="group/link block">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}

export function CtaBlock({ block, settings }: { block: CtaData; settings: SiteSetting }) {
  const label = parseSectionLabel(block.sectionLabel)
  const hasImage = Boolean(asMedia(block.backgroundImage))
  const wa = block.showWhatsApp ? whatsappHref(settings.contact?.whatsapp) : null
  const tone = hasImage || block.tone === 'ink' ? 'ink' : 'snow'

  return (
    <Section
      settings={{ ...block, tone }}
      className={cn(hasImage && 'overflow-hidden')}
      padded={false}
    >
      {hasImage ? (
        <div className="absolute inset-0">
          <Parallax amount={8}>
            <CmsImage media={block.backgroundImage} sizes="100vw" sourceWidth={2048} />
          </Parallax>
          <div aria-hidden="true" className="absolute inset-0 bg-ink/65" />
        </div>
      ) : null}
      <div className="container-hn relative py-[clamp(7rem,16vw,14rem)]">
        {label || block.eyebrow ? (
          <Reveal className="mb-10 flex items-center justify-between border-t border-rule pt-5">
            <SectionLabel index={label?.index}>{label?.text ?? block.eyebrow}</SectionLabel>
          </Reveal>
        ) : null}
        <TextReveal text={block.heading} className="max-w-6xl text-display-xl text-fg" />
        <div className="mt-12 grid-hn gap-y-8">
          {block.body ? (
            <Reveal delay={150} className="col-span-4 md:col-span-5 lg:col-span-5">
              <p className="text-lead text-fg-muted">{block.body}</p>
            </Reveal>
          ) : null}
          <Reveal delay={250} className="col-span-4 flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-8 lg:col-span-6 lg:col-start-7 lg:justify-end">
            <CmsLink link={block.primaryCta} appearance="primary" size="lg" />
            <CmsLink link={block.secondaryCta} appearance="link" />
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
    </Section>
  )
}

export function NewsletterBlock({ block }: { block: NewsletterData }) {
  // No signup endpoint → render nothing rather than a form that goes nowhere.
  if (!block.formAction) return null
  return (
    <Section settings={block}>
      <div className="container-hn grid-hn items-end gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-6">
          {block.sectionLabel || block.eyebrow ? (
            <SectionLabel className="mb-8">{block.sectionLabel || block.eyebrow}</SectionLabel>
          ) : null}
          <TextReveal text={block.heading} className="text-display-md text-fg" />
          {block.body ? <p className="mt-6 max-w-lg text-fg-muted">{block.body}</p> : null}
        </div>
        <form action={block.formAction} method="post" target="_blank" className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
          <label htmlFor={`nl-${block.id}`} className="label text-fg-muted">
            Email address
          </label>
          <div className="mt-2 flex items-end gap-4 border-b border-rule focus-within:border-fg">
            <input
              id={`nl-${block.id}`}
              name={block.emailFieldName || 'EMAIL'}
              type="email"
              required
              autoComplete="email"
              className="min-w-0 flex-1 bg-transparent py-3 text-lead text-fg outline-none placeholder:text-fg-subtle"
              placeholder="you@example.com"
            />
            <button type="submit" className="group/button label mb-3 inline-flex items-center gap-3 text-fg">
              {block.buttonLabel || 'Subscribe'}
              <Arrow />
            </button>
          </div>
          {block.disclaimer ? <p className="mt-4 text-xs text-fg-muted">{block.disclaimer}</p> : null}
        </form>
      </div>
    </Section>
  )
}
