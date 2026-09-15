import { cn } from '@/lib/utils'

/** The Heading North antler, redrawn as a single-colour vector so it adapts to any surface. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={cn('size-7', className)}>
      <path
        d="M9 5C7 18 12 30 22 43M13 24C17 20 19 14 18 8M39 5C41 18 36 30 26 43M35 24C31 20 29 14 30 8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Wordmark({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark />
      <span className="font-display text-[0.95rem] font-semibold tracking-[0.12em] uppercase">{name}</span>
    </span>
  )
}
