'use client'

import { useRowLabel } from '@payloadcms/ui'

const number = (index?: number) => String((index ?? 0) + 1).padStart(2, '0')

export const TextRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ text?: string }>()
  return <span>{data?.text || `Item ${number(rowNumber)}`}</span>
}

export const TitleRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string; label?: string }>()
  return (
    <span>
      {number(rowNumber)} — {data?.title || data?.label || 'Untitled'}
    </span>
  )
}

export const LinkRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ link?: { label?: string }; hidden?: boolean }>()
  return (
    <span>
      {data?.link?.label || `Link ${number(rowNumber)}`}
      {data?.hidden ? ' (hidden)' : ''}
    </span>
  )
}
