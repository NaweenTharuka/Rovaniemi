import type { GlobalConfig } from 'payload'

import { anyone, editors } from '../access'
import { linkField } from '../fields/link'
import { TAGS, revalidateGlobal } from '../hooks/revalidate'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Site',
    description: 'Header menu, booking button and footer links.',
  },
  access: { read: anyone, update: editors },
  versions: { drafts: false, max: 25 },
  hooks: { afterChange: [revalidateGlobal(TAGS.navigation)] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'header',
          label: 'Header',
          fields: [
            {
              name: 'logoVariant',
              label: 'Header logo',
              type: 'select',
              defaultValue: 'auto',
              options: [
                { label: 'Automatic (light over images, dark on paper)', value: 'auto' },
                { label: 'Always light logo', value: 'light' },
                { label: 'Always dark logo', value: 'dark' },
                { label: 'Brand name as text', value: 'text' },
              ],
              admin: { description: 'Logo files are managed in Site Settings → Branding.' },
            },
            {
              name: 'items',
              label: 'Menu items',
              type: 'array',
              maxRows: 7,
              admin: {
                description: 'Drag to reorder. Keep the menu short — four or five items is ideal.',
                components: { RowLabel: '@/payload/components/admin/RowLabel#LinkRowLabel' },
              },
              fields: [
                linkField({ required: true }),
                {
                  name: 'hidden',
                  label: 'Hide this item',
                  type: 'checkbox',
                },
                {
                  name: 'children',
                  label: 'Dropdown items',
                  type: 'array',
                  maxRows: 8,
                  admin: {
                    initCollapsed: true,
                    components: { RowLabel: '@/payload/components/admin/RowLabel#LinkRowLabel' },
                  },
                  fields: [
                    linkField({ required: true }),
                    { name: 'description', type: 'text' },
                    { name: 'hidden', label: 'Hide this item', type: 'checkbox' },
                  ],
                },
              ],
            },
            {
              name: 'cta',
              label: 'Header button',
              type: 'group',
              fields: [
                { name: 'enabled', label: 'Show header button', type: 'checkbox', defaultValue: true },
                linkField({ name: 'link' }),
              ],
            },
          ],
        },
        {
          name: 'footer',
          label: 'Footer',
          fields: [
            {
              name: 'columns',
              type: 'array',
              maxRows: 4,
              admin: { components: { RowLabel: '@/payload/components/admin/RowLabel#TitleRowLabel' } },
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'links',
                  type: 'array',
                  admin: { components: { RowLabel: '@/payload/components/admin/RowLabel#LinkRowLabel' } },
                  fields: [linkField({ required: true }), { name: 'hidden', label: 'Hide', type: 'checkbox' }],
                },
              ],
            },
            {
              name: 'finalCta',
              label: 'Closing call to action',
              type: 'group',
              fields: [
                { name: 'heading', type: 'textarea', admin: { rows: 2 } },
                linkField({ name: 'link' }),
              ],
            },
          ],
        },
      ],
    },
  ],
}
