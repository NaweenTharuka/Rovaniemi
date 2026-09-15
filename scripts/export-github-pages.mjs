/**
 * Static preview of the public website for GitHub Pages.
 *
 *   npm run pages:build    → builds into .pages-build/out (open with any static server)
 *   npm run pages:deploy   → builds, then publishes .pages-build/out to the gh-pages branch
 *
 * The preview is generated from the current CMS content in the local database.
 * It is a snapshot: there is no admin, and the enquiry form opens the visitor's
 * email app instead of saving to the CMS. The real application is not modified —
 * everything happens in a throwaway copy of the project.
 *
 * Options (env): PAGES_BASE_PATH (default /<repo name>), PAGES_SITE_URL.
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const work = path.join(root, '.pages-build')
const deploy = process.argv.includes('--deploy')

const run = (cmd, args, opts = {}) => {
  // No shell: paths with spaces (e.g. "Source Code") must reach the process intact.
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (res.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed (exit ${res.status})`)
}
const capture = (cmd, args, cwd = root) =>
  (spawnSync(cmd, args, { cwd, encoding: 'utf8' }).stdout || '').trim()
const step = (msg) => console.log(`\n▸ ${msg}`)

/* ------------------------------------------------------------------ settings */
const remote = capture('git', ['remote', 'get-url', 'origin'])
const repoMatch = remote.match(/github\.com[/:]([^/]+)\/([^/.]+)(\.git)?$/)
if (!repoMatch) throw new Error(`Could not read a GitHub "origin" remote (got "${remote}")`)
const [, owner, repo] = repoMatch
const basePath = process.env.PAGES_BASE_PATH ?? `/${repo}`
const siteUrl = process.env.PAGES_SITE_URL ?? `https://${owner.toLowerCase()}.github.io${basePath}`

const envFile = fs.existsSync(path.join(root, '.env')) ? fs.readFileSync(path.join(root, '.env'), 'utf8') : ''
const envValue = (key) => envFile.match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1]?.trim()
const dbUrl = envValue('DATABASE_URL') || 'file:./heading-north.db'
const dbFile = path.resolve(root, dbUrl.replace(/^file:/, ''))
if (!fs.existsSync(dbFile)) throw new Error(`Database not found at ${dbFile}. Run "npm run seed" first.`)

/* ------------------------------------------------------------------ throwaway copy */
step(`Preparing build copy in ${path.relative(root, work)}/`)
fs.rmSync(work, { recursive: true, force: true })
fs.mkdirSync(work, { recursive: true })
for (const entry of ['src', 'public', 'package.json', 'tsconfig.json', 'next.config.ts', 'postcss.config.mjs']) {
  fs.cpSync(path.join(root, entry), path.join(work, entry), { recursive: true })
}
fs.copyFileSync(dbFile, path.join(work, 'content.db'))

// Server-only parts have no place in a static site.
for (const dir of ['src/app/(payload)', 'src/app/(frontend)/next', 'src/app/(frontend)/journal']) {
  fs.rmSync(path.join(work, dir), { recursive: true, force: true })
}

// No draft mode without a server.
fs.writeFileSync(
  path.join(work, 'src/lib/cms/client.ts'),
  `import 'server-only'

import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

export const getPayloadClient = cache(async () => getPayload({ config: configPromise }))

/** Static export: there is no draft mode. */
export const isDraft = async () => false
`,
)

// Enquiries cannot reach the CMS from a static host: hand them to the visitor's email app.
fs.writeFileSync(
  path.join(work, 'src/lib/actions/contact.ts'),
  `export type EnquiryField = 'name' | 'email' | 'phone' | 'experience' | 'preferredDate' | 'guests' | 'message' | 'consent'

export type EnquiryState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<EnquiryField, string>>
  values?: Partial<Record<EnquiryField, string>>
}

const EMAIL = process.env.NEXT_PUBLIC_ENQUIRY_EMAIL || 'info@headingnorth.fi'

/** Static preview: validates, then opens the visitor's email app with the enquiry filled in. */
export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const get = (key: string) => String(formData.get(key) ?? '').trim()
  const values = {
    name: get('name'), email: get('email'), phone: get('phone'), experience: get('experience'),
    preferredDate: get('preferredDate'), guests: get('guests'), message: get('message'),
  }
  const errors: EnquiryState['errors'] = {}
  if (values.name.length < 2) errors.name = 'Please tell us your name.'
  if (!/^\\S+@\\S+\\.\\S+$/.test(values.email)) errors.email = 'Please enter a valid email address.'
  if (!values.experience) errors.experience = 'Please choose an experience.'
  if (!values.guests) errors.guests = 'Please choose the number of guests.'
  if (formData.get('consent') !== 'on') errors.consent = 'Please confirm you agree to the privacy policy.'
  if (Object.keys(errors).length) return { status: 'error', message: 'Please check the highlighted fields.', errors, values }

  const body = [
    \`Name: \${values.name}\`, \`Email: \${values.email}\`, \`Phone / WhatsApp: \${values.phone || '-'}\`,
    \`Experience: \${values.experience}\`, \`Preferred date: \${values.preferredDate || '-'}\`, \`Guests: \${values.guests}\`,
    '', values.message,
  ].join('\\n')
  window.location.href = \`mailto:\${EMAIL}?subject=\${encodeURIComponent(\`Enquiry: \${values.experience}\`)}&body=\${encodeURIComponent(body)}\`
  return {
    status: 'error',
    message: \`This preview cannot send forms directly, so your email app has opened with the enquiry. If nothing opened, email \${EMAIL}.\`,
    values,
  }
}
`,
)

