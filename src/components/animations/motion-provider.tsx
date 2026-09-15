'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'

import { peekGsap } from '@/lib/gsap'

/**
 * Recalculates ScrollTrigger positions after client navigations and once fonts
 * settle, so pinned sections never start at stale offsets. Never downloads GSAP
 * itself — it only refreshes if a scroll-story island already loaded it.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false
    const refresh = () =>
      void peekGsap()?.then(({ ScrollTrigger }) => {
        if (!cancelled) ScrollTrigger.refresh()
      })
    const timer = window.setTimeout(refresh, 400)
    void document.fonts?.ready.then(refresh)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [pathname])

  return <>{children}</>
}
