'use client'

import { Accordion as AccordionPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

export const Accordion = AccordionPrimitive.Root

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn('border-b border-rule', className)} {...props} />
}

export function AccordionTrigger({
  className,
  children,
  prefix,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { prefix?: React.ReactNode }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group/acc flex flex-1 items-baseline gap-4 py-6 text-left text-title text-fg transition-colors md:gap-8 md:py-8',
          'hover:text-fg-muted focus-visible:outline-offset-[-2px]',
          className,
        )}
        {...props}
      >
        {prefix ? <span className="label numeral w-8 shrink-0 text-fg-subtle">{prefix}</span> : null}
        <span className="flex-1 font-display">{children}</span>
        <span
          aria-hidden="true"
          className="relative mt-2 size-4 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-current after:transition-transform after:duration-500 after:ease-expo group-data-[state=open]/acc:after:scale-y-0"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-[acc-up_0.4s_var(--ease-out-expo)] data-[state=open]:animate-[acc-down_0.5s_var(--ease-out-expo)]"
      {...props}
    >
      <div className={cn('pb-8 md:pl-16', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}
