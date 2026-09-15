import type { Block } from 'payload'

import { linkField } from '../fields/link'
import { blockSettings, headingFields } from './settings'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Rich text', plural: 'Rich text' },
  fields: [
    ...headingFields(),
    { name: 'content', type: 'richText', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          type: 'select',
          defaultValue: 'reading',
          options: [
            { label: 'Reading column', value: 'reading' },
            { label: 'Wide', value: 'wide' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'tableOfContents',
          label: 'Show table of contents',
          type: 'checkbox',
          admin: { width: '50%', description: 'For legal and long pages. Built from H2 headings.' },
        },
      ],
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } },
    },
    blockSettings(),
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Stats', plural: 'Stats' },
  fields: [
    ...headingFields(),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { width: '30%', placeholder: '4' } },
            { name: 'label', type: 'text', required: true, admin: { width: '70%', placeholder: 'Guests, maximum' } },
          ],
        },
        { name: 'description', type: 'textarea' },
      ],
    },
    blockSettings(),
  ],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  fields: [
    ...headingFields(),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      admin: { components: { RowLabel: '@/payload/components/admin/RowLabel#TitleRowLabel' } },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'marker', type: 'text', admin: { width: '30%', placeholder: '19:30 or 2024' } },
            { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
        { name: 'body', type: 'textarea' },
      ],
    },
    blockSettings(),
  ],
}

export const ImageGridBlock: Block = {
  slug: 'imageGrid',
  interfaceName: 'ImageGridBlock',
  labels: { singular: 'Image grid', plural: 'Image grids' },
  fields: [
    ...headingFields(),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      admin: { components: { RowLabel: '@/payload/components/admin/RowLabel#TitleRowLabel' } },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        linkField({ name: 'link', label: 'Link', withLabel: false }),
      ],
    },
    blockSettings(),
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [
    ...headingFields(),
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, required: true },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'editorial',
      options: [
        { label: 'Editorial mosaic', value: 'editorial' },
        { label: 'Horizontal strip', value: 'strip' },
      ],
    },
    blockSettings(),
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    ...headingFields({ required: true }),
    { name: 'body', type: 'textarea' },
    linkField({ name: 'primaryCta', label: 'Primary button' }),
    linkField({ name: 'secondaryCta', label: 'Secondary button' }),
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. Dark tone is applied automatically over images.' },
    },
    {
      name: 'showWhatsApp',
      label: 'Show WhatsApp link',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Uses the WhatsApp number from Site Settings.' },
    },
    blockSettings({ tone: 'ink' }),
  ],
}

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: { singular: 'Newsletter', plural: 'Newsletters' },
  fields: [
    ...headingFields(),
    { name: 'body', type: 'textarea' },
    {
      name: 'formAction',
      type: 'text',
      admin: {
        description:
          'Signup URL from your email provider (e.g. Mailchimp/Brevo form action). The section stays hidden until this is set.',
      },
      validate: (value: unknown) => !value || /^https:\/\//.test(String(value)) || 'Must be an https URL.',
    },
    {
      type: 'row',
      fields: [
        { name: 'emailFieldName', type: 'text', defaultValue: 'EMAIL', admin: { width: '50%' } },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Subscribe', admin: { width: '50%' } },
      ],
    },
    { name: 'disclaimer', type: 'text' },
    blockSettings(),
  ],
}
