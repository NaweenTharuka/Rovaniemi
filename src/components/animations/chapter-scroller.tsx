'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

import { loadGsap, prefersReducedMotion, whenInteractive } from '@/lib/gsap'
import { cn, pad } from '@/lib/utils'

export type ChapterView = {
  id: string
  label?: string | null
  title: string
  body?: string | null
  details?: { value: string; label: string }[] | null
  image: ReactNode
  cta?: ReactNode
}

/**
 * Pinned, scroll-scrubbed chapter story.
 *
 * Layout is decided by CSS (see `.chapters` rules below) so there is no layout
 * shift at hydration: desktop + motion + JS → sticky stage with stacked layers;
 * everything else → chapters flow as normal stacked sections.
 * GSAP only drives the crossfades once loaded.
 */
export function ChapterScroller({ chapters, intro }: { chapters: ChapterView[]; intro?: string | null }) {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = root.current
    if (!el || chapters.length < 2 || prefersReducedMotion()) return
    const desktop = window.matchMedia('(min-width: 64rem)')
    if (!desktop.matches) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    const cancelWait = whenInteractive(() => void loadGsap().then(({ gsap }) => {
      if (cancelled) return
      const ctx = gsap.context(() => {
        const images = gsap.utils.toArray<HTMLElement>('[data-chapter-image]', el)
        const texts = gsap.utils.toArray<HTMLElement>('[data-chapter-text]', el)
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            // Each transition spans [i + 0.55, i + 1]; switch the rail at its midpoint.
            onUpdate: (self) => {
              const time = self.progress * tl.duration()
              setActive(Math.max(0, Math.min(chapters.length - 1, Math.floor(time + 0.25))))
            },
          },
        })

        images.forEach((img, i) => {
          if (i === 0) return
          gsap.set(img, { clipPath: 'inset(100% 0% 0% 0%)' })
          gsap.set(img.firstElementChild, { scale: 1.2 })
          gsap.set(texts[i], { opacity: 0, y: 60 })
        })

        for (let i = 0; i < chapters.length; i++) {
          const at = i
          // Hold each chapter, then transition to the next.
          tl.to({}, { duration: 0.55 }, at)
          if (i === chapters.length - 1) break
          const t = at + 0.55
          tl.to(texts[i], { opacity: 0, y: -60, duration: 0.3 }, t)
            .to(images[i].firstElementChild, { scale: 1.08, duration: 0.45 }, t)
            .to(images[i + 1], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45 }, t)
            .to(images[i + 1].firstElementChild, { scale: 1, duration: 0.45 }, t)
            .to(texts[i + 1], { opacity: 1, y: 0, duration: 0.3 }, t + 0.15)
        }

        // Text stays in the accessibility tree (opacity only). When keyboard focus
        // lands in a chapter that is not on screen, scroll the story to it.
        const onFocus = (event: FocusEvent) => {
          const index = texts.findIndex((t) => t.contains(event.target as Node))
          const st = tl.scrollTrigger
          if (index < 0 || !st) return
          const target = st.start + ((st.end - st.start) * (index + 0.2)) / tl.duration()
          window.scrollTo({ top: target, behavior: 'auto' })
        }
        el.addEventListener('focusin', onFocus)
        return () => el.removeEventListener('focusin', onFocus)
      }, el)
      cleanup = () => ctx.revert()
    }))

    return () => {
      cancelled = true
      cancelWait()
      cleanup?.()
    }
  }, [chapters.length])

  return (
    <div
      ref={root}
      className="chapters"
      style={{ '--chapters': chapters.length } as React.CSSProperties}
    >
      <div className="chapters__stage">
        {intro ? <p className="chapters__intro label text-fg-muted">{intro}</p> : null}

        {chapters.map((chapter, i) => (
          <article key={chapter.id} className="chapters__item" aria-labelledby={`${chapter.id}-title`}>
            <div className="chapters__image" data-chapter-image>
              <div className="absolute inset-0">{chapter.image}</div>
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgb(11_16_22/0.92)_0%,rgb(11_16_22/0.55)_55%,rgb(11_16_22/0.2)_100%)] lg:bg-[linear-gradient(90deg,rgb(11_16_22/0.88)_0%,rgb(11_16_22/0.55)_45%,rgb(11_16_22/0.05)_85%)]" />
            </div>

            <div className="chapters__text container-hn" data-chapter-text>
              <div className="max-w-2xl">
                <p className="label mb-6 flex items-center gap-3 text-fg-muted">
                  <span className="numeral text-signal">Chapter {pad(i + 1)}</span>
                  {chapter.label ? (
                    <>
                      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
                      <span>{chapter.label}</span>
                    </>
                  ) : null}
                </p>
                <h2 id={`${chapter.id}-title`} className="text-display-xl text-fg">
                  {chapter.title}
                </h2>
                {chapter.body ? <p className="mt-8 max-w-xl text-lead text-snow/85">{chapter.body}</p> : null}
                {chapter.details?.length ? (
                  <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-6 border-t border-rule pt-6">
                    {chapter.details.map((d) => (
                      <div key={`${d.value}-${d.label}`}>
                        <dt className="sr-only">{d.label}</dt>
                        <dd className="font-display text-title text-fg">{d.value}</dd>
                        <dd aria-hidden="true" className="label mt-2 text-snow/75">
                          {d.label}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {chapter.cta ? <div className="mt-10">{chapter.cta}</div> : null}
              </div>
            </div>
          </article>
        ))}

        <ol className="chapters__rail" aria-hidden="true">
          {chapters.map((chapter, i) => (
            <li key={chapter.id} className={cn('label numeral', i === active && 'is-active')}>
              {pad(i + 1)}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
