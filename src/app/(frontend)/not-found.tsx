import Link from 'next/link'

import { Arrow, buttonVariants } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/primitives'

export default function NotFound() {
  return (
    <section className="tone-ink grain flex min-h-[100svh] items-end bg-surface pb-[var(--hn-section)] pt-[calc(var(--hn-header)+4rem)] text-fg">
      <div className="container-hn relative z-10">
        <SectionLabel index="404" className="mb-10">
          Off the map
        </SectionLabel>
        <h1 className="max-w-5xl text-display-xl">This trail doesn’t lead anywhere.</h1>
        <p className="mt-8 max-w-xl text-lead text-fg-muted">
          The page may have moved when the site was renewed. Start again from the experiences or get in touch.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-8">
          <Link href="/experiences" className={buttonVariants({ size: 'lg' })}>
            Explore experiences
            <Arrow />
          </Link>
          <Link href="/" className={buttonVariants({ variant: 'link' })}>
            Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}
