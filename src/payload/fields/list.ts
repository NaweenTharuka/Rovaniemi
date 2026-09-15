import type { ArrayField } from 'payload'

/** Ordered list of short sentences (drag to reorder in the admin). */
export const textList = (
  name: string,
  label: string,
  description?: string,
  itemLabel = 'Item',
): ArrayField => ({
  name,
  label,
  type: 'array',
  labels: { singular: itemLabel, plural: label },
  admin: {
    description,
    initCollapsed: false,
    components: {
      RowLabel: '@/payload/components/admin/RowLabel#TextRowLabel',
    },
  },
  fields: [{ name: 'text', type: 'text', required: true }],
})

export const hexColor = (value: unknown) =>
  !value || /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(String(value)) || 'Use a hex colour such as #0B1016.'
