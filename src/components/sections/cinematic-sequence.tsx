import { ImageSequence } from '@/components/animations/image-sequence'
import { TextReveal } from '@/components/animations/reveal'
import { CmsImage } from '@/components/media/cms-image'
import { parseSectionLabel, SectionLabel } from '@/components/ui/primitives'
import { withBasePath } from '@/lib/base-path'
import { mediaUrl } from '@/lib/media'
import type { CinematicSequenceBlock as SequenceBlockData } from '@/payload-types'

const expand = (pattern?: string | null, count?: number | null, padding = 3, start = 1) => {
  if (!pattern || !count || !pattern.includes('{index}')) return []
  return Array.from({ length: count }, (_, i) => withBasePath(pattern.replace('{index}', String(start + i).padStart(padding, '0'))))
}

export function CinematicSequenceBlock({ block }: { block: SequenceBlockData }) {
  const label = parseSectionLabel(block.sectionLabel)
  const desktop =
    block.source === 'media'
      ? (block.frames ?? []).map((f) => mediaUrl(f, 1440)).filter((u): u is string => Boolean(u))
      : expand(block.framePattern, block.frameCount, block.indexPadding ?? 3, block.startIndex ?? 1)
  const mobile =
    block.source === 'media'
      ? (block.frames ?? []).filter((_, i) => i % 2 === 0).map((f) => mediaUrl(f, 960)).filter((u): u is string => Boolean(u))
      : expand(block.mobileFramePattern, block.mobileFrameCount, block.indexPadding ?? 3, block.startIndex ?? 1)

  return (
    <div id={block.anchorId || undefined} className="tone-ink relative bg-surface text-fg">
      <ImageSequence
        label={block.heading?.replace(/\n/g, ' ') || 'Cinematic sequence'}
        desktop={{ urls: desktop }}
        mobile={mobile.length ? { urls: mobile } : null}
        poster={<CmsImage media={block.poster} sizes="100vw" sourceWidth={2048} />}
        scrollLength={block.scrollLength}
        captions={(block.captions ?? []).map((c) => ({ at: c.at, text: c.text })).sort((a, b) => a.at - b.at)}
        heading={
          <div className="max-w-3xl">
            {label || block.eyebrow ? <SectionLabel index={label?.index}>{label?.text ?? block.eyebrow}</SectionLabel> : null}
            <TextReveal text={block.heading} className="mt-6 text-display-lg text-fg" />
            {block.body ? <p className="mt-6 max-w-lg text-lead text-snow/85">{block.body}</p> : null}
          </div>
        }
      />
    </div>
  )
}
