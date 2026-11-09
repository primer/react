'use client'

import React from 'react'
import {mergeRefs} from '../../internal/refs'
import {applyDuration, Duration, isDuration, singleUnitRoundingThreshold, unitMilliseconds, type Unit} from './duration'
import {
  formatRelativeTime,
  getPrecision,
  shouldDisplayPreferredAbsoluteTime,
  type Format,
  type FormatStyle,
  type Tense,
} from './format'
import {useFormattingContext} from './useFormattingContext'

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
  /** Hour cycle used for absolute times and titles. Overrides the nearest `hour-cycle` attribute. */
  hourCycle?: Intl.DateTimeFormatOptions['hourCycle']
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
  /**
   * Shows the user's preferred absolute date and time instead of relative or micro output. Durations and elapsed timers
   * are unaffected. Defaults to reading `data-prefers-absolute-time="true"` on the document's `html` or `body` element,
   * and follows live changes to that attribute.
   */
  prefersAbsoluteTime?: boolean
  /** Text placed before an absolute date, such as `on`. */
  prefix?: string
  /** How the seconds are rendered in an absolute date. */
  second?: NumericDatePart
  /** Forces past or future phrasing rather than deriving it from the date. */
  tense?: Tense
  /** Duration past which the output switches from a relative phrase to an absolute date. */
  threshold?: string
  /** IANA time zone the date is presented in. Overrides the nearest `time-zone` attribute. */
  timeZone?: string
  /** How the time zone is named in the output, if at all. */
  timeZoneName?: '' | 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric'
  /** How the weekday is rendered in an absolute date, if at all. */
  weekday?: '' | 'short' | 'long' | 'narrow'
  /** How the year is rendered in an absolute date. */
  year?: NumericDatePart
}

function getDurationBoundaryInterval(distance: number, countingDown: boolean, precision: Unit) {
  const unit = unitMilliseconds[precision]
  const monthRemainder = distance % unitMilliseconds.month
  const remainder = (precision === 'week' ? monthRemainder : distance) % unit
  const unitBoundary = countingDown ? remainder + 1 : unit - remainder
  if (precision !== 'week') return unitBoundary
  const monthBoundary = countingDown ? monthRemainder + 1 : unitMilliseconds.month - monthRemainder
  return Math.min(unitBoundary, monthBoundary)
}

function getRoundedBoundaryInterval(distance: number, countingDown: boolean, precision: Unit) {
  if (distance < unitMilliseconds.minute) return getDurationBoundaryInterval(distance, countingDown, precision)

  const secondOffset = precision === 'second' ? (60 - singleUnitRoundingThreshold.second) * unitMilliseconds.second : 0

  if (distance < unitMilliseconds.hour) {
    if (precision !== 'second' && precision !== 'minute') {
      return getDurationBoundaryInterval(distance, countingDown, precision)
    }
    return getDurationBoundaryInterval(distance + secondOffset, countingDown, 'minute')
  }

  if (precision !== 'second' && precision !== 'minute' && precision !== 'hour') {
    return getDurationBoundaryInterval(distance, countingDown, precision)
  }

  const minuteOffset = precision === 'hour' ? 0 : (60 - singleUnitRoundingThreshold.minute) * unitMilliseconds.minute
  return getDurationBoundaryInterval(distance + minuteOffset + secondOffset, countingDown, 'hour')
}

