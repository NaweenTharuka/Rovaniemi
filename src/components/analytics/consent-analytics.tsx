'use client'

import Script from 'next/script'
import { useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/button'
import { withBasePath } from '@/lib/base-path'

type Ids = { ga: string | null; gtm: string | null; metaPixel: string | null }
type Choice = 'granted' | 'denied' | 'unset' | 'server'

const KEY = 'hn-analytics-consent'
const EVENT = 'hn:consent-change'

/** Consent lives in localStorage; this store keeps every consumer in sync (incl. other tabs). */
const consentStore = {
  subscribe(callback: () => void) {
    window.addEventListener('storage', callback)
    window.addEventListener(EVENT, callback)
    return () => {
      window.removeEventListener('storage', callback)
      window.removeEventListener(EVENT, callback)
    }
  },
  get(): Choice {
    try {
      const value = window.localStorage.getItem(KEY)
      return value === 'granted' || value === 'denied' ? value : 'unset'
    } catch {
      return 'unset'
    }
  },
  set(value: 'granted' | 'denied' | null) {
    try {
      if (value) window.localStorage.setItem(KEY, value)
      else window.localStorage.removeItem(KEY)
    } catch {
      // Storage unavailable (private mode): the banner simply reappears next visit.
    }
    window.dispatchEvent(new Event(EVENT))
  },
}

/** Lets a "Cookie settings" link anywhere on the site reopen the banner. */
export const reopenConsent = () => consentStore.set(null)

/**
 * Loads GA4 / GTM / Meta Pixel only after explicit consent, and only when an ID
 * is configured (Site Settings → Analytics or env). No IDs → no banner, no scripts.
 */
export function ConsentAnalytics({ ids, text, privacyHref }: { ids: Ids; text?: string | null; privacyHref: string }) {
  const choice = useSyncExternalStore(consentStore.subscribe, consentStore.get, (): Choice => 'server')
  const configured = Boolean(ids.ga || ids.gtm || ids.metaPixel)

  if (!configured || choice === 'server') return null

  return (
    <>
      {choice === 'granted' ? (
        <>
          {ids.gtm ? (
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(ids.gtm)});`}
            </Script>
          ) : null}
          {ids.ga ? (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids.ga)}`} strategy="afterInteractive" />
              <Script id="ga4" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(ids.ga)},{anonymize_ip:true});`}
              </Script>
            </>
          ) : null}
          {ids.metaPixel ? (
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(ids.metaPixel)});fbq('track','PageView');`}
            </Script>
          ) : null}
        </>
      ) : null}

      {choice === 'unset' ? (
        <div
          role="region"
          aria-label="Cookie preferences"
          className="tone-ink fixed inset-x-3 bottom-3 z-[70] max-w-xl border border-rule bg-surface p-6 text-fg shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] sm:bottom-6 sm:left-auto sm:right-6"
        >
          <p className="text-sm text-fg-muted">
            {text || 'We use optional analytics cookies to understand how visitors use this site.'}{' '}
            <a href={withBasePath(privacyHref)} className="text-fg underline underline-offset-4">
              Privacy Policy
            </a>
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button size="sm" onClick={() => consentStore.set('granted')}>
              Accept
            </Button>
            <Button size="sm" variant="secondary" onClick={() => consentStore.set('denied')}>
              Decline
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}
