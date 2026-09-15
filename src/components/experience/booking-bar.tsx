'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Arrow, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Sticky mobile booking bar: appears once the hero has scrolled away and
 * steps aside when the full booking section is on screen.
 */
export function BookingBar({ title, summary, href, label }: { title: string; summary?: string | null; href: string; label: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('[data-hero-overlay]')
    const book = document.getElementById('book')
    let pastHero = false
    let atBooking = false
    const update = () => setVisible(pastHero && !atBooking)

    const heroObserver = new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting
      update()
    })
    const bookObserver = new IntersectionObserver(([entry]) => {
      atBooking = entry.isIntersecting
      update()
    })
    if (hero) heroObserver.observe(hero)
    if (book) bookObserver.observe(book)
    return () => {
      heroObserver.disconnect()
      bookObserver.disconnect()
    }
  }, [])

  return (
    <div
      className={cn(
        'tone-ink fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-surface/95 text-fg transition-transform duration-500 ease-expo lg:hidden',
        'pb-[env(safe-area-inset-bottom)]',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      aria-hidden={!visible}
    >
      <div className="container-hn flex items-center justify-between gap-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-fg">{title}</p>
          {summary ? <p className="numeral truncate text-xs text-fg-muted">{summary}</p> : null}
        </div>
        <Link href={href} tabIndex={visible ? 0 : -1} className={cn(buttonVariants({ size: 'sm' }), 'shrink-0')}>
          {label}
          <Arrow className="w-4" />
        </Link>
      </div>
    </div>
  )
}
