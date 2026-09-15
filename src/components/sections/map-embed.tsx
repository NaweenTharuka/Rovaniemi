'use client'

import { useState } from 'react'

import { Arrow, Button } from '@/components/ui/button'

/**
 * Click-to-load map: Google Maps sets third-party cookies, so nothing is
 * requested from Google until the visitor explicitly asks for the map.
 */
export function MapEmbed({ query, externalUrl }: { query: string; externalUrl?: string | null }) {
  const [loaded, setLoaded] = useState(false)
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
  const link = externalUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

  return (
    <div className="tone-ink relative aspect-[4/5] overflow-hidden bg-surface text-fg sm:aspect-[16/9] lg:aspect-[21/8]">
      {loaded ? (
        <iframe
          title={`Map of ${query}`}
          src={src}
          className="absolute inset-0 size-full border-0 grayscale-[0.4]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="grain absolute inset-0 flex flex-col items-start justify-end gap-6 p-8 md:p-12">
          <svg aria-hidden="true" className="absolute inset-0 size-full opacity-[0.12]" preserveAspectRatio="none" viewBox="0 0 400 200">
            {Array.from({ length: 14 }, (_, i) => (
              <path key={i} d={`M0 ${20 + i * 13} C 90 ${10 + i * 13}, 160 ${40 + i * 12}, 400 ${14 + i * 13}`} stroke="currentColor" strokeWidth="0.5" fill="none" />
            ))}
          </svg>
          <div className="relative z-10">
            <p className="label text-fg-muted">Location</p>
            <p className="mt-3 font-display text-display-md">{query}</p>
            <p className="mt-3 max-w-md text-sm text-fg-muted">The map is provided by Google and loads only when you choose to view it.</p>
          </div>
          <div className="relative z-10 flex flex-wrap items-center gap-6">
            <Button type="button" onClick={() => setLoaded(true)}>
              Show map
            </Button>
            <a href={link} target="_blank" rel="noopener noreferrer" className="group/button label inline-flex items-center gap-3">
              Open in Google Maps
              <Arrow direction="up-right" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
