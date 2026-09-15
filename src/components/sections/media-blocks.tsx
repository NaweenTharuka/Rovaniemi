import { Parallax } from '@/components/animations/parallax'
import { Reveal, TextReveal } from '@/components/animations/reveal'
import { CmsImage } from '@/components/media/cms-image'
import { RichText } from '@/components/rich-text/rich-text'
import { CmsLink } from '@/components/ui/cms-link'
import { SectionLabel, parseSectionLabel } from '@/components/ui/primitives'
import { asMedia } from '@/lib/media'
import { cn, pad } from '@/lib/utils'
import type {
  FullBleedImageBlock as FullBleedData,
  ImageTextBlock as ImageTextData,
  QuoteBlock as QuoteData,
  SplitBlock as SplitData,
} from '@/payload-types'

import { Section, SectionHeader } from './section'

const HEIGHT = {
  screen: 'h-[100svh]',
  tall: 'h-[80svh]',
  cinema: 'aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]',
}

export function FullBleedImageBlock({ block }: { block: FullBleedData }) {
  const media = asMedia(block.image)
  return (
    <figure
      id={block.anchorId || undefined}
      className={cn('tone-ink relative overflow-hidden bg-surface text-fg', HEIGHT[block.height ?? 'screen'])}
    >
      {block.parallax ? (
        <Parallax amount={10}>
          <CmsImage media={block.image} sizes="100vw" sourceWidth={2880} />
        </Parallax>
      ) : (
        <CmsImage media={block.image} sizes="100vw" sourceWidth={2880} />
      )}
      {block.overlayText ? (
        <>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
          <div className="container-hn absolute inset-x-0 bottom-0 pb-12 md:pb-20">
            <TextReveal as="p" text={block.overlayText} className="max-w-5xl font-display text-display-lg text-fg" />
          </div>
        </>
      ) : null}
      {block.caption || media?.credit ? (
        <figcaption className="label absolute right-[var(--hn-margin)] top-[calc(var(--hn-header)+1rem)] text-right text-fg/70">
          {block.caption}
          {media?.credit ? <span className="mt-1 block normal-case tracking-normal opacity-70">{media.credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

const RATIO = { portrait: 'aspect-[4/5]', landscape: 'aspect-[4/3]', square: 'aspect-square' }

export function ImageTextBlock({ block }: { block: ImageTextData }) {
  const imageLeft = block.imagePosition === 'left'
  const label = parseSectionLabel(block.sectionLabel)
  return (
    <Section settings={block}>
      <div className="container-hn grid-hn items-center gap-y-12">
        <Reveal
          className={cn(
            'relative col-span-4 overflow-hidden md:col-span-8 lg:col-span-6',
            RATIO[block.imageRatio ?? 'portrait'],
            imageLeft ? 'lg:col-start-1' : 'lg:order-2 lg:col-start-7',
          )}
        >
          <Parallax amount={6}>
            <CmsImage media={block.image} sizes="(min-width: 64rem) 50vw, 100vw" sourceWidth={1440} />
          </Parallax>
        </Reveal>
        <div className={cn('col-span-4 md:col-span-7 lg:col-span-5', imageLeft ? 'lg:col-start-8' : 'lg:col-start-1 lg:row-start-1')}>
          {label || block.eyebrow ? (
            <Reveal className="mb-8">
              <SectionLabel index={label?.index}>{label?.text ?? block.eyebrow}</SectionLabel>
            </Reveal>
          ) : null}
          <TextReveal text={block.heading} className="text-display-md text-fg" />
          <Reveal delay={120} className="mt-8">
            <RichText data={block.body} />
          </Reveal>
          {block.cta ? (
            <Reveal delay={200} className="mt-10">
              <CmsLink link={block.cta} appearance="link" />
            </Reveal>
          ) : null}
        </div>
      </div>
    </Section>
  )
}

export function SplitBlock({ block }: { block: SplitData }) {
  const label = parseSectionLabel(block.sectionLabel)
  return (
    <Section settings={block}>
      <div className="container-hn">
        {label || block.eyebrow ? (
          <Reveal className="mb-10 border-t border-rule pt-5 md:mb-16">
            <SectionLabel index={label?.index}>{label?.text ?? block.eyebrow}</SectionLabel>
          </Reveal>
        ) : null}
        <div className="grid-hn gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--hn-header)+2rem)]">
              <TextReveal text={block.heading} className="text-display-lg text-fg" />
              {block.cta ? (
                <Reveal delay={200} className="mt-10 hidden lg:block">
                  <CmsLink link={block.cta} appearance="secondary" />
                </Reveal>
              ) : null}
            </div>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
            {block.body ? (
              <Reveal>
                <RichText data={block.body} lead />
              </Reveal>
            ) : null}
            {block.items?.length ? (
              <ol className={cn(block.body && 'mt-14')}>
                {block.items.map((item, i) => (
                  <Reveal as="li" key={item.id ?? i} delay={i * 60} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-rule py-8 md:grid-cols-[4rem_1fr]">
                    <span className="label numeral pt-2 text-signal">{pad(i + 1)}</span>
                    <div>
                      <h3 className="text-title text-fg">{item.title}</h3>
                      {item.text ? <p className="mt-3 text-fg-muted">{item.text}</p> : null}
                    </div>
                  </Reveal>
                ))}
              </ol>
            ) : null}
            {block.cta ? (
              <div className="mt-10 lg:hidden">
                <CmsLink link={block.cta} appearance="secondary" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  )
}

export function QuoteBlock({ block }: { block: QuoteData }) {
  return (
    <Section settings={block}>
      <SectionHeader label={block.sectionLabel} className="mb-12" />
      <figure className="container-hn grid-hn items-end gap-y-10">
        {asMedia(block.image) ? (
          <Reveal className="relative col-span-2 aspect-[3/4] overflow-hidden md:col-span-3 lg:col-span-3">
            <CmsImage media={block.image} sizes="(min-width: 64rem) 25vw, 50vw" sourceWidth={960} />
          </Reveal>
        ) : null}
        <div className={cn('col-span-4 md:col-span-8', asMedia(block.image) ? 'lg:col-span-8 lg:col-start-5' : 'lg:col-span-10 lg:col-start-2')}>
          <blockquote>
            <TextReveal as="p" text={`“${block.quote.trim()}”`} className="font-display text-display-lg text-fg" />
          </blockquote>
          {block.attribution ? (
            <Reveal as="figcaption" delay={200} className="mt-10 flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
              <span>
                <span className="block text-fg">{block.attribution}</span>
                {block.role ? <span className="label mt-1 block text-fg-muted">{block.role}</span> : null}
              </span>
            </Reveal>
          ) : null}
        </div>
      </figure>
    </Section>
  )
}
