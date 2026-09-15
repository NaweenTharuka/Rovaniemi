import Link from 'next/link'

import { cn } from '@/lib/utils'

export type Crumb = { name: string; path: string }

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  if (items.length < 2) return null
  return (
    <nav aria-label="Breadcrumb" className={cn('label', className)}>
      <ol className="flex flex-wrap items-center gap-2 text-fg-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-fg">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="link-underline hover:text-fg">
                    {item.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
