import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  ;(await draftMode()).disable()
  const referer = request.headers.get('referer')
  let path = '/'
  if (referer) {
    try {
      const ref = new URL(referer)
      if (ref.host === new URL(request.url).host) path = ref.pathname
    } catch {
      path = '/'
    }
  }
  redirect(path)
}
