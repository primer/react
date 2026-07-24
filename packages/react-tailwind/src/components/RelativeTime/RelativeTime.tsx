import React from 'react'

export interface RelativeTimeProps extends React.ComponentPropsWithoutRef<'time'> {
  date?: Date
  datetime?: string
  noTitle?: boolean
}
const localeOptions: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric', year: 'numeric'}

function formatRelativeTime(value: Date, now: number) {
  const seconds = Math.round((value.valueOf() - now) / 1000)
  const absoluteSeconds = Math.abs(seconds)
  const formatter = new Intl.RelativeTimeFormat('en', {numeric: 'auto'})

  if (absoluteSeconds < 60) return formatter.format(0, 'second')
  if (absoluteSeconds < 60 * 60) return formatter.format(Math.round(seconds / 60), 'minute')
  if (absoluteSeconds < 24 * 60 * 60) return formatter.format(Math.round(seconds / (60 * 60)), 'hour')
  if (absoluteSeconds < 7 * 24 * 60 * 60) return formatter.format(Math.round(seconds / (24 * 60 * 60)), 'day')
  if (absoluteSeconds < 28 * 24 * 60 * 60) return formatter.format(Math.round(seconds / (7 * 24 * 60 * 60)), 'week')
  if (absoluteSeconds < 8 * 7 * 24 * 60 * 60)
    return formatter.format(Math.round(seconds / (28 * 24 * 60 * 60)), 'month')

  const includeYear = value.getFullYear() !== new Date(now).getFullYear()
  return `on ${value.toLocaleDateString('en', {
    day: 'numeric',
    month: 'short',
    year: includeYear ? 'numeric' : undefined,
  })}`
}

export const RelativeTime = React.forwardRef<HTMLTimeElement, RelativeTimeProps>(function RelativeTime(
  {children, date, datetime, noTitle = false, title, ...rest},
  ref,
) {
  const value = datetime ? new Date(datetime) : date
  const dateTime = datetime ?? value?.toISOString()
  const fallback = value && !Number.isNaN(value.valueOf()) ? value.toLocaleDateString('en', localeOptions) : ''
  const content = value && !Number.isNaN(value.valueOf()) ? formatRelativeTime(value, Date.now()) : fallback
  return (
    <time
      {...rest}
      ref={ref}
      data-component="RelativeTime"
      dateTime={dateTime}
      title={noTitle ? undefined : (title ?? fallback)}
    >
      {children ?? content}
    </time>
  )
})
