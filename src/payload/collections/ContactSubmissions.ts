import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { admins, editors, nobody } from '../access'

export const ENQUIRY_STATUSES = [
  { label: 'New', value: 'new' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Responded', value: 'responded' },
  { label: 'Closed', value: 'closed' },
] as const

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const notifyTeam: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  try {
    const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
    const to = process.env.ENQUIRY_NOTIFY_EMAIL || settings?.contact?.email
    if (!to) return doc

    const experience =
      typeof doc.experience === 'object' && doc.experience ? doc.experience.title : doc.experienceLabel
    const rows: [string, unknown][] = [
      ['Name', doc.name],
      ['Email', doc.email],
      ['Phone / WhatsApp', doc.phone],
      ['Experience', experience],
      ['Preferred date', doc.preferredDate ? new Date(doc.preferredDate).toDateString() : ''],
      ['Guests', doc.guests],
      ['Message', doc.message],
    ]

    await req.payload.sendEmail({
      to,
      replyTo: doc.email,
      subject: `New enquiry: ${experience || 'General'} — ${doc.name}`,
      html: `<table cellpadding="6">${rows
        .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`)
        .join('')}</table>`,
    })
  } catch (error) {
    req.payload.logger.error({ msg: 'Enquiry notification failed', error })
  }
  return doc
}

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    group: 'Enquiries',
    useAsTitle: 'name',
    defaultColumns: ['name', 'experienceLabel', 'preferredDate', 'guests', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone', 'message'],
    description: 'Messages sent through the website contact form.',
  },
  access: {
    // Submissions are only created by the validated, rate-limited server endpoint.
    create: nobody,
    read: editors,
    update: editors,
    delete: admins,
  },
  defaultSort: '-createdAt',
  hooks: { afterChange: [notifyTeam] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%', readOnly: true } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%', readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', label: 'Phone / WhatsApp', type: 'text', admin: { width: '50%', readOnly: true } },
        {
          name: 'guests',
          type: 'number',
          min: 1,
          max: 50,
          admin: { width: '50%', readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'experience',
          type: 'relationship',
          relationTo: 'experiences',
          admin: { width: '50%', readOnly: true },
        },
        {
          name: 'experienceLabel',
          label: 'Experience (as submitted)',
          type: 'text',
          admin: { width: '50%', readOnly: true },
        },
      ],
    },
    {
      name: 'preferredDate',
      type: 'date',
      admin: { readOnly: true, date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    { name: 'message', type: 'textarea', admin: { readOnly: true } },
    {
      name: 'consent',
      label: 'Privacy consent given',
      type: 'checkbox',
      admin: { readOnly: true },
    },
    { name: 'pageUrl', label: 'Submitted from', type: 'text', admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [...ENQUIRY_STATUSES],
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Private notes for the team.' },
    },
  ],
  timestamps: true,
}
