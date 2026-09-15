'use client'

import { type ReactNode, useEffect, useRef } from 'react'

import { loadGsap, prefersReducedMotion, whenInteractive } from '@/lib/gsap'
import { cn } from '@/lib/utils'

/**
 * Moves its child against the scroll for depth. The child should be taller
 * than the frame (e.g. `inset-[-10%]`) so edges never show.
 */
export function Parallax({
  children,
  className,
  amount = 10,
  scaleFrom,
}: {
  children: ReactNode
  className?: string
  /** Travel in percent of the element's height. */
  amount?: number
  /** Optional scale at the start of the scroll range, easing to 1. */
  scaleFrom?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let cleanup: (() => void) | undefined
    let cancelled = false

    const cancelWait = whenInteractive(() => void loadGsap().then(({ gsap }) => {
      if (cancelled) return
      const touch = window.matchMedia('(hover: none)').matches
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { yPercent: -amount * (touch ? 0.5 : 1), scale: scaleFrom ?? 1 },
          {
            yPercent: amount * (touch ? 0.5 : 1),
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
      cleanup = () => ctx.revert()
    }))

    return () => {
      cancelled = true
      cancelWait()
      cleanup?.()
    }
  }, [amount, scaleFrom])

  return (
    <div ref={ref} className={cn('absolute inset-[-12%_0] will-change-transform', className)}>
      {children}
    </div>
  )
}
