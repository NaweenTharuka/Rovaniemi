import type { Experience } from '@/payload-types'

import { monthRange, priceLabel } from '@/lib/utils'

export type Fact = { key: string; label: string; value: string }

const DIFFICULTY: Record<string, string> = { easy: 'Easy', moderate: 'Moderate', challenging: 'Challenging' }

/** Only facts with real values are returned — empty CMS fields never render as blanks. */
export const experienceFacts = (experience: Partial<Experience>): Fact[] => {
  const facts: (Fact | null)[] = [
    experience.duration ? { key: 'duration', label: 'Duration', value: experience.duration } : null,
    experience.groupSize ? { key: 'group', label: 'Group size', value: experience.groupSize } : null,
    experience.startingPoint ? { key: 'start', label: 'Starting point', value: experience.startingPoint } : null,
    experience.location ? { key: 'location', label: 'Destination', value: experience.location } : null,
    experience.season?.label || experience.season?.months?.length
      ? {
          key: 'season',
          label: 'Season',
          value: [experience.season?.label, monthRange(experience.season?.months)].filter(Boolean).join(' · '),
        }
      : null,
    experience.difficulty ? { key: 'difficulty', label: 'Difficulty', value: DIFFICULTY[experience.difficulty] } : null,
    priceLabel(experience.pricing) ? { key: 'price', label: 'Price', value: priceLabel(experience.pricing)! } : null,
    experience.pickup?.summary ? { key: 'pickup', label: 'Pickup', value: experience.pickup.summary } : null,
  ]
  return facts.filter((f): f is Fact => Boolean(f))
}

/** Compact "3–4 hours · From €79 per person · Maximum 4 guests" line for listings. */
export const summaryFacts = (experience: Partial<Experience>) =>
  [experience.duration, priceLabel(experience.pricing), experience.groupSize].filter(Boolean) as string[]
