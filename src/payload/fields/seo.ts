import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import type { Tab } from 'payload'

/** SEO tab shared by pages, experiences and journal entries. */
export const seoTab = (): Tab => ({
  name: 'meta',
  label: 'SEO',
  fields: [
    OverviewField({
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
      imagePath: 'meta.image',
    }),
    MetaTitleField({ hasGenerateFn: true }),
    MetaDescriptionField({ hasGenerateFn: true }),
    MetaImageField({ relationTo: 'media', hasGenerateFn: true }),
    PreviewField({
      hasGenerateFn: true,
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
    }),
    {
      type: 'collapsible',
      label: 'Advanced',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'ogTitle',
          label: 'Open Graph title',
          type: 'text',
          admin: { description: 'Social share title. Falls back to the SEO title.' },
        },
        {
          name: 'ogDescription',
          label: 'Open Graph description',
          type: 'textarea',
          admin: { description: 'Social share description. Falls back to the meta description.' },
        },
        {
          name: 'twitterCard',
          label: 'X / Twitter card',
          type: 'select',
          defaultValue: 'summary_large_image',
          options: [
            { label: 'Large image', value: 'summary_large_image' },
            { label: 'Summary', value: 'summary' },
          ],
        },
        {
          name: 'canonicalUrl',
          label: 'Canonical URL',
          type: 'text',
          admin: { description: 'Only set when this content is duplicated elsewhere. Absolute URL.' },
          validate: (value: unknown) =>
            !value || /^https?:\/\//.test(String(value)) || 'Must be an absolute URL.',
        },
        {
          name: 'noIndex',
          label: 'Hide from search engines',
          type: 'checkbox',
        },
      ],
    },
  ],
})
