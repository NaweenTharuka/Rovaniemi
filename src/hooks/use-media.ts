'use client'

import { useSyncExternalStore } from 'react'

const subscribeQuery = (query: string) => (callback: () => void) => {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

/** SSR-safe media query hook. `serverValue` is used during server render and hydration. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeQuery(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)', true)

/** Precise pointer that can hover — cursor effects only make sense here. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)', false)

export const useIsDesktop = () => useMediaQuery('(min-width: 64rem)', false)

type NetworkInformation = { saveData?: boolean; effectiveType?: string }

export function useSaveData() {
  return useSyncExternalStore(
    () => () => undefined,
    () => {
      const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
      return Boolean(connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? ''))
    },
    () => false,
  )
}
