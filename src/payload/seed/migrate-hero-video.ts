/**
 * One-off migration: gives the Home hero its aurora video loop, without touching other content.
 *
 *   npm run video:migrate
 *
 * Safety rules:
 * - Files are uploaded only if the media library doesn't already have them (matched by title).
 * - The hero is switched only while it is still the seeded image hero. If an editor has
 *   changed the image or already chosen a video, it is left alone.
 */
import configPromise from '@payload-config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

import type { HeroBlock } from '@/payload-types'

import { MEDIA } from './content'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(dirname, 'assets')
const context = { disableRevalidate: true }
const log = (msg: string) => console.log(`  • ${msg}`)

const KEYS = ['aurora-lake-loop', 'aurora-lake-loop-mobile', 'aurora-lake-poster'] as const
const SEEDED_HERO_IMAGE = 'Aurora over frosted wetland'

async function migrate() {
  const payload = await getPayload({ config: configPromise })
  console.log('Adding the hero video…')

  const existing = await payload.find({ collection: 'media', limit: 500, depth: 0, overrideAccess: true })
  const byTitle = new Map(existing.docs.map((m) => [m.title, m]))
  const ids = {} as Record<(typeof KEYS)[number], number>

  for (const key of KEYS) {
    const item = MEDIA.find((m) => m.key === key)!
    const found = byTitle.get(item.title)
    if (found) {
      ids[key] = found.id
      log(`"${item.title}" already in the media library`)
      continue
    }
    const doc = await payload.create({
      collection: 'media',
      filePath: path.join(ASSETS, item.file),
      data: {
        title: item.title,
        alt: item.alt,
        caption: 'caption' in item ? item.caption : undefined,
        credit: 'credit' in item ? item.credit : undefined,
        license: 'license' in item ? item.license : undefined,
        licenseUrl: 'licenseUrl' in item ? item.licenseUrl : undefined,
        sourceUrl: 'sourceUrl' in item ? item.sourceUrl : undefined,
        category: item.category,
        ...('focalX' in item ? { focalX: item.focalX, focalY: item.focalY } : {}),
      },
      overrideAccess: true,
      context,
    })
    ids[key] = doc.id
    log(`uploaded "${item.title}"`)
  }

  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, depth: 0, limit: 1, overrideAccess: true })
  const home = docs[0]
  const layout = home?.layout ?? []
  const heroIndex = layout.findIndex((b) => b.blockType === 'hero')
  const hero = layout[heroIndex] as HeroBlock | undefined
  const seededImageId = byTitle.get(SEEDED_HERO_IMAGE)?.id

  if (!home || !hero) {
    log('no Home hero found — nothing changed')
  } else if (hero.mediaType === 'video') {
    log('Home hero already uses a video — left as it is')
  } else if (hero.image !== seededImageId) {
    log('Home hero image was changed by an editor — left as it is (choose the video in the admin if you want it)')
  } else {
    const updated = layout.map((b, i) =>
      i === heroIndex
        ? { ...b, mediaType: 'video', image: ids['aurora-lake-poster'], video: ids['aurora-lake-loop'], videoMobile: ids['aurora-lake-loop-mobile'] }
        : b,
    )
    await payload.update({
      collection: 'pages',
      id: home.id,
      draft: false,
      overrideAccess: true,
      context,
      data: { layout: updated as never, _status: 'published' },
    })
    log('Home hero now plays the aurora video')
  }

  for (const dir of ['.next/cache/fetch-cache', '.next/dev/cache/fetch-cache']) {
    fs.rmSync(path.resolve(process.cwd(), dir), { recursive: true, force: true })
  }
  console.log('Done. Restart the site to see the video.')
  process.exit(0)
}

await migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
