import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/** Teach tailwind-merge the custom type scale, otherwise `text-display-lg text-fg` would drop the size. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display-2xl', 'display-xl', 'display-lg', 'display-md', 'title', 'lead', 'body', 'label'] }],
    },
  },
})

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const pad = (n: number, length = 2) => String(n).padStart(length, '0')

const euro = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export const formatEuro = (value?: number | null) =>
  typeof value === 'number' ? euro.format(value) : null

export const priceUnitLabel = (unit?: string | null) => (unit === 'group' ? 'per group' : 'per person')

/** "From €79 per person", honouring an editor override. */
export const priceLabel = (pricing?: {
  fromPrice?: number | null
  unit?: string | null
  displayLabel?: string | null
} | null) => {
  if (!pricing) return null
  if (pricing.displayLabel) return pricing.displayLabel
  const amount = formatEuro(pricing.fromPrice)
  return amount ? `From ${amount} ${priceUnitLabel(pricing.unit)}` : null
}

export const isObject = <T>(value: T | string | number | null | undefined): value is T =>
  typeof value === 'object' && value !== null

/** Headings come from textareas; editors control line breaks. */
export const splitLines = (text?: string | null) =>
  (text ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

export const whatsappHref = (number?: string | null, message?: string) => {
  if (!number) return null
  const digits = number.replace(/[^\d]/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export const MONTH_NAMES: Record<string, string> = {
  jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June',
  jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December',
}

const MONTH_ORDER = Object.keys(MONTH_NAMES)

/** Collapses ["nov","dec","jan"] into "November – January". */
export const monthRange = (months?: string[] | null) => {
  if (!months?.length) return null
  const sorted = [...months].sort((a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b))
  if (sorted.length === 12) return 'Year-round'
  // Handle ranges wrapping the new year (e.g. Aug–Apr).
  let start = 0
  for (let i = 0; i < sorted.length; i++) {
    const prev = MONTH_ORDER.indexOf(sorted[(i - 1 + sorted.length) % sorted.length])
    const curr = MONTH_ORDER.indexOf(sorted[i])
    if ((prev + 1) % 12 !== curr) {
      start = i
      break
    }
  }
  const ordered = [...sorted.slice(start), ...sorted.slice(0, start)]
  const contiguous = ordered.every(
    (m, i) => i === 0 || (MONTH_ORDER.indexOf(ordered[i - 1]) + 1) % 12 === MONTH_ORDER.indexOf(m),
  )
  if (contiguous && ordered.length > 1) {
    return `${MONTH_NAMES[ordered[0]]} – ${MONTH_NAMES[ordered[ordered.length - 1]]}`
  }
  return ordered.map((m) => MONTH_NAMES[m]).join(', ')
}
