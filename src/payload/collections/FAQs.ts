import type { CollectionConfig } from 'payload'

import { editors, editorsOrOwnDraft, publishedOrStaff, staffCreateNoAuthorPublish } from '../access'
import { draftVersions, editorialFields, syncEditorialState } from '../fields/editorial'
import { slugField } from '../fields/slug'
import { TAGS, revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'featured', 'workflowStatus', '_status'],
    listSearchableFields: ['question', 'slug'],
    description: 'Questions shown on the FAQ page, experience pages and FAQ blocks. Drag to reorder.',
  },
  access: {
    read: publishedOrStaff,
    create: staffCreateNoAuthorPublish,
    update: editorsOrOwnDraft,
    delete: editors,
  },
  versions: draftVersions,
  defaultSort: '_order',
  hooks: {
    beforeChange: [syncEditorialState],
    afterChange: [revalidateCollection(TAGS.faqs, TAGS.experiences, TAGS.pages)],
    afterDelete: [revalidateCollectionDelete(TAGS.faqs, TAGS.experiences, TAGS.pages)],
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'faq-categories',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'experiences',
          label: 'Related experiences',
          type: 'relationship',
          relationTo: 'experiences',
          hasMany: true,
          admin: { width: '50%', description: 'Shows this question on those experience pages.' },
        },
      ],
    },
    slugField('question', {
      admin: {
        position: 'sidebar',
        description: 'Anchor used for deep links, e.g. /faq#pickup-and-drop-off.',
      },
    }),
    {
      name: 'featured',
      type: 'checkbox',
      admin: { position: 'sidebar', description: 'Featured questions appear in FAQ highlight blocks.' },
    },
    ...editorialFields(),
  ],
}
