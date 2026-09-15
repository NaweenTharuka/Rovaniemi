import { CmsPage, pageMetadata } from '@/lib/render-page'

export const revalidate = 3600

export const generateMetadata = () => pageMetadata('experiences')

export default function ExperiencesPage() {
  return <CmsPage slug="experiences" />
}
