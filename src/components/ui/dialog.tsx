'use client'

import { Dialog as DialogPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export function DialogContent({
  className,
  children,
  overlayClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { overlayClassName?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-[80] bg-ink/80 data-[state=closed]:animate-[fade-out_0.3s_ease] data-[state=open]:animate-[fade-in_0.4s_ease]',
          overlayClassName,
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          'tone-ink fixed inset-0 z-[90] flex flex-col bg-surface text-fg outline-none',
          'data-[state=closed]:animate-[fade-out_0.3s_ease] data-[state=open]:animate-[fade-in_0.4s_ease]',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function CloseButton({ className, label = 'Close' }: { className?: string; label?: string }) {
  return (
    <DialogPrimitive.Close
      className={cn(
        'label inline-flex h-11 items-center gap-3 rounded-full px-4 text-fg transition-colors hover:bg-[color-mix(in_oklab,var(--fg)_8%,transparent)]',
        className,
      )}
    >
      {label}
      <span aria-hidden="true" className="relative size-3.5 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:rotate-45 before:bg-current after:absolute after:inset-x-0 after:top-1/2 after:h-px after:-rotate-45 after:bg-current" />
    </DialogPrimitive.Close>
  )
}
