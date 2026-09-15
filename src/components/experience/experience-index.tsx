'use client'

import { animate } from 'motion/mini'
import Link from 'next/link'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import { Arrow } from '@/components/ui/button'
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/use-media'
import { cn, pad } from '@/lib/utils'

export type ExperienceRow = {
  id: string
  href: string
  title: string
  tagline?: string | null
  description?: string | null
  facts: string[]
  categories: string[]
  image: ReactNode
}

const ease = [0.16, 1, 0.3, 1] as const

function Filters({
  categories,
  active,
  onChange,
}: {
  categories: string[]
  active: string | null
  onChange: (value: string | null) => void
}) {
  return (
    <div role="group" aria-label="Filter experiences" className="container-hn mb-10 flex flex-wrap gap-2">
      {[null, ...categories].map((category) => {
        const selected = active === category
        return (
          <button
            key={category ?? 'all'}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(category)}
            className={cn(
              'label h-10 rounded-full border px-5 transition-colors duration-300',
              selected ? 'border-fg bg-fg text-surface' : 'border-rule text-fg-muted hover:border-fg hover:text-fg',
            )}
          >
            {category ?? 'All'}
          </button>
        )
      })}
    </div>
  )
}

export function useCategoryFilter(rows: ExperienceRow[], enabled: boolean) {
  const categories = useMemo(() => [...new Set(rows.flatMap((r) => r.categories))], [rows])
  const [active, setActive] = useState<string | null>(null)
  const visible = active ? rows.filter((r) => r.categories.includes(active)) : rows
  const show = enabled && categories.length >= 2
  return {
    active,
    visible,
    filters: show ? <Filters categories={categories} active={active} onChange={setActive} /> : null,
  }
}

/**
 * Staggered entrance for the rows that remain after filtering, using Motion's
 * WAAPI-based mini animate (a few KB instead of the full React runtime).
 */
export function useFilterAnimation(list: React.RefObject<HTMLElement | null>, key: string | null) {
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const el = list.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const controls = Array.from(el.children).map((child, i) =>
      animate(
        child,
        { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] },
        { duration: 0.55, delay: i * 0.05, ease },
      ),
    )
    return () => controls.forEach((c) => c.stop())
  }, [list, key])
}

/**
 * Numbered editorial index. On fine pointers a preview image follows the cursor;
 * on touch devices each row carries its own image, so nothing depends on hover.
 */
export function ExperienceIndex({ rows, showFilters }: { rows: ExperienceRow[]; showFilters: boolean }) {
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const { active, visible, filters } = useCategoryFilter(rows, showFilters)
  const [hovered, setHovered] = useState<string | null>(null)
  const list = useRef<HTMLOListElement>(null)
  useFilterAnimation(list, active)
  const preview = useRef<HTMLDivElement>(null)
  const cursor = useRef({ x: 0, y: 0, cx: 0, cy: 0 })

  useEffect(() => {
    if (!fine || reduced) return
    let frame = 0
    const loop = () => {
      const c = cursor.current
      c.cx += (c.x - c.cx) * 0.14
      c.cy += (c.y - c.cy) * 0.14
      if (preview.current) preview.current.style.transform = `translate3d(${c.cx}px, ${c.cy}px, 0)`
      frame = requestAnimationFrame(loop)
    }
    const move = (e: PointerEvent) => {
      cursor.current.x = e.clientX
      cursor.current.y = e.clientY
    }
    window.addEventListener('pointermove', move, { passive: true })
    frame = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(frame)
    }
  }, [fine, reduced])

  const cursorPreview = fine && !reduced

  return (
    <div>
      {filters}
      <ol ref={list} className="container-hn" onPointerLeave={() => setHovered(null)}>
          {visible.map((row) => {
            const index = rows.indexOf(row) + 1
            const dimmed = cursorPreview && hovered !== null && hovered !== row.id
            return (
              <li key={row.id} className="border-t border-rule last:border-b">
                <Link
                  href={row.href}
                  onPointerEnter={() => setHovered(row.id)}
                  onFocus={() => setHovered(row.id)}
                  onBlur={() => setHovered(null)}
                  className={cn('xp-row group/link transition-opacity duration-500', dimmed && 'opacity-35')}
                >
                  {/* Inline image: shown unless the CSS cursor-preview layout applies (see .xp-row). */}
                  <div className="xp-row__image relative overflow-hidden">{row.image}</div>

                  <span className="xp-row__num label numeral text-signal">{pad(index)}</span>

                  <div className="xp-row__text">
                    <h3 className="text-display-md text-fg transition-transform duration-700 ease-expo group-hover/link:translate-x-3">
                      {row.title}
                    </h3>
                    {row.tagline ? <p className="mt-3 text-lead text-fg-muted">{row.tagline}</p> : null}
                  </div>

                  <div className="xp-row__facts flex items-end justify-between gap-6">
                    {row.facts.length ? (
                      <ul className="grid gap-1 text-sm text-fg-muted">
                        {row.facts.map((fact) => (
                          <li key={fact} className="numeral">
                            {fact}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-rule transition-colors duration-500 group-hover/link:border-fg group-hover/link:bg-fg group-hover/link:text-surface">
                      <Arrow />
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
      </ol>

      {/* Always rendered (hidden by CSS unless fine pointer + motion) so SSR and client match. */}
      {rows.length ? (
        <div ref={preview} aria-hidden="true" className="xp-cursor pointer-events-none fixed left-0 top-0 z-40">
          <div className="relative">
            {rows.map((row) => (
              <div
                key={row.id}
                className={cn(
                  'absolute left-0 top-0 aspect-[4/5] w-[min(22vw,22rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-[opacity,clip-path] duration-700 ease-expo',
                  hovered === row.id ? 'opacity-100 [clip-path:inset(0_0_0_0)]' : 'opacity-0 [clip-path:inset(12%_12%_12%_12%)]',
                )}
              >
                {row.image}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
