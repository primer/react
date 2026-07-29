'use client'

import React from 'react'
import {assignRef} from '../../internal/refs'
import {applyDuration, Duration, isDuration} from './duration'
import {formatRelativeTime, getDateTimeText, type Format, type FormatStyle, type Tense} from './format'

type NumericDatePart = '' | 'numeric' | '2-digit'

export interface RelativeTimeUpdatedEvent extends Event {
  newText: string
  newTitle: string
  oldText: string
  oldTitle: string
}

export interface RelativeTimeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'prefix'> {
  /** Instant being described. */
  date?: Date
  /** Instant being described, as an ISO 8601 string. An alternative to `date`. */
  datetime?: string
  /** How the day of the month is rendered in an absolute date. */
  day?: NumericDatePart
  /** Which formatting scheme to use, such as a relative phrase, an elapsed duration, or a plain date. */
  format?: Format
  /** How verbose the formatted output is. */
  formatStyle?: FormatStyle
  /** How the hour is rendered in an absolute date. */
  hour?: NumericDatePart
  /** How the minutes are rendered in an absolute date. */
  minute?: NumericDatePart
  /** How the month is rendered in an absolute date. */
  month?: NumericDatePart | 'short' | 'long' | 'narrow'
  /** Stops the full date being set as the element's `title`. */
  noTitle?: boolean
  /** Called whenever the rendered text changes as time passes. */
  onRelativeTimeUpdated?: (event: RelativeTimeUpdatedEvent) => void
  /** Smallest unit the output distinguishes, which also sets how often it refreshes. */
  precision?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
  /** Text placed before an absolute date, such as `on`. */
  prefix?: string
  /** How the seconds are rendered in an absolute date. */
  second?: NumericDatePart
  /** Forces past or future phrasing rather than deriving it from the date. */
  tense?: Tense
  /** Duration past which the output switches from a relative phrase to an absolute date. */
  threshold?: string
  /** IANA time zone the date is presented in. */
  timeZone?: string
  /** How the time zone is named in the output, if at all. */
  timeZoneName?: '' | 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric'
  /** How the weekday is rendered in an absolute date, if at all. */
  weekday?: '' | 'short' | 'long' | 'narrow'
  /** How the year is rendered in an absolute date. */
  year?: NumericDatePart
}

function getUpdateInterval(
  date: Date,
  now: number,
  format: Format | undefined,
  precision: RelativeTimeProps['precision'],
  threshold: string | undefined,
) {
  if (format === 'datetime') return null
  if ((format === 'duration' || format === 'elapsed') && precision === 'second') return 1000
  if ((format === 'duration' || format === 'elapsed') && precision === 'minute') return 60_000

  const distance = Math.abs(now - date.getTime())
  let interval = distance < 60_000 ? 1000 : distance < 3_600_000 ? 60_000 : 3_600_000
  if (format === 'micro' && threshold && isDuration(threshold)) {
    const duration = Duration.from(threshold)
    const signedDuration =
      date.getTime() > now
        ? new Duration(
            -duration.years,
            -duration.months,
            -duration.weeks,
            -duration.days,
            -duration.hours,
            -duration.minutes,
            -duration.seconds,
            -duration.milliseconds,
          )
        : duration
    const untilThreshold = applyDuration(date, signedDuration).getTime() - now
    if (untilThreshold > 0) interval = Math.min(interval, untilThreshold)
  }
  return interval
}

export const RelativeTime = React.forwardRef<HTMLElement, RelativeTimeProps>(function RelativeTime(
  {
    children,
    date,
    datetime,
    day,
    format,
    formatStyle,
    hour,
    minute,
    month,
    noTitle,
    onRelativeTimeUpdated,
    precision,
    prefix,
    second,
    tense,
    threshold,
    timeZone,
    timeZoneName,
    title: providedTitle,
    weekday,
    year,
    ...timeProps
  },
  ref,
) {
  const timestamp = datetime ? new Date(datetime).valueOf() : date?.valueOf()
  const isValidDate = timestamp !== undefined && !Number.isNaN(timestamp)
  const value = React.useMemo(() => (isValidDate ? new Date(timestamp) : null), [isValidDate, timestamp])
  const options = React.useMemo(
    () => ({
      day,
      format,
      formatStyle,
      hour,
      minute,
      month,
      precision,
      prefix,
      second,
      tense,
      threshold,
      timeZone,
      timeZoneName,
      weekday,
      year,
    }),
    [
      day,
      format,
      formatStyle,
      hour,
      minute,
      month,
      precision,
      prefix,
      second,
      tense,
      threshold,
      timeZone,
      timeZoneName,
      weekday,
      year,
    ],
  )
  const initialText = value ? getDateTimeText(value, options, 0) : ''
  const [currentTime, setCurrentTime] = React.useState<number | null>(null)
  const formatted = value && currentTime !== null ? formatRelativeTime(value, currentTime, options) : null
  const text = value ? (formatted?.text ?? initialText) : ''
  const title = providedTitle ?? (noTitle || !value ? undefined : formatted?.title)
  const previousRender = React.useRef({text, title: title ?? ''})
  const onRelativeTimeUpdatedRef = React.useRef(onRelativeTimeUpdated)
  // The public ref is HTMLElement, so adapt it to the <time> host element.
  const composedRef = React.useCallback((node: HTMLTimeElement | null) => assignRef(ref, node), [ref])
  React.useEffect(() => {
    onRelativeTimeUpdatedRef.current = onRelativeTimeUpdated
  }, [onRelativeTimeUpdated])

  React.useEffect(() => {
    if (!value) return

    let timer: number | undefined
    const update = () => {
      const now = Date.now()
      const next = formatRelativeTime(value, now, options)
      const nextText = next.text
      const nextTitle = providedTitle ?? (noTitle ? '' : next.title)
      const previous = previousRender.current
      if (nextText !== previous.text || nextTitle !== previous.title) {
        const event = Object.assign(new Event('relative-time-updated', {bubbles: true, composed: true}), {
          oldText: previous.text,
          newText: nextText,
          oldTitle: previous.title,
          newTitle: nextTitle,
        }) as RelativeTimeUpdatedEvent
        onRelativeTimeUpdatedRef.current?.(event)
      }
      previousRender.current = {text: nextText, title: nextTitle}
      setCurrentTime(now)
      const interval = getUpdateInterval(value, now, format, precision, threshold)
      if (interval !== null) timer = window.setTimeout(update, interval)
    }

    // eslint-disable-next-line react-you-might-not-need-an-effect/no-external-store-subscription -- The component owns and cleans up this timer.
    update()
    return () => {
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [format, noTitle, options, precision, providedTitle, threshold, value])

  return (
    <time {...timeProps} ref={composedRef} dateTime={value?.toISOString()} title={title} data-component="RelativeTime">
      {children ?? text}
    </time>
  )
})

export type {Format, FormatStyle, Tense}
