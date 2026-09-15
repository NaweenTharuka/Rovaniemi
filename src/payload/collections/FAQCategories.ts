import type { CollectionConfig } from 'payload'

import { anyone, editors } from '../access'
import { slugField } from '../fields/slug'
import { TAGS, revalidateCollection } from '../hooks/revalidate'

export const FAQCategories: CollectionConfig = {
  slug: 'faq-categories',
  labels: { singular: 'FAQ category', plural: 'FAQ categories' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    description: 'Filters shown on the FAQ page. Drag to reorder.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  defaultSort: '_order',
  hooks: { afterChange: [revalidateCollection(TAGS.faqs, TAGS.pages)] },
  fields: [{ name: 'title', type: 'text', required: true }, slugField('title')],
}
