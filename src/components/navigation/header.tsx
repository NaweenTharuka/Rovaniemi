'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import { Arrow, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { Wordmark } from './brand-mark'
import { MobileMenu } from './mobile-menu'
import type { HeaderData, NavLink } from './types'

const isCurrent = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

function NavAnchor({ link, className, onClick }: { link: NavLink; className?: string; onClick?: () => void }) {
  const pathname = usePathname()
  const current = !link.external && isCurrent(pathname, link.href)
  if (link.external || link.newTab) {
    return (
      <a href={link.href} className={className} target={link.newTab ? '_blank' : undefined} rel={link.newTab ? 'noopener noreferrer' : undefined} onClick={onClick}>
        {link.label}
      </a>
    )
  }
  return (
    <Link href={link.href} className={className} aria-current={current ? 'page' : undefined} onClick={onClick}>
      {link.label}
    </Link>
  )
}

function Dropdown({ item }: { item: NavLink }) {
  const id = useId()
  const wrapper = useRef<HTMLLIElement>(null)
  const pathname = usePathname()
  // Open state belongs to the current route, so navigating closes the menu without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (value: boolean | ((prev: boolean) => boolean)) =>
    setOpenOn((prev) => {
      const next = typeof value === 'function' ? value(prev === pathname) : value
      return next ? pathname : null
    })

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenOn(null)
        wrapper.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpenOn(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  return (
    <li
      ref={wrapper}
      className="relative"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      onBlur={(e) => {
        if (!wrapper.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'label inline-flex h-10 items-center gap-2 px-3 transition-opacity hover:opacity-70',
          isCurrent(pathname, item.href) && 'opacity-100',
        )}
      >
        {item.label}
        <svg aria-hidden="true" viewBox="0 0 10 6" className={cn('h-1.5 w-2.5 transition-transform duration-300', open && 'rotate-180')} fill="none" stroke="currentColor">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>
      <div
        id={id}
        hidden={!open}
        className="tone-ink absolute left-1/2 top-full w-[26rem] -translate-x-1/2 pt-3"
      >
        <ul className="border border-rule bg-surface p-2 text-fg shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)]">
          <li>
            <Link href={item.href} className="group/link flex items-center justify-between gap-4 px-4 py-4 hover:bg-[color-mix(in_oklab,var(--fg)_6%,transparent)]">
              <span className="label text-fg-muted">All {item.label.toLowerCase()}</span>
              <Arrow />
            </Link>
          </li>
          {item.children?.map((child, i) => (
            <li key={child.href} className="border-t border-rule">
              <Link
                href={child.href}
                aria-current={isCurrent(pathname, child.href) ? 'page' : undefined}
                className="group/link grid grid-cols-[2rem_1fr] items-baseline gap-x-2 px-4 py-4 hover:bg-[color-mix(in_oklab,var(--fg)_6%,transparent)]"
              >
                <span aria-hidden="true" className="label numeral text-signal">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-lg leading-tight">{child.label}</span>
                {child.description ? (
                  <span className="col-start-2 mt-1 text-sm text-fg-muted">{child.description}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

/**
 * Transparent over cinematic heroes (`[data-hero-overlay]`), solid elsewhere.
 * Hides while scrolling down, returns on scroll up.
 */
export function Header({ data }: { data: HeaderData }) {
  const pathname = usePathname()
  const [overlay, setOverlay] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('[data-hero-overlay]')
    // Distance the page must travel in one direction before the header reacts.
    const THRESHOLD = 12
    let anchorY = Math.max(0, window.scrollY)
    let ticking = false

    const update = () => {
      ticking = false
      const y = Math.max(0, window.scrollY) // ignore iOS overscroll bounce
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - 80 : 0
      setOverlay(Boolean(hero) && y < heroEnd)
      setSolid(y > 8)

      const menuOpen = document.documentElement.hasAttribute('data-menu-open')
      if (menuOpen || y < 240) {
        setHidden(false)
        anchorY = y
        return
      }
      // Hysteresis: the anchor only moves once a direction is confirmed, so slow
      // scrolling can never flip the header back and forth between frames.
      const travel = y - anchorY
      if (travel > THRESHOLD) {
        setHidden(true)
        anchorY = y
      } else if (travel < -THRESHOLD) {
        setHidden(false)
        anchorY = y
      }
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  const onDark = overlay
  const logoSrc = data.logoVariant === 'light' || (data.logoVariant === 'auto' && onDark) ? data.logoLight : data.logoDark

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color] duration-500 ease-expo',
        onDark ? 'tone-ink bg-transparent text-fg' : 'tone-snow bg-surface/95 text-fg',
        !onDark && solid && 'border-b border-rule',
        hidden && '-translate-y-full',
      )}
      style={onDark ? { background: 'linear-gradient(180deg, rgb(11 16 22 / 0.45), transparent)' } : undefined}
      // Keyboard users tabbing into a hidden header must be able to see where focus went.
      onFocusCapture={() => setHidden(false)}
    >
      <div className="container-hn flex h-[var(--hn-header)] items-center justify-between gap-6">
        <Link href="/" className="relative z-10 inline-flex items-center" aria-label={`${data.brandName} — home`}>
          {data.logoVariant !== 'text' && logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- small CMS logo, dimensions unknown (SVG/PNG)
            <img src={logoSrc} alt="" className="h-8 w-auto" />
          ) : (
            <Wordmark name={data.brandName} />
          )}
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-2">
            {data.items.map((item) =>
              item.children?.length ? (
                <Dropdown key={item.href} item={item} />
              ) : (
                <li key={item.href}>
                  <NavAnchor
                    link={item}
                    className="label inline-flex h-10 items-center px-3 transition-opacity hover:opacity-70 aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-8"
                  />
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {data.cta ? (
            <Link
              href={data.cta.href}
              className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'hidden sm:inline-flex')}
            >
              {data.cta.label}
            </Link>
          ) : null}
          <MobileMenu data={data} />
        </div>
      </div>
    </header>
  )
}
