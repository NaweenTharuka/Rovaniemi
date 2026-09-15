import type { Field, GroupField } from 'payload'

type LinkOptions = {
  name?: string
  label?: string
  appearance?: boolean
  required?: boolean
  withLabel?: boolean
}

/**
 * A link that either references CMS content (so it survives slug changes)
 * or points to a custom URL (anchors, mailto:, WhatsApp, external booking tools).
 */
export const linkField = ({
  name = 'link',
  label,
  appearance = false,
  required = false,
  withLabel = true,
}: LinkOptions = {}): GroupField => {
  const fields: Field[] = [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'reference',
          options: [
            { label: 'Page or experience', value: 'reference' },
            { label: 'Custom URL', value: 'custom' },
          ],
          admin: { layout: 'horizontal', width: '50%' },
        },
        {
          name: 'newTab',
          label: 'Open in new tab',
          type: 'checkbox',
          admin: { width: '50%', style: { alignSelf: 'flex-end' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['pages', 'experiences'],
          required,
          maxDepth: 1,
          admin: {
            width: '50%',
            condition: (_, siblingData) => siblingData?.type !== 'custom',
          },
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required,
          admin: {
            width: '50%',
            placeholder: '/contact, https://…, mailto:…, tel:…',
            condition: (_, siblingData) => siblingData?.type === 'custom',
          },
          validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
            if (siblingData?.type !== 'custom') return true
            if (!value) return required ? 'URL is required.' : true
            return /^(\/|#|https?:\/\/|mailto:|tel:)/.test(String(value)) ||
              'Start with /, #, https://, mailto: or tel:'
          },
        },
        ...(withLabel
          ? ([
              {
                name: 'label',
                type: 'text',
                required,
                admin: { width: '50%' },
              },
            ] as Field[])
          : []),
      ],
    },
  ]

  if (appearance) {
    fields.push({
      name: 'appearance',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Text link', value: 'link' },
      ],
    })
  }

  return {
    name,
    label,
    type: 'group',
    admin: { hideGutter: true },
    fields,
  }
}
