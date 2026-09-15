/**
 * Seeds the CMS with the content migrated from the previous headingnorth.fi website.
 *
 *   npm run seed        # refuses to run if content already exists
 *   npm run seed:reset  # deletes seeded collections first (never deletes users)
 *
 * Optional: SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD create a first admin account.
 */
import configPromise from '@payload-config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload, type Payload } from 'payload'

import { slugify } from '../fields/slug'
import { EXPERIENCES, FAQ_CATEGORIES, FAQS, MEDIA } from './content'
import { paragraphs } from './lexical'
import { buildPages } from './pages'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(dirname, 'assets')
const context = { disableRevalidate: true }
/** SQLite and Postgres adapters both use numeric ids by default. */
type Id = number

const CONTENT_COLLECTIONS = [
  'contact-submissions',
  'testimonials',
  'faqs',
  'faq-categories',
  'pages',
  'experiences',
  'journal',
  'media',
] as const

const log = (msg: string) => console.log(`  • ${msg}`)

async function reset(payload: Payload) {
  for (const collection of CONTENT_COLLECTIONS) {
    await payload.delete({ collection, where: { id: { exists: true } }, overrideAccess: true, context })
    log(`cleared ${collection}`)
  }
  // Folders created by the media library feature.
  try {
    await payload.delete({ collection: 'payload-folders' as never, where: { id: { exists: true } }, overrideAccess: true, context })
  } catch {
    // folders collection may not exist yet
  }
}

