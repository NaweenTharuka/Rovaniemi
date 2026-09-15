'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { getPayloadClient } from '@/lib/cms/client'
import { clientKey, rateLimit } from '@/lib/rate-limit'

export type EnquiryField = 'name' | 'email' | 'phone' | 'experience' | 'preferredDate' | 'guests' | 'message' | 'consent'

export type EnquiryState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<EnquiryField, string>>
  values?: Partial<Record<EnquiryField, string>>
}

const today = () => new Date().toISOString().slice(0, 10)

const schema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.').max(120, 'That name is too long.'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(200),
  phone: z
    .string()
    .trim()
    .max(40, 'That number is too long.')
    .regex(/^[+\d\s().-]*$/, 'Use digits, spaces and + only.')
    .optional()
    .or(z.literal('')),
  experience: z.string().trim().min(1, 'Please choose an experience.').max(120),
  preferredDate: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Please choose a valid date.')
    .refine((v) => !v || v >= today(), 'Please choose a date in the future.')
    .optional()
    .or(z.literal('')),
  guests: z.coerce.number().int().min(1, 'Please choose the number of guests.').max(12),
  message: z.string().trim().max(3000, 'Please keep your message under 3,000 characters.').optional().or(z.literal('')),
  consent: z.literal('on', { message: 'Please confirm you agree to the privacy policy.' }),
})

const MIN_FILL_MS = 2500

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const raw = Object.fromEntries(
    ['name', 'email', 'phone', 'experience', 'preferredDate', 'guests', 'message', 'consent'].map((key) => [
      key,
      typeof formData.get(key) === 'string' ? (formData.get(key) as string) : undefined,
    ]),
  ) as Record<EnquiryField, string | undefined>
  const values = Object.fromEntries(Object.entries(raw).filter(([k]) => k !== 'consent')) as EnquiryState['values']

  // Bots: honeypot filled or impossibly fast. Pretend success, store nothing.
  const honeypot = formData.get('company')
  const startedAt = Number(formData.get('startedAt'))
  if ((typeof honeypot === 'string' && honeypot.length > 0) || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
    return { status: 'success' }
  }

  const requestHeaders = await headers()
  const limit = rateLimit(`enquiry:${clientKey(requestHeaders)}`, 5, 10 * 60 * 1000)
  if (!limit.ok) {
    return {
      status: 'error',
      message: 'Too many enquiries from this connection. Please wait a few minutes or email us directly.',
      values,
    }
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const errors: EnquiryState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as EnquiryField
      if (!errors[field]) errors[field] = issue.message
    }
    return { status: 'error', message: 'Please check the highlighted fields.', errors, values }
  }

  const data = parsed.data
  try {
    const payload = await getPayloadClient()
    let experienceId: number | string | undefined
    let experienceLabel = 'Other / general enquiry'

    if (data.experience !== 'other') {
      const { docs } = await payload.find({
        collection: 'experiences',
        where: { slug: { equals: data.experience }, _status: { equals: 'published' } },
        limit: 1,
        depth: 0,
        select: { title: true },
      })
      if (docs[0]) {
        experienceId = docs[0].id
        experienceLabel = docs[0].title
      }
    }

    await payload.create({
      collection: 'contact-submissions',
      overrideAccess: true,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        experience: experienceId as number | undefined,
        experienceLabel,
        preferredDate: data.preferredDate ? new Date(`${data.preferredDate}T12:00:00Z`).toISOString() : undefined,
        guests: data.guests,
        message: data.message || undefined,
        consent: true,
        status: 'new',
        pageUrl: requestHeaders.get('referer')?.slice(0, 500) || undefined,
      },
    })

    return { status: 'success' }
  } catch (error) {
    const payload = await getPayloadClient().catch(() => null)
    payload?.logger.error({ msg: 'Enquiry submission failed', error })
    return {
      status: 'error',
      message: 'Something went wrong on our side. Please try again, or email us directly.',
      values,
    }
  }
}
