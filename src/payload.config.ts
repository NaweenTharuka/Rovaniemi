import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { ContactSubmissions } from './payload/collections/ContactSubmissions'
import { Experiences } from './payload/collections/Experiences'
import { FAQCategories } from './payload/collections/FAQCategories'
import { FAQs } from './payload/collections/FAQs'
import { Journal } from './payload/collections/Journal'
import { Media } from './payload/collections/Media'
import { Pages } from './payload/collections/Pages'
import { Testimonials } from './payload/collections/Testimonials'
import { Users } from './payload/collections/Users'
import { Navigation } from './payload/globals/Navigation'
import { SiteSettings } from './payload/globals/SiteSettings'
import { pathFor } from './payload/preview'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const secret = process.env.PAYLOAD_SECRET
if (!secret && process.env.NODE_ENV === 'production') {
  throw new Error('PAYLOAD_SECRET must be set in production.')
}

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const databaseURL = process.env.DATABASE_URL || 'file:./heading-north.db'

const db = /^postgres(ql)?:\/\//.test(databaseURL)
  ? postgresAdapter({ pool: { connectionString: databaseURL } })
  : sqliteAdapter({ client: { url: databaseURL } })

const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'no-reply@headingnorth.fi',
      defaultFromName: process.env.SMTP_FROM_NAME || 'HEADING NORTH website',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

export default buildConfig({
  serverURL,
  secret: secret || 'dev-only-insecure-secret-change-me',
  db,
  email,
  sharp,
  editor: lexicalEditor(),
  collections: [Pages, Experiences, FAQs, FAQCategories, Testimonials, Journal, Media, ContactSubmissions, Users],
  globals: [Navigation, SiteSettings],
  folders: { browseByFolder: true },
  graphQL: { disable: true },
  cors: [serverURL],
  csrf: [serverURL],
  upload: {
    limits: { fileSize: 80 * 1024 * 1024 },
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — HEADING NORTH admin',
      robots: 'noindex, nofollow',
    },
    components: {
      beforeDashboard: ['@/payload/components/admin/Dashboard#Dashboard'],
      afterNavLinks: ['@/payload/components/admin/PreviewSiteLink#PreviewSiteLink'],
      graphics: {
        Icon: '@/payload/components/admin/Brand#Icon',
        Logo: '@/payload/components/admin/Brand#Logo',
      },
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Laptop', name: 'laptop', width: 1440, height: 900 },
      ],
    },
  },
  plugins: [
    seoPlugin({
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => {
        const title = (doc as { title?: string })?.title
        return title ? `${title} — HEADING NORTH` : 'HEADING NORTH'
      },
      generateDescription: ({ doc }) =>
        (doc as { shortDescription?: string; excerpt?: string })?.shortDescription ||
        (doc as { excerpt?: string })?.excerpt ||
        '',
      generateImage: ({ doc }) => {
        const d = doc as { heroImage?: unknown; coverImage?: unknown }
        const image = d?.heroImage ?? d?.coverImage
        if (!image) return ''
        return typeof image === 'object' && image !== null && 'id' in image
          ? (image as { id: string | number }).id
          : (image as string | number)
      },
      generateURL: ({ doc, collectionSlug }) => {
        const slug = (doc as { slug?: string })?.slug
        const collection = (collectionSlug ?? 'pages') as 'pages' | 'experiences' | 'journal'
        return `${serverURL}${pathFor(collection, slug)}`
      },
    }),
  ],
})
