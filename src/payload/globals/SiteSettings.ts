import type { GlobalConfig } from 'payload'

import { admins, anyone } from '../access'
import { hexColor } from '../fields/list'
import { TAGS, revalidateGlobal } from '../hooks/revalidate'

const colorField = (name: string, label: string, defaultValue: string, description: string) => ({
  name,
  label,
  type: 'text' as const,
  defaultValue,
  validate: hexColor,
  admin: { width: '50%', description },
})

export const SOCIAL_PLATFORMS = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'TripAdvisor', value: 'tripadvisor' },
  { label: 'Google Business', value: 'google' },
  { label: 'X', value: 'x' },
  { label: 'LinkedIn', value: 'linkedin' },
] as const

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Site',
    description: 'Brand, theme, contact details, SEO defaults and analytics. Admins only.',
  },
  access: { read: anyone, update: admins },
  versions: { max: 25 },
  hooks: { afterChange: [revalidateGlobal(TAGS.settings, TAGS.navigation, TAGS.pages, TAGS.experiences)] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'branding',
          label: 'Branding',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'brandName', type: 'text', required: true, defaultValue: 'HEADING NORTH', admin: { width: '50%' } },
                { name: 'tagline', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'logo', label: 'Primary logo', type: 'upload', relationTo: 'media', admin: { width: '33%' } },
                { name: 'logoLight', label: 'Light logo (for dark backgrounds)', type: 'upload', relationTo: 'media', admin: { width: '33%' } },
                { name: 'logoDark', label: 'Dark logo (for light backgrounds)', type: 'upload', relationTo: 'media', admin: { width: '33%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'favicon', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Square PNG/SVG, at least 512×512.' } },
                { name: 'appleTouchIcon', type: 'upload', relationTo: 'media', admin: { width: '50%', description: '180×180 PNG.' } },
              ],
            },
          ],
        },
        {
          name: 'theme',
          label: 'Theme',
          description: 'Colours are applied site-wide. Keep strong contrast between background and text.',
          fields: [
            {
              type: 'row',
              fields: [
                colorField('primary', 'Primary (polar night)', '#0B1016', 'Dark surfaces, primary buttons.'),
                colorField('secondary', 'Secondary (frost)', '#A9B6C0', 'Secondary text on dark surfaces.'),
              ],
            },
            {
              type: 'row',
              fields: [
                colorField('accent', 'Accent (aurora)', '#9BE7C4', 'Signals on dark surfaces only.'),
                colorField('background', 'Background (snow)', '#F2F0EA', 'Light surfaces.'),
              ],
            },
            {
              type: 'row',
              fields: [colorField('text', 'Text', '#0B1016', 'Body text on light surfaces.')],
            },
          ],
        },
        {
          name: 'contact',
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', admin: { width: '50%' } },
                { name: 'whatsapp', label: 'WhatsApp number', type: 'text', admin: { width: '50%', placeholder: '+358 44 246 2427' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', label: 'Phone (calls)', type: 'text', admin: { width: '50%', description: 'Leave empty if phone calls are not offered.' } },
                { name: 'location', type: 'text', admin: { width: '50%', placeholder: 'Rovaniemi, Finland' } },
              ],
            },
            { name: 'address', label: 'Street address', type: 'textarea', admin: { rows: 2 } },
            {
              type: 'row',
              fields: [
                { name: 'businessId', label: 'Business ID', type: 'text', admin: { width: '50%' } },
                {
                  name: 'googleMapsUrl',
                  label: 'Google Maps link',
                  type: 'text',
                  admin: { width: '50%' },
                  validate: (v: unknown) => !v || /^https:\/\//.test(String(v)) || 'Must be an https URL.',
                },
              ],
            },
            {
              name: 'mapQuery',
              label: 'Map location',
              type: 'text',
              admin: { description: 'Place shown in the contact map, e.g. "Rovaniemi, Finland".' },
            },
            {
              name: 'pickupSummary',
              type: 'textarea',
              admin: { description: 'Site-wide pickup explanation used on the contact page and in the footer.' },
            },
            {
              name: 'socialLinks',
              type: 'array',
              admin: { description: 'Shown in the footer and contact page. Hidden when empty.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'platform', type: 'select', required: true, options: [...SOCIAL_PLATFORMS], admin: { width: '40%' } },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: { width: '60%' },
                      validate: (v: unknown) => !v || /^https:\/\//.test(String(v)) || 'Must be an https URL.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'booking',
          label: 'Booking',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'bookLabel', label: 'Booking button label', type: 'text', defaultValue: 'Book now', admin: { width: '50%' } },
                {
                  name: 'bookUrl',
                  label: 'Default booking URL',
                  type: 'text',
                  defaultValue: '/contact',
                  admin: { width: '50%', description: 'Site path or external booking system. Experiences can override it.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'enquiryLabel', label: 'Enquiry label', type: 'text', defaultValue: 'Send an enquiry', admin: { width: '50%' } },
                { name: 'enquiryUrl', label: 'Enquiry URL', type: 'text', defaultValue: '/contact', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'contactLabel', label: 'Contact label', type: 'text', defaultValue: 'Contact us', admin: { width: '50%' } },
                { name: 'whatsappLabel', label: 'WhatsApp label', type: 'text', defaultValue: 'Message on WhatsApp', admin: { width: '50%' } },
              ],
            },
            {
              name: 'mobileBookingBar',
              label: 'Show sticky booking bar on experience pages (mobile)',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            {
              name: 'siteUrl',
              type: 'text',
              admin: { description: 'Production URL, e.g. https://headingnorth.fi. NEXT_PUBLIC_SERVER_URL overrides this.' },
              validate: (v: unknown) => !v || /^https?:\/\/[^/]+$/.test(String(v)) || 'Absolute URL without trailing slash.',
            },
            {
              type: 'row',
              fields: [
                { name: 'defaultTitle', type: 'text', admin: { width: '50%' } },
                {
                  name: 'titleTemplate',
                  type: 'text',
                  defaultValue: '%s — HEADING NORTH',
                  admin: { width: '50%', description: '%s is replaced by the page title.' },
                },
              ],
            },
            { name: 'defaultDescription', type: 'textarea' },
            { name: 'defaultOgImage', label: 'Default social image', type: 'upload', relationTo: 'media' },
            {
              type: 'row',
              fields: [
                { name: 'googleVerification', label: 'Google Search Console verification code', type: 'text', admin: { width: '50%' } },
                { name: 'noIndexSite', label: 'Hide entire site from search engines (staging)', type: 'checkbox', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          name: 'analytics',
          label: 'Analytics',
          description:
            'Tracking loads only after a visitor accepts the cookie notice. Environment variables override these values.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'gaMeasurementId',
                  label: 'Google Analytics 4 ID',
                  type: 'text',
                  admin: { width: '33%', placeholder: 'G-XXXXXXX' },
                  validate: (v: unknown) => !v || /^G-[A-Z0-9]+$/.test(String(v)) || 'Format: G-XXXXXXX',
                },
                {
                  name: 'gtmId',
                  label: 'Google Tag Manager ID',
                  type: 'text',
                  admin: { width: '33%', placeholder: 'GTM-XXXXXX' },
                  validate: (v: unknown) => !v || /^GTM-[A-Z0-9]+$/.test(String(v)) || 'Format: GTM-XXXXXX',
                },
                {
                  name: 'metaPixelId',
                  label: 'Meta Pixel ID',
                  type: 'text',
                  admin: { width: '33%' },
                  validate: (v: unknown) => !v || /^\d{6,20}$/.test(String(v)) || 'Digits only.',
                },
              ],
            },
            {
              name: 'consentText',
              type: 'textarea',
              defaultValue:
                'We use optional analytics cookies to understand how visitors use this site. You can accept or decline.',
            },
          ],
        },
        {
          name: 'footer',
          label: 'Footer',
          fields: [
            { name: 'statement', type: 'textarea', admin: { rows: 2, placeholder: 'Experience Finnish Lapland differently.' } },
            { name: 'copyright', type: 'text', admin: { description: '{year} is replaced with the current year.' } },
          ],
        },
      ],
    },
  ],
}