// Static export: every page is prerendered; no incremental regeneration or unknown slugs.
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]))
const routeFile = /[\\/](page\.tsx|sitemap\.ts|robots\.ts)$/
for (const file of walk(path.join(work, 'src/app')).filter((f) => routeFile.test(f))) {
  let src = fs.readFileSync(file, 'utf8')
    .replace(/^export const revalidate = .*\r?\n/m, '')
    .replace('export const dynamicParams = true', 'export const dynamicParams = false')
  if (!src.includes('export const dynamic ')) {
    // Insert after the import block so the file stays valid.
    const lines = src.split('\n')
    let lastImport = -1
    lines.forEach((line, i) => { if (/^import /.test(line) || (lastImport === i - 1 && /^\s|^}/.test(line) && lastImport >= 0)) lastImport = i })
    lines.splice(lastImport + 1, 0, '', "export const dynamic = 'force-static'")
    src = lines.join('\n')
  }
  fs.writeFileSync(file, src)
}

// Next.js config for a static, sub-path deployment.
const configPath = path.join(work, 'next.config.ts')
fs.writeFileSync(
  configPath,
  fs.readFileSync(configPath, 'utf8').replace(
    'export default withPayload(',
    `// --- static export overrides (generated by scripts/export-github-pages.mjs)
nextConfig.output = 'export'
nextConfig.basePath = ${JSON.stringify(basePath)}
nextConfig.trailingSlash = true
nextConfig.images = { unoptimized: true }
delete nextConfig.redirects
delete nextConfig.headers
nextConfig.turbopack = { root: path.resolve(dirname, '..') }

export default withPayload(`,
  ),
)

/* ------------------------------------------------------------------ build */
const enquiryEmail = (() => {
  const out = capture(process.execPath, ['-e', `
    import('@libsql/client').then(async ({ createClient }) => {
      const c = createClient({ url: 'file:./content.db' })
      const r = await c.execute('select contact_email from site_settings limit 1').catch(() => null)
      console.log(r?.rows?.[0]?.contact_email || '')
    })`], work)
  return out || 'info@headingnorth.fi'
})()

step(`Building static site for ${siteUrl}`)
run(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build'], {
  cwd: work,
  env: {
    ...process.env,
    NODE_OPTIONS: '--no-deprecation --max-old-space-size=8000',
    DATABASE_URL: 'file:./content.db',
    PAYLOAD_SECRET: envValue('PAYLOAD_SECRET') || 'static-export-build',
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SERVER_URL: siteUrl,
    NEXT_PUBLIC_ENQUIRY_EMAIL: enquiryEmail,
  },
})

const out = path.join(work, 'out')
step('Adding uploaded media and GitHub Pages files')
const mediaDir = path.join(root, 'media')
if (fs.existsSync(mediaDir)) fs.cpSync(mediaDir, path.join(out, 'api/media/file'), { recursive: true })
fs.writeFileSync(path.join(out, '.nojekyll'), '') // serve the _next/ folder

// The router prefetches segment data as flat names (about/__next.X.$d$slug.__PAGE__.txt),
// but the export writes them as nested folders. Static hosts can't rewrite, so add flat copies.
for (const file of walk(out)) {
  const rel = path.relative(out, file).split(path.sep)
  const at = rel.findIndex((part) => part.startsWith('__next.'))
  if (at === -1 || at === rel.length - 1) continue
  const flat = path.join(out, ...rel.slice(0, at), rel.slice(at).join('.'))
  if (!fs.existsSync(flat)) fs.copyFileSync(file, flat)
}

/* ------------------------------------------------------------------ deploy */
if (deploy) {
  step('Publishing to the gh-pages branch')
  const git = (...args) => run('git', args, { cwd: out })
  git('init', '-q', '-b', 'gh-pages')
  git('add', '-A')
  git('commit', '-q', '-m', `Publish static preview (${new Date().toISOString().slice(0, 10)})\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>`)
  // gh-pages holds only generated output, so it is replaced on every publish.
  git('push', '-f', remote, 'gh-pages')
  console.log(`\nPublished. Once GitHub Pages serves the gh-pages branch, the preview is at ${siteUrl}/`)
} else {
  console.log(`\nBuilt ${path.relative(root, out)}/ — run "npm run pages:deploy" to publish.`)
}
