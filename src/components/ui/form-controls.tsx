import { Label as LabelPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

const fieldBase = [
  'w-full rounded-[2px] border-0 border-b border-rule bg-transparent px-0 py-3 text-lead text-fg',
  'placeholder:text-fg-subtle transition-[border-color] duration-300',
  // Focus = full-contrast 2px underline (border + inset shadow), clearer than a faint outline on a borderless field.
  'hover:border-current/40 focus:border-fg focus:shadow-[0_1px_0_0_var(--fg)] focus:outline-none focus-visible:outline-none',
  'aria-[invalid=true]:border-danger',
  'disabled:opacity-50',
].join(' ')

export function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={cn('label block text-fg-muted', className)} {...props} />
}

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return <input className={cn(fieldBase, className)} {...props} />
}

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea className={cn(fieldBase, 'min-h-32 resize-y text-body', className)} {...props} />
}

/**
 * Native select, styled. Native controls give the best mobile pickers,
 * autofill and screen-reader support for booking forms.
 */
export function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select className={cn(fieldBase, 'appearance-none pr-8', className)} {...props}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-1 top-1/2 h-2 w-3 -translate-y-1/2 text-fg-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path d="M1 1.5l5 5 5-5" />
      </svg>
    </div>
  )
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-danger">
      {message}
    </p>
  )
}
