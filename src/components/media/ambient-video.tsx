'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { useMediaQuery, usePrefersReducedMotion, useSaveData } from '@/hooks/use-media'

/**
 * Muted ambient loop. Never loads on Save-Data connections or for
 * reduced-motion visitors (they keep the poster), and pauses off-screen.
 * Phones get `mobileSrc` when provided. The video fades in once it is actually
 * playing, so the image underneath never flashes to black while it buffers.
 */
export function AmbientVideo({
  src,
  mobileSrc,
  poster,
  className,
  type = 'video/mp4',
}: {
  src: string
  mobileSrc?: string | null
  poster?: string | null
  className?: string
  type?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = usePrefersReducedMotion()
  const saveData = useSaveData()
  const isPhone = useMediaQuery('(max-width: 47.99rem)', false)
  const [playing, setPlaying] = useState(false)
  // Server snapshot of reduced motion is "reduce", so the video only mounts on capable clients.
  const enabled = !reduced && !saveData
  const source = isPhone && mobileSrc ? mobileSrc : src

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
  }, [enabled, source])

  // The server-rendered image underneath already acts as the poster.
  if (!enabled) return null

  return (
    <video
      key={source}
      ref={ref}
      className={cn(
        'absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-out',
        playing ? 'opacity-100' : 'opacity-0',
        className,
      )}
      poster={poster ?? undefined}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
    >
      <source src={source} type={type} />
    </video>
  )
}
