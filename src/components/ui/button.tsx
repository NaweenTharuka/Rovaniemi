import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  [
    'group/button relative inline-flex shrink-0 items-center justify-center gap-3 whitespace-nowrap',
    'label transition-[background-color,color,border-color,transform] duration-300 ease-expo',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal',
  ],
  {
    variants: {
      variant: {
        primary: 'rounded-full bg-btn text-btn-fg hover:bg-[color-mix(in_oklab,var(--btn-bg)_86%,var(--surface))]',
        secondary:
          'rounded-full border border-current/30 text-fg hover:border-current hover:bg-[color-mix(in_oklab,var(--fg)_6%,transparent)]',
        link: 'px-0! text-fg after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-expo hover:after:scale-x-100',
        ghost: 'rounded-full text-fg hover:bg-[color-mix(in_oklab,var(--fg)_8%,transparent)]',
      },
      size: {
        sm: 'h-10 px-5',
        md: 'h-12 px-7',
        lg: 'h-14 px-9',
        icon: 'size-12 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

/** Thin editorial arrow; shifts on hover of the parent button/link. */
export function Arrow({ className, direction = 'right' }: { className?: string; direction?: 'right' | 'up-right' | 'down' | 'left' }) {
  const rotate = { right: '', 'up-right': '-rotate-45', down: 'rotate-90', left: 'rotate-180' }[direction]
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 12"
      className={cn(
        'h-3 w-6 shrink-0 transition-transform duration-500 ease-expo group-hover/button:translate-x-1 group-hover/link:translate-x-1',
        rotate,
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  )
}
