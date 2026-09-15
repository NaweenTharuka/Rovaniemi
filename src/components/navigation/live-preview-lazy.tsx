'use client'

import dynamic from 'next/dynamic'

/** Only editors in draft mode need the live-preview bridge; keep it out of every visitor's bundle. */
export const LazyLivePreviewListener = dynamic(
  () => import('./live-preview').then((mod) => mod.LivePreviewListener),
  { ssr: false },
)