async function seed() {
  const payload = await getPayload({ config: configPromise })
  // `payload run` strips CLI flags, so reset is signalled through the environment.
  const shouldReset = process.env.SEED_RESET === 'true'

  const existing = await payload.count({ collection: 'pages', overrideAccess: true })
  if (existing.totalDocs > 0 && !shouldReset) {
    console.log('Content already exists. Run `npm run seed:reset` to replace seeded content (users are kept).')
    process.exit(0)
  }

  console.log('Seeding HEADING NORTH…')
  if (shouldReset) await reset(payload)

  /* ---------------------------------------------------------------- admin user */
  const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env
  if (SEED_ADMIN_EMAIL && SEED_ADMIN_PASSWORD) {
    const users = await payload.find({ collection: 'users', where: { email: { equals: SEED_ADMIN_EMAIL } }, overrideAccess: true })
    if (!users.docs.length) {
      await payload.create({
        collection: 'users',
        data: { email: SEED_ADMIN_EMAIL, password: SEED_ADMIN_PASSWORD, name: 'Site Admin', role: 'admin' },
        overrideAccess: true,
        context,
      })
      log(`created admin ${SEED_ADMIN_EMAIL}`)
    }
  }

  /* ---------------------------------------------------------------- media */
  const media: Record<string, Id> = {}
  for (const item of MEDIA) {
    const filePath = path.join(ASSETS, item.file)
    if (!fs.existsSync(filePath)) throw new Error(`Missing seed asset ${item.file}`)
    const doc = await payload.create({
      collection: 'media',
      filePath,
      data: {
        title: item.title,
        alt: item.alt,
        caption: 'caption' in item ? item.caption : undefined,
        credit: 'credit' in item ? item.credit : undefined,
        license: 'license' in item ? item.license : undefined,
        licenseUrl: 'licenseUrl' in item ? item.licenseUrl : undefined,
        sourceUrl: 'sourceUrl' in item ? item.sourceUrl : undefined,
        category: item.category,
        featured: 'featured' in item ? item.featured : false,
        ...('focalX' in item ? { focalX: item.focalX, focalY: item.focalY } : {}),
      },
      overrideAccess: true,
      context,
    })
    media[item.key] = doc.id
  }
  log(`${MEDIA.length} media files (with responsive sizes)`)

  /* ---------------------------------------------------------------- experiences */
  const experiences: Record<string, Id> = {}
  for (const xp of EXPERIENCES) {
    const doc = await payload.create({
      collection: 'experiences',
      draft: false,
      overrideAccess: true,
      context,
      data: {
        _status: 'published',
        workflowStatus: 'published',
        title: xp.title,
        slug: xp.slug,
        shortTitle: xp.shortTitle,
        eyebrow: xp.eyebrow,
        categories: xp.categories,
        tagline: xp.tagline,
        shortDescription: xp.shortDescription,
        description: xp.description,
        heroImage: media[xp.hero],
        gallery: xp.gallery.map((k) => media[k]),
        duration: 'duration' in xp ? xp.duration : undefined,
        groupSize: xp.groupSize,
        difficulty: 'difficulty' in xp ? (xp.difficulty as 'challenging') : undefined,
        startingPoint: xp.startingPoint,
        location: 'location' in xp ? xp.location : undefined,
        pricing: xp.pricing as never,
        options: ('options' in xp ? xp.options : []) as never,
        highlights: xp.highlights,
        included: xp.included,
        notIncluded: 'notIncluded' in xp ? xp.notIncluded : [],
        whatToBring: 'whatToBring' in xp ? xp.whatToBring : [],
        pickup: xp.pickup,
        notices: xp.notices as never,
        booking: xp.booking,
        featured: xp.featured,
        meta: { ...xp.meta, image: media[xp.hero] },
      },
    })
    experiences[xp.slug] = doc.id
  }
  log(`${EXPERIENCES.length} experiences`)

  /* ---------------------------------------------------------------- faqs */
  const categories: Record<string, Id> = {}
  for (const title of FAQ_CATEGORIES) {
    const doc = await payload.create({ collection: 'faq-categories', data: { title, slug: slugify(title) }, overrideAccess: true, context })
    categories[title] = doc.id
  }
  for (const faq of FAQS) {
    await payload.create({
      collection: 'faqs',
      draft: false,
      overrideAccess: true,
      context,
      data: {
        _status: 'published',
        workflowStatus: 'published',
        question: faq.question,
        slug: faq.slug ?? slugify(faq.question),
        answer: paragraphs(...faq.answer),
        category: categories[faq.category],
        experiences: faq.experiences.map((s) => experiences[s]),
        featured: Boolean(faq.featured),
      },
    })
  }
  log(`${FAQ_CATEGORIES.length} FAQ categories, ${FAQS.length} FAQs`)

  /* ---------------------------------------------------------------- testimonials */
  // No reviews existed on the previous site. One unpublished example explains the fields.
  await payload.create({
    collection: 'testimonials',
    draft: true,
    overrideAccess: true,
    context,
    data: {
      _status: 'draft',
      workflowStatus: 'draft',
      customerName: 'PLACEHOLDER — example only',
      customerLocation: 'City, Country',
      headline: 'Example headline — replace with a short quote from a real guest.',
      quote:
        'PLACEHOLDER. This unpublished example shows the available fields. Replace it with genuine guest feedback (with the guest’s permission), link the experience, then publish. Never publish invented reviews.',
      experience: experiences['aurora-hunting'],
      featured: true,
    },
  })
  log('1 unpublished example testimonial (placeholder)')

  /* ---------------------------------------------------------------- pages (two passes for cross-links) */
  const pages: Record<string, Id> = {}
  const placeholderRefs = { media, experiences, pages }
  const drafts = buildPages(placeholderRefs)

  // Pass 1: create every page with an empty layout so all IDs exist.
  for (const page of drafts) {
    const doc = await payload.create({
      collection: 'pages',
      draft: false,
      overrideAccess: true,
      context,
      data: { _status: 'published', workflowStatus: 'published', title: page.title, slug: page.slug, layout: [] },
    })
    pages[page.slug] = doc.id
  }

  // Pass 2: fill layouts now that references resolve.
  for (const page of buildPages({ media, experiences, pages })) {
    await payload.update({
      collection: 'pages',
      id: pages[page.slug],
      draft: false,
      overrideAccess: true,
      context,
      data: {
        _status: 'published',
        workflowStatus: 'published',
        template: 'template' in page ? (page.template as 'legal') : 'default',
        breadcrumbLabel: 'breadcrumbLabel' in page ? page.breadcrumbLabel : undefined,
        layout: page.layout as never,
        meta: page.meta as never,
      },
    })
  }
  log(`${drafts.length} pages`)

  /* ---------------------------------------------------------------- navigation */
  const ref = (relationTo: 'pages' | 'experiences', value: Id, label: string) => ({
    link: { type: 'reference' as const, reference: { relationTo, value }, label },
  })

  await payload.updateGlobal({
    slug: 'navigation',
    overrideAccess: true,
    context,
    data: {
      header: {
        logoVariant: 'text',
        items: [
          {
            ...ref('pages', pages.experiences, 'Experiences'),
            children: EXPERIENCES.map((xp) => ({
              ...ref('experiences', experiences[xp.slug], xp.title),
              description: [('duration' in xp ? xp.duration : null), xp.pricing.displayLabel ?? `From €${xp.pricing.fromPrice}/person`]
                .filter(Boolean)
                .join(' · '),
            })),
          },
          ref('pages', pages.about, 'About'),
          ref('pages', pages.faq, 'FAQ'),
          ref('pages', pages.contact, 'Contact'),
        ],
        cta: { enabled: true, link: { type: 'custom', url: '/contact', label: 'Book now' } },
      },
      footer: {
        columns: [
          { title: 'Experiences', links: EXPERIENCES.map((xp) => ref('experiences', experiences[xp.slug], xp.shortTitle)) },
          {
            title: 'Company',
            links: [ref('pages', pages.about, 'About'), ref('pages', pages.faq, 'FAQ'), ref('pages', pages.contact, 'Contact')],
          },
          {
            title: 'Legal',
            links: [
              ref('pages', pages.terms, 'Terms'),
              ref('pages', pages.cancellation, 'Cancellation'),
              ref('pages', pages.privacy, 'Privacy'),
            ],
          },
        ],
        finalCta: { heading: 'Go north.', link: { type: 'reference', reference: { relationTo: 'pages', value: pages.contact }, label: 'Plan your journey' } },
      },
    } as never,
  })
  log('navigation')

  /* ---------------------------------------------------------------- site settings */
  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    context,
    data: {
      branding: {
        brandName: 'HEADING NORTH',
        tagline: 'Experience Lapland Beyond the Ordinary',
        logo: media.logo,
        favicon: media.favicon,
        appleTouchIcon: media.favicon,
      },
      theme: { primary: '#0B1016', secondary: '#A9B6C0', accent: '#9BE7C4', background: '#F2F0EA', text: '#0B1016' },
      contact: {
        email: 'info@headingnorth.fi',
        whatsapp: '+358 44 246 2427',
        location: 'Rovaniemi, Finland',
        businessId: '3536358-1',
        mapQuery: 'Rovaniemi, Finland',
        pickupSummary:
          'Complimentary pickup and drop-off are available from selected locations in Rovaniemi. Pickup outside our complimentary area may be available for an additional fee, depending on the location.',
        socialLinks: [],
      },
      booking: {
        bookLabel: 'Book now',
        bookUrl: '/contact',
        enquiryLabel: 'Send an inquiry',
        enquiryUrl: '/contact',
        contactLabel: 'Contact us',
        whatsappLabel: 'Message on WhatsApp',
        mobileBookingBar: true,
      },
      seo: {
        siteUrl: 'https://headingnorth.fi',
        defaultTitle: 'HEADING NORTH — Small-group Lapland experiences from Rovaniemi',
        titleTemplate: '%s — HEADING NORTH',
        defaultDescription:
          'Discover personal small-group Lapland tours from Rovaniemi with HEADING NORTH. Aurora hunting, Ranua, Korouoma and Levi experiences for up to 4 guests.',
        defaultOgImage: media['aurora-frost-landscape'],
        noIndexSite: false,
      },
      footer: {
        statement: 'Experience Finnish Lapland differently.',
        copyright: '© {year} HEADING NORTH',
      },
    } as never,
  })
  log('site settings')

  // The seed runs outside Next.js and cannot revalidate cache tags, so drop the data cache instead.
  for (const dir of ['.next/cache/fetch-cache', '.next/dev/cache/fetch-cache']) {
    fs.rmSync(path.resolve(process.cwd(), dir), { recursive: true, force: true })
  }
  log('cleared Next.js data cache (restart a running dev server)')

  console.log('Done. Start the site with `npm run dev` and open /admin.')
  process.exit(0)
}

// Top-level await: the Payload CLI imports this module and exits when the import settles.
await seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
