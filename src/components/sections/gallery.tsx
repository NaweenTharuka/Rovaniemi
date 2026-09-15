'use client'

import Image from 'next/image'
import { type ReactNode, useCallback, useEffect, useState } from 'react'

import { Arrow } from '@/components/ui/button'
import { CloseButton, Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn, pad } from '@/lib/utils'

export type GalleryItem = {
  id: string
  thumb: ReactNode
  full: string
  alt: string
  caption?: string | null
  credit?: string | null
  width?: number | null
  height?: number | null
}

/**
 * Editorial rhythm, decided by position and total count so the grid always fills:
 * - groups of three: one large tile beside two stacked tiles, mirrored on alternate groups;
 * - two leftovers share a row, one leftover becomes a wide cinematic band.
 * On desktop, rows have a fixed height and tiles fill them (no aspect ratios to fight the grid).
 */
const tileClass = (i: number, count: number) => {
  const fullGroups = Math.floor(count / 3) * 3
  const leftover = count - fullGroups

  if (i >= fullGroups) {
    return leftover === 1
      ? 'col-span-4 aspect-[16/9] md:col-span-12 md:aspect-auto md:row-span-2'
      : 'col-span-2 aspect-square md:col-span-6 md:aspect-auto md:row-span-2'
  }

  const group = Math.floor(i / 3)
  const pos = i % 3
  const mirrored = group % 2 === 1
  if (pos === 0) {
    return cn('col-span-4 aspect-[4/3] md:col-span-7 md:row-span-2 md:aspect-auto', mirrored && 'md:col-start-6')
  }
  return cn('col-span-2 aspect-square md:col-span-5 md:aspect-auto', mirrored && 'md:col-start-1')
}

/** Editorial mosaic or horizontal strip with an accessible, keyboard-navigable lightbox. */
export function Gallery({ items, layout = 'editorial', label }: { items: GalleryItem[]; layout?: 'editorial' | 'strip' | null; label: string }) {
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null
  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  if (!items.length) return null
  const current = index !== null ? items[index] : null

  return (
    <>
      <ul
        aria-label={label}
        className={cn(
          layout === 'strip'
            ? 'scrollbar-none flex snap-x snap-mandatory gap-[var(--hn-gutter)] overflow-x-auto px-[var(--hn-margin)]'
            : 'container-hn grid grid-cols-4 gap-[var(--hn-gutter)] md:grid-flow-row-dense md:grid-cols-12 md:auto-rows-[clamp(10rem,17vw,20rem)]',
        )}
      >
        {items.map((item, i) => (
          <li
            key={item.id}
            className={cn(
              'relative',
              layout === 'strip' ? 'aspect-[3/4] w-[70vw] shrink-0 snap-start sm:w-[40vw] lg:w-[26vw]' : tileClass(i, items.length),
            )}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group/g absolute inset-0 overflow-hidden focus-visible:outline-offset-2"
              aria-label={`Open image ${i + 1} of ${items.length}${item.alt ? `: ${item.alt}` : ''}`}
            >
              <span className="absolute inset-0 transition-transform duration-[1.2s] ease-expo group-hover/g:scale-105">
                {item.thumb}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={(v) => !v && setIndex(null)}>
        <DialogContent className="bg-ink">
          <DialogTitle className="sr-only">Image viewer</DialogTitle>
          <DialogDescription className="sr-only">Use the arrow keys to move between images.</DialogDescription>
          <div className="container-hn flex h-[var(--hn-header)] shrink-0 items-center justify-between">
            <p className="label numeral text-fg-muted" aria-live="polite">
              {index !== null ? `${pad(index + 1)} / ${pad(items.length)}` : null}
            </p>
            <CloseButton />
          </div>
          {current ? (
            <figure className="relative flex min-h-0 flex-1 flex-col px-[var(--hn-margin)] pb-6">
              <div className="relative min-h-0 flex-1">
                <Image
                  key={current.id}
                  src={current.full}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className="animate-[fade-in_0.5s_ease] object-contain"
                />
              </div>
              <div className="mt-4 flex items-end justify-between gap-6">
                <figcaption className="text-sm text-fg-muted">
                  {current.caption}
                  {current.credit ? <span className="mt-1 block text-xs opacity-70">{current.credit}</span> : null}
                </figcaption>
                {items.length > 1 ? (
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="group/button inline-flex size-12 items-center justify-center rounded-full border border-rule hover:border-fg">
                      <Arrow direction="left" />
                    </button>
                    <button type="button" onClick={() => go(1)} aria-label="Next image" className="group/button inline-flex size-12 items-center justify-center rounded-full border border-rule hover:border-fg">
                      <Arrow />
                    </button>
                  </div>
                ) : null}
              </div>
            </figure>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
