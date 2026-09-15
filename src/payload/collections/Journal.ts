import type { CollectionConfig } from 'payload'

import { editors, editorsOrOwnDraft, publishedOrStaff, staffCreateNoAuthorPublish } from '../access'
import { draftVersions, editorialFields, publishedAtField, syncEditorialState } from '../fields/editorial'
import { seoTab } from '../fields/seo'
import { slugField } from '../fields/slug'
import { TAGS, revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { previewPath } from '../preview'

export const Journal: CollectionConfig = {
  slug: 'journal',
  labels: { singular: 'Journal entry', plural: 'Journal' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'workflowStatus', '_status', 'publishedAt'],
    description: 'Stories and guides. The journal appears on the site once an entry is published.',
    preview: (doc) => previewPath('journal', doc?.slug as string | undefined),
    livePreview: { url: ({ data }) => previewPath('journal', data?.slug as string | undefined) },
  },
  access: {
    read: publishedOrStaff,
    create: staffCreateNoAuthorPublish,
    update: editorsOrOwnDraft,
    delete: editors,
  },
  versions: draftVersions,
  defaultSort: '-publishedAt',
  hooks: {
    beforeChange: [syncEditorialState],
    afterChange: [revalidateCollection(TAGS.journal)],
    afterDelete: [revalidateCollectionDelete(TAGS.journal)],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'excerpt', type: 'textarea', maxLength: 280 },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            { name: 'content', type: 'richText', required: true },
            {
              name: 'relatedExperiences',
              type: 'relationship',
              relationTo: 'experiences',
              hasMany: true,
            },
          ],
        },
        seoTab(),
      ],
    },
    slugField('title'),
    { name: 'authorName', type: 'text', admin: { position: 'sidebar' } },
    ...editorialFields(),
    publishedAtField(),
  ],
}
