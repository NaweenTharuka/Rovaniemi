'use client'

import Link from 'next/link'

import { HorizontalScroller } from '@/components/animations/horizontal-scroller'
import { Arrow } from '@/components/ui/button'
import { pad } from '@/lib/utils'

import { type ExperienceRow, useCategoryFilter } from './experience-index'

/** Large cards on a horizontal track (pinned on desktop, swipe on touch). */
export function ExperienceHorizontal({
  rows,
  header,
  label,
  showFilters,
}: {
  rows: ExperienceRow[]
  header?: React.ReactNode
  label: string
  showFilters: boolean
}) {
  const { visible, filters } = useCategoryFilter(rows, showFilters)
  return (
    <>
      {filters}
      <HorizontalScroller header={header} label={label} pin={!filters}>
        {visible.map((row) => (
          <Link
            key={row.id}
            href={row.href}
            className="group/link relative block w-[82vw] sm:w-[60vw] lg:w-[38vw] xl:w-[32vw]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-expo group-hover/link:scale-105">
                {row.image}
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <span className="label numeral absolute left-5 top-5 text-snow">{pad(rows.indexOf(row) + 1)}</span>
              <div className="tone-ink absolute inset-x-0 bottom-0 p-6 text-fg">
                <h3 className="text-display-md">{row.title}</h3>
                {row.tagline ? <p className="mt-2 text-fg-muted">{row.tagline}</p> : null}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-rule pt-4">
              <p className="numeral text-sm text-fg-muted">{row.facts.slice(0, 2).join(' · ')}</p>
              <Arrow />
            </div>
          </Link>
        ))}
      </HorizontalScroller>
    </>
  )
}
