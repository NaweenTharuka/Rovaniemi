import type { CollectionConfig } from 'payload'

import { editors, editorsOrOwnDraft, publishedOrStaff, staffCreateNoAuthorPublish } from '../access'
import { draftVersions, editorialFields, syncEditorialState } from '../fields/editorial'
import { TAGS, revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'experience', 'rating', 'featured', '_status'],
    listSearchableFields: ['customerName', 'customerLocation', 'headline'],
    description: 'Only publish genuine guest feedback you have permission to share. Drag to reorder.',
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
    afterChange: [revalidateCollection(TAGS.testimonials, TAGS.experiences, TAGS.pages)],
    afterDelete: [revalidateCollectionDelete(TAGS.testimonials, TAGS.experiences, TAGS.pages)],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'customerName', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'customerLocation', type: 'text', admin: { width: '50%', placeholder: 'Berlin, Germany' } },
      ],
    },
    {
      name: 'headline',
      type: 'text',
      admin: { description: 'Optional short pull-quote shown large, e.g. "An unforgettable night in the Arctic."' },
    },
    { name: 'quote', label: 'Testimonial', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: { width: '33%', step: 1, description: '1–5. Leave empty to hide stars.' },
        },
        {
          name: 'experience',
          type: 'relationship',
          relationTo: 'experiences',
          admin: { width: '33%' },
        },
        {
          name: 'date',
          type: 'date',
          admin: { width: '33%', date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } },
        },
      ],
    },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'Where this review was given (e.g. Google, TripAdvisor, email). Internal.' },
    },
    { name: 'profileImage', type: 'upload', relationTo: 'media' },
    {
      name: 'featured',
      type: 'checkbox',
      admin: { position: 'sidebar' },
    },
    ...editorialFields(),
  ],
}
