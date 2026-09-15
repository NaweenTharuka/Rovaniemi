'use client'

import { type ReactNode, useDeferredValue, useEffect, useMemo, useState } from 'react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn, pad } from '@/lib/utils'

export type FaqView = {
  id: string
  slug: string
  question: string
  answer: ReactNode
  answerText: string
  categoryId: string | null
}

type Category = { id: string; title: string }

function CopyLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="label mt-6 inline-flex items-center gap-2 text-fg-muted hover:text-fg"
      onClick={async () => {
        const url = `${window.location.origin}${window.location.pathname}#${slug}`
        try {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 2000)
        } catch {
          window.location.hash = slug
        }
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M6.5 9.5l3-3M7 4.5l1-1a2.8 2.8 0 014 4l-1 1M9 11.5l-1 1a2.8 2.8 0 01-4-4l1-1" />
      </svg>
      <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
    </button>
  )
}

/**
 * Searchable, filterable FAQ. Each question is deep-linkable (#slug):
 * opening a link scrolls to and expands the question.
 */
export function FaqExplorer({
  faqs,
  categories,
  enableSearch,
  enableFilters,
  grouped,
  groupHeading: GroupHeading = 'h3',
}: {
  faqs: FaqView[]
  categories: Category[]
  enableSearch: boolean
  enableFilters: boolean
  grouped: boolean
  /** h2 when the FAQ list is the page's main content (no section heading above it). */
  groupHeading?: 'h2' | 'h3'
}) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [category, setCategory] = useState<string | null>(null)
  const [open, setOpen] = useState<string[]>([])

  useEffect(() => {
    const openFromHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1))
      if (!slug || !faqs.some((f) => f.slug === slug)) return
      setCategory(null)
      setQuery('')
      setOpen((prev) => (prev.includes(slug) ? prev : [...prev, slug]))
      requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView({ block: 'start' }))
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [faqs])

  const usedCategories = useMemo(
    () => categories.filter((c) => faqs.some((f) => f.categoryId === c.id)),
    [categories, faqs],
  )

  const results = useMemo(() => {
    const terms = deferredQuery.toLowerCase().split(/\s+/).filter(Boolean)
    return faqs.filter((f) => {
      if (category && f.categoryId !== category) return false
      if (!terms.length) return true
      const haystack = `${f.question} ${f.answerText}`.toLowerCase()
      return terms.every((t) => haystack.includes(t))
    })
  }, [faqs, deferredQuery, category])

  const groups: { category: Category | null; items: FaqView[] }[] = grouped
    ? usedCategories
        .map((c) => ({ category: c, items: results.filter((f) => f.categoryId === c.id) }))
        .filter((g) => g.items.length)
    : [{ category: null, items: results }]
  const uncategorised = grouped ? results.filter((f) => !f.categoryId) : []
  if (uncategorised.length) groups.push({ category: null, items: uncategorised })

  const order = groups.flatMap((g) => g.items.map((f) => f.id))

  return (
    <div className="container-hn">
      {enableSearch || (enableFilters && usedCategories.length > 1) ? (
        <div className="mb-14 grid gap-8 lg:grid-cols-12 lg:items-end">
          {enableSearch ? (
            <div className="lg:col-span-5">
              <label htmlFor="faq-search" className="label text-fg-muted">
                Search questions
              </label>
              <div className="mt-2 flex items-center gap-3 border-b border-rule focus-within:border-fg">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3.5 3.5" />
                </svg>
                <input
                  id="faq-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pickup, clothing, Northern Lights…"
                  className="min-w-0 flex-1 bg-transparent py-3 text-lead text-fg outline-none placeholder:text-fg-subtle"
                  autoComplete="off"
                />
              </div>
            </div>
          ) : null}
          {enableFilters && usedCategories.length > 1 ? (
            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2 lg:col-span-7 lg:justify-end">
              {[null, ...usedCategories].map((c) => {
                const selected = category === (c?.id ?? null)
                return (
                  <button
                    key={c?.id ?? 'all'}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setCategory(c?.id ?? null)}
                    className={cn(
                      'label h-10 rounded-full border px-4 transition-colors',
                      selected ? 'border-fg bg-fg text-surface' : 'border-rule text-fg-muted hover:border-fg hover:text-fg',
                    )}
                  >
                    {c?.title ?? 'All'}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {results.length} {results.length === 1 ? 'question' : 'questions'} shown
      </p>

      {results.length === 0 ? (
        <div className="border-t border-rule py-16">
          <p className="font-display text-title text-fg">No questions match “{query}”.</p>
          <p className="mt-3 text-fg-muted">Try another word, or contact us — we are happy to help.</p>
        </div>
      ) : (
        <Accordion type="multiple" value={open} onValueChange={setOpen}>
          {groups.map((group) => (
            <div key={group.category?.id ?? 'other'} className={cn(grouped && 'mb-16 last:mb-0')}>
              {grouped && group.category ? (
                <GroupHeading className="label mb-2 flex items-center gap-3 text-fg-muted">
                  <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
                  {group.category.title}
                </GroupHeading>
              ) : null}
              <div className="border-t border-rule">
                {group.items.map((faq) => {
                  return (
                    <AccordionItem key={faq.id} value={faq.slug} id={faq.slug} className="scroll-mt-[calc(var(--hn-header)+2rem)]">
                      <AccordionTrigger prefix={pad(order.indexOf(faq.id) + 1)}>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <div className="max-w-3xl">{faq.answer}</div>
                        <CopyLink slug={faq.slug} />
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </div>
            </div>
          ))}
        </Accordion>
      )}
    </div>
  )
}
