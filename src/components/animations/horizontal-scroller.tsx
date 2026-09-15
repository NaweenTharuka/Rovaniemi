'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { Arrow } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media'
import { loadGsap, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

/**
 * Desktop with a fine pointer: vertical scroll drives a pinned horizontal track.
 * Touch, keyboard-first and reduced-motion users: a native swipeable, snapping
 * track with previous/next buttons — never hover-only.
 */
export function HorizontalScroller({
  children,
  header,
  label,
  pin = true,
  className,
}: {
  children: ReactNode
  header?: ReactNode
  label: string
  pin?: boolean
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const capable = useMediaQuery(
    '(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    false,
  )
  const pinned = pin && capable

  useEffect(() => {
    const el = root.current
    const tr = track.current
    if (!el || !tr || !pinned || prefersReducedMotion()) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return
      const distance = () => Math.max(0, tr.scrollWidth - window.innerWidth)
      const setHeight = () => {
        el.style.height = `${window.innerHeight + distance()}px`
      }
      setHeight()
      const ctx = gsap.context(() => {
        gsap.to(tr, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            invalidateOnRefresh: true,
            onRefreshInit: setHeight,
          },
        })
      }, el)
      ScrollTrigger.refresh()
      cleanup = () => {
        ctx.revert()
        el.style.height = ''
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [pinned])

  const updateEdges = useCallback(() => {
    const tr = track.current
    if (!tr) return
    setEdges({ start: tr.scrollLeft < 8, end: tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 8 })
  }, [])

  const step = (dir: 1 | -1) => {
    const tr = track.current
    if (!tr) return
    const first = tr.firstElementChild as HTMLElement | null
    const amount = first ? first.getBoundingClientRect().width + 24 : tr.clientWidth * 0.8
    tr.scrollBy({ left: dir * amount, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <div ref={root} className={cn('hscroll relative', pinned && 'is-pinned', className)}>
      <div className="hscroll__stage">
        {header || !pinned ? (
          <div className="container-hn mb-10 flex items-end justify-between gap-6 md:mb-14">
            <div className="min-w-0 flex-1">{header}</div>
            {!pinned ? (
              <div className="hidden shrink-0 gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  disabled={edges.start}
                  className="group/button inline-flex size-12 items-center justify-center rounded-full border border-rule text-fg transition-colors hover:border-current disabled:opacity-30"
                  aria-label="Previous"
                >
                  <Arrow direction="left" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  disabled={edges.end}
                  className="group/button inline-flex size-12 items-center justify-center rounded-full border border-rule text-fg transition-colors hover:border-current disabled:opacity-30"
                  aria-label="Next"
                >
                  <Arrow />
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
        <div
          ref={track}
          className="hscroll__track pb-2"
          role="region"
          aria-label={label}
          tabIndex={pinned ? -1 : 0}
          onScroll={pinned ? undefined : updateEdges}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
