import { getPageSlugs } from '@/lib/cms/queries'
import { CmsPage, pageMetadata } from '@/lib/render-page'

export const revalidate = 3600
export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const slugs = await getPageSlugs()
    return slugs.filter((slug) => !['home', 'experiences', 'journal'].includes(slug)).map((slug) => ({ slug }))
  } catch {
    // Database not reachable at build time → pages render on first request instead.
    return []
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return pageMetadata(slug)
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <CmsPage slug={slug} />
}
