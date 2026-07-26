'use client'

import '@github/relative-time-element'
import type {Format, FormatStyle, RelativeTimeUpdatedEvent, Tense} from '@github/relative-time-element'
import React from 'react'
import {assignRef} from '../../internal/refs'

type NumericDatePart = '' | 'numeric' | '2-digit'

export interface RelativeTimeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'prefix'> {
  date?: Date
  datetime?: string
  day?: NumericDatePart
  format?: Format
  formatStyle?: FormatStyle
  hour?: NumericDatePart
  minute?: NumericDatePart
  month?: NumericDatePart | 'short' | 'long' | 'narrow'
  noTitle?: boolean
  onRelativeTimeUpdated?: (event: RelativeTimeUpdatedEvent) => void
  precision?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
  prefix?: string
  second?: NumericDatePart
  tense?: Tense
  threshold?: string
  timeZone?: string
  timeZoneName?: '' | 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric'
  weekday?: '' | 'short' | 'long' | 'narrow'
  year?: NumericDatePart
}

const localeOptions: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric', year: 'numeric'}
type RelativeTimeElementProps = React.HTMLAttributes<HTMLElement> & {
  datetime?: string
  'format-style'?: FormatStyle
  'no-title'?: string
  'time-zone'?: string
  'time-zone-name'?: RelativeTimeProps['timeZoneName']
}
const RelativeTimeElement = 'relative-time' as unknown as React.ForwardRefExoticComponent<
  RelativeTimeElementProps & React.RefAttributes<HTMLElement>
>

export const RelativeTime = React.forwardRef<HTMLElement, RelativeTimeProps>(function RelativeTime(
  {children, date, datetime, formatStyle, noTitle, onRelativeTimeUpdated, timeZone, timeZoneName, ...props},
  ref,
) {
  const value = datetime ? new Date(datetime) : date
  const isValidDate = value && !Number.isNaN(value.valueOf())
  const [element, setElement] = React.useState<HTMLElement | null>(null)
  const composedRef = React.useCallback(
    (node: HTMLElement | null) => {
      setElement(node)
      assignRef(ref, node)
    },
    [ref],
  )
  React.useEffect(() => {
    if (!element || !onRelativeTimeUpdated) return

    const handleUpdate = (event: Event) => {
      onRelativeTimeUpdated(event as RelativeTimeUpdatedEvent)
    }
    element.addEventListener('relative-time-updated', handleUpdate)
    return () => element.removeEventListener('relative-time-updated', handleUpdate)
  }, [element, onRelativeTimeUpdated])

  return (
    <RelativeTimeElement
      {...props}
      ref={composedRef}
      datetime={isValidDate ? value.toISOString() : undefined}
      format-style={formatStyle}
      no-title={noTitle ? '' : undefined}
      time-zone={timeZone}
      time-zone-name={timeZoneName}
      data-component="RelativeTime"
    >
      {children ?? (isValidDate ? value.toLocaleDateString('en', localeOptions) : '')}
    </RelativeTimeElement>
  )
})
