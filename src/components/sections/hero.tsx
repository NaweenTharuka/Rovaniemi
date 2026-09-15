import { Parallax } from '@/components/animations/parallax'
import { Reveal, TextReveal } from '@/components/animations/reveal'
import { AmbientVideo } from '@/components/media/ambient-video'
import { CmsImage } from '@/components/media/cms-image'
import { CmsLink } from '@/components/ui/cms-link'
import { Magnetic } from '@/components/animations/magnetic'
import { parseSectionLabel, SectionLabel } from '@/components/ui/primitives'
import { asMedia, isVideo, mediaUrl } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { HeroBlock as HeroBlockData } from '@/payload-types'

const OVERLAY = {
  light: 'from-ink/70 via-ink/15 to-ink/30',
  medium: 'from-ink/85 via-ink/35 to-ink/40',
  strong: 'from-ink/95 via-ink/55 to-ink/60',
}

export function HeroBlock({ block, isFirst }: { block: HeroBlockData; isFirst: boolean }) {
  const variant = block.variant ?? 'cinematic'
  const label = parseSectionLabel(block.sectionLabel)
  const video = block.mediaType === 'video' ? asMedia(block.video) : null
  const videoMobile = block.mediaType === 'video' ? asMedia(block.videoMobile) : null
  const hasMedia = Boolean(asMedia(block.image) || video)

  const background = (
    <div className="hero-settle absolute inset-0">
      <CmsImage media={block.image} sizes="100vw" priority={isFirst} sourceWidth={2880} />
      {video && isVideo(video) && video.url ? (
        <AmbientVideo
          src={mediaUrl(video)!}
          mobileSrc={videoMobile && isVideo(videoMobile) ? mediaUrl(videoMobile) : null}
          type={video.mimeType ?? undefined}
          poster={mediaUrl(block.image, 1440)}
        />
      ) : null}
    </div>
  )

  const ctas = (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
      {block.primaryCta ? (
        <Magnetic>
          <CmsLink link={block.primaryCta} appearance="primary" size="lg" />
        </Magnetic>
      ) : null}
      <CmsLink link={block.secondaryCta} appearance="link" />
    </div>
  )

  if (variant === 'cinematic' && hasMedia) {
    return (
      <section
        id={block.anchorId || undefined}
        data-hero-overlay=""
        className="tone-ink grain relative flex min-h-[100svh] flex-col overflow-hidden bg-surface text-fg"
      >
        <div className="absolute inset-0">
          {block.parallax ? <Parallax amount={8}>{background}</Parallax> : background}
          <div aria-hidden="true" className={cn('absolute inset-0 bg-gradient-to-t', OVERLAY[block.overlay ?? 'medium'])} />
          {/* Legibility scrim behind the text block, independent of the photo's brightness. */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-[radial-gradient(120%_100%_at_20%_100%,rgb(11_16_22/0.7)_0%,rgb(11_16_22/0)_70%)]" />
        </div>

        <div className="container-hn relative z-10 flex flex-1 flex-col pb-10 pt-[calc(var(--hn-header)+2rem)] md:pb-14">
          {block.eyebrow || label ? (
            <Reveal immediate delay={200} className="flex items-center justify-between gap-4">
              <SectionLabel index={label?.index}>{label?.text ?? block.eyebrow}</SectionLabel>
              {label && block.eyebrow ? <p className="label hidden text-fg-muted sm:block">{block.eyebrow}</p> : null}
            </Reveal>
          ) : null}

          <div className="mt-auto grid-hn items-end gap-y-10">
            <TextReveal
              as={isFirst ? 'h1' : 'h2'}
              text={block.heading}
              immediate
              delay={250}
              stagger={120}
              className="col-span-4 font-display text-display-2xl font-medium text-fg uppercase md:col-span-8 lg:col-span-8"
            />
            <div className="col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9">
              {block.subheading ? (
                <Reveal immediate delay={650}>
                  <p className="max-w-md text-lead text-snow/90">{block.subheading}</p>
                </Reveal>
              ) : null}
              <Reveal immediate delay={800} className="mt-8">
                {ctas}
              </Reveal>
            </div>
          </div>

          <div aria-hidden="true" className="mt-12 hidden items-center gap-4 md:flex">
            <span className="label text-fg-muted">Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-[var(--rule)]">
              <span className="absolute inset-0 animate-scroll-cue bg-fg" />
            </span>
          </div>
        </div>
      </section>
    )
  }

  const compact = variant === 'compact' || !hasMedia
  const tone = block.tone === 'ink' ? 'tone-ink grain' : 'tone-snow'

  return (
    <section id={block.anchorId || undefined} className={cn(tone, 'relative bg-surface text-fg')}>
      <div className={cn('container-hn relative z-10 pt-[calc(var(--hn-header)+clamp(3rem,9vw,8rem))]', compact ? 'pb-[clamp(3rem,7vw,6rem)]' : 'pb-12 md:pb-16')}>
        {block.eyebrow || label ? (
          <Reveal immediate className="mb-10 flex items-center justify-between gap-4 border-t border-rule pt-5 md:mb-14">
            <SectionLabel index={label?.index}>{label?.text ?? block.eyebrow}</SectionLabel>
            {label && block.eyebrow ? <p className="label text-fg-muted">{block.eyebrow}</p> : null}
          </Reveal>
        ) : null}
        <div className="grid-hn items-end gap-y-8">
          <TextReveal
            as={isFirst ? 'h1' : 'h2'}
            text={block.heading}
            immediate
            delay={100}
            className={cn('col-span-4 text-fg md:col-span-8', compact ? 'text-display-lg lg:col-span-8' : 'text-display-xl lg:col-span-9')}
          />
          {block.subheading || block.primaryCta || block.secondaryCta ? (
            <Reveal immediate delay={350} className="col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9">
              {block.subheading ? <p className="text-lead text-fg-muted">{block.subheading}</p> : null}
              {block.primaryCta || block.secondaryCta ? <div className="mt-8">{ctas}</div> : null}
            </Reveal>
          ) : null}
        </div>
      </div>

      {!compact ? (
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-[21/9]">
          {block.parallax ? (
            <Parallax amount={6}>
              <CmsImage media={block.image} sizes="100vw" priority={isFirst} sourceWidth={2880} />
            </Parallax>
          ) : (
            <CmsImage media={block.image} sizes="100vw" priority={isFirst} sourceWidth={2880} />
          )}
        </div>
      ) : null}
    </section>
  )
}
