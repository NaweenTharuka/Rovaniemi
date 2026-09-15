import type { Field } from 'payload'

/**
 * Presentation controls shared by every block. Deliberately limited:
 * editors choose between designed options, never free-form styling.
 */
export const blockSettings = (defaults: { tone?: 'snow' | 'ink' } = {}): Field => ({
  type: 'collapsible',
  label: 'Section settings',
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'hidden',
          label: 'Hide this section',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '33%',
            description: 'Keeps the section in the page but does not show it on the website.',
          },
        },
        {
          name: 'tone',
          type: 'select',
          defaultValue: defaults.tone ?? 'snow',
          options: [
            { label: 'Snow light (paper)', value: 'snow' },
            { label: 'Polar night (ink)', value: 'ink' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'anchorId',
          label: 'Anchor ID',
          type: 'text',
          admin: { width: '33%', description: 'Optional, for links like /about#safety.' },
          validate: (value: unknown) =>
            !value || /^[a-z][a-z0-9-]*$/.test(String(value)) || 'Lowercase letters, numbers, hyphens.',
        },
      ],
    },
    {
      name: 'sectionLabel',
      type: 'text',
      admin: {
        description: 'Small editorial label shown at the top of the section, e.g. "01 — The North".',
      },
    },
  ],
})

export const headingFields = (opts: { required?: boolean } = {}): Field[] => [
  { name: 'eyebrow', type: 'text' },
  {
    name: 'heading',
    type: 'textarea',
    required: opts.required,
    admin: { rows: 2, description: 'Line breaks are kept. Keep headlines short.' },
  },
]
