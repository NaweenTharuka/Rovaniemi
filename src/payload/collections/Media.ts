import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { anyone, editors, staff } from '../access'
import { TAGS, revalidateCollection } from '../hooks/revalidate'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
const VIDEO_TYPES = ['video/mp4', 'video/webm']

const MAX_IMAGE_BYTES = 15 * 1024 * 1024
const MAX_VIDEO_BYTES = 80 * 1024 * 1024

/** Reject oversized files per type and SVGs that could carry script. */
const validateUpload: CollectionBeforeValidateHook = ({ req }) => {
  const file = req.file
  if (!file) return

  const isVideo = VIDEO_TYPES.includes(file.mimetype)
  const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
  if (file.size > limit) {
    throw new APIError(
      `File is too large. Maximum ${Math.round(limit / 1024 / 1024)} MB for ${isVideo ? 'video' : 'images'}.`,
      400,
      undefined,
      true,
    )
  }

  if (file.mimetype === 'image/svg+xml') {
    const markup = file.data.toString('utf8')
    const unsafe = /<script|<foreignObject|\son[a-z]+\s*=|javascript:|<iframe|<embed|<object/i
    if (unsafe.test(markup)) {
      throw new APIError('This SVG contains scripts or embedded content and cannot be uploaded.', 400, undefined, true)
    }
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media library' },
  folders: true,
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['filename', 'title', 'category', 'featured', 'updatedAt'],
    listSearchableFields: ['title', 'alt', 'filename', 'credit'],
    description: 'Images are converted to WebP in several sizes automatically. Alt text is required.',
  },
  access: {
    read: anyone,
    create: staff,
    update: staff,
    delete: editors,
  },
  hooks: {
    beforeValidate: [validateUpload],
    afterChange: [revalidateCollection(TAGS.media, TAGS.pages, TAGS.experiences)],
  },
  upload: {
    staticDir: 'media',
    mimeTypes: [...IMAGE_TYPES, ...VIDEO_TYPES],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
    // Cap stored originals so nothing absurd is ever served.
    resizeOptions: { width: 3200, height: 3200, fit: 'inside', withoutEnlargement: true },
    imageSizes: [
      { name: 'thumbnail', width: 480, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'tablet', width: 1440, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'desktop', width: 2048, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 2880, formatOptions: { format: 'webp', options: { quality: 78 } } },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 82 } },
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Internal name for finding this file.' },
    },
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what the image shows for people using screen readers. Write "decorative" only for purely decorative images.',
      },
    },
    { name: 'caption', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      type: 'collapsible',
      label: 'Credit & licence',
      admin: {
        description:
          'Required for Creative Commons photos (CC BY / CC BY-SA): credited items are listed on the Photo credits page.',
      },
      fields: [
        {
          name: 'credit',
          type: 'text',
          admin: { description: 'Photographer or source, e.g. "Ninara". Mark AI-generated imagery honestly.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'license',
              type: 'text',
              admin: { width: '33%', placeholder: 'CC BY 2.0' },
            },
            {
              name: 'licenseUrl',
              label: 'Licence URL',
              type: 'text',
              admin: { width: '33%' },
              validate: (v: unknown) => !v || /^https:\/\//.test(String(v)) || 'Must be an https URL.',
            },
            {
              name: 'sourceUrl',
              label: 'Source URL',
              type: 'text',
              admin: { width: '33%', description: 'Original photo page.' },
              validate: (v: unknown) => !v || /^https:\/\//.test(String(v)) || 'Must be an https URL.',
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Landscape', value: 'landscape' },
            { label: 'Aurora', value: 'aurora' },
            { label: 'Wildlife', value: 'wildlife' },
            { label: 'People', value: 'people' },
            { label: 'Vehicles', value: 'vehicles' },
            { label: 'Brand', value: 'brand' },
            { label: 'Video', value: 'video' },
            { label: 'Other', value: 'other' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'featured',
          type: 'checkbox',
          admin: { width: '50%', style: { alignSelf: 'flex-end' } },
        },
      ],
    },
  ],
}
