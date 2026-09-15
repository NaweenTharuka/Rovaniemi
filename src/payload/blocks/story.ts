import type { Block } from 'payload'

import { linkField } from '../fields/link'
import { blockSettings, headingFields } from './settings'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  imageAltText: 'Full-screen hero with headline',
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'cinematic',
      options: [
        { label: 'Cinematic (full screen)', value: 'cinematic' },
        { label: 'Editorial (large type, image below)', value: 'editorial' },
        { label: 'Compact (inner pages)', value: 'compact' },
      ],
    },
    ...headingFields({ required: true }),
    { name: 'subheading', type: 'textarea', admin: { rows: 3 } },
    {
      type: 'row',
      fields: [
        {
          name: 'mediaType',
          type: 'radio',
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
          admin: { width: '50%', layout: 'horizontal' },
        },
        {
          name: 'overlay',
          label: 'Image darkening',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Medium', value: 'medium' },
            { label: 'Strong', value: 'strong' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Also used as the video poster.' },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video' } },
      admin: { condition: (_, s) => s?.mediaType === 'video' },
    },
    { name: 'parallax', type: 'checkbox', defaultValue: true, admin: { description: 'Subtle depth on scroll.' } },
    linkField({ name: 'primaryCta', label: 'Primary button' }),
    linkField({ name: 'secondaryCta', label: 'Secondary button' }),
    blockSettings({ tone: 'ink' }),
  ],
}

export const ChaptersBlock: Block = {
  slug: 'chapters',
  interfaceName: 'ChaptersBlock',
  labels: { singular: 'Cinematic chapters', plural: 'Cinematic chapters' },
  imageAltText: 'Pinned scroll story in numbered chapters',
  fields: [
    {
      name: 'intro',
      type: 'text',
      admin: { description: 'Optional line shown before the first chapter.' },
    },
    {
      name: 'chapters',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      admin: {
        components: { RowLabel: '@/payload/components/admin/RowLabel#TitleRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', admin: { width: '40%', placeholder: 'The North' } },
            { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
        { name: 'body', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'details',
          type: 'array',
          maxRows: 4,
          admin: { description: 'Small facts that reveal progressively, e.g. "66°N — Arctic Circle".' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'text', required: true, admin: { width: '40%' } },
                { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
              ],
            },
          ],
        },
        linkField({ name: 'cta', label: 'Chapter link' }),
      ],
    },
    blockSettings({ tone: 'ink' }),
  ],
}

export const CinematicSequenceBlock: Block = {
  slug: 'cinematicSequence',
  interfaceName: 'CinematicSequenceBlock',
  labels: { singular: 'Cinematic image sequence', plural: 'Cinematic image sequences' },
  imageAltText: 'Scroll-controlled frame sequence — use for one key storytelling moment per page',
  fields: [
    ...headingFields(),
    { name: 'body', type: 'textarea' },
    {
      name: 'source',
      type: 'radio',
      defaultValue: 'path',
      options: [
        { label: 'Frame folder (fast, recommended)', value: 'path' },
        { label: 'Media library images', value: 'media' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      type: 'collapsible',
      label: 'Frame folder',
      admin: { condition: (_, s) => s?.source !== 'media' },
      fields: [
        {
          name: 'framePattern',
          type: 'text',
          admin: {
            placeholder: '/sequences/north/desktop/frame-{index}.webp',
            description: 'Path with {index} placeholder. Frames live in /public or a CDN.',
          },
        },
        {
          type: 'row',
          fields: [
            { name: 'frameCount', type: 'number', min: 2, max: 400, admin: { width: '33%' } },
            { name: 'indexPadding', type: 'number', defaultValue: 3, min: 0, max: 6, admin: { width: '33%' } },
            { name: 'startIndex', type: 'number', defaultValue: 1, min: 0, admin: { width: '33%' } },
          ],
        },
        {
          name: 'mobileFramePattern',
          type: 'text',
          admin: { description: 'Optional lighter frame set for phones.' },
        },
        { name: 'mobileFrameCount', type: 'number', min: 2, max: 200 },
      ],
    },
    {
      name: 'frames',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'media', description: 'In playback order.' },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Shown instantly, on slow connections and for reduced-motion visitors.' },
    },
    {
      name: 'captions',
      type: 'array',
      maxRows: 5,
      admin: { description: 'Text that appears at a point in the sequence (0–100%).' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'at', label: 'At (%)', type: 'number', min: 0, max: 100, required: true, admin: { width: '25%' } },
            { name: 'text', type: 'text', required: true, admin: { width: '75%' } },
          ],
        },
      ],
    },
    {
      name: 'scrollLength',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Short (150vh)', value: 'short' },
        { label: 'Medium (250vh)', value: 'medium' },
        { label: 'Long (400vh)', value: 'long' },
      ],
    },
    blockSettings({ tone: 'ink' }),
  ],
}

export const FullBleedImageBlock: Block = {
  slug: 'fullBleedImage',
  interfaceName: 'FullBleedImageBlock',
  labels: { singular: 'Full-screen image', plural: 'Full-screen images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    { name: 'overlayText', type: 'textarea', admin: { rows: 2 } },
    {
      type: 'row',
      fields: [
        {
          name: 'height',
          type: 'select',
          defaultValue: 'screen',
          options: [
            { label: 'Full screen', value: 'screen' },
            { label: 'Tall', value: 'tall' },
            { label: 'Cinema (21:9)', value: 'cinema' },
          ],
          admin: { width: '50%' },
        },
        { name: 'parallax', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    blockSettings({ tone: 'ink' }),
  ],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  labels: { singular: 'Image + text', plural: 'Image + text' },
  fields: [
    ...headingFields(),
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'imagePosition',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Image right', value: 'right' },
            { label: 'Image left', value: 'left' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'imageRatio',
          type: 'select',
          defaultValue: 'portrait',
          options: [
            { label: 'Portrait', value: 'portrait' },
            { label: 'Landscape', value: 'landscape' },
            { label: 'Square', value: 'square' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    linkField({ name: 'cta', label: 'Link' }),
    blockSettings(),
  ],
}

export const SplitBlock: Block = {
  slug: 'split',
  interfaceName: 'SplitBlock',
  labels: { singular: 'Split layout', plural: 'Split layouts' },
  imageAltText: 'Heading on the left, content on the right',
  fields: [
    ...headingFields(),
    { name: 'body', type: 'richText' },
    {
      name: 'items',
      type: 'array',
      maxRows: 8,
      admin: {
        description: 'Optional numbered points, e.g. principles.',
        components: { RowLabel: '@/payload/components/admin/RowLabel#TitleRowLabel' },
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    linkField({ name: 'cta', label: 'Link' }),
    blockSettings(),
  ],
}

export const QuoteBlock: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: { singular: 'Quote', plural: 'Quotes' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'attribution', type: 'text', admin: { width: '50%' } },
        { name: 'role', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    blockSettings(),
  ],
}
