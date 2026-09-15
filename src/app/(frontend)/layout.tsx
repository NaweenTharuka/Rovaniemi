import type { Metadata, Viewport } from 'next'
import { Inter, Schibsted_Grotesk } from 'next/font/google'
import type { ReactNode } from 'react'

import '@/styles/globals.css'

import { ConsentAnalytics } from '@/components/analytics/consent-analytics'
import { MotionProvider } from '@/components/animations/motion-provider'
import { Footer } from '@/components/navigation/footer'
import { Header } from '@/components/navigation/header'
import { DraftBanner } from '@/components/navigation/draft-banner'
import { LazyLivePreviewListener } from '@/components/navigation/live-preview-lazy'
import { isDraft } from '@/lib/cms/client'
import { getNavigation, getSettings } from '@/lib/cms/queries'
import { mediaUrl } from '@/lib/media'
import { buildHeaderData } from '@/lib/navigation'
import { analyticsIds, brandName, siteOrigin, themeStyle } from '@/lib/site'
import { organizationJsonLd, serializeJsonLd } from '@/lib/structured-data'

// Variable fonts (one file per family), latin subset only: covers English and Finnish (ä, ö).
const display = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-display-family',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body-family',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const favicon = mediaUrl(settings.branding?.favicon, 480)
  const apple = mediaUrl(settings.branding?.appleTouchIcon, 480)
  return {
    metadataBase: new URL(siteOrigin(settings)),
    title: { default: settings.seo?.defaultTitle || brandName(settings), template: settings.seo?.titleTemplate || `%s — ${brandName(settings)}` },
    description: settings.seo?.defaultDescription || undefined,
    applicationName: brandName(settings),
    icons: {
      icon: favicon ? [{ url: favicon }] : undefined,
      apple: apple ? [{ url: apple }] : undefined,
    },
    verification: settings.seo?.googleVerification ? { google: settings.seo.googleVerification } : undefined,
    robots: settings.seo?.noIndexSite ? { index: false, follow: false } : undefined,
    formatDetection: { telephone: false },
  }
}

export const viewport: Viewport = {
  themeColor: '#0B1016',
  width: 'device-width',
  initialScale: 1,
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const [settings, navigation, draft] = await Promise.all([getSettings(), getNavigation(), isDraft()])
  const header = buildHeaderData(navigation, settings)

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      style={themeStyle(settings) as React.CSSProperties}
      suppressHydrationWarning
    >
      <head>
        {/* Enables JS-only hidden states (reveals, pinned layouts) before first paint — no flash, no CLS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd(settings)) }}
        />
      </head>
      <body className="min-h-screen bg-snow">
        <a
          href="#main"
          className="label fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 text-snow transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Header data={header} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer navigation={navigation} settings={settings} />
        </MotionProvider>
        <ConsentAnalytics ids={analyticsIds(settings)} text={settings.analytics?.consentText} privacyHref="/privacy" />
        {draft ? (
          <>
            <LazyLivePreviewListener serverURL={siteOrigin(settings)} />
            <DraftBanner />
          </>
        ) : null}
      </body>
    </html>
  )
}
