'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Arrow, buttonVariants } from '@/components/ui/button'
import { CloseButton, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn, pad } from '@/lib/utils'

import { Wordmark } from './brand-mark'
import type { HeaderData } from './types'

export function MobileMenu({ data }: { data: HeaderData }) {
  const pathname = usePathname()
  // Keyed to the route: following a link closes the menu without an extra render pass.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null)
  useEffect(() => {
    if (open) document.documentElement.setAttribute('data-menu-open', '')
    else document.documentElement.removeAttribute('data-menu-open')
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="label inline-flex h-10 items-center gap-3 rounded-full px-3 transition-opacity hover:opacity-70 lg:hidden"
        aria-label="Open menu"
      >
        <span>Menu</span>
        <span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-3/5 self-end bg-current" />
        </span>
      </DialogTrigger>

      <DialogContent className="grain overflow-y-auto">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <DialogDescription className="sr-only">Site navigation and contact details</DialogDescription>

        <div className="container-hn relative z-10 flex h-[var(--hn-header)] shrink-0 items-center justify-between">
          <Link href="/" aria-label={`${data.brandName} — home`}>
            <Wordmark name={data.brandName} />
          </Link>
          <CloseButton />
        </div>

        <nav aria-label="Mobile" className="container-hn relative z-10 flex flex-1 flex-col pt-8">
          <ul>
            {data.items.map((item, i) => (
              <li key={item.href} className="menu-rise border-b border-rule" style={{ '--i': i } as React.CSSProperties}>
                <Link
                  href={item.href}
                  className="group/link flex items-baseline gap-4 py-5"
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  <span className="label numeral w-6 text-signal">{pad(i + 1)}</span>
                  <span className="font-display text-display-md">{item.label}</span>
                </Link>
                {item.children?.length ? (
                  <ul className="-mt-2 grid gap-1 pb-5 pl-10">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="inline-block py-1.5 text-lead text-fg-muted hover:text-fg">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="menu-rise mt-auto grid gap-8 pb-10 pt-12" style={{ '--i': data.items.length } as React.CSSProperties}>
            {data.cta ? (
              <Link href={data.cta.href} className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
                {data.cta.label}
                <Arrow />
              </Link>
            ) : null}
            <dl className="grid gap-4 text-sm">
              {data.contact.email ? (
                <div className="flex justify-between gap-4 border-t border-rule pt-4">
                  <dt className="label text-fg-muted">Email</dt>
                  <dd>
                    <a href={`mailto:${data.contact.email}`} className="link-underline">
                      {data.contact.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {data.contact.whatsappHref ? (
                <div className="flex justify-between gap-4 border-t border-rule pt-4">
                  <dt className="label text-fg-muted">WhatsApp</dt>
                  <dd>
                    <a href={data.contact.whatsappHref} className="link-underline" target="_blank" rel="noopener noreferrer">
                      {data.contact.whatsapp}
                    </a>
                  </dd>
                </div>
              ) : null}
              {data.contact.location ? (
                <div className="flex justify-between gap-4 border-t border-rule pt-4">
                  <dt className="label text-fg-muted">Based in</dt>
                  <dd>{data.contact.location}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </nav>
      </DialogContent>
    </Dialog>
  )
}
