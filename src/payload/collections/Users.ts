import type { CollectionConfig } from 'payload'

import { ROLES, adminFieldAccess, admins, adminsOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    group: 'System',
    // Client-side user objects carry the role; hide the Users screen from non-admins.
    hidden: ({ user }) => (user as { role?: string } | null)?.role !== 'admin',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: admins,
    read: adminsOrSelf,
    update: adminsOrSelf,
    delete: admins,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // The very first account is always an administrator.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: ROLES,
      saveToJWT: true,
      access: { create: adminFieldAccess, update: adminFieldAccess },
      admin: {
        position: 'sidebar',
        description:
          'Admin: everything. Editor: all content, no users or site settings. Author: own drafts only.',
      },
    },
  ],
  timestamps: true,
}
