import type { ServerProps } from 'payload'

import './dashboard.scss'

type Stat = { label: string; value: number; href: string; hint?: string }

const relative = (iso?: string | null) => {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 60) return `${Math.max(minutes, 1)} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 48) return `${hours} h ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Editorial overview rendered above the default collection cards.
 * Runs on the server with the signed-in user's permissions.
 */
export const Dashboard = async ({ payload, user }: ServerProps) => {
  if (!user) return null
  const role = (user as { role?: string }).role
  const canSeeEnquiries = role === 'admin' || role === 'editor'

  const count = async (collection: Parameters<typeof payload.count>[0]['collection'], where = {}) => {
    try {
      const { totalDocs } = await payload.count({ collection, where, user, overrideAccess: false })
      return totalDocs
    } catch {
      return 0
    }
  }

  const [
    experiences,
    publishedExperiences,
    draftExperiences,
    testimonials,
    faqs,
    media,
    featuredExperiences,
    featuredTestimonials,
    newEnquiries,
    allEnquiries,
  ] = await Promise.all([
    count('experiences'),
    count('experiences', { _status: { equals: 'published' } }),
    count('experiences', { _status: { equals: 'draft' } }),
    count('testimonials'),
    count('faqs'),
    count('media'),
    count('experiences', { featured: { equals: true } }),
    count('testimonials', { featured: { equals: true } }),
    canSeeEnquiries ? count('contact-submissions', { status: { equals: 'new' } }) : Promise.resolve(0),
    canSeeEnquiries ? count('contact-submissions') : Promise.resolve(0),
  ])

  const [recentExperience, recentTestimonial, recentEnquiry] = await Promise.all([
    payload
      .find({ collection: 'experiences', sort: '-updatedAt', limit: 1, depth: 0, draft: true, user, overrideAccess: false })
      .then((r) => r.docs[0])
      .catch(() => undefined),
    payload
      .find({ collection: 'testimonials', sort: '-createdAt', limit: 1, depth: 0, draft: true, user, overrideAccess: false })
      .then((r) => r.docs[0])
      .catch(() => undefined),
    canSeeEnquiries
      ? payload
          .find({ collection: 'contact-submissions', sort: '-createdAt', limit: 1, depth: 0, user, overrideAccess: false })
          .then((r) => r.docs[0])
          .catch(() => undefined)
      : Promise.resolve(undefined),
  ])

  const stats: Stat[] = [
    { label: 'Experiences', value: experiences, href: '/admin/collections/experiences' },
    { label: 'Published', value: publishedExperiences, href: '/admin/collections/experiences?where[_status][equals]=published' },
    { label: 'Drafts', value: draftExperiences, href: '/admin/collections/experiences?where[_status][equals]=draft' },
    { label: 'Testimonials', value: testimonials, href: '/admin/collections/testimonials' },
    { label: 'FAQs', value: faqs, href: '/admin/collections/faqs' },
    { label: 'Media assets', value: media, href: '/admin/collections/media' },
    {
      label: 'Featured',
      value: featuredExperiences + featuredTestimonials,
      href: '/admin/collections/experiences?where[featured][equals]=true',
      hint: `${featuredExperiences} experiences · ${featuredTestimonials} testimonials`,
    },
  ]
  if (canSeeEnquiries) {
    stats.splice(0, 0, {
      label: 'New enquiries',
      value: newEnquiries,
      href: '/admin/collections/contact-submissions?where[status][equals]=new',
      hint: `${allEnquiries} total`,
    })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  return (
    <section className="hn-dashboard" aria-label="Website overview">
      <header className="hn-dashboard__header">
        <div>
          <p className="hn-dashboard__eyebrow">Heading North · Content overview</p>
          <h1 className="hn-dashboard__title">Good to see you, {(user as { name?: string }).name?.split(' ')[0] || 'there'}.</h1>
        </div>
        <a className="hn-dashboard__preview" href={`${siteUrl}/`} target="_blank" rel="noreferrer">
          Preview website ↗
        </a>
      </header>

      <ul className="hn-dashboard__stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <a href={stat.href} className={stat.label === 'New enquiries' && stat.value > 0 ? 'is-alert' : undefined}>
              <span className="hn-dashboard__value">{stat.value}</span>
              <span className="hn-dashboard__label">{stat.label}</span>
              {stat.hint ? <span className="hn-dashboard__hint">{stat.hint}</span> : null}
            </a>
          </li>
        ))}
      </ul>

      <div className="hn-dashboard__activity">
        <h2>Recent activity</h2>
        <ul>
          <li>
            <span>Recently updated experience</span>
            {recentExperience ? (
              <a href={`/admin/collections/experiences/${recentExperience.id}`}>
                {recentExperience.title} <em>{relative(recentExperience.updatedAt)}</em>
              </a>
            ) : (
              <em>None yet</em>
            )}
          </li>
          <li>
            <span>Recently added testimonial</span>
            {recentTestimonial ? (
              <a href={`/admin/collections/testimonials/${recentTestimonial.id}`}>
                {recentTestimonial.customerName} <em>{relative(recentTestimonial.createdAt)}</em>
              </a>
            ) : (
              <em>None yet</em>
            )}
          </li>
          {canSeeEnquiries ? (
            <li>
              <span>Recent enquiry</span>
              {recentEnquiry ? (
                <a href={`/admin/collections/contact-submissions/${recentEnquiry.id}`}>
                  {recentEnquiry.name} · {recentEnquiry.experienceLabel || 'General'}{' '}
                  <em>{relative(recentEnquiry.createdAt)}</em>
                </a>
              ) : (
                <em>None yet</em>
              )}
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  )
}
