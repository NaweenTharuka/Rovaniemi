import type { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/utils'
import { slugify } from '@/payload/fields/slug'
import { pathFor } from '@/payload/preview'

type Content = SerializedEditorState | Record<string, unknown> | null | undefined

const textOf = (node: SerializedLexicalNode & { children?: SerializedLexicalNode[]; text?: string }): string =>
  node.text ?? (node.children ?? []).map((child) => textOf(child as typeof node)).join('')

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const doc = linkNode.fields.doc
      if (!doc || typeof doc.value !== 'object') return '/'
      const relation = doc.relationTo as 'pages' | 'experiences' | 'journal'
      return pathFor(relation, (doc.value as { slug?: string }).slug)
    },
  }),
  // Headings get stable ids so tables of contents and deep links work.
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag
    const id = slugify(textOf(node))
    return <Tag id={id}>{nodesToJSX({ nodes: node.children })}</Tag>
  },
})

export function RichText({
  data,
  className,
  lead = false,
}: {
  data: Content
  className?: string
  lead?: boolean
}) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null
  const root = (data as SerializedEditorState).root
  if (!root?.children?.length) return null
  // Own wrapper: with disableContainer Lexical renders bare nodes and ignores className.
  return (
    <div className={cn('prose-hn', lead && 'prose-lead', className)}>
      <LexicalRichText data={data as SerializedEditorState} converters={converters} disableContainer disableIndent />
    </div>
  )
}

/** Extracts H2 headings for a table of contents. */
export const headingsOf = (data: Content) => {
  if (!data || typeof data !== 'object' || !('root' in data)) return []
  const nodes = (data as SerializedEditorState).root.children as (SerializedLexicalNode & {
    tag?: string
    children?: SerializedLexicalNode[]
  })[]
  return nodes
    .filter((n) => n.type === 'heading' && n.tag === 'h2')
    .map((n) => {
      const text = textOf(n)
      return { id: slugify(text), text }
    })
}

export const hasRichText = (data: Content) =>
  Boolean(data && typeof data === 'object' && 'root' in data && (data as SerializedEditorState).root?.children?.some((c) => textOf(c as never).trim()))
