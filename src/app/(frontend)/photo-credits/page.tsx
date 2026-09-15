import type { Metadata } from 'next'

import { Reveal, TextReveal } from '@/components/animations/reveal'
import { CmsImage } from '@/components/media/cms-image'
import { SectionLabel } from '@/components/ui/primitives'
import { getCreditedMedia, getSettings } from '@/lib/cms/queries'
import { isVideo, mediaUrl } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    ...buildMetadata({ settings, path: '/photo-credits', fallbackTitle: 'Photo credits' }),
    robots: { index: false, follow: true },
  }
}

/** Edited videos combine several sources: their description lists every source URL. */
function SourceLinks({ text }: { text: string }) {
  const urls = text.match(/https:\/\/[^\s,]+/g) ?? []
  if (!urls.length) return null
  return (
    <p className="mt-1 text-fg-muted">
      Sources:{' '}
      {urls.map((url, i) => (
        <span key={url}>
          {i ? ', ' : null}
          <a href={url} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
            {i + 1}
          </a>
        </span>
      ))}
    </p>
  )
}

/**
 * Attribution for every credited image in the media library (required by
 * Creative Commons licences). Generated from the CMS — no manual upkeep.
 */
export default async function PhotoCreditsPage() {
  const media = await getCreditedMedia()

  return (
    <section className="tone-snow bg-surface pb-[var(--hn-section)] pt-[calc(var(--hn-header)+clamp(3rem,9vw,8rem))] text-fg">
      <div className="container-hn">
        <SectionLabel className="mb-10 border-t border-rule pt-5">Photography</SectionLabel>
        <TextReveal as="h1" text="Photo credits" immediate className="text-display-lg text-fg" />
        <Reveal immediate delay={200}>
          <p className="mt-8 max-w-2xl text-lead text-fg-muted">
            Photographs and video on this website are used under the licences listed below. Thank you to the photographers who
            share their work.
          </p>
        </Reveal>

        {media.length ? (
          <ul className="mt-16 grid gap-x-[var(--hn-gutter)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((m) => (
              <li key={m.id} className="grid grid-cols-[6rem_1fr] gap-4 border-t border-rule pt-5">
                <div className="relative aspect-square overflow-hidden">
                  {isVideo(m) ? (
                    <video
                      src={`${mediaUrl(m)}#t=0.1`}
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    <CmsImage media={m} sizes="96px" sourceWidth={480} alt="" />
                  )}
                </div>
                <div className="text-sm">
                  <p className="text-fg">{m.title || m.alt}</p>
                  {m.caption ? <p className="mt-1 text-fg-muted">{m.caption}</p> : null}
                  <p className="mt-2 text-fg-muted">
                    {isVideo(m) ? 'Video' : 'Photo'}:{' '}
                    {m.sourceUrl ? (
                      <a href={m.sourceUrl} className="text-fg underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                        {m.credit}
                      </a>
                    ) : (
                      <span className="text-fg">{m.credit}</span>
                    )}
                  </p>
                  {isVideo(m) && m.description ? <SourceLinks text={m.description} /> : null}
                  {m.license ? (
                    <p className="mt-1 text-fg-muted">
                      Licence:{' '}
                      {m.licenseUrl ? (
                        <a href={m.licenseUrl} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                          {m.license}
                        </a>
                      ) : (
                        m.license
                      )}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-16 text-fg-muted">No credited images yet.</p>
        )}
      </div>
    </section>
  )
}
