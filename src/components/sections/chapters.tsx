import { ChapterScroller, type ChapterView } from '@/components/animations/chapter-scroller'
import { CmsImage } from '@/components/media/cms-image'
import { CmsLink } from '@/components/ui/cms-link'
import type { ChaptersBlock as ChaptersBlockData } from '@/payload-types'

export function ChaptersBlock({ block }: { block: ChaptersBlockData }) {
  const chapters: ChapterView[] = (block.chapters ?? []).map((chapter, i) => ({
    id: `chapter-${block.id ?? 'x'}-${i}`,
    label: chapter.label,
    title: chapter.title,
    body: chapter.body,
    details: chapter.details?.map((d) => ({ value: d.value, label: d.label })) ?? null,
    image: <CmsImage media={chapter.image} sizes="100vw" sourceWidth={2048} />,
    cta: chapter.cta ? <CmsLink link={chapter.cta} appearance="secondary" /> : null,
  }))

  if (!chapters.length) return null

  return (
    <section
      id={block.anchorId || undefined}
      aria-label={block.sectionLabel || 'Our story'}
      className="tone-ink grain relative bg-surface text-fg"
    >
      <div className="relative z-10">
        <ChapterScroller chapters={chapters} intro={block.intro} />
      </div>
    </section>
  )
}
