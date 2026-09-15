import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

/**
 * Enables draft mode for editors. Requires BOTH the shared preview secret and a
 * signed-in Payload user, so a leaked preview URL alone never exposes drafts.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
  const path = url.searchParams.get('path') || '/'

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview token', { status: 401 })
  }
  // Only same-site relative paths — never an open redirect.
  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('Invalid path', { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('Sign in to the admin to preview drafts', { status: 403 })
  }

  ;(await draftMode()).enable()
  redirect(path)
}