function getUpdateInterval(
  date: Date,
  now: number,
  format: Format | undefined,
  precision: RelativeTimeProps['precision'],
  threshold: string | undefined,
  tense: Tense | undefined,
) {
  if (format === 'datetime') return null
  const target = date.getTime()
  const distance = Math.abs(now - target)
  const effectivePrecision = getPrecision({format, precision})
  const precisionBoundary = getDurationBoundaryInterval(distance, target > now, effectivePrecision)
  if (format === 'duration' || format === 'elapsed') {
    return Math.min(precisionBoundary, unitMilliseconds.hour)
  }

  let interval = distance < 60_000 ? 1000 : distance < 3_600_000 ? 60_000 : 3_600_000
  interval = Math.min(interval, getRoundedBoundaryInterval(distance, target > now, effectivePrecision))
  // Calendar comparisons can change at elapsed-day and represented 30-day month boundaries.
  interval = Math.min(interval, getDurationBoundaryInterval(distance, target > now, 'day'))
  interval = Math.min(interval, getDurationBoundaryInterval(distance, target > now, 'month'))
  // Calendar-duration comparisons can also change when the reference UTC date changes.
  interval = Math.min(interval, (Math.floor(now / unitMilliseconds.day) + 1) * unitMilliseconds.day - now)
  if (target > now) {
    const boundary = distance >= 3_600_000 ? 3_600_000 : distance >= 60_000 ? 60_000 : 0
    if (boundary) interval = Math.min(interval, distance - boundary + 1)
  }
  if (threshold && isDuration(threshold)) {
    const duration = Duration.from(threshold)
    const fixedDuration = duration.abs()
    const thresholdMilliseconds =
      (((fixedDuration.weeks * 7 + fixedDuration.days) * 24 + fixedDuration.hours) * 60 + fixedDuration.minutes) *
        60_000 +
      fixedDuration.seconds * 1000
    const thresholdTime =
      (((fixedDuration.hours * 60 + fixedDuration.minutes) * 60 + fixedDuration.seconds) * 1000) % unitMilliseconds.day
    const comparisonUnit = format === 'micro' ? unitMilliseconds.second : unitMilliseconds[effectivePrecision]
    // Micro switches after equality; other relative formats switch at equality.
    const thresholdOffset =
      (Math.ceil(thresholdTime / comparisonUnit) * comparisonUnit +
        (format === 'micro' ? unitMilliseconds.second : 0)) %
      unitMilliseconds.day
    if (Number.isFinite(thresholdOffset) && thresholdOffset > 0) {
      interval = Math.min(
        interval,
        getDurationBoundaryInterval(distance + unitMilliseconds.day - thresholdOffset, target > now, 'day'),
      )
    }
    if (duration.sign < 0 && (fixedDuration.years || fixedDuration.months) && thresholdTime > 0) {
      // Negative calendar durations apply the time portion before their months and years.
      const nextReferenceDay =
        (Math.floor((now - thresholdTime) / unitMilliseconds.day) + 1) * unitMilliseconds.day + thresholdTime
      interval = Math.min(interval, nextReferenceDay - now)
    }
    const isFixedThreshold = !duration.years && !duration.months
    if (format === 'micro') {
      const signedDuration =
        target > now
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
      let untilThreshold = applyDuration(date, signedDuration).getTime() - now
      // Below 30 days, elapsedTime has no calendar months and the formatter compares whole seconds.
      if (isFixedThreshold && thresholdMilliseconds < unitMilliseconds.month - unitMilliseconds.second) {
        untilThreshold =
          target > now ? target - now - thresholdMilliseconds - 999 : target - now + thresholdMilliseconds + 1000
      }
      if (untilThreshold > 0) interval = Math.min(interval, untilThreshold)
    } else if (
      isFixedThreshold &&
      thresholdMilliseconds > 0 &&
      thresholdMilliseconds < unitMilliseconds.month &&
      (tense === undefined || tense === 'auto')
    ) {
      const unit = unitMilliseconds[effectivePrecision]
      const thresholdDistance = Math.ceil(thresholdMilliseconds / unit) * unit
      // At a month boundary, calendar-based comparison may no longer follow fixed-duration arithmetic.
      if (thresholdDistance < unitMilliseconds.month) {
        const untilThreshold = target > now ? target - now - thresholdDistance + 1 : target - now + thresholdDistance
        if (untilThreshold > 0) interval = Math.min(interval, untilThreshold)
      }
    }
  }
  return interval
}

function getLocale(language: string | undefined) {
  if (!language) return undefined
  try {
    return new Intl.Locale(language).toString()
  } catch (error) {
    if (error instanceof RangeError) return undefined
    throw error
  }
}

function isHourCycle(value: string | undefined): value is NonNullable<Intl.DateTimeFormatOptions['hourCycle']> {
  return value === 'h11' || value === 'h12' || value === 'h23' || value === 'h24'
}

