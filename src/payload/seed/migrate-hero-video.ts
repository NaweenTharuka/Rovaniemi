/**
 * One-off migration: gives the Home hero its Lapland winter video loop, without touching other content.
 *
 *   npm run video:migrate
 *
 * Safety rules:
 * - Files are uploaded only if the media library doesn't already have them (matched by title).
 * - The hero is switched only while it still shows the seeded image or the earlier seeded
 *   aurora video. If an editor has chosen something else, it is left alone.
 * - Earlier seeded video files are deleted only when nothing references them any more.
 */
import configPromise from '@payload-config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

import type { HeroBlock } from '@/payload-types'

import { MEDIA } from './content'
import { idOf, referencedMediaIds } from './refs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(dirname, 'assets')
const context = { disableRevalidate: true }
const log = (msg: string) => console.log(`  • ${msg}`)

const KEYS = ['lapland-winter-loop', 'lapland-winter-loop-mobile', 'lapland-winter-poster'] as const
const SEEDED_HERO_IMAGE = 'Aurora over frosted wetland'
/** The first hero video (replaced because it lacked winter scenery). */
const PREVIOUS_VIDEO = ['Aurora over a lake (video loop)', 'Aurora over a lake (video loop, mobile)', 'Aurora over a lake (video poster)']

async function migrate() {
  const payload = await getPayload({ config: configPromise })
  console.log('Setting the hero video…')

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
        description: 'description' in item ? item.description : undefined,
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
  const seededImage = byTitle.get(SEEDED_HERO_IMAGE)?.id
  const previousVideo = byTitle.get(PREVIOUS_VIDEO[0])?.id

  const stillSeededImage = hero?.mediaType !== 'video' && idOf(hero?.image) === seededImage
  const stillPreviousVideo = hero?.mediaType === 'video' && previousVideo !== undefined && idOf(hero?.video) === previousVideo
  const alreadyNew = hero?.mediaType === 'video' && idOf(hero?.video) === ids['lapland-winter-loop']

  if (!home || !hero) {
    log('no Home hero found — nothing changed')
  } else if (alreadyNew) {
    log('Home hero already plays the Lapland winter video')
  } else if (!stillSeededImage && !stillPreviousVideo) {
    log('Home hero was changed by an editor — left as it is (choose the video in the admin if you want it)')
  } else {
    const updated = layout.map((b, i) =>
      i === heroIndex
        ? {
            ...b,
            mediaType: 'video',
            image: ids['lapland-winter-poster'],
            video: ids['lapland-winter-loop'],
            videoMobile: ids['lapland-winter-loop-mobile'],
            // Sunlit snow is much brighter than night footage: keep the headline legible.
            overlay: 'medium',
          }
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
    log('Home hero now plays the Lapland winter video')
  }

  const refs = await referencedMediaIds(payload)
  for (const title of PREVIOUS_VIDEO) {
    const doc = byTitle.get(title)
    if (!doc) continue
    if (refs.has(doc.id)) {
      log(`kept "${title}" — still used somewhere`)
      continue
    }
    await payload.delete({ collection: 'media', id: doc.id, overrideAccess: true, context })
    log(`removed "${title}" from the media library`)
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
