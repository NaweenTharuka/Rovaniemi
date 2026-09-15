import * as React from 'react'

import { cn, pad } from '@/lib/utils'

export function Badge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn('label inline-flex items-center gap-2 border border-rule px-3 py-1.5 text-fg-muted', className)}
      {...props}
    />
  )
}

export function Separator({ className, ...props }: React.ComponentProps<'hr'>) {
  return <hr className={cn('border-0 border-t border-rule', className)} {...props} />
}

export function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse bg-[color-mix(in_oklab,var(--fg)_8%,transparent)]', className)}
      {...props}
    />
  )
}

/** "01 — The North" style label used to number editorial sections. */
export function SectionLabel({
  index,
  children,
  className,
  as: Tag = 'p',
}: {
  index?: number | string
  children?: React.ReactNode
  className?: string
  /** Use a heading level when the label is the section's only title. */
  as?: 'p' | 'h2' | 'h3'
}) {
  if (index === undefined && !children) return null
  return (
    <Tag className={cn('label flex items-center gap-3 text-fg-muted', className)}>
      {index !== undefined ? (
        <span className="numeral text-signal">{typeof index === 'number' ? pad(index) : index}</span>
      ) : null}
      {index !== undefined && children ? <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" /> : null}
      {children ? <span>{children}</span> : null}
    </Tag>
  )
}

/** Parses an editor-entered label such as "03 — The Journey" into index + text. */
export const parseSectionLabel = (label?: string | null) => {
  if (!label) return null
  const match = label.match(/^\s*(\d{1,2})\s*[—–-]\s*(.+)$/)
  return match ? { index: match[1], text: match[2] } : { index: undefined, text: label }
}

export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}
