'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { usePrefersReducedMotion, useSaveData } from '@/hooks/use-media'

/**
 * Muted ambient loop. Never loads on Save-Data connections or for
 * reduced-motion visitors (they keep the poster), and pauses off-screen.
 */
export function AmbientVideo({
  src,
  poster,
  className,
  type = 'video/mp4',
}: {
  src: string
  poster?: string | null
  className?: string
  type?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = usePrefersReducedMotion()
  const saveData = useSaveData()
  // Server snapshot of reduced motion is "reduce", so the video only mounts on capable clients.
  const enabled = !reduced && !saveData

  useEffect(() => {
    const video = ref.current
    if (!video || !enabled) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined)
        else video.pause()
      },
      { threshold: 0.1 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [enabled])

  // The server-rendered image underneath already acts as the poster.
  if (!enabled) return null

  return (
    <video
      ref={ref}
      className={cn('absolute inset-0 size-full object-cover', className)}
      poster={poster ?? undefined}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    >
      <source src={src} type={type} />
    </video>
  )
}
