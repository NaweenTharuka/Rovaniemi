import { CmsPage, pageMetadata } from '@/lib/render-page'

export const revalidate = 3600

export const generateMetadata = () => pageMetadata('home')

export default function HomePage() {
  return <CmsPage slug="home" />
}
