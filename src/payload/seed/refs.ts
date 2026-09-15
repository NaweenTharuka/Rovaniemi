import type { Payload } from 'payload'

import type { Media } from '@/payload-types'

/** Field names that hold media uploads anywhere in pages, experiences and globals. */
const UPLOAD_KEYS = new Set([
  'image', 'backgroundImage', 'poster', 'heroImage', 'heroVideo', 'gallery', 'frames', 'profileImage', 'coverImage',
  'logo', 'logoLight', 'logoDark', 'favicon', 'appleTouchIcon', 'defaultOgImage', 'video', 'videoMobile', 'images',
])

export const idOf = (value: unknown): number | null =>
  typeof value === 'number' ? value : value && typeof value === 'object' && 'id' in value ? Number((value as Media).id) : null

/** Collects every media id referenced through a known upload field. */
const collectRefs = (node: unknown, refs: Set<number>, key = '') => {
  if (Array.isArray(node)) {
    if (UPLOAD_KEYS.has(key)) node.forEach((v) => { const id = idOf(v); if (id) refs.add(id) })
    else node.forEach((v) => collectRefs(v, refs))
    return
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (UPLOAD_KEYS.has(k) && !Array.isArray(v)) {
        const id = idOf(v)
        if (id) refs.add(id)
      } else collectRefs(v, refs, k)
    }
  }
}

/** Every media id used by published or draft content and by the globals. */
export async function referencedMediaIds(payload: Payload) {
  const refs = new Set<number>()
  for (const collection of ['pages', 'experiences', 'testimonials', 'journal'] as const) {
    const [published, drafts] = await Promise.all([
      payload.find({ collection, depth: 0, limit: 500, overrideAccess: true }),
      payload.find({ collection, depth: 0, limit: 500, overrideAccess: true, draft: true }),
    ])
    ;[...published.docs, ...drafts.docs].forEach((d) => collectRefs(d, refs))
  }
  for (const slug of ['site-settings', 'navigation'] as const) {
    collectRefs(await payload.findGlobal({ slug, depth: 0, overrideAccess: true }), refs)
  }
  return refs
}
