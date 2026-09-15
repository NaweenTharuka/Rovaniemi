import type { CollectionConfig } from 'payload'

import { editors, editorsOrOwnDraft, publishedOrStaff, staffCreateNoAuthorPublish } from '../access'
import { pageBlocks } from '../blocks'
import { draftVersions, editorialFields, publishedAtField, syncEditorialState } from '../fields/editorial'
import { seoTab } from '../fields/seo'
import { slugField } from '../fields/slug'
import { TAGS, revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { previewPath } from '../preview'

/** Slugs the website routing depends on. Editors can edit these pages but not rename them. */
export const SYSTEM_PAGE_SLUGS = ['home', 'experiences', 'about', 'faq', 'contact', 'terms', 'privacy', 'cancellation']

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'workflowStatus', '_status', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
    description: 'Pages are built from designed sections. Use Live Preview to see changes before publishing.',
    preview: (doc) => previewPath('pages', doc?.slug as string | undefined),
    livePreview: { url: ({ data }) => previewPath('pages', data?.slug as string | undefined) },
  },
  access: {
    read: publishedOrStaff,
    create: staffCreateNoAuthorPublish,
    update: editorsOrOwnDraft,
    delete: editors,
  },
  versions: draftVersions,
  hooks: {
    beforeChange: [
      syncEditorialState,
      ({ data, originalDoc, operation }) => {
        if (
          operation === 'update' &&
          originalDoc?.slug &&
          SYSTEM_PAGE_SLUGS.includes(originalDoc.slug) &&
          data.slug &&
          data.slug !== originalDoc.slug
        ) {
          data.slug = originalDoc.slug
        }
        return data
      },
    ],
    afterChange: [revalidateCollection(TAGS.pages)],
    afterDelete: [revalidateCollectionDelete(TAGS.pages)],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sections',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: pageBlocks,
              admin: {
                initCollapsed: true,
                description:
                  'Add, reorder (drag), duplicate (row menu) or hide sections. Every section is a designed component.',
              },
            },
          ],
        },
        seoTab(),
      ],
    },
    slugField('title', {
      admin: {
        position: 'sidebar',
        description: 'Use "home" for the homepage. Core pages (home, about, faq, contact…) keep their slug.',
      },
    }),
    {
      name: 'template',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Legal / reading', value: 'legal' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'breadcrumbLabel',
      type: 'text',
      admin: { position: 'sidebar', description: 'Short name for breadcrumbs.' },
    },
    ...editorialFields(),
    publishedAtField(),
  ],
}
