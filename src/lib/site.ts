import type { SiteSetting } from '@/payload-types'

export const siteOrigin = (settings?: SiteSetting | null) =>
  (process.env.NEXT_PUBLIC_SERVER_URL || settings?.seo?.siteUrl || 'http://localhost:3000').replace(/\/$/, '')

export const brandName = (settings?: SiteSetting | null) => settings?.branding?.brandName || 'HEADING NORTH'

/** CSS custom properties injected on <html> from Site Settings → Theme. */
export const themeStyle = (settings?: SiteSetting | null): Record<string, string> => {
  const theme = settings?.theme
  const safe = (value: string | null | undefined, fallback: string) =>
    value && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value) ? value : fallback
  return {
    '--hn-ink': safe(theme?.primary, '#0B1016'),
    '--hn-frost': safe(theme?.secondary, '#A9B6C0'),
    '--hn-aurora': safe(theme?.accent, '#9BE7C4'),
    '--hn-snow': safe(theme?.background, '#F2F0EA'),
    '--hn-text': safe(theme?.text, '#0B1016'),
  }
}

export const analyticsIds = (settings?: SiteSetting | null) => ({
  ga: process.env.NEXT_PUBLIC_GA_ID || settings?.analytics?.gaMeasurementId || null,
  gtm: process.env.NEXT_PUBLIC_GTM_ID || settings?.analytics?.gtmId || null,
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || settings?.analytics?.metaPixelId || null,
})
