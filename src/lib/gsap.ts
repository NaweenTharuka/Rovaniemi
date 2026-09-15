'use client'

type GsapBundle = {
  gsap: typeof import('gsap').gsap
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
}

let bundle: Promise<GsapBundle> | null = null

/**
 * GSAP is only needed by scroll-story islands, so it is fetched on demand
 * instead of shipping in every page's initial JavaScript.
 */
export const loadGsap = () => {
  bundle ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger)
    g.gsap.defaults({ ease: 'expo.out', duration: 0.9 })
    st.ScrollTrigger.config({ ignoreMobileResize: true })
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger }
  })
  return bundle
}

/**
 * Runs `callback` on the first scroll/touch/key interaction, or once the browser is
 * idle (max 3 s). Scroll effects are invisible before the first scroll, so there is
 * no reason to spend main-thread time on them during page load.
 */
export const whenInteractive = (callback: () => void) => {
  let done = false
  const events = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const
  // Safari has no requestIdleCallback; fall back to a plain timeout.
  const hasIdle = typeof window.requestIdleCallback === 'function'

  const cleanup = () => {
    events.forEach((e) => window.removeEventListener(e, run))
    if (hasIdle) window.cancelIdleCallback(handle)
    else window.clearTimeout(handle)
  }
  const run = () => {
    if (done) return
    done = true
    cleanup()
    callback()
  }

  const handle = hasIdle ? window.requestIdleCallback(run, { timeout: 3000 }) : window.setTimeout(run, 3000)
  events.forEach((e) => window.addEventListener(e, run, { passive: true, once: true }))
  return cleanup
}

/** The bundle if some island already requested it — never triggers a download. */
export const peekGsap = () => bundle

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
