import 'server-only'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getPayload } from 'payload'

export const getPayloadClient = cache(async () => getPayload({ config: configPromise }))

/** True while an editor is previewing drafts (cookie set by /next/preview). */
export const isDraft = cache(async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
})
