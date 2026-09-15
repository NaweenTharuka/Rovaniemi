import type { ReactNode } from 'react'

import { Reveal, TextReveal } from '@/components/animations/reveal'
import { parseSectionLabel, SectionLabel } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

export type BlockSettings = {
  hidden?: boolean | null
  tone?: 'snow' | 'ink' | null
  anchorId?: string | null
  sectionLabel?: string | null
}

/** Shared shell: tone surface, anchor, vertical rhythm, and the editorial section label. */
export function Section({
  settings,
  children,
  className,
  padded = true,
  as: Tag = 'section',
  ariaLabel,
  ariaLabelledBy,
}: {
  settings?: BlockSettings
  children: ReactNode
  className?: string
  padded?: boolean
  as?: 'section' | 'div' | 'aside'
  ariaLabel?: string
  ariaLabelledBy?: string
}) {
  const tone = settings?.tone ?? 'snow'
  return (
    <Tag
      id={settings?.anchorId || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        tone === 'ink' ? 'tone-ink grain' : 'tone-snow',
        'relative bg-surface text-fg',
        padded && 'section-y',
        className,
      )}
    >
      <div className={cn(tone === 'ink' && 'relative z-10')}>{children}</div>
    </Tag>
  )
}

/** Label + headline + optional intro, in the house editorial arrangement. */
export function SectionHeader({
  label,
  eyebrow,
  heading,
  intro,
  id,
  size = 'lg',
  align = 'split',
  className,
  aside,
}: {
  label?: string | null
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  id?: string
  size?: 'xl' | 'lg' | 'md'
  align?: 'split' | 'stack'
  className?: string
  aside?: ReactNode
}) {
  const parsed = parseSectionLabel(label)
  if (!parsed && !eyebrow && !heading && !intro) return null
  const headingClass = { xl: 'text-display-xl', lg: 'text-display-lg', md: 'text-display-md' }[size]

  return (
    <header className={cn('container-hn', className)}>
      {parsed || eyebrow ? (
        <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5 md:mb-12">
          <SectionLabel index={parsed?.index}>{parsed?.text ?? eyebrow}</SectionLabel>
          {parsed && eyebrow ? <p className="label text-fg-muted">{eyebrow}</p> : null}
        </Reveal>
      ) : null}
      <div className={cn('grid-hn gap-y-8', align === 'stack' && 'block')}>
        {heading ? (
          <TextReveal
            id={id}
            text={heading}
            className={cn(headingClass, 'text-fg', align === 'split' ? 'col-span-4 md:col-span-8 lg:col-span-7' : 'max-w-5xl')}
          />
        ) : null}
        {intro || aside ? (
          <Reveal
            delay={120}
            className={cn(
              align === 'split'
                ? 'col-span-4 self-end md:col-span-6 lg:col-span-4 lg:col-start-9'
                : 'mt-8 max-w-2xl',
            )}
          >
            {intro ? <p className="text-lead text-fg-muted">{intro}</p> : null}
            {aside}
          </Reveal>
        ) : null}
      </div>
    </header>
  )
}
