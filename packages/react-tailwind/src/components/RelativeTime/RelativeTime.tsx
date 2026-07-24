import React from 'react'

export interface RelativeTimeProps extends React.ComponentPropsWithoutRef<'time'> {
  date?: Date
  datetime?: string
  noTitle?: boolean
}
const localeOptions: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric', year: 'numeric'}
export const RelativeTime = React.forwardRef<HTMLTimeElement, RelativeTimeProps>(function RelativeTime(
  {children, date, datetime, noTitle = false, title, ...rest},
  ref,
) {
  const value = datetime ? new Date(datetime) : date
  const dateTime = datetime ?? value?.toISOString()
  const fallback = value && !Number.isNaN(value.valueOf()) ? value.toLocaleDateString('en', localeOptions) : ''
  return (
    <time
      {...rest}
      ref={ref}
      data-component="RelativeTime"
      dateTime={dateTime}
      title={noTitle ? undefined : (title ?? fallback)}
    >
      {children ?? fallback}
    </time>
  )
})
