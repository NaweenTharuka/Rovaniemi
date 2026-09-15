'use client'

import { type ElementType, type ReactNode, useEffect, useRef } from 'react'

import { cn, splitLines } from '@/lib/utils'

let sharedObserver: IntersectionObserver | null = null

const observe = (el: Element) => {
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', 'true')
          sharedObserver?.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  )
  sharedObserver.observe(el)
  return () => sharedObserver?.unobserve(el)
}

/**
 * Fades and rises content into view once.
 * - `immediate` (above the fold): pure CSS animation from first paint, no JS needed,
 *   transform only — keeps Largest Contentful Paint fast on slow phones.
 * - otherwise: CSS transition triggered by a shared IntersectionObserver.
 */
export function Reveal({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  immediate = false,
  ...rest
}: {
  as?: ElementType
  children: ReactNode
  className?: string
  delay?: number
  immediate?: boolean
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (immediate || !ref.current) return
    return observe(ref.current)
  }, [immediate])

  return (
    <Tag
      ref={ref}
      className={cn(immediate ? 'reveal-now' : 'reveal', className)}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * Editorial line-mask reveal. Lines come from explicit line breaks in the CMS,
 * so headlines break exactly where the editor intended on every screen size.
 */
export function TextReveal({
  as: Tag = 'h2',
  text,
  className,
  lineClassName,
  immediate = false,
  stagger = 90,
  delay = 0,
  id,
}: {
  as?: ElementType
  text?: string | null
  className?: string
  lineClassName?: string
  immediate?: boolean
  stagger?: number
  delay?: number
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const lines = splitLines(text)

  useEffect(() => {
    if (immediate || !ref.current) return
    return observe(ref.current)
  }, [immediate])

  if (!lines.length) return null

  return (
    <Tag ref={ref} className={className} id={id}>
      {lines.map((line, i) => (
        <span key={`${i}-${line}`} className={cn(immediate ? 'mask-line-now' : 'mask-line', lineClassName)}>
          <span style={{ '--line-delay': `${delay + i * stagger}ms` } as React.CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  )
}
