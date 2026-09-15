import type { CollectionBeforeChangeHook, Field } from 'payload'

export const WORKFLOW_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'In review', value: 'review' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
] as const

export type WorkflowStatus = (typeof WORKFLOW_OPTIONS)[number]['value']

/**
 * Editorial workflow layered on top of Payload drafts.
 * Payload's `_status` controls what is live; `workflowStatus` communicates intent
 * (review requests, archiving) and archived documents are excluded from the site.
 */
export const editorialFields = (): Field[] => [
  {
    name: 'workflowStatus',
    label: 'Workflow',
    type: 'select',
    defaultValue: 'draft',
    options: [...WORKFLOW_OPTIONS],
    index: true,
    admin: {
      position: 'sidebar',
      description:
        'Draft → In review → Published. "Archived" keeps the document but hides it from the website.',
    },
  },
  {
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    access: { update: () => false },
    admin: { position: 'sidebar', readOnly: true, condition: (data) => Boolean(data?.createdBy) },
  },
]

export const syncEditorialState: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (operation === 'create' && req.user && !data.createdBy) {
    data.createdBy = req.user.id
  }

  const publishing = data._status === 'published'
  if (publishing && data.workflowStatus !== 'archived') {
    data.workflowStatus = 'published'
  }
  if (!publishing && data.workflowStatus === 'published') {
    // A new working draft of a live document is, by definition, back in draft.
    data.workflowStatus = 'draft'
  }
  return data
}

export const publishedAtField = (): Field => ({
  name: 'publishedAt',
  type: 'date',
  admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
  hooks: {
    beforeChange: [
      ({ siblingData, value }) => {
        if (siblingData._status === 'published' && !value) return new Date()
        return value
      },
    ],
  },
})

export const draftVersions = {
  drafts: {
    autosave: { interval: 1500 },
    schedulePublish: true,
  },
  maxPerDoc: 50,
} as const
