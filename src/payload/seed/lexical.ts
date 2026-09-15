/** Minimal Lexical JSON builders for seeding rich text. */

type Node = { type: string; version: number; [key: string]: unknown }

const base = { format: '' as const, indent: 0, version: 1, direction: 'ltr' as const }

export const text = (value: string, bold = false): Node => ({
  type: 'text',
  text: value,
  format: bold ? 1 : 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

export const link = (label: string, url: string): Node => ({
  ...base,
  type: 'link',
  version: 3,
  fields: { linkType: 'custom', url, newTab: false },
  children: [text(label)],
})

type Inline = string | Node

const inline = (parts: Inline[]) => parts.map((p) => (typeof p === 'string' ? text(p) : p))

export const p = (...parts: Inline[]): Node => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: inline(parts),
})

export const h = (tag: 'h2' | 'h3', value: string): Node => ({
  ...base,
  type: 'heading',
  tag,
  children: [text(value)],
})

export const ul = (items: Inline[][] | string[]): Node => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((item, i) => ({
    ...base,
    type: 'listitem',
    value: i + 1,
    children: inline(Array.isArray(item) ? item : [item]),
  })),
})

export const doc = (...children: Node[]) => ({
  root: { ...base, type: 'root', children },
})

export const paragraphs = (...values: string[]) => doc(...values.map((v) => p(v)))
