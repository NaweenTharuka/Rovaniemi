'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useActionState, useEffect, useRef } from 'react'

import { Arrow, Button } from '@/components/ui/button'
import { FieldError, Input, Label, Select, Textarea } from '@/components/ui/form-controls'
import { type EnquiryField, type EnquiryState, submitEnquiry } from '@/lib/actions/contact'
import { cn } from '@/lib/utils'

type Option = { value: string; label: string }

const initial: EnquiryState = { status: 'idle' }

export function ContactForm({
  experiences,
  heading,
  submitLabel,
  successMessage,
  privacyHref,
  maxGuests = 4,
}: {
  experiences: Option[]
  heading?: string | null
  submitLabel?: string | null
  successMessage?: string | null
  privacyHref: string
  maxGuests?: number
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)
  const params = useSearchParams()
  const form = useRef<HTMLFormElement>(null)
  const status = useRef<HTMLDivElement>(null)
  const startedAt = useRef<HTMLInputElement>(null)

  const preselected = params.get('experience') ?? ''
  const option = params.get('option')
  const preselectedValid = experiences.some((e) => e.value === preselected) ? preselected : ''

  useEffect(() => {
    // Time-to-submit check for bots; written to the DOM so it never differs between server and client render.
    if (startedAt.current) startedAt.current.value = String(Date.now())
  }, [])

  useEffect(() => {
    if (state.status === 'error' && state.errors) {
      const first = Object.keys(state.errors)[0]
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
    } else if (state.status !== 'idle') {
      status.current?.focus()
    }
  }, [state])

  if (state.status === 'success') {
    return (
      <div ref={status} tabIndex={-1} role="status" className="border-t border-rule pt-10 outline-none">
        <p className="label text-signal">Enquiry sent</p>
        <p className="mt-6 font-display text-display-md text-fg">{successMessage || 'Thank you.'}</p>
      </div>
    )
  }

  const err = (field: EnquiryField) => state.errors?.[field]
  const value = (field: EnquiryField) => state.values?.[field]
  const describedBy = (field: EnquiryField) => (err(field) ? `${field}-error` : undefined)
  const today = new Date().toISOString().slice(0, 10)

  return (
    <form ref={form} action={action} noValidate className="grid gap-y-9" aria-describedby={state.message ? 'form-status' : undefined}>
      {heading ? <h2 className="font-display text-title text-fg">{heading}</h2> : null}

      {state.message ? (
        <div ref={status} id="form-status" tabIndex={-1} role="alert" className="border-l-2 border-danger pl-4 text-fg outline-none">
          {state.message}
        </div>
      ) : null}

      {/* Spam protection: humans never see or fill this. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />

      <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" autoComplete="name" required defaultValue={value('name')} aria-invalid={Boolean(err('name'))} aria-describedby={describedBy('name')} />
          <FieldError id="name-error" message={err('name')} />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={value('email')} aria-invalid={Boolean(err('email'))} aria-describedby={describedBy('email')} />
          <FieldError id="email-error" message={err('email')} />
        </div>
      </div>

      <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Mobile / WhatsApp</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={value('phone')} aria-invalid={Boolean(err('phone'))} aria-describedby={describedBy('phone')} />
          <FieldError id="phone-error" message={err('phone')} />
        </div>
        <div>
          <Label htmlFor="experience">Experience *</Label>
          <Select
            id="experience"
            name="experience"
            required
            defaultValue={value('experience') ?? preselectedValid}
            aria-invalid={Boolean(err('experience'))}
            aria-describedby={describedBy('experience')}
          >
            <option value="" disabled>
              Choose an experience
            </option>
            {experiences.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
            <option value="other">Other / general enquiry</option>
          </Select>
          <FieldError id="experience-error" message={err('experience')} />
        </div>
      </div>

      <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
        <div>
          <Label htmlFor="preferredDate">Preferred date</Label>
          <Input id="preferredDate" name="preferredDate" type="date" min={today} defaultValue={value('preferredDate')} aria-invalid={Boolean(err('preferredDate'))} aria-describedby={describedBy('preferredDate')} />
          <FieldError id="preferredDate-error" message={err('preferredDate')} />
        </div>
        <div>
          <Label htmlFor="guests">Number of guests *</Label>
          <Select id="guests" name="guests" required defaultValue={value('guests') ?? ''} aria-invalid={Boolean(err('guests'))} aria-describedby={describedBy('guests')}>
            <option value="" disabled>
              Choose
            </option>
            {Array.from({ length: maxGuests }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'guest' : 'guests'}
              </option>
            ))}
          </Select>
          <FieldError id="guests-error" message={err('guests')} />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={value('message') ?? (option ? `I'm interested in: ${option}\n\n` : undefined)}
          placeholder="Accommodation for pickup, questions, special requests…"
          aria-invalid={Boolean(err('message'))}
          aria-describedby={describedBy('message')}
        />
        <FieldError id="message-error" message={err('message')} />
      </div>

      <div>
        <div className="flex items-start gap-4">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 size-5 shrink-0 cursor-pointer accent-[var(--fg)]"
            aria-invalid={Boolean(err('consent'))}
            aria-describedby={describedBy('consent')}
          />
          <label htmlFor="consent" className="text-sm text-fg-muted">
            I agree that HEADING NORTH may use the information provided in this form to respond to my inquiry. I have read and agree to the{' '}
            <Link href={privacyHref} className="text-fg underline underline-offset-4">
              Privacy Policy
            </Link>
            . *
          </label>
        </div>
        <FieldError id="consent-error" message={err('consent')} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-rule pt-8">
        <p className="text-xs text-fg-muted">* Required</p>
        <Button type="submit" size="lg" disabled={pending} aria-disabled={pending} className={cn(pending && 'opacity-70')}>
          {pending ? 'Sending…' : submitLabel || 'Send enquiry'}
          <Arrow />
        </Button>
      </div>
    </form>
  )
}
