import type { CollectionConfig } from 'payload'

import {
  editors,
  editorsOrOwnDraft,
  publishedOrStaff,
  staffCreateNoAuthorPublish,
} from '../access'
import { draftVersions, editorialFields, publishedAtField, syncEditorialState } from '../fields/editorial'
import { textList } from '../fields/list'
import { seoTab } from '../fields/seo'
import { slugField } from '../fields/slug'
import { TAGS, revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { previewPath } from '../preview'

export const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
] as const

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  labels: { singular: 'Experience', plural: 'Experiences' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'workflowStatus', 'featured', '_status', 'updatedAt'],
    listSearchableFields: ['title', 'shortTitle', 'slug', 'location'],
    description: 'Tours and journeys. Drag rows to change the order used across the website.',
    preview: (doc) => previewPath('experiences', doc?.slug as string | undefined),
    livePreview: { url: ({ data }) => previewPath('experiences', data?.slug as string | undefined) },
  },
  access: {
    read: publishedOrStaff,
    create: staffCreateNoAuthorPublish,
    update: editorsOrOwnDraft,
    delete: editors,
  },
  versions: draftVersions,
  hooks: {
    beforeChange: [syncEditorialState],
    afterChange: [revalidateCollection(TAGS.experiences, TAGS.pages)],
    afterDelete: [revalidateCollectionDelete(TAGS.experiences, TAGS.pages)],
  },
  defaultSort: '_order',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Story',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'shortTitle',
                  type: 'text',
                  admin: { width: '50%', description: 'Used in navigation and compact lists, e.g. "Korouoma".' },
                },
                {
                  name: 'eyebrow',
                  type: 'text',
                  admin: { width: '50%', description: 'Small label above the title, e.g. "Northern Lights".' },
                },
              ],
            },
            {
              name: 'categories',
              type: 'text',
              hasMany: true,
              admin: {
                description: 'Short tags used for filtering, e.g. Northern Lights, Wildlife, Day trip. Press Enter after each.',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              admin: { description: 'One editorial line for showcases, e.g. "Frozen waterfalls. Arctic silence."' },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              maxLength: 280,
              admin: { description: 'Shown on cards, listings and as the search description fallback.' },
            },
            {
              name: 'description',
              label: 'Introduction',
              type: 'richText',
              admin: { description: 'The opening paragraphs of the experience page.' },
            },
            {
              name: 'story',
              label: 'Story section',
              type: 'group',
              admin: { description: 'Optional long-form editorial section. Hidden if empty.' },
              fields: [
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'richText' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'highlights',
              type: 'array',
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/payload/components/admin/RowLabel#TitleRowLabel' },
              },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              filterOptions: { mimeType: { contains: 'image' } },
            },
            {
              name: 'heroVideo',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'video' } },
              admin: { description: 'Optional ambient loop (MP4/WebM, muted). The hero image is used as its poster.' },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              filterOptions: { mimeType: { contains: 'image' } },
              admin: { description: 'Drag to reorder.' },
            },
          ],
        },
        {
          label: 'Facts & pricing',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'duration', type: 'text', admin: { width: '33%', placeholder: '3–4 hours' } },
                { name: 'groupSize', type: 'text', admin: { width: '33%', placeholder: 'Maximum 4 guests' } },
                {
                  name: 'difficulty',
                  type: 'select',
                  options: [
                    { label: 'Easy', value: 'easy' },
                    { label: 'Moderate', value: 'moderate' },
                    { label: 'Challenging', value: 'challenging' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'location', label: 'Destination', type: 'text', admin: { width: '50%', placeholder: 'Korouoma Canyon' } },
                { name: 'startingPoint', type: 'text', admin: { width: '50%', placeholder: 'Rovaniemi' } },
              ],
            },
            {
              name: 'season',
              label: 'Seasonal availability',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', admin: { width: '50%', placeholder: 'Winter season' } },
                    {
                      name: 'months',
                      type: 'select',
                      hasMany: true,
                      options: MONTHS.map((m) => ({ label: m.toUpperCase(), value: m })),
                      admin: { width: '50%' },
                    },
                  ],
                },
                { name: 'availabilityText', type: 'text', admin: { placeholder: 'Departures nightly, subject to conditions' } },
              ],
            },
            {
              name: 'pricing',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'fromPrice', label: 'From price (€)', type: 'number', min: 0, admin: { width: '33%' } },
                    {
                      name: 'unit',
                      type: 'select',
                      defaultValue: 'person',
                      options: [
                        { label: 'per person', value: 'person' },
                        { label: 'per group', value: 'group' },
                      ],
                      admin: { width: '33%' },
                    },
                    {
                      name: 'displayLabel',
                      type: 'text',
                      admin: { width: '33%', description: 'Overrides the generated label, e.g. "One-way from €250 per group".' },
                    },
                  ],
                },
                { name: 'note', type: 'textarea', admin: { description: 'Shown under the price, e.g. what the price covers.' } },
              ],
            },
            {
              name: 'options',
              label: 'Options / variants',
              type: 'array',
              admin: {
                description: 'Use when one experience has several routes or packages (e.g. Levi one-way vs. day trip).',
                initCollapsed: true,
                components: { RowLabel: '@/payload/components/admin/RowLabel#TitleRowLabel' },
              },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'price', label: 'Price (€)', type: 'number', min: 0, admin: { width: '33%' } },
                    {
                      name: 'unit',
                      type: 'select',
                      defaultValue: 'group',
                      options: [
                        { label: 'per person', value: 'person' },
                        { label: 'per group', value: 'group' },
                      ],
                      admin: { width: '33%' },
                    },
                    { name: 'capacity', type: 'text', admin: { width: '33%', placeholder: 'Up to 4 guests' } },
                  ],
                },
                { name: 'duration', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Plan',
          fields: [
            {
              name: 'itinerary',
              type: 'array',
              admin: {
                description: 'Approximate flow of the experience. Hidden on the website if empty.',
                initCollapsed: true,
                components: { RowLabel: '@/payload/components/admin/RowLabel#TitleRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'time', type: 'text', admin: { width: '30%', placeholder: '19:30' } },
                    { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
                  ],
                },
                { name: 'description', type: 'textarea' },
              ],
            },
            textList('included', "What's included"),
            textList('notIncluded', 'Not included'),
            textList('whatToBring', 'What to bring'),
            {
              name: 'pickup',
              label: 'Pickup information',
              type: 'group',
              fields: [
                { name: 'summary', type: 'text', admin: { placeholder: 'Complimentary pickup in Rovaniemi' } },
                { name: 'details', type: 'textarea' },
              ],
            },
            {
              name: 'notices',
              label: 'Important information',
              type: 'array',
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/payload/components/admin/RowLabel#TitleRowLabel' },
              },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
                {
                  name: 'tone',
                  type: 'select',
                  defaultValue: 'info',
                  options: [
                    { label: 'Information', value: 'info' },
                    { label: 'Important', value: 'important' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Booking',
          fields: [
            {
              name: 'booking',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  admin: { description: 'Defaults to the site-wide booking label.', placeholder: 'Book your Aurora experience' },
                },
                {
                  name: 'url',
                  label: 'External booking URL',
                  type: 'text',
                  admin: {
                    description: 'Leave empty to send guests to the enquiry form with this experience preselected.',
                  },
                  validate: (value: unknown) =>
                    !value || /^(https?:\/\/|\/)/.test(String(value)) || 'Use an absolute URL or a site path.',
                },
                {
                  name: 'ctaHeading',
                  type: 'text',
                  admin: { placeholder: 'Ready to chase the Northern Lights?' },
                },
                { name: 'ctaBody', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Related',
          fields: [
            {
              name: 'faqs',
              label: 'Experience FAQs',
              type: 'join',
              collection: 'faqs',
              on: 'experiences',
              defaultSort: '_order',
              admin: {
                defaultColumns: ['question', 'category', '_status'],
                description: 'FAQs linked to this experience. Link them from the FAQ itself.',
              },
            },
            {
              name: 'testimonials',
              type: 'join',
              collection: 'testimonials',
              on: 'experience',
              admin: { defaultColumns: ['customerName', 'rating', '_status'] },
            },
            {
              name: 'relatedExperiences',
              type: 'relationship',
              relationTo: 'experiences',
              hasMany: true,
              filterOptions: ({ id }) => ({ id: { not_equals: id } }),
              admin: { description: 'Leave empty to show other featured experiences automatically.' },
            },
          ],
        },
        seoTab(),
      ],
    },
    slugField('title'),
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Featured experiences appear first in showcases.' },
    },
    ...editorialFields(),
    publishedAtField(),
  ],
}
