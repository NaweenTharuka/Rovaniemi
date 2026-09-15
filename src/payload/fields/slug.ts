import type { Field, FieldHook } from 'payload'

export const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, originalDoc, operation }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    if (operation === 'create' || !originalDoc?.slug) {
      const source = data?.[fallbackField] ?? originalDoc?.[fallbackField]
      if (typeof source === 'string') return slugify(source)
    }
    return value
  }

export const slugField = (fallbackField = 'title', overrides: Partial<Field> = {}): Field =>
  ({
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    required: true,
    admin: {
      position: 'sidebar',
      description: `URL segment. Generated from the ${fallbackField} if left empty. Changing it changes the public URL.`,
    },
    hooks: { beforeValidate: [formatSlug(fallbackField)] },
    validate: (value: unknown) => {
      if (typeof value !== 'string' || value.length === 0) return true // filled by hook
      return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Use lowercase letters, numbers and hyphens only.'
    },
    ...overrides,
  }) as Field
