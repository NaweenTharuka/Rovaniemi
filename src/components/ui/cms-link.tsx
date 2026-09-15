import Link from 'next/link'
import type * as React from 'react'

import { withBasePath } from '@/lib/base-path'
import { type CmsLink as CmsLinkData, resolveLink, type ResolvedLink } from '@/lib/links'
import { cn } from '@/lib/utils'

import { Arrow, buttonVariants } from './button'

type Props = {
  link?: CmsLinkData | ResolvedLink | null
  appearance?: 'primary' | 'secondary' | 'link'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  arrow?: boolean
  children?: React.ReactNode
}

const isResolved = (link: CmsLinkData | ResolvedLink): link is ResolvedLink =>
  typeof (link as ResolvedLink).href === 'string'

export function CmsLink({ link, appearance, size = 'md', className, arrow = true, children }: Props) {
  if (!link) return null
  const resolved = isResolved(link) ? link : resolveLink(link)
  if (!resolved) return null

  const variant = appearance ?? resolved.appearance
  const external = resolved.external || resolved.newTab
  const content = (
    <>
      <span>{children ?? resolved.label}</span>
      {arrow ? <Arrow direction={resolved.external ? 'up-right' : 'right'} /> : null}
      {resolved.newTab ? <span className="sr-only">(opens in a new tab)</span> : null}
    </>
  )
  const classes = cn(buttonVariants({ variant, size }), className)

  if (external || /^(mailto:|tel:)/.test(resolved.href)) {
    return (
      <a
        href={withBasePath(resolved.href)}
        className={classes}
        target={resolved.newTab ? '_blank' : undefined}
        rel={resolved.newTab ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    )
  }
  return (
    <Link href={resolved.href} className={classes}>
      {content}
    </Link>
  )
}
