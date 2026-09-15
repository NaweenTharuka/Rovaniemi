/**
 * One-off migration: replaces the imagery carried over from the previous website
 * with real photography of Finnish Lapland — without touching any other content.
 *
 *   npm run photos:migrate
 *
 * Safety rules:
 * - An image is swapped only where the field still holds the originally seeded image.
 *   Anything an editor has changed since is left alone.
 * - Old images are deleted only when no current document references them.
 */
import configPromise from '@payload-config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

import type { Media } from '@/payload-types'

import { MEDIA } from './content'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(dirname, 'assets')
const context = { disableRevalidate: true }
const log = (msg: string) => console.log(`  • ${msg}`)

/** Titles of the images the first seed imported from the previous website. */
const OLD = {
  hero: 'Aurora over snowy forest',
  ranua: 'Polar bear, Ranua',
  korouoma: 'Korouoma frozen waterfalls',
  levi: 'Snowy fell, Levi',
  group: 'Small group under the aurora',
  guide: 'Guide at sunset',
  van: 'Pickup van',
  reindeer: 'Reindeer and lavvu',
  vehicles: 'Vehicles under the aurora',
  signpost: 'Heading North signpost',
} as const
type OldKey = keyof typeof OLD
type NewKey = (typeof MEDIA)[number]['key']

/** Where each old image lives, and what replaces it there. */
const PAGE_RULES: Record<string, { field: string; old: OldKey; next: NewKey }[]> = {
  home: [
    { field: 'hero.image', old: 'hero', next: 'aurora-frost-landscape' },
    { field: 'chapters.image', old: 'signpost', next: 'rovaniemi-dusk' },
    { field: 'chapters.image', old: 'group', next: 'lantern-frozen-lake' },
    { field: 'cinematicSequence.poster', old: 'hero', next: 'aurora-tall-pines' },
    { field: 'fullBleedImage.image', old: 'vehicles', next: 'winter-road-night' },
    { field: 'cta.backgroundImage', old: 'reindeer', next: 'riisitunturi-crown-snow' },
    { field: 'meta.image', old: 'hero', next: 'aurora-frost-landscape' },
  ],
  experiences: [{ field: 'cta.backgroundImage', old: 'group', next: 'frosty-lakeshore-dusk' }],
  about: [
    { field: 'hero.image', old: 'vehicles', next: 'frosted-pines-sky' },
    { field: 'imageText.image', old: 'group', next: 'reindeer-sled-forest' },
    { field: 'imageText.image', old: 'guide', next: 'wilderness-cabins' },
    { field: 'imageGrid.image', old: 'guide', next: 'wilderness-cabins' },
    { field: 'cta.backgroundImage', old: 'reindeer', next: 'korouoma-snowy-forest' },
  ],
}

const EXPERIENCE_RULES: Record<string, { hero: [OldKey, NewKey]; oldGallery: OldKey[]; gallery: NewKey[] }> = {
  'aurora-hunting': {
    hero: ['hero', 'aurora-frosted-pines'],
    oldGallery: ['group', 'vehicles'],
    gallery: ['aurora-tall-pines', 'aurora-frost-landscape', 'lantern-frozen-lake'],
  },
  'ranua-wildlife-park': {
    hero: ['ranua', 'ranua-polar-bears'],
    oldGallery: [],
    gallery: ['ranua-lynx', 'ranua-wolverine', 'reindeer-sled-forest'],
  },
  'korouoma-frozen-waterfall-adventure': {
    hero: ['korouoma', 'korouoma-blue-icefall'],
    oldGallery: [],
    gallery: ['korouoma-frozen-falls', 'korouoma-ice-wall', 'korouoma-trail', 'korouoma-snowy-forest'],
  },
  'levi-experience': {
    hero: ['levi', 'levi-village-blue-hour'],
    oldGallery: [],
    gallery: ['levi-gondola', 'aurora-over-levi', 'riisitunturi-crown-snow'],
  },
}

const UPLOAD_KEYS = new Set([
  'image', 'backgroundImage', 'poster', 'heroImage', 'heroVideo', 'gallery', 'frames', 'profileImage', 'coverImage',
  'logo', 'logoLight', 'logoDark', 'favicon', 'appleTouchIcon', 'defaultOgImage', 'video', 'images',
])

const idOf = (value: unknown): number | null =>
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

