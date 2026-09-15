import { Reveal } from '@/components/animations/reveal'
import { RichText } from '@/components/rich-text/rich-text'
import { CmsLink } from '@/components/ui/cms-link'
import { getFaqCategories, getFaqs } from '@/lib/cms/queries'
import type { Faq, FaqBlock as FaqData } from '@/payload-types'

import { FaqExplorer, type FaqView } from './faq-explorer'
import { Section, SectionHeader } from './section'

const plainText = (node: unknown): string => {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; children?: unknown[]; root?: unknown }
  if (n.root) return plainText(n.root)
  return (n.text ?? '') + (n.children ?? []).map(plainText).join(' ')
}

export const toFaqViews = (faqs: Faq[]): FaqView[] =>
  faqs.map((faq) => ({
    id: String(faq.id),
    slug: faq.slug || String(faq.id),
    question: faq.question,
    answer: <RichText data={faq.answer} />,
    answerText: plainText(faq.answer),
    categoryId: faq.category ? String(typeof faq.category === 'object' ? faq.category.id : faq.category) : null,
  }))

export async function FaqBlock({ block }: { block: FaqData }) {
  const categoryIds =
    block.source === 'categories' ? (block.categories ?? []).map((c) => (typeof c === 'object' ? c.id : c)) : undefined
  const ids = block.source === 'manual' ? (block.faqs ?? []).map((f) => (typeof f === 'object' ? f.id : f)) : undefined

  const [faqs, categories] = await Promise.all([
    getFaqs({ featured: block.source === 'featured', categoryIds, ids, limit: block.limit ?? undefined }),
    getFaqCategories(),
  ])
  if (!faqs.length) return null

  const grouped = block.source === 'all' || block.source === 'categories'

  return (
    <Section settings={block}>
      <SectionHeader
        label={block.sectionLabel}
        eyebrow={block.eyebrow}
        heading={block.heading}
        intro={block.intro}
        size="lg"
        className="mb-14 md:mb-20"
      />
      <FaqExplorer
        faqs={toFaqViews(faqs)}
        categories={categories.map((c) => ({ id: String(c.id), title: c.title }))}
        enableSearch={Boolean(block.enableSearch)}
        enableFilters={Boolean(block.enableFilters)}
        grouped={grouped && Boolean(block.enableFilters || block.enableSearch)}
        groupHeading={block.heading ? 'h3' : 'h2'}
      />
      {block.cta ? (
        <Reveal className="container-hn mt-14">
          <CmsLink link={block.cta} appearance="secondary" />
        </Reveal>
      ) : null}
    </Section>
  )
}
