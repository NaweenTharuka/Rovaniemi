'use client'

import { type ReactNode, useEffect, useRef } from 'react'

/**
 * Subtle magnetic pull for a single primary CTA. Fine pointers only;
 * disabled for reduced motion. Transform is applied to a wrapper so the
 * focus ring and hit area of the real link never move away from the cursor.
 */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const allowed = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!allowed.matches) return

    let frame = 0
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (event.clientX - (rect.left + rect.width / 2)) * strength
      const y = (event.clientY - (rect.top + rect.height / 2)) * strength
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
    }
    const leave = () => {
      cancelAnimationFrame(frame)
      el.style.transform = ''
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(frame)
    }
  }, [strength])

  return (
    <span ref={ref} className="inline-block transition-transform duration-500 ease-expo">
      {children}
    </span>
  )
}