async function migrate() {
  const payload = await getPayload({ config: configPromise })
  console.log('Migrating imagery to real Lapland photography…')

  /* ------------------------------------------------ 1. upload new photos (idempotent) */
  const existing = await payload.find({ collection: 'media', limit: 500, depth: 0, overrideAccess: true })
  const byTitle = new Map(existing.docs.map((m) => [m.title, m]))
  const next = {} as Record<NewKey, number>
  let uploaded = 0

  for (const item of MEDIA) {
    if (item.category === 'brand') continue
    const found = byTitle.get(item.title)
    if (found) {
      next[item.key] = found.id
      continue
    }
    const doc = await payload.create({
      collection: 'media',
      filePath: path.join(ASSETS, item.file),
      data: {
        title: item.title,
        alt: item.alt,
        caption: item.caption,
        credit: item.credit,
        license: item.license,
        licenseUrl: item.licenseUrl,
        sourceUrl: item.sourceUrl,
        category: item.category,
        featured: 'featured' in item ? item.featured : false,
      },
      overrideAccess: true,
      context,
    })
    next[item.key] = doc.id
    uploaded++
  }
  log(`${uploaded} photos uploaded (${Object.keys(next).length - uploaded} already present)`)

  /* ------------------------------------------------ 1b. art direction: focal points keep subjects in every crop */
  let focused = 0
  for (const item of MEDIA) {
    if (!('focalX' in item) || !next[item.key]) continue
    const current = byTitle.get(item.title)
    const untouched = !current || ((current.focalX ?? 50) === 50 && (current.focalY ?? 50) === 50)
    if (!untouched) continue
    await payload.update({
      collection: 'media',
      id: next[item.key],
      data: { focalX: item.focalX, focalY: item.focalY },
      overrideAccess: true,
      context,
    })
    focused++
  }
  log(`${focused} focal points set`)

  const old = {} as Record<OldKey, number | undefined>
  for (const [key, title] of Object.entries(OLD)) old[key as OldKey] = byTitle.get(title)?.id

  /* ------------------------------------------------ 2. pages */
  for (const [slug, rules] of Object.entries(PAGE_RULES)) {
    const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, depth: 0, limit: 1, overrideAccess: true })
    const page = docs[0]
    if (!page) continue
    let changes = 0
    const layout = (page.layout ?? []).map((block) => {
      const b = structuredClone(block) as Record<string, unknown> & { blockType: string }
      for (const rule of rules) {
        const [blockType, field] = rule.field.split('.')
        if (blockType !== b.blockType || !old[rule.old]) continue
        const swap = (holder: Record<string, unknown>) => {
          if (holder[field] === old[rule.old]) {
            holder[field] = next[rule.next]
            changes++
          }
        }
        if (blockType === 'chapters') (b.chapters as Record<string, unknown>[] | undefined)?.forEach(swap)
        else if (blockType === 'imageGrid') (b.items as Record<string, unknown>[] | undefined)?.forEach(swap)
        else swap(b)
      }
      return b
    })
    const meta = { ...(page.meta ?? {}) } as Record<string, unknown>
    for (const rule of rules.filter((r) => r.field === 'meta.image')) {
      if (old[rule.old] && meta.image === old[rule.old]) {
        meta.image = next[rule.next]
        changes++
      }
    }
    if (changes) {
      await payload.update({
        collection: 'pages',
        id: page.id,
        draft: false,
        overrideAccess: true,
        context,
        data: { layout: layout as never, meta: meta as never, _status: 'published' },
      })
    }
    log(`page "${slug}": ${changes} image${changes === 1 ? '' : 's'} replaced`)
  }

  /* ------------------------------------------------ 2b. real night photography needs a lighter hero overlay */
  {
    const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, depth: 0, limit: 1, overrideAccess: true })
    const home = docs[0]
    const layout = home?.layout ?? []
    const heroIndex = layout.findIndex((b) => b.blockType === 'hero')
    const hero = layout[heroIndex] as { overlay?: string } | undefined
    if (home && hero?.overlay === 'medium') {
      const updated = layout.map((b, i) => (i === heroIndex ? { ...b, overlay: 'light' } : b))
      await payload.update({
        collection: 'pages',
        id: home.id,
        draft: false,
        overrideAccess: true,
        context,
        data: { layout: updated as never, _status: 'published' },
      })
      log('home hero overlay lightened')
    }
  }

  /* ------------------------------------------------ 3. experiences */
  for (const [slug, rule] of Object.entries(EXPERIENCE_RULES)) {
    const { docs } = await payload.find({ collection: 'experiences', where: { slug: { equals: slug } }, depth: 0, limit: 1, overrideAccess: true })
    const xp = docs[0]
    if (!xp) continue
    const data: Record<string, unknown> = {}
    const [oldHero, newHero] = rule.hero
    if (old[oldHero] && idOf(xp.heroImage) === old[oldHero]) data.heroImage = next[newHero]
    if (old[oldHero] && idOf(xp.meta?.image) === old[oldHero]) data.meta = { ...xp.meta, image: next[newHero] }

    const currentGallery = (xp.gallery ?? []).map(idOf)
    const seededGallery = rule.oldGallery.map((k) => old[k])
    const untouched =
      currentGallery.length === seededGallery.length && currentGallery.every((id, i) => id === seededGallery[i])
    if (untouched) data.gallery = rule.gallery.map((k) => next[k])

    if (Object.keys(data).length) {
      await payload.update({
        collection: 'experiences',
        id: xp.id,
        draft: false,
        overrideAccess: true,
        context,
        data: { ...data, _status: 'published' },
      })
    }
    log(`experience "${slug}": ${Object.keys(data).join(', ') || 'no changes'}`)
  }

  /* ------------------------------------------------ 4. site settings */
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })
  if (old.hero && idOf(settings.seo?.defaultOgImage) === old.hero) {
    await payload.updateGlobal({
      slug: 'site-settings',
      overrideAccess: true,
      context,
      data: { seo: { ...settings.seo, defaultOgImage: next['aurora-frost-landscape'] } } as never,
    })
    log('default social image replaced')
  }

  /* ------------------------------------------------ 5. remove old images nobody uses */
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

  let removed = 0
  for (const [key, id] of Object.entries(old)) {
    if (!id) continue
    if (refs.has(id)) {
      log(`kept "${OLD[key as OldKey]}" — still used somewhere`)
      continue
    }
    await payload.delete({ collection: 'media', id, overrideAccess: true, context })
    removed++
  }
  log(`${removed} old images removed from the media library`)

  for (const dir of ['.next/cache/fetch-cache', '.next/dev/cache/fetch-cache']) {
    fs.rmSync(path.resolve(process.cwd(), dir), { recursive: true, force: true })
  }
  console.log('Done. Restart the site to see the new photography.')
  process.exit(0)
}

await migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