function getNextTimeZoneDayInterval(now: number, timeZone: string | undefined) {
  const dateFormatter = new Intl.DateTimeFormat('en-US-u-ca-gregory-nu-latn', {
    day: 'numeric',
    era: 'short',
    month: 'numeric',
    timeZone,
    year: 'numeric',
  })
  const clockFormatter = new Intl.DateTimeFormat('en-US-u-nu-latn', {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
    timeZoneName: 'longOffset',
  })
  const offsetAt = (time: number) => {
    const offset = clockFormatter.formatToParts(time).find(part => part.type === 'timeZoneName')?.value
    if (!offset) throw new Error('RelativeTime could not determine the current time zone offset')
    return offset
  }
  const currentDay = dateFormatter.format(now)
  const maximumDate = 8_640_000_000_000_000
  let cursor = now

  while (cursor < maximumDate) {
    const parts = clockFormatter.formatToParts(cursor)
    const clockPart = (type: 'hour' | 'minute' | 'second') => {
      const part = parts.find(value => value.type === type)
      if (!part || !/^\d+$/.test(part.value)) throw new Error(`RelativeTime could not determine the current ${type}`)
      return Number(part.value)
    }
    const offset = parts.find(part => part.type === 'timeZoneName')?.value
    if (!offset) throw new Error('RelativeTime could not determine the current time zone offset')
    const milliseconds = ((cursor % 1000) + 1000) % 1000
    const elapsed = ((clockPart('hour') * 60 + clockPart('minute')) * 60 + clockPart('second')) * 1000 + milliseconds
    const nextMidnight = cursor + 86_400_000 - elapsed
    const limit = Math.min(nextMidnight, maximumDate)
    let probe = cursor

    while (probe < limit) {
      const next = Math.min(probe + 6 * 3_600_000, limit)
      if (offsetAt(next) !== offset) {
        let lower = probe
        let upper = next
        while (upper - lower > 1) {
          const middle = lower + Math.floor((upper - lower) / 2)
          if (offsetAt(middle) === offset) lower = middle
          else upper = middle
        }
        if (dateFormatter.format(upper) !== currentDay) return upper - now
        cursor = upper
        break
      }
      if (next === nextMidnight) {
        if (dateFormatter.format(next) !== currentDay) return next - now
        throw new Error('RelativeTime could not determine the next day boundary')
      }
      probe = next
    }
    if (probe === maximumDate) return null
  }
  return null
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
    hourCycle: hourCycleProp,
    lang,
    minute,
    month,
    noTitle,
    onRelativeTimeUpdated,
    precision,
    prefersAbsoluteTime: prefersAbsoluteTimeProp,
    prefix,
    second,
    tense,
    threshold,
    timeZone: timeZoneProp,
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
  const [element, setElement] = React.useState<HTMLElement | null>(null)
  const context = useFormattingContext(element)
  const language = lang === undefined ? context.language : lang || context.documentLanguage
  const locale = getLocale(language)
  const timeZone = timeZoneProp === undefined ? context.timeZone : timeZoneProp || context.documentTimeZone
  const hourCycleSetting = hourCycleProp ?? context.hourCycle
  const hourCycle = isHourCycle(hourCycleSetting) ? hourCycleSetting : context.defaultHourCycle
  const prefersAbsoluteTime = prefersAbsoluteTimeProp ?? context.prefersAbsoluteTime
  const options = React.useMemo(
    () => ({
      day,
      format,
      formatStyle,
      hour,
      hourCycle,
      locale: locale ?? context.defaultLocale,
      minute,
      month,
      precision,
      prefersAbsoluteTime,
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
      hourCycle,
      locale,
      context.defaultLocale,
      minute,
      month,
      precision,
      prefersAbsoluteTime,
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
  if (value && timeZoneProp) Intl.DateTimeFormat('en', {timeZone: timeZoneProp})
  const initialText = value?.toISOString() ?? ''
  const [currentTime, setCurrentTime] = React.useState<number | null>(null)
  const formatted = value && currentTime !== null ? formatRelativeTime(value, currentTime, options) : null
  const text = value ? (formatted?.text ?? initialText) : ''
  const title = providedTitle ?? (noTitle || !value ? undefined : formatted?.title)
  const previousRender = React.useRef({text, title: title ?? ''})
  const onRelativeTimeUpdatedRef = React.useRef(onRelativeTimeUpdated)
  const composedRef = React.useMemo(() => mergeRefs(ref, setElement), [ref])
  React.useEffect(() => {
    onRelativeTimeUpdatedRef.current = onRelativeTimeUpdated
  }, [onRelativeTimeUpdated])

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler -- Inherited attributes are available after mounting.
    if (!element) return
    if (language && !locale) {
      // eslint-disable-next-line no-console
      console.warn(`RelativeTime: "${language}" is not a valid language tag; using the runtime's default locale.`)
    }
    if (hourCycleSetting && !isHourCycle(hourCycleSetting)) {
      // eslint-disable-next-line no-console
      console.warn(`RelativeTime: "${hourCycleSetting}" is not a valid hour cycle; using the runtime's default.`)
    }
  }, [element, hourCycleSetting, language, locale])

  React.useEffect(() => {
    if (!value || !element) return

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
      const interval = shouldDisplayPreferredAbsoluteTime(options)
        ? getNextTimeZoneDayInterval(now, options.timeZone)
        : getUpdateInterval(value, now, format, precision, threshold, tense)
      if (interval !== null) timer = window.setTimeout(update, Math.max(0, now + interval - Date.now()))
    }

    // eslint-disable-next-line react-you-might-not-need-an-effect/no-external-store-subscription -- The component owns and cleans up this timer.
    update()
    return () => {
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [element, format, noTitle, options, precision, providedTitle, tense, threshold, value])

  return (
    <time
      {...timeProps}
      lang={lang}
      ref={composedRef}
      dateTime={value?.toISOString()}
      title={title}
      data-component="RelativeTime"
    >
      {children ?? text}
    </time>
  )
})

export type {Format, FormatStyle, Tense}
