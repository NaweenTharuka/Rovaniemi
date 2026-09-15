import type { Block } from 'payload'

import { linkField } from '../fields/link'
import { blockSettings, headingFields } from './settings'

export const ExperienceShowcaseBlock: Block = {
  slug: 'experienceShowcase',
  interfaceName: 'ExperienceShowcaseBlock',
  labels: { singular: 'Experience showcase', plural: 'Experience showcases' },
  imageAltText: 'Numbered editorial list of experiences',
  fields: [
    ...headingFields(),
    { name: 'intro', type: 'textarea' },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'all',
          options: [
            { label: 'All published experiences', value: 'all' },
            { label: 'Featured only', value: 'featured' },
            { label: 'Choose manually', value: 'manual' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'index',
          options: [
            { label: 'Numbered index (editorial rows)', value: 'index' },
            { label: 'Horizontal scroll (large cards)', value: 'horizontal' },
            { label: 'Stacked features (full width)', value: 'stacked' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'experiences',
      type: 'relationship',
      relationTo: 'experiences',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual', description: 'Drag to set the order.' },
    },
    {
      name: 'showFilters',
      label: 'Show category filters',
      type: 'checkbox',
      admin: { description: 'Filter chips built from experience categories. Shown only when there are at least two categories.' },
    },
    linkField({ name: 'cta', label: 'Link below the list' }),
    blockSettings(),
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    ...headingFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'editorial',
          options: [
            { label: 'Large editorial quote', value: 'editorial' },
            { label: 'Horizontal carousel', value: 'carousel' },
            { label: 'Minimal list', value: 'minimal' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'featured',
          options: [
            { label: 'Featured', value: 'featured' },
            { label: 'All', value: 'all' },
            { label: 'For one experience', value: 'experience' },
            { label: 'Choose manually', value: 'manual' },
          ],
          admin: { width: '33%' },
        },
        { name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 24, admin: { width: '33%' } },
      ],
    },
    {
      name: 'experience',
      type: 'relationship',
      relationTo: 'experiences',
      admin: { condition: (_, s) => s?.source === 'experience' },
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    blockSettings(),
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    ...headingFields(),
    { name: 'intro', type: 'textarea' },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'all',
          options: [
            { label: 'All questions', value: 'all' },
            { label: 'Featured questions', value: 'featured' },
            { label: 'Selected categories', value: 'categories' },
            { label: 'Choose manually', value: 'manual' },
          ],
          admin: { width: '50%' },
        },
        { name: 'limit', type: 'number', min: 1, max: 100, admin: { width: '50%', description: 'Empty = no limit.' } },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'faq-categories',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'categories' },
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    {
      type: 'row',
      fields: [
        { name: 'enableSearch', type: 'checkbox', defaultValue: false, admin: { width: '50%' } },
        { name: 'enableFilters', label: 'Enable category filters', type: 'checkbox', defaultValue: false, admin: { width: '50%' } },
      ],
    },
    linkField({ name: 'cta', label: 'Link below the questions' }),
    blockSettings(),
  ],
}

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  labels: { singular: 'Contact form', plural: 'Contact forms' },
  fields: [
    ...headingFields(),
    { name: 'intro', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'formHeading', type: 'text', defaultValue: 'Send us an enquiry', admin: { width: '50%' } },
        { name: 'submitLabel', type: 'text', defaultValue: 'Send enquiry', admin: { width: '50%' } },
      ],
    },
    { name: 'successMessage', type: 'textarea', defaultValue: "Thank you. We'll get back to you as soon as possible." },
    {
      type: 'row',
      fields: [
        { name: 'showDirectContacts', label: 'Show email / WhatsApp / location', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
        { name: 'showMap', label: 'Show map (loads on click)', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'pickupNote',
      type: 'textarea',
      admin: { description: 'Short pickup explanation shown next to the contact details.' },
    },
    blockSettings(),
  ],
}
