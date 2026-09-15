'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

import { useMediaQuery, useSaveData } from '@/hooks/use-media'
import { loadGsap, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

export type FrameSource = { urls: string[] }

type Props = {
  desktop: FrameSource
  mobile?: FrameSource | null
  /** Server-rendered poster image; always present underneath the canvas. */
  poster: ReactNode
  captions?: { at: number; text: string }[]
  heading?: ReactNode
  scrollLength?: 'short' | 'medium' | 'long' | null
  label: string
}

const LENGTH = { short: 150, medium: 250, long: 400 }

/** Loads first, last, then keeps bisecting — a coarse animation is available almost immediately. */
const progressiveOrder = (count: number) => {
  const order: number[] = [0, count - 1]
  const seen = new Set(order)
  let step = Math.floor((count - 1) / 2)
  while (step >= 1) {
    for (let i = step; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i)
        order.push(i)
      }
    }
    step = Math.floor(step / 2)
  }
  for (let i = 0; i < count; i++) if (!seen.has(i)) order.push(i)
  return order
}

const saveDataEnabled = () => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection
  return Boolean(connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? ''))
}

/**
 * Scroll-controlled frame sequence rendered to canvas.
 * - Never blocks initial load: frames start fetching after `load`, only when near the viewport.
 * - Lighter frame set on small screens; poster only on Save-Data, 2G and reduced motion.
 */
export function ImageSequence({ desktop, mobile, poster, captions = [], heading, scrollLength, label }: Props) {
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const saveData = useSaveData()
  // Server snapshot assumes motion is allowed; CSS already handles reduced motion before hydration.
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', false)
  const mode: 'animated' | 'static' = saveData || reduced || !desktop.urls.length ? 'static' : 'animated'
  const [caption, setCaption] = useState(-1)

  useEffect(() => {
    const el = section.current
    const cv = canvas.current
    if (!el || !cv) return

    if (mode !== 'animated' || prefersReducedMotion() || saveDataEnabled()) return

    const small = window.matchMedia('(max-width: 47.99rem)').matches
    const urls = (small && mobile?.urls.length ? mobile.urls : desktop.urls).slice()
    const count = urls.length
    const frames: (ImageBitmap | HTMLImageElement | null)[] = new Array(count).fill(null)
    const ctx2d = cv.getContext('2d', { alpha: false })
    let current = 0
    let drawn = -1
    let raf = 0
    let disposed = false
    let cleanupGsap: (() => void) | undefined

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = cv.getBoundingClientRect()
      cv.width = Math.round(rect.width * dpr)
      cv.height = Math.round(rect.height * dpr)
      drawn = -1
      draw()
    }

    const nearestLoaded = (index: number) => {
      for (let d = 0; d < count; d++) {
        if (frames[index - d]) return index - d
        if (frames[index + d]) return index + d
      }
      return -1
    }

    const draw = () => {
      raf = 0
      if (!ctx2d) return
      const index = nearestLoaded(current)
      if (index < 0 || index === drawn) return
      const img = frames[index]!
      const iw = 'naturalWidth' in img ? img.naturalWidth : img.width
      const ih = 'naturalHeight' in img ? img.naturalHeight : img.height
      const scale = Math.max(cv.width / iw, cv.height / ih)
      const w = iw * scale
      const h = ih * scale
      ctx2d.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h)
      drawn = index
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    const loadFrame = async (i: number) => {
      const res = await fetch(urls[i], { priority: 'low' } as RequestInit)
      if (!res.ok) throw new Error(`frame ${i}`)
      const blob = await res.blob()
      if ('createImageBitmap' in window) return createImageBitmap(blob)
      const img = new Image()
      const objectUrl = URL.createObjectURL(blob)
      img.src = objectUrl
      await img.decode()
      URL.revokeObjectURL(objectUrl)
      return img
    }

    const loadAll = async () => {
      const order = progressiveOrder(count)
      const workers = 4
      let cursor = 0
      await Promise.all(
        Array.from({ length: workers }, async () => {
          while (!disposed && cursor < order.length) {
            const i = order[cursor++]
            try {
              frames[i] = await loadFrame(i)
              if (i === 0) setReady(true)
              schedule()
            } catch {
              // A missing frame simply falls back to its nearest neighbour.
            }
          }
        }),
      )
    }

    const start = () => {
      void loadAll()
      void loadGsap().then(({ ScrollTrigger }) => {
        if (disposed) return
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            current = Math.round(self.progress * (count - 1))
            schedule()
            const pct = self.progress * 100
            let active = -1
            captions.forEach((c, idx) => {
              if (pct >= c.at) active = idx
            })
            setCaption(active)
          },
        })
        cleanupGsap = () => st.kill()
      })
    }

    resize()
    window.addEventListener('resize', resize)

    // Wait for the page to finish loading, then only start when the section is near.
    let io: IntersectionObserver | undefined
    const arm = () => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            io?.disconnect()
            start()
          }
        },
        { rootMargin: '150% 0px' },
      )
      io.observe(el)
    }
    if (document.readyState === 'complete') arm()
    else window.addEventListener('load', arm, { once: true })

    return () => {
      disposed = true
      io?.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('load', arm)
      if (raf) cancelAnimationFrame(raf)
      cleanupGsap?.()
      frames.forEach((f) => f && 'close' in f && f.close())
    }
  }, [desktop, mobile, captions, mode])

  return (
    <section
      ref={section}
      aria-label={label}
      className={cn('sequence relative', mode === 'static' && 'is-static')}
      style={{ '--seq-length': `${LENGTH[scrollLength ?? 'medium']}vh` } as React.CSSProperties}
    >
      <div className="sequence__stage">
        <div className="absolute inset-0">{poster}</div>
        <canvas
          ref={canvas}
          aria-hidden="true"
          className={cn(
            'absolute inset-0 size-full transition-opacity duration-700',
            ready && mode === 'animated' ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_16_22/0.55)_0%,rgb(11_16_22/0)_35%,rgb(11_16_22/0)_60%,rgb(11_16_22/0.75)_100%)]" />

        <div className="container-hn relative z-10 flex h-full flex-col justify-between pb-[12vh] pt-[calc(var(--hn-header)+6vh)]">
          <div>{heading}</div>
          {captions.length ? (
            <ol className="sequence__captions relative max-w-3xl">
              {captions.map((c, i) => (
                <li
                  key={`${c.at}-${c.text}`}
                  className={cn(
                    'font-display text-display-md text-fg transition-[opacity,transform] duration-700 ease-expo',
                    mode === 'animated' && 'absolute bottom-0 left-0',
                    mode === 'animated' && i !== caption && 'translate-y-6 opacity-0',
                    mode !== 'animated' && 'mt-4',
                  )}
                >
                  {c.text}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>
    </section>
  )
}
