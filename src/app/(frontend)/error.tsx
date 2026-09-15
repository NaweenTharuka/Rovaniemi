'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { Arrow, Button, buttonVariants } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/primitives'

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="tone-snow flex min-h-[80svh] items-end bg-surface pb-[var(--hn-section)] pt-[calc(var(--hn-header)+4rem)] text-fg">
      <div className="container-hn">
        <SectionLabel className="mb-10">Something went wrong</SectionLabel>
        <h1 className="max-w-4xl text-display-lg">A whiteout on our side.</h1>
        <p className="mt-8 max-w-xl text-lead text-fg-muted">
          This page could not be loaded. Please try again — if it keeps happening, contact us directly.
        </p>
        {error.digest ? <p className="label mt-6 text-fg-subtle">Reference {error.digest}</p> : null}
        <div className="mt-12 flex flex-wrap items-center gap-8">
          <Button size="lg" onClick={reset}>
            Try again
            <Arrow />
          </Button>
          <Link href="/contact" className={buttonVariants({ variant: 'link' })}>
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
